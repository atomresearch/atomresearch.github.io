// Subtle ambient background for hero areas
export function AmbientBg() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid opacity-40 [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
      <div className="absolute inset-0 bg-radial-glow" />
    </div>
  );
}
