'use client';

import React, { useState, useEffect } from 'react';
import { CleanedReview } from '@/types/review';
import { X, Sparkles, Copy, Check, Loader2, MessageSquare, Send } from 'lucide-react';

interface ReplyModalProps {
  review: CleanedReview | null;
  isOpen: boolean;
  onClose: () => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  review,
  isOpen,
  onClose,
}) => {
  const [replyText, setReplyText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [isCached, setIsCached] = useState(false);

  useEffect(() => {
    if (!isOpen || !review) {
      setReplyText('');
      setError(null);
      setCopied(false);
      return;
    }

    const fetchReply = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const res = await fetch('/api/suggest-reply', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ review }),
        });
        const data = await res.json();
        if (!data.success) {
          throw new Error(data.error || 'Failed to generate suggested reply');
        }
        setReplyText(data.reply);
        setIsCached(Boolean(data.cached));
      } catch (err: any) {
        setError(err.message || 'Error communicating with AI engine');
      } finally {
        setIsLoading(false);
      }
    };

    fetchReply();
  }, [isOpen, review]);

  if (!isOpen || !review) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(replyText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl rounded-2xl border border-slate-800 bg-slate-900 shadow-2xl p-6 overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">AI Merchant Reply Assistant</h3>
              <p className="text-xs text-slate-400">
                Generated on-demand for review <span className="font-mono text-indigo-300 font-semibold">{review.review_id}</span>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Customer Review Summary Card */}
        <div className="mt-4 rounded-xl border border-slate-800 bg-slate-950/60 p-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300">{review.product}</span>
            <span className="text-slate-400 font-mono">{review.date}</span>
          </div>
          <p className="text-xs text-slate-200 italic">&quot;{review.cleaned_text}&quot;</p>
          {review.analysis?.summary && (
            <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
              <span className="font-semibold text-rose-400">Identified Issue:</span>
              <span>{review.analysis.summary}</span>
            </div>
          )}
        </div>

        {/* Reply Area */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-slate-300 flex items-center gap-1.5">
              <MessageSquare className="h-4 w-4 text-indigo-400" />
              Suggested Store Reply:
              {isCached && (
                <span className="rounded bg-indigo-500/10 px-1.5 py-0.2 text-[10px] text-indigo-400 border border-indigo-500/20">
                  from cache
                </span>
              )}
            </span>
            <span className="text-[11px] text-slate-500">You can customize the draft before copying</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-slate-800 bg-slate-950/40 gap-3">
              <Loader2 className="h-8 w-8 text-indigo-400 animate-spin" />
              <p className="text-xs text-slate-400 font-medium">Drafting tailored, empathetic store reply...</p>
            </div>
          ) : error ? (
            <div className="p-4 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-300">
              {error}
            </div>
          ) : (
            <textarea
              rows={5}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/80 p-3.5 text-xs text-slate-100 placeholder:text-slate-500 focus:border-indigo-500 focus:outline-none resize-none leading-relaxed font-sans"
              placeholder="Your reply text will appear here..."
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-5 flex items-center justify-between pt-4 border-t border-slate-800">
          <span className="text-[11px] text-slate-500">
            Rule: Only generated on explicit merchant request.
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-slate-800 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoading || !replyText}
              className="inline-flex items-center gap-1.5 rounded-xl border border-indigo-500 bg-indigo-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-indigo-600/30 hover:bg-indigo-500 transition-all disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-300" />
                  Copied to Clipboard!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4" />
                  Copy Reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
