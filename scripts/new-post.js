#!/usr/bin/env node
// Usage: node scripts/new-post.js "My Post Title" "Tag"

import { writeFileSync, existsSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));

const [, , rawTitle, rawTag] = process.argv;

if (!rawTitle) {
  console.error("Usage: node scripts/new-post.js \"Post Title\" \"Tag\"");
  process.exit(1);
}

const title = rawTitle.trim();
const tag = (rawTag ?? "").trim();
const date = new Date().toISOString().slice(0, 10);

const slug = title
  .toLowerCase()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-+|-+$/g, "");

const outPath = join(__dirname, "../src/content/posts", `${slug}.md`);

if (existsSync(outPath)) {
  console.error(`File already exists: ${outPath}`);
  process.exit(1);
}

const content = `---
title: ${title}
date: ${date}
tag: ${tag}
---

`;

writeFileSync(outPath, content, "utf8");
console.log(`Created: src/content/posts/${slug}.md`);
