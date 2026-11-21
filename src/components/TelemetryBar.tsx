'use client';

import React from 'react';
import { TelemetryStats } from '@/types/review';
import { Clock, Zap, Database, Cpu, ShieldCheck } from 'lucide-react';

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

  const seconds = (total_time_ms / 1000).toFixed(2);
  const cacheHitRate =
    total_reviews_processed > 0
      ? Math.round((cache_hits / total_reviews_processed) * 100)
      : 0;

  return (
    <div className="rounded-2xl border border-slate-800 bg-slate-900/40 p-4 backdrop-blur-sm">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
          <Zap className="h-4 w-4 text-amber-400" />
          <span>Execution Telemetry &amp; Cost Intelligence</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-xs">
          {/* Latency */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Clock className="h-3.5 w-3.5 text-cyan-400" />
            <span className="text-slate-400">Total Latency:</span>
            <span className="font-mono font-bold text-slate-100">{seconds}s</span>
          </div>

          {/* AI Calls */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-slate-400">API Calls:</span>
            <span className="font-mono font-bold text-slate-100">{ai_calls_made}</span>
          </div>

          {/* Cache Hits */}
          <div className="flex items-center gap-1.5 text-slate-300">
            <Database className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-slate-400">Served from Cache:</span>
            <span className="font-mono font-bold text-emerald-400">
              {cache_hits} ({cacheHitRate}%)
            </span>
          </div>

          {/* Provider / Model */}
          <div className="hidden lg:flex items-center gap-1.5 text-slate-400 text-[11px]">
            <span className="rounded bg-slate-800 px-2 py-0.5 font-mono text-slate-300">
              {model_name}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};
