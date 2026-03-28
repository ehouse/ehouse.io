import { loadPost } from "../content";
import { Nav } from "../components/nav";
import { Layout } from "../components/layout";
import { html } from "../html";

export function render(slug: string): string {
  const post = loadPost(slug);

  if (!post) {
    return Layout(html`
      ${Nav("writing")}
      <main class="section">
        <p>Post not found.</p>
        <a
          href="/writing"
          data-link
          class="btn btn-ghost"
          style="margin-top: 2rem;"
        >
          ← Back to writing
        </a>
      </main>
    `);
  }

  return Layout(html`
    ${Nav("writing")}
    <main class="section">
      <div class="post-panel">
        <div class="post-hero">
          <div style="margin-bottom: 1rem;">
            <span class="card-tag">${post.tag}</span>
          </div>
          <h1 class="section-title" style="margin-bottom: 0.5rem;">
            ${post.title}
          </h1>
          <p class="meta-text" style="margin-bottom: 0;">
            ${post.updated ? `Posted: ${post.date}<br>Updated: ${post.updated}` : post.date}
          </p>
        </div>
        <div class="post-body">${post.body}</div>
      </div>
    </main>
  `);
}
