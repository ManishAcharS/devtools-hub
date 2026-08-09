'use client';

import React, { useMemo, useState } from 'react';
import { FileJson } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { jsonToSchema } from '@/lib/tools/json-schema';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const JsonSchemaGenerator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [indentSize, setIndentSize] = useState<2 | 4>(2);

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    try {
      return { value: jsonToSchema(input, { indentSize }), error: null };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : 'Invalid JSON.' };
    }
  }, [input, indentSize]);

  const toolbar = (
    <label className="text-muted-foreground flex items-center gap-2 text-sm">
      <span>Indent</span>
      <select
        value={indentSize}
        onChange={(event) => setIndentSize(Number(event.target.value) as 2 | 4)}
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
        icon={<FileJson className="h-6 w-6" aria-hidden="true" />}
        title="JSON Schema generator"
        description="Generate a JSON Schema (draft 2020-12) from a sample JSON document with inferred types, required properties, and enums."
      />
      <TransformPanel
        inputId="json-schema-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Sample JSON"
        inputPlaceholder={
          'Paste a JSON document to infer its schema…\nExample: {"name": "Ada", "role": "admin", "active": true}'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel="JSON Schema"
        outputPlaceholder="Inferred JSON Schema will appear here…"
        fileName="schema.json"
        error={result.error}
      />
    </div>
  );
};

JsonSchemaGenerator.displayName = 'JsonSchemaGenerator';

export { JsonSchemaGenerator };
