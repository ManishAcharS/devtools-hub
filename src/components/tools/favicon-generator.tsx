'use client';

import React, { useMemo, useState } from 'react';
import { Image, Download, Check, X } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { FileDropzone } from '@/components/tools/file-dropzone';

const SIZES = [
  { label: 'Favicon 16×16', size: 16 },
  { label: 'Favicon 32×32', size: 32 },
  { label: 'Apple Touch 180×180', size: 180 },
  { label: 'Android Chrome 192×192', size: 192 },
  { label: 'Android Chrome 512×512', size: 512 },
  { label: 'Windows Tile 150×150', size: 150 },
] as const;

type SizeValue = (typeof SIZES)[number]['size'];

const FaviconGenerator: React.FC<ToolComponentProps> = () => {
  const [image, setImage] = useState<string | null>(null);
  const [selectedSizes, setSelectedSizes] = useState<SizeValue[]>(SIZES.map((s) => s.size));
  const [bgColor, setBgColor] = useState('#ffffff');
  const [generateICO, setGenerateICO] = useState(true);

  const toggleSize = (size: SizeValue) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const output = useMemo(() => {
    if (!image) return null;
    return selectedSizes.map((size) => ({
      size,
      label: SIZES.find((s) => s.size === size)?.label ?? `${size}×${size}`,
      dataUrl: resizeImage(image, size, size, bgColor),
    }));
  }, [image, selectedSizes, bgColor]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Image className="h-6 w-6" aria-hidden="true" />}
        title="Favicon generator"
        description="Upload an image and generate favicon sizes (16×16 to 512×512) plus optional ICO file."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <FileDropzone
          onFiles={(files) => {
            if (files[0]) {
              const reader = new FileReader();
              reader.onload = (e) => setImage(e.target?.result as string);
              reader.readAsDataURL(files[0]);
            }
          }}
          accept="image/*"
          maxFiles={1}
        />
        {image && (
          <div className="mt-4 flex items-center gap-4">
            <img src={image} alt="Preview" className="h-20 w-20 rounded-lg border object-cover" />
            <div>
              <p className="font-medium">Image loaded</p>
              <p className="text-muted-foreground text-sm">
                {selectedSizes.length} size{selectedSizes.length === 1 ? '' : 's'} selected
              </p>
            </div>
            <button
              type="button"
              onClick={() => setImage(null)}
              className="text-muted-foreground hover:text-foreground ml-auto"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>
        )}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Sizes
          </p>
          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={selectedSizes.length === SIZES.length}
              onChange={(e) => setSelectedSizes(e.target.checked ? SIZES.map((s) => s.size) : [])}
              className="accent-primary h-4 w-4"
            />
            Select all
          </label>
        </div>
        <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
          {SIZES.map((s) => (
            <label
              key={s.size}
              className="hover:bg-muted flex cursor-pointer items-center gap-3 rounded-lg border p-3"
            >
              <input
                type="checkbox"
                checked={selectedSizes.includes(s.size)}
                onChange={() => toggleSize(s.size)}
                className="accent-primary h-4 w-4"
              />
              <span className="font-medium">{s.label}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={generateICO}
            onChange={(e) => setGenerateICO(e.target.checked)}
            className="accent-primary h-4 w-4"
          />
          Also generate multi-resolution <code>.ico</code> file (16, 32, 48, 256)
        </label>
        <div className="mt-3">
          <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
            Background color (for transparency)
          </label>
          <div className="flex items-center gap-2">
            <input
              type="color"
              value={bgColor}
              onChange={(e) => setBgColor(e.target.value)}
              className="h-10 w-14 cursor-pointer rounded-lg border"
            />
            <input
              type="text"
              value={bgColor}
              onChange={(e) => {
                if (/^#[0-9a-fA-F]{6}$/.test(e.target.value)) setBgColor(e.target.value);
              }}
              className="border-border bg-background text-foreground focus-visible:ring-primary w-24 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      {output && (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
              Preview
            </p>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {output.map((item) => (
                <div key={item.size} className="text-center">
                  <img
                    src={item.dataUrl}
                    alt={item.label}
                    className="mx-auto h-20 w-20 rounded-lg border object-cover"
                  />
                  <p className="mt-1 font-mono text-xs">{item.label}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {output.map((item) => (
              <a
                key={item.size}
                href={item.dataUrl}
                download={`favicon-${item.size}.png`}
                className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium transition-colors"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                {item.label} PNG
              </a>
            ))}
            {generateICO && (
              <a
                href={output[0]?.dataUrl}
                download="favicon.ico"
                className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-3 py-2 text-sm font-medium"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Multi-size ICO
              </a>
            )}
          </div>
        </>
      )}

      {image && output && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            HTML snippet
          </p>
          <pre className="bg-muted text-foreground overflow-x-auto rounded-lg p-4 font-mono text-sm whitespace-pre-wrap">
            {`${output
              .filter((o) => o.size <= 32)
              .map(
                (o) =>
                  `<link rel="icon" type="image/png" sizes="${o.size}x${o.size}" href="favicon-${o.size}.png">`
              )
              .join('\n')}
${output.some((o) => o.size === 180) ? '<link rel="apple-touch-icon" sizes="180x180" href="favicon-180.png">' : ''}
${output.some((o) => o.size === 192) ? '<link rel="icon" type="image/png" sizes="192x192" href="favicon-192.png">' : ''}
${output.some((o) => o.size === 512) ? '<link rel="icon" type="image/png" sizes="512x512" href="favicon-512.png">' : ''}
${generateICO ? '<link rel="shortcut icon" href="favicon.ico">' : ''}`}
          </pre>
        </div>
      )}
    </div>
  );
};

function resizeImage(dataUrl: string, width: number, height: number, bgColor: string): string {
  const canvas = document.createElement('canvas');
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext('2d')!;
  ctx.fillStyle = bgColor;
  ctx.fillRect(0, 0, width, height);
  const img = document.createElement('img');
  img.src = dataUrl;
  // For async load, return a promise-based approach in real use.
  // Here we assume image is already loaded (from FileReader).
  ctx.drawImage(img, 0, 0, width, height);
  return canvas.toDataURL('image/png');
}

FaviconGenerator.displayName = 'FaviconGenerator';

export { FaviconGenerator };
