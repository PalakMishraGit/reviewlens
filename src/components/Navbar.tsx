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
    <header className="sticky top-0 z-40 h-14 border-b border-[#23252a] bg-[#010102]/90 backdrop-blur-md">
      <div className="mx-auto flex h-full max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-[#141516] border border-[#23252a] text-[#f7f8f8]">
            <span className="font-mono text-xs font-semibold tracking-tight">RL</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-sm font-medium tracking-tight text-[#f7f8f8]">ReviewLens</span>
            <span className="hidden sm:inline font-mono text-[11px] text-[#62666d]">CEDCOSS Assessment</span>
          </div>
        </div>

        {/* Status badges & actions */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          {/* Security & R012 Defense Badge */}
          <div className="hidden sm:flex items-center gap-1.5 rounded-md border border-[#23252a] bg-[#0f1011] px-2 py-1 text-[11px] text-[#8a8f98]">
            <ShieldCheck className="h-3.5 w-3.5 text-[#27a644]" strokeWidth={1.5} />
            <span>Adversarial defense active</span>
          </div>

          {/* AI Engine Status */}
          <div className="flex items-center gap-1.5 rounded-md border border-[#23252a] bg-[#0f1011] px-2 py-1 text-[11px] text-[#8a8f98]">
            <Cpu className="h-3.5 w-3.5 text-[#62666d]" strokeWidth={1.5} />
            <span className="text-[#62666d]">Engine:</span>
            <span className="font-mono text-[#f7f8f8]">{apiProvider}</span>
          </div>

          {/* Persistent Cache Badge */}
          <div className="flex items-center gap-1.5 rounded-md border border-[#23252a] bg-[#0f1011] px-2 py-1 text-[11px] text-[#8a8f98]">
            <Database className="h-3.5 w-3.5 text-[#62666d]" strokeWidth={1.5} />
            <span className="font-mono tabular-nums text-[#f7f8f8]">{cacheEntries}</span>
            <span className="text-[#62666d]">cached</span>
            {onClearCache && cacheEntries > 0 && (
              <button
                onClick={onClearCache}
                disabled={isLoading}
                title="Purge cache"
                className="ml-1 text-[#62666d] hover:text-[#eb5757] transition-colors"
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
