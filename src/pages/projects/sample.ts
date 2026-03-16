import type { ProjectMeta } from "../projects";
import { Nav } from "../../components/nav";
import { Layout } from "../../components/layout";
import { ProjectHeader } from "../../components/project-header";
import { html } from "../../html";

export const meta: ProjectMeta = {
  slug: "sample",
  title: "Sample Project",
  tag: "TypeScript",
  description: "A placeholder project for testing the layout and tile design.",
  photo: "https://picsum.photos/seed/sample/800/450",
};

export function render(): string {
  return Layout(html`
    ${Nav("projects")}
    <main class="section">
      <div class="post-panel">
        ${ProjectHeader(meta)}
        <p>Project content goes here. Replace this with your write-up, demos, and interactive embeds.</p>
        <a href="/projects" data-link class="btn btn-ghost" style="margin-top: 2rem;">
          ← Back to projects
        </a>
      </div>
    </main>
  `);
}
