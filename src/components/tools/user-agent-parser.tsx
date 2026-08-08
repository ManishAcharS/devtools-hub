'use client';

import React, { useMemo, useState } from 'react';
import { MonitorSmartphone } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { parseUserAgent } from '@/lib/tools/network';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface UaRow {
  label: string;
  value: string;
}

const UA_SAMPLE =
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/131.0.0.0 Safari/537.36';

const UserAgentParser: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState(UA_SAMPLE);

  const result = useMemo(() => parseUserAgent(input), [input]);

  const rows: UaRow[] = useMemo(
    () => [
      { label: 'Browser', value: result.browser.name },
      { label: 'Version', value: result.browser.version },
      { label: 'Engine', value: result.engine.name },
      { label: 'Operating system', value: result.os.name },
      { label: 'OS version', value: result.os.version },
      { label: 'Device', value: result.device },
    ],
    [result]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<MonitorSmartphone className="h-6 w-6" aria-hidden="true" />}
        title="User agent parser"
        description="Paste any User-Agent string and find out which browser, engine, operating system, and device it came from."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="ua-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          User-Agent string
        </label>
        <textarea
          id="ua-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Mozilla/5.0 …"
          spellCheck={false}
          rows={3}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="mt-3 flex items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs">
            {input.length.toLocaleString()} characters
          </span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setInput('')}
              disabled={input.length === 0}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors disabled:opacity-50"
            >
              Clear
            </button>
            <button
              type="button"
              onClick={() => setInput(UA_SAMPLE)}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              Sample
            </button>
          </div>
        </div>
      </div>

      {input.trim().length > 0 ? (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-border border-b last:border-b-0">
                    <th className="text-muted-foreground w-48 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase">
                      {row.label}
                    </th>
                    <td className="text-foreground px-4 py-2.5 font-medium">{row.value}</td>
                    <td className="w-px px-3 py-2.5 align-middle whitespace-nowrap">
                      <CopyButton value={row.value} label="Copy" size="sm" iconOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          Parsed details will appear here…
        </div>
      )}
    </div>
  );
};

UserAgentParser.displayName = 'UserAgentParser';

export { UserAgentParser };
