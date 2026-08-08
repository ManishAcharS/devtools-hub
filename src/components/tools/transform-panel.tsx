'use client';

import React, { type ReactNode } from 'react';
import { RefreshCcw } from 'lucide-react';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import type { ToolStat } from '@/lib/tools/types';

interface TransformPanelProps {
  inputId: string;
  inputValue: string;
  onInputChange: (value: string) => void;
  inputLabel?: string;
  inputPlaceholder?: string;
  inputRows?: number;
  toolbar?: ReactNode;
  outputId?: string;
  outputValue: string;
  outputLabel?: string;
  outputPlaceholder?: string;
  fileName: string;
  error?: string | null;
  warnings?: string[];
  stats?: ToolStat[];
  extra?: ReactNode;
}

const TransformPanel: React.FC<TransformPanelProps> = ({
  inputId,
  inputValue,
  onInputChange,
  inputLabel = 'Input',
  inputPlaceholder = 'Paste content here…',
  inputRows = 8,
  toolbar,
  outputId = `${inputId}-output`,
  outputValue,
  outputLabel = 'Output',
  outputPlaceholder = 'Output will appear here…',
  fileName,
  error,
  warnings = [],
  stats,
  extra,
}) => {
  return (
    <div className="space-y-6">
      <div className="border-border bg-card rounded-xl border p-5">
        {toolbar && (
          <div className="flex flex-wrap items-center justify-between gap-3">{toolbar}</div>
        )}

        <label
          htmlFor={inputId}
          className="text-muted-foreground mt-5 block text-xs font-semibold tracking-wider uppercase"
        >
          {inputLabel}
        </label>
        <textarea
          id={inputId}
          value={inputValue}
          onChange={(event) => onInputChange(event.target.value)}
          placeholder={inputPlaceholder}
          spellCheck={false}
          rows={inputRows}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />

        <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
          <span>{inputValue.length.toLocaleString()} characters</span>
          <button
            type="button"
            onClick={() => onInputChange('')}
            disabled={inputValue.length === 0}
            className="hover:text-foreground inline-flex items-center gap-1.5 font-medium transition-colors disabled:opacity-50"
          >
            <RefreshCcw className="h-3.5 w-3.5" aria-hidden="true" />
            Clear
          </button>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <label
            htmlFor={outputId}
            className="text-muted-foreground text-xs font-semibold tracking-wider uppercase"
          >
            {outputLabel}
          </label>
          <div className="flex flex-wrap items-center gap-2">
            <CopyButton value={outputValue} iconOnly size="sm" disabled={!outputValue} />
            <DownloadButton
              content={outputValue}
              fileName={fileName}
              contentType="text/plain;charset=utf-8"
              label="Download"
              size="sm"
              disabled={!outputValue}
            />
          </div>
        </div>

        <div className="mt-2">
          {outputValue ? (
            <pre
              id={outputId}
              className="bg-muted text-foreground max-h-96 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap"
            >
              {outputValue}
            </pre>
          ) : (
            <div className="bg-muted text-muted-foreground flex h-20 items-center justify-center rounded-lg px-4 text-sm italic">
              {error ?? outputPlaceholder}
            </div>
          )}
        </div>

        {outputValue && error && (
          <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>
        )}

        {warnings.map((warning) => (
          <p key={warning} className="mt-3 text-sm text-amber-600 dark:text-amber-400">
            {warning}
          </p>
        ))}

        {stats && stats.length > 0 && (
          <div className="text-muted-foreground mt-3 flex flex-wrap gap-x-6 gap-y-1 text-xs">
            {stats.map((stat) => (
              <span key={stat.label}>
                {stat.label}: <span className="text-foreground font-medium">{stat.value}</span>
              </span>
            ))}
          </div>
        )}

        {extra}
      </div>
    </div>
  );
};

TransformPanel.displayName = 'TransformPanel';

export { TransformPanel };
