'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MetricItem } from '@/types/review';
import { ChevronRight } from 'lucide-react';

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
      {/* Top Complaints Card */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-ink flex items-center gap-2 font-sans">
              Top Customer Complaints
            </h3>
            <span className="rounded bg-rose-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-rose-500 border border-rose-500/20">
              Action Needed
            </span>
          </div>
          <span className="text-[11px] text-ink-tertiary font-mono">Ranked by count</span>
        </div>

        <div className="space-y-2">
          {topComplaints.length === 0 ? (
            <div className="py-6 text-center text-xs text-ink-tertiary">No complaints detected in this dataset</div>
          ) : (
            topComplaints.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-1.5 rounded-xl border border-hairline bg-surface-2 p-3 hover:border-hairline-strong hover:bg-surface-3 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-surface-3 border border-hairline font-mono text-[10px] font-semibold text-rose-400">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-ink group-hover:text-ink transition-colors leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    <span className="text-[11px] text-rose-400 bg-rose-500/10 border border-rose-500/20 px-1.5 py-0.2 rounded">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-tertiary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Affected Products */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-ink-subtle font-mono">
                  <span className="text-ink-tertiary uppercase">Products:</span>
                  {item.products.slice(0, 3).map((prod, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded bg-surface-1 px-1.5 py-0.2 text-[10px] text-ink-muted border border-hairline"
                    >
                      {prod}
                    </span>
                  ))}
                  {item.products.length > 3 && (
                    <span className="text-ink-tertiary">
                      +{item.products.length - 3} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>

      {/* Top Praises Card */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sm space-y-3.5">
        <div className="flex items-center justify-between border-b border-hairline pb-3">
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-ink flex items-center gap-2 font-sans">
              Top Customer Praises
            </h3>
            <span className="rounded bg-emerald-500/10 px-1.5 py-0.5 text-[10px] font-mono font-medium text-emerald-500 border border-emerald-500/20">
              Core Strengths
            </span>
          </div>
          <span className="text-[11px] text-ink-tertiary font-mono">Ranked by count</span>
        </div>

        <div className="space-y-2">
          {topPraises.length === 0 ? (
            <div className="py-6 text-center text-xs text-ink-tertiary">No praises detected in this dataset</div>
          ) : (
            topPraises.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-1.5 rounded-xl border border-hairline bg-surface-2 p-3 hover:border-hairline-strong hover:bg-surface-3 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2">
                    <span className="flex h-4 w-4 shrink-0 items-center justify-center rounded bg-surface-3 border border-hairline font-mono text-[10px] font-semibold text-emerald-400">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-ink group-hover:text-ink transition-colors leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1 shrink-0 font-mono">
                    <span className="text-[11px] text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.2 rounded">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-tertiary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Affected Products */}
                <div className="flex flex-wrap items-center gap-1.5 pt-0.5 text-[10px] text-ink-subtle font-mono">
                  <span className="text-ink-tertiary uppercase">Products:</span>
                  {item.products.slice(0, 3).map((prod, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded bg-surface-1 px-1.5 py-0.2 text-[10px] text-ink-muted border border-hairline"
                    >
                      {prod}
                    </span>
                  ))}
                  {item.products.length > 3 && (
                    <span className="text-ink-tertiary">
                      +{item.products.length - 3} more
                    </span>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
