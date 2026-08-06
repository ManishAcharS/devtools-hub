import { SITE_URL } from './config';
import { getAllTools, getAllCategories, getAllPosts, getAllResources } from '@/data';

export type ChangeFrequency =
  'always' | 'hourly' | 'daily' | 'weekly' | 'monthly' | 'yearly' | 'never';

export interface SitemapEntry {
  url: string;
  lastModified?: Date;
  changeFrequency?: ChangeFrequency;
  priority?: number;
}

export function buildSitemapXml(entries: SitemapEntry[]): string {
  const body = entries
    .map((entry) => {
      const lastmod = entry.lastModified
        ? `\n    <lastmod>${entry.lastModified.toISOString()}</lastmod>`
        : '';
      const changefreq = entry.changeFrequency
        ? `\n    <changefreq>${entry.changeFrequency}</changefreq>`
        : '';
      const priority =
        entry.priority !== undefined ? `\n    <priority>${entry.priority}</priority>` : '';
      return `  <url>\n    <loc>${entry.url}</loc>${lastmod}${changefreq}${priority}\n  </url>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</urlset>`;
}

export function buildSitemapIndexXml(locations: Array<{ loc: string; lastmod?: Date }>): string {
  const body = locations
    .map(({ loc, lastmod }) => {
      const lastmodTag = lastmod ? `<lastmod>${lastmod.toISOString()}</lastmod>` : '';
      return `  <sitemap>\n    <loc>${loc}</loc>${lastmodTag}\n  </sitemap>`;
    })
    .join('\n');

  return `<?xml version="1.0" encoding="UTF-8"?>\n<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${body}\n</sitemapindex>`;
}

export function sitemapXmlResponse(xml: string): Response {
  return new Response(xml, {
    headers: {
      'Content-Type': 'application/xml; charset=utf-8',
      'Cache-Control': 'public, max-age=3600, s-maxage=86400',
    },
  });
}

export function getPagesSitemapEntries(): SitemapEntry[] {
  return [
    { url: `${SITE_URL}/`, changeFrequency: 'daily', priority: 1 },
    { url: `${SITE_URL}/tools`, changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE_URL}/categories`, changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE_URL}/blog`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/resources`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE_URL}/about`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/contact`, changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE_URL}/privacy`, changeFrequency: 'yearly', priority: 0.2 },
    { url: `${SITE_URL}/terms`, changeFrequency: 'yearly', priority: 0.2 },
    ...getAllResources().map((resource): SitemapEntry => ({
      url: `${SITE_URL}/resources/${resource.slug}`,
      changeFrequency: 'monthly',
      priority: 0.5,
    })),
  ];
}

export function getToolsSitemapEntries(): SitemapEntry[] {
  return getAllTools().map((tool) => ({
    url: `${SITE_URL}/tools/${tool.slug}`,
    lastModified: new Date(tool.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.7,
  }));
}

export function getCategoriesSitemapEntries(): SitemapEntry[] {
  return getAllCategories().map((category) => ({
    url: `${SITE_URL}/categories/${category.slug}`,
    changeFrequency: 'weekly',
    priority: 0.6,
  }));
}

export function getBlogSitemapEntries(): SitemapEntry[] {
  return getAllPosts().map((post) => ({
    url: `${SITE_URL}/blog/${post.slug}`,
    lastModified: new Date(post.updatedAt),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));
}
