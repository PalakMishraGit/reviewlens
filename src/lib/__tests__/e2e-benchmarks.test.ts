import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseCsvString, cleanReviews } from '../csv-parser';
import { processReviewsInBatches } from '../batch-processor';
import { computeAnalysisMetrics } from '../metrics';

describe('End-to-End Benchmark Verification on official reviews.csv', () => {
  it('passes all 10 core and edge case requirements simultaneously', async () => {
    const csvContent = readFileSync(path.resolve(process.cwd(), 'reviews.csv'), 'utf8');
    const rawRows = parseCsvString(csvContent);
    expect(rawRows.length).toBe(30);

    const cleaned = cleanReviews(rawRows);
    expect(cleaned.length).toBe(30);

    const { reviews, telemetry } = await processReviewsInBatches(cleaned, { provider: 'mock' });
    const summary = computeAnalysisMetrics(reviews, telemetry);

    // 1. Data Cleaning: Empty review R005
    const r005 = reviews.find(r => r.review_id === 'R005');
    expect(r005?.is_empty).toBe(true);
    expect(r005?.analysis_status).toBe('skipped_empty');

    // 2. Data Cleaning: Missing rating R010
    const r010 = reviews.find(r => r.review_id === 'R010');
    expect(r010?.rating).toBeNull();
    expect(r010?.analysis_status).toBe('success');

    // 3. Data Cleaning: Word rating "five" in R022
    const r022 = reviews.find(r => r.review_id === 'R022');
    expect(r022?.rating).toBe(5);

    // 4. Data Cleaning: Duplicate detection R015 is duplicate of R012
    const r012 = reviews.find(r => r.review_id === 'R012');
    const r015 = reviews.find(r => r.review_id === 'R015');
    expect(r012?.is_duplicate).toBe(false);
    expect(r015?.is_duplicate).toBe(true);
    expect(r015?.duplicate_of).toBe('R012');

    // 5. Prompt Injection Resistance on R012 & R015
    expect(r012?.analysis?.sentiment).toBe('negative');
    expect(r012?.analysis?.needs_reply).toBe(true);
    expect(r015?.analysis?.sentiment).toBe('negative');

    // 6. Rating Mismatch Detection on R008 (5 stars, negative text)
    const r008 = reviews.find(r => r.review_id === 'R008');
    expect(r008?.rating).toBe(5);
    expect(r008?.analysis?.sentiment).toBe('negative');
    expect(r008?.rating_mismatch).toBe(true);

    // 7. Sarcasm detection on R003 ("delivered in just 3 weeks. Amazing speed... 🙄")
    const r003 = reviews.find(r => r.review_id === 'R003');
    expect(r003?.analysis?.sentiment).toBe('negative');
    expect(r003?.analysis?.topics).toContain('delivery');

    // 8. Hindi translation/summary on R016
    const r016 = reviews.find(r => r.review_id === 'R016');
    expect(r016?.analysis?.summary).toBeDefined();
    expect(r016?.analysis?.summary.length).toBeGreaterThan(10);
    // English summary check
    expect(/^[A-Za-z0-9\s.,'?!-]+$/.test(r016?.analysis?.summary || '')).toBe(true);

    // 9. Summary cards & KPIs
    expect(summary.total_analyzed).toBe(29); // 30 minus R005 which was empty
    expect(summary.needs_reply_count).toBeGreaterThan(0);
    expect(summary.sentiment_percentages.positive + summary.sentiment_percentages.neutral + summary.sentiment_percentages.negative).toBeGreaterThan(95);

    // 10. Top 3 Complaints & Top 3 Praises
    expect(summary.top_complaints.length).toBeGreaterThanOrEqual(1);
    expect(summary.top_complaints.length).toBeLessThanOrEqual(3);
    expect(summary.top_praises.length).toBeGreaterThanOrEqual(1);
    expect(summary.top_praises.length).toBeLessThanOrEqual(3);

    // 11. Rating agreement percentage
    expect(summary.rating_agreement_percentage).toBeGreaterThan(70);
    expect(summary.rating_agreement_percentage).toBeLessThan(100); // Because of R008 mismatch!
  });
});
