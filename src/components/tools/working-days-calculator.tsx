'use client';

import React, { useMemo, useState } from 'react';
import { CalendarDays } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { workingDaysBetween } from '@/lib/tools/dates';
import { SectionHeading } from '@/components/shared/section-heading';

const WorkingDaysCalculator: React.FC<ToolComponentProps> = () => {
  const [from, setFrom] = useState('2026-01-01');
  const [to, setTo] = useState('2026-01-31');
  const [excludeWeekends, setExcludeWeekends] = useState(true);

  const result = useMemo(
    () => workingDaysBetween(new Date(from), new Date(to), excludeWeekends, []),
    [from, to, excludeWeekends]
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CalendarDays className="h-6 w-6" aria-hidden="true" />}
        title="Working days calculator"
        description="Count working days between two dates, excluding weekends and holidays."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="from-date"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Start date
            </label>
            <input
              id="from-date"
              type="date"
              value={from}
              onChange={(event) => setFrom(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="to-date"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              End date
            </label>
            <input
              id="to-date"
              type="date"
              value={to}
              onChange={(event) => setTo(event.target.value)}
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="exclude-weekends"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Options
            </label>
            <label className="mt-2 flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                id="exclude-weekends"
                type="checkbox"
                checked={excludeWeekends}
                onChange={(event) => setExcludeWeekends(event.target.checked)}
                className="accent-primary h-4 w-4"
              />
              Exclude weekends
            </label>
          </div>
        </div>
        {result.error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{result.error}</p>
        )}
      </div>

      {result.calendarDays > 0 && (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{result.calendarDays.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              calendar days
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{result.workingDays.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              working days
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{result.weekendDays.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              weekend days
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5 text-center">
            <p className="text-3xl font-bold">{result.holidayDays.toLocaleString()}</p>
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              holiday days
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

WorkingDaysCalculator.displayName = 'WorkingDaysCalculator';

export { WorkingDaysCalculator };
