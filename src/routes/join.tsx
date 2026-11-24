import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Mail } from "lucide-react";
import { PageHeader } from "@/components/site/section";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import site from "@/data/site.json";
import { staticPageMeta } from "@/lib/seo";
import { breadcrumbs } from "@/lib/structured-data";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: staticPageMeta("/join", { jsonLd: breadcrumbs([{ name: "Join Us", path: "/join" }]) }),
  }),
  component: JoinPage,
});

const EMAIL = site.email;

const PROJECTS = [
  {
    title: "Principled hierarchies",
    tag: "Universal world modeling",
    desc: "How should agents learn abstract, hierarchical models of their world? This project connects hierarchical reinforcement learning, causal models, multiscale physics and hierarchical active inference, in theory and in practice.",
  },
  {
    title: "Natural building blocks in practice",
    tag: "Universal world modeling",
    desc: "Develop learnable world-model building blocks that work on their own and combine into hierarchical active inference agents.",
  },
  {
    title: "LLM-driven structure learning",
    tag: "Model discovery",
    desc: "Use large language models to propose and refine the structure of world models for active inference agents, keeping an interpretable trace of every change. An existing pipeline shows promising first results, and many scientific questions remain open.",
  },
  {
    title: "Benchmarking ATOM agents",
    tag: "Evaluation",
    desc: "What are agents that learn like we do good at, and how should we measure it? Review existing reinforcement learning and world modeling benchmarks, learn about how children learn, and design new evaluations.",
  },
];

const FAQ = [
  {
    q: "How does ATOM work?",
    a: "We work in projects. Each project has a lead and a small team, answers one part of our question, and aims at a paper and code. We keep the group small and the bar high: scientific rigour comes first.",
  },
  {
    q: "Is this remote or in person?",
    a: "Remote by default. Hosting in person in Tübingen is occasionally possible, depending on capacity and timing.",
  },
  {
    q: "Is this paid?",
    a: "Unpaid by default. Paid positions are occasionally possible, depending on funding, capacity and timing.",
  },
  {
    q: "Can I do my master's thesis on one of these projects?",
    a: "Yes, when a project is recruiting: say so in your application. ETH and Tübingen students can be co-supervised in Tübingen.",
  },
];

function mail(subject: string) {
  return `mailto:${EMAIL}?subject=${encodeURIComponent(subject)}`;
}

function JoinPage() {
  return (
    <>
      <PageHeader title="Join us">
        <p>
          ATOM is a select group of researchers. We work in projects, each answering one part of
          our question. Follow{" "}
          <a href={site.twitter} className="text-foreground underline underline-offset-4">
            @atomresearchlab
          </a>{" "}
          to hear first about new opportunities.
        </p>
      </PageHeader>

      <section className="container-page" aria-labelledby="projects">
        <h2 id="projects" className="text-3xl tracking-[-0.02em]">
          Open projects
        </h2>
        <p className="mt-3 max-w-2xl leading-relaxed text-muted-foreground">
          These are open projects within ATOM, for students and researchers who want to join. All
          projects are remote by default.
        </p>
        <ul className="mt-8 grid gap-5 md:grid-cols-2">
          {PROJECTS.map((p) => (
            <li key={p.title} className="rounded-2xl border border-border bg-card p-7">
              <div className="flex flex-wrap gap-2">
                {[p.tag, "Applications on hold", "Remote"].map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground"
                  >
                    {t}
                  </span>
                ))}
              </div>
              <h3 className="mt-4 text-2xl">{p.title}</h3>
              <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">
                {p.desc}
              </p>
            </li>
          ))}
        </ul>
      </section>

      <section className="container-page mt-16 md:mt-24" aria-labelledby="propose">
        <div className="rounded-2xl border border-border bg-card p-7 md:p-10">
          <p className="eyebrow">Lead or supervise a project</p>
          <h2 id="propose" className="mt-3 text-3xl tracking-[-0.02em]">
            Have a project that answers part of our question?
          </h2>
          <p className="mt-4 max-w-2xl leading-relaxed text-muted-foreground">
            Open now. Researchers who want to lead or supervise a project, and students with a project
            of their own, are welcome to get in touch with a CV and a short description of the
            project.
          </p>
          <Button asChild className="mt-6 max-w-full">
            <a href={mail("[Project proposal] Your name")}>
              <Mail aria-hidden="true" />
              <span className="truncate">Propose a project: {EMAIL}</span>
              <ArrowRight aria-hidden="true" />
            </a>
          </Button>
        </div>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl tracking-[-0.02em]">How it works</h2>
          </div>
          <Accordion type="single" collapsible className="w-full border-t border-border">
            {FAQ.map((f) => (
              <AccordionItem key={f.q} value={f.q}>
                <AccordionTrigger>{f.q}</AccordionTrigger>
                <AccordionContent>{f.a}</AccordionContent>
              </AccordionItem>
            ))}
            <AccordionItem value="other">
              <AccordionTrigger>Any other question?</AccordionTrigger>
              <AccordionContent>
                Email{" "}
                <a href={mail("[Question] ")} className="text-foreground underline underline-offset-4">
                  {EMAIL}
                </a>{" "}
                with the subject{" "}
                <span className="font-mono text-foreground">[Question] XXX</span>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}
