'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Repeat } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  IMAGE_FORMATS,
  assertImageFile,
  formatLabel,
  processImageFile,
  type ImageOutputFormat,
} from '@/lib/tools/images';
import { clamp } from '@/lib/tools/validate';
import { downloadBlob } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, SelectedFile, formatFileSize } from '@/components/tools/file-dropzone';

const ImageFormatConverter: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [format, setFormat] = useState<ImageOutputFormat>('image/webp');
  const [quality, setQuality] = useState(90);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (resultUrl) URL.revokeObjectURL(resultUrl);
    };
  }, [resultUrl]);

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
    setResultBlob(null);
    setResultUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
  }, []);

  const convert = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const { blob } = await processImageFile(file, {
        format,
        quality: quality / 100,
      });
      setResultBlob(blob);
      setResultUrl((current) => {
        if (current) URL.revokeObjectURL(current);
        return URL.createObjectURL(blob);
      });
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not convert the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Repeat className="h-6 w-6" aria-hidden="true" />}
        title="Image format converter"
        description="Convert images between PNG, JPEG, WebP, and AVIF right in the browser — with lossy quality control."
      />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Choose an image to convert"
          hint="processed locally, never uploaded"
        />
      ) : (
        <div className="space-y-4">
          <SelectedFile
            file={file}
            onRemove={() => {
              setFile(null);
              setResultBlob(null);
              setResultUrl((current) => {
                if (current) URL.revokeObjectURL(current);
                return null;
              });
              setError(null);
            }}
          />

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
                aria-label="Output quality"
              />
            </label>
          </div>

          <button
            type="button"
            onClick={convert}
            disabled={busy}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Converting…' : 'Convert image'}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {resultBlob && resultUrl && (
            <div className="border-border bg-muted/50 space-y-3 rounded-xl border p-4">
              <p className="text-muted-foreground text-xs">
                {formatLabel(format)} · {formatFileSize(resultBlob.size)}
              </p>
              <img
                src={resultUrl}
                alt="Converted result preview"
                className="bg-muted max-h-64 w-full rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  downloadBlob(
                    resultBlob,
                    `${file.name.replace(/\.[^.]+$/, '')}.${format.split('/')[1]}`
                  )
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Download converted image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ImageFormatConverter.displayName = 'ImageFormatConverter';

export { ImageFormatConverter };
