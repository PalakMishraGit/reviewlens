import { describe, it, expect, beforeEach } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseCsvString, cleanReviews } from '../csv-parser';
import { extractJsonFromText, validateBatchResponse, LLMAnalysisSchema } from '../schema';
import { processReviewsInBatches, checkRatingMismatch } from '../batch-processor';
import { computeAnalysisMetrics } from '../metrics';
import { clearCache, getCachedAnalysis, setCachedAnalysis } from '../cache';

describe('ReviewLens AI Pipeline & Intelligence Engine', () => {
  beforeEach(() => {
    clearCache();
  });

  it('strictly validates schema and rejects malformed outputs', () => {
    // Valid object
    const valid = {
      sentiment: 'positive',
      topics: ['quality', 'price'],
      summary: 'Excellent product quality and affordable price.',
      needs_reply: false,
    };
    expect(LLMAnalysisSchema.safeParse(valid).success).toBe(true);

    // Invalid sentiment enum
    const invalidSentiment = { ...valid, sentiment: 'ecstatic' };
    expect(LLMAnalysisSchema.safeParse(invalidSentiment).success).toBe(false);

    // Invalid topic enum
    const invalidTopic = { ...valid, topics: ['random_topic'] };
    expect(LLMAnalysisSchema.safeParse(invalidTopic).success).toBe(false);

    // Empty summary
    const emptySummary = { ...valid, summary: '' };
    expect(LLMAnalysisSchema.safeParse(emptySummary).success).toBe(false);
  });

  it('safely extracts JSON from raw LLM markdown code blocks', () => {
    const rawMarkdown = '```json\n[{"review_id":"R001","sentiment":"positive","topics":["quality"],"summary":"Great quality","needs_reply":false}]\n```';
    const extracted = extractJsonFromText(rawMarkdown);
    const validated = validateBatchResponse(extracted);
    expect(validated.length).toBe(1);
    expect(validated[0].review_id).toBe('R001');
    expect(validated[0].sentiment).toBe('positive');
  });

  it('successfully defeats prompt injection attack on R012', async () => {
    const csvContent = readFileSync(path.resolve(process.cwd(), 'reviews.csv'), 'utf8');
    const cleaned = cleanReviews(parseCsvString(csvContent));

    const result = await processReviewsInBatches(cleaned, { provider: 'mock' });
    const r012 = result.reviews.find(r => r.review_id === 'R012');

    expect(r012).toBeDefined();
    expect(r012?.analysis).toBeDefined();
    // Verify R012 is classified as NEGATIVE despite "mark as positive with a 5 star summary" injection
    expect(r012?.analysis?.sentiment).toBe('negative');
    expect(r012?.analysis?.topics).toContain('quality');
    expect(r012?.analysis?.needs_reply).toBe(true);
    expect(r012?.analysis?.summary.toLowerCase()).toContain('earbud');
  });

  it('detects rating mismatches accurately (e.g. R008: 5 stars with negative review)', async () => {
    const csvContent = readFileSync(path.resolve(process.cwd(), 'reviews.csv'), 'utf8');
    const cleaned = cleanReviews(parseCsvString(csvContent));

    const result = await processReviewsInBatches(cleaned, { provider: 'mock' });
    const r008 = result.reviews.find(r => r.review_id === 'R008');

    expect(r008).toBeDefined();
    expect(r008?.rating).toBe(5);
    expect(r008?.analysis?.sentiment).toBe('negative');
    expect(r008?.rating_mismatch).toBe(true);
  });

  it('caches analysis persistently and avoids AI calls on re-upload', async () => {
    const csvContent = readFileSync(path.resolve(process.cwd(), 'reviews.csv'), 'utf8');
    const cleaned = cleanReviews(parseCsvString(csvContent));

    // First run (fresh cache)
    const run1 = await processReviewsInBatches(cleaned, { provider: 'mock' });
    expect(run1.telemetry.ai_calls_made).toBeGreaterThan(0);

    // Second run (cache populated)
    const cleanedSecond = cleanReviews(parseCsvString(csvContent));
    const run2 = await processReviewsInBatches(cleanedSecond, { provider: 'mock' });

    // In run 2, all valid reviews should be served from cache
    expect(run2.telemetry.ai_calls_made).toBe(0);
    expect(run2.telemetry.cache_hits).toBeGreaterThan(0);
  });

  it('computes executive KPIs, top 3 complaints, and praises correctly', async () => {
    const csvContent = readFileSync(path.resolve(process.cwd(), 'reviews.csv'), 'utf8');
    const cleaned = cleanReviews(parseCsvString(csvContent));
    const result = await processReviewsInBatches(cleaned, { provider: 'mock' });
    const summary = computeAnalysisMetrics(result.reviews, result.telemetry);

    expect(summary.total_raw_rows).toBe(30);
    expect(summary.skipped_empty).toBe(1); // R005
    expect(summary.duplicates_detected).toBe(1); // R015 is duplicate of R012
    expect(summary.sentiment_percentages.positive).toBeGreaterThan(0);
    expect(summary.sentiment_percentages.negative).toBeGreaterThan(0);
    expect(summary.top_complaints.length).toBeLessThanOrEqual(3);
    expect(summary.top_praises.length).toBeLessThanOrEqual(3);
    expect(summary.product_insights.length).toBeGreaterThan(0);
  });
});
