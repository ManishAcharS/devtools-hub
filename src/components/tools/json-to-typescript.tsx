'use client';

import React, { useMemo, useState } from 'react';
import { Code2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { jsonToTypeScript } from '@/lib/tools/codegen';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type OutputKind = 'interface' | 'type';

const JsonToTypeScript: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [kind, setKind] = useState<OutputKind>('interface');

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    try {
      return { value: jsonToTypeScript(input, { kind }), error: null };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : 'Invalid JSON.' };
    }
  }, [input, kind]);

  const toolbar = (
    <div className="bg-muted inline-flex rounded-lg p-1">
      {(
        [
          { value: 'interface', label: 'Interfaces' },
          { value: 'type', label: 'Type aliases' },
        ] as const
      ).map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setKind(option.value)}
          className={cn(
            'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
            kind === option.value
              ? 'bg-background text-foreground shadow-sm'
              : 'text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={kind === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Code2 className="h-6 w-6" aria-hidden="true" />}
        title="JSON to TypeScript"
        description="Generate TypeScript interfaces or type aliases from a sample JSON document — nested objects become their own named types."
      />
      <TransformPanel
        inputId="json-to-ts-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Sample JSON"
        inputPlaceholder={
          'Paste a JSON document to convert…\nExample: {"id": 1, "name": "Ada", "roles": ["admin"]}'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={kind === 'interface' ? 'TypeScript interfaces' : 'TypeScript type aliases'}
        outputPlaceholder="TypeScript code will appear here…"
        fileName={kind === 'interface' ? 'types.ts' : 'types.ts'}
        error={result.error}
      />
    </div>
  );
};

JsonToTypeScript.displayName = 'JsonToTypeScript';

export { JsonToTypeScript };
