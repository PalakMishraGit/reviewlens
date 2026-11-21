'use client';

import React from 'react';
import { useTheme } from '@/context/ThemeContext';
import {
  LayoutDashboard,
  MessageSquareText,
  Boxes,
  Activity,
  Sun,
  Moon,
  Keyboard,
  Database,
  Trash2,
  Sparkles,
  ChevronDown,
  Store,
  Terminal,
  HelpCircle,
  Settings,
} from 'lucide-react';

interface SidebarProps {
  activeTab: 'overview' | 'reviews' | 'products' | 'telemetry';
  onSelectTab: (tab: 'overview' | 'reviews' | 'products' | 'telemetry') => void;
  reviewCount: number;
  productCount: number;
  cacheEntries?: number;
  onClearCache?: () => void;
  onOpenShortcuts?: () => void;
  onLoadSample?: () => void;
  isLoading?: boolean;
}

export const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  onSelectTab,
  reviewCount,
  productCount,
  cacheEntries = 0,
  onClearCache,
  onOpenShortcuts,
  onLoadSample,
  isLoading = false,
}) => {
  const { theme, toggleTheme } = useTheme();

  const navItems = [
    {
      id: 'overview' as const,
      label: 'Overview',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      id: 'reviews' as const,
      label: 'Reviews',
      icon: MessageSquareText,
      badge: reviewCount > 0 ? String(reviewCount) : null,
    },
    {
      id: 'products' as const,
      label: 'Products',
      icon: Boxes,
      badge: productCount > 0 ? String(productCount) : null,
    },
    {
      id: 'telemetry' as const,
      label: 'Telemetry & Logs',
      icon: Activity,
      badge: 'Live',
    },
  ];

  return (
    <aside className="w-64 shrink-0 border-r border-hairline bg-surface-1/90 backdrop-blur-md flex flex-col justify-between h-screen sticky top-0 transition-colors z-30 select-none">
      {/* Top Header & Store Selector */}
      <div className="p-5 space-y-4">
        {/* Brand identity */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-ink text-canvas shadow-md">
            <Sparkles className="h-5 w-5 text-amber-400" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="text-lg font-extrabold tracking-tight text-ink font-sans">
                ReviewLens
              </span>
              <span className="rounded bg-surface-2 px-1.5 py-0.5 text-[11px] font-mono font-semibold text-ink-subtle border border-hairline">
                v2.2
              </span>
            </div>
            <p className="text-[11px] text-ink-tertiary font-medium">Merchant Intelligence</p>
          </div>
        </div>

        {/* Store selector card */}
        <div className="flex items-center justify-between rounded-xl border border-hairline bg-surface-2 px-3 py-2 text-xs text-ink transition-colors hover:border-hairline-strong cursor-default">
          <div className="flex items-center gap-2 truncate">
            <Store className="h-4 w-4 text-ink-tertiary shrink-0" />
            <div className="truncate">
              <div className="font-semibold text-ink text-xs truncate">CEDCOSS Merchant</div>
              <div className="text-[10px] text-ink-tertiary font-mono">Store ID: BATCH-2027</div>
            </div>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-ink-tertiary shrink-0" />
        </div>

        {/* Navigation list */}
        <nav className="space-y-1.5 pt-2">
          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                data-testid={`tab-${item.id}`}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                  isActive
                    ? 'bg-ink text-canvas shadow-sm font-bold'
                    : 'text-ink-subtle hover:text-ink hover:bg-surface-2'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`h-4 w-4 transition-colors ${
                      isActive ? 'text-canvas' : 'text-ink-tertiary'
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`rounded-md px-2 py-0.5 text-xs font-mono font-bold ${
                      isActive
                        ? 'bg-canvas text-ink'
                        : item.badge === 'Live'
                        ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/30'
                        : 'bg-surface-2 text-ink-tertiary border border-hairline'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom utilities */}
      <div className="p-4 border-t border-hairline space-y-3 bg-surface-1">
        {/* Quick Benchmark Button */}
        {onLoadSample && (
          <button
            onClick={onLoadSample}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-ink text-canvas hover:opacity-90 active:scale-[0.98] py-2.5 px-3 text-xs font-bold transition-all shadow-sm"
          >
            <Sparkles className="h-3.5 w-3.5 text-amber-400" />
            <span>Benchmark (30 Reviews)</span>
          </button>
        )}

        {/* Theme Mode Toggle */}
        <button
          onClick={toggleTheme}
          className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-hairline bg-surface-2 text-xs font-semibold text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all"
        >
          <div className="flex items-center gap-2">
            {theme === 'dark' ? (
              <Sun className="h-4 w-4 text-amber-400" />
            ) : (
              <Moon className="h-4 w-4 text-ink" />
            )}
            <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
          </div>
          <span className="kbd-cap text-[10px]">T</span>
        </button>

        {/* Keyboard Shortcuts Trigger */}
        {onOpenShortcuts && (
          <button
            onClick={onOpenShortcuts}
            className="w-full flex items-center justify-between px-3 py-2 rounded-xl border border-hairline bg-surface-2 text-xs font-semibold text-ink-subtle hover:text-ink hover:border-hairline-strong transition-all"
          >
            <div className="flex items-center gap-2">
              <Keyboard className="h-4 w-4 text-ink-tertiary" />
              <span>Keyboard Shortcuts</span>
            </div>
            <span className="kbd-cap text-[10px]">?</span>
          </button>
        )}

        {/* Cache Counter & Purge */}
        <div className="flex items-center justify-between px-3 py-2 rounded-xl border border-hairline bg-surface-2/60 text-xs text-ink-subtle font-mono">
          <div className="flex items-center gap-2 truncate">
            <Database className="h-3.5 w-3.5 text-ink-tertiary shrink-0" />
            <span className="font-semibold text-ink truncate">{cacheEntries} cached</span>
          </div>
          {onClearCache && cacheEntries > 0 && (
            <button
              onClick={onClearCache}
              disabled={isLoading}
              title="Purge SHA-256 local review cache"
              className="p-1 text-ink-tertiary hover:text-rose-500 transition-colors"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </aside>
  );
};
