'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type SortMode = 'az' | 'za' | 'short' | 'long' | 'shuffle';

const SORT_MODES: { value: SortMode; label: string }[] = [
  { value: 'az', label: 'A-Z' },
  { value: 'za', label: 'Z-A' },
  { value: 'short', label: 'Shortest' },
  { value: 'long', label: 'Longest' },
  { value: 'shuffle', label: 'Shuffle' },
];

const TextSorter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<SortMode>('az');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [sortSeed, setSortSeed] = useState(0);

  const output = useMemo(() => {
    const lines = input.split('\n');
    const normalized = (value: string) => (ignoreCase ? value.toLowerCase() : value);
    switch (mode) {
      case 'az':
        return [...lines].sort((a, b) => normalized(a).localeCompare(normalized(b))).join('\n');
      case 'za':
        return [...lines].sort((a, b) => normalized(b).localeCompare(normalized(a))).join('\n');
      case 'short':
        return [...lines]
          .sort((a, b) => a.length - b.length || normalized(a).localeCompare(normalized(b)))
          .join('\n');
      case 'long':
        return [...lines]
          .sort((a, b) => b.length - a.length || normalized(a).localeCompare(normalized(b)))
          .join('\n');
      case 'shuffle': {
        const seeded = [...lines];
        let state = sortSeed;
        for (let i = seeded.length - 1; i > 0; i--) {
          state = (state * 1664525 + 1013904223) % 4294967296;
          const j = state % (i + 1);
          [seeded[i], seeded[j]] = [seeded[j], seeded[i]];
        }
        return seeded.join('\n');
      }
    }
  }, [input, mode, ignoreCase, sortSeed]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-3">
      <div className="flex flex-wrap items-center gap-2">
        {SORT_MODES.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={cn(
              'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
              mode === option.value
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={mode === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        <input
          type="checkbox"
          checked={ignoreCase}
          onChange={(event) => setIgnoreCase(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Ignore case
      </label>
      {mode === 'shuffle' && (
        <button
          type="button"
          onClick={() => setSortSeed((seed) => seed + 1)}
          className="border-border hover:bg-muted rounded-lg border px-2.5 py-1.5 text-xs font-medium"
        >
          Reshuffle
        </button>
      )}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ArrowDownUp className="h-6 w-6" aria-hidden="true" />}
        title="Text sorter"
        description="Sort text lines alphabetically, by length, or shuffle them randomly — one line per input row."
      />
      <TransformPanel
        inputId="text-sorter-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Text"
        inputPlaceholder="Paste lines to sort…"
        toolbar={toolbar}
        outputValue={output}
        outputLabel="Sorted text"
        outputPlaceholder="Sorted lines will appear here…"
        fileName="sorted.txt"
      />
    </div>
  );
};

TextSorter.displayName = 'TextSorter';

export { TextSorter };
