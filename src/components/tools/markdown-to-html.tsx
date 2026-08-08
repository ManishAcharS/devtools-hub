'use client';

import React, { useMemo, useState } from 'react';
import { CodeXml } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { markdownToHtmlResult } from '@/lib/tools/markdown';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const MarkdownToHtml: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => markdownToHtmlResult(input), [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<CodeXml className="h-6 w-6" aria-hidden="true" />}
        title="Markdown to HTML converter"
        description="Convert Markdown to clean, safe HTML — links and images are sanitized against unsafe protocols."
      />
      <TransformPanel
        inputId="markdown-html-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="Markdown"
        inputPlaceholder="Paste Markdown here…"
        outputValue={result.value}
        outputLabel="HTML"
        outputPlaceholder="Converted HTML will appear here…"
        fileName="converted.html"
        error={result.error}
        stats={result.stats}
      />
    </div>
  );
};

MarkdownToHtml.displayName = 'MarkdownToHtml';

export { MarkdownToHtml };
