'use client';

import React, { useMemo, useState } from 'react';
import { Code2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { formatSql, minifySql, type KeywordCase } from '@/lib/tools/sql';
import { cn } from '@/lib/utils';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

interface SqlFormatterToolProps extends ToolComponentProps {
  defaultMode?: 'format' | 'minify';
  lockMode?: boolean;
}

const SqlFormatterTool: React.FC<SqlFormatterToolProps> = ({
  defaultMode = 'format',
  lockMode = false,
}) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'format' | 'minify'>(defaultMode);
  const [keywordCase, setKeywordCase] = useState<KeywordCase>('upper');
  const [indentSize, setIndentSize] = useState(2);

  const result = useMemo(() => {
    if (mode === 'minify') return minifySql(input);
    return formatSql(input, { keywordCase, indentSize });
  }, [input, mode, keywordCase, indentSize]);

  const modes: { value: 'format' | 'minify'; label: string }[] = [
    { value: 'format', label: 'Format' },
    { value: 'minify', label: 'Minify' },
  ];

  const toolbar = (
    <>
      {!lockMode && (
        <div className="bg-muted inline-flex rounded-lg p-1">
          {modes.map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                mode === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={mode === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>
      )}
      {mode === 'format' && (
        <>
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Keywords</span>
            <select
              value={keywordCase}
              onChange={(event) => setKeywordCase(event.target.value as KeywordCase)}
              className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
            >
              <option value="upper">UPPERCASE</option>
              <option value="lower">lowercase</option>
              <option value="asis">As-is</option>
            </select>
          </label>
          <label className="text-muted-foreground flex items-center gap-2 text-sm">
            <span>Indent</span>
            <select
              value={indentSize}
              onChange={(event) => setIndentSize(Number(event.target.value))}
              className="border-border bg-background text-foreground rounded-md border px-2 py-1 text-sm"
            >
              <option value={2}>2 spaces</option>
              <option value={4}>4 spaces</option>
            </select>
          </label>
        </>
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Code2 className="h-6 w-6" aria-hidden="true" />}
        title={mode === 'minify' ? 'SQL minifier' : 'SQL formatter'}
        description={
          mode === 'minify'
            ? 'Strip comments and whitespace to produce the smallest SQL that runs the same.'
            : 'Beautify any SQL statement with consistent keyword casing, indentation, and clause layout.'
        }
      />
      <TransformPanel
        inputId="sql-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="SQL"
        inputPlaceholder="Paste a SQL statement here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={mode === 'minify' ? 'Minified SQL' : 'Formatted SQL'}
        outputPlaceholder="Formatted SQL will appear here…"
        fileName={mode === 'minify' ? 'minified.sql' : 'formatted.sql'}
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

SqlFormatterTool.displayName = 'SqlFormatterTool';

const SqlMinifierTool: React.FC<ToolComponentProps> = (props) => (
  <SqlFormatterTool {...props} defaultMode="minify" lockMode />
);

SqlMinifierTool.displayName = 'SqlMinifierTool';

export { SqlFormatterTool, SqlMinifierTool };
