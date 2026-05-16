import { createFileRoute } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { BookOpen, Code2, Copy, ExternalLink, FileText, X, ChevronLeft, ChevronRight } from "lucide-react";
import { papers, type Paper } from "@/data/papers";
import { AmbientBg } from "@/components/site/background";

export const Route = createFileRoute("/research")({
  head: () => ({
    meta: [
      { title: "Research - ATOM" },
      { name: "description", content: "Publications and research themes from the ATOM Research Group: universal modelling, model discovery, and active learning." },
      { name: "keywords", content: "Agent Foundation Model, probabilistic modelling, model discovery, causal representation, active learning, publications, causal inference, partial observability, large language models, world models, PODMP" },
      { property: "og:image", content: "/preview.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:image", content: "/preview.png" },
      { property: "og:title", content: "Research - ATOM" },
      { property: "og:description", content: "Probabilistic program induction, world models, causal representations, and active discovery." },
    ],
  }),
  component: ResearchPage,
});

const keywords = [
  "Active model discovery",
  "Probabilistic program induction",
  "Structure learning",
  "Causal representation learning",
  "Model-based reinforcement learning",
  "Variational inference",
];

const PAGE_SIZE = 10;

function ResearchPage() {
  const [bib, setBib] = useState<Paper | null>(null);
  const [page, setPage] = useState(1);

  const sorted = useMemo(
    () => [...papers].sort((a, b) => +new Date(b.date) - +new Date(a.date)),
    [],
  );
  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE));
  const current = sorted.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <>
      <section className="relative">
        <AmbientBg />
        <div className="mx-auto max-w-7xl px-6 pt-20 pb-16">
          <h1 className="font-display text-5xl md:text-6xl font-semibold tracking-tight">Research</h1>
          <p className="mt-6 max-w-3xl text-lg text-muted-foreground leading-relaxed">
            Our agenda is to develop an <span className="text-foreground font-medium">Agent Foundation Model</span> - a generalist
            AI that learns to understand novel environments through active exploration, hypothesis
            formation, and self-directed experimentation. We bring together probabilistic modelling,
            causal inference, program induction, and reinforcement learning to chase that vision.
          </p>
          <div className="mt-8 flex flex-wrap gap-2">
            {keywords.map((k) => (
              <span key={k} className="text-xs px-3 py-1.5 rounded-full border border-border bg-secondary/40 text-muted-foreground">{k}</span>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-6 py-16">
        <div className="flex items-end justify-between flex-wrap gap-4">
          <h2 className="font-display text-3xl font-semibold">Publications</h2>
          <span className="text-sm text-muted-foreground">{sorted.length} publications</span>
        </div>
        <div className="mt-10 grid gap-5 lg:grid-cols-2">
          {current.map((p) => (
            <motion.article
              key={p.id}
              initial={{ opacity: 0, y: 12 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="card-hover rounded-xl border border-border bg-card p-7"
            >
              <div className="flex items-center gap-3 text-xs">
                <span className="px-2 py-1 rounded-md bg-primary/10 text-primary font-medium">{p.venue}</span>
                <span className="text-muted-foreground">
                  {new Date(p.date).toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" })}
                </span>
              </div>
              <h3 className="mt-4 font-display text-xl font-semibold leading-snug">{p.title}</h3>
              <p className="mt-3 text-sm text-muted-foreground">
                {p.authors.map((a, i) => {
                  const isGroup = p.groupAuthors?.includes(a);
                  return (
                    <span key={a}>
                      <span className={isGroup ? "text-foreground font-medium" : ""}>{a}</span>
                      {i < p.authors.length - 1 && ", "}
                    </span>
                  );
                })}
              </p>
              <p className="mt-4 text-sm leading-relaxed text-foreground/85 line-clamp-3">{p.abstract}</p>
              <div className="mt-5 flex flex-wrap gap-1.5">
                {p.tags.map((t) => (
                  <span key={t} className="text-[11px] px-2 py-0.5 rounded-md bg-secondary text-secondary-foreground">{t}</span>
                ))}
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                {p.links.arxiv && (
                  <a href={p.links.arxiv} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-secondary">
                    <BookOpen className="h-3.5 w-3.5" /> Read Paper <ExternalLink className="h-3 w-3 opacity-60" />
                  </a>
                )}
                {p.links.pdf && (
                  <a href={p.links.pdf} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-secondary">
                    <FileText className="h-3.5 w-3.5" /> PDF
                  </a>
                )}
                {p.links.code && (
                  <a href={p.links.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md border border-border text-xs hover:bg-secondary">
                    <Code2 className="h-3.5 w-3.5" /> Code
                  </a>
                )}
                <button onClick={() => setBib(p)} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-xs hover:opacity-90">
                  Cite
                </button>
              </div>
            </motion.article>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-border text-sm hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none"
            >
              <ChevronLeft className="h-4 w-4" /> Prev
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((n) => (
              <button
                key={n}
                onClick={() => setPage(n)}
                className={`h-9 w-9 rounded-md border text-sm ${
                  n === page
                    ? "bg-primary text-primary-foreground border-primary"
                    : "border-border hover:bg-secondary"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="inline-flex items-center gap-1 px-3 py-2 rounded-md border border-border text-sm hover:bg-secondary disabled:opacity-40 disabled:pointer-events-none"
            >
              Next <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </section>

      {bib && <BibtexModal paper={bib} onClose={() => setBib(null)} />}
    </>
  );
}

function BibtexModal({ paper, onClose }: { paper: Paper; onClose: () => void }) {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    await navigator.clipboard.writeText(paper.bibtex);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };
  return (
    <div className="fixed inset-0 z-[60] grid place-items-center p-4 bg-background/80 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-2xl">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="text-xs text-muted-foreground">BibTeX</div>
            <h3 className="mt-1 font-display text-lg font-semibold">{paper.title}</h3>
          </div>
          <button onClick={onClose} aria-label="Close" className="h-8 w-8 grid place-items-center rounded-md hover:bg-secondary">
            <X className="h-4 w-4" />
          </button>
        </div>
        <pre className="mt-5 overflow-x-auto rounded-lg bg-background border border-border p-4 text-xs leading-relaxed font-mono">{paper.bibtex}</pre>
        <div className="mt-4 flex justify-end">
          <button onClick={copy} className="inline-flex items-center gap-2 px-3 py-2 rounded-md bg-primary text-primary-foreground text-sm hover:opacity-90">
            <Copy className="h-4 w-4" /> {copied ? "Copied!" : "Copy"}
          </button>
        </div>
      </div>
    </div>
  );
}
