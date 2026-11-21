'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export const ToastContainer: React.FC<ToastProps> = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed bottom-5 right-5 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence>
        {toasts.map(t => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: 16, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 shadow-2xl backdrop-blur-xl ${
              t.type === 'success'
                ? 'border-emerald-500/30 bg-surface-1/95 text-ink'
                : t.type === 'error'
                ? 'border-rose-500/30 bg-surface-1/95 text-ink'
                : 'border-hairline bg-surface-1/95 text-ink'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && (
                <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
              )}
              {t.type === 'error' && (
                <AlertCircle className="h-4 w-4 text-rose-500 shrink-0" />
              )}
              {t.type === 'info' && (
                <Info className="h-4 w-4 text-ink shrink-0" />
              )}
              <span className="text-xs font-medium leading-snug">{t.message}</span>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-ink-tertiary hover:text-ink p-1 rounded-md transition-colors"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
