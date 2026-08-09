'use client';

import React, { useState } from 'react';
import { Globe, Eye, Link, Copy, Download, Loader2, Image as ImageIcon } from 'lucide-react';
import type { ToolComponentProps } from '@/types';
import { extractOpenGraph, type OpenGraphPreview } from '@/lib/tools/seo-generators';
import { SectionHeading } from '@/components/shared/section-heading';
import { CopyButton } from '@/components/shared/copy-button';
import { DownloadButton } from '@/components/shared/download-button';
import { TransformPanel } from '@/components/tools/transform-panel';

const OpenGraphPreview: React.FC<ToolComponentProps> = () => {
  const [input, setInput] = useState('');
  const [url, setUrl] = useState('');
  const [preview, setPreview] = useState<OpenGraphPreview | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const extracted = React.useMemo(() => {
    if (!input.trim()) return null;
    return extractOpenGraph(input);
  }, [input]);

  const fetchFromUrl = async () => {
    if (!url.trim()) return;
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(url, { headers: { Accept: 'text/html' } });
      const html = await response.text();
      const og = extractOpenGraph(html);
      setInput(html);
      setPreview(og);
    } catch {
      setError('Failed to fetch URL. Check CORS or enter HTML directly.');
    } finally {
      setLoading(false);
    }
  };

  const displayPreview = preview ?? extracted;

  const generateTags = () =>
    [
      displayPreview?.title && `<meta property="og:title" content="${displayPreview.title}">`,
      displayPreview?.description &&
        `<meta property="og:description" content="${displayPreview.description}">`,
      displayPreview?.image && `<meta property="og:image" content="${displayPreview.image}">`,
      displayPreview?.url && `<meta property="og:url" content="${displayPreview.url}">`,
      `<meta property="og:type" content="${displayPreview?.type || 'website'}">`,
      displayPreview?.siteName &&
        `<meta property="og:site_name" content="${displayPreview.siteName}">`,
    ]
      .filter(Boolean)
      .join('\n');

  return (
    <div className="space-y-6">
      <SectionHeading
        icon={<Globe className="h-6 w-6" aria-hidden="true" />}
        title="Open Graph preview"
        description="Paste HTML or fetch a URL to preview how your page will look when shared on social media."
      />
      <div className="border-border bg-card rounded-xl border p-5">
        <div className="mb-4 flex flex-wrap gap-4">
          <button
            type="button"
            onClick={fetchFromUrl}
            disabled={loading || !url.trim()}
            className="border-primary bg-primary text-primary-foreground hover:bg-primary/90 inline-flex items-center gap-2 rounded-lg border px-4 py-2 text-sm font-medium disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Link className="h-4 w-4" />}
            {loading ? 'Fetching…' : 'Fetch from URL'}
          </button>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com"
            className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary flex-1 rounded-lg border px-4 py-3 text-sm focus-visible:ring-2 focus-visible:outline-none"
            disabled={loading}
          />
        </div>
        <label
          htmlFor="og-html"
          className="text-muted-foreground block text-xs font-semibold tracking-wider uppercase"
        >
          Or paste HTML directly
        </label>
        <textarea
          id="og-html"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="Paste HTML to extract Open Graph tags…"
          rows={6}
          spellCheck={false}
          className="border-border bg-background text-foreground placeholder:text-muted-foreground focus-visible:ring-primary mt-2 w-full resize-y rounded-lg border px-4 py-3 font-mono text-sm focus-visible:ring-2 focus-visible:outline-none"
        />
        {error && <p className="mt-3 text-sm text-red-600 dark:text-red-400">{error}</p>}
      </div>

      {displayPreview && (
        <>
          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground mb-4 text-xs font-semibold tracking-wider uppercase">
              Preview
            </p>
            <div className="flex flex-col gap-6 md:flex-row">
              <div className="min-w-0 flex-1">
                {displayPreview.image && (
                  <div className="border-border bg-muted aspect-video overflow-hidden rounded-lg border">
                    <img
                      src={displayPreview.image}
                      alt="og:image preview"
                      className="h-full w-full object-cover"
                    />
                  </div>
                )}
              </div>
              <div className="flex-1 space-y-3">
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                    og:title
                  </p>
                  <p className="font-medium">{displayPreview.title || '—'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                    og:description
                  </p>
                  <p className="text-sm">{displayPreview.description || '—'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                    og:type
                  </p>
                  <p className="font-mono text-sm">{displayPreview.type || 'website'}</p>
                </div>
                <div className="bg-muted/50 rounded-lg p-4">
                  <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                    og:url
                  </p>
                  <p className="truncate font-mono text-sm">{displayPreview.url || '—'}</p>
                </div>
                {displayPreview.siteName && (
                  <div className="bg-muted/50 rounded-lg p-4">
                    <p className="text-muted-foreground mb-1 text-xs font-semibold tracking-wider uppercase">
                      og:site_name
                    </p>
                    <p className="font-mono text-sm">{displayPreview.siteName}</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          <div className="border-border bg-card rounded-xl border p-5">
            <p className="text-muted-foreground mb-3 text-xs font-semibold tracking-wider uppercase">
              Generated tags
            </p>
            <TransformPanel
              inputId="og-tags"
              inputValue=""
              onInputChange={() => {}}
              outputValue={generateTags()}
              outputLabel="HTML"
              fileName="og-tags.html"
              toolbar={
                <>
                  <CopyButton value={generateTags()} iconOnly size="sm" />
                  <DownloadButton
                    content={generateTags()}
                    fileName="og-tags.html"
                    contentType="text/html;charset=utf-8"
                    label="Download"
                    size="sm"
                  />
                </>
              }
            />
          </div>
        </>
      )}
    </div>
  );
};

OpenGraphPreview.displayName = 'OpenGraphPreview';

export { OpenGraphPreview };
