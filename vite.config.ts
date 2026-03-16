import { defineConfig, type Plugin } from "vite";
import tailwindcss from "@tailwindcss/vite";
import Markdoc from "@markdoc/markdoc";
import { markdocConfig } from "./src/content/markdoc-config";

// Vite plugin: transforms .md files into JS modules at build/serve time.
//
// Each .md import resolves to:
//   export default { title, date, tag, body }
// where `body` is fully-rendered HTML. Markdoc never ships to the browser.
//
// The transform hook runs once per file per cold start in dev (Vite caches
// after that), and once per file during `vite build`. HMR works automatically
// editing a .md file triggers a re-transform and pushes the update.
function markdocPlugin(): Plugin {
  return {
    name: "markdoc",
    transform(src, id) {
      if (!id.endsWith(".md")) return;
      const ast = Markdoc.parse(src);
      const fm = ast.attributes.frontmatter ?? "";
      const meta = Object.fromEntries(
        fm
          .split("\n")
          .map((line: string) => line.match(/^(\w+):\s*(.+)$/))
          .filter(Boolean)
          .map((m: RegExpMatchArray) => [m[1], m[2].trim()]),
      );
      const body = Markdoc.renderers.html(
        Markdoc.transform(ast, markdocConfig),
      );
      return `export default ${JSON.stringify({ title: meta.title ?? "", date: meta.date ?? "", tag: meta.tag ?? "", body })}`;
    },
  };
}

export default defineConfig({
  plugins: [tailwindcss(), markdocPlugin()],
  appType: "spa",
  build: {
    target: "es2020",
  },
});
