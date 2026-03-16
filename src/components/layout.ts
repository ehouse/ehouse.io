import { html } from "../html";
import { Footer } from "./footer";

export function Layout(content: string): string {
  return html`
    <div class="bg-texture-grain" aria-hidden="true"></div>
    <div class="bg-texture-hatch" aria-hidden="true"></div>
    <div class="accent-stripe" aria-hidden="true"></div>
    <div class="page-wrapper">${content}</div>
    ${Footer()}
  `;
}
