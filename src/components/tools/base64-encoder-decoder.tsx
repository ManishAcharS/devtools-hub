'use client';

import React, { useMemo, useState } from 'react';
import { Binary } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Base64Mode = 'auto' | 'encode' | 'decode';

interface Base64Result {
  value: string;
  error: string | null;
  detected: 'encode' | 'decode' | null;
  decodedBytes: number | null;
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = '';
  const chunkSize = 0x8000;
  for (let i = 0; i < bytes.length; i += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
  }
  return btoa(binary);
}

function toBase64Url(value: string): string {
  return value.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}

function normalizeBase64(value: string): string {
  return value.trim().replace(/-/g, '+').replace(/_/g, '/');
}

function isBase64Candidate(value: string): boolean {
  const normalized = normalizeBase64(value);
  if (normalized.length === 0) return false;
  if (!/^[A-Za-z0-9+/]*={0,2}$/.test(normalized)) return false;
  return normalized.length % 4 === 0;
}

function base64ToBytes(value: string): Uint8Array {
  const normalized = normalizeBase64(value);
  const padded = normalized + '='.repeat((4 - (normalized.length % 4)) % 4);
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}

const Base64EncoderDecoder: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Base64Mode>('auto');
  const [urlSafe, setUrlSafe] = useState(false);

  const result: Base64Result = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) {
      return { value: '', error: null, detected: null, decodedBytes: null };
    }

    const canDecode = isBase64Candidate(trimmed);
    const direction = mode === 'auto' ? (canDecode ? 'decode' : 'encode') : mode;

    if (direction === 'encode') {
      const bytes = new TextEncoder().encode(trimmed);
      const encoded = bytesToBase64(bytes);
      return {
        value: urlSafe ? toBase64Url(encoded) : encoded,
        error: null,
        detected: mode === 'auto' ? 'encode' : null,
        decodedBytes: null,
      };
    }

    if (!canDecode) {
      return {
        value: '',
        error:
          'This does not look like valid Base64 input. Check for extra characters or missing padding.',
        detected: mode === 'auto' ? 'decode' : null,
        decodedBytes: null,
      };
    }

    try {
      const bytes = base64ToBytes(trimmed);
      const text = new TextDecoder('utf-8', { fatal: true }).decode(bytes);
      return {
        value: text,
        error: null,
        detected: mode === 'auto' ? 'decode' : null,
        decodedBytes: bytes.length,
      };
    } catch {
      return {
        value: '',
        error: 'Decoding failed: the Base64 data does not represent valid UTF-8 text.',
        detected: mode === 'auto' ? 'decode' : null,
        decodedBytes: null,
      };
    }
  }, [input, mode, urlSafe]);

  const stats = useMemo(() => {
    if (result.value.length === 0) return [];
    const list = [{ label: 'Output', value: `${result.value.length.toLocaleString()} chars` }];
    if (result.decodedBytes !== null) {
      list.push({ label: 'Decoded', value: `${result.decodedBytes.toLocaleString()} bytes` });
    }
    if (input.length > 0) {
      list.push({ label: 'Ratio', value: `${(result.value.length / input.length).toFixed(2)}x` });
    }
    return list;
  }, [result, input]);

  const modes: { value: Base64Mode; label: string }[] = [
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
          checked={urlSafe}
          onChange={(event) => setUrlSafe(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        URL-safe (base64url)
      </label>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Binary className="h-6 w-6" aria-hidden="true" />}
        title="Base64 converter"
        description="Encode text to Base64 or decode Base64 back to text. UTF-8 characters are fully supported, and Auto mode figures out the direction for you."
      />
      <TransformPanel
        inputId="base64-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Input"
        inputPlaceholder="Paste text to encode, or Base64 to decode…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="Output"
        outputPlaceholder="Output will appear here…"
        fileName="base64-output.txt"
        error={result.error}
        stats={stats}
      />
    </div>
  );
};

Base64EncoderDecoder.displayName = 'Base64EncoderDecoder';

export { Base64EncoderDecoder };
