/**
 * Dates in the data files are plain ISO days ("2026-05-14"). They are parsed
 * as UTC, so they are formatted in UTC too: otherwise visitors west of
 * Greenwich would see the previous day.
 */
const base = { timeZone: "UTC" } as const;

const formats = {
  long: new Intl.DateTimeFormat("en-GB", {
    ...base,
    day: "numeric",
    month: "long",
    year: "numeric",
  }),
  short: new Intl.DateTimeFormat("en-GB", {
    ...base,
    day: "numeric",
    month: "short",
    year: "numeric",
  }),
  dayMonth: new Intl.DateTimeFormat("en-GB", { ...base, day: "numeric", month: "short" }),
};

export function formatDate(iso: string, style: keyof typeof formats = "short") {
  const date = new Date(iso);
  return Number.isNaN(+date) ? iso : formats[style].format(date);
}

export function byDateDesc<T extends { date: string }>(a: T, b: T) {
  return +new Date(b.date) - +new Date(a.date);
}

/** Re-indent a BibTeX entry whose source indentation is uneven. */
export function formatBibtex(bibtex: string) {
  return bibtex
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => (line.startsWith("@") || line === "}" ? line : `  ${line}`))
    .join("\n");
}
