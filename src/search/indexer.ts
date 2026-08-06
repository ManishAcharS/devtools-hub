import type { SearchItem } from './types';
import { getAllTools, getAllCategories, getAllPosts, getAllResources } from '@/data';

export function buildIndex(): SearchItem[] {
  const items: SearchItem[] = [];

  for (const tool of getAllTools()) {
    items.push({
      id: `tool-${tool.slug}`,
      type: 'tool',
      title: tool.title,
      description: tool.shortDescription || tool.description,
      href: `/tools/${tool.slug}`,
      category: tool.category,
      tags: tool.tags,
      keywords: [...tool.keywords, ...tool.tags],
      icon: tool.icon,
      rating: tool.rating,
      featured: tool.featured,
      boost: 1,
    });
  }

  for (const category of getAllCategories()) {
    items.push({
      id: `category-${category.slug}`,
      type: 'category',
      title: category.name,
      description: category.description,
      href: `/categories/${category.slug}`,
      tags: [category.name, 'tools', 'developers'],
      keywords: [category.name, 'category', 'tools'],
      icon: category.icon,
      featured: category.featured,
      boost: 0.9,
    });
  }

  for (const post of getAllPosts()) {
    items.push({
      id: `blog-${post.slug}`,
      type: 'blog',
      title: post.title,
      description: post.excerpt,
      href: `/blog/${post.slug}`,
      category: post.category,
      tags: post.tags,
      keywords: [...post.tags, post.author.name],
      featured: post.featured,
      boost: 0.8,
    });
  }

  for (const resource of getAllResources()) {
    items.push({
      id: `resource-${resource.slug}`,
      type: 'resource',
      title: resource.title,
      description: resource.description,
      href: `/resources/${resource.slug}`,
      category: resource.category,
      tags: resource.tags,
      keywords: [...resource.tags, resource.type],
      featured: resource.featured,
      boost: 0.75,
    });
  }

  return items;
}
