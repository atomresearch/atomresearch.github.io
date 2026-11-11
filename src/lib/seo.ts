import { useEffect } from "react";
import { useRouterState } from "@tanstack/react-router";
import site from "@/data/site.json";

/** Public origin of the site, without a trailing slash. */
export const siteUrl = (import.meta.env.VITE_SITE_URL || site.url).replace(/\/$/, "");

/** Turn a site-relative path or asset URL into an absolute URL. */
export function absoluteUrl(path: string) {
  if (/^https?:\/\//.test(path)) return path;
  return `${siteUrl}/${path.replace(/^\//, "")}`;
}

/** Absolute URL of a page, in the trailing-slash form the site is served in. */
export function pageUrl(path: string) {
  const clean = path.replace(/^\/+|\/+$/g, "");
  return clean ? `${siteUrl}/${clean}/` : `${siteUrl}/`;
}

/** One entry of a route's `head().meta`, as TanStack Router passes it on. */
export type HeadTag = {
  title?: string;
  name?: string;
  property?: string;
  content?: string;
  "script:ld+json"?: object;
};

type StaticPage = keyof typeof site.pages;

/** Structured data as head tags; written as `<script type="application/ld+json">`. */
export const jsonLdTags = (data: object | object[]): HeadTag[] =>
  [data].flat().map((item) => ({ "script:ld+json": item }));

type PageMeta = {
  title: string;
  description: string;
  /** Social card; the default card is used when omitted. */
  image?: string;
  imageAlt?: string;
  type?: "website" | "article" | "profile";
  /** schema.org data describing the page, for search engines. */
  jsonLd?: object | object[];
  /** Further tags, such as `article:published_time` or `citation_*`. */
  extra?: HeadTag[];
};

/**
 * Head tags for a route `head()`. Every page gets the same complete set
 * (description, Open Graph, Twitter card) so none can be forgotten.
 */
export function pageMeta({
  title,
  description,
  image,
  imageAlt,
  type = "website",
  jsonLd,
  extra = [],
}: PageMeta): HeadTag[] {
  const img = absoluteUrl(image ?? site.ogImage);
  const alt = imageAlt ?? (image ? title : `${site.name} - ${site.tagline}`);
  const card: HeadTag[] = image
    ? []
    : [
        // Size of the default card, so it shows before it is downloaded.
        { property: "og:image:width", content: "1200" },
        { property: "og:image:height", content: "630" },
      ];
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:image", content: img },
    { property: "og:image:alt", content: alt },
    ...card,
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
    { name: "twitter:image:alt", content: alt },
    ...extra,
    ...jsonLdTags(jsonLd ?? []),
  ];
}

/** Head tags for one of the fixed pages declared in `src/data/site.json`. */
export function staticPageMeta(
  path: StaticPage,
  more: Omit<PageMeta, "title" | "description"> = {},
) {
  return pageMeta({ ...site.pages[path], ...more });
}

type ResolvedHead = {
  title?: string;
  canonical: string;
  meta: { attr: "name" | "property"; key: string; content: string }[];
  jsonLd: object[];
};

/** The tags of each matched route, from the root to the current page. */
export type RouteHeadTags = (HeadTag | undefined)[][];

/**
 * Merge the tags of every matched route and add the canonical URL. A deeper
 * route replaces a parent's tag of the same name; one route may repeat a name
 * (one `citation_author` per author). A 404 page is kept out of indexes.
 */
function resolveHead(routes: RouteHeadTags, pathname: string, status = 200): ResolvedHead {
  const url = pageUrl(pathname);
  const head: ResolvedHead = { canonical: url, meta: [], jsonLd: [] };
  const taken = new Set<string>();
  for (const tags of [...routes].reverse()) {
    const own = new Set<string>();
    const meta: ResolvedHead["meta"] = [];
    for (const tag of tags) {
      if (!tag) continue;
      if (tag.title != null) head.title ??= tag.title;
      else if (tag["script:ld+json"]) head.jsonLd.unshift(tag["script:ld+json"]);
      else {
        const attr = tag.name != null ? "name" : "property";
        const key = tag.name ?? tag.property;
        if (!key || tag.content == null || taken.has(`${attr}:${key}`)) continue;
        own.add(`${attr}:${key}`);
        meta.push({ attr, key, content: tag.content });
      }
    }
    own.forEach((key) => taken.add(key));
    head.meta.unshift(...meta);
  }
  head.meta.push({ attr: "property", key: "og:url", content: url });
  if (status === 404) head.meta.push({ attr: "name", key: "robots", content: "noindex" });
  return head;
}

const escapeHtml = (text: string) =>
  text.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

/** JSON inside a `<script>`: `<` is escaped so the text cannot close the tag. */
const scriptJson = (data: object) => JSON.stringify(data).replace(/</g, "\\u003c");

/**
 * The page's head as HTML, for the build-time renderer. Every tag carries
 * `data-head` so the browser can replace them on navigation.
 */
export function headTags(routes: RouteHeadTags, pathname: string, status = 200) {
  const head = resolveHead(routes, pathname, status);
  return [
    `<title>${escapeHtml(head.title ?? (status === 404 ? `Page not found - ${site.shortName}` : site.name))}</title>`,
    ...head.meta.map(
      (m) =>
        `<meta data-head ${m.attr}="${escapeHtml(m.key)}" content="${escapeHtml(m.content)}" />`,
    ),
    `<link data-head rel="canonical" href="${escapeHtml(head.canonical)}" />`,
    ...head.jsonLd.map(
      (data) => `<script data-head type="application/ld+json">${scriptJson(data)}</script>`,
    ),
  ].join("\n    ");
}

/**
 * Keeps <title>, meta tags, structured data and the canonical link in step
 * with the active route when the visitor navigates. The tags written at build
 * time carry `data-head`; they are replaced by the same set for the new page.
 */
export function useDocumentHead() {
  // Compared as text, so the head is only rewritten when the tags change.
  const tags = useRouterState({
    select: (s) => JSON.stringify(s.matches.map((m) => m.meta ?? [])),
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const status = useRouterState({ select: (s) => s.statusCode });

  useEffect(() => {
    const head = resolveHead(JSON.parse(tags) as RouteHeadTags, pathname, status);
    if (head.title) document.title = head.title;
    for (const el of document.head.querySelectorAll("[data-head]")) el.remove();

    const add = (el: HTMLElement) => {
      el.setAttribute("data-head", "");
      document.head.appendChild(el);
    };
    for (const m of head.meta) {
      const el = document.createElement("meta");
      el.setAttribute(m.attr, m.key);
      el.setAttribute("content", m.content);
      add(el);
    }
    const canonical = document.createElement("link");
    canonical.rel = "canonical";
    canonical.href = head.canonical;
    add(canonical);
    for (const data of head.jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.textContent = JSON.stringify(data);
      add(script);
    }
  }, [tags, pathname, status]);
}
