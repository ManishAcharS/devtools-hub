import { describe, expect, it } from 'vitest';
import {
  getAllToolDefinitions,
  getFeaturedTools,
  getRecentlyAddedTools,
  getRelatedToolsFor,
  getToolCountByCategory,
  getToolsByCategory,
  getToolsByTag,
  getTrendingTools,
  searchTools,
  validateRegisteredTools,
} from '@/registry/tool-registry';
import { toolComponents } from '@/registry/tool-components';
import { getCategorySlugs } from '@/registry/category-registry';

const all = getAllToolDefinitions();

describe('registry integrity', () => {
  it('registers every tool from the definition list', () => {
    expect(all.length).toBeGreaterThanOrEqual(84);
  });

  it('has unique slugs and ids', () => {
    const slugs = all.map((definition) => definition.slug);
    const ids = all.map((definition) => definition.id);
    expect(new Set(slugs).size).toBe(slugs.length);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('passes registry validation with no issues', () => {
    expect(validateRegisteredTools()).toEqual([]);
  });

  it('has a component registered for most tools (ecosystem tools are static pages)', () => {
    const withComponent = all.filter((definition) => toolComponents[definition.slug]);
    expect(withComponent.length).toBeGreaterThanOrEqual(70);
  });

  it('has no orphan component registrations', () => {
    const registered = new Set(all.map((definition) => definition.slug));
    for (const slug of Object.keys(toolComponents)) {
      expect(registered.has(slug), slug).toBe(true);
    }
  });

  it('has interactive components for the 13 recently added tools', () => {
    const recent = [
      'json-formatter',
      'json-minifier',
      'json-validator',
      'case-converter',
      'character-counter',
      'text-diff',
      'color-converter',
      'color-palette-generator',
      'color-contrast-checker',
      'pdf-info',
      'pdf-text-extractor',
      'pdf-pages-to-images',
      'images-to-pdf',
    ];
    for (const slug of recent) {
      expect(toolComponents[slug], slug).toBeDefined();
    }
  });

  it('has complete definition fields', () => {
    for (const definition of all) {
      expect(definition.title.length).toBeGreaterThan(0);
      expect(definition.shortDescription.length).toBeGreaterThan(0);
      expect(definition.description.length).toBeGreaterThan(0);
      expect(definition.keywords.length).toBeGreaterThan(0);
      expect(definition.tags.length).toBeGreaterThan(0);
      expect(definition.pricing).toBeTruthy();
      expect(definition.category.length).toBeGreaterThan(0);
      expect(() => new Date(definition.createdAt)).not.toThrow();
      expect(() => new Date(definition.updatedAt)).not.toThrow();
    }
  });
});

describe('categories', () => {
  it('has every registered category with tools in it', () => {
    const counts = getToolCountByCategory();
    for (const slug of getCategorySlugs()) {
      expect(counts[slug] ?? 0, slug).toBeGreaterThan(0);
      const tools = getToolsByCategory(slug);
      expect(tools.length, slug).toBe(counts[slug]);
      expect(tools.every((definition) => definition.category === slug)).toBe(true);
    }
  });

  it('returns tools sorted by reviews count within a category', () => {
    for (const slug of getCategorySlugs()) {
      const tools = getToolsByCategory(slug);
      const reviews = tools.map((definition) => definition.reviewsCount ?? 0);
      const sorted = [...reviews].sort((a, b) => b - a);
      expect(reviews).toEqual(sorted);
    }
  });
});

describe('searchTools', () => {
  it('finds tools by title and keyword case-insensitively', () => {
    expect(searchTools('json').length).toBeGreaterThan(0);
    expect(searchTools('JSON').length).toBeGreaterThan(0);
    expect(searchTools('base64').length).toBeGreaterThan(0);
  });

  it('returns an empty list for an empty query', () => {
    expect(searchTools('')).toEqual([]);
    expect(searchTools('   ')).toEqual([]);
  });
});

describe('curated lists', () => {
  it('returns featured tools capped at the requested count', () => {
    const featured = getFeaturedTools(4);
    expect(featured.length).toBeLessThanOrEqual(4);
    expect(featured.every((definition) => definition.featured)).toBe(true);
  });

  it('returns trending tools sorted by rating', () => {
    const trending = getTrendingTools(6);
    const ratings = trending.map((definition) => definition.rating ?? 0);
    expect(ratings).toEqual([...ratings].sort((a, b) => b - a));
  });

  it('returns recently added tools sorted by createdAt', () => {
    const recent = getRecentlyAddedTools(4);
    const dates = recent.map((definition) => new Date(definition.createdAt).getTime());
    expect(dates).toEqual([...dates].sort((a, b) => b - a));
  });
});

describe('related tools', () => {
  it('never includes the tool itself and respects the count', () => {
    for (const definition of all) {
      const related = getRelatedToolsFor(definition, 3);
      expect(related.length).toBeLessThanOrEqual(3);
      expect(related.some((candidate) => candidate.slug === definition.slug)).toBe(false);
    }
  });

  it('ranks same-category tools first when the category has enough tools', () => {
    const multiToolCategories = all
      .map((definition) => definition.category)
      .filter((category, index, categories) => categories.indexOf(category) !== index);
    expect(multiToolCategories.length).toBeGreaterThan(0);
    const definition = all.find(
      (candidate) =>
        multiToolCategories.includes(candidate.category) &&
        (!candidate.relatedTools || candidate.relatedTools.length === 0)
    );
    const related = getRelatedToolsFor(definition as never, 3);
    expect(related.some((candidate) => candidate.category === definition?.category)).toBe(true);
  });
});

describe('tags', () => {
  it('finds tools by tag case-insensitively', () => {
    for (const definition of all) {
      const tag = definition.tags[0];
      const tools = getToolsByTag(tag);
      expect(tools.some((candidate) => candidate.slug === definition.slug)).toBe(true);
      const upper = getToolsByTag(tag.toUpperCase());
      expect(upper.length).toBe(tools.length);
    }
  });
});
