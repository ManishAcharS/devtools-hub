import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { FolderOpen } from 'lucide-react';
import {
  getCategoryBySlug,
  getCategorySlugs,
  getToolsByCategory,
  getToolCountByCategory,
} from '@/registry';
import {
  createCategoryMetadata,
  createCategoryStructuredData,
  StructuredData,
  getRelatedCategories,
} from '@/lib/seo';
import { ToolCard } from '@/components/ui/tool-card';
import { CategoryCard } from '@/components/ui/category-card';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

interface CategoryPageProps {
  params: Promise<{ slug: string }>;
}

export const dynamicParams = false;

export function generateStaticParams(): { slug: string }[] {
  return getCategorySlugs().map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);
  if (!category) return {};
  const toolCount = getToolCountByCategory()[category.slug] ?? 0;
  return createCategoryMetadata(category, toolCount);
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = getCategoryBySlug(slug);

  if (!category) {
    notFound();
  }

  const tools = getToolsByCategory(category.slug);
  const toolCount = getToolCountByCategory()[category.slug] ?? 0;
  const relatedCategories = getRelatedCategories(category, 3);

  return (
    <>
      <StructuredData data={createCategoryStructuredData(category, tools)} />
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          icon={<FolderOpen className="h-6 w-6" aria-hidden="true" />}
          title={`${category.name} Tools`}
          description={category.description}
          breadcrumb={[
            { label: 'Categories', href: '/categories' },
            { label: category.name, current: true },
          ]}
          actions={
            <span className="text-muted-foreground bg-muted rounded-full px-3 py-1 text-sm font-medium">
              {toolCount} {toolCount === 1 ? 'tool' : 'tools'}
            </span>
          }
        />

        {tools.length === 0 ? (
          <EmptyState
            icon="tools"
            title={`No ${category.name} tools yet`}
            description="Tools in this category are being added. Check back soon or explore other categories."
            action={
              <Button variant="outline" asChild>
                <Link href="/tools">Browse all tools</Link>
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {tools.map((tool) => (
              <Link
                key={tool.slug}
                href={`/tools/${tool.slug}`}
                className="group focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
              >
                <ToolCard tool={tool} />
              </Link>
            ))}
          </div>
        )}

        {relatedCategories.length > 0 && (
          <section aria-label={`Related categories`} className="mt-14">
            <h2 className="text-2xl font-bold tracking-tight">Related categories</h2>
            <p className="text-muted-foreground mt-2 mb-6">
              Explore more tools across similar disciplines.
            </p>
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {relatedCategories.map((related) => (
                <Link
                  key={related.id}
                  href={`/categories/${related.slug}`}
                  className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
                >
                  <CategoryCard category={related} />
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </>
  );
}
