'use client';

import React, { useState, useEffect } from 'react';
import { CleanedReview, AnalysisSummary } from '@/types/review';
import { Navbar } from '@/components/Navbar';
import { UploadDropzone } from '@/components/UploadDropzone';
import { SummaryCards } from '@/components/SummaryCards';
import { SentimentVisualizer } from '@/components/SentimentVisualizer';
import { InsightsOverview } from '@/components/InsightsOverview';
import { ReviewTable } from '@/components/ReviewTable';
import { ProductView } from '@/components/ProductView';
import { TelemetryBar } from '@/components/TelemetryBar';
import { ReplyModal } from '@/components/ReplyModal';
import { ToastContainer, ToastMessage } from '@/components/Toast';
import {
  Layers,
  Package,
  AlertCircle,
  FileQuestion,
} from 'lucide-react';

export default function ReviewLensDashboard() {
  const [reviews, setReviews] = useState<CleanedReview[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing reviews...');
  const [activeTab, setActiveTab] = useState<'reviews' | 'products'>('reviews');
  
  // Interactive Filter States
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [selectedSentimentFilter, setSelectedSentimentFilter] = useState<string>('all');
  const [selectedProductFilter, setSelectedProductFilter] = useState<string>('all');
  const [onlyNeedsReply, setOnlyNeedsReply] = useState<boolean>(false);
  const [onlyMismatches, setOnlyMismatches] = useState<boolean>(false);

  const [activeReplyReview, setActiveReplyReview] = useState<CleanedReview | null>(null);
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [apiProvider, setApiProvider] = useState<string>('Detecting...');
  const [error, setError] = useState<string | null>(null);

  // Toast notifications
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: 'success' | 'error' | 'info', message: string) => {
    const id = Math.random().toString(36).substring(2, 9);
    setToasts(prev => [...prev, { id, type, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3800);
  };

  const dismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  // Fetch cache stats on mount
  const fetchCacheStats = async () => {
    try {
      const res = await fetch('/api/cache');
      const data = await res.json();
      if (data.success && data.stats) {
        setCacheCount(data.stats.total_entries);
      }
    } catch {
      // Ignored
    }
  };

  useEffect(() => {
    fetchCacheStats();
  }, []);

  const handleAnalyze = async (csvText: string, filename: string) => {
    setIsLoading(true);
    setError(null);
    setLoadingMessage('Parsing CSV and validating rows (RFC 4180)...');

    try {
      setLoadingMessage('Checking persistent SHA-256 review cache...');
      
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze reviews');
      }

      setReviews(data.reviews || []);
      setSummary(data.summary || null);
      if (data.summary?.telemetry?.api_provider) {
        setApiProvider(data.summary.telemetry.api_provider);
      }
      await fetchCacheStats();

      const hits = data.summary?.telemetry?.cache_hits ?? 0;
      const count = data.reviews?.length ?? 0;
      addToast(
        'success',
        `Analyzed ${count} reviews (${hits} cache ${hits === 1 ? 'hit' : 'hits'})`
      );
    } catch (err: any) {
      console.error('Analysis error:', err);
      const errMsg = err.message || 'An error occurred during review analysis';
      setError(errMsg);
      addToast('error', errMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearCache = async () => {
    try {
      const res = await fetch('/api/cache', { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setCacheCount(0);
        if (summary) {
          setSummary({
            ...summary,
            telemetry: { ...summary.telemetry, cache_hits: 0 },
          });
        }
        addToast('info', 'Local SHA-256 review cache cleared');
      }
    } catch (err: any) {
      console.error('Failed to clear cache:', err);
      addToast('error', 'Failed to clear review cache');
    }
  };

  const handleFilterSentiment = (sentiment: string) => {
    setSelectedSentimentFilter(sentiment);
    if (sentiment !== 'all') {
      addToast('info', `Filtering by ${sentiment} sentiment`);
    } else {
      addToast('info', 'Reset sentiment filter');
    }
  };

  const handleToggleNeedsReply = () => {
    setOnlyNeedsReply(prev => {
      const next = !prev;
      addToast('info', next ? 'Showing only reviews needing merchant replies' : 'Reset reply filter');
      return next;
    });
  };

  const handleToggleMismatches = () => {
    setOnlyMismatches(prev => {
      const next = !prev;
      addToast('info', next ? 'Showing only rating-sentiment mismatches' : 'Reset mismatch filter');
      return next;
    });
  };

  return (
    <div className="min-h-screen bg-[#010102] text-[#f7f8f8] flex flex-col font-sans">
      <Navbar
        cacheEntries={cacheCount}
        apiProvider={summary?.telemetry?.api_provider || apiProvider}
        onClearCache={handleClearCache}
        isLoading={isLoading}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-7 sm:px-6 lg:px-8 space-y-5">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 border-b border-[#23252a] pb-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-medium tracking-tight text-[#f7f8f8]">
              Review intelligence
            </h1>
            <p className="mt-0.5 text-xs text-[#8a8f98] max-w-xl leading-relaxed">
              Customer sentiment, recurring complaints, rating mismatch detection, and on-demand merchant reply queue.
            </p>
          </div>
          <div className="text-xs text-[#62666d] font-mono">
            October 2026 dataset
          </div>
        </div>

        {/* Upload Section */}
        <section aria-label="Upload Reviews">
          <UploadDropzone
            onAnalyze={handleAnalyze}
            isLoading={isLoading}
            loadingMessage={loadingMessage}
          />
        </section>

        {error && (
          <div className="rounded-lg border border-[#eb5757]/30 bg-[#eb5757]/10 p-3 text-xs text-[#eb5757] flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Content */}
        {summary && (
          <div className="space-y-5 animate-in fade-in duration-150">
            {/* Telemetry Bar */}
            <TelemetryBar telemetry={summary.telemetry} />

            {/* Interactive KPI Cards */}
            <section aria-label="Executive KPI Summary">
              <SummaryCards
                summary={summary}
                activeSentimentFilter={selectedSentimentFilter}
                onFilterSentiment={handleFilterSentiment}
                onlyNeedsReply={onlyNeedsReply}
                onToggleNeedsReply={handleToggleNeedsReply}
                onlyMismatches={onlyMismatches}
                onToggleMismatches={handleToggleMismatches}
              />
            </section>

            {/* Interactive Sentiment Distribution & Net Score */}
            <section aria-label="Sentiment Visualizer">
              <SentimentVisualizer
                summary={summary}
                activeSentimentFilter={selectedSentimentFilter}
                onFilterSentiment={handleFilterSentiment}
              />
            </section>

            {/* Top 3 Complaints & Top 3 Praises */}
            <section aria-label="Insights Overview">
              <InsightsOverview
                topComplaints={summary.top_complaints}
                topPraises={summary.top_praises}
                onSelectTopic={topic => {
                  setSelectedTopicFilter(topic);
                  setActiveTab('reviews');
                  addToast('info', `Filtered reviews by topic: ${topic}`);
                }}
              />
            </section>

            {/* View Switcher Tabs (Explorer vs Product View) */}
            <div className="flex items-center gap-1 border-b border-[#23252a] pb-2">
              <button
                data-testid="tab-reviews"
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'reviews'
                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                    : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                }`}
              >
                <Layers className="h-3.5 w-3.5" strokeWidth={1.5} />
                Reviews table ({reviews.length})
              </button>

              <button
                data-testid="tab-products"
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  activeTab === 'products'
                    ? 'bg-[#141516] text-[#f7f8f8] border border-[#23252a]'
                    : 'text-[#8a8f98] hover:text-[#d0d6e0]'
                }`}
              >
                <Package className="h-3.5 w-3.5" strokeWidth={1.5} />
                Product analytics ({summary.product_insights.length})
              </button>
            </div>

            {/* Tab Views */}
            {activeTab === 'reviews' ? (
              <section aria-label="Reviews Data Table">
                <ReviewTable
                  reviews={reviews}
                  onOpenReplyModal={review => setActiveReplyReview(review)}
                  selectedTopicFilter={selectedTopicFilter}
                  onClearTopicFilter={() => setSelectedTopicFilter('all')}
                  selectedSentimentFilter={selectedSentimentFilter}
                  onSelectSentimentFilter={handleFilterSentiment}
                  selectedProductFilter={selectedProductFilter}
                  onSelectProductFilter={prod => {
                    setSelectedProductFilter(prod);
                    if (prod !== 'all') addToast('info', `Filtered by product: ${prod}`);
                  }}
                  onlyNeedsReply={onlyNeedsReply}
                  onToggleNeedsReply={handleToggleNeedsReply}
                  onlyMismatches={onlyMismatches}
                  onToggleMismatches={handleToggleMismatches}
                  onToast={addToast}
                />
              </section>
            ) : (
              <section aria-label="Product Analytics">
                <ProductView
                  insights={summary.product_insights}
                  onSelectProduct={p => {
                    setSelectedProductFilter(p);
                    setActiveTab('reviews');
                    addToast('info', `Filtered reviews by product: ${p}`);
                  }}
                />
              </section>
            )}
          </div>
        )}

        {/* Empty State when no data has been loaded */}
        {!summary && !isLoading && (
          <div className="rounded-lg border border-[#23252a] bg-[#0f1011]/60 p-8 text-center max-w-md mx-auto space-y-2">
            <div className="mx-auto flex h-8 w-8 items-center justify-center rounded-md border border-[#23252a] bg-[#141516] text-[#62666d]">
              <FileQuestion className="h-4 w-4" strokeWidth={1.5} />
            </div>
            <h3 className="text-xs font-medium text-[#f7f8f8]">No review data loaded</h3>
            <p className="text-[11px] text-[#8a8f98] leading-relaxed">
              Upload <code className="font-mono text-[#d0d6e0]">reviews.csv</code> or click{' '}
              <span className="text-[#f7f8f8]">Load benchmark dataset</span> to populate review intelligence.
            </p>
          </div>
        )}
      </main>

      {/* Suggested Reply Modal */}
      <ReplyModal
        review={activeReplyReview}
        isOpen={Boolean(activeReplyReview)}
        onClose={() => setActiveReplyReview(null)}
        onToast={addToast}
      />

      {/* Floating Toast Notification Container */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />

      {/* Footer */}
      <footer className="mt-auto border-t border-[#23252a] bg-[#010102] py-4 text-xs text-[#62666d]">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>ReviewLens — CEDCOSS Technical Assessment (Batch 2027)</span>
          <span className="font-mono text-[11px] text-[#62666d]">
            Linear Design System (awesome-design-md + Unslop craft)
          </span>
        </div>
      </footer>
    </div>
  );
}
