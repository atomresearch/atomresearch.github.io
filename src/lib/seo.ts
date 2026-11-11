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

type StaticPage = keyof typeof site.pages;

type PageMeta = {
  title: string;
  description: string;
  image?: string;
  type?: "website" | "article" | "profile";
};

/**
 * Meta tags for a route `head()`. Every page gets the same complete set
 * (description, Open Graph, Twitter card) so none can be forgotten.
 */
export function pageMeta({ title, description, image, type = "website" }: PageMeta) {
  const img = absoluteUrl(image ?? site.ogImage);
  return [
    { title },
    { name: "description", content: description },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:type", content: type },
    { property: "og:image", content: img },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: title },
    { name: "twitter:description", content: description },
    { name: "twitter:image", content: img },
  ];
}

/** Meta tags for one of the fixed pages declared in `src/data/site.json`. */
export function staticPageMeta(path: StaticPage) {
  return pageMeta(site.pages[path]);
}

type MetaTag = { title?: string; name?: string; property?: string; content?: string };

function upsertMeta(attr: "name" | "property", key: string, content: string) {
  let el = document.head.querySelector<HTMLMetaElement>(`meta[${attr}="${key}"]`);
  if (!el) {
    el = document.createElement("meta");
    el.setAttribute(attr, key);
    document.head.appendChild(el);
  }
  el.setAttribute("content", content);
}

/**
 * Keeps <title>, meta tags and the canonical link in step with the active
 * route. The router collects each route's `head()`; this applies the result to
 * the document, since the app is rendered on the client only.
 */
export function useDocumentHead() {
  const tags = useRouterState({
    select: (s) => s.matches.flatMap((m) => (m.meta ?? []) as (MetaTag | undefined)[]),
  });
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    for (const tag of tags) {
      if (!tag) continue;
      if (tag.title) document.title = tag.title;
      else if (tag.name && tag.content != null) upsertMeta("name", tag.name, tag.content);
      else if (tag.property && tag.content != null)
        upsertMeta("property", tag.property, tag.content);
    }

    const url = pathname === "/" ? `${siteUrl}/` : absoluteUrl(pathname.replace(/\/$/, ""));
    upsertMeta("property", "og:url", url);
    let canonical = document.head.querySelector<HTMLLinkElement>('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.rel = "canonical";
      document.head.appendChild(canonical);
    }
    canonical.href = url;
  }, [tags, pathname]);
}
