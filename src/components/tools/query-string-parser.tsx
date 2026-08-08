'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { parseQueryString, serializeQueryString } from '@/lib/tools/urls';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const QueryStringParser: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('page=2&sort=asc&tag=web&tag=api');

  const result = useMemo(() => parseQueryString(input), [input]);

  const json = useMemo(() => {
    const grouped: Record<string, string[]> = {};
    for (const entry of result.entries) {
      if (!grouped[entry.key]) grouped[entry.key] = [];
      grouped[entry.key]?.push(entry.value);
    }
    const normalized: Record<string, string | string[]> = {};
    for (const [key, values] of Object.entries(grouped)) {
      normalized[key] = values && values.length > 1 ? values : (values?.[0] ?? '');
    }
    return JSON.stringify(normalized, null, 2);
  }, [result.entries]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="Query string parser"
        description="Decode and inspect query strings as a clean key/value table, with duplicate keys grouped and values percent-decoded."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="qs-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Query string
        </label>
        <textarea
          id="qs-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="page=2&sort=asc"
          spellCheck={false}
          rows={3}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-3 text-xs">
          {result.entries.length.toLocaleString()} parameters ·{' '}
          {'?'.concat(serializeQueryString(result.entries))}
        </p>
      </div>

      {result.decodeErrors > 0 && (
        <div className="rounded-xl border border-amber-600/30 bg-amber-600/5 p-4">
          <p className="text-sm text-amber-700 dark:text-amber-400">{result.error}</p>
        </div>
      )}

      {result.entries.length > 0 ? (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-foreground text-sm font-semibold">Decoded parameters</h2>
            <CopyButton value={json} label="Copy JSON" />
          </div>
          <div className="border-border mt-3 overflow-x-auto rounded-lg border">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border-border text-foreground border-b px-4 py-2.5">Key</th>
                  <th className="border-border text-foreground border-b px-4 py-2.5">Value</th>
                  <th
                    className="border-border text-foreground border-b px-4 py-2.5"
                    aria-label="Copy"
                  />
                </tr>
              </thead>
              <tbody>
                {result.entries.map((entry, index) => (
                  <tr
                    key={`${entry.key}-${index}`}
                    className="border-border border-b last:border-b-0"
                  >
                    <td className="text-foreground px-4 py-2.5 font-mono whitespace-nowrap">
                      {entry.key}
                    </td>
                    <td className="text-muted-foreground px-4 py-2.5 font-mono break-all">
                      {entry.value || <span className="italic">(empty)</span>}
                    </td>
                    <td className="w-px px-3 py-2.5 align-middle whitespace-nowrap">
                      <CopyButton value={entry.value} label="Copy" size="sm" iconOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="mt-4">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Grouped as JSON
            </p>
            <pre className="bg-muted text-foreground mt-2 overflow-x-auto rounded-lg px-4 py-3 font-mono text-xs">
              {json}
            </pre>
          </div>
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          Parameters will appear here…
        </div>
      )}
    </div>
  );
};

QueryStringParser.displayName = 'QueryStringParser';

export { QueryStringParser };
