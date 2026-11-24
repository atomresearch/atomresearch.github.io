import { cn } from "@/lib/utils";

/**
 * The ATOM mark (final logo, Marketing/Logos/2026-11-23_logo_FINAL_ink.svg):
 * an open ring with a ball at 8 minutes past the hour. Drawn in `currentColor`.
 */
export function AtomLogo({ className }: { className?: string; gap?: string }) {
  return (
    <svg
      viewBox="-60 -60 120 120"
      className={cn("h-7 w-7", className)}
      fill="none"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M11.89 -42.21 A43.85 43.85 0 1 0 43.22 -7.41" stroke="currentColor" strokeWidth="12.3" strokeLinecap="round" />
      <circle cx="32.59" cy="-29.34" r="13.22" fill="currentColor" />
    </svg>
  );
}

/** The ATOM letters of the logo lockup, drawn as strokes like the mark. */
export function AtomLetters({ className }: { className?: string }) {
  return (
    <svg
      viewBox="-8 -108 468 116"
      className={cn("h-[0.95rem] w-auto", className)}
      fill="none"
      stroke="currentColor"
      strokeWidth="13"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d="M0 0 L43 -100 L86 0" />
      <path d="M13 -30 L73 -30" />
      <path d="M114 -93.5 L192 -93.5" />
      <path d="M153 -93.5 L153 0" />
      <circle cx="270" cy="-50" r="43.5" />
      <path d="M348 0 L348 -93.5 L400 -35 L452 -93.5 L452 0" />
    </svg>
  );
}

/** Mark and wordmark together, as used in the header and footer. */
export function AtomWordmark({
  className,
}: {
  className?: string;
  gap?: string;
}) {
  return (
    <span className={cn("inline-flex items-center gap-2.5", className)}>
      <AtomLogo />
      <span className="flex items-baseline gap-2">
        <AtomLetters />
        <span className="sr-only">ATOM</span>
        <span className="hidden text-sm text-muted-foreground min-[380px]:inline">Research</span>
      </span>
    </span>
  );
}
