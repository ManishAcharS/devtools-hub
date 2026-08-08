'use client';

import React, { useMemo, useState } from 'react';
import { TextCursorInput } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { textStats } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';

const CharacterCounter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [includeSpaces, setIncludeSpaces] = useState(true);

  const stats = useMemo(() => textStats(input), [input]);

  const formatDuration = (seconds: number): string => {
    if (seconds === 0) return '—';
    if (seconds < 60) return `${seconds}s`;
    const minutes = Math.floor(seconds / 60);
    const rest = seconds % 60;
    return rest === 0 ? `${minutes} min` : `${minutes} min ${rest}s`;
  };

  const cards = [
    {
      label: 'Characters',
      value: (includeSpaces ? stats.characters : stats.charactersNoSpaces).toLocaleString(),
    },
    { label: 'Words', value: stats.words.toLocaleString() },
    { label: 'Lines', value: stats.lines.toLocaleString() },
    { label: 'Sentences', value: stats.sentences.toLocaleString() },
    { label: 'Bytes (UTF-8)', value: stats.bytes.toLocaleString() },
    { label: 'Reading time', value: formatDuration(stats.readingTimeSeconds) },
    { label: 'Speaking time', value: formatDuration(stats.speakingTimeSeconds) },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<TextCursorInput className="h-6 w-6" aria-hidden="true" />}
        title="Character counter"
        description="Count characters, words, lines, sentences, and bytes in any text, with estimated reading and speaking times."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="character-counter-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Text
        </label>
        <textarea
          id="character-counter-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Type or paste text to count…"
          rows={8}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="text-muted-foreground mt-3 flex flex-wrap items-center justify-between gap-3 text-xs">
          <label className="flex cursor-pointer items-center gap-2">
            <input
              type="checkbox"
              checked={includeSpaces}
              onChange={(event) => setIncludeSpaces(event.target.checked)}
              className="accent-primary h-4 w-4"
            />
            Count spaces in characters
          </label>
          <button
            type="button"
            onClick={() => setInput('')}
            disabled={input.length === 0}
            className="hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors disabled:opacity-50"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {cards.map((card) => (
          <div key={card.label} className="border-border bg-card rounded-xl border p-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              {card.label}
            </p>
            <p className="text-foreground mt-1 font-mono text-lg font-semibold">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

CharacterCounter.displayName = 'CharacterCounter';

export { CharacterCounter };
