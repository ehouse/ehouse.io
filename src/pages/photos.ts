import { Nav } from '../components/nav'
import { Layout } from '../components/layout'
import { html } from '../html'

export function render(): string {
  return Layout('photos', html`
    ${Nav('photos')}
    <main class="section">
      <div class="section-header">
        <h2 class="section-title">Photos</h2>
        <span class="section-meta">Photography</span>
      </div>
      <p style="margin-top: 2rem; max-width: 520px;">
        Coming soon.
      </p>
    </main>
  `)
}
