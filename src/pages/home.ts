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
          <div class="eyebrow">
            <div class="eyebrow-dot"></div>
            Software · Photographer · GM
          </div>
          <div class="hero-band" aria-hidden="true"></div>
          <h1 class="hero-headline">
            Builder of <span class="accent">things.</span>
          </h1>
          <p class="hero-subhead">(plus some mild chaos)</p>
        </div>
        <p class="hero-body">
          I work across infrastructure and software engineering professionally,
          and spend the rest of my time shooting film, including alternative
          process work.
        </p>
        <div class="hero-cta">
          <a href="/projects" data-link class="btn btn-primary">See my work</a>
          <a href="/writing" data-link class="btn btn-ghost">Read the blog →</a>
        </div>
      </main>
    `,
  );
}
