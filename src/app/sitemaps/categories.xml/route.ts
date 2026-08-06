import { buildSitemapXml, sitemapXmlResponse, getCategoriesSitemapEntries } from '@/seo';

export const dynamic = 'force-static';

export function GET(): Response {
  return sitemapXmlResponse(buildSitemapXml(getCategoriesSitemapEntries()));
}
