import type {
  Category,
  BlogPost,
  CategoryDefinition,
  ToolCategoryDefinition,
  ToolDefinition,
} from '@/types';
import { getAllPosts, getPostBySlug } from '@/data/content';
import {
  getAllCategories as getAllRegisteredCategories,
  getCategorySlugs as getRegisteredCategorySlugs,
} from '@/registry/category-registry';
import { getAllToolDefinitions, getToolDefinition, hasTool } from '@/registry/tool-registry';
import { dynamicCategoryDefinitions } from '@/registry/category-definitions';

const dynamicBySlug = new Map(dynamicCategoryDefinitions.map((def) => [def.slug, def]));

function normalizeDefinition(definition: ToolCategoryDefinition): CategoryDefinition {
  const dynamic = dynamicBySlug.get(definition.slug);
  if (dynamic) return dynamic;
  return {
    id: definition.id,
    slug: definition.slug,
    title: definition.name,
    shortDescription: definition.description,
    longDescription: definition.description,
    icon: definition.icon,
    color: 'primary',
    keywords: [definition.name.toLowerCase()],
    seo: undefined,
    featuredTools: [],
    relatedCategories: [],
    featuredArticles: [],
    faqs: [],
    displayOrder: definition.order,
    featured: definition.featured,
  };
}

export function getAllCategoryDefinitions(): CategoryDefinition[] {
  return getAllRegisteredCategories().map(normalizeDefinition);
}

export function getCategoryDefinitionBySlug(slug: string): CategoryDefinition | undefined {
  const registered = getAllRegisteredCategories().find((definition) => definition.slug === slug);
  return registered ? normalizeDefinition(registered) : undefined;
}

export function getCategoryDefinitionOrThrow(slug: string): CategoryDefinition {
  const definition = getCategoryDefinitionBySlug(slug);
  if (!definition) {
    throw new Error(`Category "${slug}" is not registered`);
  }
  return definition;
}

export function getAllCategorySlugs(): string[] {
  return getRegisteredCategorySlugs();
}

export function isDynamicCategory(slug: string): boolean {
  return dynamicBySlug.has(slug);
}

export function getCategoryToolCounts(): Record<string, number> {
  return getAllCategoryDefinitions().reduce<Record<string, number>>((acc, definition) => {
    acc[definition.slug] = getCategoryTools(definition).length;
    return acc;
  }, {});
}

export function getCategoryTools(definition: CategoryDefinition): ToolDefinition[] {
  const keywords = new Set(definition.keywords.map((keyword) => keyword.toLowerCase()));
  return getAllToolDefinitions()
    .filter((tool) => {
      if (tool.category === definition.slug) return true;
      if (tool.tags.some((tag) => keywords.has(tag.toLowerCase()))) return true;
      return tool.keywords.some((keyword) => keywords.has(keyword.toLowerCase()));
    })
    .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
}

export function getCategoryFeaturedTools(
  definition: CategoryDefinition,
  count = 4
): ToolDefinition[] {
  const explicit = (definition.featuredTools ?? [])
    .map((slug) => getToolDefinition(slug))
    .filter((tool): tool is ToolDefinition => tool !== undefined);
  const explicitSlugs = new Set(explicit.map((tool) => tool.slug));
  const rest = getCategoryTools(definition).filter((tool) => !explicitSlugs.has(tool.slug));
  return [...explicit, ...rest].slice(0, count);
}

export function getCategoryPopularTools(
  definition: CategoryDefinition,
  count = 6
): ToolDefinition[] {
  return [...getCategoryTools(definition)]
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, count);
}

export function getCategoryRecentlyAddedTools(
  definition: CategoryDefinition,
  count = 4
): ToolDefinition[] {
  return [...getCategoryTools(definition)]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function getRelatedCategoryDefinitions(
  definition: CategoryDefinition,
  count = 4
): CategoryDefinition[] {
  const candidates = getAllCategoryDefinitions().filter(
    (candidate) => candidate.slug !== definition.slug
  );
  const explicit = (definition.relatedCategories ?? [])
    .map((slug) => candidates.find((candidate) => candidate.slug === slug))
    .filter((candidate): candidate is CategoryDefinition => candidate !== undefined);
  const explicitSlugs = new Set(explicit.map((candidate) => candidate.slug));

  const computed = candidates
    .filter((candidate) => !explicitSlugs.has(candidate.slug))
    .map((candidate) => ({ candidate, score: categoryRelatednessScore(definition, candidate) }))
    .filter((entry) => entry.score > 0)
    .sort((a, b) => b.score - a.score)
    .map((entry) => entry.candidate);

  return [...explicit, ...computed].slice(0, count);
}

function categoryRelatednessScore(
  source: CategoryDefinition,
  candidate: CategoryDefinition
): number {
  let score = 0;
  const sourceTools = new Set(getCategoryTools(source).map((tool) => tool.slug));
  getCategoryTools(candidate).forEach((tool) => {
    if (sourceTools.has(tool.slug)) score += 10;
  });
  const sourceKeywords = new Set(source.keywords.map((keyword) => keyword.toLowerCase()));
  candidate.keywords.forEach((keyword) => {
    if (sourceKeywords.has(keyword.toLowerCase())) score += 2;
  });
  score += Math.max(0, 60 - Math.abs(source.displayOrder - candidate.displayOrder));
  return score;
}

export function getCategoryFeaturedArticles(definition: CategoryDefinition, count = 3): BlogPost[] {
  const explicit = (definition.featuredArticles ?? [])
    .map((slug) => getPostBySlug(slug))
    .filter((post): post is BlogPost => post !== undefined);
  const explicitSlugs = new Set(explicit.map((post) => post.slug));
  const keywords = new Set(definition.keywords.map((keyword) => keyword.toLowerCase()));
  const rest = getAllPosts()
    .filter((post) => !explicitSlugs.has(post.slug))
    .filter(
      (post) =>
        post.category === definition.slug ||
        post.tags.some((tag) => keywords.has(tag.toLowerCase()))
    );
  return [...explicit, ...rest].slice(0, count);
}

export function getCategoryFaqs(definition: CategoryDefinition) {
  return definition.faqs;
}

export interface CategoryStats {
  toolCount: number;
  featuredToolCount: number;
  articleCount: number;
}

export function getCategoryStats(definition: CategoryDefinition): CategoryStats {
  return {
    toolCount: getCategoryTools(definition).length,
    featuredToolCount: (definition.featuredTools ?? []).filter((slug) => hasTool(slug)).length,
    articleCount: getCategoryFeaturedArticles(definition, 3).length,
  };
}

export function toCategoryView(
  definition: CategoryDefinition,
  counts?: Record<string, number>
): Category {
  return {
    id: definition.id,
    slug: definition.slug,
    name: definition.title,
    description: definition.shortDescription,
    icon: definition.icon,
    toolCount: counts?.[definition.slug] ?? 0,
    featured: definition.featured ?? false,
    order: definition.displayOrder,
    color: definition.color,
  };
}
