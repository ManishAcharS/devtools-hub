'use client';

import React, { useMemo, useState } from 'react';
import { Palette } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { convertColor, detectColorFormats, type ColorResult } from '@/lib/tools/color';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

type ColorFormat = 'hex' | 'hex8' | 'rgb' | 'hsl' | 'hsv';

const FORMAT_LABELS: Record<ColorFormat, string> = {
  hex: 'HEX',
  hex8: 'HEX8',
  rgb: 'RGB',
  hsl: 'HSL',
  hsv: 'HSV',
};

const ColorConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [format, setFormat] = useState<ColorFormat>('hex');

  const result: ColorResult | null = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed.length === 0) return null;
    return convertColor(trimmed, format);
  }, [input, format]);

  const outputs: { key: ColorFormat; label: string; value: string | null }[] = (
    ['hex', 'hex8', 'rgb', 'hsl', 'hsv'] as ColorFormat[]
  ).map((key) => ({
    key,
    label: FORMAT_LABELS[key],
    value: result?.converted[key] ?? null,
  }));

  const palette = result?.palette ?? [];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Palette className="h-6 w-6" aria-hidden="true" />}
        title="Color converter"
        description="Convert colors between HEX, HEX8, RGB, HSL, and HSV formats, with tints, shades, and a contrast preview."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-64 flex-1">
            <label
              htmlFor="color-input"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Color value
            </label>
            <input
              id="color-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="#3366ff"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div className="flex gap-2">
            {(['hex', 'hex8', 'rgb', 'hsl', 'hsv'] as ColorFormat[]).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setFormat(option)}
                className={cn(
                  'rounded-lg border px-2.5 py-2 text-xs font-semibold transition-colors',
                  format === option
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={format === option}
              >
                {FORMAT_LABELS[option]}
              </button>
            ))}
          </div>
        </div>

        {input.trim().length > 0 && result === null && (
          <p className="mt-3 text-sm font-medium text-red-600 dark:text-red-400">
            Could not parse “{input.trim()}”. Try a format like <code>#3366ff</code>,{' '}
            <code>rgb(51, 102, 255)</code>, or <code>hsl(222, 100%, 60%)</code>.
          </p>
        )}

        {result !== null && (
          <>
            <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
              {outputs.map((output) => (
                <div key={output.key} className="border-border rounded-lg border p-3">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {output.label}
                  </p>
                  <p className="text-foreground mt-1 font-mono text-sm break-all">{output.value}</p>
                  <CopyButton
                    value={output.value ?? ''}
                    variant="ghost"
                    size="sm"
                    iconOnly
                    className="mt-2 h-7 w-full px-0"
                    label={`Copy ${output.label}`}
                  />
                </div>
              ))}
            </div>
            <div className="mt-5">
              <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
                Tints & shades
              </p>
              <div className="grid grid-cols-6 gap-1 sm:grid-cols-12">
                {palette.map((swatch) => (
                  <button
                    key={swatch.name}
                    type="button"
                    title={swatch.name}
                    onClick={() => setInput(swatch.hex)}
                    className="hover:ring-primary focus-visible:ring-primary h-10 rounded-md ring-offset-2 transition-all hover:ring-2 focus-visible:ring-2 focus-visible:outline-none"
                    style={{ backgroundColor: swatch.hex }}
                    aria-label={`${swatch.name}: ${swatch.hex}`}
                  />
                ))}
              </div>
            </div>
          </>
        )}

        {input.trim().length > 0 && (
          <p className="text-muted-foreground mt-5 text-xs">
            Detected format: {detectColorFormats(input.trim()).join(', ') || 'unknown'}
          </p>
        )}
      </div>
    </div>
  );
};

ColorConverter.displayName = 'ColorConverter';

export { ColorConverter };
