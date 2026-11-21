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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#010102]/70 backdrop-blur-sm animate-in fade-in duration-150">
      <div className="relative w-full max-w-xl rounded-lg border border-[#23252a] bg-[#0f1011] p-4 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#23252a]">
          <div className="flex items-center gap-2">
            <MessageSquare className="h-4 w-4 text-[#8a8f98]" strokeWidth={1.5} />
            <span className="text-sm font-medium text-[#f7f8f8]">Draft store reply</span>
            <span className="kbd-cap">{review.review_id}</span>
          </div>

          <button
            onClick={onClose}
            className="rounded p-1 text-[#62666d] hover:text-[#f7f8f8] transition-colors"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </button>
        </div>

        {/* Customer Review Summary Card */}
        <div className="mt-3.5 rounded-md border border-[#23252a] bg-[#141516] p-3 space-y-1">
          <div className="flex items-center justify-between text-xs">
            <span className="font-medium text-[#f7f8f8]">{review.product}</span>
            <span className="font-mono text-[11px] text-[#62666d]">{review.date}</span>
          </div>
          <p className="text-xs text-[#8a8f98] leading-relaxed">&quot;{review.cleaned_text}&quot;</p>
          {review.analysis?.summary && (
            <div className="pt-0.5 text-[11px] text-[#62666d] flex items-center gap-1.5">
              <span>Detected issue:</span>
              <span className="text-[#f7f8f8]">{review.analysis.summary}</span>
            </div>
          )}
        </div>

        {/* Reply Area */}
        <div className="mt-3.5 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-xs text-[#8a8f98]">
              Suggested response
              {isCached && (
                <span className="ml-1.5 font-mono text-[10px] text-[#62666d] bg-[#141516] px-1 py-0.2 rounded border border-[#23252a]">
                  cached
                </span>
              )}
            </span>
            <span className="text-[11px] text-[#62666d]">Editable draft</span>
          </div>

          {isLoading ? (
            <div className="flex flex-col items-center justify-center py-10 rounded-md border border-[#23252a] bg-[#141516] gap-2">
              <Loader2 className="h-4 w-4 text-[#8a8f98] animate-spin" strokeWidth={1.5} />
              <p className="text-xs text-[#62666d]">Drafting reply...</p>
            </div>
          ) : error ? (
            <div className="p-3 rounded-md border border-[#eb5757]/30 bg-[#eb5757]/10 text-xs text-[#eb5757]">
              {error}
            </div>
          ) : (
            <textarea
              rows={4}
              value={replyText}
              onChange={e => setReplyText(e.target.value)}
              className="w-full rounded-md border border-[#23252a] bg-[#141516] p-3 text-xs text-[#f7f8f8] focus:border-[#5e6ad2] focus:outline-none resize-none leading-relaxed"
              placeholder="Your reply will appear here..."
            />
          )}
        </div>

        {/* Footer Actions */}
        <div className="mt-3.5 flex items-center justify-between pt-3 border-t border-[#23252a]">
          <span className="text-[11px] text-[#62666d]">
            Generated on-demand
          </span>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="rounded-md border border-[#23252a] bg-[#141516] px-3 py-1.5 text-xs text-[#8a8f98] hover:text-[#f7f8f8] transition-colors"
            >
              Close
            </button>
            <button
              type="button"
              onClick={handleCopy}
              disabled={isLoading || !replyText}
              className="inline-flex items-center gap-1.5 rounded-md bg-[#f7f8f8] px-3 py-1.5 text-xs font-medium text-[#010102] hover:bg-[#ffffff] active:scale-[0.98] transition-all disabled:opacity-50"
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
