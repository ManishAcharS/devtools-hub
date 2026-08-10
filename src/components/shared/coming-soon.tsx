import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock3, Home, Rocket, Search, Sparkles, Wrench } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ComingSoonProps {
  title?: string;
  description?: string;
  badge?: string;
  icon?: React.ReactNode;
  compact?: boolean;
  variant?: 'coming-soon' | 'not-found';
}

const ComingSoon: React.FC<ComingSoonProps> = ({
  title = 'Page',
  description = "We're working hard on this page. It will be here soon — stay tuned!",
  badge = 'Coming soon',
  icon,
  compact = false,
  variant = 'coming-soon',
}) => {
  const isNotFound = variant === 'not-found';

  const features = isNotFound
    ? [
        {
          icon: <Rocket className="h-5 w-5" aria-hidden="true" />,
          title: 'Check the URL',
          text: 'A small typo could be the culprit.',
        },
        {
          icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
          title: 'Use search',
          text: 'Find the tool you need in seconds.',
        },
        {
          icon: <Clock3 className="h-5 w-5" aria-hidden="true" />,
          title: 'Explore tools',
          text: 'Discover hundreds of dev tools.',
        },
      ]
    : [
        {
          icon: <Rocket className="h-5 w-5" aria-hidden="true" />,
          title: 'In the works',
          text: 'Our team is building this right now.',
        },
        {
          icon: <Sparkles className="h-5 w-5" aria-hidden="true" />,
          title: 'Stay tuned',
          text: 'Great things take a little time.',
        },
        {
          icon: <Clock3 className="h-5 w-5" aria-hidden="true" />,
          title: 'Soon',
          text: 'We will share updates as we go.',
        },
      ];

  return (
    <section className="border-border from-primary/5 via-background to-background relative overflow-hidden border-b bg-gradient-to-b">
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_75%_25%,color-mix(in_oklab,var(--primary)_14%,transparent),transparent_55%)]"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 [background-image:radial-gradient(color-mix(in_oklab,var(--primary)_22%,transparent)_1px,transparent_1px)] [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)] [background-size:26px_26px] opacity-[0.35]"
        aria-hidden="true"
      />

      <div
        className="animate-float-slow bg-primary/15 pointer-events-none absolute -top-24 -left-24 h-72 w-72 rounded-full blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-float-slower from-primary/10 to-accent/10 pointer-events-none absolute -right-20 -bottom-28 h-80 w-80 rounded-full bg-gradient-to-tr blur-3xl"
        aria-hidden="true"
      />
      <div
        className="animate-spin-slow border-primary/20 pointer-events-none absolute top-16 right-[12%] h-20 w-20 rounded-full border-2 border-dashed"
        aria-hidden="true"
      />
      <div
        className="animate-float-slower bg-accent/10 pointer-events-none absolute bottom-16 left-[10%] h-14 w-14 rounded-2xl blur-2xl"
        aria-hidden="true"
      />

      <div
        className={cn(
          'relative mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8',
          compact ? 'py-14 sm:py-16' : 'py-24 sm:py-28'
        )}
      >
        <div className="animate-fade-up mx-auto max-w-2xl">
          <span className="border-border bg-card/80 text-muted-foreground inline-flex items-center gap-2 rounded-full border px-4 py-1.5 text-xs font-semibold tracking-wider uppercase shadow-sm backdrop-blur">
            <span className="bg-primary relative flex h-2 w-2" aria-hidden="true">
              <span className="bg-primary animate-pulse-dot absolute inline-flex h-full w-full rounded-full" />
              <span className="bg-primary relative inline-flex h-2 w-2 rounded-full" />
            </span>
            {badge}
          </span>

          <div className="mt-6 flex items-center justify-center gap-3">
            {icon ? (
              <span className="text-primary">{icon}</span>
            ) : (
              <Wrench className="text-primary h-9 w-9" aria-hidden="true" />
            )}
            <h1 className="text-foreground animate-gradient-pan from-primary via-accent to-primary bg-gradient-to-r bg-clip-text text-4xl font-bold tracking-tight text-balance text-transparent sm:text-5xl">
              {isNotFound ? 'Page not found' : `${title} is coming soon`}
            </h1>
          </div>

          <p className="text-muted-foreground mt-5 text-lg text-pretty">{description}</p>

          <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
            <Button asChild size="lg">
              <Link href="/tools">
                <Wrench className="h-4 w-4" aria-hidden="true" />
                Browse all tools
              </Link>
            </Button>
            <Button variant="outline" size="lg" asChild>
              {isNotFound ? (
                <Link href="/search">
                  <Search className="h-4 w-4" aria-hidden="true" />
                  Search
                </Link>
              ) : (
                <Link href="/">
                  <Home className="h-4 w-4" aria-hidden="true" />
                  Back to home
                </Link>
              )}
            </Button>
          </div>
        </div>

        <div className={cn('grid grid-cols-1 gap-5 sm:grid-cols-3', compact ? 'mt-12' : 'mt-16')}>
          {features.map((feature, index) => (
            <div
              key={feature.title}
              className="animate-fade-up border-border bg-card/80 group hover:border-primary/40 rounded-2xl border p-6 text-left shadow-sm backdrop-blur transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
              style={{ animationDelay: `${150 + index * 130}ms` }}
            >
              <div className="bg-primary/10 text-primary group-hover:bg-primary/20 inline-flex h-11 w-11 items-center justify-center rounded-xl transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-foreground mt-4 font-semibold">{feature.title}</h3>
              <p className="text-muted-foreground mt-1.5 text-sm">{feature.text}</p>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground mt-10 inline-flex items-center gap-2 text-sm">
          {isNotFound ? (
            'Lost? Head back to the homepage.'
          ) : (
            <>
              Want to suggest this page?
              <Link
                href="/contact"
                className="text-primary hover:text-primary/80 inline-flex items-center gap-1 font-medium transition-colors"
              >
                Contact us
                <ArrowRight className="h-3.5 w-3.5" aria-hidden="true" />
              </Link>
            </>
          )}
        </p>
      </div>
    </section>
  );
};

ComingSoon.displayName = 'ComingSoon';

export { ComingSoon };
