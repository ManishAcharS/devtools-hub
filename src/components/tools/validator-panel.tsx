'use client';

import React from 'react';
import { CheckCircle2, XCircle, AlertTriangle } from 'lucide-react';
import type { ToolValidationResult } from '@/lib/tools/types';

interface ValidatorPanelProps {
  inputId: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  placeholder?: string;
  inputLabel?: string;
  inputRows?: number;
  result: ToolValidationResult | null;
  validMessage: string;
  invalidMessage: string;
  extra?: React.ReactNode;
}

const ValidatorPanel: React.FC<ValidatorPanelProps> = ({
  inputId,
  inputValue,
  onInputChange,
  placeholder = 'Paste content to validate…',
  inputLabel = 'Input',
  inputRows = 8,
  result,
  validMessage,
  invalidMessage,
  extra,
}) => {
  const empty = inputValue.trim().length === 0;

  return (
    <div className="space-y-6">
      <div className="border-border bg-card rounded-xl border p-5">
        <label
          htmlFor={inputId}
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          {inputLabel}
        </label>
        <textarea
          id={inputId}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder={placeholder}
          spellCheck={false}
          rows={inputRows}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        <p className="text-muted-foreground mt-3 text-xs">
          {inputValue.length.toLocaleString()} characters
        </p>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        {empty ? (
          <div className="text-muted-foreground bg-muted flex h-20 items-center justify-center rounded-lg px-4 text-sm italic">
            Validation results will appear here…
          </div>
        ) : !result ? null : result.valid ? (
          <div className="flex items-start gap-3 rounded-lg border border-green-600/30 bg-green-600/5 p-4">
            <CheckCircle2
              className="mt-0.5 h-5 w-5 shrink-0 text-green-600 dark:text-green-400"
              aria-hidden="true"
            />
            <div>
              <p className="font-medium text-green-700 dark:text-green-400">{validMessage}</p>
              {result.stats && result.stats.length > 0 && (
                <div className="text-muted-foreground mt-2 flex flex-wrap gap-x-6 gap-y-1 text-xs">
                  {result.stats.map((stat) => (
                    <span key={stat.label}>
                      {stat.label}:{' '}
                      <span className="text-foreground font-medium">{stat.value}</span>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        ) : (
          <div>
            <div className="flex items-start gap-3 rounded-lg border border-red-600/30 bg-red-600/5 p-4">
              <XCircle
                className="mt-0.5 h-5 w-5 shrink-0 text-red-600 dark:text-red-400"
                aria-hidden="true"
              />
              <div>
                <p className="font-medium text-red-700 dark:text-red-400">{invalidMessage}</p>
                {result.error && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{result.error}</p>
                )}
              </div>
            </div>
            {result.issues.length > 0 && (
              <ul className="mt-4 space-y-2">
                {result.issues.map((issue, index) => (
                  <li key={index} className="flex items-start gap-2 text-sm">
                    <AlertTriangle
                      className="mt-0.5 h-4 w-4 shrink-0 text-red-600 dark:text-red-400"
                      aria-hidden="true"
                    />
                    <span className="text-muted-foreground">
                      {issue.line !== undefined && (
                        <span className="bg-muted text-foreground mr-2 inline-block rounded px-1.5 py-0.5 font-mono text-xs">
                          line {issue.line}
                          {issue.column !== undefined ? `:${issue.column}` : ''}
                        </span>
                      )}
                      {issue.message}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        )}
        {extra}
      </div>
    </div>
  );
};

ValidatorPanel.displayName = 'ValidatorPanel';

export { ValidatorPanel };
