// Post-build step: writes every page of the site as complete HTML.
//
// `vite build --ssr` compiles src/entry-server.tsx into dist-ssr/; this script
// renders each page listed by src/lib/site-pages.ts with it and writes
// dist/<path>/index.html (the form GitHub Pages serves without a redirect),
// with the page's own title, description, canonical URL, social card and
// structured data. It also writes 404.html, sitemap.xml, robots.txt and
// llms.txt, then removes dist-ssr/.
import fs from "node:fs";
import path from "node:path";
import { pathToFileURL } from "node:url";

// React and the router render slightly different markup in development and
// production; the pages must match the production code the browser runs.
process.env.NODE_ENV ??= "production";

const dist = path.resolve("dist");
const ssr = path.resolve("dist-ssr");
const server = await import(pathToFileURL(path.join(ssr, "entry-server.js")).href);
const template = fs.readFileSync(path.join(dist, "index.html"), "utf8");

const HEAD = /<!--head-->[\s\S]*?<!--\/head-->/;
const ROOT = '<div id="root"></div>';
if (!HEAD.test(template) || !template.includes(ROOT)) {
  throw new Error("index.html must keep its <!--head--> block and an empty #root");
}

const write = (file, text) => {
  const target = path.join(dist, file);
  fs.mkdirSync(path.dirname(target), { recursive: true });
  fs.writeFileSync(target, text, "utf8");
};

/** Public path of a page, with the base path and a trailing slash. */
const publicPath = (route) =>
  `${server.basePath}${route.replace(/^\/|\/$/g, "")}/`.replace(/\/+$/, "/");

function page({ html, head }, dataPath) {
  // React puts preload hints for the page's images before the markup; they
  // belong in <head>, where the browser finds them sooner.
  const hints = html.match(/^(?:<link [^>]*>)*/)[0];
  const body = html.slice(hints.length);
  const root = dataPath
    ? `<div id="root" data-path="${dataPath}">${body}</div>`
    : `<div id="root">${body}</div>`;
  const tags = hints ? `${head}\n    ${hints.replace(/></g, ">\n    <")}` : head;
  return template.replace(HEAD, () => tags).replace(ROOT, () => root);
}

const pages = server.sitePages();
for (const { path: route } of pages) {
  const at = publicPath(route);
  const result = await server.render(at);
  if (result.status !== 200) throw new Error(`${route} rendered with status ${result.status}`);
  const file = route === "/" ? "index.html" : `${route.replace(/^\/|\/$/g, "")}/index.html`;
  write(file, page(result, at));
}

// GitHub Pages serves 404.html for any unknown address. It carries no
// data-path, so the app renders whatever page the address names.
const missing = await server.render(publicPath("/this-page-does-not-exist"));
write("404.html", page(missing));

const xml = (text) => text.replace(/&/g, "&amp;").replace(/</g, "&lt;");
const pageUrl = (route) =>
  `${server.siteUrl}${publicPath(route).slice(server.basePath.length - 1)}`;
write(
  "sitemap.xml",
  [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">',
    ...pages.map(({ path: route, lastmod }) =>
      [
        "  <url>",
        `    <loc>${xml(pageUrl(route))}</loc>`,
        lastmod && `    <lastmod>${lastmod}</lastmod>`,
        "  </url>",
      ]
        .filter(Boolean)
        .join("\n"),
    ),
    "</urlset>",
    "",
  ].join("\n"),
);
write("robots.txt", `User-agent: *\nAllow: /\n\nSitemap: ${pageUrl("/")}sitemap.xml\n`);
write("llms.txt", server.llmsTxt());

fs.rmSync(ssr, { recursive: true, force: true });
console.log(`Prerendered ${pages.length} pages, 404.html, sitemap.xml, robots.txt and llms.txt`);
