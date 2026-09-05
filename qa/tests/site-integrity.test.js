import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { requireMunicipality } from "../../site/simulator/src/location-input.js";
import { decisionAmountParts, scenarioSubsidyCondition } from "../../site/simulator/src/result-presentation.js";


const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const siteRoot = resolve(repositoryRoot, "site");
const htmlPaths = [
  resolve(siteRoot, "index.html"),
  resolve(siteRoot, "solar/index.html"),
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

test("主結果は1万円未満の非ゼロ値を円単位で保ち，0円と1万円境界を区別する", () => {
  assert.deepEqual(decisionAmountParts(1_086), { amount: "1,086円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-1_086), { amount: "1,086円", outcome: "損" });
  assert.deepEqual(decisionAmountParts(9_999), { amount: "9,999円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-9_999), { amount: "9,999円", outcome: "損" });
  assert.deepEqual(decisionAmountParts(0), { amount: "0円", outcome: "" });
  assert.deepEqual(decisionAmountParts(10_000), { amount: "約1万円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-10_000), { amount: "約1万円", outcome: "損" });
});

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
    const prefix = pagePath === resolve(siteRoot, "index.html")
      ? "pages/policy.html#"
      : pagePath === resolve(siteRoot, "pages/policy.html")
        ? "#"
        : [resolve(siteRoot, "solar/index.html"), resolve(siteRoot, "simulator/index.html")].includes(pagePath)
          ? "../pages/policy.html#"
          : "policy.html#";
    for (const [id, label] of footerItems) {
      assert.match(footerNav, new RegExp(`<a href="${prefix}${id}">${label}<\\/a>`));
    }
  }
});

test("共通ヘッダーのはれトクガイドが一覧へ接続し，現在地を示す", async () => {
  const guideCurrentPaths = new Set([
    resolve(siteRoot, "solar/index.html"),
    resolve(siteRoot, "pages/costs-maintenance.html"),
    resolve(siteRoot, "pages/electricity-sales.html"),
    resolve(siteRoot, "pages/subsidies.html"),
    resolve(siteRoot, "pages/disaster.html"),
    resolve(siteRoot, "pages/quotes-contractors.html")
  ]);

  for (const pagePath of htmlPaths) {
    const html = await readFile(pagePath, "utf8");
    const siteNav = html.match(/<nav class="site-nav"[\s\S]*?<\/nav>/)?.[0];
    assert.ok(siteNav, `共通ヘッダーがありません：${pagePath}`);
    const href = pagePath === resolve(siteRoot, "index.html")
      ? "solar/"
      : pagePath === resolve(siteRoot, "solar/index.html")
        ? "./"
        : "../solar/";
    const current = guideCurrentPaths.has(pagePath) ? " aria-current=\"page\"" : "";
    assert.ok(
      siteNav.includes(`<a href="${href}"${current}>はれ<span class="brand-term">トク</span>ガイド</a>`),
      `ガイド一覧への導線が正しくありません：${pagePath}`
    );
  }
});

test("はれトクガイド一覧がメタデータから一般記事5件を4つの空でない分類に掲載する", async () => {
  const html = await readFile(resolve(siteRoot, "solar/index.html"), "utf8");
  const articles = JSON.parse(await readFile(resolve(siteRoot, "solar/data/articles.json"), "utf8"));
  const script = await readFile(resolve(siteRoot, "solar/src/guides.js"), "utf8");
  const css = await readFile(resolve(siteRoot, "solar/styles/guides.css"), "utf8");
  const main = html.match(/<main>[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(html, /<title>はれトクガイド｜住宅用太陽光の記事一覧<\/title>/);
  assert.match(html, /meta name="description" content="[^"]+"/);
  assert.match(html, /src="src\/guides\.js"/);
  assert.match(main, /<h2 id="guide-featured-title">まず読む3本<\/h2>/);
  assert.match(main, /<h2 id="guide-library-title">すべての記事<\/h2>/);
  assert.equal(articles.length, 5);
  assert.equal(articles.filter((article) => Number.isInteger(article.featuredOrder)).length, 3);
  for (const [title, target] of [
    ["太陽光の収支は，何で決まる？", "../pages/electricity-sales.html"],
    ["表示額以外に，何がかかる？", "../pages/costs-maintenance.html"],
    ["補助金は，どう探してどう申請する？", "../pages/subsidies.html"],
    ["太陽光の見積もりは，何を比べる？", "../pages/quotes-contractors.html"],
    ["停電時，太陽光だけで何ができる？", "../pages/disaster.html"]
  ]) {
    const article = articles.find((candidate) => candidate.title === title);
    assert.equal(article?.href, target, `ガイド記事がありません：${title}`);
    const targetPath = await localTarget(resolve(siteRoot, "solar/index.html"), target);
    await assert.doesNotReject(access(targetPath));
    const targetHtml = await readFile(targetPath, "utf8");
    assert.ok(targetHtml.includes(`<h1>${title}</h1>`), `記事タイトルが一致しません：${title}`);
    await assert.doesNotReject(access(await localTarget(resolve(siteRoot, "solar/index.html"), article.image.src)));
    assert.ok(article.image.width > 0 && article.image.height > 0);
    assert.ok(article.image.alt.length > 0);
  }
  for (const category of ["収支・しくみ", "補助金・制度", "見積もり・施工", "導入後・安全"]) {
    assert.ok(articles.some((article) => article.category === category), `空の分類です：${category}`);
  }
  assert.deepEqual(
    articles.filter((article) => Number.isInteger(article.featuredOrder)).map((article) => article.id),
    ["electricity-sales", "subsidies", "quotes-contractors"]
  );
  assert.doesNotMatch(JSON.stringify(articles), /calculation-method\.html|policy\.html/);
  assert.match(main, /href="\.\.\/simulator\/"><span class="guide-diagnosis__label">はれ<span class="brand-term">トク<\/span>診断へ<\/span>/);
  assert.match(script, /guideArticles[\s\S]*\.filter\(\(article\) => Number\.isInteger\(article\.featuredOrder\)\)/);
  assert.match(script, /button\.setAttribute\("aria-pressed"/);
  assert.match(script, /link\.className = featured \? "guide-article-card guide-article-card--featured"/);
  assert.match(script, /import\.meta\.glob\("\.\.\/\.\.\/shared\/assets\/\*\.\{png,webp\}"/);
  assert.match(css, /grid-template-columns: repeat\(3, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 62rem\)[\s\S]*repeat\(2, minmax\(0, 1fr\)\)/);
  assert.match(css, /@media \(max-width: 40rem\)[\s\S]*grid-template-columns: minmax\(0, 1fr\)/);
  assert.match(css, /\.guide-article-card:focus-visible/);
  assert.match(css, /\.guide-diagnosis__link \{[\s\S]*color: #fff;[\s\S]*background: var\(--color-primary-dark\);/);
  assert.match(css, /\.guide-diagnosis__label \{[\s\S]*white-space: nowrap;/);
});

test("フォーム部品にラベルと入力制約がある", async () => {
  for (const pagePath of [resolve(siteRoot, "index.html"), resolve(siteRoot, "simulator/index.html")]) {
    const html = await readFile(pagePath, "utf8");
    assert.match(html, /<label for="prefecture">/);
    assert.match(html, /<select id="prefecture"[^>]*required>/);
    assert.match(html, /<label for="monthly-electricity-bill">/);
    assert.match(html, /<input[\s\S]*?id="monthly-electricity-bill"[\s\S]*?min="0"/);
    assert.match(html, /id="form-message"[^>]*role="status"[^>]*aria-live="polite"/);
    if (pagePath.endsWith("simulator/index.html")) {
      assert.match(html, /id="form-message"[^>]*role="status"[^>]*aria-live="polite"><\/p>/);
      assert.match(html, /id="data-status"[^>]*role="status"[^>]*aria-live="polite"><\/p>/);
      assert.doesNotMatch(html, /公開データを確認しています/);
    }
  }
  const analysisHtml = await readFile(resolve(siteRoot, "simulator/index.html"), "utf8");
  const topHtml = await readFile(resolve(siteRoot, "index.html"), "utf8");
  for (const html of [topHtml, analysisHtml]) {
    assert.match(
      html,
      /id="monthly-electricity-bill"[^>]*min="0"[^>]*step="1"/,
      "トップと診断画面は地域平均とは異なる手入力値を1円単位で送信できる必要があります"
    );
  }
  assert.match(
    analysisHtml,
    /id="monthly-electricity-bill"[^>]*min="0"[^>]*step="1"/,
    "診断画面は地域平均とは異なる手入力値を1円単位で送信できる必要があります"
  );
  assert.match(analysisHtml, /data-calculator-collapsed[^>]*hidden/);
  assert.match(analysisHtml, /data-change-conditions/);
  assert.match(analysisHtml, /data-cancel-conditions[^>]*hidden/);
  assert.match(analysisHtml, /id="analysis-title" class="analysis-page-title">はれ<span class="brand-word">トク<\/span>診断<\/h1>/);
  assert.match(analysisHtml, /data-change-conditions>条件を変更/);
  assert.match(analysisHtml, /<h2 id="calculator-title">あなたの条件で診断する<\/h2>/);
  assert.match(analysisHtml, /class="analysis-intro__motif" src="\.\.\/shared\/assets\/haretoku-balance-motif\.png"/);
  assert.doesNotMatch(analysisHtml, /太陽光の20年間採算を診断/);
  assert.doesNotMatch(analysisHtml, /地域データによる概算です．結果を先に示し/);
  assert.match(analysisHtml, /data-detail-condition-summary>屋根の方角・平日昼間の在宅状況/);
  assert.match(analysisHtml, /id="roof-orientation"/);
  assert.match(analysisHtml, /南東・南西は96％，東西・不明は85％/);
  assert.match(analysisHtml, /屋根の傾斜や周囲の影は住宅ごとに異なるため，この概算には含めていません．見積もり時の現地調査で確認してください/);
  assert.doesNotMatch(analysisHtml, /検証済みの一般補正係数がないため現在の計算には反映しません/);
  assert.match(analysisHtml, /data-daytime-occupancy-options/);
  assert.match(analysisHtml, /平日昼間の在宅状況/);
  assert.match(analysisHtml, /診断する設備構成/);
  assert.match(analysisHtml, /name="equipment_package" value="solar_only" checked/);
  assert.match(analysisHtml, /value="solar_plus_standard_battery"/);
  assert.doesNotMatch(analysisHtml, /value="solar_plus_standard_battery" disabled/);
  assert.match(analysisHtml, /<strong>太陽光＋蓄電池<\/strong>/);
  assert.match(analysisHtml, /選択した蓄電池容量の導入費と補助金を含み，20年間交換せず使用する前提です/);
  assert.match(analysisHtml, /data-battery-capacity-control hidden/);
  assert.match(analysisHtml, /<label for="battery-capacity">蓄電池の定格容量<\/label>/);
  assert.match(analysisHtml, /id="battery-capacity"[^>]*name="batteryCapacityKwh"[^>]*type="range"[^>]*aria-describedby="battery-capacity-help battery-capacity-status"[^>]*disabled/);
  assert.doesNotMatch(analysisHtml, /id="battery-capacity"[^>]*(?:min|max|step|value)=/);
  assert.doesNotMatch(analysisHtml, /ほぼ毎日いる|週3～4日いる|週1～2日いる|ほとんどいない/);
  assert.doesNotMatch(analysisHtml, /見積容量|見積設置費|年間予想発電量/);
  assert.match(analysisHtml, /詳細条件を選ぶ/);
  assert.doesNotMatch(analysisHtml, /<select disabled>/);
  assert.doesNotMatch(analysisHtml, /data-result-condition/);
  assert.match(analysisHtml, /id="municipality"[^>]*name="municipality_code"/);
  assert.match(analysisHtml, /data-municipal-subsidy-title/);
  assert.match(analysisHtml, /data-municipal-included-list/);
  assert.match(analysisHtml, /data-municipal-scenario-unreflected-list/);
  assert.match(analysisHtml, /計算に反映しなかった制度/);
  assert.match(analysisHtml, /data-municipal-candidate-list/);
  assert.match(analysisHtml, /data-municipal-excluded-list/);

  const topScript = await readFile(resolve(siteRoot, "simulator/src/top.js"), "utf8");
  assert.doesNotMatch(topScript, /都道府県を選択して分析へ進んでください/);
  assert.match(topScript, /formMessage\.hidden = !calculateButton\.disabled/);
  assert.match(topScript, /searchParams\.set\("municipality_code"/);

  const analysisScript = await readFile(resolve(siteRoot, "simulator/src/app.js"), "utf8");
  assert.match(analysisScript, /params\.get\("municipality_code"\)/);
  assert.match(analysisScript, /battery_capacity_input\.url_parameter_name/);
  assert.match(analysisScript, /contract\.minimum/);
  assert.match(analysisScript, /contract\.maximum/);
  assert.match(analysisScript, /contract\.multiple_of/);
  assert.match(analysisScript, /contract\.default/);
  assert.match(analysisScript, /batteryCapacityKwh:/);
  assert.match(analysisScript, /elements\.batteryCapacitySlider\.disabled = !batteryApplicable/);
  assert.match(analysisScript, /target\.searchParams\.set\("municipality_code"/);
  assert.match(analysisScript, /未選択は補助金0円を意味しません/);
  assert.match(analysisScript, /required_confirmations/);
  assert.match(analysisScript, /補助金額は未確認のため，今回は含めていません/);
  assert.doesNotMatch(analysisScript, /補助金なし|算入できる補助制度なし/);
  assert.match(analysisScript, /この下振れシナリオは「補助金を利用できない場合」として0円で計算しています/);
  assert.match(analysisScript, /下振れシナリオでは，補助金を利用できない場合として計算へ反映していません/);
  assert.match(analysisScript, /item\.scenario !== "downside"/);
  assert.match(analysisScript, /受付中，対象設備一致，金額算定可能の3条件/);
  assert.match(analysisScript, /個別適格性と最新の受付状況を確認/);
  assert.match(analysisScript, /現在利用できる市区町村の補助金を確認できませんでした/);
  assert.match(analysisScript, /確認した制度は受付終了または予算終了のため，今回は含めていません/);
  assert.match(analysisScript, /確認した制度は適用条件と一致しないため，今回は含めていません/);
  assert.match(analysisScript, /選択した設備構成と対象設備が一致しないため，今回は含めていません/);
  assert.match(analysisScript, /!confirmation\.includes\("金額算定ルールを一意に確定できない"\)/);
  assert.doesNotMatch(analysisScript, /確認済み補助金あり/);
  assert.doesNotMatch(analysisScript, /standard: "電気料金上昇/);
});

test("結果は主要結論，見積もり導線，段階的開示の順である", async () => {
  const html = await readFile(resolve(siteRoot, "simulator/index.html"), "utf8");
  const app = await readFile(resolve(siteRoot, "simulator/src/app.js"), "utf8");
  const analysisCss = await readFile(resolve(siteRoot, "simulator/styles/analysis.css"), "utf8");
  const screenDesign = await readFile(resolve(siteRoot, "docs/画面設計.md"), "utf8");
  assert.equal((html.match(/class="estimate-cta affiliate-panel"/g) ?? []).length, 0);
  assert.equal((html.match(/class="result-summary__affiliate affiliate-panel"/g) ?? []).length, 1);
  assert.equal((html.match(/class="advertising-label"/g) ?? []).length, 1);
  assert.equal((html.match(/class="secondary-button affiliate-button"[^>]*type="button"[^>]*disabled/g) ?? []).length, 1);
  assert.match(html, /data-route-source="analysis-primary-affiliate"/);
  assert.doesNotMatch(html, /data-route-source="analysis-affiliate"/);
  assert.equal((html.match(/<details class="panel disclosure-panel"/g) ?? []).length, 1);
  assert.match(analysisCss, /\.analysis-intro \{[\s\S]*display: block;[\s\S]*max-width: 46rem;/);
  assert.match(analysisCss, /\.calculator--analysis \.calculator__panel \{[\s\S]*border-left: 0\.35rem solid var\(--color-primary\);[\s\S]*border-radius: 0\.75rem;/);
  assert.match(analysisCss, /\.calculator--analysis \.calculator__panel::before \{[\s\S]*content: none;/);
  assert.match(analysisCss, /\.analysis-intro__motif \{[\s\S]*width: min\(100%, 8\.5rem\)/);
  assert.match(analysisCss, /@media \(max-width: 40rem\) \{[\s\S]*\.analysis-intro__motif \{[\s\S]*display: none;/);
  assert.match(analysisCss, /\.result-summary__affiliate \{[\s\S]*border-left: 0\.35rem solid var\(--color-affiliate\);[\s\S]*border-radius: 0\.75rem;/);
  assert.match(html, /data-result-payback/);
  assert.match(html, /data-cashflow-scenario/);
  assert.match(html, /累積損益と回収時点/);
  assert.match(html, /class="advanced-panel advanced-panel--conditions"/);
  assert.match(html, /<\/form>\s*<\/div>\s*<details class="advanced-panel advanced-panel--conditions">/);
  assert.ok(html.indexOf("advanced-panel--conditions") < html.indexOf("id=\"estimate-result\""));
  assert.match(app, /aria-pressed/);
  assert.match(app, /populateDaytimeOccupancy/);
  assert.match(app, /option\.label/);
  assert.match(app, /option\.definition/);
  assert.match(app, /params\.get\("daytimeOccupancy"\)/);
  assert.match(app, /searchParams\.set\("daytimeOccupancy"/);
  assert.match(app, /daytimeOccupancy: selectedDaytimeOccupancy\(\)/);
  assert.match(app, /日中在宅：\$\{result\.input\.daytime_occupancy\.label\}/);
  assert.match(app, /paybackIntersection/);
  assert.match(app, /zeroIntersections/);
  assert.doesNotMatch(app, /cashflow-chart__payback-label/);
  assert.match(app, /selectedScenarioId/);
  assert.match(app, /cancelConditionChanges/);
  assert.match(html, /利益の内訳を見る/);
  assert.doesNotMatch(html, /計算の前提・根拠を見る/);
  assert.doesNotMatch(html, /1年目の経済効果/);
  assert.match(html, /導入時の費用/);
  assert.match(html, /太陽光パネル導入費（工事費込み）/);
  assert.match(html, /蓄電池導入費（工事費込み）/);
  assert.match(html, /実質負担/);
  assert.doesNotMatch(html, /data-result-subsidy-status/);
  assert.match(html, /確認できない容量では「未確認」と表示/);
  assert.match(app, /subsidyStatusFor/);
  assert.match(html, /点検・機器交換費 合計/);
  assert.match(html, /20年間の収入・削減効果と費用/);
  assert.match(html, /id="profit-breakdown-title">20年間の正味利益/);
  assert.match(html, /電気料金削減＋売電収入－実質初期負担－維持・交換費/);
  assert.match(html, /data-result-lifecycle-cost/);
  assert.match(html, /点検・機器交換費を含みます/);
  assert.match(html, /data-result-maintenance-cost/);
  assert.match(html, /data-result-power-conditioner-cost/);
  assert.doesNotMatch(html, /推奨の保守費用/);
  assert.match(app, /formatSignedYen/);
  assert.match(app, /!Number\.isFinite\(value\)/);
  assert.match(app, /renderBreakdownAmount\(elements\.resultGrossCost, grossInstallationCost\)/);
  assert.match(app, /renderBreakdownAmount\(elements\.resultMaintenanceCost, selectedScenario\.total_maintenance_cost_yen\)/);
  assert.match(app, /renderBreakdownAmount\(elements\.resultPowerConditionerCost, selectedScenario\.total_replacement_cost_yen\)/);
  assert.match(app, /renderCashflowAmount\(elements\.resultSelfConsumption, selectedScenario\.total_electricity_savings_yen, "income"\)/);
  assert.match(app, /renderCashflowAmount\(amount, scenario\.profit_yen\)/);
  assert.match(app, /renderInlineCashflowAmount\(elements\.cashflowEndpoint/);
  assert.doesNotMatch(html, /data-result-period/);
  assert.match(html, /20年間の収入・削減効果/);
  assert.match(html, /20年間の費用<small class="capacity-metrics__formula">実質初期負担＋維持・交換費<\/small>/);
  assert.doesNotMatch(html, /data-capacity-profit/);
  assert.doesNotMatch(html, /data-capacity-initial-cost/);
  assert.match(app, /renderCashflowAmount\(elements\.capacityRevenue, selectedScenario\.total_revenue_yen, "income"\)/);
  assert.doesNotMatch(app, /total_electricity_savings_yen\s*\+\s*selectedScenario\.total_sales_income_yen/);
  assert.match(app, /netInitialOutlay \+ lifecycleCost/);
  assert.match(app, /renderCashflowAmount\(elements\.capacityCost, totalTwentyYearCost, "cost"\)/);
  assert.match(screenDesign, /費用内訳は負の符号と赤系で示し/);
  assert.match(screenDesign, /実質負担と点検・機器交換費を別項目として表示する/);
  assert.match(screenDesign, /容量比較カードでは比較期間を20年間に統一し，backendが返す費用項目と発生年に基づく「20年間の費用」として両者を合算する/);
  assert.doesNotMatch(screenDesign, /発生時点が異なる初期費用と維持・交換費を合算表示しない/);
  assert.match(screenDesign, /選択肢の値，表示名，説明および既定値は`calculation\.daytime_occupancy`を正本/);
  assert.match(screenDesign, /未指定または不正な旧URL値では`unknown_standard`へ戻す/);
  assert.match(screenDesign, /傾斜および影の入力は追加せず/);
  assert.match(screenDesign, /代表的な1 kW当たり単価と容量スライダーの選択値から計算する/);
  assert.match(screenDesign, /見積設置費，見積容量および見積書の年間予想発電量を入力して概算を上書きする機能は設けない/);
  assert.match(app, /classList\.toggle\(`cashflow-amount--\$\{name\}`/);
  assert.match(app, /補助金確認後に確定/);
  assert.match(app, /const profitConfirmed = Number\.isFinite\(selectedScenario\.profit_yen\)/);
  assert.doesNotMatch(html, /data-loss-guidance hidden/);
  assert.doesNotMatch(app, /elements\.lossGuidance\.hidden/);
  assert.match(html, /家庭の使用量/);
  assert.match(html, /data-result-self-consumption-rate/);
  assert.match(app, /result\.energy\.self_consumption_rate \* 100/);
  assert.doesNotMatch(html, /id="equipment-breakdown-title"/);
  assert.match(html, /data-result-battery-cost>対象外/);
  assert.match(app, /太陽光＋蓄電池/);
  assert.match(app, /太陽光 \$\{solarCapacity\}/);
  assert.match(app, /蓄電池 \$\{Number\(result\.input\.battery_capacity_kwh\)\.toFixed\(1\)\} kWh/);
  assert.match(html, /自家消費率[\s\S]*発電量のうち，家庭で使った割合/);
  assert.match(html, /電力自給率[\s\S]*家庭の使用量のうち，太陽光と蓄電池で賄った割合/);
  assert.match(html, /data-result-self-sufficiency-rate/);
  assert.match(app, /result\.energy\.self_sufficiency_rate \* 100/);
  assert.doesNotMatch(html, /data-equipment-subsidy-status/);
  assert.match(html, /data-battery-yearly hidden/);
  assert.match(html, /data-battery-capacity-chart/);
  assert.match(html, /導入時[\s\S]*初年度[\s\S]*10年後[\s\S]*20年後/);
  assert.match(html, /保証下限に整合する保守的感度パス/);
  assert.match(html, /15年目末60％は，保証下限に整合する保守的感度パス/);
  assert.match(html, /16～20年は年率係数を継続した数学的外挿/);
  assert.match(html, /一次資料の実測値・保証値ではありません/);
  assert.match(html, /20年間交換しないモデル仮定であり，製品の寿命や動作を保証するものではありません/);
  assert.match(app, /保証下限に整合する保守的感度パス/);
  assert.match(app, /各年は年末容量をその年の計算に用います/);
  assert.match(app, /16～20年は年率係数を継続した数学的外挿/);
  assert.match(app, /一次資料の実測値・保証値ではありません/);
  assert.doesNotMatch(html, /年初SOC|運転開始SOC|交換時廃棄量|40％/);
  assert.doesNotMatch(html, /53\.2万円/);
  assert.match(app, /battery_usable_capacity_kwh/);
  assert.match(app, /equipmentPackage: selectedEquipmentPackage\(\)/);
  assert.match(app, /params\.get\("equipment_package"\)/);
  assert.match(app, /searchParams\.set\("equipment_package"/);
  assert.match(screenDesign, /`solar_plus_standard_battery`/);
  assert.match(screenDesign, /Schema 9\.1\.0/);
  assert.match(screenDesign, /15年末60％/);
  assert.match(screenDesign, /0\.9665183044745802/);
  assert.match(screenDesign, /20年末50\.60595991810496％/);
  assert.match(screenDesign, /各年の8760時間すべてに当該年末容量を適用/);
  assert.match(screenDesign, /保証寿命とは表現しない/);
  assert.match(screenDesign, /`total_revenue_yen`を表示の正本/);
  assert.match(html, /戸建て・4人以上世帯の地域平均（令和5年度）を使用します/);
  assert.match(app, /地域平均から推定/);
  assert.doesNotMatch(app, /戸建て・4人以上世帯の地域平均（令和5年度） 月額/);
  assert.match(app, /monthlyBill === null \|\| monthlyBill === "" \? null : Number\(monthlyBill\)/);
  assert.match(screenDesign, /手入力値またはURLの`monthlyElectricityBill`がある場合は，0円を含めて入力値を優先/);
  assert.match(screenDesign, /点検38,000円を4，8，12，16，20年目/);
  assert.match(screenDesign, /計574,000円/);
  assert.doesNotMatch(html, /最新平均/);
  assert.doesNotMatch(app, /最新平均/);
  assert.match(screenDesign, /蓄電池の運転モード，既設太陽光への後付けおよび蓄電池単体は対象外/);
  assert.match(screenDesign, /frontendで両比率を再計算しない/);
  assert.match(html, /買電量/);
  assert.doesNotMatch(html, /data-loss-guidance[^>]*hidden/);
  assert.match(html, /あなたの条件で，補助金と工事費を確かめる/);
  assert.match(html, /利用できる補助金や必要な工事は，住宅ごとに異なります．無料見積もりで，施工会社に条件を確認してもらえます．/);
  assert.match(html, /あなたの場合，20年間でいくら<span class="brand-term">トク<\/span>？/);
  assert.equal((html.match(/data-result-subsidy-source/g) ?? []).length, 1);
  assert.equal((html.match(/target="_blank" rel="noopener noreferrer" hidden/g) ?? []).length, 1);
  assert.match(app, /SUBSIDY_SOURCE_FALLBACK_ID = "env-housing-decarbonization-navi-2026"/);
  assert.match(app, /OFFICIAL_SOURCE_CLASSES = new Set\(\["primary", "official_index"\]\)/);
  assert.match(app, /bindSubsidySourceLink/);
  assert.doesNotMatch(app, /tainavi-prefectural-subsidy-ranking-2026/);
  assert.doesNotMatch(app, /zeh-lab-prefectural-subsidy-list-2026/);
  assert.equal((html.match(/class="brand-word"/g) ?? []).length, 1);
  assert.equal((html.match(/無料見積もりで確認/g) ?? []).length, 1);
  assert.doesNotMatch(html, /無料見積もりで詳しく確認/);
  assert.match(html, /広告・アフィリエイト/);
  assert.match(html, /長期利益または補助金の適用を保証するものではありません/);
  assert.ok(html.indexOf("data-result-economic-benefit") < html.indexOf("利益の内訳を見る"));
  assert.ok(html.indexOf("data-route-source=\"analysis-primary-affiliate\"") < html.indexOf("利益の内訳を見る"));
});

test("トップは診断を主導線，広告を副導線として1か所だけ持つ", async () => {
  const html = await readFile(resolve(siteRoot, "index.html"), "utf8");
  const css = await readFile(resolve(siteRoot, "shared/styles/main.css"), "utf8");
  assert.match(html, /data-route-source="top-analysis"/);
  assert.equal((html.match(/data-route-source="top-affiliate"/g) ?? []).length, 1);
  assert.equal((html.match(/広告・アフィリエイトを含みます/g) ?? []).length, 1);
  assert.match(html, /見積もりを取る前に，あなたの場合の20年間の損得を確認．/);
  assert.doesNotMatch(html, /得にならない場合も，結果をそのまま表示/);
  assert.match(html, /<span class="hero-title__chunk">太陽光，<\/span><span class="hero-title__chunk">結局いくら<span class="brand-word">トク<\/span>？<\/span>/);
  assert.ok(html.indexOf("data-route-source=\"top-analysis\"") < html.indexOf("data-route-source=\"top-affiliate\""));
  assert.match(html, /class="top-estimate-route affiliate-panel page-width"/);
  assert.match(html, /class="secondary-button affiliate-button"/);
  assert.match(html, /工事費や利用できる補助金など，概算では決まらない条件を確認できます/);
  assert.doesNotMatch(html, /無料見積もりで詳しく確認|なっトクしたら，無料見積もり/);
  assert.match(html, /<span class="affiliate-button__label">無料見積もりで確認<\/span>/);
  assert.doesNotMatch(html, /affiliate-button__brand-word/);
  assert.match(html, /登録不要<\/li><li>氏名・住所の入力なし<\/li><li>診断も見積もりも無料<\/li>/);
  assert.match(html, /<figure class="hero__motif">\s*<img src="shared\/assets\/haretoku-balance-motif\.png" width="1616" height="973" alt="太陽光パネルと工具・硬貨を載せた天秤">\s*<\/figure>/);
  assert.ok(html.indexOf('class="hero__proof"') < html.indexOf('class="hero__motif"'));
  assert.ok(html.indexOf('class="hero__motif"') < html.indexOf('class="calculator"'));
  assert.match(css, /\.hero__motif \{ width: min\(100%, 20rem\); margin: clamp\(1\.4rem, 3vw, 2rem\) auto 0; \}/);
  assert.doesNotMatch(html, /hero__motif-labels|得られる効果|かかる費用/);
  assert.match(css, /@media \(max-width: 40rem\) \{[\s\S]*\.hero__motif \{ display: none; \}/);
  assert.match(css, /\.hero > \.calculator \.calculator__panel \{ border: 1px solid rgb\(18 63 49 \/ 18%\); border-left: 0\.38rem solid var\(--color-primary\); border-radius: 0\.8rem; \}/);
  assert.match(css, /\.hero > \.calculator \.calculator__panel::before \{ content: none; \}/);
  assert.match(css, /\.primary-button \{[\s\S]*background: var\(--color-primary-dark\);/);
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
  assert.match(html, /太陽光の収支，補助金，見積もり．気になるところから，さっと確認できます/);
  assert.match(html, /太陽光の収支は，何で決まる？/);
  assert.match(html, /電気代の削減，売電収入，設置費用，維持費．20年間で何がプラス・マイナスになるかを見ていきます/);
  assert.match(html, /補助金は，どう探してどう申請する？/);
  assert.match(html, /住んでいる地域や設備条件に合う制度の探し方と，申し込み前に確認するポイントがわかります/);
  assert.match(html, /太陽光の見積もりは，何を比べる？/);
  assert.match(html, /金額だけで決めないために，設備，発電試算，工事範囲，保証の比べ方を確認します/);
  assert.match(html, /<p class="guides-more"><a href="solar\/">すべての記事を見る/);
  assert.doesNotMatch(html, /を整理します/);
  for (const imageName of ["guide-mechanics.webp", "guide-subsidy.webp", "guide-quotes.webp"]) {
    assert.match(html, new RegExp(`<img src="shared/assets/${imageName.replace(".", "\\.")}" alt="" width="720" height="540" loading="lazy" decoding="async">`));
  }
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


test("診断の地域必須検証は欠落・不正・県不一致を拒否し，有効な自治体状態を保持する", () => {
  const publicData = { prefectures: [{ code: "08" }, { code: "14" }, { code: "01" }], municipalities: [
    { municipality_code: "08230", prefecture_code: "08", program_status: "no_program" },
    { municipality_code: "08364", prefecture_code: "08", program_status: "unconfirmed" },
    { municipality_code: "14218", prefecture_code: "14", program_status: "included" }
  ] };
  for (const input of [
    {}, { prefectureCode: "14" }, { prefectureCode: "01" },
    { prefectureCode: "14", municipalityCode: "invalid" },
    { prefectureCode: "14", municipalityCode: "99999" },
    { prefectureCode: "08", municipalityCode: "14218" }
  ]) assert.throws(() => requireMunicipality(input, publicData), /選択|確認/);
  for (const municipality of publicData.municipalities) {
    const restored = requireMunicipality({ prefectureCode: municipality.prefecture_code, municipalityCode: municipality.municipality_code }, publicData);
    assert.strictEqual(restored, municipality);
    assert.equal(restored.program_status, municipality.program_status);
  }
});

test("シナリオの補助金注記は反映・未確認併存・対象なしと下振れを区別する", () => {
  const scenario = { scenario: "standard", subsidy_yen: 300000, subsidy_status: "applied", subsidy_breakdown: { municipality_program_status: "unconfirmed" } };
  assert.match(scenarioSubsidyCondition(scenario), /反映.*支給保証なし.*未確認/);
  assert.match(scenarioSubsidyCondition({ ...scenario, scenario: "downside" }), /含めません/);
  assert.match(scenarioSubsidyCondition({ ...scenario, subsidy_yen: null }), /確認後に収支が確定/);
  assert.match(scenarioSubsidyCondition({ ...scenario, subsidy_yen: 0 }), /未確認.*制度なしとは異なります/);
  assert.match(scenarioSubsidyCondition({ scenario: "upside", subsidy_yen: 0, subsidy_status: "not_applicable" }), /対象補助金なし/);
  assert.match(scenarioSubsidyCondition({ ...scenario, subsidy_breakdown: { municipality_program_status: "no_program", candidate_programs: [{ id: "unverified" }] } }), /未確認の候補/);
});
