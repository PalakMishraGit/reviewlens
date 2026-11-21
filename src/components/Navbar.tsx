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
  Layers,
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
    <header className="sticky top-0 z-40 h-16 border-b border-hairline bg-canvas/80 backdrop-blur-xl transition-colors">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand & Identity */}
        <div className="flex items-center gap-3">
          <div className="group relative flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-violet-700 text-white shadow-md shadow-indigo-500/20 ring-1 ring-white/20">
            <Layers className="h-4 w-4 transition-transform group-hover:scale-110" />
            <span className="absolute -bottom-0.5 -right-0.5 flex h-2.5 w-2.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
            </span>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm sm:text-base font-semibold tracking-tight text-ink">
                ReviewLens
              </span>
              <span className="rounded-full bg-indigo-500/10 px-2 py-0.5 text-[10px] font-medium text-indigo-400 border border-indigo-500/20 font-mono">
                v2.1
              </span>
            </div>
            <div className="hidden sm:flex items-center gap-2 text-[11px] text-ink-subtle">
              <span>CEDCOSS Intelligence</span>
              <span className="text-ink-tertiary">•</span>
              <span className="text-ink-tertiary font-mono">Batch 2027</span>
            </div>
          </div>
        </div>

        {/* Center / Status Chips (Desktop) */}
        <div className="hidden md:flex items-center gap-2">
          {/* Adversarial Defense Pill */}
          <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-xs text-ink shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span className="font-medium text-[11px]">Adversarial Defense</span>
            <span className="text-[10px] text-emerald-400 font-mono">R012 Protected</span>
          </div>

          {/* Engine Status */}
          <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface-1 px-3 py-1 text-xs text-ink shadow-sm">
            <Cpu className="h-3.5 w-3.5 text-indigo-400" />
            <span className="text-ink-tertiary text-[11px]">Engine:</span>
            <span className="font-mono text-[11px] font-medium text-ink">{apiProvider}</span>
          </div>
        </div>

        {/* Right Actions & Utilities */}
        <div className="flex items-center gap-2">
          {/* Cache Indicator */}
          <div className="flex items-center gap-1.5 rounded-lg border border-hairline bg-surface-1 px-2.5 py-1.5 text-xs text-ink shadow-sm">
            <Database className="h-3.5 w-3.5 text-ink-tertiary" />
            <span className="font-mono text-xs tabular-nums font-semibold text-ink">{cacheEntries}</span>
            <span className="hidden sm:inline text-ink-tertiary text-[11px]">cached</span>
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

          {/* Theme Switcher Button */}
          <button
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode (Press T)`}
            className="flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-1 text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400 transition-transform hover:rotate-45" />
            ) : (
              <Moon className="h-4 w-4 text-indigo-500 transition-transform hover:-rotate-12" />
            )}
          </button>

          {/* Shortcuts & Guide Button */}
          {onOpenShortcuts && (
            <button
              onClick={onOpenShortcuts}
              title="Keyboard shortcuts & architecture (?)"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-lg border border-hairline bg-surface-1 text-ink-subtle hover:text-ink hover:border-hairline-strong transition-colors shadow-sm"
            >
              <HelpCircle className="h-4 w-4" />
            </button>
          )}

          {/* Benchmark Dataset Quick Button (if provided) */}
          {onLoadSample && (
            <button
              onClick={onLoadSample}
              disabled={isLoading}
              className="hidden lg:flex items-center gap-1.5 rounded-lg bg-surface-2 border border-hairline px-3 py-1.5 text-xs font-medium text-ink hover:bg-surface-3 transition-colors shadow-sm"
            >
              <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
              <span>Benchmark 30</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
