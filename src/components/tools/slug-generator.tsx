'use client';

import React, { useMemo, useState } from 'react';
import { Link2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { slugify } from '@/lib/tools/generators';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const SlugGenerator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [separator, setSeparator] = useState('-');
  const [lowercase, setLowercase] = useState(true);
  const [maxLength, setMaxLength] = useState(80);

  const result = useMemo(
    () => slugify(input, { separator, lowercase, maxLength }),
    [input, separator, lowercase, maxLength]
  );

  const separators = ['-', '_', '~', ''];

  const toolbar = (
    <>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Separator</span>
        <select
          value={separator}
          onChange={(event) => setSeparator(event.target.value)}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          {separators.map((value) => (
            <option key={value || 'none'} value={value}>
              {value === ''
                ? 'none'
                : value === '-'
                  ? 'dash (-)'
                  : value === '_'
                    ? 'underscore (_)'
                    : 'tilde (~)'}
            </option>
          ))}
        </select>
      </label>
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={lowercase}
          onChange={(event) => setLowercase(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Lowercase
      </label>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Max</span>
        <input
          type="number"
          min={10}
          max={200}
          value={maxLength}
          onChange={(event) =>
            setMaxLength(Math.max(10, Math.min(200, Number(event.target.value) || 80)))
          }
          className="border-border bg-background text-foreground w-20 rounded-md border px-2 py-1 text-sm"
        />
      </label>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Link2 className="h-6 w-6" aria-hidden="true" />}
        title="Slug generator"
        description="Turn any title or phrase into a clean, URL-friendly slug with your choice of separator, casing, and length."
      />
      <TransformPanel
        inputId="slug-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Title or text"
        inputPlaceholder="e.g. Top 10 Tips For Clean URLs"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="Slug"
        outputPlaceholder="Generated slug will appear here…"
        fileName="slug.txt"
        error={result.error}
        stats={
          result.value.length > 0
            ? [
                { label: 'Length', value: result.value.length.toString() },
                {
                  label: 'Words',
                  value: result.value
                    .split(separator || /\s/)
                    .filter(Boolean)
                    .length.toString(),
                },
              ]
            : undefined
        }
      />
      {result.value.length > 0 && (
        <div className="border-border bg-card rounded-xl border p-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Live URL preview
          </p>
          <p className={cn('text-foreground mt-2 font-mono text-sm break-all')}>
            https://example.com/blog/{result.value}
          </p>
        </div>
      )}
    </div>
  );
};

SlugGenerator.displayName = 'SlugGenerator';

export { SlugGenerator };
