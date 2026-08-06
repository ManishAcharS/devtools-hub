import Link from 'next/link';
import { Github, Twitter, Linkedin, MessageCircle, Youtube, Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Logo } from '@/components/layout/logo';
import { footerNavigation, siteConfig } from '@/config/site';
import { NewsletterForm } from '@/components/shared/newsletter-form';

interface FooterProps {
  className?: string;
}

const socialIcons = {
  twitter: Twitter,
  github: Github,
  discord: MessageCircle,
  linkedin: Linkedin,
  youtube: Youtube,
} as const;

const Footer: React.FC<FooterProps> = ({ className }) => {
  const year = new Date().getFullYear();

  return (
    <footer className={cn('border-border bg-muted/30 border-t', className)}>
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-10 md:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Logo />
            <p className="text-muted-foreground mt-4 max-w-xs text-sm">
              Discover, compare, and master the best developer tools, resources, and learning
              materials — all in one place.
            </p>
            <div className="mt-6 flex items-center gap-2">
              {Object.entries(socialIcons).map(([name, Icon]) => {
                const link = footerNavigation.social.find((s) => s.label.toLowerCase() === name);
                if (!link) return null;
                return (
                  <a
                    key={name}
                    href={link.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover-glow text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg p-2 transition-colors"
                    aria-label={`DevTools Hub on ${name}`}
                  >
                    <Icon className="h-5 w-5" aria-hidden="true" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold">Product</h3>
            <ul className="space-y-2.5">
              {footerNavigation.product.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold">Company</h3>
            <ul className="space-y-2.5">
              {footerNavigation.company.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-foreground mb-4 text-sm font-semibold">Legal</h3>
            <ul className="space-y-2.5">
              {footerNavigation.legal.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-muted-foreground hover:text-primary text-sm transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div className="border-border/60 mt-4 lg:col-span-6 lg:mt-8 lg:border-t lg:pt-8">
            <div className="flex flex-col gap-4">
              <div>
                <h3 className="text-foreground text-sm font-semibold">Stay in the loop</h3>
                <p className="text-muted-foreground mt-1 text-sm">
                  Fresh tools and tutorials, delivered monthly. No spam.
                </p>
              </div>
              <NewsletterForm className="w-full max-w-none" />
            </div>
          </div>
        </div>

        <div className="border-border mt-12 flex flex-col items-center justify-between gap-4 border-t pt-6 sm:flex-row">
          <p className="text-muted-foreground text-sm">
            &copy; {year} {siteConfig.name}. All rights reserved.
          </p>
          <p className="text-muted-foreground flex items-center gap-1.5 text-sm">
            Built with <Heart className="h-4 w-4 fill-current text-red-500" aria-hidden="true" />{' '}
            for developers
          </p>
        </div>
      </div>
    </footer>
  );
};

Footer.displayName = 'Footer';

export { Footer };
