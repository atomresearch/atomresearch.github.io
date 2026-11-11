import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { FeaturedPublication } from "@/components/home/featured-publication";
import { Hero } from "@/components/home/hero";
import { LatestNews } from "@/components/home/latest-news";
import { PeopleStrip } from "@/components/home/people-strip";
import { ResearchThemes } from "@/components/site/research-themes";
import { SectionHeading, moreLinkClass } from "@/components/site/section";
import { staticPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/")({
  head: () => ({ meta: staticPageMeta("/") }),
  component: HomePage,
});

function HomePage() {
  return (
    <>
      <Hero />
      <LatestNews />
      <FeaturedPublication />

      <section aria-labelledby="themes" className="border-t border-border bg-surface">
        <div className="container-page py-16 md:py-24">
          <SectionHeading
            id="themes"
            title="Core research themes"
            lead="Three pillars guiding our experimental agenda."
            action={
              <Link to="/research/" className={moreLinkClass}>
                All research <ArrowRight aria-hidden="true" />
              </Link>
            }
          />
          <div className="mt-10">
            <ResearchThemes />
          </div>
        </div>
      </section>

      <PeopleStrip />
    </>
  );
}
