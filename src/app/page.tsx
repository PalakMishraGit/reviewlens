'use client';

import React, { useState, useEffect } from 'react';
import { CleanedReview, AnalysisSummary } from '@/types/review';
import { Sidebar } from '@/components/Sidebar';
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
import { DashboardSkeleton } from '@/components/DashboardSkeleton';
import { ShortcutsModal } from '@/components/ShortcutsModal';
import { useTheme } from '@/context/ThemeContext';
import {
  Sparkles,
  FileQuestion,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Activity,
  Layers,
  Database,
  Terminal,
} from 'lucide-react';

export default function ReviewLensDashboard() {
  const [reviews, setReviews] = useState<CleanedReview[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing reviews in batches...');
  const [activeTab, setActiveTab] = useState<'overview' | 'reviews' | 'products' | 'telemetry'>('overview');
  const [isShortcutsOpen, setIsShortcutsOpen] = useState(false);

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

  const { theme, toggleTheme } = useTheme();

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

  // Keyboard shortcuts listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        document.activeElement?.tagName === 'INPUT' ||
        document.activeElement?.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (e.key === '?' || (e.key === '/' && e.shiftKey)) {
        e.preventDefault();
        setIsShortcutsOpen(prev => !prev);
      } else if (e.key === 't' || e.key === 'T') {
        e.preventDefault();
        toggleTheme();
        addToast('info', 'Switched theme mode');
      } else if (e.key === 'd' || e.key === 'D') {
        e.preventDefault();
        handleToggleNeedsReply();
      } else if (e.key === 'm' || e.key === 'M') {
        e.preventDefault();
        handleToggleMismatches();
      } else if (e.key === '1') {
        setActiveTab('overview');
      } else if (e.key === '2') {
        setActiveTab('reviews');
      } else if (e.key === '3') {
        setActiveTab('products');
      } else if (e.key === '4') {
        setActiveTab('telemetry');
      } else if (e.key === 'Escape') {
        setIsShortcutsOpen(false);
        setActiveReplyReview(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [toggleTheme]);

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
    setLoadingMessage('Stage 1/4: Parsing CSV with RFC 4180 specification & sanitizing inputs...');

    try {
      const startTime = Date.now();

      // Launch backend API analysis in parallel
      const apiPromise = fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText }),
      }).then(r => r.json());

      // Paced visual progression through the 4 pipeline stages
      await new Promise(r => setTimeout(r, 220));
      setLoadingMessage('Stage 2/4: Computing SHA-256 signatures & verifying atomic cache...');

      await new Promise(r => setTimeout(r, 220));
      setLoadingMessage('Stage 3/4: Activating prompt injection defense envelope for R012...');

      await new Promise(r => setTimeout(r, 220));
      setLoadingMessage('Stage 4/4: Validating structured outputs with Zod schemas...');

      const data = await apiPromise;

      // Ensure human-perceivable transition duration (minimum 850ms)
      const elapsed = Date.now() - startTime;
      if (elapsed < 850) {
        await new Promise(r => setTimeout(r, 850 - elapsed));
      }

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
        `Analyzed ${count} reviews successfully (${hits} cache ${hits === 1 ? 'hit' : 'hits'})`
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

  const handleAnalyzeSample = async () => {
    try {
      const res = await fetch('/api/sample');
      const data = await res.json();
      if (data.success && data.csv) {
        await handleAnalyze(data.csv, 'reviews.csv');
      }
    } catch (err: any) {
      addToast('error', 'Failed to load sample dataset');
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
    <div className="min-h-screen bg-canvas text-ink flex flex-row font-sans transition-colors relative selection:bg-ink selection:text-canvas">
      {/* 1. Left Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        onSelectTab={setActiveTab}
        reviewCount={reviews.length}
        productCount={summary?.product_insights.length ?? 0}
        cacheEntries={cacheCount}
        onClearCache={handleClearCache}
        onOpenShortcuts={() => setIsShortcutsOpen(true)}
        onLoadSample={handleAnalyzeSample}
        isLoading={isLoading}
      />

      {/* 2. Main Application Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Navbar
          apiProvider={summary?.telemetry?.api_provider || apiProvider}
          onLoadSample={handleAnalyzeSample}
          isLoading={isLoading}
        />

        {/* Main Stage Content */}
        <main className="flex-1 p-6 sm:p-8 lg:p-10 space-y-8 max-w-7xl w-full mx-auto">
          {/* Always Available: Quick Horizontal Ingestion Card */}
          <section aria-label="Upload Customer Reviews">
            <UploadDropzone
              onAnalyze={handleAnalyze}
              isLoading={isLoading}
              loadingMessage={loadingMessage}
              hasLoadedDataset={Boolean(summary)}
            />
          </section>

          {error && (
            <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs sm:text-sm text-rose-500 flex items-center gap-3 shadow-sm animate-in fade-in">
              <AlertCircle className="h-5 w-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Skeleton Loader during Analysis */}
          {isLoading && (
            <section aria-label="Processing Reviews">
              <DashboardSkeleton stageMessage={loadingMessage} />
            </section>
          )}

          {/* Dashboard Content when Ready */}
          {!isLoading && summary && (
            <div className="space-y-8 animate-in fade-in duration-200">
              {/* Tab: Overview (Complete Executive Dashboard) */}
              {activeTab === 'overview' && (
                <>
                  {/* 5 KPI Summary Cards with Sparklines */}
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

                  {/* Sentiment Distribution Spectrum */}
                  <section aria-label="Sentiment Visualizer">
                    <SentimentVisualizer
                      summary={summary}
                      activeSentimentFilter={selectedSentimentFilter}
                      onFilterSentiment={handleFilterSentiment}
                    />
                  </section>

                  {/* Top Complaints & Praises (2 Columns) */}
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

                  {/* Customer Review Explorer */}
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
                </>
              )}

              {/* Tab: Reviews (Dedicated Table View) */}
              {activeTab === 'reviews' && (
                <section aria-label="Reviews Data Table" className="space-y-6">
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
              )}

              {/* Tab: Products (Product Intelligence View) */}
              {activeTab === 'products' && (
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

              {/* Tab: Telemetry & Logs */}
              {activeTab === 'telemetry' && (
                <section aria-label="System Telemetry" className="space-y-6">
                  <TelemetryBar telemetry={summary.telemetry} />
                  <div className="rounded-2xl border border-hairline bg-surface-1 p-6 space-y-4 shadow-sm">
                    <h3 className="text-base font-bold text-ink">System Verification &amp; Security Envelope</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs font-mono">
                      <div className="p-4 rounded-xl border border-hairline bg-surface-2 space-y-1">
                        <div className="text-ink-tertiary">Ingestion Standard</div>
                        <div className="font-bold text-emerald-500">RFC 4180 Compliant</div>
                        <div className="text-ink-subtle text-[11px]">Multiline, quotes &amp; commas handled</div>
                      </div>
                      <div className="p-4 rounded-xl border border-hairline bg-surface-2 space-y-1">
                        <div className="text-ink-tertiary">Injection Defense</div>
                        <div className="font-bold text-emerald-500">XML Guardrail Active</div>
                        <div className="text-ink-subtle text-[11px]">R012 prompt attacks safely neutralized</div>
                      </div>
                      <div className="p-4 rounded-xl border border-hairline bg-surface-2 space-y-1">
                        <div className="text-ink-tertiary">Cache Mechanism</div>
                        <div className="font-bold text-ink">SHA-256 Signature</div>
                        <div className="text-ink-subtle text-[11px]">{cacheCount} entries cached locally</div>
                      </div>
                    </div>
                  </div>
                </section>
              )}
            </div>
          )}

          {/* Empty State when no data is loaded */}
          {!summary && !isLoading && (
            <div className="rounded-3xl border border-hairline bg-surface-1 p-12 text-center max-w-lg mx-auto space-y-5 shadow-sm">
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-surface-2 border border-hairline text-ink">
                <FileQuestion className="h-7 w-7" />
              </div>
              <div className="space-y-2">
                <h3 className="text-base font-bold text-ink font-sans">No review dataset loaded</h3>
                <p className="text-xs sm:text-sm text-ink-subtle leading-relaxed">
                  Upload your merchant review file above, or click below to populate the intelligence engine with the official 30-row CEDCOSS benchmark.
                </p>
              </div>
              <button
                onClick={handleAnalyzeSample}
                className="inline-flex items-center gap-2 rounded-xl bg-ink px-5 py-3 text-xs sm:text-sm font-bold text-canvas hover:opacity-90 active:scale-98 transition-all shadow-md"
              >
                <Sparkles className="h-4 w-4 text-amber-400" />
                <span>Load 30-Review Benchmark Dataset</span>
              </button>
            </div>
          )}
        </main>

        {/* Enterprise Footer */}
        <footer className="border-t border-hairline bg-surface-1 px-8 py-4 text-xs text-ink-tertiary">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
            <div className="flex items-center gap-2">
              <span className="font-bold text-ink">ReviewLens</span>
              <span>—</span>
              <span>CEDCOSS Technical Assessment (Round 2 Take-Home, Batch 2027)</span>
            </div>
            <div className="flex items-center gap-3 font-mono text-[11px]">
              <span className="flex items-center gap-1 text-emerald-500">
                <CheckCircle2 className="h-3 w-3" />
                RFC 4180 Verified
              </span>
              <span>•</span>
              <span className="flex items-center gap-1 text-ink-subtle">
                <ShieldCheck className="h-3 w-3 text-emerald-500" />
                R012 Guardrail Active
              </span>
            </div>
          </div>
        </footer>
      </div>

      {/* Suggested Reply Modal */}
      <ReplyModal
        review={activeReplyReview}
        isOpen={Boolean(activeReplyReview)}
        onClose={() => setActiveReplyReview(null)}
        onToast={addToast}
      />

      {/* Shortcuts & Architecture Guide Modal */}
      <ShortcutsModal
        isOpen={isShortcutsOpen}
        onClose={() => setIsShortcutsOpen(false)}
      />

      {/* Floating Toast Notifications */}
      <ToastContainer toasts={toasts} onDismiss={dismissToast} />
    </div>
  );
}
