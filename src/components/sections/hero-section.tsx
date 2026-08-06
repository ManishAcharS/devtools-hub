import React from 'react';
import Link from 'next/link';
import { ArrowRight, Sparkles } from 'lucide-react';
import { SearchBar } from '@/components/shared/search-bar';
import { Button } from '@/components/ui/button';
import { ShinyButton } from '@/components/ui/shiny-button';

interface HeroSectionProps {
  badge?: string;
  title: React.ReactNode;
  subtitle: string;
  searchPlaceholder?: string;
  suggestions?: string[];
}

const HeroSection: React.FC<HeroSectionProps> = ({
  badge,
  title,
  subtitle,
  searchPlaceholder = 'Search tools, categories, articles...',
  suggestions,
}) => {
  return (
    <section className="border-border from-primary/5 via-background to-background relative border-b bg-gradient-to-b">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,color-mix(in_oklab,var(--primary)_12%,transparent),transparent_50%)]"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 py-16 text-center sm:px-6 sm:py-24 lg:px-8">
        {badge && (
          <span className="border-primary/20 bg-primary/5 text-primary inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-sm font-medium">
            <Sparkles className="h-4 w-4" aria-hidden="true" />
            {badge}
          </span>
        )}
        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-bold tracking-tight text-balance sm:text-5xl lg:text-6xl">
          {title}
        </h1>
        <p className="text-muted-foreground mx-auto mt-5 max-w-2xl text-lg text-pretty">
          {subtitle}
        </p>
        <div className="relative z-10 mx-auto mt-8 max-w-xl sm:translate-x-2">
          <SearchBar size="lg" placeholder={searchPlaceholder} suggestions={suggestions} />
        </div>
        <div className="mx-auto mt-4 max-w-xl sm:translate-x-2">
          <div className="flex flex-wrap items-center gap-3">
            <ShinyButton href="/tools">
              Browse all tools
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </ShinyButton>
            <Button size="lg" variant="outline" asChild>
              <Link href="/categories">Explore categories</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

HeroSection.displayName = 'HeroSection';

export { HeroSection };
