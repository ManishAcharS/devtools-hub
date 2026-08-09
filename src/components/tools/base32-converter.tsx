'use client';

import React, { useMemo, useState } from 'react';
import { Binary } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { base32Decode, base32Encode, type Base32Alphabet } from '@/lib/tools/encoding-extra';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Base32Mode = 'encode' | 'decode';

const Base32Converter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('Hello, world!');
  const [mode, setMode] = useState<Base32Mode>('encode');
  const [alphabet, setAlphabet] = useState<Base32Alphabet>('base32');
  const [padding, setPadding] = useState(true);

  const result = useMemo(() => {
    try {
      const options = { alphabet, padding };
      const output =
        mode === 'encode' ? base32Encode(input, options) : base32Decode(input, options);
      return { output, error: null as string | null };
    } catch (cause) {
      return { output: '', error: (cause as Error).message };
    }
  }, [input, mode, alphabet, padding]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
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
      {(
        [
          { value: 'base32', label: 'Base32' },
          { value: 'base32hex', label: 'Base32hex' },
        ] as const
      ).map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setAlphabet(option.value)}
          className={cn(
            'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
            alphabet === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={alphabet === option.value}
        >
          {option.label}
        </button>
      ))}
      <label className="flex cursor-pointer items-center gap-1.5 text-xs font-medium">
        <input
          type="checkbox"
          checked={padding}
          onChange={(event) => setPadding(event.target.checked)}
          className="accent-primary h-3.5 w-3.5"
        />
        Padding
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Binary className="h-6 w-6" aria-hidden="true" />}
        title="Base32 converter"
        description="Convert text to and from RFC 4648 base32 and base32hex encodings, with optional padding."
      />
      <TransformPanel
        inputId="base32-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel={mode === 'encode' ? 'Text' : 'Base32'}
        inputPlaceholder={mode === 'encode' ? 'Paste text to encode…' : 'Paste base32 to decode…'}
        toolbar={toolbar}
        outputValue={result.output}
        outputLabel={mode === 'encode' ? 'Base32' : 'Text'}
        outputPlaceholder="Converted value will appear here…"
        fileName={mode === 'encode' ? 'encoded.b32' : 'decoded.txt'}
        error={result.error}
      />
    </div>
  );
};

Base32Converter.displayName = 'Base32Converter';

export { Base32Converter };
