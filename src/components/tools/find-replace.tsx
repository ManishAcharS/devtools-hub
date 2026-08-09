'use client';

import React, { useMemo, useState } from 'react';
import { Search } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { findReplace, type FindReplaceOptions } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const FindReplace: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [find, setFind] = useState('');
  const [replacement, setReplacement] = useState('');
  const [options, setOptions] = useState<FindReplaceOptions>({
    caseSensitive: false,
    useRegex: false,
    global: true,
  });

  const result = useMemo(
    () => findReplace(input, find, replacement, options),
    [input, find, replacement, options]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Search className="h-6 w-6" aria-hidden="true" />}
        title="Find & replace"
        description="Replace every occurrence of a value in your text, with case, regex, and global options."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label
              htmlFor="find-value"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Find
            </label>
            <input
              id="find-value"
              type="text"
              value={find}
              onChange={(event) => setFind(event.target.value)}
              placeholder="Text or pattern to search for…"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="replacement-value"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Replace with
            </label>
            <input
              id="replacement-value"
              type="text"
              value={replacement}
              onChange={(event) => setReplacement(event.target.value)}
              placeholder="Replacement text…"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-4">
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={options.caseSensitive}
              onChange={(event) =>
                setOptions((previous) => ({ ...previous, caseSensitive: event.target.checked }))
              }
              className="accent-primary h-4 w-4"
            />
            Case sensitive
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={options.useRegex}
              onChange={(event) =>
                setOptions((previous) => ({ ...previous, useRegex: event.target.checked }))
              }
              className="accent-primary h-4 w-4"
            />
            Regular expression
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
            <input
              type="checkbox"
              checked={options.global}
              onChange={(event) =>
                setOptions((previous) => ({ ...previous, global: event.target.checked }))
              }
              className="accent-primary h-4 w-4"
            />
            Replace all occurrences
          </label>
          {result.count > 0 && (
            <span className="text-muted-foreground text-xs">
              {result.count.toLocaleString()} replacement{result.count === 1 ? '' : 's'}
            </span>
          )}
        </div>
        {result.error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{result.error}</p>
        )}
      </div>
      <TransformPanel
        inputId="find-replace-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Text"
        inputPlaceholder="Paste the text to search…"
        outputValue={result.value}
        outputLabel="Result"
        fileName="replaced.txt"
        stats={
          result.count > 0
            ? [{ label: 'Replacements', value: result.count.toLocaleString() }]
            : undefined
        }
      />
    </div>
  );
};

FindReplace.displayName = 'FindReplace';

export { FindReplace };
