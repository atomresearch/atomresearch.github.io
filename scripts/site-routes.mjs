// The list of public routes with their titles and descriptions, read from the
// same files the app uses: src/data/site.json, src/data/members.ts and the
// front matter of src/content/posts/*.md. Shared by the sitemap generator and
// the post-build step, so a new post or member needs no change here.
import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const read = (...parts) => fs.readFileSync(path.join(root, ...parts), "utf8");

export const site = JSON.parse(read("src", "data", "site.json"));

/** Public origin without a trailing slash. CI passes it as VITE_SITE_URL. */
export const siteUrl = (process.env.VITE_SITE_URL || site.url).replace(/\/$/, "");

const unquote = (value) => value.trim().replace(/^(["'])(.*)\1$/, "$2");

function postRoutes() {
  const dir = path.join(root, "src", "content", "posts");
  if (!fs.existsSync(dir)) return [];
  return fs
    .readdirSync(dir)
    .filter((file) => file.endsWith(".md"))
    .map((file) => {
      const frontMatter = read("src", "content", "posts", file).match(/^---\s*\n([\s\S]*?)\n---/);
      const field = (name) => {
        const match = frontMatter?.[1].match(new RegExp(`^${name}:\\s*(.+)$`, "m"));
        return match ? unquote(match[1]) : "";
      };
      const slug = field("slug") || file.replace(/\.md$/, "");
      const title = field("title") || slug;
      return {
        path: `/blog/${slug}`,
        title: `${title} - ATOM Blog`,
        description: field("excerpt") || site.description,
        type: "article",
        lastmod: field("date") || undefined,
        priority: "0.6",
      };
    });
}

function memberRoutes() {
  const source = read("src", "data", "members.ts");
  // One `{ id: "...", ... group: "..." }` block per member.
  return [...source.matchAll(/\{\s*id:\s*"([\w-]+)"[\s\S]*?group:/g)].map(([block, id]) => {
    const field = (name) => block.match(new RegExp(`${name}:\\s*"([^"]*)"`))?.[1] ?? "";
    return {
      path: `/members/${id}`,
      title: `${field("name")} - ATOM`,
      description: `${field("role")}, ${field("affiliation")}. ${field("bio")}`,
      type: "profile",
      priority: "0.5",
    };
  });
}

export function getRoutes() {
  const pages = Object.entries(site.pages).map(([route, meta]) => ({
    path: route,
    title: meta.title,
    description: meta.description,
    type: "website",
    priority: route === "/" ? "1.0" : "0.7",
  }));
  return [...pages, ...postRoutes(), ...memberRoutes()];
}

/** Absolute URL of a route. The home page keeps its trailing slash. */
export const routeUrl = (route) => (route === "/" ? `${siteUrl}/` : `${siteUrl}${route}`);
