import type { Metadata } from 'next';
import Link from 'next/link';
import { Info, Rocket, Heart, ShieldCheck, Users } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { Prose } from '@/components/shared/prose';
import { NewsletterSection } from '@/components/sections/newsletter-section';
import { FooterCtaSection } from '@/components/sections/footer-cta-section';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = createMetadata({
  title: 'About Us',
  description:
    'DevTools Hub is a curated directory of developer tools, resources, and learning materials — built by developers, for developers.',
  canonical: '/about',
});

const stats = [
  { value: '1000+', label: 'Tools planned' },
  { value: '12', label: 'Categories' },
  { value: '100%', label: 'Developer built' },
  { value: '0', label: 'Sponsored bias' },
];

const values = [
  {
    icon: Rocket,
    title: 'Curated, not collected',
    description:
      'Every tool earns its place. We review, test, and compare before anything appears in the directory.',
  },
  {
    icon: ShieldCheck,
    title: 'Transparent by default',
    description:
      'No hidden affiliate bias. Pricing models, open-source status, and limitations are always disclosed.',
  },
  {
    icon: Heart,
    title: 'Built for the community',
    description:
      'Suggestions, reviews, and corrections come straight from developers who use these tools every day.',
  },
  {
    icon: Users,
    title: 'Open to contributors',
    description:
      'The directory is open source on GitHub. Fix a typo, add a tool, or write a guide — anyone can help.',
  },
];

export default function AboutPage() {
  return (
    <div className="flex-1">
      <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
        <PageHeader
          icon={<Info className="h-6 w-6" aria-hidden="true" />}
          title="About Us"
          description="The story, mission, and principles behind DevTools Hub."
          breadcrumb={[{ label: 'About', current: true }]}
        />

        <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_320px]">
          <div>
            <Prose>
              <h2>Our mission</h2>
              <p>
                Choosing the right developer tool can take hours of reading docs, comparing pricing
                pages, and scrolling through Reddit threads. <strong>{siteConfig.name}</strong>{' '}
                exists to end that. We build the most complete, honest, and useful directory of
                developer tools on the web — a single place to discover, compare, and master the
                tools that power modern software.
              </p>

              <h2>Why we started</h2>
              <p>
                As working engineers, we kept a personal list of tools we loved: the ORM that made
                our migrations painless, the CI service that finally made builds reliable, the
                testing framework that ended flaky suites. That list lived in a shared note and grew
                every month. We realized a public, structured version of it would help everyone — so
                we built DevTools Hub.
              </p>

              <h2>How the directory works</h2>
              <p>
                Every tool in the directory is screened against a clear checklist before it ships:
              </p>
              <ul>
                <li>
                  <strong>Relevance</strong> — it must solve a real, current problem for developers.
                </li>
                <li>
                  <strong>Quality</strong> — it must be actively maintained and trusted by a real
                  community.
                </li>
                <li>
                  <strong>Clarity</strong> — pricing, licensing, and limitations must be documented.
                </li>
                <li>
                  <strong>Comparability</strong> — it must be describable against alternatives, so
                  you can make an informed choice.
                </li>
              </ul>

              <h2>What we don&apos;t do</h2>
              <ul>
                <li>We don&apos;t take payment for placement or rankings.</li>
                <li>We don&apos;t delete honest negative reviews.</li>
                <li>We don&apos;t recommend tools we wouldn&apos;t use ourselves.</li>
              </ul>

              <p>
                Want to contribute? The directory is open source — open an issue on{' '}
                <Link href={siteConfig.links.github} target="_blank" rel="noopener noreferrer">
                  GitHub
                </Link>{' '}
                to suggest a tool, or reach out through the{' '}
                <Link href="/contact">contact page</Link>.
              </p>
            </Prose>
          </div>

          <aside className="lg:sticky lg:top-24 lg:self-start">
            <div className="grid grid-cols-2 gap-4">
              {stats.map((stat) => (
                <div
                  key={stat.label}
                  className="border-border bg-card rounded-xl border p-5 text-center"
                >
                  <p className="text-primary text-2xl font-bold">{stat.value}</p>
                  <p className="text-muted-foreground mt-1 text-xs">{stat.label}</p>
                </div>
              ))}
            </div>
          </aside>
        </div>

        <section className="mt-16">
          <h2 className="mb-8 text-center text-2xl font-bold tracking-tight sm:text-3xl">
            What we stand for
          </h2>
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((value) => (
              <div
                key={value.title}
                className="border-border bg-card rounded-xl border p-6 transition-shadow hover:shadow-lg"
              >
                <span className="bg-primary/10 text-primary flex h-11 w-11 items-center justify-center rounded-xl">
                  <value.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold">{value.title}</h3>
                <p className="text-muted-foreground mt-2 text-sm leading-relaxed">
                  {value.description}
                </p>
              </div>
            ))}
          </div>
        </section>
      </div>

      <NewsletterSection title="Join the community" />
      <FooterCtaSection />
    </div>
  );
}
