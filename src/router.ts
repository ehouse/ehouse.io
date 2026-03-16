type Route =
  | { page: "home" }
  | { page: "projects" }
  | { page: "maps" }
  | { page: "writing" }
  | { page: "post"; slug: string }
  | { page: "photos" }
  | { page: "not-found" };

function matchRoute(path: string): Route {
  if (path === "/") return { page: "home" };
  if (path === "/projects") return { page: "projects" };
  if (path === "/maps") return { page: "maps" };
  if (path === "/writing") return { page: "writing" };
  if (path === "/photos") return { page: "photos" };

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
    case "maps": {
      const { render } = await import("./pages/maps");
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
    case "photos": {
      const { render } = await import("./pages/photos");
      html = render();
      break;
    }
    default: {
      html = '<div class="page-wrapper"><p>Page not found.</p></div>';
    }
  }

  app.innerHTML = html;
  window.scrollTo(0, 0);
}

// Intercept all data-link clicks
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
