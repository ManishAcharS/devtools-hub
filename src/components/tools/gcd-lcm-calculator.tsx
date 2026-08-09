'use client';

import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { gcdAll, lcmAll } from '@/lib/tools/numbers';
import { SectionHeading } from '@/components/shared/section-heading';

const GcdLcmCalculator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('12, 18');

  const result = useMemo(() => {
    const values = input
      .split(/[\s,]+/)
      .map((part) => Number(part.trim()))
      .filter((value) => Number.isFinite(value));
    if (values.length === 0) {
      return { values: [], gcd: null, lcm: null, error: 'Enter at least two numbers.' };
    }
    if (!values.every((value) => Number.isInteger(value))) {
      return { values, gcd: null, lcm: null, error: 'Only whole numbers are supported.' };
    }
    if (values.some((value) => !Number.isSafeInteger(Math.abs(value)))) {
      return { values, gcd: null, lcm: null, error: 'One of the numbers is too large.' };
    }
    if (values.length < 2) {
      return {
        values,
        gcd: null,
        lcm: null,
        error: 'Enter at least two numbers, e.g. 12, 18, 24.',
      };
    }
    return { values, gcd: gcdAll(values), lcm: lcmAll(values), error: null };
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Calculator className="h-6 w-6" aria-hidden="true" />}
        title="GCD & LCM calculator"
        description="Find the greatest common divisor and least common multiple of any set of numbers."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="gcd-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Numbers
        </label>
        <input
          id="gcd-input"
          type="text"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="12, 18, 24"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-2 text-xs">
          Separate numbers with commas or spaces.
        </p>
        {result.error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{result.error}</p>
        )}
      </div>

      {result.gcd !== null && result.lcm !== null && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Greatest common divisor
            </p>
            <p className="mt-2 text-3xl font-bold">{result.gcd.toLocaleString()}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              The largest number that divides {result.values.join(', ')} exactly.
            </p>
          </div>
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Least common multiple
            </p>
            <p className="mt-2 text-3xl font-bold">{result.lcm.toLocaleString()}</p>
            <p className="text-muted-foreground mt-1 text-xs">
              The smallest number that all of them divide exactly.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

GcdLcmCalculator.displayName = 'GcdLcmCalculator';

export { GcdLcmCalculator };
