import { siteConfig } from '@/config/site';

export const SITE_URL = siteConfig.url.replace(/\/$/, '');
export const SITE_NAME = siteConfig.name;
export const SITE_DESCRIPTION = siteConfig.description;
export const DEFAULT_OG_IMAGE = siteConfig.ogImage;
export const CONTACT_EMAIL = siteConfig.author.email;
export const SOCIAL_LINKS = siteConfig.links;

export const SEO_CONSTANTS = {
  defaultLocale: 'en_US',
  siteName: SITE_NAME,
  siteUrl: SITE_URL,
  ogImage: `${SITE_URL}${DEFAULT_OG_IMAGE}`,
  twitterCard: 'summary_large_image',
  robotsDefaults: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  } as const,
} as const;
