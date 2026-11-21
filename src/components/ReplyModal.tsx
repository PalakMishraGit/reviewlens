'use client';

import React, { useState, useEffect } from 'react';
import { CleanedReview } from '@/types/review';
import { X, Copy, Check, Loader2, MessageSquare } from 'lucide-react';

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-xl border border-white/[0.1] bg-[#11141c] p-5 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-white/[0.06]">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#a3a9b8]" strokeWidth={1.5} />
            <span className="text-sm font-medium text-[#eef0f5]">Draft store reply</span>
            <span className="font-mono text-xs text-[#7a8296]">{review.review_id}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-[#7a8296] hover:text-[#eef0f5] transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Customer Review Summary Card */}
        <div className="mt-4 rounded-lg border border-white/[0.06] bg-[#161a24] p-3 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#eef0f5]">{review.product}</span>
            <span className="font-mono text-[11px] text-[#7a8296]">{review.date}</span>
          </div>
          <p className="text-xs text-[#a3a9b8] leading-relaxed">&quot;{review.cleaned_text}&quot;</p>
          {review.analysis?.summary && (
            <div className="pt-1 text-[11px] text-[#7a8296] flex items-center gap-1.5">
              <span>Detected issue:</span>
              <span className="text-[#eef0f5]">{review.analysis.summary}</span>
            </div>
          )}
        </div>

        {/* Reply Area */}
        <div className="mt-4 space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="text-xs text-[#7a8296]">
              Suggested response
              {isCached && (
                <span className="ml-1.5 font-mono text-[10px] text-[#7a8296] bg-[#1a1e28] px-1 py-0.2 rounded border border-white/[0.04]">
                  cached
                </span>
              )}
            </span>
            <span className="text-[11px] text-[#7a8296]">Editable draft</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-lg border border-white/[0.06] bg-[#161a24] gap-2">
              <Loader2 className="h-5 w-5 text-[#a3a9b8] animate-spin" strokeWidth={1.5} />
              <p className="text-xs text-[#7a8296]">Drafting reply...</p>
            </div>
          ) : error ? (
            <div className="p-3 rounded-lg border border-[#e5484d]/30 bg-[#e5484d]/10 text-xs text-[#e5484d]">
              {error}
            </div>
          ) : (
            <textarea
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full rounded-lg border border-white/[0.08] bg-[#161a24] p-3 text-xs text-[#eef0f5] focus:border-white/30 focus:outline-none resize-none leading-relaxed"
              placeholder="Your reply will appear here..."
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-4 flex items-center justify-between pt-3 border-t border-white/[0.06]">
          <span className="text-[11px] text-[#7a8296]">
            Generated on-demand
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-white/[0.08] bg-[#161a24] px-3 py-1.5 text-xs text-[#a3a9b8] hover:text-[#eef0f5] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoading || !replyText}
              className="inline-flex items-center gap-1.5 rounded-lg bg-[#eef0f5] px-3 py-1.5 text-xs font-medium text-[#0b0d14] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50"
            >
              {copied ? (
                <>
                  <Check className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Copied
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" strokeWidth={1.5} />
                  Copy reply
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
