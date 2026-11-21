'use client';

import React, { useState, useEffect } from 'react';
import { CleanedReview } from '@/types/review';
import { X, Copy, Check, Loader2, MessageSquare, Sparkles, Send } from 'lucide-react';

interface ReplyModalProps {
  review: CleanedReview | null;
  isOpen: boolean;
  onClose: () => void;
  onToast?: (type: 'success' | 'error' | 'info', message: string) => void;
}

export const ReplyModal: React.FC<ReplyModalProps> = ({
  review,
  isOpen,
  onClose,
  onToast,
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
      onToast?.('success', 'Store reply copied to clipboard');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-md animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-2xl border border-hairline bg-surface-1 p-5 shadow-2xl space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-hairline">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-surface-2 border border-hairline text-ink">
              <MessageSquare className="h-4 w-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-ink">AI Merchant Reply Drafter</span>
                <span className="kbd-cap">{review.review_id}</span>
              </div>
              <p className="text-xs text-ink-subtle">Strictly generated on-demand for customer satisfaction</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-ink-tertiary hover:text-ink hover:bg-surface-2 transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Customer Review Summary Card */}
        <div className="rounded-xl border border-hairline bg-surface-2 p-3.5 space-y-2 text-xs">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-ink">{review.product}</span>
            <span className="font-mono text-[11px] text-ink-tertiary">{review.date}</span>
          </div>
          <p className="text-ink-subtle leading-relaxed">&quot;{review.cleaned_text}&quot;</p>
          {review.analysis?.summary && (
            <div className="pt-1 text-[11px] text-ink-tertiary flex items-center gap-1.5 border-t border-hairline/60">
              <span className="text-emerald-500 font-bold">•</span>
              <span>Identified customer issue:</span>
              <strong className="text-ink">{review.analysis.summary}</strong>
            </div>
          )}
        </div>

        {/* Reply Editor Area */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="font-medium text-ink">Suggested Store Response</span>
              {isCached && (
                <span className="rounded bg-surface-2 px-1.5 py-0.2 text-[10px] font-mono text-ink-subtle border border-hairline">
                  cached response
                </span>
              )}
            </div>
            <span className="text-[11px] text-ink-tertiary font-mono">
              {replyText.length} characters
            </span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-12 rounded-xl border border-hairline bg-surface-2 gap-2.5">
              <Loader2 className="h-5 w-5 text-ink animate-spin" />
              <p className="text-xs font-medium text-ink-subtle">Drafting empathetic response...</p>
            </div>
          ) : error ? (
            <div className="p-3.5 rounded-xl border border-rose-500/30 bg-rose-500/10 text-xs text-rose-500">
              {error}
            </div>
          ) : (
            <textarea
              rows={5}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full rounded-xl border border-hairline bg-surface-2 p-3.5 text-xs text-ink focus:border-ink focus:outline-none resize-none leading-relaxed shadow-inner"
              placeholder="Your reply will appear here..."
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between pt-3 border-t border-hairline text-xs">
          <span className="text-[11px] text-ink-tertiary font-mono">
            Empathetic • Professional • Actionable
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-hairline bg-surface-2 px-3 py-1.5 font-medium text-ink-subtle hover:text-ink transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoading || !replyText}
              className="inline-flex items-center gap-1.5 rounded-lg bg-ink px-4 py-1.5 font-medium text-canvas hover:opacity-90 active:scale-98 transition-all disabled:opacity-50 shadow-sm"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Reply</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
