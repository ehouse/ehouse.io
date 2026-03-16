export interface Post {
  slug: string;
  title: string;
  date: string;
  tag: string;
  body: string;
}

type PostData = Omit<Post, "slug">;

// All .md files under ./posts/, pre-compiled to { title, date, tag, body } by
// the markdocPlugin in vite.config.ts. Eager = bundled at build time, no
// runtime fetch. Keys are relative paths, e.g. "./posts/my-post.md".
const postModules = import.meta.glob<{ default: PostData }>("./posts/*.md", {
  eager: true,
});

// Returns all posts sorted newest-first. Slug is derived from the filename.
export function loadPosts(): Post[] {
  return Object.entries(postModules)
    .map(([path, mod]) => ({
      slug: path.replace("./posts/", "").replace(".md", ""),
      ...mod.default,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

// Same as above, except loads an individual post
export function loadPost(slug: string): Post | undefined {
  const mod = postModules[`./posts/${slug}.md`];
  if (!mod) return undefined;
  return { slug, ...mod.default };
}
