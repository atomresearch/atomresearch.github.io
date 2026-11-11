import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { ArrowLeft, Code2, ExternalLink, FileText, MousePointerClick } from "lucide-react";
import { lazy, Suspense, useState } from "react";
import type { ZoomTarget } from "@/components/site/markdown";
import { CopyButton } from "@/components/site/paper-parts";
import { Tag } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog";
import { papers } from "@/data/papers";
import { posts, type Post } from "@/data/posts";
import { formatBibtex, formatDate } from "@/lib/format";
import { pageMeta } from "@/lib/seo";

// The Markdown and math renderer is by far the largest piece of code on the
// site. It is loaded separately, so the title and cover of a post appear
// without waiting for it; the loader starts the download as early as possible.
const loadMarkdown = () => import("@/components/site/markdown");
const Markdown = lazy(() => loadMarkdown().then((m) => ({ default: m.Markdown })));

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return { meta: [{ title: "Post not found - ATOM" }] };
    return {
      meta: [
        ...pageMeta({
          title: `${post.title} - ATOM Blog`,
          description: post.excerpt,
          image: post.cover,
          type: "article",
        }),
        { property: "article:published_time", content: post.date },
      ],
    };
  },
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    void loadMarkdown();
    return { post };
  },
  notFoundComponent: () => (
    <div className="container-page py-32 text-center">
      <h1 className="text-3xl">Post not found</h1>
      <Link to="/blog/" className="link mt-4 inline-block">
        Back to blog
      </Link>
    </div>
  ),
  component: PostPage,
});

function PostPage() {
  const { post } = Route.useLoaderData() as { post: Post };
  const [zoom, setZoom] = useState<ZoomTarget | null>(null);
  const related = (post.relatedPaperIds ?? []).flatMap(
    (id) => papers.find((p) => p.id === id) ?? [],
  );
  const resources = [
    { href: post.arxiv, label: "arXiv", icon: FileText },
    { href: post.github, label: "GitHub", icon: Code2 },
    { href: post.explainer, label: "Interactive explainer", icon: MousePointerClick },
  ].filter((r) => r.href);

  return (
    <article className="container-page pt-8 md:pt-12">
      <div className="mx-auto max-w-[44rem]">
        <Link
          to="/blog/"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" /> Back to blog
        </Link>

        <header className="mt-8 md:mt-12">
          <p className="font-mono text-xs text-muted-foreground">
            <time dateTime={post.date}>{formatDate(post.date, "long")}</time>
            {post.authors?.length ? ` · ${post.authors.join(", ")}` : ""}
          </p>
          <h1 className="mt-4 text-[2.25rem] leading-[1.08] tracking-[-0.025em] md:text-[3.25rem]">
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="mt-5 text-xl leading-relaxed text-muted-foreground">{post.excerpt}</p>
          )}
          {!!post.tags?.length && (
            <ul className="mt-6 flex flex-wrap gap-2" aria-label="Tags">
              {post.tags.map((tag) => (
                <li key={tag} className="flex">
                  <Tag>{tag}</Tag>
                </li>
              ))}
            </ul>
          )}
          {resources.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2">
              {resources.map(({ href, label, icon: Icon }) => (
                <Button key={label} asChild size="sm" variant="outline">
                  <a href={href} target="_blank" rel="noreferrer">
                    <Icon aria-hidden="true" /> {label}
                  </a>
                </Button>
              ))}
            </div>
          )}
        </header>
      </div>

      {post.cover && (
        <div className="mx-auto mt-10 max-w-4xl overflow-hidden rounded-2xl border border-border bg-white md:mt-12">
          <img src={post.cover} alt="" fetchPriority="high" className="block h-auto w-full" />
        </div>
      )}

      <div className="prose-atom mx-auto mt-10 max-w-[44rem] md:mt-14">
        <Suspense fallback={<div className="min-h-screen" aria-busy="true" />}>
          <Markdown content={post.content} onZoom={setZoom} />
        </Suspense>
      </div>

      <footer className="mx-auto mt-16 max-w-[44rem] space-y-8 border-t border-border pt-10">
        {post.publishedVersion && (
          <Button asChild size="sm" variant="outline">
            <a href={post.publishedVersion} target="_blank" rel="noreferrer">
              Published version <ExternalLink aria-hidden="true" />
            </a>
          </Button>
        )}

        {post.bibtex && (
          <section aria-labelledby="cite" className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center justify-between gap-4">
              <h2 id="cite" className="eyebrow">
                Cite this work
              </h2>
              <CopyButton text={formatBibtex(post.bibtex)} label="Copy BibTeX" />
            </div>
            <pre
              tabIndex={0}
              className="mt-4 overflow-x-auto font-mono text-xs leading-relaxed text-foreground/80"
            >
              {formatBibtex(post.bibtex)}
            </pre>
          </section>
        )}

        {related.length > 0 && (
          <section aria-labelledby="related">
            <h2 id="related" className="eyebrow">
              Related papers
            </h2>
            <ul className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((paper) => (
                <li key={paper.id}>
                  <Link
                    to="/research/"
                    className="block h-full rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/50"
                  >
                    <span className="font-mono text-xs text-primary">
                      {paper.venue} · {paper.year}
                    </span>
                    <span className="mt-1.5 block text-sm font-medium leading-snug">
                      {paper.title}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </section>
        )}
      </footer>

      <Dialog open={!!zoom} onOpenChange={(open) => !open && setZoom(null)}>
        <DialogContent className="max-w-5xl bg-white p-3 pt-12 text-neutral-900 sm:p-4 sm:pt-12 [&>button]:text-neutral-600 [&>button]:hover:bg-neutral-100 [&>button]:hover:text-neutral-900">
          <DialogTitle className="sr-only">Figure</DialogTitle>
          <DialogDescription className="sr-only">
            {zoom?.alt || "Enlarged figure"}
          </DialogDescription>
          {zoom && <img src={zoom.src} alt={zoom.alt} className="h-auto w-full rounded-lg" />}
        </DialogContent>
      </Dialog>
    </article>
  );
}
