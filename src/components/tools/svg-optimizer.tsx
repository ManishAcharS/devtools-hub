'use client';

import React, { useMemo, useState } from 'react';
import { Code2, Minimize2, Copy, Download, Eye, EyeOff } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { optimizeSvg, DEFAULT_SVG_OPTIONS, type SvgOptimizeOptions } from '@/lib/tools/svg';
import { type ToolStat } from '@/lib/tools/types';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { cn } from '@/lib/utils';

const SvgOptimizer: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [options, setOptions] = useState<SvgOptimizeOptions>(DEFAULT_SVG_OPTIONS);
  const [showInput, setShowInput] = useState(true);

  const result = useMemo(() => optimizeSvg(input, options), [input, options]);

  const output = result.value;
  const stats: ToolStat[] | undefined = result.error
    ? undefined
    : [
        { label: 'Original', value: `${result.originalSize.toLocaleString()} bytes` },
        { label: 'Optimized', value: `${result.optimizedSize.toLocaleString()} bytes` },
        { label: 'Saved', value: `${result.savings}%` },
      ];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Code2 className="h-6 w-6" aria-hidden="true" />}
        title="SVG optimizer"
        description="Minify SVG files by removing comments, whitespace, metadata, and redundant attributes."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex flex-wrap items-center gap-4">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Options
          </p>
          {(
            [
              ['removeComments', 'Remove comments'],
              ['collapseWhitespace', 'Collapse whitespace'],
              ['removeEmptyAttrs', 'Remove empty attributes'],
              ['minifyStyles', 'Minify inline styles'],
              ['removeMetadata', 'Remove metadata'],
              ['removeTitles', 'Remove titles'],
              ['removeDescriptions', 'Remove descriptions'],
              ['removeDimensions', 'Remove width/height'],
            ] as const
          ).map(([key, label]) => (
            <label
              key={key}
              className="text-muted-foreground flex cursor-pointer items-center gap-2 text-xs font-medium"
            >
              <input
                type="checkbox"
                checked={options[key as keyof SvgOptimizeOptions]}
                onChange={(e) => setOptions((prev) => ({ ...prev, [key]: e.target.checked }))}
                className="accent-primary h-4 w-4"
              />
              {label}
            </label>
          ))}
        </div>
      </div>

      <TransformPanel
        inputId="svg-input"
        inputValue={input}
        onInputChange={setInput}
        inputLabel="SVG input"
        inputPlaceholder="Paste SVG code here…"
        outputValue={output}
        outputLabel="Optimized SVG"
        fileName="optimized.svg"
        error={result.error}
        stats={stats}
        toolbar={
          output && !result.error ? (
            <>
              <CopyButton value={output} iconOnly size="sm" />
              <DownloadButton
                content={output}
                fileName="optimized.svg"
                contentType="image/svg+xml;charset=utf-8"
                label="Download"
                size="sm"
              />
            </>
          ) : null
        }
      />

      {output && !result.error && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Preview
            </p>
            <button
              type="button"
              onClick={() => setShowInput((prev) => !prev)}
              className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium"
            >
              {showInput ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              {showInput ? 'Hide' : 'Show'} preview
            </button>
          </div>
          {showInput && (
            <div className="bg-muted max-h-96 overflow-auto rounded-lg p-4">
              <img
                src={`data:image/svg+xml;base64,${btoa(output)}`}
                alt="Optimized SVG preview"
                className="h-auto max-w-full"
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
};

SvgOptimizer.displayName = 'SvgOptimizer';

export { SvgOptimizer };
