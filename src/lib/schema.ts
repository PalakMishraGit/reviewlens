import { z } from 'zod';
import { ALLOWED_SENTIMENTS, ALLOWED_TOPICS, LLMAnalysisOutput } from '../types/review';

export const SentimentEnum = z.enum(['positive', 'neutral', 'negative']);

export const TopicEnum = z.enum([
  'quality',
  'delivery',
  'price',
  'packaging',
  'support',
  'size_fit',
  'other',
]);

export const LLMAnalysisSchema = z.object({
  sentiment: SentimentEnum,
  topics: z.array(TopicEnum).min(1, 'At least one topic must be identified'),
  summary: z.string().min(1, 'Summary must not be empty').max(300, 'Summary should be concise'),
  needs_reply: z.boolean(),
});

export const BatchReviewAnalysisSchema = z.object({
  review_id: z.string(),
  sentiment: SentimentEnum,
  topics: z.array(TopicEnum).min(1, 'At least one topic must be identified'),
  summary: z.string().min(1, 'Summary must not be empty'),
  needs_reply: z.boolean(),
});

export const BatchResponseSchema = z.array(BatchReviewAnalysisSchema);

export type ValidatedBatchItem = z.infer<typeof BatchReviewAnalysisSchema>;

/**
 * Safely extracts and parses JSON from raw LLM text.
 * Strips markdown code blocks (```json ... ```) and leading/trailing conversational filler.
 */
export function extractJsonFromText(rawText: string): unknown {
  if (!rawText) {
    throw new Error('Empty response from LLM');
  }

  let text = rawText.trim();

  // Strip markdown code fences if present
  if (text.startsWith('```')) {
    text = text.replace(/^```(?:json)?\s*/i, '');
    text = text.replace(/\s*```$/, '');
    text = text.trim();
  }

  // Find first [ or { and matching last ] or }
  const firstBracket = text.indexOf('[');
  const firstBrace = text.indexOf('{');

  let startIndex = -1;
  let endIndex = -1;

  if (firstBracket !== -1 && (firstBrace === -1 || firstBracket < firstBrace)) {
    startIndex = firstBracket;
    endIndex = text.lastIndexOf(']');
  } else if (firstBrace !== -1) {
    startIndex = firstBrace;
    endIndex = text.lastIndexOf('}');
  }

  if (startIndex !== -1 && endIndex !== -1 && endIndex >= startIndex) {
    text = text.substring(startIndex, endIndex + 1);
  }

  try {
    return JSON.parse(text);
  } catch (err: any) {
    throw new Error(`Failed to parse JSON from LLM response: ${err.message}. Content was: ${text.slice(0, 150)}...`);
  }
}

/**
 * Validates a single LLM review analysis against the schema.
 * Throws a descriptive error if validation fails.
 */
export function validateAnalysisOutput(data: unknown): LLMAnalysisOutput {
  const result = LLMAnalysisSchema.safeParse(data);
  if (!result.success) {
    const errorDetails = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Schema validation error: ${errorDetails}`);
  }
  return result.data as LLMAnalysisOutput;
}

/**
 * Validates a batch LLM response against the BatchResponseSchema.
 */
export function validateBatchResponse(data: unknown): ValidatedBatchItem[] {
  const result = BatchResponseSchema.safeParse(data);
  if (!result.success) {
    const errorDetails = result.error.issues.map(i => `${i.path.join('.')}: ${i.message}`).join(', ');
    throw new Error(`Batch schema validation error: ${errorDetails}`);
  }
  return result.data;
}
