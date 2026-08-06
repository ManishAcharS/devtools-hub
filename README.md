# DevTools Hub

A production-ready foundation for a scalable developer platform — discover, compare, and master the best developer tools, resources, and learning materials.

## Tech Stack

- **Next.js 16** (App Router, Server Components by default)
- **React 19**
- **TypeScript** (strict mode)
- **Tailwind CSS v4**
- **shadcn/ui**-style design system (CVA + Radix Slot)
- **Lucide React** icons
- **ESLint + Prettier + Husky + lint-staged**

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Scripts

| Script           | Description                    |
| ---------------- | ------------------------------ |
| `npm run dev`    | Start the development server   |
| `npm run build`  | Production build               |
| `npm run start`  | Serve the production build     |
| `npm run lint`   | Run ESLint                     |
| `npm run format` | Format all files with Prettier |

## Architecture

```
src/
  app/            Route groups: (marketing), (auth), (dashboard) + tools/categories/blog/resources/search/api
  components/     ui/ (primitives) · layout/ (header, footer, nav) · shared/ (composites) · tools/ (tool pages)
  config/         site, theme, and navigation configuration
  content/        Reserved for future content pipelines (MDX, CMS)
  data/           Typed data access layer with seed data
  hooks/          Reusable client hooks (theme, media query, storage, interaction)
  lib/            Utilities: cn, SEO helpers, formatters
  styles/         Global CSS and design tokens (Tailwind v4 @theme)
  types/          Shared domain interfaces (Tool, Category, BlogPost, SEO, …)
  utils/          Reserved for pure helpers (mirrors lib, kept for separation)
```

## Design System

Reusable components with variants, accessibility, and full typing:

`Button` · `Card` · `ToolCard` · `CategoryCard` · `SearchBar` · `CopyButton` · `DownloadButton` · `ShareButton` · `FAQ` · `Breadcrumb` · `EmptyState` · `LoadingSkeleton` · `Sidebar` · `ExampleBox` · `CodeBlock` · `Toast` · `ToolLayout` · `ThemeToggle` · `NewsletterForm` · `ToolIcon`

Theming supports light, dark, and system modes with persisted preference and a hydration-safe inline bootstrap script.

## SEO Foundation

Metadata helpers, canonical/OG/Twitter helpers, and structured-data builders (WebSite, Organization, BreadcrumbList, SoftwareApplication, Article, FAQPage), plus `sitemap.ts`, `robots.ts`, and `manifest.ts`.

## Adding a Tool

1. Add the tool to `src/data/tools.ts` (fully typed).
2. Create the page at `src/app/tools/[slug]/page.tsx` using `ToolLayout` + `CodeBlock`/`ExampleBox`.
3. Metadata is generated automatically via `createToolMetadata`.
