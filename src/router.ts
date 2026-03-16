/**
 * Minimal client-side router over the History API.
 *
 * navigate(path)
 *   Resolves a path to a Route, lazy-imports the matching page module,
 *   calls render(), and writes the result into #app.
 *
 * Route URLs
 *   /               home
 *   /projects       projects
 *   /writing        post list
 *   /writing/:slug  individual post — slug is the .md filename minus the extension
 *
 * Adding a page: add a variant to Route, a match in matchRoute, a case in
 * navigate, and a <a data-link> in the nav.
 *
 * Links tagged data-link are intercepted by the click listener below;
 * browser back/forward is handled via popstate.
 */

type Route =
  | { page: "home" }
  | { page: "projects" }
  | { page: "writing" }
  | { page: "post"; slug: string }
  | { page: "not-found" };

function matchRoute(path: string): Route {
  if (path === "/") return { page: "home" };
  if (path === "/projects") return { page: "projects" };
  if (path === "/writing") return { page: "writing" };

  const postMatch = path.match(/^\/writing\/(.+)$/);
  if (postMatch) return { page: "post", slug: postMatch[1] };

  return { page: "not-found" };
}

const app = document.getElementById("app")!;

async function navigate(path: string): Promise<void> {
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
    case "writing": {
      const { render } = await import("./pages/writing");
      html = await render();
      break;
    }
    case "post": {
      const { render } = await import("./pages/post");
      html = await render(route.slug);
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
