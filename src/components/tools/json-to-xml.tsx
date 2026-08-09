'use client';

import React, { useMemo, useState } from 'react';
import { Code2, ArrowRightLeft } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { jsonToXml, parseJson } from '@/lib/tools/json';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const JsonToXml: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [rootName, setRootName] = useState('root');
  const [arrayItemName, setArrayItemName] = useState('item');
  const [indent, setIndent] = useState<2 | 4>(2);
  const [declaration, setDeclaration] = useState(true);

  const parsed = useMemo(() => parseJson(input), [input]);
  const result = useMemo(() => {
    if (!parsed.ok || !input.trim()) return { value: '', error: null };
    try {
      return {
        value: jsonToXml(input, { rootName, arrayItemName, indent, declaration }),
        error: null,
      };
    } catch (error) {
      return { value: '', error: `Conversion failed: ${(error as Error).message}` };
    }
  }, [input, rootName, arrayItemName, indent, declaration]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Code2 className="h-6 w-6" aria-hidden="true" />}
        title="JSON to XML converter"
        description="Convert JSON into well-formed XML with configurable root element, array item names, and formatting."
      />
      <TransformPanel
        inputId="json-xml-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="JSON"
        inputPlaceholder="Paste JSON here…"
        outputValue={result.value}
        outputLabel="XML"
        fileName="converted.xml"
        error={result.error}
        stats={
          parsed.ok
            ? [
                { label: 'Input length', value: input.trim().length.toLocaleString() },
                { label: 'Output length', value: result.value.length.toLocaleString() },
              ]
            : undefined
        }
        toolbar={
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
              <label htmlFor="json-xml-root" className="text-muted-foreground text-xs">
                Root
              </label>
              <input
                id="json-xml-root"
                type="text"
                value={rootName}
                onChange={(event) => setRootName(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-32 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="json-xml-item" className="text-muted-foreground text-xs">
                Array item
              </label>
              <input
                id="json-xml-item"
                type="text"
                value={arrayItemName}
                onChange={(event) => setArrayItemName(event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary w-32 rounded-lg border px-2 py-1.5 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div className="flex items-center gap-2">
              <label htmlFor="json-xml-indent" className="text-muted-foreground text-xs">
                Indent
              </label>
              <select
                id="json-xml-indent"
                value={indent}
                onChange={(event) => setIndent(Number(event.target.value) as 2 | 4)}
                className="border-border bg-background text-foreground focus-visible:ring-primary rounded-lg border px-2 py-1.5 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value={2}>2 spaces</option>
                <option value={4}>4 spaces</option>
              </select>
            </div>
            <label className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium">
              <input
                type="checkbox"
                checked={declaration}
                onChange={(event) => setDeclaration(event.target.checked)}
                className="accent-primary h-4 w-4"
              />
              XML declaration
            </label>
          </div>
        }
      />
    </div>
  );
};

JsonToXml.displayName = 'JsonToXml';

export { JsonToXml };
