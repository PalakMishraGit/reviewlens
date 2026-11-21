'use client';

import React, { useState, useEffect } from 'react';
import { CleanedReview, AnalysisSummary } from '@/types/review';
import { Navbar } from '@/components/Navbar';
import { UploadDropzone } from '@/components/UploadDropzone';
import { SummaryCards } from '@/components/SummaryCards';
import { InsightsOverview } from '@/components/InsightsOverview';
import { ReviewTable } from '@/components/ReviewTable';
import { ProductView } from '@/components/ProductView';
import { TelemetryBar } from '@/components/TelemetryBar';
import { ReplyModal } from '@/components/ReplyModal';
import {
  Sparkles,
  Layers,
  Package,
  ShieldCheck,
  AlertCircle,
  HelpCircle,
  Info,
  CheckCircle,
} from 'lucide-react';

export default function ReviewLensDashboard() {
  const [reviews, setReviews] = useState<CleanedReview[]>([]);
  const [summary, setSummary] = useState<AnalysisSummary | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingMessage, setLoadingMessage] = useState('Processing reviews...');
  const [activeTab, setActiveTab] = useState<'reviews' | 'products'>('reviews');
  const [selectedTopicFilter, setSelectedTopicFilter] = useState<string>('all');
  const [activeReplyReview, setActiveReplyReview] = useState<CleanedReview | null>(null);
  const [cacheCount, setCacheCount] = useState<number>(0);
  const [apiProvider, setApiProvider] = useState<string>('Detecting...');
  const [error, setError] = useState<string | null>(null);

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
      // Small simulated delay for visual feedback if instant
      setLoadingMessage('Checking persistent SHA-256 review cache...');
      
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csvText }),
      });

      const data = await res.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to analyze reviews.');
      }

      setReviews(data.reviews || []);
      setSummary(data.summary || null);
      if (data.summary?.telemetry?.api_provider) {
        setApiProvider(data.summary.telemetry.api_provider);
      }
      await fetchCacheStats();
    } catch (err: any) {
      console.error('Analysis error:', err);
      setError(err.message || 'An error occurred during review analysis');
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
        // Refresh analysis telemetry if already loaded
        if (summary) {
          setSummary({
            ...summary,
            telemetry: { ...summary.telemetry, cache_hits: 0 },
          });
        }
      }
    } catch (err: any) {
      console.error('Failed to clear cache:', err);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans">
      <Navbar
        cacheEntries={cacheCount}
        apiProvider={summary?.telemetry?.api_provider || apiProvider}
        onClearCache={handleClearCache}
        isLoading={isLoading}
      />

      <main className="flex-1 mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-8">
        {/* Hero Section */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-slate-800/80 pb-6">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300 mb-3">
              <Sparkles className="h-3.5 w-3.5" />
              Turn Raw Reviews Into Store Owner Action in Seconds
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-white">
              E-Commerce Review Intelligence
            </h1>
            <p className="mt-2 text-sm text-slate-400 max-w-2xl">
              Extract real customer sentiment, isolate top praises and complaints, catch rating mismatches,
              and craft tailored support responses on-demand with adversarial prompt defense.
            </p>
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
          <div className="rounded-2xl border border-rose-500/30 bg-rose-500/10 p-4 text-xs text-rose-300 flex items-center gap-2">
            <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
            <span>{error}</span>
          </div>
        )}

        {/* Dashboard Content */}
        {summary && (
          <div className="space-y-8 animate-in fade-in duration-300">
            {/* Telemetry & Cost intelligence */}
            <TelemetryBar telemetry={summary.telemetry} />

            {/* Summary Cards */}
            <section aria-label="Executive KPI Summary">
              <SummaryCards summary={summary} />
            </section>

            {/* Top 3 Complaints & Top 3 Praises */}
            <section aria-label="Insights Overview">
              <InsightsOverview
                topComplaints={summary.top_complaints}
                topPraises={summary.top_praises}
                onSelectTopic={topic => {
                  setSelectedTopicFilter(topic);
                  setActiveTab('reviews');
                }}
              />
            </section>

            {/* View Switcher Tabs (Explorer vs Product View) */}
            <div className="flex items-center gap-2 border-b border-slate-800 pb-3">
              <button
                onClick={() => setActiveTab('reviews')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'reviews'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="h-4 w-4" />
                Review Explorer Table ({reviews.length})
              </button>

              <button
                onClick={() => setActiveTab('products')}
                className={`flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-semibold transition-all ${
                  activeTab === 'products'
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-900 text-slate-400 hover:text-slate-200'
                }`}
              >
                <Package className="h-4 w-4" />
                Product Insights Breakdown ({summary.product_insights.length})
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
                />
              </section>
            ) : (
              <section aria-label="Product Analytics">
                <ProductView
                  insights={summary.product_insights}
                  onSelectProduct={p => {
                    setActiveTab('reviews');
                  }}
                />
              </section>
            )}
          </div>
        )}

        {/* Empty State when no data has been loaded */}
        {!summary && !isLoading && (
          <div className="rounded-2xl border border-slate-800/80 bg-slate-900/30 p-12 text-center max-w-xl mx-auto space-y-4">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-slate-400">
              <Info className="h-6 w-6" />
            </div>
            <h3 className="text-base font-semibold text-slate-200">No review data loaded yet</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Upload your <code className="font-mono text-indigo-300">reviews.csv</code> file above or click{' '}
              <strong className="text-indigo-400">&quot;Load Official Benchmark&quot;</strong> to view instant AI sentiment
              breakdowns, top customer complaints, and on-demand merchant replies.
            </p>
          </div>
        )}
      </main>

      {/* Suggested Reply Modal */}
      <ReplyModal
        review={activeReplyReview}
        isOpen={Boolean(activeReplyReview)}
        onClose={() => setActiveReplyReview(null)}
      />

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-slate-950/60 py-6 text-center text-xs text-slate-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>ReviewLens — CEDCOSS Technical Assessment (Batch 2027)</span>
          <span className="flex items-center gap-1.5 text-slate-400">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
            Built with Next.js 14, TypeScript &amp; Google Gemini AI
          </span>
        </div>
      </footer>
    </div>
  );
}
