'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Clock } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  currentEpochValues,
  formatHumanDate,
  formatLocalIso,
  formatRfc2822,
  formatUtcIso,
  getTimeZoneList,
  parseDateInput,
  timeZoneOffset,
} from '@/lib/tools/dates';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface OutputRow {
  label: string;
  value: string;
  copyValue: string;
}

const TimestampConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [timeZone, setTimeZone] = useState('UTC');
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const zones = useMemo(() => getTimeZoneList(), []);

  const parsed = useMemo(() => (input.trim().length === 0 ? null : parseDateInput(input)), [input]);

  const rows: OutputRow[] = useMemo(() => {
    if (!parsed || parsed.error) return [];
    const { date } = parsed;
    const epochSeconds = Math.floor(date.getTime() / 1000);
    return [
      { label: 'UTC (ISO 8601)', value: formatUtcIso(date), copyValue: formatUtcIso(date) },
      { label: 'Local time', value: formatLocalIso(date), copyValue: formatLocalIso(date) },
      { label: 'RFC 2822', value: formatRfc2822(date), copyValue: formatRfc2822(date) },
      { label: 'Human readable', value: formatHumanDate(date), copyValue: formatHumanDate(date) },
      {
        label: `Unix seconds (${timeZone})`,
        value: epochSeconds.toString(),
        copyValue: epochSeconds.toString(),
      },
      {
        label: 'Unix milliseconds',
        value: date.getTime().toString(),
        copyValue: date.getTime().toString(),
      },
    ];
  }, [parsed, timeZone]);

  const inZone = useMemo(() => {
    if (!parsed || parsed.error) return null;
    return {
      formatted: new Intl.DateTimeFormat('en-US', {
        dateStyle: 'full',
        timeStyle: 'medium',
        timeZone,
        hour12: false,
      }).format(parsed.date),
      offset: timeZoneOffset(parsed.date, timeZone),
    };
  }, [parsed, timeZone]);

  const nowValues = useMemo(() => currentEpochValues(now), [now]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Clock className="h-6 w-6" aria-hidden="true" />}
        title="Timestamp converter"
        description="Convert between unix timestamps and human-readable dates. Paste either side and the tool detects the format automatically."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Now
          </div>
          <div className="flex flex-wrap gap-x-6 gap-y-1 font-mono text-sm">
            <span suppressHydrationWarning>{nowValues.seconds}</span>
            <span suppressHydrationWarning>{nowValues.isoUtc}</span>
          </div>
        </div>
        <div className="bg-muted mt-3 h-px" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2">
          {[
            { label: 'Unix seconds', value: nowValues.seconds },
            { label: 'Milliseconds', value: nowValues.milliseconds },
          ].map((item) => (
            <div key={item.label} className="flex items-center justify-between gap-2">
              <span className="text-muted-foreground text-xs">{item.label}</span>
              <div className="flex items-center gap-2">
                <code suppressHydrationWarning className="text-foreground font-mono text-sm">
                  {item.value}
                </code>
                <CopyButton value={item.value} label="Copy" size="sm" iconOnly />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end justify-between gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="timestamp-input"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Timestamp or date
            </label>
            <input
              id="timestamp-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="1767225600 or 2026-08-08T10:30:00Z"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Timezone</span>
            <select
              value={timeZone}
              onChange={(event) => setTimeZone(event.target.value)}
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

      {parsed?.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{parsed.error}</p>
        </div>
      ) : rows.length > 0 ? (
        <div className="border-border bg-card rounded-xl border p-5">
          {parsed?.warning && (
            <p className="mb-3 text-sm text-amber-600 dark:text-amber-400">{parsed.warning}</p>
          )}
          {inZone && (
            <div className="bg-muted mb-4 flex flex-wrap items-center justify-between gap-2 rounded-lg px-4 py-3">
              <div>
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {timeZone}
                </p>
                <p className="text-foreground text-sm font-medium">{inZone.formatted}</p>
              </div>
              <code className="bg-background text-foreground border-border rounded-md border px-2 py-1 font-mono text-sm">
                {inZone.offset}
              </code>
            </div>
          )}
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <tbody>
                {rows.map((row) => (
                  <tr key={row.label} className="border-border border-b last:border-b-0">
                    <th className="text-muted-foreground w-56 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase">
                      {row.label}
                    </th>
                    <td className="text-foreground px-4 py-2.5 font-mono break-all">{row.value}</td>
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
          Converted values will appear here…
        </div>
      )}
    </div>
  );
};

TimestampConverter.displayName = 'TimestampConverter';

export { TimestampConverter };
