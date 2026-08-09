'use client';

import React, { useMemo, useState } from 'react';
import { Percent } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { keywordDensity } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const KeywordDensityChecker: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const items = useMemo(() => keywordDensity(input), [input]);

  const totalWords = useMemo(
    () => (input.trim().length === 0 ? 0 : input.trim().split(/\s+/).length),
    [input]
  );
  const topWord = items[0];

  const summary = items
    .slice(0, 10)
    .map((item) => `${item.word}: ${item.density.toFixed(2)}%`)
    .join('\n');

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Percent className="h-6 w-6" aria-hidden="true" />}
        title="Keyword density checker"
        description="Count how often each keyword appears in your text and see its share of the total word count."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="density-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Content
        </label>
        <textarea
          id="density-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste your article, product description, or page copy…"
          rows={8}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
          <span>{totalWords.toLocaleString()} words</span>
          {items.length > 0 && (
            <button
              type="button"
              onClick={() => navigator.clipboard?.writeText(summary)}
              className="hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors"
            >
              Copy summary
            </button>
          )}
        </div>
      </div>

      {topWord && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-sm">
            Most frequent keyword:{' '}
            <span className="text-foreground font-semibold">{topWord.word}</span> —{' '}
            <span className="text-foreground font-semibold">{topWord.density.toFixed(2)}%</span> of
            total words ({topWord.count.toLocaleString()} occurrences).{' '}
            {topWord.density > 3
              ? 'That is on the high side — 1–2% is a typical sweet spot for SEO.'
              : topWord.density < 0.5
                ? 'That is low — consider using the keyword a few more times.'
                : 'That is within the typical 1–2% range for SEO.'}
          </p>
        </div>
      )}

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Keywords
          </p>
          <p className="text-muted-foreground text-xs">
            {items.length.toLocaleString()} unique keywords
          </p>
        </div>
        {items.length === 0 ? (
          <div className="text-muted-foreground flex h-24 items-center justify-center text-sm italic">
            Paste content to see keyword counts here.
          </div>
        ) : (
          <div className="mt-4 space-y-2">
            {items.map((item) => (
              <div key={item.word} className="flex items-center gap-3">
                <span className="w-40 truncate font-mono text-sm">{item.word}</span>
                <div className="bg-muted h-2 flex-1 overflow-hidden rounded-full">
                  <div
                    className="bg-primary h-full rounded-full"
                    style={{ width: `${Math.min(100, item.density * 12)}%` }}
                  />
                </div>
                <span className="text-muted-foreground w-24 text-right font-mono text-xs">
                  {item.count} × {item.density.toFixed(2)}%
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
      <CopyButton value={summary} label="Copy keyword summary" disabled={items.length === 0} />
    </div>
  );
};

KeywordDensityChecker.displayName = 'KeywordDensityChecker';

export { KeywordDensityChecker };
