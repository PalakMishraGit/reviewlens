'use client';

import React, { useState, useRef } from 'react';
import { Upload, FileText, Check, AlertCircle, Loader2, ShieldCheck } from 'lucide-react';

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
      setError('Please upload a valid .csv file');
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
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => !isLoading && fileInputRef.current?.click()}
        className={`group relative flex flex-col items-center justify-center rounded-xl border border-dashed transition-colors cursor-pointer py-9 px-6 ${
          isDragOver
            ? 'border-white/40 bg-[#161a24]'
            : 'border-white/[0.12] bg-[#11141c]/70 hover:border-white/[0.22] hover:bg-[#11141c]'
        } ${isLoading ? 'pointer-events-none opacity-70' : ''}`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileChange}
          className="hidden"
          disabled={isLoading}
        />

        <div className="flex flex-col items-center text-center max-w-lg">
          {isLoading ? (
            <div className="flex flex-col items-center gap-3 py-3">
              <Loader2 className="h-6 w-6 text-[#a3a9b8] animate-spin" strokeWidth={1.5} />
              <div className="text-sm font-medium text-[#eef0f5]">{loadingMessage}</div>
              <p className="text-xs text-[#7a8296]">
                Parsing RFC 4180 rows, querying SHA-256 cache, executing 5-item batches
              </p>
            </div>
          ) : (
            <>
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg border border-white/[0.08] bg-[#1a1e28] text-[#a3a9b8]">
                <Upload className="h-4 w-4" strokeWidth={1.5} />
              </div>

              <div className="text-sm font-medium text-[#eef0f5]">
                Drop <span className="font-mono text-xs text-[#a3a9b8]">reviews.csv</span> here or click to browse
              </div>
              <p className="mt-1 text-xs text-[#7a8296]">
                Supports comma-separated files up to 10 MB
              </p>

              {/* Verified Capabilities */}
              <div className="mt-4 flex flex-wrap justify-center gap-2 text-[11px] text-[#a3a9b8]">
                <span className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-[#1a1e28]/60 px-2 py-0.5">
                  <Check className="h-3 w-3 text-[#4cc38a]" strokeWidth={1.5} />
                  Hindi &amp; Hinglish parsing
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-[#1a1e28]/60 px-2 py-0.5">
                  <Check className="h-3 w-3 text-[#4cc38a]" strokeWidth={1.5} />
                  Duplicate &amp; empty detection
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-[#1a1e28]/60 px-2 py-0.5">
                  <ShieldCheck className="h-3 w-3 text-[#4cc38a]" strokeWidth={1.5} />
                  R012 prompt injection defense
                </span>
                <span className="inline-flex items-center gap-1 rounded border border-white/[0.06] bg-[#1a1e28]/60 px-2 py-0.5">
                  <Check className="h-3 w-3 text-[#4cc38a]" strokeWidth={1.5} />
                  Rating mismatch detection
                </span>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Control row */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 px-1">
        <div className="flex items-center gap-1.5 text-xs text-[#7a8296]">
          <FileText className="h-3.5 w-3.5" strokeWidth={1.5} />
          <span>
            {selectedFileName ? (
              <span className="text-[#eef0f5] font-mono text-[11px]">{selectedFileName}</span>
            ) : (
              'Columns: review_id, product, rating, date, review_text'
            )}
          </span>
        </div>

        <button
          type="button"
          onClick={handleLoadSample}
          disabled={isLoading}
          className="inline-flex h-8 items-center gap-2 rounded-lg bg-[#eef0f5] px-3 text-xs font-medium text-[#0b0d14] hover:bg-white active:scale-[0.98] transition-all disabled:opacity-50"
        >
          Load benchmark dataset (30 reviews)
        </button>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-lg border border-[#e5484d]/30 bg-[#e5484d]/10 p-3 text-xs text-[#e5484d]">
          <AlertCircle className="h-4 w-4 shrink-0" strokeWidth={1.5} />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};
