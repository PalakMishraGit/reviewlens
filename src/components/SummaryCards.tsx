'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import {
  CheckCircle2,
  AlertTriangle,
  Smile,
  Meh,
  Frown,
  Inbox,
  Filter,
  Check,
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
      {/* 1. Total Analyzed Card */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="relative flex flex-col justify-between rounded-xl border border-hairline bg-surface-1 p-4 shadow-sm backdrop-blur-sm"
      >
        <div className="flex items-center justify-between text-ink-subtle">
          <span className="text-[11px] font-semibold uppercase tracking-wider">Total Ingested</span>
          <span className="kbd-cap font-mono">{total_raw_rows} raw</span>
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-ink tabular-nums">
            {total_analyzed}
          </span>
          <span className="text-xs text-ink-tertiary">valid reviews</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-subtle border-t border-hairline pt-2">
          <span className="text-ink-tertiary font-mono">{skipped_empty} empty</span>
          <span className="text-indigo-400 font-mono">{duplicates_detected} dedupe</span>
        </div>
      </motion.div>

      {/* 2. Positive Sentiment Card (Filter) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'positive'
            ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500/30'
            : 'border-hairline bg-surface-1 hover:border-emerald-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-emerald-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-emerald-500 shadow-sm shadow-emerald-500/50" />
            Positive
          </span>
          {activeSentimentFilter === 'positive' && (
            <span className="rounded bg-emerald-500/20 px-1.5 py-0.5 text-[10px] font-medium text-emerald-400">
              Active
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-emerald-500 tabular-nums">
            {sentiment_percentages.positive}%
          </span>
          <span className="text-xs text-ink-tertiary font-mono">({sentiment_counts.positive})</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-subtle border-t border-hairline pt-2">
          <span>Satisfied customers</span>
          <Filter className="h-3 w-3 text-ink-tertiary" />
        </div>
      </motion.button>

      {/* 3. Neutral Sentiment Card (Filter) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'neutral'
            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
            : 'border-hairline bg-surface-1 hover:border-amber-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-amber-500 shadow-sm shadow-amber-500/50" />
            Neutral
          </span>
          {activeSentimentFilter === 'neutral' && (
            <span className="rounded bg-amber-500/20 px-1.5 py-0.5 text-[10px] font-medium text-amber-400">
              Active
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-amber-500 tabular-nums">
            {sentiment_percentages.neutral}%
          </span>
          <span className="text-xs text-ink-tertiary font-mono">({sentiment_counts.neutral})</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-subtle border-t border-hairline pt-2">
          <span>Mixed feedback</span>
          <Filter className="h-3 w-3 text-ink-tertiary" />
        </div>
      </motion.button>

      {/* 4. Negative Sentiment Card (Filter) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 transition-all shadow-sm cursor-pointer ${
          activeSentimentFilter === 'negative'
            ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500/30'
            : 'border-hairline bg-surface-1 hover:border-rose-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-rose-500 flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-rose-500 shadow-sm shadow-rose-500/50" />
            Negative
          </span>
          {activeSentimentFilter === 'negative' && (
            <span className="rounded bg-rose-500/20 px-1.5 py-0.5 text-[10px] font-medium text-rose-400">
              Active
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-rose-500 tabular-nums">
            {sentiment_percentages.negative}%
          </span>
          <span className="text-xs text-ink-tertiary font-mono">({sentiment_counts.negative})</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-subtle border-t border-hairline pt-2">
          <span>Critical issues</span>
          <Filter className="h-3 w-3 text-ink-tertiary" />
        </div>
      </motion.button>

      {/* 5. Needs Reply Priority Queue (Filter Toggle) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleNeedsReply}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 transition-all shadow-sm cursor-pointer ${
          onlyNeedsReply
            ? 'border-indigo-500 bg-indigo-500/10 ring-2 ring-indigo-500/30'
            : 'border-hairline bg-surface-1 hover:border-indigo-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5">
            <Inbox className="h-3.5 w-3.5" />
            Needs Reply
          </span>
          {onlyNeedsReply ? (
            <span className="rounded bg-indigo-500/20 px-1.5 py-0.5 text-[10px] font-medium text-indigo-400">
              Active
            </span>
          ) : (
            <span className="kbd-cap text-[10px]">queue</span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-ink tabular-nums">
            {needs_reply_count}
          </span>
          <span className="text-xs text-ink-tertiary">unresolved</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-subtle border-t border-hairline pt-2">
          <span>Store action queue</span>
          <span className="text-indigo-400 font-medium">Toggle</span>
        </div>
      </motion.button>

      {/* 6. Rating Agreement / Mismatch Alert (Filter Toggle) */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleMismatches}
        className={`relative flex flex-col justify-between text-left rounded-xl border p-4 transition-all shadow-sm cursor-pointer ${
          onlyMismatches
            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500/30'
            : 'border-hairline bg-surface-1 hover:border-amber-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <span className="text-[11px] font-semibold uppercase tracking-wider text-amber-400 flex items-center gap-1.5">
            <AlertTriangle className="h-3.5 w-3.5" />
            Concordance
          </span>
          {rating_mismatch_count > 0 && (
            <span className="rounded-full bg-amber-500/20 px-1.5 py-0.2 text-[10px] font-mono font-bold text-amber-400 border border-amber-500/30">
              {rating_mismatch_count} alert{rating_mismatch_count > 1 ? 's' : ''}
            </span>
          )}
        </div>

        <div className="my-2.5 flex items-baseline gap-2">
          <span className="font-mono text-3xl font-bold tracking-tight text-ink tabular-nums">
            {rating_agreement_percentage}%
          </span>
          <span className="text-xs text-ink-tertiary">match</span>
        </div>

        <div className="flex items-center justify-between text-[11px] text-ink-subtle border-t border-hairline pt-2">
          <span>Star vs sentiment</span>
          <span className="text-amber-400 font-medium">Toggle</span>
        </div>
      </motion.button>
    </div>
  );
};
