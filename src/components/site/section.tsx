import { cn } from "@/lib/utils";

/** Title block at the top of a page. */
export function PageHeader({
  eyebrow,
  title,
  children,
  className,
}: {
  eyebrow?: string;
  title: string;
  children?: React.ReactNode;
  className?: string;
}) {
  return (
    <header className={cn("container-page pt-12 pb-10 md:pt-20 md:pb-14", className)}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h1 className="text-[2.75rem] leading-[1.04] tracking-[-0.025em] md:text-6xl">{title}</h1>
      {children && (
        <div className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-foreground">
          {children}
        </div>
      )}
    </header>
  );
}

/** Heading row of a section, with an optional link on the right. */
export function SectionHeading({
  eyebrow,
  title,
  lead,
  action,
  id,
}: {
  eyebrow?: string;
  title: string;
  lead?: string;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
      <div>
        {eyebrow && <p className="eyebrow mb-3">{eyebrow}</p>}
        <h2 id={id} className="text-3xl leading-tight tracking-[-0.02em] md:text-[2.5rem]">
          {title}
        </h2>
        {lead && <p className="mt-3 max-w-xl text-muted-foreground">{lead}</p>}
      </div>
      {action}
    </div>
  );
}

/** Small "see more" link with an arrow that nudges on hover. */
export const moreLinkClass =
  "group inline-flex items-center gap-1.5 text-sm font-medium text-primary [&_svg]:h-4 [&_svg]:w-4 [&_svg]:transition-transform hover:[&_svg]:translate-x-0.5";

/** Rounded tag used for keywords and paper topics. */
export function Tag({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-border px-2.5 py-0.5 text-xs text-muted-foreground">
      {children}
    </span>
  );
}
