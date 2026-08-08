'use client';

import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Download, Image as ImageIcon, Loader2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { downloadBlob } from '@/lib/tools/files';
import { getPdfPageCount, renderPdfPages } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone } from '@/components/tools/file-dropzone';

const MAX_PAGES = 50;

interface PageImage {
  blob: Blob;
  pageNumber: number;
  url: string;
}

const PdfPagesToImages: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<PageImage[]>([]);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [scale, setScale] = useState(1.5);
  const [previewIndex, setPreviewIndex] = useState(0);

  const previewRef = useRef<HTMLImageElement | null>(null);

  const render = async (selected: File[]): Promise<void> => {
    const pdfFile = selected[0];
    if (pdfFile === undefined) return;
    setFile(pdfFile);
    setImages([]);
    setProgress(0);
    setError(null);
    setLoading(true);
    try {
      const pageCount = await getPdfPageCount(pdfFile);
      setTotalPages(pageCount);
      const pageNumbers = Array.from(
        { length: Math.min(pageCount, MAX_PAGES) },
        (_, index) => index + 1
      );
      const rendered = await renderPdfPages(pdfFile, pageNumbers, scale, ({ loaded }) => {
        setProgress(loaded);
      });
      setImages(
        rendered.map((page) => ({
          blob: page.blob,
          pageNumber: page.pageNumber,
          url: URL.createObjectURL(page.blob),
        }))
      );
      setPreviewIndex(0);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not render this PDF.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    return () => {
      for (const image of images) {
        URL.revokeObjectURL(image.url);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
  }, [previewIndex]);

  const downloadImage = useCallback((image: PageImage): void => {
    downloadBlob(image.blob, `page-${image.pageNumber}.jpg`);
  }, []);

  const downloadAll = useCallback((): void => {
    for (const image of images) {
      downloadBlob(image.blob, `page-${image.pageNumber}.jpg`);
    }
  }, [images]);

  const previewUrl = useMemo(
    () => (images.length > 0 ? images[previewIndex].url : null),
    [images, previewIndex]
  );

  const skipped = totalPages - images.length;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ImageIcon className="h-6 w-6" aria-hidden="true" />}
        title="PDF pages to images"
        description="Render every page of a PDF as a JPEG image, then download them individually or all at once."
      />

      <FileDropzone
        accept=".pdf,application/pdf"
        onFiles={render}
        multiple={false}
        label="Drop a PDF here or click to browse"
        hint="Rendering happens locally — your PDF never leaves your device."
      />

      <div className="border-border bg-card flex flex-wrap items-center gap-4 rounded-xl border p-4">
        <label className="text-muted-foreground flex items-center gap-2 text-sm">
          <span>Scale</span>
          <select
            value={scale}
            onChange={(event) => setScale(Number(event.target.value))}
            className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
          >
            <option value={1}>1× (screen)</option>
            <option value={1.5}>1.5× (sharp)</option>
            <option value={2}>2× (retina)</option>
          </select>
        </label>
        {file !== null && (
          <button
            type="button"
            onClick={() => render([file])}
            className="border-border text-foreground hover:bg-muted ml-auto inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
          >
            Re-render
          </button>
        )}
      </div>

      {loading && (
        <div className="space-y-2">
          <p className="text-muted-foreground flex items-center gap-2 text-sm" role="status">
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
            Rendering page {Math.min(progress + 1, totalPages || 1)} of{' '}
            {Math.min(totalPages, MAX_PAGES)}…
          </p>
          <div className="bg-muted h-2 w-full overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full transition-all"
              style={{
                width: `${totalPages > 0 ? (progress / Math.min(totalPages, MAX_PAGES)) * 100 : 0}%`,
              }}
            />
          </div>
        </div>
      )}

      {error !== null && (
        <div className="rounded-xl border border-red-600/20 bg-red-500/10 p-4 text-sm text-red-700 dark:text-red-400">
          {error}
        </div>
      )}

      {images.length > 0 && (
        <>
          <div className="flex flex-wrap items-center justify-between gap-3">
            <p className="text-muted-foreground text-sm">
              {images.length} {images.length === 1 ? 'image' : 'images'}
              {skipped > 0 && ` · ${skipped} skipped (limit of ${MAX_PAGES})`}
            </p>
            <button
              type="button"
              onClick={downloadAll}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Download className="h-4 w-4" aria-hidden="true" />
              Download all ({images.length})
            </button>
          </div>

          <div className="grid gap-4 md:grid-cols-2">
            <div className="border-border bg-card rounded-xl border p-4">
              {previewUrl !== null && (
                <img
                  ref={previewRef}
                  src={previewUrl}
                  alt={`Page ${images[previewIndex].pageNumber} preview`}
                  className="border-border mx-auto max-h-[70vh] w-auto rounded-lg border object-contain"
                />
              )}
            </div>
            <div className="border-border bg-card rounded-xl border p-4">
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Pages
              </p>
              <div className="flex max-h-[60vh] flex-wrap gap-2 overflow-y-auto">
                {images.map((image, index) => (
                  <div key={image.pageNumber} className="flex w-20 flex-col items-center gap-1">
                    <button
                      type="button"
                      onClick={() => setPreviewIndex(index)}
                      className={cn(
                        'border-border overflow-hidden rounded-lg border transition-all',
                        previewIndex === index && 'ring-primary ring-2'
                      )}
                      aria-label={`Show page ${image.pageNumber}`}
                    >
                      <img
                        src={image.url}
                        alt={`Page ${image.pageNumber} thumbnail`}
                        className="h-24 w-16 object-cover"
                      />
                    </button>
                    <button
                      type="button"
                      onClick={() => downloadImage(image)}
                      className="text-muted-foreground hover:text-foreground text-xs font-medium transition-colors"
                    >
                      Page {image.pageNumber}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

PdfPagesToImages.displayName = 'PdfPagesToImages';

export { PdfPagesToImages };
