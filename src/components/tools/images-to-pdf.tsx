'use client';

import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Download, ImagePlus, Loader2, X } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { downloadBlob } from '@/lib/tools/files';
import { createPdfFromImages, type PdfImagePage } from '@/lib/tools/pdf';
import { processImageFile } from '@/lib/tools/images';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, formatFileSize } from '@/components/tools/file-dropzone';

const MAX_IMAGES = 50;

const ImagesToPdf: React.FC<ToolComponentProps> = () => {
  const [files, setFiles] = useState<File[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  const convert = async (): Promise<void> => {
    setError(null);
    setLoading(true);
    setProgress(0);
    try {
      const pages: PdfImagePage[] = [];
      for (let index = 0; index < files.length; index += 1) {
        setProgress(index + 1);
        pages.push(await processImageFile(files[index], { format: 'image/jpeg', quality: 0.9 }));
      }
      const blob = await createPdfFromImages(pages, { title: 'Images' });
      downloadBlob(blob, `images-${Date.now()}.pdf`);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not create the PDF.');
    } finally {
      setLoading(false);
    }
  };

  const removeFile = useCallback((fileToRemove: File): void => {
    setFiles((current) => current.filter((file) => file !== fileToRemove));
  }, []);

  const previewUrls = useMemo(() => files.map((file) => URL.createObjectURL(file)), [files]);

  useEffect(() => {
    return () => {
      for (const url of previewUrls) {
        URL.revokeObjectURL(url);
      }
    };
  }, [previewUrls]);

  const totalSize = files.reduce((sum, file) => sum + file.size, 0);
  const canConvert = files.length > 0 && !loading;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ImagePlus className="h-6 w-6" aria-hidden="true" />}
        title="Images to PDF"
        description="Combine PNG, JPEG, and WebP images into a single PDF, in the order you add them — entirely in your browser."
      />

      <FileDropzone
        accept="image/png,image/jpeg,image/webp,.png,.jpg,.jpeg,.webp"
        onFiles={(selected) => {
          setFiles((current) => {
            const merged = [...current, ...selected];
            return merged.slice(0, MAX_IMAGES);
          });
          setProgress(0);
        }}
        multiple
        label="Drop images here or click to browse"
        hint={`Up to ${MAX_IMAGES} images (PNG, JPEG, WebP) — they will be ordered as listed.`}
      />

      <div className="border-border bg-card flex flex-wrap items-center gap-4 rounded-xl border p-4">
        <div className="ml-auto flex flex-wrap items-center gap-3">
          <p className="text-muted-foreground text-sm">
            {files.length} {files.length === 1 ? 'image' : 'images'} · {formatFileSize(totalSize)}
          </p>
          {files.length > 0 && (
            <button
              type="button"
              onClick={() => setFiles([])}
              disabled={loading}
              className="border-border text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
            >
              Clear all
            </button>
          )}
          <button
            type="button"
            onClick={convert}
            disabled={!canConvert}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            ) : (
              <Download className="h-4 w-4" aria-hidden="true" />
            )}
            {loading ? `Processing ${progress}/${files.length}…` : 'Create PDF'}
          </button>
        </div>
      </div>

      {error !== null && (
        <div className="rounded-xl border border-red-600/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {files.length > 0 && (
        <div className="grid grid-cols-3 gap-3 sm:grid-cols-4 md:grid-cols-6">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${file.size}-${file.lastModified}`}
              className="border-border bg-card rounded-xl border p-2"
            >
              <div className="relative">
                <img
                  src={previewUrls[index]}
                  alt={file.name}
                  className="h-28 w-full rounded-lg object-cover"
                />
                <button
                  type="button"
                  onClick={() => removeFile(file)}
                  className="bg-background text-muted-foreground hover:text-foreground absolute -top-1.5 -right-1.5 rounded-full p-1 shadow-md transition-colors"
                  aria-label={`Remove ${file.name}`}
                >
                  <X className="h-3.5 w-3.5" aria-hidden="true" />
                </button>
              </div>
              <p className="text-muted-foreground mt-1.5 truncate text-xs" title={file.name}>
                {index + 1}. {file.name}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

ImagesToPdf.displayName = 'ImagesToPdf';

export { ImagesToPdf };
