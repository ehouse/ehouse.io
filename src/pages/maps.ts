import { Nav } from '../components/nav'
import { Layout } from '../components/layout'
import { html } from '../html'

export function render(): string {
  return Layout('maps', html`
    ${Nav('maps')}
    <main class="section">
      <div class="section-header">
        <h2 class="section-title">Maps</h2>
        <span class="section-meta">Pathfinder 2e · Thornwick's Rest</span>
      </div>
      <p style="margin-top: 2rem; max-width: 520px;">
        Handcrafted maps for my Pathfinder 2e campaign. Every location has a story.
      </p>
    </main>
  `)
}
