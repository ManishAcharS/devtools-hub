'use client';

import React, { useMemo, useState } from 'react';
import { FileCode2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { formatXml } from '@/lib/tools/xml';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

interface XmlFormatterToolProps extends ToolComponentProps {
  defaultMode?: 'pretty' | 'minify';
  lockMode?: boolean;
}

const XmlFormatterTool: React.FC<XmlFormatterToolProps> = ({
  defaultMode = 'pretty',
  lockMode = false,
}) => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<'pretty' | 'minify'>(defaultMode);
  const [indentSize, setIndentSize] = useState(2);

  const result = useMemo(
    () => formatXml(input, { minify: mode === 'minify', indentSize }),
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
        icon={<FileCode2 className="h-6 w-6" aria-hidden="true" />}
        title={mode === 'minify' ? 'XML minifier' : 'XML formatter'}
        description={
          mode === 'minify'
            ? 'Strip whitespace between XML elements to produce the smallest valid document.'
            : 'Re-indent and normalize your XML into a clean, readable structure.'
        }
      />
      <TransformPanel
        inputId="xml-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="XML"
        inputPlaceholder="Paste an XML document here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={mode === 'minify' ? 'Minified XML' : 'Formatted XML'}
        outputPlaceholder="Formatted XML will appear here…"
        fileName={mode === 'minify' ? 'minified.xml' : 'formatted.xml'}
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

XmlFormatterTool.displayName = 'XmlFormatterTool';

const XmlMinifierTool: React.FC<ToolComponentProps> = (props) => (
  <XmlFormatterTool {...props} defaultMode="minify" lockMode />
);

XmlMinifierTool.displayName = 'XmlMinifierTool';

export { XmlFormatterTool, XmlMinifierTool };
