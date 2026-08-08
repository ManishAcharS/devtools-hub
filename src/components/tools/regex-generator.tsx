'use client';

import React, { useMemo, useState } from 'react';
import { Wand2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { escapeRegexLiteral } from '@/lib/tools/regex-tools';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const RegexGenerator: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => {
    const literal = escapeRegexLiteral(input);
    return {
      escaped: literal,
      pattern: input.length > 0 ? `/${literal}/` : '',
      value: input.length > 0 ? `/${literal}/` : '',
      error: null as string | null,
    };
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Wand2 className="h-6 w-6" aria-hidden="true" />}
        title="Regex literal generator"
        description="Escape special regex characters in any string so you can match it literally — perfect for user-provided search terms."
      />
      <TransformPanel
        inputId="regex-escape-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Text"
        inputPlaceholder="Paste text to escape, e.g. (C:\temp\file[1].txt)…"
        outputValue={result.value}
        outputLabel="Escaped pattern"
        outputPlaceholder="Escaped literal will appear here…"
        fileName="pattern.txt"
        error={result.error}
        stats={
          input.length > 0
            ? [
                { label: 'Characters', value: `${input.length.toLocaleString()}` },
                { label: 'Escaped', value: `${result.escaped.length.toLocaleString()}` },
              ]
            : undefined
        }
      />
    </div>
  );
};

RegexGenerator.displayName = 'RegexGenerator';

export { RegexGenerator };
