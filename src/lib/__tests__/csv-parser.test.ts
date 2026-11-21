import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import path from 'path';
import { parseCsvString, cleanReviews, sanitizeRating, sanitizeText } from '../csv-parser';

describe('CSV Parser & Data Sanitizer', () => {
  it('correctly handles sanitizing ratings', () => {
    expect(sanitizeRating('5')).toBe(5);
    expect(sanitizeRating(' 1 ')).toBe(1);
    expect(sanitizeRating('five')).toBe(5); // Handles R022
    expect(sanitizeRating('ONE')).toBe(1);
    expect(sanitizeRating('')).toBeNull(); // Missing rating like R010
    expect(sanitizeRating('invalid')).toBeNull();
    expect(sanitizeRating('6')).toBeNull();
    expect(sanitizeRating('-1')).toBeNull();
  });

  it('correctly sanitizes HTML tags and spacing', () => {
    expect(sanitizeText('<b>Love it!</b>')).toBe('Love it!'); // Handles R024
    expect(sanitizeText('Line 1\nLine 2   Line 3')).toBe('Line 1 Line 2 Line 3');
    expect(sanitizeText('')).toBe('');
  });

  it('correctly parses the 30-row benchmark reviews.csv without crashing', () => {
    const csvContent = readFileSync(path.resolve(process.cwd(), 'reviews.csv'), 'utf8');
    const rawRows = parseCsvString(csvContent);
    expect(rawRows.length).toBe(30);

    const cleaned = cleanReviews(rawRows);
    expect(cleaned.length).toBe(30);

    // Verify R005 is flagged as empty
    const r005 = cleaned.find(r => r.review_id === 'R005');
    expect(r005).toBeDefined();
    expect(r005?.is_empty).toBe(true);
    expect(r005?.analysis_status).toBe('skipped_empty');

    // Verify R010 has missing rating handled as null
    const r010 = cleaned.find(r => r.review_id === 'R010');
    expect(r010).toBeDefined();
    expect(r010?.rating).toBeNull();

    // Verify R022 word "five" is parsed as 5
    const r022 = cleaned.find(r => r.review_id === 'R022');
    expect(r022).toBeDefined();
    expect(r022?.rating).toBe(5);

    // Verify R024 HTML is cleaned
    const r024 = cleaned.find(r => r.review_id === 'R024');
    expect(r024?.cleaned_text).toBe('Love it! Keeps my desk clean, and the bamboo smells nice.');

    // Verify duplicate detection: R015 is duplicate of R012
    const r012 = cleaned.find(r => r.review_id === 'R012');
    const r015 = cleaned.find(r => r.review_id === 'R015');
    expect(r012?.is_duplicate).toBe(false);
    expect(r015?.is_duplicate).toBe(true);
    expect(r015?.duplicate_of).toBe('R012');
    expect(r015?.analysis_status).toBe('duplicate');

    // Verify multiline row R028 parsed properly
    const r028 = cleaned.find(r => r.review_id === 'R028');
    expect(r028).toBeDefined();
    expect(r028?.cleaned_text).toContain('The stitching is neat');
    expect(r028?.cleaned_text).toContain('pillow covers are slightly smaller');
  });
});
