import type { ToolDefinition, ToolRegistryEntry } from '@/types';
import {
  validateToolDefinition,
  validateToolRegistry,
  formatIssues,
  type ValidationIssue,
} from '@/lib/tool-validation';
import { categoryExists, getCategorySlugs } from '@/registry/category-registry';
import { toolDefinitions } from '@/registry/tool-definitions';
import { toolComponents } from '@/registry/tool-components';

const registry = new Map<string, ToolRegistryEntry>();

function assertValidDefinition(definition: ToolDefinition): void {
  const knownCategories = new Set(getCategorySlugs());
  const result = validateToolDefinition(definition, knownCategories);
  if (!result.valid) {
    throw new Error(`Invalid tool definition "${definition.slug}": ${formatIssues(result.issues)}`);
  }
}

export function registerTool(entry: ToolRegistryEntry): void {
  assertValidDefinition(entry.definition);
  if (registry.has(entry.definition.slug)) {
    throw new Error(`Cannot register tool "${entry.definition.slug}": already registered`);
  }
  registry.set(entry.definition.slug, entry);
}

export function registerTools(entries: ToolRegistryEntry[]): void {
  const knownCategories = new Set(getCategorySlugs());
  const result = validateToolRegistry(entries, knownCategories);
  if (!result.valid) {
    throw new Error(`Invalid tool definitions: ${formatIssues(result.issues)}`);
  }
  entries.forEach((entry) => {
    registry.set(entry.definition.slug, entry);
  });
}

export function validateRegisteredTools(): ValidationIssue[] {
  const knownCategories = new Set(getCategorySlugs());
  return validateToolRegistry([...registry.values()], knownCategories).issues;
}

export function hasTool(slug: string): boolean {
  return registry.has(slug);
}

export function getToolEntry(slug: string): ToolRegistryEntry | undefined {
  return registry.get(slug);
}

export function getToolDefinition(slug: string): ToolDefinition | undefined {
  return registry.get(slug)?.definition;
}

export function getToolDefinitionOrThrow(slug: string): ToolDefinition {
  const entry = registry.get(slug);
  if (!entry) {
    throw new Error(`Tool "${slug}" is not registered`);
  }
  return entry.definition;
}

export function getToolSlugs(): string[] {
  return [...registry.keys()];
}

export function getAllToolEntries(): ToolRegistryEntry[] {
  return [...registry.values()];
}

export function getAllToolDefinitions(): ToolDefinition[] {
  return [...registry.values()]
    .map((entry) => entry.definition)
    .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
}

export function getToolsByCategory(categorySlug: string): ToolDefinition[] {
  return [...registry.values()]
    .map((entry) => entry.definition)
    .filter((definition) => definition.category === categorySlug)
    .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
}

export function getToolsByTag(tag: string): ToolDefinition[] {
  const normalized = tag.toLowerCase();
  return [...registry.values()]
    .map((entry) => entry.definition)
    .filter((definition) => definition.tags.some((candidate) => candidate === normalized))
    .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
}

export function getFeaturedTools(count = 4): ToolDefinition[] {
  return getAllToolDefinitions()
    .filter((definition) => definition.featured)
    .slice(0, count);
}

export function getTrendingTools(count = 6): ToolDefinition[] {
  return [...registry.values()]
    .map((entry) => entry.definition)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, count);
}

export function getRecentlyAddedTools(count = 4): ToolDefinition[] {
  return [...registry.values()]
    .map((entry) => entry.definition)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, count);
}

export function getToolCountByCategory(): Record<string, number> {
  return [...registry.values()].reduce<Record<string, number>>((acc, entry) => {
    acc[entry.definition.category] = (acc[entry.definition.category] ?? 0) + 1;
    return acc;
  }, {});
}

export function getRelatedToolsFor(definition: ToolDefinition, count = 3): ToolDefinition[] {
  const explicit = (definition.relatedTools ?? [])
    .map((slug) => registry.get(slug)?.definition)
    .filter((candidate): candidate is ToolDefinition => candidate !== undefined)
    .filter((candidate) => candidate.slug !== definition.slug);

  const affinity = getAllToolDefinitions()
    .filter((candidate) => candidate.slug !== definition.slug)
    .sort((a, b) => {
      const aScore = similarityScore(definition, a);
      const bScore = similarityScore(definition, b);
      return bScore - aScore;
    });

  const combined: ToolDefinition[] = [];
  const seen = new Set<string>();
  explicit.forEach((candidate) => {
    if (!seen.has(candidate.slug)) {
      seen.add(candidate.slug);
      combined.push(candidate);
    }
  });
  affinity.forEach((candidate) => {
    if (combined.length >= count) return;
    if (!seen.has(candidate.slug)) {
      seen.add(candidate.slug);
      combined.push(candidate);
    }
  });
  return combined.slice(0, count);
}

function similarityScore(source: ToolDefinition, candidate: ToolDefinition): number {
  let score = 0;
  if (candidate.category === source.category) score += 10;
  const sharedTags = candidate.tags.filter((tag) => source.tags.includes(tag)).length;
  score += sharedTags * 2;
  const sharedKeywords = candidate.keywords.filter((keyword) =>
    source.keywords.includes(keyword)
  ).length;
  score += sharedKeywords;
  return score;
}

export function searchTools(query: string): ToolDefinition[] {
  const normalized = query.trim().toLowerCase();
  if (!normalized) return [];
  return getAllToolDefinitions()
    .filter((definition) =>
      [
        definition.title,
        definition.shortDescription,
        definition.description,
        ...definition.keywords,
        ...definition.tags,
      ].some((field) => field.toLowerCase().includes(normalized))
    )
    .sort((a, b) => (b.reviewsCount ?? 0) - (a.reviewsCount ?? 0));
}

export function getToolsByCategoryExists(categorySlug: string): boolean {
  return categoryExists(categorySlug);
}

registerTools(
  toolDefinitions.map((definition) => ({
    definition,
    component: toolComponents[definition.slug],
  }))
);
