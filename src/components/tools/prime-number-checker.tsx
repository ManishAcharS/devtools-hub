'use client';

import React, { useMemo, useState } from 'react';
import { Sigma } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { checkPrime, isPrime } from '@/lib/tools/numbers';
import { SectionHeading } from '@/components/shared/section-heading';

const PrimeNumberChecker: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    const trimmed = input.trim();
    if (trimmed.length === 0) return null;
    const value = Number(trimmed);
    if (!Number.isInteger(value)) {
      return {
        value: null,
        verdict: 'error',
        message: 'Enter a whole number to test for primality.',
      };
    }
    if (!Number.isSafeInteger(value) || value < 0) {
      return { value: null, verdict: 'error', message: 'The number is too large or out of range.' };
    }
    return { value, verdict: isPrime(value) ? 'prime' : 'composite', message: '' };
  }, [input]);

  const factors = useMemo(() => {
    if (!result || result.verdict === 'error' || result.value === null) return null;
    return checkPrime(result.value).factors;
  }, [result]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Sigma className="h-6 w-6" aria-hidden="true" />}
        title="Prime number checker"
        description="Test any whole number for primality and see its prime factorization."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="prime-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Number
        </label>
        <input
          id="prime-input"
          type="text"
          inputMode="numeric"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Enter a whole number, e.g. 97"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      {result && result.verdict !== 'error' && result.value !== null && (
        <div
          className={`rounded-xl border p-5 ${
            result.verdict === 'prime'
              ? 'border-emerald-500/30 bg-emerald-500/10'
              : 'border-amber-500/30 bg-amber-500/10'
          }`}
        >
          <p className="text-lg font-semibold">
            {result.value.toLocaleString()} is{' '}
            <span
              className={
                result.verdict === 'prime'
                  ? 'text-emerald-600 dark:text-emerald-400'
                  : 'text-amber-600 dark:text-amber-400'
              }
            >
              {result.verdict === 'prime' ? 'a prime number' : 'a composite number'}
            </span>
          </p>
          {result.verdict === 'composite' && factors && factors.length > 0 && (
            <p className="text-muted-foreground mt-2 text-sm">
              Prime factorization:{' '}
              <span className="font-mono">
                {factors
                  .map(({ factor, exponent }) =>
                    exponent > 1 ? `${factor}^${exponent}` : `${factor}`
                  )
                  .join(' × ')}
              </span>
            </p>
          )}
          {result.verdict === 'prime' && (
            <p className="text-muted-foreground mt-2 text-sm">
              It has exactly two divisors: 1 and itself.
            </p>
          )}
        </div>
      )}

      {result && result.verdict === 'error' && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-sm text-red-600 dark:text-red-400">{result.message}</p>
        </div>
      )}
    </div>
  );
};

PrimeNumberChecker.displayName = 'PrimeNumberChecker';

export { PrimeNumberChecker };
