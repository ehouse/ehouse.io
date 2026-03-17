/**
 * Minimal client-side router over the History API.
 *
 * Route URLs
 *   /                  home
 *   /projects          project list
 *   /projects/:slug    individual project page
 *   /writing           post list
 *   /writing/:slug     individual post
 *
 * Adding a page: add a variant to Route, a match in matchRoute, a case in
 * navigate, and a <a data-link> in the nav.
 *
 * Adding a project: drop a new .ts file in src/content/projects/. The slug
 * is the filename minus the extension. No router changes needed.
 *
 * A project module may export mount(shadow: ShadowRoot): () => void alongside
 * render(). The router attaches a shadow root to #mount and calls mount() after
 * setting innerHTML. The returned cleanup fn is called on the next navigation.
 * Note: the shadow root isolates the embed from global stylesheets - inject
 * theme styles via a <link> or CSS ?inline import if needed.
 */

import { loadProject } from "./content/index";

const app = document.getElementById("app")!;

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
      const loader = loadProject(route.slug);
      if (!loader) {
        html = '<div class="page-wrapper"><p>Project not found.</p></div>';
        break;
      }
      const mod = await loader();
      html = mod.render();
      if (mod.mount) {
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

document.addEventListener("click", (e) => {
  const a = (e.target as Element).closest("a[data-link]");
  if (!a) return;
  e.preventDefault();
  const href = a.getAttribute("href")!;
  history.pushState({}, "", href);
  navigate(href);
});

window.addEventListener("popstate", () => navigate(window.location.pathname));

export { navigate };
