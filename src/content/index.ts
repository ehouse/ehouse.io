export type ProjectModule = {
  render: () => string;
  mount?: (s: ShadowRoot) => () => void;
};

const projectModules = import.meta.glob<ProjectModule>("./projects/*.ts");

export function loadProject(
  slug: string,
): (() => Promise<ProjectModule>) | undefined {
  return projectModules[`./projects/${slug}.ts`];
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  tag: string;
  body: string;
}

type PostData = Omit<Post, "slug">;

// .md files pre-compiled to { title, date, tag, body } by markdocPlugin in vite.config.ts
const postModules = import.meta.glob<{ default: PostData }>("./posts/*.md", {
  eager: true,
});

export function loadPosts(): Post[] {
  return Object.entries(postModules)
    .map(([path, mod]) => ({
      slug: path.replace("./posts/", "").replace(".md", ""),
      ...mod.default,
    }))
    .sort((a, b) => b.date.localeCompare(a.date));
}

export function loadPost(slug: string): Post | undefined {
  const mod = postModules[`./posts/${slug}.md`];
  if (!mod) return undefined;
  return { slug, ...mod.default };
}
