'use client';

import React, { useMemo, useState } from 'react';
import { Share2, TriangleAlert } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { cn } from '@/lib/utils';
import { CopyButton } from '@/components/shared/copy-button';
import { SectionHeading } from '@/components/shared/section-heading';

type Mode = 'paste' | 'manual';

interface CardValues {
  title: string;
  description: string;
  image: string;
  cardType: string;
  site: string;
  creator: string;
}

const EMPTY: CardValues = {
  title: '',
  description: '',
  image: '',
  cardType: 'summary_large_image',
  site: '',
  creator: '',
};

function parseMetaTags(html: string): CardValues {
  const values: CardValues = { ...EMPTY };
  const tagPattern = /<meta\b[^>]*>/gi;
  let match = tagPattern.exec(html);
  while (match) {
    const tag = match[0];
    const propertyMatch = /\b(?:property|name)="([^"]+)"/i.exec(tag);
    const contentMatch = /\bcontent="([^"]*)"/i.exec(tag);
    if (propertyMatch && contentMatch) {
      const name = propertyMatch[1]!.toLowerCase();
      const content = contentMatch[1]!;
      switch (name) {
        case 'og:title':
        case 'twitter:title':
          values.title = values.title || content;
          break;
        case 'og:description':
        case 'twitter:description':
          values.description = values.description || content;
          break;
        case 'og:image':
        case 'twitter:image':
          values.image = values.image || content;
          break;
        case 'twitter:card':
          values.cardType = content;
          break;
        case 'og:site_name':
        case 'twitter:site':
          values.site = values.site || content;
          break;
        case 'twitter:creator':
          values.creator = content;
          break;
        default:
          break;
      }
    }
    match = tagPattern.exec(html);
  }
  return values;
}

function validateCard(values: CardValues): string[] {
  const warnings: string[] = [];
  if (!values.cardType) {
    warnings.push('Missing twitter:card meta tag.');
  } else if (values.cardType !== 'summary' && values.cardType !== 'summary_large_image') {
    warnings.push(
      `Unsupported card type "${values.cardType}" — use summary or summary_large_image.`
    );
  }
  if (!values.title) {
    warnings.push('Missing og:title / twitter:title — the card will show no title.');
  }
  if (!values.image) {
    warnings.push('Missing og:image / twitter:image — no image will be shown.');
  }
  if (!values.description) {
    warnings.push('Missing og:description — the card will show no description.');
  }
  return warnings;
}

function buildMetaTags(values: CardValues): string {
  const lines: string[] = [];
  if (values.cardType) {
    lines.push(`<meta name="twitter:card" content="${values.cardType}" />`);
  }
  if (values.title) {
    lines.push(`<meta property="og:title" content="${values.title}" />`);
    lines.push(`<meta name="twitter:title" content="${values.title}" />`);
  }
  if (values.description) {
    lines.push(`<meta property="og:description" content="${values.description}" />`);
    lines.push(`<meta name="twitter:description" content="${values.description}" />`);
  }
  if (values.image) {
    lines.push(`<meta property="og:image" content="${values.image}" />`);
    lines.push(`<meta name="twitter:image" content="${values.image}" />`);
  }
  if (values.site) {
    lines.push(`<meta property="og:site_name" content="${values.site}" />`);
    lines.push(`<meta name="twitter:site" content="${values.site}" />`);
  }
  if (values.creator) {
    lines.push(`<meta name="twitter:creator" content="${values.creator}" />`);
  }
  return lines.length > 0 ? `${lines.join('\n')}\n` : '';
}

const TwitterCardPreview: React.FC<ToolComponentProps> = () => {
  const [mode, setMode] = useState<Mode>('paste');
  const [paste, setPaste] = useState('');
  const [values, setValues] = useState<CardValues>(EMPTY);

  const effective: CardValues = useMemo(() => {
    if (mode === 'manual') return values;
    return parseMetaTags(paste);
  }, [mode, paste, values]);

  const warnings = useMemo(() => validateCard(effective), [effective]);
  const metaTags = useMemo(() => buildMetaTags(effective), [effective]);

  const setValue = (key: keyof CardValues, value: string): void => {
    setValues((current) => ({ ...current, [key]: value }));
  };

  const large = effective.cardType === 'summary_large_image';

  const cardPreview = (
    <div className="overflow-hidden rounded-xl border border-black/10 shadow-md dark:border-white/10">
      {large && (
        <div className="bg-muted flex h-56 w-full items-center justify-center">
          {effective.image ? (
            <img
              src={effective.image}
              alt=""
              className="h-full w-full object-cover"
              onError={(event) => {
                event.currentTarget.style.display = 'none';
              }}
            />
          ) : (
            <span className="text-muted-foreground text-sm italic">No image</span>
          )}
        </div>
      )}
      <div className={cn('bg-card p-4', !large && 'flex items-start gap-4')}>
        {!large && (
          <div className="bg-muted flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-lg">
            {effective.image ? (
              <img
                src={effective.image}
                alt=""
                className="h-full w-full object-cover"
                onError={(event) => {
                  event.currentTarget.style.display = 'none';
                }}
              />
            ) : (
              <span className="text-muted-foreground text-xs italic">No image</span>
            )}
          </div>
        )}
        <div className={cn(!large && 'min-w-0')}>
          <p className="text-muted-foreground truncate text-sm">
            {effective.site || 'example.com'}
          </p>
          <p className="mt-1 line-clamp-2 font-semibold break-words">
            {effective.title || 'Untitled'}
          </p>
          <p className="text-muted-foreground mt-1 line-clamp-2 text-sm break-words">
            {effective.description || 'No description provided.'}
          </p>
        </div>
      </div>
    </div>
  );

  const warningsBlock =
    warnings.length > 0 ? (
      <div className="border-border bg-card rounded-xl border p-5">
        <p className="flex items-center gap-2 text-sm font-semibold text-amber-600 dark:text-amber-400">
          <TriangleAlert className="h-4 w-4" aria-hidden="true" />
          Preview warnings
        </p>
        <ul className="text-muted-foreground mt-2 list-inside list-disc space-y-1 text-sm">
          {warnings.map((warning) => (
            <li key={warning}>{warning}</li>
          ))}
        </ul>
      </div>
    ) : null;

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Share2 className="h-6 w-6" aria-hidden="true" />}
        title="Twitter card preview"
        description="Paste your Open Graph / Twitter meta tags or fill the form to preview how your link will appear when shared on X (Twitter)."
      />

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="bg-muted inline-flex rounded-lg p-1">
          {(
            [
              { value: 'paste', label: 'Paste meta tags' },
              { value: 'manual', label: 'Enter details' },
            ] as const
          ).map((option) => (
            <button
              key={option.value}
              type="button"
              onClick={() => setMode(option.value)}
              className={cn(
                'rounded-md px-3 py-1.5 text-sm font-medium transition-colors',
                mode === option.value
                  ? 'bg-background text-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground'
              )}
              aria-pressed={mode === option.value}
            >
              {option.label}
            </button>
          ))}
        </div>

        {mode === 'paste' ? (
          <>
            <label
              htmlFor="twitter-paste-input"
              className="text-muted-foreground mt-5 block text-xs font-semibold tracking-wider uppercase"
            >
              Head HTML
            </label>
            <textarea
              id="twitter-paste-input"
              value={paste}
              onChange={(event) => setPaste(event.target.value)}
              placeholder={
                'Paste your <head> snippet with og:/twitter: meta tags…\n<meta property="og:title" content="My page" />'
              }
              spellCheck={false}
              rows={8}
              className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
            />
          </>
        ) : (
          <div className="mt-5 grid gap-4 sm:grid-cols-2">
            <div>
              <label
                htmlFor="twitter-title"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Title
              </label>
              <input
                id="twitter-title"
                type="text"
                value={values.title}
                onChange={(event) => setValue('title', event.target.value)}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="twitter-card-type"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Card type
              </label>
              <select
                id="twitter-card-type"
                value={values.cardType}
                onChange={(event) => setValue('cardType', event.target.value)}
                className="border-border bg-background text-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              >
                <option value="summary_large_image">summary_large_image</option>
                <option value="summary">summary</option>
              </select>
            </div>
            <div className="sm:col-span-2">
              <label
                htmlFor="twitter-description"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Description
              </label>
              <textarea
                id="twitter-description"
                value={values.description}
                onChange={(event) => setValue('description', event.target.value)}
                rows={2}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="twitter-image"
                className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
              >
                Image URL
              </label>
              <input
                id="twitter-image"
                type="url"
                value={values.image}
                onChange={(event) => setValue('image', event.target.value)}
                className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label
                  htmlFor="twitter-site"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Site handle
                </label>
                <input
                  id="twitter-site"
                  type="text"
                  value={values.site}
                  onChange={(event) => setValue('site', event.target.value)}
                  placeholder="@acme"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
              <div>
                <label
                  htmlFor="twitter-creator"
                  className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
                >
                  Creator handle
                </label>
                <input
                  id="twitter-creator"
                  type="text"
                  value={values.creator}
                  onChange={(event) => setValue('creator', event.target.value)}
                  placeholder="@author"
                  className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
                />
              </div>
            </div>
          </div>
        )}
      </div>

      {warningsBlock}

      <div className="border-border bg-card rounded-xl border p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
            Card preview
          </span>
          <span className="bg-muted rounded-full px-2.5 py-0.5 text-xs font-medium">
            {large ? 'summary_large_image' : 'summary'}
          </span>
        </div>
        <div className="mt-3 max-w-xl">{cardPreview}</div>
      </div>

      {metaTags && (
        <div className="border-border bg-card rounded-xl border p-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <span className="text-muted-foreground text-xs font-semibold tracking-wider uppercase">
              Generated meta tags
            </span>
            <CopyButton value={metaTags} size="sm" />
          </div>
          <pre className="bg-muted text-foreground mt-2 max-h-64 overflow-auto rounded-lg px-4 py-3 font-mono text-sm break-all whitespace-pre-wrap">
            {metaTags}
          </pre>
        </div>
      )}
    </div>
  );
};

TwitterCardPreview.displayName = 'TwitterCardPreview';

export { TwitterCardPreview };
