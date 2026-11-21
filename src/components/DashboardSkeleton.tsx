'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Sparkles, Database, FileCheck } from 'lucide-react';

interface DashboardSkeletonProps {
  stageMessage?: string;
  activeStage?: number;
}

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({
  stageMessage = 'Analyzing customer reviews & running adversarial defense checks...',
  activeStage,
}) => {
  const currentStage =
    activeStage ??
    (stageMessage.includes('Stage 1') || stageMessage.includes('Parsing')
      ? 1
      : stageMessage.includes('Stage 2') || stageMessage.includes('SHA-256')
      ? 2
      : stageMessage.includes('Stage 3') || stageMessage.includes('injection')
      ? 3
      : stageMessage.includes('Stage 4') || stageMessage.includes('Zod')
      ? 4
      : 1);

  return (
    <div className="w-full space-y-6 animate-in fade-in duration-300">
      {/* Live Pipeline Processing Banner */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-3.5">
          <div className="flex items-center gap-3">
            <div className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 border border-hairline text-ink">
              <Loader2 className="h-4 w-4 animate-spin text-ink" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">Intelligence Engine Processing</span>
                <span className="inline-flex items-center gap-1 rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-medium text-ink-subtle border border-hairline font-mono">
                  <Sparkles className="h-2.5 w-2.5 text-amber-500" />
                  Stage {currentStage}/4
                </span>
              </div>
              <p className="text-xs text-ink-subtle mt-0.5">{stageMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-[11px] text-ink-tertiary">
            <span className="inline-block h-2 w-2 rounded-full bg-emerald-500 animate-ping" />
            <span>RFC 4180 Active</span>
          </div>
        </div>

        {/* 4 Pipeline Stages */}
        <div className="mt-3.5 grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1 text-xs">
          <div
            className={`flex items-center gap-2 rounded-lg p-2 border transition-all ${
              currentStage === 1
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : currentStage > 1
                ? 'bg-surface-2 border-emerald-500/30 text-ink'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <FileCheck
              className={`h-3.5 w-3.5 shrink-0 ${
                currentStage >= 1 ? 'text-emerald-500' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-medium truncate">1. CSV Clean &amp; Parse</div>
              <div className="text-[10px] text-emerald-400">RFC 4180 Compliant</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-lg p-2 border transition-all ${
              currentStage === 2
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : currentStage > 2
                ? 'bg-surface-2 border-emerald-500/30 text-ink'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <Database
              className={`h-3.5 w-3.5 shrink-0 ${
                currentStage === 2 ? 'text-ink animate-pulse' : currentStage > 2 ? 'text-emerald-500' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-medium truncate">2. SHA-256 Dedupe</div>
              <div className="text-[10px] text-ink-subtle">Atomic Cache Check</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-lg p-2 border transition-all ${
              currentStage === 3
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : currentStage > 3
                ? 'bg-surface-2 border-emerald-500/30 text-ink'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <ShieldCheck
              className={`h-3.5 w-3.5 shrink-0 ${
                currentStage === 3 ? 'text-amber-500 animate-pulse' : currentStage > 3 ? 'text-emerald-500' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-medium truncate">3. Defense Envelope</div>
              <div className="text-[10px] text-amber-400">Neutralizing Injections</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2 rounded-lg p-2 border transition-all ${
              currentStage === 4
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <Loader2
              className={`h-3.5 w-3.5 shrink-0 ${
                currentStage === 4 ? 'text-ink animate-spin' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-medium truncate">4. Zod Validation</div>
              <div className="text-[10px] text-ink-subtle">Chunk Batches of 5</div>
            </div>
          </div>
        </div>
      </div>

      {/* Shimmer Telemetry Bar */}
      <div className="h-9 w-full rounded-lg border border-hairline shimmer-skeleton" />

      {/* 6 KPI Cards Skeleton */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-24 rounded-xl border border-hairline bg-surface-1 p-3.5 space-y-2 shadow-sm"
          >
            <div className="h-3 w-16 rounded shimmer-skeleton" />
            <div className="h-7 w-20 rounded shimmer-skeleton" />
            <div className="h-2.5 w-12 rounded shimmer-skeleton" />
          </div>
        ))}
      </div>

      {/* Shimmer Sentiment Bar */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-5 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div className="h-4 w-44 rounded shimmer-skeleton" />
          <div className="h-4 w-28 rounded shimmer-skeleton" />
        </div>
        <div className="h-3 w-full rounded-full shimmer-skeleton" />
        <div className="flex gap-2">
          <div className="h-7 w-24 rounded-lg shimmer-skeleton" />
          <div className="h-7 w-24 rounded-lg shimmer-skeleton" />
          <div className="h-7 w-24 rounded-lg shimmer-skeleton" />
        </div>
      </div>

      {/* Top 3 Complaints & Top 3 Praises Skeleton */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {[...Array(2)].map((_, col) => (
          <div key={col} className="rounded-xl border border-hairline bg-surface-1 p-4 space-y-3">
            <div className="flex justify-between items-center pb-2 border-b border-hairline">
              <div className="h-4 w-32 rounded shimmer-skeleton" />
              <div className="h-3 w-16 rounded shimmer-skeleton" />
            </div>
            {[...Array(3)].map((_, row) => (
              <div key={row} className="h-16 w-full rounded-lg border border-hairline shimmer-skeleton" />
            ))}
          </div>
        ))}
      </div>

      {/* Reviews Table Skeleton */}
      <div className="rounded-xl border border-hairline bg-surface-1 p-4 space-y-3.5 shadow-sm">
        {/* Controls Skeleton */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 border-b border-hairline pb-3">
          <div className="h-8 w-64 rounded-lg shimmer-skeleton" />
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-lg shimmer-skeleton" />
            <div className="h-8 w-24 rounded-lg shimmer-skeleton" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-2 pt-2">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 p-3 rounded-lg border border-hairline/60 bg-surface-2/40"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded shimmer-skeleton" />
                <div className="h-4 w-12 rounded shimmer-skeleton" />
                <div className="h-4 w-32 rounded shimmer-skeleton" />
              </div>
              <div className="h-4 w-14 rounded shimmer-skeleton" />
              <div className="h-4 w-16 rounded-full shimmer-skeleton" />
              <div className="h-4 w-48 rounded shimmer-skeleton hidden md:block" />
              <div className="h-6 w-16 rounded shimmer-skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
