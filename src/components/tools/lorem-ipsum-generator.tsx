'use client';

import React, { useState } from 'react';
import { Type } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generateLorem } from '@/lib/tools/generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const LoremIpsumGenerator: React.FC<ToolComponentProps> = () => {
  const [paragraphs, setParagraphs] = useState(3);
  const [sentences, setSentences] = useState(5);
  const [startWithClassic, setStartWithClassic] = useState(true);

  const content = generateLorem({ paragraphs, sentencesPerParagraph: sentences, startWithClassic });

  const wordCount = content.value.trim().split(/\s+/).filter(Boolean).length;
  const charCount = content.value.length;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Type className="h-6 w-6" aria-hidden="true" />}
        title="Lorem ipsum generator"
        description="Generate placeholder text for designs and layouts. Choose the number of paragraphs, sentences per paragraph, and word count."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end gap-4">
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>Paragraphs (1–20)</span>
            <input
              type="number"
              min={1}
              max={20}
              value={paragraphs}
              onChange={(event) =>
                setParagraphs(Math.max(1, Math.min(20, Number(event.target.value) || 1)))
              }
              className="border-border bg-background text-foreground w-24 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex flex-col gap-2 text-sm">
            <span>Sentences per paragraph (1–20)</span>
            <input
              type="number"
              min={1}
              max={20}
              value={sentences}
              onChange={(event) =>
                setSentences(Math.max(1, Math.min(20, Number(event.target.value) || 1)))
              }
              className="border-border bg-background text-foreground w-24 rounded-lg border px-3 py-2 text-sm"
            />
          </label>
          <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={startWithClassic}
              onChange={(event) => setStartWithClassic(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Start with the classic opening
          </label>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-muted-foreground text-xs">
            {wordCount.toLocaleString()} words · {charCount.toLocaleString()} characters
          </div>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={content.value} label="Copy text" />
            <DownloadButton content={content.value} fileName="lorem-ipsum.txt" label="Download" />
          </div>
        </div>
        <div className="bg-muted text-foreground mt-4 max-h-96 overflow-auto rounded-lg px-5 py-4 text-sm leading-7 whitespace-pre-wrap">
          {content.value.trim()}
        </div>
      </div>
    </div>
  );
};

LoremIpsumGenerator.displayName = 'LoremIpsumGenerator';

export { LoremIpsumGenerator };
