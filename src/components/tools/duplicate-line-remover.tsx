'use client';

import React, { useMemo, useState } from 'react';
import { ListFilter } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const DuplicateLineRemover: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [ignoreCase, setIgnoreCase] = useState(false);
  const [trimLines, setTrimLines] = useState(false);

  const output = useMemo(() => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const rawLine of input.split('\n')) {
      const line = trimLines ? rawLine.trim() : rawLine;
      const key = ignoreCase ? line.toLowerCase() : line;
      if (line === '') continue;
      if (seen.has(key)) continue;
      seen.add(key);
      result.push(line);
    }
    return result.join('\n');
  }, [input, ignoreCase, trimLines]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-4">
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        <input
          type="checkbox"
          checked={ignoreCase}
          onChange={(event) => setIgnoreCase(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Ignore case
      </label>
      <label className="flex cursor-pointer items-center gap-2 text-xs font-medium">
        <input
          type="checkbox"
          checked={trimLines}
          onChange={(event) => setTrimLines(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Trim lines
      </label>
      <button
        type="button"
        onClick={() => setInput('')}
        disabled={!input}
        className={cn(
          'border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-xs font-medium',
          'disabled:opacity-50'
        )}
      >
        Clear
      </button>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ListFilter className="h-6 w-6" aria-hidden="true" />}
        title="Duplicate line remover"
        description="Remove duplicate lines while keeping the first occurrence of each line. Perfect for cleaning up lists and configs."
      />
      <TransformPanel
        inputId="duplicate-lines-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Text"
        inputPlaceholder="Paste lines with duplicates…"
        toolbar={toolbar}
        outputValue={output}
        outputLabel="Unique lines"
        outputPlaceholder="Unique lines will appear here…"
        fileName="unique-lines.txt"
      />
    </div>
  );
};

DuplicateLineRemover.displayName = 'DuplicateLineRemover';

export { DuplicateLineRemover };
