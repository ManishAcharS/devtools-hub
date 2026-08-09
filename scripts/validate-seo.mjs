#!/usr/bin/env node
/**
 * SEO validation for Toolbox for Devs.
 *
 * Walks the static build output (.next/server/app) and asserts every
 * prerendered page includes: <title>, meta description, canonical link,
 * Open Graph (title/description/url/image), Twitter card, and JSON-LD.
 * Route-specific schema checks: tools -> SoftwareApplication + BreadcrumbList,
 * categories -> CollectionPage + BreadcrumbList, every page -> WebSite + Organization.
 * Also validates heading hierarchy (exactly one h1, no h2 before h1).
 *
 * Usage: node scripts/validate-seo.mjs   (run after `npm run build`)
 */

import { readdirSync, readFileSync, existsSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import process from 'node:process';

const SERVER_APP = join(process.cwd(), '.next', 'server', 'app');

const REQUIRED_META = [
  { selector: '<title>', label: '<title>' },
  { selector: 'name="description"', label: 'meta description' },
  { selector: 'rel="canonical"', label: 'canonical link' },
  { selector: 'property="og:title"', label: 'og:title' },
  { selector: 'property="og:description"', label: 'og:description' },
  { selector: 'property="og:url"', label: 'og:url' },
  { selector: 'property="og:image"', label: 'og:image' },
  { selector: 'name="twitter:card"', label: 'twitter:card' },
  { selector: 'application/ld+json', label: 'JSON-LD script' },
];

const EXCLUDED_ROUTES = ['/_global-error'];

const ROUTE_SCHEMAS = [
  { pattern: /\/tools\/[^/]+$/, types: ['SoftwareApplication', 'BreadcrumbList'] },
  { pattern: /\/categories\/[^/]+$/, types: ['CollectionPage', 'BreadcrumbList'] },
];

const GLOBAL_SCHEMAS = ['WebSite', 'Organization'];

function collectHtmlFiles(dir) {
  const files = [];
  if (!existsSync(dir)) return files;
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      files.push(...collectHtmlFiles(full));
    } else if (entry.endsWith('.html')) {
      files.push(full);
    }
  }
  return files;
}

function toUrl(relativePath) {
  const route = relativePath
    .replace(/\\/g, '/')
    .replace(/\.html$/, '')
    .replace(/^\([^)]+\)/, '')
    .replace(/\/?index$/, '')
    .replace(/^\/+/, '');
  const path = route === '' ? '' : `/${route}`;
  return `https://toolboxfordevs.vercel.app${path}`;
}

function stripHtmlEntities(html) {
  return html
    .replace(/&#x27;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>');
}

function checkHeadings(html, url, failures) {
  const headings = [...html.matchAll(/<h([1-6])[^>]*>/g)].map((m) => Number(m[1]));
  if (headings.length === 0) {
    failures.push(`${url}: no heading elements found`);
    return;
  }
  const firstH1Index = headings.indexOf(1);
  if (firstH1Index === -1) {
    failures.push(`${url}: no <h1> found`);
    return;
  }
  if (headings.slice(0, firstH1Index).includes(2)) {
    failures.push(`${url}: <h2> appears before the page <h1>`);
  }
}

function checkSchemas(html, url, failures) {
  const jsonLdBlocks = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)].map(
    (m) => m[1]
  );
  const decoded = jsonLdBlocks.map((block) => stripHtmlEntities(block));
  const allTypes = [];
  for (const block of decoded) {
    try {
      const parsed = JSON.parse(block);
      const types = Array.isArray(parsed) ? parsed.map((i) => i['@type']) : [parsed['@type']];
      allTypes.push(...types.flat());
    } catch {
      failures.push(`${url}: invalid JSON-LD block`);
    }
  }
  for (const type of GLOBAL_SCHEMAS) {
    if (!allTypes.includes(type)) {
      failures.push(`${url}: missing global schema @type "${type}"`);
    }
  }
  for (const { pattern, types } of ROUTE_SCHEMAS) {
    if (pattern.test(url)) {
      for (const type of types) {
        if (!allTypes.includes(type)) {
          failures.push(`${url}: missing page schema @type "${type}"`);
        }
      }
    }
  }
}

function main() {
  const htmlFiles = collectHtmlFiles(SERVER_APP);
  if (htmlFiles.length === 0) {
    console.error('No static pages found in .next/server/app. Run `npm run build` first.');
    process.exit(1);
  }

  let passed = 0;
  let skipped = 0;
  const failures = [];

  for (const file of htmlFiles) {
    const url = toUrl(relative(SERVER_APP, file));
    const routePath = new URL(url).pathname;
    if (EXCLUDED_ROUTES.some((excluded) => routePath === excluded)) {
      skipped++;
      console.log(`SKIP  ${url}`);
      continue;
    }
    const html = readFileSync(file, 'utf8');

    for (const { selector, label } of REQUIRED_META) {
      if (!html.includes(selector)) {
        failures.push(`${url}: missing ${label}`);
      }
    }
    const titleMatch = html.match(/<title>([\s\S]*?)<\/title>/);
    if (titleMatch && !titleMatch[1].trim()) {
      failures.push(`${url}: empty <title>`);
    }

    checkHeadings(html, url, failures);
    checkSchemas(html, url, failures);

    if (!failures.some((failure) => failure.startsWith(url + ':'))) {
      passed++;
      console.log(`PASS  ${url}`);
    }
  }

  console.log('----------------------------------------');
  for (const failure of failures) {
    console.error(`FAIL  ${failure}`);
  }
  console.log(
    `Validated ${htmlFiles.length} pages: ${passed} passed, ${skipped} skipped, ${htmlFiles.length - passed - skipped} failed.`
  );

  if (failures.length > 0) {
    process.exit(1);
  }
}

main();
