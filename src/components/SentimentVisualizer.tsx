'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import { BarChart3, TrendingUp, Award, RotateCcw } from 'lucide-react';

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
  const { sentiment_percentages, sentiment_counts } = summary;

  // Net Sentiment Score (NSS = % Positive - % Negative)
  const netSentimentScore = sentiment_percentages.positive - sentiment_percentages.negative;

  // CSAT Estimation: (Positive + (Neutral * 0.5))
  const csatScore = Math.round(
    sentiment_percentages.positive + sentiment_percentages.neutral * 0.5
  );

  return (
    <div className="rounded-2xl border border-hairline bg-surface-1 p-6 shadow-sm space-y-5 transition-all hover:border-hairline-strong card-glow">
      {/* Top Header & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-hairline pb-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-surface-2 border border-hairline text-ink">
            <BarChart3 className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-base sm:text-lg font-bold text-ink tracking-tight font-sans">
              Sentiment Distribution
            </h3>
            <p className="text-xs text-ink-subtle">
              Proportional distribution of customer ratings &amp; sentiment polarity
            </p>
          </div>
        </div>

        {/* Legend matching Image 1 */}
        <div className="flex flex-wrap items-center gap-4 text-xs font-semibold">
          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
            <span className="text-ink-subtle">Positive</span>
            <span className="font-bold text-ink font-mono">{sentiment_percentages.positive}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500" />
            <span className="text-ink-subtle">Neutral</span>
            <span className="font-bold text-ink font-mono">{sentiment_percentages.neutral}%</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500" />
            <span className="text-ink-subtle">Negative</span>
            <span className="font-bold text-ink font-mono">{sentiment_percentages.negative}%</span>
          </div>

          <div className="hidden md:flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-2 px-2.5 py-1 text-ink-subtle text-[11px] font-mono">
            <span>vs. Benchmark</span>
          </div>
        </div>
      </div>

      {/* Segmented Full-Width Progress Bar with inline percentages */}
      <div className="space-y-3">
        <div className="relative flex h-8 w-full overflow-hidden rounded-xl bg-surface-3 p-1 gap-1.5 shadow-inner">
          {/* Positive segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.positive}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
            title={`Positive: ${sentiment_percentages.positive}% (${sentiment_counts.positive} reviews)`}
            className={`relative h-full rounded-lg bg-emerald-500 flex items-center justify-center text-xs font-bold text-white transition-all hover:brightness-110 focus:outline-none ${
              activeSentimentFilter === 'positive' ? 'ring-2 ring-white ring-offset-2 ring-offset-canvas' : ''
            }`}
          >
            <span className="truncate px-1">{sentiment_percentages.positive}%</span>
          </motion.button>

          {/* Neutral segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.neutral}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.1 }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
            title={`Neutral: ${sentiment_percentages.neutral}% (${sentiment_counts.neutral} reviews)`}
            className={`relative h-full rounded-lg bg-amber-500 flex items-center justify-center text-xs font-bold text-white transition-all hover:brightness-110 focus:outline-none ${
              activeSentimentFilter === 'neutral' ? 'ring-2 ring-white ring-offset-2 ring-offset-canvas' : ''
            }`}
          >
            <span className="truncate px-1">{sentiment_percentages.neutral}%</span>
          </motion.button>

          {/* Negative segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.negative}%` }}
            transition={{ duration: 0.8, ease: 'easeOut', delay: 0.2 }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
            title={`Negative: ${sentiment_percentages.negative}% (${sentiment_counts.negative} reviews)`}
            className={`relative h-full rounded-lg bg-rose-500 flex items-center justify-center text-xs font-bold text-white transition-all hover:brightness-110 focus:outline-none ${
              activeSentimentFilter === 'negative' ? 'ring-2 ring-white ring-offset-2 ring-offset-canvas' : ''
            }`}
          >
            <span className="truncate px-1">{sentiment_percentages.negative}%</span>
          </motion.button>
        </div>

        {/* Bottom Sub-stats: CSAT & Net Sentiment */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs text-ink-subtle">
          <div className="flex items-center gap-3 font-mono">
            <span className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1 border border-hairline">
              <Award className="h-3.5 w-3.5 text-ink-tertiary" />
              <span>Est. CSAT:</span>
              <strong className="text-ink">{csatScore}%</strong>
            </span>

            <span className="flex items-center gap-1.5 rounded-lg bg-surface-2 px-2.5 py-1 border border-hairline">
              <TrendingUp className="h-3.5 w-3.5 text-ink-tertiary" />
              <span>Net Sentiment (NSS):</span>
              <strong className={netSentimentScore >= 0 ? 'text-emerald-500' : 'text-rose-500'}>
                {netSentimentScore > 0 ? `+${netSentimentScore}` : netSentimentScore}
              </strong>
            </span>
          </div>

          {activeSentimentFilter !== 'all' && (
            <button
              onClick={() => onFilterSentiment('all')}
              className="flex items-center gap-1.5 text-xs text-rose-400 hover:text-rose-300 font-mono font-semibold transition-colors"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              <span>Reset filter ({activeSentimentFilter})</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
