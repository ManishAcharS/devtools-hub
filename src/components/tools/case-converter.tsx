'use client';

import React, { useMemo, useState } from 'react';
import { CaseSensitive } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { convertCase, TEXT_CASE_STYLES, type TextCaseStyle } from '@/lib/tools/text';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const CaseConverter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [style, setStyle] = useState<TextCaseStyle>('camel');

  const output = useMemo(() => convertCase(input, style), [input, style]);

  const toolbar = (
    <div className="flex flex-wrap items-center gap-2">
      {TEXT_CASE_STYLES.map((option) => (
        <button
          key={option.value}
          type="button"
          onClick={() => setStyle(option.value)}
          title={option.example}
          className={cn(
            'rounded-lg border px-2.5 py-1.5 text-xs font-medium transition-colors',
            style === option.value
              ? 'border-primary bg-primary text-primary-foreground'
              : 'border-border text-muted-foreground hover:text-foreground'
          )}
          aria-pressed={style === option.value}
        >
          {option.label}
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CaseSensitive className="h-6 w-6" aria-hidden="true" />}
        title="Case converter"
        description="Convert any text between camelCase, snake_case, kebab-case, PascalCase, and more — words are detected from separators and camelCase boundaries."
      />
      <TransformPanel
        inputId="case-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Text"
        inputPlaceholder="Paste text to convert…"
        toolbar={toolbar}
        outputValue={output}
        outputLabel={TEXT_CASE_STYLES.find((option) => option.value === style)?.label ?? 'Output'}
        outputPlaceholder="Converted text will appear here…"
        fileName="converted.txt"
      />
    </div>
  );
};

CaseConverter.displayName = 'CaseConverter';

export { CaseConverter };
