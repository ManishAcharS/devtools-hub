import { buildSitemapXml, sitemapXmlResponse, getBlogSitemapEntries } from '@/seo';

export const dynamic = 'force-static';

export function GET(): Response {
  return sitemapXmlResponse(buildSitemapXml(getBlogSitemapEntries()));
}
