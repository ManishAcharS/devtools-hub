'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Earth } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  formatInTimeZone,
  fromLocalInputValue,
  getTimeZoneList,
  timeZoneOffset,
  toLocalInputValue,
} from '@/lib/tools/dates';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface ZoneResult {
  zone: string;
  formatted: string;
  offset: string;
}

const TimezoneConverter: React.FC<ToolComponentProps> = () => {
  const [value, setValue] = useState(() => toLocalInputValue(new Date()));
  const [zoneA, setZoneA] = useState('UTC');
  const [zoneB, setZoneB] = useState('America/New_York');
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => getTimeZoneList(), []);

  const date = useMemo(() => fromLocalInputValue(value), [value]);

  const results: ZoneResult[] = useMemo(() => {
    if (!date) return [];
    return [
      {
        zone: zoneA,
        formatted: formatInTimeZone(date, zoneA),
        offset: timeZoneOffset(date, zoneA),
      },
      {
        zone: zoneB,
        formatted: formatInTimeZone(date, zoneB),
        offset: timeZoneOffset(date, zoneB),
      },
    ];
  }, [date, zoneA, zoneB]);

  const nowResults: ZoneResult[] = useMemo(
    () => [
      { zone: zoneA, formatted: formatInTimeZone(now, zoneA), offset: timeZoneOffset(now, zoneA) },
      { zone: zoneB, formatted: formatInTimeZone(now, zoneB), offset: timeZoneOffset(now, zoneB) },
    ],
    [now, zoneA, zoneB]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Earth className="h-6 w-6" aria-hidden="true" />}
        title="Timezone converter"
        description="Convert any moment between timezones and watch live clocks for both zones side by side."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="tz-datetime"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Date and time
            </label>
            <input
              id="tz-datetime"
              type="datetime-local"
              value={value}
              onChange={(event) => setValue(event.target.value)}
              className="border-border bg-background text-foreground mt-2 w-full rounded-lg border px-4 py-2.5 text-sm"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <label className="text-muted-foreground flex flex-col gap-2 text-sm">
              <span>From zone</span>
              <select
                value={zoneA}
                onChange={(event) => setZoneA(event.target.value)}
                className="border-border bg-background text-foreground rounded-md border px-2 py-1.5 text-sm"
              >
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>
            <label className="text-muted-foreground flex flex-col gap-2 text-sm">
              <span>To zone</span>
              <select
                value={zoneB}
                onChange={(event) => setZoneB(event.target.value)}
                className="border-border bg-background text-foreground rounded-md border px-2 py-1.5 text-sm"
              >
                {zones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </div>
      </div>

      {!date && (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">That date and time is not valid.</p>
        </div>
      )}

      {date && (
        <div className="grid gap-4 sm:grid-cols-2">
          {results.map((result) => (
            <div key={result.zone} className="border-border bg-card rounded-xl border p-5">
              <div className="flex items-center justify-between">
                <p className="text-foreground font-semibold">{result.zone}</p>
                <code className="bg-muted text-muted-foreground rounded-md px-2 py-1 font-mono text-xs">
                  {result.offset}
                </code>
              </div>
              <p className="text-foreground mt-2 text-lg font-medium">{result.formatted}</p>
              <p className="text-muted-foreground mt-1 text-xs">
                Same instant in the source zone:{' '}
                {formatInTimeZone(date, zoneA === result.zone ? zoneB : zoneA)}
              </p>
              <div className="mt-3">
                <CopyButton value={result.formatted} label="Copy time" size="sm" />
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Live clocks
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {nowResults.map((result) => (
            <div
              key={result.zone}
              className="bg-muted flex items-center justify-between rounded-lg px-4 py-3"
            >
              <div>
                <p className="text-foreground text-sm font-medium">{result.zone}</p>
                <p className="text-muted-foreground text-xs">{result.offset}</p>
              </div>
              <p className="text-foreground font-mono text-sm">{result.formatted}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TimezoneConverter.displayName = 'TimezoneConverter';

export { TimezoneConverter };
