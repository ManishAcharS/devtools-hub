'use client';

import React, { useState } from 'react';
import { Search } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { lookupDns, type DnsLookupResult } from '@/lib/tools/network';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const RECORD_TYPES = ['A', 'AAAA', 'CNAME', 'MX', 'TXT', 'NS', 'SOA', 'SRV', 'PTR', 'HTTPS'];

const DnsLookup: React.FC<ToolComponentProps> = () => {
  const [hostname, setHostname] = useState('');
  const [recordType, setRecordType] = useState('A');
  const [result, setResult] = useState<DnsLookupResult | null>(null);
  const [loading, setLoading] = useState(false);

  const performLookup = async (): Promise<void> => {
    setLoading(true);
    setResult(null);
    try {
      const response = await lookupDns(hostname, recordType);
      setResult(response);
    } finally {
      setLoading(false);
    }
  };

  const submit = (event: React.FormEvent): void => {
    event.preventDefault();
    if (hostname.trim().length === 0) return;
    void performLookup();
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Search className="h-6 w-6" aria-hidden="true" />}
        title="DNS lookup"
        description="Resolve A, AAAA, CNAME, MX, TXT, and more records through Cloudflare's public DNS-over-HTTPS resolver — no server needed."
      />

      <form onSubmit={submit} className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="dns-hostname"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Hostname
            </label>
            <input
              id="dns-hostname"
              type="text"
              value={hostname}
              onChange={(event) => setHostname(event.target.value)}
              placeholder="example.com"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="dns-type"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Record type
            </label>
            <select
              id="dns-type"
              value={recordType}
              onChange={(event) => setRecordType(event.target.value)}
              className="border-border bg-background text-foreground mt-2 rounded-lg border px-3 py-2.5 font-mono text-sm"
            >
              {RECORD_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>
          <button
            type="submit"
            disabled={loading || hostname.trim().length === 0}
            className="bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium transition-colors disabled:opacity-60"
          >
            <Search className="h-4 w-4" aria-hidden="true" />
            {loading ? 'Looking up…' : 'Look up'}
          </button>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          Queries are sent to Cloudflare DNS (cloudflare-dns.com) over HTTPS. Your hostname is
          shared with the resolver.
        </p>
      </form>

      {loading && (
        <div className="bg-muted text-muted-foreground flex h-24 items-center justify-center rounded-xl px-4 text-sm italic">
          Querying DNS…
        </div>
      )}

      {result?.error && (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{result.error}</p>
        </div>
      )}

      {result && !result.error && result.records.length > 0 && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Records for {hostname.trim().toLowerCase()}
          </div>
          <div className="border-border overflow-x-auto rounded-lg border">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <thead>
                <tr className="bg-muted">
                  <th className="border-border text-foreground border-b px-4 py-2.5">Type</th>
                  <th className="border-border text-foreground border-b px-4 py-2.5">TTL</th>
                  <th className="border-border text-foreground border-b px-4 py-2.5">Value</th>
                  <th
                    className="border-border text-foreground border-b px-4 py-2.5"
                    aria-label="Copy"
                  />
                </tr>
              </thead>
              <tbody>
                {result.records.map((record, index) => (
                  <tr key={index} className={index % 2 === 1 ? 'bg-muted/40' : ''}>
                    <td className="border-border border-b px-4 py-2.5">
                      <code className="bg-muted text-foreground rounded px-1.5 py-0.5 font-mono text-xs">
                        {record.type}
                      </code>
                    </td>
                    <td className="text-muted-foreground border-border border-b px-4 py-2.5 font-mono">
                      {record.ttl}s
                    </td>
                    <td className="text-foreground border-border border-b px-4 py-2.5 font-mono text-xs break-all">
                      {record.data}
                    </td>
                    <td className="border-border w-px border-b px-3 py-2.5 whitespace-nowrap">
                      <CopyButton value={record.data} label="Copy" size="sm" iconOnly />
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

DnsLookup.displayName = 'DnsLookup';

export { DnsLookup };
