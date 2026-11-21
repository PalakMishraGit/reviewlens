'use client';

import React, { useState, useRef } from 'react';
import {
  Upload,
  FileText,
  Check,
  AlertCircle,
  Loader2,
  ShieldCheck,
  Sparkles,
  FileSpreadsheet,
  Cpu,
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
      {/* Drag & Drop Canvas */}
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed transition-all cursor-pointer py-10 px-6 ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 shadow-lg shadow-indigo-500/10'
            : 'border-hairline bg-surface-1 hover:border-indigo-500/40 hover:bg-surface-2'
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

        {/* Central Icon */}
        <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-surface-2 border border-hairline text-indigo-400 group-hover:scale-105 group-hover:border-indigo-500/40 transition-all shadow-md">
          {isLoading ? (
            <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
          ) : (
            <Upload className="h-6 w-6 transition-transform group-hover:-translate-y-0.5" />
          )}
        </div>

        {/* Text Instructions */}
        <div className="mt-4 text-center space-y-1">
          <p className="text-sm font-semibold text-ink">
            {isLoading ? (
              <span className="flex items-center gap-2 text-indigo-400">
                <span>{loadingMessage}</span>
              </span>
            ) : (
              <span>
                Drop <code className="font-mono text-indigo-400">reviews.csv</code> here or{' '}
                <span className="text-indigo-400 underline underline-offset-4">browse files</span>
              </span>
            )}
          </p>
          <p className="text-xs text-ink-subtle">
            Supports RFC 4180 standard comma-separated files up to 10 MB
          </p>
        </div>

        {/* Specification Chips */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-xs">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-hairline px-3 py-1 text-[11px] text-ink-subtle">
            <Check className="h-3 w-3 text-emerald-500" />
            <span>RFC 4180 Multiline Quotes</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-hairline px-3 py-1 text-[11px] text-ink-subtle">
            <Check className="h-3 w-3 text-emerald-500" />
            <span>Hindi &amp; Hinglish Parsing</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-hairline px-3 py-1 text-[11px] text-ink-subtle">
            <ShieldCheck className="h-3 w-3 text-emerald-500" />
            <span>R012 Prompt Injection Shield</span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-surface-2 border border-hairline px-3 py-1 text-[11px] text-ink-subtle">
            <Check className="h-3 w-3 text-emerald-500" />
            <span>Rating Mismatch Detection</span>
          </span>
        </div>
      </div>

      {/* Action Footer & One-Click Benchmark Trigger */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 text-ink-subtle">
          <FileSpreadsheet className="h-4 w-4 text-ink-tertiary" />
          <span>Active file:</span>
          <span className="font-mono font-medium text-ink">
            {selectedFileName || 'No file selected yet'}
          </span>
        </div>

        <button
          onClick={handleLoadSample}
          disabled={isLoading}
          className="flex items-center gap-2 rounded-xl bg-surface-1 border border-hairline px-4 py-2 font-medium text-ink hover:bg-surface-2 hover:border-indigo-500/40 transition-all shadow-sm"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          <span>Load benchmark dataset (30 reviews)</span>
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-500 animate-in fade-in">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
