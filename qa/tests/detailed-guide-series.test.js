import {journeyRoutes} from '../../site/map/routes.js';
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import test from "node:test";

const slugs = ["solar-electricity-savings", "solar-fit", "solar-installation-cost", "solar-maintenance-cost", "subsidy-amount"];
const site = new URL("../../site/", import.meta.url);
const plain = text => text.replace(/<[^>]+>/g, "").trim();
const catalog = JSON.parse(await readFile(new URL("solar/data/articles.json", site), "utf8"));

test("詳細5記事の一覧・正規URL・固有ヒーローが本文へ接続する", async () => {
  const heroes = new Set();
  for (const slug of slugs) {
    const html = await readFile(new URL(`guides/${slug}/index.html`, site), "utf8");
    const item = catalog.find(item => item.href === `/guides/${slug}/`);
    assert.equal(item?.articleType, "detail", slug);
    assert.equal(item.title, plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]), slug);
    assert(html.includes(`rel="canonical" href="https://haretoku.jp/guides/${slug}/"`));
    const hero = html.match(/<figure class="(?:economics|guide)-hero__visual">[\s\S]*?<\/figure>/)?.[0];
    assert(hero, `${slug}: hero`);
    const src = hero.match(/src="([^"]+)"/)[1];
    assert.equal(src.split("/").at(-1), item.image.src.split("/").at(-1));
    assert(!heroes.has(src), `${slug}: 他の詳細記事とヒーローを共用`);
    heroes.add(src);
    await access(new URL(src.slice(1), site));
  }
});

test("詳細5記事の目次・本文階層・章頭写真・文献・内部導線を検査する", async () => {
  for (const slug of slugs) {
    const html = await readFile(new URL(`guides/${slug}/index.html`, site), "utf8");
    const toc = html.match(/<details class="article-toc">[\s\S]*?<\/details>/)?.[0];
    assert(toc, `${slug}: native目次`);
    assert(!toc.match(/<details[^>]*\sopen(?:\s|>)/));
    const content = html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1].replace(toc, "");
    const headingPairs = [...content.matchAll(/<section\b[^>]*id="([^"]+)"[^>]*>\s*<h[23]\b[^>]*>([\s\S]*?)<\/h[23]>/g)].map(m => [m[1], plain(m[2])]);
    const tocPairs = [...toc.matchAll(/<a href="#([^"]+)">([\s\S]*?)<\/a>/g)].map(m => [m[1], plain(m[2])]);
    assert.deepEqual(tocPairs, headingPairs, `${slug}: 目次と章・節の順序/文言`);
    const ids = [...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]);
    assert.equal(ids.length, new Set(ids).size, `${slug}: ID重複`);
    for (const m of html.matchAll(/href="#([^"]+)"/g)) assert(ids.includes(m[1]), `${slug}: ${m[1]}`);
    const chapters = [...content.matchAll(/<h2\b[^>]*>[\s\S]*?<\/h2>([\s\S]*?)(?=<h2\b|$)/g)];
    assert(chapters.length >= 4, `${slug}: 導入と説明章`);
    const photos = [];
    for (const chapter of chapters) {
      const entry = chapter[1].match(/^\s*<figure class="(?:economics|guide)-chapter-photo">\s*<img\b([^>]+)>/);
      assert(entry, `${slug}: h2直下の章頭写真`);
      const src = entry[1].match(/src="([^"]+)"/)[1];
      assert(/\.(?:webp|png|jpg)$/.test(src), `${slug}: 章頭は写真`);
      assert(entry[1].match(/alt="[^"]+"/));
      photos.push(src);
    }
    assert.equal(photos.length, new Set(photos).size, `${slug}: 章頭写真の重複`);
    for (const m of html.matchAll(/(?:href|src)="(\/[^"#?]+)(?:[^"\s]*)?"/g)) {
      const path = m[1];
      await access(new URL(path.slice(1) + (path.endsWith("/") ? "index.html" : ""), site));
    }
    for (const m of html.matchAll(/href="(\/[^"#?]+)#([^"?]+)"/g)) {
      const target = new URL(m[1].slice(1) + (m[1].endsWith("/") ? "index.html" : ""), site);
      const targetHtml = await readFile(target, "utf8");
      assert(targetHtml.includes(`id="${m[2]}"`), `${slug}: 参照先の節 ${m[1]}#${m[2]}`);
    }
    assert(content.includes('class="source-list"'), `${slug}: 一次資料への文献`);
    const target = {"solar-electricity-savings":"electricity","solar-fit":"electricity","solar-maintenance-cost":"roof"}[slug] || "estimate";
    assert(html.includes(`href="${journeyRoutes[target]}"`), `${slug}: MAPの対応ページ`);
    if(slug === "subsidy-amount")assert(content.includes('href="/data/subsidies/"'));
    assert.doesNotMatch(content,/data-inline-quote-action|data-quote-promotion/);

  }
});
