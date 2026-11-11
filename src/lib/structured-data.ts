// schema.org descriptions of the group, its people, papers and posts, added
// to each page's head as JSON-LD. Search engines use them for rich results
// and to connect a paper to its authors and a person to the group.
import site from "@/data/site.json";
import { memberByName, type Member } from "@/data/members";
import type { Paper } from "@/data/papers";
import type { Post } from "@/data/posts";
import { absoluteUrl, pageUrl, siteUrl } from "@/lib/seo";

export const ORGANIZATION_ID = `${siteUrl}/#organization`;
const WEBSITE_ID = `${siteUrl}/#website`;

const personId = (member: Member) => `${pageUrl(`/members/${member.id}`)}#person`;

/** The group and the website, present on every page. */
export function siteGraph() {
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "ResearchOrganization",
        "@id": ORGANIZATION_ID,
        name: site.name,
        alternateName: site.shortName,
        slogan: site.tagline,
        description: site.description,
        url: pageUrl("/"),
        logo: absoluteUrl("/icon-512.png"),
        email: site.email,
        sameAs: [site.github],
      },
      {
        "@type": "WebSite",
        "@id": WEBSITE_ID,
        name: site.name,
        url: pageUrl("/"),
        inLanguage: "en",
        publisher: { "@id": ORGANIZATION_ID },
      },
    ],
  };
}

/** Trail from the home page to the current page. */
export function breadcrumbs(trail: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ name: "Home", path: "/" }, ...trail].map((crumb, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: crumb.name,
      item: pageUrl(crumb.path),
    })),
  };
}

/** A member as a Person, linked to the group and to their other profiles. */
export function personLd(member: Member) {
  return {
    "@type": "Person",
    "@id": personId(member),
    name: member.name,
    jobTitle: member.role,
    description: member.bio,
    image: absoluteUrl(member.photo),
    url: pageUrl(`/members/${member.id}`),
    affiliation: member.affiliation
      .split("·")
      .map((name) => name.trim())
      .filter(Boolean)
      .map((name) => ({ "@type": "Organization", name })),
    memberOf: { "@id": ORGANIZATION_ID },
    sameAs: [
      member.links.website,
      member.links.scholar,
      member.links.github,
      member.links.twitter,
    ].filter(Boolean),
  };
}

export function profilePageLd(member: Member) {
  return {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    url: pageUrl(`/members/${member.id}`),
    mainEntity: personLd(member),
  };
}

export function paperLd(paper: Paper) {
  const url = pageUrl(`/research/${paper.id}`);
  return {
    "@context": "https://schema.org",
    "@type": "ScholarlyArticle",
    "@id": `${url}#article`,
    url,
    headline: paper.title,
    name: paper.shortName ? `${paper.shortName}: ${paper.title}` : paper.title,
    alternativeHeadline: paper.shortName,
    abstract: paper.abstract,
    datePublished: paper.date,
    inLanguage: "en",
    keywords: paper.tags.join(", "),
    author: paper.authors.map((name) => {
      const member = memberByName(name);
      return member
        ? { "@type": "Person", "@id": personId(member), name }
        : { "@type": "Person", name };
    }),
    publisher: { "@id": ORGANIZATION_ID },
    publication: { "@type": "PublicationEvent", name: `${paper.venue} ${paper.year}` },
    sameAs: [paper.links.arxiv, paper.links.pdf].filter(Boolean),
  };
}

export function postLd(post: Post) {
  const url = pageUrl(`/blog/${post.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    "@id": `${url}#post`,
    url,
    mainEntityOfPage: url,
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    inLanguage: "en",
    keywords: post.tags?.join(", "),
    ...(post.cover && { image: absoluteUrl(post.cover) }),
    author: { "@id": ORGANIZATION_ID },
    publisher: { "@id": ORGANIZATION_ID },
  };
}
