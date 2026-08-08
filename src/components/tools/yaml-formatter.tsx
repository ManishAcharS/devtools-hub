'use client';

import React, { useMemo, useState } from 'react';
import { AlignLeft } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { formatYaml } from '@/lib/tools/yaml';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const YamlFormatter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const result = useMemo(() => formatYaml(input, indentSize), [input, indentSize]);

  const outputLines = result.value.length > 0 ? result.value.split('\n').length : 0;

  const toolbar = (
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
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<AlignLeft className="h-6 w-6" aria-hidden="true" />}
        title="YAML formatter"
        description="Parse YAML and re-emit it with consistent indentation, quoting, and spacing."
      />
      <TransformPanel
        inputId="yaml-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="YAML"
        inputPlaceholder="Paste a YAML document here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="Formatted YAML"
        outputPlaceholder="Formatted YAML will appear here…"
        fileName="formatted.yaml"
        error={result.error}
        stats={
          result.value.length > 0
            ? [
                { label: 'Input', value: `${input.length.toLocaleString()} chars` },
                { label: 'Output', value: `${result.value.length.toLocaleString()} chars` },
                { label: 'Lines', value: outputLines.toLocaleString() },
              ]
            : undefined
        }
      />
    </div>
  );
};

YamlFormatter.displayName = 'YamlFormatter';

export { YamlFormatter };
