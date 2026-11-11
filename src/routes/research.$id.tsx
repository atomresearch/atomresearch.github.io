import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { Authors, CopyButton, Figure, PaperLinks } from "@/components/site/paper-parts";
import { Tag } from "@/components/site/section";
import { papers, type Paper } from "@/data/papers";
import { posts } from "@/data/posts";
import { formatBibtex, formatDate } from "@/lib/format";
import { absoluteUrl, pageMeta, pageUrl } from "@/lib/seo";
import { breadcrumbs, paperLd } from "@/lib/structured-data";

const pdfUrl = (paper: Paper) =>
  paper.links.pdf ?? paper.links.arxiv?.replace("arxiv.org/abs/", "arxiv.org/pdf/");

/**
 * Tags read by Google Scholar and reference managers (Zotero, Mendeley) to
 * recognise the page as a paper and import it with its full citation.
 */
function citationTags(paper: Paper) {
  const arxivId = paper.links.arxiv?.match(/(\d{4}\.\d{4,5})/)?.[1];
  const pdf = pdfUrl(paper);
  return [
    { name: "citation_title", content: paper.title },
    ...paper.authors.map((author) => ({ name: "citation_author", content: author })),
    { name: "citation_publication_date", content: paper.date.replaceAll("-", "/") },
    { name: "citation_conference_title", content: paper.venue },
    ...(arxivId ? [{ name: "citation_arxiv_id", content: arxivId }] : []),
    ...(pdf ? [{ name: "citation_pdf_url", content: absoluteUrl(pdf) }] : []),
    { name: "citation_abstract_html_url", content: pageUrl(`/research/${paper.id}`) },
  ];
}

export const Route = createFileRoute("/research/$id")({
  head: ({ params }) => {
    const paper = papers.find((p) => p.id === params.id);
    if (!paper) return { meta: [{ title: "Paper not found - ATOM" }] };
    const name = paper.shortName ? `${paper.shortName}: ${paper.title}` : paper.title;
    return {
      meta: pageMeta({
        title: `${name} (${paper.venue} ${paper.year}) - ATOM`,
        description: paper.summary ?? paper.abstract,
        type: "article",
        extra: [
          { property: "article:published_time", content: paper.date },
          ...citationTags(paper),
        ],
        jsonLd: [
          paperLd(paper),
          breadcrumbs([
            { name: "Research", path: "/research" },
            { name: paper.shortName ?? paper.title, path: `/research/${paper.id}` },
          ]),
        ],
      }),
    };
  },
  loader: ({ params }) => {
    const paper = papers.find((p) => p.id === params.id);
    if (!paper) throw notFound();
    return { paper };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-3xl">Paper not found</h1>
      <Link to="/research/" className="link mt-4 inline-block">
        Back to research
      </Link>
    </div>
  ),
  component: PaperPage,
});

function PaperPage() {
  const { paper } = Route.useLoaderData() as { paper: Paper };
  const post = paper.links.blog ? posts.find((p) => p.slug === paper.links.blog) : undefined;
  const bibtex = formatBibtex(paper.bibtex);

  return (
    <article className="container-page pt-8 md:pt-12">
      <div className="mx-auto max-w-[48rem]">
        <Link
          to="/research/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> All publications
        </Link>

        <header className="mt-8 md:mt-12">
          <p className="flex flex-wrap items-center gap-3 font-mono text-xs text-muted-foreground">
            <span className="rounded-full bg-primary px-2.5 py-0.5 font-medium text-primary-foreground">
              {paper.venue} {paper.year}
            </span>
            <time dateTime={paper.date}>{formatDate(paper.date, "long")}</time>
          </p>
          {paper.shortName && (
            <p className="mt-6 font-display text-5xl tracking-[-0.03em] md:text-6xl">
              {paper.shortName}
            </p>
          )}
          <h1 className="mt-3 text-[2rem] leading-[1.12] tracking-[-0.02em] md:text-[2.6rem]">
            {paper.title}
          </h1>
          <Authors paper={paper} className="mt-5 text-base" />
          <PaperLinks paper={paper} className="mt-7" />
        </header>

        <section aria-labelledby="abstract" className="mt-12">
          <h2 id="abstract" className="eyebrow">
            Abstract
          </h2>
          <p className="mt-4 text-lg leading-relaxed text-foreground/90">{paper.abstract}</p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Topics">
            {paper.tags.map((tag) => (
              <li key={tag} className="flex">
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        </section>
      </div>

      {paper.figure && (
        <Figure figure={paper.figure} className="mx-auto mt-14 max-w-5xl" minWidth={560} />
      )}
      {paper.results && (
        <Figure figure={paper.results} className="mx-auto mt-12 max-w-4xl" minWidth={520} />
      )}

      <footer className="mx-auto mt-16 max-w-[48rem] space-y-8 border-t border-border pt-10">
        {post && (
          <section aria-labelledby="explained">
            <h2 id="explained" className="eyebrow">
              Explained on the blog
            </h2>
            <Link
              to="/blog/$slug/"
              params={{ slug: post.slug }}
              className="mt-4 block rounded-xl border border-border bg-card p-5 transition-colors hover:border-primary/50"
            >
              <span className="block font-medium leading-snug">{post.title}</span>
              {post.excerpt && (
                <span className="mt-2 block text-sm text-muted-foreground">{post.excerpt}</span>
              )}
            </Link>
          </section>
        )}

        <section aria-labelledby="cite" className="rounded-2xl border border-border bg-card p-5">
          <div className="flex items-center justify-between gap-4">
            <h2 id="cite" className="eyebrow">
              Cite this paper
            </h2>
            <CopyButton text={bibtex} label="Copy BibTeX" />
          </div>
          <pre
            tabIndex={0}
            className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground/80"
          >
            {bibtex}
          </pre>
        </section>
      </footer>
    </article>
  );
}
