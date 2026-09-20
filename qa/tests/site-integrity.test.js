import { quoteBarVisible, mobileKeyboardLikely, QUOTE_ACTION } from "../../site/shared/fixed-quote-bar.js";
import { cashflowMarkers, groupMarkerTargets } from "../../site/simulator/src/chart-markers.js";
import { subsidyGroups, nonInclusionReason, replacementEvents } from "../../site/simulator/src/subsidy-presentation.js";
import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";
import { validateLocation } from "../../site/simulator/src/location-input.js";
import { calculateEstimate } from "../../site/simulator/src/calculator.js";
import { applicationStatusLabel, applicationStatusLabels, componentStatusLabels, municipalInformationSummary, programConditionsText } from "../../site/simulator/src/municipal-information.js";
import { degradationLabel, degradationDescription, outageReferencePresentation, formatBatteryCapacity } from "../../site/simulator/src/battery-presentation.js";
import { cashflowChartLayout, formatEnergyRate, subsidyReasonPresentation, energyRoutes, financialTotals, endpointResult, conclusionBreakdown, compactYen, decisionAmountParts, hasUnconfirmedSubsidy, scenarioSubsidyCondition, resultConditionHeadline, mainSubsidyPresentation, subsidyBreakdownReason, scenarioRecoveryPresentation, energyBreakdownPresentation } from "../../site/simulator/src/result-presentation.js";


const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
test('公開受付ラベルは3区分で，混在制度は採用枝を参照し内部値を変更しない', () => {
  for(const status of ['accepting','waitlist']) assert.equal(applicationStatusLabel({application_status:status}),'受付中');
  for(const status of ['closed','suspended','scheduled','not_open','not_applicable']) assert.equal(applicationStatusLabel({application_status:status}),'受付対象外');
  for(const status of ['unknown','unconfirmed','accepting_with_waitlist_branch']) assert.equal(applicationStatusLabel({application_status:status}),'不明');
  const record={application_status:'accepting_with_waitlist_branch',selected_branch:'a',branches:[{id:'a',application_status:'waitlist'},{id:'b',application_status:'closed'}]};
  const before=structuredClone(record);
  assert.equal(applicationStatusLabel(record),'受付中');
  assert.deepEqual(record,before);
  assert.equal(applicationStatusLabel({...record,selected_branch:'b'}),'受付対象外');
  assert.equal(applicationStatusLabel({...record,selected_branch:'missing'}),'不明');
});
test('公開データと計算結果の全受付状態に表示ラベルがあり，採用枠の状態を表示する', async () => {
  const data = JSON.parse(await readFile(resolve(repositoryRoot,'data/input/public-data.json'),'utf8'));
  const fixtures = JSON.parse(await readFile(resolve(repositoryRoot,'qa/fixtures/calculation-cases.json'),'utf8'));
  const inspect = value => {
    if (!value || typeof value !== 'object') return;
    if (Object.hasOwn(value,'application_status')) assert.ok(Object.hasOwn(applicationStatusLabels,value.application_status), `未対応の受付状態：${value.application_status}`);
    Object.values(value).forEach(inspect);
  };
  inspect(data); inspect(fixtures);
  assert.notEqual(applicationStatusLabels.accepting_with_waitlist_branch,applicationStatusLabels.accepting);
  assert.equal(applicationStatusLabels.waitlist,applicationStatusLabels.accepting);
  const result=calculateEstimate({prefectureCode:'13',municipalityCode:'13201',housingAge:'existing',equipmentPackage:'solar_only',monthlyElectricityBillYen:null},data);
  const record=result.scenarios.find(item=>item.scenario==='standard').subsidy_breakdown.included_programs.find(item=>item.selected_branch);
  assert.ok(record);
  assert.equal(record.application_status,record.branches.find(branch=>branch.id===record.selected_branch).application_status);
  assert.equal(record.application_status,'waitlist');
  assert.equal(record.selected_branch,'general_waitlist');
  assert.ok(record.branches.every(branch=>branch.id!=='special_permitted_solar_carport'));
});
test('診断範囲外の工事枝は除外し，既存の一般枠は補欠として両設備で保持する', async () => {
  const data=JSON.parse(await readFile(resolve(repositoryRoot,'data/input/public-data.json'),'utf8'));
  for(const housingAge of ['existing','new']) for(const equipmentPackage of ['solar_only','solar_plus_standard_battery']) {
    const result=calculateEstimate({prefectureCode:'13',municipalityCode:'13201',housingAge,equipmentPackage,systemCapacityKw:4,monthlyElectricityBillYen:null},data);
    const breakdown=result.scenarios.find(item=>item.scenario==='standard').subsidy_breakdown;
    const municipality=breakdown.included_programs.find(item=>item.id==='hachioji-renewable-energy-2026');
    if(housingAge==='existing') {
      assert.equal(municipality.application_status,'waitlist');
      assert.equal(municipality.amount_yen,equipmentPackage==='solar_only'?40000:70000);
      assert.equal(municipality.selected_branch,'general_waitlist');
    } else {
      assert.equal(municipality,undefined);
      assert.equal(breakdown.excluded_programs.find(item=>item.id==='hachioji-renewable-energy-2026').reason_code,'required_external_structure_or_housing_work');
    }
    assert.ok(breakdown.included_programs.every(item=>data.diagnostic_subsidy_programs.find(program=>program.id===item.id)?.diagnostic_scope.status!=='excluded_required_external_work'));
    assert.ok(breakdown.included_programs.some(item=>item.id==='tokyo-residential-solar-2026-audit'));
  }
  assert.match(nonInclusionReason({reason_code:'required_external_structure_or_housing_work',application_status:'unknown'}),/この診断の対象外/);
  assert.match(nonInclusionReason({reason_code:'expense_scope_limit_in_maximum_combination',application_status:'waitlist'}),/対象費用の上限/);
});
test("制度情報は受付状態・非算入理由と確認済み金額を区別する", () => {
  assert.equal(new Set(Object.values(applicationStatusLabels)).size, 3);
  assert.equal(new Set(Object.values(componentStatusLabels)).size, 6);
  assert.match(municipalInformationSummary({ application_status: "suspended", amount_status: "partially_confirmed" }), /受付対象外.*一部の金額/);
  assert.match(municipalInformationSummary({ application_status: "not_applicable", amount_status: "not_applicable" }), /受付対象外/);
  assert.match(componentStatusLabels.included, /条件が合えば/);
  const base = { scenario: "standard", subsidy_yen: 0, subsidy_breakdown: { municipality_program_status: "candidate" } };
  assert.doesNotMatch(programConditionsText("FIT・2kW以上．現行計算へ組み込まれた相手制度がないため合算しない．"), /組み込まれた/);
});
test("劣化比較の説明は選択した仮定を使い，停電線はDC容量の精度を保つ", () => {
  assert.equal(formatBatteryCapacity(8.075), "8.08");
  for (const [id, retention] of [["conditional_70", 0.7], ["optimistic_85", 0.85]]) {
    const scenario = { id, scenario_id: id, capacity_retention_at_year_20: retention };
    assert.match(degradationLabel(scenario), /条件付き比較/);
    assert.match(degradationDescription(scenario), new RegExp(`20年後${retention * 100}％`));
    assert.doesNotMatch(degradationDescription(scenario), /15年目末60％/);
    assert.match(degradationDescription(scenario), /平均や保証値ではありません/);
  }
  assert.match(degradationLabel({ id: "conservative", capacity_retention_at_year_20: 0.5060595991810496 }), /約50.6％/);
  const reference = { required_dc_capacity_reference_kwh: 1.7122657777822357, household_appliance_ac_load_kwh: 0.9043979452054796, auxiliary_ac_load_kwh: 0.72, discharge_efficiency: Math.sqrt(0.9) };
  const presentation = outageReferencePresentation(reference);
  assert.equal(presentation.capacity, reference.required_dc_capacity_reference_kwh);
  assert.equal(presentation.label, "約1.7 kWh");
  assert.match(presentation.energy, /家電.*0.90 kWh.*自身.*0.72 kWh.*94.9％/);
  assert.equal(outageReferencePresentation(undefined), null);
  assert.equal(outageReferencePresentation({ ...reference, required_dc_capacity_reference_kwh: NaN }), null);
});
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

test("主結果は1万円未満を千円単位の概算とし，0円と1万円境界を区別する", () => {
  assert.deepEqual(decisionAmountParts(1_086), { amount: "約1,000円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-1_086), { amount: "約1,000円", outcome: "損" });
  assert.deepEqual(decisionAmountParts(9_999), { amount: "約10,000円", outcome: "トク" });
  assert.deepEqual(decisionAmountParts(-9_999), { amount: "約10,000円", outcome: "損" });
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
    const guideLinks = [...siteNav.matchAll(/<a\b([^>]*)>([\s\S]*?)<\/a>/g)].filter(([,attrs]) => attrs.includes('href="' + href + '"'));
    assert.equal(guideLinks.length, 1, 'ガイド導線を重複させない');
    const [,attrs,body] = guideLinks[0];
    assert.equal(attrs.includes('aria-current="page"'), guideCurrentPaths.has(pagePath));
    assert.ok(body.replace(/<[^>]*>/g,'').includes('はれトクガイド'));

  }
});

test("はれトクガイド一覧がメタデータから一般記事5件を4分類の主一覧に重複なく掲載する", async () => {
  const html = await readFile(resolve(siteRoot, "solar/index.html"), "utf8");
  const articles = JSON.parse(await readFile(resolve(siteRoot, "solar/data/articles.json"), "utf8"));
  const script = await readFile(resolve(siteRoot, "solar/src/guides.js"), "utf8");
  const css = await readFile(resolve(siteRoot, "solar/styles/guides.css"), "utf8");
  const main = html.match(/<main>[\s\S]*?<\/main>/)?.[0];
  assert.ok(main);
  assert.match(html, /<title>はれトクガイド｜住宅用太陽光の記事一覧<\/title>/);
  assert.match(html, /meta name="description" content="[^"]+"/);
  assert.match(html, /src="src\/guides\.js"/);
  assert.doesNotMatch(main, /data-featured-guides/);
  assert.doesNotMatch(main, /data-safety-guides/);
  assert.match(main, /<h2 id="guide-library-title">記事一覧<\/h2>/);
  assert.equal(articles.length, 5);
  assert.equal(articles.filter((article) => Number.isInteger(article.featuredOrder)).length, 3);
  for (const [title, target, articleTitle = title] of [
    ["太陽光の収支は，何で決まる？", "../pages/electricity-sales.html"],
    ["太陽光の設置・維持に，何がかかる？", "../pages/costs-maintenance.html", "表示額以外に，何がかかる？"],
    ["補助金は，どう探してどう申請する？", "../pages/subsidies.html"],
    ["太陽光の見積もりは，何を比べる？", "../pages/quotes-contractors.html"],
    ["停電時，太陽光だけで何ができる？", "../pages/disaster.html"]
  ]) {
    const article = articles.find((candidate) => candidate.title === title);
    assert.equal(article?.href, target, `ガイド記事がありません：${title}`);
    const targetPath = await localTarget(resolve(siteRoot, "solar/index.html"), target);
    await assert.doesNotReject(access(targetPath));
    const targetHtml = await readFile(targetPath, "utf8");
    assert.ok(targetHtml.includes(`<h1>${articleTitle}</h1>`), `記事タイトルが一致しません：${title}`);
    await assert.doesNotReject(access(await localTarget(resolve(siteRoot, "solar/index.html"), article.image.src)));
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
  assert.match(main, /href="\.\.\/simulator\/"><span class="guide-diagnosis__label">はれ<span class="brand-term">トク<\/span>診断へ<\/span>/);
  assert.match(script, /const categoryOrder = \["economics", "subsidies", "quotes", "safety"\]/);
  assert.match(script, /button\.setAttribute\("aria-pressed"/);
  assert.match(script, /link\.className = "guide-article-card"/);
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
  assert.match(analysisHtml, /data-change-conditions[^>]*>変更/);
  assert.match(analysisHtml, /<h2 id="calculator-title">あなたの条件で診断する<\/h2>/);
  assert.doesNotMatch(analysisHtml, /太陽光の30年間採算を診断/);
  assert.doesNotMatch(analysisHtml, /地域データによる概算です．結果を先に示し/);
  assert.match(analysisHtml, /data-detail-condition-summary>選択中の条件/);
  assert.match(analysisHtml, /id="roof-orientation"/);
  assert.doesNotMatch(analysisHtml, /南東・南西は96％，東西・不明は85％/);
  assert.doesNotMatch(analysisHtml, /設置条件は，現地調査で確認してください|ご自身が所有・居住|data-scenario-premise/);
  assert.doesNotMatch(analysisHtml, /屋根の傾斜・影は反映していません/);
  assert.doesNotMatch(analysisHtml, /検証済みの一般補正係数がないため現在の計算には反映しません/);
  assert.match(analysisHtml, /data-daytime-occupancy-options/);
  assert.match(analysisHtml, /平日昼間の在宅状況/);
  assert.match(analysisHtml, /<select id="equipment-package" name="equipment_package"/);
  assert.match(analysisHtml, /<option value="solar_only">太陽光のみ/);
  assert.match(analysisHtml, /value="solar_plus_standard_battery"/);
  assert.doesNotMatch(analysisHtml, /value="solar_plus_standard_battery" disabled/);
  assert.match(analysisHtml, /<option value="solar_plus_standard_battery">太陽光＋蓄電池/);
  assert.match(analysisHtml, /蓄電池は容量劣化を反映し，30年間交換しない仮定です/);
  assert.match(analysisHtml, /data-battery-capacity-control hidden/);
  assert.match(analysisHtml, /<label for="battery-capacity">蓄電池の定格容量<\/label>/);
  assert.match(analysisHtml, /id="battery-capacity"[^>]*name="batteryCapacityKwh"[^>]*type="range"[^>]*aria-describedby="battery-capacity-help battery-capacity-status"[^>]*disabled/);
  assert.doesNotMatch(analysisHtml, /id="battery-capacity"[^>]*(?:min|max|step|value)=/);
  assert.doesNotMatch(analysisHtml, /ほぼ毎日いる|週3～4日いる|週1～2日いる|ほとんどいない/);
  assert.doesNotMatch(analysisHtml, /見積容量|見積設置費|年間予想発電量/);
  assert.match(analysisHtml, /condition-toggle-title">住宅・生活条件/);
  assert.doesNotMatch(analysisHtml, /<select disabled>/);
  assert.doesNotMatch(analysisHtml, /data-result-condition/);
  assert.match(analysisHtml, /id="municipality"[^>]*name="municipality_code"/);
  assert.match(analysisHtml, /data-municipal-subsidy-title/);
  assert.match(analysisHtml, /data-municipal-included-list/);
  assert.match(analysisHtml, /data-municipal-excluded-list/);

  const topScript = await readFile(resolve(siteRoot, "simulator/src/top.js"), "utf8");
  assert.doesNotMatch(topScript, /都道府県を選択して分析へ進んでください/);
  assert.match(topScript, /formMessage\.hidden = !formMessage\.textContent/);
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
  assert.match(analysisHtml, /利用を想定する制度/);
  assert.match(analysisHtml, /今回選ばなかった制度/);
  assert.doesNotMatch(analysisHtml, /他の設備の制度・理由|data-other-equipment/);
  assert.match(analysisScript, /subsidyGroups/);
  assert.doesNotMatch(analysisScript, /制度の条件・注意事項|案内単価・上限/);
  assert.match(analysisScript, /受付状態：/);
  assert.doesNotMatch(analysisScript, /確認済み補助金あり/);
  assert.doesNotMatch(analysisScript, /standard: "電気料金上昇/);
});

test("診断は条件と結果の分析領域，見積もり，制度・停電の情報領域の順で見積もりは固定バーへ集約する", async () => {
  const html = await readFile(resolve(siteRoot, "simulator/index.html"), "utf8");
  const app = await readFile(resolve(siteRoot, "simulator/src/app.js"), "utf8");
  const analysisCss = await readFile(resolve(siteRoot, "simulator/styles/analysis.css"), "utf8");
  const screenDesign = await readFile(resolve(siteRoot, "docs/画面設計.md"), "utf8");
  assert.equal((html.match(/class="estimate-cta affiliate-panel"/g) ?? []).length, 0);
  assert.equal((html.match(/class="diagnostic-quote-context quote-context"/g) ?? []).length, 0);
  assert.equal((html.match(/class="advertising-label"/g) ?? []).length, 0);
  assert.doesNotMatch(html, /affiliate-button/);
  assert.match(html, /shared\/styles\/fixed-quote-bar.css/);
  const order = ["analysis-workbench", "panel cashflow-panel", "result-disclosures", "municipal-subsidy", "analysis-information", "loss-guidance"].map(token => html.indexOf(`class="${token}`));
  assert.ok(order.every((position, index) => position >= 0 && (index === 0 || position > order[index - 1])));
  assert.doesNotMatch(html, /data-route-source="analysis-affiliate"/);
  assert.equal((html.match(/<details[^>]*class="breakdown-disclosure"/g) ?? []).length, 2);
  assert.match(analysisCss, /\.calculator--analysis \.calculator__panel::before \{[\s\S]*content: none;/);
  assert.match(analysisCss, /\.result-summary__affiliate \{[\s\S]*border-left: 0\.35rem solid var\(--color-affiliate\);[\s\S]*border-radius: 0\.75rem;/);
  assert.doesNotMatch(html, /data-result-payback/);
  assert.doesNotMatch(html, /data-result-payback/);
  assert.doesNotMatch(html, /data-scenario-list|data-cashflow-endpoint|analysis-totals|panel result-summary/);
  assert.doesNotMatch(app, /cashflow-chart__replacement-label/);
  assert.match(html, /class="breakdown-total result-profit-summary"/);
  assert.match(html, /class="advanced-panel advanced-panel--conditions condition-card"/);
  assert.ok(html.indexOf("advanced-panel--conditions") < html.indexOf("id=\"estimate-result\""));
  assert.match(html, /<select id="scenario-select" name="scenario"/);
  assert.doesNotMatch(app, /elements.scenarioList.addEventListener/);
  assert.match(app, /populateDaytimeOccupancy/);
  assert.match(app, /option\.label/);
  assert.match(app, /option\.definition/);
  assert.match(app, /params\.get\("daytimeOccupancy"\)/);
  assert.match(app, /searchParams\.set\("daytimeOccupancy"/);
  assert.match(app, /daytimeOccupancy: selectedDaytimeOccupancy\(\)/);
  assert.match(app, /日中の在宅状況：/);
  assert.match(app, /unknown_standard.*標準設定/);
  assert.match(app, /paybackIntersection/);
  assert.match(app, /zeroIntersections/);
  assert.doesNotMatch(app, /cashflow-chart__payback-label/);
  assert.match(app, /selectedScenarioId/);
  assert.match(app, /cancelConditionChanges/);
  assert.match(html, /収支の内訳/);
  assert.doesNotMatch(html, /計算の前提・根拠を見る/);
  assert.doesNotMatch(html, /1年目の経済効果/);
  assert.doesNotMatch(html, /initial-breakdown-title|導入時の費用・30年間の集計/);
  assert.match(html, /太陽光パネル導入費<small class="breakdown-item-note">工事費込み/);
  assert.match(html, /蓄電池導入費<small class="breakdown-item-note">工事費込み/);
  assert.doesNotMatch(html, /data-result-gross-cost|data-result-initial-cost|data-result-lifecycle-cost|data-result-lifecycle-status/);
  assert.doesNotMatch(html, /data-result-subsidy-status/);
  assert.match(html, /補助金（今回算入）/);
  assert.match(app, /subsidyStatusFor/);
  assert.doesNotMatch(html, /点検・機器交換費 合計|集計は上の内訳をまとめたもの/);
  assert.match(html, /30年間の収入・削減効果と費用/);
  assert.doesNotMatch(html, /data-profit-equation|data-breakdown-payback/);
  assert.match(app, /renderCashflowAmount\(elements\.resultProfit, selectedScenario\.profit_yen\)/);

  assert.match(html, /data-result-maintenance-cost/);
  assert.match(html, /data-result-power-conditioner-cost/);
  assert.doesNotMatch(html, /推奨の保守費用/);
  assert.match(app, /formatSignedYen/);
  assert.match(app, /!Number\.isFinite\(value\)/);
  assert.doesNotMatch(app, /elements\.resultGrossCost|elements\.resultInitialCost|elements\.resultLifecycleCost|elements\.resultLifecycleStatus/);
  assert.match(app, /renderBreakdownAmount\(elements\.resultMaintenanceCost, selectedScenario\.total_maintenance_cost_yen\)/);
  assert.match(app, /renderBreakdownAmount\(elements\.resultPowerConditionerCost, selectedScenario\.total_replacement_cost_yen\)/);
  assert.match(app, /renderCashflowAmount\(elements\.resultSelfConsumption, selectedScenario\.total_electricity_savings_yen, "income"\)/);
  assert.doesNotMatch(html, /data-result-period/);
  assert.match(html, /30年間の収入・削減効果/);
  assert.doesNotMatch(html, /data-capacity-profit/);
  assert.doesNotMatch(html, /data-capacity-initial-cost/);
  assert.doesNotMatch(app, /total_electricity_savings_yen\s*\+\s*selectedScenario\.total_sales_income_yen/);
  assert.match(screenDesign, /費用内訳は負の符号と赤系で示し/);
  assert.match(screenDesign, /30年間の正味利益だけを2列全幅の集計行に置く/);
  assert.doesNotMatch(screenDesign, /発生時点が異なる初期費用と維持・交換費を合算表示しない/);
  assert.match(screenDesign, /選択肢の値，表示名，説明および既定値は`calculation\.daytime_occupancy`を正本/);
  assert.match(screenDesign, /未指定または不正な旧URL値では`unknown_standard`へ戻す/);
  assert.match(screenDesign, /傾斜および影の入力は追加せず/);
  assert.match(screenDesign, /代表的な1 kW当たり単価と容量スライダーの選択値から計算する/);
  assert.match(screenDesign, /見積設置費，見積容量および見積書の年間予想発電量を入力して概算を上書きする機能は設けない/);
  assert.match(app, /classList\.toggle\(`cashflow-amount--\$\{name\}`/);

  assert.match(app, /const profitConfirmed = Number\.isFinite\(selectedScenario\.profit_yen\)/);
  assert.doesNotMatch(html, /data-loss-guidance hidden/);
  assert.doesNotMatch(app, /elements\.lossGuidance\.hidden/);
  assert.match(html, /家庭の使用量/);
  assert.match(html, /data-result-self-consumption-rate/);
  assert.match(app, /formatEnergyRate\(result\.energy\.self_consumption_rate\)/);
  assert.doesNotMatch(html, /id="equipment-breakdown-title"/);
  assert.match(html, /data-result-battery-cost>対象外/);
  assert.match(app, /太陽光＋蓄電池/);
  assert.match(app, /太陽光 \$\{solarCapacity\}/);
  assert.match(app, /蓄電池 \$\{Number\(result\.input\.battery_capacity_kwh\)\.toFixed\(1\)\} kWh/);
  assert.match(html, /自家消費率[\s\S]*発電量のうち，家庭で使った割合/);
  assert.match(html, /電力自給率[\s\S]*家庭の使用量のうち，太陽光と蓄電池で賄った割合/);
  assert.match(html, /data-result-self-sufficiency-rate/);
  assert.match(app, /formatEnergyRate\(result\.energy\.self_sufficiency_rate\)/);
  assert.doesNotMatch(html, /data-equipment-subsidy-status/);
  assert.match(html, /data-battery-yearly hidden/);
  assert.match(html, /data-battery-capacity-chart/);
  assert.match(html, /導入時[\s\S]*初年度[\s\S]*10年後[\s\S]*20年後/);
  assert.match(html, /保証下限に整合する保守的感度パス/);
  assert.match(html, /15年目末60％は，保証下限に整合する保守的感度パス/);
  assert.match(html, /16～30年は年率係数を継続した数学的外挿/);
  assert.match(html, /一次資料の実測値・保証値ではありません/);
  assert.match(html, /30年間交換しないモデル仮定であり，製品の寿命や動作を保証するものではありません/);
  assert.match(app, /保証下限に整合する保守的感度パス/);
  assert.match(app, /各年は年末容量をその年の計算に用います/);
  assert.match(app, /16～30年は年率係数を継続した数学的外挿/);
  assert.match(app, /一次資料の実測値・保証値ではありません/);
  assert.doesNotMatch(html, /年初SOC|運転開始SOC|交換時廃棄量|40％/);
  assert.doesNotMatch(html, /53\.2万円/);
  assert.match(app, /battery_usable_capacity_kwh/);
  assert.match(app, /equipmentPackage: selectedEquipmentPackage\(\)/);
  assert.match(app, /params\.get\("equipment_package"\)/);
  assert.match(app, /searchParams\.set\("equipment_package"/);
  assert.match(screenDesign, /`solar_plus_standard_battery`/);
  assert.match(screenDesign, /現行公開契約/);
  assert.match(screenDesign, /15年末60％/);
  assert.match(screenDesign, /0\.9665183044745802/);
  assert.match(screenDesign, /20年末50\.60595991810496％/);
  assert.match(screenDesign, /各年の8760時間すべてに当該年末容量を適用/);
  assert.match(screenDesign, /保証寿命とは表現しない/);
  assert.match(html, /戸建て・4人以上世帯の地域平均（令和5年度）を使用します/);
  assert.match(app, /note\.textContent = "地域平均"/);
  assert.doesNotMatch(app, /地域平均から推定/);
  assert.doesNotMatch(app, /戸建て・4人以上世帯の地域平均（令和5年度） 月額/);
  assert.match(app, /monthlyBill === null \|\| monthlyBill === "" \? null : Number\(monthlyBill\)/);
  assert.match(screenDesign, /手入力値またはURLの`monthlyElectricityBill`がある場合は，0円を含めて入力値を優先/);
  assert.match(screenDesign, /点検38,000円を5，10，15，20，25，30年目/);
  assert.match(screenDesign, /計612,000円/);
  assert.doesNotMatch(html, /最新平均/);
  assert.doesNotMatch(app, /最新平均/);
  assert.match(screenDesign, /蓄電池の運転モード，既設太陽光への後付けおよび蓄電池単体は対象外/);
  assert.match(screenDesign, /frontendで両比率を再計算しない/);
  assert.match(html, /買電量/);
  assert.doesNotMatch(html, /data-loss-guidance[^>]*hidden/);
  assert.doesNotMatch(html, /ご自宅の設備と工事費を確かめる/);
  assert.doesNotMatch(html, /屋根に合う設備と工事費を見積もりで確認し，診断結果と比べましょう．/);
  assert.doesNotMatch(html, /data-result-subsidy-source/);
  assert.match(html, /calculation-method.html#subsidy-assumptions/);
  assert.doesNotMatch(app, /tainavi-prefectural-subsidy-ranking-2026/);
  assert.doesNotMatch(app, /zeh-lab-prefectural-subsidy-list-2026/);
  assert.equal((html.match(/class="brand-word"/g) ?? []).length, 1);
  assert.equal((html.match(/無料見積もりを依頼する/g) ?? []).length, 0);
  assert.doesNotMatch(html, /無料見積もりで詳しく確認/);
  assert.match(html, /広告・アフィリエイト/);
  assert.equal(html.split('この診断は，一定の条件を想定した簡易的な概算です．補助制度の変更や，実際の住宅・設備の条件によって，補助額や収支は異なります．').length - 1, 1);
  assert.doesNotMatch(app, /明示された併用禁止を除き，未確認の併用は計算上可能と仮定しています/);
  assert.match(html, /確認中の制度情報/);
  assert.ok(html.indexOf("data-result-economic-benefit") < html.indexOf("収支の内訳"));
  assert.doesNotMatch(html, /diagnostic-quote-context/);
});

test("トップは診断を主導線，広告を副導線として1か所だけ持つ", async () => {
  const html = (await readFile(resolve(siteRoot, "index.html"), "utf8")).replace(/<span class="text-chunk">([^<]+)<\/span>/g, "$1");
  const css = await readFile(resolve(siteRoot, "shared/styles/main.css"), "utf8");
  assert.match(html, /data-route-source="top-analysis"/);
  assert.equal((html.match(/data-route-source="top-affiliate"/g) ?? []).length, 1);
  assert.equal((html.match(/広告・アフィリエイトを含みます/g) ?? []).length, 1);
  assert.match(html, /地域と電気代から，太陽光の導入費と30年間の収支をかんたんに概算できます．/);
  assert.doesNotMatch(html, /得にならない場合も，結果をそのまま表示/);
  assert.match(html, /<span class="hero-title__chunk">太陽光，<\/span><span class="hero-title__chunk">結局いくら<span class="brand-word">トク<\/span>？<\/span>/);
  assert.ok(html.indexOf("data-route-source=\"top-analysis\"") < html.indexOf("data-route-source=\"top-affiliate\""));
  assert.doesNotMatch(html, /top-estimate-route|hero-steps/);
  assert.match(html, /class="hero-journey__link hero-journey__link--unavailable"[^>]*disabled/);
  assert.match(html, /屋根や工事条件に合わせて，設置する設備と導入費用を確定させます．/);
  assert.doesNotMatch(html, /無料見積もりで詳しく確認|なっトクしたら，無料見積もり/);
  assert.match(html, /disabled>無料見積もり（準備中）<\/button>/);
  assert.doesNotMatch(html, /affiliate-button__brand-word/);
  assert.match(html, /登録不要<\/li><li>氏名・番地の入力なし<\/li><li>無料で概算<\/li>/);
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
  const journey = html.match(/<ol class="hero-journey"[\s\S]*?<\/ol>/)[0];
  assert.equal((journey.match(/<span class="hero-journey__number"/g) ?? []).length, 2);
  assert.match(journey, /診断でわかること/);
  assert.doesNotMatch(journey, /data-return-to-form/);
  assert.doesNotMatch(journey, /↑|→|primary-button|affiliate-button/);
  assert.doesNotMatch(html, /蓄電池を付ける場合も比較できます/);
  assert.doesNotMatch(journey, /見積もりは希望する方だけ/);
  assert.match(html, /id="calculator-title">はれ<span class="brand-word">トク<\/span>診断/);
  assert.match(html, /pages\/calculation-method\.html">計算方法・使用データ<\/a>/);
  assert.match(html, /pages\/policy\.html">はれ<span class="brand-term">トク<\/span>の方針<\/a>/);
  assert.doesNotMatch(html, /class="trust-section/);
  assert.doesNotMatch(html, /class="value-section/);
  assert.equal((html.match(/class="guide-card(?: guide-card--featured)?"/g) ?? []).length, 4);
  assert.match(html, /はれ<span class="brand-term">トク<\/span>ガイド/);
  assert.match(html, /知って，なっ<span class="brand-word">トク<\/span>．/);
  assert.match(html, /収支・補助金・見積もり・災害への備え．設置前の疑問を解消しましょう．/);
  assert.match(html, /太陽光の収支は，何で決まる？/);
  assert.match(html, /収入と費用のしくみを知り，自宅の収支を概算する前の疑問を解消/);
  assert.match(html, /補助金は，どう探してどう申請する？/);
  assert.match(html, /制度の探し方と申請の流れ，施工会社へ相談できる支援を確認/);
  assert.match(html, /太陽光の見積もりは，何を比べる？/);
  assert.match(html, /見積もりの頼み方と，費用・工事・保証を同じ条件で比べるポイントを確認/);
  assert.match(html, /<p class="guides-more"><a href="solar\/">すべての記事を見る/);
  assert.doesNotMatch(html, /を整理します/);
  for (const imageName of ["guide-mechanics.webp", "guide-subsidy.webp", "guide-quotes.webp"]) {
    assert.match(html, new RegExp(`<img src="shared/assets/${imageName.replace(".", "\\.")}" alt="" width="720" height="540" loading="lazy" decoding="async">`));
  }
  for (const category of ["収支｜全国", "補助金｜全国｜2026年度", "見積もり｜全国", "災害への備え｜全国"]) {
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


test("診断は県のみを許可し，不正地域・県不一致を拒否して自治体状態を保持する", () => {
  const publicData = { prefectures: [{ code: "08" }, { code: "14" }, { code: "01" }], municipalities: [
    { municipality_code: "08230", prefecture_code: "08", program_status: "no_program" },
    { municipality_code: "08364", prefecture_code: "08", program_status: "unconfirmed" },
    { municipality_code: "14218", prefecture_code: "14", program_status: "included" }
  ] };
  for (const input of [
    {}, { prefectureCode: "invalid" },
    { prefectureCode: "14", municipalityCode: "invalid" },
    { prefectureCode: "14", municipalityCode: "99999" },
    { prefectureCode: "08", municipalityCode: "14218" }
  ]) assert.throws(() => validateLocation(input, publicData), /選択|確認/);
  for (const prefecture of publicData.prefectures) assert.equal(validateLocation({prefectureCode:prefecture.code},publicData),null);
  for (const municipality of publicData.municipalities) {
    const restored = validateLocation({ prefectureCode: municipality.prefecture_code, municipalityCode: municipality.municipality_code }, publicData);
    assert.strictEqual(restored, municipality);
    assert.equal(restored.program_status, municipality.program_status);
  }
});

test("左シナリオは確認済み条件に基づく利用前提と下振れを区別する", () => {
  const scenario = { scenario: "standard", subsidy_yen: 300000, subsidy_status: "applied", subsidy_breakdown: { municipality_program_status: "unconfirmed" } };
  assert.match(scenarioSubsidyCondition(scenario), /確認できた適用条件・額で利用する想定/);
  assert.match(scenarioSubsidyCondition({ ...scenario, scenario: "downside" }), /含めない想定/);
  assert.match(scenarioSubsidyCondition({ ...scenario, subsidy_yen: null }), /確認できた適用条件・額で利用する想定/);
  assert.match(scenarioSubsidyCondition({ ...scenario, subsidy_yen: 0 }), /確認できた適用条件・額で利用する想定/);
  assert.match(scenarioSubsidyCondition({ scenario: "upside", subsidy_yen: 0, subsidy_status: "not_applicable" }), /確認できた適用条件・額で利用する想定/);
  assert.match(scenarioSubsidyCondition({ ...scenario, subsidy_breakdown: { municipality_program_status: "no_program", candidate_programs: [{ id: "unverified" }] } }), /確認できた適用条件・額で利用する想定/);
});

test("小田原市は候補制度の明細が空でも未確認として表示する", async () => {
  const publicData = JSON.parse(await readFile(resolve(repositoryRoot, "data/input/public-data.json"), "utf8"));
  const result = calculateEstimate({ prefectureCode: "14", municipalityCode: "14206", monthlyElectricityBillYen: null }, publicData);
  assert.equal(result.input.municipality_program_status, "candidate");
  for (const scenario of result.scenarios) {
    assert.equal(scenario.subsidy_yen, 0);
    assert.deepEqual(scenario.subsidy_breakdown.candidate_programs, []);
    assert.equal(hasUnconfirmedSubsidy(scenario), true);
    if (scenario.scenario === "downside") {
      assert.equal(scenarioSubsidyCondition(scenario), "補助金：含めない想定");
    } else {
      assert.match(scenarioSubsidyCondition(scenario), /確認できた適用条件・額で利用する想定/);
      assert.doesNotMatch(scenarioSubsidyCondition(scenario), /対象なし/);
    }
  }
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
test("主結果の補助金説明はゼロ・算入・部分算入・未確定に連動する", () => {
  const excluded = mainSubsidyPresentation({subsidy_yen:0});
  assert.equal(excluded.text, '補助金を含まず');
  assert.equal(excluded.link, '理由を確認');
  assert.match(mainSubsidyPresentation({subsidy_yen:100}).text, /算入/);
  assert.match(mainSubsidyPresentation({subsidy_yen:100,subsidy_breakdown:{municipality_program_status:'unconfirmed'}}).text, /一部算入/);
  assert.match(mainSubsidyPresentation({subsidy_yen:null}).text, /未確定/);
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
test("制度分類は実採用ID・金額を保持し，最大単一便益を全成分採用にしない", async () => {
  const data = JSON.parse(await readFile(resolve(repositoryRoot, 'data/input/public-data.json'), 'utf8'));
  for (const municipality of data.municipalities.filter(item => item.prefecture_code === '14')) {
    for (const equipmentPackage of ['solar_only','solar_plus_standard_battery']) {
      const result = calculateEstimate({prefectureCode:'14',municipalityCode:municipality.municipality_code,monthlyElectricityBillYen:null,systemCapacityKw:4,equipmentPackage},data);
      for (const scenario of result.scenarios) {
        const groups = subsidyGroups(result,scenario,municipality);
        assert.deepEqual(groups.included.map(item=>[item.id,item.amount_yen]), scenario.subsidy_breakdown.included_programs.map(item=>[item.id,item.amount_yen]));
        assert.ok(groups.excluded.every(item=>!groups.included.some(included=>included.id===item.id)));
        if (scenario.scenario==='downside') assert.equal(groups.included.length,0);

      }
    }
  }
});

test("パワコン注記は実交換費がある年だけを使い，蓄電池交換と混同しない", () => {
  assert.deepEqual(replacementEvents({annual_cash_flows:[{year:15,replacement_cost_yen:100,cumulative_cash_flow_yen:-20},{year:10,replacement_cost_yen:0,battery_replacement_cost_yen:500}]}),[{year:15,value:-20}]);
  assert.deepEqual(replacementEvents({annual_cash_flows:[{year:15,replacement_cost_yen:0}]}),[]);
});
test("単独算式案内はURLと設備と算式で一意対応し，対応不明は未算入断定しない", () => {
  const program={id:'actual',government_level:'municipality',official_url:'https://official.test/a',target_equipment:'solar',amount_rule:{calculation_type:'fixed'},amount_yen:100};
  const scenario={scenario:'standard',subsidy_breakdown:{included_programs:[program]}};
  const result={input:{equipment_package:'solar_only'},scenarios:[scenario]};
  const municipality={candidate_summary:{amount_components:[{equipment:'solar',official_url:'https://official.test/a',calculation_status:'included',display_amount:'案内額'},{equipment:'solar',official_url:'https://official.test/b',calculation_status:'included',display_amount:'別制度'}]}};
  const groups=subsidyGroups(result,scenario,municipality);
  assert.equal(groups.included[0].guidance.length,1);
  assert.equal(groups.excluded.length,0);
  assert.equal(groups.references.length,1);
});

test("他設備の非算入行は非算入群へ，採否未確定案内は参考群へ保持する", () => {
  const scenario={scenario:'standard',subsidy_breakdown:{candidate_programs:[{id:'combined',target_equipment:'solar_and_battery_required'},{id:'mismatch',target_equipment:'solar',required_confirmations:['入力と対象設備が一致しない']}]}};
  const groups=subsidyGroups({input:{equipment_package:'solar_only'},scenarios:[scenario]},scenario,{candidate_summary:{amount_components:[{equipment:'battery',calculation_status:'included'}]}});
  assert.deepEqual(groups.excluded.map(item=>item.id),['combined','mismatch']);
  assert.equal(groups.references.length,1);
  assert.match(groups.references[0].reason,/断定するものではありません/);
});


test("グラフ詳細は実費用を項目別に保持し，同年の通常点を重複生成しない", () => {
 const markers = cashflowMarkers({annual_cash_flows:[
  {year:5,cumulative_cash_flow_yen:-100,maintenance_cost_yen:31,replacement_cost_yen:47,battery_replacement_cost_yen:19},
  {year:10,cumulative_cash_flow_yen:200,maintenance_cost_yen:0},
  {year:11,cumulative_cash_flow_yen:300,maintenance_cost_yen:0}
 ]});
 assert.equal(markers.length,2);
 assert.deepEqual(markers[0].costs.map(c=>c.amount),[31,47,19]);
 assert.equal(markers[1].value,200);
 assert.deepEqual(markers[1].costs,[]);
 const grouped=groupMarkerTargets([{x:10,y:10,lines:['費用']},{x:10,y:10,lines:['交点']},{x:100,y:100,lines:['通常年']}]);
 assert.equal(grouped.length,2);
 assert.deepEqual(grouped[0].lines,['費用','交点']);
 assert.equal(grouped[0].points.length,2);
 assert.deepEqual(groupMarkerTargets([{x:10,y:10,lines:['前']},{x:30,y:10,lines:['後']}])[0].points,[{x:10,y:10},{x:30,y:10}]);
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

test("内訳の補助金理由は重複を省き，未確定と下振れと部分算入を区別する", () => {
 assert.equal(subsidyBreakdownReason({subsidy_yen:0},{excluded:[{reason:'受付終了．'},{reason:'受付終了．'}]}),'受付終了．');
 assert.match(subsidyBreakdownReason({subsidy_yen:100,subsidy_breakdown:{municipality_program_status:'unconfirmed'}},{excluded:[]}),/確認済みの額を算入し，未確認分/);
 assert.match(subsidyBreakdownReason({subsidy_yen:null},{excluded:[]}),/未確定/);
 assert.match(subsidyBreakdownReason({subsidy_yen:0,scenario:'downside'},{excluded:[{reason:'受付終了．'}]}),/想定/);
});

test('結論の小内訳は設備・容量・全シナリオで補助金を一度だけ算入する', async () => {
 const data = JSON.parse(await readFile(resolve(repositoryRoot, 'data/input/public-data.json'), 'utf8'));
 for (const municipality of data.municipalities) for (const equipmentPackage of ['solar_only','solar_plus_standard_battery']) for (const systemCapacityKw of [3,4,6]) {
  const result=calculateEstimate({prefectureCode:municipality.prefecture_code,municipalityCode:municipality.municipality_code,monthlyElectricityBillYen:null,systemCapacityKw,equipmentPackage},data);
  const routes=energyRoutes(result.energy);
  assert.ok(Math.abs(routes.generation-routes.direct-routes.exported-routes.charge)<=2);
  assert.ok(Math.abs(routes.consumed-routes.selfConsumed-routes.purchased)<=1);
  assert.ok(Math.abs(routes.selfConsumed-routes.direct-routes.delivered)<=1);
  if(equipmentPackage==='solar_plus_standard_battery') {
   const flow=result.energy.annual_energy_flows.find(row=>row.year===1);
   assert.equal(flow.opening_state_of_charge_kwh,0);
   assert.equal(flow.capacity_fade_spillage_kwh,0);
   assert.ok(Math.abs(flow.annual_battery_charge_input_kwh-flow.annual_battery_delivered_kwh-flow.annual_battery_conversion_loss_kwh-(flow.closing_state_of_charge_kwh-flow.opening_state_of_charge_kwh))<0.000004);
   assert.ok(Math.abs(routes.charge-routes.delivered-routes.loss-routes.stored)<=2);
  }
  for(const scenario of result.scenarios) {
   const parts=conclusionBreakdown(scenario);
   const totals=financialTotals(scenario);
   assert.equal(totals.cost,parts.cost);
   assert.equal(totals.income, Number.isFinite(scenario.subsidy_yen) ? scenario.total_revenue_yen+scenario.subsidy_yen : null);
   if (Number.isFinite(scenario.profit_yen)) assert.ok(Math.abs(totals.income-totals.cost-scenario.profit_yen)<=1);
   assert.equal(endpointResult(scenario).value, scenario.annual_cash_flows.find(row=>row.year===30).cumulative_cash_flow_yen);
   assert.equal(parts.income,scenario.total_electricity_savings_yen+scenario.total_sales_income_yen);
   assert.equal(parts.cost,scenario.gross_installation_cost_yen+scenario.total_maintenance_cost_yen+scenario.total_replacement_cost_yen+scenario.total_battery_replacement_cost_yen);
   assert.equal(parts.subsidy,scenario.subsidy_yen);
   if (Number.isFinite(scenario.profit_yen)) assert.ok(Math.abs(parts.net-scenario.profit_yen)<=1,'円単位丸めの許容範囲で正味利益と一致');
   else assert.equal(parts.net,null);
  }
 }
});
test('小内訳は未知数をゼロにせず，ゼロ・小額・万円を区別する', () => {
 const base={total_electricity_savings_yen:100,total_sales_income_yen:200,gross_installation_cost_yen:250,total_maintenance_cost_yen:10,total_replacement_cost_yen:20,total_battery_replacement_cost_yen:5,subsidy_yen:0};
 assert.equal(conclusionBreakdown(base).net,15);
 for(const key of Object.keys(base)) { const parts=conclusionBreakdown({...base,[key]:null});assert.equal(parts.net,null); }
 assert.equal(compactYen(null),'未確定');assert.equal(compactYen(0),'0万円');assert.equal(compactYen(1),'1,000円未満');assert.equal(compactYen(10000),'約1万円');
});

test('終点結果は30年目末を使い正負・ゼロ・小額・未知数を区別する', () => {
 for(const [value, expected] of [[100000,'＋約10万円'],[-100000,'−約10万円'],[0,'0円'],[5,'＋1,000円未満'],[-5,'−1,000円未満'],[null,'未確定']]) {
  assert.deepEqual(endpointResult({profit_yen:999999,annual_cash_flows:[{year:20,cumulative_cash_flow_yen:999999},{year:30,cumulative_cash_flow_yen:value}]}),{value,text:expected});
 }
 assert.equal(endpointResult({annual_cash_flows:[]}).value,null);
});

test('収支合計は未知数をゼロにせず補助金を一度だけ加算する', () => {
 const base={total_revenue_yen:200,subsidy_yen:50,gross_installation_cost_yen:100,total_maintenance_cost_yen:10,total_replacement_cost_yen:20,total_battery_replacement_cost_yen:0};
 assert.deepEqual(financialTotals(base),{income:250,cost:130});
 assert.equal(financialTotals({...base,subsidy_yen:null}).income,null);
 assert.equal(financialTotals({...base,total_revenue_yen:null}).income,null);
 assert.equal(financialTotals({...base,total_maintenance_cost_yen:null}).cost,null);
 assert.deepEqual(financialTotals({...base,total_revenue_yen:0,subsidy_yen:0}),{income:0,cost:130});
});

test('電力経路の欠損をゼロで補わず年末残量増減を既存結果から取る', () => {
 assert.ok(Object.values(energyRoutes({})).every(value=>value===null));
 assert.equal(energyRoutes({annual_energy_flows:[{year:1,opening_state_of_charge_kwh:2,closing_state_of_charge_kwh:3}]}).stored,1);
 assert.equal(energyRoutes({annual_energy_flows:[{year:1,opening_state_of_charge_kwh:2}]}).stored,null);
});

test('補助金の可視理由とariaは内訳の同一理由を使う', () => {
 for (const [reason, cue] of [
  ['この診断の計算で扱う範囲に対応していないため，含めていません．','モデル未対応'],
  ['はれトク側で適用可能か確認できていないため，今回の概算に含めていません．','適用確認待ち'],
  ['受付が終了しているため，含めていません．','受付終了'],
  ['含めていない具体的な理由は確認できていません．','理由']
 ]) {
  const result = subsidyReasonPresentation({subsidy_yen:0,subsidy_breakdown:{municipality_program_status:'candidate'}},{excluded:[{reason}]});
  assert.equal(result.reason,reason);
  assert.ok(result.aria.includes(reason));
  assert.ok(result.aria.includes(result.visible));
  assert.ok(result.visible.includes(cue));
  if(cue==='モデル未対応') assert.doesNotMatch(result.aria,/適用確認待ち/);
 }
});

test('利用割合はゼロを隠さず未確定と区別する', () => {
 assert.equal(formatEnergyRate(0),'0.0％');
 assert.equal(formatEnergyRate(1),'100.0％');
 assert.equal(formatEnergyRate(null),'未確定');
 assert.equal(formatEnergyRate(undefined),'未確定');
});

test('階層別補助表示は正本総額を使い未発見を制度なしへ変換しない', async () => {
 const {subsidyLevelAmounts,subsidyGovernmentLabel,subsidyResearchMessage}=await import('../../site/simulator/src/subsidy-presentation.js');
 const rows=subsidyLevelAmounts({national_amount_yen:10,prefecture_amount_yen:20,municipality_amount_yen:30,total_amount_yen:59});
 assert.equal(rows.length,4); assert.equal(rows.at(-1).amount,59);
 assert.equal(subsidyLevelAmounts({prefecture_amount_yen:0,municipality_amount_yen:0,total_amount_yen:0}).length,3);
 assert.equal(subsidyLevelAmounts({national_amount_yen:null}).at(0).amount,null);
 assert.equal(subsidyGovernmentLabel('national'),'国：');
 assert.match(subsidyResearchMessage('searched_not_found'),/調査した範囲.*存在しないと確定したものではありません/);
 assert.match(subsidyBreakdownReason({subsidy_yen:0,subsidy_breakdown:{municipality_program_status:'searched_not_found'}},{excluded:[]}),/制度不存在の確定ではありません/);
});

test('県制度の未確認と市区町村の未選択は確定ゼロと区別する', async () => {
 const {subsidyLevelAmounts,subsidyResearchMessage,prefectureResearchMessage}=await import('../../site/simulator/src/subsidy-presentation.js');
 const breakdown={prefecture_amount_yen:0,municipality_amount_yen:0,total_amount_yen:0,
   prefecture_program_status:'current_scope_unconfirmed',municipality_program_status:'not_requested'};
 const rows=subsidyLevelAmounts(breakdown);
 assert.equal(rows[0].statusText,'未確認・未反映');
 assert.equal(rows[1].statusText,'未選択・未反映');
 assert.equal(rows[2].amount,0);
 assert.match(prefectureResearchMessage(breakdown.prefecture_program_status),/都道府県.*未確認.*制度がないことを意味しません/);
 assert.match(subsidyResearchMessage(breakdown.municipality_program_status),/未選択.*反映していません/);
 assert.match(prefectureResearchMessage('legacy_included_pending_current_scope_review'),/確認済みの一部制度.*未完了/);
 assert.equal(prefectureResearchMessage('current_scope_reviewed'),'');
 const reviewed=subsidyLevelAmounts({...breakdown,prefecture_program_status:'current_scope_reviewed',municipality_program_status:'included'});
 assert.equal(reviewed[0].statusText,null);
 assert.equal(reviewed[1].statusText,null);
});

test('診断の非算入理由は住宅設備の対象・受付終了・最大組合せ外を区別する',async()=>{
 const {nonInclusionReason}=await import('../../site/simulator/src/subsidy-presentation.js');
 for(const [code,expected] of [['housing_age_not_applicable',/住宅区分/],['equipment_package_not_applicable',/異なる設備/],['application_closed',/受付が終了/],['not_in_maximum_permitted_combination',/総額が最大/]]) {
 const reason=nonInclusionReason({reason_code:code,calculation_status:'excluded_incompatible'});
 assert.match(reason,expected); assert.doesNotMatch(reason,/FIT|確認できていない/);
 }
});

test('表示理由は確認済み適合条件を受付と組合せより優先し，未確認併用を禁止としない',()=>{
 assert.match(nonInclusionReason({reason_code:'housing_age_not_applicable',application_status:'closed'}),/住宅区分/);
 assert.match(nonInclusionReason({reason_code:'not_in_maximum_permitted_combination',application_status:'closed'}),/受付が終了/);
 assert.match(nonInclusionReason({reason_code:'not_in_maximum_permitted_combination',application_status:'unknown'}),/受付状況を確認/);
 assert.doesNotMatch(nonInclusionReason({combination_status:'assumed_permitted_unverified_unless_explicitly_prohibited'}),/禁止|併用条件/);
});

test('スマホ終点の正負・ゼロ・未確定・長額は線と軸の外に収まり描画幅を奪わない', () => {
  for (const width of [268, 274, 320, 326]) {
    let plotWidth;
    for (const value of [0, 5, -5, 100000, -100000, Number.MAX_SAFE_INTEGER, -Number.MAX_SAFE_INTEGER, null]) {
      const {text} = endpointResult({annual_cash_flows:[{year:20,cumulative_cash_flow_yen:value}]});
      const measuredWidth = [...text].reduce((sum, ch) => sum + (/[^\x00-\x7f]/.test(ch) ? 14 : 8), 0);
      const layout = cashflowChartLayout(width, measuredWidth, true);
      const drawWidth = width - layout.padding.left - layout.padding.right;
      if (plotWidth !== undefined) assert.equal(drawWidth, plotWidth);
      plotWidth = drawWidth;
      assert.ok(drawWidth > width * .7);
      assert.ok(layout.padding.right >= 16);
      assert.ok(layout.labelTop + 6 < layout.padding.top);
      assert.ok(Math.min(measuredWidth, layout.labelMaxWidth) <= drawWidth);
    }
  }
});

test('共通見積もりバーは内容到達後だけ表示し入力と操作領域を保護する', () => {
 const ready = {eligible:true,reached:true,blocked:false,keyboard:false,focusCovered:false};
 assert.equal(quoteBarVisible(ready),true);
 for(const key of ['eligible','reached']) assert.equal(quoteBarVisible({...ready,[key]:false}),false);
 for(const key of ['blocked','keyboard','focusCovered']) assert.equal(quoteBarVisible({...ready,[key]:true}),false);
 assert.equal(QUOTE_ACTION.disabled,true);
 assert.equal(QUOTE_ACTION.label,'無料見積もり（準備中）');
 assert.equal('url' in QUOTE_ACTION,false);
});
test('キーボードの代替検出は入力フォーカスと可視領域縮小を併用する', () => {
 assert.equal(mobileKeyboardLikely(true,600,600),true);
 assert.equal(mobileKeyboardLikely(false,900,540),true);
 assert.equal(mobileKeyboardLikely(false,900,860),false);
 assert.equal(mobileKeyboardLikely(false,600,600),false);
});


test('非FIT必須制度の理由を受付終了や設備不一致と混同しない', () => {
 assert.match(nonInclusionReason({reason_code:'sale_path_not_applicable',calculation_status:'excluded_incompatible',application_status:'accepting'}),/非FIT・非FIPが必須/);
 assert.match(nonInclusionReason({reason_code:'equipment_package_not_applicable',calculation_status:'excluded_incompatible',application_status:'accepting'}),/異なる設備/);
});


test('受付終了は地域・容量・既設PV・FITの対象外理由を上書きしない', () => {
 for(const [reason_code,pattern]of [['municipality_not_applicable',/対象地域/],['capacity_not_applicable',/対象容量範囲/],['existing_pv_battery_addition_not_supported',/既設又は先行契約済み太陽光/],['sale_path_not_applicable',/非FIT・非FIP/]]){const text=nonInclusionReason({reason_code,application_status:'closed',calculation_status:'excluded_incompatible'});assert.match(text,pattern);assert.doesNotMatch(text,/受付が終了/);}
});


test('富山・長野の旧未確定理由を残さず，別の不適合理由を維持する',()=>{
 const common={calculation_status:'candidate_missing_conditions',application_status:'accepting',reason_code:'calculation_detail_unconfirmed'};
 for(const [id,pattern] of [['toyama-energy-campaign4-noncash-2026',/算定に必要な制度詳細/],['nagano-roof-solar-battery-unresolved-2026',/算定に必要な制度詳細/]]){
  const reason=nonInclusionReason({...common,id});assert.match(reason,pattern);assert.doesNotMatch(reason,/方針待ち|受付が終了/);
  for(const [code,expected] of [['capacity_not_applicable',/対象容量範囲/],['housing_age_not_applicable',/住宅区分/],['equipment_package_not_applicable',/異なる設備/]]){const text=nonInclusionReason({...common,id,reason_code:code});assert.match(text,expected);assert.doesNotMatch(text,/本体価格|容量の種類/);}
 }
 assert.equal(nonInclusionReason({...common,id:'another-program'}),'算定に必要な制度詳細を確認できていません．');
});
