import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import Markdoc from "@markdoc/markdoc";
import { markdocConfig } from "./src/content/markdoc-config";
import Prism from "prismjs";
import "prismjs/components/prism-typescript";

function highlightCodeBlocks(html: string): string {
  return html.replace(
    /<pre data-language="([^"]*)">\s*<code>([\s\S]*?)<\/code>\s*<\/pre>/g,
    (match, lang, escaped) => {
      const grammar = Prism.languages[lang];
      if (!grammar) return match;
      const code = escaped
        .replace(/&amp;/g, "&")
        .replace(/&lt;/g, "<")
        .replace(/&gt;/g, ">")
        .replace(/&quot;/g, '"')
        .replace(/&#39;/g, "'");
      const highlighted = Prism.highlight(code, grammar, lang);
      return `<pre class="language-${lang}"><code class="language-${lang}">${highlighted}</code></pre>`;
    },
  );
}

// Vite plugin: transforms .md files into JS modules at build/serve time.
//
// Each .md import resolves to:
//   export default { title, date, tag, body }
// where `body` is fully-rendered HTML. Markdoc never ships to the browser.
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
      const body = highlightCodeBlocks(
        Markdoc.renderers.html(Markdoc.transform(ast, markdocConfig)),
      );
      return `export default ${JSON.stringify({ title: meta.title ?? "", date: meta.date ?? "", tag: meta.tag ?? "", body })}`;
    },
  };
}

export default defineConfig({
  plugins: [react(), markdocPlugin()],
  appType: "spa",
  build: {
    target: "es2020",
  },
});
