'use client';

import React, { useMemo, useState } from 'react';
import { Eraser } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { removeWhitespace, type WhitespaceMode } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const MODES: { value: WhitespaceMode; label: string; hint: string }[] = [
  {
    value: 'all',
    label: 'Remove all whitespace',
    hint: 'Spaces, tabs, and newlines are all stripped.',
  },
  {
    value: 'line-breaks',
    label: 'Remove line breaks',
    hint: 'Newlines become single spaces; words stay separated.',
  },
  {
    value: 'extra-spaces',
    label: 'Collapse extra spaces',
    hint: 'Repeated spaces become one; the text is trimmed.',
  },
  {
    value: 'trim-lines',
    label: 'Trim every line',
    hint: 'Leading and trailing whitespace on each line is removed.',
  },
];

const WhitespaceRemover: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<WhitespaceMode>('all');

  const result = useMemo(() => removeWhitespace(input, mode), [input, mode]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Eraser className="h-6 w-6" aria-hidden="true" />}
        title="Whitespace remover"
        description="Strip spaces, tabs, and line breaks from text, or tidy them into a clean format."
      />
      <TransformPanel
        inputId="whitespace-input"
        inputValue={input}
        onInputChange={setInput}
        inputPlaceholder="Paste text with messy whitespace…"
        outputValue={result.value}
        fileName="cleaned.txt"
        stats={[
          { label: 'Removed', value: result.removedCount.toLocaleString() },
          { label: 'Before', value: input.length.toLocaleString() },
          { label: 'After', value: result.value.length.toLocaleString() },
        ]}
        toolbar={
          <div className="flex flex-wrap items-center gap-2">
            {MODES.map(({ value, label }) => (
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
      <p className="text-muted-foreground text-sm">
        {MODES.find((item) => item.value === mode)?.hint}
      </p>
    </div>
  );
};

WhitespaceRemover.displayName = 'WhitespaceRemover';

export { WhitespaceRemover };
