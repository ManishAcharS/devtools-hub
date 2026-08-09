'use client';

import React, { useEffect, useState } from 'react';
import { Wifi, MapPin, Globe, Shield, Copy, RefreshCw, Loader2, AlertTriangle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { cn } from '@/lib/utils';

interface IpInfo {
  ip: string;
  city: string;
  region: string;
  country: string;
  countryCode: string;
  isp: string;
  org: string;
  as: string;
  lat: number;
  lon: number;
  timezone: string;
  query: string;
}

const WhatIsMyIp: React.FC<ToolComponentProps> = () => {
  const [data, setData] = useState<IpInfo | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [history, setHistory] = useState<IpInfo[]>(() => {
    if (typeof window !== 'undefined') {
      try {
        const stored = localStorage.getItem('ip-history');
        return stored ? JSON.parse(stored) : [];
      } catch {
        return [];
      }
    }
    return [];
  });

  const fetchIp = async (url = 'https://ipapi.co/json/') => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url);
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const json = await response.json();
      if (json.error) throw new Error(json.reason ?? 'API error');
      setData(json);
      setHistory((prev) => [json, ...prev.filter((h) => h.ip !== json.ip)].slice(0, 10));
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    fetchIp();
    const saved = localStorage.getItem('ip-history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch {}
    }
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('ip-history', JSON.stringify(history));
    }
  }, [history]);

  const copyIp = () => data?.ip && navigator.clipboard.writeText(data.ip);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Wifi className="h-6 w-6" aria-hidden="true" />}
        title="What's my IP"
        description="See your public IP address, location, ISP, and network details."
      />
      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={() => fetchIp()}
          disabled={loading}
          className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          {loading ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4" />
          )}
          Refresh
        </button>
        <button
          type="button"
          onClick={() => fetchIp('https://api.ipify.org?format=json')}
          disabled={loading}
          className="border-border bg-background hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
        >
          <Globe className="h-4 w-4" />
          Alternative API
        </button>
      </div>

      {error && (
        <div className="border-border rounded-xl border border-red-500/20 bg-red-500/10 p-4">
          <p className="flex items-center gap-2 text-sm text-red-600 dark:text-red-400">
            <AlertTriangle className="h-4 w-4" />
            {error}
          </p>
        </div>
      )}

      {data && (
        <>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                Public IP
              </p>
              <div className="flex items-center justify-center gap-2">
                <p className="font-mono text-2xl font-bold break-all">{data.ip}</p>
                <CopyButton value={data.ip} iconOnly size="sm" />
              </div>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                Location
              </p>
              <p className="text-lg font-medium">
                {data.city}, {data.region}
              </p>
              <p className="text-muted-foreground text-sm">
                {data.country} ({data.countryCode})
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                ISP
              </p>
              <p className="truncate text-lg font-medium">{data.isp}</p>
              <p className="text-muted-foreground truncate text-sm">{data.org}</p>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                ASN
              </p>
              <p className="text-lg font-medium">{data.as}</p>
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
              Details
            </p>
            <dl className="grid gap-x-8 gap-y-3 text-sm sm:grid-cols-2 lg:grid-cols-4">
              <div>
                <dt className="text-muted-foreground">Timezone</dt>
                <dd className="font-mono">{data.timezone}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Coordinates</dt>
                <dd className="font-mono">
                  {data.lat.toFixed(4)}, {data.lon.toFixed(4)}
                </dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Country code</dt>
                <dd className="font-mono">{data.countryCode}</dd>
              </div>
              <div>
                <dt className="text-muted-foreground">Queried IP</dt>
                <dd className="font-mono">{data.query}</dd>
              </div>
            </dl>
          </div>

          {history.length > 1 && (
            <div className="border-border bg-card rounded-xl border p-5">
              <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
                Recent checks
              </p>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-border border-b">
                      <th className="text-muted-foreground p-2 text-left font-medium">IP</th>
                      <th className="text-muted-foreground p-2 text-left font-medium">Location</th>
                      <th className="text-muted-foreground p-2 text-left font-medium">ISP</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.slice(0, 5).map((item, i) => (
                      <tr key={item.ip} className="border-border/50 border-b">
                        <td className="p-2 font-mono">{item.ip}</td>
                        <td className="p-2">
                          {item.city}, {item.countryCode}
                        </td>
                        <td className="max-w-[200px] truncate p-2">{item.isp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
};

WhatIsMyIp.displayName = 'WhatIsMyIp';

export { WhatIsMyIp };
