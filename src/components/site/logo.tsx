// Replace with your real logo. SVG keeps it crisp at any size.
export function AtomLogo({ className = "h-8 w-8" }: { className?: string }) {
  return (
    <svg viewBox="0 0 64 64" className={className} fill="none" aria-label="ATOM logo">
      <defs>
        <linearGradient id="atomG" x1="0" y1="0" x2="64" y2="64">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.9" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.4" />
        </linearGradient>
      </defs>
      <circle cx="32" cy="32" r="4" fill="url(#atomG)" />
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="url(#atomG)" strokeWidth="1.6" />
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="url(#atomG)" strokeWidth="1.6" transform="rotate(60 32 32)" />
      <ellipse cx="32" cy="32" rx="26" ry="10" stroke="url(#atomG)" strokeWidth="1.6" transform="rotate(120 32 32)" />
    </svg>
  );
}
