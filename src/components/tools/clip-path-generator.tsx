'use client';

import React, { useMemo, useState } from 'react';
import { Circle, Copy, Download, Triangle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  clipPathToCss,
  DEFAULT_CLIP_PATH,
  POLYGON_PRESETS,
  type ClipPathOptions,
} from '@/lib/tools/css';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

const ClipPathGenerator: React.FC<ToolComponentProps> = () => {
  const [options, setOptions] = useState<ClipPathOptions>(DEFAULT_CLIP_PATH);

  const css = useMemo(() => clipPathToCss(options), [options]);

  const update = (field: keyof ClipPathOptions, value: number | number[]) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  const updatePolygon = (points: { x: number; y: number }[]) => {
    setOptions((prev) => ({ ...prev, polygonPoints: points }));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Triangle className="h-6 w-6" aria-hidden="true" />}
        title="CSS clip-path generator"
        description="Create polygon, circle, ellipse, and inset clip paths visually with presets and live preview."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Shape type
        </p>
        <div className="flex flex-wrap gap-2">
          {(['polygon', 'circle', 'ellipse', 'inset'] as const).map((type) => (
            <button
              key={type}
              type="button"
              onClick={() => setOptions((prev) => ({ ...prev, type }))}
              aria-pressed={options.type === type}
              className={cn(
                'inline-flex items-center gap-1.5 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                options.type === type
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {options.type === 'polygon' && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Polygon presets
            </p>
            <span className="text-muted-foreground text-xs">
              {options.polygonPoints.length} points
            </span>
          </div>
          <div className="mb-4 flex flex-wrap gap-2">
            {POLYGON_PRESETS.map((preset) => (
              <button
                key={preset.label}
                type="button"
                onClick={() => updatePolygon(preset.points)}
                className="border-border bg-background hover:bg-muted inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
              >
                {preset.label}
              </button>
            ))}
          </div>
          <div className="relative">
            <svg viewBox="0 0 200 200" className="mx-auto h-64 w-64" aria-label="Polygon editor">
              <polygon
                points={options.polygonPoints.map((p) => `${p.x} ${p.y}`).join(',')}
                fill="url(#polyFill)"
                stroke="currentColor"
                strokeWidth="1"
              />
              <defs>
                <linearGradient id="polyFill" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#8b5cf6" stopOpacity="0.3" />
                </linearGradient>
              </defs>
              <g>
                {options.polygonPoints.map((point, index) => (
                  <circle
                    key={index}
                    cx={point.x * 2}
                    cy={point.y * 2}
                    r={8}
                    fill="#3b82f6"
                    stroke="white"
                    strokeWidth={2}
                  />
                ))}
              </g>
            </svg>
          </div>
          <p className="text-muted-foreground mt-2 text-center text-xs">
            Click a preset above. For custom polygons, edit the points below.
          </p>
          <div className="mt-4 space-y-2">
            {options.polygonPoints.map((point, index) => (
              <div key={index} className="flex items-center gap-2">
                <span className="text-muted-foreground w-6 text-center">{index + 1}</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={point.x}
                  onChange={(e) => {
                    const next = [...options.polygonPoints];
                    next[index] = { ...next[index], x: Number(e.target.value) };
                    updatePolygon(next);
                  }}
                  className="border-border bg-background text-foreground focus-visible:ring-primary w-16 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
                <span className="text-muted-foreground text-xs">,</span>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={point.y}
                  onChange={(e) => {
                    const next = [...options.polygonPoints];
                    next[index] = { ...next[index], y: Number(e.target.value) };
                    updatePolygon(next);
                  }}
                  className="border-border bg-background text-foreground focus-visible:ring-primary w-16 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
                <span className="text-muted-foreground text-xs">%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {options.type === 'circle' && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Radius
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.circleRadius}
                onChange={(e) => update('circleRadius', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.circleRadius}
                onChange={(e) => update('circleRadius', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Center X
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.circleCenterX}
                onChange={(e) => update('circleCenterX', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.circleCenterX}
                onChange={(e) => update('circleCenterX', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Center Y
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.circleCenterY}
                onChange={(e) => update('circleCenterY', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.circleCenterY}
                onChange={(e) => update('circleCenterY', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {options.type === 'ellipse' && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="grid gap-4 sm:grid-cols-3">
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Radius X
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.ellipseRadiusX}
                onChange={(e) => update('ellipseRadiusX', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.ellipseRadiusX}
                onChange={(e) => update('ellipseRadiusX', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Radius Y
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.ellipseRadiusY}
                onChange={(e) => update('ellipseRadiusY', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.ellipseRadiusY}
                onChange={(e) => update('ellipseRadiusY', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Center X
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.ellipseCenterX}
                onChange={(e) => update('ellipseCenterX', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.ellipseCenterX}
                onChange={(e) => update('ellipseCenterX', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Center Y
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.ellipseCenterY}
                onChange={(e) => update('ellipseCenterY', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.ellipseCenterY}
                onChange={(e) => update('ellipseCenterY', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {options.type === 'inset' && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
            {(['insetTop', 'insetRight', 'insetBottom', 'insetLeft'] as const).map((key) => (
              <div key={key}>
                <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                  {key.replace('inset', '').toLowerCase()}
                </label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={options[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                  className="mt-2 w-full"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={options[key]}
                  onChange={(e) => update(key, Number(e.target.value))}
                  className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
            ))}
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Border radius
              </label>
              <input
                type="range"
                min={0}
                max={100}
                value={options.insetBorderRadius}
                onChange={(e) => update('insetBorderRadius', Number(e.target.value))}
                className="mt-2 w-full"
              />
              <input
                type="number"
                min={0}
                max={100}
                value={options.insetBorderRadius}
                onChange={(e) => update('insetBorderRadius', Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-full rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Preview
        </p>
        <div
          className="from-primary/20 to-primary/40 mx-auto h-48 w-48 rounded-lg bg-gradient-to-br"
          style={{ clipPath: css }}
          aria-label="Clip path preview"
        />
      </div>

      <TransformPanel
        inputId="clippath-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="clip-path.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="clip-path.css"
              contentType="text/css;charset=utf-8"
              label="Download"
              size="sm"
            />
          </>
        }
      />
    </div>
  );
};

ClipPathGenerator.displayName = 'ClipPathGenerator';

export { ClipPathGenerator };
