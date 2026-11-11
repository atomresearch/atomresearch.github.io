// Build-time renderer. `scripts/prerender.mjs` loads the server build of this
// file and writes every page of the site as complete HTML, so search engines,
// link previews and readers without JavaScript get the full content; the
// browser then takes the page over (see `src/main.tsx`).
import { StrictMode } from "react";
import { prerender } from "react-dom/static";
import { createMemoryHistory, RouterProvider } from "@tanstack/react-router";
import { getRouter } from "./router";
import { headTags, type HeadTag } from "./lib/seo";

export { sitePages, siteUrl } from "./lib/site-pages";
export { llmsTxt } from "./lib/llms-txt";

/** Base path the site is served under ("/" for atomresearch.github.io). */
export const basePath = import.meta.env.BASE_URL;

/**
 * Render one page. Returns the markup of `#root`, the tags for `<head>` and
 * the status the router settled on (404 for an unknown path).
 */
export async function render(path: string) {
  const router = getRouter(createMemoryHistory({ initialEntries: [path] }));
  await router.load();

  const app = (
    <StrictMode>
      <RouterProvider router={router} />
    </StrictMode>
  );

  // React writes a large or late part of a page into a hidden <div> that a
  // script moves into place, so it can stream the rest sooner. A static page
  // gains nothing from that, and crawlers and readers without JavaScript would
  // not see the hidden part: `progressiveChunkSize` keeps every part in place.
  // Code loaded on demand may still suspend on a first render; it renders at
  // once when loaded, so the page is rendered again in that case.
  for (let pass = 1; ; pass++) {
    const { prelude } = await prerender(app, { progressiveChunkSize: Number.POSITIVE_INFINITY });
    const html = await new Response(prelude).text();
    if (!html.includes("<!--$?-->")) {
      const tags = router.state.matches.map((m) => (m.meta ?? []) as (HeadTag | undefined)[]);
      const status = router.state.statusCode;
      return { html, head: headTags(tags, router.state.location.pathname, status), status };
    }
    if (pass === 3)
      throw new Error(`${path}: part of the page is still loading after ${pass} passes`);
  }
}
