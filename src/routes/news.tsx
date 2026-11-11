import { createFileRoute } from "@tanstack/react-router";
import { NewsText } from "@/components/site/news-item";
import { PageHeader } from "@/components/site/section";
import { news, type NewsItem } from "@/data/news";
import { byDateDesc, formatDate } from "@/lib/format";
import { staticPageMeta } from "@/lib/seo";
import { breadcrumbs } from "@/lib/structured-data";

export const Route = createFileRoute("/news")({
  head: () => ({
    meta: staticPageMeta("/news", { jsonLd: breadcrumbs([{ name: "News", path: "/news" }]) }),
  }),
  component: NewsPage,
});

// Newest first, grouped by year.
const years = [...news]
  .sort(byDateDesc)
  .reduce<{ year: string; items: NewsItem[] }[]>((groups, item) => {
    const year = item.date.slice(0, 4);
    const group = groups.find((g) => g.year === year);
    if (group) group.items.push(item);
    else groups.push({ year, items: [item] });
    return groups;
  }, []);

function NewsPage() {
  return (
    <>
      <PageHeader title="News">
        <p>Paper announcements, talks, releases, and research updates.</p>
      </PageHeader>

      <div className="container-page">
        <div className="max-w-3xl">
          {years.map(({ year, items }, y) => (
            <section key={year} aria-labelledby={`year-${year}`} className="relative">
              <h2
                id={`year-${year}`}
                className="sticky top-16 z-10 -ml-px flex items-center gap-4 bg-background/90 py-3 font-display text-3xl backdrop-blur-sm"
              >
                {year}
                <span className="h-px flex-1 bg-border" aria-hidden="true" />
              </h2>
              {/* The rail: a line with one marker per item. */}
              <ol className="relative ml-[5px] border-l border-border-strong pb-10 pt-3">
                {items.map((item, i) => (
                  <li
                    key={item.date + item.highlight}
                    className="relative pb-8 pl-7 last:pb-0 md:pl-9"
                  >
                    <span
                      aria-hidden="true"
                      className={
                        y === 0 && i === 0
                          ? "absolute -left-[6px] top-[5px] h-[11px] w-[11px] rounded-full bg-signal ring-4 ring-background"
                          : "absolute -left-[5px] top-[6px] h-[9px] w-[9px] rounded-full border-[1.5px] border-foreground/60 bg-background ring-4 ring-background"
                      }
                    />
                    <time dateTime={item.date} className="font-mono text-xs text-muted-foreground">
                      {formatDate(item.date, "dayMonth")}
                    </time>
                    <p className="mt-1 text-lg leading-snug">
                      <NewsText item={item} />
                    </p>
                  </li>
                ))}
              </ol>
            </section>
          ))}
        </div>
      </div>
    </>
  );
}
