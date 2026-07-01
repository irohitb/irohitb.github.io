// @ts-check
import { defineConfig } from "astro/config";
import react from "@astrojs/react";

// Static site generation. Data is read at build time from src/data/*.
// Re-run `npm run build` (or a scheduled CI job) to refresh once live
// integrations replace the hardcoded data.
//
// Deployed to GitHub Pages as the user site https://irohitb.github.io — served
// at the domain root, so no `base` path is needed. `site` is used for canonical
// URLs / sitemap.
export default defineConfig({
  site: "https://irohitb.github.io",
  output: "static",
  integrations: [react()],
});
