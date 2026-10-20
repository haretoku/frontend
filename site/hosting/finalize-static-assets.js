import {copyFile,writeFile,readFile,readdir} from "node:fs/promises";
import {resolve} from "node:path";

// 本番と確認用で共有する，静的資産・配布物・CSS順序の後処理．
export async function finalizeStaticAssets({root,output}) {
await copyFile(resolve(root,"site/shared/assets/og-self-consumption-v040.png"),resolve(output,"og-self-consumption-v040.png"));
// 詳細記事の代表イラストと同じ，記事別の共有画像を固定URLで配布する．
const articles=JSON.parse(await readFile(resolve(root,'site/solar/data/articles.json'),'utf8'));
for(const article of articles.filter(article=>article.shareImage)){
  if(!/^\/assets\/og-guide-[a-z-]+-\d{8}(?:-v\d+)?\.png$/.test(article.shareImage))throw Error('記事共有画像の配布先が不正です．');
  const name=article.shareImage.slice('/assets/'.length);
  await copyFile(resolve(root,'site/shared/assets',name),resolve(output,'assets',name));
}
await copyFile(resolve(root, "site/shared/assets/favicon-96.png"), resolve(output, "favicon.png"));
// マップの共有画像．旧写真URLもJPEG形式の同じ新イラストへそろえる．
await copyFile(resolve(root, "site/shared/assets/og-step-map-20261017.png"), resolve(output, "og-step-map-20261017.png"));
await copyFile(resolve(root, "site/shared/assets/og-step-map-20261017.png"), resolve(output, "og-step-map-20261017-v034.png"));
await copyFile(resolve(root, "site/shared/assets/og-step-map-20261017.jpg"), resolve(output, "og-home-photo-20260926.jpg"));
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

}
