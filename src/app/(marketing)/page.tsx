import type { Metadata } from 'next';
import { HeroSection } from '@/components/sections/hero-section';
import { FeaturedToolsSection } from '@/components/sections/featured-tools-section';
import { PopularCategoriesSection } from '@/components/sections/popular-categories-section';
import { RecentlyAddedSection } from '@/components/sections/recently-added-section';
import { LatestArticlesSection } from '@/components/sections/latest-articles-section';
import { FooterCtaSection } from '@/components/sections/footer-cta-section';
import { createDefaultMetadata } from '@/lib/seo';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = createDefaultMetadata();

export default function HomePage() {
  return (
    <div className="flex-1">
      <HeroSection
        badge={`${siteConfig.name} is growing — 1000+ tools coming`}
        title={
          <>
            Every developer tool you need,{' '}
            <span className="from-primary to-accent bg-gradient-to-r bg-clip-text text-transparent">
              discovered and compared
            </span>
          </>
        }
        subtitle="Discover, compare, and master the best developer tools, resources, and learning materials — all in one place."
        suggestions={['Postman', 'Prisma', 'Turborepo', 'Playwright', 'Docker']}
      />
      <FeaturedToolsSection />
      <PopularCategoriesSection />
      <RecentlyAddedSection />
      <LatestArticlesSection />
      <FooterCtaSection />
    </div>
  );
}
