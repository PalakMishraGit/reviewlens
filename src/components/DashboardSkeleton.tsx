'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Loader2, ShieldCheck, Sparkles, Database, FileCheck, CheckCircle2 } from 'lucide-react';

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
      {/* 1. Live Pipeline Processing Banner */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-5 shadow-lg backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-hairline pb-4">
          <div className="flex items-center gap-3.5">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-canvas shadow-sm">
              <Loader2 className="h-5 w-5 animate-spin" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-base font-bold text-ink font-sans">
                  Intelligence Engine Processing
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2.5 py-0.5 text-xs font-semibold text-emerald-500 border border-emerald-500/30 font-mono">
                  <Sparkles className="h-3 w-3 text-amber-500" />
                  Stage {currentStage}/4
                </span>
              </div>
              <p className="text-xs text-ink-subtle mt-0.5 font-mono">{stageMessage}</p>
            </div>
          </div>

          <div className="flex items-center gap-2 font-mono text-xs text-ink-tertiary">
            <span className="inline-block h-2.5 w-2.5 rounded-full bg-emerald-500 animate-ping" />
            <span className="text-emerald-500 font-bold">RFC 4180 Active</span>
          </div>
        </div>

        {/* 4 Pipeline Stages Progress Tiles */}
        <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1 text-xs font-sans">
          <div
            className={`flex items-center gap-2.5 rounded-xl p-3 border transition-all ${
              currentStage === 1
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : currentStage > 1
                ? 'bg-surface-2 border-emerald-500/30 text-ink'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <FileCheck
              className={`h-4 w-4 shrink-0 ${
                currentStage >= 1 ? 'text-emerald-500' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-bold truncate">1. CSV Clean &amp; Parse</div>
              <div className="text-[11px] text-emerald-400 font-mono">RFC 4180 Compliant</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-xl p-3 border transition-all ${
              currentStage === 2
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : currentStage > 2
                ? 'bg-surface-2 border-emerald-500/30 text-ink'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <Database
              className={`h-4 w-4 shrink-0 ${
                currentStage === 2 ? 'text-ink animate-pulse' : currentStage > 2 ? 'text-emerald-500' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-bold truncate">2. SHA-256 Dedupe</div>
              <div className="text-[11px] text-ink-subtle font-mono">Atomic Cache Check</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-xl p-3 border transition-all ${
              currentStage === 3
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : currentStage > 3
                ? 'bg-surface-2 border-emerald-500/30 text-ink'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <ShieldCheck
              className={`h-4 w-4 shrink-0 ${
                currentStage === 3 ? 'text-amber-500 animate-pulse' : currentStage > 3 ? 'text-emerald-500' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-bold truncate">3. Defense Envelope</div>
              <div className="text-[11px] text-amber-400 font-mono">R012 Neutralized</div>
            </div>
          </div>

          <div
            className={`flex items-center gap-2.5 rounded-xl p-3 border transition-all ${
              currentStage === 4
                ? 'bg-surface-3 border-ink text-ink shadow-sm'
                : 'bg-surface-2 border-hairline opacity-60 text-ink-subtle'
            }`}
          >
            <Loader2
              className={`h-4 w-4 shrink-0 ${
                currentStage === 4 ? 'text-ink animate-spin' : 'text-ink-tertiary'
              }`}
            />
            <div className="truncate">
              <div className="font-bold truncate">4. Zod Validation</div>
              <div className="text-[11px] text-ink-subtle font-mono">Chunk Batches of 5</div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. 5 KPI Cards Skeleton with Sparkline Shimmer */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {[...Array(5)].map((_, i) => (
          <div
            key={i}
            className="flex flex-col justify-between h-36 rounded-2xl border border-hairline bg-surface-1 p-5 space-y-3 shadow-sm"
          >
            <div className="flex items-center justify-between">
              <div className="h-4 w-28 rounded-lg shimmer-skeleton" />
              <div className="h-3 w-12 rounded shimmer-skeleton" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-2">
                <div className="h-9 w-20 rounded-lg shimmer-skeleton" />
                <div className="h-3 w-24 rounded shimmer-skeleton" />
              </div>
              <div className="h-8 w-16 rounded shimmer-skeleton" />
            </div>
            <div className="h-2.5 w-full rounded shimmer-skeleton" />
          </div>
        ))}
      </div>

      {/* 3. Sentiment Spectrum Skeleton with Legend */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-5 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-hairline">
          <div className="h-5 w-48 rounded-lg shimmer-skeleton" />
          <div className="flex gap-4">
            <div className="h-4 w-20 rounded shimmer-skeleton" />
            <div className="h-4 w-20 rounded shimmer-skeleton" />
            <div className="h-4 w-20 rounded shimmer-skeleton" />
          </div>
        </div>
        <div className="h-8 w-full rounded-xl shimmer-skeleton" />
        <div className="flex justify-between items-center pt-1">
          <div className="h-6 w-52 rounded-lg shimmer-skeleton" />
          <div className="h-6 w-24 rounded-lg shimmer-skeleton" />
        </div>
      </div>

      {/* 4. Top Complaints & Praises 2-Column Skeleton */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {[...Array(2)].map((_, col) => (
          <div key={col} className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-4 shadow-sm">
            <div className="flex justify-between items-center pb-3 border-b border-hairline">
              <div className="h-5 w-44 rounded-lg shimmer-skeleton" />
              <div className="h-4 w-16 rounded shimmer-skeleton" />
            </div>
            {[...Array(3)].map((_, row) => (
              <div
                key={row}
                className="h-16 w-full rounded-xl border border-hairline bg-surface-2/50 p-4 flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3">
                  <div className="h-6 w-6 rounded-lg shimmer-skeleton" />
                  <div className="space-y-1.5">
                    <div className="h-4 w-36 rounded shimmer-skeleton" />
                    <div className="h-3 w-48 rounded shimmer-skeleton" />
                  </div>
                </div>
                <div className="h-6 w-16 rounded-lg shimmer-skeleton" />
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* 5. Filter Toolbar & Table Skeleton */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-5 shadow-sm">
        {/* Search & Action Bar */}
        <div className="flex items-center justify-between gap-4">
          <div className="h-5 w-56 rounded-lg shimmer-skeleton" />
          <div className="flex gap-2">
            <div className="h-8 w-24 rounded-xl shimmer-skeleton" />
            <div className="h-8 w-20 rounded-xl shimmer-skeleton" />
          </div>
        </div>

        {/* Search input skeleton */}
        <div className="h-11 w-full rounded-xl shimmer-skeleton" />

        {/* Filter Pills Skeleton */}
        <div className="flex items-center justify-between gap-3 pt-1">
          <div className="flex gap-2">
            <div className="h-7 w-20 rounded-lg shimmer-skeleton" />
            <div className="h-7 w-28 rounded-lg shimmer-skeleton" />
            <div className="h-7 w-28 rounded-lg shimmer-skeleton" />
            <div className="h-7 w-24 rounded-lg shimmer-skeleton" />
          </div>
          <div className="flex gap-2">
            <div className="h-8 w-32 rounded-xl shimmer-skeleton" />
            <div className="h-8 w-32 rounded-xl shimmer-skeleton" />
          </div>
        </div>

        {/* Table Rows Skeleton */}
        <div className="space-y-2 pt-2 border-t border-hairline">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex items-center justify-between gap-4 p-4 rounded-xl border border-hairline/60 bg-surface-2/40"
            >
              <div className="flex items-center gap-3">
                <div className="h-4 w-4 rounded shimmer-skeleton" />
                <div className="h-4 w-12 rounded shimmer-skeleton" />
                <div className="h-4 w-32 rounded shimmer-skeleton" />
              </div>
              <div className="h-4 w-16 rounded shimmer-skeleton" />
              <div className="h-6 w-20 rounded-lg shimmer-skeleton" />
              <div className="h-4 w-48 rounded shimmer-skeleton hidden md:block" />
              <div className="h-7 w-16 rounded-xl shimmer-skeleton" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
