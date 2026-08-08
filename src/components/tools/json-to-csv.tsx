'use client';

import React, { useMemo, useState } from 'react';
import { FileSpreadsheet } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { CSV_DELIMITERS, displayDelimiter, jsonToCsv, type CsvDelimiter } from '@/lib/tools/csv';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const JsonToCsv: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [delimiter, setDelimiter] = useState<CsvDelimiter | 'auto'>('auto');
  const [includeHeaders, setIncludeHeaders] = useState(true);

  const result = useMemo(
    () => jsonToCsv(input, { delimiter, headers: includeHeaders }),
    [input, delimiter, includeHeaders]
  );

  const delimiterOptions: { value: CsvDelimiter | 'auto'; label: string }[] = [
    { value: 'auto', label: 'Comma (,)' },
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
          checked={includeHeaders}
          onChange={(event) => setIncludeHeaders(event.target.checked)}
          className="accent-primary h-4 w-4"
        />
        Include a header row
      </label>
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileSpreadsheet className="h-6 w-6" aria-hidden="true" />}
        title="JSON to CSV converter"
        description="Convert a JSON array of objects — or arrays — into a CSV table that opens directly in spreadsheets."
      />
      <TransformPanel
        inputId="json-csv-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="JSON"
        inputPlaceholder="Paste a JSON array here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="CSV"
        outputPlaceholder="Converted CSV will appear here…"
        fileName="converted.csv"
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

JsonToCsv.displayName = 'JsonToCsv';

export { JsonToCsv };
