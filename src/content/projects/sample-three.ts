import type { ProjectMeta } from "../projects";
import { Nav } from "../../components/nav";
import { Layout } from "../../components/layout";
import { ProjectHeader } from "../../components/project-header";
import { html } from "../../html";

export const meta: ProjectMeta = {
  slug: "sample-three",
  title: "Third Thing",
  tag: "Hardware",
  description:
    "A third placeholder - no photo, to test the no-image branch alongside the others.",
  photo: "",
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
