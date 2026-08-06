import { getAllTools, getAllCategories, getAllPosts, getAllResources } from '@/data';
import { tokenize } from './tokenizer';

function topTags(source: Array<{ tags?: string[] }>, count: number): string[] {
  const frequency = new Map<string, number>();
  for (const entry of source) {
    for (const tag of entry.tags ?? []) {
      frequency.set(tag, (frequency.get(tag) ?? 0) + 1);
    }
  }
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, count)
    .map(([tag]) => tag);
}

export function getPopularSearches(count = 8): string[] {
  const searches: string[] = [];

  const topRatedTools = getAllTools()
    .filter((tool) => tool.rating !== undefined)
    .sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
    .slice(0, 3);
  searches.push(...topRatedTools.map((tool) => tool.title));

  searches.push(
    ...getAllCategories()
      .slice(0, 2)
      .map((category) => `${category.name} tools`)
  );

  for (const tag of topTags([...getAllTools(), ...getAllPosts(), ...getAllResources()], 4)) {
    searches.push(tag.replace(/-/g, ' '));
  }

  const unique = Array.from(new Set(searches.filter((search) => tokenize(search).length > 0)));
  return unique.slice(0, count);
}
