'use client';

import React, { useMemo, useState } from 'react';
import { CalendarPlus } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';

interface AdderResult {
  resultDate: Date | null;
  calendarDaysSkipped: number;
  weekendDaysSkipped: number;
  holidayDaysSkipped: number;
  error: string | null;
}

function parseHolidays(input: string): Date[] {
  return input
    .split(',')
    .map((item) => item.trim())
    .filter((item) => item.length > 0)
    .map((item) => new Date(`${item}T00:00:00`))
    .filter((date) => !Number.isNaN(date.getTime()));
}

function addWorkingDays(
  start: Date,
  count: number,
  skipWeekends: boolean,
  holidays: Date[]
): AdderResult {
  if (Number.isNaN(start.getTime())) {
    return {
      resultDate: null,
      calendarDaysSkipped: 0,
      weekendDaysSkipped: 0,
      holidayDaysSkipped: 0,
      error: 'Enter a valid start date.',
    };
  }
  if (!Number.isSafeInteger(count)) {
    return {
      resultDate: null,
      calendarDaysSkipped: 0,
      weekendDaysSkipped: 0,
      holidayDaysSkipped: 0,
      error: 'Enter a whole number of days.',
    };
  }
  const holidaySet = new Set(holidays.map((holiday) => holiday.toDateString()));
  const direction = count < 0 ? -1 : 1;
  const cursor = new Date(start.getFullYear(), start.getMonth(), start.getDate());
  let remaining = Math.abs(count);
  let weekendDaysSkipped = 0;
  let holidayDaysSkipped = 0;
  while (remaining > 0) {
    cursor.setDate(cursor.getDate() + direction);
    const weekday = cursor.getDay();
    const isWeekend = weekday === 0 || weekday === 6;
    const isHoliday = holidaySet.has(cursor.toDateString());
    if (isHoliday) {
      holidayDaysSkipped += 1;
    } else if (skipWeekends && isWeekend) {
      weekendDaysSkipped += 1;
    } else {
      remaining -= 1;
    }
  }
  return {
    resultDate: cursor,
    calendarDaysSkipped: Math.abs(count) + weekendDaysSkipped + holidayDaysSkipped,
    weekendDaysSkipped,
    holidayDaysSkipped,
    error: null,
  };
}

const WorkingDaysAdder: React.FC<ToolComponentProps> = () => {
  const [startValue, setStartValue] = useState('2026-08-10');
  const [daysValue, setDaysValue] = useState('5');
  const [holidaysValue, setHolidaysValue] = useState('');
  const [skipWeekends, setSkipWeekends] = useState(true);

  const result = useMemo(() => {
    const count = Number(daysValue.trim());
    const start = new Date(`${startValue}T00:00:00`);
    return addWorkingDays(start, count, skipWeekends, parseHolidays(holidaysValue));
  }, [startValue, daysValue, holidaysValue, skipWeekends]);

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CalendarPlus className="h-6 w-6" aria-hidden="true" />}
        title="Working days adder"
        description="Add or subtract a number of working days to a date, skipping weekends and optional holiday dates."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="adder-start"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Start date
            </label>
            <input
              id="adder-start"
              type="date"
              value={startValue}
              onChange={(event) => setStartValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="adder-days"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Working days (negative to subtract)
            </label>
            <input
              id="adder-days"
              type="text"
              inputMode="numeric"
              value={daysValue}
              onChange={(event) => setDaysValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="adder-holidays"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Holidays (comma-separated)
            </label>
            <input
              id="adder-holidays"
              type="text"
              value={holidaysValue}
              onChange={(event) => setHolidaysValue(event.target.value)}
              placeholder="2026-12-25, 2026-12-31"
              className={inputClass}
            />
          </div>
        </div>
        <label className="mt-4 flex cursor-pointer items-center gap-2 text-sm font-medium">
          <input
            type="checkbox"
            checked={skipWeekends}
            onChange={(event) => setSkipWeekends(event.target.checked)}
            className="accent-primary h-4 w-4"
          />
          Skip weekends
        </label>
      </div>

      {result.error && <p className="text-sm text-red-600 dark:text-red-400">{result.error}</p>}

      {!result.error && result.resultDate && (
        <>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Resulting date
            </p>
            <p className="mt-2 text-3xl font-bold">
              {result.resultDate.toLocaleDateString('en-US', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </div>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-3xl font-bold">{result.calendarDaysSkipped.toLocaleString()}</p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                calendar days passed
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-3xl font-bold">{result.weekendDaysSkipped.toLocaleString()}</p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                weekend days skipped
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-3xl font-bold">{result.holidayDaysSkipped.toLocaleString()}</p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                holidays skipped
              </p>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

WorkingDaysAdder.displayName = 'WorkingDaysAdder';

export { WorkingDaysAdder };
