'use client';

import React, { useMemo, useState } from 'react';
import { FunctionSquare } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { factorial, factorialTrailingZeros, fibonacciTerms } from '@/lib/tools/sequences';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

type Tab = 'factorial' | 'fibonacci';

const FactorialFibonacciGenerator: React.FC<ToolComponentProps> = () => {
  const [tab, setTab] = useState<Tab>('factorial');
  const [nValue, setNValue] = useState('25');
  const [fibValue, setFibValue] = useState('20');

  const factorialResult = useMemo(() => {
    const trimmed = nValue.trim();
    if (trimmed.length === 0) return { value: null, error: null, zeros: 0 };
    if (!/^\d+$/.test(trimmed)) {
      return { value: null, error: 'Enter a whole number.', zeros: 0 };
    }
    const n = Number(trimmed);
    if (!Number.isSafeInteger(n) || n > 100_000) {
      return { value: null, error: 'Enter a whole number up to 100,000.', zeros: 0 };
    }
    const value = factorial(n);
    const approximate = Number(value);
    return {
      value,
      error: null,
      zeros: factorialTrailingZeros(value),
      approximate: Number.isFinite(approximate)
        ? approximate.toExponential(4)
        : `10^${value.toString().length - 1}`,
    };
  }, [nValue]);

  const fibonacciResult = useMemo(() => {
    const trimmed = fibValue.trim();
    const n = Number(trimmed);
    if (!/^\d+$/.test(trimmed) || !Number.isSafeInteger(n) || n < 1 || n > 500) {
      return { terms: [], error: 'Enter a count between 1 and 500.', summary: '' };
    }
    const terms = fibonacciTerms(n);
    return {
      terms,
      error: null,
      summary: `F(${n - 1}) = ${terms[n - 1]?.toString() ?? '0'}`,
    };
  }, [fibValue]);

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FunctionSquare className="h-6 w-6" aria-hidden="true" />}
        title="Factorial & Fibonacci generator"
        description="Compute exact factorials with BigInt and generate Fibonacci sequences up to 500 terms."
      />
      <div className="flex flex-wrap gap-2">
        {(
          [
            { id: 'factorial', label: 'Factorial' },
            { id: 'fibonacci', label: 'Fibonacci' },
          ] as { id: Tab; label: string }[]
        ).map((option) => (
          <button
            key={option.id}
            type="button"
            onClick={() => setTab(option.id)}
            aria-pressed={tab === option.id}
            className={cn(
              'rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors',
              tab === option.id
                ? 'border-primary bg-primary text-primary-foreground'
                : 'border-border bg-background text-muted-foreground hover:text-foreground'
            )}
          >
            {option.label}
          </button>
        ))}
      </div>

      {tab === 'factorial' ? (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="max-w-xs">
            <label
              htmlFor="factorial-n"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              n (0 to 100,000)
            </label>
            <input
              id="factorial-n"
              type="text"
              inputMode="numeric"
              value={nValue}
              onChange={(event) => setNValue(event.target.value)}
              className={inputClass}
            />
          </div>
          {factorialResult.error ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{factorialResult.error}</p>
          ) : (
            factorialResult.value !== null && (
              <div className="mt-5 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                    {nValue}! (exact)
                  </p>
                  <CopyButton value={factorialResult.value.toString()} label="Copy" size="sm" />
                </div>
                <pre className="bg-muted text-foreground max-h-64 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
                  {factorialResult.value.toString()}
                </pre>
                <div className="grid gap-4 sm:grid-cols-3">
                  <div className="border-border bg-background rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold">
                      {factorialResult.value.toString().length.toLocaleString()}
                    </p>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      digits
                    </p>
                  </div>
                  <div className="border-border bg-background rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold">{factorialResult.zeros.toLocaleString()}</p>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      trailing zeros
                    </p>
                  </div>
                  <div className="border-border bg-background rounded-lg border p-4 text-center">
                    <p className="text-2xl font-bold">{factorialResult.approximate}</p>
                    <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                      approximate
                    </p>
                  </div>
                </div>
              </div>
            )
          )}
        </div>
      ) : (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="max-w-xs">
            <label
              htmlFor="fibonacci-count"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Term count (1 to 500)
            </label>
            <input
              id="fibonacci-count"
              type="text"
              inputMode="numeric"
              value={fibValue}
              onChange={(event) => setFibValue(event.target.value)}
              className={inputClass}
            />
          </div>
          {fibonacciResult.error ? (
            <p className="mt-4 text-sm text-red-600 dark:text-red-400">{fibonacciResult.error}</p>
          ) : (
            <div className="mt-5 space-y-4">
              <div className="flex items-start justify-between gap-4">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  Fibonacci terms
                </p>
                <CopyButton value={fibonacciResult.terms.join(', ')} label="Copy" size="sm" />
              </div>
              <pre className="bg-muted text-foreground max-h-64 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
                {fibonacciResult.terms.join(', ')}
              </pre>
              <p className="text-muted-foreground font-mono text-sm">{fibonacciResult.summary}</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

FactorialFibonacciGenerator.displayName = 'FactorialFibonacciGenerator';

export { FactorialFibonacciGenerator };
