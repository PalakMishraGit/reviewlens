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
      className="sticky top-5 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      {/* Cinematic Capsule / Semi-Circle Rounded Floating Island */}
      <div className="relative rounded-full border border-hairline-strong bg-surface-1/90 backdrop-blur-2xl shadow-[0_12px_40px_rgba(0,0,0,0.5)] px-6 sm:px-8 py-3 flex items-center justify-between transition-all hover:border-hairline-focus">
        {/* Ambient Top Luminous Hairline Accent */}
        <div className="pointer-events-none absolute inset-x-8 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />

        {/* LEFT SECTION: Store & Security Protocol Badges */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Store Capsule Pill */}
          <div className="flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-extrabold text-ink shadow-sm">
            <Store className="h-3.5 w-3.5 text-emerald-500" strokeWidth={2.4} />
            <span className="hidden sm:inline">Enterprise Store</span>
            <span className="sm:hidden">Store</span>
          </div>

          {/* XML Shield Capsule Badge */}
          <div className="hidden md:flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-mono font-bold text-ink shadow-sm">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2.4} />
            <span className="text-emerald-500 font-extrabold">XML Shield</span>
            <span className="hidden lg:inline text-ink">| R012 Protected</span>
          </div>
        </div>

        {/* CENTER SECTION: Perfectly Centered Brand Name (PulseLens.ai) */}
        <div className="absolute left-1/2 -translate-x-1/2 flex items-center gap-2.5 shrink-0 pointer-events-auto">
          <motion.div
            whileHover={{ rotate: 180, scale: 1.1 }}
            transition={{ duration: 0.5 }}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-canvas shadow-md"
          >
            <Sparkles className="h-4 w-4 text-amber-400" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col items-center select-none">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-ink font-sans">
                PulseLens<span className="text-emerald-500">.ai</span>
              </span>
              <span className="hidden sm:inline-block rounded-full bg-surface-2 px-2 py-0.5 text-[10px] font-mono font-bold text-ink border border-hairline">
                v2.5
              </span>
            </div>
            <span className="text-[9px] font-mono font-bold text-emerald-500 tracking-wider uppercase -mt-0.5">
              Review Intelligence
            </span>
          </div>
        </div>

        {/* RIGHT SECTION: Quick Utilities, Cache, Theme & Benchmark */}
        <div className="flex items-center gap-2 sm:gap-3 shrink-0">
          {/* Cache Counter & Purge */}
          <div className="hidden sm:flex items-center gap-2 rounded-full border border-hairline bg-surface-2 px-3.5 py-1.5 text-xs font-mono font-bold text-ink shadow-sm">
            <Database className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
            <span>{cacheEntries}</span>
            <span className="hidden md:inline font-sans font-medium text-[11px]">cached</span>
            {onClearCache && cacheEntries > 0 && (
              <button
                onClick={onClearCache}
                disabled={isLoading}
                title="Purge SHA-256 local review cache"
                className="ml-1 p-0.5 text-ink hover:text-rose-500 transition-colors"
              >
                <Trash2 className="h-3 w-3" strokeWidth={2.2} />
              </button>
            )}
          </div>

          {/* Theme Mode Toggle (Capsule Pill) */}
          <motion.button
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.92 }}
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode (Press T)`}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.2} />
            ) : (
              <Moon className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
            )}
          </motion.button>

          {/* Keyboard Shortcuts Trigger */}
          {onOpenShortcuts && (
            <motion.button
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
              onClick={onOpenShortcuts}
              title="Keyboard shortcuts & architecture (?)"
              className="hidden sm:flex h-8 w-8 items-center justify-center rounded-full border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm"
            >
              <Keyboard className="h-3.5 w-3.5" strokeWidth={2.2} />
            </motion.button>
          )}

          {/* Quick Benchmark Button */}
          {onLoadSample && (
            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={onLoadSample}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-full bg-ink text-canvas hover:opacity-90 active:scale-[0.98] px-4 sm:px-5 py-2 text-xs font-extrabold transition-all shadow-md font-sans"
            >
              <Sparkles className="h-3.5 w-3.5 text-amber-400" strokeWidth={2.5} />
              <span className="hidden sm:inline">Benchmark</span>
              <span className="sm:hidden">30</span>
            </motion.button>
          )}
        </div>
      </div>
    </motion.header>
  );
};
