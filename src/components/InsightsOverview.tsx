'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MetricItem } from '@/types/review';
import { ArrowUpRight, Filter } from 'lucide-react';

interface InsightsOverviewProps {
  topComplaints: MetricItem[];
  topPraises: MetricItem[];
  onSelectTopic?: (topic: string, product?: string) => void;
}

export const InsightsOverview: React.FC<InsightsOverviewProps> = ({
  topComplaints,
  topPraises,
  onSelectTopic,
}) => {
  return (
    <div className="grid grid-cols-1 gap-3.5 lg:grid-cols-2">
      {/* Top Complaints */}
      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-4">
        <div className="flex items-baseline justify-between border-b border-[#23252a] pb-3">
          <div>
            <h3 className="text-sm font-medium text-[#f7f8f8] flex items-center gap-1.5">
              Top complaints
              <span className="font-mono text-[10px] text-[#eb5757] bg-[#eb5757]/10 px-1.5 py-0.5 rounded border border-[#eb5757]/20">
                Action needed
              </span>
            </h3>
            <p className="text-xs text-[#8a8f98] mt-0.5">Click any issue to filter matching reviews</p>
          </div>
          <span className="text-[11px] text-[#62666d]">By frequency</span>
        </div>

        <div className="mt-3.5 space-y-2">
          {topComplaints.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#62666d]">No complaints detected</div>
          ) : (
            topComplaints.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1.5 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-2 rounded-lg border border-[#23252a] bg-[#141516]/60 p-3 hover:border-[#eb5757]/40 hover:bg-[#141516] transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#eb5757] bg-[#eb5757]/10 border border-[#eb5757]/20 px-1.5 py-0.2 rounded shrink-0">
                      #{index + 1}
                    </span>
                    <p className="text-xs font-normal text-[#f7f8f8] leading-relaxed group-hover:text-white">
                      {item.text}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[#eb5757] bg-[#eb5757]/10 px-2 py-0.5 rounded border border-[#eb5757]/20">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-[#62666d]">
                  <span>Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={e => {
                        e.stopPropagation();
                        if (onSelectTopic) onSelectTopic(item.topics[0], p);
                      }}
                      className="rounded bg-[#18191a] px-1.5 py-0.2 text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#23252a] transition-colors border border-[#23252a]"
                    >
                      {p}
                    </button>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-[#62666d]">+{item.products.length - 2} more</span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-[#5e6ad2] opacity-80 group-hover:opacity-100 transition-opacity">
                    Filter table
                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Top Praises */}
      <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-4">
        <div className="flex items-baseline justify-between border-b border-[#23252a] pb-3">
          <div>
            <h3 className="text-sm font-medium text-[#f7f8f8] flex items-center gap-1.5">
              Top praises
              <span className="font-mono text-[11px] text-[#27a644] bg-[#27a644]/10 px-1.5 py-0.5 rounded border border-[#27a644]/20">
                Strengths
              </span>
            </h3>
            <p className="text-xs text-[#8a8f98] mt-0.5">Click any praise to filter matching reviews</p>
          </div>
          <span className="text-[11px] text-[#62666d]">By frequency</span>
        </div>

        <div className="mt-3.5 space-y-2">
          {topPraises.length === 0 ? (
            <div className="py-6 text-center text-xs text-[#62666d]">No positive reviews detected</div>
          ) : (
            topPraises.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1.5 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-2 rounded-lg border border-[#23252a] bg-[#141516]/60 p-3 hover:border-[#27a644]/40 hover:bg-[#141516] transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="font-mono text-xs text-[#27a644] bg-[#27a644]/10 border border-[#27a644]/20 px-1.5 py-0.2 rounded shrink-0">
                      #{index + 1}
                    </span>
                    <p className="text-xs font-normal text-[#f7f8f8] leading-relaxed group-hover:text-white">
                      {item.text}
                    </p>
                  </div>
                  <span className="shrink-0 font-mono text-xs tabular-nums text-[#27a644] bg-[#27a644]/10 px-2 py-0.5 rounded border border-[#27a644]/20">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[11px] text-[#62666d]">
                  <span>Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <button
                      key={pIdx}
                      onClick={e => {
                        e.stopPropagation();
                        if (onSelectTopic) onSelectTopic(item.topics[0], p);
                      }}
                      className="rounded bg-[#18191a] px-1.5 py-0.2 text-[11px] text-[#8a8f98] hover:text-[#f7f8f8] hover:bg-[#23252a] transition-colors border border-[#23252a]"
                    >
                      {p}
                    </button>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-[#62666d]">+{item.products.length - 2} more</span>
                  )}
                  <span className="ml-auto inline-flex items-center gap-0.5 text-[11px] text-[#5e6ad2] opacity-80 group-hover:opacity-100 transition-opacity">
                    Filter table
                    <ArrowUpRight className="h-3 w-3" strokeWidth={1.5} />
                  </span>
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
