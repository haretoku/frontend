import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "@openai/sites-vite-plugin";
import { defineConfig } from "vite";
import { resolve } from "node:path";
import { localMunicipalReview } from "./qa/local/municipal-review/plugin.mjs";
import { localPrefectureReview } from "./qa/local/prefecture-review/plugin.mjs";

const siteRoot = resolve(import.meta.dirname, "site");

export default defineConfig({
  root: siteRoot,
  plugins: [
    localMunicipalReview(),
    localPrefectureReview(),
    sites(),
    cloudflare({ configPath: resolve(import.meta.dirname, "wrangler.jsonc") })
  ],
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            index: resolve(siteRoot, "index.html"),
            guides: resolve(siteRoot, "guides/index.html"),
            legacyGuides: resolve(siteRoot, "solar/index.html"),
            ...Object.fromEntries(["electricity-sales", "subsidies", "disaster", "quotes-contractors"].map(name => [`legacy-${name}`, resolve(siteRoot, `pages/${name}.html`)])),
            simulator: resolve(siteRoot, "simulator/index.html"),
            calculationMethod: resolve(siteRoot, "pages/calculation-method.html"),
            costsMaintenance: resolve(siteRoot, "pages/costs-maintenance.html"),
            electricitySales: resolve(siteRoot, "guides/solar-economics/index.html"),
            subsidies: resolve(siteRoot, "guides/subsidies/index.html"),
            disaster: resolve(siteRoot, "guides/disaster/index.html"),
            quotesContractors: resolve(siteRoot, "guides/quotes-contractors/index.html"),
            policy: resolve(siteRoot, "pages/policy.html")
          }
        }
      }
    }
  }
});
