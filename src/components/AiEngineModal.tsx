'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Cpu, ExternalLink, Key, CheckCircle2, ShieldCheck, AlertCircle } from 'lucide-react';

interface AiEngineModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentProvider: string;
  onSaveKey: (key: string) => void;
  activeApiKey: string;
}

export const AiEngineModal: React.FC<AiEngineModalProps> = ({
  isOpen,
  onClose,
  currentProvider,
  onSaveKey,
  activeApiKey,
}) => {
  const [apiKeyInput, setApiKeyInput] = useState(activeApiKey || '');
  const [isSaved, setIsSaved] = useState(false);

  if (!isOpen) return null;

  const handleSave = () => {
    onSaveKey(apiKeyInput.trim());
    setIsSaved(true);
    setTimeout(() => {
      setIsSaved(false);
      onClose();
    }, 1000);
  };

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
            <div className="flex items-center gap-3">
              <div className="relative flex h-8 w-8 items-center justify-center rounded-full overflow-hidden border border-white/20 bg-white shadow-sm shrink-0">
                <img src="/logo-icon.png" alt="PulseLens" className="h-full w-full object-cover scale-105" />
              </div>
              <div>
                <h3 className="text-sm font-extrabold text-ink font-sans">AI Model &amp; Free Tier Engine</h3>
                <p className="text-xs text-ink font-medium">Google Gemini 1.5 Flash &amp; Fallback Architecture</p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="rounded-lg p-1.5 text-ink hover:text-ink hover:bg-surface-2 transition-colors"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Model Specification Card */}
          <div className="rounded-xl border border-hairline bg-surface-2 p-4 space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-500" strokeWidth={2.4} />
                <span className="text-xs font-extrabold text-ink font-sans">Primary Model: Google Gemini 1.5 Flash</span>
              </div>
              <span className="rounded-full bg-emerald-500/15 border border-emerald-500/30 px-2 py-0.5 text-[10px] font-mono font-bold text-emerald-500">
                Official Free Tier
              </span>
            </div>

            <p className="text-xs text-ink leading-relaxed font-medium">
              As required by the assignment guidelines, PulseLens uses Google's official free tier model (<code className="font-mono text-emerald-500 font-bold">gemini-1.5-flash</code>), featuring:
            </p>

            <ul className="space-y-1.5 text-xs text-ink font-medium">
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2.2} />
                <span><strong>15 requests per minute (RPM)</strong> and 1,500 requests per day (RPD) free.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2.2} />
                <span><strong>Zero-Trust XML Sandboxing:</strong> Safely isolates R012 prompt injections.</span>
              </li>
              <li className="flex items-center gap-2">
                <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500 shrink-0" strokeWidth={2.2} />
                <span><strong>Bilingual NLU:</strong> Translates &amp; classifies English, Hindi, and Hinglish.</span>
              </li>
            </ul>
          </div>

          {/* API Key Input */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-xs">
              <label className="font-extrabold text-ink font-sans flex items-center gap-1.5">
                <Key className="h-3.5 w-3.5 text-amber-400" />
                <span>Google Gemini API Key</span>
              </label>
              <a
                href="https://aistudio.google.com/app/apikey"
                target="_blank"
                rel="noreferrer"
                className="text-emerald-500 hover:underline flex items-center gap-1 font-bold text-[11px]"
              >
                <span>Get Free Key (Google AI Studio)</span>
                <ExternalLink className="h-3 w-3" />
              </a>
            </div>

            <input
              type="password"
              placeholder="Paste AIzaSy... or leave blank to use server .env.local"
              value={apiKeyInput}
              onChange={(e) => setApiKeyInput(e.target.value)}
              className="w-full rounded-xl border border-hairline-strong bg-surface-2 px-3.5 py-2.5 text-xs font-mono text-ink placeholder:text-ink/60 focus:outline-none focus:border-ink transition-all shadow-sm"
            />
            <p className="text-[11px] text-ink font-medium leading-relaxed">
              When an API key is provided, analysis runs live against Google Gemini 1.5 Flash. When omitted, the built-in deterministic analytical engine safely processes reviews offline.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between pt-2 border-t border-hairline">
            <div className="text-[11px] font-mono font-bold text-ink">
              Status: <span className="text-emerald-500 font-extrabold">{currentProvider}</span>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={onClose}
                className="rounded-full bg-surface-2 border border-hairline px-4 py-2 text-xs font-bold text-ink hover:bg-surface-3 transition-colors"
              >
                Close
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 rounded-full bg-ink text-canvas px-5 py-2 text-xs font-extrabold shadow-md hover:opacity-90 transition-all active:scale-95"
              >
                {isSaved ? (
                  <>
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-500" />
                    <span>Saved!</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-3.5 w-3.5 text-amber-400" />
                    <span>Save &amp; Apply Key</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
