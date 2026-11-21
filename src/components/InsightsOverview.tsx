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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Top Complaints */}
      <div className="rounded-xl border border-white/[0.08] bg-[#11141c] p-5">
        <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h3 className="text-sm font-medium text-[#eef0f5]">Top complaints</h3>
            <p className="text-xs text-[#7a8296] mt-0.5">Recurring failure patterns across products</p>
          </div>
          <span className="font-mono text-[11px] text-[#e5484d] bg-[#e5484d]/10 px-2 py-0.5 rounded border border-[#e5484d]/20">
            Store action needed
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {topComplaints.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#7a8296]">No complaints detected</div>
          ) : (
            topComplaints.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col gap-2 rounded-lg border border-white/[0.04] bg-[#161a24]/60 p-3.5 hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#7a8296] shrink-0 pt-0.5">
                      0{index + 1}
                    </span>
                    <p className="text-xs font-normal text-[#eef0f5] leading-relaxed">{item.text}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[#eef0f5] bg-[#1a1e28] px-2 py-0.5 rounded border border-white/[0.06]">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#7a8296]">
                  <span>Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <span key={pIdx} className="rounded bg-[#1a1e28] px-1.5 py-0.2 text-[11px] text-[#a3a9b8]">
                      {p}
                    </span>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-[#7a8296]">+{item.products.length - 2} more</span>
                  )}
                  {item.topics[0] && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(item.topics[0])}
                      className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-[#a3a9b8] hover:text-[#eef0f5] transition-colors"
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
      <div className="rounded-xl border border-white/[0.08] bg-[#11141c] p-5">
        <div className="flex items-baseline justify-between border-b border-white/[0.06] pb-3">
          <div>
            <h3 className="text-sm font-medium text-[#eef0f5]">Top praises</h3>
            <p className="text-xs text-[#7a8296] mt-0.5">Highest-rated product aspects</p>
          </div>
          <span className="font-mono text-[11px] text-[#4cc38a] bg-[#4cc38a]/10 px-2 py-0.5 rounded border border-[#4cc38a]/20">
            Strengths
          </span>
        </div>

        <div className="mt-4 space-y-2.5">
          {topPraises.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#7a8296]">No positive reviews detected</div>
          ) : (
            topPraises.map((item, index) => (
              <div
                key={index}
                className="group flex flex-col gap-2 rounded-lg border border-white/[0.04] bg-[#161a24]/60 p-3.5 hover:border-white/[0.1] transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#7a8296] shrink-0 pt-0.5">
                      0{index + 1}
                    </span>
                    <p className="text-xs font-normal text-[#eef0f5] leading-relaxed">{item.text}</p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[#eef0f5] bg-[#1a1e28] px-2 py-0.5 rounded border border-white/[0.06]">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-[#7a8296]">
                  <span>Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <span key={pIdx} className="rounded bg-[#1a1e28] px-1.5 py-0.2 text-[11px] text-[#a3a9b8]">
                      {p}
                    </span>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-[#7a8296]">+{item.products.length - 2} more</span>
                  )}
                  {item.topics[0] && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(item.topics[0])}
                      className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-[#a3a9b8] hover:text-[#eef0f5] transition-colors"
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
