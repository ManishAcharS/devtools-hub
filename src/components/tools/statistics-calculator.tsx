'use client';

import React, { useMemo, useState } from 'react';
import { BarChart3 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { allStats, formatStatValue } from '@/lib/tools/stats';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const StatisticsCalculator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('1, 2, 2, 3, 4');

  const result = useMemo(() => allStats(input), [input]);

  const output = useMemo(() => {
    if (result.error) return '';
    const lines = [
      `Count: ${result.count}`,
      `Sum: ${formatStatValue(result.sum, 6)}`,
      `Min: ${formatStatValue(result.min, 6)}`,
      `Max: ${formatStatValue(result.max, 6)}`,
      `Range: ${formatStatValue(result.range, 6)}`,
      `Mean: ${formatStatValue(result.mean, 6)}`,
      `Median: ${formatStatValue(result.median, 6)}`,
      `Mode: ${result.modes.length > 0 ? result.modes.map((value) => formatStatValue(value, 6)).join(', ') : 'none'}`,
      `Variance (population): ${formatStatValue(result.variancePopulation, 6)}`,
      `Variance (sample): ${formatStatValue(result.varianceSample, 6)}`,
      `Std dev (population): ${formatStatValue(result.stdDevPopulation, 6)}`,
      `Std dev (sample): ${formatStatValue(result.stdDevSample, 6)}`,
    ];
    return lines.join('\n');
  }, [result]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<BarChart3 className="h-6 w-6" aria-hidden="true" />}
        title="Statistics calculator"
        description="Compute count, sum, min, max, mean, median, mode, range, variance, and standard deviation for any set of numbers."
      />
      <TransformPanel
        inputId="stats-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Numbers"
        inputPlaceholder="1, 2, 2, 3, 4"
        inputRows={6}
        outputValue={output}
        outputLabel="Summary"
        outputPlaceholder="Statistics will appear here…"
        fileName="statistics.txt"
        error={result.error}
      />
      {!result.error && result.count > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{result.count.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              count
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{formatStatValue(result.mean, 4)}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              mean
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{formatStatValue(result.median, 4)}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              median
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{formatStatValue(result.stdDevSample, 4)}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              std dev (sample)
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

StatisticsCalculator.displayName = 'StatisticsCalculator';

export { StatisticsCalculator };
