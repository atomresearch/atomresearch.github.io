import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/site/section";
import { Button } from "@/components/ui/button";
import { staticPageMeta } from "@/lib/seo";

export const Route = createFileRoute("/philosophy")({
  head: () => ({ meta: staticPageMeta("/philosophy") }),
  component: PhilosophyPage,
});

function PhilosophyPage() {
  return (
    <>
      <PageHeader title="Research Philosophy">
        <p>
          Essays and meditations on inquiry, model-building, and the role of agents in scientific
          thought. This space intentionally blends rigorous reflection with expressive, artful
          presentation.
        </p>
      </PageHeader>

      <div className="container-page">
        <article className="prose-atom max-w-[44rem] border-t border-border-strong pt-2">
          <h2>On Inquiry</h2>
          <p>
            At <strong>ATOM Research Group</strong>, inquiry is not a mechanism for collecting
            answers; it is a discipline of learning how to see. We believe that the deepest advances
            emerge not from certainty, but from carefully cultivated doubt — from the willingness to
            examine assumptions, challenge abstractions, and remain attentive to what escapes
            explanation.
          </p>

          <p>
            Research begins where familiar language becomes insufficient. In those moments, the task
            is not simply to optimize models or scale computation, but to ask questions capable of
            reshaping the boundaries of understanding itself.
          </p>

          <h2>Experiments as Thought</h2>
          <p>
            Every experiment is an act of dialogue between theory and reality. A model proposes; the
            world responds. Between prediction and observation exists a fertile space where
            unexpected structures emerge, where errors become signals, and where failure often
            reveals more than success.
          </p>

          <p>
            We approach experimentation not as validation alone, but as a form of intellectual
            listening. Each iteration refines not only systems, but the questions that guide them.
            Research, in this sense, is less a linear progression and more a living conversation
            with complexity.
          </p>

          <h2>On Intelligence</h2>
          <p>
            Intelligence is not merely the accumulation of information or the compression of
            patterns into efficient representations. It is the capacity to navigate ambiguity, to
            reason under uncertainty, and to discover meaningful structure within seemingly
            disconnected phenomena.
          </p>

          <p>
            At ATOM, we are interested in systems that do more than predict. We seek systems capable
            of reflection, adaptation, curiosity, and conceptual transformation — systems that learn
            not only from data, but from interaction, contradiction, and surprise.
          </p>

          <h2>On Simplicity and Depth</h2>
          <p>
            Elegance in research is not reduction for its own sake. A beautiful theory does not
            erase complexity; it renders complexity intelligible. The finest ideas possess a certain
            quiet clarity — structures simple enough to hold in thought, yet deep enough to
            illuminate entire landscapes of phenomena.
          </p>

          <p>
            And still, there remain mysteries that resist closure. We do not view this as a
            limitation of science, but as one of its enduring sources of vitality. Some questions
            are solved; others continue to expand the horizon of inquiry itself.
          </p>

          <h2>The Spirit of ATOM</h2>
          <p>
            ATOM Research Group exists at the intersection of computation, cognition, and
            imagination. We pursue research with rigor, but also with openness — believing that
            transformative discoveries often arise from unexpected connections across domains,
            disciplines, and ways of thinking.
          </p>

          <p>
            Our philosophy is grounded in curiosity without arrogance, ambition without haste, and
            precision without rigidity. We build not only to achieve performance, but to deepen
            understanding: of intelligence, of systems, and ultimately, of the principles that shape
            knowledge itself.
          </p>
        </article>

        <Button asChild className="mt-12">
          <Link to="/research">
            Explore Research <ArrowRight aria-hidden="true" />
          </Link>
        </Button>
      </div>
    </>
  );
}
