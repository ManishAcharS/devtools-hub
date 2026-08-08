'use client';

import React, { useState } from 'react';
import { Dices } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generateUuids } from '@/lib/tools/generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const UUID_SAMPLE = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx';

const UuidGenerator: React.FC<ToolComponentProps> = () => {
  const [count, setCount] = useState(5);
  const [uppercase, setUppercase] = useState(false);
  const [removeHyphens, setRemoveHyphens] = useState(false);
  const [generation, setGeneration] = useState(() =>
    generateUuids(5, { uppercase: false, removeHyphens: false })
  );

  const regenerate = (): void => {
    setGeneration(generateUuids(count, { uppercase, removeHyphens }));
  };

  const allText = generation.uuids.join('\n') + (generation.uuids.length > 0 ? '\n' : '');

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Dices className="h-6 w-6" aria-hidden="true" />}
        title="UUID generator"
        description="Generate cryptographically random v4 UUIDs in bulk. Adjust the count, uppercase them, or strip the hyphens for storage."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>Count (1–500)</span>
            <input
              type="number"
              min={1}
              max={500}
              value={count}
              onChange={(event) =>
                setCount(Math.max(1, Math.min(500, Number(event.target.value) || 1)))
              }
              className="border-border bg-background text-foreground w-24 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={uppercase}
              onChange={(event) => setUppercase(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Uppercase
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={removeHyphens}
              onChange={(event) => setRemoveHyphens(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            No hyphens
          </label>
          <button
            type="button"
            onClick={regenerate}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-colors"
          >
            <Dices className="h-4 w-4" aria-hidden="true" />
            Generate
          </button>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          Format: {removeHyphens ? '32 hex characters' : UUID_SAMPLE}
          {uppercase ? ' · uppercase' : ''}. Uses the browser&apos;s secure random source.
        </p>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {generation.uuids.length} UUIDs
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={allText} label="Copy all" />
            <DownloadButton content={allText} fileName="uuids.txt" label="Download" />
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {generation.uuids.map((uuid) => (
            <li
              key={uuid}
              className="border-border bg-background flex items-center justify-between gap-3 rounded-lg border px-4 py-2"
            >
              <code className="text-foreground font-mono text-sm break-all">{uuid}</code>
              <CopyButton value={uuid} label="Copy" size="sm" iconOnly />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

UuidGenerator.displayName = 'UuidGenerator';

export { UuidGenerator };
