// Writes public/sitemap.xml with one absolute URL per page, post and member.
// Run with `bun run generate:sitemap` (the deploy workflow does it for you).
import fs from "node:fs";
import path from "node:path";
import { getRoutes, routeUrl } from "./site-routes.mjs";

const outPath = path.resolve(process.cwd(), "public", "sitemap.xml");
const routes = getRoutes();

const entries = routes.map((route) =>
  [
    "  <url>",
    `    <loc>${routeUrl(route.path)}</loc>`,
    route.lastmod && `    <lastmod>${route.lastmod}</lastmod>`,
    `    <priority>${route.priority}</priority>`,
    "  </url>",
  ]
    .filter(Boolean)
    .join("\n"),
);

const xml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries.join("\n")}
</urlset>
`;

fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, xml, "utf8");
console.log("Wrote sitemap with", routes.length, "entries to", outPath);
