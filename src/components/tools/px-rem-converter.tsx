'use client';

import React, { useMemo, useState } from 'react';
import { Ruler, ArrowRightLeft, Copy, Download } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { convertPxRem, formatRem, formatPx } from '@/lib/tools/css';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const PxRemConverter: React.FC<ToolComponentProps> = () => {
  const [baseFontSize, setBaseFontSize] = useState(16);
  const [direction, setDirection] = useState<'px-to-rem' | 'rem-to-px'>('px-to-rem');
  const [value, setValue] = useState('16');

  const numericValue = Number(value);
  const result = useMemo(
    () =>
      !Number.isFinite(numericValue)
        ? null
        : convertPxRem({ baseFontSize, value: numericValue, direction }),
    [baseFontSize, direction, numericValue]
  );

  const output = result ? (direction === 'px-to-rem' ? formatRem(result) : formatPx(result)) : '';
  const formula =
    direction === 'px-to-rem'
      ? `${numericValue}px ÷ ${baseFontSize}px = ${output}`
      : `${numericValue}rem × ${baseFontSize}px = ${output}`;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Ruler className="h-6 w-6" aria-hidden="true" />}
        title="px ↔ rem converter"
        description="Convert between pixels and rem units with configurable base font size."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Base font size
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={baseFontSize}
                onChange={(e) => setBaseFontSize(Number(e.target.value))}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-20 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              <span className="text-muted-foreground text-xs">px</span>
            </div>
            <div>
              <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
                Direction
              </label>
              <div className="mt-1 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setDirection('px-to-rem')}
                  aria-pressed={direction === 'px-to-rem'}
                  className={
                    direction === 'px-to-rem'
                      ? 'border-primary bg-primary text-primary-foreground inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium'
                  }
                >
                  px → rem
                </button>
                <span className="text-muted-foreground">⇄</span>
                <button
                  type="button"
                  onClick={() => setDirection('rem-to-px')}
                  aria-pressed={direction === 'rem-to-px'}
                  className={
                    direction === 'rem-to-px'
                      ? 'border-primary bg-primary text-primary-foreground inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium'
                  }
                >
                  rem → px
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <TransformPanel
        inputId="pxrem-input"
        inputValue={value}
        onInputChange={setValue}
        inputLabel={direction === 'px-to-rem' ? 'Pixels' : 'Rem'}
        inputPlaceholder="16"
        inputRows={1}
        outputValue={output}
        outputLabel={direction === 'px-to-rem' ? 'Rem' : 'Pixels'}
        fileName="px-rem.txt"
        stats={
          output
            ? [
                { label: 'Formula', value: formula },
                { label: 'Base', value: `${baseFontSize}px` },
              ]
            : undefined
        }
        toolbar={
          output ? (
            <>
              <CopyButton value={output} iconOnly size="sm" />
              <DownloadButton
                content={output}
                fileName="px-rem.txt"
                contentType="text/plain;charset=utf-8"
                label="Download"
                size="sm"
              />
            </>
          ) : null
        }
      />

      {output && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground mb-2 text-xs font-semibold tracking-wider uppercase">
            Quick reference
          </p>
          <div className="grid gap-2 sm:grid-cols-2 md:grid-cols-4">
            {[1, 2, 4, 8, 12, 16, 24, 32].map((px) => (
              <div key={px} className="bg-muted/50 rounded-lg p-3 text-center">
                <p className="font-mono text-sm font-bold">{px}px</p>
                <p className="text-muted-foreground text-xs">
                  {direction === 'px-to-rem'
                    ? formatRem(px / baseFontSize)
                    : formatPx(px * baseFontSize)}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

PxRemConverter.displayName = 'PxRemConverter';

export { PxRemConverter };
