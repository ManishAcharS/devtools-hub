'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { yamlToJson } from '@/lib/tools/yaml';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const YamlToJson: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => yamlToJson(input), [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="YAML to JSON converter"
        description="Convert YAML configuration into clean, indented JSON — useful for API payloads and interop."
      />
      <TransformPanel
        inputId="yaml-json-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="YAML"
        inputPlaceholder="Paste a YAML document here…"
        outputValue={result.value}
        outputLabel="JSON"
        outputPlaceholder="Converted JSON will appear here…"
        fileName="converted.json"
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

YamlToJson.displayName = 'YamlToJson';

export { YamlToJson };
