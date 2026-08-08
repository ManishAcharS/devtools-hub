'use client';

import React, { useMemo, useState } from 'react';
import { Eye } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { markdownToHtml } from '@/lib/tools/markdown';
import { SectionHeading } from '@/components/shared/section-heading';
import { Prose } from '@/components/shared/prose';
import { CopyButton } from '@/components/shared/copy-button';

const MarkdownPreview: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');

  const rendered = useMemo(() => markdownToHtml(input), [input]);

  const words = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return 0;
    return trimmed.split(/\s+/).length;
  }, [input]);

  const lines = useMemo(() => {
    const trimmed = input.trim();
    if (!trimmed) return 0;
    return input.split('\n').length;
  }, [input]);

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Eye className="h-6 w-6" aria-hidden="true" />}
        title="Markdown preview"
        description="Write Markdown on the left and see the rendered result instantly — headings, lists, tables, and code."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="border-border bg-card rounded-xl border p-5">
          <label
            htmlFor="markdown-preview-input"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Markdown
          </label>
          <textarea
            id="markdown-preview-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={'# Hello\n\nWrite **Markdown** here and see it rendered…'}
            spellCheck={false}
            rows={24}
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 h-96 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
          <div className="text-muted-foreground mt-3 flex items-center justify-between text-xs">
            <span>
              {input.length.toLocaleString()} characters · {words.toLocaleString()} words ·{' '}
              {lines.toLocaleString()} lines
            </span>
            <CopyButton value={input} label="Copy Markdown" size="sm" disabled={!input} />
          </div>
        </div>

        <div className="border-border bg-card rounded-xl border p-5">
          <div className="text-muted-foreground mb-3 flex items-center justify-between">
            <label className="text-xs font-semibold tracking-wider uppercase">Preview</label>
            <CopyButton
              value={rendered.value}
              label="Copy HTML"
              size="sm"
              disabled={!rendered.value}
            />
          </div>
          <div className="border-border bg-background max-h-96 overflow-auto rounded-lg border">
            {input.trim().length === 0 ? (
              <div className="text-muted-foreground flex h-96 items-center justify-center px-4 text-sm italic">
                The rendered preview will appear here as you type…
              </div>
            ) : (
              <Prose>
                <div dangerouslySetInnerHTML={{ __html: rendered.value }} />
              </Prose>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

MarkdownPreview.displayName = 'MarkdownPreview';

export { MarkdownPreview };
