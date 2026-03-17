import { Nav } from "../components/nav";
import { Layout } from "../components/layout";
import { html } from "../html";

export function render(): string {
  return Layout(html`
    ${Nav("home")}
    <main class="pt-12">
      <div class="hero-headline-block mb-8">
        <div class="eyebrow mb-5">
          <div class="eyebrow-dot"></div>
          Software · Photographer · GM
        </div>
        <div class="hero-band" aria-hidden="true"></div>
        <h1 class="hero-headline">
          Builder of <span class="accent">things.</span>
        </h1>
        <p class="hero-subhead">(plus some mild chaos)</p>
      </div>
      <p class="hero-body max-w-110 mb-12">
        I work across infrastructure and software engineering professionally,
        and spend the rest of my time shooting film, including alternative
        process work.
      </p>
      <div class="flex items-center gap-8">
        <a href="/projects" data-link class="btn btn-primary">See my work</a>
        <a href="/writing" data-link class="btn btn-ghost">Read the blog →</a>
      </div>
    </main>
  `);
}
