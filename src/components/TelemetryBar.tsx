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
    <div className="rounded-lg border border-[#23252a] bg-[#0f1011] p-3 text-xs">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2.5">
        <div className="flex items-center gap-2 text-[#62666d]">
          <span className="font-mono text-[11px] text-[#f7f8f8]">Execution telemetry</span>
          <span className="text-[#62666d]">•</span>
          <span className="font-mono text-[11px] text-[#8a8f98]">{model_name}</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-[#8a8f98]">
          {/* Latency */}
          <div className="flex items-center gap-1.5">
            <Clock className="h-3.5 w-3.5 text-[#62666d]" strokeWidth={1.5} />
            <span className="text-[#62666d]">Time:</span>
            <span className="font-mono tabular-nums text-[#f7f8f8]">{seconds}s</span>
          </div>

          {/* AI Calls */}
          <div className="flex items-center gap-1.5">
            <Cpu className="h-3.5 w-3.5 text-[#62666d]" strokeWidth={1.5} />
            <span className="text-[#62666d]">API calls:</span>
            <span className="font-mono tabular-nums text-[#f7f8f8]">{ai_calls_made}</span>
          </div>

          {/* Cache Hits */}
          <div className="flex items-center gap-1.5">
            <Database className="h-3.5 w-3.5 text-[#62666d]" strokeWidth={1.5} />
            <span className="text-[#62666d]">Cache hits:</span>
            <span className="font-mono tabular-nums text-[#27a644]">
              {cache_hits} ({cacheHitRate}%)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
