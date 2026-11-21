'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import {
  FileText,
  Smile,
  Meh,
  Frown,
  Lightbulb,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
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

  // Mini sparkline SVG paths
  const upSparkline = (color: string) => (
    <svg className="w-16 h-7 overflow-visible" viewBox="0 0 64 28" fill="none">
      <path
        d="M2 24 C 14 20, 22 14, 34 16 C 46 18, 52 8, 62 4"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const flatSparkline = (color: string) => (
    <svg className="w-16 h-7 overflow-visible" viewBox="0 0 64 28" fill="none">
      <path
        d="M2 14 C 14 10, 26 18, 38 12 C 48 16, 56 12, 62 14"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  const downSparkline = (color: string) => (
    <svg className="w-16 h-7 overflow-visible" viewBox="0 0 64 28" fill="none">
      <path
        d="M2 6 C 14 10, 24 16, 36 14 C 46 12, 54 22, 62 24"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
      />
    </svg>
  );

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
      {/* 1. Total Reviews */}
      <motion.div
        whileHover={{ y: -2 }}
        transition={{ duration: 0.15 }}
        className="relative flex flex-col justify-between rounded-2xl border border-hairline bg-surface-1 p-5 shadow-sm transition-all hover:border-hairline-strong card-glow"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-ink">
            <div className="p-1.5 rounded-lg bg-surface-2 border border-hairline">
              <FileText className="h-4 w-4 text-ink" strokeWidth={2.2} />
            </div>
            <span>Total reviews</span>
          </div>
          <span className="text-[11px] font-mono font-bold text-ink">
            {total_raw_rows} raw
          </span>
        </div>

        <div className="my-3 flex items-end justify-between">
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-ink tabular-nums">
              {total_analyzed}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+1 from last period</span>
            </div>
          </div>
          <div>{upSparkline('currentColor')}</div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-mono text-ink border-t border-hairline pt-2.5 font-bold">
          <span>{skipped_empty} empty</span>
          <span className="text-ink font-extrabold">{duplicates_detected} dedupe</span>
        </div>
      </motion.div>

      {/* 2. Positive Sentiment */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
        className={`relative flex flex-col justify-between text-left rounded-2xl border p-5 transition-all shadow-sm cursor-pointer card-glow ${
          activeSentimentFilter === 'positive'
            ? 'border-emerald-500 bg-emerald-500/10 ring-2 ring-emerald-500'
            : 'border-hairline bg-surface-1 hover:border-emerald-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-500">
            <div className="p-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
              <Smile className="h-4 w-4 text-emerald-500" />
            </div>
            <span>Positive sentiment</span>
          </div>
          {activeSentimentFilter === 'positive' ? (
            <span className="rounded-md bg-emerald-500 text-canvas px-1.5 py-0.5 text-[10px] font-bold">
              Active
            </span>
          ) : (
            <span className="text-[11px] font-mono text-ink-tertiary">
              {sentiment_counts.positive} rev
            </span>
          )}
        </div>

        <div className="my-3 flex items-end justify-between">
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-emerald-500 tabular-nums">
              {sentiment_percentages.positive}%
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+6.2% vs baseline</span>
            </div>
          </div>
          <div className="text-emerald-500">{upSparkline('#10b981')}</div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-ink border-t border-hairline pt-2.5">
          <span>Satisfied customers</span>
          <span className="text-emerald-500 font-extrabold font-mono">Filter →</span>
        </div>
      </motion.button>

      {/* 3. Neutral Sentiment */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
        className={`relative flex flex-col justify-between text-left rounded-2xl border p-5 transition-all shadow-sm cursor-pointer card-glow ${
          activeSentimentFilter === 'neutral'
            ? 'border-amber-500 bg-amber-500/10 ring-2 ring-amber-500'
            : 'border-hairline bg-surface-1 hover:border-amber-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-amber-500">
            <div className="p-1.5 rounded-lg bg-amber-500/10 border border-amber-500/20">
              <Meh className="h-4 w-4 text-amber-500" />
            </div>
            <span>Neutral sentiment</span>
          </div>
          {activeSentimentFilter === 'neutral' ? (
            <span className="rounded-md bg-amber-500 text-canvas px-1.5 py-0.5 text-[10px] font-bold">
              Active
            </span>
          ) : (
            <span className="text-[11px] font-mono text-ink-tertiary">
              {sentiment_counts.neutral} rev
            </span>
          )}
        </div>

        <div className="my-3 flex items-end justify-between">
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-amber-500 tabular-nums">
              {sentiment_percentages.neutral}%
            </div>
            <div className="flex items-center gap-1 text-xs text-amber-500 font-semibold mt-1">
              <Minus className="h-3.5 w-3.5" />
              <span>±0.0% unchanged</span>
            </div>
          </div>
          <div className="text-amber-500">{flatSparkline('#f59e0b')}</div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-ink border-t border-hairline pt-2.5">
          <span>Mixed / Ambivalent</span>
          <span className="text-amber-500 font-extrabold font-mono">Filter →</span>
        </div>
      </motion.button>

      {/* 4. Negative Sentiment */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
        className={`relative flex flex-col justify-between text-left rounded-2xl border p-5 transition-all shadow-sm cursor-pointer card-glow ${
          activeSentimentFilter === 'negative'
            ? 'border-rose-500 bg-rose-500/10 ring-2 ring-rose-500'
            : 'border-hairline bg-surface-1 hover:border-rose-500/40 hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-500">
            <div className="p-1.5 rounded-lg bg-rose-500/10 border border-rose-500/20">
              <Frown className="h-4 w-4 text-rose-500" />
            </div>
            <span>Negative sentiment</span>
          </div>
          {activeSentimentFilter === 'negative' ? (
            <span className="rounded-md bg-rose-500 text-canvas px-1.5 py-0.5 text-[10px] font-bold">
              Active
            </span>
          ) : (
            <span className="text-[11px] font-mono text-ink-tertiary">
              {sentiment_counts.negative} rev
            </span>
          )}
        </div>

        <div className="my-3 flex items-end justify-between">
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-rose-500 tabular-nums">
              {sentiment_percentages.negative}%
            </div>
            <div className="flex items-center gap-1 text-xs text-rose-500 font-semibold mt-1">
              <ArrowDownRight className="h-3.5 w-3.5" />
              <span>-2.4% vs last period</span>
            </div>
          </div>
          <div className="text-rose-500">{downSparkline('#f43f5e')}</div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-ink border-t border-hairline pt-2.5">
          <span>Critical issues</span>
          <span className="text-rose-500 font-extrabold font-mono">Filter →</span>
        </div>
      </motion.button>

      {/* 5. Actionable Insights / Needs Reply Queue */}
      <motion.button
        type="button"
        whileHover={{ y: -2 }}
        whileTap={{ scale: 0.98 }}
        transition={{ duration: 0.15 }}
        onClick={onToggleNeedsReply}
        className={`relative flex flex-col justify-between text-left rounded-2xl border p-5 transition-all shadow-sm cursor-pointer card-glow ${
          onlyNeedsReply
            ? 'border-ink bg-surface-3 ring-2 ring-ink'
            : 'border-hairline bg-surface-1 hover:border-hairline-strong hover:bg-surface-2'
        }`}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-semibold text-ink">
            <div className="p-1.5 rounded-lg bg-surface-2 border border-hairline">
              <Lightbulb className="h-4 w-4 text-amber-400" />
            </div>
            <span>Actionable insights</span>
          </div>
          {onlyNeedsReply ? (
            <span className="rounded-md bg-ink text-canvas px-1.5 py-0.5 text-[10px] font-bold">
              Active
            </span>
          ) : (
            <span className="text-[11px] font-mono text-ink-tertiary">Queue</span>
          )}
        </div>

        <div className="my-3 flex items-end justify-between">
          <div>
            <div className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-ink tabular-nums">
              {needs_reply_count}
            </div>
            <div className="flex items-center gap-1 text-xs text-emerald-500 font-semibold mt-1">
              <ArrowUpRight className="h-3.5 w-3.5" />
              <span>+1 from last period</span>
            </div>
          </div>
          <div className="text-ink">{upSparkline('currentColor')}</div>
        </div>

        <div className="flex items-center justify-between text-[11px] font-bold text-ink border-t border-hairline pt-2.5">
          <span>Merchant reply draft</span>
          <span className="text-ink font-extrabold font-mono">Toggle →</span>
        </div>
      </motion.button>
    </div>
  );
};
