'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { formatJson } from '@/lib/tools/json';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

interface JsonFormatterToolProps extends ToolComponentProps {
  defaultMode?: 'pretty' | 'minify';
  lockMode?: boolean;
}

const JsonFormatterTool: React.FC<JsonFormatterToolProps> = ({
  defaultMode = 'pretty',
  lockMode = false,
}) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'pretty' | 'minify'>(defaultMode);
  const [indentSize, setIndentSize] = useState(2);

  const result = useMemo(
    () => formatJson(input, { minify: mode === 'minify', indentSize: indentSize as 2 | 4 }),
    [input, mode, indentSize]
  );

  const modes: { value: 'pretty' | 'minify'; label: string }[] = [
    { value: 'pretty', label: 'Pretty print' },
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
      {mode === 'pretty' && (
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
      )}
    </>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title={mode === 'minify' ? 'JSON minifier' : 'JSON formatter'}
        description={
          mode === 'minify'
            ? 'Strip all unnecessary whitespace to produce the smallest valid JSON document.'
            : 'Re-indent and validate your JSON into a clean, readable structure.'
        }
      />
      <TransformPanel
        inputId="json-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="JSON"
        inputPlaceholder="Paste a JSON document here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={mode === 'minify' ? 'Minified JSON' : 'Formatted JSON'}
        outputPlaceholder="Formatted JSON will appear here…"
        fileName={mode === 'minify' ? 'minified.json' : 'formatted.json'}
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

JsonFormatterTool.displayName = 'JsonFormatterTool';

const JsonMinifierTool: React.FC<ToolComponentProps> = (props) => (
  <JsonFormatterTool {...props} defaultMode="minify" lockMode />
);

JsonMinifierTool.displayName = 'JsonMinifierTool';

export { JsonFormatterTool, JsonMinifierTool };
