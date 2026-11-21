'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Command, ShieldCheck, Database, Keyboard, Sparkles } from 'lucide-react';

interface ShortcutsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ShortcutsModal: React.FC<ShortcutsModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-200">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="relative w-full max-w-lg rounded-2xl border border-hairline bg-surface-1 p-6 shadow-2xl space-y-5"
        >
          {/* Header */}
          <div className="flex items-center justify-between border-b border-hairline pb-4">
            <div className="flex items-center gap-2.5">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-white/20 bg-white shadow-sm shrink-0">
                <img src="/logo-icon.png" alt="PulseLens.ai" className="h-full w-full object-cover scale-105" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-ink">PulseLens Command &amp; Shortcuts</h3>
                <p className="text-xs text-ink-subtle">Keyboard efficiency &amp; architectural specifications</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink-tertiary hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Shortcuts Grid */}
          <div className="space-y-3">
            <h4 className="text-[11px] font-semibold uppercase tracking-wider text-ink-tertiary">
              Keyboard Shortcuts
            </h4>

            <div className="grid grid-cols-1 gap-2 text-xs">
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-ink">Focus Review Search Input</span>
                <span className="kbd-cap">/</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-ink">Toggle Theme (Dark / Light)</span>
                <span className="kbd-cap">T</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-ink">Filter Reviews Needing Reply</span>
                <span className="kbd-cap">D</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-ink">Filter Rating Mismatches</span>
                <span className="kbd-cap">M</span>
              </div>
              <div className="flex items-center justify-between p-2 rounded-lg bg-surface-2 border border-hairline">
                <span className="text-ink">Close Modal or Drawer</span>
                <span className="kbd-cap">Esc</span>
              </div>
            </div>
          </div>

          {/* Architectural Notes */}
          <div className="rounded-xl border border-hairline bg-surface-2/60 p-3.5 space-y-2 text-xs">
            <div className="flex items-center gap-2 font-medium text-ink">
              <ShieldCheck className="h-4 w-4 text-emerald-500" />
              <span>Adversarial Defense Protocol Active</span>
            </div>
            <p className="text-[11px] text-ink-subtle leading-relaxed">
              Reviews are evaluated within isolated XML boundary tags (<code className="font-mono text-ink">&lt;review_text&gt;</code>). Prompt injection payloads (such as in review <code className="font-mono text-amber-500 font-semibold">R012</code>) are isolated as inert strings, preventing jailbreak instruction overrides.
            </p>
          </div>

          <div className="flex justify-end pt-1">
            <button
              onClick={onClose}
              className="rounded-lg bg-ink px-4 py-2 text-xs font-semibold text-canvas hover:opacity-90 active:scale-98 transition-colors shadow-sm"
            >
              Got it
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
