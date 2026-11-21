'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { useTheme } from '@/context/ThemeContext';
import {
  Sparkles,
  ShieldCheck,
  Cpu,
  Sun,
  Moon,
  Keyboard,
  Database,
  Trash2,
  Store,
  Layers,
  LayoutDashboard,
  MessageSquareText,
  Boxes,
  Activity,
} from 'lucide-react';

interface NavbarProps {
  apiProvider?: string;
  cacheEntries?: number;
  onClearCache?: () => void;
  onOpenShortcuts?: () => void;
  onLoadSample?: () => void;
  isLoading?: boolean;
  activeTab: 'overview' | 'reviews' | 'products' | 'telemetry';
  onSelectTab: (tab: 'overview' | 'reviews' | 'products' | 'telemetry') => void;
  hasData: boolean;
  reviewCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  apiProvider = 'Gemini Flash',
  cacheEntries = 0,
  onClearCache,
  onOpenShortcuts,
  onLoadSample,
  isLoading = false,
  activeTab,
  onSelectTab,
  hasData,
  reviewCount,
}) => {
  const { theme, toggleTheme } = useTheme();

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="sticky top-4 z-40 w-full px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
    >
      <div className="relative rounded-2xl border border-hairline-strong bg-surface-1/85 backdrop-blur-xl shadow-2xl px-5 sm:px-6 py-3.5 flex items-center justify-between gap-4 transition-all hover:border-hairline-focus">
        {/* LEFT SECTION: Context, Navigation & Security */}
        <div className="flex items-center gap-3 sm:gap-4 min-w-0">
          {/* Store / Merchant Pill */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-bold text-ink shadow-sm">
            <Store className="h-4 w-4 text-emerald-500" strokeWidth={2.2} />
            <span className="truncate max-w-[120px] lg:max-w-none">CEDCOSS Store</span>
          </div>

          {/* Navigation Pills when reviews are loaded */}
          {hasData && (
            <div className="flex items-center gap-1 rounded-xl border border-hairline bg-surface-2/60 p-1">
              <button
                data-testid="tab-overview"
                onClick={() => onSelectTab('overview')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'overview'
                    ? 'bg-ink text-canvas shadow-sm font-extrabold'
                    : 'text-ink hover:bg-surface-3'
                }`}
              >
                <LayoutDashboard className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span className="hidden md:inline">Overview</span>
              </button>

              <button
                data-testid="tab-reviews"
                onClick={() => onSelectTab('reviews')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-ink text-canvas shadow-sm font-extrabold'
                    : 'text-ink hover:bg-surface-3'
                }`}
              >
                <MessageSquareText className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span>Reviews ({reviewCount})</span>
              </button>

              <button
                data-testid="tab-products"
                onClick={() => onSelectTab('products')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'products'
                    ? 'bg-ink text-canvas shadow-sm font-extrabold'
                    : 'text-ink hover:bg-surface-3'
                }`}
              >
                <Boxes className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span>Products</span>
              </button>

              <button
                data-testid="tab-telemetry"
                onClick={() => onSelectTab('telemetry')}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'telemetry'
                    ? 'bg-ink text-canvas shadow-sm font-extrabold'
                    : 'text-ink hover:bg-surface-3'
                }`}
              >
                <Activity className="h-3.5 w-3.5" strokeWidth={2.2} />
                <span>Telemetry</span>
              </button>
            </div>
          )}

          {/* XML Guardrail status badge */}
          <div className="hidden lg:flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-bold text-ink shadow-sm font-mono">
            <ShieldCheck className="h-4 w-4 text-emerald-500 shrink-0" strokeWidth={2.2} />
            <span className="text-emerald-500 font-extrabold">XML Shield</span>
            <span className="text-ink">R012 Protected</span>
          </div>
        </div>

        {/* CENTER SECTION: Amazing New Brand Name (PulseLens AI) */}
        <div className="flex items-center gap-2.5 shrink-0 justify-center">
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.6 }}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-ink text-canvas shadow-md"
          >
            <Sparkles className="h-5 w-5 text-amber-400" strokeWidth={2.5} />
          </motion.div>
          <div className="flex flex-col items-center">
            <div className="flex items-center gap-1.5">
              <span className="text-lg sm:text-xl font-black tracking-tight text-ink font-sans">
                PulseLens<span className="text-emerald-500">.ai</span>
              </span>
              <span className="rounded-md bg-surface-2 px-1.5 py-0.5 text-[10px] font-mono font-bold text-ink border border-hairline">
                v2.5
              </span>
            </div>
            <span className="text-[10px] font-mono font-bold text-emerald-500 tracking-wider uppercase -mt-0.5">
              Review Intelligence
            </span>
          </div>
        </div>

        {/* RIGHT SECTION: Quick Utilities, Cache, Theme & Benchmark */}
        <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
          {/* Cache Counter & Purge */}
          <div className="hidden sm:flex items-center gap-2 rounded-xl border border-hairline bg-surface-2 px-3 py-1.5 text-xs font-mono font-bold text-ink shadow-sm">
            <Database className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
            <span>{cacheEntries}</span>
            <span className="hidden md:inline">cached</span>
            {onClearCache && cacheEntries > 0 && (
              <button
                onClick={onClearCache}
                disabled={isLoading}
                title="Purge SHA-256 local review cache"
                className="ml-1 p-0.5 text-ink hover:text-rose-500 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" strokeWidth={2.2} />
              </button>
            )}
          </div>

          {/* Theme Mode Toggle (High Contrast) */}
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleTheme}
            title={`Switch to ${theme === 'dark' ? 'Light' : 'Dark'} mode (Press T)`}
            className="flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm"
          >
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" strokeWidth={2.2} />
            ) : (
              <Moon className="h-4 w-4 text-ink" strokeWidth={2.2} />
            )}
          </motion.button>

          {/* Keyboard Shortcuts Button */}
          {onOpenShortcuts && (
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onOpenShortcuts}
              title="Keyboard shortcuts & architecture (?)"
              className="hidden sm:flex h-9 w-9 items-center justify-center rounded-xl border border-hairline bg-surface-2 text-ink hover:border-hairline-strong transition-all shadow-sm"
            >
              <Keyboard className="h-4 w-4" strokeWidth={2.2} />
            </motion.button>
          )}

          {/* Quick Benchmark Button */}
          {onLoadSample && (
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={onLoadSample}
              disabled={isLoading}
              className="flex items-center gap-2 rounded-xl bg-ink text-canvas hover:opacity-90 active:scale-[0.98] px-4 py-2 text-xs font-extrabold transition-all shadow-md font-sans"
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
