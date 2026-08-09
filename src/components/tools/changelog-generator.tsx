'use client';

import React, { useMemo, useState } from 'react';
import { ScrollText, Plus, Trash2 } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { DownloadButton } from '@/components/shared/download-button';

const CATEGORIES = ['added', 'changed', 'deprecated', 'removed', 'fixed', 'security'] as const;

type ChangelogCategory = (typeof CATEGORIES)[number];

interface ChangelogBlock {
  version: string;
  date: string;
  added: string;
  changed: string;
  deprecated: string;
  removed: string;
  fixed: string;
  security: string;
}

const CATEGORY_LABELS: Record<ChangelogCategory, string> = {
  added: 'Added',
  changed: 'Changed',
  deprecated: 'Deprecated',
  removed: 'Removed',
  fixed: 'Fixed',
  security: 'Security',
};

function today(): string {
  return new Date().toISOString().slice(0, 10);
}

function newBlock(): ChangelogBlock {
  return {
    version: '0.1.0',
    date: today(),
    added: '',
    changed: '',
    deprecated: '',
    removed: '',
    fixed: '',
    security: '',
  };
}

function renderChangelog(blocks: ChangelogBlock[]): string {
  const lines: string[] = [
    '# Changelog',
    '',
    'All notable changes to this project will be documented in this file.',
    'The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),',
    'and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).',
    '',
  ];
  for (const block of blocks) {
    lines.push(`## [${block.version.trim() || 'Unreleased'}] - ${block.date || 'YYYY-MM-DD'}`, '');
    let hasContent = false;
    for (const category of CATEGORIES) {
      const items = block[category]
        .split('\n')
        .map((line) => line.trim())
        .filter((line) => line.length > 0);
      if (items.length === 0) continue;
      hasContent = true;
      lines.push(`### ${CATEGORY_LABELS[category]}`, '');
      for (const item of items) {
        lines.push(`- ${item}`);
      }
      lines.push('');
    }
    if (!hasContent) {
      lines.push('_No changes recorded._', '');
    }
  }
  return `${lines.join('\n').trimEnd()}\n`;
}

const ChangelogGenerator: React.FC<ToolComponentProps> = () => {
  const [blocks, setBlocks] = useState<ChangelogBlock[]>([newBlock()]);

  const output = useMemo(() => renderChangelog(blocks), [blocks]);

  const updateBlock = (index: number, field: keyof ChangelogBlock, value: string) => {
    setBlocks((prev) =>
      prev.map((block, i) => (i === index ? { ...block, [field]: value } : block))
    );
  };

  const removeBlock = (index: number) => {
    setBlocks((prev) => prev.filter((_, i) => i !== index));
  };

  const inputClasses =
    'border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none';

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<ScrollText className="h-6 w-6" aria-hidden="true" />}
        title="Changelog generator"
        description="Create a Keep a Changelog-style CHANGELOG.md with version blocks, dates, and categorized changes — exportable as Markdown."
      />
      <div className="space-y-4">
        {blocks.map((block, index) => (
          <div key={index} className="border-border bg-card rounded-xl border p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                Version {index + 1}
              </p>
              <button
                type="button"
                onClick={() => removeBlock(index)}
                disabled={blocks.length === 1}
                className="border-border inline-flex items-center gap-1.5 rounded-lg border px-2.5 py-1.5 text-xs font-medium text-red-600 transition-colors hover:bg-red-600/10 disabled:cursor-not-allowed disabled:opacity-40 dark:text-red-400"
              >
                <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                Remove
              </button>
            </div>
            <div className="mt-4 grid gap-4 sm:grid-cols-2">
              <div>
                <label
                  htmlFor={`changelog-version-${index}`}
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Version
                </label>
                <input
                  id={`changelog-version-${index}`}
                  type="text"
                  value={block.version}
                  onChange={(event) => updateBlock(index, 'version', event.target.value)}
                  placeholder="1.0.0"
                  spellCheck={false}
                  className={inputClasses}
                />
              </div>
              <div>
                <label
                  htmlFor={`changelog-date-${index}`}
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Date
                </label>
                <input
                  id={`changelog-date-${index}`}
                  type="date"
                  value={block.date}
                  onChange={(event) => updateBlock(index, 'date', event.target.value)}
                  className={inputClasses}
                />
              </div>
            </div>
            <div className="mt-4 grid gap-4 lg:grid-cols-2">
              {CATEGORIES.map((category) => (
                <div key={category}>
                  <label
                    htmlFor={`changelog-${category}-${index}`}
                    className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                  >
                    {CATEGORY_LABELS[category]} (one per line)
                  </label>
                  <textarea
                    id={`changelog-${category}-${index}`}
                    value={block[category]}
                    onChange={(event) => updateBlock(index, category, event.target.value)}
                    placeholder="Describe the change…"
                    rows={2}
                    className={inputClasses}
                  />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={() => setBlocks((prev) => [...prev, newBlock()])}
        className="border-border hover:bg-muted inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium transition-colors"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
        Add version block
      </button>

      <TransformPanel
        inputId="changelog-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel="Generated changelog"
        fileName="CHANGELOG.md"
        stats={[
          { label: 'Versions', value: blocks.length.toLocaleString() },
          { label: 'Lines', value: output.split('\n').length.toLocaleString() },
        ]}
        toolbar={
          <DownloadButton
            content={output}
            fileName="CHANGELOG.md"
            contentType="text/markdown;charset=utf-8"
            label="Download"
            size="sm"
          />
        }
      />
    </div>
  );
};

ChangelogGenerator.displayName = 'ChangelogGenerator';

export { ChangelogGenerator };
