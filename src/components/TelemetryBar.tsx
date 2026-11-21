'use client';

import React from 'react';
import { TelemetryStats } from '@/types/review';
import { Clock, Cpu, Database } from 'lucide-react';

interface TelemetryBarProps {
  telemetry: TelemetryStats;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry }) => {
  const {
    total_time_ms,
    ai_calls_made,
    cache_hits,
    total_reviews_processed,
    model_name,
  } = telemetry;

  const seconds = (total_time_ms / 1000).toFixed(2);
  const cacheHitRate =
    total_reviews_processed > 0
      ? Math.round((cache_hits / total_reviews_processed) * 100)
      : 0;

  return (
    <div className="rounded-xl border border-white/[0.08] bg-[#11141c] p-3 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-[#7a8296]">
          <span className="font-mono text-[11px] text-[#eef0f5]">Execution telemetry</span>
          <span className="text-[#7a8296]">•</span>
          <span className="font-mono text-[11px] text-[#7a8296]">{model_name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[#7a8296]">
          {/* Latency */}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Time:</span>
            <span className="font-mono tabular-nums text-[#eef0f5]">{seconds}s</span>
          </div>

          {/* AI Calls */}
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>API calls:</span>
            <span className="font-mono tabular-nums text-[#eef0f5]">{ai_calls_made}</span>
          </div>

          {/* Cache Hits */}
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5" strokeWidth={1.5} />
            <span>Cache hits:</span>
            <span className="font-mono tabular-nums text-[#4cc38a]">
              {cache_hits} ({cacheHitRate}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
