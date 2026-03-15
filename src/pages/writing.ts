import { Nav } from '../components/nav'
import { Layout } from '../components/layout'
import { loadPosts } from '../content'

export async function render(): Promise<string> {
  const posts = await loadPosts()

  const items = posts.map(p => `
    <a href="/writing/${p.slug}" data-link class="blog-item">
      <span class="blog-date">${p.date}</span>
      <span class="blog-title">${p.title}</span>
      <span class="blog-tag">${p.tag}</span>
    </a>
  `).join('')

  return Layout('writing', `
    ${Nav('writing')}
    <main class="section">
      <div class="section-header">
        <h2 class="section-title">Writing</h2>
        <span class="section-meta">${posts.length} posts</span>
      </div>
      <div class="blog-panel">
        ${items}
      </div>
    </main>
  `)
}
