'use client';

import React from 'react';
import { ProductInsight } from '@/types/review';
import { Star, MessageSquareReply, AlertTriangle, Package, TrendingUp } from 'lucide-react';

interface ProductViewProps {
  insights: ProductInsight[];
  onSelectProduct?: (productName: string) => void;
}

export const ProductView: React.FC<ProductViewProps> = ({
  insights,
  onSelectProduct,
}) => {
  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-6 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-800 pb-5">
        <div>
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Package className="h-5 w-5 text-indigo-400" />
            Product Analytics &amp; Performance Breakdown
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Individual product sentiment distributions, customer rating averages, and recurring topics
          </p>
        </div>
        <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20 self-start sm:self-auto">
          {insights.length} Products Tracked
        </span>
      </div>

      <div className="mt-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {insights.map(p => {
          return (
            <div
              key={p.product}
              className="flex flex-col justify-between rounded-xl border border-slate-800/80 bg-slate-950/60 p-5 hover:border-slate-700 transition-all hover:shadow-lg"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-sm font-bold text-slate-100 line-clamp-1">{p.product}</h4>
                  <span className="rounded bg-slate-800 px-2 py-0.5 text-xs font-semibold text-slate-300 shrink-0">
                    {p.total_reviews} reviews
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {p.average_rating !== null ? (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3.5 w-3.5 fill-amber-400" />
                      <span className="font-bold">{p.average_rating}</span>
                      <span className="text-slate-500 text-[11px]">/ 5.0</span>
                    </div>
                  ) : (
                    <span className="text-slate-500 text-[11px]">No numerical ratings</span>
                  )}

                  {p.rating_mismatches > 0 && (
                    <span className="inline-flex items-center gap-1 rounded bg-orange-500/10 px-1.5 py-0.5 text-[10px] font-medium text-orange-400 border border-orange-500/30">
                      <AlertTriangle className="h-3 w-3" />
                      {p.rating_mismatches} mismatch
                    </span>
                  )}
                </div>

                {/* Sentiment Distribution Bar */}
                <div className="mt-4 space-y-1.5">
                  <div className="flex justify-between text-[11px] text-slate-400">
                    <span>Sentiment Split</span>
                    <span>
                      <strong className="text-emerald-400">{p.sentiment_percentages.positive}%</strong> pos /{' '}
                      <strong className="text-amber-400">{p.sentiment_percentages.neutral}%</strong> neu /{' '}
                      <strong className="text-rose-400">{p.sentiment_percentages.negative}%</strong> neg
                    </span>
                  </div>

                  <div className="flex h-2 w-full overflow-hidden rounded-full bg-slate-800">
                    <div
                      title={`Positive: ${p.sentiment_percentages.positive}%`}
                      className="bg-emerald-500 transition-all"
                      style={{ width: `${p.sentiment_percentages.positive}%` }}
                    />
                    <div
                      title={`Neutral: ${p.sentiment_percentages.neutral}%`}
                      className="bg-amber-500 transition-all"
                      style={{ width: `${p.sentiment_percentages.neutral}%` }}
                    />
                    <div
                      title={`Negative: ${p.sentiment_percentages.negative}%`}
                      className="bg-rose-500 transition-all"
                      style={{ width: `${p.sentiment_percentages.negative}%` }}
                    />
                  </div>
                </div>

                {/* Top Topics */}
                <div className="mt-4 space-y-1">
                  <span className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
                    Common Topics
                  </span>
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {p.top_topics.length > 0 ? (
                      p.top_topics.map(t => (
                        <span
                          key={t.topic}
                          className="rounded-md bg-slate-800/90 px-2 py-0.5 text-[11px] text-slate-300 border border-slate-700/60"
                        >
                          {t.topic} ({t.count})
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500">None identified</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-5 pt-3 border-t border-slate-800/60 flex items-center justify-between text-xs">
                <span className="text-indigo-300 font-medium flex items-center gap-1 text-[11px]">
                  <MessageSquareReply className="h-3.5 w-3.5" />
                  {p.needs_reply_count} {p.needs_reply_count === 1 ? 'reply needed' : 'replies needed'}
                </span>

                {onSelectProduct && (
                  <button
                    onClick={() => onSelectProduct(p.product)}
                    className="text-xs text-indigo-400 hover:text-indigo-300 font-medium underline underline-offset-2"
                  >
                    View in table &rarr;
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
