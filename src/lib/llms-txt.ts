// llms.txt (https://llmstxt.org): a plain Markdown summary of the site for
// AI assistants and answer engines, written next to sitemap.xml at build time.
import site from "@/data/site.json";
import { members } from "@/data/members";
import { papers } from "@/data/papers";
import { posts } from "@/data/posts";
import { themes } from "@/data/themes";
import { byDateDesc } from "@/lib/format";
import { pageUrl } from "@/lib/seo";

export function llmsTxt() {
  const lines = [
    `# ${site.name}`,
    "",
    `> ${site.tagline}. ${site.description}`,
    "",
    "## Research themes",
    "",
    ...themes.map((t) => `- ${t.title}: ${t.desc}`),
    "",
    "## Publications",
    "",
    ...[...papers].sort(byDateDesc).map((p) => {
      const name = p.shortName ? `${p.shortName}: ${p.title}` : p.title;
      const extra = [
        p.links.arxiv && `[arXiv](${p.links.arxiv})`,
        p.links.code && `[code](${p.links.code})`,
      ];
      return `- ${name} (${p.venue} ${p.year}; ${extra.filter(Boolean).join(", ")}): ${p.summary ?? p.abstract}`;
    }),
    "",
    "## Blog",
    "",
    ...posts.map((p) => `- [${p.title}](${pageUrl(`/blog/${p.slug}`)}): ${p.excerpt}`),
    "",
    "## Members",
    "",
    ...members.map(
      (m) => `- [${m.name}](${pageUrl(`/members/${m.id}`)}): ${m.role}, ${m.affiliation}. ${m.bio}`,
    ),
    "",
    "## Pages",
    "",
    ...Object.entries(site.pages).map(
      ([path, page]) => `- [${page.title}](${pageUrl(path)}): ${page.description}`,
    ),
    "",
    "## Contact",
    "",
    `- Email: ${site.email}`,
    `- GitHub: ${site.github}`,
    "",
  ];
  return lines.join("\n");
}
