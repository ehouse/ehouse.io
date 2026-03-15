import { Nav } from "../components/nav";
import { Layout } from "../components/layout";
import { html } from "../html";

export function render(): string {
  return Layout(
    "home",
    html`
      ${Nav("home")}
      <main class="hero-section">
        <div class="hero-headline-block">
          <div
            class="eyebrow"
            style="margin-bottom: 1.25rem; margin-top: 6rem;"
          >
            <div class="eyebrow-dot"></div>
            Builder · GM · Maker
          </div>
          <div class="hero-band" aria-hidden="true"></div>
          <h1 class="hero-headline">
            Builder of <span class="accent">things.</span>
          </h1>
          <p class="hero-subhead" style="margin-bottom: 2.25rem;">
            (plus some mild chaos)
          </p>
        </div>
        <p style="max-width: 440px; margin-bottom: 3rem;">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam
          varius lobortis justo luctus facilisis.
        </p>
        <div style="display: flex; align-items: center; gap: 2rem;">
          <a href="/projects" data-link class="btn btn-primary">See my work</a>
          <a href="/writing" data-link class="btn btn-ghost">Read the blog →</a>
        </div>
      </main>
    `,
  );
}
