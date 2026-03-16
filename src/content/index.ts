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

/**
 * Parses a Markdoc frontmatter string into a key/value map.
 *
 * Expects the raw frontmatter block as extracted by Markdoc (i.e. the content
 * between the `---` delimiters, with the delimiters already stripped). Each
 * line is matched against the pattern `key: value`; lines that don't match
 * (blank lines, comments, complex YAML constructs) are silently ignored.
 *
 * Limitations:
 * - Keys must be a single word (`\w+`); kebab-case or dotted keys are skipped.
 * - Values are treated as plain strings — no type coercion, no quoted-string
 *   handling, and no multi-line / block scalar support.
 * - Duplicate keys: last write wins (standard `Object.fromEntries` behavior).
 *
 * @param raw - The raw frontmatter string from `ast.attributes.frontmatter`.
 * @returns A flat object mapping each parsed key to its trimmed string value.
 */
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
