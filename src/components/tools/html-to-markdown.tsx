'use client';

import React, { useMemo, useState } from 'react';
import { FileText } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { htmlToMarkdown } from '@/lib/tools/markdown';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';

const HtmlToMarkdown: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const result = useMemo(() => htmlToMarkdown(input), [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="HTML to Markdown converter"
        description="Convert pasted HTML — headings, lists, links, tables, and code blocks — into clean Markdown."
      />
      <TransformPanel
        inputId="html-markdown-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="HTML"
        inputPlaceholder="Paste HTML here…"
        inputRows={10}
        outputValue={result.value}
        outputLabel="Markdown"
        outputPlaceholder="Converted Markdown will appear here…"
        fileName="converted.md"
        error={result.error}
        stats={
          result.value.length > 0
            ? [
                { label: 'Input', value: `${input.length.toLocaleString()} chars` },
                { label: 'Output', value: `${result.value.length.toLocaleString()} chars` },
              ]
            : undefined
        }
      />
    </div>
  );
};

HtmlToMarkdown.displayName = 'HtmlToMarkdown';

export { HtmlToMarkdown };
