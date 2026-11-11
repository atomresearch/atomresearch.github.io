import { cn } from "@/lib/utils";

/**
 * The ATOM mark: a nucleus and three orbits, with one electron picked out in
 * the signal colour. Strokes use `currentColor`, so the mark follows the text
 * colour of its parent.
 */
export function AtomLogo({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 32 32"
      className={cn("h-7 w-7", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <g stroke="currentColor" strokeWidth="1.35">
        <ellipse cx="16" cy="16" rx="13.2" ry="5.1" />
        <ellipse cx="16" cy="16" rx="13.2" ry="5.1" transform="rotate(60 16 16)" />
        <ellipse cx="16" cy="16" rx="13.2" ry="5.1" transform="rotate(120 16 16)" />
      </g>
      <circle cx="16" cy="16" r="2.5" fill="currentColor" />
      <circle cx="22.6" cy="4.57" r="2.1" fill="var(--signal)" />
    </svg>
  );
}

/** Mark and wordmark together, as used in the header and footer. */
export function AtomWordmark({ className }: { className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <AtomLogo />
      <span className="flex items-baseline gap-2">
        <span className="text-[1.05rem] font-semibold tracking-[0.14em]">ATOM</span>
        <span className="hidden text-sm text-muted-foreground min-[380px]:inline">
          Research Group
        </span>
      </span>
    </span>
  );
}
