'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import { Filter } from 'lucide-react';

interface SummaryCardsProps {
  summary: AnalysisSummary;
  activeSentimentFilter: string;
  onFilterSentiment: (sentiment: string) => void;
  onlyNeedsReply: boolean;
  onToggleNeedsReply: () => void;
  onlyMismatches: boolean;
  onToggleMismatches: () => void;
}

export const SummaryCards: React.FC<SummaryCardsProps> = ({
  summary,
  activeSentimentFilter,
  onFilterSentiment,
  onlyNeedsReply,
  onToggleNeedsReply,
  onlyMismatches,
  onToggleMismatches,
}) => {
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
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="flex flex-col justify-between rounded-xl border border-[#23252a] bg-[#0f1011] p-3.5 shadow-sm"
      >
        <span className="text-xs text-[#8a8f98]">Total analyzed</span>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#f7f8f8] tabular-nums">
            {total_analyzed}
          </span>
          <span className="text-[11px] text-[#62666d]">/ {total_raw_rows}</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] truncate">
          {skipped_empty} empty, {duplicates_detected} dup
        </div>
      </motion.div>

      {/* 2. Positive (Interactive Filter Card) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'positive'
            ? 'border-[#27a644] bg-[#27a644]/10 ring-1 ring-[#27a644]'
            : 'border-[#23252a] bg-[#0f1011] hover:border-[#27a644]/50'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#8a8f98]">Positive</span>
          <span className="h-2 w-2 rounded-full bg-[#27a644]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#27a644] tabular-nums">
            {sentiment_percentages.positive}%
          </span>
          <span className="text-[11px] text-[#62666d]">({sentiment_counts.positive})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] flex items-center justify-between w-full">
          <span>Satisfied</span>
          <span className="font-mono text-[10px] text-[#8a8f98]">Filter</span>
        </div>
      </motion.button>

      {/* 3. Neutral (Interactive Filter Card) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'neutral'
            ? 'border-[#f59e0b] bg-[#f59e0b]/10 ring-1 ring-[#f59e0b]'
            : 'border-[#23252a] bg-[#0f1011] hover:border-[#f59e0b]/50'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#8a8f98]">Neutral</span>
          <span className="h-2 w-2 rounded-full bg-[#f59e0b]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#d0d6e0] tabular-nums">
            {sentiment_percentages.neutral}%
          </span>
          <span className="text-[11px] text-[#62666d]">({sentiment_counts.neutral})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] flex items-center justify-between w-full">
          <span>Mixed</span>
          <span className="font-mono text-[10px] text-[#8a8f98]">Filter</span>
        </div>
      </motion.button>

      {/* 4. Negative (Interactive Filter Card) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'negative'
            ? 'border-[#eb5757] bg-[#eb5757]/10 ring-1 ring-[#eb5757]'
            : 'border-[#23252a] bg-[#0f1011] hover:border-[#eb5757]/50'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#8a8f98]">Negative</span>
          <span className="h-2 w-2 rounded-full bg-[#eb5757]" />
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#eb5757] tabular-nums">
            {sentiment_percentages.negative}%
          </span>
          <span className="text-[11px] text-[#62666d]">({sentiment_counts.negative})</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] flex items-center justify-between w-full">
          <span>Critical</span>
          <span className="font-mono text-[10px] text-[#8a8f98]">Filter</span>
        </div>
      </motion.button>

      {/* 5. Needs Reply (Interactive Toggle Card) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleNeedsReply}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 transition-all shadow-sm cursor-pointer ${
          onlyNeedsReply
            ? 'border-[#5e6ad2] bg-[#5e6ad2]/10 ring-1 ring-[#5e6ad2]'
            : 'border-[#23252a] bg-[#0f1011] hover:border-[#5e6ad2]/50'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#8a8f98]">Needs reply</span>
          <span className="kbd-cap">queue</span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#f7f8f8] tabular-nums">
            {needs_reply_count}
          </span>
          <span className="text-[11px] text-[#62666d]">unresolved</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] flex items-center justify-between w-full">
          <span>Action queue</span>
          <span className="font-mono text-[10px] text-[#5e6ad2]">{onlyNeedsReply ? 'Active' : 'Toggle'}</span>
        </div>
      </motion.button>

      {/* 6. Rating Agreement (Interactive Toggle Card) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleMismatches}
        className={`flex flex-col justify-between text-left rounded-xl border p-3.5 transition-all shadow-sm cursor-pointer ${
          onlyMismatches
            ? 'border-[#f59e0b] bg-[#f59e0b]/10 ring-1 ring-[#f59e0b]'
            : 'border-[#23252a] bg-[#0f1011] hover:border-[#f59e0b]/50'
        }`}
      >
        <div className="flex items-center justify-between w-full">
          <span className="text-xs text-[#8a8f98]">Rating agreement</span>
          <span className="font-mono text-[10px] text-[#f59e0b] bg-[#f59e0b]/10 px-1 py-0.2 rounded border border-[#f59e0b]/20">
            {rating_mismatch_count}
          </span>
        </div>
        <div className="mt-2 flex items-baseline gap-1.5">
          <span className="font-mono text-2xl font-semibold tracking-tight text-[#f7f8f8] tabular-nums">
            {rating_agreement_percentage}%
          </span>
          <span className="text-[11px] text-[#62666d]">concordance</span>
        </div>
        <div className="mt-2 text-[11px] text-[#62666d] flex items-center justify-between w-full">
          <span>Star vs text</span>
          <span className="font-mono text-[10px] text-[#f59e0b]">{onlyMismatches ? 'Active' : 'Toggle'}</span>
        </div>
      </motion.button>
    </div>
  );
};
