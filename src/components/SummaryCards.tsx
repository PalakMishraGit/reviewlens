'use client';

import React from 'react';
import { AnalysisSummary } from '@/types/review';

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Total Analyzed */}
      <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#11141c] p-4">
        <span className="text-xs text-[#7a8296]">Total analyzed</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#eef0f5] tabular-nums">
            {total_analyzed}
          </span>
          <span className="text-[11px] text-[#7a8296]">/ {total_raw_rows}</span>
        </div>
        <div className="mt-2 text-[11px] text-[#7a8296] truncate">
          {skipped_empty} empty, {duplicates_detected} dup
        </div>
      </div>

      {/* 2. Positive */}
      <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#11141c] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#7a8296]">Positive</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#4cc38a]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#4cc38a] tabular-nums">
            {sentiment_percentages.positive}%
          </span>
          <span className="text-[11px] text-[#7a8296]">({sentiment_counts.positive})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#7a8296]">Satisfied customers</div>
      </div>

      {/* 3. Neutral */}
      <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#11141c] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#7a8296]">Neutral</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#eab308]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#a3a9b8] tabular-nums">
            {sentiment_percentages.neutral}%
          </span>
          <span className="text-[11px] text-[#7a8296]">({sentiment_counts.neutral})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#7a8296]">Mixed feedback</div>
      </div>

      {/* 4. Negative */}
      <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#11141c] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#7a8296]">Negative</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#e5484d]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#e5484d] tabular-nums">
            {sentiment_percentages.negative}%
          </span>
          <span className="text-[11px] text-[#7a8296]">({sentiment_counts.negative})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#7a8296]">Critical issues</div>
      </div>

      {/* 5. Needs Reply */}
      <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#11141c] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#7a8296]">Needs reply</span>
          <span className="font-mono text-[10px] text-[#eef0f5] bg-[#1a1e28] px-1.5 py-0.2 rounded border border-white/[0.06]">
            Queue
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#eef0f5] tabular-nums">
            {needs_reply_count}
          </span>
          <span className="text-[11px] text-[#7a8296]">unresolved</span>
        </div>
        <div className="mt-2 text-[11px] text-[#7a8296]">Action required</div>
      </div>

      {/* 6. Rating Agreement (Bonus) */}
      <div className="flex flex-col justify-between rounded-xl border border-white/[0.08] bg-[#11141c] p-4">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#7a8296]">Rating agreement</span>
          <span className="font-mono text-[10px] text-[#eab308] bg-[#eab308]/10 px-1.5 py-0.2 rounded border border-[#eab308]/20">
            {rating_mismatch_count} flagged
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#eef0f5] tabular-nums">
            {rating_agreement_percentage}%
          </span>
          <span className="text-[11px] text-[#7a8296]">concordance</span>
        </div>
        <div className="mt-2 text-[11px] text-[#7a8296]">Star vs sentiment</div>
      </div>
    </div>
  );
};
