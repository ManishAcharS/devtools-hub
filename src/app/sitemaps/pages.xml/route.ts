import { buildSitemapXml, sitemapXmlResponse, getPagesSitemapEntries } from '@/seo';

export const dynamic = 'force-static';

export function GET(): Response {
  return sitemapXmlResponse(buildSitemapXml(getPagesSitemapEntries()));
}
