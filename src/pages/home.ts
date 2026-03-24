import { Nav } from "../components/nav";
import { Layout } from "../components/layout";
import { html } from "../html";
import { loadProjects, loadPosts } from "../content/index";

export function render(): string {
  const recentProject = loadProjects()[0] ?? null;
  const recentPost = loadPosts()[0] ?? null;

  return Layout(html`
    ${Nav("home")}
    <main class="hero-main">
      <div class="hero-headline-block">
        <div class="eyebrow">Software · Photographer · GM</div>
        <div class="hero-band" aria-hidden="true"></div>
        <h1 class="hero-headline">
          Builder of <span class="accent">things.</span>
        </h1>
        <p class="hero-subhead">(plus some mild chaos)</p>
      </div>
      <div class="home-layout">
        <div class="home-body-col">
          <p class="home-body-text">
            I work across infrastructure and software engineering
            professionally, and spend the rest of my time shooting film,
            including alternative process work like Wet Plate Collodion and
            Cyanotype. Most of the software I write outside of work is for my
            Pathfinder Campaigns.
          </p>
          <div class="home-cta">
            <a href="/projects" data-link class="btn btn-primary">
              See my work
            </a>
            <a href="/writing" data-link class="btn btn-ghost">
              Read the blog ->
            </a>
          </div>
        </div>
        <div class="home-recent-col">
          ${recentProject
            ? html` <a
                href="/projects/${recentProject.slug}"
                data-link
                class="home-recent-card"
              >
                <span class="home-recent-label">Latest Project</span>
                <h3 class="home-recent-title">${recentProject.title}</h3>
                <span class="home-recent-tag">${recentProject.tag}</span>
              </a>`
            : ""}
          ${recentPost
            ? html` <a
                href="/writing/${recentPost.slug}"
                data-link
                class="home-recent-card"
              >
                <span class="home-recent-label">Latest Post</span>
                <h3 class="home-recent-title">${recentPost.title}</h3>
                <span class="home-recent-tag">${recentPost.tag}</span>
              </a>`
            : ""}
        </div>
      </div>
    </main>
  `);
}
