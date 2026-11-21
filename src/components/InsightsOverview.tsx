'use client';

import React from 'react';
import { MetricItem } from '@/types/review';
import { ArrowUpRight } from 'lucide-react';

interface InsightsOverviewProps {
  topComplaints: MetricItem[];
  topPraises: MetricItem[];
  onSelectTopic?: (topic: string) => void;
}

export const InsightsOverview: React.FC<InsightsOverviewProps> = ({
  topComplaints,
  topPraises,
  onSelectTopic,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
      {/* Top Complaints */}
      <div className="rounded-lg border border-[#23252a] bg-[#0f1011] p-4">
        <div className="flex items-baseline justify-between border-b border-[#23252a] pb-3">
          <div>
            <h3 className="text-sm font-medium text-[#f7f8f8]">Top complaints</h3>
            <p className="text-xs text-[#8a8f98] mt-0.5">Recurring failure patterns across products</p>
          </div>
          <span className="font-mono text-[11px] text-[#eb5757] bg-[#eb5757]/10 px-2 py-0.5 rounded border border-[#eb5757]/20">
            Action needed
          </span>
        </div>

        <div className="mt-3.5 space-y-2">
          {topComplaints.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#62666d]">No complaints detected</div>
          ) : (
            topComplaints.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col gap-1.5 rounded-md border border-[#23252a] bg-[#141516]/60 p-3 hover:border-[#34343a] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-xs text-[#62666d] shrink-0 pt-0.5">
                      0{index + 1}
                    </span>
                    <p className="text-xs font-normal text-[#f7f8f8] leading-relaxed">{item.text}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[#d0d6e0] bg-[#18191a] px-2 py-0.5 rounded border border-[#23252a]">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-[#62666d]">
                  <span>Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <span key={pIdx} className="rounded bg-[#18191a] px-1.5 py-0.2 text-[11px] text-[#8a8f98]">
                      {p}
                    </span>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-[#62666d]">+{item.products.length - 2} more</span>
                  )}
                  {item.topics[0] && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(item.topics[0])}
                      className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
                    >
                      Filter {item.topics[0]}
                      <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top Praises */}
      <div className="rounded-lg border border-[#23252a] bg-[#0f1011] p-4">
        <div className="flex items-baseline justify-between border-b border-[#23252a] pb-3">
          <div>
            <h3 className="text-sm font-medium text-[#f7f8f8]">Top praises</h3>
            <p className="text-xs text-[#8a8f98] mt-0.5">Highest-rated product aspects</p>
          </div>
          <span className="font-mono text-[11px] text-[#27a644] bg-[#27a644]/10 px-2 py-0.5 rounded border border-[#27a644]/20">
            Strengths
          </span>
        </div>

        <div className="mt-3.5 space-y-2">
          {topPraises.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#62666d]">No positive reviews detected</div>
          ) : (
            topPraises.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col gap-1.5 rounded-md border border-[#23252a] bg-[#141516]/60 p-3 hover:border-[#34343a] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="font-mono text-xs text-[#62666d] shrink-0 pt-0.5">
                      0{index + 1}
                    </span>
                    <p className="text-xs font-normal text-[#f7f8f8] leading-relaxed">{item.text}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[#d0d6e0] bg-[#18191a] px-2 py-0.5 rounded border border-[#23252a]">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-[#62666d]">
                  <span>Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <span key={pIdx} className="rounded bg-[#18191a] px-1.5 py-0.2 text-[11px] text-[#8a8f98]">
                      {p}
                    </span>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-[#62666d]">+{item.products.length - 2} more</span>
                  )}
                  {item.topics[0] && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(item.topics[0])}
                      className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
                    >
                      Filter {item.topics[0]}
                      <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
