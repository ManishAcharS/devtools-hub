'use client';

import React, { useMemo, useState } from 'react';
import { Braces } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { formatGraphQL, minifyGraphQL } from '@/lib/tools/graphql';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

type Mode = 'pretty' | 'compact';

const GraphqlFormatter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [mode, setMode] = useState<Mode>('pretty');

  const result = useMemo(() => {
    if (!input.trim()) return { value: '', error: null };
    try {
      return {
        value: mode === 'pretty' ? formatGraphQL(input) : minifyGraphQL(input),
        error: null,
      };
    } catch (error) {
      return { value: '', error: error instanceof Error ? error.message : 'Parse error.' };
    }
  }, [input, mode]);

  const toolbar = (
    <div className="bg-muted inline-flex rounded-lg p-1">
      {(
        [
          { value: 'pretty', label: 'Pretty' },
          { value: 'compact', label: 'Compact' },
        ] as const
      ).map((option) => (
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
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Braces className="h-6 w-6" aria-hidden="true" />}
        title="GraphQL formatter"
        description="Format GraphQL queries, mutations, and SDL into readable indented output or a single compact line — comments and block strings are preserved."
      />
      <TransformPanel
        inputId="graphql-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="GraphQL"
        inputPlaceholder={
          'Paste a GraphQL query here…\nquery GetUser($id: ID!) { user(id: $id) { name email } }'
        }
        toolbar={toolbar}
        outputValue={result.value}
        outputLabel={mode === 'pretty' ? 'Formatted GraphQL' : 'Compact GraphQL'}
        outputPlaceholder="Formatted GraphQL will appear here…"
        fileName={mode === 'pretty' ? 'query.graphql' : 'query.min.graphql'}
        error={result.error}
      />
    </div>
  );
};

GraphqlFormatter.displayName = 'GraphqlFormatter';

export { GraphqlFormatter };
