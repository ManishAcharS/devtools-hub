import type { Category, ToolCategoryDefinition } from '@/types';
import { getToolCountByCategory } from '@/data/tools';
import { categoryDefinitions } from '@/registry/category-definitions';

function withCounts(list: Category[]): Category[] {
  const counts = getToolCountByCategory();
  return list.map((category) => ({
    ...category,
    toolCount: counts[category.slug] ?? 0,
  }));
}

function toCategory(definition: ToolCategoryDefinition): Category {
  return {
    id: definition.id,
    slug: definition.slug,
    name: definition.name,
    description: definition.description,
    icon: definition.icon,
    toolCount: 0,
    featured: definition.featured,
    order: definition.order,
  };
}

export const categories: Category[] = withCounts(categoryDefinitions.map(toCategory));

export function getCategoryBySlug(slug: string): Category | undefined {
  const definition = categoryDefinitions.find((category) => category.slug === slug);
  return definition ? withCounts([toCategory(definition)])[0] : undefined;
}

export function getFeaturedCategories(count = 6): Category[] {
  return withCounts(
    categoryDefinitions
      .filter((category) => category.featured)
      .sort((a, b) => a.order - b.order)
      .map(toCategory)
  ).slice(0, count);
}

export function getAllCategories(): Category[] {
  return withCounts([...categoryDefinitions].sort((a, b) => a.order - b.order).map(toCategory));
}

export function getPopularCategories(count = 6): Category[] {
  return withCounts([...categoryDefinitions].map(toCategory))
    .sort((a, b) => b.toolCount - a.toolCount)
    .slice(0, count);
}
