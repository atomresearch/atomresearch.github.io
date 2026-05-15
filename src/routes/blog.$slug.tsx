import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useState } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import remarkMath from "remark-math";
import rehypeRaw from "rehype-raw";
import rehypeKatex from "rehype-katex";
import "katex/dist/katex.min.css";
import { ArrowLeft, Copy, ExternalLink, X } from "lucide-react";
import { posts } from "@/data/posts";
import type { Post } from "@/data/posts";
import { papers } from "@/data/papers";
import { resolveCoverUrl } from "@/lib/posts";

export const Route = createFileRoute("/blog/$slug")({
  head: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) return { meta: [{ title: "Post not found - ATOM" }] };
    return {
      meta: [
        { title: `${post.title} - ATOM Blog` },
        { name: "description", content: post.excerpt },
        { property: "og:title", content: post.title },
        { property: "og:description", content: post.excerpt },
        { property: "og:image", content: post.cover },
        { property: "og:type", content: "article" },
        { name: "twitter:card", content: "summary_large_image" },
        { name: "twitter:image", content: post.cover },
      ],
    };
  },
  loader: ({ params }) => {
    const post = posts.find((p) => p.slug === params.slug);
    if (!post) throw notFound();
    return { post };
  },
  notFoundComponent: () => (
        <div className="mx-auto max-w-3xl px-6 py-32 text-center">
          <h1 className="font-display text-3xl font-semibold">Post not found</h1>
          <Link to="/blog" className="mt-4 inline-block text-primary hover:underline">← Back to blog</Link>
        </div>
      ),
      component: PostPage,
  });

function PostPage() {
  const { post } = Route.useLoaderData() as { post: Post };
  const [zoom, setZoom] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const related = post.relatedPaperIds?.map((id) => papers.find((p) => p.id === id)).filter(Boolean) ?? [];
  const markdownContent = post.content.replace(/^\s*\$\$(.+?)\$\$\s*$/gm, (_match, equation) => `\n$$\n${equation.trim()}\n$$\n`);
  const copyBibtex = async () => {
    if (!post.bibtex) return;
    await navigator.clipboard.writeText(post.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <article className="mx-auto max-w-3xl px-6 pt-12 pb-24">
      <Link to="/blog" className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground">
        <ArrowLeft className="h-4 w-4" /> Back to blog
      </Link>

      <header className="mt-8">
        <div className="text-xs text-muted-foreground">
          {new Date(post.date).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })} · {(post.authors ?? []).join(", ")}
        </div>
        <h1 className="mt-3 font-display text-4xl md:text-5xl font-semibold leading-tight tracking-tight">{post.title}</h1>
        <div className="mt-4 flex flex-wrap gap-1.5">
          {(post.tags ?? []).map((t) => (
            <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{t}</span>
          ))}
        </div>
      </header>

      <div className="mt-10 overflow-hidden rounded-xl border border-border">
        <img src={post.cover} alt={post.title} className="w-full" />
      </div>

      {(post.arxiv || post.github) && (
        <div className="mt-6 flex flex-wrap gap-2">
          {post.arxiv && (
            <a href={post.arxiv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition-colors">
              arXiv <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          )}
          {post.github && (
            <a href={post.github} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition-colors">
              GitHub <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          )}
        </div>
      )}

      <div className="markdown-content mt-12 max-w-none text-foreground/85 leading-relaxed text-[1.05rem]">
        <ReactMarkdown
          remarkPlugins={[remarkGfm, remarkMath]}
          rehypePlugins={[rehypeRaw, rehypeKatex]}
          components={{
            img: ({ src, alt, title }) => {
              const resolvedSrc = resolveCoverUrl(src) ?? (src as string);
              return (
                <figure className="my-8">
                  <img
                    src={resolvedSrc}
                    alt={alt}
                    loading="lazy"
                    onClick={() => setZoom(resolvedSrc)}
                    className="w-full rounded-xl border border-border cursor-zoom-in"
                  />
                  {title && <figcaption className="mt-3 text-center text-sm text-muted-foreground">{title}</figcaption>}
                </figure>
              );
            },
            a: ({ href, children }) => <a href={href as string} className="text-primary hover:underline" target="_blank" rel="noreferrer">{children}</a>,
            strong: ({ children }) => <strong className="text-foreground font-semibold">{children}</strong>,
            code: ({ children, className }) => {
              const isBlock = !!className;
              if (isBlock) return <code className={className}>{children}</code>;
              return <code className="px-1.5 py-0.5 rounded-md bg-secondary text-primary font-mono text-[0.9em]">{children}</code>;
            },
            pre: ({ children }) => <pre className="my-6 overflow-x-auto rounded-lg border border-border bg-card p-4 text-sm font-mono">{children}</pre>,
            h2: ({ children }) => <h2 className="mt-12 mb-4 text-2xl font-semibold">{children}</h2>,
            h3: ({ children }) => <h3 className="mt-8 mb-3 text-xl font-semibold">{children}</h3>,
            p: ({ children }) => <p className="my-5">{children}</p>,
            ul: ({ children }) => <ul className="my-5 list-disc pl-6 space-y-2">{children}</ul>,
            ol: ({ children }) => <ol className="my-5 list-decimal pl-6 space-y-2">{children}</ol>,
            blockquote: ({ children }) => <blockquote className="my-6 border-l-2 border-primary pl-5 italic text-foreground/80">{children}</blockquote>,
          }}
        >
          {markdownContent}
        </ReactMarkdown>
      </div>

      {/* Citation / links */}
      <footer className="mt-16 border-t border-border pt-10 space-y-6">
        {post.publishedVersion && (
          <div className="flex flex-wrap gap-2">
            <a href={post.publishedVersion} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-sm hover:bg-secondary transition-colors">
              Published version <ExternalLink className="h-3.5 w-3.5 opacity-60" />
            </a>
          </div>
        )}

        {post.bibtex && (
          <div className="rounded-xl border border-border bg-card p-5">
            <div className="flex items-center justify-between">
              <h3 className="font-display text-sm font-semibold">Cite this work</h3>
              <button onClick={copyBibtex} className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90">
                <Copy className="h-3.5 w-3.5" /> {copied ? "Copied!" : "Copy BibTeX"}
              </button>
            </div>
            <pre className="mt-4 overflow-x-auto text-xs leading-relaxed font-mono text-foreground/80">{post.bibtex}</pre>
          </div>
        )}

        {related.length > 0 && (
          <div>
            <h3 className="font-display text-sm font-semibold uppercase tracking-widest text-muted-foreground">Related papers</h3>
            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {related.map((p) => p && (
                <Link key={p.id} to="/research" className="card-hover rounded-lg border border-border bg-card p-4">
                  <div className="text-[11px] text-primary uppercase tracking-widest">{p.venue} · {p.year}</div>
                  <div className="mt-1.5 text-sm font-medium leading-snug">{p.title}</div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </footer>

      {zoom && (
        <div className="fixed inset-0 z-60 grid place-items-center p-4 bg-background/95 backdrop-blur-sm cursor-zoom-out" onClick={() => setZoom(null)}>
          <button aria-label="Close" className="absolute top-4 right-4 h-10 w-10 grid place-items-center rounded-md bg-secondary hover:bg-secondary/80">
            <X className="h-5 w-5" />
          </button>
          <img src={zoom} alt="" className="max-h-[90vh] max-w-[95vw] rounded-lg" />
        </div>
      )}
    </article>
  );
}
