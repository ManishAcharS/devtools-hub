'use client';

import React, { useMemo, useState } from 'react';
import { Split } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cidrInfo } from '@/lib/tools/network';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const IPv4_PRESETS = ['192.168.1.0/24', '10.0.0.0/8', '172.16.0.0/12', '203.0.113.0/24'];
const IPv6_PRESETS = ['2001:db8::/32', '2001:db8::/64', 'fd00::/48'];

interface CidrRow {
  label: string;
  value: string;
  copyValue: string;
}

const CidrCalculator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => (input.trim().length === 0 ? null : cidrInfo(input)), [input]);

  const rows: CidrRow[] = useMemo(() => {
    if (!result || result.error) return [];
    return [
      { label: 'Network', value: result.network, copyValue: result.network },
      ...(result.version === 4 && result.broadcast
        ? [{ label: 'Broadcast', value: result.broadcast, copyValue: result.broadcast }]
        : []),
      { label: 'First host', value: result.firstHost, copyValue: result.firstHost },
      { label: 'Last host', value: result.lastHost, copyValue: result.lastHost },
      { label: 'Hosts', value: result.hostCount, copyValue: result.hostCount },
      { label: 'Prefix length', value: `/${result.prefix}`, copyValue: `/${result.prefix}` },
      { label: 'Subnet mask', value: result.maskText, copyValue: result.maskText },
    ];
  }, [result]);

  const presets = [...IPv4_PRESETS, ...IPv6_PRESETS];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Split className="h-6 w-6" aria-hidden="true" />}
        title="CIDR calculator"
        description="Break down any CIDR block into its network address, broadcast, host range, and address count for both IPv4 and IPv6."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="cidr-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          CIDR block
        </label>
        <input
          id="cidr-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="192.168.1.0/24"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <div className="mt-3 flex flex-wrap gap-2">
          {presets.map((preset) => (
            <button
              key={preset}
              type="button"
              onClick={() => setInput(preset)}
              className={cn(
                'border-border bg-background text-muted-foreground hover:text-foreground rounded-lg border px-3 py-1.5 font-mono text-xs transition-colors',
                input === preset && 'border-primary text-primary'
              )}
              aria-pressed={input === preset}
            >
              {preset}
            </button>
          ))}
        </div>
      </div>

      {result?.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      ) : rows.length > 0 ? (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-border border-b last:border-b-0">
                    <th className="text-muted-foreground w-40 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase">
                      {row.label}
                    </th>
                    <td className="text-foreground px-4 py-2.5 font-mono">{row.value}</td>
                    <td className="w-px px-3 py-2.5 align-middle whitespace-nowrap">
                      <CopyButton value={row.copyValue} label="Copy" size="sm" iconOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          Network details will appear here…
        </div>
      )}
    </div>
  );
};

CidrCalculator.displayName = 'CidrCalculator';

export { CidrCalculator };
