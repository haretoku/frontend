import { cloudflare } from "@cloudflare/vite-plugin";
import { sites } from "@openai/sites-vite-plugin";
import { defineConfig } from "vite";
import { resolve } from "node:path";

export default defineConfig({
  plugins: [sites(), cloudflare()],
  environments: {
    client: {
      build: {
        rollupOptions: {
          input: {
            index: resolve(import.meta.dirname, "index.html"),
            calculationMethod: resolve(import.meta.dirname, "pages/calculation-method.html"),
            costsMaintenance: resolve(import.meta.dirname, "pages/costs-maintenance.html"),
            electricitySales: resolve(import.meta.dirname, "pages/electricity-sales.html"),
            subsidies: resolve(import.meta.dirname, "pages/subsidies.html"),
            disaster: resolve(import.meta.dirname, "pages/disaster.html"),
            quotesContractors: resolve(import.meta.dirname, "pages/quotes-contractors.html")
          }
        }
      }
    }
  }
});
