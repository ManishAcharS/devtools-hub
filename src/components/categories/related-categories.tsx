import React from 'react';
import Link from 'next/link';
import { CategoryCard } from '@/components/ui/category-card';
import type { Category } from '@/types';

interface RelatedCategoriesProps {
  categories: Category[];
}

const RelatedCategories: React.FC<RelatedCategoriesProps> = ({ categories }) => {
  if (categories.length === 0) return null;
  return (
    <section aria-label="Related categories" className="mt-14">
      <h2 className="text-2xl font-bold tracking-tight">Related categories</h2>
      <p className="text-muted-foreground mt-2 mb-6">
        Explore more tools across similar disciplines.
      </p>
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
    </section>
  );
};

RelatedCategories.displayName = 'RelatedCategories';

export { RelatedCategories };
