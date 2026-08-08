'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Info } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { assertImageFile, readImageMetadata, type ImageMetadata } from '@/lib/tools/images';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { FileDropzone, SelectedFile, formatFileSize } from '@/components/tools/file-dropzone';

const ImageMetadataViewer: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [metadata, setMetadata] = useState<ImageMetadata | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
  }, [previewUrl]);

  const handleFiles = useCallback(async (files: File[]) => {
    const next = files[0];
    if (!next) return;
    const validation = assertImageFile(next);
    if (validation) {
      setError(validation);
      return;
    }
    setError(null);
    setFile(next);
    setMetadata(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPreviewUrl(URL.createObjectURL(next));
    setBusy(true);
    try {
      setMetadata(await readImageMetadata(next));
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not read the image metadata.');
    } finally {
      setBusy(false);
    }
  }, []);

  const rows: Array<[string, string | null]> = [];
  if (metadata) {
    rows.push(
      ['File name', metadata.fileName || null],
      ['File size', formatFileSize(metadata.fileSize)],
      ['MIME type', metadata.mimeType || null],
      ['Format', metadata.format || null],
      ['Width', metadata.width ? `${metadata.width} px` : null],
      ['Height', metadata.height ? `${metadata.height} px` : null],
      ['Bit depth', metadata.depth !== undefined ? `${metadata.depth} bits` : null],
      ['Color type', metadata.colorType ?? null],
      ['Interlaced', metadata.interlace !== undefined ? (metadata.interlace ? 'Yes' : 'No') : null],
      ['Animated', metadata.animation !== undefined ? (metadata.animation ? 'Yes' : 'No') : null],
      ['DPI (X)', metadata.dpi?.x !== undefined ? String(metadata.dpi.x) : null],
      ['DPI (Y)', metadata.dpi?.y !== undefined ? String(metadata.dpi.y) : null],
      ['Orientation', metadata.orientation !== undefined ? String(metadata.orientation) : null],
      ['Created', metadata.creationTime ?? null],
      ['Latitude', metadata.gps ? metadata.gps.latitude.toFixed(6) : null],
      ['Longitude', metadata.gps ? metadata.gps.longitude.toFixed(6) : null]
    );
    Object.entries(metadata.exif ?? {}).forEach(([name, value]) => {
      rows.push([name, value || null]);
    });
    (metadata.textChunks ?? []).forEach((chunk) => {
      rows.push([`PNG ${chunk.key}`, chunk.value || null]);
    });
  }

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Info className="h-6 w-6" aria-hidden="true" />}
        title="Image metadata viewer"
        description="Inspect an image's file info, dimensions, EXIF data, and PNG text chunks — all parsed locally in your browser."
      />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Choose an image to inspect"
          hint="JPEG, PNG, GIF, WebP, BMP · EXIF, GPS, and more"
        />
      ) : (
        <div className="space-y-4">
          <SelectedFile
            file={file}
            onRemove={() => {
              setPreviewUrl((current) => {
                if (current) URL.revokeObjectURL(current);
                return null;
              });
              setFile(null);
              setMetadata(null);
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

          {busy && <p className="text-muted-foreground text-sm">Reading metadata…</p>}
          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {metadata && (
            <div className="space-y-3">
              <div className="flex flex-wrap items-center gap-3">
                <h2 className="text-foreground text-base font-semibold">Metadata</h2>
                <CopyButton
                  value={JSON.stringify(metadata, null, 2)}
                  label="Copy as JSON"
                  size="sm"
                  variant="outline"
                />
              </div>
              <div className="border-border divide-border divide-y overflow-hidden rounded-xl border">
                {rows.map(([key, value]) => (
                  <div key={key} className="grid grid-cols-[180px_1fr] gap-3 px-4 py-2.5 text-sm">
                    <span className="text-muted-foreground truncate">{key}</span>
                    <span className="text-foreground font-mono break-all">{value ?? '—'}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ImageMetadataViewer.displayName = 'ImageMetadataViewer';

export { ImageMetadataViewer };
