'use client';

import React, { useMemo, useState } from 'react';
import { Calculator } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { solveQuadratic, type ComplexRoot } from '@/lib/tools/quadratic';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';

function formatCoefficient(value: string): number | null {
  const trimmed = value.trim();
  if (trimmed.length === 0) return 0;
  const parsed = Number(trimmed);
  return Number.isFinite(parsed) ? parsed : null;
}

function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-US', { maximumFractionDigits: 6 }).format(value);
}

function complexText(root: ComplexRoot): string {
  if (Math.abs(root.imaginary) <= 1e-10) return formatNumber(root.real);
  const sign = root.imaginary < 0 ? '-' : '+';
  return `${formatNumber(root.real)} ${sign} ${formatNumber(Math.abs(root.imaginary))}i`;
}

const QuadraticSolver: React.FC<ToolComponentProps> = () => {
  const [aValue, setAValue] = useState('1');
  const [bValue, setBValue] = useState('-5');
  const [cValue, setCValue] = useState('6');

  const solution = useMemo(() => {
    const a = formatCoefficient(aValue);
    const b = formatCoefficient(bValue);
    const c = formatCoefficient(cValue);
    if (a === null || b === null || c === null) return null;
    return solveQuadratic(a, b, c);
  }, [aValue, bValue, cValue]);

  const summary = useMemo(() => {
    if (!solution) return '';
    if (solution.kind === 'degenerate') return solution.note;
    if (solution.kind === 'linear') return `x = ${formatNumber(solution.roots[0])}`;
    if (solution.kind === 'repeated') return `x = ${formatNumber(solution.roots[0])} (repeated)`;
    if (solution.kind === 'complex') {
      return `x = ${complexText(solution.roots[0])} or x = ${complexText(solution.roots[1])}`;
    }
    return `x = ${formatNumber(solution.roots[0])} or x = ${formatNumber(solution.roots[1])}`;
  }, [solution]);

  const inputClass =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Calculator className="h-6 w-6" aria-hidden="true" />}
        title="Quadratic equation solver"
        description="Solve ax² + bx + c = 0 with real or complex roots, shown with the discriminant and every step."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid grid-cols-3 gap-4">
          <div>
            <label
              htmlFor="quadratic-a"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              a
            </label>
            <input
              id="quadratic-a"
              type="text"
              inputMode="decimal"
              value={aValue}
              onChange={(event) => setAValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="quadratic-b"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              b
            </label>
            <input
              id="quadratic-b"
              type="text"
              inputMode="decimal"
              value={bValue}
              onChange={(event) => setBValue(event.target.value)}
              className={inputClass}
            />
          </div>
          <div>
            <label
              htmlFor="quadratic-c"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              c
            </label>
            <input
              id="quadratic-c"
              type="text"
              inputMode="decimal"
              value={cValue}
              onChange={(event) => setCValue(event.target.value)}
              className={inputClass}
            />
          </div>
        </div>
        <p className="text-muted-foreground mt-4 text-center font-mono text-lg">
          {aValue.trim() || 'a'}x² + {bValue.trim() || 'b'}x + {cValue.trim() || 'c'} = 0
        </p>
      </div>

      {solution && (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Solution
              </p>
              <CopyButton value={summary} label="Copy" size="sm" />
            </div>
            <p className="text-foreground mt-3 text-xl font-semibold break-all">{summary}</p>
            {solution.discriminant !== null && (
              <p className="text-muted-foreground mt-1 text-sm">
                Discriminant D = {formatNumber(solution.discriminant)}
              </p>
            )}
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Steps
            </p>
            <ol className="text-muted-foreground mt-3 list-inside list-decimal space-y-1.5 text-sm">
              {solution.steps.map((step) => (
                <li key={step} className="text-foreground font-mono text-sm break-all">
                  {step}
                </li>
              ))}
            </ol>
          </div>
        </>
      )}
    </div>
  );
};

QuadraticSolver.displayName = 'QuadraticSolver';

export { QuadraticSolver };
