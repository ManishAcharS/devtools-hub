'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CSV_DELIMITERS, csvToJson, displayDelimiter, type CsvDelimiter } from '@/lib/tools/csv';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const CsvToJson: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [headers, setHeaders] = useState(true);
  const [delimiter, setDelimiter] = useState<CsvDelimiter | 'auto'>('auto');

  const result = useMemo(
    () => csvToJson(input, { headers, delimiter }),
    [input, headers, delimiter]
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
      <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={headers}
          onChange={(event) => setHeaders(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        First row is a header
      </label>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="CSV to JSON converter"
        description="Turn CSV rows into a JSON array of objects, using the first row as property names — or keep them as plain arrays."
      />
      <TransformPanel
        inputId="csv-json-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="CSV"
        inputPlaceholder="Paste CSV data here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="JSON"
        outputPlaceholder="Converted JSON will appear here…"
        fileName="converted.json"
        error={result.error}
        warnings={result.warnings}
        stats={result.stats}
      />
    </div>
  );
};

CsvToJson.displayName = 'CsvToJson';

export { CsvToJson };
