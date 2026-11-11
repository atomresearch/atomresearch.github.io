import { createFileRoute } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useState } from "react";
import { Authors, Figure, PaperLinks } from "@/components/site/paper-parts";
import { ResearchThemes } from "@/components/site/research-themes";
import { PageHeader, SectionHeading, Tag } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { papers, type Paper } from "@/data/papers";
import { byDateDesc, formatDate } from "@/lib/format";
import { staticPageMeta } from "@/lib/seo";
import { breadcrumbs } from "@/lib/structured-data";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: staticPageMeta("/research", {
      jsonLd: breadcrumbs([{ name: "Research", path: "/research" }]),
    }),
  }),
  component: ResearchPage,
});

const keywords = [
  "Active model discovery",
  "Probabilistic program induction",
  "Structure learning",
  "Causal representation learning",
  "Model-based reinforcement learning",
  "Variational inference",
];

const PAGE_SIZE = 10;
const sorted = [...papers].sort(byDateDesc);

function ResearchPage() {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <PageHeader title="Research">
        <p>
          Our agenda is to develop an{" "}
          <strong className="font-medium text-foreground">Agent Foundation Model</strong> - a
          generalist AI that learns to understand novel environments through active exploration,
          hypothesis formation, and self-directed experimentation. We bring together probabilistic
          modelling, causal inference, program induction, and reinforcement learning to chase that
          vision.
        </p>
        <ul className="mt-7 flex flex-wrap gap-2" aria-label="Research keywords">
          {keywords.map((keyword) => (
            <li key={keyword} className="flex">
              <Tag>{keyword}</Tag>
            </li>
          ))}
        </ul>
      </PageHeader>

      <section aria-labelledby="themes" className="border-y border-border bg-surface">
        <div className="container-page py-14 md:py-20">
          <SectionHeading
            id="themes"
            title="Core research themes"
            lead="Three pillars guiding our experimental agenda."
          />
          <div className="mt-10">
            <ResearchThemes />
          </div>
        </div>
      </section>

      <section aria-labelledby="publications" className="container-page pt-14 md:pt-20">
        <SectionHeading
          id="publications"
          title="Publications"
          action={
            <span className="font-mono text-xs text-muted-foreground">
              {sorted.length} {sorted.length === 1 ? "publication" : "publications"}
            </span>
          }
        />
        <ol className="mt-8 border-t border-border-strong">
          {current.map((paper) => (
            <li key={paper.id} className="border-b border-border py-10 md:py-12">
              <Publication paper={paper} />
            </li>
          ))}
        </ol>

        {totalPages > 1 && (
          <nav
            aria-label="Publication pages"
            className="mt-10 flex items-center justify-center gap-2"
          >
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
            >
              <ChevronLeft aria-hidden="true" /> Prev
            </Button>
            <span className="px-3 font-mono text-xs text-muted-foreground">
              {page} / {totalPages}
            </span>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
            >
              Next <ChevronRight aria-hidden="true" />
            </Button>
          </nav>
        )}
      </section>
    </>
  );
}

function Publication({ paper }: { paper: Paper }) {
  return (
    <article className="grid gap-x-12 gap-y-6 md:grid-cols-[9rem_minmax(0,1fr)]">
      <div className="flex items-center gap-3 md:flex-col md:items-start md:gap-2">
        <span className="rounded-full bg-primary px-2.5 py-0.5 font-mono text-xs font-medium text-primary-foreground">
          {paper.venue} {paper.year}
        </span>
        <time dateTime={paper.date} className="font-mono text-xs text-muted-foreground">
          {formatDate(paper.date)}
        </time>
      </div>

      <div className="min-w-0">
        <h3 className="text-2xl leading-snug md:text-[1.75rem]">{paper.title}</h3>
        <Authors paper={paper} className="mt-3" />
        <p className="mt-5 max-w-3xl leading-relaxed text-foreground/85">{paper.abstract}</p>
        <ul className="mt-5 flex flex-wrap gap-2" aria-label="Topics">
          {paper.tags.map((tag) => (
            <li key={tag} className="flex">
              <Tag>{tag}</Tag>
            </li>
          ))}
        </ul>
        <PaperLinks paper={paper} className="mt-6" />
        {paper.results && (
          <Figure figure={paper.results} className="mt-9 max-w-3xl" minWidth={520} />
        )}
      </div>
    </article>
  );
}
