'use client';

import React, { useMemo, useState } from 'react';
import { Link2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type UrlMode = 'auto' | 'encode' | 'decode';

interface UrlResult {
  value: string;
  error: string | null;
  detected: 'encode' | 'decode' | null;
}

function encodeValue(value: string, strict: boolean): string {
  const encoded = encodeURIComponent(value);
  return strict ? encoded.replace(/%/g, '%25') : encoded;
}

function canDecode(value: string): boolean {
  return /%[0-9a-fA-F]{2}/.test(value);
}

function decodeValue(value: string): string {
  return decodeURIComponent(value);
}

const UrlEncoderDecoder: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<UrlMode>('auto');
  const [strict, setStrict] = useState(false);

  const result: UrlResult = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { value: '', error: null, detected: null };
    }

    const direction = mode === 'auto' ? (canDecode(trimmed) ? 'decode' : 'encode') : mode;

    if (direction === 'encode') {
      return {
        value: encodeValue(trimmed, strict),
        error: null,
        detected: mode === 'auto' ? 'encode' : null,
      };
    }

    if (!canDecode(trimmed)) {
      return {
        value: '',
        error:
          'No percent-encoded sequences (%XX) were found in the input, so there is nothing to decode.',
        detected: mode === 'auto' ? 'decode' : null,
      };
    }

    try {
      return {
        value: decodeValue(trimmed),
        error: null,
        detected: mode === 'auto' ? 'decode' : null,
      };
    } catch {
      return {
        value: '',
        error: 'Decoding failed: the input contains an invalid percent-encoded sequence.',
        detected: mode === 'auto' ? 'decode' : null,
      };
    }
  }, [input, mode, strict]);

  const stats = useMemo(() => {
    if (result.value.length === 0) return [];
    const list = [{ label: 'Output', value: `${result.value.length.toLocaleString()} chars` }];
    if (input.length > 0) {
      let changed = 0;
      for (let i = 0; i < input.length; i += 1) {
        if (input[i] !== result.value[i]) changed += 1;
      }
      list.push({ label: 'Changed', value: changed.toLocaleString() });
    }
    return list;
  }, [result, input]);

  const modes: { value: UrlMode; label: string }[] = [
    { value: 'auto', label: 'Auto' },
    { value: 'encode', label: 'Encode' },
    { value: 'decode', label: 'Decode' },
  ];

  const toolbar = (
    <>
      <div className="bg-muted inline-flex rounded-lg p-1">
        {modes.map((option) => (
          <button
            key={option.value}
            type="button"
            onClick={() => setMode(option.value)}
            className={cn(
              'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
              mode === option.value
                ? 'bg-background text-foreground shadow-sm'
                : 'text-muted-foreground hover:text-foreground'
            )}
            aria-pressed={mode === option.value}
          >
            {option.label}
          </button>
        ))}
      </div>
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={strict}
          onChange={(event) => setStrict(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Encode existing % sequences
      </label>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Link2 className="h-6 w-6" aria-hidden="true" />}
        title="URL converter"
        description="Percent-encode or decode URLs and query strings. UTF-8 characters are supported, and Auto mode chooses the direction for you."
      />
      <TransformPanel
        inputId="url-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Input"
        inputPlaceholder="Paste a URL, query string, or text to encode…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="Output"
        outputPlaceholder="Output will appear here…"
        fileName="url-output.txt"
        error={result.error}
        stats={stats}
      />
    </div>
  );
};

UrlEncoderDecoder.displayName = 'UrlEncoderDecoder';

export { UrlEncoderDecoder };
