import { copyFile, writeFile } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "dist-pages");
const paths = ["/", "/solar/", "/simulator/", ...["electricity-sales", "subsidies", "disaster", "quotes-contractors", "policy", "calculation-method"].map(name => `/pages/${name}.html`)];
await writeFile(resolve(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>https://haretoku.jp${path}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeFile(resolve(output, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://haretoku.jp/sitemap.xml\n");
await writeFile(resolve(output, ".nojekyll"), "");
await writeFile(resolve(output, "CNAME"), "haretoku.jp\n");
// OGPはハッシュに依存しない固定URLで配信する．既存画像を再利用する．
await copyFile(resolve(root, "site/shared/assets/haretoku-balance-motif.png"), resolve(output, "og-image.png"));
