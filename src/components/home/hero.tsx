import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BeliefCanvas } from "./belief-canvas";

export function Hero() {
  return (
    <section className="border-b border-border">
      <div className="container-page grid gap-10 pt-10 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <p className="eyebrow animate-rise">ATOM Research Group</p>
          <h1 className="animate-rise mt-5 text-[2.9rem] leading-[1] tracking-[-0.03em] [animation-delay:60ms] sm:text-6xl lg:text-[4.5rem]">
            Toward an Agent Foundation Model
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms] md:text-xl md:leading-relaxed">
            Building principled, experimental agents that model, question, and probe complex systems
            - with a focus on scalability, robustness, trustworthiness and data-efficiency.
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:180ms]">
            <Button asChild>
              <Link to="/research">
                Our Research <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/members">Members</Link>
            </Button>
          </div>
        </div>

        <figure className="animate-rise [animation-delay:120ms]">
          <div className="bg-dots relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card sm:aspect-[16/10] lg:aspect-[5/4]">
            <BeliefCanvas className="absolute inset-0 h-full w-full" />
            <span className="eyebrow pointer-events-none absolute bottom-12 left-4 !text-[0.65rem]">
              Belief entropy
            </span>
          </div>
          <figcaption className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.8125rem] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-primary" aria-hidden="true" />
              Hypotheses
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-full border-[1.5px] border-foreground/70"
                aria-hidden="true"
              />
              Hidden state
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-signal" aria-hidden="true" />
              Observations
            </span>
            <span className="sr-only">
              Animation of a particle filter: a cloud of hypotheses about a hidden state contracts
              around it as observations arrive, and the entropy of the belief falls.
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
