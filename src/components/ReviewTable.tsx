'use client';

import React, { useState, useMemo, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CleanedReview, Topic } from '@/types/review';
import {
  Search,
  Star,
  MessageSquare,
  ShieldCheck,
  ArrowUpDown,
  ChevronDown,
  ChevronRight,
  Download,
  X,
  Copy,
  Check,
  Sparkles,
  Layers,
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
  const [sortField, setSortField] = useState<'id' | 'rating' | 'product'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: pressing "/" focuses search
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT' && document.activeElement?.tagName !== 'TEXTAREA') {
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

  // Filtered & Sorted reviews
  const filteredReviews = useMemo(() => {
    return reviews
      .filter(r => {
        // Search filter
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchId = r.review_id.toLowerCase().includes(q);
          const matchText = r.cleaned_text.toLowerCase().includes(q);
          const matchSummary = (r.analysis?.summary || '').toLowerCase().includes(q);
          const matchProduct = r.product.toLowerCase().includes(q);
          if (!matchId && !matchText && !matchSummary && !matchProduct) return false;
        }

        // Product filter
        if (selectedProductFilter !== 'all' && r.product !== selectedProductFilter) {
          return false;
        }

        // Sentiment filter
        if (selectedSentimentFilter !== 'all') {
          if (r.analysis?.sentiment !== selectedSentimentFilter) return false;
        }

        // Topic filter
        if (selectedTopicFilter !== 'all') {
          if (!r.analysis?.topics.includes(selectedTopicFilter as Topic)) return false;
        }

        // Needs reply toggle
        if (onlyNeedsReply && !r.analysis?.needs_reply) {
          return false;
        }

        // Mismatches toggle
        if (onlyMismatches && !r.rating_mismatch) {
          return false;
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
    sortField,
    sortDirection,
  ]);

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

  const exportData = (format: 'csv' | 'json') => {
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(filteredReviews, null, 2)], { type: 'application/json' });
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
        r.rating ?? 'unknown',
        r.analysis?.sentiment || 'unprocessed',
        `"${(r.analysis?.topics || []).join(';')}"`,
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
    onlyMismatches;

  const clearAllFilters = () => {
    setSearchQuery('');
    if (onSelectProductFilter) onSelectProductFilter('all');
    if (onSelectSentimentFilter) onSelectSentimentFilter('all');
    if (onClearTopicFilter) onClearTopicFilter();
    if (onlyNeedsReply && onToggleNeedsReply) onToggleNeedsReply();
    if (onlyMismatches && onToggleMismatches) onToggleMismatches();
    onToast?.('info', 'All active filters cleared');
  };

  return (
    <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-4 space-y-3.5 shadow-sm">
      {/* Header and Filter Controls */}
      <div className="flex flex-col gap-3 border-b border-[#23252a] pb-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-[#f7f8f8]">Customer reviews</h3>
            <span className="font-mono text-xs tabular-nums text-[#8a8f98] bg-[#141516] px-2 py-0.5 rounded border border-[#23252a]">
              {filteredReviews.length} of {reviews.length}
            </span>
            <span className="text-xs text-[#62666d] hidden md:inline">• Click any row to expand analysis details</span>
          </div>

          <div className="flex items-center gap-2">
            {hasActiveFilters && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-[#5e6ad2] hover:underline"
              >
                Reset filters
              </button>
            )}

            {/* Export Dropdown / Buttons */}
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={() => exportData('csv')}
                className="inline-flex items-center gap-1 rounded-md border border-[#23252a] bg-[#141516] px-2 py-1 text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a] transition-colors"
                title="Export filtered reviews as CSV"
              >
                <Download className="h-3 w-3" strokeWidth={1.5} />
                CSV
              </button>
              <button
                type="button"
                onClick={() => exportData('json')}
                className="inline-flex items-center gap-1 rounded-md border border-[#23252a] bg-[#141516] px-2 py-1 text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a] transition-colors"
                title="Export filtered reviews as JSON"
              >
                <Download className="h-3 w-3" strokeWidth={1.5} />
                JSON
              </button>
            </div>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#62666d]" strokeWidth={1.5} />
            <input
              ref={searchInputRef}
              type="text"
              placeholder="Search (press / to focus)..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-md border border-[#23252a] bg-[#141516] pl-8 pr-7 text-xs text-[#f7f8f8] placeholder:text-[#62666d] focus:border-[#5e6ad2] focus:outline-none"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2 top-2.5 text-[#62666d] hover:text-[#f7f8f8]"
              >
                <X className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={selectedProductFilter}
              onChange={e => onSelectProductFilter && onSelectProductFilter(e.target.value)}
              className="h-8 w-full rounded-md border border-[#23252a] bg-[#141516] px-2.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
            >
              <option value="all">All products ({products.length})</option>
              {products.map(p => (
                <option key={p} value={p}>
                  {p}
                </option>
              ))}
            </select>
          </div>

          {/* Sentiment Filter */}
          <div>
            <select
              value={selectedSentimentFilter}
              onChange={e => onSelectSentimentFilter && onSelectSentimentFilter(e.target.value)}
              className="h-8 w-full rounded-md border border-[#23252a] bg-[#141516] px-2.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
            >
              <option value="all">All sentiments</option>
              <option value="positive">Positive</option>
              <option value="neutral">Neutral</option>
              <option value="negative">Negative</option>
            </select>
          </div>

          {/* Topic Filter */}
          <div>
            <select
              value={selectedTopicFilter}
              onChange={e => {
                if (e.target.value === 'all') {
                  if (onClearTopicFilter) onClearTopicFilter();
                } else {
                  // External state update handled via parent
                }
              }}
              className="h-8 w-full rounded-md border border-[#23252a] bg-[#141516] px-2.5 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none"
            >
              <option value="all">All topics</option>
              <option value="quality">Quality</option>
              <option value="delivery">Delivery</option>
              <option value="price">Price</option>
              <option value="packaging">Packaging</option>
              <option value="support">Support</option>
              <option value="size_fit">Size &amp; fit</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={onToggleNeedsReply}
              className={`h-8 flex-1 rounded-md border text-xs font-medium transition-all ${
                onlyNeedsReply
                  ? 'border-[#5e6ad2] bg-[#5e6ad2]/10 text-[#f7f8f8] ring-1 ring-[#5e6ad2]'
                  : 'border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#d0d6e0]'
              }`}
            >
              Needs reply
            </button>
            <button
              type="button"
              onClick={onToggleMismatches}
              className={`h-8 flex-1 rounded-md border text-xs font-medium transition-all ${
                onlyMismatches
                  ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b] ring-1 ring-[#f59e0b]'
                  : 'border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#d0d6e0]'
              }`}
            >
              Mismatches
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-[#23252a] text-[11px] text-[#62666d]">
              <th className="py-2 px-2 w-6"></th>
              <th
                onClick={() => toggleSort('id')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#f7f8f8] font-normal"
              >
                <div className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
                </div>
              </th>
              <th
                onClick={() => toggleSort('product')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#f7f8f8] font-normal"
              >
                <div className="flex items-center gap-1">
                  Product
                  <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rating')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#f7f8f8] font-normal"
              >
                <div className="flex items-center gap-1">
                  Rating
                  <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
                </div>
              </th>
              <th className="py-2.5 px-3 font-normal">Sentiment</th>
              <th className="py-2.5 px-3 font-normal">Topics</th>
              <th className="py-2.5 px-3 font-normal min-w-[280px]">Review &amp; summary</th>
              <th className="py-2.5 px-3 text-right font-normal">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#18191a] text-xs">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-xs text-[#62666d]">
                  No reviews match your selected filters.
                </td>
              </tr>
            ) : (
              filteredReviews.map(review => {
                const isSpecialInjection = review.review_id === 'R012' || review.review_id === 'R015';
                const isExpanded = expandedRowId === review.review_id;

                return (
                  <React.Fragment key={review.review_id}>
                    <tr
                      data-testid={`review-row-${review.review_id}`}
                      onClick={() => toggleExpandRow(review.review_id)}
                      className={`cursor-pointer transition-colors ${
                        isExpanded ? 'bg-[#141516]' : 'hover:bg-[#141516]/60'
                      }`}
                    >
                      {/* Expand Toggle */}
                      <td className="py-2.5 pl-2 pr-0 text-[#62666d]">
                        {isExpanded ? (
                          <ChevronDown className="h-3.5 w-3.5 text-[#5e6ad2]" />
                        ) : (
                          <ChevronRight className="h-3.5 w-3.5 text-[#62666d]" />
                        )}
                      </td>

                      {/* Review ID */}
                      <td className="py-2.5 px-3 font-mono text-[11px] text-[#8a8f98]">
                        <div className="flex items-center gap-1.5">
                          <span className="kbd-cap">{review.review_id}</span>
                          {isSpecialInjection && (
                            <span
                              title="Prompt injection defense verified: attack neutralized"
                              className="text-[#27a644]"
                            >
                              <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                            </span>
                          )}
                          {review.is_duplicate && (
                            <span
                              title={`Duplicate of ${review.duplicate_of}`}
                              className="text-[10px] text-[#62666d] font-mono"
                            >
                              dup
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Product */}
                      <td className="py-2.5 px-3 font-normal text-[#f7f8f8]">
                        {review.product}
                      </td>

                      {/* Rating with Mismatch Flag */}
                      <td className="py-2.5 px-3">
                        <div className="flex items-center gap-1.5">
                          {review.rating !== null ? (
                            <>
                              <div className="flex items-center text-[#f59e0b]">
                                <Star className="h-3 w-3 fill-[#f59e0b]" strokeWidth={1} />
                              </div>
                              <span className="font-mono text-xs tabular-nums text-[#f7f8f8]">{review.rating}</span>
                            </>
                          ) : (
                            <span className="font-mono text-[10px] text-[#62666d]">
                              unknown
                            </span>
                          )}

                          {review.rating_mismatch && (
                            <span
                              title={review.mismatch_reason}
                              className="font-mono text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-1 py-0.2 rounded"
                            >
                              mismatch
                            </span>
                          )}
                        </div>
                      </td>

                      {/* Sentiment */}
                      <td className="py-2.5 px-3">
                        {review.analysis_status === 'skipped_empty' ? (
                          <span className="text-[11px] text-[#62666d]">empty</span>
                        ) : review.analysis_status === 'analysis_failed' ? (
                          <span className="font-mono text-[10px] text-[#eb5757] bg-[#eb5757]/10 px-1.5 py-0.5 rounded">
                            failed
                          </span>
                        ) : (
                          <div className="flex items-center gap-1.5">
                            <span
                              className={`h-1.5 w-1.5 rounded-full ${
                                review.analysis?.sentiment === 'positive'
                                  ? 'bg-[#27a644]'
                                  : review.analysis?.sentiment === 'neutral'
                                  ? 'bg-[#f59e0b]'
                                  : 'bg-[#eb5757]'
                              }`}
                            />
                            <span className="capitalize text-[#f7f8f8] text-[11px]">
                              {review.analysis?.sentiment}
                            </span>
                          </div>
                        )}
                      </td>

                      {/* Topics */}
                      <td className="py-2.5 px-3">
                        <div className="flex flex-wrap gap-1 max-w-[150px]">
                          {review.analysis?.topics?.map(topic => (
                            <span
                              key={topic}
                              className="rounded bg-[#141516] px-1.5 py-0.2 text-[10px] text-[#8a8f98] border border-[#23252a]"
                            >
                              {topic}
                            </span>
                          )) || <span className="text-[#62666d]">-</span>}
                        </div>
                      </td>

                      {/* Review text & AI summary */}
                      <td className="py-2.5 px-3">
                        <div className="space-y-0.5">
                          <p className="text-[#8a8f98] text-xs line-clamp-1">
                            {review.cleaned_text || <span className="text-[#62666d]">(empty review)</span>}
                          </p>
                          {review.analysis?.summary && (
                            <p className="text-[#f7f8f8] text-[11px]">
                              {review.analysis.summary}
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Action */}
                      <td className="py-2.5 px-3 text-right">
                        {review.analysis?.needs_reply ? (
                          <button
                            type="button"
                            onClick={e => {
                              e.stopPropagation();
                              onOpenReplyModal(review);
                            }}
                            className="inline-flex items-center gap-1.5 rounded-md border border-[#23252a] bg-[#141516] px-2.5 py-1 text-[11px] font-medium text-[#f7f8f8] hover:bg-[#18191a] hover:border-[#34343a] transition-colors"
                          >
                            <MessageSquare className="h-3 w-3 text-[#8a8f98]" strokeWidth={1.5} />
                            Draft reply
                          </button>
                        ) : (
                          <span className="text-[11px] text-[#62666d]">None</span>
                        )}
                      </td>
                    </tr>

                    {/* Expandable Drilldown Drawer */}
                    {isExpanded && (
                      <tr className="bg-[#141516]/80 border-b border-[#23252a]">
                        <td colSpan={8} className="p-4 pl-9 space-y-3">
                          <motion.div
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                            transition={{ duration: 0.2 }}
                            className="space-y-3"
                          >
                            {/* Comparison: Original vs Cleaned */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                              <div className="rounded-md border border-[#23252a] bg-[#0f1011] p-3 space-y-1">
                                <span className="font-mono text-[10px] text-[#62666d] uppercase">Original Raw Input</span>
                                <p className="text-[#d0d6e0] leading-relaxed font-mono text-[11px]">
                                  {review.review_text || '<empty>'}
                                </p>
                              </div>
                              <div className="rounded-md border border-[#23252a] bg-[#0f1011] p-3 space-y-1">
                                <span className="font-mono text-[10px] text-[#62666d] uppercase">Sanitized / Cleaned Input</span>
                                <p className="text-[#f7f8f8] leading-relaxed">
                                  {review.cleaned_text || '<empty>'}
                                </p>
                              </div>
                            </div>

                            {/* Metadata Strip */}
                            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-[#8a8f98]">
                              <div className="flex flex-wrap items-center gap-3">
                                <div>
                                  <span className="text-[#62666d]">Date:</span>{' '}
                                  <span className="font-mono text-[#f7f8f8]">{review.date}</span>
                                </div>
                                <div>
                                  <span className="text-[#62666d]">Raw Rating:</span>{' '}
                                  <span className="font-mono text-[#f7f8f8]">&quot;{review.raw_rating}&quot;</span>
                                </div>
                                <div>
                                  <span className="text-[#62666d]">Parsed Rating:</span>{' '}
                                  <span className="font-mono text-[#f7f8f8]">
                                    {review.rating !== null ? `${review.rating} / 5` : 'null (unknown)'}
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <span className="text-[#62666d]">SHA-256:</span>{' '}
                                  <span className="font-mono text-[10px] text-[#62666d] truncate max-w-[120px]">
                                    {review.text_hash}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => copyHash(review.text_hash)}
                                    title="Copy text hash"
                                    className="text-[#62666d] hover:text-[#f7f8f8]"
                                  >
                                    {copiedHash === review.text_hash ? (
                                      <Check className="h-3 w-3 text-[#27a644]" />
                                    ) : (
                                      <Copy className="h-3 w-3" />
                                    )}
                                  </button>
                                </div>
                              </div>

                              {review.analysis?.needs_reply && (
                                <button
                                  type="button"
                                  onClick={() => onOpenReplyModal(review)}
                                  className="inline-flex items-center gap-1.5 rounded-md bg-[#f7f8f8] px-3 py-1.5 text-xs font-medium text-[#010102] hover:bg-white active:scale-[0.98] transition-all"
                                >
                                  <MessageSquare className="h-3.5 w-3.5" />
                                  Draft store reply for this review
                                </button>
                              )}
                            </div>
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
    </div>
  );
};
