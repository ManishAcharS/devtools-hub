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
];
