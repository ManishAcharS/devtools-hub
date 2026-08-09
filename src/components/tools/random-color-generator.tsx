'use client';

import React, { useMemo, useState } from 'react';
import { Palette, Shuffle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface GeneratedColor {
  hex: string;
  rgb: string;
  hsl: string;
}

function randomHslValues(): [number, number, number] {
  let bytes = new Uint32Array(3);
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    bytes = crypto.getRandomValues(bytes);
  } else {
    bytes = new Uint32Array([
      Math.floor(Math.random() * 4294967296),
      Math.floor(Math.random() * 4294967296),
      Math.floor(Math.random() * 4294967296),
    ]);
  }
  const h = (bytes[0] % 360) / 360;
  const s = 0.5 + (bytes[1] % 51) / 100;
  const l = 0.45 + (bytes[2] % 31) / 100;
  return [h, s, l];
}

function hslToRgb(h: number, s: number, l: number): [number, number, number] {
  const hue = h * 360;
  const c = (1 - Math.abs(2 * l - 1)) * s;
  const x = c * (1 - Math.abs(((hue / 60) % 2) - 1));
  const m = l - c / 2;
  let r = 0;
  let g = 0;
  let b = 0;
  if (hue < 60) [r, g, b] = [c, x, 0];
  else if (hue < 120) [r, g, b] = [x, c, 0];
  else if (hue < 180) [r, g, b] = [0, c, x];
  else if (hue < 240) [r, g, b] = [0, x, c];
  else if (hue < 300) [r, g, b] = [x, 0, c];
  else [r, g, b] = [c, 0, x];
  return [Math.round((r + m) * 255), Math.round((g + m) * 255), Math.round((b + m) * 255)];
}

function makeColor(h: number, s: number, l: number): GeneratedColor {
  const [r, g, b] = hslToRgb(h, s, l);
  const hex = `#${[r, g, b].map((value) => value.toString(16).padStart(2, '0')).join('')}`;
  return {
    hex,
    rgb: `rgb(${r}, ${g}, ${b})`,
    hsl: `hsl(${Math.round(h * 360)}, ${Math.round(s * 100)}%, ${Math.round(l * 100)}%)`,
  };
}

function generateColors(count: number): GeneratedColor[] {
  return Array.from({ length: count }, () => {
    const [h, s, l] = randomHslValues();
    return makeColor(h, s, l);
  });
}

const RandomColorGenerator: React.FC<ToolComponentProps> = () => {
  const [paletteMode, setPaletteMode] = useState(false);
  const [colors, setColors] = useState<GeneratedColor[]>(() => generateColors(1));

  const handleGenerate = () => {
    setColors(generateColors(paletteMode ? 5 : 1));
  };

  const allFormats = useMemo(
    () => colors.map((color) => [color.hex, color.rgb, color.hsl]).flat(),
    [colors]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Palette className="h-6 w-6" aria-hidden="true" />}
        title="Random color generator"
        description="Generate random colors using cryptographic randomness, shown in hex, rgb(), and hsl() — with one-click copying and a 5-color palette mode."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={paletteMode}
              onChange={(event) => setPaletteMode(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Generate a 5-color palette
          </label>
          <button
            type="button"
            onClick={handleGenerate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Generate
          </button>
        </div>
      </div>

      <div className={cn('grid gap-4', paletteMode ? 'md:grid-cols-5' : 'md:grid-cols-2')}>
        {colors.map((color, index) => (
          <div
            key={`${color.hex}-${index}`}
            className="border-border bg-card overflow-hidden rounded-xl border"
          >
            <div
              className="flex h-32 items-end justify-end p-2"
              style={{ backgroundColor: color.hex }}
            >
              <span className="rounded-md bg-black/30 px-2 py-1 font-mono text-xs text-white">
                {color.hex}
              </span>
            </div>
            <div className="space-y-2 p-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-foreground font-mono text-sm">{color.hex}</span>
                <CopyButton value={color.hex} iconOnly size="sm" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-mono text-xs">{color.rgb}</span>
                <CopyButton value={color.rgb} iconOnly size="sm" />
              </div>
              <div className="flex items-center justify-between gap-2">
                <span className="text-muted-foreground font-mono text-xs">{color.hsl}</span>
                <CopyButton value={color.hsl} iconOnly size="sm" />
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            All formats
          </p>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton
              value={allFormats.join('\n')}
              size="sm"
              disabled={allFormats.length === 0}
            />
          </div>
        </div>
        <pre className="bg-muted text-foreground mt-3 max-h-48 overflow-auto rounded-lg px-4 py-3 font-mono text-xs whitespace-pre-wrap">
          {allFormats.join('\n') || 'Generate a color to see its formats here…'}
        </pre>
      </div>
    </div>
  );
};

RandomColorGenerator.displayName = 'RandomColorGenerator';

export { RandomColorGenerator };
