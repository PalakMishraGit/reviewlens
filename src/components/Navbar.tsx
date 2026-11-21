'use client';

import React from 'react';
import { Database, Trash2, ShieldCheck, Cpu } from 'lucide-react';

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
    <header className="sticky top-0 z-40 h-14 border-b border-white/[0.08] bg-[#0b0d14]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#1a1e28] border border-white/[0.1] text-[#eef0f5]">
            <span className="font-mono text-xs font-semibold tracking-tight">RL</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-semibold tracking-tight text-[#eef0f5]">ReviewLens</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#7a8296]">CEDCOSS Assessment</span>
          </div>
        </div>

        {/* Status badges & actions */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Security & R012 Defense Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#11141c] px-2 py-1 text-[11px] text-[#a3a9b8]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#4cc38a]" strokeWidth={1.5} />
            <span>Adversarial defense active</span>
          </div>

          {/* AI Engine Status */}
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#11141c] px-2 py-1 text-[11px] text-[#a3a9b8]">
            <Cpu className="h-3.5 w-3.5 text-[#7a8296]" strokeWidth={1.5} />
            <span className="text-[#7a8296]">Engine:</span>
            <span className="font-mono text-[#eef0f5]">{apiProvider}</span>
          </div>

          {/* Persistent Cache Badge */}
          <div className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-[#11141c] px-2 py-1 text-[11px] text-[#a3a9b8]">
            <Database className="h-3.5 w-3.5 text-[#7a8296]" strokeWidth={1.5} />
            <span className="font-mono tabular-nums text-[#eef0f5]">{cacheEntries}</span>
            <span className="text-[#7a8296]">cached</span>
            {onClearCache && cacheEntries > 0 && (
              <button
                onClick={onClearCache}
                disabled={isLoading}
                title="Purge cache"
                className="ml-1 text-[#7a8296] hover:text-[#e5484d] transition-colors"
              >
                <Trash2 className="h-3 w-3" strokeWidth={1.5} />
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
