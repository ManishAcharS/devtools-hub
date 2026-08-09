'use client';

import React, { useMemo, useState } from 'react';
import { Scale } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  calculateSpecificity,
  compareSpecificity,
  type SpecificityResult,
} from '@/lib/tools/css-spec';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { cn } from '@/lib/utils';

function formatBreakdown(result: SpecificityResult): string {
  const lines = [
    `Specificity: (${result.a}, ${result.b}, ${result.c})`,
    `Score: ${result.score}`,
    '',
  ];
  for (const part of result.parts) {
    lines.push(`${part.raw.padEnd(32)}( ${part.a}, ${part.b}, ${part.c} )`);
  }
  return lines.join('\n');
}

function compareText(value: -1 | 0 | 1): string {
  if (value === 1) return 'A beats B';
  if (value === -1) return 'B beats A';
  return 'Equal specificity';
}

const CSS_SELECTOR_PLACEHOLDER = '.header > nav ul li:hover, #main a[href^="/"]';

const CSSSpecificityCalculator: React.FC<ToolComponentProps> = () => {
  const [selectorA, setSelectorA] = useState('');
  const [selectorB, setSelectorB] = useState('');

  const resultA = useMemo(() => calculateSpecificity(selectorA), [selectorA]);
  const resultB = useMemo(() => calculateSpecificity(selectorB), [selectorB]);
  const comparison = useMemo(
    () => (selectorB.trim() ? compareSpecificity(resultA, resultB) : null),
    [selectorB, resultA, resultB]
  );

  const chipClasses = (kind: 'a' | 'b' | 'c') =>
    cn(
      'rounded-md px-2 py-1 font-mono text-xs font-semibold',
      kind === 'a' && 'bg-blue-500/15 text-blue-600 dark:text-blue-400',
      kind === 'b' && 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400',
      kind === 'c' && 'bg-amber-500/15 text-amber-600 dark:text-amber-400'
    );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Scale className="h-6 w-6" aria-hidden="true" />}
        title="CSS specificity calculator"
        description="Calculate the specificity (a, b, c) of any CSS selector, see the score and per-token breakdown, and compare two selectors."
      />

      <TransformPanel
        inputId="specificity-selector"
        inputValue={selectorA}
        onInputChange={setSelectorA}
        inputLabel="Selector"
        inputPlaceholder="Paste a CSS selector, e.g. .header > nav ul li:hover"
        outputValue={selectorA.trim() ? formatBreakdown(resultA) : ''}
        outputLabel="Specificity breakdown"
        outputPlaceholder="The (a, b, c) breakdown will appear here…"
        fileName="specificity.txt"
        stats={
          selectorA.trim()
            ? [
                { label: 'IDs', value: String(resultA.a) },
                { label: 'Classes', value: String(resultA.b) },
                { label: 'Elements', value: String(resultA.c) },
                { label: 'Score', value: String(resultA.score) },
              ]
            : undefined
        }
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
          Compare with a second selector
        </p>
        <div className="flex flex-wrap items-end gap-3">
          <div className="min-w-0 flex-1">
            <label
              htmlFor="specificity-b"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Selector B
            </label>
            <input
              id="specificity-b"
              type="text"
              value={selectorB}
              onChange={(event) => setSelectorB(event.target.value)}
              placeholder={CSS_SELECTOR_PLACEHOLDER}
              spellCheck={false}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div className="flex items-center gap-2 pb-1">
            <span className={chipClasses('a')}>A</span>
            <span className="text-muted-foreground text-sm">=</span>
            <span className="font-mono text-sm">
              ({resultA.a}, {resultA.b}, {resultA.c})
            </span>
          </div>
        </div>
        {comparison !== null && selectorA.trim() && (
          <div className="border-border bg-background mt-4 flex flex-wrap items-center gap-3 rounded-lg border px-4 py-3">
            <p className="text-sm font-semibold">{compareText(comparison)}</p>
            <div className="text-muted-foreground flex flex-wrap items-center gap-2 text-xs">
              <span>
                A{' '}
                <span className="font-mono">
                  ({resultA.a}, {resultA.b}, {resultA.c})
                </span>{' '}
                score {resultA.score}
              </span>
              <span className="text-muted-foreground">vs</span>
              <span>
                B{' '}
                <span className="font-mono">
                  ({resultB.a}, {resultB.b}, {resultB.c})
                </span>{' '}
                score {resultB.score}
              </span>
            </div>
          </div>
        )}
        {comparison !== null && !selectorA.trim() && (
          <p className="text-muted-foreground mt-3 text-sm italic">
            Enter a selector above to enable comparison.
          </p>
        )}
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          How it works
        </p>
        <div className="text-muted-foreground mt-3 space-y-2 text-sm">
          <p className="flex items-center gap-2">
            <span className={chipClasses('a')}>IDs</span>
            <span>count as 100 each — #main, #app</span>
          </p>
          <p className="flex items-center gap-2">
            <span className={chipClasses('b')}>Classes</span>
            <span>count as 10 each — .btn, [type=&quot;text&quot;], :hover, :nth-child()</span>
          </p>
          <p className="flex items-center gap-2">
            <span className={chipClasses('c')}>Elements</span>
            <span>count as 1 each — div, li, ::before</span>
          </p>
          <p className="text-xs">
            :is()/:not()/:has() take the specificity of their most specific argument; :where()
            always counts zero. A comma-separated list takes the most specific branch.
          </p>
        </div>
      </div>
    </div>
  );
};

CSSSpecificityCalculator.displayName = 'CSSSpecificityCalculator';

export { CSSSpecificityCalculator };
