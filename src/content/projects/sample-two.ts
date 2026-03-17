import type { ProjectMeta } from "../projects";
import { Nav } from "../../components/nav";
import { Layout } from "../../components/layout";
import { ProjectHeader } from "../../components/project-header";
import { html } from "../../html";

export const meta: ProjectMeta = {
  slug: "sample-two",
  title: "Another Project",
  tag: "Rust",
  description: "A second placeholder to test the two-column grid layout.",
  photo: "https://picsum.photos/seed/sample-two/800/450",
};

export function render(): string {
  return Layout(html`
    ${Nav("projects")}
    <main class="section">
      <div class="post-panel">
        ${ProjectHeader(meta)}
        <p>Project content goes here.</p>
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
