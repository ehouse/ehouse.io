# ehouse.io

Personal portfolio. Vite + TypeScript, with a custom Vite build framework and theme.

## Stack

- **Vite** - bundler / dev server
- **TypeScript** - plain TS modules
- **Markdoc** - blog post authoring
- **Tailwind v4** - utility classes, `@theme` block in `src/style/theme.css`

## Dev

```bash
npm install
npm run dev
```

## Posts

Create `src/content/posts/<slug>.md` with frontmatter:

```markdown
---
title: Post Title
date: 2026-03-17
tag: Category
---

Body content.
```

### Custom Markdoc tags

| Tag                                    | Usage                           |
| -------------------------------------- | ------------------------------- |
| `{% callout %}...{% /callout %}`       | Aside block                     |
| `{% photo src="" alt="" caption="" %}` | Inline photo (caption optional) |

Add tags in `src/content/markdoc-config.ts`.

## Projects

Create `src/pages/projects/<slug>.ts`. Export `meta` and `render()`:

```ts
import type { ProjectMeta } from "../projects";
import { Nav } from "../../components/nav";
import { Layout } from "../../components/layout";
import { ProjectHeader } from "../../components/project-header";
import { html } from "../../html";

export const meta: ProjectMeta = {
  slug: "your-slug", // must match filename
  title: "Project Title",
  tag: "TypeScript",
  description: "Short description for the card.",
  photo: "https://...", // cover image URL, or "" for none
};

export function render(): string {
  return Layout(html`
    ${Nav("projects")}
    <main class="section">
      <div class="post-panel">
        ${ProjectHeader(meta)}
        <p>Write-up goes here.</p>
        <a
          href="/projects"
          data-link
          class="btn btn-ghost"
          style="margin-top: 2rem;"
        >
          ← Back to projects
        </a>
      </div>
    </main>
  `);
}
```

### Interactive pages

Export `mount(shadow: ShadowRoot): () => void` alongside `render()` for pages that need a live DOM. The router attaches a shadow root to `#mount`, calls `mount()`, and calls the returned cleanup on next navigation. Shadow DOM is isolated from global stylesheets and inject theme styles via `<link>` or `?inline` import.

## Top-level pages

1. Create `src/pages/<page>.ts` with a `render()` export
2. Add a route variant and `case` in `src/router.ts`
3. Add a nav link in `src/components/nav.ts` if needed

## Docker

```bash
docker build -t ehouse-io .
docker run -p 8080:80 ehouse-io
```

Multi-stage build: Node 22 compiles the site, nginx alpine serves `dist/`. `nginx.conf` adds the SPA fallback (`try_files → index.html`) required for client-side routing because without it, direct URLs and refreshes on any route other than `/` return 404.
