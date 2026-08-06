import { buildSitemapXml, sitemapXmlResponse, getToolsSitemapEntries } from '@/seo';

export const dynamic = 'force-static';

export function GET(): Response {
  return sitemapXmlResponse(buildSitemapXml(getToolsSitemapEntries()));
}
