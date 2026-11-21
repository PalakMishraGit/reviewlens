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
    <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
      {/* Top Complaints Card */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2 font-sans">
              Top Customer Complaints
            </h3>
            <span className="rounded bg-rose-500/10 px-2 py-0.5 text-xs font-mono font-bold text-rose-400 border border-rose-500/20">
              Action Needed
            </span>
          </div>
          <span className="text-xs text-ink-subtle font-mono font-medium">Ranked by count</span>
        </div>

        <div className="space-y-3">
          {topComplaints.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-tertiary">No complaints detected in this dataset</div>
          ) : (
            topComplaints.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-2 rounded-xl border border-hairline bg-surface-2 p-4 hover:border-hairline-strong hover:bg-surface-3 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-3 border border-hairline font-mono text-sm font-bold text-rose-400">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-ink group-hover:text-ink transition-colors leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    <span className="text-xs font-bold text-rose-400 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-md">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'}
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-tertiary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Affected Products */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-ink-subtle font-mono">
                  <span className="text-ink-tertiary uppercase font-semibold text-[11px]">Products:</span>
                  {item.products.slice(0, 3).map((prod, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded bg-surface-1 px-2 py-0.5 text-xs text-ink font-medium border border-hairline"
                    >
                      {prod}
                    </span>
                  ))}
                  {item.products.length > 3 && (
                    <span className="text-ink-tertiary text-xs">
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
      <div className="rounded-xl border border-hairline bg-surface-1 p-6 shadow-sm space-y-5">
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center gap-2.5">
            <h3 className="text-base sm:text-lg font-bold text-ink flex items-center gap-2 font-sans">
              Top Customer Praises
            </h3>
            <span className="rounded bg-emerald-500/10 px-2 py-0.5 text-xs font-mono font-bold text-emerald-400 border border-emerald-500/20">
              Core Strengths
            </span>
          </div>
          <span className="text-xs text-ink-subtle font-mono font-medium">Ranked by count</span>
        </div>

        <div className="space-y-3">
          {topPraises.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-tertiary">No praises detected in this dataset</div>
          ) : (
            topPraises.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-2 rounded-xl border border-hairline bg-surface-2 p-4 hover:border-hairline-strong hover:bg-surface-3 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-surface-3 border border-hairline font-mono text-sm font-bold text-emerald-400">
                      {index + 1}
                    </span>
                    <span className="text-sm font-semibold text-ink group-hover:text-ink transition-colors leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0 font-mono">
                    <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-md">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'}
                    </span>
                    <ChevronRight className="h-4 w-4 text-ink-tertiary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Affected Products */}
                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-ink-subtle font-mono">
                  <span className="text-ink-tertiary uppercase font-semibold text-[11px]">Products:</span>
                  {item.products.slice(0, 3).map((prod, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded bg-surface-1 px-2 py-0.5 text-xs text-ink font-medium border border-hairline"
                    >
                      {prod}
                    </span>
                  ))}
                  {item.products.length > 3 && (
                    <span className="text-ink-tertiary text-xs">
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
