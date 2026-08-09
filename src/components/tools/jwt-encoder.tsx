'use client';

import React, { useState } from 'react';
import { Fingerprint, Loader2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type JwtAlgorithm = 'HS256' | 'RS256';

const BASE64URL_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_';
const BASE64_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';

function bytesToBase64Url(bytes: Uint8Array): string {
  let output = '';
  for (let i = 0; i < bytes.length; i += 3) {
    const b0 = bytes[i] ?? 0;
    const b1 = bytes[i + 1] ?? 0;
    const b2 = bytes[i + 2] ?? 0;
    output += BASE64URL_CHARS[b0 >> 2];
    output += BASE64URL_CHARS[((b0 & 3) << 4) | (b1 >> 4)];
    if (i + 1 < bytes.length) output += BASE64URL_CHARS[((b1 & 15) << 2) | (b2 >> 6)];
    if (i + 2 < bytes.length) output += BASE64URL_CHARS[b2 & 63];
  }
  return output;
}

function base64ToBytes(input: string): Uint8Array<ArrayBuffer> {
  const lookup = new Map<string, number>();
  for (let i = 0; i < BASE64_CHARS.length; i += 1) lookup.set(BASE64_CHARS[i], i);
  const cleaned = input.replace(/[^A-Za-z0-9+/=]/g, '').replace(/=+$/, '');
  const bytes: number[] = [];
  let buffer = 0;
  let bits = 0;
  for (const character of cleaned) {
    const digit = lookup.get(character);
    if (digit === undefined) continue;
    buffer = (buffer << 6) | digit;
    bits += 6;
    if (bits >= 8) {
      bytes.push((buffer >>> (bits - 8)) & 0xff);
      bits -= 8;
    }
  }
  const result = new Uint8Array(new ArrayBuffer(bytes.length));
  for (let i = 0; i < bytes.length; i += 1) result[i] = bytes[i] ?? 0;
  return result;
}

function parsePemPrivateKey(pem: string): Uint8Array<ArrayBuffer> {
  const lines = pem
    .split('\n')
    .map((line) => line.trim())
    .filter((line) => line.length > 0 && !line.startsWith('-----'));
  if (lines.length === 0) throw new Error('No PEM body found.');
  return base64ToBytes(lines.join(''));
}

const JwtEncoder: React.FC<ToolComponentProps> = () => {
  const [algorithm, setAlgorithm] = useState<JwtAlgorithm>('HS256');
  const [payload, setPayload] = useState(
    JSON.stringify({ sub: '1234567890', name: 'John Doe', admin: true }, null, 2)
  );
  const [secret, setSecret] = useState('change-me');
  const [privateKey, setPrivateKey] = useState('');
  const [ttl, setTtl] = useState('');
  const [token, setToken] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [signing, setSigning] = useState(false);

  const signToken = async () => {
    setError(null);
    setToken('');
    let parsed: Record<string, unknown>;
    try {
      const value: unknown = JSON.parse(payload);
      if (value === null || typeof value !== 'object' || Array.isArray(value)) {
        throw new Error('Payload must be a JSON object.');
      }
      parsed = value as Record<string, unknown>;
    } catch (cause) {
      setError(`Invalid payload JSON: ${(cause as Error).message}`);
      return;
    }
    if (algorithm === 'HS256' && secret.trim().length === 0) {
      setError('Enter an HMAC secret to sign with HS256.');
      return;
    }
    if (algorithm === 'RS256' && privateKey.trim().length === 0) {
      setError('Paste a PEM private key to sign with RS256.');
      return;
    }
    if (ttl.trim().length > 0) {
      const seconds = Number(ttl);
      if (!Number.isFinite(seconds) || seconds <= 0) {
        setError('TTL must be a positive number of seconds.');
        return;
      }
      const now = Math.floor(Date.now() / 1000);
      parsed = { ...parsed, iat: now, exp: now + Math.floor(seconds) };
    }
    setSigning(true);
    try {
      const header = JSON.stringify({ alg: algorithm, typ: 'JWT' });
      const headerSegment = bytesToBase64Url(new TextEncoder().encode(header));
      const payloadSegment = bytesToBase64Url(new TextEncoder().encode(JSON.stringify(parsed)));
      const signingInput = `${headerSegment}.${payloadSegment}`;
      let signature: ArrayBuffer;
      if (algorithm === 'HS256') {
        const key = await crypto.subtle.importKey(
          'raw',
          new TextEncoder().encode(secret),
          { name: 'HMAC', hash: 'SHA-256' },
          false,
          ['sign']
        );
        signature = await crypto.subtle.sign('HMAC', key, new TextEncoder().encode(signingInput));
      } else {
        const key = await crypto.subtle.importKey(
          'pkcs8',
          parsePemPrivateKey(privateKey),
          { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' },
          false,
          ['sign']
        );
        signature = await crypto.subtle.sign(
          'RSASSA-PKCS1-v1_5',
          key,
          new TextEncoder().encode(signingInput)
        );
      }
      setToken(`${signingInput}.${bytesToBase64Url(new Uint8Array(signature))}`);
    } catch (cause) {
      setError(`Signing failed: ${(cause as Error).message}`);
    } finally {
      setSigning(false);
    }
  };

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';
  const labelClasses =
    'text-muted-foreground block text-xs font-semibold tracking-wider uppercase mb-1';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Fingerprint className="h-6 w-6" aria-hidden="true" />}
        title="JWT encoder"
        description="Build and sign a JSON Web Token entirely in your browser with HS256 or RS256, including optional expiry claims."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className={labelClasses}>Algorithm</label>
            <div className="flex gap-2">
              {(['HS256', 'RS256'] as const).map((option) => (
                <button
                  key={option}
                  type="button"
                  onClick={() => setAlgorithm(option)}
                  className={
                    algorithm === option
                      ? 'bg-primary text-primary-foreground border-primary rounded-lg border px-4 py-2 text-sm font-medium'
                      : 'border-border bg-background hover:bg-muted text-foreground rounded-lg border px-4 py-2 text-sm font-medium'
                  }
                  aria-pressed={algorithm === option}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
          <div>
            <label htmlFor="jwt-ttl" className={labelClasses}>
              TTL (seconds)
            </label>
            <input
              id="jwt-ttl"
              type="number"
              min={1}
              value={ttl}
              onChange={(event) => setTtl(event.target.value)}
              placeholder="Leave empty for no expiry"
              className={inputClasses}
            />
          </div>
        </div>

        <div className="mt-4">
          <label htmlFor="jwt-payload" className={labelClasses}>
            Payload (JSON)
          </label>
          <textarea
            id="jwt-payload"
            value={payload}
            onChange={(event) => setPayload(event.target.value)}
            rows={8}
            spellCheck={false}
            className={`${inputClasses} resize-y font-mono`}
          />
        </div>

        {algorithm === 'HS256' ? (
          <div className="mt-4">
            <label htmlFor="jwt-secret" className={labelClasses}>
              HMAC secret
            </label>
            <input
              id="jwt-secret"
              type="password"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="Shared secret used to sign"
              className={inputClasses}
            />
          </div>
        ) : (
          <div className="mt-4">
            <label htmlFor="jwt-key" className={labelClasses}>
              RSA private key (PEM)
            </label>
            <textarea
              id="jwt-key"
              value={privateKey}
              onChange={(event) => setPrivateKey(event.target.value)}
              rows={6}
              spellCheck={false}
              placeholder={'-----BEGIN PRIVATE KEY-----'}
              className={`${inputClasses} resize-y font-mono`}
            />
          </div>
        )}

        <button
          type="button"
          onClick={signToken}
          disabled={signing}
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 mt-4 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {signing ? (
            <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          ) : (
            <Fingerprint className="h-4 w-4" aria-hidden="true" />
          )}
          {signing ? 'Signing…' : 'Sign token'}
        </button>

        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {token && (
        <TransformPanel
          inputId="jwt-encoder-output"
          inputValue=""
          onInputChange={() => {}}
          outputValue={token}
          outputLabel="Signed JWT"
          outputPlaceholder="The signed token will appear here…"
          fileName="token.jwt"
        />
      )}
    </div>
  );
};

JwtEncoder.displayName = 'JwtEncoder';

export { JwtEncoder };
