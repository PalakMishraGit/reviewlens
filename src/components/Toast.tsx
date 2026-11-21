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
            className={`pointer-events-auto flex items-center justify-between gap-3 rounded-xl border p-3.5 shadow-xl backdrop-blur-md ${
              t.type === 'success'
                ? 'border-[#27a644]/30 bg-[#0f1011]/95 text-[#f7f8f8]'
                : t.type === 'error'
                ? 'border-[#eb5757]/30 bg-[#0f1011]/95 text-[#f7f8f8]'
                : 'border-[#23252a] bg-[#0f1011]/95 text-[#f7f8f8]'
            }`}
          >
            <div className="flex items-center gap-2.5">
              {t.type === 'success' && (
                <CheckCircle2 className="h-4 w-4 text-[#27a644] shrink-0" strokeWidth={1.5} />
              )}
              {t.type === 'error' && (
                <AlertCircle className="h-4 w-4 text-[#eb5757] shrink-0" strokeWidth={1.5} />
              )}
              {t.type === 'info' && (
                <Info className="h-4 w-4 text-[#5e6ad2] shrink-0" strokeWidth={1.5} />
              )}
              <span className="text-xs font-medium leading-snug">{t.message}</span>
            </div>
            <button
              onClick={() => onDismiss(t.id)}
              className="text-[#8a8f98] hover:text-[#f7f8f8] p-0.5 rounded transition-colors"
            >
              <X className="h-3.5 w-3.5" strokeWidth={1.5} />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};
