import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "@openai/sites-vite-plugin";
import { defineConfig } from "vite";
import { resolve } from "node:path";

const siteRoot = resolve(import.meta.dirname, "site");

export default defineConfig({
  root: siteRoot,
  plugins: [
    sites(),
    cloudflare({ configPath: resolve(import.meta.dirname, "wrangler.jsonc") })
  ],
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            index: resolve(siteRoot, "index.html"),
            guides: resolve(siteRoot, "solar/index.html"),
            simulator: resolve(siteRoot, "simulator/index.html"),
            calculationMethod: resolve(siteRoot, "pages/calculation-method.html"),
            costsMaintenance: resolve(siteRoot, "pages/costs-maintenance.html"),
            electricitySales: resolve(siteRoot, "pages/electricity-sales.html"),
            subsidies: resolve(siteRoot, "pages/subsidies.html"),
            disaster: resolve(siteRoot, "pages/disaster.html"),
            quotesContractors: resolve(siteRoot, "pages/quotes-contractors.html"),
            policy: resolve(siteRoot, "pages/policy.html")
          }
        }
      }
    }
  }
});
