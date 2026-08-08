'use client';

import React, { useMemo, useState } from 'react';
import { GitCompare } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { diffLines, diffWords, type DiffPart } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';

const REMOVED_BG = 'bg-red-500/10';
const ADDED_BG = 'bg-emerald-500/10';
const REMOVED_TEXT = 'text-red-600 dark:text-red-400';
const ADDED_TEXT = 'text-emerald-700 dark:text-emerald-400';

const TextDiff: React.FC<ToolComponentProps> = () => {
  const [before, setBefore] = useState('');
  const [after, setAfter] = useState('');
  const [compareWords, setCompareWords] = useState(false);

  const parts = useMemo(() => {
    if (before === '' && after === '') return [];
    return compareWords ? diffWords(before, after) : diffLines(before, after);
  }, [before, after, compareWords]);

  const additions = parts.reduce(
    (total, part) => total + (part.operation === 'added' ? part.value.length : 0),
    0
  );
  const removals = parts.reduce(
    (total, part) => total + (part.operation === 'removed' ? part.value.length : 0),
    0
  );

  const renderParts = (partsToRender: DiffPart[]) => (
    <pre
      className="text-foreground bg-background m-0 overflow-x-auto p-4 font-mono text-sm leading-relaxed whitespace-pre-wrap"
      aria-label="Diff output"
    >
      {partsToRender.map((part, index) => (
        <span
          key={index}
          className={cn(
            part.operation === 'removed' && cn(REMOVED_BG, REMOVED_TEXT, 'line-through'),
            part.operation === 'added' && cn(ADDED_BG, ADDED_TEXT)
          )}
        >
          {part.value}
        </span>
      ))}
    </pre>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<GitCompare className="h-6 w-6" aria-hidden="true" />}
        title="Text diff"
        description="Compare two texts and highlight what changed, line by line or word by word."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <div className="text-muted-foreground flex gap-4 text-xs font-medium">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-red-500/10 text-red-600 dark:text-red-400" />
              Removed
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-2.5 w-2.5 rounded-sm bg-emerald-500/10 text-emerald-700 dark:text-emerald-400" />
              Added
            </span>
          </div>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={compareWords}
              onChange={(event) => setCompareWords(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Word level
          </label>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="diff-before"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Original
              </label>
              <button
                type="button"
                onClick={() => setBefore('')}
                disabled={before.length === 0}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
            <textarea
              id="diff-before"
              value={before}
              onChange={(event) => setBefore(event.target.value)}
              placeholder="Paste the original text…"
              rows={10}
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {before.length.toLocaleString()} characters
            </p>
          </div>
          <div>
            <div className="flex items-center justify-between">
              <label
                htmlFor="diff-after"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Modified
              </label>
              <button
                type="button"
                onClick={() => setAfter('')}
                disabled={after.length === 0}
                className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50"
              >
                Clear
              </button>
            </div>
            <textarea
              id="diff-after"
              value={after}
              onChange={(event) => setAfter(event.target.value)}
              placeholder="Paste the modified text…"
              rows={10}
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
            <p className="text-muted-foreground mt-1 text-xs">
              {after.length.toLocaleString()} characters
            </p>
          </div>
        </div>
      </div>

      <div>
        <div className="mb-2 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Changes
          </p>
          <p className="text-muted-foreground text-xs font-medium">
            {additions.toLocaleString()} added · {removals.toLocaleString()} removed
          </p>
        </div>
        <div className="border-border overflow-hidden rounded-xl border">
          {parts.length === 0 ? (
            <div className="bg-background text-muted-foreground flex h-24 items-center justify-center px-4 text-sm italic">
              Paste text in both fields to see the differences here.
            </div>
          ) : (
            renderParts(parts)
          )}
        </div>
      </div>
    </div>
  );
};

TextDiff.displayName = 'TextDiff';

export { TextDiff };
