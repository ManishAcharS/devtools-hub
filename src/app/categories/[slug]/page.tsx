import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import {
  getAllCategorySlugs,
  getCategoryDefinitionBySlug,
  getCategoryToolCounts,
  getCategoryTools,
  getCategoryFeaturedTools,
  getCategoryPopularTools,
  getCategoryRecentlyAddedTools,
  getRelatedCategoryDefinitions,
  getCategoryFeaturedArticles,
  getCategoryFaqs,
  getCategoryStats,
  toCategoryView,
} from '@/registry';
import {
  createCategoryPageMetadata,
  createCategoryPageStructuredData,
  StructuredData,
} from '@/lib/seo';
import {
  CategoryHero,
  CategoryDescription,
  CategoryToolGrid,
  FeaturedTools,
  PopularTools,
  RecentlyAddedTools,
  RelatedCategories,
  CategoryFAQ,
  EmptyCategoryState,
  FeaturedArticles,
} from '@/components/categories';
import { FooterCtaSection } from '@/components/sections/footer-cta-section';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getAllCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const definition = getCategoryDefinitionBySlug(slug);
  if (!definition) return {};
  const toolCount = getCategoryToolCounts()[definition.slug] ?? 0;
  return createCategoryPageMetadata(definition, toolCount);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const definition = getCategoryDefinitionBySlug(slug);

  if (!definition) {
    notFound();
  }

  const counts = getCategoryToolCounts();
  const view = toCategoryView(definition, counts);
  const stats = getCategoryStats(definition);
  const tools = getCategoryTools(definition);
  const featured = getCategoryFeaturedTools(definition, 4);
  const popular = getCategoryPopularTools(definition, 6);
  const recent = getCategoryRecentlyAddedTools(definition, 4);
  const related = getRelatedCategoryDefinitions(definition, 3).map((relatedDefinition) =>
    toCategoryView(relatedDefinition, counts)
  );
  const articles = getCategoryFeaturedArticles(definition, 3);
  const faqs = getCategoryFaqs(definition);

  const showCuratedSections = tools.length >= 3;

  return (
    <>
      <StructuredData data={createCategoryPageStructuredData(view, tools, faqs)} />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <CategoryHero
          title={definition.title}
          shortDescription={definition.shortDescription}
          icon={definition.icon}
          color={definition.color}
          stats={stats}
          breadcrumb={[
            { label: 'Categories', href: '/categories' },
            { label: definition.title, current: true },
          ]}
        />

        <CategoryDescription longDescription={definition.longDescription} />

        {tools.length > 0 ? (
          <CategoryToolGrid
            tools={tools}
            title={`All ${definition.title} tools (${tools.length})`}
          />
        ) : (
          <EmptyCategoryState icon={definition.icon} color={definition.color} />
        )}

        {showCuratedSections && featured.length > 0 && <FeaturedTools tools={featured} />}
        {showCuratedSections && popular.length > 0 && <PopularTools tools={popular} />}
        {showCuratedSections && recent.length > 0 && <RecentlyAddedTools tools={recent} />}

        {related.length > 0 && <RelatedCategories categories={related} />}
        {articles.length > 0 && <FeaturedArticles articles={articles} />}
        {faqs.length > 0 && <CategoryFAQ faqs={faqs} />}

        <FooterCtaSection />
      </div>
    </>
  );
}
