'use client';

import React from 'react';
import {
  ShieldCheck,
  Cpu,
  Sparkles,
  Calendar,
} from 'lucide-react';

interface NavbarProps {
  apiProvider?: string;
  onLoadSample?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiProvider = 'Gemini Flash',
  onLoadSample,
  isLoading = false,
}) => {
  return (
    <header className="sticky top-0 z-20 border-b border-hairline bg-canvas/95 backdrop-blur-md px-8 py-5 transition-colors">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Page Title & Context */}
        <div className="space-y-1">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-ink font-sans">
              Review Intelligence
            </h1>
            <span className="rounded-full bg-emerald-500/15 px-3 py-0.5 text-xs font-bold text-emerald-500 border border-emerald-500/30 font-mono">
              Batch 2027
            </span>
          </div>
          <p className="text-xs sm:text-sm text-ink font-medium">
            Understand customer sentiment, detect recurring issues, and uncover product opportunities.
          </p>
        </div>

        {/* Right: Security & Engine Status Badges (High Contrast, No Grey) */}
        <div className="flex flex-wrap items-center gap-4 sm:gap-6">
          {/* Dataset Period Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 px-3.5 py-2 text-xs font-bold text-ink shadow-sm font-mono">
            <Calendar className="h-4 w-4 text-ink" strokeWidth={2.2} />
            <span className="text-ink">Oct 2026</span>
          </div>

          {/* XML Guardrail Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 px-3.5 py-2 text-xs font-bold text-ink shadow-sm font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.2} />
            <span className="text-ink font-bold">XML Guardrail</span>
            <span className="text-emerald-500 font-mono">| R012 Neutralized</span>
          </div>

          {/* Analytical Engine Badge */}
          <div className="flex items-center gap-2 rounded-xl border border-hairline bg-surface-1 px-3.5 py-2 text-xs font-bold text-ink shadow-sm font-mono">
            <Cpu className="h-4 w-4 text-ink shrink-0" strokeWidth={2.2} />
            <span className="text-ink font-bold">{apiProvider}</span>
          </div>

          {/* Quick Benchmark Button */}
          {onLoadSample && (
            <button
              onClick={onLoadSample}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-ink text-canvas hover:opacity-90 active:scale-[0.98] px-4 py-2 text-xs font-bold transition-all shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.2} />
              <span>Benchmark</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
