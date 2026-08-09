'use client';

import React, { useMemo, useState } from 'react';
import { Waves } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

interface SizePreset {
  label: string;
  width: number;
  height: number;
}

const SIZE_PRESETS: SizePreset[] = [
  { label: 'Compact', width: 800, height: 200 },
  { label: 'Wide', width: 1440, height: 320 },
  { label: 'Hero', width: 1600, height: 480 },
];

const DEFAULT_COLORS = ['#6366f1', '#8b5cf6', '#ec4899'];

const WAVE_SEGMENTS = 16;

function wavePath(
  width: number,
  height: number,
  amplitude: number,
  frequency: number,
  layer: number,
  layers: number
): string {
  const amp = amplitude * (1 - layer * 0.25);
  const phase = layer * Math.PI * 0.5;
  const baseline = height - 30 - (layer + 1) * ((height - 60) / layers);
  const points: { x: number; y: number }[] = [];
  for (let i = 0; i <= WAVE_SEGMENTS; i += 1) {
    const x = (i / WAVE_SEGMENTS) * width;
    const y = Math.min(
      baseline,
      Math.max(0, baseline - amp * Math.sin((i / WAVE_SEGMENTS) * Math.PI * 2 * frequency + phase))
    );
    points.push({ x, y });
  }
  let d = `M ${Math.round(points[0].x * 10) / 10} ${Math.round(points[0].y * 10) / 10}`;
  for (let i = 1; i < points.length; i += 1) {
    const prev = points[i - 1];
    const curr = points[i];
    const midX = Math.round(((prev.x + curr.x) / 2) * 10) / 10;
    d += ` C ${midX} ${Math.round(prev.y * 10) / 10}, ${midX} ${Math.round(curr.y * 10) / 10}, ${Math.round(curr.x * 10) / 10} ${Math.round(curr.y * 10) / 10}`;
  }
  d += ` L ${width} ${baseline} L 0 ${baseline} Z`;
  return d;
}

function buildWaveSvg(
  width: number,
  height: number,
  layers: number,
  amplitude: number,
  frequency: number,
  colors: string[],
  flipped: boolean
): string {
  const paths: string[] = [];
  for (let layer = layers - 1; layer >= 0; layer -= 1) {
    paths.push(
      `<path fill="${colors[layer] ?? '#6366f1'}" d="${wavePath(width, height, amplitude, frequency, layer, layers)}"/>`
    );
  }
  const inner = paths.join('\n  ');
  const body = flipped
    ? `<g transform="translate(0, ${height}) scale(1, -1)">\n  ${inner}\n  </g>`
    : inner;
  return [
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" preserveAspectRatio="none" aria-hidden="true">`,
    `  ${body}`,
    `</svg>`,
  ].join('\n');
}

function svgToDataUrl(svg: string): string {
  return `url("data:image/svg+xml,${encodeURIComponent(svg)}")`;
}

const SvgWaveGenerator: React.FC<ToolComponentProps> = () => {
  const [presetIndex, setPresetIndex] = useState(1);
  const [layers, setLayers] = useState(2);
  const [amplitude, setAmplitude] = useState(60);
  const [frequency, setFrequency] = useState(3);
  const [colors, setColors] = useState<string[]>(DEFAULT_COLORS);
  const [flipped, setFlipped] = useState(false);
  const [outputMode, setOutputMode] = useState<'svg' | 'data'>('svg');

  const preset = SIZE_PRESETS[presetIndex];
  const { width, height } = preset;

  const svg = useMemo(
    () => buildWaveSvg(width, height, layers, amplitude, frequency, colors, flipped),
    [width, height, layers, amplitude, frequency, colors, flipped]
  );
  const output = useMemo(() => (outputMode === 'svg' ? svg : svgToDataUrl(svg)), [outputMode, svg]);

  const paths = useMemo(() => {
    const elements = [];
    for (let layer = layers - 1; layer >= 0; layer -= 1) {
      elements.push(
        <path
          key={layer}
          fill={colors[layer] ?? '#6366f1'}
          d={wavePath(width, height, amplitude, frequency, layer, layers)}
        />
      );
    }
    return elements;
  }, [width, height, layers, amplitude, frequency, colors]);

  const updateColor = (index: number, value: string) => {
    setColors((prev) => {
      const next = [...prev];
      next[index] = value;
      return next;
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Waves className="h-6 w-6" aria-hidden="true" />}
        title="SVG wave generator"
        description="Build multi-layer SVG wave dividers with amplitude, frequency, colors, and flip controls — copy the markup or use it as a CSS background."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Size preset
        </p>
        <div className="flex flex-wrap gap-2">
          {SIZE_PRESETS.map((option, index) => (
            <button
              key={option.label}
              type="button"
              onClick={() => setPresetIndex(index)}
              aria-pressed={presetIndex === index}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                presetIndex === index
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label} {option.width}×{option.height}
            </button>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="wave-layers"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Layers
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="wave-layers"
                type="range"
                min={1}
                max={3}
                value={layers}
                onChange={(event) => setLayers(Number(event.target.value))}
                className="flex-1"
              />
              <span className="text-muted-foreground w-8 text-right font-mono text-xs">
                {layers}
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="wave-amplitude"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Amplitude
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="wave-amplitude"
                type="range"
                min={10}
                max={120}
                value={amplitude}
                onChange={(event) => setAmplitude(Number(event.target.value))}
                className="flex-1"
              />
              <span className="text-muted-foreground w-8 text-right font-mono text-xs">
                {amplitude}
              </span>
            </div>
          </div>
          <div>
            <label
              htmlFor="wave-frequency"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Frequency
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="wave-frequency"
                type="range"
                min={1}
                max={8}
                step={0.5}
                value={frequency}
                onChange={(event) => setFrequency(Number(event.target.value))}
                className="flex-1"
              />
              <span className="text-muted-foreground w-8 text-right font-mono text-xs">
                {frequency}
              </span>
            </div>
          </div>
          <div>
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Flip
            </label>
            <label className="mt-3 flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={flipped}
                onChange={(event) => setFlipped(event.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Flip vertically
            </label>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Layer colors
        </p>
        <div className="flex flex-wrap gap-4">
          {Array.from({ length: layers }, (_, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="color"
                value={colors[index] ?? DEFAULT_COLORS[index]}
                onChange={(event) => updateColor(index, event.target.value)}
                className="h-9 w-14 cursor-pointer rounded-lg border"
                aria-label={`Layer ${index + 1} color`}
              />
              <span className="text-muted-foreground text-xs">Layer {index + 1}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Preview
        </p>
        <div className="border-border h-56 overflow-hidden rounded-lg border bg-white dark:bg-slate-950">
          <svg
            width="100%"
            height="100%"
            viewBox={`0 0 ${width} ${height}`}
            preserveAspectRatio="none"
            className="block h-full w-full"
            aria-label="Wave preview"
          >
            {flipped ? <g transform={`translate(0, ${height}) scale(1, -1)`}>{paths}</g> : paths}
          </svg>
        </div>
      </div>

      <TransformPanel
        inputId="wave-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel={outputMode === 'svg' ? 'SVG markup' : 'Background data URL'}
        fileName="wave.svg"
        toolbar={
          <>
            <div className="border-border bg-background flex items-center gap-1 rounded-lg border p-0.5">
              {(['svg', 'data'] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setOutputMode(mode)}
                  aria-pressed={outputMode === mode}
                  className={cn(
                    'rounded-md px-2.5 py-1 text-xs font-medium transition-colors',
                    outputMode === mode
                      ? 'bg-primary text-primary-foreground'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  {mode === 'svg' ? 'SVG' : 'Data URL'}
                </button>
              ))}
            </div>
            <CopyButton value={output} iconOnly size="sm" />
            <DownloadButton
              content={svg}
              fileName="wave.svg"
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

SvgWaveGenerator.displayName = 'SvgWaveGenerator';

export { SvgWaveGenerator };
