import type { Category } from '@/types';
import {
  getAllCategoryDefinitions,
  getCategoryDefinitionBySlug,
  getCategoryToolCounts,
  toCategoryView,
} from '@/registry';

function withCounts(list: Category[]): Category[] {
  const counts = getCategoryToolCounts();
  return list.map((category) => ({
    ...category,
    toolCount: counts[category.slug] ?? 0,
  }));
}

export const categories: Category[] = withCounts(
  getAllCategoryDefinitions().map((def) => toCategoryView(def))
);

export function getCategoryBySlug(slug: string): Category | undefined {
  const definition = getCategoryDefinitionBySlug(slug);
  return definition ? withCounts([toCategoryView(definition)])[0] : undefined;
}

export function getFeaturedCategories(count = 6): Category[] {
  return withCounts(
    getAllCategoryDefinitions()
      .filter((definition) => definition.featured)
      .map((def) => toCategoryView(def))
  ).slice(0, count);
}

export function getAllCategories(): Category[] {
  return withCounts(getAllCategoryDefinitions().map((def) => toCategoryView(def)));
}

export function getPopularCategories(count = 6): Category[] {
  return withCounts(getAllCategoryDefinitions().map((def) => toCategoryView(def)))
    .sort((a, b) => b.toolCount - a.toolCount)
    .slice(0, count);
}
