'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, CheckCircle2, AlertCircle, Loader2, Sparkles, ShieldAlert } from 'lucide-react';

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
      setError('Please upload a valid .csv file.');
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
    setSelectedFileName('reviews.csv (Official Benchmark)');
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
    <div className="w-full">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed p-8 transition-all cursor-pointer ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-500/10 scale-[1.005]'
            : 'border-slate-800 bg-slate-900/60 hover:border-slate-700 hover:bg-slate-900/90'
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

        <div className="flex flex-col items-center text-center max-w-xl">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-4">
              <Loader2 className="h-10 w-10 text-indigo-400 animate-spin" />
              <div className="text-base font-semibold text-slate-200">{loadingMessage}</div>
              <p className="text-xs text-slate-400">
                Parsing rows • Checking persistent SHA-256 cache • Batching AI calls • Defeating injections
              </p>
            </div>
          ) : (
            <>
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="h-7 w-7" />
              </div>

              <h3 className="text-lg font-semibold text-slate-100">
                Upload your <code className="text-indigo-400 font-mono text-sm bg-indigo-950/60 px-1.5 py-0.5 rounded border border-indigo-800/40">reviews.csv</code> file
              </h3>
              <p className="mt-1 text-sm text-slate-400">
                Drag and drop your CSV here, or click to browse from your device
              </p>

              {/* Benchmark Dataset Feature Tags */}
              <div className="mt-5 flex flex-wrap justify-center gap-2 text-xs">
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-2.5 py-1 text-slate-300 border border-slate-700/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Hinglish & Hindi support
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-2.5 py-1 text-slate-300 border border-slate-700/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                  Empty & duplicate detection
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-2.5 py-1 text-slate-300 border border-slate-700/60">
                  <ShieldAlert className="h-3.5 w-3.5 text-amber-400" />
                  R012 prompt injection defense
                </span>
                <span className="inline-flex items-center gap-1 rounded-full bg-slate-800/90 px-2.5 py-1 text-slate-300 border border-slate-700/60">
                  <CheckCircle2 className="h-3.5 w-3.5 text-indigo-400" />
                  Rating mismatch check
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Quick Action: Load Sample Benchmark Button */}
      <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3 px-1">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <FileText className="h-4 w-4 text-slate-500" />
          <span>
            {selectedFileName ? (
              <span className="text-slate-200 font-medium">Selected: {selectedFileName}</span>
            ) : (
              'Expected columns: review_id, product, rating, date, review_text'
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isLoading}
          className="inline-flex items-center gap-2 rounded-xl border border-indigo-500/40 bg-indigo-600/20 px-3.5 py-2 text-xs font-semibold text-indigo-300 shadow-sm hover:bg-indigo-600/30 hover:border-indigo-500/60 transition-all disabled:opacity-50"
        >
          <Sparkles className="h-3.5 w-3.5 text-indigo-400" />
          Load Official Benchmark (reviews.csv)
        </button>
      </div>

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-xl border border-rose-500/30 bg-rose-500/10 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0 text-rose-400" />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
