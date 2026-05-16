import { createFileRoute, Link, Outlet, useMatches } from "@tanstack/react-router";
import { posts } from "@/data/posts";

export const Route = createFileRoute("/blog")({
  head: () => ({
    meta: [
      { title: "Blog - ATOM" },
      { name: "description", content: "Research updates, paper explanations, and demos from the ATOM Research Group." },
      { name: "keywords", content: "ATOM blog, ATOM Research Group Blog, ATOM Research Blog, research updates, machine learning, agent foundation models, papers, world models, POMDP, MDP, agents, LLM" },
      { property: "og:image", content: "/preview.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/preview.png" },
      { property: "og:title", content: "Blog - ATOM" },
      { property: "og:description", content: "Research updates and paper explanations." },
    ],
  }),
  component: BlogLayout,
});

function BlogLayout() {
  const matches = useMatches();
  const onChild = matches.some((m) => m.routeId === "/blog/$slug");
  if (onChild) return <Outlet />;
  return <BlogIndex />;
}

function BlogIndex() {
  return (
    <section className="mx-auto max-w-7xl px-6 pt-20 pb-24">
      <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight">Blog</h1>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Research updates, paper walk-throughs, and demos from the ATOM Research Group.
      </p>
      <div className="mt-14 grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => (
          <Link
            key={p.slug}
            to="/blog/$slug"
            params={{ slug: p.slug }}
            className="card-hover group rounded-xl border border-border bg-card overflow-hidden"
          >
            <div className="aspect-[16/10] overflow-hidden">
              <img src={p.cover} alt={p.title} className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
            </div>
            <div className="p-6">
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <time>{new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}</time>
                <span>·</span>
                <span>{p.authors.join(", ")}</span>
              </div>
              <h2 className="mt-3 font-display text-xl font-semibold leading-snug group-hover:text-primary transition-colors">{p.title}</h2>
              <p className="mt-3 text-sm text-muted-foreground line-clamp-3">{p.excerpt}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{t}</span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
