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
    <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Total Analyzed */}
      <div className="flex flex-col justify-between rounded-lg border border-[#23252a] bg-[#0f1011] p-3.5">
        <span className="text-xs text-[#8a8f98]">Total analyzed</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#f7f8f8] tabular-nums">
            {total_analyzed}
          </span>
          <span className="text-[11px] text-[#62666d]">/ {total_raw_rows}</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] truncate">
          {skipped_empty} empty, {duplicates_detected} dup
        </div>
      </div>

      {/* 2. Positive */}
      <div className="flex flex-col justify-between rounded-lg border border-[#23252a] bg-[#0f1011] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8a8f98]">Positive</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#27a644]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#27a644] tabular-nums">
            {sentiment_percentages.positive}%
          </span>
          <span className="text-[11px] text-[#62666d]">({sentiment_counts.positive})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d]">Satisfied customers</div>
      </div>

      {/* 3. Neutral */}
      <div className="flex flex-col justify-between rounded-lg border border-[#23252a] bg-[#0f1011] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8a8f98]">Neutral</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#f59e0b]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#d0d6e0] tabular-nums">
            {sentiment_percentages.neutral}%
          </span>
          <span className="text-[11px] text-[#62666d]">({sentiment_counts.neutral})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d]">Mixed feedback</div>
      </div>

      {/* 4. Negative */}
      <div className="flex flex-col justify-between rounded-lg border border-[#23252a] bg-[#0f1011] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8a8f98]">Negative</span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#eb5757]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#eb5757] tabular-nums">
            {sentiment_percentages.negative}%
          </span>
          <span className="text-[11px] text-[#62666d]">({sentiment_counts.negative})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d]">Critical issues</div>
      </div>

      {/* 5. Needs Reply */}
      <div className="flex flex-col justify-between rounded-lg border border-[#23252a] bg-[#0f1011] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8a8f98]">Needs reply</span>
          <span className="kbd-cap">queue</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#f7f8f8] tabular-nums">
            {needs_reply_count}
          </span>
          <span className="text-[11px] text-[#62666d]">unresolved</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d]">Action required</div>
      </div>

      {/* 6. Rating Agreement (Bonus) */}
      <div className="flex flex-col justify-between rounded-lg border border-[#23252a] bg-[#0f1011] p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-[#8a8f98]">Rating agreement</span>
          <span className="font-mono text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 px-1 py-0.2 rounded border border-[#f59e0b]/20">
            {rating_mismatch_count} flagged
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-medium tracking-tight text-[#f7f8f8] tabular-nums">
            {rating_agreement_percentage}%
          </span>
          <span className="text-[11px] text-[#62666d]">concordance</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d]">Star vs sentiment</div>
      </div>
    </div>
  );
};
