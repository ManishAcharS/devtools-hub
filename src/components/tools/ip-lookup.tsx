'use client';

import React, { useMemo, useState } from 'react';
import { Globe, Network, RefreshCw } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  classifyIpv4,
  classifyIpv6,
  ipv4ToBinary,
  ipv4ToNumber,
  ipv6ToFull,
  ipv6ToShort,
  parseIp,
} from '@/lib/tools/network';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface InfoRow {
  label: string;
  value: string;
  copyValue: string;
}

const IpLookup: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [myIp, setMyIp] = useState<string | null>(null);
  const [myIpError, setMyIpError] = useState<string | null>(null);
  const [detecting, setDetecting] = useState(false);

  const result = useMemo(() => (input.trim().length === 0 ? null : parseIp(input)), [input]);

  const rows: InfoRow[] = useMemo(() => {
    if (!result || result.error || result.version === null) return [];
    if (result.version === 4) {
      const classification = classifyIpv4(result.octets);
      const number = ipv4ToNumber(result.octets);
      return [
        { label: 'IP version', value: 'IPv4', copyValue: 'IPv4' },
        { label: 'Classification', value: classification.scope, copyValue: classification.scope },
        {
          label: 'Description',
          value: classification.description,
          copyValue: classification.description,
        },
        {
          label: 'Binary',
          value: ipv4ToBinary(result.octets),
          copyValue: ipv4ToBinary(result.octets),
        },
        { label: 'Decimal', value: number.toString(), copyValue: number.toString() },
      ];
    }
    const classification = classifyIpv6(result.hextets);
    const full = ipv6ToFull(result.hextets);
    const short = ipv6ToShort(result.hextets);
    return [
      { label: 'IP version', value: 'IPv6', copyValue: 'IPv6' },
      { label: 'Classification', value: classification.scope, copyValue: classification.scope },
      {
        label: 'Description',
        value: classification.description,
        copyValue: classification.description,
      },
      { label: 'Full form', value: full, copyValue: full },
      { label: 'Short form', value: short, copyValue: short },
    ];
  }, [result]);

  const detectMyIp = async (): Promise<void> => {
    setDetecting(true);
    setMyIpError(null);
    try {
      const response = await fetch('https://api.ipify.org?format=json');
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }
      const data = (await response.json()) as { ip?: string };
      setMyIp(data.ip ?? null);
    } catch {
      setMyIpError(
        'Could not detect your public IP. You may be offline or the service may be unreachable.'
      );
    } finally {
      setDetecting(false);
    }
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Network className="h-6 w-6" aria-hidden="true" />}
        title="IP lookup"
        description="Analyze any IPv4 or IPv6 address: version, classification, binary and decimal forms — all computed locally in your browser."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="ip-lookup-input"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              IP address
            </label>
            <input
              id="ip-lookup-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="192.168.1.1 or 2001:db8::1"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div className="flex items-end gap-2">
            <button
              type="button"
              onClick={() => {
                void detectMyIp();
              }}
              disabled={detecting}
              className="border-border text-muted-foreground hover:bg-muted hover:text-foreground inline-flex items-center gap-2 rounded-lg border px-3 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
            >
              <RefreshCw
                className={cn('h-4 w-4', detecting && 'animate-spin')}
                aria-hidden="true"
              />
              {detecting ? 'Detecting…' : 'Detect my IP'}
            </button>
          </div>
        </div>
        {myIp && (
          <p className="text-muted-foreground mt-3 flex flex-wrap items-center gap-2 text-sm">
            <Globe className="h-4 w-4" aria-hidden="true" />
            Your public IP:{' '}
            <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono">{myIp}</code>
            <CopyButton value={myIp} label="Copy" size="sm" />
          </p>
        )}
        {myIpError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{myIpError}</p>}
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
                    <th className="text-muted-foreground w-40 px-4 py-2.5 align-top text-xs font-semibold tracking-wider uppercase">
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
          Address details will appear here…
        </div>
      )}
    </div>
  );
};

IpLookup.displayName = 'IpLookup';

export { IpLookup };
