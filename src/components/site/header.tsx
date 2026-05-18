import { Link, useRouterState } from "@tanstack/react-router";
import { Menu, Moon, Sun, X } from "lucide-react";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useTheme } from "@/hooks/use-theme";
import { cn } from "@/lib/utils";

const NAV = [
  { to: "/", label: "Home" },
  { to: "/research", label: "Research" },
  { to: "/blog", label: "Blog" },
  { to: "/members", label: "Members" },
  // { to: "/join", label: "Join Us" },
] as const;

export function Header() {
  const { theme, toggle } = useTheme();
  const [open, setOpen] = useState(false);
  const [condensed, setCondensed] = useState(false);
  const path = useRouterState({ select: (s) => s.location.pathname });

  useEffect(() => {
    const onScroll = () => setCondensed(window.scrollY > 80);
    window.addEventListener("scroll", onScroll);
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 backdrop-blur-sm bg-background/95 border-b border-border/60">
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <Link to="/" className="group" aria-label="Atom Research Group">
          <span className="relative block h-7 w-58 overflow-hidden font-display text-lg font-semibold tracking-tight">
            <span className="absolute left-0 top-0">A</span>
            <motion.span
              initial={false}
              animate={condensed ? { opacity: 0, x: 6 } : { opacity: 1, x: 0 }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[0.67rem] top-0 whitespace-nowrap"
            >
              TOM Research Group
            </motion.span>
            <motion.span
              initial={false}
              animate={condensed ? { opacity: 1, x: 0 } : { opacity: 0, x: 38 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-[0.9rem] top-0"
            >
              R
            </motion.span>
            <motion.span
              initial={false}
              animate={condensed ? { opacity: 1, x: 0 } : { opacity: 0, x: 96 }}
              transition={{ duration: 0.34, ease: [0.22, 1, 0.36, 1] }}
              className="absolute left-7 top-0"
            >
              G
            </motion.span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {NAV.map((n) => {
            const active = n.to === "/" ? path === "/" : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                to={n.to}
                className={cn(
                  "px-3 py-1.5 rounded-md text-sm transition-colors",
                  active
                    ? "text-foreground bg-secondary"
                    : "text-muted-foreground hover:text-foreground hover:bg-secondary/60"
                )}
              >
                {n.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <button
            onClick={toggle}
            aria-label="Toggle theme"
            className="h-9 w-9 grid place-items-center rounded-md hover:bg-secondary transition-colors"
          >
            {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
          <button
            onClick={() => setOpen((v) => !v)}
            aria-label="Menu"
            className="md:hidden h-9 w-9 grid place-items-center rounded-md hover:bg-secondary"
          >
            {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {open && (
        <div className="md:hidden border-t border-border/60 bg-background/95">
          <nav className="px-6 py-3 flex flex-col">
            {NAV.map((n) => (
              <Link
                key={n.to}
                to={n.to}
                onClick={() => setOpen(false)}
                className="py-2 text-sm text-muted-foreground hover:text-foreground"
              >
                {n.label}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
