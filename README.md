# ehouse.io

Personal site. Built with Vite + TypeScript + Markdoc.

## Stack

- **Vite** — bundler and dev server
- **TypeScript** — no framework, plain TS modules
- **Markdoc** — content authoring for posts
- **Custom CSS** — design system in `src/style/theme.css`

## Dev

```bash
npm install
npm run dev
```

## Adding a post

1. Create `src/content/posts/your-slug.md`
2. Add frontmatter:
   ```
   ---
   title: Your post title
   date: YYYY-MM-DD
   tag: Tag
   ---
   ```
3. Register it in `src/content/index.ts` — import the file and add it to the array in `loadPosts()`

## Custom Markdoc tags

| Tag | Usage |
|-----|-------|
| `{% callout %}...{% /callout %}` | Highlighted aside |
| `{% photo src="" alt="" %}` | Embedded photo |

Add new tags in `src/content/markdoc-config.ts`.

## Adding a page

1. Create `src/pages/yourpage.ts` exporting a `render()` function
2. Add the route to `src/router.ts`
3. Add the nav link to `src/components/nav.ts`
