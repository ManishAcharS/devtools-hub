'use client';

import React, { useMemo, useState } from 'react';
import { FileText, Plus, Minus, Copy, Download, Shield } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generateRobotsTxt, type RobotsTxtOptions } from '@/lib/tools/seo-generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const RobotsTxtGenerator: React.FC<ToolComponentProps> = () => {
  const [form, setForm] = useState<RobotsTxtOptions>({
    userAgent: '*',
    allow: [''],
    disallow: [''],
    sitemap: '',
    crawlDelay: 0,
  });

  const output = useMemo(() => generateRobotsTxt(form), [form]);

  const updateArray = (field: 'allow' | 'disallow', index: number, value: string) => {
    setForm((prev) => {
      const next = [...prev[field]];
      next[index] = value;
      return { ...prev, [field]: next };
    });
  };

  const addPath = (field: 'allow' | 'disallow') => {
    setForm((prev) => ({ ...prev, [field]: [...prev[field], ''] }));
  };

  const removePath = (field: 'allow' | 'disallow', index: number) => {
    setForm((prev) => {
      const next = prev[field].filter((_, i) => i !== index);
      return { ...prev, [field]: next };
    });
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Shield className="h-6 w-6" aria-hidden="true" />}
        title="Robots.txt generator"
        description="Create a robots.txt file to control how search engines crawl your site."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="grid gap-4 md:grid-cols-3">
          <div>
            <label
              htmlFor="robots-ua"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              User-agent
            </label>
            <input
              id="robots-ua"
              type="text"
              value={form.userAgent}
              onChange={(event) => setForm((prev) => ({ ...prev, userAgent: event.target.value }))}
              placeholder="*"
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="robots-sitemap"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Sitemap URL
            </label>
            <input
              id="robots-sitemap"
              type="url"
              value={form.sitemap}
              onChange={(event) => setForm((prev) => ({ ...prev, sitemap: event.target.value }))}
              placeholder="https://example.com/sitemap.xml"
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
          <div>
            <label
              htmlFor="robots-crawl"
              className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
            >
              Crawl delay (seconds)
            </label>
            <input
              id="robots-crawl"
              type="number"
              min={0}
              value={form.crawlDelay}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, crawlDelay: Number(event.target.value) }))
              }
              className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Disallow paths
          </p>
          <button
            type="button"
            onClick={() => addPath('disallow')}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {form.disallow.map((path, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={path}
                onChange={(event) => updateArray('disallow', index, event.target.value)}
                placeholder="/private/"
                className="border-border bg-background text-foreground focus-visible:ring-primary flex-1 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              {form.disallow.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePath('disallow', index)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center justify-between">
          <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Allow paths (exceptions to disallow)
          </p>
          <button
            type="button"
            onClick={() => addPath('allow')}
            className="text-muted-foreground hover:text-foreground inline-flex items-center gap-1.5 text-xs font-medium"
          >
            <Plus className="h-3.5 w-3.5" aria-hidden="true" />
            Add
          </button>
        </div>
        <div className="space-y-2">
          {form.allow.map((path, index) => (
            <div key={index} className="flex items-center gap-2">
              <input
                type="text"
                value={path}
                onChange={(event) => updateArray('allow', index, event.target.value)}
                placeholder="/public/"
                className="border-border bg-background text-foreground focus-visible:ring-primary flex-1 rounded-lg border px-3 py-2 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
              {form.allow.length > 1 && (
                <button
                  type="button"
                  onClick={() => removePath('allow', index)}
                  className="text-muted-foreground hover:text-red-500"
                >
                  <Minus className="h-4 w-4" aria-hidden="true" />
                </button>
              )}
            </div>
          ))}
        </div>
      </div>

      <TransformPanel
        inputId="robots-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel="robots.txt"
        fileName="robots.txt"
        toolbar={
          output.trim() ? (
            <>
              <CopyButton value={output} iconOnly size="sm" />
              <DownloadButton
                content={output}
                fileName="robots.txt"
                contentType="text/plain;charset=utf-8"
                label="Download"
                size="sm"
              />
            </>
          ) : null
        }
      />
    </div>
  );
};

RobotsTxtGenerator.displayName = 'RobotsTxtGenerator';

export { RobotsTxtGenerator };
