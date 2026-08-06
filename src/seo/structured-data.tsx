import React from 'react';
import type { BreadcrumbItem, ToolDefinition, BlogPost } from '@/types';
import type { CategoryLike } from './related';
import {
  SITE_URL,
  SITE_NAME,
  SITE_DESCRIPTION,
  DEFAULT_OG_IMAGE,
  CONTACT_EMAIL,
  SOCIAL_LINKS,
} from './config';
import { absoluteUrl, getCanonicalUrl } from './metadata';

type JsonLd = Record<string, unknown>;

export function createWebSiteStructuredData(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    inLanguage: 'en',
    potentialAction: {
      '@type': 'SearchAction',
      target: `${SITE_URL}/search?q={search_term_string}`,
      'query-input': 'required name=search_term_string',
    },
  };
}

export function createOrganizationStructuredData(): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: SITE_NAME,
    url: SITE_URL,
    description: SITE_DESCRIPTION,
    logo: {
      '@type': 'ImageObject',
      url: absoluteUrl(DEFAULT_OG_IMAGE),
    },
    email: CONTACT_EMAIL,
    sameAs: Object.values(SOCIAL_LINKS).filter(
      (link): link is string => typeof link === 'string' && link.startsWith('http')
    ),
  };
}

export function createBreadcrumbStructuredData(items: BreadcrumbItem[]): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.label,
      item: item.href ? getCanonicalUrl(item.href) : undefined,
    })),
  };
}

export function createSoftwareApplicationStructuredData(tool: ToolDefinition): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: tool.title,
    description: tool.description,
    url: getCanonicalUrl(`/tools/${tool.slug}`),
    applicationCategory: 'DeveloperApplication',
    applicationSubCategory: tool.category.replace(/-/g, ' '),
    operatingSystem: 'Any',
    ...(tool.website ? { sameAs: tool.website } : {}),
    offers: {
      '@type': 'Offer',
      price: tool.pricing === 'paid' ? '0' : '0',
      priceCurrency: 'USD',
      description: tool.pricing,
    },
    ...(tool.rating !== undefined
      ? {
          aggregateRating: {
            '@type': 'AggregateRating',
            ratingValue: tool.rating,
            bestRating: 5,
            ratingCount: tool.reviewsCount ?? 1,
          },
        }
      : {}),
  };
}

export function createFAQStructuredData(faqs: Array<{ question: string; answer: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

export function createItemListStructuredData(items: Array<{ name: string; url: string }>): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      url: item.url,
    })),
  };
}

export function createCategoryStructuredData(
  category: CategoryLike,
  tools: Array<Pick<ToolDefinition, 'title' | 'slug'>>
): JsonLd[] {
  const collection: JsonLd = {
    '@context': 'https://schema.org',
    '@type': 'CollectionPage',
    name: `${category.name} Tools`,
    description: category.description,
    url: getCanonicalUrl(`/categories/${category.slug}`),
    mainEntity: {
      '@type': 'ItemList',
      name: category.name,
      itemListElement: tools.map((tool, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: tool.title,
        url: getCanonicalUrl(`/tools/${tool.slug}`),
      })),
    },
  };

  return [
    createBreadcrumbStructuredData([
      { label: 'Categories', href: '/categories' },
      { label: category.name, current: true },
    ]),
    collection,
  ];
}

export function createCategoryPageStructuredData(
  category: CategoryLike,
  tools: Array<Pick<ToolDefinition, 'title' | 'slug'>>,
  faqs: Array<{ question: string; answer: string }> = []
): JsonLd[] {
  const scripts: JsonLd[] = createCategoryStructuredData(category, tools);
  if (faqs.length > 0) {
    scripts.push(createFAQStructuredData(faqs));
  }
  return scripts;
}

export function createArticleStructuredData(post: BlogPost): JsonLd {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    headline: post.title,
    description: post.excerpt,
    image: post.coverImage ? absoluteUrl(post.coverImage) : absoluteUrl(DEFAULT_OG_IMAGE),
    datePublished: post.publishedAt,
    dateModified: post.updatedAt,
    inLanguage: 'en',
    author: {
      '@type': 'Person',
      name: post.author.name,
      ...(post.author.website ? { url: post.author.website } : {}),
    },
    publisher: {
      '@type': 'Organization',
      name: SITE_NAME,
      logo: {
        '@type': 'ImageObject',
        url: absoluteUrl(DEFAULT_OG_IMAGE),
      },
    },
    mainEntityOfPage: getCanonicalUrl(`/blog/${post.slug}`),
  };
}

export function createToolPageStructuredData(tool: ToolDefinition): JsonLd[] {
  const scripts: JsonLd[] = [
    createBreadcrumbStructuredData([
      { label: 'Tools', href: '/tools' },
      { label: tool.title, current: true },
    ]),
    createSoftwareApplicationStructuredData(tool),
  ];
  if (tool.faqs.length > 0) {
    scripts.push(createFAQStructuredData(tool.faqs));
  }
  return scripts;
}

export function jsonLdToScript(data: JsonLd): string {
  return JSON.stringify(data);
}

interface StructuredDataProps {
  data: JsonLd | JsonLd[];
}

export function StructuredData({ data }: StructuredDataProps): React.JSX.Element {
  const scripts = Array.isArray(data) ? data : [data];
  return (
    <>
      {scripts.map((item, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: jsonLdToScript(item) }}
        />
      ))}
    </>
  );
}

export type { JsonLd };
