import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { TanStackRouterVite } from "@tanstack/router-plugin/vite";
import tailwindcss from "@tailwindcss/vite";
import tsconfigPaths from "vite-tsconfig-paths";

function normalizeBasePath(value: string | undefined) {
  if (!value) return "/";
  if (value === "/") return value;
  const withLeadingSlash = value.startsWith("/") ? value : `/${value}`;
  return withLeadingSlash.endsWith("/") ? withLeadingSlash : `${withLeadingSlash}/`;
}

export default defineConfig({
  base: normalizeBasePath(process.env.VITE_BASE_PATH),
  // The footer year is fixed at build time: the page is rendered once, ahead
  // of time, and the browser must render the same text to take it over.
  define: { __BUILD_YEAR__: JSON.stringify(new Date().getFullYear()) },
  plugins: [
    // Each route becomes its own chunk, so a page only loads its own code.
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss(),
    tsconfigPaths(),
  ],
});
