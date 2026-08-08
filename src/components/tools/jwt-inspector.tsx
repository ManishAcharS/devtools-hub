'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { analyzeJwt, decodeJwt, verifyJwtSignature } from '@/lib/tools/jwt';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';

const SAMPLE_TOKEN =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTc2NzIyNTYwMCwiZXhwIjoxNzc1MDI1NjAwfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c';

type VerifyState = 'idle' | 'checking' | 'valid' | 'invalid';

const stateClasses: Record<string, string> = {
  ok: 'bg-emerald-600/10 text-emerald-700 dark:text-emerald-400',
  warn: 'bg-amber-600/10 text-amber-700 dark:text-amber-400',
  danger: 'bg-red-600/10 text-red-700 dark:text-red-400',
  info: 'bg-primary/10 text-primary',
};

const JwtInspector: React.FC<ToolComponentProps> = () => {
  const [token, setToken] = useState('');
  const [secret, setSecret] = useState('');
  const [verifyState, setVerifyState] = useState<VerifyState>('idle');
  const [verifyDetail, setVerifyDetail] = useState('');

  const result = useMemo(() => (token.trim().length === 0 ? null : decodeJwt(token)), [token]);

  const analysis = useMemo(() => {
    if (!result?.header.object || !result?.payload.object) return null;
    return analyzeJwt(result.payload.object, result.header.object);
  }, [result]);

  const verify = async (): Promise<void> => {
    if (!token.trim()) return;
    setVerifyState('checking');
    setVerifyDetail('');
    const outcome = await verifyJwtSignature(token, secret);
    setVerifyState(outcome.verified ? 'valid' : 'invalid');
    setVerifyDetail(outcome.detail);
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="JWT inspector"
        description="Decode a JWT and inspect every claim: expiry, issuer, audience, and algorithm — with optional HMAC signature verification."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="jwt-inspector-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          JWT
        </label>
        <textarea
          id="jwt-inspector-input"
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

        <div className="mt-4 flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="jwt-secret"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              HMAC secret (optional)
            </label>
            <input
              id="jwt-secret"
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Used only to verify HS256/384/512 signatures"
              autoComplete="off"
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <button
            type="button"
            onClick={() => {
              void verify();
            }}
            disabled={verifyState === 'checking' || token.trim().length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            <ShieldCheck className="h-4 w-4" aria-hidden="true" />
            {verifyState === 'checking' ? 'Verifying…' : 'Verify signature'}
          </button>
        </div>
        {verifyState !== 'idle' && (
          <p
            className={cn(
              'mt-3 text-sm font-medium',
              verifyState === 'valid'
                ? 'text-emerald-600 dark:text-emerald-400'
                : verifyState === 'invalid'
                  ? 'text-red-600 dark:text-red-400'
                  : 'text-muted-foreground'
            )}
          >
            {verifyState === 'checking' ? 'Computing HMAC…' : verifyDetail}
          </p>
        )}
      </div>

      {result?.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      ) : analysis ? (
        <div className="space-y-4">
          {analysis.summary.length > 0 && (
            <div className="rounded-xl border border-amber-600/30 bg-amber-600/5 p-4">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">Findings</p>
              <ul className="mt-1 list-inside list-disc text-sm text-amber-700 dark:text-amber-400">
                {analysis.summary.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </div>
          )}

          <section className="border-border bg-card rounded-xl border p-5">
            <h2 className="text-foreground text-sm font-semibold">Claims</h2>
            <div className="border-border mt-3 overflow-x-auto rounded-lg border">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                <thead>
                  <tr className="bg-muted">
                    <th className="border-border text-foreground border-b px-4 py-2.5">Claim</th>
                    <th className="border-border text-foreground border-b px-4 py-2.5">Value</th>
                    <th className="border-border text-foreground border-b px-4 py-2.5">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {analysis.rows.map((row) => (
                    <tr key={row.label} className="border-border border-b last:border-b-0">
                      <td className="text-foreground px-4 py-2.5 font-medium">{row.label}</td>
                      <td className="text-muted-foreground px-4 py-2.5 font-mono text-xs break-all">
                        {row.value}
                      </td>
                      <td className="w-px px-4 py-2.5 whitespace-nowrap">
                        <span
                          className={cn(
                            'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium',
                            stateClasses[row.state]
                          )}
                        >
                          <span aria-hidden="true">
                            {row.state === 'ok'
                              ? '✓'
                              : row.state === 'danger'
                                ? '!'
                                : row.state === 'warn'
                                  ? '!'
                                  : 'i'}
                          </span>
                          {row.detail}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          <section className="border-border bg-card rounded-xl border p-5">
            <h2 className="text-foreground text-sm font-semibold">Decoded payload</h2>
            <pre className="bg-muted text-foreground mt-3 overflow-x-auto rounded-lg px-4 py-3 font-mono text-sm">
              {result?.payload.json ?? ''}
            </pre>
          </section>
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          Claims analysis will appear here…
        </div>
      )}
    </div>
  );
};

JwtInspector.displayName = 'JwtInspector';

export { JwtInspector };
