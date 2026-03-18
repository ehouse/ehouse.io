import { Nav } from "../components/nav";
import { Layout } from "../components/layout";
import { loadPosts } from "../content";
import { html } from "../html";

export function render(): string {
  const posts = loadPosts();

  const items = posts
    .map(
      (p) => html`
        <a href="/writing/${p.slug}" data-link class="blog-item">
          <span class="meta-text">${p.date}</span>
          <span class="blog-title">${p.title}</span>
          <span class="blog-tag">${p.tag}</span>
        </a>
      `,
    )
    .join("");

  return Layout(html`
    ${Nav("writing")}
    <main class="section">
      <div class="section-header">
        <h2 class="section-title">Writing</h2>
        <span class="section-meta">${posts.length} posts</span>
      </div>
      <div class="blog-panel">${items}</div>
    </main>
  `);
}
