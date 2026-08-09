'use client';

import React, { useState } from 'react';
import { KeyRound, Loader2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import * as bcrypt from 'bcryptjs';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type HtpasswdAlgorithm = 'bcrypt' | 'sha';

const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64(bytes: Uint8Array): string {
  let output = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    output += BASE64_CHARS[b0 >> 2];
    output += BASE64_CHARS[((b0 & 3) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) output += BASE64_CHARS[((b1 & 15) << 2) | (b2 >> 6)];
    if (i + 2 < bytes.length) output += BASE64_CHARS[b2 & 63];
  }
  while (output.length % 4 !== 0) output += '=';
  return output;
}

const HtpasswdGenerator: React.FC<ToolComponentProps> = () => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('');
  const [algorithm, setAlgorithm] = useState<HtpasswdAlgorithm>('bcrypt');
  const [line, setLine] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [generating, setGenerating] = useState(false);

  const generate = async () => {
    setError(null);
    setLine('');
    if (username.trim().length === 0) {
      setError('Enter a username.');
      return;
    }
    if (password.length === 0) {
      setError('Enter a password.');
      return;
    }
    setGenerating(true);
    try {
      let hash: string;
      if (algorithm === 'bcrypt') {
        const computed = await bcrypt.hash(password, 10);
        hash = computed.replace(/^\$2b\$/, '$2y$');
      } else {
        const digest = await crypto.subtle.digest('SHA-1', new TextEncoder().encode(password));
        hash = `{SHA}${bytesToBase64(new Uint8Array(digest))}`;
      }
      setLine(`${username}:${hash}`);
    } catch (cause) {
      setError(`Generation failed: ${(cause as Error).message}`);
    } finally {
      setGenerating(false);
    }
  };

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';
  const labelClasses =
    'text-muted-foreground block text-xs font-semibold tracking-wider uppercase mb-1';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<KeyRound className="h-6 w-6" aria-hidden="true" />}
        title="htpasswd generator"
        description="Create Apache htpasswd credential lines with bcrypt ($2y$) or legacy SHA-1 hashing, entirely client-side."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="htpasswd-username" className={labelClasses}>
              Username
            </label>
            <input
              id="htpasswd-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="e.g. admin"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="htpasswd-password" className={labelClasses}>
              Password
            </label>
            <input
              id="htpasswd-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password to hash"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-4">
          <label className={labelClasses}>Algorithm</label>
          <div className="flex gap-2">
            {(
              [
                { value: 'bcrypt', label: 'bcrypt ($2y$)' },
                { value: 'sha', label: 'Legacy {SHA}' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setAlgorithm(option.value)}
                className={
                  algorithm === option.value
                    ? 'bg-primary text-primary-foreground border-primary rounded-lg border px-4 py-2 text-sm font-medium'
                    : 'border-border bg-background hover:bg-muted text-foreground rounded-lg border px-4 py-2 text-sm font-medium'
                }
                aria-pressed={algorithm === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>

        <button
          type="button"
          onClick={generate}
          disabled={generating}
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {generating ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <KeyRound className="h-4 w-4" aria-hidden="true" />
          )}
          {generating ? 'Hashing…' : 'Generate'}
        </button>

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {line && (
        <TransformPanel
          inputId="htpasswd-output"
          inputValue=""
          onInputChange={() => {}}
          outputValue={line}
          outputLabel="htpasswd line"
          outputPlaceholder="The user:hash line will appear here…"
          fileName="htpasswd.txt"
        />
      )}
    </div>
  );
};

HtpasswdGenerator.displayName = 'HtpasswdGenerator';

export { HtpasswdGenerator };
