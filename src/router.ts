/**
 * Minimal client-side router over the History API.
 *
 * navigate(path)
 *   Resolves a path to a Route, lazy-imports the matching page module,
 *   calls render(), and writes the result into #app.
 *
 * Route URLs
 *   /                  home
 *   /projects          project list
 *   /projects/:slug    individual project page
 *   /writing           post list
 *   /writing/:slug     individual post — slug is the .md filename minus the extension
 *
 * Adding a page: add a variant to Route, a match in matchRoute, a case in
 * navigate, and a <a data-link> in the nav.
 *
 * Adding a project page: drop a new file in src/pages/projects/. No router
 * changes needed — projectPages (import.meta.glob, lazy) picks it up
 * automatically. The slug is the filename minus the .ts extension.
 *
 * Interactive project pages
 *   A page module may export mount(shadow: ShadowRoot): () => void alongside
 *   render(). The router attaches a shadow root to #mount and calls mount()
 *   after setting innerHTML. The returned cleanup fn is called on next navigation.
 *
 * Links tagged data-link are intercepted by the click listener below;
 * browser back/forward is handled via popstate.
 */

type Route =
  | { page: "home" }
  | { page: "projects" }
  | { page: "project"; slug: string }
  | { page: "writing" }
  | { page: "post"; slug: string }
  | { page: "not-found" };

function matchRoute(path: string): Route {
  if (path === "/") return { page: "home" };
  if (path === "/projects") return { page: "projects" };
  if (path === "/writing") return { page: "writing" };

  const projectMatch = path.match(/^\/projects\/(.+)$/);
  if (projectMatch) return { page: "project", slug: projectMatch[1] };

  const postMatch = path.match(/^\/writing\/(.+)$/);
  if (postMatch) return { page: "post", slug: postMatch[1] };

  return { page: "not-found" };
}

const app = document.getElementById("app")!;

// Lazy glob — Vite resolves the file set at build time; each value is an
// import function called on demand. No manual case needed per project.
type ProjectModule = {
  render: () => string;
  mount?: (s: ShadowRoot) => () => void;
};
const projectPages = import.meta.glob<ProjectModule>("./pages/projects/*.ts");

// Holds the cleanup fn returned by the current page's mount(), if any.
let currentUnmount: (() => void) | null = null;

async function navigate(path: string): Promise<void> {
  currentUnmount?.();
  currentUnmount = null;

  const route = matchRoute(path);

  let html: string;

  switch (route.page) {
    case "home": {
      const { render } = await import("./pages/home");
      html = render();
      break;
    }
    case "projects": {
      const { render } = await import("./pages/projects");
      html = render();
      break;
    }
    case "project": {
      const loader = projectPages[`./pages/projects/${route.slug}.ts`];
      if (!loader) {
        html = '<div class="page-wrapper"><p>Project not found.</p></div>';
        break;
      }
      const mod = await loader();
      html = mod.render();
      if (mod.mount) {
        // mount() vs render(): use render() for static or lightly interactive pages,
        // it returns an HTML string and has full access to global styles. Use mount()
        // when you need a live DOM (e.g. React, canvas, event listeners that persist),
        // keeping in mind that the shadow root isolates the embed from global stylesheets.
        //
        // To use theme styles inside a shadow root, inject them via a <link> or a
        // CSS ?inline import rather than relying on theme.css to bleed through.
        const host = document.getElementById("mount")!;
        const shadow = host.attachShadow({ mode: "open" });
        currentUnmount = mod.mount(shadow);
      }
      break;
    }
    case "writing": {
      const { render } = await import("./pages/writing");
      html = render();
      break;
    }
    case "post": {
      const { render } = await import("./pages/post");
      html = render(route.slug);
      break;
    }
    default: {
      html = '<div class="page-wrapper"><p>Page not found.</p></div>';
    }
  }

  app.innerHTML = html;
  window.scrollTo(0, 0);
}

// Intercept <a data-link> clicks — pushState + navigate instead of full reload
document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  const href = a.getAttribute("href")!;
  history.pushState({}, "", href);
  navigate(href);
});

// Handle browser back/forward
window.addEventListener("popstate", () => navigate(window.location.pathname));

export { navigate };
