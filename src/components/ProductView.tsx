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
    <div className="rounded-lg border border-[#23252a] bg-[#0f1011] p-4">
      <div className="flex flex-col sm:flex-row sm:items-baseline justify-between gap-2 border-b border-[#23252a] pb-3">
        <div>
          <h3 className="text-sm font-medium text-[#f7f8f8]">Product analytics</h3>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Sentiment split, rating average, and issues per product
          </p>
        </div>
        <span className="font-mono text-xs text-[#62666d]">
          {insights.length} products tracked
        </span>
      </div>

      <div className="mt-3.5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {insights.map(p => {
          return (
            <div
              key={p.product}
              className="flex flex-col justify-between rounded-md border border-[#23252a] bg-[#141516]/60 p-3.5 hover:border-[#34343a] transition-colors"
            >
              <div>
                {/* Header */}
                <div className="flex items-start justify-between gap-2">
                  <h4 className="text-xs font-medium text-[#f7f8f8] line-clamp-1">{p.product}</h4>
                  <span className="font-mono text-[11px] tabular-nums text-[#62666d] shrink-0">
                    {p.total_reviews} reviews
                  </span>
                </div>

                {/* Rating */}
                <div className="mt-2 flex items-center gap-2 text-xs">
                  {p.average_rating !== null ? (
                    <div className="flex items-center gap-1 text-[#f59e0b]">
                      <Star className="h-3 w-3 fill-[#f59e0b]" strokeWidth={1} />
                      <span className="font-mono font-medium text-[#f7f8f8]">{p.average_rating}</span>
                      <span className="text-[#62666d] text-[11px]">/ 5.0</span>
                    </div>
                  ) : (
                    <span className="text-[#62666d] text-[11px]">No rating</span>
                  )}

                  {p.rating_mismatches > 0 && (
                    <span className="font-mono text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 border border-[#f59e0b]/20 px-1 py-0.2 rounded">
                      {p.rating_mismatches} mismatch
                    </span>
                  )}
                </div>

                {/* Sentiment Distribution Bar */}
                <div className="mt-3 space-y-1">
                  <div className="flex justify-between text-[11px] text-[#62666d]">
                    <span>Sentiment split</span>
                    <span className="font-mono tabular-nums">
                      <span className="text-[#27a644]">{p.sentiment_percentages.positive}%</span> /{' '}
                      <span className="text-[#f59e0b]">{p.sentiment_percentages.neutral}%</span> /{' '}
                      <span className="text-[#eb5757]">{p.sentiment_percentages.negative}%</span>
                    </span>
                  </div>

                  <div className="flex h-1.5 w-full overflow-hidden rounded-full bg-[#18191a]">
                    <div
                      title={`Positive: ${p.sentiment_percentages.positive}%`}
                      className="bg-[#27a644]"
                      style={{ width: `${p.sentiment_percentages.positive}%` }}
                    />
                    <div
                      title={`Neutral: ${p.sentiment_percentages.neutral}%`}
                      className="bg-[#f59e0b]"
                      style={{ width: `${p.sentiment_percentages.neutral}%` }}
                    />
                    <div
                      title={`Negative: ${p.sentiment_percentages.negative}%`}
                      className="bg-[#eb5757]"
                      style={{ width: `${p.sentiment_percentages.negative}%` }}
                    />
                  </div>
                </div>

                {/* Top Topics */}
                <div className="mt-2.5">
                  <div className="flex flex-wrap gap-1">
                    {p.top_topics.map(t => (
                      <span
                        key={t.topic}
                        className="rounded bg-[#18191a] px-1.5 py-0.2 text-[10px] text-[#8a8f98] border border-[#23252a]"
                      >
                        {t.topic} ({t.count})
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className="mt-3.5 pt-2 border-t border-[#23252a] flex items-center justify-between text-[11px]">
                <span className="text-[#8a8f98]">
                  {p.needs_reply_count} {p.needs_reply_count === 1 ? 'reply needed' : 'replies needed'}
                </span>

                {onSelectProduct && (
                  <button
                    onClick={() => onSelectProduct(p.product)}
                    className="text-[#8a8f98] hover:text-[#f7f8f8] underline underline-offset-2"
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
