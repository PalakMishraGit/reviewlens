import { CleanedReview } from '../types/review';
import { computeReviewHash } from './hash';

export interface RawCsvRow {
  review_id: string;
  product: string;
  rating: string;
  date: string;
  review_text: string;
}

/**
 * Robust RFC 4180 compliant CSV parser.
 * Handles:
 * - Commas inside quoted strings
 * - Newlines inside quoted strings (e.g. multi-line reviews like R028)
 * - Escaped double quotes ("")
 * - Carriage returns (\r\n and \n)
 */
export function parseCsvString(csvContent: string): RawCsvRow[] {
  if (!csvContent || !csvContent.trim()) {
    return [];
  }

  const rows: string[][] = [];
  let currentRow: string[] = [];
  let currentField = '';
  let insideQuotes = false;

  for (let i = 0; i < csvContent.length; i++) {
    const char = csvContent[i];
    const nextChar = csvContent[i + 1];

    if (insideQuotes) {
      if (char === '"') {
        if (nextChar === '"') {
          // Escaped quote: "" -> "
          currentField += '"';
          i++;
        } else {
          // Closing quote
          insideQuotes = false;
        }
      } else {
        currentField += char;
      }
    } else {
      if (char === '"') {
        insideQuotes = true;
      } else if (char === ',') {
        currentRow.push(currentField);
        currentField = '';
      } else if (char === '\r') {
        if (nextChar === '\n') {
          i++;
        }
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.some(col => col.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else if (char === '\n') {
        currentRow.push(currentField);
        currentField = '';
        if (currentRow.some(col => col.trim().length > 0)) {
          rows.push(currentRow);
        }
        currentRow = [];
      } else {
        currentField += char;
      }
    }
  }

  // Push final field and row if any
  if (currentField.length > 0 || currentRow.length > 0) {
    currentRow.push(currentField);
    if (currentRow.some(col => col.trim().length > 0)) {
      rows.push(currentRow);
    }
  }

  if (rows.length === 0) return [];

  // Parse headers
  const headerRow = rows[0].map(h => h.trim().toLowerCase());
  const idIdx = headerRow.findIndex(h => h === 'review_id' || h === 'id' || (h.includes('id') && !h.includes('product')));
  const prodIdx = headerRow.findIndex(h => h === 'product' || h.includes('product'));
  const ratingIdx = headerRow.findIndex(h => h === 'rating' || h.includes('rating') || h.includes('star'));
  const dateIdx = headerRow.findIndex(h => h === 'date' || h.includes('date'));
  const textIdx = headerRow.findIndex(h => h === 'review_text' || (h.includes('text') && !h.includes('id')) || h === 'review' || h.includes('comment'));

  const parsedData: RawCsvRow[] = [];

  for (let r = 1; r < rows.length; r++) {
    const cols = rows[r];
    parsedData.push({
      review_id: (idIdx !== -1 && cols[idIdx] !== undefined ? cols[idIdx] : cols[0] || `R${r.toString().padStart(3, '0')}`).trim(),
      product: (prodIdx !== -1 && cols[prodIdx] !== undefined ? cols[prodIdx] : cols[1] || 'Unknown Product').trim(),
      rating: (ratingIdx !== -1 && cols[ratingIdx] !== undefined ? cols[ratingIdx] : cols[2] || '').trim(),
      date: (dateIdx !== -1 && cols[dateIdx] !== undefined ? cols[dateIdx] : cols[3] || '').trim(),
      review_text: (textIdx !== -1 && cols[textIdx] !== undefined ? cols[textIdx] : cols[4] || '').trim(),
    });
  }

  return parsedData;
}

/**
 * Parses rating string to a valid number 1-5 or null (unknown).
 * Handles numeric values and common word representations (e.g. "five" -> 5).
 */
export function sanitizeRating(rawRating: string): number | null {
  if (!rawRating) return null;
  const trimmed = rawRating.trim().toLowerCase();
  if (trimmed === '') return null;

  const wordMap: Record<string, number> = {
    one: 1,
    two: 2,
    three: 3,
    four: 4,
    five: 5,
  };

  if (wordMap[trimmed] !== undefined) {
    return wordMap[trimmed];
  }

  const num = Number(trimmed);
  if (!isNaN(num) && Number.isInteger(num) && num >= 1 && num <= 5) {
    return num;
  }

  return null;
}

/**
 * Cleans review text by stripping HTML tags and normalizing spacing
 */
export function sanitizeText(rawText: string): string {
  if (!rawText) return '';
  return rawText
    .replace(/<[^>]*>/g, '') // remove HTML tags (e.g. <b>...</b>)
    .replace(/\s+/g, ' ')   // collapse multi-spaces and newlines
    .trim();
}

/**
 * Cleans and deduplicates a dataset of raw rows.
 * Implements:
 * - Empty text flagging (skipped without crash)
 * - Rating sanitization (missing or invalid marked unknown)
 * - Deduplication via SHA-256 hash
 */
export function cleanReviews(rawRows: RawCsvRow[]): CleanedReview[] {
  const seenHashMap = new Map<string, string>(); // hash -> review_id

  return rawRows.map(row => {
    const rawText = row.review_text || '';
    const cleanedText = sanitizeText(rawText);
    const isEmpty = cleanedText.length === 0;
    const textHash = computeReviewHash(cleanedText);
    const parsedRating = sanitizeRating(row.rating);

    let isDuplicate = false;
    let duplicateOf: string | undefined = undefined;

    if (!isEmpty) {
      if (seenHashMap.has(textHash)) {
        isDuplicate = true;
        duplicateOf = seenHashMap.get(textHash);
      } else {
        seenHashMap.set(textHash, row.review_id);
      }
    }

    return {
      review_id: row.review_id,
      product: row.product,
      rating: parsedRating,
      raw_rating: row.rating,
      date: row.date,
      review_text: rawText,
      cleaned_text: cleanedText,
      textHash, // internal
      text_hash: textHash,
      is_empty: isEmpty,
      is_duplicate: isDuplicate,
      duplicate_of: duplicateOf,
      analysis_status: isEmpty
        ? 'skipped_empty'
        : isDuplicate
        ? 'duplicate'
        : 'success', // will be updated during AI analysis
    };
  });
}
