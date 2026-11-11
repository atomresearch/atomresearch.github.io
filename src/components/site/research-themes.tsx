import { themes } from "@/data/themes";
import { ThemeIllustration } from "./theme-illustrations";

/** The three research themes as illustrated cards. */
export function ResearchThemes() {
  return (
    <ol className="grid gap-5 md:grid-cols-3">
      {themes.map((theme, i) => (
        <li
          key={theme.id}
          className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card"
        >
          <div className="aspect-[15/8] border-b border-border bg-surface px-4 py-3">
            <ThemeIllustration id={theme.id} />
          </div>
          <div className="flex-1 p-6 md:p-7">
            <p className="eyebrow">{String(i + 1).padStart(2, "0")}</p>
            <h3 className="mt-2 text-2xl">{theme.title}</h3>
            <p className="mt-3 text-[0.9375rem] leading-relaxed text-muted-foreground">
              {theme.desc}
            </p>
          </div>
        </li>
      ))}
    </ol>
  );
}
