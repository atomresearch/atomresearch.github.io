import { createContext, useCallback, useEffect, useLayoutEffect, useState } from "react";

type Theme = "dark" | "light";

const STORAGE_KEY = "atom-theme";
const THEME_COLOR = { light: "#fbfaf8", dark: "#0f1118" } as const;

export const ThemeCtx = createContext<{ theme: Theme; toggle: () => void }>({
  theme: "light",
  toggle: () => {},
});

/**
 * The initial theme (saved choice, else the system preference) is applied by
 * the inline script in index.html before first paint, so there is no flash.
 * This provider reads that state and handles the toggle.
 *
 * Pages are rendered at build time without knowing the visitor's theme, so the
 * first render always says "light" (the browser must render the same markup to
 * take the page over); the real theme is read just before the first paint.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<Theme | null>(null);

  useLayoutEffect(() => {
    setTheme(document.documentElement.classList.contains("dark") ? "dark" : "light");
  }, []);

  useEffect(() => {
    if (!theme) return;
    document.documentElement.classList.toggle("dark", theme === "dark");
    document.querySelector('meta[name="theme-color"]')?.setAttribute("content", THEME_COLOR[theme]);
  }, [theme]);

  // Follow the system setting until the visitor makes an explicit choice.
  useEffect(() => {
    const query = window.matchMedia("(prefers-color-scheme: dark)");
    const onChange = (event: MediaQueryListEvent) => {
      try {
        if (localStorage.getItem(STORAGE_KEY)) return;
      } catch {
        // Storage unavailable: keep following the system.
      }
      setTheme(event.matches ? "dark" : "light");
    };
    query.addEventListener("change", onChange);
    return () => query.removeEventListener("change", onChange);
  }, []);

  const toggle = useCallback(() => {
    setTheme((prev) => {
      const next: Theme = prev === "dark" ? "light" : "dark";
      try {
        localStorage.setItem(STORAGE_KEY, next);
      } catch {
        // Storage unavailable: the choice lasts for this visit only.
      }
      return next;
    });
  }, []);

  return (
    <ThemeCtx.Provider value={{ theme: theme ?? "light", toggle }}>{children}</ThemeCtx.Provider>
  );
}
