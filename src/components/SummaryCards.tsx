'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import {
  Inbox,
  Filter,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
} from 'lucide-react';

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
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
      {/* 1. Total Reviews Ingested */}
      <motion.div
        whileHover={{ y: -1 }}
        transition={{ duration: 0.15 }}
        className="relative flex flex-col justify-between rounded-xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sm"
      >
        <div className="flex items-center justify-between text-ink-subtle">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink-tertiary">01 / Ingested</span>
          <span className="kbd-cap font-mono text-xs">{total_raw_rows} raw</span>
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-ink tabular-nums">
            {total_analyzed}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-ink-subtle">valid</span>
        </div>

        <div className="flex items-center justify-between text-xs font-mono text-ink-tertiary border-t border-hairline pt-2.5">
          <span>{skipped_empty} empty</span>
          <span className="text-ink-subtle font-semibold">{duplicates_detected} dedupe</span>
        </div>
      </motion.div>

      {/* 2. Positive Sentiment Card (Filter) */}
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 sm:p-5 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'positive'
            ? 'border-emerald-500 bg-emerald-500/10 ring-1 ring-emerald-500'
            : 'border-hairline bg-surface-1 hover:border-emerald-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            Positive
          </span>
          {activeSentimentFilter === 'positive' && (
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-emerald-400">
              Active
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-emerald-500 tabular-nums">
            {sentiment_percentages.positive}%
          </span>
          <span className="text-xs sm:text-sm text-ink-subtle font-mono font-semibold">({sentiment_counts.positive})</span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-subtle border-t border-hairline pt-2.5 font-medium">
          <span>Satisfied</span>
          <Filter className="h-3.5 w-3.5 text-ink-tertiary" />
        </div>
      </motion.button>

      {/* 3. Neutral Sentiment Card (Filter) */}
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 sm:p-5 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'neutral'
            ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
            : 'border-hairline bg-surface-1 hover:border-amber-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500" />
            Neutral
          </span>
          {activeSentimentFilter === 'neutral' && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-amber-400">
              Active
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-amber-500 tabular-nums">
            {sentiment_percentages.neutral}%
          </span>
          <span className="text-xs sm:text-sm text-ink-subtle font-mono font-semibold">({sentiment_counts.neutral})</span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-subtle border-t border-hairline pt-2.5 font-medium">
          <span>Mixed</span>
          <Filter className="h-3.5 w-3.5 text-ink-tertiary" />
        </div>
      </motion.button>

      {/* 4. Negative Sentiment Card (Filter) */}
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 sm:p-5 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'negative'
            ? 'border-rose-500 bg-rose-500/10 ring-1 ring-rose-500'
            : 'border-hairline bg-surface-1 hover:border-rose-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500" />
            Negative
          </span>
          {activeSentimentFilter === 'negative' && (
            <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-mono font-bold text-rose-400">
              Active
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-rose-500 tabular-nums">
            {sentiment_percentages.negative}%
          </span>
          <span className="text-xs sm:text-sm text-ink-subtle font-mono font-semibold">({sentiment_counts.negative})</span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-subtle border-t border-hairline pt-2.5 font-medium">
          <span>Critical</span>
          <Filter className="h-3.5 w-3.5 text-ink-tertiary" />
        </div>
      </motion.button>

      {/* 5. Needs Reply Priority Queue (Filter Toggle) */}
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleNeedsReply}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 sm:p-5 transition-all shadow-sm cursor-pointer ${
          onlyNeedsReply
            ? 'border-ink bg-surface-3 ring-1 ring-ink'
            : 'border-hairline bg-surface-1 hover:border-hairline-strong hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-ink flex items-center gap-1.5">
            <Inbox className="h-3.5 w-3.5" />
            Needs Reply
          </span>
          {onlyNeedsReply ? (
            <span className="rounded bg-ink text-canvas px-1.5 py-0.5 text-[10px] font-mono font-bold">
              Active
            </span>
          ) : (
            <span className="kbd-cap text-[10px]">queue</span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-ink tabular-nums">
            {needs_reply_count}
          </span>
          <span className="text-xs sm:text-sm font-semibold text-ink-subtle">open</span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-subtle border-t border-hairline pt-2.5 font-medium">
          <span>Action queue</span>
          <span className="font-mono font-bold text-ink">Toggle</span>
        </div>
      </motion.button>

      {/* 6. Rating Agreement / Concordance (Filter Toggle) */}
      <motion.button
        type="button"
        whileHover={{ y: -1 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleMismatches}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 sm:p-5 transition-all shadow-sm cursor-pointer ${
          onlyMismatches
            ? 'border-amber-500 bg-amber-500/10 ring-1 ring-amber-500'
            : 'border-hairline bg-surface-1 hover:border-amber-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Concordance
          </span>
          {rating_mismatch_count > 0 && (
            <span className="rounded bg-amber-500/20 px-2 py-0.5 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
              {rating_mismatch_count} alert{rating_mismatch_count > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl sm:text-4xl font-black tracking-tight text-ink tabular-nums">
            {rating_agreement_percentage}%
          </span>
          <span className="text-xs sm:text-sm font-semibold text-ink-subtle">match</span>
        </div>

        <div className="flex items-center justify-between text-xs text-ink-subtle border-t border-hairline pt-2.5 font-medium">
          <span>Star vs text</span>
          <span className="font-mono font-bold text-amber-400">Toggle</span>
        </div>
      </motion.button>
    </div>
  );
};
