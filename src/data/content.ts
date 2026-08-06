import type { BlogPost, Resource } from '@/types';

export const blogPosts: BlogPost[] = [
  {
    id: 'post-1',
    slug: 'best-api-development-tools-2026',
    title: 'The 10 Best API Development Tools in 2026',
    excerpt:
      'From design to testing to documentation, here are the tools professional teams rely on to ship great APIs.',
    content: '',
    author: {
      id: 'author-1',
      name: 'Jordan Lee',
      bio: 'Staff software engineer and API design enthusiast.',
    },
    category: 'api-development',
    tags: ['api', 'rest', 'graphql', 'tooling'],
    publishedAt: '2026-01-10T00:00:00.000Z',
    updatedAt: '2026-01-15T00:00:00.000Z',
    readingTime: 8,
    featured: true,
  },
  {
    id: 'post-2',
    slug: 'monorepo-with-turborepo-guide',
    title: 'A Practical Guide to Monorepos with Turborepo',
    excerpt:
      'Learn how to structure, cache, and parallelize builds in a TypeScript monorepo with Turborepo.',
    content: '',
    author: {
      id: 'author-2',
      name: 'Priya Sharma',
      bio: 'Frontend infrastructure engineer and open source contributor.',
    },
    category: 'productivity',
    tags: ['monorepo', 'turborepo', 'typescript', 'build'],
    publishedAt: '2026-01-25T00:00:00.000Z',
    updatedAt: '2026-01-28T00:00:00.000Z',
    readingTime: 12,
    featured: false,
  },
  {
    id: 'post-3',
    slug: 'e2e-testing-playwright-vs-cypress',
    title: 'E2E Testing in 2026: Playwright vs Cypress',
    excerpt: 'A head-to-head comparison of the two dominant end-to-end testing frameworks.',
    content: '',
    author: {
      id: 'author-1',
      name: 'Jordan Lee',
      bio: 'Staff software engineer and API design enthusiast.',
    },
    category: 'testing',
    tags: ['testing', 'playwright', 'cypress', 'e2e'],
    publishedAt: '2026-02-05T00:00:00.000Z',
    updatedAt: '2026-02-06T00:00:00.000Z',
    readingTime: 10,
    featured: false,
  },
];

export function getPostBySlug(slug: string): BlogPost | undefined {
  return blogPosts.find((post) => post.slug === slug);
}

export function getFeaturedPosts(count = 3): BlogPost[] {
  return blogPosts.filter((post) => post.featured).slice(0, count);
}

export function getAllPosts(): BlogPost[] {
  return [...blogPosts].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}

export const resources: Resource[] = [
  {
    id: 'res-1',
    slug: 'learn-typescript-complete-course',
    title: 'Learn TypeScript — The Complete Course',
    description:
      'A comprehensive course covering everything from types and generics to advanced patterns.',
    type: 'course',
    category: 'frontend',
    tags: ['typescript', 'course', 'learn'],
    url: 'https://example.com/typescript-course',
    author: 'Acme Learning',
    publishedAt: '2026-01-01T00:00:00.000Z',
    difficulty: 'beginner',
    free: false,
    featured: true,
  },
  {
    id: 'res-2',
    slug: 'state-of-js-2025-report',
    title: 'State of JS 2025 Report',
    description:
      'The definitive annual survey of the JavaScript ecosystem with insights from thousands of developers.',
    type: 'article',
    category: 'frontend',
    tags: ['javascript', 'survey', 'report'],
    url: 'https://example.com/state-of-js',
    publishedAt: '2026-01-15T00:00:00.000Z',
    readingTime: 15,
    difficulty: 'intermediate',
    free: true,
    featured: false,
  },
  {
    id: 'res-3',
    slug: 'web-security-best-practices',
    title: 'Web Security Best Practices Handbook',
    description:
      'Practical guidance on authentication, authorization, input validation, and securing APIs.',
    type: 'book',
    category: 'security',
    tags: ['security', 'book', 'handbook'],
    url: 'https://example.com/security-handbook',
    author: 'Security Press',
    publishedAt: '2025-12-01T00:00:00.000Z',
    difficulty: 'intermediate',
    free: false,
    featured: false,
  },
  {
    id: 'res-4',
    slug: 'devtools-weekly-newsletter',
    title: 'DevTools Weekly Newsletter',
    description: 'A curated weekly roundup of the best developer tools, releases, and articles.',
    type: 'newsletter',
    category: 'productivity',
    tags: ['newsletter', 'curated', 'weekly'],
    url: 'https://example.com/devtools-weekly',
    difficulty: 'beginner',
    free: true,
    featured: false,
  },
];

export function getResourceBySlug(slug: string): Resource | undefined {
  return resources.find((resource) => resource.slug === slug);
}

export function getAllResources(): Resource[] {
  return [...resources].sort(
    (a, b) => new Date(b.publishedAt ?? 0).getTime() - new Date(a.publishedAt ?? 0).getTime()
  );
}
