import type { Metadata } from 'next';
import type { ToolDefinition, BlogPost, CategoryDefinition } from '@/types';
import type { CategoryLike } from './related';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  TWITTER_HANDLE,
  SEO_CONSTANTS,
} from './config';

export function absoluteUrl(path: string): string {
  const cleanPath = path.startsWith('/') ? path : `/${path}`;
  return `${SITE_URL}${cleanPath}`;
}

export function getCanonicalUrl(path?: string): string {
  if (!path) return SITE_URL;
  return absoluteUrl(path);
}

export interface SeoOptions {
  title: string;
  description: string;
  canonical?: string;
  keywords?: string[];
  noIndex?: boolean;
  image?: string;
  type?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

const resolvedTitle = (title: string): string => {
  return title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
};

const defaultRobots = (noIndex: boolean): Metadata['robots'] => ({
  index: noIndex ? false : SEO_CONSTANTS.robotsDefaults.index,
  follow: noIndex ? false : SEO_CONSTANTS.robotsDefaults.follow,
  googleBot: {
    index: noIndex ? false : SEO_CONSTANTS.robotsDefaults.googleBot.index,
    follow: noIndex ? false : SEO_CONSTANTS.robotsDefaults.googleBot.follow,
    'max-video-preview': SEO_CONSTANTS.robotsDefaults.googleBot['max-video-preview'],
    'max-image-preview': SEO_CONSTANTS.robotsDefaults.googleBot['max-image-preview'],
    'max-snippet': SEO_CONSTANTS.robotsDefaults.googleBot['max-snippet'],
  },
});

export function createMetadata({
  title,
  description,
  canonical,
  keywords,
  noIndex = false,
  image = DEFAULT_OG_IMAGE,
  type = 'website',
  publishedTime,
  modifiedTime,
  authors,
  section,
  tags,
}: SeoOptions): Metadata {
  const fullTitle = resolvedTitle(title);
  const canonicalUrl = canonical ? getCanonicalUrl(canonical) : undefined;
  const ogImage = { url: absoluteUrl(image) };

  return {
    title: fullTitle,
    description,
    keywords,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: fullTitle,
      description,
      url: canonicalUrl,
      siteName: SITE_NAME,
      locale: SEO_CONSTANTS.defaultLocale,
      type,
      ...(publishedTime && { publishedTime }),
      ...(modifiedTime && { modifiedTime }),
      ...(authors && authors.length > 0 && { authors }),
      ...(section && { section }),
      ...(tags && tags.length > 0 && { tags }),
      images: [ogImage],
    },
    twitter: {
      card: SEO_CONSTANTS.twitterCard,
      title: fullTitle,
      description,
      images: [ogImage.url],
      site: TWITTER_HANDLE,
      creator: TWITTER_HANDLE,
    },
    robots: defaultRobots(noIndex),
  };
}

export function createDefaultMetadata(): Metadata {
  return createMetadata({
    title: `${SITE_NAME} — Every tool a developer needs`,
    description: SITE_DESCRIPTION,
    canonical: '/',
    keywords: ['developer tools', 'dev tools', 'software development', 'programming', SITE_NAME],
  });
}

export function createNoIndexMetadata(title: string, description: string): Metadata {
  return createMetadata({ title, description, noIndex: true });
}

export function createToolMetadata(tool: ToolDefinition): Metadata {
  const seo = tool.seo;
  const title = seo?.title ?? tool.title;
  const description = seo?.description ?? tool.shortDescription;
  const canonical = seo?.canonical ?? `/tools/${tool.slug}`;
  const keywords = Array.from(
    new Set(
      [...tool.keywords, ...tool.tags]
        .map((keyword) => keyword.toLowerCase())
        .filter((keyword) => keyword.length > 0)
    )
  );

  return createMetadata({
    title,
    description,
    canonical,
    keywords,
    noIndex: seo?.noIndex ?? false,
    type: 'article',
    publishedTime: tool.createdAt,
    modifiedTime: tool.updatedAt,
    section: tool.category.replace(/-/g, ' '),
    tags: tool.tags,
  });
}

export function createCategoryMetadata(category: CategoryLike, toolCount?: number): Metadata {
  const countLabel =
    toolCount !== undefined
      ? ` Browse ${toolCount} curated ${category.name.toLowerCase()} tools, compare features, and pick the right one for your stack.`
      : '';
  return createMetadata({
    title: `${category.name} Tools`,
    description: `${category.description}${countLabel}`,
    canonical: `/categories/${category.slug}`,
    keywords: [category.name.toLowerCase(), 'developer tools', 'software development'],
    section: category.name,
  });
}

export function createCategoryPageMetadata(
  definition: CategoryDefinition,
  toolCount?: number
): Metadata {
  const seo = definition.seo;
  const title = seo?.title ?? `${definition.title} Tools`;
  const countLabel =
    toolCount !== undefined
      ? ` Browse ${toolCount} curated ${definition.title.toLowerCase()} tools, compare features, and pick the right one for your workflow.`
      : '';
  const keywords = Array.from(
    new Set(
      [...(seo?.keywords ?? []), ...definition.keywords]
        .map((keyword) => keyword.toLowerCase())
        .filter((keyword) => keyword.length > 0)
    )
  );

  return createMetadata({
    title,
    description: `${seo?.description ?? definition.shortDescription}${countLabel}`,
    canonical: `/categories/${definition.slug}`,
    keywords,
    noIndex: seo?.noIndex ?? false,
    section: definition.title,
  });
}

export function createArticleMetadata(post: BlogPost): Metadata {
  return createMetadata({
    title: post.title,
    description: post.excerpt,
    canonical: `/blog/${post.slug}`,
    keywords: post.tags,
    type: 'article',
    publishedTime: post.publishedAt,
    modifiedTime: post.updatedAt,
    authors: [post.author.name],
    section: post.category,
    tags: post.tags,
    ...(post.coverImage ? { image: post.coverImage } : {}),
  });
}
