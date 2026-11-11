import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader, Tag } from "@/components/site/section";
import { posts, type Post } from "@/data/posts";
import { formatDate } from "@/lib/format";
import { staticPageMeta } from "@/lib/seo";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/blog/")({
  head: () => ({ meta: staticPageMeta("/blog") }),
  component: BlogIndex,
});

function BlogIndex() {
  const [latest, ...older] = posts;

  return (
    <>
      <PageHeader title="Blog">
        <p>Research updates, paper walk-throughs, and demos from the ATOM Research Group.</p>
      </PageHeader>

      <div className="container-page">
        {latest ? (
          <PostCard post={latest} featured />
        ) : (
          <p className="text-muted-foreground">No posts yet.</p>
        )}
        {older.length > 0 && (
          <ul className="mt-12 grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
            {older.map((post) => (
              <li key={post.slug}>
                <PostCard post={post} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}

/** A post teaser. The newest post is shown large, with its cover beside it. */
function PostCard({ post, featured = false }: { post: Post; featured?: boolean }) {
  return (
    <article
      className={cn(
        "group relative",
        featured &&
          "grid items-center gap-8 border-y border-border-strong py-8 md:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] md:gap-12 md:py-12",
      )}
    >
      {post.cover && (
        <div
          className={cn(
            "aspect-[16/10] overflow-hidden rounded-2xl border border-border bg-white",
            !featured && "mb-5",
          )}
        >
          <img
            src={post.cover}
            alt=""
            loading={featured ? "eager" : "lazy"}
            decoding="async"
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          />
        </div>
      )}
      <div>
        <p className="font-mono text-xs text-muted-foreground">
          <time dateTime={post.date}>{formatDate(post.date, "long")}</time>
          {post.authors?.length ? ` · ${post.authors.join(", ")}` : ""}
        </p>
        <h2
          className={cn(
            "mt-3 leading-tight tracking-[-0.02em]",
            featured ? "text-3xl md:text-[2.5rem]" : "text-2xl",
          )}
        >
          {/* The link's ::after covers the card, so the whole teaser is clickable. */}
          <Link
            to="/blog/$slug/"
            params={{ slug: post.slug }}
            className="after:absolute after:inset-0 group-hover:text-primary"
          >
            {post.title}
          </Link>
        </h2>
        <p
          className={cn(
            "mt-4 leading-relaxed text-muted-foreground",
            featured ? "text-lg" : "line-clamp-3",
          )}
        >
          {post.excerpt}
        </p>
        {!!post.tags?.length && (
          <ul className="mt-5 flex flex-wrap gap-2" aria-label="Tags">
            {post.tags.map((tag) => (
              <li key={tag} className="flex">
                <Tag>{tag}</Tag>
              </li>
            ))}
          </ul>
        )}
        {featured && (
          <p className="mt-7 inline-flex items-center gap-1.5 text-sm font-medium text-primary">
            Read the post
            <ArrowRight
              className="h-4 w-4 transition-transform group-hover:translate-x-0.5"
              aria-hidden="true"
            />
          </p>
        )}
      </div>
    </article>
  );
}
