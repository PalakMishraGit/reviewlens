'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from 'lucide-react';

interface UploadDropzoneProps {
  onAnalyze: (csvText: string, filename: string) => Promise<void>;
  isLoading: boolean;
  loadingMessage?: string;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onAnalyze,
  isLoading,
  loadingMessage = 'Processing reviews in batches...',
}) => {
  const [isDragOver, setIsDragOver] = useState(false);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = () => {
    setIsDragOver(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    setError(null);

    const files = e.dataTransfer.files;
    if (files.length === 0) return;
    const file = files[0];
    await processFile(file);
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    setError(null);
    const files = e.target.files;
    if (!files || files.length === 0) return;
    const file = files[0];
    await processFile(file);
  };

  const processFile = async (file: File) => {
    if (!file.name.endsWith('.csv') && file.type !== 'text/csv') {
      setError('Please upload a valid RFC 4180 .csv file');
      return;
    }
    setSelectedFileName(file.name);
    try {
      const text = await file.text();
      await onAnalyze(text, file.name);
    } catch (err: any) {
      setError(err.message || 'Failed to read file');
    }
  };

  const handleLoadSample = async () => {
    setError(null);
    setSelectedFileName('reviews.csv');
    try {
      const res = await fetch('/api/sample');
      const data = await res.json();
      if (!data.success || !data.csv) {
        throw new Error(data.error || 'Failed to load sample dataset');
      }
      await onAnalyze(data.csv, 'reviews.csv');
    } catch (err: any) {
      setError(err.message || 'Failed to load sample dataset');
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Precision Ingestion Panel */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-xl border border-dashed transition-all cursor-pointer py-10 px-8 ${
          isDragOver
            ? 'border-ink bg-surface-2'
            : 'border-hairline-strong bg-surface-1/90 hover:border-ink/40 hover:bg-surface-2'
        } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        {/* Console Upload Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-surface-2 border border-hairline-strong text-ink shadow-sm transition-transform group-hover:scale-105">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-ink" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>

        {/* Text Instructions */}
        <div className="mt-3.5 text-center space-y-1.5">
          <p className="text-sm sm:text-base font-semibold text-ink">
            {isLoading ? (
              <span className="text-ink font-mono">{loadingMessage}</span>
            ) : (
              <span>
                Drop <code className="font-mono text-ink font-bold">reviews.csv</code> here or{' '}
                <span className="underline underline-offset-4 text-ink hover:text-ink-muted">browse file</span>
              </span>
            )}
          </p>
          <p className="text-xs sm:text-sm text-ink-subtle">
            Standard RFC 4180 parsing with quotes, multiline handling, and automatic deduplication
          </p>
        </div>

        {/* Hardware Status Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3 text-xs font-mono">
          <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-hairline px-3 py-1 text-xs font-medium text-ink">
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>Multiline RFC 4180</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-hairline px-3 py-1 text-xs font-medium text-ink">
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>Multilingual / Hindi</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-hairline px-3 py-1 text-xs font-medium text-ink">
            <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
            <span>R012 Prompt Defense</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-md bg-surface-2 border border-hairline px-3 py-1 text-xs font-medium text-ink">
            <Check className="h-3.5 w-3.5 text-emerald-500" />
            <span>Rating Mismatches</span>
          </span>
        </div>
      </div>

      {/* Dock Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs sm:text-sm">
        <div className="flex items-center gap-2 text-ink-subtle font-mono text-xs sm:text-sm">
          <FileSpreadsheet className="h-4 w-4 text-ink-tertiary" />
          <span>Active file:</span>
          <span className="text-ink font-semibold">
            {selectedFileName || 'reviews.csv (default benchmark ready)'}
          </span>
        </div>

        <button
          onClick={handleLoadSample}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-lg bg-surface-2 border border-hairline-strong px-4 py-2 font-semibold text-ink hover:bg-surface-3 active:scale-[0.98] transition-all shadow-sm text-xs sm:text-sm"
        >
          <Sparkles className="h-4 w-4 text-amber-400" />
          <span>Load benchmark dataset (30 reviews)</span>
          <ArrowRight className="h-3.5 w-3.5 text-ink-tertiary" />
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
