import { analyticsConfig } from "../shared/analytics-config.js";
import { analyticsAllowed } from "../shared/analytics-core.js";
import assert from "node:assert/strict";
import { readFile, readdir, stat } from "node:fs/promises";
import { resolve, dirname, extname } from "node:path";

const root = resolve(import.meta.dirname, "../..");
const output = resolve(root, "dist-pages");
async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true });
  return (await Promise.all(entries.map(e => e.isDirectory() ? walk(resolve(dir, e.name)) : resolve(dir, e.name)))).flat();
}
const files = await walk(output);
const relative = files.map(file => file.slice(output.length + 1).replaceAll("\\", "/"));
assert(relative.every(path => /^(?:assets\/[^/]+|(?:pages|solar|simulator)\/[^/]+\.html|index\.html|404\.html|sitemap\.xml|robots\.txt|CNAME|\.nojekyll|og-image\.png)$/.test(path)), "未承認の配信ファイルがあります");
assert(!relative.some(path => /(?:\.map$|fixture|audit|__local|\.openai|worker|wrangler|hosting\.json)/i.test(path)), "開発用ファイルが混入しています");
const sitemap = await readFile(resolve(output, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, 9);
for (const url of urls) {
  const path = new URL(url).pathname;
  assert.equal(new URL(url).origin, "https://haretoku.jp");
  const html = await readFile(resolve(output, `.${path}${path.endsWith("/") ? "index.html" : ""}`), "utf8");
  assert(html.includes(`rel="canonical" href="${url}"`), `canonical: ${path}`);
  assert(html.includes(`property="og:url" content="${url}"`), `og:url: ${path}`);
  assert(html.includes('content="https://haretoku.jp/og-image.png"'));
}
for (const file of files.filter(file => extname(file) === ".html")) {
  const html = await readFile(file, "utf8");
  const styles = [...html.matchAll(/<link\b[^>]*rel="stylesheet"[^>]*href="([^"]+)"/g)].map(match => match[1]);
  const mainIndex = styles.findIndex(href => /\/main-[^/]+\.css$/.test(href));
  const articleIndex = styles.findIndex(href => /\/article-[^/]+\.css$/.test(href));
  assert(mainIndex < 0 || mainIndex === 0, `共通CSSは最初に読む: ${file}`);
  assert(articleIndex < 0 || articleIndex === (mainIndex < 0 ? 0 : 1), `記事ベースCSSは固有CSSより前: ${file}`);
  assert(!/<script[^>]+src=["']https?:/i.test(html), "外部スクリプトは未承認です");
  for (const [, reference] of html.matchAll(/(?:href|src)="([^"]+)"/g)) {
    if (/^(?:[a-z]+:|#|\/\/)/i.test(reference)) continue;
    const path = decodeURIComponent(reference.split(/[?#]/)[0]);
    if (!path) continue;
    let target = path.startsWith("/") ? resolve(output, `.${path}`) : resolve(dirname(file), path);
    assert(target.startsWith(output), `配信範囲外: ${reference}`);
    if ((await stat(target)).isDirectory()) target = resolve(target, "index.html");
    await stat(target);
  }
}
const jsonFiles = files.filter(file => extname(file) === ".json");
for (const sourceName of ["public-data", "metadata"]) {
  const source = await readFile(resolve(root, `data/input/${sourceName}.json`));
  const deployed = jsonFiles.filter(file => file.split(/[\\/]/).at(-1).startsWith(`${sourceName}-`));
  assert.equal(deployed.length, 1, `${sourceName}の同梱`);
  assert(source.equals(await readFile(deployed[0])), `${sourceName}が受領版と不一致`);
  assert.equal(JSON.parse(source).schema_version, "11.17.0", "公開データ版が変更されています");
}
assert.equal((await readFile(resolve(output, "CNAME"), "utf8")).trim(), "haretoku.jp");
assert((await readFile(resolve(output, "robots.txt"), "utf8")).includes("Sitemap: https://haretoku.jp/sitemap.xml"));
assert((await readFile(resolve(output, "404.html"), "utf8")).includes('content="noindex,follow"'));



const policyHtml = await readFile(resolve(output, "pages/policy.html"), "utf8");
assert(policyHtml.includes(`data-analytics-policy="${analyticsConfig.enabled ? "enabled" : "disabled"}"`), "計測の有効状態とポリシーが不一致");
if (analyticsConfig.enabled) {
  assert(analyticsAllowed(analyticsConfig, "https://haretoku.jp/", true), "計測の有効化条件が未確認");
  assert(!policyHtml.includes("現在，アクセス解析サービスや広告計測タグは導入していません"), "有効化前にポリシーを更新してください");
  assert(policyHtml.includes("Google Analytics"), "GA4の説明がありません");
}

console.log(`Pages検証PASS: ${files.length}ファイル，正規9URL，公開データ11.17.0同一，ローカル参照・QA非混入`);
