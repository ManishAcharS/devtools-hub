'use client';

import React, { useMemo, useState } from 'react';
import { Percent } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { isWhatPercent, percentChange, percentOf } from '@/lib/tools/numbers';
import { parseBoundedFloat } from '@/lib/tools/validate';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

type Mode = 'percent-of' | 'is-what-percent' | 'percent-change';

const MODES: { value: Mode; label: string; firstLabel: string; secondLabel: string }[] = [
  { value: 'percent-of', label: 'Percent of', firstLabel: 'Percent', secondLabel: 'Of value' },
  { value: 'is-what-percent', label: 'Is what percent', firstLabel: 'Part', secondLabel: 'Whole' },
  { value: 'percent-change', label: 'Percent change', firstLabel: 'From', secondLabel: 'To' },
];

const PercentageCalculator: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<Mode>('percent-of');
  const [first, setFirst] = useState('25');
  const [second, setSecond] = useState('200');

  const labels = MODES.find((m) => m.value === mode) ?? MODES[0];

  const result = useMemo(() => {
    const a = parseBoundedFloat(first, { label: labels.firstLabel });
    const b = parseBoundedFloat(second, { label: labels.secondLabel });
    if (a.error || b.error) {
      return { value: '', formula: '', error: a.error ?? b.error };
    }
    switch (mode) {
      case 'percent-of':
        return percentOf(a.value, b.value);
      case 'is-what-percent':
        return isWhatPercent(a.value, b.value);
      default:
        return percentChange(a.value, b.value);
    }
  }, [mode, first, second, labels.firstLabel, labels.secondLabel]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Percent className="h-6 w-6" aria-hidden="true" />}
        title="Percentage calculator"
        description="Three everyday percentage calculations in one place: a percent of b, a is what percent of b, and the change from a to b."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="bg-muted inline-flex rounded-lg p-1">
          {MODES.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                mode === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={mode === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>{labels.firstLabel}</span>
            <input
              type="number"
              value={first}
              onChange={(event) => setFirst(event.target.value)}
              step="any"
              className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>{labels.secondLabel}</span>
            <input
              type="number"
              value={second}
              onChange={(event) => setSecond(event.target.value)}
              step="any"
              className="border-border bg-background text-foreground w-full rounded-lg border px-3 py-2 text-sm"
            />
          </label>
        </div>
      </div>

      {result.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      ) : (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Result
          </p>
          <div className="mt-2 flex flex-wrap items-center justify-between gap-4">
            <p className="text-foreground text-3xl font-bold">{result.value}</p>
            <CopyButton value={result.value} label="Copy result" />
          </div>
          <p className="text-muted-foreground mt-4 font-mono text-xs break-all">{result.formula}</p>
        </div>
      )}
    </div>
  );
};

PercentageCalculator.displayName = 'PercentageCalculator';

export { PercentageCalculator };
