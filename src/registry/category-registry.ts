import type { ToolCategoryDefinition } from '@/types';
import { isValidSlug } from '@/lib/tool-validation';
import { categoryDefinitions } from '@/registry/category-definitions';

const registry = new Map<string, ToolCategoryDefinition>();

export function registerCategory(definition: ToolCategoryDefinition): void {
  if (!isValidSlug(definition.slug)) {
    throw new Error(`Cannot register category "${definition.slug}": invalid slug`);
  }
  if (registry.has(definition.slug)) {
    throw new Error(`Cannot register category "${definition.slug}": already registered`);
  }
  registry.set(definition.slug, definition);
}

export function initializeCategoryRegistry(): void {
  categoryDefinitions.forEach(registerCategory);
}

export function getCategoryBySlug(slug: string): ToolCategoryDefinition | undefined {
  return registry.get(slug);
}

export function getCategoryOrThrow(slug: string): ToolCategoryDefinition {
  const category = registry.get(slug);
  if (!category) {
    throw new Error(`Category "${slug}" is not registered`);
  }
  return category;
}

export function categoryExists(slug: string): boolean {
  return registry.has(slug);
}

export function assertCategoryExists(slug: string): void {
  if (!registry.has(slug)) {
    throw new Error(`Category "${slug}" is not registered`);
  }
}

export function getAllCategories(): ToolCategoryDefinition[] {
  return [...registry.values()].sort((a, b) => a.order - b.order);
}

export function getFeaturedCategories(count = 6): ToolCategoryDefinition[] {
  return getAllCategories()
    .filter((category) => category.featured)
    .slice(0, count);
}

export function getCategorySlugs(): string[] {
  return [...registry.keys()];
}

export function getRegisteredCategoryCount(): number {
  return registry.size;
}

initializeCategoryRegistry();
