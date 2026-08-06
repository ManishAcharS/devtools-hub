import type { Metadata } from 'next';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { createMetadata } from '@/lib/seo';
import { PageHeader } from '@/components/shared/page-header';
import { Prose } from '@/components/shared/prose';
import { siteConfig } from '@/config/site';

export const metadata: Metadata = createMetadata({
  title: 'Privacy Policy',
  description: `How ${siteConfig.name} collects, uses, and protects your information.`,
  canonical: '/privacy',
});

export default function PrivacyPolicyPage() {
  return (
    <div className="mx-auto w-full max-w-3xl flex-1 px-4 py-8 sm:px-6 lg:px-8">
      <PageHeader
        icon={<ShieldCheck className="h-6 w-6" aria-hidden="true" />}
        title="Privacy Policy"
        description="Last updated: June 2026"
        breadcrumb={[{ label: 'Privacy', current: true }]}
      />

      <Prose>
        <p>
          Your privacy matters to us. This policy explains what information we collect when you
          visit {siteConfig.name}, why we collect it, and the choices you have. We keep it short and
          plain.
        </p>

        <h2>Information we collect</h2>
        <p>We collect the minimum amount of information needed to run the site:</p>
        <ul>
          <li>
            <strong>Usage data</strong> — anonymous, aggregated analytics (pages visited, device
            type, approximate region). This never includes your name, email, or IP-identifiable
            browsing history.
          </li>
          <li>
            <strong>Information you submit</strong> — your name and email when you contact us,
            subscribe to the newsletter, or suggest a tool. We only use it to respond to you.
          </li>
          <li>
            <strong>Preferences</strong> — your theme preference (light/dark) and newsletter
            subscription status are stored on your device.
          </li>
        </ul>

        <h2>How we use your information</h2>
        <ul>
          <li>To respond to messages and process tool suggestions.</li>
          <li>To send the newsletter you explicitly subscribed to — no third-party lists, ever.</li>
          <li>To understand which tools and articles are useful, and improve the directory.</li>
        </ul>

        <h2>What we never do</h2>
        <ul>
          <li>We never sell your personal data.</li>
          <li>We never share your email with advertisers or sponsors.</li>
          <li>We never use tracking pixels or cross-site advertising profiles.</li>
          <li>We don&apos;t require an account to browse the directory.</li>
        </ul>

        <h2>Cookies</h2>
        <p>
          We use a small number of cookies: a preference cookie for your theme, and optional
          analytics cookies if you consent. You can manage or delete cookies at any time in your
          browser settings. See our <Link href="/cookies">Cookie Policy</Link> for details.
        </p>

        <h2>Data retention</h2>
        <p>
          Contact messages are kept for up to 12 months, then deleted. Newsletter data is kept until
          you unsubscribe — every email includes a one-click unsubscribe link.
        </p>

        <h2>Your rights</h2>
        <p>
          Depending on where you live, you may have the right to access, correct, or delete your
          personal data. To exercise any of these rights, contact us at{' '}
          <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a> and we&apos;ll
          respond within 30 days.
        </p>

        <h2>Third-party links</h2>
        <p>
          The directory links to external tools and sites. We&apos;re not responsible for their
          privacy practices — check their policies when you visit them.
        </p>

        <h2>Children&apos;s privacy</h2>
        <p>
          {siteConfig.name} is not directed at children under 13, and we do not knowingly collect
          personal information from them.
        </p>

        <h2>Changes to this policy</h2>
        <p>
          We may update this policy as the site evolves. Material changes will be announced in our
          changelog. Continued use of the site after changes means you accept the revised policy.
        </p>

        <h2>Contact</h2>
        <p>
          Questions about this policy? Email us at{' '}
          <a href={`mailto:${siteConfig.author.email}`}>{siteConfig.author.email}</a> or use our{' '}
          <Link href="/contact">contact form</Link>.
        </p>
      </Prose>
    </div>
  );
}
