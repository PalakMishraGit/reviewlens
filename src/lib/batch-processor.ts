import { CleanedReview, LLMAnalysisOutput, TelemetryStats } from '../types/review';
import { getCachedAnalysis, setCachedAnalysis } from './cache';
import { analyzeBatchWithFallback, CallAiOptions } from './ai-client';

export interface BatchProcessingResult {
  reviews: CleanedReview[];
  telemetry: TelemetryStats;
}

/**
 * Checks if star rating contradicts the AI sentiment
 * - Negative sentiment with 4 or 5 stars -> Mismatch (e.g. R008)
 * - Positive sentiment with 1 or 2 stars -> Mismatch
 */
export function checkRatingMismatch(rating: number | null, sentiment?: string): { isMismatch: boolean; reason?: string } {
  if (rating === null || !sentiment) {
    return { isMismatch: false };
  }

  if (rating >= 4 && sentiment === 'negative') {
    return {
      isMismatch: true,
      reason: `Customer gave a high ${rating}-star rating but wrote a negative review.`,
    };
  }

  if (rating <= 2 && sentiment === 'positive') {
    return {
      isMismatch: true,
      reason: `Customer gave a low ${rating}-star rating but wrote a positive review.`,
    };
  }

  return { isMismatch: false };
}

/**
 * Orchestrates batch processing of reviews with cache checks, chunking, and mismatch detection.
 */
export async function processReviewsInBatches(
  cleanedReviews: CleanedReview[],
  options: CallAiOptions & { batchSize?: number } = {}
): Promise<BatchProcessingResult> {
  const startTime = Date.now();
  const batchSize = options.batchSize || Number(process.env.BATCH_SIZE) || 5;

  let aiCallsMade = 0;
  let cacheHits = 0;

  // 1. First pass: check cache and mark empty/duplicate reviews
  const pendingReviews: CleanedReview[] = [];
  const processedMap = new Map<string, CleanedReview>();

  for (const review of cleanedReviews) {
    if (review.is_empty) {
      review.analysis_status = 'skipped_empty';
      processedMap.set(review.review_id, review);
      continue;
    }

    // Check persistent cache
    const cached = getCachedAnalysis(review.text_hash);
    if (cached) {
      cacheHits++;
      review.analysis = cached;
      review.analysis_status = 'success';
      review.cached = true;
      processedMap.set(review.review_id, review);
      continue;
    }

    if (review.is_duplicate) {
      // Will be populated once original review is resolved
      continue;
    }

    pendingReviews.push(review);
  }

  // 2. Second pass: Process uncached novel reviews in chunks of batchSize
  for (let i = 0; i < pendingReviews.length; i += batchSize) {
    const chunk = pendingReviews.slice(i, i + batchSize);
    aiCallsMade++;

    const chunkResults = await analyzeBatchWithFallback(chunk, options);

    for (const review of chunk) {
      const result = chunkResults.get(review.review_id);
      if (result && result !== 'analysis_failed') {
        review.analysis = result;
        review.analysis_status = 'success';
        review.cached = false;
        // Save to cache
        setCachedAnalysis(review.text_hash, review.cleaned_text, result);
      } else {
        review.analysis_status = 'analysis_failed';
        review.failure_reason = 'LLM response failed schema validation after retry.';
      }
      processedMap.set(review.review_id, review);
    }
  }

  // 3. Third pass: Resolve duplicate reviews from their originals
  for (const review of cleanedReviews) {
    if (review.is_duplicate && review.duplicate_of) {
      const original = processedMap.get(review.duplicate_of);
      if (original && original.analysis) {
        review.analysis = original.analysis;
        review.analysis_status = original.analysis_status;
        review.cached = true;
        cacheHits++;
      } else {
        review.analysis_status = 'analysis_failed';
      }
      processedMap.set(review.review_id, review);
    }
  }

  // 4. Fourth pass: Detect rating mismatches
  const finalReviews = cleanedReviews.map(r => {
    const populated = processedMap.get(r.review_id) || r;
    const { isMismatch, reason } = checkRatingMismatch(populated.rating, populated.analysis?.sentiment);
    populated.rating_mismatch = isMismatch;
    populated.mismatch_reason = reason;
    return populated;
  });

  const totalTimeMs = Date.now() - startTime;

  return {
    reviews: finalReviews,
    telemetry: {
      total_time_ms: totalTimeMs,
      ai_calls_made: aiCallsMade,
      cache_hits: cacheHits,
      total_reviews_processed: finalReviews.length,
      api_provider:
        options.provider === 'mock' ||
        process.env.MOCK_AI === 'true' ||
        (!options.apiKey && !process.env.GEMINI_API_KEY && !process.env.GROQ_API_KEY)
          ? 'Local Analytical Engine (Mock)'
          : options.provider === 'groq' || options.apiKey?.startsWith('gsk_') || process.env.GROQ_API_KEY
          ? 'Groq (Llama 3.3)'
          : 'Google Gemini 2.5 Flash',
      model_name: options.model || process.env.AI_MODEL || 'gemini-2.5-flash',
    },
  };
}
