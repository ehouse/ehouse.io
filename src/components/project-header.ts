import type { ProjectMeta } from "../pages/projects";
import { html } from "../html";

/**
 * Project page header — tag, title, description.
 * When meta.photo is set, the image fills the header as a cover with a
 * gradient overlay so the text stays readable. Without a photo it renders
 * as a plain text header that bleeds flush to the post-panel edges.
 */
export function ProjectHeader(meta: ProjectMeta): string {
  if (meta.photo) {
    return html`
      <div
        class="project-hero project-hero--photo"
        style="background-image: url('${meta.photo}')"
      >
        <div class="project-hero-content">
          <span class="card-tag">${meta.tag}</span>
          <h1 class="section-title">${meta.title}</h1>
          <p class="meta-text">${meta.description}</p>
        </div>
      </div>
    `;
  }

  return html`
    <div class="project-hero">
      <div class="project-hero-content">
        <span class="card-tag">${meta.tag}</span>
        <h1 class="section-title" style="margin-bottom: 0.5rem;">${meta.title}</h1>
        <p class="meta-text" style="margin-bottom: 2rem;">${meta.description}</p>
      </div>
    </div>
  `;
}
