export type Post = {
  slug: string;
  title: string;
  date: string; // ISO
  excerpt: string;
  cover?: string;
  authors?: string[];
  tags?: string[];
  arxiv?: string;
  github?: string;
  publishedVersion?: string;
  bibtex?: string;
  relatedPaperIds?: string[];
  content: string;
};

type FrontmatterValue = string | string[];

const postCoverAssets = import.meta.glob("../assets/posts/**/*.{png,jpg,jpeg,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default",
}) as Record<string, string>;

// Build alternate lookup keys (basename and tail paths) to tolerate different
// frontmatter path styles (../assets/..., /assets/..., filename.png, etc.).
const postCoverLookup = new Map<string, string>();
for (const [p, url] of Object.entries(postCoverAssets)) {
  postCoverLookup.set(p, url);
  const parts = p.split("/");
  const basename = parts[parts.length - 1];
  postCoverLookup.set(basename, url);
  const tail2 = parts.slice(-2).join("/");
  postCoverLookup.set(tail2, url);
  // also add without any leading ../
  postCoverLookup.set(p.replace(/^(\.\.\/)+/, ""), url);
}

export function resolveCoverUrl(value: unknown) {
  if (typeof value !== "string") return undefined;
  // direct match in glob keys
  if (postCoverLookup.has(value)) return postCoverLookup.get(value);
  // strip leading ./ or ../ or / and try again
  const stripped = value.replace(/^\.?\/?(\.?\/?)+/, "");
  if (postCoverLookup.has(stripped)) return postCoverLookup.get(stripped);
  // try matching by suffix (endsWith) for cases like assets/posts/... vs ../assets/...
  for (const [k, url] of postCoverLookup.entries()) {
    if (k.endsWith(value) || k.endsWith(stripped)) return url;
  }
  // fallback: return original string so relative URLs still work (useful for public/)
  return value;
}

// Import all markdown files under src/content/posts as raw text (eager so it works in SSR).
// Use the new `query: '?raw', import: 'default'` form instead of `as: 'raw'`.
const modules = import.meta.glob("../content/posts/*.md", {
  eager: true,
  query: "?raw",
  import: "default",
}) as Record<string, string>;

function parseScalar(value: string) {
  const trimmed = value.trim();
  if (!trimmed) return "";
  if (
    (trimmed.startsWith('"') && trimmed.endsWith('"')) ||
    (trimmed.startsWith("'") && trimmed.endsWith("'"))
  ) {
    return trimmed.slice(1, -1);
  }
  return trimmed;
}

function parseListItem(value: string) {
  return parseScalar(value.replace(/^[-]\s*/, ""));
}

function parseFrontmatterBlock(raw: string) {
  const match = raw.match(/^---\s*\n([\s\S]*?)\n---\s*\n?/);
  if (!match) return { data: {}, content: raw.trim() };

  const frontmatter = match[1];
  const content = raw.slice(match[0].length).replace(/^\n+/, "");
  const data: Record<string, FrontmatterValue> = {};

  const lines = frontmatter.split(/\r?\n/);
  let currentKey: string | null = null;
  let currentMode: "array" | "block" | null = null;
  let currentBlock: string[] = [];

  const flushBlock = () => {
    if (currentKey && currentMode === "block") {
      data[currentKey] = currentBlock.join("\n").replace(/\n$/, "");
    }
    currentKey = null;
    currentMode = null;
    currentBlock = [];
  };

  for (const line of lines) {
    const trimmedLine = line.trim();
    if (!trimmedLine) {
      if (currentMode === "block") currentBlock.push("");
      continue;
    }

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch && !line.startsWith("  ")) {
      flushBlock();
      currentKey = keyMatch[1];
      const value = keyMatch[2].trim();

      if (!value) {
        currentMode = "array";
        data[currentKey] = [];
        continue;
      }

      if (value === "|") {
        currentMode = "block";
        data[currentKey] = "";
        continue;
      }

      if (value.startsWith("[") && value.endsWith("]")) {
        data[currentKey] = value
          .slice(1, -1)
          .split(",")
          .map((item) => parseScalar(item))
          .filter(Boolean);
        currentKey = null;
        currentMode = null;
        continue;
      }

      data[currentKey] = parseScalar(value);
      currentKey = null;
      currentMode = null;
      continue;
    }

    if (currentMode === "array" && currentKey && line.startsWith("  - ")) {
      (data[currentKey] as string[]).push(parseListItem(line.slice(2)));
      continue;
    }

    if (currentMode === "block" && currentKey && line.startsWith("  ")) {
      currentBlock.push(line.slice(2));
    }
  }

  flushBlock();

  return { data, content };
}

function parseFrontmatter(raw: string, filePath: string): Post {
  const parsed = parseFrontmatterBlock(raw);
  const data = parsed.data as Record<string, unknown>;
  const content = parsed.content;
  const slug =
    typeof data.slug === "string" ? data.slug : filePath.split("/").pop()!.replace(/\.md$/, "");

  const asStringArray = (value: unknown) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string") : [];

  return {
    slug,
    title: typeof data.title === "string" ? data.title : slug,
    date: typeof data.date === "string" ? data.date : new Date().toISOString(),
    excerpt: typeof data.excerpt === "string" ? data.excerpt : "",
    cover: resolveCoverUrl(data.cover),
    authors: asStringArray(data.authors),
    tags: asStringArray(data.tags),
    arxiv: typeof data.arxiv === "string" ? data.arxiv : undefined,
    github: typeof data.github === "string" ? data.github : undefined,
    publishedVersion: typeof data.publishedVersion === "string" ? data.publishedVersion : undefined,
    bibtex: typeof data.bibtex === "string" ? data.bibtex : undefined,
    relatedPaperIds: asStringArray(data.relatedPaperIds),
    content,
  };
}

export const posts: Post[] = Object.entries(modules)
  .map(([path, raw]) => parseFrontmatter(raw, path))
  .sort((a, b) => (a.date < b.date ? 1 : -1));

export default posts;
