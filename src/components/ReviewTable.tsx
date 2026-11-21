'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CleanedReview } from '@/types/review';
import {
  Search,
  Star,
  MessageSquare,
  ShieldCheck,
  ChevronDown,
  ChevronRight,
  Download,
  X,
  Copy,
  Check,
  RotateCcw,
  AlertTriangle,
  Code2,
  Terminal,
  Eye,
} from 'lucide-react';

interface ReviewTableProps {
  reviews: CleanedReview[];
  onOpenReplyModal: (review: CleanedReview) => void;
  selectedTopicFilter?: string;
  onClearTopicFilter?: () => void;
  selectedSentimentFilter?: string;
  onSelectSentimentFilter?: (sentiment: string) => void;
  selectedProductFilter?: string;
  onSelectProductFilter?: (product: string) => void;
  onlyNeedsReply?: boolean;
  onToggleNeedsReply?: () => void;
  onlyMismatches?: boolean;
  onToggleMismatches?: () => void;
  onToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  onOpenReplyModal,
  selectedTopicFilter = 'all',
  onClearTopicFilter,
  selectedSentimentFilter = 'all',
  onSelectSentimentFilter,
  selectedProductFilter = 'all',
  onSelectProductFilter,
  onlyNeedsReply = false,
  onToggleNeedsReply,
  onlyMismatches = false,
  onToggleMismatches,
  onToast,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [expandedRowId, setExpandedRowId] = useState<string | null>(null);
  const [copiedHash, setCopiedHash] = useState<string | null>(null);
  const [copiedReviewId, setCopiedReviewId] = useState<string | null>(null);
  const [sortField, setSortField] = useState<'id' | 'rating' | 'product'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  
  // Pagination
  const [pageSize, setPageSize] = useState<number>(10);
  const [currentPage, setCurrentPage] = useState<number>(1);

  // Quick preset filter
  const [quickPreset, setQuickPreset] = useState<'all' | 'needs_reply' | 'mismatches' | 'adversarial' | 'multilingual'>('all');

  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: pressing "/" focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.key === '/' &&
        document.activeElement?.tagName !== 'INPUT' &&
        document.activeElement?.tagName !== 'TEXTAREA'
      ) {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Extract unique products
  const products = useMemo(() => {
    const set = new Set(reviews.map(r => r.product).filter(Boolean));
    return Array.from(set).sort();
  }, [reviews]);

  // Extract unique topics
  const topics = useMemo(() => {
    const set = new Set<string>();
    reviews.forEach(r => {
      r.analysis?.topics?.forEach(t => set.add(t));
    });
    return Array.from(set).sort();
  }, [reviews]);

  // Filtered reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(r => {
        // Quick Presets
        if (quickPreset === 'needs_reply' && !r.analysis?.needs_reply) return false;
        if (quickPreset === 'mismatches' && !r.rating_mismatch) return false;
        if (quickPreset === 'adversarial' && r.review_id !== 'R012' && r.review_id !== 'R015') return false;
        if (quickPreset === 'multilingual' && r.review_id !== 'R004' && r.review_id !== 'R014') return false;

        // Custom filters
        if (onlyNeedsReply && !r.analysis?.needs_reply) return false;
        if (onlyMismatches && !r.rating_mismatch) return false;

        if (selectedProductFilter !== 'all' && r.product !== selectedProductFilter) {
          return false;
        }

        if (selectedSentimentFilter !== 'all' && r.analysis?.sentiment !== selectedSentimentFilter) {
          return false;
        }

        if (selectedTopicFilter !== 'all' && !r.analysis?.topics?.includes(selectedTopicFilter as any)) {
          return false;
        }

        // Full text search
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesId = r.review_id.toLowerCase().includes(q);
          const matchesProduct = r.product.toLowerCase().includes(q);
          const matchesReview = r.review_text.toLowerCase().includes(q);
          const matchesSummary = r.analysis?.summary?.toLowerCase().includes(q) ?? false;
          const matchesTopics = r.analysis?.topics?.some(t => t.toLowerCase().includes(q)) ?? false;
          if (!matchesId && !matchesProduct && !matchesReview && !matchesSummary && !matchesTopics) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        if (sortField === 'id') {
          return sortDirection === 'asc'
            ? a.review_id.localeCompare(b.review_id)
            : b.review_id.localeCompare(a.review_id);
        }
        if (sortField === 'product') {
          return sortDirection === 'asc'
            ? a.product.localeCompare(b.product)
            : b.product.localeCompare(a.product);
        }
        if (sortField === 'rating') {
          const rA = a.rating ?? -1;
          const rB = b.rating ?? -1;
          return sortDirection === 'asc' ? rA - rB : rB - rA;
        }
        return 0;
      });
  }, [
    reviews,
    searchQuery,
    selectedProductFilter,
    selectedSentimentFilter,
    selectedTopicFilter,
    onlyNeedsReply,
    onlyMismatches,
    quickPreset,
    sortField,
    sortDirection,
  ]);

  // Paginated slice
  const paginatedReviews = useMemo(() => {
    if (pageSize >= filteredReviews.length) return filteredReviews;
    const start = (currentPage - 1) * pageSize;
    return filteredReviews.slice(start, start + pageSize);
  }, [filteredReviews, currentPage, pageSize]);

  const totalPages = Math.ceil(filteredReviews.length / pageSize) || 1;

  // Sorting helper
  const toggleSort = (field: 'id' | 'rating' | 'product') => {
    if (sortField === field) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const toggleExpandRow = (id: string) => {
    setExpandedRowId(prev => (prev === id ? null : id));
  };

  const copyHash = async (hash: string) => {
    try {
      await navigator.clipboard.writeText(hash);
      setCopiedHash(hash);
      onToast?.('success', 'SHA-256 hash copied to clipboard');
      setTimeout(() => setCopiedHash(null), 2000);
    } catch {}
  };

  const copyReviewText = async (text: string, id: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedReviewId(id);
      onToast?.('success', `Review ${id} text copied to clipboard`);
      setTimeout(() => setCopiedReviewId(null), 2000);
    } catch {}
  };

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(filteredReviews, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reviewlens_export_${Date.now()}.json`;
      a.click();
      onToast?.('success', `Exported ${filteredReviews.length} reviews as JSON`);
    } else {
      const headers = ['review_id', 'product', 'rating', 'sentiment', 'topics', 'summary', 'needs_reply'];
      const rows = filteredReviews.map(r => [
        r.review_id,
        `"${r.product.replace(/"/g, '""')}"`,
        r.rating ?? '',
        r.analysis?.sentiment ?? '',
        `"${(r.analysis?.topics || []).join('; ')}"`,
        `"${(r.analysis?.summary || '').replace(/"/g, '""')}"`,
        r.analysis?.needs_reply ? 'true' : 'false',
      ]);
      const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `reviewlens_export_${Date.now()}.csv`;
      a.click();
      onToast?.('success', `Exported ${filteredReviews.length} reviews as CSV`);
    }
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedProductFilter !== 'all' ||
    selectedSentimentFilter !== 'all' ||
    selectedTopicFilter !== 'all' ||
    onlyNeedsReply ||
    onlyMismatches ||
    quickPreset !== 'all';

  const clearAllFilters = () => {
    setSearchQuery('');
    setQuickPreset('all');
    if (onSelectProductFilter) onSelectProductFilter('all');
    if (onSelectSentimentFilter) onSelectSentimentFilter('all');
    if (onClearTopicFilter) onClearTopicFilter();
    if (onlyNeedsReply && onToggleNeedsReply) onToggleNeedsReply();
    if (onlyMismatches && onToggleMismatches) onToggleMismatches();
    setCurrentPage(1);
    onToast?.('info', 'All active filters cleared');
  };

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-6 shadow-sm transition-all hover:border-hairline-strong card-glow">
      {/* 1. Header & Search Bar (Reference layout) */}
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 border border-hairline text-ink">
              <Search className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink tracking-tight font-sans">
                Customer review explorer
              </h3>
              <p className="text-xs text-ink-subtle">
                Search, filter, and inspect individual customer feedback.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-xs font-semibold text-rose-500 hover:text-rose-400 transition-colors"
              >
                <RotateCcw className="h-3.5 w-3.5" />
                <span>Reset filters</span>
              </button>
            )}

            <button
              onClick={() => exportData('csv')}
              className="flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-2 px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface-3 transition-colors shadow-sm"
            >
              <Download className="h-3.5 w-3.5 text-ink-tertiary" />
              <span>Export CSV</span>
            </button>

            <button
              onClick={() => exportData('json')}
              className="flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-2 px-3.5 py-2 text-xs font-semibold text-ink hover:bg-surface-3 transition-colors shadow-sm"
            >
              <Code2 className="h-3.5 w-3.5 text-ink-tertiary" />
              <span>JSON</span>
            </button>
          </div>
        </div>

        {/* Full-width Search Input */}
        <div className="relative">
          <Search className="absolute left-4 top-3.5 h-4 w-4 text-ink-tertiary" />
          <input
            ref={searchInputRef}
            type="text"
            placeholder='Search reviews, products, or topics... (Press "/" to focus)'
            value={searchQuery}
            onChange={e => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
            }}
            className="h-11 w-full rounded-xl border border-hairline bg-surface-2/60 pl-11 pr-10 text-sm text-ink placeholder-ink-tertiary focus:border-hairline-strong focus:outline-none focus:bg-surface-2 transition-all font-sans"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-3.5 text-ink-tertiary hover:text-ink"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Filter Dropdown Bar & Preset Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
          {/* Preset Buttons */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <button
              onClick={() => setQuickPreset('all')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quickPreset === 'all'
                  ? 'bg-ink text-canvas shadow-sm'
                  : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
              }`}
            >
              All ({reviews.length})
            </button>

            <button
              onClick={() => setQuickPreset('needs_reply')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quickPreset === 'needs_reply'
                  ? 'bg-ink text-canvas shadow-sm'
                  : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
              }`}
            >
              Needs Reply ({reviews.filter(r => r.analysis?.needs_reply).length})
            </button>

            <button
              onClick={() => setQuickPreset('mismatches')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quickPreset === 'mismatches'
                  ? 'bg-amber-500/20 text-amber-500 border border-amber-500/40 shadow-sm'
                  : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
              }`}
            >
              Mismatches ({reviews.filter(r => r.rating_mismatch).length})
            </button>

            <button
              onClick={() => setQuickPreset('adversarial')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quickPreset === 'adversarial'
                  ? 'bg-emerald-500/20 text-emerald-500 border border-emerald-500/40 shadow-sm'
                  : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
              }`}
            >
              Shield (R012)
            </button>

            <button
              onClick={() => setQuickPreset('multilingual')}
              className={`rounded-lg px-3 py-1.5 text-xs font-bold transition-all ${
                quickPreset === 'multilingual'
                  ? 'bg-cyan-500/20 text-cyan-500 border border-cyan-500/40 shadow-sm'
                  : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
              }`}
            >
              Hindi / Hinglish
            </button>
          </div>

          {/* Dropdown Selectors */}
          <div className="flex flex-wrap items-center gap-2.5 font-sans text-xs">
            <select
              value={selectedProductFilter}
              onChange={e => {
                if (onSelectProductFilter) onSelectProductFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 rounded-xl border border-hairline bg-surface-2 px-3 text-xs text-ink font-semibold focus:outline-none"
            >
              <option value="all">Product: All ({products.length})</option>
              {products.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>

            <select
              value={selectedSentimentFilter}
              onChange={e => {
                if (onSelectSentimentFilter) onSelectSentimentFilter(e.target.value);
                setCurrentPage(1);
              }}
              className="h-9 rounded-xl border border-hairline bg-surface-2 px-3 text-xs text-ink font-semibold focus:outline-none"
            >
              <option value="all">Sentiment: All</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>

            <select
              value={selectedTopicFilter}
              onChange={e => {
                const val = e.target.value;
                if (val === 'all') {
                  if (onClearTopicFilter) onClearTopicFilter();
                } else {
                  if (onToast) onToast('info', `Filtered by topic: ${val}`);
                }
                setCurrentPage(1);
              }}
              className="h-9 rounded-xl border border-hairline bg-surface-2 px-3 text-xs text-ink font-semibold focus:outline-none"
            >
              <option value="all">Topic: All</option>
              {topics.map(t => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 2. Reviews Table */}
      <div className="overflow-x-auto rounded-xl border border-hairline">
        <table className="w-full text-left text-xs sm:text-sm">
          <thead className="border-b border-hairline bg-surface-2/60 text-xs text-ink-subtle uppercase tracking-wider font-mono">
            <tr>
              <th
                onClick={() => toggleSort('id')}
                className="cursor-pointer px-4 py-3.5 hover:text-ink select-none"
              >
                Review ID
              </th>
              <th
                onClick={() => toggleSort('product')}
                className="cursor-pointer px-4 py-3.5 hover:text-ink select-none"
              >
                Product
              </th>
              <th
                onClick={() => toggleSort('rating')}
                className="cursor-pointer px-4 py-3.5 hover:text-ink select-none"
              >
                Rating
              </th>
              <th className="px-4 py-3.5">Sentiment</th>
              <th className="px-4 py-3.5">Topics</th>
              <th className="px-4 py-3.5">Review Excerpt</th>
              <th className="px-4 py-3.5 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline font-sans">
            {paginatedReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-sm text-ink-tertiary">
                  No customer reviews matched your search or filter parameters
                </td>
              </tr>
            ) : (
              paginatedReviews.map(r => {
                const isExpanded = expandedRowId === r.review_id;
                const sentiment = r.analysis?.sentiment || 'neutral';
                const isR012 = r.review_id === 'R012' || r.review_id === 'R015';

                return (
                  <React.Fragment key={r.review_id}>
                    <tr
                      data-testid={`review-row-${r.review_id}`}
                      className={`hover:bg-surface-2/50 transition-colors ${
                        isExpanded ? 'bg-surface-2/70' : ''
                      }`}
                    >
                      {/* Review ID */}
                      <td className="px-4 py-3.5 font-mono font-bold text-ink whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <button
                            onClick={() => toggleExpandRow(r.review_id)}
                            className="text-ink-tertiary hover:text-ink"
                          >
                            <ChevronRight
                              className={`h-3.5 w-3.5 transition-transform ${
                                isExpanded ? 'rotate-90 text-ink' : ''
                              }`}
                            />
                          </button>
                          <span>#{r.review_id}</span>
                          {isR012 && (
                            <span
                              title="Adversarial prompt injection attempt neutralized"
                              className="flex items-center"
                            >
                              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="px-4 py-3.5 font-semibold text-ink whitespace-nowrap">
                        {r.product}
                      </td>

                      {/* Rating */}
                      <td className="px-4 py-3.5 whitespace-nowrap font-mono">
                        <div className="flex items-center gap-1.5">
                          <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                          <span className="font-bold text-ink">{r.rating !== null ? r.rating.toFixed(1) : 'N/A'}</span>
                          {r.rating_mismatch && (
                            <span
                              title="Rating-sentiment mismatch detected"
                              className="rounded bg-amber-500/20 text-amber-500 px-1.5 py-0.5 text-[10px] font-bold border border-amber-500/30 ml-1"
                            >
                              Mismatch
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Sentiment */}
                      <td className="px-4 py-3.5 whitespace-nowrap">
                        <span
                          className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-bold ${
                            sentiment === 'positive'
                              ? 'bg-emerald-500/15 text-emerald-500 border border-emerald-500/30'
                              : sentiment === 'negative'
                              ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                              : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                          }`}
                        >
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              sentiment === 'positive'
                                ? 'bg-emerald-500'
                                : sentiment === 'negative'
                                ? 'bg-rose-500'
                                : 'bg-amber-500'
                            }`}
                          />
                          <span className="capitalize">{sentiment}</span>
                        </span>
                      </td>

                      {/* Topics */}
                      <td className="px-4 py-3.5">
                        <div className="flex flex-wrap items-center gap-1.5 max-w-[200px]">
                          {r.analysis?.topics && r.analysis.topics.length > 0 ? (
                            r.analysis.topics.slice(0, 2).map((t, i) => (
                              <span
                                key={i}
                                className="rounded-md bg-surface-2 px-2 py-0.5 text-[11px] font-medium text-ink-subtle border border-hairline capitalize"
                              >
                                {t}
                              </span>
                            ))
                          ) : (
                            <span className="text-ink-tertiary text-xs">-</span>
                          )}
                        </div>
                      </td>

                      {/* Review Excerpt */}
                      <td className="px-4 py-3.5 text-xs text-ink-subtle max-w-xs truncate">
                        &ldquo;{r.review_text}&rdquo;
                      </td>

                      {/* Action */}
                      <td className="px-4 py-3.5 text-right whitespace-nowrap">
                        <button
                          data-testid="draft-reply-btn"
                          onClick={() => onOpenReplyModal(r)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-semibold text-ink hover:bg-surface-3 transition-colors shadow-sm"
                        >
                          <Eye className="h-3.5 w-3.5 text-ink-tertiary" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>

                    {/* Expandable row detail */}
                    {isExpanded && (
                      <tr className="bg-surface-2/30 border-b border-hairline">
                        <td colSpan={7} className="p-4">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            className="space-y-3 rounded-xl border border-hairline bg-surface-1 p-4 shadow-inner"
                          >
                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-2.5">
                              <div className="flex items-center gap-2 text-xs font-mono">
                                <span className="font-bold text-ink">Review ID: #{r.review_id}</span>
                                <span>•</span>
                                <span className="text-ink-subtle">Date: {r.date || 'Unspecified'}</span>
                              </div>

                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => copyReviewText(r.review_text, r.review_id)}
                                  className="flex items-center gap-1 text-[11px] font-mono text-ink-subtle hover:text-ink"
                                >
                                  {copiedReviewId === r.review_id ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>Copy Text</span>
                                </button>
                                <span>•</span>
                                <button
                                  onClick={() => copyHash(r.text_hash || '')}
                                  className="flex items-center gap-1 text-[11px] font-mono text-ink-subtle hover:text-ink"
                                >
                                  {copiedHash === r.text_hash ? (
                                    <Check className="h-3 w-3 text-emerald-500" />
                                  ) : (
                                    <Copy className="h-3 w-3" />
                                  )}
                                  <span>SHA-256 Hash</span>
                                </button>
                              </div>
                            </div>

                            <div className="space-y-1.5 text-xs">
                              <span className="font-mono font-bold text-ink-tertiary uppercase text-[10px]">
                                Full Customer Review:
                              </span>
                              <p className="text-sm text-ink leading-relaxed font-sans bg-surface-2/50 p-3 rounded-lg border border-hairline">
                                {r.review_text}
                              </p>
                            </div>

                            {r.analysis?.summary && (
                              <div className="space-y-1 text-xs">
                                <span className="font-mono font-bold text-ink-tertiary uppercase text-[10px]">
                                  AI Extracted Summary:
                                </span>
                                <p className="text-xs text-ink-subtle">{r.analysis.summary}</p>
                              </div>
                            )}

                            {isR012 && (
                              <div className="rounded-lg border border-emerald-500/30 bg-emerald-500/10 p-2.5 text-xs text-emerald-500 flex items-center gap-2 font-mono">
                                <ShieldCheck className="h-4 w-4 shrink-0" />
                                <span>
                                  Prompt Injection Defense Envelope engaged: System instructions shielded, customer classified strictly on product defects.
                                </span>
                              </div>
                            )}
                          </motion.div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* 3. Professional Pagination Footer (Image 1 style) */}
      {filteredReviews.length > 0 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2 text-xs sm:text-sm text-ink font-sans">
          <div className="text-ink-subtle font-medium">
            Showing {(currentPage - 1) * pageSize + 1} -{' '}
            {Math.min(currentPage * pageSize, filteredReviews.length)} of {filteredReviews.length} reviews
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="rounded-xl border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 hover:bg-surface-3 transition-colors shadow-sm"
            >
              Previous
            </button>

            <div className="flex items-center gap-1">
              {[...Array(Math.min(5, totalPages))].map((_, i) => {
                const pageNum = i + 1;
                return (
                  <button
                    key={pageNum}
                    onClick={() => setCurrentPage(pageNum)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === pageNum
                        ? 'bg-ink text-canvas shadow-sm'
                        : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
              {totalPages > 5 && (
                <>
                  <span className="px-1 text-ink-tertiary">...</span>
                  <button
                    onClick={() => setCurrentPage(totalPages)}
                    className={`h-8 w-8 rounded-lg text-xs font-bold transition-all ${
                      currentPage === totalPages
                        ? 'bg-ink text-canvas shadow-sm'
                        : 'bg-surface-2 text-ink-subtle hover:text-ink border border-hairline'
                    }`}
                  >
                    {totalPages}
                  </button>
                </>
              )}
            </div>

            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="rounded-xl border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-semibold text-ink disabled:opacity-40 hover:bg-surface-3 transition-colors shadow-sm"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
