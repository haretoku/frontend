import { replacesLegacyPrefecture } from '../../site/simulator/src/diagnostic-subsidy.js';
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";
import { runInNewContext } from 'node:vm';

import { calculateEstimate } from "../../site/simulator/src/calculator.js";

const guideSlugs = {"electricity-sales": "solar-economics", "subsidies": "subsidies", "disaster": "disaster", "quotes-contractors": "quotes-contractors"};
const readPage = name => readFile(new URL(`../../site/${guideSlugs[name] ? `guides/${guideSlugs[name]}/index.html` : `pages/${name}.html`}`, import.meta.url), "utf8");
const prose = html => html.replace(/<[^>]+>/g, "");

test("公開4記事は章ごとの問い・結論・参考文献・関連記事と診断導線を持つ", async () => {
  const metadata = JSON.parse(await readFile(new URL("../../data/input/metadata.json", import.meta.url), "utf8"));
  const sources = new Map(metadata.sources.map(source => [source.source_id, source]));
  for (const name of ["electricity-sales", "subsidies", "disaster", "quotes-contractors"]) {
    const html = await readPage(name);
    assert.match(html, /article--continuous/);
    assert.match(html, /article-toc/);
    assert.match(html, /article-data\.js/);
    assert.match(html, /href="\/simulator\//);
    assert.match(html, /data-quote-start/);
    assert.match(html, /fixed-quote-bar\.css/);
    assert.match(html, /data-inline-quote-action disabled/);
    assert.match(html, /無料見積もり（準備中）/);
    assert.match(html, /広告・アフィリエイト/);
    assert.match(html, /対象地域|全国|住宅用/);
    assert.match(html, /最終確認|更新日|確認日/);
    assert.match(html, /2026/);
    assert.match(html, /class="(?:economics|guide)-chapter-footer"/);
    assert.match(html, /data-bibliography-source/);
    assert.match(html, /loading="lazy"/);
    assert.doesNotMatch(html, /class="key-point"|先にまとめると/);
    const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map(m => m[1]));
    for (const [, id] of html.matchAll(/href="#([^"]+)"/g)) assert(ids.has(id), `${name}: ${id}`);
    const related = [...html.matchAll(/href="\/guides\/(solar-economics|subsidies|disaster|quotes-contractors)\/(?:#[^"]*)?"/g)].map(m => m[1]);
    assert(related.some(target => target !== guideSlugs[name]), `${name}: 関連記事`);
    for (const [, id] of html.matchAll(/data-source-id="([^"]+)"/g)) assert(sources.has(id), `${name}: ${id}`);
  }
});

test("収支記事に統合した設置・維持費は出典と計算根拠へ接続する", async () => {
  const html = await readPage("electricity-sales");
  const text = prose(html);
  for (const id of ["costs", "maintenance-baseline", "inspection-conditions", "removal-cost", "profit-baseline", "battery-profit", "decision-path"]) assert(html.includes(`id="${id}"`), id);
  assert.match(text, /30年間で約61万円/);
  assert.match(text, /5年|5，10/);
  assert.match(text, /20年/);
  assert.match(text, /補助金を利用しない|補助金なし/);
  assert.match(text, /交換費を含めない試算/);
  assert.match(text, /30年間使っても費用を回収できない場合/);
  assert.match(html, /calculation-method\.html#electricity-sales-example/);
  assert.match(html, /calculation-method\.html#cost-maintenance-notes/);
  assert.match(html, /meti\.go\.jp/);
  const redirect = await readPage("costs-maintenance");
  assert.match(redirect, /noindex,follow/);
  assert.match(redirect, /costs-maintenance-redirect\.js/);
  assert.match(redirect, /guides\/solar-economics\/#inspection-conditions/);
});

test("補助金記事は地域別条件・早期終了・契約前手続と公式根拠を示す", async () => {
  const html = await readPage("subsidies");
  const text = prose(html);
  for (const word of ["予算", "契約", "申請", "併用", "東京都", "48万円", "2026年度"]) assert(text.includes(word), word);
  assert.match(text, /受給.*確定|交付.*保証/);
  assert.match(html, /r8taiyouko_tebiki_20260630\.pdf/);
  assert.match(html, /href="https:\/\//);
  assert.match(html, /id="contractor-support"/);
  assert.match(html, /data-inline-quote-action disabled/);
});

test("停電記事は安全・出力制約と利用時間の仮定を分離する", async () => {
  const html = await readPage("disaster"), text = prose(html);
  for (const word of ["自立運転", "出力", "100 V", "200 V", "満充電", "太陽光からの補充なし", "30 W", "約10時間", "約70時間", "保証", "破損", "浸水"]) assert(text.includes(word), word);
  assert.match(text, /屋内.*使用し|一酸化炭素/);
  assert.match(html, /calculation-method\.html#outage-scenarios/);
  assert.match(html, /article-table--household-comparison/);
  for (const label of ["全国平均を基準", "家電を絞る"]) assert(html.includes(`data-label="${label}"`));
});

test("見積もり記事は総額だけでなく範囲・保証・個人情報・契約条件を比較する", async () => {
  const html = await readPage("quotes-contractors"), text = prose(html);
  for (const word of ["工事の範囲", "保証", "個人情報", "契約", "発電量", "現地調査"]) assert(text.includes(word), word);
  assert.match(html, /id="before-contract"/);
  assert.match(html, /id="pressure-caution"/);
  assert.match(html, /quote-price-example/);
  assert.match(html, /data-inline-quote-action disabled/);
});

test("現行家庭比較表は補助金を除いた30年収支と丸め前の計算に一致する", async () => {
  const html = await readPage("electricity-sales");
  const values = ["almost_every_weekday", "almost_never"].map(daytimeOccupancy => {
    const estimate = calculateEstimate({ prefectureCode: "13", housingAge: "existing", equipmentPackage: "solar_only", systemCapacityKw: 4, monthlyElectricityBillYen: null, detailConditions: { roof_orientation: "south" }, daytimeOccupancy }, publicData);
    return estimate.scenarios.find(scenario => scenario.scenario === "standard");
  });
  const display = value => `約${Math.round(value / 10000)}万円`;
  for (const [label, select] of [
    ["30年間の電気代削減", s => s.total_electricity_savings_yen],
    ["30年間の売電収入", s => s.total_sales_income_yen],
    ["30年間の収支", s => s.profit_yen - s.subsidy_yen]
  ]) {
    assert(html.includes(`<tr><th>${label}</th><td data-label="家庭A">${display(select(values[0]))}</td><td data-label="家庭B">${display(select(values[1]))}</td></tr>`), label);
  }
  assert.equal(display(values[0].profit_yen - values[0].subsidy_yen), "約102万円");
  const battery = calculateEstimate({ prefectureCode: "13", housingAge: "existing", equipmentPackage: "solar_plus_standard_battery", systemCapacityKw: 4, monthlyElectricityBillYen: null, detailConditions: { roof_orientation: "south" }, daytimeOccupancy: "almost_every_weekday" }, publicData).scenarios.find(s => s.scenario === "standard");
  assert.equal(display(battery.profit_yen - battery.subsidy_yen), "約96万円");
});

test("4記事の本文引用・章末参考文献は同じ文献辞書で解決する", async () => {
  const { sources } = JSON.parse(await readFile(new URL("../../site/articles/src/article-bibliography.json", import.meta.url), "utf8"));
  for (const name of ["electricity-sales", "subsidies", "disaster", "quotes-contractors"]) {
    const html = await readPage(name);
    const bibliography = new Set([...html.matchAll(/data-bibliography-source="([^"]+)"/g)].map(m => m[1]));
    assert(bibliography.size > 0);
    for (const id of bibliography) assert(sources[id]?.title, `${name}: ${id}`);
    for (const [, ids] of html.matchAll(/data-cite-sources="([^"]+)"/g)) {
      for (const id of ids.split(/\s+/)) assert(bibliography.has(id), `${name}: 本文引用 ${id} の参考文献がない`);
    }
  }
});


const publicData = JSON.parse(
  await readFile(new URL("../../data/input/public-data.json", import.meta.url), "utf8")
);

test("30年評価の本文は発電劣化と20年終点の蓄電池比較を区別する", async () => {
  const method = await readFile(new URL("../../site/pages/calculation-method.html", import.meta.url), "utf8");
  const costs = await readFile(new URL("../../site/pages/costs-maintenance.html", import.meta.url), "utf8");
  assert.match(method, /0\.997<sup><em>y<\/em>−1<\/sup>（式 \(1a\)）/);
  assert.match(method, /初年度は係数1で追加の初年度補正を行わず/);
  assert.match(method, /直接自家消費，売電および蓄電池充電を毎年再計算/);
  assert.match(method, /20年時点の定義を維持したまま同じ年間容量保持係数で30年目まで延長/);
  assert.match(method, /30年末に36％/);
  assert.match(method, /全国平均でも30年間の実測結果でもありません/);
  assert.match(method, /原典の税区分は未確認/);
  assert.match(method, /消費税10％を仮置きして317,900円／kW/);
  assert.match(method, /30年間の収支は，各年に想定する名目額を単純に合計し，現在価値へ割り引きません/);
  for (const html of [method]) {
    assert.match(html, /data-installation-cost-new-per-kw>317,900円/);
    assert.match(html, /data-installation-cost-existing-per-kw>331,100円/);
    assert.match(html, /data-maintenance-years>5，10，15，20，25，30年目/);
    assert.match(html, /data-replacement-years>20年目/);
    assert.doesNotMatch(html, /16～20年目|4，8，12，16，20年目|発電量の経年劣化は反映していません|30年末70％・85％/);
  }
  assert.match(method, /20年間に1回|20年目/);
});

test('制度条件の説明一覧はB2の診断用制度を一度だけ描画し，旧県候補の説明を混ぜない', async () => {
  const source=await readFile(new URL('../../site/articles/src/article-data.js',import.meta.url),'utf8');
  const node=tag=>({tag,textContent:'',children:[],append(...children){this.children.push(...children);}});
  const container=node('div'),status=node('p');
  const document={querySelector:selector=>selector==='[data-subsidy-assumptions]'?container:selector==='[data-article-data-status]'?status:null,querySelectorAll:()=>[],createElement:node};
  await runInNewContext(source.replace(/^import .*;\r?\n/gm,'').replace(/^initialize\(\);\r?$/m,'')+'\ninitialize();',{document,loadFrontendData:async()=>({publicData,metadata:{sources:[]}}),bindArticleBibliography:()=>{},setupArticleQuoteBar:()=>{},replacesLegacyPrefecture});
  assert.match(status.textContent,/公開データ版/);
  const diagnostic=publicData.diagnostic_subsidy_programs;
  const b2=diagnostic.filter(program=>['04','05','06'].includes(program.prefecture_code));
  assert.equal(b2.length,4);
  for(const program of b2){
    const rows=container.children.filter(detail=>detail.children[0].textContent===program.program_name);
    assert.equal(rows.length,1,program.id);
    const notes=rows[0].children.filter(child=>child.tag==='p').map(child=>child.textContent);
    for(const assumption of program.calculation_assumptions)assert.ok(notes.includes(assumption),program.id);
  }
  for(const code of ['16','20','28','45']){const program=diagnostic.find(p=>p.prefecture_code===code&&p.fit_compatible!==false);const row=container.children.find(detail=>detail.children[0].textContent===program.program_name);const text=row.children.map(node=>node.textContent).join(' ');assert.doesNotMatch(text,/金額は未確定|容量の種類が未確認/);for(const assumption of program.calculation_assumptions)assert.ok(text.includes(assumption));}
  for(const [rule,patterns] of [['fukushima_residential_solar_fit',[/0\.01kW未満切捨て.*4万円.*16万円/,/千円未満/,/10kW未満/]],['yamanashi_renewable_energy',[/整数kW.*3万円.*27万円/,/整数kWh.*4kWh以上.*25万円/]]]) {
    const program=diagnostic.find(program=>program.machine_rule===rule),row=container.children.find(detail=>detail.children[0].textContent===program.program_name);
    const text=row.children.map(node=>node.textContent).join(' ');for(const pattern of patterns)assert.match(text,pattern);
  }
  for(const [rule,label] of [['shiga_basic_fit_solar_battery','基本枠（FIT）'],['shiga_priority_non_fit','重点枠（非FIT）']]) {
    const program=diagnostic.find(program=>program.machine_rule===rule);assert.equal(container.children.filter(detail=>detail.children[0].textContent===program.program_name+' — '+label).length,1);
  }
  const diagnosticIds=new Set(diagnostic.map(program=>program.id));
  const retainedLegacy=publicData.prefectures.filter(region=>!replacesLegacyPrefecture(diagnostic,region.code)).flatMap(region=>region.candidate_subsidy_programs??[]).filter(program=>!diagnosticIds.has(program.id));
  for(const program of retainedLegacy)assert.ok(container.children.some(detail=>detail.children[0].textContent===program.program_name),program.id);
  const ishikawa=diagnostic.find(program=>program.prefecture_code==='17');
  if(ishikawa){assert.equal(container.children.filter(detail=>detail.children[0].textContent===ishikawa.program_name).length,1);const legacy=publicData.prefectures.find(region=>region.code==='17').candidate_subsidy_programs??[];for(const item of legacy)assert.ok(!container.children.some(detail=>detail.children.slice(1).some(node=>node.textContent===item.non_inclusion_reason)));}
  for(const id of ['daigo-zero-carbon-solar-battery-2026','ranzan-residential-solar-2026']){
    const program=diagnostic.find(program=>program.id===id);
    assert.equal(container.children.filter(detail=>detail.children[0].textContent===program.program_name).length,1);
  }
});

function formatArticleQuantity(value, unit) {
  const sign = value < 0 ? "−" : "";
  const displayed = unit === "円" ? Math.round(Math.abs(value) / 1000) * 1000 : Math.abs(value);
  return `${displayed !== Math.abs(value) ? "約" : ""}${sign}${displayed.toLocaleString("ja-JP")}${unit}`;
}

const pageNames = [
  "calculation-method.html",
  "electricity-sales.html",
  "subsidies.html",
  "disaster.html",
  "quotes-contractors.html"
];
const guidePageNames = pageNames.filter((pageName) => pageName !== "calculation-method.html");

test("ガイド記事のパンくずはガイド一覧へ戻り，現在地をリンクにしない", async () => {
  for (const pageName of pageNames.filter((pageName) => pageName !== "calculation-method.html")) {
    const html = await readPage(pageName.replace(".html", ""));
    assert.match(html, /href="\/guides\/">はれ<span class="brand-term">トク<\/span>ガイド<\/a> ／ [^<]+<\/nav>/);
  }
});

test("蓄電池記事は選択容量・条件付き劣化比較と年次適用を説明する", async () => {
  const calculation = await readFile(new URL("../../site/pages/calculation-method.html", import.meta.url), "utf8");
  const costs = await readFile(new URL("../../site/pages/costs-maintenance.html", import.meta.url), "utf8");
  const formula = calculation.match(/<p class="article-formula"><span class="formula-term">使用可能容量（式 \(5\)）[\s\S]*?<\/p>/)?.[0];
  assert.ok(formula);
  assert.match(formula, /選択した初期容量（kWh）/);
  assert.match(formula, /選択した劣化仮定の年間容量保持係数/);
  assert.doesNotMatch(formula, /9\.5|15年後60％/);
  for (const html of [calculation]) {
    assert.match(html, /20年末70％・85％/);
    assert.match(html, /条件付き比較仮定/);
    assert.match(html, /標準期待値，製品保証または研究で同定された平均ではありません/);
    assert.match(html, /約50\.6％/);
    assert.match(html, /収支も/);
  }
  assert.match(calculation, /各年の年末容量をその年の8760時間の計算へ適用/);
  assert.match(calculation, /0\.60の15分の1乗/);
  assert.match(calculation, /0\.70または0\.85の20分の1乗/);
  assert.match(calculation, /翌年の容量上限を超える分だけ切り詰め/);
  assert.match(calculation, /年初に満充電へ戻す処理は行いません/);
  assert.match(calculation, /標準蓄電池は，30年間交換せず/);
  const outageReference = calculation.match(/<p id="outage-reference">([\s\S]*?)<\/p>/)?.[1];
  assert.ok(outageReference);
  assert.match(outageReference, /0\.9043979452 kWh/);
  assert.match(outageReference, /片道放電効率√0\.9/);
  assert.match(outageReference, /往復効率90％を片道効率として用いず/);
  assert.match(outageReference, /通常の収支計算の開始残量を満充電に変えるものではありません/);
});

test("診断情報と運営ポリシーへ一般記事テンプレートを適用しない", async () => {
  for (const pageName of ["calculation-method.html", "policy.html"]) {
    const html = await readPage(pageName.replace(".html", ""));
    assert.doesNotMatch(html, /article--guide|article-entry-actions|article-toc/);
  }
});

test("計算根拠の式番号・依存関係・採用値・出典と目次操作を維持する", async () => {
  const articleDataJs = await readFile(new URL("../../site/articles/src/article-data.js", import.meta.url), "utf8");
  assert.match(articleDataJs, /details\.article-toc/);
  assert.doesNotMatch(articleDataJs, /tableOfContents\.open\s*=\s*window\.matchMedia/);
  assert.match(articleDataJs, /tableOfContents\.open = false/);
  assert.match(articleDataJs, /summary\.setAttribute\("aria-label", tableOfContents\.open \? "目次を閉じる" : "目次を開く"\)/);
  assert.match(articleDataJs, /updateLabel\(\);\s*tableOfContents\.addEventListener\("toggle", updateLabel\)/);

  const html = await readFile(new URL("../../site/pages/calculation-method.html", import.meta.url), "utf8");
  const formulaParagraphs = [...html.matchAll(/<p class="article-formula">([\s\S]*?)<\/p>/g)];
  const formulaEntries = formulaParagraphs.map(([, formula]) => {
    const leftHandSide = formula.match(/^<span class="formula-term">([^<]+)（式 \((\d+)\)）<\/span>/);
    assert.ok(leftHandSide, `式番号が左辺にありません：${formula}`);
    return { formula, name: leftHandSide[1], number: Number(leftHandSide[2]) };
  });
  const formulaNumbers = formulaEntries.map(({ number }) => number);
  const expectedFormulaNumbers = Array.from({ length: formulaNumbers.at(-1) }, (_, index) => index + 1);
  assert.deepEqual(formulaNumbers, expectedFormulaNumbers);
  assert.equal(new Set(formulaNumbers).size, formulaNumbers.length);
  assert.doesNotMatch(html, /<h3>[^<]+（式 \(\d+\)）<\/h3>/);
  assert.doesNotMatch(html, /formula-pending|新しい自家消費モデルの確認後/);

  const definedFormulaNumbers = new Set(formulaNumbers);
  const expectedDependencies = new Map([
    [3, [1, 2]],
    [4, [3]],
    [5, []],
    [6, [1, 2, 4]],
    [7, [1, 2, 4]],
    [8, []],
    [9, [7]],
    [10, []],
    [11, [8, 9]],
    [12, [10, 11]],
    [13, [12]],
    [14, [12]]
  ]);
  for (const { formula, number } of formulaEntries) {
    const referencedNumbers = [...formula.matchAll(/式 \((\d+)\)/g)]
      .map((match) => Number(match[1]))
      .filter((referencedNumber) => referencedNumber !== number);
    for (const referencedNumber of referencedNumbers) {
      assert.ok(definedFormulaNumbers.has(referencedNumber), `式 (${number}) が未定義の式 (${referencedNumber}) を参照しています`);
    }
    if (expectedDependencies.has(number)) {
      assert.deepEqual(
        [...new Set(referencedNumbers)].sort((a, b) => a - b),
        expectedDependencies.get(number),
        `式 (${number}) の依存式が一致しません`
      );
    }
  }
  for (const heading of ["計算式", "採用パラメータ", "シナリオ", "計算結果を見る際の注意", "参考文献"]) {
    assert.match(html, new RegExp(`<h2>${heading}<\\/h2>`));
  }
  assert.match(html, /article-table--parameters/);
  assert.match(html, /article-table--scenarios/);
  assert.match(html, /<thead><tr><th>項目<\/th><th>採用値・単位<\/th><th>適用期間・条件<\/th><th>出典・設定理由<\/th><\/tr><\/thead>/);
  assert.match(html, /<thead><tr><th>シナリオ<\/th><th>電気料金上昇率<\/th><th>補助金<\/th><\/tr><\/thead>/);
  assert.doesNotMatch(html, /式へ反映|rowspan=/);
  assert.match(html, /発電量，屋根方位，自家消費率，導入費用，売電単価，点検費および交換費は，3つのシナリオで共通です/);
  assert.doesNotMatch(html, /backend|frontend|API|返却値|公開データ版|id="calculation-contract"|id="example-assumptions"|id="payback"/);
  assert.match(html, /id="daytime-occupancy"/);
  assert.match(html, /<span data-temporal-overlap-bin-count>8760<\/span>時間の需要・発電重複/);
  assert.match(html, /各時間で需要量と発電量の小さい方を自家消費/);
  assert.match(html, /data-self-consumption-validation-rate>37\.66641％/);
  assert.match(html, /data-self-consumption-validation-error>16\.61％/);
  assert.match(html, /外部値へ合わせる補正係数は使用していません/);
  assert.doesNotMatch(html, /基準の自家消費率|4\.87％ポイント|はれトク独自の較正/);
  assert.match(html, /data-daytime-occupancy-table/);
  assert.match(html, /<thead><tr><th>選択肢<\/th><th>生活状況<\/th><th>平日昼間在宅率<\/th><\/tr><\/thead>/);
  assert.match(html, /data-source-id="bri-pyhees-residential-total-electricity-load"/);
  assert.match(html, /data-source-id="nedo-solar-radiation-database"/);
  assert.match(html, /国，都道府県，対応済み市区町村の公的制度/);
  assert.match(html, /都道府県制度は2026年9月18日の全国監査結果を反映/);
  assert.match(html, /国・市区町村制度の確認日と対象範囲は制度別の記録/);
  assert.match(html, /限定した公式導線の調査であり，全制度の網羅確認ではありません/);
  assert.match(html, /公式に併用可能と確認したことを意味せず/);
  assert.match(html, /予算終了，受付期間，併用可否，住宅・設備条件/);
  assert.match(html, /未収録または確認日後に更新された制度/);
  assert.match(html, /標準蓄電池は，30年間交換せず使用する前提です/);
  assert.match(html, /15年目から16年目にも容量や充電残量をリセットしません/);
  assert.match(html, /製品の30年寿命または保証を確認した事実ではありません/);
  assert.match(html, /15年後60％は容量保証の下限を用いた保守的な感度パス/);
  assert.match(html, /16～30年目は同じ年間保持係数を延長する数学的外挿/);
  assert.match(html, /公称容量は電池の名目容量，実効容量は製品が定める初期の使用範囲/);
  assert.match(html, /出力は同時に供給できる電力の大きさで，容量とは別/);
  assert.match(html, /容量保証の下限，保証期間，想定使用期間およびサイクル期待寿命も同一視しません/);
  assert.match(html, /参考：従量電灯B/);
  assert.match(html, /40\.49円は300 kWh超過分だけに適用し，診断の全使用量へ一律に掛けない/);
  assert.match(html, /2026年度再エネ賦課金/);
  assert.match(html, /2026年5月検針分～2027年4月検針分/);
  assert.match(html, /2025年度下半期・2026年度認定，住宅用10 kW未満，調達期間10年間/);
  assert.match(html, /地域・契約条件付き例．全国共通価格ではない/);
  assert.match(html, /30年間の収入総額は計算結果として返された値を表示し，四捨五入後の内訳から足し直しません/);
  assert.match(html, /戸建て・4人以上世帯の地域平均（令和5年度）/);
  assert.match(html, /関東甲信15,467円／月/);
  assert.match(html, /手入力した値またはURLの<code>monthlyElectricityBill<\/code>がある場合は，その値を優先します/);
  assert.match(html, /点検3\.8万円／回とパワーコンディショナ交換38\.4万円／回は，経済産業省の2026年資料にある住宅用5 kW設備の業界ヒアリング値/);
  assert.match(html, /税区分は未確認/);
  assert.match(html, /5年ごとの点検と20年目の交換は診断上のサービス評価仮定/);
  assert.match(html, /資料自体は交換年を20年目と定めていません/);
  assert.ok((html.match(/data-source-id=/g) ?? []).length >= 16);
  assert.ok((html.match(/参照日：/g) ?? []).length >= 25);
});

test("診断の内訳末尾と末尾から使用データへ接続する", async () => {
  const html = await readFile(new URL("../../site/simulator/index.html", import.meta.url), "utf8");
  assert.equal((html.match(/href="\.\.\/pages\/calculation-method\.html"/g) ?? []).length, 2);
  assert.match(html, />計算方法・使用データ<\/a>/);
});


test("旧ガイドURLはクエリとハッシュを保持し，JSなしでも新URLへ進める", async () => {
  const script = await readFile(new URL("../../site/shared/legacy-redirect.js", import.meta.url), "utf8");
  for (const [oldPath, destination] of [["solar/index.html", "/guides/"], ...Object.entries(guideSlugs).map(([id, slug]) => [`pages/${id}.html`, `/guides/${slug}/`])]) {
    const html = await readFile(new URL(`../../site/${oldPath}`, import.meta.url), "utf8");
    assert(html.includes(`data-redirect-target href="${destination}"`));
    assert(html.includes(`rel="canonical" href="https://haretoku.jp${destination}"`));
    assert(!html.includes("analytics.js"));
    assert.match(html, /<body><noscript><p><a data-redirect-target/);
    assert(!html.includes("移転のお知らせ"));
    let actual;
    runInNewContext(script, { URL, document: { querySelector: () => ({getAttribute: () => destination}) }, location: {origin: "https://haretoku.jp", search: "?from=old", hash: "#summary", replace: value => {actual = value;}} });
    assert.equal(actual, `https://haretoku.jp${destination}?from=old#summary`);
  }
});

test("未接続の見積もり本文カードは初期HTMLから非表示にする", async () => {
  for (const name of Object.keys(guideSlugs)) {
    const html = await readPage(name);
    const cards = [...html.matchAll(/<aside\b[^>]*>[\s\S]*?<\/aside>/g)].map(m => m[0]).filter(card => card.includes("data-inline-quote-action"));
    assert(cards.length > 0);
    assert(cards.every(card => /^<aside hidden data-quote-promotion/.test(card)));
  }
});
