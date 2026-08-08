'use client';

import React, { useMemo, useState } from 'react';
import { FileCode2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { jsonToYaml } from '@/lib/tools/yaml';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const JsonToYaml: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState(2);

  const result = useMemo(() => jsonToYaml(input, indentSize), [input, indentSize]);

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
        icon={<FileCode2 className="h-6 w-6" aria-hidden="true" />}
        title="JSON to YAML converter"
        description="Turn JSON into readable YAML for configuration files, CI pipelines, and Kubernetes manifests."
      />
      <TransformPanel
        inputId="json-yaml-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="JSON"
        inputPlaceholder="Paste a JSON document here…"
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="YAML"
        outputPlaceholder="Converted YAML will appear here…"
        fileName="converted.yaml"
        error={result.error}
        stats={
          result.value.length > 0
            ? [{ label: 'Output', value: `${result.value.length.toLocaleString()} chars` }]
            : undefined
        }
      />
    </div>
  );
};

JsonToYaml.displayName = 'JsonToYaml';

export { JsonToYaml };
