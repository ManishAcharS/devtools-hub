'use client';

import React, { useMemo, useState } from 'react';
import { Ratio } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { parseRatioInput, scaleToHeight, scaleToWidth, simplifyRatio } from '@/lib/tools/ratio';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

function formatDimension(value: number): string {
  const rounded = Math.round(value * 100) / 100;
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 2 }).format(rounded);
}

const AspectRatioCalculator: React.FC<ToolComponentProps> = () => {
  const [ratioValue, setRatioValue] = useState('16:9');
  const [widthValue, setWidthValue] = useState('1920');
  const [heightValue, setHeightValue] = useState('1080');
  const [newWidthValue, setNewWidthValue] = useState('');
  const [newHeightValue, setNewHeightValue] = useState('');

  const ratio = useMemo(() => {
    if (ratioValue.trim().length === 0) return null;
    return parseRatioInput(ratioValue);
  }, [ratioValue]);

  const dimensions = useMemo(() => {
    const width = Number(widthValue.trim());
    const height = Number(heightValue.trim());
    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      return null;
    }
    return { width, height };
  }, [widthValue, heightValue]);

  const simplified = useMemo(
    () => (dimensions ? simplifyRatio(dimensions.width, dimensions.height) : null),
    [dimensions]
  );

  const newWidth = useMemo(() => {
    const parsed = Number(newWidthValue.trim());
    if (!dimensions || !Number.isFinite(parsed) || parsed <= 0) return null;
    return scaleToWidth(dimensions.width, dimensions.height, parsed);
  }, [dimensions, newWidthValue]);

  const newHeight = useMemo(() => {
    const parsed = Number(newHeightValue.trim());
    if (!dimensions || !Number.isFinite(parsed) || parsed <= 0) return null;
    return scaleToHeight(dimensions.width, dimensions.height, parsed);
  }, [dimensions, newHeightValue]);

  const derived = useMemo(() => {
    if (newWidth !== null && newHeight === null) {
      return `${formatDimension(Number(newWidthValue.trim()))} \u00d7 ${formatDimension(newWidth)}`;
    }
    if (newWidth === null && newHeight !== null) {
      return `${formatDimension(newHeight)} \u00d7 ${formatDimension(Number(newHeightValue.trim()))}`;
    }
    if (newWidth !== null && newHeight !== null) {
      return `${formatDimension(Number(newWidthValue.trim()))} \u00d7 ${formatDimension(Number(newHeightValue.trim()))}`;
    }
    return null;
  }, [newWidth, newHeight, newWidthValue, newHeightValue]);

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Ratio className="h-6 w-6" aria-hidden="true" />}
        title="Aspect ratio calculator"
        description="Reduce any width and height to its simplest ratio and derive missing dimensions that keep the ratio intact."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label
              htmlFor="ratio-width"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Width
            </label>
            <input
              id="ratio-width"
              type="text"
              inputMode="decimal"
              value={widthValue}
              onChange={(event) => setWidthValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="ratio-height"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Height
            </label>
            <input
              id="ratio-height"
              type="text"
              inputMode="decimal"
              value={heightValue}
              onChange={(event) => setHeightValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="ratio-input"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Or ratio (e.g. 16:9)
            </label>
            <input
              id="ratio-input"
              type="text"
              value={ratioValue}
              onChange={(event) => setRatioValue(event.target.value)}
              placeholder="16:9"
              className={inputClass}
            />
          </div>
        </div>

        <div className="border-border bg-background mt-6 rounded-lg border p-5 text-center">
          {dimensions && simplified ? (
            <>
              <p className="text-3xl font-bold">
                {simplified.width}:{simplified.height}
              </p>
              <p className="text-muted-foreground mt-1 text-sm">
                {formatDimension(dimensions.width)} × {formatDimension(dimensions.height)} reduces
                to {simplified.width}:{simplified.height}
              </p>
            </>
          ) : (
            <p className="text-muted-foreground text-sm">Enter positive width and height values.</p>
          )}
          {ratio && (
            <p className="text-muted-foreground mt-1 text-sm">
              Ratio input: {ratio.width}:{ratio.height} ={' '}
              {formatDimension(ratio.width / ratio.height)}:1
            </p>
          )}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Derive dimensions
        </p>
        <div className="mt-3 grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="ratio-new-width"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              New width
            </label>
            <input
              id="ratio-new-width"
              type="text"
              inputMode="decimal"
              value={newWidthValue}
              onChange={(event) => setNewWidthValue(event.target.value)}
              placeholder={dimensions ? `e.g. ${Math.round(dimensions.width * 2)}` : 'e.g. 3840'}
              className={inputClass}
            />
            {newWidth !== null && (
              <p className="mt-2 text-sm">
                Height ={' '}
                <span className="font-mono font-semibold">{formatDimension(newWidth)}px</span>
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="ratio-new-height"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              New height
            </label>
            <input
              id="ratio-new-height"
              type="text"
              inputMode="decimal"
              value={newHeightValue}
              onChange={(event) => setNewHeightValue(event.target.value)}
              placeholder={dimensions ? `e.g. ${Math.round(dimensions.height / 2)}` : 'e.g. 540'}
              className={inputClass}
            />
            {newHeight !== null && (
              <p className="mt-2 text-sm">
                Width ={' '}
                <span className="font-mono font-semibold">{formatDimension(newHeight)}px</span>
              </p>
            )}
          </div>
        </div>
        {(newWidth !== null || newHeight !== null) && derived && (
          <div className="border-border bg-background mt-4 flex items-center justify-between gap-3 rounded-lg border px-4 py-3">
            <p className="font-mono text-sm">{derived}</p>
            <CopyButton value={derived} label="Copy" size="sm" iconOnly />
          </div>
        )}
      </div>
    </div>
  );
};

AspectRatioCalculator.displayName = 'AspectRatioCalculator';

export { AspectRatioCalculator };
