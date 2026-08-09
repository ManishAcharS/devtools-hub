'use client';

import React, { useMemo, useState } from 'react';
import { Palette, Minus, Plus, Copy, Download } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  gradientToCss,
  DEFAULT_GRADIENT_STOPS,
  type GradientStop,
  type GradientOptions,
} from '@/lib/tools/css';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

const GradientGenerator: React.FC<ToolComponentProps> = () => {
  const [type, setType] = useState<GradientOptions['type']>('linear');
  const [angle, setAngle] = useState(90);
  const [stops, setStops] = useState<GradientStop[]>(DEFAULT_GRADIENT_STOPS);

  const options: GradientOptions = { type, angle, stops };
  const css = useMemo(() => gradientToCss(options), [options]);

  const updateStop = (index: number, field: 'color' | 'position', value: string | number) => {
    setStops((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: field === 'color' ? value : Number(value) };
      return next.sort((a, b) => a.position - b.position);
    });
  };

  const addStop = () => {
    const positions = stops.map((s) => s.position).sort((a, b) => a - b);
    const newPos = positions.length > 1 ? (positions[positions.length - 1] + positions[0]) / 2 : 50;
    setStops((prev) =>
      [...prev, { color: '#3b82f6', position: newPos }].sort((a, b) => a.position - b.position)
    );
  };

  const removeStop = (index: number) => {
    if (stops.length <= 2) return;
    setStops((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Palette className="h-6 w-6" aria-hidden="true" />}
        title="CSS gradient generator"
        description="Create linear, radial, and conic gradients with multiple color stops. Copy the CSS or download as a .css snippet."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center gap-4">
          <div className="flex items-center gap-2">
            <label className="text-muted-foreground text-xs">Type</label>
            {(['linear', 'radial', 'conic'] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => setType(t)}
                aria-pressed={type === t}
                className={cn(
                  'inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  type === t
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                )}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
          {type !== 'radial' && (
            <div className="flex items-center gap-2">
              <label className="text-muted-foreground text-xs">Angle</label>
              <input
                type="number"
                min={0}
                max={359}
                value={angle}
                onChange={(event) => setAngle(Number(event.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-20 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">deg</span>
            </div>
          )}
          <button
            type="button"
            onClick={addStop}
            disabled={stops.length >= 10}
            className="text-muted-foreground hover:text-foreground ml-auto inline-flex items-center gap-1.5 text-xs font-medium disabled:opacity-50"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add stop
          </button>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Color stops
          </p>
          <p className="text-muted-foreground text-xs">{stops.length} stops</p>
        </div>
        <div className="space-y-3">
          {stops.map((stop, index) => (
            <div key={index} className="flex flex-wrap items-center gap-3">
              <input
                type="color"
                value={stop.color}
                onChange={(event) => updateStop(index, 'color', event.target.value)}
                className="h-8 w-12 cursor-pointer rounded-lg border"
                aria-label={`Stop ${index + 1} color`}
              />
              <div className="flex flex-1 items-center gap-2">
                <label className="text-muted-foreground text-xs">Position</label>
                <input
                  type="range"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(event) => updateStop(index, 'position', event.target.value)}
                  className="flex-1"
                />
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={stop.position}
                  onChange={(event) => updateStop(index, 'position', Number(event.target.value))}
                  className="border-border bg-background text-foreground focus-visible:ring-primary w-16 rounded-lg border px-2 py-1.5 text-right font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
                <span className="text-muted-foreground text-xs">%</span>
              </div>
              {stops.length > 2 && (
                <button
                  type="button"
                  onClick={() => removeStop(index)}
                  className="text-muted-foreground hover:text-red-500"
                  aria-label={`Remove stop ${index + 1}`}
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div
        className="overflow-hidden rounded-xl border"
        style={{ background: css, minHeight: 120 }}
        aria-label="Gradient preview"
      />

      <TransformPanel
        inputId="gradient-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="gradient.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="gradient.css"
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

GradientGenerator.displayName = 'GradientGenerator';

export { GradientGenerator };
