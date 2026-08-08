'use client';

import React, { useMemo, useState } from 'react';
import { AlignLeft } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { tidyMarkdown } from '@/lib/tools/markdown';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const MarkdownFormatter: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => tidyMarkdown(input), [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<AlignLeft className="h-6 w-6" aria-hidden="true" />}
        title="Markdown formatter"
        description="Tidy up Markdown: consistent list markers, sequential list numbers, heading spacing, and no trailing whitespace."
      />
      <TransformPanel
        inputId="markdown-format-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Markdown"
        inputPlaceholder="Paste Markdown to tidy here…"
        outputValue={result.value}
        outputLabel="Formatted Markdown"
        outputPlaceholder="Formatted Markdown will appear here…"
        fileName="formatted.md"
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

MarkdownFormatter.displayName = 'MarkdownFormatter';

export { MarkdownFormatter };
