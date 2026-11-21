'use client';

import React from 'react';
import { ProductInsight } from '@/types/review';
import { Star, AlertTriangle, ArrowRight, Package } from 'lucide-react';

interface ProductViewProps {
  insights: ProductInsight[];
  onSelectProduct?: (productName: string) => void;
}

export const ProductView: React.FC<ProductViewProps> = ({
  insights,
  onSelectProduct,
}) => {
  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sm space-y-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-hairline pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-ink font-sans">
              Product Intelligence &amp; Analytics
            </h3>
            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-ink-subtle border border-hairline">
              Catalog View
            </span>
          </div>
          <p className="text-[11px] text-ink-subtle mt-0.5">
            Cross-product sentiment split, average star ratings, and recurring issue clusters
          </p>
        </div>
        <span className="font-mono text-xs text-ink-tertiary">
          {insights.length} catalog items
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map(p => {
          return (
            <div
              key={p.product}
              className="flex flex-col justify-between rounded-xl border border-hairline bg-surface-2 p-3.5 hover:border-hairline-strong hover:bg-surface-3 transition-all shadow-sm"
            >
              <div>
                {/* Product Title & Reviews Count */}
                <div className="flex items-start justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <div className="flex h-6 w-6 items-center justify-center rounded bg-surface-1 border border-hairline text-ink">
                      <Package className="h-3 w-3" />
                    </div>
                    <h4 className="text-xs font-semibold text-ink line-clamp-1">{p.product}</h4>
                  </div>
                  <span className="font-mono text-[10px] tabular-nums text-ink-tertiary shrink-0">
                    {p.total_reviews} reviews
                  </span>
                </div>

                {/* Star Rating & Mismatch badge */}
                <div className="mt-2.5 flex items-center gap-2 text-xs font-mono">
                  {p.average_rating !== null ? (
                    <div className="flex items-center gap-1 text-amber-400">
                      <Star className="h-3 w-3 fill-amber-400" />
                      <span className="font-bold text-ink">{p.average_rating}</span>
                      <span className="text-ink-tertiary text-[10px]">/ 5.0</span>
                    </div>
                  ) : (
                    <span className="text-ink-tertiary text-[10px]">No rating</span>
                  )}

                  {p.rating_mismatches > 0 && (
                    <span className="flex items-center gap-1 text-[9px] text-amber-400 bg-amber-500/15 border border-amber-500/30 px-1.5 py-0.2 rounded">
                      <AlertTriangle className="h-2 w-2" />
                      {p.rating_mismatches} mismatch
                    </span>
                  )}
                </div>

                {/* Sentiment Breakdown Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-ink-tertiary">
                    <span>Sentiment split</span>
                    <span className="tabular-nums">
                      <span className="text-emerald-500">{p.sentiment_percentages.positive}%</span> /{' '}
                      <span className="text-amber-500">{p.sentiment_percentages.neutral}%</span> /{' '}
                      <span className="text-rose-500">{p.sentiment_percentages.negative}%</span>
                    </span>
                  </div>

                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-surface-1 p-0.2 gap-0.5 shadow-inner">
                    <div
                      title={`Positive: ${p.sentiment_percentages.positive}%`}
                      className="bg-emerald-500 rounded-l-full"
                      style={{ width: `${p.sentiment_percentages.positive}%` }}
                    />
                    <div
                      title={`Neutral: ${p.sentiment_percentages.neutral}%`}
                      className="bg-amber-500"
                      style={{ width: `${p.sentiment_percentages.neutral}%` }}
                    />
                    <div
                      title={`Negative: ${p.sentiment_percentages.negative}%`}
                      className="bg-rose-500 rounded-r-full"
                      style={{ width: `${p.sentiment_percentages.negative}%` }}
                    />
                  </div>
                </div>

                {/* Top Topics */}
                <div className="mt-2.5">
                  <div className="flex flex-wrap gap-1 font-mono">
                    {p.top_topics.map(t => (
                      <span
                        key={t.topic}
                        className="rounded bg-surface-1 px-1.5 py-0.2 text-[9px] text-ink-subtle border border-hairline"
                      >
                        {t.topic} ({t.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer */}
              <div className="mt-3.5 pt-2 border-t border-hairline flex items-center justify-between text-[11px] font-mono">
                <span className="text-ink-tertiary text-[10px]">
                  {p.needs_reply_count} reply needed
                </span>

                {onSelectProduct && (
                  <button
                    onClick={() => onSelectProduct(p.product)}
                    className="flex items-center gap-1 text-ink-muted hover:text-ink text-[10px] transition-colors"
                  >
                    <span>View in table</span>
                    <ArrowRight className="h-2.5 w-2.5" />
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
