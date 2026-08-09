'use client';

import React, { useMemo, useState } from 'react';
import { Image as ImageIcon } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

function escapeXml(value: string): string {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function buildPlaceholderSvg(
  width: number,
  height: number,
  backgroundColor: string,
  textColor: string,
  text: string
): string {
  const fontSize = Math.max(12, Math.min(72, Math.min(width, height) / 10));
  const label = escapeXml(text.trim() || `${width}x${height}`);
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">`,
    `  <rect width="100%" height="100%" fill="${backgroundColor}"/>`,
    `  <text x="50%" y="50%" dominant-baseline="central" text-anchor="middle" font-family="system-ui, -apple-system, sans-serif" font-size="${fontSize}" fill="${textColor}">${label}</text>`,
    `</svg>`,
  ].join('\n');
}

function svgToDataUrl(svg: string): string {
  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function clampDimension(value: number, fallback: number): number {
  if (!Number.isFinite(value) || value <= 0) return fallback;
  return Math.min(2000, Math.max(10, Math.round(value)));
}

const PlaceholderImageGenerator: React.FC<ToolComponentProps> = () => {
  const [width, setWidth] = useState(800);
  const [height, setHeight] = useState(600);
  const [backgroundColor, setBackgroundColor] = useState('#3b82f6');
  const [textColor, setTextColor] = useState('#ffffff');
  const [text, setText] = useState('');

  const safeWidth = clampDimension(width, 800);
  const safeHeight = clampDimension(height, 600);

  const svg = useMemo(
    () => buildPlaceholderSvg(safeWidth, safeHeight, backgroundColor, textColor, text),
    [safeWidth, safeHeight, backgroundColor, textColor, text]
  );
  const dataUrl = useMemo(() => svgToDataUrl(svg), [svg]);

  const numberClasses =
    'border-border bg-background text-foreground focus-visible:ring-primary rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none';
  const labelClasses = 'text-muted-foreground block text-xs font-semibold tracking-wider uppercase';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ImageIcon className="h-6 w-6" aria-hidden="true" />}
        title="Placeholder image generator"
        description="Generate SVG placeholder images with your own dimensions, colors, and label — copy the data URL or download the SVG."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="placeholder-width" className={labelClasses}>
              Width
            </label>
            <input
              id="placeholder-width"
              type="number"
              min={10}
              max={2000}
              value={width}
              onChange={(event) => setWidth(Number(event.target.value))}
              className={numberClasses}
            />
            <span className="text-muted-foreground ml-2 text-xs">px</span>
          </div>
          <div>
            <label htmlFor="placeholder-height" className={labelClasses}>
              Height
            </label>
            <input
              id="placeholder-height"
              type="number"
              min={10}
              max={2000}
              value={height}
              onChange={(event) => setHeight(Number(event.target.value))}
              className={numberClasses}
            />
            <span className="text-muted-foreground ml-2 text-xs">px</span>
          </div>
          <div>
            <label htmlFor="placeholder-bg" className={labelClasses}>
              Background color
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="placeholder-bg"
                type="color"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="h-9 w-14 cursor-pointer rounded-lg border"
              />
              <input
                type="text"
                value={backgroundColor}
                onChange={(event) => setBackgroundColor(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-28 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                spellCheck={false}
              />
            </div>
          </div>
          <div>
            <label htmlFor="placeholder-textcolor" className={labelClasses}>
              Text color
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="placeholder-textcolor"
                type="color"
                value={textColor}
                onChange={(event) => setTextColor(event.target.value)}
                className="h-9 w-14 cursor-pointer rounded-lg border"
              />
              <input
                type="text"
                value={textColor}
                onChange={(event) => setTextColor(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-28 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                spellCheck={false}
              />
            </div>
          </div>
          <div className="md:col-span-2">
            <label htmlFor="placeholder-text" className={labelClasses}>
              Label
            </label>
            <input
              id="placeholder-text"
              type="text"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder={`Defaults to ${safeWidth}x${safeHeight}`}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Preview
        </p>
        <div className="border-border bg-muted/40 flex items-center justify-center overflow-hidden rounded-lg border p-4">
          <img
            src={dataUrl}
            alt={`${safeWidth}x${safeHeight} placeholder preview`}
            className="max-h-80 max-w-full rounded-lg shadow-sm"
          />
        </div>
      </div>

      <TransformPanel
        inputId="placeholder-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={dataUrl}
        outputLabel="SVG data URL"
        fileName="placeholder.svg"
        toolbar={
          <>
            <CopyButton value={dataUrl} iconOnly size="sm" />
            <DownloadButton
              content={svg}
              fileName="placeholder.svg"
              contentType="image/svg+xml;charset=utf-8"
              label="Download"
              size="sm"
            />
          </>
        }
      />
    </div>
  );
};

PlaceholderImageGenerator.displayName = 'PlaceholderImageGenerator';

export { PlaceholderImageGenerator };
