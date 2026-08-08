'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { dateDifference, fromLocalInputValue, toLocalInputValue } from '@/lib/tools/dates';
import { formatNumber } from '@/lib/tools/validate';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

interface ResultCard {
  label: string;
  value: string;
  copyValue: string;
}

const DateDifferenceCalculator: React.FC<ToolComponentProps> = () => {
  const [fromValue, setFromValue] = useState(() => toLocalInputValue(new Date()));
  const [toValue, setToValue] = useState(() =>
    toLocalInputValue(new Date(Date.now() + 86_400_000))
  );

  const result = useMemo(() => {
    const from = fromLocalInputValue(fromValue);
    const to = fromLocalInputValue(toValue);
    if (!from || !to) return null;
    return dateDifference(from, to);
  }, [fromValue, toValue]);

  const cards: ResultCard[] = useMemo(() => {
    if (!result) return [];
    const sign = result.sign === 1 ? '' : '−';
    const weeks = Math.floor(result.totalDays / 7);
    const daysInWeeks = result.totalDays % 7;
    return [
      {
        label: 'Total days',
        value: `${sign}${formatNumber(result.totalDays)}`,
        copyValue: result.totalDays.toString(),
      },
      {
        label: 'Total hours',
        value: `${sign}${formatNumber(result.totalHours)}`,
        copyValue: result.totalHours.toString(),
      },
      {
        label: 'Total minutes',
        value: `${sign}${formatNumber(result.totalMinutes)}`,
        copyValue: result.totalMinutes.toString(),
      },
      {
        label: 'Total seconds',
        value: `${sign}${formatNumber(result.totalSeconds)}`,
        copyValue: result.totalSeconds.toString(),
      },
      {
        label: 'Weeks and days',
        value: `${sign}${formatNumber(weeks)} wk ${daysInWeeks} d`,
        copyValue: `${result.sign === -1 ? '-' : ''}${weeks} weeks ${daysInWeeks} days`,
      },
      {
        label: 'Months',
        value: `${sign}${formatNumber(result.months)}`,
        copyValue: result.months.toString(),
      },
      {
        label: 'Years and months',
        value: `${sign}${formatNumber(result.years)} yr ${formatNumber(result.months % 12)} mo`,
        copyValue: `${result.sign === -1 ? '-' : ''}${result.years} years ${result.months % 12} months`,
      },
    ];
  }, [result]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
        title="Date difference calculator"
        description="Find the exact duration between two dates and times — in days, hours, minutes, seconds, weeks, months, and years."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label
              htmlFor="date-from"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              From
            </label>
            <input
              id="date-from"
              type="datetime-local"
              value={fromValue}
              onChange={(event) => setFromValue(event.target.value)}
              className="border-border bg-background text-foreground mt-2 w-full rounded-lg border px-4 py-2.5 text-sm"
            />
          </div>
          <div>
            <label
              htmlFor="date-to"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              To
            </label>
            <input
              id="date-to"
              type="datetime-local"
              value={toValue}
              onChange={(event) => setToValue(event.target.value)}
              className="border-border bg-background text-foreground mt-2 w-full rounded-lg border px-4 py-2.5 text-sm"
            />
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {[
            { label: '1 hour later', days: 0, hours: 1 },
            { label: '1 week later', days: 7, hours: 0 },
            { label: '1 month later', days: 30, hours: 0 },
            { label: '1 year later', days: 365, hours: 0 },
          ].map((preset) => (
            <button
              key={preset.label}
              type="button"
              onClick={() => {
                const from = fromLocalInputValue(fromValue) ?? new Date();
                setToValue(
                  toLocalInputValue(
                    new Date(from.getTime() + preset.days * 86_400_000 + preset.hours * 3_600_000)
                  )
                );
              }}
              className="border-border bg-background text-muted-foreground hover:text-foreground rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="space-y-4">
          {result.sign === -1 && (
            <div className="rounded-xl border border-amber-600/30 bg-amber-600/5 p-4">
              <p className="text-sm text-amber-700 dark:text-amber-400">
                The &quot;from&quot; date is after the &quot;to&quot; date, so the duration is shown
                with a minus sign.
              </p>
            </div>
          )}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {cards.map((card) => (
              <div key={card.label} className="border-border bg-card rounded-xl border p-5">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  {card.label}
                </p>
                <div className="mt-2 flex items-center justify-between gap-2">
                  <p className="text-foreground text-xl font-semibold">{card.value}</p>
                  <CopyButton value={card.copyValue} label="Copy" size="sm" iconOnly />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

DateDifferenceCalculator.displayName = 'DateDifferenceCalculator';

export { DateDifferenceCalculator };
