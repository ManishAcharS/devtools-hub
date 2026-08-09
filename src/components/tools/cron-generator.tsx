'use client';

import React, { useMemo, useState } from 'react';
import { Clock, Calendar, HelpCircle } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { parseCronExpression, CRON_FIELD_DEFINITIONS } from '@/lib/tools/cron';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const CronGenerator: React.FC<ToolComponentProps> = () => {
  const [expression, setExpression] = useState('0 12 * * 1');
  const [showHelp, setShowHelp] = useState(false);

  const result = useMemo(() => parseCronExpression(expression), [expression]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Clock className="h-6 w-6" aria-hidden="true" />}
        title="Cron expression generator"
        description="Build, parse, and understand cron expressions with a visual editor and human-readable output."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="cron-expression"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Expression
          </label>
          <button
            type="button"
            onClick={() => setShowHelp((prev) => !prev)}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium"
          >
            <HelpCircle className="h-4 w-4" aria-hidden="true" />
            Syntax help
          </button>
        </div>
        <input
          id="cron-expression"
          type="text"
          value={expression}
          onChange={(event) => setExpression(event.target.value)}
          placeholder="0 12 * * 1"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        {result.error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{result.error}</p>
        )}
      </div>

      {showHelp && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
            Field reference
          </p>
          <div className="grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-5">
            {Object.entries(CRON_FIELD_DEFINITIONS).map(([key, def]) => (
              <div key={key} className="bg-muted/50 rounded-lg p-3">
                <p className="text-xs font-medium tracking-wider uppercase">{def.label}</p>
                <p className="text-muted-foreground mt-1 font-mono text-xs">
                  {def.min}–{def.max}
                </p>
                {def.names && (
                  <p className="text-muted-foreground mt-1 text-xs">
                    {Object.entries(def.names)
                      .map(([num, name]) => `${num}=${name}`)
                      .join(', ')}
                  </p>
                )}
              </div>
            ))}
          </div>
          <div className="text-muted-foreground mt-4 space-y-2 text-xs">
            <p>
              <strong>Special characters:</strong> <code>*</code> any, <code>*/n</code> every n,{' '}
              <code>a-b</code> range, <code>a,b</code> list.
            </p>
            <p>
              Example: <code>0 */2 * * 1-5</code> = every 2 hours on weekdays.
            </p>
          </div>
        </div>
      )}

      {result.valid && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Human readable
          </p>
          <p className="mt-2 text-sm">{result.human}</p>
          {result.nextRun && (
            <p className="text-muted-foreground mt-3 flex items-center gap-2 text-xs">
              <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
              Next run: {result.nextRun.toLocaleString()}
            </p>
          )}
        </div>
      )}

      {result.valid && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Field breakdown
          </p>
          <dl className="mt-3 grid gap-2 text-sm sm:grid-cols-5">
            {Object.entries(result.fields).map(([key, value]) => (
              <div key={key} className="bg-muted/50 rounded-lg p-3">
                <dt className="text-muted-foreground text-xs tracking-wider uppercase">
                  {CRON_FIELD_DEFINITIONS[key as keyof typeof CRON_FIELD_DEFINITIONS].label}
                </dt>
                <dd className="text-foreground mt-1 font-mono">{value || '*'}</dd>
              </div>
            ))}
          </dl>
        </div>
      )}
    </div>
  );
};

CronGenerator.displayName = 'CronGenerator';

export { CronGenerator };
