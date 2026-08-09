'use client';

import React, { useMemo, useState } from 'react';
import { FileText, Copy, Download, Tag, Link, Globe, Twitter, Search } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import {
  generateMetaTags,
  DEFAULT_META_TAGS,
  type MetaTagOptions,
} from '@/lib/tools/seo-generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { TransformPanel } from '@/components/tools/transform-panel';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';

const MetaTagGenerator: React.FC<ToolComponentProps> = () => {
  const [form, setForm] = useState<MetaTagOptions>(DEFAULT_META_TAGS);

  const output = useMemo(() => generateMetaTags(form), [form]);

  const update = (field: keyof MetaTagOptions, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const fields: {
    key: keyof MetaTagOptions;
    label: string;
    placeholder: string;
    icon?: React.ReactNode;
  }[] = [
    {
      key: 'title',
      label: 'Page title',
      placeholder: 'My Page Title',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: 'description',
      label: 'Meta description',
      placeholder: 'A brief description of the page.',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: 'keywords',
      label: 'Keywords (comma-separated)',
      placeholder: 'keyword1, keyword2, keyword3',
      icon: <Tag className="h-4 w-4" />,
    },
    {
      key: 'author',
      label: 'Author',
      placeholder: 'Your Name',
      icon: <FileText className="h-4 w-4" />,
    },
    {
      key: 'canonical',
      label: 'Canonical URL',
      placeholder: 'https://example.com/page',
      icon: <Link className="h-4 w-4" />,
    },
    {
      key: 'robots',
      label: 'Robots',
      placeholder: 'index, follow',
      icon: <Search className="h-4 w-4" />,
    },
    {
      key: 'ogTitle',
      label: 'og:title',
      placeholder: 'My Page Title',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: 'ogDescription',
      label: 'og:description',
      placeholder: 'A brief description for social shares.',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: 'ogImage',
      label: 'og:image URL',
      placeholder: 'https://example.com/image.png',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: 'ogUrl',
      label: 'og:url',
      placeholder: 'https://example.com/page',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: 'ogType',
      label: 'og:type',
      placeholder: 'website',
      icon: <Globe className="h-4 w-4" />,
    },
    {
      key: 'twitterCard',
      label: 'twitter:card',
      placeholder: 'summary_large_image',
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      key: 'twitterSite',
      label: 'twitter:site',
      placeholder: '@username',
      icon: <Twitter className="h-4 w-4" />,
    },
    {
      key: 'twitterCreator',
      label: 'twitter:creator',
      placeholder: '@username',
      icon: <Twitter className="h-4 w-4" />,
    },
  ];

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="Meta tag generator"
        description="Generate complete HTML meta tags for SEO, Open Graph, and Twitter Cards."
      />
      <div className="space-y-4">
        {fields.map(({ key, label, placeholder, icon }) => (
          <div key={key} className="border-border bg-card rounded-xl border p-5">
            <div className="flex items-center gap-2">
              {icon && <span className="text-muted-foreground">{icon}</span>}
              <label
                htmlFor={`meta-${key}`}
                className="text-muted-foreground block flex-1 text-xs font-semibold tracking-wider uppercase"
              >
                {label}
              </label>
            </div>
            <input
              id={`meta-${key}`}
              type="text"
              value={form[key]}
              onChange={(event) => update(key, event.target.value)}
              placeholder={placeholder}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </div>
        ))}
      </div>

      <TransformPanel
        inputId="meta-output"
        inputValue=""
        onInputChange={() => {}}
        outputValue={output}
        outputLabel="HTML meta tags"
        fileName="meta-tags.html"
        toolbar={
          output.trim() ? (
            <>
              <CopyButton value={output} iconOnly size="sm" />
              <DownloadButton
                content={output}
                fileName="meta-tags.html"
                contentType="text/html;charset=utf-8"
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

MetaTagGenerator.displayName = 'MetaTagGenerator';

export { MetaTagGenerator };
