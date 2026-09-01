import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";


const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const siteRoot = resolve(repositoryRoot, "site");
const htmlPaths = [
  resolve(siteRoot, "index.html"),
  resolve(siteRoot, "simulator/index.html"),
  resolve(siteRoot, "pages/calculation-method.html"),
  resolve(siteRoot, "pages/costs-maintenance.html"),
  resolve(siteRoot, "pages/electricity-sales.html"),
  resolve(siteRoot, "pages/subsidies.html"),
  resolve(siteRoot, "pages/disaster.html"),
  resolve(siteRoot, "pages/quotes-contractors.html"),
  resolve(siteRoot, "pages/policy.html")
];

function attributeValues(html, attribute) {
  return [...html.matchAll(new RegExp(`${attribute}="([^"]+)"`, "g"))].map((match) => match[1]);
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

test("全HTMLが基本的な意味構造と固有IDを持つ", async () => {
  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    assert.match(html, /<html lang="ja">/);
    assert.match(html, /<meta\s+[\s\S]*?name="description"/);
    assert.equal((html.match(/<h1(?:\s|>)/g) ?? []).length, 1);
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
    const ids = new Set(attributeValues(html, "id"));
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
      const targetIds = new Set(attributeValues(targetHtml, "id"));
      assert.ok(targetIds.has(fragment), `アンカーがありません：${pagePath} → ${href}`);
    }
  }
});

test("フォーム部品にラベルと入力制約がある", async () => {
  for (const pagePath of [resolve(siteRoot, "index.html"), resolve(siteRoot, "simulator/index.html")]) {
    const html = await readFile(pagePath, "utf8");
    assert.match(html, /<label for="prefecture">/);
    assert.match(html, /<select id="prefecture"[^>]*required>/);
    assert.match(html, /<label for="monthly-electricity-bill">/);
    assert.match(html, /<input[\s\S]*?id="monthly-electricity-bill"[\s\S]*?min="0"/);
    assert.match(html, /id="form-message"[^>]*role="status"[^>]*aria-live="polite"/);
  }
  const analysisHtml = await readFile(resolve(siteRoot, "simulator/index.html"), "utf8");
  assert.match(analysisHtml, /data-calculator-collapsed[^>]*hidden/);
  assert.match(analysisHtml, /data-change-conditions/);
  assert.match(analysisHtml, /data-cancel-conditions[^>]*hidden/);
  assert.match(analysisHtml, /id="analysis-title" class="analysis-page-title">はれ<span class="brand-word">トク<\/span>診断<\/h1>/);
  assert.match(analysisHtml, /data-change-conditions>条件を変更/);
  assert.match(analysisHtml, /<h2 id="calculator-title">条件<\/h2>/);
  assert.doesNotMatch(analysisHtml, /太陽光の20年間採算を診断/);
  assert.doesNotMatch(analysisHtml, /地域データによる概算です．結果を先に示し/);
  assert.match(analysisHtml, /data-roof-condition-summary>方角：南向き/);
  assert.match(analysisHtml, /id="roof-orientation"/);
  assert.match(analysisHtml, /南東・南西は96％，東西・不明は85％/);
  assert.match(analysisHtml, /詳細条件を変更/);
  assert.doesNotMatch(analysisHtml, /<select disabled>/);
  assert.match(analysisHtml, /data-result-condition/);
});

test("結果は主要結論，2段階の見積もり導線，段階的開示の順である", async () => {
  const html = await readFile(resolve(siteRoot, "simulator/index.html"), "utf8");
  const app = await readFile(resolve(siteRoot, "simulator/src/app.js"), "utf8");
  assert.equal((html.match(/class="estimate-cta affiliate-panel"/g) ?? []).length, 1);
  assert.equal((html.match(/class="advertising-label"/g) ?? []).length, 2);
  assert.equal((html.match(/class="secondary-button affiliate-button"[^>]*type="button"[^>]*disabled/g) ?? []).length, 2);
  assert.match(html, /data-route-source="analysis-primary-affiliate"/);
  assert.match(html, /data-route-source="analysis-affiliate"/);
  assert.equal((html.match(/<details class="panel disclosure-panel"/g) ?? []).length, 1);
  assert.match(html, /data-result-payback/);
  assert.match(html, /data-cashflow-scenario/);
  assert.match(html, /累積損益と回収時点/);
  assert.match(html, /class="advanced-panel advanced-panel--conditions"/);
  assert.match(html, /<\/form>\s*<\/div>\s*<details class="advanced-panel advanced-panel--conditions">/);
  assert.ok(html.indexOf("advanced-panel--conditions") < html.indexOf("id=\"estimate-result\""));
  assert.match(app, /aria-pressed/);
  assert.match(app, /paybackIntersection/);
  assert.match(app, /zeroIntersections/);
  assert.doesNotMatch(app, /cashflow-chart__payback-label/);
  assert.match(app, /selectedScenarioId/);
  assert.match(app, /cancelConditionChanges/);
  assert.match(html, /利益の内訳を見る/);
  assert.doesNotMatch(html, /計算の前提・根拠を見る/);
  assert.doesNotMatch(html, /1年目の経済効果/);
  assert.match(html, /導入費用/);
  assert.match(html, /実質初期負担/);
  assert.match(html, /data-result-subsidy-status/);
  assert.match(html, /確認できない容量では「未確認」と表示/);
  assert.match(app, /subsidyStatusFor/);
  assert.match(app, /subsidy_calculation_note/);
  assert.match(html, /維持・交換費/);
  assert.match(html, /20年間の経済効果と維持費/);
  assert.match(html, /id="profit-breakdown-title">20年間の正味利益/);
  assert.match(html, /電気料金削減＋売電収入－実質初期負担－維持・交換費/);
  assert.match(html, /data-result-lifecycle-cost/);
  assert.match(html, /4年ごとの点検と15年目の交換/);
  assert.match(html, /家庭の使用量/);
  assert.match(html, /買電量/);
  assert.match(html, /data-loss-guidance[^>]*hidden/);
  assert.match(html, /結果を確認したら，無料見積もりへ/);
  assert.equal((html.match(/class="brand-word"/g) ?? []).length, 1);
  assert.match(html, /実際の屋根・施工条件を反映した採算は，見積もりで詳しく確認できます/);
  assert.equal((html.match(/無料見積もりで確認/g) ?? []).length, 2);
  assert.doesNotMatch(html, /無料見積もりで詳しく確認/);
  assert.match(html, /広告・アフィリエイト/);
  assert.match(html, /長期利益または補助金の適用を保証するものではありません/);
  assert.ok(html.indexOf("data-result-economic-benefit") < html.indexOf("利益の内訳を見る"));
  assert.ok(html.indexOf("class=\"estimate-cta affiliate-panel\"") < html.indexOf("利益の内訳を見る"));
});

test("トップは診断を主導線，広告を副導線として1か所だけ持つ", async () => {
  const html = await readFile(resolve(siteRoot, "index.html"), "utf8");
  assert.match(html, /data-route-source="top-analysis"/);
  assert.equal((html.match(/data-route-source="top-affiliate"/g) ?? []).length, 1);
  assert.equal((html.match(/広告・アフィリエイトを含みます/g) ?? []).length, 1);
  assert.match(html, /見積もりを取る前に，あなたの場合の20年間の損得を確認．/);
  assert.doesNotMatch(html, /得にならない場合も，結果をそのまま表示/);
  assert.match(html, /<span class="hero-title__chunk">太陽光，<\/span><span class="hero-title__chunk">結局いくら<span class="brand-word">トク<\/span>？<\/span>/);
  assert.ok(html.indexOf("data-route-source=\"top-analysis\"") < html.indexOf("data-route-source=\"top-affiliate\""));
  assert.match(html, /class="top-estimate-route affiliate-panel page-width"/);
  assert.match(html, /class="secondary-button affiliate-button"/);
  assert.match(html, /工事費や利用できる補助金を，無料見積もりで詳しく確認できます/);
  assert.match(html, /<span class="affiliate-button__label">無料見積もりで確認<\/span>/);
  assert.doesNotMatch(html, /affiliate-button__brand-word/);
  assert.match(html, /登録不要<\/li><li>氏名・住所の入力なし<\/li><li>診断も見積もりも無料<\/li>/);
  assert.doesNotMatch(html, /<li>得にならない結果も表示<\/li>/);
  assert.match(html, /<ol class="hero-steps" aria-label="はれトク診断の流れ">/);
  assert.match(html, /なっ<span class="brand-term">トク<\/span>したら，実際の費用を確認/);
  assert.match(html, /屋根・施工条件と利用できる補助金を踏まえた無料見積もりへ進めます/);
  assert.match(html, /pages\/calculation-method\.html">計算方法・使用データ<\/a>/);
  assert.match(html, /pages\/policy\.html">はれ<span class="brand-term">トク<\/span>の方針<\/a>/);
  assert.doesNotMatch(html, /class="trust-section/);
  assert.doesNotMatch(html, /class="value-section/);
  assert.equal((html.match(/class="guide-card(?: guide-card--featured)?"/g) ?? []).length, 3);
  assert.match(html, /はれ<span class="brand-term">トク<\/span>ガイド/);
  assert.match(html, /知って，なっ<span class="brand-word">トク<\/span>．/);
  assert.match(html, /仕組み，補助金，見積もり．自分に関係することから，短く整理します/);
  assert.match(html, /電気代は，どう減る？/);
  assert.match(html, /使える補助金は，どう探す？/);
  assert.match(html, /見積もりは，何を比べて決める？/);
  for (const category of ["しくみ｜全国", "補助金｜全国｜2026年度", "見積もり｜全国"]) {
    assert.match(html, new RegExp(`<span class="guide-card__category">${category}<\\/span>`));
  }
});

test("詳細ページの動的出典IDが公開メタデータに存在する", async () => {
  const metadata = JSON.parse(await readFile(resolve(repositoryRoot, "data/input/metadata.json"), "utf8"));
  const sourceIds = new Set(metadata.sources.map((source) => source.source_id));
  for (const pagePath of htmlPaths.slice(1)) {
    const html = await readFile(pagePath, "utf8");
    for (const sourceId of attributeValues(html, "data-source-id")) {
      assert.ok(sourceIds.has(sourceId), `出典IDがありません：${sourceId}`);
    }
  }
});
