import { StrictMode } from "react";
import { createRoot, hydrateRoot } from "react-dom/client";
import { RouterProvider } from "@tanstack/react-router";
import "@fontsource-variable/geist";
import "@fontsource-variable/geist-mono";
import "@fontsource-variable/newsreader/wght.css";
import "@fontsource-variable/newsreader/wght-italic.css";
import { getRouter } from "./router";
import "./styles.css";

const router = getRouter();
const root = document.getElementById("root")!;
const app = (
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);

// Every page is written as complete HTML at build time (scripts/prerender.mjs)
// and records the path it was rendered for. On that path React takes the
// existing markup over once the page's code has loaded, instead of drawing it
// again; any other address (served by 404.html) is rendered from scratch.
const trim = (path: string) => path.replace(/\/+$/, "") || "/";

if (root.dataset.path && trim(root.dataset.path) === trim(window.location.pathname)) {
  // Tell the router the page was rendered ahead of time, as TanStack Start
  // does: it then renders the same tree as on the server and skips its own
  // first load, done here before React takes the markup over.
  router.ssr = { manifest: undefined };
  router.load().then(() => hydrateRoot(root, app));
} else {
  createRoot(root).render(app);
}
