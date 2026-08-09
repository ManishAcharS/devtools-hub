'use client';

import React, { useMemo, useState } from 'react';
import { GlassWater } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

type GlassMode = 'glassmorphism' | 'neumorphism';

interface GlassOptions {
  transparency: number;
  blur: number;
  borderOpacity: number;
  radius: number;
  highlight: string;
}

const GLASS_MODES: { value: GlassMode; label: string }[] = [
  { value: 'glassmorphism', label: 'Glassmorphism' },
  { value: 'neumorphism', label: 'Neumorphism' },
];

const DEFAULT_GLASS_OPTIONS: GlassOptions = {
  transparency: 80,
  blur: 12,
  borderOpacity: 25,
  radius: 16,
  highlight: '#ffffff',
};

function hexToRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const value =
    clean.length === 3
      ? clean
          .split('')
          .map((c) => c + c)
          .join('')
      : clean;
  const n = parseInt(value, 16);
  if (value.length !== 6 || Number.isNaN(n)) return `rgba(255, 255, 255, ${alpha})`;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
}

function glassBackground(transparency: number, highlight: string): string {
  return hexToRgba(highlight, Math.max(0.05, 1 - transparency / 100));
}

function glassBorder(borderOpacity: number, highlight: string): string {
  return hexToRgba(highlight, Math.min(0.6, borderOpacity / 100));
}

function glassCss(options: GlassOptions): string {
  return [
    '.glass {',
    `  background: ${glassBackground(options.transparency, options.highlight)};`,
    `  backdrop-filter: blur(${options.blur}px);`,
    `  -webkit-backdrop-filter: blur(${options.blur}px);`,
    `  border: 1px solid ${glassBorder(options.borderOpacity, options.highlight)};`,
    `  border-radius: ${options.radius}px;`,
    '}',
  ].join('\n');
}

function neumorphCss(options: GlassOptions): string {
  const offset = Math.max(4, options.blur);
  const darkAlpha = Math.min(0.5, Math.max(0.05, options.transparency / 100 / 2));
  return [
    '.neumorph {',
    `  background: ${hexToRgba(options.highlight, 0.85)};`,
    `  border-radius: ${options.radius}px;`,
    `  box-shadow: ${offset}px ${offset}px ${offset * 2}px rgba(0, 0, 0, ${darkAlpha}),`,
    `              -${offset}px -${offset}px ${offset * 2}px ${hexToRgba(options.highlight, 0.9)};`,
    '}',
  ].join('\n');
}

function styleFor(mode: GlassMode, options: GlassOptions): React.CSSProperties {
  if (mode === 'glassmorphism') {
    return {
      background: glassBackground(options.transparency, options.highlight),
      backdropFilter: `blur(${options.blur}px)`,
      WebkitBackdropFilter: `blur(${options.blur}px)`,
      border: `1px solid ${glassBorder(options.borderOpacity, options.highlight)}`,
      borderRadius: options.radius,
    };
  }
  const offset = Math.max(4, options.blur);
  return {
    background: hexToRgba(options.highlight, 0.85),
    borderRadius: options.radius,
    boxShadow: `${offset}px ${offset}px ${offset * 2}px rgba(0, 0, 0, ${Math.max(
      0.05,
      Math.min(0.5, options.transparency / 100 / 2)
    )}), -${offset}px -${offset}px ${offset * 2}px ${hexToRgba(options.highlight, 0.9)}`,
  };
}

const GlassmorphismGenerator: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<GlassMode>('glassmorphism');
  const [options, setOptions] = useState<GlassOptions>(DEFAULT_GLASS_OPTIONS);

  const update = (field: keyof GlassOptions, value: number | string) => {
    setOptions((prev) => ({ ...prev, [field]: value }));
  };

  const css = useMemo(
    () => (mode === 'glassmorphism' ? glassCss(options) : neumorphCss(options)),
    [mode, options]
  );
  const previewStyle = useMemo(() => styleFor(mode, options), [mode, options]);

  const labelClasses = 'text-muted-foreground block text-xs font-semibold tracking-wider uppercase';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<GlassWater className="h-6 w-6" aria-hidden="true" />}
        title="Glassmorphism generator"
        description="Craft glassmorphism and neumorphism surfaces with transparency, blur, and border controls — preview on a gradient and copy the CSS."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Style
        </p>
        <div className="flex flex-wrap gap-2">
          {GLASS_MODES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              aria-pressed={mode === option.value}
              className={cn(
                'rounded-lg border px-3 py-1.5 text-sm font-medium transition-colors',
                mode === option.value
                  ? 'border-primary bg-primary text-primary-foreground'
                  : 'border-border bg-background text-muted-foreground hover:text-foreground'
              )}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-x-6 gap-y-4 sm:grid-cols-2">
          <div>
            <label htmlFor="glass-transparency" className={labelClasses}>
              {mode === 'glassmorphism' ? 'Transparency' : 'Shadow depth'}
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="glass-transparency"
                type="range"
                min={10}
                max={95}
                value={options.transparency}
                onChange={(event) => update('transparency', Number(event.target.value))}
                className="flex-1"
              />
              <span className="text-muted-foreground w-10 text-right font-mono text-xs">
                {options.transparency}%
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="glass-blur" className={labelClasses}>
              Blur
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="glass-blur"
                type="range"
                min={0}
                max={40}
                value={options.blur}
                onChange={(event) => update('blur', Number(event.target.value))}
                className="flex-1"
              />
              <span className="text-muted-foreground w-10 text-right font-mono text-xs">
                {options.blur}px
              </span>
            </div>
          </div>
          {mode === 'glassmorphism' && (
            <div>
              <label htmlFor="glass-border" className={labelClasses}>
                Border opacity
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id="glass-border"
                  type="range"
                  min={0}
                  max={60}
                  value={options.borderOpacity}
                  onChange={(event) => update('borderOpacity', Number(event.target.value))}
                  className="flex-1"
                />
                <span className="text-muted-foreground w-10 text-right font-mono text-xs">
                  {options.borderOpacity}%
                </span>
              </div>
            </div>
          )}
          <div>
            <label htmlFor="glass-radius" className={labelClasses}>
              Radius
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="glass-radius"
                type="range"
                min={0}
                max={40}
                value={options.radius}
                onChange={(event) => update('radius', Number(event.target.value))}
                className="flex-1"
              />
              <span className="text-muted-foreground w-10 text-right font-mono text-xs">
                {options.radius}px
              </span>
            </div>
          </div>
          <div>
            <label htmlFor="glass-highlight" className={labelClasses}>
              {mode === 'glassmorphism' ? 'Tint color' : 'Highlight color'}
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="glass-highlight"
                type="color"
                value={options.highlight}
                onChange={(event) => update('highlight', event.target.value)}
                className="h-9 w-14 cursor-pointer rounded-lg border"
              />
              <input
                type="text"
                value={options.highlight}
                onChange={(event) => update('highlight', event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-28 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
                spellCheck={false}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
          Preview
        </p>
        <div
          className="flex h-64 items-center justify-center rounded-lg"
          style={
            mode === 'glassmorphism'
              ? { background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)' }
              : { background: '#e2e8f0' }
          }
        >
          <div
            className="flex h-40 w-40 items-center justify-center p-4 text-center text-sm font-semibold"
            style={previewStyle}
          >
            {mode === 'glassmorphism' ? 'Glass surface' : 'Neumorphic surface'}
          </div>
        </div>
      </div>

      <TransformPanel
        inputId="glass-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={css}
        outputLabel="CSS"
        fileName="glassmorphism.css"
        toolbar={
          <>
            <CopyButton value={css} iconOnly size="sm" />
            <DownloadButton
              content={css}
              fileName="glassmorphism.css"
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

GlassmorphismGenerator.displayName = 'GlassmorphismGenerator';

export { GlassmorphismGenerator };
