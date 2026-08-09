'use client';

import React, { useMemo, useState } from 'react';
import { TableProperties } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { csvToSql } from '@/lib/tools/csv-sql';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const CsvToSql: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [tableName, setTableName] = useState('users');
  const [batchMode, setBatchMode] = useState<'single' | 'multi'>('multi');
  const [batchSize, setBatchSize] = useState('50');
  const [nullForEmpty, setNullForEmpty] = useState(true);

  const parsedBatch = useMemo(() => {
    const value = Number.parseInt(batchSize, 10);
    if (Number.isNaN(value)) return 1;
    return Math.min(500, Math.max(1, value));
  }, [batchSize]);

  const result = useMemo(
    () =>
      csvToSql(input, tableName, {
        batchSize: batchMode === 'single' ? 1 : parsedBatch,
        nullForEmpty,
      }),
    [input, tableName, batchMode, parsedBatch, nullForEmpty]
  );

  const toolbar = (
    <div className="flex flex-wrap items-end gap-3">
      <div>
        <label
          htmlFor="csv-sql-table"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Table name
        </label>
        <input
          id="csv-sql-table"
          type="text"
          value={tableName}
          onChange={(event) => setTableName(event.target.value)}
          placeholder="users"
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-1 rounded-lg border px-3 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>
      <div>
        <span className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase">
          Mode
        </span>
        <div className="mt-1 flex items-center gap-3 text-sm">
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="batch-mode"
              checked={batchMode === 'single'}
              onChange={() => setBatchMode('single')}
              className="accent-primary h-4 w-4"
            />
            One INSERT per row
          </label>
          <label className="flex cursor-pointer items-center gap-1.5">
            <input
              type="radio"
              name="batch-mode"
              checked={batchMode === 'multi'}
              onChange={() => setBatchMode('multi')}
              className="accent-primary h-4 w-4"
            />
            Multi-row batches
          </label>
        </div>
      </div>
      {batchMode === 'multi' && (
        <div>
          <label
            htmlFor="csv-sql-batch"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Batch size
          </label>
          <input
            id="csv-sql-batch"
            type="number"
            min={1}
            max={500}
            value={batchSize}
            onChange={(event) => setBatchSize(event.target.value)}
            className="border-border bg-background text-foreground focus-visible:ring-primary mt-1 w-24 rounded-lg border px-3 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
        </div>
      )}
      <div className="pb-1">
        <label className="flex cursor-pointer items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={nullForEmpty}
            onChange={(event) => setNullForEmpty(event.target.checked)}
            className="accent-primary h-4 w-4"
          />
          NULL for empty cells
        </label>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<TableProperties className="h-6 w-6" aria-hidden="true" />}
        title="CSV to SQL INSERT generator"
        description="Convert CSV data into SQL INSERT statements with proper escaping — strings are single-quoted, numbers stay unquoted, and rows can be batched for fast imports."
      />
      <TransformPanel
        inputId="csv-sql-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="CSV data"
        inputPlaceholder={'Paste CSV here…\nid,name,score\n1,Ada,9.5'}
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="SQL INSERT statements"
        outputPlaceholder="Generated SQL will appear here…"
        fileName="inserts.sql"
        error={result.error}
        warnings={result.warnings}
        stats={result.stats}
      />
    </div>
  );
};

CsvToSql.displayName = 'CsvToSql';

export { CsvToSql };
