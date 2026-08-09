'use client';

import React, { useMemo, useState } from 'react';
import { Cake } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { ageFromDate } from '@/lib/tools/dates';
import { SectionHeading } from '@/components/shared/section-heading';
import { toLocalInputValue } from '@/lib/tools/dates';

const AgeCalculator: React.FC<ToolComponentProps> = () => {
  const [birthValue, setBirthValue] = useState('2000-01-01');

  const result = useMemo(() => {
    const birthDate = new Date(`${birthValue}T00:00:00`);
    if (Number.isNaN(birthDate.getTime())) {
      return {
        years: 0,
        months: 0,
        days: 0,
        totalDays: 0,
        totalWeeks: 0,
        totalHours: 0,
        nextBirthdayInDays: 0,
        error: 'Enter a valid birth date.',
      };
    }
    return ageFromDate(birthDate);
  }, [birthValue]);

  const isError = result.error !== null;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Cake className="h-6 w-6" aria-hidden="true" />}
        title="Age calculator"
        description="Calculate your exact age in years, months, and days, plus totals in weeks, days, and hours."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="birth-date"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Birth date
        </label>
        <input
          id="birth-date"
          type="date"
          value={birthValue}
          max={toLocalInputValue(new Date()).slice(0, 10)}
          onChange={(event) => setBirthValue(event.target.value)}
          className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        {isError && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{result.error}</p>}
      </div>

      {!isError && (
        <>
          <div className="grid grid-cols-3 gap-4">
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-3xl font-bold">{result.years}</p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                years
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-3xl font-bold">{result.months}</p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                months
              </p>
            </div>
            <div className="border-border bg-card rounded-xl border p-5 text-center">
              <p className="text-3xl font-bold">{result.days}</p>
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                days
              </p>
            </div>
          </div>
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Totals
            </p>
            <dl className="mt-3 grid gap-x-6 gap-y-2 text-sm sm:grid-cols-2">
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total days</dt>
                <dd className="font-mono">{result.totalDays.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total weeks</dt>
                <dd className="font-mono">{result.totalWeeks.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Total hours</dt>
                <dd className="font-mono">{result.totalHours.toLocaleString()}</dd>
              </div>
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Next birthday in</dt>
                <dd className="font-mono">{result.nextBirthdayInDays.toLocaleString()} days</dd>
              </div>
            </dl>
          </div>
        </>
      )}
    </div>
  );
};

AgeCalculator.displayName = 'AgeCalculator';

export { AgeCalculator };
