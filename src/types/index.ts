import type { ToolDefinition } from './tool-framework';

export type Tool = ToolDefinition;

export type {
  ToolDefinition,
  ToolFAQ,
  ToolExample,
  ToolExampleVariant,
  ToolSEO,
  ToolDownload,
  ToolPricing,
  ToolComponent,
  ToolComponentProps,
  ToolRegistryEntry,
  ToolCategoryDefinition,
  CategoryDefinition,
  CategoryAccent,
  CategorySEO,
  CategoryFAQ,
} from './tool-framework';

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string;
  icon: string;
  toolCount: number;
  featured: boolean;
  order: number;
  parentId?: string;
  color?: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  excerpt: string;
  content: string;
  author: Author;
  category: string;
  tags: string[];
  coverImage?: string;
  publishedAt: string;
  updatedAt: string;
  readingTime: number;
  featured: boolean;
  seo?: SEOData;
}

export interface Author {
  id: string;
  name: string;
  bio: string;
  avatar?: string;
  website?: string;
  twitter?: string;
  github?: string;
  linkedin?: string;
}

export interface Resource {
  id: string;
  slug: string;
  title: string;
  description: string;
  type: 'article' | 'video' | 'course' | 'book' | 'tool' | 'newsletter' | 'podcast';
  category: string;
  tags: string[];
  url: string;
  author?: string;
  publishedAt?: string;
  readingTime?: number;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  free: boolean;
  featured: boolean;
}

export interface NavigationItem {
  label: string;
  href: string;
  icon?: string;
  children?: NavigationItem[];
  megaMenu?: MegaMenuConfig;
  external?: boolean;
}

export interface MegaMenuConfig {
  columns: MegaMenuColumn[];
  featuredTools?: string[];
  featuredCategories?: string[];
}

export interface MegaMenuColumn {
  title: string;
  items: MegaMenuItem[];
}

export interface MegaMenuItem {
  label: string;
  href: string;
  description?: string;
  icon?: string;
  badge?: string;
  external?: boolean;
}

export interface SEOData {
  title: string;
  description: string;
  canonical?: string;
  openGraph?: OpenGraphData;
  twitter?: TwitterCardData;
  structuredData?: Record<string, unknown>;
  robots?: RobotsData;
}

export interface OpenGraphData {
  title: string;
  description: string;
  type: 'website' | 'article' | 'profile';
  url: string;
  siteName: string;
  images: OpenGraphImage[];
  locale?: string;
  publishedTime?: string;
  modifiedTime?: string;
  authors?: string[];
  section?: string;
  tags?: string[];
}

export interface OpenGraphImage {
  url: string;
  width?: number;
  height?: number;
  alt?: string;
  type?: string;
}

export interface TwitterCardData {
  card: 'summary' | 'summary_large_image' | 'app' | 'player';
  title: string;
  description: string;
  images: string[];
  site?: string;
  creator?: string;
}

export interface RobotsData {
  index?: boolean;
  follow?: boolean;
  googlebot?: GooglebotData;
}

export interface GooglebotData {
  index?: boolean;
  follow?: boolean;
  'max-video-preview'?: number;
  'max-image-preview'?: 'none' | 'standard' | 'large';
  'max-snippet'?: number;
  noarchive?: boolean;
  notranslate?: boolean;
  noimageindex?: boolean;
  unavailable_after?: string;
}

export interface BreadcrumbItem {
  label: string;
  href?: string;
  current?: boolean;
}

export interface SearchResult {
  id: string;
  type: 'tool' | 'category' | 'blog' | 'resource';
  title: string;
  description: string;
  href: string;
  category?: string;
  tags?: string[];
  score?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface FilterOptions {
  categories?: string[];
  tags?: string[];
  pricing?: Tool['pricing'][];
  difficulty?: Resource['difficulty'][];
  type?: Resource['type'][];
  search?: string;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface ThemeConfig {
  colors: {
    primary: string;
    secondary: string;
    accent: string;
    background: string;
    surface: string;
    text: string;
    textMuted: string;
    border: string;
    error: string;
    warning: string;
    success: string;
  };
  fonts: {
    sans: string;
    mono: string;
  };
  radius: {
    sm: string;
    md: string;
    lg: string;
    xl: string;
    full: string;
  };
  spacing: Record<string, string>;
  shadows: Record<string, string>;
  transitions: Record<string, string>;
  breakpoints: Record<string, string>;
}

export interface SiteConfig {
  name: string;
  description: string;
  url: string;
  ogImage: string;
  links: {
    twitter: string;
    github: string;
    discord: string;
    linkedin?: string;
  };
  author: {
    name: string;
    email: string;
  };
  theme: ThemeConfig;
}
