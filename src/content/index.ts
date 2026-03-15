export interface Post {
  slug: string;
  title: string;
  date: string;
  tag: string;
  body: string;
}

// Manually import each post here as you add them.
// We keep this explicit rather than using glob imports
// so TypeScript stays happy and the build stays simple.
import ubiquiti from "./posts/ubiquiti-venues.md?raw";
import petgcf from "./posts/petg-cf.md?raw";

import Markdoc from "@markdoc/markdoc";
import { markdocConfig } from "./markdoc-config";

function parseFrontmatter(raw: string): Record<string, string> {
  return Object.fromEntries(
    raw.split('\n')
      .map(line => line.match(/^(\w+):\s*(.+)$/))
      .filter(Boolean)
      .map(m => [m![1], m![2].trim()])
  )
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

export async function loadPosts(): Promise<Post[]> {
  return [parse(ubiquiti, "ubiquiti-venues"), parse(petgcf, "petg-cf")].sort(
    (a, b) => b.date.localeCompare(a.date),
  );
}

export async function loadPost(slug: string): Promise<Post | undefined> {
  const posts = await loadPosts();
  return posts.find((p) => p.slug === slug);
}
