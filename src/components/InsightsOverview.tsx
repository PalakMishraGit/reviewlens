'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { MetricItem } from '@/types/review';
import { AlertTriangle, Star, ArrowRight } from 'lucide-react';

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* 1. Top Customer Complaints Card */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 shadow-sm space-y-4 transition-all hover:border-hairline-strong card-glow">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-500">
              <AlertTriangle className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink tracking-tight font-sans">
                Top customer complaints
              </h3>
            </div>
          </div>

          <button
            onClick={() => onSelectTopic && topComplaints[0] && onSelectTopic(topComplaints[0].topics[0])}
            className="flex items-center gap-1 text-xs font-semibold text-ink-subtle hover:text-ink font-mono transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {topComplaints.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-tertiary">
              No customer complaints identified
            </div>
          ) : (
            topComplaints.slice(0, 3).map((item, index) => {
              const severity = index === 0 ? 'High' : 'Medium';
              return (
                <motion.div
                  key={index}
                  whileHover={{ y: -1 }}
                  transition={{ duration: 0.15 }}
                  onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                  className="group flex items-center justify-between gap-4 rounded-xl border border-hairline bg-surface-2/60 p-4 hover:border-hairline-strong hover:bg-surface-2 transition-all cursor-pointer shadow-sm"
                >
                  <div className="flex items-start gap-3.5 min-w-0">
                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface-3 border border-hairline font-mono text-xs font-bold text-ink">
                      {index + 1}
                    </span>
                    <div className="min-w-0">
                      <h4 className="text-sm font-bold text-ink truncate group-hover:text-ink transition-colors">
                        {item.text}
                      </h4>
                      <p className="text-xs text-ink-subtle truncate mt-0.5">
                        {item.products.length > 0
                          ? `Affecting: ${item.products.join(', ')}`
                          : 'Detected across store items'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 shrink-0 font-mono">
                    <span
                      className={`rounded-lg px-2.5 py-1 text-xs font-bold ${
                        severity === 'High'
                          ? 'bg-rose-500/15 text-rose-500 border border-rose-500/30'
                          : 'bg-amber-500/15 text-amber-500 border border-amber-500/30'
                      }`}
                    >
                      {severity}
                    </span>
                    <span className="text-sm font-bold text-ink w-8 text-right">
                      {item.count}
                    </span>
                  </div>
                </motion.div>
              );
            })
          )}
        </div>
      </div>

      {/* 2. Top Customer Praises Card */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 shadow-sm space-y-4 transition-all hover:border-hairline-strong card-glow">
        <div className="flex items-center justify-between border-b border-hairline pb-4">
          <div className="flex items-center gap-2.5">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-500">
              <Star className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-ink tracking-tight font-sans">
                Top customer praises
              </h3>
            </div>
          </div>

          <button
            onClick={() => onSelectTopic && topPraises[0] && onSelectTopic(topPraises[0].topics[0])}
            className="flex items-center gap-1 text-xs font-semibold text-ink-subtle hover:text-ink font-mono transition-colors"
          >
            <span>See all</span>
            <ArrowRight className="h-3 w-3" />
          </button>
        </div>

        <div className="space-y-3">
          {topPraises.length === 0 ? (
            <div className="py-8 text-center text-sm text-ink-tertiary">
              No customer praises identified
            </div>
          ) : (
            topPraises.slice(0, 3).map((item, index) => (
              <motion.div
                key={index}
                whileHover={{ y: -1 }}
                transition={{ duration: 0.15 }}
                onClick={() => onSelectTopic && onSelectTopic(item.topics[0])}
                className="group flex items-center justify-between gap-4 rounded-xl border border-hairline bg-surface-2/60 p-4 hover:border-hairline-strong hover:bg-surface-2 transition-all cursor-pointer shadow-sm"
              >
                <div className="flex items-start gap-3.5 min-w-0">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-lg bg-surface-3 border border-hairline font-mono text-xs font-bold text-ink">
                    {index + 1}
                  </span>
                  <div className="min-w-0">
                    <h4 className="text-sm font-bold text-ink truncate group-hover:text-ink transition-colors">
                      {item.text}
                    </h4>
                    <p className="text-xs text-ink-subtle truncate mt-0.5">
                      {item.products.length > 0
                        ? `Highlights: ${item.products.join(', ')}`
                        : 'Customer praise highlights'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3 shrink-0 font-mono">
                  <span className="rounded-lg bg-emerald-500/15 text-emerald-500 border border-emerald-500/30 px-2.5 py-1 text-xs font-bold">
                    Positive
                  </span>
                  <span className="text-sm font-bold text-ink w-8 text-right">
                    {item.count}
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
