'use client';

import React, { useMemo, useState } from 'react';
import { Contrast } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { computeContrastRatio, hexToRgb, type RgbTuple } from '@/lib/tools/color';
import { SectionHeading } from '@/components/shared/section-heading';

const FALLBACK_WHITE: RgbTuple = [255, 255, 255];
const FALLBACK_BLACK: RgbTuple = [0, 0, 0];
const MAX_RATIO = 21;

const ColorContrastChecker: React.FC<ToolComponentProps> = () => {
  const [background, setBackground] = useState('#ffffff');
  const [foreground, setForeground] = useState('#000000');

  const ratio = useMemo(
    () =>
      computeContrastRatio(
        hexToRgb(background) ?? FALLBACK_WHITE,
        hexToRgb(foreground) ?? FALLBACK_BLACK
      ),
    [background, foreground]
  );

  const rating: string | null = useMemo(() => {
    if (ratio >= 4.5) return 'AA';
    if (ratio >= 3) return 'Large text only (AA)';
    if (ratio >= 1.5) return 'Low';
    return 'Very low';
  }, [ratio]);

  const swatches: { id: string; label: string; value: string; setter: (value: string) => void }[] =
    [
      { id: 'contrast-bg', label: 'Background', value: background, setter: setBackground },
      { id: 'contrast-fg', label: 'Foreground', value: foreground, setter: setForeground },
    ];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Contrast className="h-6 w-6" aria-hidden="true" />}
        title="Color contrast checker"
        description="Measure the WCAG contrast ratio between two colors and see whether your text meets accessibility guidelines."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          {swatches.map((swatch) => (
            <div key={swatch.id}>
              <label
                htmlFor={swatch.id}
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                {swatch.label}
              </label>
              <div className="mt-2 flex items-center gap-2">
                <input
                  id={swatch.id}
                  type="color"
                  value={swatch.value}
                  onChange={(event) => swatch.setter(event.target.value)}
                  className="border-border bg-background h-10 w-12 cursor-pointer rounded-lg border"
                />
                <input
                  type="text"
                  value={swatch.value}
                  onChange={(event) => swatch.setter(event.target.value)}
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground w-28 rounded-lg border px-3 py-2 font-mono text-sm"
                  spellCheck={false}
                />
              </div>
            </div>
          ))}
        </div>

        <div
          className="border-border mt-5 flex h-28 items-center justify-center rounded-xl border text-lg font-semibold"
          style={{ backgroundColor: background, color: foreground }}
        >
          The quick brown fox
        </div>
        <p className="text-muted-foreground mt-2 text-xs">
          {hexToRgb(background) !== null && hexToRgb(foreground) !== null
            ? 'Live preview using your two colors.'
            : 'Enter a valid hex color for both fields to see the live preview.'}
        </p>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Contrast ratio
          </p>
          <p className="text-foreground mt-1 font-mono text-4xl font-bold">
            {ratio.toFixed(2)}
            <span className="text-muted-foreground text-xl font-normal">:1</span>
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            Maximum is {MAX_RATIO}:1 (black on white).
          </p>
        </div>
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            WCAG rating
          </p>
          <p
            className={cn(
              'mt-1 font-mono text-4xl font-bold',
              rating === 'AA'
                ? 'text-emerald-600 dark:text-emerald-400'
                : 'text-amber-600 dark:text-amber-400'
            )}
          >
            {rating}
          </p>
          <p className="text-muted-foreground mt-2 text-xs">
            {rating === 'AA'
              ? 'Meets the AA standard for normal text (4.5:1).'
              : 'Falls short of the 4.5:1 minimum — consider darker text or a lighter background.'}
          </p>
        </div>
      </div>
    </div>
  );
};

ColorContrastChecker.displayName = 'ColorContrastChecker';

export { ColorContrastChecker };
