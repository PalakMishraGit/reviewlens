'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { AnalysisSummary } from '@/types/review';
import { TrendingUp, Smile, Meh, Frown, Check } from 'lucide-react';

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

  // Calculate Net Sentiment Score (NSS = % Positive - % Negative)
  const netSentimentScore = sentiment_percentages.positive - sentiment_percentages.negative;

  return (
    <div className="rounded-xl border border-[#23252a] bg-[#0f1011] p-5 space-y-4">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#23252a] pb-3.5">
        <div>
          <h3 className="text-sm font-medium text-[#f7f8f8] flex items-center gap-2">
            Sentiment telemetry &amp; distribution
            <span className="font-mono text-[10px] text-[#8a8f98] bg-[#141516] px-1.5 py-0.5 rounded border border-[#23252a]">
              Interactive
            </span>
          </h3>
          <p className="text-xs text-[#8a8f98] mt-0.5">
            Click any segment or sentiment pill to filter reviews in real time
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs">
          <span className="text-[#8a8f98]">Net sentiment index:</span>
          <span
            className={`font-mono font-medium px-2 py-0.5 rounded border ${
              netSentimentScore >= 0
                ? 'border-[#27a644]/30 bg-[#27a644]/10 text-[#27a644]'
                : 'border-[#eb5757]/30 bg-[#eb5757]/10 text-[#eb5757]'
            }`}
          >
            {netSentimentScore > 0 ? `+${netSentimentScore}` : netSentimentScore}
          </span>
        </div>
      </div>

      {/* Interactive Segmented Progress Bar */}
      <div className="space-y-2">
        <div className="relative flex h-3 w-full overflow-hidden rounded-full bg-[#18191a] p-0.5 gap-0.5">
          {/* Positive segment */}
          <motion.button
            type="button"
            initial={{ width: 0 }}
            animate={{ width: `${sentiment_percentages.positive}%` }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
            title={`Positive: ${sentiment_percentages.positive}% (${sentiment_counts.positive} reviews). Click to filter.`}
            className={`relative h-full rounded-l-full bg-[#27a644] transition-all hover:brightness-125 focus:outline-none ${
              activeSentimentFilter === 'positive' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#010102]' : ''
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
            className={`relative h-full bg-[#f59e0b] transition-all hover:brightness-125 focus:outline-none ${
              activeSentimentFilter === 'neutral' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#010102]' : ''
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
            className={`relative h-full rounded-r-full bg-[#eb5757] transition-all hover:brightness-125 focus:outline-none ${
              activeSentimentFilter === 'negative' ? 'ring-2 ring-white ring-offset-1 ring-offset-[#010102]' : ''
            }`}
          />
        </div>

        {/* Legend / Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-3 text-xs pt-1">
          <div className="flex flex-wrap items-center gap-2">
            {/* Positive button */}
            <button
              onClick={() => onFilterSentiment(activeSentimentFilter === 'positive' ? 'all' : 'positive')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition-all ${
                activeSentimentFilter === 'positive'
                  ? 'border-[#27a644] bg-[#27a644]/10 text-[#27a644] shadow-sm'
                  : 'border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a]'
              }`}
            >
              <Smile className="h-3.5 w-3.5 text-[#27a644]" strokeWidth={1.5} />
              <span>Positive</span>
              <span className="font-mono font-medium text-[#f7f8f8] ml-1">{sentiment_percentages.positive}%</span>
              <span className="text-[#62666d]">({sentiment_counts.positive})</span>
            </button>

            {/* Neutral button */}
            <button
              onClick={() => onFilterSentiment(activeSentimentFilter === 'neutral' ? 'all' : 'neutral')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition-all ${
                activeSentimentFilter === 'neutral'
                  ? 'border-[#f59e0b] bg-[#f59e0b]/10 text-[#f59e0b] shadow-sm'
                  : 'border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a]'
              }`}
            >
              <Meh className="h-3.5 w-3.5 text-[#f59e0b]" strokeWidth={1.5} />
              <span>Neutral</span>
              <span className="font-mono font-medium text-[#f7f8f8] ml-1">{sentiment_percentages.neutral}%</span>
              <span className="text-[#62666d]">({sentiment_counts.neutral})</span>
            </button>

            {/* Negative button */}
            <button
              onClick={() => onFilterSentiment(activeSentimentFilter === 'negative' ? 'all' : 'negative')}
              className={`flex items-center gap-1.5 rounded-lg border px-2.5 py-1 transition-all ${
                activeSentimentFilter === 'negative'
                  ? 'border-[#eb5757] bg-[#eb5757]/10 text-[#eb5757] shadow-sm'
                  : 'border-[#23252a] bg-[#141516] text-[#8a8f98] hover:text-[#f7f8f8] hover:border-[#34343a]'
              }`}
            >
              <Frown className="h-3.5 w-3.5 text-[#eb5757]" strokeWidth={1.5} />
              <span>Negative</span>
              <span className="font-mono font-medium text-[#f7f8f8] ml-1">{sentiment_percentages.negative}%</span>
              <span className="text-[#62666d]">({sentiment_counts.negative})</span>
            </button>
          </div>

          {activeSentimentFilter !== 'all' && (
            <button
              onClick={() => onFilterSentiment('all')}
              className="text-xs text-[#5e6ad2] hover:underline"
            >
              Clear sentiment filter
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
