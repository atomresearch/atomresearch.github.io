import { createRouter, type RouterHistory } from "@tanstack/react-router";
import { routeTree } from "./routeTree.gen";

/**
 * The browser passes no history (the router reads the address bar); the
 * build-time renderer in `src/entry-server.tsx` passes a memory history.
 */
export const getRouter = (history?: RouterHistory) =>
  createRouter({
    routeTree,
    history,
    basepath: import.meta.env.BASE_URL,
    // Every page is written to `<path>/index.html` at build time, the form
    // GitHub Pages serves without a redirect, so links end with a slash too.
    trailingSlash: "always",
    // In the browser only: on the server it would add a script to the page
    // that the browser does not render, which breaks the takeover.
    scrollRestoration: !history,
    // Fetch a page's code when its link is hovered or focused.
    defaultPreload: "intent",
    defaultPreloadStaleTime: 0,
  });

declare module "@tanstack/react-router" {
  interface Register {
    router: ReturnType<typeof getRouter>;
  }
}
