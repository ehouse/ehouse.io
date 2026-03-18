import { Nav } from "../components/nav";
import { Layout } from "../components/layout";
import { html } from "../html";

// Shape that each project page must export as `meta`.
// Import this type in your project page for type-checking.
export interface ProjectMeta {
  slug: string;
  title: string;
  tag: string;
  description: string;
  photo: string; // URL, or empty string for no photo
}

// Eagerly import all project page modules and collect their meta exports.
const projectModules = import.meta.glob<{ meta: ProjectMeta }>(
  "../content/projects/*.ts",
  { eager: true },
);

export function render(): string {
  const projects = Object.values(projectModules)
    .map((mod) => mod.meta)
    .filter(Boolean);

  const tiles = projects
    .map(
      (p) => html`
        <a href="/projects/${p.slug}" data-link class="card">
          ${p.photo
            ? html`<img src="${p.photo}" alt="${p.title}" class="card-photo" />`
            : ""}
          <div class="card-body">
            <span class="card-tag">${p.tag}</span>
            <h3 class="card-title">${p.title}</h3>
            <p class="card-desc">${p.description}</p>
          </div>
        </a>
      `,
    )
    .join("");

  return Layout(html`
    ${Nav("projects")}
    <main class="section">
      <div class="section-header">
        <h2 class="section-title">Projects</h2>
        <span class="section-meta">${projects.length} projects</span>
      </div>
      <div class="card-grid">${tiles}</div>
    </main>
  `);
}
