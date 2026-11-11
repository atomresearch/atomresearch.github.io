import { createFileRoute } from "@tanstack/react-router";
import { ArrowRight, Briefcase, GraduationCap, Mail, Plane } from "lucide-react";
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

export const Route = createFileRoute("/join")({
  head: () => ({ meta: staticPageMeta("/join") }),
  component: JoinPage,
});

const EMAIL = site.email;

function JoinPage() {
  return (
    <>
      <PageHeader title="Collaborate 🤝">
        <p>
          We are always looking for potential collaborators. If this is you, please drop us a quick
          note by email with the subject{" "}
          <span className="font-mono text-base text-foreground">[Collaboration] XXX</span>.
        </p>
        <Button asChild className="mt-8 max-w-full">
          <a href={`mailto:${EMAIL}?subject=${encodeURIComponent("[Collaboration] ")}`}>
            <Mail aria-hidden="true" />
            <span className="truncate">{EMAIL}</span>
            <ArrowRight aria-hidden="true" />
          </a>
        </Button>
      </PageHeader>

      <section className="container-page">
        <div className="grid gap-5 md:grid-cols-3">
          <Card
            icon={GraduationCap}
            title="PhD students"
            body="We welcome strong candidates with a background in ML, statistics, computer science, or cognitive science."
          />
          <Card
            icon={Plane}
            title="Visiting researchers"
            body="Spend 6-12 months with us. Best fit if you have an active research agenda overlapping universal modelling, model discovery, or active learning."
          />
          <Card
            icon={Briefcase}
            title="Internships"
            body="Summer and rolling internship slots for masters. Past interns have led first-author publications. Send a CV and 2 paragraphs on a research question you'd love to attack."
          />
        </div>

        <div className="mt-14 border-t border-border-strong pt-10">
          <h2 className="text-3xl tracking-[-0.02em]">What working with us looks like</h2>
          <ul className="mt-6 grid gap-x-10 gap-y-4 text-muted-foreground md:grid-cols-2">
            {[
              "Tight, ambitious projects with weekly discussions.",
              "Generous engineering support & guidance.",
              "Open-source by default; we publish code and reproducible artifacts.",
              "A culture that values clarity, rigor, and curiosity in equal measure.",
            ].map((item) => (
              <li key={item} className="flex gap-3">
                <ArrowRight className="mt-1 h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container-page mt-16 md:mt-24">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-16">
          <div>
            <p className="eyebrow">Frequently asked questions</p>
            <h2 className="mt-3 text-3xl tracking-[-0.02em]">Student researcher applications</h2>
            <p className="mt-4 leading-relaxed text-muted-foreground">
              If you want to collaborate or apply as a student researcher, these are the main
              details.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full border-t border-border">
            <AccordionItem value="collaborate">
              <AccordionTrigger>How do I apply to collaborate?</AccordionTrigger>
              <AccordionContent>
                I am always looking for potential collaborators. If this is you, please drop me a
                quick note by email with the subject{" "}
                <span className="font-mono text-foreground">[Collaboration] XXX</span>.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="who-can-apply">
              <AccordionTrigger>Who can apply as a student researcher?</AccordionTrigger>
              <AccordionContent>
                I welcome applications from all students who can devote 9 months to 2 years working
                with me. You can be of any career stage, from anywhere on Earth. I particularly
                encourage applications from diverse backgrounds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="application-materials">
              <AccordionTrigger>What should I include in my application?</AccordionTrigger>
              <AccordionContent>
                Please send me a CV and a link or attachment to the proudest thing you have built,
                worked on, or accomplished. Optionally, you can briefly describe what you would like
                to work on with me.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="motivation">
              <AccordionTrigger>Should I include anything else about myself?</AccordionTrigger>
              <AccordionContent>
                Yes. I also encourage you to include a few sentences about what drives you, meaning
                what you deeply care about independently of what I research. Feel free to include
                anything else about you that you would like me to know.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="process">
              <AccordionTrigger>What happens after I get in touch?</AccordionTrigger>
              <AccordionContent>
                Depending on the potential fit, you may be invited to an interview. The goal is to
                determine how our interests, motivations, and personalities align, and whether we
                would both enjoy working together. Prior to getting in touch, please read our
                research program.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expectations">
              <AccordionTrigger>What can I expect from the experience?</AccordionTrigger>
              <AccordionContent>
                Expected outputs include at least one publication in a top-tier scientific
                conference or journal, hands-on research experience in a frontier topic within
                artificial intelligence, computational cognitive science, applied mathematics,
                mathematical physics, or related fields, and a recommendation letter from me upon
                request.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="paid-position">
              <AccordionTrigger>Is this a paid position?</AccordionTrigger>
              <AccordionContent>
                This is an unpaid position. If you are looking for supervision via a paid position,
                this may potentially be possible through the EI Department at the Max-Planck
                Institute for Intelligent Systems mentioning my name in your application, or by
                applying to a dedicated grant with my support. In this case, please contact me
                first.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="master-thesis">
              <AccordionTrigger>
                Can ETH/Tübingen master students do a thesis with you?
              </AccordionTrigger>
              <AccordionContent>
                Yes. ETH/Tübingen master students can do their MSc thesis under my supervision and
                that of Bernhard Schölkopf. If you are interested, register your interest via the EI
                Department at the Max-Planck Institute for Intelligent Systems mentioning my name in
                your application. Spread the word.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="other-questions">
              <AccordionTrigger>What if I have another question?</AccordionTrigger>
              <AccordionContent>
                Drop me a quick note by email with the subject{" "}
                <span className="font-mono text-foreground">[Supervision Question] XXX</span>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}

function Card({
  icon: Icon,
  title,
  body,
}: {
  icon: React.ComponentType<{ className?: string }>;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-card p-7">
      <Icon className="h-6 w-6 text-primary" aria-hidden="true" />
      <h3 className="mt-5 text-2xl">{title}</h3>
      <p className="mt-2 text-[0.9375rem] leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
