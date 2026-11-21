'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MetricItem } from '@/types/review';
import { ArrowUpRight, AlertOctagon, Sparkles, ChevronRight } from 'lucide-react';

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
    <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
      {/* Top Complaints Card */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              Top Customer Complaints
            </h3>
            <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-[10px] font-semibold text-rose-500 border border-rose-500/20 font-mono">
              Action Required
            </span>
          </div>
          <span className="text-[11px] text-ink-tertiary">Ranked by volume</span>
        </div>

        <div className="space-y-2.5">
          {topComplaints.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink-tertiary">No complaints detected in this dataset</div>
          ) : (
            topComplaints.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-2 rounded-xl border border-hairline bg-surface-2 p-3.5 hover:border-rose-500/40 hover:bg-surface-3 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-rose-500/10 border border-rose-500/20 font-mono text-[11px] font-bold text-rose-500">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-ink group-hover:text-rose-400 transition-colors leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-xs font-semibold text-rose-500 bg-rose-500/10 border border-rose-500/20 px-2 py-0.5 rounded-full">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-tertiary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Affected Products & Topics */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-ink-subtle">
                  <span className="text-ink-tertiary text-[10px] uppercase font-mono">Products:</span>
                  {item.products.slice(0, 3).map((prod, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded bg-surface-1 px-2 py-0.5 text-[10px] font-mono text-ink border border-hairline"
                    >
                      {prod}
                    </span>
                  ))}
                  {item.products.length > 3 && (
                    <span className="text-[10px] text-ink-tertiary">
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
      <div className="rounded-xl border border-hairline bg-surface-1 p-5 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-hairline pb-3.5">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold text-ink flex items-center gap-2">
              Top Customer Praises
            </h3>
            <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-semibold text-emerald-500 border border-emerald-500/20 font-mono">
              Core Strengths
            </span>
          </div>
          <span className="text-[11px] text-ink-tertiary">Ranked by volume</span>
        </div>

        <div className="space-y-2.5">
          {topPraises.length === 0 ? (
            <div className="py-8 text-center text-xs text-ink-tertiary">No praises detected in this dataset</div>
          ) : (
            topPraises.map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex flex-col gap-2 rounded-xl border border-hairline bg-surface-2 p-3.5 hover:border-emerald-500/40 hover:bg-surface-3 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md bg-emerald-500/10 border border-emerald-500/20 font-mono text-[11px] font-bold text-emerald-500">
                      {index + 1}
                    </span>
                    <span className="text-xs font-medium text-ink group-hover:text-emerald-400 transition-colors leading-snug">
                      {item.text}
                    </span>
                  </div>

                  <div className="flex items-center gap-1.5 shrink-0">
                    <span className="font-mono text-xs font-semibold text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full">
                      {item.count} {item.count === 1 ? 'review' : 'reviews'}
                    </span>
                    <ChevronRight className="h-3.5 w-3.5 text-ink-tertiary group-hover:translate-x-0.5 transition-transform" />
                  </div>
                </div>

                {/* Affected Products & Topics */}
                <div className="flex flex-wrap items-center gap-1.5 pt-1 text-[11px] text-ink-subtle">
                  <span className="text-ink-tertiary text-[10px] uppercase font-mono">Products:</span>
                  {item.products.slice(0, 3).map((prod, pIdx) => (
                    <span
                      key={pIdx}
                      className="rounded bg-surface-1 px-2 py-0.5 text-[10px] font-mono text-ink border border-hairline"
                    >
                      {prod}
                    </span>
                  ))}
                  {item.products.length > 3 && (
                    <span className="text-[10px] text-ink-tertiary">
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
