'use client';

import React, { useMemo, useState } from 'react';
import { Paintbrush } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CSV_DELIMITERS, displayDelimiter, formatCsv, type CsvDelimiter } from '@/lib/tools/csv';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const CsvFormatter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState<CsvDelimiter | 'auto'>('auto');
  const [lineEnding, setLineEnding] = useState<'lf' | 'crlf'>('lf');
  const [trim, setTrim] = useState(true);

  const result = useMemo(
    () => formatCsv(input, { delimiter, lineEnding, trim }),
    [input, delimiter, lineEnding, trim]
  );

  const delimiterOptions: { value: CsvDelimiter | 'auto'; label: string }[] = [
    { value: 'auto', label: 'Auto-detect' },
    ...CSV_DELIMITERS.map((value) => ({ value, label: displayDelimiter(value) })),
  ];

  const toolbar = (
    <>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Delimiter</span>
        <select
          value={delimiter}
          onChange={(event) => setDelimiter(event.target.value as CsvDelimiter | 'auto')}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          {delimiterOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </label>
      <label className="text-muted-foreground flex items-center gap-2 text-sm">
        <span>Line ending</span>
        <select
          value={lineEnding}
          onChange={(event) => setLineEnding(event.target.value as 'lf' | 'crlf')}
          className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
        >
          <option value="lf">LF (Unix)</option>
          <option value="crlf">CRLF (Windows)</option>
        </select>
      </label>
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={trim}
          onChange={(event) => setTrim(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Trim cell whitespace
      </label>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Paintbrush className="h-6 w-6" aria-hidden="true" />}
        title="CSV formatter"
        description="Normalize delimiters, quoting, and line endings so any CSV file is consistent and spreadsheet-safe."
      />
      <TransformPanel
        inputId="csv-format-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="CSV"
        inputPlaceholder="Paste CSV data here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="Formatted CSV"
        outputPlaceholder="Formatted CSV will appear here…"
        fileName="formatted.csv"
        error={result.error}
        warnings={result.warnings}
        stats={result.stats}
      />
    </div>
  );
};

CsvFormatter.displayName = 'CsvFormatter';

export { CsvFormatter };
