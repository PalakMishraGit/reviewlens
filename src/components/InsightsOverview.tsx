'use client';

import React from 'react';
import { MetricItem } from '@/types/review';
import { ThumbsDown, ThumbsUp, PackageX, Sparkles, Tag, ArrowRight } from 'lucide-react';

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
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
      {/* Top 3 Complaints */}
      <div className="rounded-2xl border border-rose-900/30 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400">
              <ThumbsDown className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Top 3 Customer Complaints</h3>
              <p className="text-xs text-slate-400">Critical recurring issues requiring store attention</p>
            </div>
          </div>
          <span className="rounded-full bg-rose-500/10 px-2 py-0.5 text-xs font-semibold text-rose-400 border border-rose-500/20">
            Action Required
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {topComplaints.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No major negative complaints detected.</div>
          ) : (
            topComplaints.map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-rose-900/50 hover:bg-rose-950/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-rose-500/20 text-xs font-bold text-rose-300">
                      #{index + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-200 leading-snug">{item.text}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-rose-500/10 px-2 py-0.5 text-xs font-bold text-rose-400 border border-rose-500/20">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500">Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <span key={pIdx} className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[11px] text-slate-300">
                      {p}
                    </span>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-slate-500">+{item.products.length - 2} more</span>
                  )}
                  {item.topics[0] && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(item.topics[0])}
                      className="ml-auto inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Filter by {item.topics[0]}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Top 3 Praises */}
      <div className="rounded-2xl border border-emerald-900/30 bg-slate-900/60 p-6 backdrop-blur-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-400">
              <ThumbsUp className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-slate-100">Top 3 Customer Praises</h3>
              <p className="text-xs text-slate-400">High-converting product highlights and customer loves</p>
            </div>
          </div>
          <span className="rounded-full bg-emerald-500/10 px-2 py-0.5 text-xs font-semibold text-emerald-400 border border-emerald-500/20">
            Strengths
          </span>
        </div>

        <div className="mt-4 space-y-3">
          {topPraises.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-500">No positive feedback detected yet.</div>
          ) : (
            topPraises.map((item, index) => (
              <div
                key={index}
                className="group relative flex flex-col gap-2 rounded-xl border border-slate-800/80 bg-slate-950/60 p-4 transition-all hover:border-emerald-900/50 hover:bg-emerald-950/10"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-emerald-500/20 text-xs font-bold text-emerald-300">
                      #{index + 1}
                    </span>
                    <p className="text-sm font-medium text-slate-200 leading-snug">{item.text}</p>
                  </div>
                  <span className="shrink-0 rounded-md bg-emerald-500/10 px-2 py-0.5 text-xs font-bold text-emerald-400 border border-emerald-500/20">
                    {item.count} {item.count === 1 ? 'review' : 'reviews'}
                  </span>
                </div>

                <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-400">
                  <span className="text-[11px] text-slate-500">Products:</span>
                  {item.products.slice(0, 2).map((p, pIdx) => (
                    <span key={pIdx} className="rounded bg-slate-800/90 px-1.5 py-0.5 text-[11px] text-slate-300">
                      {p}
                    </span>
                  ))}
                  {item.products.length > 2 && (
                    <span className="text-[11px] text-slate-500">+{item.products.length - 2} more</span>
                  )}
                  {item.topics[0] && onSelectTopic && (
                    <button
                      onClick={() => onSelectTopic(item.topics[0])}
                      className="ml-auto inline-flex items-center gap-1 text-[11px] text-indigo-400 hover:text-indigo-300 transition-colors"
                    >
                      Filter by {item.topics[0]}
                      <ArrowRight className="h-3 w-3" />
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
