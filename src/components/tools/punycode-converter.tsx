'use client';

import React, { useMemo, useState } from 'react';
import { Globe } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { fromPunycode, toPunycode } from '@/lib/tools/encoding-extra';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type PunycodeMode = 'encode' | 'decode';

const PunycodeConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('münchen.de');
  const [mode, setMode] = useState<PunycodeMode>('encode');

  const result = useMemo(() => {
    try {
      const output = mode === 'encode' ? toPunycode(input) : fromPunycode(input);
      return { output, error: null as string | null };
    } catch (cause) {
      return { output: '', error: (cause as Error).message };
    }
  }, [input, mode]);

  const toolbar = (
    <div className="flex items-center gap-2">
      {(
        [
          { value: 'encode', label: 'To punycode' },
          { value: 'decode', label: 'From punycode' },
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
        icon={<Globe className="h-6 w-6" aria-hidden="true" />}
        title="Punycode converter"
        description="Convert internationalized domain names (IDN) to ASCII-compatible xn-- form and back, per RFC 3492."
      />
      <TransformPanel
        inputId="punycode-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel={mode === 'encode' ? 'Unicode domain' : 'Punycode domain'}
        inputPlaceholder={
          mode === 'encode' ? 'Paste a Unicode domain, e.g. münchen.de…' : 'Paste an xn-- domain…'
        }
        toolbar={toolbar}
        outputValue={result.output}
        outputLabel={mode === 'encode' ? 'Punycode (ASCII)' : 'Unicode'}
        outputPlaceholder="Converted domain will appear here…"
        fileName={mode === 'encode' ? 'punycode.txt' : 'unicode.txt'}
        error={result.error}
      />
    </div>
  );
};

PunycodeConverter.displayName = 'PunycodeConverter';

export { PunycodeConverter };
