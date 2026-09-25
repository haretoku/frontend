import { defineConfig } from "vite";
import { resolve } from "node:path";

// 本番は静的ファイルだけを生成する．開発用QA・Sites・Workerは読み込まない．
const root = resolve(import.meta.dirname, "site");
export default defineConfig({
  root,
  define: { "import.meta.env.VITE_HARETOKU_PAGES_BUILD": true },
  publicDir: false,
  appType: "mpa",
  base: "/",
  build: {
    outDir: resolve(import.meta.dirname, "dist-pages"),
    emptyOutDir: true,
    sourcemap: false,
    rollupOptions: {
      input: Object.fromEntries([
        "index.html", "solar/index.html", "simulator/index.html", "404.html",
        ...["calculation-method", "costs-maintenance", "electricity-sales", "subsidies", "disaster", "quotes-contractors", "policy"].map(name => `pages/${name}.html`)
      ].map(path => [path.replaceAll("/", "-").replace(".html", ""), resolve(root, path)]))
    }
  }
});


