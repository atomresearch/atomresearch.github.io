import site from "@/data/site.json";

// Newsletter sign-up, shown above the footer on every page.
// `site.newsletter` holds the form action of the newsletter provider (Kit).
// While it is empty, the form shows that sign-up opens soon.
export function Newsletter() {
  const action = (site as { newsletter?: string }).newsletter ?? "";
  return (
    <section
      id="subscribe"
      aria-labelledby="newsletter-title"
      className="mt-24 border-t border-border md:mt-32"
    >
      <div className="container-page grid gap-6 py-14 md:grid-cols-[minmax(0,1fr)_minmax(0,2.4fr)] md:gap-12 md:py-20">
        <p className="eyebrow pt-2">Newsletter</p>
        <div>
          <h2
            id="newsletter-title"
            className="text-3xl leading-tight tracking-[-0.02em] md:text-[2.5rem]"
          >
            Follow the work.
          </h2>
          <p className="mt-4 max-w-xl text-lg leading-relaxed text-muted-foreground">
            Occasional updates on new research, open projects and opportunities to join.
          </p>
          <form
            action={action || undefined}
            method="post"
            target="_blank"
            className="mt-7 flex max-w-md flex-wrap gap-3"
          >
            <input
              type="email"
              name="email_address"
              required
              aria-label="Email"
              placeholder="you@example.com"
              disabled={!action}
              className="h-10 min-w-0 flex-1 rounded-md border border-border bg-card px-3 text-sm outline-none focus-visible:ring-2 focus-visible:ring-primary/40 disabled:opacity-60"
            />
            <button
              type="submit"
              disabled={!action}
              className="h-10 rounded-md bg-primary px-4 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {action ? "Subscribe" : "Opening soon"}
            </button>
          </form>
          <p className="mt-3 text-sm text-muted-foreground">No spam. Unsubscribe anytime.</p>
        </div>
      </div>
    </section>
  );
}
