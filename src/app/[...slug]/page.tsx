import type { Metadata } from 'next';
import { Wrench } from 'lucide-react';
import { ComingSoon } from '@/components/shared/coming-soon';
import { createMetadata } from '@/lib/seo';

interface ComingSoonPageProps {
  params: Promise<{ slug: string[] }>;
}

function humanize(segments: string[]): string {
  return segments
    .map((segment) =>
      segment
        .split('-')
        .map((word) => (word ? word.charAt(0).toUpperCase() + word.slice(1) : word))
        .join(' ')
    )
    .join(' ');
}

export async function generateMetadata({ params }: ComingSoonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const label = humanize(slug);
  return createMetadata({
    title: `${label} | Coming soon`,
    description: `${label} is under construction. This page will be available soon — stay tuned!`,
    canonical: `/${slug.join('/')}`,
    noIndex: true,
  });
}

export default async function ComingSoonPage({ params }: ComingSoonPageProps) {
  const { slug } = await params;
  const label = humanize(slug);

  return (
    <ComingSoon
      icon={<Wrench className="h-9 w-9" aria-hidden="true" />}
      title={label}
      description={`${label} is under construction. We're working on it and it will be available here soon — stay tuned!`}
    />
  );
}
