import { Link } from "@tanstack/react-router";
import { BookOpen, Check, Code2, Copy, FileText, MousePointerClick, Quote } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import type { Paper, PaperFigure } from "@/data/papers";
import { formatBibtex } from "@/lib/format";
import { cn } from "@/lib/utils";

/** Author list with the group's own members emphasised. */
export function Authors({ paper, className }: { paper: Paper; className?: string }) {
  return (
    <p className={cn("text-sm text-muted-foreground", className)}>
      {paper.authors.map((author, i) => (
        <span key={author}>
          <span className={paper.groupAuthors?.includes(author) ? "text-foreground" : undefined}>
            {author}
          </span>
          {i < paper.authors.length - 1 && ", "}
        </span>
      ))}
    </p>
  );
}

/**
 * A paper figure in a frame. Figures wider than the screen scroll sideways
 * instead of shrinking until their labels are unreadable.
 */
export function Figure({
  figure,
  className,
  minWidth = 620,
}: {
  figure: PaperFigure;
  className?: string;
  minWidth?: number;
}) {
  const img = "block h-auto w-full";
  return (
    <figure className={cn("min-w-0", className)}>
      <div
        className={cn(
          "overflow-x-auto rounded-2xl border border-border bg-white",
          figure.dark && "dark:bg-[#0d1117]",
        )}
        tabIndex={0}
        role="group"
        aria-label={`Figure: ${figure.caption ?? figure.alt}`}
      >
        <div style={{ minWidth }}>
          <img
            src={figure.light}
            alt={figure.alt}
            width={figure.width}
            height={figure.height}
            loading="lazy"
            decoding="async"
            className={cn(img, figure.dark && "dark:hidden")}
          />
          {figure.dark && (
            <img
              src={figure.dark}
              alt={figure.alt}
              width={figure.width}
              height={figure.height}
              loading="lazy"
              decoding="async"
              className={cn(img, "hidden dark:block")}
            />
          )}
        </div>
      </div>
      {figure.caption && (
        <figcaption className="mt-3 text-sm text-muted-foreground">{figure.caption}</figcaption>
      )}
    </figure>
  );
}

/** Copy-to-clipboard button that confirms for a moment. */
export function CopyButton({ text, label = "Copy" }: { text: string; label?: string }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable: the text stays selectable in the page.
    }
  };
  return (
    <Button type="button" size="sm" variant="secondary" onClick={copy}>
      {copied ? <Check aria-hidden="true" /> : <Copy aria-hidden="true" />}
      <span aria-live="polite">{copied ? "Copied!" : label}</span>
    </Button>
  );
}

function CiteDialog({ paper }: { paper: Paper }) {
  const bibtex = formatBibtex(paper.bibtex);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button type="button" size="sm" variant="outline">
          <Quote aria-hidden="true" /> Cite
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogDescription className="eyebrow">BibTeX</DialogDescription>
          <DialogTitle className="font-display text-xl font-medium leading-snug">
            {paper.title}
          </DialogTitle>
        </DialogHeader>
        <pre
          tabIndex={0}
          className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-xs leading-relaxed"
        >
          {bibtex}
        </pre>
        <div className="flex justify-end">
          <CopyButton text={bibtex} />
        </div>
      </DialogContent>
    </Dialog>
  );
}

/** Paper, code, explainer, blog post and citation buttons for a paper. */
export function PaperLinks({ paper, className }: { paper: Paper; className?: string }) {
  const { links } = paper;
  const external = [
    { href: links.arxiv, label: "Read Paper", icon: FileText },
    { href: links.pdf, label: "PDF", icon: FileText },
    { href: links.code, label: "Code", icon: Code2 },
    { href: links.explainer, label: "Interactive explainer", icon: MousePointerClick },
    { href: links.project, label: "Project page", icon: BookOpen },
  ].filter((link) => link.href);

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {external.map(({ href, label, icon: Icon }, i) => (
        <Button key={label} asChild size="sm" variant={i === 0 ? "default" : "outline"}>
          <a href={href} target="_blank" rel="noreferrer">
            <Icon aria-hidden="true" /> {label}
          </a>
        </Button>
      ))}
      {links.blog && (
        <Button asChild size="sm" variant="outline">
          <Link to="/blog/$slug" params={{ slug: links.blog }}>
            <BookOpen aria-hidden="true" /> Blog post
          </Link>
        </Button>
      )}
      <CiteDialog paper={paper} />
    </div>
  );
}
