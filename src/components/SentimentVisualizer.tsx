'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import { TrendingUp, Smile, Meh, Frown, Award, RotateCcw } from 'lucide-react';

interface SentimentVisualizerProps {
  summary: AnalysisSummary;
  activeSentimentFilter: string;
  onFilterSentiment: (sentiment: string) => void;
}

export const SentimentVisualizer: React.FC<SentimentVisualizerProps> = ({
  summary,
  activeSentimentFilter,
  onFilterSentiment,
}) => {
  const { sentiment_percentages, sentiment_counts, total_analyzed } = summary;

  // Net Sentiment Score (NSS = % Positive - % Negative, range -100 to +100)
  const netSentimentScore = sentiment_percentages.positive - sentiment_percentages.negative;

  // CSAT Estimation: (Positive + (Neutral * 0.5))
  const csatScore = Math.round(
    sentiment_percentages.positive + sentiment_percentages.neutral * 0.5
  );

  return (
    <div className="rounded-xl border border-hairline bg-surface-1 p-4 sm:p-5 shadow-sm space-y-3.5">
      {/* Header with NSS & CSAT telemetry */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 border-b border-hairline pb-3">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="text-xs sm:text-sm font-semibold text-ink font-sans">
              Sentiment Distribution Spectrum
            </h3>
            <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-ink-subtle border border-hairline">
              NSS Analysis
            </span>
          </div>
          <p className="text-[11px] text-ink-subtle mt-0.5">
            Click any segment or filter pill to filter customer reviews in real time
          </p>
        </div>

        {/* Dual KPI Gauges (CSAT & Net Sentiment) */}
        <div className="flex items-center gap-2 text-xs">
          {/* CSAT Score */}
          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 text-ink-subtle font-mono text-[11px]">
            <Award className="h-3 w-3 text-ink-muted" />
            <span>CSAT:</span>
            <span className="font-semibold text-ink">{csatScore}%</span>
          </div>

          {/* NSS Score */}
          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 text-ink-subtle font-mono text-[11px]">
            <TrendingUp className="h-3 w-3 text-ink-muted" />
            <span>Net Sentiment:</span>
            <span
              className={`font-semibold px-1.5 py-0.2 rounded ${
                netSentimentScore >= 0
                  ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                  : 'bg-rose-500/10 text-rose-500 border border-rose-500/30'
              }`}
            >
              {netSentimentScore > 0 ? `+${netSentimentScore}` : netSentimentScore}
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-surface-3 p-0.5 gap-1 shadow-inner">
          {/* Positive segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.positive}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
            title={`Positive: ${sentiment_percentages.positive}% (${sentiment_counts.positive} reviews). Click to filter.`}
            className={`relative h-full rounded-l-full bg-emerald-500 transition-all hover:brightness-125 focus:outline-none ${
              activeSentimentFilter === 'positive'
                ? 'ring-2 ring-white dark:ring-white ring-offset-1 ring-offset-canvas'
                : ''
            }`}
          />

          {/* Neutral segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.neutral}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
            title={`Neutral: ${sentiment_percentages.neutral}% (${sentiment_counts.neutral} reviews). Click to filter.`}
            className={`relative h-full bg-amber-500 transition-all hover:brightness-125 focus:outline-none ${
              activeSentimentFilter === 'neutral'
                ? 'ring-2 ring-white dark:ring-white ring-offset-1 ring-offset-canvas'
                : ''
            }`}
          />

          {/* Negative segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.negative}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
            title={`Negative: ${sentiment_percentages.negative}% (${sentiment_counts.negative} reviews). Click to filter.`}
            className={`relative h-full rounded-r-full bg-rose-500 transition-all hover:brightness-125 focus:outline-none ${
              activeSentimentFilter === 'negative'
                ? 'ring-2 ring-white dark:ring-white ring-offset-1 ring-offset-canvas'
                : ''
            }`}
          />
        </div>

        {/* Legend / Interactive Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-1.5 font-mono">
            {/* Positive button */}
            <button
              onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all ${
                activeSentimentFilter === 'positive'
                  ? 'border-emerald-500 bg-emerald-500/10 text-emerald-500 ring-1 ring-emerald-500'
                  : 'border-hairline bg-surface-2 text-ink-subtle hover:text-ink hover:border-hairline-strong'
              }`}
            >
              <Smile className="h-3 w-3 text-emerald-500" />
              <span>Positive</span>
              <span className="font-semibold text-ink">{sentiment_percentages.positive}%</span>
              <span className="text-ink-tertiary">({sentiment_counts.positive})</span>
            </button>

            {/* Neutral button */}
            <button
              onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all ${
                activeSentimentFilter === 'neutral'
                  ? 'border-amber-500 bg-amber-500/10 text-amber-500 ring-1 ring-amber-500'
                  : 'border-hairline bg-surface-2 text-ink-subtle hover:text-ink hover:border-hairline-strong'
              }`}
            >
              <Meh className="h-3 w-3 text-amber-500" />
              <span>Neutral</span>
              <span className="font-semibold text-ink">{sentiment_percentages.neutral}%</span>
              <span className="text-ink-tertiary">({sentiment_counts.neutral})</span>
            </button>

            {/* Negative button */}
            <button
              onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 text-xs transition-all ${
                activeSentimentFilter === 'negative'
                  ? 'border-rose-500 bg-rose-500/10 text-rose-500 ring-1 ring-rose-500'
                  : 'border-hairline bg-surface-2 text-ink-subtle hover:text-ink hover:border-hairline-strong'
              }`}
            >
              <Frown className="h-3 w-3 text-rose-500" />
              <span>Negative</span>
              <span className="font-semibold text-ink">{sentiment_percentages.negative}%</span>
              <span className="text-ink-tertiary">({sentiment_counts.negative})</span>
            </button>
          </div>

          {activeSentimentFilter !== 'all' && (
            <button
              onClick={() => onFilterSentiment('all')}
              className="flex items-center gap-1 text-xs text-ink-muted hover:text-ink font-mono transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
              <span>Reset filter</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
