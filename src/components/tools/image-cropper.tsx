'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Crop } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  assertImageFile,
  decodeImageFile,
  processImageFile,
  revokeDecodedImage,
} from '@/lib/tools/images';
import { clamp } from '@/lib/tools/validate';
import { downloadBlob } from '@/lib/tools/pdf';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone, SelectedFile } from '@/components/tools/file-dropzone';

interface CropRegion {
  left: number;
  top: number;
  width: number;
  height: number;
}

const INITIAL_CROP: CropRegion = { left: 10, top: 10, width: 80, height: 80 };
const MIN_CROP_PERCENT = 5;

const ImageCropper: React.FC<ToolComponentProps> = () => {
  const [file, setFile] = useState<File | null>(null);
  const [crop, setCrop] = useState<CropRegion>(INITIAL_CROP);
  const [resultBlob, setResultBlob] = useState<Blob | null>(null);
  const [resultUrl, setResultUrl] = useState<string | null>(null);
  const [resultSize, setResultSize] = useState<{
    width: number;
    height: number;
    bytes: number;
  } | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<{
    kind: 'move' | 'resize';
    startX: number;
    startY: number;
    initial: CropRegion;
  } | null>(null);

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
    setCrop(INITIAL_CROP);
    setResultBlob(null);
    setResultUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setResultSize(null);
    setPreviewUrl((current) => {
      if (current) URL.revokeObjectURL(current);
      return null;
    });
    setPreviewUrl(URL.createObjectURL(next));
  }, []);

  const clampCrop = (next: CropRegion): CropRegion => ({
    left: clamp(next.left, 0, 100 - next.width),
    top: clamp(next.top, 0, 100 - next.height),
    width: clamp(next.width, MIN_CROP_PERCENT, 100),
    height: clamp(next.height, MIN_CROP_PERCENT, 100),
  });

  const updateCrop = (patch: Partial<CropRegion>): void => {
    setCrop((current) => clampCrop({ ...current, ...patch }));
  };

  const onPointerDown = (event: React.PointerEvent, kind: 'move' | 'resize'): void => {
    if (!containerRef.current) return;
    event.preventDefault();
    (event.target as Element).setPointerCapture(event.pointerId);
    dragRef.current = {
      kind,
      startX: event.clientX,
      startY: event.clientY,
      initial: crop,
    };
  };

  const onPointerMove = (event: React.PointerEvent): void => {
    const drag = dragRef.current;
    const container = containerRef.current;
    if (!drag || !container) return;
    const bounds = container.getBoundingClientRect();
    const dx = ((event.clientX - drag.startX) / bounds.width) * 100;
    const dy = ((event.clientY - drag.startY) / bounds.height) * 100;
    if (drag.kind === 'move') {
      setCrop((current) =>
        clampCrop({
          ...current,
          left: drag.initial.left + dx,
          top: drag.initial.top + dy,
        })
      );
    } else {
      setCrop((current) =>
        clampCrop({
          ...current,
          width: drag.initial.width + dx,
          height: drag.initial.height + dy,
        })
      );
    }
  };

  const endDrag = (): void => {
    dragRef.current = null;
  };

  const onKeyDown = (event: React.KeyboardEvent): void => {
    const step = event.shiftKey ? 5 : 1;
    let patch: Partial<CropRegion> | null = null;
    switch (event.key) {
      case 'ArrowLeft':
        patch = { left: crop.left - step };
        break;
      case 'ArrowRight':
        patch = { left: crop.left + step };
        break;
      case 'ArrowUp':
        patch = { top: crop.top - step };
        break;
      case 'ArrowDown':
        patch = { top: crop.top + step };
        break;
      case '+':
      case '=':
        patch = { width: crop.width + step, height: crop.height + step };
        break;
      case '-':
        patch = { width: crop.width - step, height: crop.height - step };
        break;
      default:
        break;
    }
    if (patch) {
      event.preventDefault();
      updateCrop(patch);
    }
  };

  const cropImage = async (): Promise<void> => {
    if (!file) return;
    setBusy(true);
    setError(null);
    try {
      const decoded = await decodeImageFile(file);
      try {
        const x = Math.min(
          Math.max(0, Math.floor((crop.left / 100) * decoded.width)),
          decoded.width - 1
        );
        const y = Math.min(
          Math.max(0, Math.floor((crop.top / 100) * decoded.height)),
          decoded.height - 1
        );
        const pixelWidth = Math.min(
          decoded.width - x,
          Math.max(1, Math.round((crop.width / 100) * decoded.width))
        );
        const pixelHeight = Math.min(
          decoded.height - y,
          Math.max(1, Math.round((crop.height / 100) * decoded.height))
        );
        const { blob, width, height } = await processImageFile(file, {
          crop: { x, y, width: pixelWidth, height: pixelHeight },
        });
        const url = URL.createObjectURL(blob);
        setResultBlob(blob);
        setResultUrl((current) => {
          if (current) URL.revokeObjectURL(current);
          return url;
        });
        setResultSize({ width, height, bytes: blob.size });
      } finally {
        revokeDecodedImage(decoded);
      }
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not crop the image.');
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Crop className="h-6 w-6" aria-hidden="true" />}
        title="Image cropper"
        description="Select a region and crop any image to it. Drag the box to move it, drag the handle to resize, or use the arrow keys when the box is focused."
      />

      {!file ? (
        <FileDropzone
          onFiles={handleFiles}
          accept="image/*"
          label="Choose an image to crop"
          hint="processed locally, never uploaded"
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
              setResultBlob(null);
              setResultUrl((current) => {
                if (current) URL.revokeObjectURL(current);
                return null;
              });
              setResultSize(null);
              setError(null);
            }}
          />

          <div
            ref={containerRef}
            className="bg-muted relative w-full overflow-hidden rounded-xl"
            style={{ aspectRatio: '4 / 3' }}
          >
            {previewUrl && (
              <img
                src={previewUrl}
                alt={`Preview of ${file.name}`}
                draggable={false}
                className="pointer-events-none absolute inset-0 h-full w-full object-contain select-none"
              />
            )}
            <div
              role="application"
              aria-label="Crop selection box. Drag to move, use the handle to resize, arrow keys to nudge."
              tabIndex={0}
              onKeyDown={onKeyDown}
              onPointerDown={(event) => onPointerDown(event, 'move')}
              onPointerMove={onPointerMove}
              onPointerUp={endDrag}
              onPointerCancel={endDrag}
              className="focus-visible:ring-primary absolute cursor-move border-2 border-white/90 shadow-[0_0_0_9999px_rgba(0,0,0,0.45)] focus-visible:ring-2 focus-visible:outline-none"
              style={{
                left: `${crop.left}%`,
                top: `${crop.top}%`,
                width: `${crop.width}%`,
                height: `${crop.height}%`,
              }}
            >
              <div
                role="presentation"
                aria-hidden="true"
                onPointerDown={(event) => onPointerDown(event, 'resize')}
                className="absolute -right-3 -bottom-3 h-6 w-6 cursor-nwse-resize rounded-full border-2 border-white bg-sky-500 shadow"
              />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-4">
            {(
              [
                ['left', 'Left %'],
                ['top', 'Top %'],
                ['width', 'Width %'],
                ['height', 'Height %'],
              ] as const
            ).map(([key, label]) => (
              <label key={key} className="block">
                <span className="text-foreground mb-2 block text-sm font-medium">{label}</span>
                <input
                  type="number"
                  min={key === 'width' || key === 'height' ? MIN_CROP_PERCENT : 0}
                  max={100}
                  value={Number(crop[key]).toFixed(0)}
                  onChange={(event) =>
                    updateCrop({ [key]: clamp(Number(event.target.value), 0, 100) })
                  }
                  className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-xl border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </label>
            ))}
          </div>

          <button
            type="button"
            onClick={cropImage}
            disabled={busy}
            className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-5 py-3 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50"
          >
            {busy ? 'Cropping…' : 'Apply crop'}
          </button>

          {error && (
            <p role="alert" className="text-sm text-red-600 dark:text-red-400">
              {error}
            </p>
          )}

          {resultBlob && resultSize && (
            <div className="border-border bg-muted/50 space-y-3 rounded-xl border p-4">
              <p className="text-foreground font-mono text-sm">
                {resultSize.width} × {resultSize.height}px
              </p>
              <img
                src={resultUrl ?? ''}
                alt="Cropped result preview"
                className="bg-muted max-h-64 w-full rounded-xl object-contain"
              />
              <button
                type="button"
                onClick={() =>
                  downloadBlob(
                    resultBlob,
                    `${file.name.replace(/\.[^.]+$/, '')}-cropped${file.name.match(/\.[^.]+$/)?.[0] ?? ''}`
                  )
                }
                className="bg-primary text-primary-foreground hover:bg-primary/90 rounded-xl px-4 py-2 text-sm font-medium transition-colors"
              >
                Download cropped image
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

ImageCropper.displayName = 'ImageCropper';

export { ImageCropper };
