import {journeyRoutes} from '../map/routes.js';
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
assert(relative.every(path => /^(?:assets\/[^/]+|(?:pages|simulator)\/[^/]+\.html|(?:guides|data|press)\/(?:[^/]+\/)?index\.html|index\.html|404\.html|sitemap\.xml|robots\.txt|CNAME|\.nojekyll|favicon\.png|og-home-photo-20260926\.jpg|og-step-map-20261017\.png|og-image\.png|og-support-shock-burden\.png)$/.test(path)), "未承認の配信ファイルがあります");
assert(!relative.some(path => /(?:\.map$|fixture|audit|__local|\.openai|worker|wrangler|hosting\.json)/i.test(path)), "開発用ファイルが混入しています");
for (const retired of ['solar/index.html', 'guides/solar-profit-conditions/index.html', ...['electricity-sales','costs-maintenance','subsidies','disaster','quotes-contractors'].map(name => `pages/${name}.html`)]) {
  assert(!relative.includes(retired), `廃止URLが配信されています: ${retired}`);
}
const sitemap = await readFile(resolve(output, "sitemap.xml"), "utf8");
const urls = [...sitemap.matchAll(/<loc>(.*?)<\/loc>/g)].map(m => m[1]);
assert.equal(urls.length, 15+Object.keys(journeyRoutes).length-1);
for(const route of Object.values(journeyRoutes)){
  assert(urls.includes(`https://haretoku.jp${route}`));
  const html=await readFile(resolve(output,'.'+route,'index.html'),'utf8');
  assert(!html.includes('noindex,follow'),`正規ページをnoindexにしない：${route}`);
  if(route!=='/')assert(/<h1 id="page-title"[^>]*>[^<]+<\/h1>/.test(html),`直接アクセスで本文を配信する：${route}`);
}
for (const url of urls) {
  const path = new URL(url).pathname;
  assert.equal(new URL(url).origin, "https://haretoku.jp");
  const html = await readFile(resolve(output, `.${path}${path.endsWith("/") ? "index.html" : ""}`), "utf8");
  assert(html.includes(`rel="canonical" href="${url}"`), `canonical: ${path}`);
  assert(html.includes('name="viewport" content="width=device-width, initial-scale=1"'), `viewport: ${path}`);
  assert(html.includes('href="https://haretoku.jp/favicon.png" type="image/png" sizes="96x96"'), `favicon: ${path}`);
  const siteNames=[...html.matchAll(/<script type="application\/ld\+json" data-site-name>([\s\S]*?)<\/script>/g)];
  assert.equal(siteNames.length,path==='/'?1:0, `サイト名の構造化データはTOPだけ: ${path}`);
  if(path==='/') {
    assert.deepEqual(JSON.parse(siteNames[0][1]),{'@context':'https://schema.org','@type':'WebSite',name:'はれトク',url:'https://haretoku.jp/'});
    assert(html.includes('<title>太陽光・蓄電池の費用と選び方｜はれトク</title>'));
    assert(html.includes('property="og:title" content="太陽光・蓄電池の費用と選び方｜はれトク"'));
  }
  const news = path === '/guides/electricity-support-end/';
  const journeyArticle=Object.entries(journeyRoutes).some(([id,route])=>!['map','estimate'].includes(id)&&route===path);
  assert(html.includes('property="og:type" content="' + (news||journeyArticle ? 'article' : 'website') + '"'), `og:type: ${path}`);
  assert(html.includes(`property="og:url" content="${url}"`), `og:url: ${path}`);
  assert(html.includes('content="https://haretoku.jp/' + (news ? 'og-support-shock-burden.png' : 'og-step-map-20261017.png') + '"'));
  assert(html.includes('property="og:image:type" content="image/png"'));
  assert(html.includes('property="og:image:width" content="' + (news ? '1320' : '1200') + '"'));
  assert(html.includes('property="og:image:height" content="' + (news ? '585' : '630') + '"'));
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
for (const sourceName of ["public-data", "metadata", "hare-display-table", "hare-display-binding", "diagnostic-display-table", "diagnostic-display-binding"]) {
  const source = await readFile(resolve(root, `data/input/${sourceName}.json`));
  const deployed = jsonFiles.filter(file => file.split(/[\\/]/).at(-1).startsWith(`${sourceName}-`));
  assert.equal(deployed.length, 1, `${sourceName}の同梱`);
  assert(source.equals(await readFile(deployed[0])), `${sourceName}が受領版と不一致`);
  if (['public-data', 'metadata'].includes(sourceName)) assert.equal(JSON.parse(source).schema_version, "13.0.0", "公開データ版が変更されています");
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


const shareSource = await readFile(resolve(root, "site/shared/assets/og-step-map-20261017.png"));
const favicon=await readFile(resolve(output,'favicon.png'));
assert(favicon.equals(await readFile(resolve(root,'site/shared/assets/favicon-96.png'))));
assert(favicon.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
assert.equal(favicon.readUInt32BE(16),96);assert.equal(favicon.readUInt32BE(20),96);
const shareOutput = await readFile(resolve(output, "og-step-map-20261017.png"));
assert(shareSource.equals(shareOutput), "共有画像が採用資産と不一致");
assert(shareOutput.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), "共有画像のPNG形式が不正");
assert.equal(shareOutput.readUInt32BE(16), 1200);
assert.equal(shareOutput.readUInt32BE(20), 630);
const legacyShareOutput = await readFile(resolve(output, "og-image.png"));
assert(shareSource.equals(legacyShareOutput), "旧URLの互換共有画像が採用資産と不一致");
assert(legacyShareOutput.subarray(0, 8).equals(Buffer.from([137, 80, 78, 71, 13, 10, 26, 10])), "互換画像のPNG形式が不正");
assert.equal(legacyShareOutput.readUInt32BE(16), 1200);
assert.equal(legacyShareOutput.readUInt32BE(20), 630);
assert((await readFile(resolve(output, 'og-home-photo-20260926.jpg'))).equals(await readFile(resolve(root, 'site/shared/assets/og-home-photo-20260926.jpg'))), '旧写真URLの互換性を保持する');

console.log(`Pages検証PASS: ${files.length}ファイル，正規${urls.length}URL，公開データ13.0.0同一，ローカル参照・QA非混入`);

assert((await readFile(resolve(output, 'og-support-shock-burden.png'))).equals(await readFile(resolve(root, 'site/shared/assets/support-shock-burden.png'))), '調査記事の共有画像が不一致');
