'use client';

import React, { useState, useMemo } from 'react';
import { CleanedReview, Sentiment, Topic } from '@/types/review';
import {
  Search,
  Filter,
  Star,
  MessageSquareReply,
  AlertTriangle,
  Copy,
  Check,
  ShieldAlert,
  Sparkles,
  Layers,
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
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-sm">
      {/* Header and Filter Controls */}
      <div className="flex flex-col gap-4 border-b border-slate-800 pb-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Layers className="h-5 w-5 text-indigo-400" />
              Customer Reviews Explorer
              <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-xs font-medium text-slate-300">
                {filteredReviews.length} of {reviews.length}
              </span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Filter by product, sentiment, detected topic, or unresolved customer issues
            </p>
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAllFilters}
              className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-4 self-start sm:self-auto"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Filter Toolbar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-2">
          {/* Search Input */}
          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-500" />
            <input
              type="text"
              placeholder="Search text, ID, summary..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 pl-9 pr-3 text-xs text-slate-200 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none"
            />
          </div>

          {/* Product Filter */}
          <div>
            <select
              value={selectedProduct}
              onChange={e => setSelectedProduct(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Products ({products.length})</option>
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
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Sentiments</option>
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
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 py-2 px-3 text-xs text-slate-200 focus:border-indigo-500 focus:outline-none"
            >
              <option value="all">All Topics</option>
              <option value="quality">Quality</option>
              <option value="delivery">Delivery</option>
              <option value="price">Price</option>
              <option value="packaging">Packaging</option>
              <option value="support">Support</option>
              <option value="size_fit">Size & Fit</option>
              <option value="other">Other</option>
            </select>
          </div>

          {/* Toggles */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setOnlyNeedsReply(!onlyNeedsReply)}
              className={`flex-1 rounded-xl border py-2 px-2.5 text-[11px] font-semibold transition-all ${
                onlyNeedsReply
                  ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              Needs Reply
            </button>
            <button
              onClick={() => setOnlyMismatches(!onlyMismatches)}
              className={`flex-1 rounded-xl border py-2 px-2.5 text-[11px] font-semibold transition-all ${
                onlyMismatches
                  ? 'border-orange-500 bg-orange-500/20 text-orange-300'
                  : 'border-slate-800 bg-slate-950/80 text-slate-400 hover:border-slate-700'
              }`}
            >
              Mismatches
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="mt-4 overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 text-[11px] uppercase tracking-wider text-slate-400">
              <th
                onClick={() => toggleSort('id')}
                className="py-3 px-3 cursor-pointer hover:text-white font-semibold"
              >
                <div className="flex items-center gap-1">
                  ID
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('product')}
                className="py-3 px-3 cursor-pointer hover:text-white font-semibold"
              >
                <div className="flex items-center gap-1">
                  Product
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th
                onClick={() => toggleSort('rating')}
                className="py-3 px-3 cursor-pointer hover:text-white font-semibold"
              >
                <div className="flex items-center gap-1">
                  Rating
                  <ArrowUpDown className="h-3 w-3" />
                </div>
              </th>
              <th className="py-3 px-3 font-semibold">Sentiment</th>
              <th className="py-3 px-3 font-semibold">Topics</th>
              <th className="py-3 px-4 font-semibold min-w-[260px]">Customer Review & AI Summary</th>
              <th className="py-3 px-3 text-right font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/60 text-xs">
            {filteredReviews.length === 0 ? (
              <tr>
                <td colSpan={7} className="py-12 text-center text-slate-500">
                  No reviews match your selected filter criteria.
                </td>
              </tr>
            ) : (
              filteredReviews.map(review => {
                const isSpecialInjection = review.review_id === 'R012' || review.review_id === 'R015';

                return (
                  <tr
                    key={review.review_id}
                    className="group hover:bg-slate-800/30 transition-colors"
                  >
                    {/* Review ID */}
                    <td className="py-3 px-3 font-mono font-medium text-slate-300">
                      <div className="flex items-center gap-1.5">
                        <span>{review.review_id}</span>
                        {isSpecialInjection && (
                          <span
                            title="Tested for prompt injection resistance"
                            className="rounded bg-rose-500/20 text-rose-300 p-0.5"
                          >
                            <ShieldAlert className="h-3 w-3" />
                          </span>
                        )}
                        {review.is_duplicate && (
                          <span
                            title={`Duplicate of ${review.duplicate_of}`}
                            className="rounded bg-slate-800 text-slate-400 px-1 text-[10px]"
                          >
                            dup
                          </span>
                        )}
                      </div>
                    </td>

                    {/* Product */}
                    <td className="py-3 px-3 font-medium text-slate-200">
                      {review.product}
                    </td>

                    {/* Rating with Mismatch Flag */}
                    <td className="py-3 px-3">
                      <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-1">
                          {review.rating !== null ? (
                            <>
                              <div className="flex items-center text-amber-400">
                                {Array.from({ length: 5 }).map((_, i) => (
                                  <Star
                                    key={i}
                                    className={`h-3 w-3 ${
                                      i < review.rating! ? 'fill-amber-400' : 'text-slate-700'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="font-semibold text-slate-300 ml-1">{review.rating}</span>
                            </>
                          ) : (
                            <span className="rounded bg-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400">
                              Unknown (was: &quot;{review.raw_rating}&quot;)
                            </span>
                          )}
                        </div>

                        {review.rating_mismatch && (
                          <div
                            title={review.mismatch_reason}
                            className="inline-flex items-center gap-1 rounded bg-orange-500/10 border border-orange-500/30 px-1.5 py-0.5 text-[10px] font-semibold text-orange-400"
                          >
                            <AlertTriangle className="h-2.5 w-2.5" />
                            Mismatch
                          </div>
                        )}
                      </div>
                    </td>

                    {/* Sentiment */}
                    <td className="py-3 px-3">
                      {review.analysis_status === 'skipped_empty' ? (
                        <span className="rounded-full bg-slate-800 px-2.5 py-1 text-[11px] font-medium text-slate-400">
                          Empty
                        </span>
                      ) : review.analysis_status === 'analysis_failed' ? (
                        <span className="rounded-full bg-rose-500/20 px-2.5 py-1 text-[11px] font-medium text-rose-300 border border-rose-500/30">
                          Analysis Failed
                        </span>
                      ) : (
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold border ${
                            review.analysis?.sentiment === 'positive'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : review.analysis?.sentiment === 'neutral'
                              ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                              : 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                          }`}
                        >
                          {review.analysis?.sentiment}
                        </span>
                      )}
                    </td>

                    {/* Topics */}
                    <td className="py-3 px-3">
                      <div className="flex flex-wrap gap-1 max-w-[160px]">
                        {review.analysis?.topics?.map(topic => (
                          <span
                            key={topic}
                            className="rounded-md bg-slate-800/80 px-1.5 py-0.5 text-[10px] font-medium text-slate-300 border border-slate-700/50"
                          >
                            {topic}
                          </span>
                        )) || <span className="text-slate-500">-</span>}
                      </div>
                    </td>

                    {/* Review text & AI summary */}
                    <td className="py-3 px-4">
                      <div className="space-y-1">
                        <p className="text-slate-300 italic line-clamp-2">
                          &quot;{review.cleaned_text || <span className="text-slate-600">(empty review text)</span>}&quot;
                        </p>
                        {review.analysis?.summary && (
                          <p className="text-indigo-300 font-medium text-[11px] flex items-center gap-1.5">
                            <Sparkles className="h-3 w-3 shrink-0 text-indigo-400" />
                            {review.analysis.summary}
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Action */}
                    <td className="py-3 px-3 text-right">
                      {review.analysis?.needs_reply ? (
                        <button
                          onClick={() => onOpenReplyModal(review)}
                          className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-3 py-1.5 text-[11px] font-semibold text-indigo-300 hover:bg-indigo-600/30 hover:border-indigo-500/70 transition-all shadow-sm"
                        >
                          <MessageSquareReply className="h-3 w-3" />
                          Draft Reply
                        </button>
                      ) : (
                        <span className="text-[11px] text-slate-500">No reply needed</span>
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
