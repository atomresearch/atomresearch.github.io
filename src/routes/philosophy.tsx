import { createFileRoute, Link } from "@tanstack/react-router";
import { AmbientBg } from "@/components/site/background";

export const Route = createFileRoute("/philosophy")({
  head: () => ({
    meta: [
      { title: "Philosophy - ATOM" },
      { name: "description", content: "Philosophical reflections and essays from the ATOM Research Group." },
      { property: "og:title", content: "Philosophy - ATOM" },
    ],
  }),
  component: PhilosophyPage,
});

function PhilosophyPage() {
  return (
    <>
      <section className="relative">
        <AmbientBg />
        <div className="mx-auto max-w-7xl px-6 pt-24 pb-32">
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight">Research Philosophy</h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Essays and meditations on inquiry, model-building, and the role of agents in
            scientific thought. This space intentionally blends rigorous reflection with
            expressive, artful presentation.
          </p>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 pb-32">
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h2 className="mt-6">On Inquiry</h2>
          <p>
            At <strong>ATOM Research Group</strong>, inquiry is not a mechanism for collecting
            answers; it is a discipline of learning how to see. We believe that the deepest
            advances emerge not from certainty, but from carefully cultivated doubt — from the
            willingness to examine assumptions, challenge abstractions, and remain attentive to
            what escapes explanation.
          </p>

          <p>
            Research begins where familiar language becomes insufficient. In those moments, the
            task is not simply to optimize models or scale computation, but to ask questions
            capable of reshaping the boundaries of understanding itself.
          </p>

          <h2 className="mt-8">Experiments as Thought</h2>
          <p>
            Every experiment is an act of dialogue between theory and reality. A model proposes;
            the world responds. Between prediction and observation exists a fertile space where
            unexpected structures emerge, where errors become signals, and where failure often
            reveals more than success.
          </p>

          <p>
            We approach experimentation not as validation alone, but as a form of intellectual
            listening. Each iteration refines not only systems, but the questions that guide
            them. Research, in this sense, is less a linear progression and more a living
            conversation with complexity.
          </p>

          <h2 className="mt-8">On Intelligence</h2>
          <p>
            Intelligence is not merely the accumulation of information or the compression of
            patterns into efficient representations. It is the capacity to navigate ambiguity,
            to reason under uncertainty, and to discover meaningful structure within seemingly
            disconnected phenomena.
          </p>

          <p>
            At ATOM, we are interested in systems that do more than predict. We seek systems
            capable of reflection, adaptation, curiosity, and conceptual transformation —
            systems that learn not only from data, but from interaction, contradiction, and
            surprise.
          </p>

          <h2 className="mt-8">On Simplicity and Depth</h2>
          <p>
            Elegance in research is not reduction for its own sake. A beautiful theory does not
            erase complexity; it renders complexity intelligible. The finest ideas possess a
            certain quiet clarity — structures simple enough to hold in thought, yet deep enough
            to illuminate entire landscapes of phenomena.
          </p>

          <p>
            And still, there remain mysteries that resist closure. We do not view this as a
            limitation of science, but as one of its enduring sources of vitality. Some
            questions are solved; others continue to expand the horizon of inquiry itself.
          </p>

          <h2 className="mt-8">The Spirit of ATOM</h2>
          <p>
            ATOM Research Group exists at the intersection of computation, cognition, and
            imagination. We pursue research with rigor, but also with openness — believing that
            transformative discoveries often arise from unexpected connections across domains,
            disciplines, and ways of thinking.
          </p>

          <p>
            Our philosophy is grounded in curiosity without arrogance, ambition without haste,
            and precision without rigidity. We build not only to achieve performance, but to
            deepen understanding: of intelligence, of systems, and ultimately, of the principles
            that shape knowledge itself.
          </p>

          <div className="mt-12 text-center">
            <Link
              to="/research"
              className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 transition"
            >
              Explore Research
            </Link>
          </div>
        </article>
      </section>
    </>
  );
}
