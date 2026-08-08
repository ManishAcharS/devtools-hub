'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { Timer } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { parseEpochInput, currentEpochValues, type EpochUnit } from '@/lib/tools/dates';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const UNITS: { value: EpochUnit; label: string; factor: number }[] = [
  { value: 'seconds', label: 'Seconds', factor: 1 },
  { value: 'milliseconds', label: 'Milliseconds', factor: 1000 },
  { value: 'microseconds', label: 'Microseconds', factor: 1_000_000 },
  { value: 'nanoseconds', label: 'Nanoseconds', factor: 1_000_000_000 },
];

const UnixTimeConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [unit, setUnit] = useState<EpochUnit>('seconds');
  const [now, setNow] = useState<Date>(() => new Date());

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 100);
    return () => clearInterval(timer);
  }, []);

  const nowValues = useMemo(() => currentEpochValues(now), [now]);

  const parsed = useMemo(() => parseEpochInput(input), [input]);
  const milliseconds = parsed.error ? null : parsed.milliseconds;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Timer className="h-6 w-6" aria-hidden="true" />}
        title="Unix time converter"
        description="See the current unix time live and convert between seconds, milliseconds, microseconds, and human-readable dates."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Current unix time
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {UNITS.map((item) => (
            <div key={item.value} className="bg-muted rounded-lg p-3">
              <p className="text-muted-foreground text-xs">{item.label}</p>
              <div className="mt-1 flex items-center justify-between gap-2">
                <code className="text-foreground font-mono text-sm">{nowValues[item.value]}</code>
                <CopyButton value={nowValues[item.value]} label="Copy" size="sm" iconOnly />
              </div>
            </div>
          ))}
        </div>
        <p className="text-muted-foreground mt-3 text-xs">Updates live. {nowValues.isoUtc}</p>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="unix-input"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Unix value
            </label>
            <input
              id="unix-input"
              type="text"
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="1767225600"
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-2.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Unit</span>
            <select
              value={unit}
              onChange={(event) => setUnit(event.target.value as EpochUnit)}
              className="border-border bg-background text-foreground rounded-md border px-2 py-1.5 text-sm"
            >
              {UNITS.map((item) => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </label>
        </div>
        <p className="text-muted-foreground mt-3 text-xs">
          {input.trim().length > 0 && !parsed.error
            ? `Detected as ${parsed.unit}.`
            : 'The unit is detected automatically from the number of digits.'}
        </p>
      </div>

      {parsed.error ? (
        <div className="rounded-xl border border-red-600/30 bg-red-600/5 p-4">
          <p className="text-sm text-red-700 dark:text-red-400">{parsed.error}</p>
        </div>
      ) : input.trim().length > 0 && milliseconds !== null ? (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="overflow-x-auto">
            <table className="w-full min-w-max border-collapse text-left text-sm">
              <tbody>
                {[
                  { label: 'Seconds', value: (milliseconds / 1000).toString() },
                  { label: 'Milliseconds', value: milliseconds.toString() },
                  { label: 'Microseconds', value: (milliseconds * 1000).toString() },
                  { label: 'Nanoseconds', value: (milliseconds * 1_000_000).toString() },
                  { label: 'UTC (ISO 8601)', value: new Date(milliseconds).toISOString() },
                  { label: 'Local (ISO 8601)', value: localIso(new Date(milliseconds)) },
                ].map((row) => (
                  <tr key={row.label} className="border-border border-b last:border-b-0">
                    <th className="text-muted-foreground w-56 px-4 py-2.5 text-xs font-semibold tracking-wider uppercase">
                      {row.label}
                    </th>
                    <td className="text-foreground px-4 py-2.5 font-mono break-all">{row.value}</td>
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
          Converted values will appear here…
        </div>
      )}
    </div>
  );
};

function localIso(date: Date): string {
  const pad = (value: number): string => value.toString().padStart(2, '0');
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}:${pad(date.getSeconds())}`;
}

UnixTimeConverter.displayName = 'UnixTimeConverter';

export { UnixTimeConverter };
