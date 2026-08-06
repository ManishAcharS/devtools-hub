import { buildSitemapIndexXml, sitemapXmlResponse, SITE_URL } from '@/seo';

export const dynamic = 'force-static';

export function GET(): Response {
  const xml = buildSitemapIndexXml([
    { loc: `${SITE_URL}/sitemaps/pages.xml` },
    { loc: `${SITE_URL}/sitemaps/tools.xml` },
    { loc: `${SITE_URL}/sitemaps/categories.xml` },
    { loc: `${SITE_URL}/sitemaps/blog.xml` },
  ]);
  return sitemapXmlResponse(xml);
}
