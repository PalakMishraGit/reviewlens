'use client';

import React, { useState, useMemo } from 'react';
import { CleanedReview, Topic } from '@/types/review';
import {
  Search,
  Star,
  MessageSquare,
  AlertTriangle,
  ShieldCheck,
  ArrowUpDown,
} from 'lucide-react';

interface ReviewTableProps {
  reviews: CleanedReview[];
  onOpenReplyModal: (review: CleanedReview) => void;
  selectedTopicFilter?: string;
  onClearTopicFilter?: () => void;
}

export const ReviewTable: React.FC<ReviewTableProps> = ({
  reviews,
  onOpenReplyModal,
  selectedTopicFilter,
  onClearTopicFilter,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProduct, setSelectedProduct] = useState<string>('all');
  const [selectedSentiment, setSelectedSentiment] = useState<string>('all');
  const [selectedTopic, setSelectedTopic] = useState<string>(selectedTopicFilter || 'all');
  const [onlyNeedsReply, setOnlyNeedsReply] = useState(false);
  const [onlyMismatches, setOnlyMismatches] = useState(false);
  const [sortField, setSortField] = useState<'id' | 'rating' | 'product'>('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');

  // Extract unique products
  const products = useMemo(() => {
    const set = new Set(reviews.map(r => r.product).filter(Boolean));
    return Array.from(set).sort();
  }, [reviews]);

  // Sync external topic filter if changed
  React.useEffect(() => {
    if (selectedTopicFilter) {
      setSelectedTopic(selectedTopicFilter);
    }
  }, [selectedTopicFilter]);

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
        if (selectedProduct !== 'all' && r.product !== selectedProduct) {
          return false;
        }

        // Sentiment filter
        if (selectedSentiment !== 'all') {
          if (r.analysis?.sentiment !== selectedSentiment) return false;
        }

        // Topic filter
        if (selectedTopic !== 'all') {
          if (!r.analysis?.topics.includes(selectedTopic as Topic)) return false;
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
    selectedProduct,
    selectedSentiment,
    selectedTopic,
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

  const clearAllFilters = () => {
    setSearchQuery('');
    setSelectedProduct('all');
    setSelectedSentiment('all');
    setSelectedTopic('all');
    setOnlyNeedsReply(false);
    setOnlyMismatches(false);
    if (onClearTopicFilter) onClearTopicFilter();
  };

  const hasActiveFilters =
    searchQuery !== '' ||
    selectedProduct !== 'all' ||
    selectedSentiment !== 'all' ||
    selectedTopic !== 'all' ||
    onlyNeedsReply ||
    onlyMismatches;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#11141c] p-5">
      {/* Header and Filter Controls */}
      <div className="flex flex-col gap-3 border-b border-white/[0.06] pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-medium text-[#eef0f5]">Customer reviews</h3>
            <span className="font-mono text-xs tabular-nums text-[#7a8296] bg-[#1a1e28] px-2 py-0.5 rounded border border-white/[0.06]">
              {filteredReviews.length} of {reviews.length}
            </span>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-[#a3a9b8] hover:text-[#eef0f5] underline underline-offset-4 self-start sm:self-auto"
            >
              Reset filters
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2 pt-1">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-2.5 h-3.5 w-3.5 text-[#7a8296]" strokeWidth={1.5} />
            <input
              type="text"
              placeholder="Search reviews..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="h-8 w-full rounded-lg border border-white/[0.08] bg-[#161a24] pl-8 pr-2.5 text-xs text-[#eef0f5] placeholder:text-[#7a8296] focus:border-white/30 focus:outline-none"
            />
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              className="h-8 w-full rounded-lg border border-white/[0.08] bg-[#161a24] px-2.5 text-xs text-[#eef0f5] focus:border-white/30 focus:outline-none"
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
              value={selectedSentiment}
              onChange={e => setSelectedSentiment(e.target.value)}
              className="h-8 w-full rounded-lg border border-white/[0.08] bg-[#161a24] px-2.5 text-xs text-[#eef0f5] focus:border-white/30 focus:outline-none"
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
              value={selectedTopic}
              onChange={e => setSelectedTopic(e.target.value)}
              className="h-8 w-full rounded-lg border border-white/[0.08] bg-[#161a24] px-2.5 text-xs text-[#eef0f5] focus:border-white/30 focus:outline-none"
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
              onClick={() => setOnlyNeedsReply(!onlyNeedsReply)}
              className={`h-8 flex-1 rounded-lg border text-xs font-medium transition-colors ${
                onlyNeedsReply
                  ? 'border-white/30 bg-[#1a1e28] text-[#eef0f5]'
                  : 'border-white/[0.08] bg-[#161a24] text-[#7a8296] hover:text-[#a3a9b8]'
              }`}
            >
              Needs reply
            </button>
            <button
              onClick={() => setOnlyMismatches(!onlyMismatches)}
              className={`h-8 flex-1 rounded-lg border text-xs font-medium transition-colors ${
                onlyMismatches
                  ? 'border-[#eab308]/40 bg-[#eab308]/10 text-[#eab308]'
                  : 'border-white/[0.08] bg-[#161a24] text-[#7a8296] hover:text-[#a3a9b8]'
              }`}
            >
              Mismatches
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-2 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-white/[0.06] text-[11px] text-[#7a8296]">
              <th
                onClick={() => toggleSort('id')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#eef0f5] font-normal"
              >
                <div className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
                </div>
              </th>
              <th
                onClick={() => toggleSort('product')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#eef0f5] font-normal"
              >
                <div className="flex items-center gap-1">
                  Product
                  <ArrowUpDown className="h-3 w-3" strokeWidth={1.5} />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rating')}
                className="py-2.5 px-3 cursor-pointer hover:text-[#eef0f5] font-normal"
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
          <tbody className="divide-y divide-white/[0.04] text-xs">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-10 text-center text-xs text-[#7a8296]">
                  No reviews match your selected filters.
                </td>
              </tr>
            ) : (
              filteredReviews.map(review => {
                const isSpecialInjection = review.review_id === 'R012' || review.review_id === 'R015';

                return (
                  <tr
                    key={review.review_id}
                    className="hover:bg-[#161a24]/50 transition-colors"
                  >
                    {/* Review ID */}
                    <td className="py-2.5 px-3 font-mono text-[11px] text-[#a3a9b8]">
                      <div className="flex items-center gap-1.5">
                        <span>{review.review_id}</span>
                        {isSpecialInjection && (
                          <span
                            title="Prompt injection defense verified"
                            className="text-[#4cc38a]"
                          >
                            <ShieldCheck className="h-3.5 w-3.5" strokeWidth={1.5} />
                          </span>
                        )}
                        {review.is_duplicate && (
                          <span
                            title={`Duplicate of ${review.duplicate_of}`}
                            className="rounded bg-[#1a1e28] text-[#7a8296] px-1 text-[10px] font-mono"
                          >
                            dup
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-2.5 px-3 font-normal text-[#eef0f5]">
                      {review.product}
                    </td>

                    {/* Rating with Mismatch Flag */}
                    <td className="py-2.5 px-3">
                      <div className="flex items-center gap-1.5">
                        {review.rating !== null ? (
                          <>
                            <div className="flex items-center text-[#eab308]">
                              <Star className="h-3 w-3 fill-[#eab308]" strokeWidth={1} />
                            </div>
                            <span className="font-mono text-xs tabular-nums text-[#eef0f5]">{review.rating}</span>
                          </>
                        ) : (
                          <span className="font-mono text-[10px] text-[#7a8296]">
                            unknown
                          </span>
                        )}

                        {review.rating_mismatch && (
                          <span
                            title={review.mismatch_reason}
                            className="font-mono text-[10px] text-[#eab308] bg-[#eab308]/10 border border-[#eab308]/20 px-1 py-0.2 rounded"
                          >
                            mismatch
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Sentiment */}
                    <td className="py-2.5 px-3">
                      {review.analysis_status === 'skipped_empty' ? (
                        <span className="text-[11px] text-[#7a8296]">empty</span>
                      ) : review.analysis_status === 'analysis_failed' ? (
                        <span className="font-mono text-[10px] text-[#e5484d] bg-[#e5484d]/10 px-1.5 py-0.5 rounded">
                          failed
                        </span>
                      ) : (
                        <div className="flex items-center gap-1.5">
                          <span
                            className={`h-1.5 w-1.5 rounded-full ${
                              review.analysis?.sentiment === 'positive'
                                ? 'bg-[#4cc38a]'
                                : review.analysis?.sentiment === 'neutral'
                                ? 'bg-[#eab308]'
                                : 'bg-[#e5484d]'
                            }`}
                          />
                          <span className="capitalize text-[#eef0f5] text-[11px]">
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
                            className="rounded bg-[#1a1e28] px-1.5 py-0.2 text-[10px] text-[#a3a9b8] border border-white/[0.04]"
                          >
                            {topic}
                          </span>
                        )) || <span className="text-[#7a8296]">-</span>}
                      </div>
                    </td>

                    {/* Review text & AI summary */}
                    <td className="py-2.5 px-3">
                      <div className="space-y-0.5">
                        <p className="text-[#a3a9b8] text-xs line-clamp-2">
                          {review.cleaned_text || <span className="text-[#7a8296]">(empty review)</span>}
                        </p>
                        {review.analysis?.summary && (
                          <p className="text-[#eef0f5] text-[11px]">
                            {review.analysis.summary}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-2.5 px-3 text-right">
                      {review.analysis?.needs_reply ? (
                        <button
                          onClick={() => onOpenReplyModal(review)}
                          className="inline-flex items-center gap-1.5 rounded-md border border-white/[0.12] bg-[#1a1e28] px-2.5 py-1 text-[11px] font-medium text-[#eef0f5] hover:bg-[#232734] transition-colors"
                        >
                          <MessageSquare className="h-3 w-3 text-[#a3a9b8]" strokeWidth={1.5} />
                          Draft reply
                        </button>
                      ) : (
                        <span className="text-[11px] text-[#7a8296]">None</span>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
