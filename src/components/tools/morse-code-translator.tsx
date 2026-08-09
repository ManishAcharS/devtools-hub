'use client';

import React, { useMemo, useState } from 'react';
import { AudioLines } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { morseToText, textToMorse } from '@/lib/tools/morse';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const MorseCodeTranslator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'text' | 'morse'>('text');

  const output = useMemo(
    () => (mode === 'text' ? textToMorse(input) : morseToText(input)),
    [input, mode]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<AudioLines className="h-6 w-6" aria-hidden="true" />}
        title="Morse code translator"
        description="Translate text to Morse code and back. Letters are separated by a space, words by a slash."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            {(['text', 'morse'] as const).map((option) => (
              <button
                key={option}
                type="button"
                onClick={() => setMode(option)}
                className={cn(
                  'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
                  mode === option
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={mode === option}
              >
                {option === 'text' ? 'Text to Morse' : 'Morse to Text'}
              </button>
            ))}
          </div>
          <button
            type="button"
            onClick={() => setInput('')}
            disabled={!input}
            className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-xs font-medium disabled:opacity-50"
          >
            Clear
          </button>
        </div>

        <label
          htmlFor="morse-input"
          className="text-muted-foreground mt-5 block text-xs font-semibold tracking-wider uppercase"
        >
          {mode === 'text' ? 'Text' : 'Morse code'}
        </label>
        <textarea
          id="morse-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={mode === 'text' ? 'Enter text to translate…' : 'Enter Morse code (… --- …)…'}
          spellCheck={false}
          rows={5}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {mode === 'text' ? 'Morse code' : 'Text'}
          </label>
          <CopyButton value={output} iconOnly size="sm" disabled={!output} />
        </div>
        {output ? (
          <div className="bg-muted text-foreground mt-2 max-h-96 overflow-auto rounded-lg px-4 py-3 font-mono text-xl leading-relaxed break-all whitespace-pre-wrap">
            {output}
          </div>
        ) : (
          <div className="bg-muted text-muted-foreground mt-2 flex h-20 items-center justify-center rounded-lg px-4 text-sm italic">
            Translation will appear here…
          </div>
        )}
      </div>
    </div>
  );
};

MorseCodeTranslator.displayName = 'MorseCodeTranslator';

export { MorseCodeTranslator };
