'use client';

import React, { useMemo, useState } from 'react';
import { Fingerprint } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { decodeJwt } from '@/lib/tools/jwt';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const SAMPLE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzc1MDI1NjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

const JwtDecoder: React.FC<ToolComponentProps> = () => {
  const [token, setToken] = useState('');

  const result = useMemo(() => (token.trim().length === 0 ? null : decodeJwt(token)), [token]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Fingerprint className="h-6 w-6" aria-hidden="true" />}
        title="JWT decoder"
        description="Decode the header, payload, and signature of any JSON Web Token right in your browser. Nothing leaves this page."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="jwt-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          JWT
        </label>
        <textarea
          id="jwt-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="eyJhbGciOi…"
          spellCheck={false}
          rows={4}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            {token.length.toLocaleString()} characters
          </span>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setToken(SAMPLE_TOKEN)}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Sample token
            </button>
            <button
              type="button"
              onClick={() => setToken('')}
              disabled={token.length === 0}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            >
              Clear
            </button>
          </div>
        </div>
      </div>

      {result?.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      ) : result ? (
        <div className="space-y-4">
          <section className="border-border bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-semibold">Header</h2>
              <CopyButton value={result.header.json} label="Copy" size="sm" />
            </div>
            <pre className="bg-muted text-foreground mt-3 overflow-x-auto rounded-lg px-4 py-3 font-mono text-sm">
              {result.header.json}
            </pre>
          </section>
          <section className="border-border bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-semibold">Payload</h2>
              <CopyButton value={result.payload.json} label="Copy" size="sm" />
            </div>
            <pre className="bg-muted text-foreground mt-3 overflow-x-auto rounded-lg px-4 py-3 font-mono text-sm">
              {result.payload.json}
            </pre>
          </section>
          <section className="border-border bg-card rounded-xl border p-5">
            <div className="flex items-center justify-between">
              <h2 className="text-foreground text-sm font-semibold">Signature</h2>
              <CopyButton value={result.signature} label="Copy" size="sm" />
            </div>
            <p className="text-foreground mt-3 font-mono text-sm break-all">{result.signature}</p>
            <p className="text-muted-foreground mt-2 text-xs">
              {result.signatureBytes} · base64url-encoded. Decoding a signature is not verification
              — anyone can decode it.
            </p>
          </section>
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          Decoded sections will appear here…
        </div>
      )}
    </div>
  );
};

JwtDecoder.displayName = 'JwtDecoder';

export { JwtDecoder };
