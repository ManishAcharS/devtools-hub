'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Terminal, Trash2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { buildCurl, curlToFetch } from '@/lib/tools/curl';
import { CopyButton } from '@/components/shared/copy-button';
import { SectionHeading } from '@/components/shared/section-heading';

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

interface HeaderRow {
  id: number;
  name: string;
  value: string;
}

const CurlGenerator: React.FC<ToolComponentProps> = () => {
  const [method, setMethod] = useState('GET');
  const [url, setUrl] = useState('https://api.example.com/v1/users');
  const [headers, setHeaders] = useState<HeaderRow[]>([
    { id: 1, name: 'Content-Type', value: 'application/json' },
  ]);
  const [body, setBody] = useState('');
  const [authType, setAuthType] = useState<'none' | 'bearer' | 'basic'>('none');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [tab, setTab] = useState<'curl' | 'fetch'>('curl');

  const curlOutput = useMemo(
    () =>
      buildCurl({
        method,
        url,
        headers: headers
          .filter((header) => header.name.trim() || header.value.trim())
          .map((header) => ({ name: header.name.trim(), value: header.value.trim() })),
        body,
        auth:
          authType === 'bearer'
            ? { type: 'bearer', token }
            : authType === 'basic'
              ? { type: 'basic', username, password }
              : undefined,
      }),
    [method, url, headers, body, authType, token, username, password]
  );

  const fetchOutput = useMemo(
    () => (tab === 'fetch' ? curlToFetch(curlOutput) : ''),
    [tab, curlOutput]
  );

  const updateHeader = (id: number, field: 'name' | 'value', value: string): void => {
    setHeaders((current) =>
      current.map((header) => (header.id === id ? { ...header, [field]: value } : header))
    );
  };

  const removeHeader = (id: number): void => {
    setHeaders((current) => current.filter((header) => header.id !== id));
  };

  const addHeader = (): void => {
    setHeaders((current) => [
      ...current,
      { id: Math.max(0, ...current.map((header) => header.id)) + 1, name: '', value: '' },
    ]);
  };

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Terminal className="h-6 w-6" aria-hidden="true" />}
        title="cURL generator"
        description="Build a cURL command or a fetch() snippet with method, headers, JSON body, and bearer/basic auth — ready to copy into your terminal or code."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="curl-method"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Method
            </label>
            <select
              id="curl-method"
              value={method}
              onChange={(event) => setMethod(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            >
              {METHODS.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="curl-url"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              URL
            </label>
            <input
              id="curl-url"
              type="url"
              value={url}
              onChange={(event) => setUrl(event.target.value)}
              placeholder="https://api.example.com/v1/users"
              className={inputClass}
            />
          </div>
        </div>

        <div className="mt-5">
          <div className="flex items-center justify-between">
            <label className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
              Headers
            </label>
            <button
              type="button"
              onClick={addHeader}
              className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-sm font-medium"
            >
              <span className="inline-flex items-center gap-1.5">
                <Plus className="h-4 w-4" aria-hidden="true" />
                Add header
              </span>
            </button>
          </div>
          <div className="mt-2 space-y-2">
            {headers.map((header) => (
              <div key={header.id} className="grid grid-cols-[1fr_2fr_auto] gap-2">
                <input
                  type="text"
                  value={header.name}
                  onChange={(event) => updateHeader(header.id, 'name', event.target.value)}
                  placeholder="Header name"
                  className={cn(inputClass, 'mt-0')}
                />
                <input
                  type="text"
                  value={header.value}
                  onChange={(event) => updateHeader(header.id, 'value', event.target.value)}
                  placeholder="Header value"
                  className={cn(inputClass, 'mt-0')}
                />
                <button
                  type="button"
                  onClick={() => removeHeader(header.id)}
                  aria-label="Remove header"
                  title="Remove header"
                  className="border-border hover:bg-muted rounded-lg border px-3 py-1.5 text-sm font-medium"
                >
                  <Trash2 className="h-4 w-4" aria-hidden="true" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5">
          <label
            htmlFor="curl-body"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            JSON body
          </label>
          <textarea
            id="curl-body"
            value={body}
            onChange={(event) => setBody(event.target.value)}
            placeholder={'{"name": "Ada", "role": "admin"}'}
            spellCheck={false}
            rows={4}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>

        <div className="mt-5">
          <label
            htmlFor="curl-auth"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Authentication
          </label>
          <select
            id="curl-auth"
            value={authType}
            onChange={(event) => setAuthType(event.target.value as 'none' | 'bearer' | 'basic')}
            className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none sm:w-64"
          >
            <option value="none">None</option>
            <option value="bearer">Bearer token</option>
            <option value="basic">Basic auth</option>
          </select>
          {authType === 'bearer' && (
            <input
              type="text"
              value={token}
              onChange={(event) => setToken(event.target.value)}
              placeholder="Your access token"
              className={inputClass}
            />
          )}
          {authType === 'basic' && (
            <div className="mt-3 grid gap-4 sm:grid-cols-2">
              <input
                type="text"
                value={username}
                onChange={(event) => setUsername(event.target.value)}
                placeholder="Username"
                className={inputClass}
              />
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Password"
                className={inputClass}
              />
            </div>
          )}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="bg-muted inline-flex rounded-lg p-1">
            {(
              [
                { value: 'curl', label: 'cURL' },
                { value: 'fetch', label: 'fetch()' },
              ] as const
            ).map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setTab(option.value)}
                className={cn(
                  'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                  tab === option.value
                    ? 'bg-background text-foreground shadow-sm'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                aria-pressed={tab === option.value}
              >
                {option.label}
              </button>
            ))}
          </div>
          <CopyButton
            value={tab === 'curl' ? curlOutput : fetchOutput}
            size="sm"
            disabled={!url.trim()}
          />
        </div>
        <pre className="bg-muted text-foreground mt-3 max-h-96 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
          {tab === 'curl' ? curlOutput : fetchOutput}
        </pre>
      </div>
    </div>
  );
};

CurlGenerator.displayName = 'CurlGenerator';

export { CurlGenerator };
