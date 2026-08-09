'use client';

import React, { useMemo, useState } from 'react';
import { FileCode, Download } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { buildGitignore, GITIGNORE_TEMPLATES } from '@/lib/tools/file-templates';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { DownloadButton } from '@/components/shared/download-button';

const GitignoreGenerator: React.FC<ToolComponentProps> = () => {
  const [selected, setSelected] = useState<string[]>(['node']);
  const [custom, setCustom] = useState('');

  const output = useMemo(() => buildGitignore(selected, custom), [selected, custom]);
  const lineCount = output.split('\n').filter((line) => line.trim().length > 0).length;

  const toggleTemplate = (id: string) => {
    setSelected((prev) => (prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileCode className="h-6 w-6" aria-hidden="true" />}
        title=".gitignore generator"
        description="Combine common templates and add custom rules to create a .gitignore file for your project."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
          Templates
        </p>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {GITIGNORE_TEMPLATES.map((template) => (
            <label
              key={template.id}
              className={`flex cursor-pointer items-center gap-3 rounded-lg border p-3 transition-colors ${
                selected.includes(template.id)
                  ? 'border-primary bg-primary/5'
                  : 'border-border bg-background hover:bg-muted'
              }`}
            >
              <input
                type="checkbox"
                checked={selected.includes(template.id)}
                onChange={() => toggleTemplate(template.id)}
                className="accent-primary h-4 w-4"
              />
              <div>
                <p className="text-sm font-medium">{template.label}</p>
                <p className="text-muted-foreground text-xs">{template.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex items-center justify-between">
          <label
            htmlFor="gitignore-custom"
            className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
          >
            Custom rules
          </label>
          <button
            type="button"
            onClick={() => setSelected([])}
            disabled={selected.length === 0}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium transition-colors disabled:opacity-50"
          >
            Clear all
          </button>
        </div>
        <textarea
          id="gitignore-custom"
          value={custom}
          onChange={(event) => setCustom(event.target.value)}
          placeholder="# Add your own patterns here…"
          rows={4}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
      </div>

      <TransformPanel
        inputId="gitignore-output"
        inputValue=""
        onInputChange={() => {}}
        inputLabel="Generated .gitignore"
        outputValue={output}
        outputLabel="Output"
        fileName=".gitignore"
        stats={output.trim() ? [{ label: 'Lines', value: lineCount.toLocaleString() }] : undefined}
        toolbar={
          output.trim() ? (
            <DownloadButton
              content={output}
              fileName=".gitignore"
              contentType="text/plain;charset=utf-8"
              label="Download"
              size="sm"
            />
          ) : null
        }
      />
    </div>
  );
};

GitignoreGenerator.displayName = 'GitignoreGenerator';

export { GitignoreGenerator };
