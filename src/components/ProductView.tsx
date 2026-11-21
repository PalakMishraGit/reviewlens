'use client';

import React from 'react';
import { ProductInsight } from '@/types/review';
import { Star } from 'lucide-react';

interface ProductViewProps {
  insights: ProductInsight[];
  onSelectProduct?: (productName: string) => void;
}

export const ProductView: React.FC<ProductViewProps> = ({
  insights,
  onSelectProduct,
}) => {
  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#11141c] p-5">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-white/[0.06] pb-3">
        <div>
          <h3 className="text-sm font-medium text-[#eef0f5]">Product analytics</h3>
          <p className="text-xs text-[#7a8296] mt-0.5">
            Sentiment split, rating average, and issues per product
          </p>
        </div>
        <span className="font-mono text-xs text-[#7a8296]">
          {insights.length} products tracked
        </span>
      </div>

      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {insights.map(p => {
          return (
            <div
              key={p.product}
              className="flex flex-col justify-between rounded-lg border border-white/[0.06] bg-[#161a24]/60 p-4 hover:border-white/[0.12] transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-medium text-[#eef0f5] line-clamp-1">{p.product}</h4>
                  <span className="font-mono text-[11px] tabular-nums text-[#7a8296] shrink-0">
                    {p.total_reviews} reviews
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {p.average_rating !== null ? (
                    <div className="flex items-center gap-1 text-[#eab308]">
                      <Star className="h-3 w-3 fill-[#eab308]" strokeWidth={1} />
                      <span className="font-mono font-medium text-[#eef0f5]">{p.average_rating}</span>
                      <span className="text-[#7a8296] text-[11px]">/ 5.0</span>
                    </div>
                  ) : (
                    <span className="text-[#7a8296] text-[11px]">No rating</span>
                  )}

                  {p.rating_mismatches > 0 && (
                    <span className="font-mono text-[10px] text-[#eab308] bg-[#eab308]/10 border border-[#eab308]/20 px-1 py-0.2 rounded">
                      {p.rating_mismatches} mismatch
                    </span>
                  )}
                </div>

                {/* Sentiment Distribution Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#7a8296]">
                    <span>Sentiment split</span>
                    <span className="font-mono tabular-nums">
                      <span className="text-[#4cc38a]">{p.sentiment_percentages.positive}%</span> /{' '}
                      <span className="text-[#eab308]">{p.sentiment_percentages.neutral}%</span> /{' '}
                      <span className="text-[#e5484d]">{p.sentiment_percentages.negative}%</span>
                    </span>
                  </div>

                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#1a1e28]">
                    <div
                      title={`Positive: ${p.sentiment_percentages.positive}%`}
                      className="bg-[#4cc38a]"
                      style={{ width: `${p.sentiment_percentages.positive}%` }}
                    />
                    <div
                      title={`Neutral: ${p.sentiment_percentages.neutral}%`}
                      className="bg-[#eab308]"
                      style={{ width: `${p.sentiment_percentages.neutral}%` }}
                    />
                    <div
                      title={`Negative: ${p.sentiment_percentages.negative}%`}
                      className="bg-[#e5484d]"
                      style={{ width: `${p.sentiment_percentages.negative}%` }}
                    />
                  </div>
                </div>

                {/* Top Topics */}
                <div className="mt-3">
                  <div className="flex flex-wrap gap-1">
                    {p.top_topics.map(t => (
                      <span
                        key={t.topic}
                        className="rounded bg-[#1a1e28] px-1.5 py-0.2 text-[10px] text-[#a3a9b8] border border-white/[0.04]"
                      >
                        {t.topic} ({t.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-2.5 border-t border-white/[0.04] flex items-center justify-between text-[11px]">
                <span className="text-[#a3a9b8]">
                  {p.needs_reply_count} {p.needs_reply_count === 1 ? 'reply needed' : 'replies needed'}
                </span>

                {onSelectProduct && (
                  <button
                    onClick={() => onSelectProduct(p.product)}
                    className="text-[#a3a9b8] hover:text-[#eef0f5] underline underline-offset-2"
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
