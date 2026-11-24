import { createFileRoute } from "@tanstack/react-router";
import { FeaturedPublication } from "@/components/home/featured-publication";
import { Hero } from "@/components/home/hero";
import { LatestNews } from "@/components/home/latest-news";
import { PeopleStrip } from "@/components/home/people-strip";
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
      <PeopleStrip />
    </>
  );
}
