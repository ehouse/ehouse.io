import { html } from "../html";

export function Footer(): string {
  return html`
    <div class="footer-stripe" aria-hidden="true"></div>
    <footer class="footer">
      <span class="footer-copy">&copy; 2026 Evelyn House</span>
      <nav class="flex gap-6">
        <a
          href="http://resume.ehouse.io"
          class="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          Resume
        </a>
        <a
          href="https://github.com/ehouse"
          class="footer-link"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </nav>
    </footer>
  `;
}
