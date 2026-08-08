'use client';

import React, { useCallback, useState } from 'react';
import { KeyRound } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { hmacHex, type HmacHash } from '@/lib/tools/hashing';
import { SectionHeading } from '@/components/shared/section-heading';
import { HashPanel } from '@/components/tools/hash-panel';

const HMAC_ALGORITHMS: Array<{ value: HmacHash; label: string }> = [
  { value: 'SHA-256', label: 'SHA-256' },
  { value: 'SHA-512', label: 'SHA-512' },
  { value: 'SHA-1', label: 'SHA-1' },
];

const HmacGenerator: React.FC<ToolComponentProps> = () => {
  const [secret, setSecret] = useState('');
  const [algorithm, setAlgorithm] = useState<HmacHash>('SHA-256');
  const [inputFormat, setInputFormat] = useState<'utf8' | 'hex'>('utf8');

  const compute = useCallback(
    (text: string) =>
      hmacHex(algorithm, secret, text, { inputFormat }).catch((cause: unknown) => {
        if (cause instanceof Error && cause.message.includes('Hex input')) {
          throw cause;
        }
        throw new Error('Enter a secret key to compute the HMAC.');
      }),
    [algorithm, secret, inputFormat]
  );

  const extraControls = (
    <div className="grid gap-4 sm:grid-cols-3">
      <label className="block sm:col-span-1">
        <span className="text-foreground mb-2 block text-sm font-medium">Secret key</span>
        <input
          type="text"
          value={secret}
          onChange={(event) => setSecret(event.target.value)}
          placeholder="your-secret-key"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-ring w-full rounded-xl border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </label>
      <label className="block">
        <span className="text-foreground mb-2 block text-sm font-medium">Algorithm</span>
        <select
          value={algorithm}
          onChange={(event) => setAlgorithm(event.target.value as HmacHash)}
          className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-xl border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          {HMAC_ALGORITHMS.map((option) => (
            <option key={option.value} value={option.value}>
              HMAC-{option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="block">
        <span className="text-foreground mb-2 block text-sm font-medium">Input format</span>
        <select
          value={inputFormat}
          onChange={(event) => setInputFormat(event.target.value as 'utf8' | 'hex')}
          className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-xl border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        >
          <option value="utf8">UTF-8 text</option>
          <option value="hex">Hex bytes</option>
        </select>
      </label>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<KeyRound className="h-6 w-6" aria-hidden="true" />}
        title="HMAC generator"
        description="Compute a keyed hash (HMAC) of any text using a secret and SHA-1, SHA-256, or SHA-512 — fully local with WebCrypto."
      />
      <HashPanel
        algorithmName={`HMAC-${algorithm}`}
        compute={compute}
        extraControls={extraControls}
      />
    </div>
  );
};

HmacGenerator.displayName = 'HmacGenerator';

export { HmacGenerator };
