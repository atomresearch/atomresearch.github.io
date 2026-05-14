import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "framer-motion";
import { ArrowRight, Atom, Newspaper, Compass, Telescope, FlaskConical } from "lucide-react";
import { AmbientBg } from "@/components/site/background";
import { getNewsLink, news } from "@/data/news";

const baseUrl = import.meta.env.BASE_URL;

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "ATOM - Toward an Agent Foundation Model" },
      {
        name: "description",
        content:
          "Building general-purpose learning and reasoning agents that actively explore, build explanatory world models, and run their own experiments.",
      },
      { property: "og:title", content: "ATOM - Toward an Agent Foundation Model" },
      {
        property: "og:description",
        content: "An AI research group toward an Agent Foundation Model.",
      },
    ],
  }),
  component: HomePage,
});

const themes = [
  {
    icon: Compass,
    title: "Universal modelling",
    desc: "Developing an increasingly expressive hypothesis space, enabling the agent to model anything from physical to social interactions.",
  },
  {
    icon: Telescope,
    title: "Model discovery",
    desc: "Inferring plausible models based on agent–environment interaction history, online, and under suitable priors (cf. compression & core knowledge).",
  },
  {
    icon: FlaskConical,
    title: "Active learning",
    desc: "Select actions to gain information about the world, thereby testing hypotheses through active environment interaction.",
  },
];

function HomePage() {
  const sortedNews = [...news].sort((a, b) => +new Date(b.date) - +new Date(a.date)).slice(0, 6);

  return (
    <>
      <main className="min-h-screen bg-background">
        {/* HERO */}
        <section className="relative overflow-hidden pt-24 pb-12">
          <AmbientBg />
          <div className="mx-auto max-w-7xl px-6 grid gap-12 lg:gap-16 lg:grid-cols-[1.15fr_1fr] lg:items-center">
            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-flex items-center gap-3 rounded-full border border-border/80 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
                <Atom className="h-4 w-4 text-primary" />
                <span>AI research lab</span>
              </div>

              <h1 className="mt-8 font-display text-5xl md:text-7xl font-semibold leading-tight">
                ATOM Research Group
              </h1>

              <p className="mt-6 text-lg md:text-xl text-foreground/90 max-w-3xl leading-relaxed">
                Building principled, experimental agents that model, question, and probe complex
                systems - with a focus on scalability, robustness, trustworthiness and data-efficiency.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  to="/research"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 transition"
                >
                  Our Research <ArrowRight className="h-4 w-4" />
                </Link>
                {/* <Link
                  to="/join"
                  className="inline-flex items-center gap-2 px-5 py-3 rounded-md border border-border text-sm font-medium hover:bg-secondary transition"
                >
                  Join Us
                </Link> */}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 18 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.12 }}
              className="w-full"
            >
              <div className="rounded-xl border border-border bg-card/60 backdrop-blur-sm p-6 md:p-7">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Newspaper className="h-4 w-4 text-primary" />
                    <h2 className="font-display text-base font-semibold tracking-wide uppercase text-muted-foreground">
                      What's new
                    </h2>
                  </div>
                  <Link to="/news" className="text-xs text-primary hover:underline">
                    All updates →
                  </Link>
                </div>
                <ul className="mt-5 divide-y divide-border/60">
                  {sortedNews.map((n, i) => {
                    const date = new Date(n.date).toLocaleDateString(undefined, {
                      year: "numeric",
                      month: "short",
                      day: "numeric",
                    });
                    const link = getNewsLink(n);
                    const body = (
                      <span className="text-sm text-foreground/85">
                        {n.text}
                        {n.highlight && (
                          <>
                            {" "}
                            <span className="text-primary font-medium">{n.highlight}</span>
                          </>
                        )}
                      </span>
                    );
                    return (
                      <li key={i} className="flex items-baseline gap-4 py-3 group">
                        <time className="shrink-0 w-24 text-xs font-mono text-muted-foreground tabular-nums">
                          {date}
                        </time>
                        {link?.kind === "blog" ? (
                          <Link
                            to="/blog/$slug"
                            params={{ slug: link.slug }}
                            className="flex-1 hover:opacity-90 transition"
                          >
                            {body}
                            <ArrowRight className="inline h-3 w-3 ml-1 opacity-0 group-hover:opacity-60 transition" />
                          </Link>
                        ) : link?.kind === "external" ? (
                          <a
                            href={link.href}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 hover:opacity-90"
                          >
                            {body}
                          </a>
                        ) : (
                          <span className="flex-1">{body}</span>
                        )}
                      </li>
                    );
                  })}
                </ul>
              </div>
            </motion.div>
          </div>
        </section>

        {/* GLASSWING-STYLE FEATURE */}
        {/* <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="relative overflow-hidden rounded-2xl border border-border bg-linear-to-b from-white/70 to-white/50 dark:from-white/3 dark:to-white/6 p-8 backdrop-blur-sm">
            <div className="absolute -inset-x-48 -top-28 blur-3xl opacity-30 bg-linear-to-r from-primary/20 via-transparent to-primary/20" />
            <div className="grid gap-8 md:grid-cols-2 items-center">
              <div>
                <h2 className="font-display text-3xl font-semibold">Featured Initiative</h2>
                <p className="mt-4 text-muted-foreground max-w-xl">
                  Inquiry is at the heart of our work: we build agents that do not only predict but
                  also question their own models. These initiatives are grounded in a philosophy of
                  open experimentation, calibrated skepticism, and careful model introspection.
                </p>
                <div className="mt-6">
                  <Link
                    to="/philosophy"
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-95 transition"
                  >
                    Continue reading <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>

              <div className="relative">
                <div className="rounded-xl border border-border bg-card/60 p-6 backdrop-blur-md">
                  <div className="h-64 md:h-56 rounded-md overflow-hidden flex items-center justify-center">
                    <img
                      src={`${baseUrl}preview.png`}
                      alt="Project preview"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <h3 className="mt-4 font-semibold">Atom Projects</h3>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Short editorial description of the initiative and goals.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section> */}

        {/* CORE RESEARCH THEMES (refined) */}
        <section className="mx-auto max-w-7xl px-6 py-20">
          <div className="flex items-end justify-between gap-6 flex-wrap">
            <div>
              <h2 className="font-display text-3xl md:text-4xl font-semibold">
                Core research themes
              </h2>
              <p className="mt-3 text-muted-foreground max-w-xl">
                Three pillars guiding our experimental agenda.
              </p>
            </div>
            <Link to="/research" className="text-sm text-primary hover:underline">
              All research →
            </Link>
          </div>
          <div className="mt-10 grid gap-5 md:grid-cols-3">
            {themes.map((t, i) => (
              <motion.div
                key={t.title}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className="rounded-xl border border-border bg-card p-7 relative overflow-hidden"
              >
                <div className="absolute -top-10 -right-10 h-32 w-32 rounded-full bg-primary/10 blur-3xl" />
                <t.icon className="h-7 w-7 text-primary" />
                <h3 className="mt-5 font-display text-xl font-semibold">{t.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground leading-relaxed">{t.desc}</p>
              </motion.div>
            ))}
          </div>
        </section>
      </main>
    </>
  );
}
