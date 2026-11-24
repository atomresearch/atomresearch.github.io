// The public layers of ATOM's mission (master plan layers 1–4): ambition,
// thesis and why it matters. The research program itself stays off the site.

const pillars = [
  { title: "Open-ended", desc: "Autonomous, continual and open-ended learning." },
  { title: "Efficient", desc: "Sample- and compute-efficient learning." },
  { title: "Adaptive", desc: "Generalization and adaptation under domain shift." },
  { title: "Aligned", desc: "Alignment, safety and robustness." },
];

function Row({
  id,
  eyebrow,
  title,
  children,
}: {
  id: string;
  eyebrow: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={id} className="border-t border-border">
      <div className="container-page grid gap-6 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-12 md:py-20">
        <p className="eyebrow pt-2">{eyebrow}</p>
        <div>
          <h2 id={id} className="text-3xl leading-tight tracking-[-0.02em] md:text-[2.5rem]">
            {title}
          </h2>
          <div className="mt-6 max-w-2xl space-y-4 text-lg leading-relaxed text-muted-foreground">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}

export function Mission() {
  return (
    <>
      <section aria-labelledby="ambition" className="bg-surface">
        <div className="container-page grid gap-6 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-12 md:py-20">
          <p className="eyebrow pt-2">Ambition</p>
          <div>
            <h2 id="ambition" className="text-3xl leading-tight tracking-[-0.02em] md:text-[2.5rem]">
              The most capable learning agents.
            </h2>
            <ul className="mt-8 grid gap-px overflow-hidden rounded-xl border border-border bg-border sm:grid-cols-2 lg:grid-cols-4">
              {pillars.map((p) => (
                <li key={p.title} className="bg-card p-5">
                  <h3 className="text-base font-semibold">{p.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <Row id="thesis" eyebrow="Thesis" title="Learning in nature follows general principles.">
        <p>
          We believe that building on those principles is the route to the best kind of learners.
          Theories from developmental psychology, cognitive science, neuroscience and physics start
          from different places and arrive at similar principles. Our approach synthesizes this
          convergence and uses the state of the art in machine learning to instantiate it at scale.
        </p>
        <p>
          Humans are the best learners we know, so &ldquo;learn like we do&rdquo; is the clearest
          way to say it. We aim to replicate the principles of human learning, not its flaws.
        </p>
      </Row>

      <Row
        id="why"
        eyebrow="Why it matters"
        title="Today's AI mostly learns by passively absorbing vast amounts of data."
      >
        <p>
          A toddler putting a new object in their mouth is running an experiment: testing what it is
          made of and how it behaves, and revising their model of it.
        </p>
        <p>
          Building on how learning works in nature can give us AI that learns autonomously,
          continually and open-endedly from far less data and compute, generalizes and adapts when
          the world changes, and is aligned, safer and more robust.
        </p>
      </Row>
    </>
  );
}
