import Markdoc from "@markdoc/markdoc";
import { markdocConfig } from "./markdoc-config";

export interface Post {
  slug: string;
  title: string;
  date: string;
  tag: string;
  body: string;
}

const rawPosts = import.meta.glob("./posts/*.md", {
  query: "?raw",
  import: "default",
  eager: true,
}) as Record<string, string>;

// Parses ast.attributes.frontmatter into a flat key/value map.
// Single-word keys only; values are plain strings (no type coercion).
function parseFrontmatter(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw
      .split("\n")
      .map((line) => line.match(/^(\w+):\s*(.+)$/))
      .filter(Boolean)
      .map((m) => [m![1], m![2].trim()]),
  );
}

function parse(source: string, slug: string): Post {
  const ast = Markdoc.parse(source);
  const { title, date, tag } = ast.attributes.frontmatter
    ? parseFrontmatter(ast.attributes.frontmatter)
    : {};
  const content = Markdoc.transform(ast, markdocConfig);
  const body = Markdoc.renderers.html(content);
  return { slug, title, date, tag, body };
}

export function loadPosts(): Post[] {
  return Object.entries(rawPosts)
    .map(([path, raw]) => {
      const slug = path.replace("./posts/", "").replace(".md", "");
      return parse(raw, slug);
    })
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function loadPost(slug: string): Post | undefined {
  return loadPosts().find((p) => p.slug === slug);
}
