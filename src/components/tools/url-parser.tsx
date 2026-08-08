'use client';

import React, { useMemo, useState } from 'react';
import { Link } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { parseUrlComponents } from '@/lib/tools/urls';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const UrlParser: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(
    () => (input.trim().length === 0 ? null : parseUrlComponents(input)),
    [input]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Link className="h-6 w-6" aria-hidden="true" />}
        title="URL parser"
        description="Break any URL into its parts — protocol, credentials, host, port, path, query parameters, and fragment."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="url-parse-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          URL
        </label>
        <input
          id="url-parse-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="https://user:pass@example.com:8080/path?page=2&sort=asc#results"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      {result?.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      ) : result ? (
        <div className="space-y-4">
          {result.warning && (
            <div className="rounded-xl border border-amber-600/30 bg-amber-600/5 p-4">
              <p className="text-sm text-amber-700 dark:text-amber-400">{result.warning}</p>
            </div>
          )}
          <div className="border-border bg-card rounded-xl border p-5">
            <div className="overflow-x-auto">
              <table className="w-full min-w-max border-collapse text-left text-sm">
                <tbody>
                  {result.parts.map((part) => (
                    <tr key={part.label} className="border-border border-b last:border-b-0">
                      <th className="text-muted-foreground w-40 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase">
                        {part.label}
                      </th>
                      <td className="text-foreground px-4 py-2.5 font-mono break-all">
                        {part.value || (
                          <span className="text-muted-foreground italic">(empty)</span>
                        )}
                      </td>
                      <td className="w-px px-3 py-2.5 align-middle whitespace-nowrap">
                        <CopyButton value={part.copyValue} label="Copy" size="sm" iconOnly />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {result.query.length > 0 && (
            <div className="border-border bg-card rounded-xl border p-5">
              <h2 className="text-foreground text-sm font-semibold">Query parameters</h2>
              <div className="border-border mt-3 overflow-x-auto rounded-lg border">
                <table className="w-full min-w-max border-collapse text-left text-sm">
                  <thead>
                    <tr className="bg-muted">
                      <th className="border-border text-foreground border-b px-4 py-2.5">Key</th>
                      <th className="border-border text-foreground border-b px-4 py-2.5">Value</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.query.map((entry, index) => (
                      <tr
                        key={`${entry.key}-${index}`}
                        className="border-border border-b last:border-b-0"
                      >
                        <td className="text-foreground px-4 py-2.5 font-mono">{entry.key}</td>
                        <td className="text-muted-foreground px-4 py-2.5 font-mono break-all">
                          {entry.value}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          URL parts will appear here…
        </div>
      )}
    </div>
  );
};

UrlParser.displayName = 'UrlParser';

export { UrlParser };
