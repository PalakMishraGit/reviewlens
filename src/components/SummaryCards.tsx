'use client';

import React from 'react';
import { AnalysisSummary } from '@/types/review';
import { Smile, Meh, Frown, MessageSquareReply, AlertTriangle, Layers } from 'lucide-react';

interface SummaryCardsProps {
  summary: AnalysisSummary;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({ summary }) => {
  const {
    total_analyzed,
    total_raw_rows,
    skipped_empty,
    duplicates_detected,
    sentiment_percentages,
    sentiment_counts,
    needs_reply_count,
    rating_agreement_percentage,
    rating_mismatch_count,
  } = summary;

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-6">
      {/* 1. Total Reviews Analyzed */}
      <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between text-slate-400">
          <span className="text-xs font-medium uppercase tracking-wider">Reviews Analyzed</span>
          <Layers className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-white">{total_analyzed}</span>
          <span className="text-xs text-slate-400">/ {total_raw_rows} raw rows</span>
        </div>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-slate-400">
          <span className="rounded bg-slate-800 px-1.5 py-0.5">{skipped_empty} empty skipped</span>
          <span className="rounded bg-slate-800 px-1.5 py-0.5">{duplicates_detected} duplicates</span>
        </div>
      </div>

      {/* 2. Positive Sentiment */}
      <div className="rounded-2xl border border-emerald-900/40 bg-emerald-950/20 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between text-emerald-400">
          <span className="text-xs font-medium uppercase tracking-wider">Positive</span>
          <Smile className="h-4 w-4 text-emerald-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-emerald-400">
            {sentiment_percentages.positive}%
          </span>
          <span className="text-xs text-emerald-300/80">({sentiment_counts.positive} reviews)</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-emerald-950/60">
          <div
            className="h-full rounded-full bg-emerald-500 transition-all duration-500"
            style={{ width: `${sentiment_percentages.positive}%` }}
          />
        </div>
      </div>

      {/* 3. Neutral Sentiment */}
      <div className="rounded-2xl border border-amber-900/40 bg-amber-950/20 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between text-amber-400">
          <span className="text-xs font-medium uppercase tracking-wider">Neutral</span>
          <Meh className="h-4 w-4 text-amber-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-amber-400">
            {sentiment_percentages.neutral}%
          </span>
          <span className="text-xs text-amber-300/80">({sentiment_counts.neutral} reviews)</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-amber-950/60">
          <div
            className="h-full rounded-full bg-amber-500 transition-all duration-500"
            style={{ width: `${sentiment_percentages.neutral}%` }}
          />
        </div>
      </div>

      {/* 4. Negative Sentiment */}
      <div className="rounded-2xl border border-rose-900/40 bg-rose-950/20 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between text-rose-400">
          <span className="text-xs font-medium uppercase tracking-wider">Negative</span>
          <Frown className="h-4 w-4 text-rose-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-rose-400">
            {sentiment_percentages.negative}%
          </span>
          <span className="text-xs text-rose-300/80">({sentiment_counts.negative} reviews)</span>
        </div>
        <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-rose-950/60">
          <div
            className="h-full rounded-full bg-rose-500 transition-all duration-500"
            style={{ width: `${sentiment_percentages.negative}%` }}
          />
        </div>
      </div>

      {/* 5. Needs Merchant Reply */}
      <div className="rounded-2xl border border-indigo-900/50 bg-indigo-950/30 p-5 backdrop-blur-sm relative overflow-hidden">
        <div className="flex items-center justify-between text-indigo-400">
          <span className="text-xs font-medium uppercase tracking-wider">Needs Store Reply</span>
          <MessageSquareReply className="h-4 w-4 text-indigo-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-indigo-300">
            {needs_reply_count}
          </span>
          <span className="text-xs text-indigo-200/70">actionable complaints</span>
        </div>
        <div className="mt-2 text-[11px] text-indigo-300/80">
          Click &quot;Draft Reply&quot; to respond on-demand
        </div>
      </div>

      {/* 6. Rating vs Sentiment Agreement (Bonus) */}
      <div className="rounded-2xl border border-orange-900/40 bg-orange-950/20 p-5 backdrop-blur-sm">
        <div className="flex items-center justify-between text-orange-400">
          <span className="text-xs font-medium uppercase tracking-wider">Rating Agreement</span>
          <AlertTriangle className="h-4 w-4 text-orange-400" />
        </div>
        <div className="mt-3 flex items-baseline gap-2">
          <span className="text-3xl font-extrabold tracking-tight text-orange-400">
            {rating_agreement_percentage}%
          </span>
          <span className="text-xs text-orange-300/80">concordance</span>
        </div>
        <div className="mt-2 flex items-center gap-1.5 text-[11px] text-orange-300/90">
          <span className="font-semibold text-orange-200">{rating_mismatch_count}</span>
          <span>mismatch flagged (e.g. R008)</span>
        </div>
      </div>
    </div>
  );
};
