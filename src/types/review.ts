export type Sentiment = 'positive' | 'neutral' | 'negative';

export type Topic =
  | 'quality'
  | 'delivery'
  | 'price'
  | 'packaging'
  | 'support'
  | 'size_fit'
  | 'other';

export const ALLOWED_SENTIMENTS: Sentiment[] = ['positive', 'neutral', 'negative'];

export const ALLOWED_TOPICS: Topic[] = [
  'quality',
  'delivery',
  'price',
  'packaging',
  'support',
  'size_fit',
  'other',
];

export interface LLMAnalysisOutput {
  sentiment: Sentiment;
  topics: Topic[];
  summary: string;
  needs_reply: boolean;
}

export type AnalysisStatus =
  | 'success'
  | 'analysis_failed'
  | 'skipped_empty'
  | 'duplicate';

export interface CleanedReview {
  review_id: string;
  product: string;
  rating: number | null; // null represents missing or unknown rating
  raw_rating: string;
  date: string;
  review_text: string;
  cleaned_text: string;
  text_hash: string;
  is_empty: boolean;
  is_duplicate: boolean;
  duplicate_of?: string;
  analysis_status: AnalysisStatus;
  analysis?: LLMAnalysisOutput;
  suggested_reply?: string;
  rating_mismatch?: boolean;
  mismatch_reason?: string;
  cached?: boolean;
  failure_reason?: string;
}

export interface MetricItem {
  text: string;
  count: number;
  topics: Topic[];
  products: string[];
  example_ids: string[];
}

export interface ProductInsight {
  product: string;
  total_reviews: number;
  average_rating: number | null;
  sentiment_split: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentiment_percentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  top_topics: { topic: Topic; count: number }[];
  needs_reply_count: number;
  rating_mismatches: number;
}

export interface TelemetryStats {
  total_time_ms: number;
  ai_calls_made: number;
  cache_hits: number;
  total_reviews_processed: number;
  api_provider: string;
  model_name: string;
}

export interface AnalysisSummary {
  total_raw_rows: number;
  total_analyzed: number;
  skipped_empty: number;
  duplicates_detected: number;
  analysis_failed_count: number;
  sentiment_counts: {
    positive: number;
    neutral: number;
    negative: number;
  };
  sentiment_percentages: {
    positive: number;
    neutral: number;
    negative: number;
  };
  needs_reply_count: number;
  rating_mismatch_count: number;
  rating_agreement_percentage: number;
  top_complaints: MetricItem[];
  top_praises: MetricItem[];
  product_insights: ProductInsight[];
  telemetry: TelemetryStats;
}

export interface AnalyzeResponse {
  success: boolean;
  reviews: CleanedReview[];
  summary: AnalysisSummary;
  error?: string;
}
