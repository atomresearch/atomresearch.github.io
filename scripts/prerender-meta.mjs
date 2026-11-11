// Post-build step: writes one HTML file per route into dist/ (for example
// dist/research.html and dist/blog/pinductor.html).
//
// The app is rendered in the browser, so without this every deep link is
// served through the 404.html fallback: it works for visitors, but answers
// with a 404 status and with the home page's title and preview. Each file
// written here is a copy of index.html with that page's own title,
// description, canonical URL and Open Graph tags, so link previews and
// crawlers that do not run JavaScript see the right page.
import fs from "node:fs";
import path from "node:path";
import { getRoutes, routeUrl } from "./site-routes.mjs";

const dist = path.resolve(process.cwd(), "dist");
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const escapeHtml = (text) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** Replace the `content` (or `href`) of the tag identified by `selector`. */
function setAttribute(html, selector, attribute, value) {
  const tag = new RegExp(`(<[^>]*${selector}[^>]*?${attribute}=")[^"]*(")`, "s");
  if (!tag.test(html)) throw new Error(`index.html has no tag matching ${selector}`);
  return html.replace(tag, (_match, before, after) => before + escapeHtml(value) + after);
}

function render(route) {
  const url = routeUrl(route.path);
  let html = template.replace(
    /<title>[\s\S]*?<\/title>/,
    `<title>${escapeHtml(route.title)}</title>`,
  );
  html = setAttribute(html, 'name="description"', "content", route.description);
  html = setAttribute(html, 'rel="canonical"', "href", url);
  html = setAttribute(html, 'property="og:title"', "content", route.title);
  html = setAttribute(html, 'property="og:description"', "content", route.description);
  html = setAttribute(html, 'property="og:type"', "content", route.type);
  html = setAttribute(html, 'property="og:url"', "content", url);
  html = setAttribute(html, 'name="twitter:title"', "content", route.title);
  html = setAttribute(html, 'name="twitter:description"', "content", route.description);
  return html;
}

const routes = getRoutes().filter((route) => route.path !== "/");
for (const route of routes) {
  const file = path.join(dist, `${route.path.slice(1)}.html`);
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, render(route), "utf8");
}
console.log("Wrote", routes.length, "route pages to", dist);
