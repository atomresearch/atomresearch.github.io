// Single-line news items for the homepage "What's new" feed.
// Add new items at the top. Use `link` for either blog posts or external URLs.
export type NewsLink = { kind: "blog"; slug: string } | { kind: "external"; href: string };

export type NewsItem = {
  date: string; // ISO date
  text: string;
  highlight?: string; // emphasized phrase (e.g. paper title or venue)
  link?: NewsLink;
  to?: string; // blog slug
  href?: string; // external link
};

export function getNewsLink(item: NewsItem): NewsLink | null {
  if (item.link) return item.link;
  if (item.to) return { kind: "blog", slug: item.to };
  if (item.href) return { kind: "external", href: item.href };
  return null;
}

export const news: NewsItem[] = [
    {
    date: "2026-05-15",
    text: "New blog post:",
    highlight: "LLM guided world model synthesis",
    link: { kind: "blog", slug: "pinductor" },
  },
  {
    date: "2026-05-14",
    text: "Arxiv Paper:",
    highlight: "Learning POMDP World Models from Observations with Language-Model Priors",
    link: { kind: "external", href: "https://arxiv.org/abs/2605.13740" },
  }

];
