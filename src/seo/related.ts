import type { Category, BlogPost, ToolDefinition } from '@/types';
import {
  getToolsByCategory,
  getRelatedToolsFor,
  getAllToolCategories,
  getAllToolDefinitions,
} from '@/registry';
import { getAllPosts } from '@/data/content';
import { getAllCategories as getAllDataCategories } from '@/data/categories';

export type CategoryLike = Pick<Category, 'slug' | 'name' | 'description'>;

export function getRelatedTools(tool: ToolDefinition, count = 3): ToolDefinition[] {
  return getRelatedToolsFor(tool, count);
}

export function getRelatedCategories(category: CategoryLike, count = 4): Category[] {
  const toolSlugsInCategory = new Set(getToolsByCategory(category.slug).map((tool) => tool.slug));

  const allDataCategories = getAllDataCategories();

  const scored = getAllToolCategories()
    .filter((candidate) => candidate.slug !== category.slug)
    .map((candidate) => {
      const shared = getToolsByCategory(candidate.slug).filter((tool) =>
        toolSlugsInCategory.has(tool.slug)
      ).length;
      return {
        category: candidate,
        score: shared * 10 + (candidate.featured ? 5 : 0) + (100 - candidate.order),
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, count);

  return scored.map(({ category: candidate }) => {
    const full = allDataCategories.find((dataCategory) => dataCategory.slug === candidate.slug);
    return full ?? (candidate as Category);
  });
}

export function getRelatedArticles(post: BlogPost, count = 3): BlogPost[] {
  const tagSet = new Set(post.tags.map((tag) => tag.toLowerCase()));

  const scored = getAllPosts()
    .filter((candidate) => candidate.id !== post.id)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => tagSet.has(tag.toLowerCase())).length;
      const sameCategory = candidate.category === post.category ? 5 : 0;
      return {
        post: candidate,
        score: sharedTags * 10 + sameCategory + (candidate.featured ? 3 : 0),
        publishedAt: candidate.publishedAt,
      };
    })
    .sort(
      (a, b) =>
        b.score - a.score || new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
    )
    .slice(0, count);

  return scored.map(({ post: candidate }) => candidate);
}

export function getAllRelated(): {
  tools: (tool: ToolDefinition, count?: number) => ToolDefinition[];
  categories: (category: CategoryLike, count?: number) => Category[];
  articles: (post: BlogPost, count?: number) => BlogPost[];
} {
  return {
    tools: getRelatedTools,
    categories: getRelatedCategories,
    articles: getRelatedArticles,
  };
}

export function getToolCount(): number {
  return getAllToolDefinitions().length;
}
