'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  Sparkles,
  ShieldCheck,
  Sun,
  Moon,
  Keyboard,
  Database,
  Trash2,
  Store,
} from 'lucide-react';

interface NavbarProps {
  apiProvider?: string;
  cacheEntries?: number;
  onClearCache?: () => void;
  onOpenShortcuts?: () => void;
  onLoadSample?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiProvider = 'Gemini Flash',
  cacheEntries = 0,
  onClearCache,
  onOpenShortcuts,
  onLoadSample,
  isLoading = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -25, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="sticky top-3 sm:top-5 z-40 w-full px-2 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Semi-Circle Rounded Floating Capsule Island */}
      <div className="relative rounded-full border border-hairline-strong bg-surface-1/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-3.5 sm:px-6 lg:px-8 py-2 sm:py-2.5 transition-all hover:border-hairline-focus">
        {/* Ambient Top Luminous Hairline Accent */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* =========================================================================
            DESKTOP VIEW (>= lg / 1024px+): Perfectly Centered Brand with Left & Right Wings
           ========================================================================= */}
        <div className="hidden lg:flex items-center justify-between w-full relative">
          {/* Left Wing */}
          <div className="flex items-center gap-2.5 shrink-0 max-w-[calc(50%-140px)]">
            <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-extrabold text-ink shadow-sm truncate">
              <Store className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2.4} />
              <span className="truncate">Enterprise Store</span>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-mono font-bold text-ink shadow-sm truncate">
              <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2.4} />
              <span className="text-emerald-500 font-extrabold">XML Shield</span>
              <span className="hidden xl:inline text-ink">| R012 Protected</span>
            </div>
          </div>

          {/* Centered Brand with Official Logo */}
          <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 shrink-0 pointer-events-auto">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              transition={{ duration: 0.3 }}
              className="relative flex h-8 w-8 sm:h-9 sm:w-9 shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/20 bg-white shadow-md"
            >
              <img src="/logo-icon.png" alt="PulseLens.ai" className="h-full w-full object-cover scale-105" />
            </motion.div>
            <div className="flex flex-col items-center select-none">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-black tracking-tight text-ink font-sans">
                  PulseLens<span className="text-emerald-500">.ai</span>
                </span>
                <span className="rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-mono font-bold text-ink border border-hairline">
                  v2.5
                </span>
              </div>
              <span className="text-[9px] font-mono font-bold text-emerald-500 tracking-wider uppercase -mt-0.5">
                Review Intelligence
              </span>
            </div>
          </div>

          {/* Right Wing */}
          <div className="flex items-center gap-2 sm:gap-2.5 shrink-0 max-w-[calc(50%-140px)] justify-end">
            {/* Cache Counter & Purge */}
            <div className="flex items-center gap-1.5 rounded-full border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-mono font-bold text-ink shadow-sm">
              <Database className="h-3.5 w-3.5 text-ink shrink-0" strokeWidth={2.2} />
              <span>{cacheEntries}</span>
              <span className="hidden xl:inline font-sans font-medium text-[11px]">cached</span>
              {onClearCache && cacheEntries > 0 && (
                <button
                  onClick={onClearCache}
                  disabled={isLoading}
                  title="Purge SHA-256 local review cache"
                  className="ml-0.5 p-0.5 text-ink hover:text-rose-500 transition-colors"
                >
                  <Trash2 className="h-3 w-3" strokeWidth={2.2} />
                </button>
              )}
            </div>

            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode (Press T)`}
              className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm shrink-0"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.2} />
              ) : (
                <Moon className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
              )}
            </motion.button>

            {/* Shortcuts */}
            {onOpenShortcuts && (
              <motion.button
                whileHover={{ scale: 1.08 }}
                whileTap={{ scale: 0.92 }}
                onClick={onOpenShortcuts}
                title="Keyboard shortcuts & architecture (?)"
                className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm shrink-0"
              >
                <Keyboard className="h-3.5 w-3.5" strokeWidth={2.2} />
              </motion.button>
            )}

            {/* Benchmark Trigger */}
            {onLoadSample && (
              <motion.button
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.96 }}
                onClick={onLoadSample}
                disabled={isLoading}
                className="flex items-center gap-1.5 rounded-full bg-ink text-canvas hover:opacity-90 active:scale-[0.98] px-4 py-2 text-xs font-extrabold transition-all shadow-md font-sans shrink-0"
              >
                <Sparkles className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
                <span>Benchmark</span>
              </motion.button>
            )}
          </div>
        </div>

        {/* =========================================================================
            MOBILE & TABLET VIEW (< lg / < 1024px): Zero Collision Fluid Layout
           ========================================================================= */}
        <div className="flex lg:hidden items-center justify-between w-full gap-2">
          {/* Brand with Official Logo */}
          <div className="flex items-center gap-2 sm:gap-2.5 min-w-0 shrink">
            <motion.div
              whileHover={{ rotate: 10, scale: 1.08 }}
              className="relative flex h-7 w-7 sm:h-8 sm:w-8 shrink-0 items-center justify-center rounded-full overflow-hidden border border-white/20 bg-white shadow-md"
            >
              <img src="/logo-icon.png" alt="PulseLens.ai" className="h-full w-full object-cover scale-105" />
            </motion.div>
            <div className="flex flex-col select-none truncate">
              <div className="flex items-center gap-1">
                <span className="text-sm sm:text-base font-black tracking-tight text-ink font-sans truncate">
                  PulseLens<span className="text-emerald-500">.ai</span>
                </span>
                <span className="hidden sm:inline-block rounded-full bg-surface-2 px-1.5 py-0.2 text-[9px] font-mono font-bold text-ink border border-hairline">
                  v2.5
                </span>
              </div>
              <span className="hidden xs:block text-[8px] sm:text-[9px] font-mono font-bold text-emerald-500 tracking-wider uppercase -mt-0.5 truncate">
                Review Intelligence
              </span>
            </div>
          </div>

          {/* Right Action Utilities */}
          <div className="flex items-center gap-1.5 sm:gap-2 shrink-0">
            {/* Cache counter (sm only) */}
            <div className="hidden sm:flex items-center gap-1 rounded-full border border-hairline bg-surface-2 px-2.5 py-1 text-[11px] font-mono font-bold text-ink">
              <Database className="h-3 w-3 text-ink" strokeWidth={2.2} />
              <span>{cacheEntries}</span>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode`}
              className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.2} />
              ) : (
                <Moon className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
              )}
            </button>

            {/* Shortcuts Trigger (sm only) */}
            {onOpenShortcuts && (
              <button
                onClick={onOpenShortcuts}
                title="Shortcuts (?)"
                className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm"
              >
                <Keyboard className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
            )}

            {/* Benchmark Trigger */}
            {onLoadSample && (
              <button
                onClick={onLoadSample}
                disabled={isLoading}
                className="flex items-center gap-1 sm:gap-1.5 rounded-full bg-ink text-canvas hover:opacity-90 active:scale-95 px-3 sm:px-4 py-1.5 text-xs font-black transition-all shadow-md font-sans"
              >
                <Sparkles className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-amber-400" strokeWidth={2.5} />
                <span className="hidden sm:inline">Benchmark</span>
                <span className="sm:hidden">30</span>
              </button>
            )}
          </div>
        </div>
      </div>
    </motion.header>
  );
};
