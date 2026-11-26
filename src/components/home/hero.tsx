import { useState } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GridworldCanvas } from "./gridworld-canvas";

export function Hero() {
  const [world, setWorld] = useState("Four Rooms");

  return (
    <section className="border-b border-border">
      <div className="container-page grid gap-10 pt-10 pb-14 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.08fr)] lg:items-center lg:gap-16 lg:pt-20 lg:pb-24">
        <div>
          <p className="eyebrow animate-rise">ATOM Research</p>
          <h1 className="animate-rise mt-5 text-[2.9rem] leading-[1] tracking-[-0.03em] [animation-delay:60ms] sm:text-6xl lg:text-[4.5rem]">
            Build a machine that learns like we do.
          </h1>
          <p className="animate-rise mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground [animation-delay:120ms] md:text-xl md:leading-relaxed">
            ATOM is a select group of researchers pursuing one question: how can an agent discover
            how a new world works from as little as possible?
          </p>
          <div className="animate-rise mt-8 flex flex-wrap gap-3 [animation-delay:180ms]">
            <Button asChild>
              <Link to="/research/">
                Our Research <ArrowRight aria-hidden="true" />
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/join/">Join us</Link>
            </Button>
          </div>
        </div>

        <figure className="animate-rise [animation-delay:120ms]">
          <div className="bg-dots relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-card sm:aspect-[16/10] lg:aspect-[5/4]">
            <GridworldCanvas
              className="absolute inset-0 h-full w-full"
              onLabel={(name) => setWorld(name)}
            />
            <span className="eyebrow pointer-events-none absolute top-3.5 left-4 !text-[0.65rem]">
              {world}
            </span>
          </div>
          <figcaption className="mt-3.5 flex flex-wrap items-center gap-x-5 gap-y-1.5 text-[0.8125rem] text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <svg viewBox="0 0 10 10" className="h-2.5 w-2.5" aria-hidden="true">
                <path d="M9.5 5 1 9.5V.5Z" fill="#e5484d" />
              </svg>
              Agent
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-[3px] border-[1.5px] border-primary bg-primary/15"
                aria-hidden="true"
              />
              Field of view
            </span>
            <span className="inline-flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-[3px] bg-foreground/20" aria-hidden="true" />
              Seen so far
            </span>
            <span className="inline-flex items-center gap-2">
              <span
                className="h-2.5 w-2.5 rounded-[3px] border border-dashed border-foreground/40"
                aria-hidden="true"
              />
              Never seen
            </span>
            <span className="sr-only">
              Animation of an agent in worlds it has never seen, replaying demonstrations from the
              Pinductor paper: Four Rooms and Unlock, where it sees only the 3×3 window in front of
              it; Blocks World, where it sees only the stack under its gripper; and MineSweeper,
              where each click shows only the number of mines next to that cell. What it has seen
              builds up as it acts; at the end, the true state is shown.
            </span>
            <span className="w-full text-[0.75rem]">
              Adapted from{" "}
              <a
                href="https://mtsfj.github.io/articles/pinductor.html"
                target="_blank"
                rel="noreferrer"
                className="underline underline-offset-4 hover:text-foreground"
              >
                Mathis Fajeau&rsquo;s Pinductor article
              </a>
              , with the paper&rsquo;s real demonstrations.
            </span>
          </figcaption>
        </figure>
      </div>
    </section>
  );
}
