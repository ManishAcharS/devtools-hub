import type { Metadata } from 'next';
import Link from 'next/link';
import { FileText } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { Prose } from '@/components/shared/prose';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = createMetadata({
  title: 'Terms of Service',
  description: `The terms governing your use of ${siteConfig.name}.`,
  canonical: '/terms',
});

export default function TermsOfServicePage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={<FileText className="h-6 w-6" aria-hidden="true" />}
        title="Terms of Service"
        description="Last updated: June 2026"
        breadcrumb={[{ label: 'Terms', current: true }]}
      />

      <Prose>
        <p>
          These terms govern your use of {siteConfig.name} (the &quot;Site&quot;). By accessing the
          Site, you agree to them. If you don&apos;t agree, please don&apos;t use the Site.
        </p>

        <h2>1. What the Site provides</h2>
        <p>
          {siteConfig.name} is a curated directory of third-party developer tools, educational
          resources, and editorial content. We provide information and links — we do not operate,
          host, or sell the tools listed, and we&apos;re not a party to any agreement between you
          and a tool vendor.
        </p>

        <h2>2. Accuracy of information</h2>
        <p>
          We work hard to keep listings accurate, but details like pricing, features, and
          availability change frequently. Information on the Site is provided &quot;as is&quot;
          without warranties of any kind. Always verify critical details — especially pricing and
          licensing — on the tool&apos;s official site.
        </p>

        <h2>3. Acceptable use</h2>
        <p>You agree not to:</p>
        <ul>
          <li>Scrape the Site at volumes that degrade service for other visitors.</li>
          <li>Submit spam, false information, or malicious content through our forms.</li>
          <li>Attempt to disrupt, probe, or exploit the Site or its infrastructure.</li>
          <li>
            Republish our editorial content without attribution, or in a way that misrepresents your
            relationship to the tools listed.
          </li>
        </ul>

        <h2>4. Intellectual property</h2>
        <p>
          The Site&apos;s design, code, and original editorial content are the property of{' '}
          {siteConfig.name}. Tool names, logos, and trademarks belong to their respective owners and
          are referenced for identification purposes only.
        </p>

        <h2>5. Third-party links</h2>
        <p>
          Links to third-party tools and resources are provided for convenience. We&apos;re not
          responsible for the content, functionality, or security of external sites, and inclusion
          in the directory is not an endorsement.
        </p>

        <h2>6. Disclaimer of warranties</h2>
        <p>
          The Site is provided on an &quot;as is&quot; and &quot;as available&quot; basis. To the
          maximum extent permitted by law, we disclaim all warranties, express or implied, including
          fitness for a particular purpose and non-infringement.
        </p>

        <h2>7. Limitation of liability</h2>
        <p>
          To the maximum extent permitted by law, {siteConfig.name} shall not be liable for any
          indirect, incidental, special, or consequential damages arising from your use of the Site
          or reliance on its content.
        </p>

        <h2>8. Changes to these terms</h2>
        <p>
          We may update these terms from time to time. Continued use of the Site after changes are
          posted constitutes acceptance of the revised terms.
        </p>

        <h2>9. Contact</h2>
        <p>
          Questions about these terms? Email us at{' '}
          <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a> or use our{' '}
          <Link href="/contact">contact form</Link>.
        </p>
      </Prose>
    </div>
  );
}
