import type { Metadata } from 'next';
import Link from 'next/link';
import { Mail, Github, Youtube, HelpCircle, LifeBuoy, type LucideIcon } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { ContactForm } from '@/components/shared/contact-form';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = createMetadata({
  title: 'Contact',
  description:
    'Get in touch with the Toolbox for Devs team — tool suggestions, feedback, partnerships, or support.',
  canonical: '/contact',
});

const channels: {
  icon: LucideIcon;
  title: string;
  description: string;
  href: string;
  label: string;
  external: boolean;
}[] = [
  {
    icon: Github,
    title: 'Report an issue',
    description: 'Found a bug or outdated info? Open an issue on GitHub.',
    href: siteConfig.links.github,
    label: 'Open GitHub',
    external: true,
  },
  {
    icon: Youtube,
    title: 'YouTube channel',
    description: 'Watch tutorials, tool walkthroughs, and dev tips on our channel.',
    href: siteConfig.links.youtube ?? 'https://www.youtube.com/@toolboxfordevs',
    label: 'Visit the channel',
    external: true,
  },
  {
    icon: HelpCircle,
    title: 'FAQs',
    description: 'Quick answers about the directory, submissions, and more.',
    href: '/#faq',
    label: 'Read the FAQ',
    external: false,
  },
];

export default function ContactPage() {
  return (
    <div className="mx-auto w-full max-w-7xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={<Mail className="h-6 w-6" aria-hidden="true" />}
        title="Contact"
        description="We read every message. Tool suggestions, corrections, partnerships, or just to say hi."
        breadcrumb={[{ label: 'Contact', current: true }]}
      />

      <div className="grid grid-cols-1 gap-10 lg:grid-cols-[1fr_360px]">
        <div className="border-border bg-card rounded-2xl border p-6 sm:p-8">
          <h2 className="text-xl font-semibold tracking-tight">Send us a message</h2>
          <p className="text-muted-foreground mt-1.5 mb-6 text-sm">
            Fill out the form and we&apos;ll get back to you within 1–2 business days.
          </p>
          <ContactForm />
        </div>

        <aside>
          <h2 className="sr-only">Other ways to reach us</h2>
          <ul className="space-y-4">
            {channels.map((channel) => (
              <li key={channel.title}>
                <Link
                  href={channel.href}
                  target={channel.external ? '_blank' : undefined}
                  rel={channel.external ? 'noopener noreferrer' : undefined}
                  className="group border-border bg-card hover:border-primary/40 focus-visible:ring-ring flex items-start gap-4 rounded-xl border p-5 transition-all hover:shadow-md focus-visible:ring-2 focus-visible:outline-none"
                >
                  <span className="bg-primary/10 text-primary flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-lg">
                    <channel.icon className="h-5 w-5" aria-hidden="true" />
                  </span>
                  <span>
                    <span className="block text-sm font-semibold">{channel.title}</span>
                    <span className="text-muted-foreground mt-0.5 block text-sm">
                      {channel.description}
                    </span>
                    <span className="text-primary group-hover:text-primary/80 mt-1.5 block text-sm font-medium">
                      {channel.label}
                    </span>
                  </span>
                </Link>
              </li>
            ))}
          </ul>

          <div className="border-border bg-muted/30 mt-6 flex items-start gap-3 rounded-xl border p-5">
            <LifeBuoy className="text-primary mt-0.5 h-5 w-5 flex-shrink-0" aria-hidden="true" />
            <p className="text-muted-foreground text-sm">
              Prefer email? Write to us directly at{' '}
              <a
                href={`mailto:${siteConfig.author.email}`}
                className="text-primary hover:text-primary/80 font-medium underline underline-offset-4"
              >
                {siteConfig.author.email}
              </a>
              .
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
