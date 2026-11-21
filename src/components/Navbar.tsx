'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  Database,
  Trash2,
  ShieldCheck,
  Cpu,
  Sun,
  Moon,
  HelpCircle,
  Sparkles,
  SlidersHorizontal,
  Terminal,
} from 'lucide-react';

interface NavbarProps {
  cacheEntries?: number;
  apiProvider?: string;
  onClearCache?: () => void;
  onOpenShortcuts?: () => void;
  onLoadSample?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cacheEntries = 0,
  apiProvider = 'Gemini Flash',
  onClearCache,
  onOpenShortcuts,
  onLoadSample,
  isLoading = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="sticky top-0 z-40 h-14 border-b border-hairline bg-canvas/90 backdrop-blur-md transition-colors">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Identity (Technical Precision) */}
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 border border-hairline-strong text-ink shadow-sm">
            <Terminal className="h-4 w-4 text-ink" />
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold tracking-tight text-ink font-sans">
                ReviewLens
              </span>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono text-ink-subtle border border-hairline">
                v2.2
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/10 px-2 py-0.5 text-[10px] font-mono text-emerald-500 border border-emerald-500/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                Live Console
              </span>
            </div>
          </div>
        </div>

        {/* Center / Security Status */}
        <div className="hidden md:flex items-center gap-2">
          {/* Defense Protocol Badge */}
          <div className="flex items-center gap-1.5 rounded-md border border-hairline bg-surface-1 px-2.5 py-1 text-xs text-ink-subtle shadow-sm font-mono">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="text-[11px] text-ink">XML Guardrail</span>
            <span className="text-[10px] text-ink-tertiary">| R012 Neutralized</span>
          </div>

          {/* Engine Status */}
          <div className="flex items-center gap-1.5 rounded-md border border-hairline bg-surface-1 px-2.5 py-1 text-xs text-ink-subtle shadow-sm font-mono">
            <Cpu className="h-3.5 w-3.5 text-ink-tertiary" />
            <span className="text-[11px] text-ink">{apiProvider}</span>
          </div>
        </div>

        {/* Right Utilities */}
        <div className="flex items-center gap-2">
          {/* Cache Counter & Purge */}
          <div className="flex items-center gap-1.5 rounded-md border border-hairline bg-surface-1 px-2 py-1 text-xs text-ink shadow-sm font-mono">
            <Database className="h-3.5 w-3.5 text-ink-tertiary" />
            <span className="text-xs tabular-nums font-semibold text-ink">{cacheEntries}</span>
            <span className="hidden sm:inline text-ink-tertiary text-[10px]">cached</span>
            {onClearCache && cacheEntries > 0 && (
              <button
                onClick={onClearCache}
                disabled={isLoading}
                title="Purge SHA-256 local review cache"
                className="ml-1 p-0.5 text-ink-tertiary hover:text-rose-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            )}
          </div>

          {/* Theme Toggle (Monochrome) */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode (Press T)`}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-surface-1 text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" />
            ) : (
              <Moon className="h-3.5 w-3.5 text-zinc-900" />
            )}
          </button>

          {/* Shortcuts Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              title="Keyboard shortcuts & architecture (?)"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-md border border-hairline bg-surface-1 text-ink-subtle hover:text-ink hover:border-hairline-strong transition-colors shadow-sm"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          )}

          {/* Quick Benchmark Button (High-contrast pure white/black) */}
          {onLoadSample && (
            <button
              onClick={onLoadSample}
              disabled={isLoading}
              className="flex items-center gap-1.5 rounded-md bg-ink text-canvas hover:opacity-90 active:scale-[0.98] px-3 py-1 text-xs font-medium transition-all shadow-sm"
            >
              <Sparkles className="h-3 w-3" />
              <span>Benchmark 30</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
