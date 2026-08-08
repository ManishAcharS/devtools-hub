'use client';

import React, { useMemo, useState } from 'react';
import { Plus, Trash2, Hammer } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { buildUrl, type QueryEntry } from '@/lib/tools/urls';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface QueryRowProps {
  entry: QueryEntry;
  index: number;
  onChange: (index: number, entry: QueryEntry) => void;
  onRemove: (index: number) => void;
}

const QueryRow: React.FC<QueryRowProps> = ({ entry, index, onChange, onRemove }) => (
  <div className="flex flex-wrap items-center gap-2">
    <span className="text-muted-foreground font-mono text-xs">{index + 1}.</span>
    <input
      type="text"
      value={entry.key}
      onChange={(event) => onChange(index, { ...entry, key: event.target.value })}
      placeholder="key"
      aria-label={`Query key ${index + 1}`}
      spellCheck={false}
      className="border-border bg-background text-foreground placeholder:text-muted-foreground w-40 rounded-lg border px-3 py-1.5 font-mono text-sm"
    />
    <span className="text-muted-foreground">=</span>
    <input
      type="text"
      value={entry.value}
      onChange={(event) => onChange(index, { ...entry, value: event.target.value })}
      placeholder="value"
      aria-label={`Query value ${index + 1}`}
      spellCheck={false}
      className="border-border bg-background text-foreground placeholder:text-muted-foreground min-w-0 flex-1 rounded-lg border px-3 py-1.5 font-mono text-sm"
    />
    <button
      type="button"
      onClick={() => onRemove(index)}
      aria-label={`Remove query parameter ${index + 1}`}
      className="text-muted-foreground rounded-lg p-1.5 transition-colors hover:text-red-600 dark:hover:text-red-400"
    >
      <Trash2 className="h-4 w-4" aria-hidden="true" />
    </button>
  </div>
);

const UrlBuilder: React.FC<ToolComponentProps> = () => {
  const [protocol, setProtocol] = useState('https');
  const [host, setHost] = useState('example.com');
  const [port, setPort] = useState('');
  const [pathname, setPathname] = useState('/path');
  const [query, setQuery] = useState<QueryEntry[]>([{ key: 'page', value: '1' }]);
  const [hash, setHash] = useState('');

  const result = useMemo(
    () => buildUrl({ protocol, host, port, pathname, query, hash }),
    [protocol, host, port, pathname, query, hash]
  );

  const updateQuery = (index: number, entry: QueryEntry): void => {
    setQuery((current) => current.map((item, i) => (i === index ? entry : item)));
  };

  const removeQuery = (index: number): void => {
    setQuery((current) => current.filter((_, i) => i !== index));
  };

  const fieldClass =
    'border-border bg-background text-foreground mt-1 w-full rounded-lg border px-3 py-2 text-sm';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Hammer className="h-6 w-6" aria-hidden="true" />}
        title="URL builder"
        description="Assemble a URL from its parts and watch it build live — protocol, host, port, path, query parameters, and fragment."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <label className="text-muted-foreground flex flex-col text-sm">
            <span>Protocol</span>
            <select
              value={protocol}
              onChange={(event) => setProtocol(event.target.value)}
              className={fieldClass}
            >
              {['https', 'http', 'ftp', 'ws', 'wss'].map((value) => (
                <option key={value} value={value}>
                  {value}://
                </option>
              ))}
            </select>
          </label>
          <label className="text-muted-foreground flex flex-col text-sm">
            <span>Host</span>
            <input
              type="text"
              value={host}
              onChange={(event) => setHost(event.target.value)}
              placeholder="example.com"
              spellCheck={false}
              className={fieldClass}
            />
          </label>
          <label className="text-muted-foreground flex flex-col text-sm">
            <span>Port (optional)</span>
            <input
              type="text"
              value={port}
              onChange={(event) => setPort(event.target.value)}
              placeholder="8080"
              spellCheck={false}
              className={fieldClass}
            />
          </label>
          <label className="text-muted-foreground flex flex-col text-sm">
            <span>Path</span>
            <input
              type="text"
              value={pathname}
              onChange={(event) => setPathname(event.target.value)}
              placeholder="/path"
              spellCheck={false}
              className={fieldClass}
            />
          </label>
        </div>

        <div className="text-muted-foreground mt-5 mb-2 flex items-center justify-between text-xs font-semibold tracking-wider uppercase">
          <span>Query parameters</span>
          <button
            type="button"
            onClick={() => setQuery((current) => [...current, { key: '', value: '' }])}
            className="text-primary hover:bg-primary/10 inline-flex items-center gap-1.5 rounded-lg px-2 py-1 text-xs font-medium transition-colors"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add parameter
          </button>
        </div>
        <div className="space-y-2">
          {query.length === 0 ? (
            <p className="text-muted-foreground text-sm italic">No query parameters.</p>
          ) : (
            query.map((entry, index) => (
              <QueryRow
                key={index}
                entry={entry}
                index={index}
                onChange={updateQuery}
                onRemove={removeQuery}
              />
            ))
          )}
        </div>

        <label className="text-muted-foreground mt-5 flex flex-col text-sm">
          <span>Fragment (optional)</span>
          <input
            type="text"
            value={hash}
            onChange={(event) => setHash(event.target.value)}
            placeholder="section"
            spellCheck={false}
            className={fieldClass}
          />
        </label>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Live preview
        </p>
        {result.error ? (
          <p className="mt-2 text-sm text-red-600 dark:text-red-400">{result.error}</p>
        ) : (
          <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
            <p className="text-foreground font-mono text-sm break-all">{result.url}</p>
            <CopyButton value={result.url} label="Copy URL" />
          </div>
        )}
      </div>
    </div>
  );
};

UrlBuilder.displayName = 'UrlBuilder';

export { UrlBuilder };
