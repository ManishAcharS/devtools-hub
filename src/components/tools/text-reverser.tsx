'use client';

import React, { useMemo, useState } from 'react';
import { ArrowDownUp } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { reverseCharacters, reverseWords, reverseLines } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type ReverseMode = 'characters' | 'words' | 'lines';

const TextReverser: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<ReverseMode>('characters');

  const output = useMemo(() => {
    if (mode === 'words') return reverseWords(input);
    if (mode === 'lines') return reverseLines(input);
    return reverseCharacters(input);
  }, [input, mode]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ArrowDownUp className="h-6 w-6" aria-hidden="true" />}
        title="Text reverser"
        description="Reverse characters, words, or lines of any text in one click."
      />
      <TransformPanel
        inputId="reverser-input"
        inputValue={input}
        onInputChange={setInput}
        inputPlaceholder="Paste text to reverse…"
        outputValue={output}
        fileName="reversed.txt"
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            {(
              [
                ['characters', 'Characters'],
                ['words', 'Words'],
                ['lines', 'Lines'],
              ] as [ReverseMode, string][]
            ).map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setMode(value)}
                aria-pressed={mode === value}
                className={`inline-flex items-center rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                  mode === value
                    ? 'border-primary bg-primary text-primary-foreground'
                    : 'border-border bg-background text-muted-foreground hover:text-foreground'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        }
      />
    </div>
  );
};

TextReverser.displayName = 'TextReverser';

export { TextReverser };
