'use client';

import React, { useMemo, useState } from 'react';
import { KeyRound, RefreshCw } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

type ApiKeyEncoding = 'hex' | 'base64url';

const BASE64URL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const HEX_CHARS = '0123456789abcdef';

function encodeRandomBytes(bytes: Uint8Array, encoding: ApiKeyEncoding): string {
  if (encoding === 'hex') {
    let output = '';
    for (const byte of bytes) {
      output += HEX_CHARS[byte >> 4];
      output += HEX_CHARS[byte & 15];
    }
    return output;
  }
  let output = '';
  let buffer = 0;
  let bits = 0;
  for (const byte of bytes) {
    buffer = (buffer << 8) | byte;
    bits += 8;
    while (bits >= 6) {
      output += BASE64URL_CHARS[(buffer >>> (bits - 6)) & 63];
      bits -= 6;
    }
  }
  if (bits > 0) {
    output += BASE64URL_CHARS[(buffer << (6 - bits)) & 63];
  }
  return output;
}

function generateKeys(
  prefix: string,
  encoding: ApiKeyEncoding,
  length: number,
  count: number,
  nonce: number
): string[] {
  const nonceByte = nonce & 0xff;
  return Array.from({ length: count }, () => {
    const bytes = new Uint8Array(length);
    crypto.getRandomValues(bytes);
    for (let i = 0; i < bytes.length; i++) {
      bytes[i] = (bytes[i] ?? 0) ^ nonceByte;
    }
    return `${prefix}${encodeRandomBytes(bytes, encoding)}`;
  });
}

function entropyBits(encoding: ApiKeyEncoding, length: number): number {
  return length * (encoding === 'hex' ? 4 : 6);
}

const ApiKeyGenerator: React.FC<ToolComponentProps> = () => {
  const [prefix, setPrefix] = useState('sk_live_');
  const [encoding, setEncoding] = useState<ApiKeyEncoding>('base64url');
  const [length, setLength] = useState(32);
  const [count, setCount] = useState(3);
  const [nonce, setNonce] = useState(0);
  const keys = useMemo(
    () => generateKeys(prefix, encoding, length, count, nonce),
    [prefix, encoding, length, count, nonce]
  );

  const regenerate = () => {
    setNonce((value) => value + 1);
  };

  const allText = keys.join('\n') + (keys.length > 0 ? '\n' : '');
  const perKeyBits = entropyBits(encoding, length);

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';
  const labelClasses =
    'text-muted-foreground block text-xs font-semibold tracking-wider uppercase mb-1';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<KeyRound className="h-6 w-6" aria-hidden="true" />}
        title="API key generator"
        description="Generate cryptographically random API keys with a custom prefix in hex or base64url encoding, with live entropy estimates."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="api-key-prefix" className={labelClasses}>
              Prefix
            </label>
            <input
              id="api-key-prefix"
              type="text"
              value={prefix}
              onChange={(event) => setPrefix(event.target.value)}
              placeholder="e.g. sk_live_"
              className={inputClasses}
            />
          </div>
          <div>
            <label className={labelClasses}>Encoding</label>
            <div className="flex gap-2">
              {(
                [
                  { value: 'hex', label: 'hex' },
                  { value: 'base64url', label: 'base64url' },
                ] as const
              ).map((option) => (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setEncoding(option.value)}
                  className={
                    encoding === option.value
                      ? 'bg-primary text-primary-foreground border-primary rounded-lg border px-4 py-2 text-sm font-medium'
                      : 'border-border bg-background hover:bg-muted text-foreground rounded-lg border px-4 py-2 text-sm font-medium'
                  }
                  aria-pressed={encoding === option.value}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="api-key-length" className={labelClasses}>
              Random length: {length} bytes
            </label>
            <input
              id="api-key-length"
              type="range"
              min={16}
              max={128}
              value={length}
              onChange={(event) => setLength(Number(event.target.value))}
              className="w-full"
            />
          </div>
          <div>
            <label htmlFor="api-key-count" className={labelClasses}>
              Count: {count}
            </label>
            <input
              id="api-key-count"
              type="range"
              min={1}
              max={10}
              value={count}
              onChange={(event) => setCount(Number(event.target.value))}
              className="w-full"
            />
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs">
            {perKeyBits.toLocaleString()} bits of entropy per key
            {keys.length > 1
              ? ` · ${(perKeyBits * keys.length).toLocaleString()} bits total`
              : ''}{' '}
            · keys regenerate as you change settings
          </p>
          <button
            type="button"
            onClick={regenerate}
            className="border-border bg-background hover:bg-muted text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-1.5 text-sm font-medium"
          >
            <RefreshCw className="h-4 w-4" aria-hidden="true" />
            Regenerate
          </button>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            {keys.length} API keys
          </p>
          <div className="flex flex-wrap gap-2">
            <CopyButton value={allText} label="Copy all" />
            <DownloadButton content={allText} fileName="api-keys.txt" label="Download" />
          </div>
        </div>
        <ul className="mt-4 space-y-2">
          {keys.map((key) => (
            <li
              key={key}
              className="border-border bg-background flex items-center justify-between gap-3 rounded-lg border px-4 py-2"
            >
              <code
                suppressHydrationWarning
                className="text-foreground font-mono text-sm break-all"
              >
                {key}
              </code>
              <CopyButton value={key} label="Copy" size="sm" iconOnly />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

ApiKeyGenerator.displayName = 'ApiKeyGenerator';

export { ApiKeyGenerator };
