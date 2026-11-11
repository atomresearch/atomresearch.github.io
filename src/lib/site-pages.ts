// Every public page of the site, read from the same data files as the pages
// themselves. The build-time renderer writes one HTML file per entry and lists
// them all in sitemap.xml, so a new post or member needs no extra step.
import site from "@/data/site.json";
import { members } from "@/data/members";
import { news } from "@/data/news";
import { papers } from "@/data/papers";
import { posts } from "@/data/posts";

export { siteUrl } from "@/lib/seo";

export type SitePage = {
  path: string;
  /** Date of the newest content on the page, when it has dated content. */
  lastmod?: string;
};

const newest = (dates: string[]) => [...dates].sort().at(-1)?.slice(0, 10);

export function sitePages(): SitePage[] {
  const dated: Record<string, string | undefined> = {
    "/": newest([...news, ...papers, ...posts].map((item) => item.date)),
    "/research": newest(papers.map((p) => p.date)),
    "/blog": newest(posts.map((p) => p.date)),
    "/news": newest(news.map((n) => n.date)),
  };
  return [
    ...Object.keys(site.pages).map((path) => ({ path, lastmod: dated[path] })),
    ...posts.map((p) => ({ path: `/blog/${p.slug}`, lastmod: p.date.slice(0, 10) })),
    ...members.map((m) => ({ path: `/members/${m.id}` })),
  ];
}
