'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';

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

function toBasicCredentials(username: string, password: string): { header: string; bare: string } {
  const token = bytesToBase64(new TextEncoder().encode(`${username}:${password}`));
  return { header: `Authorization: Basic ${token}`, bare: token };
}

const BasicAuthHeaderGenerator: React.FC<ToolComponentProps> = () => {
  const [username, setUsername] = useState('user');
  const [password, setPassword] = useState('pass');

  const credentials = useMemo(() => toBasicCredentials(username, password), [username, password]);

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';
  const labelClasses =
    'text-muted-foreground block text-xs font-semibold tracking-wider uppercase mb-1';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="Basic auth header generator"
        description="Build the HTTP Authorization header for Basic authentication. Credentials are encoded locally and never leave your browser."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label htmlFor="basic-username" className={labelClasses}>
              Username
            </label>
            <input
              id="basic-username"
              type="text"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              placeholder="Enter username"
              className={inputClasses}
            />
          </div>
          <div>
            <label htmlFor="basic-password" className={labelClasses}>
              Password
            </label>
            <input
              id="basic-password"
              type="password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              placeholder="Enter password"
              className={inputClasses}
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          The value is the UTF-8 encoding of username:password, base64-encoded.
        </p>
      </div>

      <TransformPanel
        inputId="basic-auth-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={credentials.header}
        outputLabel="Authorization header"
        outputPlaceholder="The header will appear here…"
        fileName="authorization-header.txt"
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Bare base64 token
          </p>
          <CopyButton value={credentials.bare} size="sm" />
        </div>
        <code className="bg-muted text-foreground mt-2 block rounded-lg px-4 py-3 font-mono text-sm break-all">
          {credentials.bare}
        </code>
      </div>
    </div>
  );
};

BasicAuthHeaderGenerator.displayName = 'BasicAuthHeaderGenerator';

export { BasicAuthHeaderGenerator };
