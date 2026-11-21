import fs from 'fs';
import path from 'path';
import { LLMAnalysisOutput } from '../types/review';

interface CacheEntry {
  hash: string;
  text_sample: string;
  analysis: LLMAnalysisOutput;
  suggested_reply?: string;
  updated_at: string;
}

interface CacheStore {
  version: string;
  entries: Record<string, CacheEntry>;
}

const CACHE_DIR = path.resolve(process.cwd(), '.cache');
const CACHE_FILE = path.join(CACHE_DIR, 'review_cache.json');

// In-memory cache for ultra-fast lookups and cross-test consistency
let inMemoryStore: CacheStore | null = null;

/**
 * Ensures the cache directory and file exist, returning the store
 */
function ensureCacheStore(): CacheStore {
  if (inMemoryStore) {
    return inMemoryStore;
  }

  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    if (!fs.existsSync(CACHE_FILE)) {
      const initialStore: CacheStore = { version: '1.0', entries: {} };
      fs.writeFileSync(CACHE_FILE, JSON.stringify(initialStore, null, 2), 'utf8');
      inMemoryStore = initialStore;
      return initialStore;
    }
    const content = fs.readFileSync(CACHE_FILE, 'utf8');
    inMemoryStore = JSON.parse(content) as CacheStore;
    return inMemoryStore;
  } catch (err) {
    const fallbackStore: CacheStore = { version: '1.0', entries: {} };
    try {
      if (!fs.existsSync(CACHE_DIR)) {
        fs.mkdirSync(CACHE_DIR, { recursive: true });
      }
      fs.writeFileSync(CACHE_FILE, JSON.stringify(fallbackStore, null, 2), 'utf8');
    } catch {}
    inMemoryStore = fallbackStore;
    return fallbackStore;
  }
}

/**
 * Saves store safely to disk
 */
function saveCacheStore(store: CacheStore): void {
  inMemoryStore = store;
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    const rand = Math.random().toString(36).substring(2, 9);
    const tempFile = path.join(CACHE_DIR, `.tmp_${process.pid}_${Date.now()}_${rand}`);
    fs.writeFileSync(tempFile, JSON.stringify(store, null, 2), 'utf8');
    fs.renameSync(tempFile, CACHE_FILE);
  } catch (err) {
    // Fallback: direct write if atomic rename is busy
    try {
      fs.writeFileSync(CACHE_FILE, JSON.stringify(store, null, 2), 'utf8');
    } catch (directErr) {
      console.error('[Cache] Failed to persist cache:', directErr);
    }
  }
}

/**
 * Retrieves cached analysis for a given review text hash
 */
export function getCachedAnalysis(textHash: string): LLMAnalysisOutput | null {
  if (!textHash) return null;
  const store = ensureCacheStore();
  const entry = store.entries[textHash];
  return entry ? entry.analysis : null;
}

/**
 * Saves an analysis to persistent cache
 */
export function setCachedAnalysis(
  textHash: string,
  textSample: string,
  analysis: LLMAnalysisOutput
): void {
  if (!textHash || !analysis) return;
  const store = ensureCacheStore();
  store.entries[textHash] = {
    hash: textHash,
    text_sample: textSample.slice(0, 100),
    analysis,
    updated_at: new Date().toISOString(),
  };
  saveCacheStore(store);
}

/**
 * Retrieves a cached merchant reply
 */
export function getCachedReply(textHash: string): string | null {
  if (!textHash) return null;
  const store = ensureCacheStore();
  return store.entries[textHash]?.suggested_reply || null;
}

/**
 * Saves a cached merchant reply
 */
export function setCachedReply(textHash: string, reply: string): void {
  if (!textHash || !reply) return;
  const store = ensureCacheStore();
  if (store.entries[textHash]) {
    store.entries[textHash].suggested_reply = reply;
    saveCacheStore(store);
  }
}

/**
 * Returns cache statistics (entries count, file size)
 */
export function getCacheStats(): { total_entries: number; file_size_bytes: number } {
  try {
    const store = ensureCacheStore();
    const stats = fs.existsSync(CACHE_FILE) ? fs.statSync(CACHE_FILE) : { size: 0 };
    return {
      total_entries: Object.keys(store.entries).length,
      file_size_bytes: stats.size,
    };
  } catch {
    return { total_entries: 0, file_size_bytes: 0 };
  }
}

/**
 * Clears all cache entries
 */
export function clearCache(): void {
  inMemoryStore = { version: '1.0', entries: {} };
  try {
    if (!fs.existsSync(CACHE_DIR)) {
      fs.mkdirSync(CACHE_DIR, { recursive: true });
    }
    fs.writeFileSync(CACHE_FILE, JSON.stringify(inMemoryStore, null, 2), 'utf8');
  } catch (err) {
    console.error('[Cache] Failed to clear cache:', err);
  }
}
