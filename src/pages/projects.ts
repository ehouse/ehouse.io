import { Nav } from '../components/nav'
import { Layout } from '../components/layout'
import { html } from '../html'

export function render(): string {
  return Layout('projects', html`
    ${Nav('projects')}
    <main class="section">
      <div class="section-header">
        <h2 class="section-title">Projects</h2>
        <span class="section-meta">All work</span>
      </div>
      <p style="margin-top: 2rem; max-width: 520px;">
        Hardware, software, and everything in between.
      </p>
    </main>
  `)
}
