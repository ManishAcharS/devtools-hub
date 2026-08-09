import { test, expect } from '@playwright/test';
import { readFileSync } from 'node:fs';
import path from 'node:path';

const SOURCE = readFileSync(
  path.join(__dirname, '..', 'src', 'registry', 'tool-components.ts'),
  'utf8'
);
const exportStart = SOURCE.indexOf('export const toolComponents');
const EXPORT_SOURCE = exportStart >= 0 ? SOURCE.slice(exportStart) : SOURCE;
const SLUGS: string[] = [...EXPORT_SOURCE.matchAll(/'([a-z0-9-]+)':\s*[A-Z][A-Za-z0-9]+/g)].map(
  (m) => m[1]
);

test.describe('metadata + related tools (global)', () => {
  test('every tool page has unique metadata and working related links', async ({ request }) => {
    const titles = new Map<string, string[]>();
    const descriptions = new Map<string, string[]>();
    const failures: string[] = [];
    const relatedLinks = new Set<string>();

    for (const slug of SLUGS) {
      const res = await request.get(`/tools/${slug}`);
      if (res.status() !== 200) {
        failures.push(`${slug}: HTTP ${res.status()}`);
        continue;
      }
      const html = await res.text();

      const title = (html.match(/<title>([^<]*)<\/title>/) ?? [])[1] ?? '';
      const description = (html.match(/<meta name="description" content="([^"]*)"/) ?? [])[1] ?? '';
      const canonical = (html.match(/<link rel="canonical" href="([^"]*)"/) ?? [])[1] ?? '';

      if (!title) failures.push(`${slug}: empty <title>`);
      if (!description) failures.push(`${slug}: empty meta description`);
      if (!canonical.includes(`/tools/${slug}`))
        failures.push(`${slug}: canonical missing or wrong`);

      if (title) {
        const existing = titles.get(title) ?? [];
        existing.push(slug);
        titles.set(title, existing);
      }
      if (description) {
        const existing = descriptions.get(description) ?? [];
        existing.push(description.length > 60 ? slug : `${slug}(short)`);
        descriptions.set(description, existing);
      }

      // Collect related-tool links from the page
      for (const m of html.matchAll(/href="(\/tools\/[a-z0-9-]+)"/g)) {
        relatedLinks.add(m[1]);
      }

      // JSON-LD structured data present
      if (!html.includes('application/ld+json')) {
        failures.push(`${slug}: no structured data`);
      }
    }

    for (const [title, slugs] of titles) {
      if (slugs.length > 1) failures.push(`duplicate title "${title}" on: ${slugs.join(', ')}`);
    }
    for (const [description, slugs] of descriptions) {
      if (slugs.length > 1)
        failures.push(
          `duplicate description on: ${slugs.join(', ')} (${description.slice(0, 60)}…)`
        );
    }

    // Every related link must resolve
    const entries = [...relatedLinks];
    const bad: string[] = [];
    const batchSize = 20;
    for (let i = 0; i < entries.length; i += batchSize) {
      const results = await Promise.all(
        entries.slice(i, i + batchSize).map(async (link) => {
          const r = await request.get(link);
          return { link, ok: r.status() === 200, status: r.status() };
        })
      );
      for (const r of results) if (!r.ok) bad.push(`${r.link} -> ${r.status}`);
    }

    if (bad.length) failures.push(`broken related links: ${bad.slice(0, 20).join(', ')}`);
    if (relatedLinks.size === 0) failures.push('no related links found anywhere');

    expect.soft(failures).toEqual([]);
  });
});
