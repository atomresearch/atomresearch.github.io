import { createFileRoute } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Briefcase, GraduationCap, Mail, Plane } from "lucide-react";
import { AmbientBg } from "@/components/site/background";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";

export const Route = createFileRoute("/join")({
  head: () => ({
    meta: [
      { title: "Join Us - ATOM" },
      { name: "description", content: "Collaborate with ATOM. We're open to new collaborators, visiting researchers, and interns." },
      { property: "og:title", content: "Join ATOM" },
      { property: "og:description", content: "Open positions, visiting researcher info, and collaboration opportunities." },
    ],
  }),
  component: JoinPage,
});

const EMAIL = "lancelot.dacosta@gmail.com";

function JoinPage() {
  return (
    <>
      <section className="relative">
        <AmbientBg />
        <div className="mx-auto max-w-4xl px-6 pt-24 pb-16 text-center">
          <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            {/* <div className="inline-flex items-center gap-2 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
              We're hiring & collaborating
            </div> */}
            <h1 className="mt-6 font-display text-5xl md:text-7xl font-semibold tracking-tight">
              Collaborate <span className="inline-block">🤝</span>
            </h1>
            <p className="mt-6 text-lg text-muted-foreground max-w-2xl mx-auto leading-relaxed">
              We are always looking for potential collaborators. If this is you, please drop us a quick note by email
              with the subject <span className="text-foreground font-mono text-base">[Collaboration] XXX</span>.
            </p>
            <a
              href={`mailto:${EMAIL}?subject=${encodeURIComponent("[Collaboration] ")}`}
              className="mt-10 inline-flex items-center gap-2 px-6 py-3.5 rounded-md bg-primary text-primary-foreground font-medium ring-glow hover:opacity-90 transition"
            >
              <Mail className="h-4 w-4" /> {EMAIL} <ArrowRight className="h-4 w-4" />
            </a>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
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

        <div className="mt-16 rounded-2xl border border-border bg-card p-8 md:p-12">
          <h2 className="font-display text-2xl md:text-3xl font-semibold">What working with us looks like</h2>
          <ul className="mt-6 grid gap-4 md:grid-cols-2 text-sm text-muted-foreground">
            <li className="flex gap-3"><span className="text-primary mt-1">→</span> Tight, ambitious projects with weekly discussions.</li>
            <li className="flex gap-3"><span className="text-primary mt-1">→</span> Generous engineering support & guidance.</li>
            <li className="flex gap-3"><span className="text-primary mt-1">→</span> Open-source by default; we publish code and reproducible artifacts.</li>
            <li className="flex gap-3"><span className="text-primary mt-1">→</span> A culture that values clarity, rigor, and curiosity in equal measure.</li>
          </ul>
        </div>
      </section>

      <section className="mx-auto max-w-4xl px-6 pb-24">
        <div className="rounded-2xl border border-border bg-card p-8 md:p-12">
          <div className="max-w-2xl">
            <p className="text-sm font-medium uppercase tracking-[0.2em] text-primary">Frequently asked questions</p>
            <h2 className="mt-3 font-display text-2xl md:text-3xl font-semibold">Student researcher applications</h2>
            <p className="mt-4 text-sm md:text-base text-muted-foreground leading-relaxed">
              If you want to collaborate or apply as a student researcher, these are the main details.
            </p>
          </div>

          <Accordion type="single" collapsible className="mt-8 w-full">
            <AccordionItem value="collaborate">
              <AccordionTrigger>How do I apply to collaborate?</AccordionTrigger>
              <AccordionContent>
                I am always looking for potential collaborators. If this is you, please drop me a quick note by email
                with the subject <span className="font-mono text-foreground">[Collaboration] XXX</span>.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="who-can-apply">
              <AccordionTrigger>Who can apply as a student researcher?</AccordionTrigger>
              <AccordionContent>
                I welcome applications from all students who can devote 9 months to 2 years working with me. You can
                be of any career stage, from anywhere on Earth. I particularly encourage applications from diverse
                backgrounds.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="application-materials">
              <AccordionTrigger>What should I include in my application?</AccordionTrigger>
              <AccordionContent>
                Please send me a CV and a link or attachment to the proudest thing you have built, worked on, or
                accomplished.
                Optionally, you can briefly describe what you would like to work on with me.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="motivation">
              <AccordionTrigger>Should I include anything else about myself?</AccordionTrigger>
              <AccordionContent>
                Yes. I also encourage you to include a few sentences about what drives you, meaning what you deeply
                care about independently of what I research. Feel free to include anything else about you that you
                would like me to know.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="process">
              <AccordionTrigger>What happens after I get in touch?</AccordionTrigger>
              <AccordionContent>
                Depending on the potential fit, you may be invited to an interview. The goal is to determine how our
                interests, motivations, and personalities align, and whether we would both enjoy working together.
                Prior to getting in touch, please read our research program.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="expectations">
              <AccordionTrigger>What can I expect from the experience?</AccordionTrigger>
              <AccordionContent>
                Expected outputs include at least one publication in a top-tier scientific conference or journal,
                hands-on research experience in a frontier topic within artificial intelligence, computational
                cognitive science, applied mathematics, mathematical physics, or related fields, and a
                recommendation letter from me upon request.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="paid-position">
              <AccordionTrigger>Is this a paid position?</AccordionTrigger>
              <AccordionContent>
                This is an unpaid position. If you are looking for supervision via a paid position,
                this may potentially be possible through the EI Department at the
                Max-Planck Institute for Intelligent Systems mentioning my name in your application, or by applying to
                a dedicated grant with my support. In this case, please contact me first.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="master-thesis">
              <AccordionTrigger>Can ETH/Tübingen master students do a thesis with you?</AccordionTrigger>
              <AccordionContent>
                Yes. ETH/Tübingen master students can do their MSc thesis under my supervision and that of Bernhard
                Schölkopf. If you are interested, register your interest via the EI Department at the Max-Planck
                Institute for Intelligent Systems mentioning my name in your application. Spread the word.
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="other-questions">
              <AccordionTrigger>What if I have another question?</AccordionTrigger>
              <AccordionContent>
                Drop me a quick note by email with the subject <span className="font-mono text-foreground">[Supervision Question] XXX</span>.
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </section>
    </>
  );
}

function Card({ icon: Icon, title, body }: { icon: React.ComponentType<{ className?: string }>; title: string; body: string }) {
  return (
    <div className="card-hover rounded-xl border border-border bg-card p-7">
      <div className="h-10 w-10 grid place-items-center rounded-lg bg-primary/10 text-primary">
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-5 font-display text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{body}</p>
    </div>
  );
}
