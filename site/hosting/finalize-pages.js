import {journeyRoutes} from '../map/routes.js';
import { copyFile, writeFile, readFile, readdir } from "node:fs/promises";
import { resolve } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "dist-pages");
const paths = [...Object.values(journeyRoutes).filter(path=>path!=='/'),"/", "/guides/", "/press/", ...["solar-economics", "subsidies", "disaster", "quotes-contractors", "solar-electricity-savings", "solar-fit", "solar-installation-cost", "solar-maintenance-cost", "subsidy-amount", "electricity-support-end"].map(name => `/guides/${name}/`), ...["policy", "calculation-method"].map(name => `/pages/${name}.html`)];
await writeFile(resolve(output, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${paths.map(path => `  <url><loc>https://haretoku.jp${path}</loc></url>`).join("\n")}\n</urlset>\n`);
await writeFile(resolve(output, "robots.txt"), "User-agent: *\nAllow: /\n\nSitemap: https://haretoku.jp/sitemap.xml\n");
await writeFile(resolve(output, ".nojekyll"), "");
await writeFile(resolve(output, "CNAME"), "haretoku.jp\n");
await copyFile(resolve(root, "site/shared/assets/favicon-96.png"), resolve(output, "favicon.png"));
// マップの既存キャラクター・家・道を使う共有画像．旧写真URLは互換用に保持する．
await copyFile(resolve(root, "site/shared/assets/og-step-map-20261017.png"), resolve(output, "og-step-map-20261017.png"));
await copyFile(resolve(root, "site/shared/assets/og-home-photo-20260926.jpg"), resolve(output, "og-home-photo-20260926.jpg"));
await copyFile(resolve(root, "site/shared/assets/support-shock-burden.png"), resolve(output, "og-support-shock-burden.png"));
// 旧メタを保持する共有サービス向けに，旧URLにも同じ表示のPNGを配信する．
await copyFile(resolve(root, "site/shared/assets/og-step-map-20261017.png"), resolve(output, "og-image.png"));

// 調査の配布用PNG・SVG・CSVは，図の表示用ハッシュ資産とは別に固定名で同梱する．
const releasePath = resolve(output, 'guides/electricity-support-end/index.html');
let releaseHtml = await readFile(releasePath, 'utf8');
const downloads = [...releaseHtml.matchAll(/<a\b[^>]*href="\/shared\/assets\/(support-shock-[a-z0-9-]+\.(?:png|svg|csv))"[^>]*download[^>]*>/g)];
for (const name of new Set(downloads.map(match => match[1]))) {
  await copyFile(resolve(root, 'site/shared/assets', name), resolve(output, 'assets', name));
  releaseHtml = releaseHtml.replaceAll(`/shared/assets/${name}`, `/assets/${name}`);
}
await writeFile(releasePath, releaseHtml);

// Viteの共有CSS分割で順序が変わっても，共通ベース→記事ベース→ページ固有を維持する．
const checklistAsset=(await readdir(resolve(output,'assets'))).find(name=>/^contractor-checksheet-[^.]+\.pdf$/.test(name));
if(!checklistAsset)throw Error('チェックシートPDFがビルドされていません．');
async function restoreStyleOrder(dir) {
  for (const entry of await readdir(dir, { withFileTypes: true })) {
    const file = resolve(dir, entry.name);
    if (entry.isDirectory()) { await restoreStyleOrder(file); continue; }
    if (!entry.name.endsWith(".html")) continue;
    const html = (await readFile(file, "utf8")).replaceAll('/map/assets/contractor-checksheet.pdf',`/assets/${checklistAsset}`);
    const pattern = /<link\b[^>]*rel="stylesheet"[^>]*>/g;
    const rank = tag => /href="[^"]*\/main-[^"]+\.css"/.test(tag) ? 0 : /href="[^"]*\/article-[^"]+\.css"/.test(tag) ? 1 : 2;
    const links = [...html.matchAll(pattern)].map(match => match[0]).sort((a, b) => rank(a) - rank(b));
    let index = 0;
    await writeFile(file, html.replace(pattern, () => links[index++]));
  }
}
await restoreStyleOrder(output);
