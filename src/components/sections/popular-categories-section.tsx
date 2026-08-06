import React from 'react';
import Link from 'next/link';
import { Compass } from 'lucide-react';
import { CategoryCard } from '@/components/ui/category-card';
import { SectionHeading } from '@/components/shared/section-heading';
import { getPopularCategories } from '@/data';
import type { Category } from '@/types';

interface PopularCategoriesSectionProps {
  categories?: Category[];
  title?: string;
  description?: string;
}

const PopularCategoriesSection: React.FC<PopularCategoriesSectionProps> = ({
  categories = getPopularCategories(6),
  title = 'Browse by Category',
  description = 'Jump straight into the tools that fit your stack.',
}) => {
  return (
    <section className="border-border bg-muted/30 border-y">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <SectionHeading
          title={title}
          description={description}
          icon={<Compass className="h-6 w-6" aria-hidden="true" />}
          actionLabel="All categories"
          actionHref="/categories"
        />
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
      </div>
    </section>
  );
};

PopularCategoriesSection.displayName = 'PopularCategoriesSection';

export { PopularCategoriesSection };
