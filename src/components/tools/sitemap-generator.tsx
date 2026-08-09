'use client';

import React, { useMemo, useState } from 'react';
import { FileText, Globe, Plus, Minus, Copy, Download, Calendar, Link } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { generateSitemap, type SitemapUrl } from '@/lib/tools/seo-generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const SitemapGenerator: React.FC<ToolComponentProps> = () => {
  const [urls, setUrls] = useState<SitemapUrl[]>([
    {
      url: 'https://example.com/',
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'daily',
      priority: 1.0,
    },
    { url: 'https://example.com/about', lastmod: '', changefreq: 'monthly', priority: 0.8 },
  ]);
  const [baseUrl, setBaseUrl] = useState('https://example.com');

  const output = useMemo(() => generateSitemap(urls), [urls]);

  const updateUrl = (index: number, field: keyof SitemapUrl, value: string | number) => {
    setUrls((prev) => {
      const next = [...prev];
      next[index] = { ...next[index], [field]: value };
      return next;
    });
  };

  const addUrl = () => {
    setUrls((prev) => [
      ...prev,
      { url: baseUrl + '/', lastmod: '', changefreq: 'weekly', priority: 0.5 },
    ]);
  };

  const removeUrl = (index: number) => {
    setUrls((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="Sitemap.xml generator"
        description="Create a standards-compliant sitemap.xml with URLs, lastmod, changefreq, and priority."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex items-center gap-4">
          <label className="text-muted-foreground block flex-1 text-xs font-semibold tracking-wider uppercase">
            Base URL
          </label>
          <input
            type="url"
            value={baseUrl}
            onChange={(event) => setBaseUrl(event.target.value)}
            placeholder="https://example.com"
            className="border-border bg-background text-foreground focus-visible:ring-primary w-80 rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
          />
          <button
            type="button"
            onClick={addUrl}
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-1.5 rounded-lg border px-3 py-2 text-sm font-medium"
          >
            <Plus className="h-4 w-4" aria-hidden="true" />
            Add URL
          </button>
        </div>
        <div className="space-y-3">
          {urls.map((url, index) => (
            <div
              key={index}
              className="border-border bg-background space-y-3 rounded-lg border p-4"
            >
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
                  URL #{index + 1}
                </p>
                {urls.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeUrl(index)}
                    className="text-muted-foreground hover:text-red-500"
                  >
                    <Minus className="h-4 w-4" aria-hidden="true" />
                  </button>
                )}
              </div>
              <div className="flex flex-wrap items-end gap-4">
                <div className="min-w-[200px] flex-1">
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
                    URL
                  </label>
                  <input
                    type="url"
                    value={url.url}
                    onChange={(event) => updateUrl(index, 'url', event.target.value)}
                    placeholder="https://example.com/page"
                    className="border-border bg-background text-foreground focus-visible:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
                    Last modified
                  </label>
                  <input
                    type="date"
                    value={url.lastmod ?? ''}
                    onChange={(event) => updateUrl(index, 'lastmod', event.target.value)}
                    className="border-border bg-background text-foreground focus-visible:ring-primary w-40 rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
                    Change frequency
                  </label>
                  <select
                    value={url.changefreq ?? ''}
                    onChange={(event) => updateUrl(index, 'changefreq', event.target.value)}
                    className="border-border bg-background text-foreground focus-visible:ring-primary w-40 rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  >
                    <option value="">Default</option>
                    <option value="always">Always</option>
                    <option value="hourly">Hourly</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                    <option value="never">Never</option>
                  </select>
                </div>
                <div>
                  <label className="text-muted-foreground mb-1 block text-xs font-semibold tracking-wider uppercase">
                    Priority
                  </label>
                  <input
                    type="number"
                    min={0}
                    max={1}
                    step={0.1}
                    value={url.priority ?? ''}
                    onChange={(event) => updateUrl(index, 'priority', Number(event.target.value))}
                    className="border-border bg-background text-foreground focus-visible:ring-primary w-24 rounded-lg border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <TransformPanel
        inputId="sitemap-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel="sitemap.xml"
        fileName="sitemap.xml"
        toolbar={
          output.trim() ? (
            <>
              <CopyButton value={output} iconOnly size="sm" />
              <DownloadButton
                content={output}
                fileName="sitemap.xml"
                contentType="application/xml;charset=utf-8"
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

SitemapGenerator.displayName = 'SitemapGenerator';

export { SitemapGenerator };
