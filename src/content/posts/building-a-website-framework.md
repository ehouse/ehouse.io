---
title: Building ehouse.io Without a Framework
date: 2026-03-17
tag: Web Development
---

I wanted a new personal site. I also wanted to find out how far plain Vite and TypeScript could take me before I needed to reach for a framework. The answer, it turns out, is pretty far.

## The render model

Initially I had reached for React or Svelte, but decided to wholely commit. There is no virtual DOM. Every page is a TypeScript module that exports a `render()` function returning an HTML string. The entire templating system is one line:

```ts
export const html = String.raw;
```

`String.raw` is a tagged template literal that suppresses escape sequence processing. It does nothing else at runtime and its only practical effect is that editors and syntax highlighters recognize the `html` tag and highlight the template content as HTML.

Pages are compose by calling component functions and interpolating the results:

```ts
export function render(): string {
  return Layout(html`
    ${Nav("home")}
    <main>...</main>
  `);
}
```

Components are functions that take arguments and return html strings. I wanted to emulate the TSX/React paradym as closely as I could as it is what I'm most used too.

## The router

Page navigation is where I expected I would need to pull in my first 3rd party library for the project, and the plan was to use Tanstack Router. But decided to stick to minimal 3rd party libraries.

Navigation is handled by a ~60-line client-side router built directly on the History API. Clicking any `<a data-link>` element triggers an event listener on `document`, which calls `history.pushState` and invokes `navigate()`. The `popstate` event handles the browser back/forward buttons.

`navigate()` matches the path with a simple regex switch, then dynamically imports the corresponding page module:

```ts
case "project": {
  const mod = await loader();
  html = mod.render();
  break;
}
```

Dynamic `import()` is standard ES modules and Vite handles the code splitting automatically. Each page module is its own chunk, loaded only when that route is visited.

## Content discovery with import.meta.glob

`import.meta.glob` is a Vite-specific API that resolves a glob pattern at build time into a static import map. Vite automatically triggers a rebuild when any of these patterns changes giving me free hot reload/dev mode.

```ts
const projectModules = import.meta.glob("../content/projects/*.ts", {
  eager: true,
});
```

## The Markdoc Vite plugin

In comes the very first 3rd party library, blog posts are authored in Markdown using Markdoc. Rather than shipping a Markdown parser to the browser, a custom Vite plugin compiles every `.md` file into a plain JavaScript module at build time.

The plugin implements Vite's `transform` hook, which intercepts file imports by extension:

```ts
function markdocPlugin(): Plugin {
  return {
    name: "markdoc",
    transform(src, id) {
      if (!id.endsWith(".md")) return;
      const ast = Markdoc.parse(src);
      // parse frontmatter, transform, render to HTML string
      return `export default ${JSON.stringify({ title, date, tag, body })}`;
    },
  };
}
```

When a `.md` file is imported anywhere in the codebase, Vite calls this hook instead of reading the file directly. The plugin parses the frontmatter, runs the full Markdoc transform pipeline, renders the result to an HTML string, and emits a JS module exporting that data as a plain object.

Markdoc ends up in `devDependencies` only and it is never in the browser bundle. It works without any additional configuration because the `.md` file is a node in Vite's module graph, editing it invalidates the module and pushes the update automatically.

## Interactive pages and Shadow DOM

Not all of my work is static and I wanted the ability to inline small React/Svelte apps to show them off. For project pages that need live DOM interaction, the router supports an optional `mount` export alongside `render`:

```ts
export function mount(shadow: ShadowRoot): () => void {
  // attach event listeners, run logic
  return () => {
    /* cleanup */
  };
}
```

The router attaches a Shadow DOM to a `#mount` element after setting `innerHTML`, then calls `mount()` with the shadow root. The returned function is called on the next navigation as cleanup. Shadow DOM provides style isolation and the embedded component cannot be affected by global stylesheets, and vice versa.

## What Vite provides

The dependencies for this entire site are Vite, TypeScript, and Markdoc. Vite's plugin API, `import.meta.glob`, and native ES module code splitting do the work that a framework would otherwise handle. The tradeoff is explicit: there is no reactivity system. Any stateful UI requires manual DOM work inside a `mount()` function. For a personal site with mostly static content, that tradeoff is straightforward.
