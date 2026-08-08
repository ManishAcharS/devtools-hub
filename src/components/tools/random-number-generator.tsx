'use client';

import React, { useState } from 'react';
import { Shuffle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generateRandomNumbers } from '@/lib/tools/generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const RandomNumberGenerator: React.FC<ToolComponentProps> = () => {
  const [min, setMin] = useState('1');
  const [max, setMax] = useState('100');
  const [count, setCount] = useState('5');
  const [unique, setUnique] = useState(false);
  const [result, setResult] = useState(() =>
    generateRandomNumbers({ min: 1, max: 100, count: 5, unique: false })
  );

  const generate = (): void => {
    setResult(
      generateRandomNumbers({
        min: Number(min) || 0,
        max: Number(max) || 0,
        count: Number(count) || 1,
        unique,
      })
    );
  };

  const allText = result.numbers.join(', ');

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Shuffle className="h-6 w-6" aria-hidden="true" />}
        title="Random number generator"
        description="Generate random whole numbers within any range, with optional uniqueness — for picks, tests, and lottery-style draws."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>Minimum</span>
            <input
              type="number"
              value={min}
              onChange={(event) => setMin(event.target.value)}
              className="border-border bg-background text-foreground w-28 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>Maximum</span>
            <input
              type="number"
              value={max}
              onChange={(event) => setMax(event.target.value)}
              className="border-border bg-background text-foreground w-28 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>Count (1–1000)</span>
            <input
              type="number"
              min={1}
              max={1000}
              value={count}
              onChange={(event) => setCount(event.target.value)}
              className="border-border bg-background text-foreground w-28 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={unique}
              onChange={(event) => setUnique(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            No duplicates
          </label>
          <button
            type="button"
            onClick={generate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Shuffle className="h-4 w-4" aria-hidden="true" />
            Generate
          </button>
        </div>
      </div>

      {result.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      ) : (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {result.numbers.length} numbers
            </div>
            <div className="flex flex-wrap gap-2">
              <CopyButton value={allText} label="Copy all" />
              <DownloadButton
                content={result.numbers.join('\n')}
                fileName="random-numbers.txt"
                label="Download"
              />
            </div>
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            {result.numbers.map((number, index) => (
              <code
                key={`${number}-${index}`}
                className="bg-muted text-foreground rounded-lg px-3 py-2 font-mono text-sm"
              >
                {number.toLocaleString()}
              </code>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

RandomNumberGenerator.displayName = 'RandomNumberGenerator';

export { RandomNumberGenerator };
