import React from 'react';
import Link from 'next/link';
import { ArrowRight, Github } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { siteConfig } from '@/config/site';

interface FooterCtaSectionProps {
  title?: string;
  description?: string;
  primaryLabel?: string;
  primaryHref?: string;
  secondaryLabel?: string;
  secondaryHref?: string;
}

const FooterCtaSection: React.FC<FooterCtaSectionProps> = ({
  title = 'Ready to upgrade your toolkit?',
  description = 'Explore 1000+ developer tools, compare alternatives, and read in-depth guides — all in one place.',
  primaryLabel = 'Browse all tools',
  primaryHref = '/tools',
  secondaryLabel = 'Suggest a tool',
  secondaryHref = siteConfig.links.github,
}) => {
  return (
    <section className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8">
      <div className="from-primary to-accent relative overflow-hidden rounded-3xl bg-gradient-to-r p-10 text-center sm:p-14">
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_80%_20%,color-mix(in_oklab,white_20%,transparent),transparent_50%)]"
          aria-hidden="true"
        />
        <div className="relative">
          <h2 className="mx-auto max-w-2xl text-2xl font-bold tracking-tight text-balance text-white sm:text-3xl">
            {title}
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-pretty text-white/80">{description}</p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Button
              size="lg"
              asChild
              className="border-white/20 bg-white text-zinc-900 hover:bg-white/90"
            >
              <Link href={primaryHref}>
                {primaryLabel}
                <ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            </Button>
            <Button
              size="lg"
              variant="outline"
              asChild
              className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <Link
                href={secondaryHref}
                target={secondaryHref.startsWith('http') ? '_blank' : undefined}
                rel="noopener noreferrer"
              >
                <Github className="h-4 w-4" aria-hidden="true" />
                {secondaryLabel}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

FooterCtaSection.displayName = 'FooterCtaSection';

export { FooterCtaSection };
