import { copyFile, writeFile, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "dist-pages");
const paths = ["/", "/guides/", "/simulator/", ...["solar-economics", "subsidies", "disaster", "quotes-contractors"].map(name => `/guides/${name}/`), ...["policy", "calculation-method"].map(name => `/pages/${name}.html`)];
await writeFile(resolve(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>https://haretoku.jp${path}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeFile(resolve(output, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://haretoku.jp/sitemap.xml\n");
await writeFile(resolve(output, ".nojekyll"), "");
await writeFile(resolve(output, "CNAME"), "haretoku.jp\n");
// OGPはハッシュに依存しない固定URLで配信する．既存画像を再利用する．
await copyFile(resolve(root, "site/shared/assets/haretoku-balance-motif.png"), resolve(output, "og-image.png"));

// Viteの共有CSS分割で順序が変わっても，共通ベース→記事ベース→ページ固有を維持する．
async function restoreStyleOrder(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) { await restoreStyleOrder(file); continue; }
    if (!entry.name.endsWith(".html")) continue;
    const html = await readFile(file, "utf8");
    const pattern = /<link\b[^>]*rel="stylesheet"[^>]*>/g;
    const rank = tag => /href="[^"]*\/main-[^"]+\.css"/.test(tag) ? 0 : /href="[^"]*\/article-[^"]+\.css"/.test(tag) ? 1 : 2;
    const links = [...html.matchAll(pattern)].map(match => match[0]).sort((a, b) => rank(a) - rank(b));
    let index = 0;
    await writeFile(file, html.replace(pattern, () => links[index++]));
  }
}
await restoreStyleOrder(output);
