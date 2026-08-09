import type { ToolDefinition } from '@/types';

export const toolDefinitions: ToolDefinition[] = [
  {
    id: 'tool-postman',
    slug: 'postman',
    title: 'Postman',
    description:
      "The world's leading API platform for building, testing, documenting, and collaborating on APIs.",
    shortDescription: 'API development platform for building and testing APIs.',
    category: 'api-development',
    keywords: [
      'api platform',
      'rest client',
      'api testing',
      'api documentation',
      'api collaboration',
    ],
    tags: ['api', 'rest', 'graphql', 'testing', 'documentation'],
    pricing: 'freemium',
    featured: true,
    rating: 4.8,
    reviewsCount: 12450,
    faqs: [
      {
        question: 'Is Postman free to use?',
        answer:
          'Yes, Postman offers a generous free tier for individuals and small teams. Paid plans add team workspaces, advanced mocking, and admin controls.',
      },
      {
        question: 'Can Postman test GraphQL and gRPC APIs?',
        answer:
          'Yes. Postman supports REST, GraphQL, gRPC, and WebSocket APIs with dedicated request builders and schema-aware testing.',
      },
      {
        question: 'Does Postman work in the terminal?',
        answer:
          'Postman ships a command-line companion called Newman that runs collections in CI pipelines and local scripts.',
      },
    ],
    examples: [
      {
        title: 'Send a POST request',
        description: 'Postman lets you craft, save, and reuse HTTP requests like this one.',
        code: `curl -X POST https://api.example.com/v1/users \\
  -H "Content-Type: application/json" \\
  -H "Authorization: Bearer $TOKEN" \\
  -d '{"name": "Ada", "role": "admin"}'`,
        language: 'bash',
        variant: 'terminal',
      },
      {
        title: 'Run a collection with Newman',
        description: 'Automate your saved collections in CI with the command-line runner.',
        code: `newman run my-collection.json --environment prod.env --reporters cli,junit`,
        language: 'bash',
      },
    ],
    relatedTools: ['playwright', 'auth0', 'github-actions'],
    copyValue: 'npm install -g newman',
    seo: {
      title: 'Postman — API Testing & Development Platform',
      description:
        'Build, test, document, and collaborate on REST, GraphQL, and gRPC APIs with Postman — the world\u2019s leading API platform.',
      keywords: ['postman', 'api testing', 'api platform', 'newman'],
    },
    createdAt: '2024-01-15T00:00:00.000Z',
    updatedAt: '2025-01-15T00:00:00.000Z',
  },
  {
    id: 'tool-vercel',
    slug: 'vercel',
    title: 'Vercel',
    description:
      'The platform for frontend developers, providing the tools and workflows to build, scale, and secure a faster, more personalized web.',
    shortDescription: 'Frontend cloud platform for deploying web applications.',
    category: 'frontend',
    keywords: ['deployment', 'hosting', 'nextjs', 'serverless', 'jamstack', 'edge'],
    tags: ['deployment', 'serverless', 'nextjs', 'hosting', 'jamstack'],
    pricing: 'freemium',
    featured: true,
    rating: 4.9,
    reviewsCount: 8930,
    faqs: [
      {
        question: 'Is Vercel free for personal projects?',
        answer:
          'Yes. The Hobby plan is free forever and includes serverless functions, edge rendering, and a generous bandwidth allowance.',
      },
      {
        question: 'Does Vercel only work with Next.js?',
        answer:
          'No. Vercel is optimized for Next.js but deploys any frontend framework, static site, or serverless function via git push or the CLI.',
      },
      {
        question: 'How does Vercel handle previews?',
        answer:
          'Every pull request gets an instant deployment URL, so reviewers can test changes before they land on main.',
      },
    ],
    examples: [
      {
        title: 'Deploy from the CLI',
        description: 'Push any project to a global edge network in seconds.',
        code: `vercel deploy --prod`,
        language: 'bash',
        variant: 'terminal',
      },
      {
        title: 'vercel.json configuration',
        description: 'Redirects, rewrites, and headers are configured with a single file.',
        code: `{
  "rewrites": [{ "source": "/api/:path*", "destination": "https://api.example.com/:path*" }],
  "headers": [{ "source": "/(.*)", "headers": [{ "key": "X-Frame-Options", "value": "DENY" }] }]
}`,
        language: 'json',
        variant: 'highlighted',
      },
    ],
    relatedTools: ['turborepo', 'github-actions', 'docker'],
    copyValue: 'npm i -g vercel',
    seo: {
      title: 'Vercel — Deploy Frontend Apps in Seconds',
      description:
        'Deploy Next.js and any frontend framework to Vercel\u2019s global edge network with git integration, previews, and serverless functions.',
    },
    createdAt: '2024-01-20T00:00:00.000Z',
    updatedAt: '2025-01-20T00:00:00.000Z',
  },
  {
    id: 'tool-prisma',
    slug: 'prisma',
    title: 'Prisma',
    description:
      'Next-generation Node.js and TypeScript ORM with a type-safe database client, migrations, and a visual data model editor.',
    shortDescription: 'Next-gen ORM for Node.js and TypeScript.',
    category: 'databases',
    keywords: [
      'orm',
      'typescript database',
      'sql migrations',
      'type-safe queries',
      'nodejs database',
    ],
    tags: ['orm', 'typescript', 'nodejs', 'database', 'postgresql'],
    pricing: 'open-source',
    featured: true,
    rating: 4.7,
    reviewsCount: 5670,
    faqs: [
      {
        question: 'Which databases does Prisma support?',
        answer:
          'PostgreSQL, MySQL, SQLite, SQL Server, MongoDB, and CockroachDB are supported, with more being added over time.',
      },
      {
        question: 'Is Prisma free?',
        answer:
          'The core ORM and migrations engine are open source under the Apache 2.0 license. Prisma Accelerate and Pulse add paid cloud services.',
      },
      {
        question: 'How do I migrate my existing schema?',
        answer:
          'Run prisma db pull to introspect your database into a schema file, then use prisma migrate dev to take over changes from there.',
      },
    ],
    examples: [
      {
        title: 'Define a model',
        description: 'Prisma schema files describe your database in plain, reviewable code.',
        code: `model User {
  id        String   @id @default(cuid())
  email     String   @unique
  name      String?
  posts     Post[]
  createdAt DateTime @default(now())
}

model Post {
  id       String @id @default(cuid())
  title    String
  author   User   @relation(fields: [authorId], references: [id])
  authorId String
}`,
        language: 'prisma',
        variant: 'highlighted',
      },
      {
        title: 'Query with a type-safe client',
        description: 'Every query is validated at compile time against your schema.',
        code: `import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const user = await prisma.user.findUnique({
  where: { email: 'ada@example.com' },
  include: { posts: true },
});`,
        language: 'typescript',
      },
    ],
    relatedTools: ['supabase', 'docker', 'vitest'],
    copyValue: 'npm install prisma --save-dev',
    download: {
      fileName: 'schema.prisma',
      contentType: 'text/plain',
      content: `datasource db {\n  provider = "postgresql"\n  url      = env("DATABASE_URL")\n}\n\ngenerator client {\n  provider = "prisma-client-js"\n}\n\nmodel User {\n  id    String @id @default(cuid())\n  email String @unique\n}\n`,
    },
    createdAt: '2024-02-01T00:00:00.000Z',
    updatedAt: '2025-02-01T00:00:00.000Z',
  },
  {
    id: 'tool-turborepo',
    slug: 'turborepo',
    title: 'Turborepo',
    description:
      'High-performance build system for JavaScript and TypeScript codebases with caching, parallelization, and remote caching.',
    shortDescription: 'High-performance build system for monorepos.',
    category: 'productivity',
    keywords: ['monorepo', 'build system', 'task caching', 'ci caching', 'typescript builds'],
    tags: ['monorepo', 'build', 'caching', 'typescript', 'javascript'],
    pricing: 'open-source',
    featured: true,
    rating: 4.6,
    reviewsCount: 3420,
    faqs: [
      {
        question: 'How does Turborepo speed up builds?',
        answer:
          'It caches task outputs by content hash, so unchanged tasks are replayed from cache instead of re-executed — locally and on CI.',
      },
      {
        question: 'Can I use Turborepo without moving to a monorepo?',
        answer:
          'Yes. You can adopt it incrementally on a single package and add more packages as your workspace grows.',
      },
      {
        question: 'Is Turborepo free?',
        answer:
          'The Turborepo CLI is open source (MIT). Turborepo Remote Caching offers a free tier with paid options for larger teams.',
      },
    ],
    examples: [
      {
        title: 'turbo.json task pipeline',
        description: 'Declare task dependencies and cache rules once; Turborepo does the rest.',
        code: `{
  "tasks": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "test": {
      "dependsOn": ["build"],
      "outputs": ["coverage/**"]
    },
    "lint": {}
  }
}`,
        language: 'json',
        variant: 'highlighted',
      },
      {
        title: 'Run all tasks in parallel',
        description: 'Execute a task across every package in the workspace.',
        code: `turbo run build --filter=./packages/*`,
        language: 'bash',
        variant: 'terminal',
      },
    ],
    relatedTools: ['vercel', 'vitest', 'github-actions'],
    copyValue: 'npm i -g turbo',
    download: {
      fileName: 'turbo.json',
      contentType: 'application/json',
      content: `{\n  "$schema": "https://turbo.build/schema.json",\n  "tasks": {\n    "build": { "dependsOn": ["^build"], "outputs": ["dist/**"] }\n  }\n}\n`,
    },
    createdAt: '2024-02-10T00:00:00.000Z',
    updatedAt: '2025-02-10T00:00:00.000Z',
  },
  {
    id: 'tool-supabase',
    slug: 'supabase',
    title: 'Supabase',
    description:
      'Open-source Firebase alternative with Postgres, authentication, storage, realtime, and edge functions.',
    shortDescription: 'Open-source Firebase alternative built on Postgres.',
    category: 'backend',
    keywords: [
      'firebase alternative',
      'postgres backend',
      'realtime database',
      'auth service',
      'edge functions',
    ],
    tags: ['database', 'auth', 'realtime', 'postgresql', 'open-source'],
    pricing: 'freemium',
    featured: false,
    rating: 4.8,
    reviewsCount: 7210,
    faqs: [
      {
        question: 'Is Supabase really open source?',
        answer:
          'Yes — the core platform is Apache 2.0 on GitHub, and you can self-host it with Docker or use the managed cloud.',
      },
      {
        question: 'How is Supabase different from Firebase?',
        answer:
          'Supabase is built on Postgres and SQL, so you keep relational integrity, real queries, and full database ownership.',
      },
      {
        question: 'Does Supabase include authentication?',
        answer:
          'Yes. It ships auth with email/password, OAuth providers, and passwordless magic links, plus row-level security policies.',
      },
    ],
    examples: [
      {
        title: 'Subscribe to realtime changes',
        description: 'Realtime is a thin layer over Postgres replication — no sockets to manage.',
        code: `import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!
);

const channel = supabase
  .channel('tasks')
  .on(
    'postgres_changes',
    { event: 'INSERT', schema: 'public', table: 'tasks' },
    (payload) => console.log('New task:', payload.new)
  )
  .subscribe();`,
        language: 'typescript',
      },
    ],
    relatedTools: ['prisma', 'auth0', 'docker'],
    copyValue: 'npm install @supabase/supabase-js',
    createdAt: '2024-03-01T00:00:00.000Z',
    updatedAt: '2025-03-01T00:00:00.000Z',
  },
  {
    id: 'tool-vitest',
    slug: 'vitest',
    title: 'Vitest',
    description:
      'A blazing fast unit test framework powered by Vite, designed for modern JavaScript and TypeScript projects.',
    shortDescription: 'Blazing fast unit testing framework powered by Vite.',
    category: 'testing',
    keywords: [
      'unit testing',
      'vite test runner',
      'typescript tests',
      'esm testing',
      'test framework',
    ],
    tags: ['testing', 'unit', 'vite', 'typescript', 'javascript'],
    pricing: 'open-source',
    featured: false,
    rating: 4.8,
    reviewsCount: 4310,
    faqs: [
      {
        question: 'How is Vitest different from Jest?',
        answer:
          'Vitest runs natively on ESM with Vite\u2019s transform pipeline, making it significantly faster and zero-config for Vite projects.',
      },
      {
        question: 'Does Vitest support watch mode?',
        answer:
          'Yes — watch mode re-runs only affected tests using Vite\u2019s dependency graph, which keeps iteration loops near-instant.',
      },
      {
        question: 'Can I migrate from Jest?',
        answer:
          'Mostly yes. Vitest offers a Jest-compatible API and a codemod that converts common Jest patterns automatically.',
      },
    ],
    examples: [
      {
        title: 'Write your first test',
        description: 'A minimal test using the describe/it/expect API.',
        code: `import { describe, it, expect } from 'vitest';

function add(a: number, b: number) {
  return a + b;
}

describe('add', () => {
  it('adds two numbers', () => {
    expect(add(2, 3)).toBe(5);
  });
});`,
        language: 'typescript',
        variant: 'highlighted',
      },
    ],
    relatedTools: ['playwright', 'turborepo', 'github-actions'],
    copyValue: 'npm install -D vitest',
    createdAt: '2024-03-15T00:00:00.000Z',
    updatedAt: '2025-03-15T00:00:00.000Z',
  },
  {
    id: 'tool-grafana',
    slug: 'grafana',
    title: 'Grafana',
    description:
      'The open observability platform for visualizing metrics, logs, and traces with beautiful dashboards.',
    shortDescription: 'Open observability platform with beautiful dashboards.',
    category: 'monitoring',
    keywords: ['dashboards', 'metrics visualization', 'observability', 'logs', 'alerting'],
    tags: ['monitoring', 'dashboards', 'metrics', 'logs', 'observability'],
    pricing: 'freemium',
    featured: false,
    rating: 4.7,
    reviewsCount: 5890,
    faqs: [
      {
        question: 'Which data sources does Grafana connect to?',
        answer:
          'Hundreds, including Prometheus, Loki, InfluxDB, Elasticsearch, CloudWatch, Datadog, and any SQL database.',
      },
      {
        question: 'Is Grafana free?',
        answer:
          'The open-source version is free and unlimited. Grafana Cloud adds a free tier with hosted metrics, logs, and alerting.',
      },
      {
        question: 'Can Grafana send alerts?',
        answer:
          'Yes. Unified alerting evaluates rules across data sources and routes notifications to Slack, PagerDuty, email, and more.',
      },
    ],
    examples: [
      {
        title: 'Run Grafana with Docker',
        description: 'Stand up a local Grafana instance in one command.',
        code: `docker run -d -p 3000:3000 --name grafana grafana/grafana`,
        language: 'bash',
        variant: 'terminal',
      },
    ],
    relatedTools: ['sentry', 'docker'],
    createdAt: '2024-04-01T00:00:00.000Z',
    updatedAt: '2025-04-01T00:00:00.000Z',
  },
  {
    id: 'tool-docker',
    slug: 'docker',
    title: 'Docker',
    description:
      'The industry standard for containerized application development, shipping, and deployment.',
    shortDescription: 'Industry standard for containerized applications.',
    category: 'infrastructure',
    keywords: [
      'containers',
      'dev containers',
      'docker compose',
      'container registry',
      'local development',
    ],
    tags: ['containers', 'devops', 'deployment', 'virtualization'],
    pricing: 'freemium',
    featured: false,
    rating: 4.8,
    reviewsCount: 10230,
    faqs: [
      {
        question: 'What is a container?',
        answer:
          'A container packages your app with its runtime and dependencies into a portable unit that runs identically anywhere.',
      },
      {
        question: 'Is Docker free for developers?',
        answer:
          'Yes — Docker Desktop is free for personal and small-business use. Large enterprises need a paid subscription.',
      },
      {
        question: 'What is the difference between Docker and Kubernetes?',
        answer:
          'Docker builds and runs individual containers; Kubernetes orchestrates many containers across clusters. They complement each other.',
      },
    ],
    examples: [
      {
        title: 'A simple docker-compose.yml',
        description: 'Spin up a database and a cache for local development.',
        code: `services:
  postgres:
    image: postgres:16
    environment:
      POSTGRES_PASSWORD: dev
    ports:
      - "5432:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"

volumes:
  pgdata:`,
        language: 'yaml',
        variant: 'highlighted',
      },
    ],
    relatedTools: ['supabase', 'grafana', 'github-actions'],
    download: {
      fileName: 'docker-compose.yml',
      contentType: 'text/yaml',
      content: `services:\n  app:\n    build: .\n    ports:\n      - "3000:3000"\n`,
    },
    seo: {
      title: 'Docker — Containerize Your Development Workflow',
      description:
        'Build, ship, and run containerized applications with Docker — the industry standard for reproducible dev environments.',
    },
    createdAt: '2024-04-15T00:00:00.000Z',
    updatedAt: '2025-04-15T00:00:00.000Z',
  },
  {
    id: 'tool-sentry',
    slug: 'sentry',
    title: 'Sentry',
    description:
      'Application monitoring and error tracking that helps developers see, solve, and learn from errors in real-time.',
    shortDescription: 'Application monitoring and error tracking.',
    category: 'monitoring',
    keywords: [
      'error tracking',
      'crash reporting',
      'application monitoring',
      'exception logging',
      'performance',
    ],
    tags: ['error-tracking', 'monitoring', 'debugging', 'crash-reporting'],
    pricing: 'freemium',
    featured: false,
    rating: 4.6,
    reviewsCount: 4780,
    faqs: [
      {
        question: 'What languages does Sentry support?',
        answer:
          'Sentry has SDKs for JavaScript, Python, Go, Ruby, Java, Rust, .NET, PHP, mobile, and most major frameworks.',
      },
      {
        question: 'Does Sentry only track errors?',
        answer:
          'No — Sentry also monitors performance, releases, and session health, giving you full-stack visibility.',
      },
      {
        question: 'Is there a free tier?',
        answer:
          'Yes. The free tier includes 5,000 error events and 10,000 performance transactions per month.',
      },
    ],
    examples: [
      {
        title: 'Initialize in a Next.js app',
        description: 'One call wires error tracking into your framework.',
        code: `import * as Sentry from '@sentry/nextjs';

Sentry.init({
  dsn: 'https://example@sentry.io/project-id',
  tracesSampleRate: 0.5,
});`,
        language: 'typescript',
      },
    ],
    relatedTools: ['grafana', 'vitest'],
    createdAt: '2024-05-01T00:00:00.000Z',
    updatedAt: '2025-05-01T00:00:00.000Z',
  },
  {
    id: 'tool-auth0',
    slug: 'auth0',
    title: 'Auth0',
    description:
      'Universal authentication and authorization platform for securing applications of any size.',
    shortDescription: 'Universal authentication and authorization platform.',
    category: 'security',
    keywords: ['authentication', 'oauth2', 'sso', 'identity provider', 'jwt'],
    tags: ['authentication', 'authorization', 'sso', 'security', 'oauth'],
    pricing: 'freemium',
    featured: false,
    rating: 4.6,
    reviewsCount: 3450,
    faqs: [
      {
        question: 'Which protocols does Auth0 support?',
        answer:
          'OpenID Connect, OAuth 2.0, and SAML, with universal login supporting social, enterprise, and passwordless flows.',
      },
      {
        question: 'Is Auth0 free?',
        answer:
          'The free tier covers up to 7,500 active users and 50,000 logins per month with social logins and SSO.',
      },
      {
        question: 'Can I use Auth0 with my existing database?',
        answer:
          'Yes — custom databases and external identity providers can be connected, including legacy LDAP and Active Directory.',
      },
    ],
    examples: [
      {
        title: 'Redirect to universal login',
        description: 'With the SPA SDK, authentication is a few lines.',
        code: `import { createAuth0Client } from '@auth0/auth0-spa-js';

const auth0 = await createAuth0Client({
  domain: 'your-tenant.auth0.com',
  clientId: 'YOUR_CLIENT_ID',
});

await auth0.loginWithRedirect({ redirect_uri: window.location.origin });
const user = await auth0.getUser();
console.log(user.email);`,
        language: 'typescript',
      },
    ],
    relatedTools: ['supabase', 'sentry'],
    createdAt: '2024-05-15T00:00:00.000Z',
    updatedAt: '2025-05-15T00:00:00.000Z',
  },
  {
    id: 'tool-playwright',
    slug: 'playwright',
    title: 'Playwright',
    description:
      "Microsoft's reliable end-to-end testing framework for modern web apps across all browsers.",
    shortDescription: 'End-to-end testing framework for modern web apps.',
    category: 'testing',
    keywords: [
      'e2e testing',
      'browser automation',
      'cross-browser tests',
      'web ui testing',
      'trace viewer',
    ],
    tags: ['e2e', 'testing', 'browser', 'automation', 'open-source'],
    pricing: 'open-source',
    featured: false,
    rating: 4.8,
    reviewsCount: 6120,
    faqs: [
      {
        question: 'Which browsers does Playwright support?',
        answer:
          'Chromium, Firefox, and WebKit — one test suite can run against all three, including mobile viewports.',
      },
      {
        question: 'How does Playwright handle flaky tests?',
        answer:
          'Auto-waiting retries actions until elements are actionable, and the trace viewer records every step for debugging.',
      },
      {
        question: 'Is Playwright free?',
        answer:
          'Yes, Playwright is open source (Apache 2.0) with no usage limits. Optional cloud services add managed browsers and storage.',
      },
    ],
    examples: [
      {
        title: 'A first end-to-end test',
        description: 'Navigate, interact, and assert — with automatic waiting built in.',
        code: `import { test, expect } from '@playwright/test';

test('search filters results', async ({ page }) => {
  await page.goto('https://example.com/tools');
  await page.getByPlaceholder('Search tools').fill('postman');
  await page.getByRole('button', { name: 'Search' }).click();
  await expect(page.getByText('Postman')).toBeVisible();
});`,
        language: 'typescript',
        variant: 'highlighted',
      },
    ],
    relatedTools: ['vitest', 'github-actions'],
    copyValue: 'npm init playwright@latest',
    createdAt: '2024-06-01T00:00:00.000Z',
    updatedAt: '2025-06-01T00:00:00.000Z',
  },
  {
    id: 'tool-github-actions',
    slug: 'github-actions',
    title: 'GitHub Actions',
    description:
      'Automate, customize, and execute software development workflows right in your repository.',
    shortDescription: 'CI/CD automation built into GitHub.',
    category: 'ci-cd',
    keywords: [
      'ci cd',
      'github workflows',
      'build automation',
      'deploy automation',
      'actions marketplace',
    ],
    tags: ['ci', 'cd', 'automation', 'workflows', 'github'],
    pricing: 'freemium',
    featured: false,
    rating: 4.8,
    reviewsCount: 9870,
    faqs: [
      {
        question: 'How much CI minutes do I get for free?',
        answer:
          'Public repositories get unlimited minutes; private repos get 2,000 free minutes per month on the free plan.',
      },
      {
        question: 'What can GitHub Actions automate?',
        answer:
          'Testing, builds, releases, deployment, issue triage, and any task you can express as a workflow of steps.',
      },
      {
        question: 'Can I reuse workflows across repos?',
        answer:
          'Yes — reusable workflows and composite actions let you share pipeline logic with a single reference.',
      },
    ],
    examples: [
      {
        title: 'CI pipeline on every push',
        description: 'Run lint, tests, and build automatically for every pull request.',
        code: `name: CI

on:
  push:
    branches: [main]
  pull_request:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
      - run: npm ci
      - run: npm run lint
      - run: npm test`,
        language: 'yaml',
        variant: 'highlighted',
      },
    ],
    relatedTools: ['vercel', 'docker', 'playwright'],
    download: {
      fileName: 'ci.yml',
      contentType: 'text/yaml',
      content: `name: CI\n\non:\n  push:\n    branches: [main]\n\njobs:\n  test:\n    runs-on: ubuntu-latest\n    steps:\n      - uses: actions/checkout@v4\n      - run: npm ci\n      - run: npm test\n`,
    },
    createdAt: '2024-06-15T00:00:00.000Z',
    updatedAt: '2025-06-15T00:00:00.000Z',
  },
  {
    id: 'tool-figma',
    slug: 'figma',
    title: 'Figma',
    description:
      'Collaborative interface design tool that helps teams design, prototype, and handoff to developers.',
    shortDescription: 'Collaborative interface design and prototyping tool.',
    category: 'design',
    keywords: ['ui design', 'prototyping', 'design system', 'dev mode', 'collaborative design'],
    tags: ['design', 'ui', 'ux', 'prototyping', 'collaboration'],
    pricing: 'freemium',
    featured: false,
    rating: 4.8,
    reviewsCount: 11200,
    faqs: [
      {
        question: 'Is Figma free?',
        answer:
          'The starter plan is free for up to 3 files and unlimited personal drafts. Paid plans add unlimited files and team libraries.',
      },
      {
        question: 'How do developers inspect designs?',
        answer:
          'Dev Mode provides handoff-ready specs: exact spacing, tokens, and code snippets for the selected component.',
      },
      {
        question: 'Can Figma plugins extend the workflow?',
        answer:
          'Yes — a plugin API lets teams automate exports, sync design tokens, and connect designs to code repos.',
      },
    ],
    examples: [
      {
        title: 'Read a frame from a plugin',
        description: 'The plugin API gives scripts direct access to design elements.',
        code: `figma.showUI(__html__);

figma.ui.onmessage = (msg: { type: string }) => {
  if (msg.type === 'export') {
    const node = figma.currentPage.selection[0];
    if (node) {
      const bytes = node.exportAsync({ format: 'PNG', constraint: { type: 'SCALE', value: 2 } });
      console.log('Exporting', node.name);
    }
  }
};`,
        language: 'typescript',
      },
    ],
    relatedTools: ['slack', 'vercel'],
    createdAt: '2024-07-01T00:00:00.000Z',
    updatedAt: '2025-07-01T00:00:00.000Z',
  },
  {
    id: 'tool-slack',
    slug: 'slack',
    title: 'Slack',
    description:
      'The collaboration hub for teams, bringing people together to work as one unified organization.',
    shortDescription: 'Team communication and collaboration hub.',
    category: 'collaboration',
    keywords: [
      'team chat',
      'workflow builder',
      'integrations',
      'channel messaging',
      'incident response',
    ],
    tags: ['communication', 'team', 'chat', 'collaboration'],
    pricing: 'freemium',
    featured: false,
    rating: 4.4,
    reviewsCount: 8760,
    faqs: [
      {
        question: 'Is Slack free for teams?',
        answer:
          'The free plan includes 90 days of message history, 10 app integrations, and unlimited channels.',
      },
      {
        question: 'Can Slack be used for incident response?',
        answer:
          'Yes — workflows and integrations with PagerDuty, Grafana, and GitHub make it a common incident hub.',
      },
      {
        question: 'Does Slack have an API for developers?',
        answer:
          'Yes. Slack exposes a web API, Socket Mode, Block Kit for messages, and a full app distribution platform.',
      },
    ],
    examples: [
      {
        title: 'Post a Block Kit message',
        description: 'Rich, interactive messages are defined as structured JSON.',
        code: `{
  "blocks": [
    {
      "type": "header",
      "text": { "type": "plain_text", "text": "Deploy complete" }
    },
    {
      "type": "section",
      "text": { "type": "mrkdwn", "text": "Version *2.4.0* is live on production." }
    },
    {
      "type": "actions",
      "elements": [
        {
          "type": "button",
          "text": { "type": "plain_text", "text": "View dashboard" },
          "url": "https://example.com/dashboard"
        }
      ]
    }
  ]
}`,
        language: 'json',
        variant: 'highlighted',
      },
    ],
    relatedTools: ['figma', 'github-actions'],
    createdAt: '2024-07-15T00:00:00.000Z',
    updatedAt: '2025-07-15T00:00:00.000Z',
  },
  {
    id: 'tool-base64-encoder-decoder',
    slug: 'base64-encoder-decoder',
    title: 'Base64 Encoder & Decoder',
    description:
      'Encode text to Base64 and decode Base64 back to text right in the browser. Supports UTF-8 characters, URL-safe (base64url) output, and automatic detection so you can paste data from either direction and get the result you expect.',
    shortDescription: 'Encode text to Base64 or decode Base64 to text instantly.',
    category: 'encoding',
    keywords: [
      'base64',
      'base64 encode',
      'base64 decode',
      'base64url',
      'utf-8',
      'binary to text',
      'data uri',
    ],
    tags: ['encoding', 'base64', 'converter', 'text'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is Base64 the same as encryption?',
        answer:
          'No. Base64 is an encoding scheme that makes data safe to transmit over text-only channels. Anyone can decode it, so it must never be used to protect secrets.',
      },
      {
        question: 'Why does decoded text sometimes contain garbage characters?',
        answer:
          'That usually happens when the original input was not UTF-8 text. Base64 can carry any binary data; decoding it as UTF-8 only makes sense when the original bytes were valid UTF-8.',
      },
      {
        question: 'What is base64url encoding?',
        answer:
          'base64url is the URL-safe variant used in JWTs and other web standards. It swaps + and / for - and _, and drops the trailing = padding so the result can appear safely in URLs.',
      },
    ],
    examples: [
      {
        title: 'Encode a string',
        description: 'Paste plain text and convert it to a Base64 string.',
        code: `Hello, World! -> SGVsbG8sIFdvcmxkIQ==`,
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Decode a JWT payload',
        description: 'Base64url payloads from JWTs decode to readable JSON.',
        code: `eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSJ9 -> {"sub":"1234567890","name":"Ada"}`,
        language: 'text',
      },
    ],
    relatedTools: ['url-encoder-decoder'],
    createdAt: '2025-06-10T00:00:00.000Z',
    updatedAt: '2025-06-10T00:00:00.000Z',
  },
  {
    id: 'tool-url-encoder-decoder',
    slug: 'url-encoder-decoder',
    title: 'URL Encoder & Decoder',
    description:
      'Percent-encode and decode URLs and query strings instantly. Handles UTF-8 characters, encodes every reserved and unsafe character correctly, and can be configured to preserve or encode existing percent sequences.',
    shortDescription: 'Percent-encode or decode URLs and query parameters instantly.',
    category: 'encoding',
    keywords: [
      'url encode',
      'url decode',
      'percent encoding',
      'query string',
      'uri encoder',
      'utf-8',
      'slugify',
    ],
    tags: ['encoding', 'url', 'converter', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Why are spaces encoded as %20 and not +?',
        answer:
          '%20 is the correct percent-encoding of a space anywhere in a URI. The + form is only a convention for application/x-www-form-urlencoded bodies, not for URL paths or fragments.',
      },
      {
        question: 'When does URL encoding matter?',
        answer:
          'Any time user input or dynamic values are embedded in URLs or query strings. Without encoding, characters like &, =, ?, and # break the URL structure or allow parameter injection.',
      },
      {
        question: 'Are existing %XX sequences double-encoded?',
        answer:
          'The encoder leaves valid percent sequences untouched by default, so already-encoded URLs pass through unchanged. Enable strict mode to encode every percent sign.',
      },
    ],
    examples: [
      {
        title: 'Encode a search query',
        description: 'User input must be encoded before it goes into a query string.',
        code: `search query with spaces -> search%20query%20with%20spaces`,
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Decode a tracking URL',
        description: 'Decode percent-encoded URLs back to readable form.',
        code: `https%3A%2F%2Fexample.com%2Fpath%3Fq%3D1 -> https://example.com/path?q=1`,
        language: 'text',
      },
    ],
    relatedTools: ['base64-encoder-decoder'],
    createdAt: '2025-06-10T00:00:00.000Z',
    updatedAt: '2025-06-10T00:00:00.000Z',
  },
  {
    id: 'tool-xml-formatter',
    slug: 'xml-formatter',
    title: 'XML Formatter',
    description:
      'Format and indent XML so it is readable at a glance. Handles attributes, nested elements, comments, and CDATA sections, with options for 2- or 4-space indentation and self-closing tag styles.',
    shortDescription: 'Pretty-print and indent XML for readability.',
    category: 'xml',
    keywords: [
      'xml formatter',
      'xml beautifier',
      'pretty print xml',
      'indent xml',
      'prettify xml',
      'xml tidy',
      'format xml online',
    ],
    tags: ['xml', 'formatter', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does formatting change the meaning of my XML?',
        answer:
          'No. Formatting only changes whitespace between tokens. The element tree, attribute values, and text content stay identical, so the formatted output parses to the same structure.',
      },
      {
        question: 'How does the tool choose between self-closing and explicit tags?',
        answer:
          'Empty elements are written as self-closing tags in the style you select. The option is a display preference — both forms carry the same meaning in XML.',
      },
      {
        question: 'Can it handle namespaces and attributes with special characters?',
        answer:
          'Yes. Namespace prefixes, quoted attribute values, and entities are preserved verbatim while whitespace between attributes is normalized to a single space.',
      },
    ],
    examples: [
      {
        title: 'Format a config file',
        description: 'Collapsed XML becomes readable with proper indentation.',
        code: `<config><app name="demo" env="prod"><port>8080</port><features><feature>https</feature></features></app></config>`,
        language: 'xml',
        variant: 'terminal',
      },
      {
        title: 'Normalize indentation',
        description: 'Mixed or missing indentation is normalized consistently.',
        code: `<users><user id="1"><name>Ada</name></user><user id="2"><name>Lin</name></user></users>`,
        language: 'xml',
      },
    ],
    relatedTools: ['xml-minifier', 'xml-validator', 'xml-to-json'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-xml-minifier',
    slug: 'xml-minifier',
    title: 'XML Minifier',
    description:
      'Strip comments and non-essential whitespace from XML to produce the smallest representation that carries the same data — ideal for embedding payloads or saving bandwidth.',
    shortDescription: 'Remove comments and whitespace to shrink XML.',
    category: 'xml',
    keywords: [
      'xml minifier',
      'minify xml',
      'compress xml',
      'strip whitespace xml',
      'remove comments xml',
      'xml size reducer',
    ],
    tags: ['xml', 'minifier', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What gets removed when XML is minified?',
        answer:
          'Comments, indentation, and whitespace between tokens are removed. Text content and attribute values are preserved exactly — that is where your data lives.',
      },
      {
        question: 'Will minified XML still pass a validator?',
        answer:
          'Yes. Minification keeps the document well-formed, so the output validates exactly like the original.',
      },
      {
        question: 'When should I minify XML?',
        answer:
          'When XML travels over the network — API payloads, config downloads, or file transfers — or when you need to embed a payload in a single line.',
      },
    ],
    examples: [
      {
        title: 'Shrink an API payload',
        description: 'A readable payload compresses to a single compact line.',
        code: `<config><app name="demo" env="prod"><port>8080</port></app></config>`,
        language: 'xml',
        variant: 'terminal',
      },
      {
        title: 'Strip comments before shipping',
        description: 'Developer comments disappear from the output.',
        code: `<!-- generated by build 4 --><version>1.2.3</version>`,
        language: 'xml',
      },
    ],
    relatedTools: ['xml-formatter', 'xml-validator'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-xml-validator',
    slug: 'xml-validator',
    title: 'XML Validator',
    description:
      'Check that your XML is well-formed and find exactly where it breaks. Every problem is reported with the line and column it happens at, so you can fix malformed documents fast.',
    shortDescription: 'Validate XML and locate parse errors by line and column.',
    category: 'xml',
    keywords: [
      'xml validator',
      'validate xml',
      'check xml syntax',
      'well-formed xml',
      'xml parse error',
      'find xml error',
    ],
    tags: ['xml', 'validator', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What does "well-formed" mean?',
        answer:
          'A document is well-formed when it follows XML syntax rules: one root element, every tag properly closed, attributes quoted, and no raw & or < in text. It does not check schema or document type rules.',
      },
      {
        question: 'Why is the error position useful?',
        answer:
          'The line and column point straight at the offending token, so you can jump to the problem instead of scanning the whole document by hand.',
      },
      {
        question: 'Does it validate against a DTD or XSD?',
        answer:
          'No. This validator checks well-formedness only. Schema validation against DTD, XSD, or RELAX NG is a separate step performed by a dedicated tool.',
      },
    ],
    examples: [
      {
        title: 'A valid document',
        description: 'Well-formed XML passes instantly.',
        code: `<?xml version="1.0" encoding="UTF-8"?><catalog><book id="1"><title>XML Guide</title></book></catalog>`,
        language: 'xml',
        variant: 'terminal',
      },
      {
        title: 'A missing closing tag',
        description: 'The mismatch is reported with its exact position.',
        code: `<catalog><book><title>Guide</title></catalog>`,
        language: 'xml',
      },
    ],
    relatedTools: ['xml-formatter', 'xml-to-json', 'xml-minifier'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-xml-to-json',
    slug: 'xml-to-json',
    title: 'XML to JSON Converter',
    description:
      'Convert XML documents into clean, predictable JSON. Text content becomes values, repeating elements become arrays, and attributes are stored under @-prefixed keys so the mapping is lossless and consistent.',
    shortDescription: 'Convert XML documents to JSON with a predictable mapping.',
    category: 'xml',
    keywords: [
      'xml to json',
      'convert xml to json',
      'xml converter',
      'parse xml to json',
      'xml json mapping',
    ],
    tags: ['xml', 'json', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are attributes converted?',
        answer:
          'Attributes become properties prefixed with @, for example @id and @href. The prefix keeps attributes from colliding with element children while staying readable.',
      },
      {
        question: 'What happens to repeated elements?',
        answer:
          'Repeated sibling elements become arrays, so no data is lost and the JSON structure stays consistent no matter how many children exist.',
      },
      {
        question: 'Is text content preserved when elements also have children?',
        answer:
          'Yes. Text is kept under the #text key when an element mixes text with child elements, otherwise it becomes the element value directly.',
      },
    ],
    examples: [
      {
        title: 'Convert a book catalog',
        description: 'Elements, attributes, and text map to predictable JSON.',
        code: `<catalog><book id="1"><title>XML Guide</title><price>29.99</price></book><book id="2"><title>JSON Deep Dive</title><price>39.99</price></book></catalog>`,
        language: 'xml',
        variant: 'terminal',
      },
      {
        title: 'Nested structures',
        description: 'Deeply nested XML stays nested in JSON.',
        code: `<a><b><c x="1">text</c></b></a>`,
        language: 'xml',
      },
    ],
    relatedTools: ['xml-formatter', 'xml-validator', 'json-to-yaml'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-csv-viewer',
    slug: 'csv-viewer',
    title: 'CSV Viewer',
    description:
      'Preview any CSV file as a clean table, detect the delimiter automatically, and see the parsed values without touching a spreadsheet app. Handles quoted fields and embedded newlines correctly.',
    shortDescription: 'Preview CSV files as a table with auto-delimiter detection.',
    category: 'csv',
    keywords: [
      'csv viewer',
      'preview csv',
      'csv table',
      'csv to table',
      'visualize csv',
      'csv parser preview',
    ],
    tags: ['csv', 'viewer', 'data'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which delimiters are supported?',
        answer:
          'Comma, semicolon, tab, and pipe are detected automatically from the header row. You can also override the detection and force a specific delimiter.',
      },
      {
        question: 'How are quoted fields handled?',
        answer:
          'Fields wrapped in double quotes — including values with embedded commas, quotes, or newlines — are parsed as a single cell, exactly like a spreadsheet would.',
      },
      {
        question: 'Can I copy the data elsewhere?',
        answer:
          'Yes. The raw CSV, the JSON representation, and the tab-separated values are one click away, so you can move the data into a spreadsheet or an API payload.',
      },
    ],
    examples: [
      {
        title: 'Preview a simple table',
        description: 'Headers become the table header row.',
        code: `name,email,active\nAda Lovelace,ada@example.com,true\nGrace Hopper,grace@example.com,true`,
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Quoted fields',
        description: 'Commas inside quotes stay in a single cell.',
        code: `title,author\n"Notes on X, vol. 2",Ada\n"The "Complete" Guide",Lin`,
        language: 'text',
      },
    ],
    relatedTools: ['csv-formatter', 'csv-to-json', 'json-to-csv'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-csv-to-json',
    slug: 'csv-to-json',
    title: 'CSV to JSON Converter',
    description:
      'Convert CSV data into JSON with one click. The header row becomes object keys, every row becomes an object, and you can choose between an array of objects and nested rows keyed by an ID column.',
    shortDescription: 'Convert CSV rows into JSON objects in the browser.',
    category: 'csv',
    keywords: [
      'csv to json',
      'convert csv to json',
      'csv parser',
      'parse csv',
      'csv json converter',
      'import csv',
    ],
    tags: ['csv', 'json', 'converter', 'data'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are header names mapped to keys?',
        answer:
          'The first row becomes the key list. Duplicate headers get numeric suffixes and empty headers are filled with column_1-style names so the output is always valid JSON.',
      },
      {
        question: 'What if a row has fewer values than the header?',
        answer:
          'Missing values are set to an empty string. Extra values beyond the header count are skipped with a warning so you never lose track of the data shape.',
      },
      {
        question: 'Can numbers and booleans stay typed?',
        answer:
          'Yes, when "keep types" is on. Numeric-looking strings become numbers, and true/false become booleans; otherwise every value stays a string.',
      },
    ],
    examples: [
      {
        title: 'Array of objects',
        description: 'The standard mapping from CSV rows to objects.',
        code: `name,role\nAda,engineer\nLin,designer`,
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Rows keyed by ID',
        description: 'Nest objects under a chosen ID column.',
        code: `id,name,role\n1,Ada,engineer\n2,Lin,designer`,
        language: 'text',
      },
    ],
    relatedTools: ['json-to-csv', 'csv-viewer', 'csv-formatter'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-json-to-csv',
    slug: 'json-to-csv',
    title: 'JSON to CSV Converter',
    description:
      'Turn a JSON array of objects into a ready-to-open CSV file. Columns are built from the union of all keys, arrays become quoted lists, and empty values are handled cleanly.',
    shortDescription: 'Convert a JSON array into a CSV spreadsheet file.',
    category: 'csv',
    keywords: [
      'json to csv',
      'convert json to csv',
      'json converter',
      'export csv',
      'json array to csv',
    ],
    tags: ['json', 'csv', 'converter', 'data'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What JSON shapes are accepted?',
        answer:
          'An array of flat objects is the ideal input. Each key becomes a column and each object becomes a row. Objects with nested values are converted per option.',
      },
      {
        question: 'How are nested objects handled?',
        answer:
          'By default, nested values are serialized as compact JSON inside the cell. You can also flatten keys with dot notation, like address.city.',
      },
      {
        question: 'What about arrays inside objects?',
        answer:
          'Arrays are joined into a single cell as a quoted, comma-separated list so the rest of the row stays aligned.',
      },
    ],
    examples: [
      {
        title: 'Users to CSV',
        description: 'An array of objects becomes a spreadsheet.',
        code: `[{"name":"Ada","role":"engineer","active":true},{"name":"Lin","role":"designer","active":false}]`,
        language: 'json',
        variant: 'terminal',
      },
      {
        title: 'Missing keys',
        description: 'Rows with missing keys export with empty cells.',
        code: `[{"name":"Ada","role":"engineer"},{"name":"Lin"}]`,
        language: 'json',
      },
    ],
    relatedTools: ['csv-to-json', 'csv-viewer', 'json-to-yaml'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-csv-formatter',
    slug: 'csv-formatter',
    title: 'CSV Formatter',
    description:
      'Normalize messy CSV in seconds: detect the real delimiter, strip stray quotes, pad ragged rows, and re-emit clean, consistent CSV with a line-numbered diff so you can see exactly what changed.',
    shortDescription: 'Clean and normalize messy CSV data quickly.',
    category: 'csv',
    keywords: [
      'csv formatter',
      'clean csv',
      'fix csv',
      'csv normalizer',
      'tidy csv',
      'csv delimiter fix',
    ],
    tags: ['csv', 'formatter', 'data'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What problems does it fix?',
        answer:
          'Stray quotes that confuse parsers, rows with more or fewer columns than the header, inconsistent delimiters, and missing trailing commas.',
      },
      {
        question: 'How do I know what changed?',
        answer:
          'The output is paired with a line-by-line summary showing how many columns each row had before and after, so surprises are easy to spot.',
      },
      {
        question: 'Is the data quoted consistently?',
        answer:
          'Yes. Values containing the delimiter, quotes, or newlines are wrapped in double quotes with embedded quotes doubled, matching standard CSV escaping.',
      },
    ],
    examples: [
      {
        title: 'Clean ragged rows',
        description: 'Rows missing columns are padded to match the header.',
        code: `name,email,active\nAda,ada@example.com\nGrace,grace@example.com,true,extra`,
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Remove stray quotes',
        description: 'Misplaced quotes are stripped and re-quoted properly.',
        code: `title,"author"\n"Notes "on" XML",Ada`,
        language: 'text',
      },
    ],
    relatedTools: ['csv-viewer', 'csv-to-json', 'json-to-csv'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-yaml-formatter',
    slug: 'yaml-formatter',
    title: 'YAML Formatter',
    description:
      'Pretty-print YAML with consistent indentation, canonical key quoting, and clean block style. Re-indent any messy config file and get predictable output every time.',
    shortDescription: 'Re-indent and normalize YAML configuration files.',
    category: 'yaml',
    keywords: [
      'yaml formatter',
      'pretty print yaml',
      'indent yaml',
      'yaml beautifier',
      'normalize yaml',
      'yaml tidy',
    ],
    tags: ['yaml', 'formatter', 'config'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What does YAML formatting normalize?',
        answer:
          'Indentation is unified to 2 or 4 spaces, flow-style collections can be expanded to block style, and keys that need quotes are quoted consistently.',
      },
      {
        question: 'Are comments preserved?',
        answer:
          'Yes. Comments are carried through formatting, including block scalars like |- and > styles which are kept intact.',
      },
      {
        question: 'Does formatting change the parsed value?',
        answer:
          'No. The formatter parses the document and re-emits it, so the resulting YAML resolves to the exact same structure.',
      },
    ],
    examples: [
      {
        title: 'Compact to readable',
        description: 'Inline collections expand to indented block style.',
        code: `services: { api: { port: 8080, workers: 4 }, web: { port: 3000 } }`,
        language: 'yaml',
        variant: 'terminal',
      },
      {
        title: 'Normalize indentation',
        description: 'Inconsistent indentation is made uniform.',
        code: `name: demo\n  env: prod\nfeatures:\n - https\n - cache`,
        language: 'yaml',
      },
    ],
    relatedTools: ['yaml-validator', 'yaml-to-json', 'json-to-yaml'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-yaml-validator',
    slug: 'yaml-validator',
    title: 'YAML Validator',
    description:
      'Check YAML syntax before a config file breaks your build. Errors carry the exact line and column, so a missing space or a tab slip is found in seconds.',
    shortDescription: 'Validate YAML syntax with precise error locations.',
    category: 'yaml',
    keywords: [
      'yaml validator',
      'validate yaml',
      'check yaml syntax',
      'yaml parse error',
      'yaml lint',
      'yaml check online',
    ],
    tags: ['yaml', 'validator', 'config'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Why does YAML reject tabs?',
        answer:
          'Tabs are not allowed for indentation in YAML — only spaces are. The parser flags them with their exact line and column so they are trivial to fix.',
      },
      {
        question: 'What YAML features are supported?',
        answer:
          'Maps, sequences, flow style, quoted strings, comments, and block scalars are all supported. Anchors, aliases, and multi-document streams are not.',
      },
      {
        question: 'Does valid syntax mean valid configuration?',
        answer:
          'Not necessarily. The validator checks syntax, not schema. A syntactically perfect config can still be missing a required key your application expects.',
      },
    ],
    examples: [
      {
        title: 'A valid config',
        description: 'Well-formed YAML passes instantly.',
        code: `app:\n  name: demo\n  env: prod\n  ports:\n    - 8080\n    - 9090`,
        language: 'yaml',
        variant: 'terminal',
      },
      {
        title: 'A tab slip',
        description: 'Tabs in indentation are reported with position.',
        code: `app:\n\tname: demo\n  env: prod`,
        language: 'yaml',
      },
    ],
    relatedTools: ['yaml-formatter', 'yaml-to-json', 'json-to-yaml'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-yaml-to-json',
    slug: 'yaml-to-json',
    title: 'YAML to JSON Converter',
    description:
      'Convert YAML config into JSON for APIs, CLI tools, and dashboards. The output is validated JSON with correct types — numbers stay numbers and booleans stay booleans.',
    shortDescription: 'Convert YAML documents to valid JSON in the browser.',
    category: 'yaml',
    keywords: [
      'yaml to json',
      'convert yaml to json',
      'yaml converter',
      'yaml json',
      'config to json',
    ],
    tags: ['yaml', 'json', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Are YAML types preserved?',
        answer:
          'Yes. Integers, floats, booleans, nulls, and strings resolve to their JSON equivalents, so the output is type-correct, not quoted text.',
      },
      {
        question: 'Can indentation be adjusted?',
        answer:
          'The JSON output can be indented with 2 or 4 spaces, or minimized to a single line for embedding in a payload.',
      },
      {
        question: 'What if the YAML has anchors or multi-document syntax?',
        answer:
          'Those advanced features are not supported. A clear error names the unsupported construct and its line so you know what to adjust.',
      },
    ],
    examples: [
      {
        title: 'Config to JSON',
        description: 'A nested YAML config becomes an object.',
        code: `app:\n  name: demo\n  env: prod\n  ports:\n    - 8080\n    - 9090`,
        language: 'yaml',
        variant: 'terminal',
      },
      {
        title: 'Type preservation',
        description: 'Numbers, booleans, and nulls stay typed.',
        code: `count: 42\nenabled: true\nnotes: null`,
        language: 'yaml',
      },
    ],
    relatedTools: ['json-to-yaml', 'yaml-formatter', 'yaml-validator'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-json-to-yaml',
    slug: 'json-to-yaml',
    title: 'JSON to YAML Converter',
    description:
      'Convert JSON — pasted or from any API — into clean YAML config. Keys are quoted only when needed, strings that look like numbers or booleans are quoted to survive the round-trip, and output can be indented to taste.',
    shortDescription: 'Convert JSON objects to YAML configuration files.',
    category: 'yaml',
    keywords: [
      'json to yaml',
      'convert json to yaml',
      'json converter',
      'json yaml',
      'generate yaml config',
    ],
    tags: ['json', 'yaml', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Are keys always quoted?',
        answer:
          'Only when necessary. Plain keys are emitted unquoted for readability; keys with special characters or that would parse as another type are quoted.',
      },
      {
        question: 'How are tricky string values handled?',
        answer:
          'Strings that look like numbers, booleans, or nulls are quoted so re-parsing the YAML returns the same string, not a converted value.',
      },
      {
        question: 'Can the output be used as a config file?',
        answer:
          'Yes. The output is standard YAML, ready to paste into CI pipelines, Docker Compose, or any YAML-based config.',
      },
    ],
    examples: [
      {
        title: 'API response to config',
        description: 'A JSON object becomes a readable YAML file.',
        code: `{"name":"demo","env":"prod","ports":[8080,9090]}`,
        language: 'json',
        variant: 'terminal',
      },
      {
        title: 'Tricky strings',
        description: 'String values that look like types stay quoted.',
        code: `{"version":"1.2","is_enabled":"false","note":"123"}`,
        language: 'json',
      },
    ],
    relatedTools: ['yaml-to-json', 'yaml-formatter', 'json-to-csv'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-markdown-preview',
    slug: 'markdown-preview',
    title: 'Markdown Preview',
    description:
      'Write Markdown on one side and watch it render on the other. Headings, lists, tables, code blocks, and blockquotes update live, with raw HTML neutralized so nothing unsafe runs in the preview.',
    shortDescription: 'Live Markdown editor with an instant rendered preview.',
    category: 'markdown',
    keywords: [
      'markdown preview',
      'render markdown',
      'markdown live preview',
      'md preview',
      'markdown editor',
      'write markdown online',
    ],
    tags: ['markdown', 'preview', 'docs'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is my Markdown processed safely?',
        answer:
          'Yes. Raw HTML in your Markdown is escaped rather than executed, and link URLs are checked against unsafe protocols, so the preview cannot run scripts.',
      },
      {
        question: 'Which Markdown features are supported?',
        answer:
          'Headings, emphasis, links, images, code blocks with language hints, inline code, blockquotes, ordered and unordered lists, tables, and horizontal rules.',
      },
      {
        question: 'Can I copy the rendered HTML?',
        answer:
          'Yes. A single click copies the generated HTML, so you can reuse it in emails, docs, or static pages.',
      },
    ],
    examples: [
      {
        title: 'A quick demo',
        description: 'The classic Markdown quick-start.',
        code: `# Hello\n\nWrite **Markdown** on the left\nand see it rendered on the right.\n\n- Lists render instantly\n- So do [links](https://example.com)\n\n| Tool | Status |\n| ---- | ------ |\n| Preview | Live |`,
        language: 'markdown',
        variant: 'terminal',
      },
      {
        title: 'Code blocks',
        description: 'Fenced code blocks render with language hints.',
        code: '```js\nconsole.log("hello");\n```',
        language: 'markdown',
      },
    ],
    relatedTools: ['markdown-to-html', 'markdown-formatter', 'html-to-markdown'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-markdown-to-html',
    slug: 'markdown-to-html',
    title: 'Markdown to HTML Converter',
    description:
      'Convert Markdown to clean, safe HTML with proper tag structure. Works with GitHub-style Markdown — tables, task lists, and fenced code — and outputs copy-ready HTML.',
    shortDescription: 'Convert Markdown into clean, safe HTML markup.',
    category: 'markdown',
    keywords: [
      'markdown to html',
      'convert markdown',
      'md to html',
      'markdown converter',
      'markdown html generator',
    ],
    tags: ['markdown', 'html', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What Markdown dialect is supported?',
        answer:
          'GitHub-flavored Markdown: tables, task lists, fenced code blocks, strikethrough, and autolinks are all supported alongside standard syntax.',
      },
      {
        question: 'Is the HTML output safe to embed?',
        answer:
          'Raw HTML inside your Markdown is escaped to text, and URLs are checked for unsafe protocols. The output is safe to embed anywhere.',
      },
      {
        question: 'Can I adjust the indentation of the output?',
        answer:
          'Yes, HTML is emitted with 2- or 4-space indentation, or compact without extra whitespace for embedding in templates.',
      },
    ],
    examples: [
      {
        title: 'A heading and a list',
        description: 'Common constructs convert to tidy markup.',
        code: `# Hello\n\n- one\n- two`,
        language: 'markdown',
        variant: 'terminal',
      },
      {
        title: 'Fenced code',
        description: 'Code blocks keep their language class.',
        code: '```js\nconst answer = 42;\n```',
        language: 'markdown',
      },
    ],
    relatedTools: ['markdown-preview', 'html-to-markdown', 'markdown-formatter'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-html-to-markdown',
    slug: 'html-to-markdown',
    title: 'HTML to Markdown Converter',
    description:
      'Paste HTML from any page and get clean Markdown back — headings, lists, links, images, tables, and code blocks convert automatically with source attributes preserved.',
    shortDescription: 'Convert pasted HTML into clean Markdown documents.',
    category: 'markdown',
    keywords: [
      'html to markdown',
      'convert html',
      'html to md',
      'copy as markdown',
      'html converter',
    ],
    tags: ['html', 'markdown', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What HTML elements are supported?',
        answer:
          'Headings, paragraphs, lists, links, images, tables, blockquotes, code blocks, and horizontal rules convert to their Markdown equivalents.',
      },
      {
        question: 'What happens to unsupported elements?',
        answer:
          'Inline elements like <b> and <i> are converted to emphasis, while unsupported containers fall back to their text content so nothing is lost.',
      },
      {
        question: 'How are tables converted?',
        answer:
          'Tables become GitHub-flavored Markdown tables with header alignment preserved, ready to paste anywhere.',
      },
    ],
    examples: [
      {
        title: 'Paste from a page',
        description: 'A fragment of HTML converts to readable Markdown.',
        code: `<h1>Guide</h1><p>Read the <a href="https://example.com">docs</a>.</p><ul><li>One</li><li>Two</li></ul>`,
        language: 'html',
        variant: 'terminal',
      },
      {
        title: 'A simple table',
        description: 'HTML tables become Markdown tables.',
        code: `<table><tr><th>Tool</th><th>Status</th></tr><tr><td>Converter</td><td>Ready</td></tr></table>`,
        language: 'html',
      },
    ],
    relatedTools: ['markdown-to-html', 'markdown-preview'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-markdown-formatter',
    slug: 'markdown-formatter',
    title: 'Markdown Formatter',
    description:
      'Tidy Markdown documents automatically: consistent list markers, sequential list numbers, one blank line around headings and code fences, and no trailing whitespace.',
    shortDescription: 'Clean up Markdown formatting and list numbering.',
    category: 'markdown',
    keywords: [
      'markdown formatter',
      'tidy markdown',
      'clean markdown',
      'markdown linter',
      'fix list markers',
      'md formatter',
    ],
    tags: ['markdown', 'formatter', 'docs'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What exactly is normalized?',
        answer:
          'Unordered lists are unified to one marker style, ordered lists are renumbered sequentially, heading spacing is normalized, and trailing whitespace is removed.',
      },
      {
        question: 'Does it change inline formatting?',
        answer:
          'No. Inline emphasis, links, and code are left untouched — only structural and whitespace issues are normalized.',
      },
      {
        question: 'Is fenced code preserved?',
        answer:
          'Yes. Fenced code blocks are kept intact, including their language tags, and the blank-line separation around them is made consistent.',
      },
    ],
    examples: [
      {
        title: 'Mixed list markers',
        description: 'Bullets are unified to a single style.',
        code: `- one\n* two\n+ three`,
        language: 'markdown',
        variant: 'terminal',
      },
      {
        title: 'Renumber an ordered list',
        description: 'Manual numbers become a clean sequence.',
        code: `1. first\n3. second\n9. third`,
        language: 'markdown',
      },
    ],
    relatedTools: ['markdown-preview', 'markdown-to-html'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-sql-formatter',
    slug: 'sql-formatter',
    title: 'SQL Formatter',
    description:
      'Beautify any SQL statement with consistent keyword casing, clause-aware indentation, and readable operator layout. SELECT, JOIN, WHERE, GROUP BY, and CASE blocks all line up the way you expect.',
    shortDescription: 'Format SQL with consistent casing and indentation.',
    category: 'sql',
    keywords: [
      'sql formatter',
      'beautify sql',
      'pretty print sql',
      'sql beautifier',
      'format query',
      'sql indent',
    ],
    tags: ['sql', 'formatter', 'database'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which SQL dialects are supported?',
        answer:
          'The formatter is dialect-agnostic. Standard keywords across MySQL, PostgreSQL, SQLite, and SQL Server are recognized; unknown keywords simply keep their shape.',
      },
      {
        question: 'How are comments handled?',
        answer:
          'Line comments (--) and block comments (/* */) are preserved and indented with their surrounding statement.',
      },
      {
        question: 'Can keyword casing be controlled?',
        answer:
          'Yes. Keywords can be emitted in UPPERCASE, lowercase, or left as-is, and indentation can be 2 or 4 spaces.',
      },
    ],
    examples: [
      {
        title: 'Format a query',
        description: 'A collapsed query becomes readable.',
        code: `select u.id, u.name, count(o.id) as orders from users u left join orders o on o.user_id = u.id where u.active = true group by u.id, u.name having count(o.id) > 5 order by orders desc limit 10;`,
        language: 'sql',
        variant: 'terminal',
      },
      {
        title: 'CASE expressions',
        description: 'CASE blocks get their own indentation level.',
        code: `select name, case when score >= 90 then 'A' when score >= 80 then 'B' else 'C' end as grade from students;`,
        language: 'sql',
      },
    ],
    relatedTools: ['sql-minifier', 'sql-validator'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-sql-minifier',
    slug: 'sql-minifier',
    title: 'SQL Minifier',
    description:
      'Strip comments and collapse whitespace to produce the smallest SQL that runs the same — perfect for shipping migrations or queries over constrained payloads.',
    shortDescription: 'Minify SQL by stripping comments and whitespace.',
    category: 'sql',
    keywords: [
      'sql minifier',
      'minify sql',
      'compress sql',
      'remove sql comments',
      'sql size reducer',
    ],
    tags: ['sql', 'minifier', 'database'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is removed during minification?',
        answer:
          'Line and block comments, indentation, and all non-essential whitespace. String literals and identifiers are preserved exactly.',
      },
      {
        question: 'Does minification change query results?',
        answer:
          'No. Minified SQL executes identically — it only removes tokens that do not affect evaluation.',
      },
      {
        question: 'When should I use it?',
        answer:
          'When storing queries in config or code, sending them over the wire, or fitting them into tight payload limits.',
      },
    ],
    examples: [
      {
        title: 'A compact query',
        description: 'Comments and whitespace disappear.',
        code: `-- fetch active users\nselect u.id, u.name from users u where u.active = true;`,
        language: 'sql',
        variant: 'terminal',
      },
      {
        title: 'Config-ready output',
        description: 'Minified SQL fits in a single line.',
        code: `select count(*) from orders where status = 'paid' and created_at > now();`,
        language: 'sql',
      },
    ],
    relatedTools: ['sql-formatter', 'sql-validator'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-sql-validator',
    slug: 'sql-validator',
    title: 'SQL Validator',
    description:
      'Catch the structural errors that break queries before they hit the database: unclosed string literals, mismatched parentheses, unterminated comments, and statements that start nowhere.',
    shortDescription: 'Validate SQL for structural syntax errors.',
    category: 'sql',
    keywords: [
      'sql validator',
      'check sql syntax',
      'validate query',
      'sql syntax check',
      'find sql error',
    ],
    tags: ['sql', 'validator', 'database'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What can this validator detect?',
        answer:
          'Structural problems: unbalanced parentheses, unclosed string literals, unterminated block comments, and empty or unparseable statements.',
      },
      {
        question: 'Does it validate against a schema?',
        answer:
          'No. Schema-aware validation requires table metadata and is performed by your database. This tool checks the syntax shape of the statement itself.',
      },
      {
        question: 'Is a passing check a guarantee?',
        answer:
          'No validator can prove a query is correct — it only proves the statement is structurally sound. Semantic errors like unknown columns still surface in the database.',
      },
    ],
    examples: [
      {
        title: 'A healthy query',
        description: 'Well-formed SQL validates instantly.',
        code: `select id, name from users where active = true order by name;`,
        language: 'sql',
        variant: 'terminal',
      },
      {
        title: 'Unclosed string',
        description: 'The dangling quote is reported with its position.',
        code: `select * from orders where status = 'paid;`,
        language: 'sql',
      },
    ],
    relatedTools: ['sql-formatter', 'sql-minifier'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-regex-tester',
    slug: 'regex-tester',
    title: 'Regex Tester',
    description:
      'Test regular expressions live against any text with match highlighting, capture-group extraction, and performance timing. Toggle flags like i, m, and s with one click.',
    shortDescription: 'Test regex patterns live with match highlighting.',
    category: 'regex',
    keywords: [
      'regex tester',
      'regexp tester',
      'regular expression tester',
      'test regex online',
      'regex playground',
      'regex match test',
    ],
    tags: ['regex', 'tester', 'dev'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What regex syntax is supported?',
        answer:
          'JavaScript-flavored regular expressions, including lookaheads, named groups, backreferences, and Unicode escapes with the u flag.',
      },
      {
        question: 'What do the flags do?',
        answer:
          'g finds all matches, i ignores case, m makes ^ and $ match line boundaries, s makes . match newlines, u enables full Unicode, and y makes matching sticky.',
      },
      {
        question: 'Why does the match count show a +?',
        answer:
          'For performance, at most 5,000 matches are collected. A + suffix means there are more matches than shown.',
      },
    ],
    examples: [
      {
        title: 'Extract emails',
        description: 'Find every address in a block of text.',
        code: 'Pattern: \\b\\w+@\\w+\\.\\w+\\b\nText: Contact ada@example.com or lin@example.org today.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Capture groups',
        description: 'Groups are listed per match in the results table.',
        code: 'Pattern: (\\d{4})-(\\d{2})-(\\d{2})\nText: Deadline 2026-08-08, then 2027-01-01.',
        language: 'text',
      },
    ],
    relatedTools: ['regex-generator', 'regex-cheatsheet', 'base64-encoder-decoder'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-regex-generator',
    slug: 'regex-generator',
    title: 'Regex Literal Generator',
    description:
      'Escape every special character in a string so it can be matched literally. Feed it a user-supplied search term or file path and get a safe pattern that cannot be misread as syntax.',
    shortDescription: 'Escape text into a literal-matching regex pattern.',
    category: 'regex',
    keywords: [
      'regex generator',
      'escape regex',
      'regex literal',
      'escape special characters',
      'quote regex',
      'regex escape tool',
    ],
    tags: ['regex', 'generator', 'dev'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which characters are escaped?',
        answer:
          'Every regex meta character: . * + ? ^ $ { } ( ) | [ ] and backslash itself. The result matches the input as literal text only.',
      },
      {
        question: 'Why escape user input?',
        answer:
          'Untrusted input can contain syntax characters. Escaping guarantees the pattern matches exactly what the user typed instead of interpreting it as a pattern.',
      },
      {
        question: 'How do I use the output?',
        answer:
          'Paste the escaped pattern between / / delimiters in code or drop it into the Regex Tester to verify it against real text.',
      },
    ],
    examples: [
      {
        title: 'Escape a Windows path',
        description: 'Backslashes and brackets become literal.',
        code: 'C:\\temp\\file[1].txt -> C:\\\\temp\\\\file\\[1\\]\\.txt',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Escape a price',
        description: 'Dots and dollar signs stop being meta characters.',
        code: '$99.99 -> \\$99\\.99',
        language: 'text',
      },
    ],
    relatedTools: ['regex-tester', 'regex-cheatsheet'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-regex-cheatsheet',
    slug: 'regex-cheatsheet',
    title: 'Regex Cheatsheet',
    description:
      'A complete quick reference for regular expressions: anchors, character classes, quantifiers, groups, escape sequences, flags, and battle-tested patterns for emails, dates, and IPs — all copyable.',
    shortDescription: 'Quick reference for regex syntax and common patterns.',
    category: 'regex',
    keywords: [
      'regex cheatsheet',
      'regex reference',
      'regular expression guide',
      'regex patterns',
      'regex quick reference',
      'regex syntax',
    ],
    tags: ['regex', 'reference', 'docs'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is this the full regex language?',
        answer:
          'This covers the JavaScript regex flavor — the same syntax used in most modern runtimes and tools. Advanced features are called out where they differ.',
      },
      {
        question: 'Can I copy patterns directly?',
        answer:
          'Yes. Every pattern has a one-click copy button, and the common patterns section is designed to paste straight into the Regex Tester.',
      },
      {
        question: 'What does "lazy" mean in quantifiers?',
        answer:
          'Lazy quantifiers like a+? match as few characters as possible, while greedy ones match as many. This matters for patterns like HTML tag matching.',
      },
    ],
    examples: [
      {
        title: 'Extract ISO dates',
        description: 'The classic date pattern in action.',
        code: '\\d{4}-\\d{2}-\\d{2} matches 2026-08-08',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Hex colors',
        description: 'Match CSS-style hex color codes.',
        code: '#[0-9a-fA-F]{6} matches #ff00aa',
        language: 'text',
      },
    ],
    relatedTools: ['regex-tester', 'regex-generator'],
    createdAt: '2025-07-20T00:00:00.000Z',
    updatedAt: '2025-07-20T00:00:00.000Z',
  },
  {
    id: 'tool-ip-lookup',
    slug: 'ip-lookup',
    title: 'IP Lookup',
    description:
      'Look up your public IP address or any IP address on demand, with details like location, ISP, timezone, and whether it is a proxy or VPN.',
    shortDescription: 'Find your public IP and get geolocation details.',
    category: 'network',
    keywords: [
      'ip lookup',
      'ip address',
      'geolocation',
      'what is my ip',
      'public ip',
      'ipv4',
      'ipv6',
    ],
    tags: ['network', 'ip', 'lookup', 'geolocation'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How does IP lookup work?',
        answer:
          'The tool asks the ipify API for your public IP on demand, then asks ip-api.com for the location and network details. Both requests happen only when you click the lookup button — nothing is sent automatically.',
      },
      {
        question: 'Can I look up any IP address?',
        answer:
          'Yes. Type any public IPv4 or IPv6 address to see its country, region, city, ISP, and coordinates. The results come from the free ip-api.com service, which is accurate for most public addresses.',
      },
      {
        question: 'Why does the site show my location?',
        answer:
          "Geolocation pinpoints the IP's registered location, which is usually the ISP's network hub rather than your exact street address. It gives a city-level estimate in most cases.",
      },
    ],
    examples: [
      {
        title: 'Find your public IP',
        description: 'One click reveals the IP your devices use to reach the internet.',
        code: 'Click "Look up my IP" → see your IP, location, ISP, and timezone.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Inspect a specific address',
        description: 'Look up any public IP to identify its location and provider.',
        code: 'Enter 8.8.8.8 → Google LLC, Mountain View, US (US timezone).',
        language: 'text',
      },
    ],
    relatedTools: ['dns-lookup', 'cidr-calculator', 'user-agent-parser'],
    seo: {
      title: 'IP Lookup — Find Your Public IP & Location',
      description:
        'Look up any public IP address and see its location, ISP, timezone, and proxy status. Find your own public IP with one click.',
      keywords: ['ip lookup', 'what is my ip', 'ip geolocation', 'public ip address'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-cidr-calculator',
    slug: 'cidr-calculator',
    title: 'CIDR Calculator',
    description:
      'Split any IPv4 or IPv6 CIDR range into its network address, broadcast address, usable hosts, and subnet mask.',
    shortDescription: 'Calculate network, broadcast, and host ranges from CIDR notation.',
    category: 'network',
    keywords: ['cidr', 'subnet', 'netmask', 'ipv4 subnet', 'ipv6 subnet', 'subnet calculator'],
    tags: ['network', 'cidr', 'subnet', 'networking'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What does the /24 in 192.168.1.0/24 mean?',
        answer:
          'The number after the slash is the prefix length: how many leading bits of the address belong to the network. /24 means the first 24 bits are the network, leaving 8 bits for hosts.',
      },
      {
        question: 'Why does /31 only show 2 addresses?',
        answer:
          'Point-to-point links like /31 (and /32) do not need separate network and broadcast addresses, so every address in the range is usable. Larger prefixes reserve the first and last addresses.',
      },
      {
        question: 'Does this support IPv6?',
        answer:
          'Yes. Enter IPv6 CIDR ranges like 2001:db8::/32 to see the network address and the number of possible addresses (shown as 2^n).',
      },
    ],
    examples: [
      {
        title: 'IPv4 subnet breakdown',
        description: 'A typical home router range.',
        code: '192.168.1.0/24 → network 192.168.1.0, broadcast 192.168.1.255, 254 usable hosts.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Point-to-point link',
        description: 'A /31 has no broadcast overhead.',
        code: '10.0.0.0/31 → hosts 10.0.0.0 and 10.0.0.1 (2 addresses).',
        language: 'text',
      },
    ],
    relatedTools: ['ip-lookup', 'number-base-converter'],
    seo: {
      title: 'CIDR Calculator — Subnet, Network & Broadcast Calculator',
      description:
        'Calculate network address, broadcast address, subnet mask, and usable host ranges from any IPv4 or IPv6 CIDR notation.',
      keywords: ['cidr calculator', 'subnet calculator', 'netmask', 'ipv6 subnet'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-dns-lookup',
    slug: 'dns-lookup',
    title: 'DNS Lookup',
    description:
      'Query DNS records for any domain — A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, and CAA — using encrypted DNS-over-HTTPS.',
    shortDescription: 'Resolve DNS records for any domain name.',
    category: 'network',
    keywords: [
      'dns lookup',
      'dns records',
      'a record',
      'mx record',
      'txt record',
      'dns-over-https',
    ],
    tags: ['network', 'dns', 'lookup', 'records'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are queries sent?',
        answer:
          "All lookups go to Cloudflare's public resolver (cloudflare-dns.com) over DNS-over-HTTPS, so your queries are encrypted in transit. Each query is cancelled after 8 seconds if it does not respond.",
      },
      {
        question: 'What record types can I check?',
        answer:
          'A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, and CAA records are supported. Pick a type, or leave "Any" selected to fetch every supported record in one pass.',
      },
      {
        question: 'Why would MX or TXT records matter?',
        answer:
          'MX records tell mail servers where to deliver email, and TXT records hold SPF, DKIM, and verification data. Checking them is a fast way to debug email and domain ownership issues.',
      },
    ],
    examples: [
      {
        title: 'Resolve a domain',
        description: 'Fetch every supported record for a domain at once.',
        code: 'Enter example.com, select Any → A, AAAA, NS, MX, TXT, SOA records.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Check email routing',
        description: 'Verify where a domain routes mail.',
        code: 'Type example.com and pick MX → mail.example.com with preference 10.',
        language: 'text',
      },
    ],
    relatedTools: ['ip-lookup', 'url-parser'],
    seo: {
      title: 'DNS Lookup — Query A, MX, TXT & More Records',
      description:
        'Look up DNS records for any domain over encrypted DNS-over-HTTPS: A, AAAA, CNAME, MX, TXT, NS, SOA, SRV, and CAA records.',
      keywords: ['dns lookup', 'dns records', 'mx lookup', 'dns-over-https'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-user-agent-parser',
    slug: 'user-agent-parser',
    title: 'User-Agent Parser',
    description:
      'Paste any user-agent string to identify the browser, operating system, and device type behind it.',
    shortDescription: 'Identify browser, OS, and device from a user-agent string.',
    category: 'network',
    keywords: [
      'user agent parser',
      'user agent',
      'browser detection',
      'parse ua',
      'device detection',
    ],
    tags: ['network', 'user agent', 'parser', 'browser'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is a user-agent string?',
        answer:
          'Every browser sends a user-agent header with each request describing itself — browser name and version, operating system, and often the device type. Websites use it to tailor responses.',
      },
      {
        question: 'Why does my user agent look so complicated?',
        answer:
          'Modern user agents include compatibility tokens (like "Chrome" in Firefox or Safari strings) for legacy sites. The parser extracts the primary browser and ignores those tokens.',
      },
      {
        question: 'Does this tool store my user agent?',
        answer:
          'No. Parsing happens entirely in your browser — the string never leaves your device.',
      },
    ],
    examples: [
      {
        title: 'Chrome on Windows',
        description: 'A typical Chrome desktop user agent.',
        code: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) → Chrome 126, Windows 10.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Safari on iPhone',
        description: 'A mobile Safari user agent.',
        code: 'Mozilla/5.0 (iPhone; CPU iPhone OS 17_5) → Safari 17, iOS 17.5, mobile.',
        language: 'text',
      },
    ],
    relatedTools: ['ip-lookup', 'dns-lookup', 'url-parser'],
    seo: {
      title: 'User-Agent Parser — Browser & Device Detection',
      description:
        'Paste any user-agent string to instantly identify the browser, version, operating system, and device type. Parsing happens locally in your browser.',
      keywords: ['user agent parser', 'browser detection', 'parse user agent', 'ua parser'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-timestamp-converter',
    slug: 'timestamp-converter',
    title: 'Timestamp Converter',
    description:
      'Convert Unix timestamps (seconds or milliseconds) to human-readable dates and back, with live "now" values and ISO-8601 support.',
    shortDescription: 'Convert Unix timestamps to dates and back again.',
    category: 'date-time',
    keywords: [
      'timestamp converter',
      'epoch timestamp',
      'ms to date',
      'date to timestamp',
      'iso 8601',
    ],
    tags: ['date', 'time', 'timestamp', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is my timestamp in seconds or milliseconds?',
        answer:
          'Timestamps up to roughly 3.2 billion (year 2070) are treated as seconds; larger values are treated as milliseconds. You can also switch the unit manually if auto-detection picks wrong.',
      },
      {
        question: 'What is the Unix epoch?',
        answer:
          'The Unix epoch is 1970-01-01T00:00:00Z. A timestamp counts the seconds (or milliseconds) that have elapsed since that instant, ignoring leap seconds.',
      },
      {
        question: 'Why do I see a warning about my browser timezone?',
        answer:
          'Dates are displayed both in your local timezone and in UTC. If you expected UTC and your browser is in another zone, use the UTC column.',
      },
    ],
    examples: [
      {
        title: 'Convert a timestamp to a date',
        description: 'Decode any epoch value.',
        code: '1723089600 → 2024-08-08 04:00:00 UTC.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Convert a date to a timestamp',
        description: 'Encode a date for an API call.',
        code: '2024-08-08T04:00:00Z → 1723089600 (seconds).',
        language: 'text',
      },
    ],
    relatedTools: ['unix-time-converter', 'date-difference-calculator', 'timezone-converter'],
    seo: {
      title: 'Timestamp Converter — Unix Time to Date & Back',
      description:
        'Convert Unix timestamps to readable dates and dates to timestamps, with automatic seconds/milliseconds detection and live current-time values.',
      keywords: [
        'timestamp converter',
        'epoch converter',
        'unix timestamp',
        'milliseconds to date',
      ],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-unix-time-converter',
    slug: 'unix-time-converter',
    title: 'Unix Time Converter',
    description:
      'See the current Unix time and convert between seconds-based epoch values and human-readable UTC and local dates.',
    shortDescription: 'Convert Unix epoch seconds to dates and view the current Unix time.',
    category: 'date-time',
    keywords: [
      'unix time',
      'unix timestamp',
      'epoch converter',
      'seconds to date',
      'current epoch',
    ],
    tags: ['date', 'time', 'unix', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the difference between this and the Timestamp Converter?',
        answer:
          'This tool focuses on seconds-based Unix time with a live clock, while the Timestamp Converter auto-detects seconds vs milliseconds and also converts dates into timestamps.',
      },
      {
        question: 'Is the live clock updated as time passes?',
        answer: 'Yes. The current Unix time refreshes every second while the page is open.',
      },
      {
        question: 'Does it handle negative timestamps?',
        answer:
          'Yes. Timestamps before 1970 (like -86400, which is 1969-12-31) are converted correctly.',
      },
    ],
    examples: [
      {
        title: 'Read the current Unix time',
        description: 'The live counter you can copy into code.',
        code: 'Now → 1754524800 (updates every second).',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Decode a seconds value',
        description: 'Turn an epoch value into a date.',
        code: '1700000000 → 2023-11-14 22:13:20 UTC.',
        language: 'text',
      },
    ],
    relatedTools: ['timestamp-converter', 'timezone-converter'],
    seo: {
      title: 'Unix Time Converter — Current Epoch & Seconds to Date',
      description:
        'View the current Unix time live and convert seconds-based epoch values to human-readable UTC and local dates.',
      keywords: ['unix time', 'current epoch', 'epoch seconds', 'unix converter'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-date-difference-calculator',
    slug: 'date-difference-calculator',
    title: 'Date Difference Calculator',
    description:
      'Calculate the exact duration between two dates or datetimes, broken down into years, months, days, hours, minutes, and seconds.',
    shortDescription: 'Find the exact duration between any two dates.',
    category: 'date-time',
    keywords: [
      'date difference',
      'days between dates',
      'duration calculator',
      'date interval',
      'date math',
    ],
    tags: ['date', 'time', 'calculator', 'duration'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are months counted?',
        answer:
          'The difference is computed on the calendar, so from January 31 to February 28 is reported as 1 month — even though it is only 28 days. The totals row shows the same span in days, hours, and seconds.',
      },
      {
        question: 'Can I compare dates across timezones?',
        answer:
          'Yes. You can enable "Include time" to compare full datetimes, and a timezone selector lets you interpret both inputs in the same zone so the result is consistent.',
      },
      {
        question: 'Does it handle dates in the past?',
        answer:
          'Yes. The calculator is direction-agnostic and shows the absolute duration between any two dates, past or future.',
      },
    ],
    examples: [
      {
        title: 'How many days until a deadline?',
        description: 'Compare today against any target date.',
        code: '2026-01-01 → 2026-08-08 = 219 days (7 months 7 days).',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Exact service duration',
        description: 'Break down a span into every unit.',
        code: '2020-03-15 09:00 → 2025-06-20 18:30 = 5 years 3 months 5 days 9h 30m.',
        language: 'text',
      },
    ],
    relatedTools: ['timestamp-converter', 'timezone-converter'],
    seo: {
      title: 'Date Difference Calculator — Duration Between Two Dates',
      description:
        'Calculate the exact duration between two dates or datetimes in years, months, days, hours, minutes, and seconds.',
      keywords: ['date difference', 'days between dates', 'duration calculator', 'date calculator'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-timezone-converter',
    slug: 'timezone-converter',
    title: 'Timezone Converter',
    description:
      'Compare the same moment across two timezones, see UTC offsets for 40+ zones, and read the current time anywhere in the world.',
    shortDescription: 'Convert times across timezones and compare UTC offsets.',
    category: 'date-time',
    keywords: ['timezone converter', 'time zone', 'world clock', 'utc offset', 'time zones list'],
    tags: ['date', 'time', 'timezone', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Why do some zones show the same offset?',
        answer:
          'Many cities share a UTC offset (like Berlin and Paris, both UTC+1/+2). The converter shows each zone independently so you can still compare, but the offset values may match.',
      },
      {
        question: 'Does it handle daylight saving time?',
        answer:
          "Yes. The browser's Intl API resolves offsets for the selected moment, so DST transitions are reflected automatically for zones that observe them.",
      },
      {
        question: 'What timezone does "Local" mean?',
        answer:
          '"Local" is your browser\'s configured timezone, and its name is shown next to it. Everything else is compared against that baseline.',
      },
    ],
    examples: [
      {
        title: 'Schedule a meeting across zones',
        description: "Find when your time matches a colleague's workday.",
        code: '14:00 Local → 21:00 Tokyo, 05:00 New York (or the same moment in any zone).',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Compare UTC offsets',
        description: 'See which zone is ahead or behind by how much.',
        code: 'UTC+8 (Singapore) vs UTC-5 (New York) → 13 hours apart.',
        language: 'text',
      },
    ],
    relatedTools: ['timestamp-converter', 'date-difference-calculator'],
    seo: {
      title: 'Timezone Converter — World Clock & UTC Offset Comparison',
      description:
        'Convert times between any two timezones, compare UTC offsets across 40+ zones, and check the current time anywhere in the world.',
      keywords: ['timezone converter', 'world clock', 'utc offset', 'time zone comparison'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-uuid-generator',
    slug: 'uuid-generator',
    title: 'UUID Generator',
    description:
      'Generate cryptographically secure UUIDs (v1, v4, and v7) in bulk, copy any of them with one click, and download them as a file.',
    shortDescription: 'Generate secure UUIDs in v1, v4, and v7 formats.',
    category: 'programming',
    keywords: [
      'uuid generator',
      'uuid v4',
      'guid',
      'generate uuid',
      'random identifier',
      'uuid v7',
    ],
    tags: ['programming', 'uuid', 'generator', 'random'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which UUID version should I use?',
        answer:
          "v4 is the most common choice — random identifiers with no meaning. v1 embeds a timestamp and the machine's MAC, while v7 is a modern time-ordered format favored for database primary keys.",
      },
      {
        question: 'Are the UUIDs really random?',
        answer:
          "Yes. UUIDs are produced by the browser's crypto.getRandomValues, which uses the operating system's secure random source.",
      },
      {
        question: 'How many UUIDs can I generate at once?',
        answer:
          'Up to 100 per batch. Generate as many batches as you like, or copy the whole list and clear it when done.',
      },
    ],
    examples: [
      {
        title: 'Generate a v4 UUID',
        description: 'A typical random identifier.',
        code: 'Generate 1 × UUID v4 → 9b2f4c7e-0d8a-4e5f-9a1b-6c3d7e8f9a0b',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Bulk-generate for seeding a database',
        description: 'Generate 50 IDs and download them.',
        code: 'Set count to 50 → click Generate → Download as uuid.txt',
        language: 'text',
      },
    ],
    relatedTools: ['random-number-generator', 'slug-generator', 'base64-encoder-decoder'],
    seo: {
      title: 'UUID Generator — v1, v4 & v7 with Bulk Export',
      description:
        'Generate secure, random UUIDs in v1, v4, and v7 formats. Bulk-generate up to 100 at once, copy with one click, or download as a file.',
      keywords: ['uuid generator', 'uuid v4', 'guid generator', 'bulk uuid'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-jwt-decoder',
    slug: 'jwt-decoder',
    title: 'JWT Decoder',
    description:
      "Decode any JWT's header and payload instantly and inspect its registered claims, all locally in your browser.",
    shortDescription: 'Decode JWT header and payload without sending tokens anywhere.',
    category: 'programming',
    keywords: ['jwt decoder', 'decode jwt', 'jwt payload', 'jwt header', 'token decoder'],
    tags: ['programming', 'jwt', 'token', 'decoder'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is my token sent anywhere?',
        answer:
          'No. Decoding happens entirely in your browser — the token never leaves your device. This is a common requirement when working with production tokens.',
      },
      {
        question: 'What does a decoded JWT show?',
        answer:
          'The header (algorithm and token type) and payload (claims like sub, iat, exp, iss, and aud), with human-friendly formatting and a raw JSON view.',
      },
      {
        question: 'Can this tool verify the signature?',
        answer:
          'No — the Decoder only reads the contents. Use the JWT Inspector for HMAC signature verification with a secret.',
      },
    ],
    examples: [
      {
        title: 'Decode a header and payload',
        description: 'Paste any JWT to see its claims.',
        code: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjMifQ... → alg HS256, sub 123',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Check expiration claims',
        description: 'See exactly when a token expires.',
        code: 'Decoded payload shows exp: 1754524800 → expires 2025-08-07 04:00:00 UTC.',
        language: 'text',
      },
    ],
    relatedTools: ['jwt-inspector', 'base64-encoder-decoder'],
    seo: {
      title: 'JWT Decoder — Decode Tokens Locally',
      description:
        'Decode JWT headers and payloads instantly and safely in your browser. View all registered claims with zero network requests.',
      keywords: ['jwt decoder', 'decode jwt', 'jwt claims', 'jwt payload'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-jwt-inspector',
    slug: 'jwt-inspector',
    title: 'JWT Inspector',
    description:
      'Inspect JWTs in depth: verify HMAC signatures with a secret, detect expired tokens, and explore claims with formatted timestamps.',
    shortDescription: 'Verify JWT signatures and inspect expiration and claims.',
    category: 'programming',
    keywords: ['jwt inspector', 'verify jwt', 'jwt hmac', 'jwt expiration', 'jwt claims'],
    tags: ['programming', 'jwt', 'security', 'verification'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which algorithms can be verified?',
        answer:
          'HMAC signatures — HS256, HS384, and HS512 — are verified locally with your secret using the Web Crypto API. Asymmetric algorithms like RS256 require the public key and are not supported.',
      },
      {
        question: 'How is the signature verified?',
        answer:
          "The tool re-computes the HMAC of the header.payload bytes using your secret and compares it to the token's signature. A match means the token has not been tampered with.",
      },
      {
        question: 'Why does it flag my token as expired?',
        answer:
          'If the payload contains an exp claim, the inspector converts it to a date and compares it against the current time, warning you when the token is already past its expiry.',
      },
    ],
    examples: [
      {
        title: 'Verify an HS256 token',
        description: 'Prove a token has not been altered.',
        code: 'Paste token + secret "my-secret" → Signature is valid.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Spot an expired token',
        description: 'Expiration warnings at a glance.',
        code: 'Token with exp: 1700000000 → "Expired 12 days ago" warning.',
        language: 'text',
      },
    ],
    relatedTools: ['jwt-decoder', 'base64-encoder-decoder'],
    seo: {
      title: 'JWT Inspector — Verify HMAC Signatures & Expiry',
      description:
        'Verify JWT HMAC signatures with a secret, detect expired tokens, and explore formatted claims — all locally in your browser.',
      keywords: ['jwt verify', 'jwt inspector', 'jwt signature', 'hmac'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-slug-generator',
    slug: 'slug-generator',
    title: 'Slug Generator',
    description:
      'Turn any text into a clean URL-ready slug: lowercase, hyphenated, with diacritics removed and configurable case style.',
    shortDescription: 'Generate URL-friendly slugs from any text.',
    category: 'programming',
    keywords: ['slug generator', 'url slug', 'slugify', 'seo slug', 'friendly url'],
    tags: ['programming', 'slug', 'generator', 'seo'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What characters are kept in a slug?',
        answer:
          'Letters and numbers are kept, diacritics like é are converted to their ASCII form (e), spaces become hyphens, and everything else is stripped.',
      },
      {
        question: 'Should I use camelCase or hyphens?',
        answer:
          'Hyphenated lowercase slugs are the SEO standard for URLs. The generator also offers camelCase, PascalCase, and uppercase output for API paths or code identifiers.',
      },
      {
        question: 'Why do my accented characters change?',
        answer:
          'Slugs are safest as plain ASCII. The generator normalizes accented letters to their closest ASCII equivalents, so "café" becomes "cafe".',
      },
    ],
    examples: [
      {
        title: 'Slugify a headline',
        description: 'Typical blog post URL creation.',
        code: '"Hello, World! This is my Post" → hello-world-this-is-my-post',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'API endpoint name',
        description: 'Camel-case output for code.',
        code: '"get user profile data" → getUserProfileData (camelCase).',
        language: 'text',
      },
    ],
    relatedTools: ['lorem-ipsum-generator', 'uuid-generator', 'url-encoder-decoder'],
    seo: {
      title: 'Slug Generator — URL-Friendly Text to Slug',
      description:
        'Turn any text into clean URL slugs: lowercase, hyphenated, diacritics removed, with case style options for paths, IDs, and code.',
      keywords: ['slug generator', 'slugify', 'url slug', 'seo slug'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-lorem-ipsum-generator',
    slug: 'lorem-ipsum-generator',
    title: 'Lorem Ipsum Generator',
    description:
      'Generate lorem ipsum placeholder text by paragraphs, sentences, or words — with configurable starting text and one-click copy.',
    shortDescription: 'Generate lorem ipsum placeholder text in any amount.',
    category: 'programming',
    keywords: ['lorem ipsum', 'placeholder text', 'fake text', 'dummy text', 'text generator'],
    tags: ['programming', 'lorem', 'generator', 'placeholder'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is lorem ipsum?',
        answer:
          'Lorem ipsum is scrambled, meaningless Latin used as placeholder text since the 1500s. It lets designers and developers preview layouts without writing real copy.',
      },
      {
        question: 'What does "start with lorem ipsum" mean?',
        answer:
          'When enabled, the output begins with the classic "Lorem ipsum dolor sit amet..." opener before the random filler. Toggle it off for pure random text.',
      },
      {
        question: 'How much text can I generate?',
        answer:
          'Up to 50 paragraphs, 500 sentences, or 5000 words per batch. Regenerate anytime for a new mix of words.',
      },
    ],
    examples: [
      {
        title: 'Three paragraphs for a mockup',
        description: 'Quick placeholder body text.',
        code: 'Paragraphs: 3 → three paragraphs of lorem ipsum, copied with one click.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Exact word count',
        description: 'A precise amount for a form label.',
        code: 'Words: 25 → a 25-word sentence-like placeholder.',
        language: 'text',
      },
    ],
    relatedTools: ['slug-generator', 'markdown-preview', 'markdown-formatter'],
    seo: {
      title: 'Lorem Ipsum Generator — Paragraphs, Sentences & Words',
      description:
        'Generate lorem ipsum placeholder text by paragraphs, sentences, or words, with classic opener options and one-click copy.',
      keywords: ['lorem ipsum', 'placeholder text', 'dummy text generator', 'lorem generator'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-random-number-generator',
    slug: 'random-number-generator',
    title: 'Random Number Generator',
    description:
      'Generate cryptographically random numbers in any range, in bulk, with optional decimals — perfect for dice, draws, and tests.',
    shortDescription: 'Generate random numbers in any range and quantity.',
    category: 'numbers',
    keywords: ['random number', 'random generator', 'dice roll', 'random range', 'random pick'],
    tags: ['numbers', 'random', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How random are the numbers?',
        answer:
          'The generator uses crypto.getRandomValues, the same secure source browsers use for encryption. Results are uniformly distributed within your range.',
      },
      {
        question: 'Can decimals be generated?',
        answer:
          'Yes. Enable "Allow decimals" to get values with up to 6 decimal places, instead of whole numbers only.',
      },
      {
        question: 'Are the endpoints included?',
        answer:
          'Yes — both the minimum and maximum values can be produced, so a 1–6 range behaves exactly like a six-sided die.',
      },
    ],
    examples: [
      {
        title: 'Roll a d6',
        description: 'A classic use case.',
        code: 'Min 1, Max 6, Count 1 → a value between 1 and 6.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Pick a winner',
        description: 'Draw from a pool of ticket numbers.',
        code: 'Min 100, Max 999, Count 3 → three distinct-looking ticket winners.',
        language: 'text',
      },
    ],
    relatedTools: ['uuid-generator', 'number-base-converter'],
    seo: {
      title: 'Random Number Generator — Any Range, Any Count',
      description:
        'Generate cryptographically secure random numbers in any range, with optional decimals and bulk generation for dice, draws, and testing.',
      keywords: ['random number generator', 'random range', 'random picker', 'dice'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-number-base-converter',
    slug: 'number-base-converter',
    title: 'Number Base Converter',
    description:
      'Convert numbers between any base from 2 to 36 — binary, octal, decimal, hex, and beyond — including fractional values.',
    shortDescription: 'Convert numbers between bases 2 and 36, fractions included.',
    category: 'numbers',
    keywords: [
      'base converter',
      'binary to hex',
      'decimal converter',
      'number base',
      'hexadecimal',
    ],
    tags: ['numbers', 'converter', 'binary', 'hex'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which bases are supported?',
        answer:
          'Any base from 2 to 36. Beyond hex you can use base-32 and base-36, which cover all letters of the alphabet.',
      },
      {
        question: 'Are fractional numbers supported?',
        answer:
          'Yes. Values like 1010.11 (binary) convert with up to 12 fractional digits of precision in the target base.',
      },
      {
        question: 'Is output case-sensitive?',
        answer:
          'Input is case-insensitive (FF and ff both work), and output uses uppercase letters for digits above 9.',
      },
    ],
    examples: [
      {
        title: 'Binary to hex',
        description: 'The most common conversion.',
        code: '11111111 (base 2) → FF (base 16), also shown as 255 in decimal.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Fractional conversion',
        description: 'Convert a binary fraction.',
        code: '1010.1 (base 2) → A.8 (base 16).',
        language: 'text',
      },
    ],
    relatedTools: ['random-number-generator', 'cidr-calculator', 'base64-encoder-decoder'],
    seo: {
      title: 'Number Base Converter — Binary, Octal, Decimal & Hex',
      description:
        'Convert numbers between any base from 2 to 36, including fractional values, with instant results and a live decimal readout.',
      keywords: ['base converter', 'binary to hex', 'number conversion', 'hexadecimal converter'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-percentage-calculator',
    slug: 'percentage-calculator',
    title: 'Percentage Calculator',
    description:
      'Solve three classic percentage problems: "X% of Y", "X is what percent of Y", and percentage increase or decrease — with the working shown.',
    shortDescription: 'Calculate percentages, ratios, and percentage change.',
    category: 'numbers',
    keywords: [
      'percentage calculator',
      'percent of',
      'percentage change',
      'percent difference',
      'percent increase',
    ],
    tags: ['numbers', 'percentage', 'calculator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the "X is what percent of Y" mode for?',
        answer:
          'It answers questions like "12 is what percent of 60?" — returning 20%, and also shows the reverse ratio so you can interpret the result either way.',
      },
      {
        question: 'How is percentage change calculated?',
        answer:
          'Change is computed as (new − old) ÷ old × 100. Positive results are increases, negative results are decreases.',
      },
      {
        question: 'Can I divide by zero?',
        answer:
          'The calculator validates inputs and shows a clear error instead of dividing by zero, so you never get Infinity or NaN results.',
      },
    ],
    examples: [
      {
        title: 'Tip calculation',
        description: 'What is 15% of a 42.50 bill?',
        code: 'X% of Y: 15, 42.5 → 6.375, with the formula shown.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Price change',
        description: 'How much did a price grow?',
        code: 'Change: 80 → 100 → +25% increase.',
        language: 'text',
      },
    ],
    relatedTools: ['number-base-converter', 'roman-numeral-converter'],
    seo: {
      title: 'Percentage Calculator — Percent of, Ratio & Change',
      description:
        'Calculate "X% of Y", "X is what percent of Y", and percentage change with formulas and step-by-step working shown.',
      keywords: [
        'percentage calculator',
        'percent change',
        'percentage of a number',
        'percentage increase',
      ],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-roman-numeral-converter',
    slug: 'roman-numeral-converter',
    title: 'Roman Numeral Converter',
    description:
      'Convert numbers to and from Roman numerals up to 3999, with validation and instant bidirectional conversion.',
    shortDescription: 'Convert numbers to Roman numerals and back.',
    category: 'numbers',
    keywords: ['roman numeral', 'roman number', 'to roman', 'from roman', 'roman conversion'],
    tags: ['numbers', 'roman', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the largest number supported?',
        answer:
          '3999 — the classic upper bound for Roman numerals using standard notation (MMMCMXCIX). Above that, notation varies by convention.',
      },
      {
        question: 'Can I type Roman numerals with lowercase letters?',
        answer:
          'Yes. Input is case-insensitive, so both "XIV" and "xiv" convert to 14. Output is always uppercase.',
      },
      {
        question: 'How do subtractive rules work?',
        answer:
          'Standard modern notation uses subtraction for 4 (IV), 9 (IX), 40 (XL), 90 (XC), 400 (CD), and 900 (CM). The converter follows those exact rules.',
      },
    ],
    examples: [
      {
        title: 'Number to Roman',
        description: 'Classic conversion.',
        code: '1999 → MCMXCIX.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Roman to number',
        description: 'Decode an inscription.',
        code: 'MMXXIV → 2024.',
        language: 'text',
      },
    ],
    relatedTools: ['number-base-converter', 'percentage-calculator'],
    seo: {
      title: 'Roman Numeral Converter — To & From Roman Numerals',
      description:
        'Convert numbers to Roman numerals and Roman numerals to numbers, up to 3999, with instant bidirectional results.',
      keywords: ['roman numeral converter', 'to roman', 'roman numbers', 'mmxxiv'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-url-parser',
    slug: 'url-parser',
    title: 'URL Parser',
    description:
      'Break any URL into its components — protocol, host, port, path, query, and hash — and decode its query parameters instantly.',
    shortDescription: 'Split URLs into components and decode query parameters.',
    category: 'web',
    keywords: ['url parser', 'parse url', 'url parts', 'url components', 'query params'],
    tags: ['web', 'url', 'parser'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What does each component mean?',
        answer:
          'The parser splits a URL into protocol (scheme), host, port, path, query string, and hash — the same pieces browsers and servers use internally to route requests.',
      },
      {
        question: 'My URL has no protocol — why the warning?',
        answer:
          'URLs like "example.com/path" are ambiguous, so the parser assumes https:// and notes it. Add the protocol explicitly for exact results.',
      },
      {
        question: 'Where do encoded characters show up?',
        answer:
          'Query parameters are shown decoded (for example, %20 as a space) alongside their raw values, and the Query String Parser tool offers deeper decoding control.',
      },
    ],
    examples: [
      {
        title: 'Parse a search URL',
        description: 'See every part of a typical link.',
        code: 'https://example.com/blog/post?tag=dev&page=2#comments → host, path, 2 query params, hash.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Decode encoded values',
        description: 'Read values with percent-encoding.',
        code: '?q=hello%20world → q = "hello world" (decoded).',
        language: 'text',
      },
    ],
    relatedTools: ['url-builder', 'query-string-parser', 'dns-lookup', 'url-encoder-decoder'],
    seo: {
      title: 'URL Parser — Split & Decode URL Components',
      description:
        'Break any URL into protocol, host, port, path, query, and hash components, with decoded query parameters — entirely in your browser.',
      keywords: ['url parser', 'url components', 'parse url', 'url structure'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-url-builder',
    slug: 'url-builder',
    title: 'URL Builder',
    description:
      'Compose URLs from their parts — protocol, host, port, path, query parameters, and hash — with URL-safe encoding handled for you.',
    shortDescription: 'Build URLs from parts with proper encoding.',
    category: 'web',
    keywords: ['url builder', 'build url', 'query builder', 'url generator', 'encode url'],
    tags: ['web', 'url', 'builder'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it encode my query values?',
        answer:
          'Yes. Each parameter name and value is percent-encoded automatically, so spaces, ampersands, and special characters survive round trips safely.',
      },
      {
        question: 'Can I add parameters with empty values?',
        answer:
          'Yes. Leaving a value blank still includes the key in the query string, which is valid for flags and toggle parameters.',
      },
      {
        question: 'How do I open or copy the result?',
        answer:
          'The finished URL is updated live and can be copied with one click, or opened in a new tab to test immediately.',
      },
    ],
    examples: [
      {
        title: 'Compose an API URL',
        description: 'Assemble a query string from parts.',
        code: 'Host api.example.com, path /search, q=hello world, limit=10 → https://api.example.com/search?q=hello%20world&limit=10',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Round-trip safety',
        description: 'Special characters survive encoding.',
        code: 'Value "a&b=c" → a%26b%3Dc in the query string.',
        language: 'text',
      },
    ],
    relatedTools: ['url-parser', 'query-string-parser'],
    seo: {
      title: 'URL Builder — Compose URLs From Parts',
      description:
        'Build URLs from protocol, host, port, path, and query parameters, with automatic URL-safe encoding and live preview.',
      keywords: ['url builder', 'build url', 'query string builder', 'encode url'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-query-string-parser',
    slug: 'query-string-parser',
    title: 'Query String Parser',
    description:
      'Parse and decode query strings into key-value pairs, with duplicate keys, arrays, and percent-encoded values handled correctly.',
    shortDescription: 'Parse query strings into decoded key-value pairs.',
    category: 'web',
    keywords: ['query string parser', 'query params', 'url params', 'querystring', 'parse query'],
    tags: ['web', 'url', 'query', 'parser'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are duplicate keys handled?',
        answer:
          'Repeated keys like ?tag=a&tag=b are grouped and shown together, so you can see both values instead of losing one.',
      },
      {
        question: 'Are values decoded?',
        answer:
          'Yes. Percent-encoded values (%20, %2C, etc.) are decoded automatically, and the raw value is shown alongside for comparison.',
      },
      {
        question: 'Do I paste the whole URL or just the query?',
        answer:
          'Either works. The parser strips everything before the ? automatically if you paste a full URL.',
      },
    ],
    examples: [
      {
        title: 'Parse a search query',
        description: 'Typical e-commerce filter URL.',
        code: '?category=books&sort=price_asc&in_stock=true → three decoded pairs.',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Repeated parameters',
        description: 'Multi-select filters.',
        code: '?color=red&color=blue → color appears twice with both values.',
        language: 'text',
      },
    ],
    relatedTools: ['url-parser', 'url-builder'],
    seo: {
      title: 'Query String Parser — Decode URL Parameters',
      description:
        'Parse any query string into decoded key-value pairs, with duplicate keys, arrays, and percent-encoded values handled correctly.',
      keywords: ['query string parser', 'query params', 'url parameters', 'querystring'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-http-status-explorer',
    slug: 'http-status-explorer',
    title: 'HTTP Status Explorer',
    description:
      'Browse and search every HTTP status code — 1xx informational through 5xx server errors — with meanings, common uses, and handling tips.',
    shortDescription: 'Searchable reference for HTTP status codes.',
    category: 'web',
    keywords: [
      'http status codes',
      'status code list',
      'http codes',
      'response codes',
      '404 meaning',
    ],
    tags: ['web', 'http', 'status', 'reference'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How many status codes are covered?',
        answer:
          'More than 60 codes across the five classes: informational (1xx), success (2xx), redirection (3xx), client errors (4xx), and server errors (5xx).',
      },
      {
        question: 'What is the difference between 401 and 403?',
        answer:
          '401 Unauthorized means you have not proven who you are; 403 Forbidden means the server knows you but refuses access. The explorer explains both, plus adjacent codes.',
      },
      {
        question: 'Can I search by phrase?',
        answer:
          'Yes. Search matches the code number, name, and description — try "cache", "redirect", or "rate limit" to find related codes.',
      },
    ],
    examples: [
      {
        title: 'What is 204?',
        description: 'A quick lookup by number.',
        code: 'Search 204 → No Content, "the server fulfilled the request but returns nothing."',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Find redirect codes',
        description: 'Browse by class.',
        code: 'Filter 3xx → 300 Multiple Choices through 308 Permanent Redirect.',
        language: 'text',
      },
    ],
    relatedTools: ['url-parser', 'regex-tester'],
    seo: {
      title: 'HTTP Status Explorer — Every Status Code Explained',
      description:
        'Search and browse every HTTP status code from 1xx to 5xx, with plain-English meanings, common use cases, and handling tips.',
      keywords: ['http status codes', 'status code reference', '404 meaning', 'http codes list'],
    },
    createdAt: '2025-07-25T00:00:00.000Z',
    updatedAt: '2025-07-25T00:00:00.000Z',
  },
  {
    id: 'tool-md5-generator',
    slug: 'md5-generator',
    title: 'MD5 Generator',
    description:
      'Compute the 128-bit MD5 checksum of any text instantly and copy the result — all locally in your browser, with nothing sent to a server.',
    shortDescription: 'Generate MD5 checksums for any text, entirely offline.',
    category: 'security-tools',
    keywords: [
      'md5 generator',
      'md5 hash',
      'md5 checksum',
      'generate md5',
      'hash text',
      'message digest',
    ],
    tags: ['security', 'hash', 'md5', 'checksum'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is MD5 secure for password storage?',
        answer:
          'No. MD5 is cryptographically broken for passwords — use a keyed hash like HMAC-SHA256 or a modern password hasher such as bcrypt or Argon2 instead. MD5 remains fine for quick integrity checks and deduplication.',
      },
      {
        question: 'Does the tool send my text anywhere?',
        answer:
          'No. Everything runs in your browser using a local MD5 implementation — your input never leaves the page.',
      },
      {
        question: 'What does an MD5 hash look like?',
        answer:
          'MD5 produces a 32-character hexadecimal string, for example the hash of "hello" is 5d41402abc4b2a76b9719d911017c592.',
      },
    ],
    examples: [
      {
        title: 'Hash a string',
        description: 'Type or paste any text and the MD5 checksum updates live.',
        code: 'hello → 5d41402abc4b2a76b9719d911017c592',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Verify a downloaded file',
        description: 'Hash the checksum line from a release page against your own text to compare.',
        code: 'Paste the expected checksum → compare with the generated hash',
        language: 'text',
      },
    ],
    relatedTools: ['sha256-generator', 'file-hash-generator', 'hmac-generator'],
    seo: {
      title: 'MD5 Generator — Hash Any Text Instantly',
      description:
        'Generate the MD5 checksum of any text in your browser. Instant, local, and private — copy the 32-character hex hash with one click.',
      keywords: ['md5 generator', 'md5 hash online', 'md5 checksum', 'hash text md5'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-sha1-generator',
    slug: 'sha1-generator',
    title: 'SHA-1 Generator',
    description:
      'Generate the 160-bit SHA-1 digest of any text using the browser\u2019s native WebCrypto — fast, local, and private.',
    shortDescription: 'Compute SHA-1 digests for any text with WebCrypto.',
    category: 'security-tools',
    keywords: [
      'sha1 generator',
      'sha-1 hash',
      'sha1 checksum',
      'generate sha1',
      'hash text',
      'webcrypto',
    ],
    tags: ['security', 'hash', 'sha1', 'checksum'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is SHA-1 still secure?',
        answer:
          'SHA-1 is considered weak for signatures and certificates due to collision attacks (SHAttered). It is still widely used for legacy checksums, but prefer SHA-256 or SHA-512 for new work.',
      },
      {
        question: 'How is the hash computed?',
        answer:
          'The browser\u2019s native WebCrypto (SubtleCrypto.digest) computes the digest — there is no JavaScript fallback and no network traffic.',
      },
      {
        question: 'What does a SHA-1 hash look like?',
        answer:
          'SHA-1 produces a 40-character hexadecimal string, for example the hash of "hello" is aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d.',
      },
    ],
    examples: [
      {
        title: 'Hash a string',
        description: 'Type or paste text and watch the digest update live.',
        code: 'hello → aaf4c61ddcc5e8a2dabede0f3b482cd9aea9434d',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Compare with a checksum',
        description: 'Paste the expected SHA-1 from a download page and compare byte-for-byte.',
        code: 'Paste expected digest → compare against generated hash',
        language: 'text',
      },
    ],
    relatedTools: ['sha256-generator', 'sha512-generator', 'md5-generator'],
    seo: {
      title: 'SHA-1 Generator — WebCrypto SHA-1 Hashes',
      description:
        'Generate SHA-1 digests of any text instantly in your browser using WebCrypto. Local, private, and copy-ready.',
      keywords: ['sha1 generator', 'sha-1 hash online', 'sha1 checksum', 'hash text'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-sha256-generator',
    slug: 'sha256-generator',
    title: 'SHA-256 Generator',
    description:
      'Compute the SHA-256 digest of any text with the browser\u2019s native WebCrypto. Ideal for checksums, commit hashes, and API signing inputs.',
    shortDescription: 'Generate SHA-256 hashes for any text, fully local.',
    category: 'security-tools',
    keywords: [
      'sha256 generator',
      'sha-256 hash',
      'sha256 checksum',
      'generate sha256',
      'hash text',
      'integrity check',
    ],
    tags: ['security', 'hash', 'sha256', 'checksum'],
    pricing: 'free',
    featured: true,
    faqs: [
      {
        question: 'What is SHA-256 used for?',
        answer:
          'SHA-256 is the workhorse of modern checksums: Git commit hashes, TLS certificates, API request signing, and integrity checks all rely on it.',
      },
      {
        question: 'Is SHA-256 secure?',
        answer:
          'Yes — no practical collision or preimage attack against SHA-256 is known. It is the recommended default for most hashing needs.',
      },
      {
        question: 'How is the hash computed?',
        answer:
          'The browser\u2019s native WebCrypto (SubtleCrypto.digest) computes the digest locally — your text never leaves the page.',
      },
    ],
    examples: [
      {
        title: 'Hash a string',
        description: 'Type or paste text and the digest updates live.',
        code: 'hello → 2cf24dba5fb0a30e26e83b2ac5b9e29e1b161e5c1fa7425e73043362938b9824',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Verify a download',
        description: 'Compare the generated digest against the SHA-256 published by the vendor.',
        code: 'Paste vendor digest → compare with generated hash',
        language: 'text',
      },
    ],
    relatedTools: ['sha512-generator', 'md5-generator', 'file-hash-generator'],
    seo: {
      title: 'SHA-256 Generator — Instant WebCrypto Hashes',
      description:
        'Generate SHA-256 digests of any text instantly in your browser. Local WebCrypto, private by design, with one-click copy.',
      keywords: ['sha256 generator', 'sha-256 hash online', 'sha256 checksum', 'hash text'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-sha512-generator',
    slug: 'sha512-generator',
    title: 'SHA-512 Generator',
    description:
      'Generate the 512-bit SHA-512 digest of any text locally with WebCrypto — stronger than SHA-256 for long-lived integrity checks.',
    shortDescription: 'Compute SHA-512 hashes for any text, fully local.',
    category: 'security-tools',
    keywords: [
      'sha512 generator',
      'sha-512 hash',
      'sha512 checksum',
      'generate sha512',
      'hash text',
      'long hash',
    ],
    tags: ['security', 'hash', 'sha512', 'checksum'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'When should I pick SHA-512 over SHA-256?',
        answer:
          'Both are secure. SHA-512 is faster than SHA-256 on 64-bit CPUs and produces a longer 128-character digest, which some standards like DNSSEC prefer.',
      },
      {
        question: 'How is the hash computed?',
        answer:
          'The browser\u2019s native WebCrypto computes the digest locally — your input is never transmitted.',
      },
      {
        question: 'What does a SHA-512 hash look like?',
        answer:
          'SHA-512 produces a 128-character hexadecimal string, for example the hash of "hello" starts with 9b71d224bd62f3785d96d46ad3ea3d73...',
      },
    ],
    examples: [
      {
        title: 'Hash a string',
        description: 'Type or paste text and the digest updates live.',
        code: 'hello → 9b71d224bd62f3785d96d46ad3ea3d73319bfbc2890caadae2dff72519673ca72323c3d99ba5c11d7c7acc6e14b8c5da0c4663475c2e5c3adef46f73bcdec043',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Signing inputs',
        description: 'Use the digest as input to keyed operations or file manifests.',
        code: 'Paste payload → copy 128-char digest',
        language: 'text',
      },
    ],
    relatedTools: ['sha256-generator', 'sha1-generator', 'hmac-generator'],
    seo: {
      title: 'SHA-512 Generator — 512-bit WebCrypto Hashes',
      description:
        'Generate SHA-512 digests of any text instantly in your browser. Local WebCrypto, private by design, with one-click copy.',
      keywords: ['sha512 generator', 'sha-512 hash online', 'sha512 checksum', 'hash text'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-hmac-generator',
    slug: 'hmac-generator',
    title: 'HMAC Generator',
    description:
      'Compute a keyed hash (HMAC) of any text using a secret and SHA-1, SHA-256, or SHA-512 — fully local with WebCrypto, with hex input support.',
    shortDescription: 'Generate HMAC-SHA1/256/512 with a secret key.',
    category: 'security-tools',
    keywords: [
      'hmac generator',
      'hmac sha256',
      'keyed hash',
      'message authentication',
      'hmac calculator',
      'api signature',
    ],
    tags: ['security', 'hash', 'hmac', 'authentication'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is HMAC used for?',
        answer:
          'HMAC authenticates a message with a shared secret — common for API request signing, webhook verification, and message integrity between services.',
      },
      {
        question: 'Why use a key with a hash?',
        answer:
          'A plain hash is forgeable: anyone can compute it. HMAC mixes a secret key into the computation, so only parties who know the key can produce a valid signature.',
      },
      {
        question: 'Can I hash hex bytes instead of text?',
        answer:
          'Yes. Switch the input format to "hex" to interpret both the secret and the message as raw hex bytes — useful when signing binary payloads.',
      },
    ],
    examples: [
      {
        title: 'Sign an API request',
        description: 'Use your secret key to sign a canonical request string.',
        code: 'secret=my-secret-key · message=POST/api/users → HMAC-SHA256 digest',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Verify a webhook',
        description:
          'Recompute the HMAC with the shared secret and compare against the signature header.',
        code: 'Set secret → paste payload → copy digest for comparison',
        language: 'text',
      },
    ],
    relatedTools: ['sha256-generator', 'jwt-decoder', 'base64-encoder-decoder'],
    seo: {
      title: 'HMAC Generator — HMAC-SHA1/256/512 with Secret Key',
      description:
        'Generate HMAC signatures for any message with a secret key using SHA-1, SHA-256, or SHA-512. Local WebCrypto, hex input support, one-click copy.',
      keywords: ['hmac generator', 'hmac sha256 online', 'keyed hash', 'api signature'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-file-hash-generator',
    slug: 'file-hash-generator',
    title: 'File Hash Generator',
    description:
      'Compute MD5, SHA-1, SHA-256, and SHA-512 checksums for any file — streamed in chunks with live progress, entirely in your browser.',
    shortDescription: 'Hash any file with MD5, SHA-1, SHA-256, and SHA-512.',
    category: 'security-tools',
    keywords: [
      'file hash',
      'file checksum',
      'md5 file',
      'sha256 file',
      'verify download',
      'hash checker',
    ],
    tags: ['security', 'hash', 'file', 'checksum'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Are large files supported?',
        answer:
          'Yes. Files up to 512 MB are read in 8 MB chunks so memory stays flat, with a live progress bar while hashing.',
      },
      {
        question: 'Why verify a file hash?',
        answer:
          'Comparing the checksum of a downloaded file against the one published by the vendor confirms the file was not corrupted or tampered with in transit.',
      },
      {
        question: 'Can I get multiple algorithms at once?',
        answer:
          'Yes. Select any combination of MD5, SHA-1, SHA-256, and SHA-512, then copy each result or download all checksums as a text file.',
      },
    ],
    examples: [
      {
        title: 'Verify an ISO download',
        description: 'Drop the ISO, pick SHA-256, and compare with the official digest.',
        code: 'Drop file → select SHA-256 → compare with published checksum',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Export all checksums',
        description: 'Generate every algorithm and download them together.',
        code: 'Select MD5 + SHA-256 → Hash → Download checksums (.txt)',
        language: 'text',
      },
    ],
    relatedTools: ['sha256-generator', 'md5-generator', 'image-metadata-viewer'],
    seo: {
      title: 'File Hash Generator — MD5, SHA-1, SHA-256, SHA-512',
      description:
        'Compute MD5, SHA-1, SHA-256, and SHA-512 checksums for any file in your browser. Streaming hashing with live progress, fully private.',
      keywords: ['file hash online', 'sha256 checksum file', 'md5 file checker', 'verify download'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-image-compressor',
    slug: 'image-compressor',
    title: 'Image Compressor',
    description:
      'Compress JPEG, PNG, or WebP images in the browser. Tune the quality slider and see the exact size reduction before you download.',
    shortDescription: 'Compress images to smaller file sizes, fully local.',
    category: 'images',
    keywords: [
      'image compressor',
      'compress image',
      'reduce image size',
      'webp compression',
      'image optimizer',
      'photo compressor',
    ],
    tags: ['images', 'compression', 'webp', 'optimization'],
    pricing: 'free',
    featured: true,
    faqs: [
      {
        question: 'How much can I shrink an image?',
        answer:
          'JPEGs and PNGs typically lose 50–90% of their size when re-encoded as WebP at medium quality. The tool shows the exact before/after size before you download.',
      },
      {
        question: 'Does compression reduce quality?',
        answer:
          'Only for lossy formats (JPEG, WebP, AVIF) — the quality slider controls the trade-off. PNG output is lossless but usually larger.',
      },
      {
        question: 'Is my image uploaded anywhere?',
        answer:
          'No. The image is decoded and re-encoded entirely in your browser using the canvas API. Nothing is ever uploaded.',
      },
    ],
    examples: [
      {
        title: 'Compress a screenshot',
        description: 'Drop a PNG, convert to WebP at 70% quality, download the result.',
        code: 'PNG (2.4 MB) → WebP 70% → 180 KB (−93%)',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Optimize for the web',
        description: 'Use WebP at 75–85% for photos or PNG for graphics with transparency.',
        code: 'Photo → WebP 80% · Graphic with alpha → PNG',
        language: 'text',
      },
    ],
    relatedTools: ['image-resizer', 'image-format-converter', 'image-cropper'],
    seo: {
      title: 'Image Compressor — Reduce Image Size Online',
      description:
        'Compress JPEG, PNG, and WebP images in your browser with live quality control and exact size reduction — private, no uploads.',
      keywords: ['image compressor', 'compress image online', 'reduce image size', 'webp'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-image-resizer',
    slug: 'image-resizer',
    title: 'Image Resizer',
    description:
      'Resize images to exact pixel dimensions with contain, cover, or fill fitting — entirely in your browser with instant previews.',
    shortDescription: 'Resize images to exact dimensions, fully local.',
    category: 'images',
    keywords: [
      'image resizer',
      'resize image',
      'image dimensions',
      'thumbnail generator',
      'resize photo',
      'avatar resizer',
    ],
    tags: ['images', 'resize', 'dimensions', 'editor'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What do the fit modes do?',
        answer:
          'contain fits the image inside the box without distortion, cover fills the box and crops the overflow, and fill stretches the image to the exact size.',
      },
      {
        question: 'How large can the output be?',
        answer:
          'Dimensions up to 10,000 × 10,000 pixels are supported. Very large inputs are decoded at up to 16,384 px per side.',
      },
      {
        question: 'Is the image uploaded?',
        answer:
          'No. Everything runs locally in your browser with the canvas API — your image never leaves the page.',
      },
    ],
    examples: [
      {
        title: 'Make a profile avatar',
        description: 'Resize any photo to a 512 × 512 square with cover fitting.',
        code: '512 × 512 · cover → avatar ready',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Use a preset',
        description: 'Pick Thumbnail, Small, or Full HD and download the result.',
        code: 'Preset Full HD → 1920 × 1080',
        language: 'text',
      },
    ],
    relatedTools: ['image-compressor', 'image-cropper', 'image-format-converter'],
    seo: {
      title: 'Image Resizer — Resize Images to Exact Dimensions',
      description:
        'Resize images to any pixel dimensions with contain, cover, or fill modes. Private browser-based resizing with presets and instant previews.',
      keywords: ['image resizer', 'resize image online', 'image dimensions', 'thumbnail'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-image-cropper',
    slug: 'image-cropper',
    title: 'Image Cropper',
    description:
      'Crop any image to the exact region you select. Drag the box to move it, use the handle to resize it, or nudge it with the arrow keys.',
    shortDescription: 'Crop images with a precise, adjustable selection box.',
    category: 'images',
    keywords: [
      'image cropper',
      'crop image',
      'crop photo',
      'image editor',
      'crop tool',
      'select region',
    ],
    tags: ['images', 'crop', 'editor', 'selection'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How do I adjust the crop area?',
        answer:
          'Drag inside the box to move it, drag the round handle at the bottom-right corner to resize it, or focus the box and use the arrow keys (+/− to grow or shrink).',
      },
      {
        question: 'Can I set exact values?',
        answer:
          'Yes. The Left, Top, Width, and Height fields show the selection as percentages, and you can type exact values into any of them.',
      },
      {
        question: 'Is the image uploaded?',
        answer:
          'No. Cropping runs entirely in your browser using the canvas API — your image never leaves the page.',
      },
    ],
    examples: [
      {
        title: 'Crop a header image',
        description: 'Select the middle band of a screenshot and crop out the rest.',
        code: 'Drag box → apply crop → download',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Precise pixel crop',
        description: 'Type exact percentages into the fields for pixel-perfect output.',
        code: 'Left 10% · Top 15% · Width 80% · Height 70% → Apply crop',
        language: 'text',
      },
    ],
    relatedTools: ['image-resizer', 'image-compressor', 'image-format-converter'],
    seo: {
      title: 'Image Cropper — Crop Images with a Precision Box',
      description:
        'Crop images with a draggable, resizable selection box. Keyboard accessible, exact percentage values, and fully private browser processing.',
      keywords: ['image cropper', 'crop image online', 'crop photo', 'image editor'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-image-format-converter',
    slug: 'image-format-converter',
    title: 'Image Format Converter',
    description:
      'Convert images between PNG, JPEG, WebP, and AVIF right in the browser — with lossy quality control when the format supports it.',
    shortDescription: 'Convert images between PNG, JPEG, WebP, and AVIF.',
    category: 'images',
    keywords: [
      'image converter',
      'convert image format',
      'png to webp',
      'jpg to png',
      'image to avif',
      'format conversion',
    ],
    tags: ['images', 'converter', 'webp', 'png', 'jpeg'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which formats are supported?',
        answer:
          'Inputs: PNG, JPEG, WebP, GIF, BMP, and AVIF. Outputs: PNG (lossless), JPEG, WebP, and AVIF (lossy with quality control).',
      },
      {
        question: 'Is AVIF supported in all browsers?',
        answer:
          'AVIF encoding is supported in recent Chrome, Edge, Firefox, and Safari versions. If your browser cannot encode it, the tool shows a clear error.',
      },
      {
        question: 'Is my image uploaded?',
        answer:
          'No. Conversion runs entirely in your browser with the canvas API — your image never leaves the page.',
      },
    ],
    examples: [
      {
        title: 'PNG to WebP',
        description: 'Shrink large PNGs by converting them to lossy WebP.',
        code: 'screenshot.png → screenshot.webp (80% quality)',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Photo to AVIF',
        description: 'Use AVIF for maximum compression on photos.',
        code: 'photo.jpg → photo.avif (75% quality)',
        language: 'text',
      },
    ],
    relatedTools: ['image-compressor', 'image-resizer', 'base64-image-converter'],
    seo: {
      title: 'Image Format Converter — PNG, JPEG, WebP, AVIF',
      description:
        'Convert images between PNG, JPEG, WebP, and AVIF formats in your browser. Lossless and lossy options with quality control, fully private.',
      keywords: ['image converter', 'png to webp', 'jpg to png', 'image to avif'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-image-metadata-viewer',
    slug: 'image-metadata-viewer',
    title: 'Image Metadata Viewer',
    description:
      "Inspect an image's file info, dimensions, EXIF data, GPS coordinates, and PNG text chunks — all parsed locally in your browser.",
    shortDescription: 'Read EXIF, dimensions, and file info from any image.',
    category: 'images',
    keywords: [
      'image metadata',
      'exif viewer',
      'exif data',
      'photo info',
      'gps metadata',
      'image details',
    ],
    tags: ['images', 'exif', 'metadata', 'gps'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What metadata can I see?',
        answer:
          'Format, dimensions, bit depth, DPI, animation flags, and — for JPEGs — EXIF tags such as camera make/model, date, exposure, focal length, ISO, and GPS coordinates. PNG text chunks are shown too.',
      },
      {
        question: 'Why does my photo show no EXIF?',
        answer:
          'Many apps strip EXIF when saving, and screenshots never contain it. PNGs store text chunks instead, and some formats carry no metadata at all.',
      },
      {
        question: 'Is my image uploaded?',
        answer:
          'No. The file is parsed entirely in your browser — nothing is transmitted anywhere.',
      },
    ],
    examples: [
      {
        title: 'Check a photo for GPS data',
        description: 'Drop a JPEG and see whether latitude and longitude were stored in EXIF.',
        code: 'photo.jpg → EXIF: Latitude 48.858370 · Longitude 2.294481',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Verify camera settings',
        description: 'Confirm exposure, aperture, ISO, and lens details of a shot.',
        code: 'photo.jpg → ExposureTime 1/200 · FNumber 2.8 · ISO 100',
        language: 'text',
      },
    ],
    relatedTools: ['file-hash-generator', 'image-format-converter', 'base64-encoder-decoder'],
    seo: {
      title: 'Image Metadata Viewer — Read EXIF & GPS Locally',
      description:
        'Inspect EXIF data, dimensions, GPS coordinates, and PNG text chunks of any image in your browser — private, no uploads, no installs.',
      keywords: ['image metadata viewer', 'exif viewer', 'photo info', 'exif data online'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-base64-image-converter',
    slug: 'base64-image-converter',
    title: 'Base64 Image Converter',
    description:
      'Encode any image as a base64 data URL for embedding in HTML or CSS, or decode a pasted data URL back into a downloadable image — all offline.',
    shortDescription: 'Encode images to base64 and decode data URLs back.',
    category: 'images',
    keywords: [
      'base64 image',
      'image to base64',
      'data url',
      'base64 decoder',
      'embed image',
      'css background',
    ],
    tags: ['images', 'base64', 'encoding', 'data-url'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'When would I embed an image as base64?',
        answer:
          'Inline data URLs avoid extra HTTP requests for tiny images — favicons, small icons, and simple email signatures. They add ~33% size overhead, so keep them small.',
      },
      {
        question: 'Can I decode raw base64 without the data: prefix?',
        answer:
          'Yes. Paste either a full data URL (data:image/png;base64,…) or a raw base64 string — both are decoded and shown as a preview.',
      },
      {
        question: 'Is my image uploaded?',
        answer:
          'No. Encoding and decoding happen entirely in your browser — nothing is transmitted.',
      },
    ],
    examples: [
      {
        title: 'Embed a favicon',
        description: 'Encode a small PNG and paste the data URL into your HTML.',
        code: '<link rel="icon" href="data:image/png;base64,…">',
        language: 'html',
        variant: 'highlighted',
      },
      {
        title: 'Decode a CSS background',
        description: 'Paste a data URL from your stylesheet to recover the original image.',
        code: 'background: url(data:image/webp;base64,…) → Decode → download',
        language: 'css',
      },
    ],
    relatedTools: ['base64-encoder-decoder', 'image-format-converter', 'image-compressor'],
    seo: {
      title: 'Base64 Image Converter — Encode & Decode Data URLs',
      description:
        'Encode images to base64 data URLs for embedding, or decode pasted data URLs back into downloadable files. Fully offline and private.',
      keywords: ['base64 image converter', 'image to base64', 'data url encoder', 'base64 decode'],
    },
    createdAt: '2025-08-08T00:00:00.000Z',
    updatedAt: '2025-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-json-formatter',
    slug: 'json-formatter',
    title: 'JSON Formatter',
    description:
      'Re-indent and pretty-print any JSON document into a clean, readable structure with configurable indentation, or minify it down to a single line — fully in your browser.',
    shortDescription: 'Pretty-print or minify JSON with configurable indentation.',
    category: 'json',
    keywords: [
      'json formatter',
      'pretty print json',
      'beautify json',
      'format json online',
      'json indentation',
    ],
    tags: ['json', 'formatter', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does formatting change the meaning of my JSON?',
        answer:
          'No. Formatting only changes whitespace. The parsed structure — keys, values, arrays, and nesting — stays identical, so the output is semantically the same document.',
      },
      {
        question: 'Why does my JSON show an error?',
        answer:
          'The tool validates before formatting. Common problems are trailing commas, unquoted keys, single quotes, and control characters in strings. The error message points at the exact line and column.',
      },
      {
        question: 'What is the difference between pretty print and minify?',
        answer:
          'Pretty print adds indentation and line breaks for reading; minify removes all unnecessary whitespace to produce the smallest valid document for storage or transmission.',
      },
    ],
    examples: [
      {
        title: 'Pretty-print an API response',
        description: 'A minified response becomes readable with proper indentation.',
        code: '{"user":{"id":42,"name":"Ada","roles":["admin","editor"]}}',
        language: 'json',
        variant: 'terminal',
      },
      {
        title: 'Normalize indentation',
        description: 'Mixed 2- and 4-space files are re-indented consistently.',
        code: '{"items":[{"id":1},{"id":2}]}',
        language: 'json',
      },
    ],
    relatedTools: ['json-minifier', 'json-validator', 'json-to-yaml'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-json-minifier',
    slug: 'json-minifier',
    title: 'JSON Minifier',
    description:
      'Strip all unnecessary whitespace from JSON to produce the smallest valid document — ideal for embedding payloads, caching keys, or saving bandwidth on the wire.',
    shortDescription: 'Compress JSON into the smallest valid form.',
    category: 'json',
    keywords: [
      'json minifier',
      'minify json',
      'compress json',
      'remove whitespace json',
      'json size reducer',
    ],
    tags: ['json', 'minifier', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What gets removed when JSON is minified?',
        answer:
          'Indentation and whitespace between tokens. Keys and string values are preserved exactly — minification never alters your data.',
      },
      {
        question: 'Will minified JSON still parse?',
        answer:
          'Yes. The output is fully valid JSON and parses to exactly the same structure as the original.',
      },
      {
        question: 'When should I minify JSON?',
        answer:
          'When JSON travels over the network, is stored in tight fields, or is embedded in code — every byte counts in HTTP bodies and database columns.',
      },
    ],
    examples: [
      {
        title: 'Shrink an API payload',
        description: 'A readable payload compresses to a single compact line.',
        code: '{\n  "status": "ok",\n  "items": [1, 2, 3]\n}',
        language: 'json',
        variant: 'terminal',
      },
      {
        title: 'Embed JSON in source code',
        description: 'Minified JSON fits cleanly into constants and templates.',
        code: 'const cfg = {"theme":"dark","retries":3};',
        language: 'js',
      },
    ],
    relatedTools: ['json-formatter', 'json-validator', 'xml-minifier'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-json-validator',
    slug: 'json-validator',
    title: 'JSON Validator',
    description:
      'Check that your JSON is syntactically valid and find exactly where it breaks. Errors are reported with the line and column of the problem, so malformed documents are quick to fix.',
    shortDescription: 'Validate JSON and locate syntax errors by line and column.',
    category: 'json',
    keywords: [
      'json validator',
      'validate json',
      'check json syntax',
      'json parse error',
      'find json error',
    ],
    tags: ['json', 'validator', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What makes JSON invalid?',
        answer:
          'Trailing commas, unquoted or single-quoted keys, comments, control characters in strings, and truncated documents are the usual culprits. This tool names the exact problem and position.',
      },
      {
        question: 'Can I validate a JSON array?',
        answer: 'Yes. Arrays are valid JSON documents and are validated the same way as objects.',
      },
      {
        question: 'Does it check against a schema?',
        answer:
          'No — this validator checks syntax only. JSON Schema validation is a separate step with a dedicated tool.',
      },
    ],
    examples: [
      {
        title: 'A valid document',
        description: 'Well-formed JSON passes instantly.',
        code: '{"name":"Ada","skills":["math","logic"]}',
        language: 'json',
        variant: 'terminal',
      },
      {
        title: 'A trailing comma',
        description: 'The validator points at the exact line of the error.',
        code: '{"items":["a","b",]}',
        language: 'json',
      },
    ],
    relatedTools: ['json-formatter', 'json-minifier', 'xml-validator'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-case-converter',
    slug: 'case-converter',
    title: 'Case Converter',
    description:
      'Convert any text between camelCase, PascalCase, snake_case, kebab-case, SCREAMING_SNAKE_CASE, and more. Words are detected from separators and camelCase boundaries automatically.',
    shortDescription: 'Convert text between camelCase, snake_case, kebab-case, and more.',
    category: 'text',
    keywords: [
      'case converter',
      'camel case',
      'snake case',
      'kebab case',
      'pascal case',
      'text case',
    ],
    tags: ['text', 'converter', 'programming'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How does the tool split words?',
        answer:
          'It recognizes separators (spaces, dashes, underscores) and camelCase boundaries (lowercase followed by uppercase) to detect words, so any input style converts cleanly.',
      },
      {
        question: 'What happens to numbers and acronyms?',
        answer:
          'Numbers stay attached to their neighboring word, and runs of uppercase letters are treated as single words, preserving conventions like SCREAMING_SNAKE_CASE.',
      },
      {
        question: 'Does it keep the original text?',
        answer:
          'Yes — your input is never modified; every style is derived from it, so you can switch back and forth freely.',
      },
    ],
    examples: [
      {
        title: 'Convert a variable name',
        description: 'From snake_case to camelCase and back.',
        code: 'user_profile_id → userProfileId → USER_PROFILE_ID',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Normalize mixed styles',
        description: 'A messy string becomes any case you need.',
        code: 'API Response Data → apiResponseData',
        language: 'text',
      },
    ],
    relatedTools: ['character-counter', 'slug-generator', 'text-diff'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-character-counter',
    slug: 'character-counter',
    title: 'Character Counter',
    description:
      'Count characters (with or without spaces), words, lines, sentences, and UTF-8 bytes in any text, with estimated reading and speaking times for your content.',
    shortDescription: 'Count characters, words, lines, sentences, and bytes.',
    category: 'text',
    keywords: [
      'character counter',
      'word counter',
      'count words',
      'count characters',
      'sentence counter',
      'reading time',
    ],
    tags: ['text', 'counter', 'productivity'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Why are there two character counts?',
        answer:
          'Some limits (like social media posts) count characters including spaces, while others (like SMS) exclude them. The toggle shows both perspectives.',
      },
      {
        question: 'How is reading time estimated?',
        answer:
          'At an average reading speed of about 200 words per minute, and speaking speed of about 130 words per minute — useful baselines for articles and scripts.',
      },
      {
        question: 'Is the byte count the file size?',
        answer:
          'Approximately. The byte count is the UTF-8 encoding of your text; a saved file adds only a few bytes of metadata on top.',
      },
    ],
    examples: [
      {
        title: 'Check a tweet fits',
        description: 'Count characters before you post.',
        code: 'Hello world, this is a tweet!',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Estimate an article',
        description: 'See reading time for a paragraph of prose.',
        code: 'This paragraph explains how the counter estimates reading and speaking durations.',
        language: 'text',
      },
    ],
    relatedTools: ['case-converter', 'text-diff', 'lorem-ipsum-generator'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-text-diff',
    slug: 'text-diff',
    title: 'Text Diff',
    description:
      'Compare two texts and see exactly what changed, line by line or word by word. Additions and removals are highlighted inline, with counts of what was added and removed.',
    shortDescription: 'Compare two texts and highlight the differences.',
    category: 'text',
    keywords: [
      'text diff',
      'compare text',
      'diff checker',
      'text comparison',
      'find differences',
      'code diff',
    ],
    tags: ['text', 'diff', 'compare'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the difference between line and word level?',
        answer:
          'Line level highlights whole changed lines — best for code and documents. Word level highlights individual changed words inside a line — best for short edits and prose.',
      },
      {
        question: 'How is the diff computed?',
        answer:
          'Using a longest-common-subsequence algorithm, so matching lines are kept aligned and changes are reported as the smallest possible set.',
      },
      {
        question: 'Is my text uploaded?',
        answer: 'No. Comparison happens entirely in your browser — nothing is transmitted.',
      },
    ],
    examples: [
      {
        title: 'Spot a small edit',
        description: 'Word level shows exactly which word changed.',
        code: 'The quick brown fox → The quick orange fox',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Compare code versions',
        description: 'Line level highlights added and removed lines.',
        code: 'const a = 1;\nconst a = 2;',
        language: 'js',
      },
    ],
    relatedTools: ['character-counter', 'case-converter', 'markdown-formatter'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-color-converter',
    slug: 'color-converter',
    title: 'Color Converter',
    description:
      'Convert colors between HEX, HEX8, RGB, HSL, and HSV formats with instant live preview, plus tints and shades for building palettes — all offline.',
    shortDescription: 'Convert colors between HEX, RGB, HSL, and HSV.',
    category: 'color',
    keywords: [
      'color converter',
      'hex to rgb',
      'rgb to hex',
      'hsl converter',
      'hsv converter',
      'hex to hsl',
    ],
    tags: ['color', 'converter', 'design'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which formats are supported?',
        answer:
          'HEX (#fff, #3366ff), HEX8 with alpha (#3366ff80), rgb() and rgba(), hsl() and hsla(), and hsv(). Any of these can be converted to any other.',
      },
      {
        question: 'What is the difference between HSL and HSV?',
        answer:
          'Both describe hue, saturation, and value — but HSL uses lightness (white-black axis) while HSV uses brightness (black-to-full-color axis). HSV is common in pickers, HSL in CSS.',
      },
      {
        question: 'What are tints and shades?',
        answer:
          'Tints mix the color with white toward lighter values; shades mix with black toward darker values. The swatches let you click to copy or use any variant.',
      },
    ],
    examples: [
      {
        title: 'Convert a brand color',
        description: 'From a hex code to HSL for CSS variables.',
        code: '#3366ff → hsl(222, 100%, 60%)',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Match a design system',
        description: 'Find the RGB equivalent of a named color.',
        code: '#663399 → rgb(102, 51, 153)',
        language: 'text',
      },
    ],
    relatedTools: ['color-palette-generator', 'color-contrast-checker', 'base64-image-converter'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-color-palette-generator',
    slug: 'color-palette-generator',
    title: 'Color Palette Generator',
    description:
      'Generate a harmonious palette of shades, tints, and accents from a single base color. Copy individual hex codes or the whole palette with one click.',
    shortDescription: 'Generate a palette of shades and tints from one base color.',
    category: 'color',
    keywords: [
      'color palette generator',
      'palette generator',
      'generate color palette',
      'color shades',
      'palette from color',
      'color scheme generator',
    ],
    tags: ['color', 'palette', 'generator', 'design'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How is the palette generated?',
        answer:
          'From your base color, the tool produces a ramp of lighter tints and darker shades, plus a few accent colors derived by shifting the hue.',
      },
      {
        question: 'How do I copy colors?',
        answer:
          'Click any swatch to copy its hex code, or use “Copy all hex codes” to grab the full palette as a newline-separated list.',
      },
      {
        question: 'Can I use the palette in CSS?',
        answer:
          'Yes — the hex codes drop straight into CSS custom properties or Tailwind config values.',
      },
    ],
    examples: [
      {
        title: 'Build a UI scale',
        description: 'Ten shades from a single primary color.',
        code: '#6366f1 → 10 shades from #eef2ff to #1e1b4b',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Randomize for inspiration',
        description: 'Start from a random base color and tweak.',
        code: 'Randomize → adjust base color → copy palette',
        language: 'text',
      },
    ],
    relatedTools: ['color-converter', 'color-contrast-checker', 'image-compressor'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-color-contrast-checker',
    slug: 'color-contrast-checker',
    title: 'Color Contrast Checker',
    description:
      'Measure the WCAG contrast ratio between two colors and see whether your text passes accessibility guidelines for normal and large text.',
    shortDescription: 'Check WCAG contrast ratios between two colors.',
    category: 'color',
    keywords: [
      'color contrast checker',
      'contrast ratio',
      'wcag contrast',
      'accessibility contrast',
      'check contrast',
      'text readability',
    ],
    tags: ['color', 'accessibility', 'wcag', 'design'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the WCAG contrast ratio?',
        answer:
          'A ratio from 1:1 to 21:1 computed from the relative luminance of two colors. WCAG AA requires 4.5:1 for normal text and 3:1 for large text.',
      },
      {
        question: 'How is the ratio calculated?',
        answer:
          'Using the official WCAG formula: relative luminance of each color (accounting for sRGB gamma), then (L1 + 0.05) / (L2 + 0.05) with the lighter color on top.',
      },
      {
        question: 'Which level should I target?',
        answer:
          'AA (4.5:1) is the widely adopted standard for body text. AAA (7:1) is the stricter target used for public-facing content.',
      },
    ],
    examples: [
      {
        title: 'Black on white',
        description: 'The maximum possible ratio.',
        code: '#000000 on #ffffff → 21.00:1',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Check a button',
        description: 'Verify white text on a primary color.',
        code: '#ffffff on #3366ff → 5.17:1 (AA)',
        language: 'text',
      },
    ],
    relatedTools: ['color-converter', 'color-palette-generator', 'http-status-explorer'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-pdf-info',
    slug: 'pdf-info',
    title: 'PDF Info',
    description:
      'Inspect any PDF’s page count, PDF version, document metadata (title, author, producer, dates), and structure — everything is read locally in your browser.',
    shortDescription: 'Read a PDF’s pages, version, and metadata.',
    category: 'pdf',
    keywords: [
      'pdf info',
      'pdf metadata',
      'pdf details',
      'pdf page count',
      'pdf version checker',
      'inspect pdf',
    ],
    tags: ['pdf', 'metadata', 'inspector', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What information is shown?',
        answer:
          'Page count, PDF version, file size, and the document metadata: title, author, subject, keywords, creator, producer, and creation/modification dates.',
      },
      {
        question: 'Is my PDF uploaded?',
        answer: 'No. The file is read entirely in your browser and never leaves your device.',
      },
      {
        question: 'What does linearized mean?',
        answer:
          'A linearized PDF is optimized for viewing over the web — the first page can be displayed before the rest of the file is downloaded.',
      },
    ],
    examples: [
      {
        title: 'Check a document before printing',
        description: 'Confirm the page count and paper details first.',
        code: 'report.pdf → 24 pages · PDF 1.7 · Adobe Acrobat',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Verify metadata',
        description: 'See who created a PDF and when.',
        code: 'Title · Author · Producer · Created',
        language: 'text',
      },
    ],
    relatedTools: ['pdf-text-extractor', 'pdf-pages-to-images', 'images-to-pdf'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-pdf-text-extractor',
    slug: 'pdf-text-extractor',
    title: 'PDF Text Extractor',
    description:
      'Extract all selectable text from a PDF, page by page, and download it as a plain text file — entirely in your browser with no upload.',
    shortDescription: 'Extract text from PDFs page by page.',
    category: 'pdf',
    keywords: [
      'pdf text extractor',
      'extract text from pdf',
      'pdf to text',
      'pdf text converter',
      'copy pdf text',
    ],
    tags: ['pdf', 'text', 'extractor', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Why is my extracted text empty?',
        answer:
          'Scanned documents contain images, not a text layer. OCR is needed for those — this tool extracts the selectable text layer only.',
      },
      {
        question: 'How is the output formatted?',
        answer:
          'Each page’s text is separated by a page marker, so you can see exactly where each page ends and the next begins.',
      },
      {
        question: 'Is my PDF uploaded?',
        answer: 'No. Extraction happens locally in your browser.',
      },
    ],
    examples: [
      {
        title: 'Convert a report to text',
        description: 'Grab all the text from a multi-page PDF.',
        code: 'report.pdf → report.txt (24 pages)',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Quote a passage',
        description: 'Find and copy text from a contract or article.',
        code: 'Page markers keep sections organized.',
        language: 'text',
      },
    ],
    relatedTools: ['pdf-info', 'pdf-pages-to-images', 'markdown-to-html'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-pdf-pages-to-images',
    slug: 'pdf-pages-to-images',
    title: 'PDF Pages to Images',
    description:
      'Render every page of a PDF as a high-quality JPEG image at your chosen scale, then download pages individually or all at once — locally, with no upload.',
    shortDescription: 'Convert PDF pages to JPEG images.',
    category: 'pdf',
    keywords: [
      'pdf to image',
      'pdf pages to jpeg',
      'convert pdf to images',
      'pdf to png',
      'render pdf pages',
      'pdf page screenshot',
    ],
    tags: ['pdf', 'images', 'converter', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What resolution will the images be?',
        answer:
          'The scale selects the resolution: 1× matches screen quality, 1.5× is sharp, and 2× is ideal for retina displays and printing.',
      },
      {
        question: 'Can I download a single page?',
        answer:
          'Yes — click any page number in the thumbnail list to download just that page as a JPEG.',
      },
      {
        question: 'Is my PDF uploaded?',
        answer: 'No. Pages are rendered locally in your browser.',
      },
    ],
    examples: [
      {
        title: 'Export slides as images',
        description: 'Turn a deck into JPEGs for a website.',
        code: 'deck.pdf → page-1.jpg … page-12.jpg',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Share a single page',
        description: 'Download just the page you need.',
        code: 'Preview → click a page → download',
        language: 'text',
      },
    ],
    relatedTools: ['pdf-info', 'pdf-text-extractor', 'images-to-pdf'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-images-to-pdf',
    slug: 'images-to-pdf',
    title: 'Images to PDF',
    description:
      'Combine PNG, JPEG, and WebP images into a single PDF in the order you add them — reorder, remove, and download entirely in your browser.',
    shortDescription: 'Combine images into a single PDF.',
    category: 'pdf',
    keywords: [
      'images to pdf',
      'jpg to pdf',
      'png to pdf',
      'combine images into pdf',
      'create pdf from images',
      'merge images to pdf',
    ],
    tags: ['pdf', 'images', 'converter', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What formats are supported?',
        answer:
          'PNG, JPEG, and WebP images. Each image becomes one page of the PDF, sized to the image dimensions.',
      },
      {
        question: 'How do I control the order?',
        answer:
          'The order of the grid is the order in the PDF — images are listed as added, top to bottom. Remove any image with the × button.',
      },
      {
        question: 'Is my data uploaded?',
        answer: 'No. The PDF is assembled locally in your browser.',
      },
    ],
    examples: [
      {
        title: 'Scan pages into one file',
        description: 'Combine page scans into a single PDF.',
        code: 'page1.jpg + page2.png + page3.webp → combined.pdf',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Make a photo document',
        description: 'Bundle photos for sharing or archiving.',
        code: 'photos → one PDF, one download',
        language: 'text',
      },
    ],
    relatedTools: ['pdf-pages-to-images', 'pdf-info', 'image-format-converter'],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-text-reverser',
    slug: 'text-reverser',
    title: 'Text Reverser',
    description: 'Reverse characters, words, or lines of any text instantly in your browser.',
    shortDescription: 'Reverse characters, words, or lines in text.',
    category: 'text',
    keywords: ['reverse text', 'text reverser', 'reverse words', 'reverse lines', 'backward text'],
    tags: ['text', 'utility', 'formatter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it reverse unicode?',
        answer: 'Yes, character reversal handles standard UTF-8 strings correctly.',
      },
    ],
    examples: [{ title: 'Reverse words', code: 'hello world -> world hello', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-whitespace-remover',
    slug: 'whitespace-remover',
    title: 'Whitespace Remover',
    description: 'Strip spaces, tabs, and line breaks or tidy messy whitespace quickly.',
    shortDescription: 'Remove or clean up whitespace and line breaks.',
    category: 'text',
    keywords: ['remove whitespace', 'strip spaces', 'trim lines', 'collapse spaces'],
    tags: ['text', 'utility', 'formatter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I keep line breaks?',
        answer: 'Yes, you can choose to remove only extra spaces while preserving newlines.',
      },
    ],
    examples: [
      {
        title: 'Collapse spaces',
        code: 'too   many    spaces -> too many spaces',
        language: 'text',
      },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-find-replace',
    slug: 'find-replace',
    title: 'Find & Replace',
    description:
      'Find and replace occurrences in text with case sensitivity and regular expression support.',
    shortDescription: 'Find and replace text with regex and case options.',
    category: 'text',
    keywords: ['find and replace', 'search and replace', 'regex replace'],
    tags: ['text', 'utility', 'regex'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it support regex?',
        answer: 'Yes, toggle regular expression mode for advanced pattern matching.',
      },
    ],
    examples: [{ title: 'Replace word', code: 'foo bar -> baz bar', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-keyword-density-checker',
    slug: 'keyword-density-checker',
    title: 'Keyword Density Checker',
    description: 'Analyze keyword frequency and density percentage in text for SEO optimization.',
    shortDescription: 'Check keyword frequency and density in text.',
    category: 'web',
    keywords: ['keyword density', 'seo keyword checker', 'word frequency'],
    tags: ['seo', 'text', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is ideal density?',
        answer: 'Typically 1% to 2% is a common guideline for SEO.',
      },
    ],
    examples: [
      { title: 'Count keywords', code: 'seo text analysis -> frequency counts', language: 'text' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-password-strength-checker',
    slug: 'password-strength-checker',
    title: 'Password Strength Checker',
    description:
      'Score password strength against length, variety, common patterns, and estimated crack time.',
    shortDescription: 'Score password strength and entropy.',
    category: 'security-tools',
    keywords: ['password strength', 'password checker', 'entropy calculator', 'crack time'],
    tags: ['security', 'password', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is my password sent anywhere?',
        answer: 'No, all checks happen entirely in your browser.',
      },
    ],
    examples: [
      { title: 'Check strength', code: 'correct horse battery staple -> strong', language: 'text' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-prime-number-checker',
    slug: 'prime-number-checker',
    title: 'Prime Number Checker',
    description: 'Test any whole number for primality and view its prime factorization.',
    shortDescription: 'Test primality and find prime factors.',
    category: 'numbers',
    keywords: ['prime number checker', 'isPrime', 'prime factors'],
    tags: ['math', 'numbers', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is a prime number?',
        answer: 'A whole number greater than 1 whose only divisors are 1 and itself.',
      },
    ],
    examples: [{ title: 'Check 97', code: '97 is prime', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-gcd-lcm-calculator',
    slug: 'gcd-lcm-calculator',
    title: 'GCD & LCM Calculator',
    description:
      'Calculate the greatest common divisor and least common multiple for any set of numbers.',
    shortDescription: 'Calculate GCD and LCM for numbers.',
    category: 'numbers',
    keywords: [
      'gcd calculator',
      'lcm calculator',
      'greatest common divisor',
      'least common multiple',
    ],
    tags: ['math', 'numbers', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How many numbers can I input?',
        answer: 'Any number of values separated by commas or spaces.',
      },
    ],
    examples: [{ title: 'GCD of 12, 18', code: 'GCD(12, 18) = 6', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-unit-converter',
    slug: 'unit-converter',
    title: 'Unit Converter',
    description:
      'Convert between length, weight, data size, temperature, and speed units instantly.',
    shortDescription: 'Convert units for length, weight, data size, and temperature.',
    category: 'numbers',
    keywords: ['unit converter', 'length converter', 'weight converter', 'data size converter'],
    tags: ['converter', 'utility', 'math'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which units are supported?',
        answer: 'Metric, imperial, SI and binary data sizes, temperature scales, and speed.',
      },
    ],
    examples: [{ title: 'Convert meters', code: '1 mile = 1609.34 meters', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-age-calculator',
    slug: 'age-calculator',
    title: 'Age Calculator',
    description:
      'Calculate exact age in years, months, days, and totals in weeks, days, and hours.',
    shortDescription: 'Calculate exact age from birth date.',
    category: 'date-time',
    keywords: ['age calculator', 'calculate age', 'date difference years'],
    tags: ['date', 'time', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it account for leap years?',
        answer: 'Yes, precise calendar arithmetic is used.',
      },
    ],
    examples: [
      { title: 'Calculate age', code: 'Birth date -> Years, months, days', language: 'text' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-working-days-calculator',
    slug: 'working-days-calculator',
    title: 'Working Days Calculator',
    description: 'Count working days between two dates, excluding weekends and holidays.',
    shortDescription: 'Count working days and business days between dates.',
    category: 'date-time',
    keywords: ['working days calculator', 'business days calculator', 'exclude weekends'],
    tags: ['date', 'time', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      { question: 'Are weekends excluded?', answer: 'Yes, Saturdays and Sundays can be excluded.' },
    ],
    examples: [
      {
        title: 'Working days',
        code: 'Start date to end date -> working days count',
        language: 'text',
      },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-iso-8601-converter',
    slug: 'iso-8601-converter',
    title: 'ISO 8601 Converter',
    description:
      'Parse and convert ISO 8601 strings into UTC, local, epoch, and human-readable formats.',
    shortDescription: 'Parse and format ISO 8601 date strings.',
    category: 'date-time',
    keywords: ['iso 8601 converter', 'parse iso date', 'utc date format'],
    tags: ['date', 'time', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What formats are parsed?',
        answer: 'Standard ISO 8601, date-only, offset times, and basic timestamps.',
      },
    ],
    examples: [
      { title: 'Parse ISO', code: '2026-08-08T10:30:00Z -> UTC & local', language: 'text' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-countdown-timer',
    slug: 'countdown-timer',
    title: 'Countdown Timer',
    description:
      'Set a target date and time and start a live countdown timer in days, hours, minutes, and seconds.',
    shortDescription: 'Live countdown timer to any date.',
    category: 'date-time',
    keywords: ['countdown timer', 'countdown to date', 'timer'],
    tags: ['date', 'time', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      { question: 'Can I pause?', answer: 'Yes, start, pause, and reset controls are included.' },
    ],
    examples: [
      { title: 'Countdown', code: 'Target date -> days:hours:mins:secs', language: 'text' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-json-to-xml',
    slug: 'json-to-xml',
    title: 'JSON to XML Converter',
    description:
      'Convert JSON payloads into well-formed XML with configurable root and array item tags.',
    shortDescription: 'Convert JSON documents to XML.',
    category: 'xml',
    keywords: ['json to xml', 'convert json to xml', 'json xml converter'],
    tags: ['xml', 'json', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are arrays handled?',
        answer: 'Arrays are mapped to repeating element names.',
      },
    ],
    examples: [
      { title: 'Convert JSON', code: '{"a":1} -> <root><a>1</a></root>', language: 'xml' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-code-formatter',
    slug: 'code-formatter',
    title: 'Code Formatter (JS/CSS/HTML)',
    description: 'Format or minify JavaScript, CSS, and HTML code with js-beautify.',
    shortDescription: 'Beautify or minify JavaScript, CSS, and HTML.',
    category: 'programming',
    keywords: [
      'code formatter',
      'js beautifier',
      'css beautifier',
      'html formatter',
      'minify code',
    ],
    tags: ['programming', 'formatter', 'web'],
    pricing: 'free',
    featured: true,
    faqs: [{ question: 'What library is used?', answer: 'Powered by js-beautify.' }],
    examples: [{ title: 'Format JS', code: 'const x=1; -> const x = 1;', language: 'javascript' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-gitignore-generator',
    slug: 'gitignore-generator',
    title: '.gitignore Generator',
    description:
      'Combine standard templates for Node, Python, Rust, Go, VS Code, and more into a custom .gitignore.',
    shortDescription: 'Generate .gitignore files from standard templates.',
    category: 'productivity',
    keywords: ['gitignore generator', 'create gitignore', 'git ignore templates'],
    tags: ['git', 'productivity', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I combine templates?',
        answer: 'Yes, select multiple templates and add custom rules.',
      },
    ],
    examples: [{ title: 'Node template', code: 'node_modules/\ndist/', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-readme-generator',
    slug: 'readme-generator',
    title: 'README Generator',
    description:
      'Create professional README.md files with title, badges, installation, and usage instructions.',
    shortDescription: 'Generate professional README.md files.',
    category: 'productivity',
    keywords: ['readme generator', 'create readme', 'markdown readme builder'],
    tags: ['markdown', 'productivity', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'Can I download the file?', answer: 'Yes, download README.md instantly.' }],
    examples: [{ title: 'README', code: '# Title\n\nDescription', language: 'markdown' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-license-generator',
    slug: 'license-generator',
    title: 'License Generator',
    description:
      'Generate standard open-source licenses (MIT, Apache 2.0, GPL 3.0, BSD, ISC) pre-filled with author and year.',
    shortDescription: 'Generate open-source license files (MIT, Apache, etc.).',
    category: 'productivity',
    keywords: ['license generator', 'mit license', 'apache license', 'open source license'],
    tags: ['productivity', 'utility', 'legal'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which licenses are available?',
        answer: 'MIT, Apache 2.0, GPL 3.0, BSD 3-Clause, and ISC.',
      },
    ],
    examples: [{ title: 'MIT', code: 'MIT License\nCopyright (c) 2026 Author', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-cron-generator',
    slug: 'cron-generator',
    title: 'Cron Expression Generator',
    description:
      'Build and parse cron expressions with visual field editors and human-readable descriptions.',
    shortDescription: 'Generate and parse cron expressions.',
    category: 'productivity',
    keywords: ['cron generator', 'cron expression parser', 'crontab builder'],
    tags: ['productivity', 'utility', 'devops'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'How many fields?', answer: 'Standard 5-field cron syntax.' }],
    examples: [{ title: 'Every day at noon', code: '0 12 * * *', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-gradient-generator',
    slug: 'gradient-generator',
    title: 'CSS Gradient Generator',
    description: 'Design linear, radial, and conic gradients with color stops and angle controls.',
    shortDescription: 'Generate CSS gradients visually.',
    category: 'color',
    keywords: ['css gradient generator', 'linear gradient', 'radial gradient', 'conic gradient'],
    tags: ['css', 'design', 'color'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'Can I add multiple stops?', answer: 'Yes, add up to 10 color stops.' }],
    examples: [
      {
        title: 'Linear',
        code: 'linear-gradient(90deg, #3b82f6 0%, #ec4899 100%)',
        language: 'css',
      },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-box-shadow-generator',
    slug: 'box-shadow-generator',
    title: 'Box Shadow Generator',
    description: 'Design CSS box shadows with offset, blur, spread, color, and inset controls.',
    shortDescription: 'Generate CSS box shadows visually.',
    category: 'color',
    keywords: ['box shadow generator', 'css shadow', 'drop shadow'],
    tags: ['css', 'design', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'Can I use inset shadows?', answer: 'Yes, toggle the inset option.' }],
    examples: [{ title: 'Shadow', code: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', language: 'css' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-border-radius-generator',
    slug: 'border-radius-generator',
    title: 'Border Radius Generator',
    description: 'Generate CSS border-radius rules with individual corner control and presets.',
    shortDescription: 'Generate CSS border radius visually.',
    category: 'color',
    keywords: ['border radius generator', 'rounded corners css'],
    tags: ['css', 'design', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I link corners?',
        answer: 'Yes, link all corners together or edit individually.',
      },
    ],
    examples: [{ title: 'Radius', code: '8px', language: 'css' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-clip-path-generator',
    slug: 'clip-path-generator',
    title: 'CSS Clip-Path Generator',
    description: 'Create polygon, circle, ellipse, and inset clip paths with presets and preview.',
    shortDescription: 'Generate CSS clip-path shapes.',
    category: 'color',
    keywords: ['clip path generator', 'css polygon shape', 'clip-path'],
    tags: ['css', 'design', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      { question: 'What shapes are supported?', answer: 'Polygon, circle, ellipse, and inset.' },
    ],
    examples: [{ title: 'Polygon', code: 'polygon(50% 0%, 100% 100%, 0% 100%)', language: 'css' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-px-rem-converter',
    slug: 'px-rem-converter',
    title: 'px ↔ rem Converter',
    description: 'Convert between pixels and rem units with configurable base font size.',
    shortDescription: 'Convert between px and rem units.',
    category: 'color',
    keywords: ['px to rem', 'rem to px', 'pixel rem converter'],
    tags: ['css', 'converter', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'What is default base size?', answer: 'Typically 16px.' }],
    examples: [{ title: 'Convert', code: '16px = 1rem', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-color-blindness-simulator',
    slug: 'color-blindness-simulator',
    title: 'Color Blindness Simulator',
    description:
      'Simulate protanopia, deuteranopia, tritanopia, and achromatopsia on colors and palettes.',
    shortDescription: 'Simulate color vision deficiencies.',
    category: 'color',
    keywords: ['color blindness simulator', 'protanopia', 'deuteranopia', 'accessibility color'],
    tags: ['color', 'accessibility', 'design'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which deficiencies are simulated?',
        answer: 'Protanopia, deuteranopia, tritanopia, and achromatopsia.',
      },
    ],
    examples: [
      { title: 'Simulate', code: 'Hex color -> color blindness variants', language: 'text' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-favicon-generator',
    slug: 'favicon-generator',
    title: 'Favicon Generator',
    description:
      'Generate favicon sizes (16x16 to 512x512) and multi-resolution ICO files from images.',
    shortDescription: 'Generate favicons and ICO files from images.',
    category: 'images',
    keywords: ['favicon generator', 'generate favicon', 'ico generator'],
    tags: ['images', 'web', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'What formats are output?', answer: 'PNG sizes and multi-resolution ICO.' }],
    examples: [{ title: 'Generate', code: 'image.png -> favicon sizes', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-meta-tag-generator',
    slug: 'meta-tag-generator',
    title: 'Meta Tag Generator',
    description: 'Generate complete HTML meta tags for SEO, Open Graph, and Twitter Cards.',
    shortDescription: 'Generate HTML meta tags for SEO and social sharing.',
    category: 'web',
    keywords: ['meta tag generator', 'seo meta tags', 'open graph generator'],
    tags: ['seo', 'web', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What tags are included?',
        answer: 'Title, description, canonical, robots, OG tags, and Twitter cards.',
      },
    ],
    examples: [
      {
        title: 'Generate tags',
        code: '<title>...</title>\n<meta name="description" ...>',
        language: 'html',
      },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-open-graph-preview',
    slug: 'open-graph-preview',
    title: 'Open Graph Preview',
    description:
      'Preview how web pages look when shared on social media by parsing Open Graph tags.',
    shortDescription: 'Preview social media sharing cards from OG tags.',
    category: 'web',
    keywords: ['open graph preview', 'og preview tool', 'social card preview'],
    tags: ['seo', 'web', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How does it work?',
        answer: 'Extracts og:title, og:description, and og:image from HTML.',
      },
    ],
    examples: [{ title: 'Preview', code: 'HTML -> Social card preview', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-robots-txt-generator',
    slug: 'robots-txt-generator',
    title: 'Robots.txt Generator',
    description:
      'Create robots.txt files with user-agent, allow/disallow rules, sitemap, and crawl delay.',
    shortDescription: 'Generate robots.txt files for search engines.',
    category: 'web',
    keywords: ['robots.txt generator', 'create robots txt', 'crawler rules'],
    tags: ['seo', 'web', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I add multiple rules?',
        answer: 'Yes, add multiple allow and disallow paths.',
      },
    ],
    examples: [{ title: 'Robots', code: 'User-agent: *\nDisallow: /admin/', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-sitemap-generator',
    slug: 'sitemap-generator',
    title: 'Sitemap.xml Generator',
    description:
      'Create standards-compliant sitemap.xml files with URLs, lastmod, changefreq, and priority.',
    shortDescription: 'Generate sitemap.xml files for websites.',
    category: 'web',
    keywords: ['sitemap generator', 'sitemap.xml builder', 'xml sitemap'],
    tags: ['seo', 'web', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What attributes are supported?',
        answer: 'loc, lastmod, changefreq, and priority.',
      },
    ],
    examples: [
      { title: 'Sitemap', code: '<?xml version="1.0"?>\n<urlset>...</urlset>', language: 'xml' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-htaccess-generator',
    slug: 'htaccess-generator',
    title: '.htaccess Generator',
    description:
      'Generate Apache .htaccess rules for HTTPS enforcement, www redirects, and custom rules.',
    shortDescription: 'Generate Apache .htaccess configuration files.',
    category: 'infrastructure',
    keywords: ['htaccess generator', 'apache htaccess', 'force https redirect'],
    tags: ['devops', 'infrastructure', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      { question: 'Does it support www redirects?', answer: 'Yes, add or remove www prefix.' },
    ],
    examples: [
      { title: 'HTTPS', code: 'RewriteEngine On\nRewriteCond %{HTTPS} off...', language: 'apache' },
    ],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-what-is-my-ip',
    slug: 'what-is-my-ip',
    title: "What's My IP",
    description: 'View your public IP address, location, ISP, timezone, and network details.',
    shortDescription: 'Check your public IP address and network info.',
    category: 'network',
    keywords: ["what's my ip", 'my ip address', 'ip lookup', 'geo ip'],
    tags: ['network', 'utility', 'web'],
    pricing: 'free',
    featured: true,
    faqs: [
      {
        question: 'Is my IP stored?',
        answer: 'Only in your local browser history for quick reference.',
      },
    ],
    examples: [{ title: 'IP', code: '192.0.2.1 -> City, Country, ISP', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-svg-optimizer',
    slug: 'svg-optimizer',
    title: 'SVG Optimizer',
    description:
      'Minify SVG code by stripping comments, whitespace, metadata, and redundant attributes.',
    shortDescription: 'Optimize and minify SVG files.',
    category: 'images',
    keywords: ['svg optimizer', 'minify svg', 'clean svg code'],
    tags: ['svg', 'images', 'formatter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I preview the result?',
        answer: 'Yes, live visual preview of the optimized SVG.',
      },
    ],
    examples: [{ title: 'Optimize', code: '<svg>...</svg> -> minified svg', language: 'xml' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-csv-to-excel',
    slug: 'csv-to-excel',
    title: 'CSV to Excel Converter',
    description:
      'Convert CSV data into Excel (.xlsx) spreadsheet files with automatic type detection.',
    shortDescription: 'Convert CSV files to Excel (.xlsx).',
    category: 'csv',
    keywords: ['csv to excel', 'convert csv to xlsx', 'csv spreadsheet converter'],
    tags: ['csv', 'excel', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [{ question: 'What file format is output?', answer: 'Standard Excel .xlsx format.' }],
    examples: [{ title: 'Convert', code: 'data.csv -> data.xlsx', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-excel-to-csv',
    slug: 'excel-to-csv',
    title: 'Excel to CSV Converter',
    description:
      'Convert Excel (.xlsx, .xls) spreadsheets to CSV format with sheet selection and delimiters.',
    shortDescription: 'Convert Excel spreadsheets to CSV.',
    category: 'csv',
    keywords: ['excel to csv', 'xlsx to csv', 'convert excel file'],
    tags: ['excel', 'csv', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I choose sheets?',
        answer: 'Yes, select any sheet from multi-sheet workbooks.',
      },
    ],
    examples: [{ title: 'Convert', code: 'data.xlsx -> data.csv', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-bcrypt-generator',
    slug: 'bcrypt-generator',
    title: 'Bcrypt Hash Generator & Checker',
    description:
      'Generate secure bcrypt password hashes with adjustable cost factor and verify passwords.',
    shortDescription: 'Generate and verify bcrypt password hashes.',
    category: 'security-tools',
    keywords: ['bcrypt generator', 'bcrypt hash', 'password hash verifier'],
    tags: ['security', 'password', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      { question: 'What is the cost factor?', answer: 'Controls hashing CPU cost (4 to 31).' },
    ],
    examples: [{ title: 'Hash', code: 'password -> $2a$10$...', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-keypair-generator',
    slug: 'keypair-generator',
    title: 'Key Pair Generator',
    description:
      'Generate RSA or ECDSA cryptographic key pairs in PEM format using Web Crypto API.',
    shortDescription: 'Generate RSA and ECDSA key pairs in PEM format.',
    category: 'security-tools',
    keywords: ['key pair generator', 'rsa key generator', 'ecdsa generator', 'pem keys'],
    tags: ['security', 'crypto', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Are private keys safe?',
        answer: 'Generated entirely in your browser via WebCrypto.',
      },
    ],
    examples: [{ title: 'Keys', code: 'RSA 2048 -> Public/Private PEM', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-qr-code-generator',
    slug: 'qr-code-generator',
    title: 'QR Code Generator',
    description:
      'Create QR codes for URLs, WiFi, vCards, and text with custom colors and error correction.',
    shortDescription: 'Generate customized QR codes as PNG.',
    category: 'encoding',
    keywords: ['qr code generator', 'create qr code', 'wifi qr code', 'vcard qr'],
    tags: ['qr', 'generator', 'utility'],
    pricing: 'free',
    featured: true,
    faqs: [
      {
        question: 'What formats can I download?',
        answer: 'Download as high-res PNG or copy data URL.',
      },
    ],
    examples: [{ title: 'URL QR', code: 'https://example.com -> QR image', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-qr-code-scanner',
    slug: 'qr-code-scanner',
    title: 'QR Code Scanner',
    description: 'Scan QR codes using your webcam or by uploading an image file.',
    shortDescription: 'Scan QR codes with camera or image upload.',
    category: 'encoding',
    keywords: ['qr code scanner', 'scan qr code', 'webcam qr reader'],
    tags: ['qr', 'scanner', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      { question: 'Can I upload images?', answer: 'Yes, drop any image containing a QR code.' },
    ],
    examples: [{ title: 'Scan', code: 'Camera/Image -> decoded text/URL', language: 'text' }],
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-currency-converter',
    slug: 'currency-converter',
    title: 'Currency Converter',
    description:
      'Convert between world currencies with live exchange rates. Supports 100+ currencies including crypto.',
    shortDescription: 'Convert currencies with live exchange rates.',
    category: 'converters',
    keywords: [
      'currency converter',
      'exchange rate',
      'forex converter',
      'currency calculator',
      'money converter',
    ],
    tags: ['currency', 'finance', 'converter'],
    pricing: 'free',
    featured: true,
    faqs: [
      {
        question: 'How often are exchange rates updated?',
        answer: 'Exchange rates are updated hourly from a reliable API source.',
      },
      {
        question: 'Are cryptocurrency rates included?',
        answer: 'Yes, major cryptocurrencies like Bitcoin and Ethereum are included.',
      },
      {
        question: 'How accurate are the rates?',
        answer:
          'Rates are sourced from a reliable financial API and are suitable for estimation. For official transactions, please check with your bank.',
      },
    ],
    examples: [
      {
        title: 'Convert USD to EUR',
        code: '100 USD = 92.50 EUR',
        language: 'text',
        variant: 'terminal',
      },
      {
        title: 'Convert crypto to fiat',
        code: '0.01 BTC = 650.00 USD',
        language: 'text',
      },
    ],
    relatedTools: ['unit-converter', 'percentage-calculator'],
    seo: {
      title: 'Currency Converter — Live Exchange Rates',
      description:
        'Convert currencies instantly with live exchange rates. Supports 100+ currencies including crypto.',
    },
    createdAt: '2026-08-08T00:00:00.000Z',
    updatedAt: '2026-08-08T00:00:00.000Z',
  },
  {
    id: 'tool-file-size-converter',
    slug: 'file-size-converter',
    title: 'File Size Converter',
    description:
      'Convert file sizes between bytes, KB, MB, GB, and TB with both decimal (SI) and binary (IEC) units.',
    shortDescription: 'Convert between bytes, KB, MB, GB, and TB.',
    category: 'converters',
    keywords: ['file size converter', 'bytes to mb', 'gb to mb', 'mb to kb', 'data size'],
    tags: ['converter', 'utility', 'files'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the difference between MB and MiB?',
        answer:
          'MB uses decimal (1,000,000 bytes) while MiB uses binary (1,048,576 bytes). Hard drive sizes are usually decimal; RAM is binary.',
      },
      {
        question: 'Which unit is correct for my case?',
        answer:
          'Use binary units (KiB, MiB) for memory and most developer tools, decimal units (KB, MB) for storage marketing sizes.',
      },
    ],
    examples: [{ title: 'Convert 2 GB', code: '2 GB = 2,000 MB = 1.86 GiB', language: 'text' }],
    relatedTools: ['unit-converter', 'number-base-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-coordinate-converter',
    slug: 'coordinate-converter',
    title: 'Coordinate Converter',
    description:
      'Convert geographic coordinates between decimal degrees and degrees-minutes-seconds (DMS) formats.',
    shortDescription: 'Convert between decimal and DMS coordinates.',
    category: 'converters',
    keywords: [
      'coordinate converter',
      'decimal to dms',
      'dms to decimal',
      'gps coordinates',
      'latitude longitude',
    ],
    tags: ['converter', 'geo', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What format does Google Maps use?',
        answer:
          'Google Maps accepts decimal degrees (e.g., 37.7749, -122.4194). DMS uses degrees, minutes, and seconds with N/S/E/W suffixes.',
      },
      {
        question: 'Does it handle negative coordinates?',
        answer:
          'Yes — negative latitudes mean south, negative longitudes mean west, and the converter maps them to S/W correctly.',
      },
    ],
    examples: [
      {
        title: 'Decimal to DMS',
        code: '37.7749\u00b0, -122.4194\u00b0 -> 37\u00b0 46\u2032 29.64\u2033 N, 122\u00b0 25\u2032 9.84\u2033 W',
        language: 'text',
      },
    ],
    relatedTools: ['unit-converter', 'file-size-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-timezone-meeting-planner',
    slug: 'timezone-meeting-planner',
    title: 'Time Zone Meeting Planner',
    description:
      'Find overlapping working hours across multiple time zones to schedule meetings that work for everyone.',
    shortDescription: 'Find overlapping availability across time zones.',
    category: 'date-time',
    keywords: [
      'meeting planner',
      'time zone overlap',
      'schedule across timezones',
      'world clock meeting',
    ],
    tags: ['date', 'time', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How is overlap calculated?',
        answer:
          'Each time zone is shifted to your local date and the working window (default 9am to 5pm) is intersected across all selected zones.',
      },
      {
        question: 'Can I use custom working hours?',
        answer: 'Yes, adjust the start and end hour for the working window.',
      },
    ],
    examples: [
      { title: 'NY + London + Tokyo', code: 'Overlap found: 8:00 - 9:00 AM UTC', language: 'text' },
    ],
    relatedTools: ['timezone-converter', 'timestamp-converter', 'working-days-calculator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-working-days-adder',
    slug: 'working-days-adder',
    title: 'Working Days Adder',
    description:
      'Add or subtract a number of business days to a date, skipping weekends and holidays.',
    shortDescription: 'Add or subtract N working days to a date.',
    category: 'date-time',
    keywords: [
      'working days adder',
      'add business days',
      'business day calculator',
      'due date calculator',
    ],
    tags: ['date', 'time', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Are weekends skipped?',
        answer:
          'Yes, Saturdays and Sundays are skipped by default. You can also list custom holiday dates to exclude.',
      },
      {
        question: 'Can I subtract days?',
        answer: 'Yes, use a negative count to find the date N working days before a target.',
      },
    ],
    examples: [
      {
        title: 'Add 5 working days',
        code: 'Mon Aug 10 2026 + 5 working days = Mon Aug 17 2026',
        language: 'text',
      },
    ],
    relatedTools: ['working-days-calculator', 'date-difference-calculator', 'age-calculator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-rrule-calculator',
    slug: 'rrule-calculator',
    title: 'Recurring Event (RRULE) Calculator',
    description:
      'Build common recurring event rules (daily, weekly, monthly, yearly) and preview the next occurrence dates.',
    shortDescription: 'Generate recurrence rules and preview next occurrences.',
    category: 'date-time',
    keywords: [
      'rrule calculator',
      'recurring event generator',
      'recurrence rule',
      'icalendar repeat',
    ],
    tags: ['date', 'time', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is an RRULE?',
        answer:
          'An RFC 5545 recurrence rule (e.g., FREQ=WEEKLY;INTERVAL=2) used by iCalendar and calendar apps to describe repeating events.',
      },
      {
        question: 'Does it generate full RFC 5545 rules?',
        answer:
          'It builds standard FREQ, INTERVAL, BYDAY, and COUNT/UNTIL rules for common patterns and previews the resulting dates.',
      },
    ],
    examples: [
      { title: 'Biweekly Mondays', code: 'FREQ=WEEKLY;INTERVAL=2;BYDAY=MO', language: 'text' },
    ],
    relatedTools: ['cron-generator', 'date-difference-calculator', 'countdown-timer'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-json-schema-generator',
    slug: 'json-schema-generator',
    title: 'JSON Schema Generator',
    description:
      'Generate a JSON Schema (draft 2020-12) from a sample JSON payload, with inferred types, required fields, and enum detection.',
    shortDescription: 'Generate JSON Schema from sample JSON data.',
    category: 'json',
    keywords: ['json schema generator', 'generate json schema', 'schema from json', 'jsonschema'],
    tags: ['json', 'schema', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which JSON Schema draft is generated?',
        answer:
          'Draft 2020-12 with type inference, required property detection, and enums when all array values are identical.',
      },
      {
        question: 'Can I use it for API validation?',
        answer:
          'Yes — paste a sample API response and use the generated schema in tools like AJV or OpenAPI definitions.',
      },
    ],
    examples: [
      {
        title: 'From sample payload',
        code: '{"id": 1, "name": "Ada"} -> {"type": "object", "properties": {...}}',
        language: 'json',
      },
    ],
    relatedTools: ['json-formatter', 'json-validator', 'json-to-typescript'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-json-to-typescript',
    slug: 'json-to-typescript',
    title: 'JSON to TypeScript Interface Generator',
    description:
      'Generate TypeScript interfaces or types from a JSON payload, with nullable and optional property detection.',
    shortDescription: 'Convert JSON payloads into TypeScript interfaces.',
    category: 'json',
    keywords: [
      'json to typescript',
      'generate typescript interface',
      'json to ts',
      'types from json',
    ],
    tags: ['json', 'typescript', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it handle nested objects and arrays?',
        answer: 'Yes — nested objects become child interfaces and arrays infer their element type.',
      },
      {
        question: 'Can I choose interface or type?',
        answer: 'Yes, toggle between interface declarations and type aliases.',
      },
    ],
    examples: [
      {
        title: 'From API response',
        code: '{"user": {"id": 1}} -> interface User { id: number }',
        language: 'typescript',
      },
    ],
    relatedTools: ['json-formatter', 'json-schema-generator', 'json-to-structs'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-json-to-structs',
    slug: 'json-to-structs',
    title: 'JSON to Python/Java/Go Struct Generator',
    description:
      'Convert JSON payloads into Python dataclasses, Java classes, or Go structs with proper type mapping.',
    shortDescription: 'Generate Python, Java, and Go classes from JSON.',
    category: 'json',
    keywords: [
      'json to python',
      'json to java',
      'json to go',
      'struct generator',
      'dataclass from json',
    ],
    tags: ['json', 'generator', 'programming'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which languages are supported?',
        answer: 'Python dataclasses, Java POJOs, and Go structs with JSON tags.',
      },
      {
        question: 'How are types mapped?',
        answer:
          'JSON types map to language-native types: string -> str/String/string, number -> float/double/float64, boolean -> bool/boolean/bool.',
      },
    ],
    examples: [
      {
        title: 'Go struct',
        code: '{"id": 1, "name": "Ada"} -> type Item struct { ID int \u0060json:"id"\u0060 ... }',
        language: 'go',
      },
    ],
    relatedTools: ['json-formatter', 'json-to-typescript', 'json-schema-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-config-file-converter',
    slug: 'config-file-converter',
    title: 'TOML/INI to JSON Converter',
    description:
      'Convert configuration files between TOML, INI, and JSON formats with nested section support.',
    shortDescription: 'Convert between TOML, INI, and JSON config formats.',
    category: 'converters',
    keywords: ['toml to json', 'ini to json', 'config converter', 'toml converter', 'ini parser'],
    tags: ['converter', 'config', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which syntax is supported for TOML?',
        answer:
          'Key-value pairs, tables, arrays, inline arrays, booleans, numbers, and basic strings.',
      },
      {
        question: 'How are INI sections handled?',
        answer:
          'INI sections become nested JSON objects; keys without a section go to the root object.',
      },
    ],
    examples: [
      {
        title: 'TOML to JSON',
        code: '[server]\nport = 8080 -> {"server": {"port": 8080}}',
        language: 'text',
      },
    ],
    relatedTools: ['yaml-to-json', 'json-to-yaml', 'json-formatter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-dockerfile-generator',
    slug: 'dockerfile-generator',
    title: 'Dockerfile Generator',
    description:
      'Generate production-ready Dockerfiles for Node.js, Python, Go, and static sites with best-practice stages.',
    shortDescription: 'Generate Dockerfiles for common stacks.',
    category: 'infrastructure',
    keywords: [
      'dockerfile generator',
      'dockerfile template',
      'create dockerfile',
      'docker multistage',
    ],
    tags: ['docker', 'infrastructure', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which stacks are supported?',
        answer:
          'Node.js, Python, Go, and static sites, each with multi-stage builds where sensible.',
      },
      {
        question: 'Is the output production-ready?',
        answer:
          'It follows Docker best practices: pinned base images, non-root users, layer caching, and .dockerignore tips.',
      },
    ],
    examples: [
      {
        title: 'Node.js',
        code: 'FROM node:22-alpine AS build\nWORKDIR /app\nCOPY package*.json ./\nRUN npm ci',
        language: 'dockerfile',
      },
    ],
    relatedTools: ['docker', 'gitignore-generator', 'htaccess-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-markdown-table-generator',
    slug: 'markdown-table-generator',
    title: 'Markdown Table Generator',
    description:
      'Build Markdown tables by pasting CSV/TSV data or filling cells manually, with alignment options.',
    shortDescription: 'Generate Markdown tables from data or manually.',
    category: 'markdown',
    keywords: ['markdown table generator', 'create markdown table', 'md table builder'],
    tags: ['markdown', 'generator', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I paste CSV data?',
        answer: 'Yes, paste comma- or tab-separated rows and they become table cells.',
      },
      {
        question: 'Does it support alignment?',
        answer: 'Yes, choose left, center, or right alignment for the generated column headers.',
      },
    ],
    examples: [
      {
        title: 'From CSV',
        code: 'name,role\nAda,Engineer -> | name | role |',
        language: 'markdown',
      },
    ],
    relatedTools: ['markdown-preview', 'markdown-formatter', 'csv-to-json'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-html-table-generator',
    slug: 'html-table-generator',
    title: 'HTML Table Generator',
    description:
      'Generate clean HTML tables from pasted CSV/TSV data or manual cell entry, with styling options.',
    shortDescription: 'Generate HTML tables from CSV or manually.',
    category: 'web',
    keywords: ['html table generator', 'create html table', 'table from csv', 'html table builder'],
    tags: ['html', 'web', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I paste spreadsheet data?',
        answer:
          'Yes, paste CSV or TSV rows and the tool builds a semantic table with thead and tbody.',
      },
      {
        question: 'Are classes included?',
        answer:
          'Basic utility classes for borders, stripes, and hover states are included and easy to remove.',
      },
    ],
    examples: [
      {
        title: 'From CSV',
        code: 'name,role\nAda,Engineer -> <table><thead><tr><th>name</th>...',
        language: 'html',
      },
    ],
    relatedTools: ['html-to-markdown', 'markdown-table-generator', 'csv-viewer'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-json-ld-generator',
    slug: 'json-ld-generator',
    title: 'JSON-LD (Schema.org) Generator',
    description:
      'Generate structured data JSON-LD for Article, Product, FAQ, BreadcrumbList, and other Schema.org types.',
    shortDescription: 'Generate Schema.org JSON-LD structured data.',
    category: 'web',
    keywords: [
      'json-ld generator',
      'schema.org generator',
      'structured data',
      'rich snippets',
      'ld+json',
    ],
    tags: ['seo', 'web', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which schema types are supported?',
        answer:
          'Article, Product, FAQPage, BreadcrumbList, Organization, WebSite, and LocalBusiness.',
      },
      {
        question: 'Does it pass Google validation?',
        answer:
          'Output follows Schema.org and Google rich-results guidelines; validate the result with Google Rich Results Test.',
      },
    ],
    examples: [
      {
        title: 'Article',
        code: '<script type="application/ld+json">{"@context": "https://schema.org", "@type": "Article", ...}</script>',
        language: 'html',
      },
    ],
    relatedTools: ['meta-tag-generator', 'open-graph-preview', 'sitemap-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-twitter-card-preview',
    slug: 'twitter-card-preview',
    title: 'Twitter Card Preview',
    description:
      'Preview how a page renders as a Twitter/X card by entering its URL or pasting the Open Graph tags directly.',
    shortDescription: 'Preview Twitter card rendering for your pages.',
    category: 'web',
    keywords: [
      'twitter card preview',
      'x card preview',
      'twitter card validator',
      'social card check',
    ],
    tags: ['seo', 'web', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How does the preview work?',
        answer:
          'Paste your Open Graph and Twitter meta tags and see exactly how Twitter would render the summary or summary_large_image card.',
      },
      {
        question: 'What makes a card fail?',
        answer:
          'Missing twitter:card, oversized images, or missing og:title typically cause fallback rendering without an image.',
      },
    ],
    examples: [
      {
        title: 'Card types',
        code: 'summary_large_image -> large preview with image',
        language: 'text',
      },
    ],
    relatedTools: ['open-graph-preview', 'meta-tag-generator', 'json-ld-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-curl-generator',
    slug: 'curl-generator',
    title: 'cURL Command Generator',
    description:
      'Build cURL commands visually (method, headers, body, auth) and convert them to JavaScript fetch code.',
    shortDescription: 'Generate cURL commands and fetch code.',
    category: 'api-development',
    keywords: ['curl generator', 'curl command builder', 'curl to fetch', 'api request builder'],
    tags: ['api', 'curl', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I generate fetch code too?',
        answer: 'Yes, switch between cURL and JavaScript fetch output for the same request.',
      },
      {
        question: 'How is JSON body handled?',
        answer:
          'The body is set as a JSON payload with the Content-Type header applied automatically.',
      },
    ],
    examples: [
      {
        title: 'POST with JSON',
        code: 'curl -X POST https://api.example.com/v1/users -H "Content-Type: application/json" -d \'{"name":"Ada"}\'',
        language: 'bash',
      },
    ],
    relatedTools: ['postman', 'http-status-explorer', 'url-builder'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-graphql-formatter',
    slug: 'graphql-formatter',
    title: 'GraphQL Query Formatter',
    description:
      'Format and pretty-print GraphQL queries and schemas with proper indentation and argument alignment.',
    shortDescription: 'Format and minify GraphQL queries.',
    category: 'api-development',
    keywords: [
      'graphql formatter',
      'format graphql query',
      'graphql pretty print',
      'graphql beautifier',
    ],
    tags: ['graphql', 'api', 'formatter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it preserve comments?',
        answer: 'Yes, both # comments and block string arguments are preserved.',
      },
      {
        question: 'Can it minify?',
        answer: 'Yes, a compact mode strips whitespace for shorter requests.',
      },
    ],
    examples: [
      {
        title: 'Format query',
        code: 'query{user(id:1){name}} -> query { user(id: 1) { name } }',
        language: 'graphql',
      },
    ],
    relatedTools: ['postman', 'json-formatter', 'curl-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-mac-address-generator',
    slug: 'mac-address-generator',
    title: 'MAC Address Generator',
    description:
      'Generate random MAC addresses in common formats (colon, hyphen, dot) with optional unicast/multicast flags.',
    shortDescription: 'Generate random MAC addresses.',
    category: 'network',
    keywords: ['mac address generator', 'random mac', 'generate mac address', 'mac address format'],
    tags: ['network', 'generator', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Are the addresses valid?',
        answer:
          'Yes — generated addresses respect the unicast/multicast and locally administered bit rules.',
      },
      {
        question: 'Which formats are available?',
        answer: 'Colon (aa:bb:cc), hyphen (aa-bb-cc), and Cisco dot (aabb.ccdd.eeff) notation.',
      },
    ],
    examples: [{ title: 'Colon format', code: '02:1a:2b:3c:4d:5e', language: 'text' }],
    relatedTools: ['ip-lookup', 'uuid-generator', 'what-is-my-ip'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-jwt-encoder',
    slug: 'jwt-encoder',
    title: 'JWT Encoder',
    description:
      'Create signed JWTs with custom header and payload claims, choosing between HS256 and RS256 signing.',
    shortDescription: 'Encode and sign JSON Web Tokens.',
    category: 'security-tools',
    keywords: ['jwt encoder', 'create jwt', 'jwt signer', 'generate token', 'hs256'],
    tags: ['security', 'jwt', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How is the token signed?',
        answer:
          'HS256 uses a shared secret with the Web Crypto API; RS256 uses a PEM private key. All signing happens in your browser.',
      },
      {
        question: 'Is the secret stored?',
        answer: 'No — nothing leaves your browser and no values are persisted.',
      },
    ],
    examples: [
      {
        title: 'Encode claims',
        code: '{"sub": "123", "exp": 1893456000} -> eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
        language: 'text',
      },
    ],
    relatedTools: ['jwt-decoder', 'jwt-inspector', 'api-key-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-htpasswd-generator',
    slug: 'htpasswd-generator',
    title: 'htpasswd Generator',
    description:
      'Generate htpasswd entries with bcrypt or SHA1 hashing for Apache basic authentication.',
    shortDescription: 'Generate .htpasswd password entries.',
    category: 'security-tools',
    keywords: ['htpasswd generator', 'apache htpasswd', 'htpasswd hash', 'basic auth password'],
    tags: ['security', 'apache', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which hashing algorithms are supported?',
        answer: 'bcrypt ($2y$) for Apache 2.4+ and legacy {SHA} base64 for older servers.',
      },
      {
        question: 'Is the password stored anywhere?',
        answer: 'No — hashing happens entirely in your browser.',
      },
    ],
    examples: [{ title: 'bcrypt entry', code: 'alice:$2y$10$9k4X...', language: 'text' }],
    relatedTools: ['bcrypt-generator', 'basic-auth-header-generator', 'password-strength-checker'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-basic-auth-header-generator',
    slug: 'basic-auth-header-generator',
    title: 'Basic Auth Header Generator',
    description: 'Generate the Authorization: Basic header value for a username and password pair.',
    shortDescription: 'Generate Basic Authorization headers.',
    category: 'security-tools',
    keywords: [
      'basic auth header',
      'authorization basic',
      'base64 auth header',
      'basic auth generator',
    ],
    tags: ['security', 'auth', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How does Basic auth work?',
        answer:
          'The username and password are joined with a colon and base64-encoded into the Authorization header value.',
      },
      {
        question: 'Is it secure?',
        answer:
          'Basic auth transmits credentials base64-encoded — always use it over HTTPS and prefer stronger flows where possible.',
      },
    ],
    examples: [
      { title: 'Header value', code: 'Authorization: Basic YWxpY2U6czNjcjN0', language: 'text' },
    ],
    relatedTools: ['htpasswd-generator', 'base64-encoder-decoder', 'api-key-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-api-key-generator',
    slug: 'api-key-generator',
    title: 'API Key / Token Generator',
    description:
      'Generate secure random API keys, secrets, and tokens in customizable formats with entropy display.',
    shortDescription: 'Generate secure API keys and tokens.',
    category: 'security-tools',
    keywords: ['api key generator', 'token generator', 'secret key generator', 'random key'],
    tags: ['security', 'api', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are keys generated?',
        answer:
          'Using crypto.getRandomValues for cryptographically secure random bytes, encoded as hex or base64url.',
      },
      {
        question: 'Can I add a prefix?',
        answer: 'Yes, e.g. sk_, pk_, or your own prefix like most SaaS platforms do.',
      },
    ],
    examples: [{ title: 'API key', code: 'sk_live_51McVxE...', language: 'text' }],
    relatedTools: ['uuid-generator', 'keypair-generator', 'jwt-encoder'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-html-entity-converter',
    slug: 'html-entity-converter',
    title: 'HTML Entity Encoder / Decoder',
    description: 'Encode or decode HTML entities for all named entities and Unicode characters.',
    shortDescription: 'Encode and decode HTML entities.',
    category: 'encoding',
    keywords: [
      'html entity encoder',
      'html decode',
      'encode html characters',
      'html entity converter',
      'nbsp decode',
    ],
    tags: ['encoding', 'html', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it handle named entities?',
        answer:
          'Yes — common named entities like &amp;, &lt;, &copy;, and thousands of Unicode entities are supported.',
      },
      {
        question: 'What is encoding used for?',
        answer:
          'Encoding prevents HTML injection and displays reserved characters correctly when embedding user content.',
      },
    ],
    examples: [
      { title: 'Encode', code: '<b>Hello</b> -> &lt;b&gt;Hello&lt;/b&gt;', language: 'text' },
    ],
    relatedTools: ['base64-encoder-decoder', 'url-encoder-decoder', 'markdown-to-html'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-punycode-converter',
    slug: 'punycode-converter',
    title: 'Punycode / IDN Converter',
    description:
      'Convert internationalized domain names (IDN) between Unicode and punycode (xn--) notation.',
    shortDescription: 'Convert Unicode domains to punycode and back.',
    category: 'encoding',
    keywords: [
      'punycode converter',
      'idn converter',
      'unicode domain to punycode',
      'xn-- converter',
      'international domain',
    ],
    tags: ['encoding', 'domain', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is punycode?',
        answer:
          'A bootstring encoding that maps Unicode characters to ASCII so international domain names work in DNS.',
      },
      {
        question: 'Why do I see xn-- domains?',
        answer:
          'Browsers and DNS use the punycode (xn--) form internally; the Unicode form is for display and input.',
      },
    ],
    examples: [
      { title: 'Convert IDN', code: 'm\u00fcnchen.de -> xn--mnchen-3ya.de', language: 'text' },
    ],
    relatedTools: ['url-encoder-decoder', 'dns-lookup', 'slug-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-base32-converter',
    slug: 'base32-converter',
    title: 'Base32 Encoder / Decoder',
    description:
      'Encode or decode data using RFC 4648 base32 (and base32hex) with optional padding.',
    shortDescription: 'Encode and decode base32 strings.',
    category: 'encoding',
    keywords: ['base32 encoder', 'base32 decoder', 'base32hex', 'rfc 4648 base32'],
    tags: ['encoding', 'utility', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Where is base32 used?',
        answer:
          'TOTP/HOTP secrets, DNS keys, and anywhere case-insensitive, human-friendly encoding is needed.',
      },
      {
        question: 'Does it support base32hex?',
        answer: 'Yes, toggle between standard RFC 4648 alphabet and base32hex.',
      },
    ],
    examples: [{ title: 'Encode', code: 'Hello -> JBSWY3DP', language: 'text' }],
    relatedTools: ['base64-encoder-decoder', 'url-encoder-decoder', 'html-entity-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-duplicate-line-remover',
    slug: 'duplicate-line-remover',
    title: 'Duplicate Line Remover',
    description:
      'Remove duplicate lines from text with options for case sensitivity and line trimming.',
    shortDescription: 'Remove duplicate lines from text.',
    category: 'text',
    keywords: ['remove duplicate lines', 'dedupe lines', 'duplicate line remover', 'unique lines'],
    tags: ['text', 'utility', 'formatter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Does it keep the first occurrence?',
        answer: 'Yes, the first occurrence of each line is kept by default, preserving order.',
      },
      { question: 'Can it ignore case?', answer: 'Yes, toggle case-insensitive deduplication.' },
    ],
    examples: [{ title: 'Dedupe', code: 'a\na\nb -> a\nb', language: 'text' }],
    relatedTools: ['text-sorter', 'whitespace-remover', 'find-replace'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-text-sorter',
    slug: 'text-sorter',
    title: 'Text Sorter',
    description:
      'Sort text lines alphabetically, reverse, by length, or randomly shuffled, with case options.',
    shortDescription: 'Sort or shuffle lines of text.',
    category: 'text',
    keywords: ['text sorter', 'sort lines', 'alphabetize text', 'shuffle lines', 'sort by length'],
    tags: ['text', 'utility', 'formatter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What sort orders are available?',
        answer: 'A-Z, Z-A, shortest to longest, longest to shortest, and random shuffle.',
      },
      {
        question: 'Does it remove duplicates?',
        answer: 'No, but it pairs well with the duplicate line remover.',
      },
    ],
    examples: [{ title: 'Sort A-Z', code: 'b\na\nc -> a\nb\nc', language: 'text' }],
    relatedTools: ['duplicate-line-remover', 'text-reverser', 'random-number-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-palindrome-checker',
    slug: 'palindrome-checker',
    title: 'Palindrome Checker',
    description:
      'Check if a word, phrase, or number reads the same forward and backward, ignoring case, spaces, and punctuation.',
    shortDescription: 'Check text and numbers for palindromes.',
    category: 'text',
    keywords: ['palindrome checker', 'is palindrome', 'palindrome test'],
    tags: ['text', 'utility', 'fun'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Is punctuation ignored?',
        answer:
          'By default spaces, punctuation, and case are ignored — e.g., "A man, a plan, a canal: Panama" is a palindrome.',
      },
      {
        question: 'Can I check numbers?',
        answer: 'Yes, any input is checked, including numeric palindromes like 12321.',
      },
    ],
    examples: [{ title: 'Phrase', code: 'racecar -> yes, palindrome', language: 'text' }],
    relatedTools: ['text-reverser', 'case-converter', 'character-counter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-morse-code-translator',
    slug: 'morse-code-translator',
    title: 'Morse Code Translator',
    description:
      'Translate text to Morse code and back, with configurable timing for dot, dash, and spaces.',
    shortDescription: 'Encode and decode Morse code.',
    category: 'text',
    keywords: ['morse code translator', 'text to morse', 'morse decoder', 'morse generator'],
    tags: ['text', 'encoding', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are words separated?',
        answer:
          'Letters are separated by one space, words by three spaces or a slash in the decoded output.',
      },
      {
        question: 'Are numbers supported?',
        answer: 'Yes, digits 0-9 and common punctuation are supported.',
      },
    ],
    examples: [{ title: 'Encode', code: 'SOS -> ... --- ...', language: 'text' }],
    relatedTools: ['text-reverser', 'character-counter', 'base32-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-css-animation-generator',
    slug: 'css-animation-generator',
    title: 'CSS Animation / Keyframes Generator',
    description:
      'Generate CSS @keyframes animations with easing, duration, iteration, and delay controls and a live preview.',
    shortDescription: 'Generate CSS keyframes animations visually.',
    category: 'css',
    keywords: [
      'css animation generator',
      'keyframes generator',
      'css transition',
      'animation timing',
    ],
    tags: ['css', 'design', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which animations are included?',
        answer:
          'Fade, slide, bounce, pulse, spin, flip, and shake with editable keyframe percentages.',
      },
      {
        question: 'Can I edit keyframes?',
        answer:
          'Yes, adjust duration, delay, easing, iteration count, and direction, then copy the generated CSS.',
      },
    ],
    examples: [
      {
        title: 'Fade-in',
        code: '@keyframes fadeIn { from { opacity: 0 } to { opacity: 1 } }',
        language: 'css',
      },
    ],
    relatedTools: ['box-shadow-generator', 'gradient-generator', 'glassmorphism-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-css-triangle-generator',
    slug: 'css-triangle-generator',
    title: 'CSS Triangle Generator',
    description:
      'Generate CSS-only triangles with direction, size, and color controls and a live preview.',
    shortDescription: 'Generate CSS-only triangles.',
    category: 'css',
    keywords: ['css triangle generator', 'triangle css', 'css arrow', 'border trick triangle'],
    tags: ['css', 'design', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How do CSS triangles work?',
        answer:
          'They use transparent borders with one visible side — a classic border-width trick that needs no images.',
      },
      {
        question: 'Can I make arrows?',
        answer: 'Yes, rotate any triangle 45 degrees for an arrow/chevron look.',
      },
    ],
    examples: [
      {
        title: 'Up triangle',
        code: 'width: 0; height: 0; border-left: 50px solid transparent; ...',
        language: 'css',
      },
    ],
    relatedTools: ['border-radius-generator', 'clip-path-generator', 'css-animation-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-glassmorphism-generator',
    slug: 'glassmorphism-generator',
    title: 'Glassmorphism / Neumorphism Generator',
    description:
      'Generate glassmorphism and neumorphism CSS styles with blur, transparency, and highlight controls.',
    shortDescription: 'Generate glassmorphism and neumorphism CSS.',
    category: 'css',
    keywords: [
      'glassmorphism generator',
      'neumorphism generator',
      'glass effect css',
      'frosted glass css',
    ],
    tags: ['css', 'design', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is the difference between the two styles?',
        answer:
          'Glassmorphism uses translucent backgrounds with backdrop blur; neumorphism uses soft dual shadows for a raised look.',
      },
      {
        question: 'Are there fallbacks?',
        answer:
          'The generated code includes graceful fallbacks for browsers without backdrop-filter support.',
      },
    ],
    examples: [
      {
        title: 'Glass panel',
        code: 'background: rgba(255, 255, 255, 0.25); backdrop-filter: blur(12px);',
        language: 'css',
      },
    ],
    relatedTools: ['box-shadow-generator', 'gradient-generator', 'border-radius-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-css-specificity-calculator',
    slug: 'css-specificity-calculator',
    title: 'CSS Specificity Calculator',
    description:
      'Calculate and compare CSS selector specificity scores (IDs, classes, elements) to debug style conflicts.',
    shortDescription: 'Calculate CSS selector specificity scores.',
    category: 'css',
    keywords: [
      'css specificity calculator',
      'specificity score',
      'css selector specificity',
      'which css wins',
    ],
    tags: ['css', 'debugging', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How is specificity calculated?',
        answer:
          'Count ID selectors (100), classes/attributes/pseudo-classes (10), and element/pseudo-element selectors (1) as in the W3C spec.',
      },
      {
        question: 'Does :is() and :not() count?',
        answer:
          'Yes — :not() and :is() take the specificity of their most specific argument, as the spec requires.',
      },
    ],
    examples: [{ title: 'Compare', code: 'div#main .card:hover -> (1, 2, 1)', language: 'text' }],
    relatedTools: ['css-animation-generator', 'glassmorphism-generator', 'code-formatter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-svg-wave-generator',
    slug: 'svg-wave-generator',
    title: 'SVG Wave / Blob Generator',
    description:
      'Generate decorative SVG waves and blobs with configurable colors, curves, and layers for hero sections.',
    shortDescription: 'Generate SVG waves and blob shapes.',
    category: 'images',
    keywords: [
      'svg wave generator',
      'svg blob generator',
      'wave divider svg',
      'svg shape generator',
    ],
    tags: ['svg', 'design', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I download the result?',
        answer: 'Yes, download the SVG file or copy the markup and background data URL.',
      },
      {
        question: 'Are the paths editable?',
        answer:
          'Yes, adjust amplitude, frequency, layers, and colors and the path is regenerated live.',
      },
    ],
    examples: [
      { title: 'Wave divider', code: '<svg viewBox="0 0 1440 320">...</svg>', language: 'xml' },
    ],
    relatedTools: ['svg-optimizer', 'gradient-generator', 'favicon-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-placeholder-image-generator',
    slug: 'placeholder-image-generator',
    title: 'Placeholder Image Generator',
    description:
      'Generate placeholder images with custom dimensions, text, and colors — perfect for layouts and mockups.',
    shortDescription: 'Generate placeholder images by dimension.',
    category: 'images',
    keywords: [
      'placeholder image generator',
      'placeholder image',
      'dummy image',
      'image placeholder 800x600',
    ],
    tags: ['images', 'design', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What format is generated?',
        answer: 'A crisp SVG placeholder you can download or use directly as an img src data URL.',
      },
      {
        question: 'Can I set the text?',
        answer: 'Yes, custom text and colors are supported — defaults to WxH dimensions.',
      },
    ],
    examples: [
      { title: '800x600', code: 'https://localhost/placeholder 800x600 -> SVG', language: 'text' },
    ],
    relatedTools: ['favicon-generator', 'image-resizer', 'image-format-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-aspect-ratio-calculator',
    slug: 'aspect-ratio-calculator',
    title: 'Aspect Ratio Calculator',
    description:
      'Calculate the aspect ratio of an image or video and find missing dimensions while keeping the ratio intact.',
    shortDescription: 'Calculate aspect ratios and missing dimensions.',
    category: 'numbers',
    keywords: [
      'aspect ratio calculator',
      '16:9 calculator',
      'ratio dimensions',
      'image ratio calculator',
    ],
    tags: ['math', 'images', 'calculator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is a common aspect ratio?',
        answer:
          '16:9 for widescreen video, 4:3 for older displays, and 1:1 for square social images.',
      },
      {
        question: 'Can I compute dimensions?',
        answer: 'Yes, enter width or height and the tool derives the other to keep the ratio.',
      },
    ],
    examples: [{ title: '16:9 at 1920', code: '1920x1080', language: 'text' }],
    relatedTools: ['percentage-calculator', 'image-resizer', 'unit-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-statistics-calculator',
    slug: 'statistics-calculator',
    title: 'Statistics Calculator',
    description:
      'Compute mean, median, mode, variance, and standard deviation for a set of numbers.',
    shortDescription: 'Calculate mean, median, mode, and standard deviation.',
    category: 'numbers',
    keywords: [
      'statistics calculator',
      'mean median mode',
      'standard deviation calculator',
      'variance calculator',
    ],
    tags: ['math', 'statistics', 'calculator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which statistics are computed?',
        answer:
          'Count, sum, mean, median, mode, range, variance, and sample/population standard deviation.',
      },
      {
        question: 'How do I input values?',
        answer: 'Space, comma, or newline separated numbers are all accepted.',
      },
    ],
    examples: [
      { title: 'Dataset', code: '1, 2, 2, 3, 4 -> mean 2.4, stddev 1.02', language: 'text' },
    ],
    relatedTools: ['percentage-calculator', 'gcd-lcm-calculator', 'prime-number-checker'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-factorial-fibonacci-generator',
    slug: 'factorial-fibonacci-generator',
    title: 'Factorial & Fibonacci Generator',
    description:
      'Compute the factorial of any number and generate Fibonacci sequences with configurable length.',
    shortDescription: 'Compute factorials and Fibonacci sequences.',
    category: 'numbers',
    keywords: [
      'factorial calculator',
      'fibonacci generator',
      'factorial of n',
      'fibonacci sequence',
    ],
    tags: ['math', 'numbers', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How large can the factorial be?',
        answer: 'Results use BigInt, so values beyond 170! are supported exactly.',
      },
      {
        question: 'Can I limit the Fibonacci sequence?',
        answer: 'Yes, choose how many terms to generate, up to a few thousand.',
      },
    ],
    examples: [{ title: 'Fibonacci', code: '0, 1, 1, 2, 3, 5, 8, 13...', language: 'text' }],
    relatedTools: ['statistics-calculator', 'prime-number-checker', 'gcd-lcm-calculator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-number-to-words',
    slug: 'number-to-words',
    title: 'Number to Words Converter',
    description: 'Convert numbers into English words, including large numbers and decimal amounts.',
    shortDescription: 'Convert numbers to written English words.',
    category: 'numbers',
    keywords: ['number to words', 'numbers in words', 'amount in words', 'spell number'],
    tags: ['numbers', 'converter', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How large can the number be?',
        answer: 'Up to the vigintillions (10^63) are supported with proper scale names.',
      },
      {
        question: 'Does it handle decimals?',
        answer:
          'Yes, decimal parts are spelled out digit by digit or as "point" followed by words.',
      },
    ],
    examples: [
      { title: 'Spell 1234', code: 'one thousand two hundred thirty-four', language: 'text' },
    ],
    relatedTools: ['number-base-converter', 'percentage-calculator', 'roman-numeral-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-quadratic-solver',
    slug: 'quadratic-solver',
    title: 'Quadratic Equation Solver',
    description:
      'Solve quadratic equations ax\u00b2 + bx + c = 0 with real and complex roots shown step by step.',
    shortDescription: 'Solve quadratic equations with steps.',
    category: 'numbers',
    keywords: [
      'quadratic solver',
      'quadratic equation calculator',
      'solve ax2 bx c',
      'discriminant',
    ],
    tags: ['math', 'numbers', 'calculator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What if the discriminant is negative?',
        answer: 'The solver returns complex roots using the imaginary unit i.',
      },
      {
        question: 'Does it show steps?',
        answer: 'Yes, the discriminant, root formula, and simplified results are displayed.',
      },
    ],
    examples: [{ title: 'x\u00b2-5x+6=0', code: 'x = 2 and x = 3', language: 'text' }],
    relatedTools: ['statistics-calculator', 'prime-number-checker', 'number-base-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-mock-data-generator',
    slug: 'mock-data-generator',
    title: 'Mock / Fake Data Generator',
    description:
      'Generate realistic fake data — names, emails, addresses, companies — as JSON or CSV rows for testing.',
    shortDescription: 'Generate realistic fake people and data rows.',
    category: 'databases',
    keywords: [
      'mock data generator',
      'fake data generator',
      'fake people',
      'test data generator',
      'seed data',
    ],
    tags: ['data', 'testing', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which fields are available?',
        answer:
          'Name, email, phone, address, city, country, company, job title, and UUID — all optional.',
      },
      {
        question: 'Can I choose the output format?',
        answer: 'Yes, generate JSON, CSV, or SQL INSERT statements for the same dataset.',
      },
    ],
    examples: [
      {
        title: 'Fake person',
        code: 'Ada Lovelace, ada.lovelace@example.com, 1847 London',
        language: 'text',
      },
    ],
    relatedTools: ['csv-to-json', 'json-to-csv', 'sql-formatter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-connection-string-parser',
    slug: 'connection-string-parser',
    title: 'Connection String Parser / Builder',
    description:
      'Parse and build database connection strings (PostgreSQL, MySQL, MongoDB, Redis) with fields edited visually.',
    shortDescription: 'Parse and build database connection strings.',
    category: 'databases',
    keywords: [
      'connection string parser',
      'database url parser',
      'mongodb uri builder',
      'postgres connection string',
    ],
    tags: ['database', 'utility', 'converter'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which database formats are supported?',
        answer: 'PostgreSQL, MySQL, MongoDB, Redis, and generic URL-style connection strings.',
      },
      {
        question: 'Does it hide passwords?',
        answer: 'Yes, display redaction is available for sharing configs safely.',
      },
    ],
    examples: [
      {
        title: 'Parse Postgres',
        code: 'postgres://user:pass@localhost:5432/db -> host, port, db',
        language: 'text',
      },
    ],
    relatedTools: ['mock-data-generator', 'supabase', 'prisma'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-csv-to-sql',
    slug: 'csv-to-sql',
    title: 'CSV to SQL INSERT Generator',
    description:
      'Convert CSV data into SQL INSERT statements with a target table name and proper escaping.',
    shortDescription: 'Generate SQL INSERT statements from CSV.',
    category: 'databases',
    keywords: [
      'csv to sql',
      'csv to insert',
      'generate sql insert',
      'csv to sqlite',
      'seed table from csv',
    ],
    tags: ['sql', 'csv', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How are values escaped?',
        answer:
          'Strings are single-quoted with doubled quotes; NULL for empty cells; numbers detected automatically.',
      },
      {
        question: 'Can I batch rows?',
        answer: 'Yes, choose one INSERT per row or multi-row batches for faster imports.',
      },
    ],
    examples: [
      {
        title: 'From CSV',
        code: "id,name\n1,Ada -> INSERT INTO table (id, name) VALUES (1, 'Ada');",
        language: 'sql',
      },
    ],
    relatedTools: ['csv-viewer', 'sql-formatter', 'mock-data-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-dice-roller',
    slug: 'dice-roller',
    title: 'Dice Roller & Coin Flip',
    description:
      'Roll standard polyhedral dice (d4 to d100) or flip a coin with animation and roll history.',
    shortDescription: 'Roll dice and flip coins online.',
    category: 'generators',
    keywords: ['dice roller', 'dnd dice', 'roll d20', 'coin flip', 'random dice'],
    tags: ['random', 'fun', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which dice are supported?',
        answer: 'd4, d6, d8, d10, d12, d20, d100, plus coin flips and custom n-sided dice.',
      },
      {
        question: 'Can I roll multiple dice?',
        answer: 'Yes, choose the number of dice to roll at once and view the total.',
      },
    ],
    examples: [{ title: 'Roll 2d6', code: '3 + 5 = 8', language: 'text' }],
    relatedTools: ['random-number-generator', 'random-color-generator', 'mock-data-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-random-color-generator',
    slug: 'random-color-generator',
    title: 'Random Color Generator',
    description:
      'Generate random colors with hex, RGB, and HSL values, with palette mode and copy on click.',
    shortDescription: 'Generate random colors and palettes.',
    category: 'generators',
    keywords: [
      'random color generator',
      'random hex color',
      'color palette random',
      'random color picker',
    ],
    tags: ['random', 'color', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Can I copy colors quickly?',
        answer: 'Yes — click any swatch to copy its hex value instantly.',
      },
      {
        question: 'Does it generate palettes?',
        answer: 'Yes, palette mode generates 5 harmonious colors at once.',
      },
    ],
    examples: [{ title: 'Random hex', code: '#3b82f6', language: 'text' }],
    relatedTools: ['color-palette-generator', 'dice-roller', 'color-converter'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-readability-score',
    slug: 'readability-score',
    title: 'Readability Score Checker',
    description:
      'Measure the readability of your text with Flesch Reading Ease, Flesch-Kincaid Grade, and other scores.',
    shortDescription: 'Check Flesch reading ease and grade level.',
    category: 'accessibility',
    keywords: [
      'readability score',
      'flesch reading ease',
      'flesch kincaid grade',
      'text readability',
      'reading level',
    ],
    tags: ['accessibility', 'text', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is a good Flesch score?',
        answer:
          '60-70 is plain English (easy), 30-50 is college level (hard). Aim high for public-facing copy.',
      },
      {
        question: 'How is the grade level computed?',
        answer:
          'Flesch-Kincaid Grade converts the score to a US school grade, combining syllables per word and words per sentence.',
      },
    ],
    examples: [
      { title: 'Sample text', code: 'Reading ease: 65.1 (Plain English)', language: 'text' },
    ],
    relatedTools: ['character-counter', 'keyword-density-checker', 'alt-text-checker'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-aria-reference',
    slug: 'aria-reference',
    title: 'ARIA Roles & Attributes Reference',
    description:
      'Searchable reference for ARIA roles, states, and properties with usage notes and examples.',
    shortDescription: 'Reference for ARIA roles and attributes.',
    category: 'accessibility',
    keywords: [
      'aria reference',
      'aria roles',
      'aria attributes',
      'wai-aria',
      'accessibility reference',
    ],
    tags: ['accessibility', 'reference', 'web'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'When should I use ARIA?',
        answer:
          'ARIA fixes accessibility gaps when native HTML is insufficient — prefer semantic HTML first.',
      },
      {
        question: 'Are ARIA roles searchable?',
        answer: 'Yes, filter by role name, attribute, or keywords like "modal" or "slider".',
      },
    ],
    examples: [
      {
        title: 'Role example',
        code: '<div role="alert">Something went wrong</div>',
        language: 'html',
      },
    ],
    relatedTools: ['readability-score', 'alt-text-checker', 'color-contrast-checker'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-alt-text-checker',
    slug: 'alt-text-checker',
    title: 'Alt Text Checker',
    description: 'Evaluate the quality of image alt text against common accessibility guidelines.',
    shortDescription: 'Check alt text quality and length.',
    category: 'accessibility',
    keywords: [
      'alt text checker',
      'alt text length',
      'image alt accessibility',
      'alt attribute check',
    ],
    tags: ['accessibility', 'seo', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How long should alt text be?',
        answer:
          'Around 125 characters or fewer for most screen readers, describing the image\u2019s purpose.',
      },
      {
        question: 'What makes bad alt text?',
        answer:
          'Filler like "image", "photo", or keywords-stuffed descriptions add noise and hurt both accessibility and SEO.',
      },
    ],
    examples: [
      {
        title: 'Good alt text',
        code: 'Orange kitten sitting on a striped blanket',
        language: 'text',
      },
    ],
    relatedTools: ['readability-score', 'aria-reference', 'keyword-density-checker'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-conventional-commit-generator',
    slug: 'conventional-commit-generator',
    title: 'Conventional Commit Generator',
    description:
      'Build conventional commit messages (feat, fix, docs, breaking changes) with commitlint-valid output.',
    shortDescription: 'Generate conventional commit messages.',
    category: 'productivity',
    keywords: [
      'conventional commits',
      'commit message generator',
      'git commit type',
      'semantic commit',
    ],
    tags: ['git', 'productivity', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What is a conventional commit?',
        answer:
          'A standardized format like "feat: add login" that enables automatic changelogs and versioning.',
      },
      {
        question: 'Is the output commitlint-compatible?',
        answer: 'Yes — generated messages pass default commitlint rules.',
      },
    ],
    examples: [
      { title: 'Feature commit', code: 'feat(auth): add password reset flow', language: 'text' },
    ],
    relatedTools: ['changelog-generator', 'gitignore-generator', 'readme-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-changelog-generator',
    slug: 'changelog-generator',
    title: 'Changelog Generator',
    description:
      'Generate a Keep a Changelog-style CHANGELOG.md from a list of changes grouped by version and type.',
    shortDescription: 'Generate Keep a Changelog-style changelogs.',
    category: 'productivity',
    keywords: [
      'changelog generator',
      'keep a changelog',
      'changelog md',
      'release notes generator',
    ],
    tags: ['markdown', 'productivity', 'generator'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'What structure is used?',
        answer:
          'The Keep a Changelog format: Added, Changed, Deprecated, Removed, Fixed, Security sections per version.',
      },
      {
        question: 'Can I add multiple versions?',
        answer: 'Yes, add as many version blocks as you need before exporting.',
      },
    ],
    examples: [
      {
        title: 'Changelog block',
        code: '## [1.1.0] - 2026-08-09\n### Added\n- New API endpoints',
        language: 'markdown',
      },
    ],
    relatedTools: ['conventional-commit-generator', 'readme-generator', 'markdown-preview'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-env-file-generator',
    slug: 'env-file-generator',
    title: '.env File Generator / Validator',
    description:
      'Generate .env and .env.example files with templates for common stacks and validate existing files.',
    shortDescription: 'Generate and validate .env files.',
    category: 'productivity',
    keywords: [
      'env generator',
      'env file validator',
      'create .env',
      'env.example template',
      'environment variables',
    ],
    tags: ['devops', 'productivity', 'utility'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'Which templates are included?',
        answer: 'Node.js, Next.js, Python/Django, Go, and database connection presets.',
      },
      {
        question: 'What does validation check?',
        answer:
          'Format issues, duplicate keys, whitespace errors, and missing values marked for attention.',
      },
    ],
    examples: [
      { title: 'Next.js env', code: 'NEXT_PUBLIC_API_URL=\nDATABASE_URL=', language: 'text' },
    ],
    relatedTools: ['dockerfile-generator', 'gitignore-generator', 'connection-string-parser'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
  {
    id: 'tool-git-cheatsheet',
    slug: 'git-cheatsheet',
    title: 'Git Cheat Sheet',
    description:
      'A searchable reference for everyday Git commands: staging, branching, merging, rebasing, and fixing mistakes.',
    shortDescription: 'Searchable reference for Git commands.',
    category: 'productivity',
    keywords: ['git cheatsheet', 'git commands', 'git cheat sheet', 'git reference', 'git basics'],
    tags: ['git', 'reference', 'productivity'],
    pricing: 'free',
    featured: false,
    faqs: [
      {
        question: 'How do I undo a commit?',
        answer:
          'git reset --soft HEAD~1 keeps changes staged; git revert commits a new inverse commit for shared branches.',
      },
      {
        question: 'What is the difference between merge and rebase?',
        answer:
          'Merge preserves history with a merge commit; rebase rewrites history for a linear log.',
      },
    ],
    examples: [
      { title: 'Stash changes', code: 'git stash push -m "wip"; git stash pop', language: 'bash' },
    ],
    relatedTools: ['gitignore-generator', 'conventional-commit-generator', 'changelog-generator'],
    createdAt: '2026-08-09T00:00:00.000Z',
    updatedAt: '2026-08-09T00:00:00.000Z',
  },
];
