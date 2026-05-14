import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowLeft, Newspaper } from "lucide-react";
import { getNewsLink, news } from "@/data/news";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: [
      { title: "News - ATOM" },
      {
        name: "description",
        content: "All news, updates, talks, and paper announcements from the ATOM Research Group.",
      },
      { property: "og:title", content: "News - ATOM" },
      { property: "og:description", content: "All updates from the ATOM Research Group." },
    ],
  }),
  component: NewsPage,
});

function NewsPage() {
  const sorted = [...news].sort((a, b) => +new Date(b.date) - +new Date(a.date));

  // Group by year for easy scanning across many entries
  const byYear = sorted.reduce<Record<string, typeof sorted>>((acc, n) => {
    const y = new Date(n.date).getFullYear().toString();
    (acc[y] ||= []).push(n);
    return acc;
  }, {});
  const years = Object.keys(byYear).sort((a, b) => +b - +a);

  return (
    <section className="mx-auto max-w-4xl px-6 pt-24 pb-24">
      <Link
        to="/"
        className="inline-flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition"
      >
        <ArrowLeft className="h-3.5 w-3.5" /> Back home
      </Link>
      <div className="mt-6 flex items-center gap-3">
        <Newspaper className="h-6 w-6 text-primary" />
        <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight">News</h1>
      </div>
      <p className="mt-5 max-w-2xl text-lg text-muted-foreground">
        Paper announcements, talks, releases, and research updates.
      </p>

      <div className="mt-14 space-y-14">
        {years.map((year) => (
          <div key={year}>
            <h2 className="font-display text-sm font-semibold tracking-widest uppercase text-muted-foreground">
              {year}
            </h2>
            <ul className="mt-4 divide-y divide-border/60 border-y border-border/60">
              {byYear[year].map((n, i) => {
                const date = new Date(n.date).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                });
                const link = getNewsLink(n);
                const body = (
                  <span className="text-sm text-foreground/85">
                    {n.text}
                    {n.highlight && (
                      <>
                        {" "}
                        <span className="text-primary font-medium">{n.highlight}</span>
                      </>
                    )}
                  </span>
                );
                return (
                  <li key={i} className="flex items-baseline gap-4 py-4">
                    <time className="shrink-0 w-20 text-xs font-mono text-muted-foreground tabular-nums">
                      {date}
                    </time>
                    {link?.kind === "blog" ? (
                      <Link
                        to="/blog/$slug"
                        params={{ slug: link.slug }}
                        className="flex-1 hover:opacity-90 transition"
                      >
                        {body}
                      </Link>
                    ) : link?.kind === "external" ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer"
                        className="flex-1 hover:opacity-90"
                      >
                        {body}
                      </a>
                    ) : (
                      <span className="flex-1">{body}</span>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
