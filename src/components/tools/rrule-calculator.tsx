'use client';

import React, { useMemo, useState } from 'react';
import { Repeat } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  buildRrule,
  expandRrule,
  formatRruleDate,
  type RruleFreq,
  type Weekday,
} from '@/lib/tools/rrule';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

const FREQ_OPTIONS: { id: RruleFreq; label: string }[] = [
  { id: 'daily', label: 'Daily' },
  { id: 'weekly', label: 'Weekly' },
  { id: 'monthly', label: 'Monthly' },
  { id: 'yearly', label: 'Yearly' },
];

const WEEKDAYS: { id: Weekday; label: string }[] = [
  { id: 'MO', label: 'Mo' },
  { id: 'TU', label: 'Tu' },
  { id: 'WE', label: 'We' },
  { id: 'TH', label: 'Th' },
  { id: 'FR', label: 'Fr' },
  { id: 'SA', label: 'Sa' },
  { id: 'SU', label: 'Su' },
];

const RruleCalculator: React.FC<ToolComponentProps> = () => {
  const [freq, setFreq] = useState<RruleFreq>('weekly');
  const [intervalValue, setIntervalValue] = useState('2');
  const [byDay, setByDay] = useState<Weekday[]>(['MO']);
  const [countValue, setCountValue] = useState('10');
  const [startValue, setStartValue] = useState('2026-08-10');

  const { interval, count, startDate } = useMemo(() => {
    const parsedInterval = Number(intervalValue.trim());
    const parsedCount = Number(countValue.trim());
    const parsedStart = new Date(`${startValue}T00:00:00Z`);
    return {
      interval: Number.isInteger(parsedInterval) && parsedInterval >= 1 ? parsedInterval : 1,
      count:
        Number.isInteger(parsedCount) && parsedCount >= 1 && parsedCount <= 1000 ? parsedCount : 10,
      startDate: Number.isNaN(parsedStart.getTime()) ? new Date() : parsedStart,
    };
  }, [intervalValue, countValue, startValue]);

  const rrule = useMemo(
    () =>
      buildRrule({
        freq,
        interval,
        byDay: freq === 'weekly' ? byDay : [],
        count,
      }),
    [freq, interval, byDay, count]
  );

  const occurrences = useMemo(() => expandRrule(rrule, startDate, 10), [rrule, startDate]);

  const toggleDay = (day: Weekday) => {
    setByDay((previous) =>
      previous.includes(day)
        ? previous.filter((candidate) => candidate !== day)
        : [...previous, day]
    );
  };

  const inputClass =
    'border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-3 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Repeat className="h-6 w-6" aria-hidden="true" />}
        title="Recurring event (RRULE) calculator"
        description="Build RFC 5545 recurrence rules for daily, weekly, monthly, and yearly events, then preview the first occurrence dates."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <label
              htmlFor="rrule-freq"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Frequency
            </label>
            <select
              id="rrule-freq"
              value={freq}
              onChange={(event) => setFreq(event.target.value as RruleFreq)}
              className={inputClass}
            >
              {FREQ_OPTIONS.map((option) => (
                <option key={option.id} value={option.id}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label
              htmlFor="rrule-interval"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Every N
            </label>
            <input
              id="rrule-interval"
              type="text"
              inputMode="numeric"
              value={intervalValue}
              onChange={(event) => setIntervalValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="rrule-count"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Occurrences
            </label>
            <input
              id="rrule-count"
              type="text"
              inputMode="numeric"
              value={countValue}
              onChange={(event) => setCountValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="rrule-start"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Start date
            </label>
            <input
              id="rrule-start"
              type="date"
              value={startValue}
              onChange={(event) => setStartValue(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>

        {freq === 'weekly' && (
          <div className="mt-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Repeat on
            </p>
            <div className="mt-2 flex flex-wrap gap-2">
              {WEEKDAYS.map((day) => (
                <button
                  key={day.id}
                  type="button"
                  onClick={() => toggleDay(day.id)}
                  aria-pressed={byDay.includes(day.id)}
                  className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors ${
                    byDay.includes(day.id)
                      ? 'border-primary bg-primary text-primary-foreground'
                      : 'border-border bg-background text-muted-foreground hover:text-foreground'
                  }`}
                >
                  {day.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            RRULE
          </p>
          <CopyButton value={rrule} label="Copy" size="sm" />
        </div>
        <pre className="bg-muted text-foreground mt-3 overflow-x-auto rounded-lg px-4 py-3 font-mono text-sm">
          {rrule}
        </pre>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          First 10 occurrences
        </p>
        <ul className="mt-3 grid gap-x-6 gap-y-1.5 text-sm sm:grid-cols-2">
          {occurrences.map((date, index) => (
            <li key={date.toISOString()} className="flex items-center justify-between gap-3">
              <span className="text-muted-foreground w-6 font-mono">{index + 1}.</span>
              <span className="flex-1 font-mono">{formatRruleDate(date)}</span>
              <CopyButton value={date.toISOString().slice(0, 10)} label="Copy" size="sm" iconOnly />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

RruleCalculator.displayName = 'RruleCalculator';

export { RruleCalculator };
