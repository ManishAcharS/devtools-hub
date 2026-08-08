'use client';

import React, { useMemo, useState } from 'react';
import { Copy, Dices, PaintBucket } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generatePalette, randomColor, type PaletteResult } from '@/lib/tools/color';
import { SectionHeading } from '@/components/shared/section-heading';

const ColorPaletteGenerator: React.FC<ToolComponentProps> = () => {
  const [baseColor, setBaseColor] = useState('#6366f1');
  const [shades, setShades] = useState(10);
  const [seed, setSeed] = useState(42);
  const [palette, setPalette] = useState<PaletteResult | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const paletteMemo = useMemo(() => palette, [palette]);

  const applyBase = (color: string, count: number, randomSeed: number): void => {
    setPalette(generatePalette(color, count, randomSeed));
  };

  const regenerate = (): void => {
    const nextSeed = Math.floor(Math.random() * 1_000_000);
    setSeed(nextSeed);
    applyBase(baseColor, shades, nextSeed);
  };

  const copyColor = async (color: string, index: number): Promise<void> => {
    await navigator.clipboard.writeText(color);
    setCopiedIndex(index);
    window.setTimeout(() => setCopiedIndex(null), 1500);
  };

  const paletteToCopy = paletteMemo?.colors.map((color) => color.hex).join('\n') ?? '';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<PaintBucket className="h-6 w-6" aria-hidden="true" />}
        title="Color palette generator"
        description="Generate an harmonious palette of shades, tints, and accents from a single base color."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end gap-4">
          <div>
            <label
              htmlFor="palette-base-color"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Base color
            </label>
            <div className="mt-2 flex items-center gap-2">
              <input
                id="palette-base-color"
                type="color"
                value={baseColor}
                onChange={(event) => {
                  const next = event.target.value;
                  setBaseColor(next);
                  applyBase(next, shades, seed);
                }}
                className="border-border bg-background h-10 w-12 cursor-pointer rounded-lg border"
              />
              <input
                type="text"
                value={baseColor}
                onChange={(event) => {
                  const next = event.target.value;
                  setBaseColor(next);
                  applyBase(next, shades, seed);
                }}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground w-28 rounded-lg border px-3 py-2 font-mono text-sm"
                spellCheck={false}
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="palette-shades"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Shades ({shades})
            </label>
            <input
              id="palette-shades"
              type="range"
              min={5}
              max={20}
              value={shades}
              onChange={(event) => {
                const next = Number(event.target.value);
                setShades(next);
                applyBase(baseColor, next, seed);
              }}
              className="accent-primary mt-3 w-44"
            />
          </div>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={regenerate}
              className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
            >
              <Dices className="h-4 w-4" aria-hidden="true" />
              Randomize
            </button>
          </div>
        </div>
      </div>

      {paletteMemo !== null && (
        <>
          <div className="border-border overflow-hidden rounded-xl border">
            <div className="grid grid-cols-1 gap-px sm:grid-cols-2 lg:grid-cols-3">
              {paletteMemo.colors.map((color, index) => (
                <button
                  key={`${color.hex}-${index}`}
                  type="button"
                  onClick={() => copyColor(color.hex, index)}
                  className="hover:ring-primary group flex items-center justify-between gap-2 px-4 py-6 transition-shadow focus-visible:ring-2 focus-visible:outline-none"
                  style={{ backgroundColor: color.hex }}
                  title={`Copy ${color.hex}`}
                >
                  <div className="min-w-0 text-left">
                    <p
                      className="font-mono text-sm font-semibold break-all"
                      style={{ color: color.contrastText }}
                    >
                      {color.hex}
                    </p>
                    <p
                      className="truncate font-mono text-xs"
                      style={{ color: `${color.contrastText}aa` }}
                    >
                      rgb({color.rgb[0]}, {color.rgb[1]}, {color.rgb[2]})
                    </p>
                  </div>
                  <Copy
                    className="shrink-0 opacity-0 transition-opacity group-hover:opacity-100"
                    style={{ color: color.contrastText }}
                    aria-hidden="true"
                  />
                  {copiedIndex === index && (
                    <span
                      className="rounded bg-black/20 px-1.5 py-0.5 text-xs font-medium"
                      style={{ color: color.contrastText }}
                    >
                      Copied
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => copyColor(paletteToCopy, -1)}
              className="border-border text-foreground hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
            >
              <Copy className="h-4 w-4" aria-hidden="true" />
              Copy all hex codes
            </button>
            <button
              type="button"
              onClick={() => {
                const next = randomColor();
                setBaseColor(next);
                applyBase(next, shades, seed);
              }}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm font-medium transition-colors"
            >
              <Dices className="h-4 w-4" aria-hidden="true" />
              Random base color
            </button>
          </div>
          <p className="text-muted-foreground text-xs">
            Seed: {seed} — regenerate or tweak the base to explore other variations.
          </p>
        </>
      )}
    </div>
  );
};

ColorPaletteGenerator.displayName = 'ColorPaletteGenerator';

export { ColorPaletteGenerator };
