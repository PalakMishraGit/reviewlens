import { CleanedReview, AnalysisSummary, MetricItem, ProductInsight, TelemetryStats, Topic } from '../types/review';

/**
 * Computes high-level aggregated metrics, top praises/complaints, and per-product insights.
 */
export function computeAnalysisMetrics(
  reviews: CleanedReview[],
  telemetry: TelemetryStats
): AnalysisSummary {
  const totalRaw = reviews.length;
  const skippedEmpty = reviews.filter(r => r.is_empty).length;
  const duplicates = reviews.filter(r => r.is_duplicate).length;
  const failedCount = reviews.filter(r => r.analysis_status === 'analysis_failed').length;

  const validAnalyzed = reviews.filter(
    r => r.analysis && r.analysis_status === 'success'
  );

  const totalAnalyzed = validAnalyzed.length;

  // Sentiment counts
  const positiveCount = validAnalyzed.filter(r => r.analysis?.sentiment === 'positive').length;
  const neutralCount = validAnalyzed.filter(r => r.analysis?.sentiment === 'neutral').length;
  const negativeCount = validAnalyzed.filter(r => r.analysis?.sentiment === 'negative').length;

  const pct = (count: number) => (totalAnalyzed > 0 ? Math.round((count / totalAnalyzed) * 100) : 0);

  // Needs reply count
  const needsReplyCount = validAnalyzed.filter(r => r.analysis?.needs_reply).length;

  // Rating mismatch metrics
  const ratedReviews = validAnalyzed.filter(r => r.rating !== null);
  const mismatchCount = ratedReviews.filter(r => r.rating_mismatch).length;
  const agreementPercentage =
    ratedReviews.length > 0
      ? Math.round(((ratedReviews.length - mismatchCount) / ratedReviews.length) * 100)
      : 100;

  // Compute Top Complaints and Top Praises
  const topComplaints = extractTopInsights(
    validAnalyzed.filter(r => r.analysis?.sentiment === 'negative'),
    'complaint'
  );

  const topPraises = extractTopInsights(
    validAnalyzed.filter(r => r.analysis?.sentiment === 'positive'),
    'praise'
  );

  // Compute Per-Product Insights
  const productInsights = computeProductInsights(validAnalyzed);

  return {
    total_raw_rows: totalRaw,
    total_analyzed: totalAnalyzed,
    skipped_empty: skippedEmpty,
    duplicates_detected: duplicates,
    analysis_failed_count: failedCount,
    sentiment_counts: {
      positive: positiveCount,
      neutral: neutralCount,
      negative: negativeCount,
    },
    sentiment_percentages: {
      positive: pct(positiveCount),
      neutral: pct(neutralCount),
      negative: pct(negativeCount),
    },
    needs_reply_count: needsReplyCount,
    rating_mismatch_count: mismatchCount,
    rating_agreement_percentage: agreementPercentage,
    top_complaints: topComplaints,
    top_praises: topPraises,
    product_insights: productInsights,
    telemetry,
  };
}

/**
 * Extracts and groups top 3 thematic complaints or praises across the review set
 */
function extractTopInsights(
  reviews: CleanedReview[],
  type: 'complaint' | 'praise'
): MetricItem[] {
  if (reviews.length === 0) return [];

  // Group by primary topic or recurring issue cluster
  const topicMap = new Map<Topic, CleanedReview[]>();

  for (const r of reviews) {
    if (!r.analysis) continue;
    const primaryTopic = r.analysis.topics[0] || 'other';
    const list = topicMap.get(primaryTopic) || [];
    list.push(r);
    topicMap.set(primaryTopic, list);
  }

  // Sort topics by frequency
  const sortedTopics = Array.from(topicMap.entries()).sort(
    (a, b) => b[1].length - a[1].length
  );

  const topItems: MetricItem[] = [];

  for (const [topic, items] of sortedTopics) {
    if (topItems.length >= 3) break;

    // Pick most representative summary
    const bestSummary = pickRepresentativeSummary(items, topic, type);
    const uniqueProducts = Array.from(new Set(items.map(i => i.product)));
    const sampleIds = items.slice(0, 3).map(i => i.review_id);

    topItems.push({
      text: bestSummary,
      count: items.length,
      topics: [topic],
      products: uniqueProducts,
      example_ids: sampleIds,
    });
  }

  return topItems;
}

function pickRepresentativeSummary(
  items: CleanedReview[],
  topic: Topic,
  type: 'complaint' | 'praise'
): string {
  if (type === 'complaint') {
    if (topic === 'quality') return 'Product defects, broken components & hardware malfunctions';
    if (topic === 'delivery') return 'Delayed or unfulfilled shipments with tracking discrepancies';
    if (topic === 'size_fit') return 'Inconsistent sizing chart & inaccurate dimensional measurements';
    if (topic === 'support') return 'Slow or unresponsive customer service on refunds & replacements';
    if (topic === 'packaging') return 'Damaged or inadequate packaging during transit';
    if (topic === 'price') return 'Perceived poor value for money relative to local alternatives';
    return items[0]?.analysis?.summary || 'General product complaints';
  } else {
    if (topic === 'quality') return 'Exceptional build quality, durable material & premium comfort';
    if (topic === 'price') return 'Great value for money and affordable pricing';
    if (topic === 'delivery') return 'Prompt, reliable delivery and fast transit times';
    if (topic === 'packaging') return 'Secure, neat, and appealing packaging';
    if (topic === 'support') return 'Helpful support and smooth replacement experience';
    if (topic === 'size_fit') return 'Accurate, comfortable fit matching customer expectations';
    return items[0]?.analysis?.summary || 'General customer satisfaction';
  }
}

/**
 * Computes individual per-product performance insights
 */
function computeProductInsights(reviews: CleanedReview[]): ProductInsight[] {
  const productMap = new Map<string, CleanedReview[]>();

  for (const r of reviews) {
    const list = productMap.get(r.product) || [];
    list.push(r);
    productMap.set(r.product, list);
  }

  const insights: ProductInsight[] = [];

  for (const [product, items] of productMap.entries()) {
    const total = items.length;
    const pos = items.filter(i => i.analysis?.sentiment === 'positive').length;
    const neu = items.filter(i => i.analysis?.sentiment === 'neutral').length;
    const neg = items.filter(i => i.analysis?.sentiment === 'negative').length;

    const ratedItems = items.filter(i => i.rating !== null);
    const avgRating =
      ratedItems.length > 0
        ? Number(
            (ratedItems.reduce((acc, curr) => acc + (curr.rating || 0), 0) / ratedItems.length).toFixed(1)
          )
        : null;

    // Count topic occurrences
    const topicCounts = new Map<Topic, number>();
    for (const item of items) {
      if (!item.analysis) continue;
      for (const t of item.analysis.topics) {
        topicCounts.set(t, (topicCounts.get(t) || 0) + 1);
      }
    }

    const topTopics = Array.from(topicCounts.entries())
      .map(([topic, count]) => ({ topic, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 3);

    const needsReply = items.filter(i => i.analysis?.needs_reply).length;
    const mismatches = items.filter(i => i.rating_mismatch).length;

    insights.push({
      product,
      total_reviews: total,
      average_rating: avgRating,
      sentiment_split: { positive: pos, neutral: neu, negative: neg },
      sentiment_percentages: {
        positive: total > 0 ? Math.round((pos / total) * 100) : 0,
        neutral: total > 0 ? Math.round((neu / total) * 100) : 0,
        negative: total > 0 ? Math.round((neg / total) * 100) : 0,
      },
      top_topics: topTopics,
      needs_reply_count: needsReply,
      rating_mismatches: mismatches,
    });
  }

  return insights.sort((a, b) => b.total_reviews - a.total_reviews);
}
