'use client';

import React, { useMemo, useState } from 'react';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { checkPasswordStrength } from '@/lib/tools/password';
import { SectionHeading } from '@/components/shared/section-heading';
import { cn } from '@/lib/utils';

const SCORE_COLORS = [
  'bg-red-500',
  'bg-orange-500',
  'bg-amber-400',
  'bg-emerald-500',
  'bg-green-600',
];

const PasswordStrengthChecker: React.FC<ToolComponentProps> = () => {
  const [password, setPassword] = useState('');
  const [visible, setVisible] = useState(false);

  const result = useMemo(() => checkPasswordStrength(password), [password]);
  const passedCount = result.checks.filter((check) => check.passed).length;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="Password strength checker"
        description="Score a password against length, character variety, and common patterns — entirely in your browser."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor="password-input"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Password
        </label>
        <div className="relative mt-2">
          <input
            id="password-input"
            type={visible ? 'text' : 'password'}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Type a password to analyze…"
            autoComplete="off"
            spellCheck={false}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary w-full rounded-lg border px-4 py-3 pr-12 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={() => setVisible((previous) => !previous)}
            aria-label={visible ? 'Hide password' : 'Show password'}
            className="text-muted-foreground hover:text-foreground absolute top-1/2 right-3 -translate-y-1/2"
          >
            {visible ? (
              <EyeOff className="h-4 w-4" aria-hidden="true" />
            ) : (
              <Eye className="h-4 w-4" aria-hidden="true" />
            )}
          </button>
        </div>

        {password.length > 0 && (
          <div className="mt-4">
            <div className="flex items-center justify-between">
              <p className="text-sm font-semibold">
                <span className={cn('text-foreground')}>{result.label}</span>
              </p>
              <p className="text-muted-foreground text-xs">
                {passedCount}/{result.checks.length} checks passed
              </p>
            </div>
            <div className="mt-2 flex gap-1.5">
              {[0, 1, 2, 3, 4].map((index) => (
                <div
                  key={index}
                  className={cn(
                    'h-2 flex-1 rounded-full transition-colors',
                    index <= result.score ? SCORE_COLORS[result.score] : 'bg-muted'
                  )}
                />
              ))}
            </div>
            <p className="text-muted-foreground mt-3 text-xs">
              Estimated entropy:{' '}
              <span className="text-foreground font-medium">{result.entropy.toFixed(1)} bits</span>{' '}
              · Time to crack (offline, 10 billion guesses/sec):{' '}
              <span className="text-foreground font-medium">{result.timeToCrack}</span>
            </p>
          </div>
        )}
      </div>

      {password.length > 0 && (
        <div className="border-border bg-card rounded-xl border p-5">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Checks
          </p>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {result.checks.map((check) => (
              <li key={check.label} className="flex items-center gap-2.5 text-sm">
                <span
                  className={cn(
                    'inline-flex h-5 w-5 items-center justify-center rounded-full text-xs font-bold',
                    check.passed
                      ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400'
                      : 'bg-muted text-muted-foreground'
                  )}
                >
                  {check.passed ? '✓' : '✕'}
                </span>
                <span className={check.passed ? 'text-foreground' : 'text-muted-foreground'}>
                  {check.label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

PasswordStrengthChecker.displayName = 'PasswordStrengthChecker';

export { PasswordStrengthChecker };
