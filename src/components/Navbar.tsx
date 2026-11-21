'use client';

import React from 'react';
import { Sparkles, Database, Trash2, ShieldCheck, Activity } from 'lucide-react';

interface NavbarProps {
  cacheEntries?: number;
  apiProvider?: string;
  onClearCache?: () => void;
  isLoading?: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  cacheEntries = 0,
  apiProvider = 'Gemini Flash',
  onClearCache,
  isLoading = false,
}) => {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800/80 bg-slate-950/80 backdrop-blur-md">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-600 via-indigo-500 to-cyan-400 shadow-lg shadow-indigo-500/20">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-bold tracking-tight text-white">ReviewLens</span>
              <span className="rounded-full border border-indigo-500/30 bg-indigo-500/10 px-2 py-0.5 text-xs font-semibold text-indigo-300">
                AI Review Insights
              </span>
            </div>
            <p className="text-xs text-slate-400">CEDCOSS Engineering Assessment</p>
          </div>
        </div>

        {/* Status badges & actions */}
        <div className="flex items-center gap-3">
          {/* Security & R012 Defense Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-lg border border-emerald-500/30 bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
            <ShieldCheck className="h-3.5 w-3.5" />
            <span>Adversarial Defense Active</span>
          </div>

          {/* AI Engine Status */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300">
            <Activity className="h-3.5 w-3.5 text-cyan-400 animate-pulse" />
            <span className="text-slate-400">Provider:</span>
            <span className="text-slate-200 font-semibold">{apiProvider}</span>
          </div>

          {/* Persistent Cache Badge */}
          <div className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-2.5 py-1 text-xs font-medium text-slate-300">
            <Database className="h-3.5 w-3.5 text-indigo-400" />
            <span>Cache: {cacheEntries} saved</span>
            {onClearCache && cacheEntries > 0 && (
              <button
                onClick={onClearCache}
                disabled={isLoading}
                title="Purge cached reviews"
                className="ml-1 text-slate-400 hover:text-rose-400 transition-colors"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
