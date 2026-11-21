'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  FileSpreadsheet,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  Upload,
} from 'lucide-react';

interface UploadDropzoneProps {
  onAnalyze: (csvText: string, filename: string) => Promise<void>;
  isLoading: boolean;
  loadingMessage?: string;
  hasLoadedDataset?: boolean;
}

export const UploadDropzone: React.FC<UploadDropzoneProps> = ({
  onAnalyze,
  isLoading,
  loadingMessage = 'Processing reviews in batches...',
  hasLoadedDataset = false,
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

  const handleTriggerUpload = () => {
    if (!isLoading) {
      fileInputRef.current?.click();
    }
  };

  return (
    <div className="w-full space-y-3">
      {/* Horizontal Split Ingestion Card */}
      <div className="rounded-2xl border border-hairline bg-surface-1 p-6 shadow-sm transition-all hover:border-hairline-strong">
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Left section: Title & Description */}
          <div className="lg:col-span-5 flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-surface-2 border border-hairline text-ink shadow-sm">
              <UploadCloud className="h-6 w-6 text-ink" strokeWidth={2.2} />
            </div>
            <div className="space-y-1">
              <h2 className="text-base sm:text-lg font-bold text-ink tracking-tight font-sans">
                Import customer reviews
              </h2>
              <p className="text-xs sm:text-sm text-ink leading-relaxed font-medium">
                Upload a CSV file containing customer reviews from your store. RFC 4180 multiline &amp; quotes handled automatically.
              </p>
              <div className="flex items-center gap-2 pt-1 font-mono text-xs">
                <span className="flex h-2 w-2 rounded-full bg-emerald-500" />
                <span className="text-emerald-500 font-bold">Ready for ingestion</span>
                <span className="text-ink">•</span>
                <span className="text-ink font-semibold">Max 10MB</span>
              </div>
            </div>
          </div>

          {/* Right section: Drop area & Upload button */}
          <div className="lg:col-span-7 flex flex-col sm:flex-row items-center gap-4">
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={handleTriggerUpload}
              className={`flex-1 w-full flex items-center justify-center gap-3 rounded-xl border border-dashed py-5 px-6 transition-all cursor-pointer text-center ${
                isDragOver
                  ? 'border-ink bg-surface-2'
                  : 'border-hairline-strong bg-surface-2 hover:border-ink hover:bg-surface-3'
              } ${isLoading ? 'pointer-events-none opacity-80' : ''}`}
            >
              <Upload className="h-4 w-4 text-ink shrink-0" strokeWidth={2.2} />
              <div className="text-xs sm:text-sm font-bold text-ink">
                {isLoading ? (
                  <span className="font-mono text-ink animate-pulse">{loadingMessage}</span>
                ) : (
                  <span>
                    Drop a CSV file here or <span className="underline text-ink font-extrabold">browse files</span>
                  </span>
                )}
                <div className="text-[11px] text-ink font-medium mt-0.5">Supports: .csv (RFC 4180 compliant)</div>
              </div>
            </div>

            <button
              onClick={handleTriggerUpload}
              disabled={isLoading}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 rounded-xl bg-ink text-canvas hover:opacity-90 active:scale-[0.98] px-6 py-4 text-xs sm:text-sm font-bold transition-all shadow-md"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin text-canvas" />
              ) : (
                <UploadCloud className="h-4 w-4" strokeWidth={2.2} />
              )}
              <span>Upload CSV</span>
            </button>
          </div>
        </div>

        {/* Feature badges row */}
        <div className="mt-5 pt-4 border-t border-hairline flex flex-wrap items-center justify-between gap-3 text-xs font-mono">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 border border-hairline px-3 py-1 font-bold text-ink">
              <Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
              <span>Multiline RFC 4180</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 border border-hairline px-3 py-1 font-bold text-ink">
              <Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
              <span>Multilingual / Hindi</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 border border-hairline px-3 py-1 font-bold text-ink">
              <ShieldCheck className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
              <span>R012 Prompt Defense</span>
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-lg bg-surface-2 border border-hairline px-3 py-1 font-bold text-ink">
              <Check className="h-3 w-3 text-emerald-500" strokeWidth={2.5} />
              <span>Rating Mismatches</span>
            </span>
          </div>

          <div className="flex items-center gap-2 text-ink font-bold">
            <FileSpreadsheet className="h-3.5 w-3.5 text-ink" strokeWidth={2.2} />
            <span>Active file:</span>
            <span className="text-ink font-extrabold underline underline-offset-2">
              {selectedFileName || 'reviews.csv (default benchmark ready)'}
            </span>
          </div>
        </div>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3.5 text-xs text-rose-500 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
