'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { ImageDown } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  IMAGE_FORMATS,
  assertImageFile,
  compressImageFile,
  extensionFor,
  formatLabel,
  type ImageOutputFormat,
} from '@/lib/tools/images';
import { clamp } from '@/lib/tools/validate';
import { downloadBlob } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, SelectedFile, formatFileSize } from '@/components/tools/file-dropzone';

interface CompressionResult {
  blob: Blob;
  width: number;
  height: number;
  originalSize: number;
  newSize: number;
  reductionPercent: number;
}

const ImageCompressor: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageOutputFormat>('image/webp');
  const [quality, setQuality] = useState(75);
  const [result, setResult] = useState<CompressionResult | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [previewUrl, resultUrl]);

  const clearAll = useCallback(() => {
    setFile(null);
    setResult(null);
    setError(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setResultUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }, []);

  const handleFiles = useCallback((files: File[]) => {
    const next = files[0];
    if (!next) return;
    const validation = assertImageFile(next);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setFile(next);
    setResult(null);
    setResultUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPreviewUrl(URL.createObjectURL(next));
  }, []);

  const compress = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const output = await compressImageFile(file, format, quality / 100);
      setResult(output);
      setResultUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(output.blob);
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not compress the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ImageDown className="h-6 w-6" aria-hidden="true" />}
        title="Image compressor"
        description="Compress JPEG, PNG, or WebP images in the browser. Tune quality and see the exact size reduction before you download."
      />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Choose an image to compress"
          hint="PNG, JPEG, WebP, GIF, BMP, or AVIF · processed locally, never uploaded"
        />
      ) : (
        <div className="space-y-4">
          <SelectedFile file={file} onRemove={clearAll} />

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-foreground mb-2 block text-sm font-medium">Output format</span>
              <select
                value={format}
                onChange={(event) => setFormat(event.target.value as ImageOutputFormat)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-xl border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                {IMAGE_FORMATS.map((option) => (
                  <option key={option} value={option}>
                    {formatLabel(option)}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-foreground mb-2 block text-sm font-medium">
                Quality: {quality}%
              </span>
              <input
                type="range"
                min={10}
                max={100}
                value={quality}
                onChange={(event) => setQuality(clamp(Number(event.target.value), 10, 100))}
                className="accent-primary mt-3 w-full"
                aria-label="Compression quality"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={compress}
            disabled={busy}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Compressing…' : 'Compress image'}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {(previewUrl || resultUrl) && (
            <div className="grid gap-4 sm:grid-cols-2">
              {previewUrl && (
                <figure>
                  <img
                    src={previewUrl}
                    alt={`Original: ${file.name}`}
                    className="bg-muted aspect-video w-full rounded-xl object-contain"
                  />
                  <figcaption className="text-muted-foreground mt-2 text-xs">
                    Original · {formatFileSize(file.size)}
                  </figcaption>
                </figure>
              )}
              {result && resultUrl && (
                <figure>
                  <img
                    src={resultUrl}
                    alt="Compressed result preview"
                    className="bg-muted aspect-video w-full rounded-xl object-contain"
                  />
                  <figcaption className="text-muted-foreground mt-2 text-xs">
                    Compressed · {formatFileSize(result.newSize)} (
                    {result.reductionPercent >= 0
                      ? `−${result.reductionPercent}%`
                      : `+${Math.abs(result.reductionPercent)}%`}
                    ) · {result.width}×{result.height}
                  </figcaption>
                </figure>
              )}
            </div>
          )}

          {result && (
            <button
              type="button"
              onClick={() =>
                downloadBlob(
                  result.blob,
                  `${file.name.replace(/\.[^.]+$/, '')}-compressed.${extensionFor(format)}`
                )
              }
              className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-3 text-sm font-medium transition-colors"
            >
              Download compressed image
            </button>
          )}
        </div>
      )}
    </div>
  );
};

ImageCompressor.displayName = 'ImageCompressor';

export { ImageCompressor };
