'use client';

import React from 'react';
import { TelemetryStats } from '@/types/review';
import { Clock, Cpu, Database, Zap, ShieldCheck } from 'lucide-react';

interface TelemetryBarProps {
  telemetry: TelemetryStats;
}

export const TelemetryBar: React.FC<TelemetryBarProps> = ({ telemetry }) => {
  const {
    total_time_ms,
    ai_calls_made,
    cache_hits,
    total_reviews_processed,
    api_provider,
    model_name,
  } = telemetry;

  const elapsed_seconds = (total_time_ms / 1000).toFixed(2);
  const hitRate =
    total_reviews_processed > 0
      ? Math.round((cache_hits / total_reviews_processed) * 100)
      : 100;

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-hairline bg-surface-1 px-5 py-3 text-xs sm:text-sm text-ink-subtle shadow-sm">
      <div className="flex items-center gap-2.5">
        <div className="flex items-center gap-2 font-bold text-ink text-sm">
          <Zap className="h-4 w-4 text-amber-500" />
          <span>Execution Telemetry</span>
        </div>
        <span className="text-ink-tertiary">•</span>
        <span className="font-mono text-xs font-semibold text-ink-subtle">
          {model_name || api_provider}
        </span>
      </div>

      <div className="flex flex-wrap items-center gap-5 text-xs sm:text-sm font-medium">
        {/* Latency */}
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4 text-ink-tertiary" />
          <span className="text-ink-subtle">Latency:</span>
          <span className="font-mono font-bold text-ink">{elapsed_seconds}s</span>
        </div>

        {/* API Calls */}
        <div className="flex items-center gap-2">
          <Cpu className="h-4 w-4 text-ink-tertiary" />
          <span className="text-ink-subtle">API Calls:</span>
          <span className="font-mono font-bold text-ink">{ai_calls_made}</span>
        </div>

        {/* Cache Hit Rate */}
        <div className="flex items-center gap-2">
          <Database className="h-4 w-4 text-ink-tertiary" />
          <span className="text-ink-subtle">Cache Hits:</span>
          <span className="font-mono font-bold text-emerald-500">
            {cache_hits} ({hitRate}%)
          </span>
        </div>
      </div>
    </div>
  );
};
