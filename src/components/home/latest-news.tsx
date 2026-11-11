import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { NewsText } from "@/components/site/news-item";
import { moreLinkClass } from "@/components/site/section";
import { news } from "@/data/news";
import { byDateDesc, formatDate } from "@/lib/format";

/** The three most recent news items, as a strip under the hero. */
export function LatestNews() {
  const latest = [...news].sort(byDateDesc).slice(0, 3);

  return (
    <section aria-labelledby="latest-news" className="border-b border-border bg-surface">
      <div className="container-page py-8 md:py-10">
        <div className="flex items-center justify-between gap-4">
          <h2 id="latest-news" className="eyebrow !font-mono">
            What's new
          </h2>
          <Link to="/news/" className={moreLinkClass}>
            All updates <ArrowRight aria-hidden="true" />
          </Link>
        </div>
        <ol className="mt-5 grid gap-x-10 md:grid-cols-3">
          {latest.map((item) => (
            <li
              key={item.date + item.highlight}
              className="border-t border-border py-4 md:border-t-2 md:border-border-strong md:pt-4 md:pb-0 md:first:border-foreground"
            >
              <time dateTime={item.date} className="font-mono text-xs text-muted-foreground">
                {formatDate(item.date)}
              </time>
              <p className="mt-1.5 text-[0.9375rem] leading-snug">
                <NewsText item={item} />
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
