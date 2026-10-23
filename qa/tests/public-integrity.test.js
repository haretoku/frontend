import {pages as mapPages} from '../../site/map/content.js';
import { nonInclusionReason, replacementEvents } from "../../site/simulator/src/subsidy-presentation.js";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { decisionAmountParts, resultConditionHeadline, mainSubsidyPresentation, scenarioRecoveryPresentation, energyBreakdownPresentation } from "../../site/simulator/src/result-presentation.js";
const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const siteRoot=resolve(repositoryRoot,"site");
const newDetailSlugs = ["solar-electricity-savings", "solar-fit", "solar-installation-cost", "solar-maintenance-cost", "subsidy-amount"];
const htmlPaths = [
  resolve(siteRoot, "index.html"),
  resolve(siteRoot, "guides/index.html"),
  resolve(siteRoot, "guides/self-consumption/index.html"),
  resolve(siteRoot, "press/index.html"),
  resolve(siteRoot, "pages/calculation-method.html"),
  resolve(siteRoot, "guides/solar-economics/index.html"),
  ...newDetailSlugs.map(slug => resolve(siteRoot, `guides/${slug}/index.html`)),
  resolve(siteRoot, "guides/subsidies/index.html"),
  resolve(siteRoot, "guides/disaster/index.html"),
  resolve(siteRoot, "guides/quotes-contractors/index.html"),
  resolve(siteRoot, "pages/policy.html")
];

function attributeValues(html, attribute) {
  return [...html.matchAll(new RegExp(`(?:^|\\s)${attribute}="([^"]+)"`, "g"))].map((match) => match[1]);
}

async function localTarget(pagePath, reference) {
  const pathPart = reference.split("#", 1)[0].split("?", 1)[0];
  if (!pathPart || /^(?:https?:|mailto:|tel:|data:)/.test(pathPart)) {
    return null;
  }
  let target = pathPart.startsWith("/")
    ? resolve(siteRoot, pathPart.slice(1))
    : resolve(dirname(pagePath), pathPart);
  if (pathPart.endsWith("/") || target === siteRoot) {
    target = resolve(target, "index.html");
  }
  return target;
}

test("主結果は1万円未満を千円単位の概算とし，0円と1万円境界を区別する", () => {
  assert.deepEqual(decisionAmountParts(1_086), { amount: "1,000円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-1_086), { amount: "1,000円", outcome: "損" });
  assert.deepEqual(decisionAmountParts(9_999), { amount: "10,000円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-9_999), { amount: "10,000円", outcome: "損" });
  assert.deepEqual(decisionAmountParts(0), { amount: "0円", outcome: "" });
  assert.deepEqual(decisionAmountParts(10_000), { amount: "1万円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-10_000), { amount: "1万円", outcome: "損" });
});
test("全HTMLが基本的な意味構造と固有IDを持つ", async () => {
  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    assert.match(html, /<html lang="ja">/);
    assert.match(html, /<meta\s+[\s\S]*?name="description"/);
    // TOPは排他的な2画面を持つ．表示中のh1は実ブラウザでも確認する．
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, pagePath===resolve(siteRoot,"index.html")?2:1);
    if(pagePath===resolve(siteRoot,"index.html"))assert.match(html, /id="reading"[^>]*hidden/);
    assert.equal((html.match(/<main(?:\s|>)/g) ?? []).length, 1);
    assert.match(html, /<title>[^<]+<\/title>/);
    assert.match(html, /rel="icon" href="[^"]+favicon\.svg"/);
    const ids = attributeValues(html, "id");
    assert.equal(ids.length, new Set(ids).size, `IDが重複しています：${pagePath}`);
  }
});
test("ローカルリンク，CSSおよびJavaScriptの参照先が存在する", async () => {
  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    const references = [...attributeValues(html, "href"), ...attributeValues(html, "src")];
    for (const reference of references) {
      const target = await localTarget(pagePath, reference);
      if (target) {
        await assert.doesNotReject(access(target), `${pagePath} → ${reference}`);
      }
    }
  }
});
test("同一ページ内のアンカー参照先が存在する", async () => {
  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    const ids = new Set([...attributeValues(html, "id"), ...(pagePath===resolve(siteRoot,"index.html")?mapPages.map(p=>p.id):[])]);
    for (const href of attributeValues(html, "href")) {
      if (href.startsWith("#")) {
        assert.ok(ids.has(href.slice(1)), `アンカーがありません：${pagePath} → ${href}`);
      }
    }
  }
});
test("別ページを指すアンカー参照先が存在する", async () => {
  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    for (const href of attributeValues(html, "href")) {
      const [pathPart, fragment] = href.split("#", 2);
      if (!pathPart || !fragment || /^(?:https?:|mailto:|tel:|data:)/.test(pathPart)) {
        continue;
      }
      const target = await localTarget(pagePath, pathPart);
      const targetHtml = await readFile(target, "utf8");
      const targetIds = new Set([...attributeValues(targetHtml, "id"), ...(target===resolve(siteRoot,"index.html")?mapPages.map(p=>p.id):[])]);
      assert.ok(targetIds.has(fragment), `アンカーがありません：${pagePath} → ${href}`);
    }
  }
});
test("全ページの共通フッターが方針の対応見出しへ接続する", async () => {
  const policyHtml = await readFile(resolve(siteRoot, "pages/policy.html"), "utf8");
  const footerItems = [
    ["operation", "運営方針"],
    ["advertising", "広告方針"],
    ["data", "データ方針"],
    ["privacy", "プライバシー"],
    ["disclaimer", "免責事項"]
  ];

  for (const [id, label] of footerItems) {
    assert.match(policyHtml, new RegExp(`<section id="${id}"><h2>${label}<\\/h2>`));
  }

  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    const footerNav = html.match(/<nav class="site-footer__links"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(footerNav, `共通フッターの方針リンクがありません：${pagePath}`);
    const prefix = "/pages/policy.html#";
    for (const [id, label] of footerItems) {
      assert.match(footerNav, new RegExp(`<a href="${prefix}${id}">${label}<\\/a>`));
    }
  }
});
test("共通メニューでガイドとプレスリリースを分け，現在地を示す", async () => {
  const guideCurrentPaths = new Set([

    ...newDetailSlugs.map(slug => resolve(siteRoot, `guides/${slug}/index.html`)),
    resolve(siteRoot, "guides/index.html"),
    resolve(siteRoot, "guides/solar-economics/index.html"),
    resolve(siteRoot, "guides/subsidies/index.html"),

    resolve(siteRoot, "guides/quotes-contractors/index.html")
  ]);

  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    assert.match(html, /class="map-link" href="\/"/);
    const siteNav = html.match(/<nav aria-label="主要メニュー" class="header-nav"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(siteNav, `共通ヘッダーがありません：${pagePath}`);
    const href = "/guides/";
    const guideLinks = [...siteNav.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(([,attrs]) => attrs.includes('href="' + href + '"'));
    assert.equal(guideLinks.length, 1, 'ガイド導線を重複させない');
    const [,attrs,body] = guideLinks[0];
    assert.equal(attrs.includes('aria-current="page"'), guideCurrentPaths.has(pagePath));
    assert.ok(body.replace(/<[^>]*>/g,'').includes('詳しいガイド'));
    assert.match(siteNav,/href="\/press\/"/);

  }
});
test("ガイド4マス・トリセツ・プレスが分離され，既存記事の入口を保つ", async () => {
  const html = await readFile(resolve(siteRoot, "guides/index.html"), "utf8");
  const articles = JSON.parse(await readFile(resolve(siteRoot, "solar/data/articles.json"), "utf8"));
  const script = await readFile(resolve(siteRoot, "solar/src/guides.js"), "utf8");
  const css = await readFile(resolve(siteRoot, "solar/styles/guides.css"), "utf8");
  const main = html.match(/<main>[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(html, /<title>太陽光えらびの詳しいガイド｜はれトク<\/title>/);
  assert.match(html, /meta name="description" content="[^"]+"/);
  assert.match(html, /src="\/solar\/src\/guides\.js"/);
  assert.doesNotMatch(main, /data-featured-guides/);
  assert.doesNotMatch(main, /data-safety-guides/);
  assert.match(main, /<h1 id="guide-library-title"[^>]*>/);
  assert.equal(articles.length, 11);
  assert.equal(articles.filter(article => article.articleType === "core").length, 4);
  assert.equal(articles.filter((article) => Number.isInteger(article.featuredOrder)).length, 3);
  for (const [title, target, articleTitle = title] of [
    ["太陽光の収支は，何で決まる？", "/guides/solar-economics/"],
    ["補助金は，どう探してどう申請する？", "/guides/subsidies/"],
    ["太陽光の見積もりは，何を比べる？", "/guides/quotes-contractors/"],
    ["停電時，太陽光・蓄電池で何ができる？", "/guides/disaster/"],
  ]) {
    const article = articles.find((candidate) => candidate.title === title);
    assert.equal(article?.href, target, `ガイド記事がありません：${title}`);
    const targetPath = await localTarget(resolve(siteRoot, "guides/index.html"), target);
    await assert.doesNotReject(access(targetPath));
    const targetHtml = await readFile(targetPath, "utf8");
    assert.ok(targetHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/)?.[1].replace(/<[^>]+>/g, "") === articleTitle, `記事タイトルが一致しません：${title}`);
    await assert.doesNotReject(access(await localTarget(resolve(siteRoot, "guides/index.html"), article.image.src)));
    assert.ok(article.image.width > 0 && article.image.height > 0);
    assert.ok(article.image.alt.length > 0);
  }
  for (const category of ["収支", "補助金", "見積もり", "災害への備え"]) {
    assert.ok(articles.some((article) => article.category === category), `空の分類です：${category}`);
  }
  assert.deepEqual(
    articles.filter((article) => Number.isInteger(article.featuredOrder)).map((article) => article.id),
    ["electricity-sales", "subsidies", "quotes-contractors"]
  );
  assert.doesNotMatch(JSON.stringify(articles), /calculation-method\.html|policy\.html/);
  assert.match(main, /map-reading-route[\s\S]*href="\/"/);
  const { groupedArticles } = await import("../../site/solar/src/guide-groups.js");
  const groups = groupedArticles(articles,{topics:true});
  assert.deepEqual(groups.map((group) => group.id), ["economics", "equipment", "installation", "companies"]);
  assert.deepEqual(groups.map((group) => group.articles.length), [4, 2, 1, 1]);
  const releases=groupedArticles(articles,{press:true});
  assert.deepEqual(releases.map(group=>group.id),['news']);
  assert.equal(releases[0].articles.length,1);
  assert.equal(new Set([...groups.flatMap(group=>group.articles),...releases[0].articles,...articles.filter(article=>['self-consumption','disaster'].includes(article.id))].map(article=>article.id)).size,articles.length);
  assert.deepEqual(groups[0].articles.map((article) => article.id), ["electricity-sales", "solar-electricity-savings", "solar-installation-cost", "subsidy-amount"]);
  assert.match(main, /data-guide-groups/);
  assert.doesNotMatch(main, /data-guide-filters/);
  const futureGroups = groupedArticles([
    { articleType: "news", id: "updated", publishedAt: "2026-09-01", updatedAt: "2026-10-02" },
    { articleType: "detail", id: "regional" },
    { articleType: "news", id: "recent", publishedAt: "2026-10-01" },
    articles[0]
  ],{press:true});
  assert.deepEqual(futureGroups.map((group) => group.id), ["news"]);
  assert.deepEqual(futureGroups[0].articles.map((article) => article.id), ["recent", "updated"]);
  assert.match(script, /link\.className = "guide-article-card"/);
  const bundledGuideImages = [...script.matchAll(/"(\.\.\/\.\.\/shared\/assets\/[^"*]+)"/g)].map(m=>m[1]);
  assert.deepEqual(new Set(bundledGuideImages), new Set(articles.map(a=>"../../shared/assets/"+a.image.src.split("/").at(-1))), "一覧へ読み込む画像はcatalog採用分だけ");
  assert.match(css, /@media \(min-width: 40\.001rem\)[\s\S]*grid-auto-flow: column/);
  assert.match(css, /grid-auto-columns: calc\(\(100% - var\(--guide-card-gap\) \* 2\) \/ 3\)/);
  assert.match(css, /@media \(max-width: 62rem\)[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 40rem\)[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /\.guide-article-card:focus-visible/);
  assert.match(html, /articles\/styles\/article\.css/);
  assert.doesNotMatch(main, /article-action-stack|data-quote-promotion/);
  assert.match(css, /\.guide-title-term \{ white-space: nowrap;/);
});
test("主結果の短い見出しは金額の正負・ゼロと重複せず，未確定を区別する", () => {
  for (const value of [1, -1, 0]) assert.equal(resultConditionHeadline(value), "今回の条件での概算");
  assert.match(resultConditionHeadline(null), /確認待ち/);
  assert.equal(decisionAmountParts(0).outcome, "");
  assert.equal(decisionAmountParts(1).outcome, "トク");
  assert.equal(decisionAmountParts(-1).outcome, "損");
});
test("未算入理由はサイト確認不足・終了・停止・モデル外・シナリオ仮定を区別する", () => {
  assert.match(nonInclusionReason({calculation_status:'not_adopted_missing_conditions'}), /はれトク側/);
  assert.match(nonInclusionReason({application_status:'closed'}), /受付が終了/);
  assert.match(nonInclusionReason({application_status:'suspended'}), /受付が停止/);
  assert.match(nonInclusionReason({calculation_status:'not_adopted_model_outside'}), /計算で扱う範囲/);
  assert.match(nonInclusionReason({}, true), /下振れシナリオ/);
  assert.match(nonInclusionReason({}), /理由は確認できていません/);
});
test("電力量内訳の適用範囲と関係式は設備で決まり，ゼロ値では決まらない", () => {
  const solar=energyBreakdownPresentation('solar_only');
  const battery=energyBreakdownPresentation('solar_plus_standard_battery');
  assert.equal(solar.battery,false);
  assert.equal(battery.battery,true);
  assert.doesNotMatch(solar.equation,/蓄電池|充放電/);
  assert.match(battery.equation,/充電は発電量の内訳.*直接使用と蓄電池/);
  assert.doesNotMatch(solar.sufficiency,/蓄電池/);
  assert.match(battery.sufficiency,/蓄電池/);
});
test("パワコン注記は実交換費がある年だけを使い，蓄電池交換と混同しない", () => {
  assert.deepEqual(replacementEvents({annual_cash_flows:[{year:15,replacement_cost_yen:100,cumulative_cash_flow_yen:-20},{year:10,replacement_cost_yen:0,battery_replacement_cost_yen:500}]}),[{year:15,value:-20}]);
  assert.deepEqual(replacementEvents({annual_cash_flows:[{year:15,replacement_cost_yen:0}]}),[]);
});
test("短い回収表示は回収なし・即時・未確定を保持しシナリオ名を重複しない", () => {
 assert.equal(scenarioRecoveryPresentation({scenario:'standard',profit_yen:-10,payback_year:null}),'30年以内の回収なし');
 assert.match(scenarioRecoveryPresentation({scenario:'upside',profit_yen:20,payback_year:8}),/約8年/);
 assert.match(scenarioRecoveryPresentation({scenario:'standard',profit_yen:20,payback_year:0}),/初期費用を補助金で充当/);
 assert.match(scenarioRecoveryPresentation({scenario:'downside',profit_yen:null,payback_year:null}),/確認待ち/);
 assert.doesNotMatch(scenarioRecoveryPresentation({scenario:'standard',profit_yen:0,payback_year:null}), /シナリオ|標準/);
 assert.equal(mainSubsidyPresentation({subsidy_yen:100},true).text,'補助金を一部算入');
 assert.match(mainSubsidyPresentation({subsidy_yen:0,scenario:'downside'}).text,/想定/);
});
