import type { Metadata } from 'next';
import Link from 'next/link';
import { FolderOpen } from 'lucide-react';
import { getAllCategories } from '@/data';
import {
  createMetadata,
  createItemListStructuredData,
  StructuredData,
  getCanonicalUrl,
} from '@/lib/seo';
import { CategoryCard } from '@/components/ui/category-card';
import { PageHeader } from '@/components/shared/page-header';
import { EmptyState } from '@/components/shared/empty-state';

export const metadata: Metadata = createMetadata({
  title: 'Categories',
  description:
    'Explore developer tool categories: API development, databases, frontend, backend, testing, monitoring, security, CI/CD, and more.',
  canonical: '/categories',
  keywords: ['tool categories', 'api development', 'databases', 'testing', 'monitoring', 'ci/cd'],
});

export default function CategoriesPage() {
  const categories = getAllCategories();

  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <StructuredData
        data={createItemListStructuredData(
          categories.map((category) => ({
            name: category.name,
            url: getCanonicalUrl(`/categories/${category.slug}`),
          }))
        )}
      />
      <PageHeader
        icon={<FolderOpen className="h-6 w-6" aria-hidden="true" />}
        title="Categories"
        description="Everything organized by discipline — find the right tools for the job."
        breadcrumb={[{ label: 'Categories', current: true }]}
      />

      {categories.length === 0 ? (
        <EmptyState
          icon="folder"
          title="No categories yet"
          description="Categories are being added. Check back soon."
        />
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((category) => (
            <Link
              key={category.id}
              href={`/categories/${category.slug}`}
              className="focus-visible:ring-ring rounded-xl focus-visible:ring-2 focus-visible:outline-none"
            >
              <CategoryCard category={category} />
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
