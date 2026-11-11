# ATOM Research Group website

Source of [atomresearch.github.io](https://atomresearch.github.io), built with
Vite, React, TypeScript, Tailwind CSS and a few shadcn/ui components. Every
page is rendered to complete HTML at build time, so search engines, link
previews and readers without JavaScript get the full content; React then takes
the page over in the browser. It is deployed to GitHub Pages by
`.github/workflows/deploy-pages.yml` on every push to `main`.

## Develop

```sh
bun install
bun run dev        # local server with hot reload
bun run build      # production build in dist/, every page prerendered
bun run preview    # serve the production build
bun run lint       # ESLint and Prettier
bun run format     # rewrite files with Prettier
```

## Update the content

Everything the site shows lives in data files. No component needs to change
for routine updates.

| To do this             | Edit                                                                          |
| ---------------------- | ----------------------------------------------------------------------------- |
| Add a news item        | `src/data/news.ts` (the home page shows the three most recent)                |
| Add a publication      | `src/data/papers.ts`; it gets a page at `/research/<id>/`                     |
| Add or edit a member   | `src/data/members.ts`, plus a portrait in `src/assets/members/<id>.webp`      |
| Write a blog post      | a Markdown file in `src/content/posts/`, images in `src/assets/posts/<slug>/` |
| Edit a research theme  | `src/data/themes.ts`                                                          |
| Change titles, contact | `src/data/site.json` (page titles and descriptions, email, GitHub, X)         |
| Change the navigation  | `NAV` in `src/components/site/header.tsx` (used by the header and the footer) |

Notes:

- **Images.** Portraits are displayed at 56 to 192 px: a square image of about
  400 px is enough. Prefer WebP; PNG and JPEG also work. Keep post covers under
  1600 px wide.
- **Blog posts** support GitHub-flavoured Markdown, inline HTML and LaTeX
  (`$...$` inline, `$$...$$` on its own line for display). The front matter
  fields are `title`, `date`, `excerpt`, `cover`, `authors`, `tags`, and the
  optional `arxiv`, `github`, `explainer`, `publishedVersion`, `bibtex` and
  `relatedPaperIds`.
- **Paper figures** go in `src/assets/papers/<name>/` and are declared on the
  paper with their alt text and size. A figure may have a dark variant.
- **Publications** get their own page with the abstract, figures, BibTeX and
  the tags Google Scholar and reference managers read. Set `featured: true` to
  show a paper on the home page. Authors who are members (by name, or by one of
  their `aliases` in `members.ts`) link to their profile.
- Every page, `sitemap.xml`, `robots.txt` and `llms.txt` are generated from
  these same files at build time; a new post, paper or member needs no extra
  step.

## Search engines

- **Titles and descriptions:** fixed pages in `src/data/site.json`; posts,
  papers and members from their own data.
- **Rendering:** `src/entry-server.tsx` renders a page; `scripts/prerender.mjs`
  writes each one to `dist/<path>/index.html` with its head, and `404.html`.
  Pages live at addresses ending in `/`, the form GitHub Pages serves directly.
- **Structured data:** `src/lib/structured-data.ts` describes the group, people,
  papers and posts for schema.org (JSON-LD in each page's head).
- **Page list:** `src/lib/site-pages.ts` (sitemap and prerendering);
  `src/lib/llms-txt.ts` writes the summary for AI assistants.
- After the first deployment, submit `https://atomresearch.github.io/sitemap.xml`
  in Google Search Console and Bing Webmaster Tools.

## Change the design

- **Colours, fonts, radius:** the tokens at the top of `src/styles.css`, one
  block for light and one for dark. Every page follows.
- **Article typography:** `src/styles/prose.css` (`prose-atom` class).
- **Hero animation:** `src/components/home/belief-canvas.tsx`. The constants
  at the top set its pace; it draws with the theme tokens.
- **Theme illustrations:** `src/components/site/theme-illustrations.tsx`.
- **Logo:** `src/components/site/logo.tsx` and `public/favicon.svg`.

## Project layout

```
src/
  routes/            one file per page (TanStack Router, file-based)
  components/home/   sections of the home page
  components/site/   header, footer and parts shared between pages
  components/ui/     shadcn/ui primitives (button, dialog, accordion)
  data/              content: news, papers, members, themes, site settings
  content/posts/     blog posts in Markdown
  assets/            images, bundled and fingerprinted by Vite
  lib/               helpers: dates, posts, page metadata, structured data
  entry-server.tsx   renders one page to HTML at build time
scripts/             prerender.mjs: writes every page, the sitemap and llms.txt
public/              files served as they are: icons, social card
```

`src/routeTree.gen.ts` is generated by the router plugin; do not edit it.
