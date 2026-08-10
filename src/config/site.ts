import type { NavigationItem, SiteConfig } from '@/types';

export const siteConfig: SiteConfig = {
  name: 'Toolbox for Devs',
  description:
    'Discover and compare the best developer tools, resources, and learning materials. Your ultimate toolkit for modern software development.',
  url: 'https://toolboxfordevs.vercel.app',
  ogImage: '/og-image.png',
  links: {
    github: 'https://github.com/ManishAcharS/toolboxfordevs',
    youtube: 'https://www.youtube.com/@toolboxfordevs',
    instagram: 'https://www.instagram.com/toolboxfordevs/',
  },
  author: {
    name: 'Toolbox for Devs Team',
    email: 'manishthelegend99@gmail.com',
  },
  theme: {
    colors: {
      primary: '#0ea5e9',
      secondary: '#64748b',
      accent: '#d946ef',
      background: '#ffffff',
      surface: '#f8fafc',
      text: '#0f172a',
      textMuted: '#64748b',
      border: '#e2e8f0',
      error: '#ef4444',
      warning: '#f59e0b',
      success: '#22c55e',
    },
    fonts: {
      sans: 'var(--font-inter), system-ui, sans-serif',
      mono: 'var(--font-jetbrains-mono), monospace',
    },
    radius: {
      sm: '0.25rem',
      md: '0.375rem',
      lg: '0.5rem',
      xl: '0.75rem',
      full: '9999px',
    },
    spacing: {},
    shadows: {},
    transitions: {},
    breakpoints: {},
  },
};

export const mainNavigation: NavigationItem[] = [
  {
    label: 'Tools',
    href: '/tools',
    icon: 'tool',
    megaMenu: {
      columns: [
        {
          title: 'Categories',
          items: [
            {
              label: 'API Development',
              href: '/tools?category=api-development',
              description: 'REST, GraphQL, gRPC tools',
            },
            {
              label: 'CI/CD & Deployment',
              href: '/tools?category=ci-cd',
              description: 'Pipeline automation',
            },
            {
              label: 'Databases',
              href: '/tools?category=databases',
              description: 'SQL, NoSQL, ORM tools',
            },
            {
              label: 'Frontend',
              href: '/tools?category=frontend',
              description: 'Frameworks, libraries, UI',
            },
            {
              label: 'Backend',
              href: '/tools?category=backend',
              description: 'Servers, microservices, APIs',
            },
            {
              label: 'Testing',
              href: '/tools?category=testing',
              description: 'Unit, integration, E2E testing',
            },
            {
              label: 'Monitoring',
              href: '/tools?category=monitoring',
              description: 'Logs, metrics, tracing',
            },
            {
              label: 'Security',
              href: '/tools?category=security',
              description: 'Auth, scanning, compliance',
            },
          ],
        },
        {
          title: 'Popular Tags',
          items: [
            { label: 'Open Source', href: '/tools?tag=open-source', badge: 'Hot' },
            { label: 'Free Tier', href: '/tools?pricing=free' },
            { label: 'TypeScript', href: '/tools?tag=typescript' },
            { label: 'React', href: '/tools?tag=react' },
            { label: 'Node.js', href: '/tools?tag=nodejs' },
            { label: 'Python', href: '/tools?tag=python' },
            { label: 'Go', href: '/tools?tag=go' },
            { label: 'Rust', href: '/tools?tag=rust' },
          ],
        },
        {
          title: 'Featured Tools',
          items: [
            { label: 'Postman', href: '/tools/postman', description: 'API development platform' },
            { label: 'Vercel', href: '/tools/vercel', description: 'Frontend deployment' },
            { label: 'Prisma', href: '/tools/prisma', description: 'Next-gen ORM' },
            { label: 'Turborepo', href: '/tools/turborepo', description: 'Build system' },
          ],
        },
      ],
      featuredTools: ['postman', 'vercel', 'prisma', 'turborepo'],
      featuredCategories: ['api-development', 'frontend', 'databases', 'ci-cd'],
    },
  },
  {
    label: 'Categories',
    href: '/categories',
    icon: 'folder',
    megaMenu: {
      columns: [
        {
          title: 'All Categories',
          items: [
            {
              label: 'Development',
              href: '/categories/development',
              description: 'Core dev tools',
            },
            {
              label: 'Infrastructure',
              href: '/categories/infrastructure',
              description: 'Cloud, containers, servers',
            },
            { label: 'Data', href: '/categories/data', description: 'Databases, analytics, ML' },
            {
              label: 'Design',
              href: '/categories/design',
              description: 'UI/UX, prototyping, assets',
            },
            {
              label: 'Productivity',
              href: '/categories/productivity',
              description: 'IDEs, editors, automation',
            },
            {
              label: 'Collaboration',
              href: '/categories/collaboration',
              description: 'Team tools, docs, chat',
            },
          ],
        },
      ],
    },
  },
  {
    label: 'Blog',
    href: '/blog',
    icon: 'book-open',
  },
  {
    label: 'Resources',
    href: '/resources',
    icon: 'graduation-cap',
    megaMenu: {
      columns: [
        {
          title: 'Learn',
          items: [
            { label: 'Tutorials', href: '/resources?type=tutorial' },
            { label: 'Courses', href: '/resources?type=course' },
            { label: 'Books', href: '/resources?type=book' },
            { label: 'Videos', href: '/resources?type=video' },
          ],
        },
        {
          title: 'Stay Updated',
          items: [
            { label: 'Newsletters', href: '/resources?type=newsletter' },
            { label: 'Podcasts', href: '/resources?type=podcast' },
            { label: 'Communities', href: '/resources?type=community' },
          ],
        },
      ],
    },
  },
  {
    label: 'Pricing',
    href: '/pricing',
    icon: 'credit-card',
  },
  {
    label: 'Changelog',
    href: '/changelog',
    icon: 'git-branch',
  },
];

export const footerNavigation = {
  product: [
    { label: 'Tools', href: '/tools' },
    { label: 'Categories', href: '/categories' },
    { label: 'Blog', href: '/blog' },
    { label: 'Resources', href: '/resources' },
    { label: 'Changelog', href: '/changelog' },
    { label: 'Roadmap', href: '/roadmap' },
  ],
  company: [
    { label: 'About', href: '/about' },
    { label: 'Careers', href: '/careers' },
    { label: 'Press', href: '/press' },
    { label: 'Contact', href: '/contact' },
    { label: 'Partners', href: '/partners' },
  ],
  legal: [
    { label: 'Privacy', href: '/privacy' },
    { label: 'Terms', href: '/terms' },
    { label: 'Cookie Policy', href: '/cookies' },
    { label: 'Security', href: '/security' },
  ],
  social: [
    {
      label: 'GitHub',
      href: 'https://github.com/ManishAcharS/toolboxfordevs',
      external: true,
    },
    {
      label: 'YouTube',
      href: 'https://www.youtube.com/@toolboxfordevs',
      external: true,
    },
    {
      label: 'Instagram',
      href: 'https://www.instagram.com/toolboxfordevs/',
      external: true,
    },
  ],
};
