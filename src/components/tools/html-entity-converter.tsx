'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { decodeHtmlEntities, encodeHtmlEntities } from '@/lib/tools/encoding-extra';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type EntityMode = 'encode' | 'decode';

const HtmlEntityConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('<a href="https://example.com">Tom & Jerry</a>');
  const [mode, setMode] = useState<EntityMode>('encode');

  const output = useMemo(
    () => (mode === 'encode' ? encodeHtmlEntities(input) : decodeHtmlEntities(input)),
    [input, mode]
  );

  const toolbar = (
    <div className="flex items-center gap-2">
      {(
        [
          { value: 'encode', label: 'Encode' },
          { value: 'decode', label: 'Decode' },
        ] as const
      ).map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setMode(option.value)}
          className={cn(
            'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
            mode === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={mode === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="HTML entity converter"
        description="Escape text for safe embedding in HTML, or convert named and numeric character references back into readable characters."
      />
      <TransformPanel
        inputId="html-entity-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Text"
        inputPlaceholder="Paste text to convert…"
        toolbar={toolbar}
        outputValue={output}
        outputLabel={mode === 'encode' ? 'Encoded HTML' : 'Decoded text'}
        outputPlaceholder="Converted text will appear here…"
        fileName={mode === 'encode' ? 'encoded.html' : 'decoded.txt'}
      />
    </div>
  );
};

HtmlEntityConverter.displayName = 'HtmlEntityConverter';

export { HtmlEntityConverter };
