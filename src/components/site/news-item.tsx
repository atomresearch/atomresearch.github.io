import { Link } from "@tanstack/react-router";
import { getNewsLink, type NewsItem } from "@/data/news";

/** Text of a news item, linked to its blog post or external page if any. */
export function NewsText({ item, className }: { item: NewsItem; className?: string }) {
  const link = getNewsLink(item);
  const body = (
    <>
      <span className="text-muted-foreground">{item.text.trim()}</span>
      {item.highlight && (
        <>
          {" "}
          <span className={link ? "link font-medium" : "font-medium text-foreground"}>
            {item.highlight}
          </span>
        </>
      )}
    </>
  );

  if (link?.kind === "blog") {
    return (
      <Link to="/blog/$slug" params={{ slug: link.slug }} className={className}>
        {body}
      </Link>
    );
  }
  if (link?.kind === "external") {
    return (
      <a href={link.href} target="_blank" rel="noreferrer" className={className}>
        {body}
      </a>
    );
  }
  return <span className={className}>{body}</span>;
}
