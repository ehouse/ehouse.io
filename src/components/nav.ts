import { html } from "../html";

const links = ["projects", "writing"] as const;

export function Nav(current: string): string {
  return html`
    <nav class="nav">
      <a href="/" data-link class="nav-logo">
        <span class="nav-logo-brace" aria-hidden="true">{</span>
        <span class="nav-logo-stack">
          <span class="nav-logo-domain">ehouse.io</span>
          <span class="nav-logo-name">Evelyn House</span>
        </span>
        <span class="nav-logo-brace" aria-hidden="true">}</span>
      </a>
      <ul class="nav-links">
        ${links
          .map(
            (l) => html`
              <li>
                <a
                  href="/${l}"
                  data-link
                  class="nav-link"
                  ${current === l ? 'aria-current="page"' : ""}
                >
                  ${l}
                </a>
              </li>
            `,
          )
          .join("")}
      </ul>
    </nav>
  `;
}
