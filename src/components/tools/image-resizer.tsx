'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Scissors } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  assertImageFile,
  extensionFor,
  processImageFile,
  type ImageOutputFormat,
} from '@/lib/tools/images';
import { parseStrictInt } from '@/lib/tools/validate';
import { downloadBlob } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, SelectedFile, formatFileSize } from '@/components/tools/file-dropzone';

interface ResizeResult {
  blob: Blob;
  width: number;
  height: number;
}

const PRESETS: Array<{ label: string; width: number; height: number }> = [
  { label: 'Thumbnail', width: 160, height: 160 },
  { label: 'Avatar', width: 512, height: 512 },
  { label: 'Small', width: 800, height: 600 },
  { label: 'Large', width: 1920, height: 1080 },
  { label: 'Full HD', width: 3840, height: 2160 },
];

const ImageResizer: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [widthText, setWidthText] = useState('800');
  const [heightText, setHeightText] = useState('600');
  const [fit, setFit] = useState<'contain' | 'cover' | 'fill'>('contain');
  const [result, setResult] = useState<ResizeResult | null>(null);
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

  const applyPreset = (preset: { width: number; height: number }): void => {
    setWidthText(String(preset.width));
    setHeightText(String(preset.height));
  };

  const resize = async (): Promise<void> => {
    if (!file) return;
    const targetWidth = parseStrictInt(widthText);
    const targetHeight = parseStrictInt(heightText);
    if (targetWidth === null || targetHeight === null || targetWidth <= 0 || targetHeight <= 0) {
      setError('Enter valid positive dimensions.');
      return;
    }
    if (targetWidth > 10000 || targetHeight > 10000) {
      setError('Dimensions must be 10,000 pixels or smaller.');
      return;
    }
    setBusy(true);
    setError(null);
    try {
      const { blob, width, height } = await processImageFile(file, {
        targetWidth,
        targetHeight,
        fit,
      });
      setResult({ blob, width, height });
      setResultUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not resize the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Scissors className="h-6 w-6" aria-hidden="true" />}
        title="Image resizer"
        description="Resize images to exact pixel dimensions with contain, cover, or fill fitting — entirely in your browser."
      />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Choose an image to resize"
          hint="processed locally, never uploaded"
        />
      ) : (
        <div className="space-y-4">
          <SelectedFile
            file={file}
            onRemove={() => {
              setFile(null);
              setResult(null);
              setResultUrl((current) => {
                if (current) URL.revokeObjectURL(current);
                return null;
              });
              setPreviewUrl((current) => {
                if (current) URL.revokeObjectURL(current);
                return null;
              });
              setError(null);
            }}
          />

          {previewUrl && (
            <img
              src={previewUrl}
              alt={`Preview of ${file.name}`}
              className="bg-muted max-h-64 w-full rounded-xl object-contain"
            />
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <label className="block">
              <span className="text-foreground mb-2 block text-sm font-medium">Width (px)</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={widthText}
                onChange={(event) => setWidthText(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-xl border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </label>
            <label className="block">
              <span className="text-foreground mb-2 block text-sm font-medium">Height (px)</span>
              <input
                type="number"
                min={1}
                max={10000}
                value={heightText}
                onChange={(event) => setHeightText(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-xl border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </label>
          </div>

          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Fit mode</p>
            <div className="flex flex-wrap gap-2">
              {(['contain', 'cover', 'fill'] as const).map((mode) => (
                <label
                  key={mode}
                  className={`cursor-pointer rounded-lg border px-3 py-2 text-sm transition-colors ${
                    fit === mode
                      ? 'border-primary bg-primary/10 text-primary'
                      : 'border-border bg-background text-foreground hover:bg-muted'
                  }`}
                >
                  <input
                    type="radio"
                    name="fit"
                    value={mode}
                    checked={fit === mode}
                    onChange={() => setFit(mode)}
                    className="sr-only"
                  />
                  {mode}
                </label>
              ))}
            </div>
            <p className="text-muted-foreground mt-1 text-xs">
              contain fits inside the box · cover fills the box (cropping overflow) · fill stretches
            </p>
          </div>

          <div>
            <p className="text-foreground mb-2 text-sm font-medium">Presets</p>
            <div className="flex flex-wrap gap-2">
              {PRESETS.map((preset) => (
                <button
                  key={preset.label}
                  type="button"
                  onClick={() => applyPreset(preset)}
                  className="border-border text-foreground hover:bg-muted rounded-lg border px-3 py-2 text-sm transition-colors"
                >
                  {preset.label} · {preset.width}×{preset.height}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={resize}
            disabled={busy}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Resizing…' : 'Resize image'}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {result && resultUrl && (
            <div className="border-border bg-muted/50 space-y-3 rounded-xl border p-4">
              <p className="text-foreground font-mono text-sm">
                {result.width} × {result.height}px · {formatFileSize(result.blob.size)}
              </p>
              <img
                src={resultUrl}
                alt="Resized result preview"
                className="bg-muted max-h-64 w-full rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  downloadBlob(
                    result.blob,
                    `${file.name.replace(/\.[^.]+$/, '')}-${result.width}x${result.height}.${extensionFor(file.type as ImageOutputFormat)}`
                  )
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Download resized image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ImageResizer.displayName = 'ImageResizer';

export { ImageResizer };
