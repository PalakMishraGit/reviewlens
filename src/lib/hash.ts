import { createHash } from 'crypto';

/**
 * Normalizes text for reliable hashing:
 * - strips surrounding whitespace
 * - normalizes multiple whitespace/newlines into single spaces
 * - trims and lowers for consistent deduplication comparison
 */
export function normalizeTextForHashing(text: string): string {
  if (!text) return '';
  return text
    .trim()
    .replace(/\s+/g, ' ')
    .toLowerCase();
}

/**
 * Computes deterministic SHA-256 hash of review text
 */
export function computeReviewHash(text: string): string {
  const normalized = normalizeTextForHashing(text);
  return createHash('sha256').update(normalized, 'utf8').digest('hex');
}
