import type { ComponentType } from 'react';

export type ToolPricing = 'free' | 'freemium' | 'paid' | 'open-source';

export type ToolExampleVariant = 'default' | 'bordered' | 'terminal' | 'highlighted';

export interface ToolSEO {
  title?: string;
  description?: string;
  keywords?: string[];
  canonical?: string;
  ogTitle?: string;
  ogDescription?: string;
  noIndex?: boolean;
}

export interface ToolFAQ {
  question: string;
  answer: string;
}

export interface ToolExample {
  title: string;
  description?: string;
  code?: string;
  language?: string;
  variant?: ToolExampleVariant;
}

export interface ToolDownload {
  fileName: string;
  contentType?: string;
  content?: string;
  url?: string;
}

export interface ToolDefinition {
  id: string;
  slug: string;
  title: string;
  shortDescription: string;
  description: string;
  category: string;
  keywords: string[];
  tags: string[];
  icon?: string;
  website?: string;
  repository?: string;
  pricing: ToolPricing;
  featured: boolean;
  rating?: number;
  reviewsCount?: number;
  faqs: ToolFAQ[];
  examples: ToolExample[];
  relatedTools?: string[];
  seo?: ToolSEO;
  copyValue?: string;
  download?: ToolDownload;
  createdAt: string;
  updatedAt: string;
  metadata?: Record<string, unknown>;
}

export interface ToolComponentProps {
  definition: ToolDefinition;
}

export type ToolComponent = ComponentType<ToolComponentProps>;

export interface ToolRegistryEntry {
  definition: ToolDefinition;
  component?: ToolComponent;
}

export interface ToolCategoryDefinition {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  featured: boolean;
  order: number;
}
