import { html } from "../html";

const links = ["projects", "writing"] as const;

export function Nav(current: string): string {
  return html`
    <nav class="nav">
      <a href="/" data-link class="nav-logo">ehouse.io</a>
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
                  >${l}</a
                >
              </li>
            `,
          )
          .join("")}
      </ul>
    </nav>
  `;
}
