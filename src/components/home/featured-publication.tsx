import { Authors, Figure, PaperLinks } from "@/components/site/paper-parts";
import { papers } from "@/data/papers";
import { byDateDesc } from "@/lib/format";

/** The most recent paper marked `featured` in `src/data/papers.ts`. */
export function FeaturedPublication() {
  const paper = [...papers].sort(byDateDesc).find((p) => p.featured);
  if (!paper) return null;

  return (
    <section aria-labelledby="featured-publication" className="container-page py-16 md:py-24">
      <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
        <div>
          <p className="eyebrow flex flex-wrap items-center gap-x-3 gap-y-2">
            Featured publication
            <span className="rounded-full bg-primary px-2.5 py-0.5 text-primary-foreground">
              {paper.venue} {paper.year}
            </span>
          </p>
          {paper.shortName && (
            <p className="mt-6 font-display text-5xl tracking-[-0.03em] md:text-6xl">
              {paper.shortName}
            </p>
          )}
          <h2
            id="featured-publication"
            className="mt-3 text-2xl leading-snug text-foreground/80 md:text-[1.7rem]"
          >
            {paper.title}
          </h2>
          <p className="mt-5 leading-relaxed text-muted-foreground">
            {paper.summary ?? paper.abstract}
          </p>
          <Authors paper={paper} className="mt-5" />
          <PaperLinks paper={paper} className="mt-7" />
        </div>

        {paper.figure && <Figure figure={paper.figure} className="lg:pt-2" minWidth={540} />}
      </div>
    </section>
  );
}
