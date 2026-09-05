import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateEstimate } from "../../site/simulator/src/calculator.js";


const publicData = JSON.parse(
  await readFile(new URL("../../data/input/public-data.json", import.meta.url), "utf8")
);

function formatArticleQuantity(value, unit) {
  const sign = value < 0 ? "−" : "";
  return `${sign}${Math.abs(value).toLocaleString("ja-JP")}${unit}`;
}

const pageNames = [
  "calculation-method.html",
  "costs-maintenance.html",
  "electricity-sales.html",
  "subsidies.html",
  "disaster.html",
  "quotes-contractors.html"
];
const guidePageNames = pageNames.filter((pageName) => pageName !== "calculation-method.html");

test("一般5記事の概要・結論は通常段落で，参考文献が公開出典へ解決する", async () => {
  const metadata = JSON.parse(await readFile(new URL("../../data/input/metadata.json", import.meta.url), "utf8"));
  const sources = new Map(metadata.sources.map((source) => [source.source_id, source]));
  for (const pageName of guidePageNames) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    const overview = html.match(/<section class="article-learn"[^>]*>([\s\S]*?)<\/section>/)?.[1];
    const summary = html.match(/<section id="summary">([\s\S]*?)<\/section>/)?.[1];
    assert.ok(overview && summary, pageName);
    for (const prose of [overview, summary]) {
      assert.match(prose, /<p>/);
      assert.doesNotMatch(prose, /<(?:ul|ol|table)\b/);
    }
    assert.doesNotMatch(html, /article-opening-answer|先にまとめると|class="key-point"|article-learn__checks/);
    for (const [, sourceId] of html.matchAll(/data-source-id="([^"]+)"/g)) {
      const source = sources.get(sourceId);
      assert.ok(source?.source_title && source?.publisher, `${pageName}: ${sourceId}`);
      assert.match(source.source_url, /^https:\/\//);
    }
  }
});

test("6つの詳細ページが共通構造と役割別の見出しを持つ", async () => {
  for (const pageName of pageNames) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.match(html, pageName === "calculation-method.html" ? /<h2>このページで分かること<\/h2>/ : /<h2>まとめ<\/h2>/);
    assert.match(html, /\.\.\/articles\/styles\/article\.css/);
    assert.match(html, /\.\.\/articles\/src\/article-data\.js/);
    assert.match(html, /class="source-list"/);
    assert.match(html, /href="\.\.\/"/);
  }
});

test("ガイド記事のパンくずはガイド一覧へ戻り，現在地をリンクにしない", async () => {
  for (const pageName of pageNames.filter((pageName) => pageName !== "calculation-method.html")) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.match(html, /href="\.\.\/solar\/">はれ<span class="brand-term">トク<\/span>ガイド<\/a> ／ [^<]+<\/nav>/);
  }
});

test("計算結果から6つの詳細ページへ接続する", async () => {
  const html = await readFile(new URL("../../site/simulator/index.html", import.meta.url), "utf8");
  for (const pageName of pageNames) {
    assert.match(html, new RegExp(`pages/${pageName.replace(".", "\\.")}`));
  }
});

test("計算方法と費用記事が維持・交換費の採用範囲を一致して示す", async () => {
  const calculationHtml = await readFile(
    new URL("../../site/pages/calculation-method.html", import.meta.url),
    "utf8"
  );
  const costsHtml = await readFile(
    new URL("../../site/pages/costs-maintenance.html", import.meta.url),
    "utf8"
  );

  for (const html of [calculationHtml, costsHtml]) {
    assert.match(html, /data-maintenance-cost/);
    assert.match(html, /data-replacement-cost/);
  }
  assert.match(costsHtml, /data-lifecycle-cost-total/);
  assert.match(costsHtml, /574,000円/);
  assert.match(costsHtml, /38,000円/);
  assert.match(costsHtml, /190,000円/);
  assert.match(costsHtml, /384,000円/);
  assert.match(costsHtml, /住宅用5 kW設備を想定した業界ヒアリング値/);
  assert.match(costsHtml, /特定製品の保証価格や個別見積価格ではなく/);
  assert.match(costsHtml, /20年間に1回の交換を15年目に置きます/);
  assert.match(costsHtml, /いずれも支出時点を定めるサービス評価仮定/);
  assert.match(costsHtml, /資料自体が15年目の交換を定めているわけではありません/);
  assert.match(costsHtml, /15年目の故障や交換を保証するものではありません/);
  assert.match(costsHtml, /新築案件について，システム費用の平均値28\.9万円／kW，中央値29\.4万円／kW/);
  assert.match(costsHtml, /本体価格/);
  assert.match(costsHtml, /システム費用の統計/);
  assert.match(costsHtml, /標準工事込みの見積額/);
  assert.match(costsHtml, /現地調査後の最終見積額/);
  assert.match(costsHtml, /内訳の表示値を足した金額と総額に丸め差が生じ得ます/);
  assert.match(costsHtml, /全国一律の追加額は置きません/);
  const maintenanceSection = costsHtml.match(/<section id="included-costs">([\s\S]*?)<\/section>/)?.[1];
  assert.ok(maintenanceSection);
  assert.match(maintenanceSection, /所有者が行う日常点検と，専門業者へ依頼する定期点検を区別/);
  assert.match(maintenanceSection, /安全に確認できる範囲で機器の外観，異音・異臭の有無を確認し，発電モニターで発電量/);
  assert.match(maintenanceSection, /前年同月の発電量と比較/);
  assert.match(maintenanceSection, /屋根へ上るなどの危険な作業は行わず/);
  assert.match(maintenanceSection, /定期点検の項目は設置後の年数や使用・故障状況によって異なる/);
  assert.match(maintenanceSection, /日常点検だけで専門業者の定期点検を代替するものではありません/);
  assert.match(maintenanceSection, /href="https:\/\/www\.jpea\.gr\.jp\/house\/longuser\/"/);
  assert.match(calculationHtml, /各年の収支（式 \(11\)）/);
  assert.match(calculationHtml, /20年間の正味利益（式 \(13\)）/);
  assert.match(calculationHtml, /標準蓄電池交換費<\/th><td>0円/);
  assert.match(costsHtml, /標準蓄電池交換<\/th><td>20年間は交換せず，交換費0円/);
  assert.match(costsHtml, /突発的な修理，撤去，保険，借入および税金は含まれません/);
});

test("制度情報を含む記事が対象年度・地域・最終確認日を示す", async () => {
  for (const pageName of ["electricity-sales.html", "subsidies.html"]) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.match(html, /class="article-meta"/);
    assert.match(html, /<dt>対象地域<\/dt>/);
    assert.match(html, /<dt>対象年度<\/dt>/);
    assert.match(html, /<dt>最終確認日<\/dt>/);
    assert.match(html, /data-data-version/);
  }
});

test("3分類の代表記事が読者の問いと次の行動に対応する", async () => {
  const mechanicsHtml = await readFile(
    new URL("../../site/pages/electricity-sales.html", import.meta.url),
    "utf8"
  );
  const subsidiesHtml = await readFile(
    new URL("../../site/pages/subsidies.html", import.meta.url),
    "utf8"
  );
  const quotesHtml = await readFile(
    new URL("../../site/pages/quotes-contractors.html", import.meta.url),
    "utf8"
  );

  assert.match(mechanicsHtml, /<h1>太陽光の収支は，何で決まる？<\/h1>/);
  assert.match(mechanicsHtml, /住宅用太陽光の20年間の収支を考えるためのガイドです/);
  assert.match(mechanicsHtml, /本当に元が取れるのか/);
  assert.match(mechanicsHtml, /売電だけで費用を回収できるのか/);
  assert.match(mechanicsHtml, /<p class="article-opening-summary">特に，電気代が高く/);
  assert.doesNotMatch(mechanicsHtml, /article-opening-answer|先にまとめると/);
  assert.match(mechanicsHtml, /電気代削減と売電収入/);
  for (const heading of [
    "まとめ",
    "収支の全体像",
    "電気代削減は，昼間に使える量で変わる",
    "売電収入は，余る量と時期ごとの単価で変わる",
    "設置費は，容量だけでなく屋根と工事で変わる",
    "導入後の費用は，発生する年を分けて見る",
    "収支を大きく変える条件",
    "同じ4 kWでも，昼間の使い方で結果が変わる",
    "向いている家庭と，慎重に考えたい家庭",
    "記事で理解し，診断で概算し，見積もりで個別条件を確認する"
  ]) {
    assert.match(mechanicsHtml, new RegExp(`<h2>${heading}<\\/h2>`));
  }
  assert.match(mechanicsHtml, /月間電気料金が高くても，使用時間が夜間中心なら/);
  assert.match(mechanicsHtml, /FITの買取価格は1～4年目が24円／kWh，5～10年目が8\.3円／kWh/);
  assert.match(mechanicsHtml, /30 A契約を例にすると，基本料金は935\.25円／月/);
  assert.match(mechanicsHtml, /最初の120 kWhまで29\.80円／kWh，120 kWh超300 kWhまで36\.40円／kWh，300 kWh超の部分が40\.49円／kWh/);
  assert.match(mechanicsHtml, /40\.49円／kWhを月間使用量の全量へ掛ける計算ではありません/);
  assert.match(mechanicsHtml, /2026年度の賦課金は4\.18円／kWhで，2026年5月検針分から2027年4月検針分まで適用/);
  assert.match(mechanicsHtml, /2025年度下半期および2026年度に認定される10 kW未満の住宅用太陽光/);
  assert.match(mechanicsHtml, /調達期間は10年間/);
  assert.match(mechanicsHtml, /11～20年目に置く8\.50円／kWhは，東京電力エナジーパートナー「再エネ買取標準プラン」の例/);
  assert.match(mechanicsHtml, /全国共通の卒FIT価格や将来の保証価格ではありません/);
  assert.match(mechanicsHtml, /住宅用5 kW設備を想定した業界ヒアリング値/);
  assert.match(mechanicsHtml, /専門業者による定期点検を設置後1年，その後は4年ごとに推奨/);
  assert.match(mechanicsHtml, /その頻度自体を一律の法定義務として説明しません/);
  assert.match(mechanicsHtml, /href="costs-maintenance\.html#included-costs"/);
  for (const condition of ["発電量", "昼間の使用量", "買電・売電単価", "設置容量", "設置費・追加工事", "補助金", "維持・交換費"]) {
    assert.match(mechanicsHtml, new RegExp(`<th>${condition}<\\/th>`));
  }
  assert.doesNotMatch(mechanicsHtml, /式 \(\d+\)/);
  assert.match(mechanicsHtml, /はれ<span class="brand-term">トク<\/span>診断を始める/);

  assert.match(subsidiesHtml, /<title>補助金は，どう探してどう申請する？｜はれトク<\/title>/);
  assert.match(subsidiesHtml, /<h1>補助金は，どう探してどう申請する？<\/h1>/);
  assert.match(subsidiesHtml, /<dt>情報の基準<\/dt><dd>2026年度の制度情報<\/dd>/);
  assert.doesNotMatch(subsidiesHtml, /有効状態/);
  assert.match(subsidiesHtml, /<h2>補助金を探す順番<\/h2>/);
  assert.match(subsidiesHtml, /<h3>東京都内で探す例<\/h3>/);
  assert.match(subsidiesHtml, /href="https:\/\/policies\.env\.go\.jp\/earth\/zeh\/search\/"/);
  for (const sectionId of ["acceptance-status", "eligibility-documents", "application-flow", "contractor-support", "final-checks"]) {
    assert.match(subsidiesHtml, new RegExp(`<section(?: class="[^"]+")? id="${sectionId}">`));
    assert.match(subsidiesHtml, new RegExp(`href="#${sectionId}"`));
  }
  assert.match(subsidiesHtml, /<h2>申請から入金までの流れ<\/h2>/);
  assert.match(subsidiesHtml, /施工会社によっては，申請書の作成補助，設備資料の準備または提出代行を無料で行う場合があります/);
  assert.match(subsidiesHtml, /すべての会社・制度で無料とは限らず/);
  assert.match(subsidiesHtml, /代行手数料の有無，支援する書類と対象外の書類，申請者と提出者/);
  assert.match(subsidiesHtml, /申請書，見積書，契約書および振込口座の名義をそろえ/);
  assert.match(subsidiesHtml, /設置前写真と内訳書を実績報告まで保存します/);
  assert.doesNotMatch(subsidiesHtml, /id="common-errors"|<h2>よくある失敗<\/h2>|href="#common-errors"/);
  assert.match(subsidiesHtml, /補助金を含む概算を確認する/);
  assert.doesNotMatch(subsidiesHtml, /計算へ含める範囲|診断へ算入する金額|診断へ未確認金額|大きい単独額|未収集は，補助金0円|年度初の制度スナップショット|診断額は確認済み/);

  assert.match(quotesHtml, /<h1>太陽光の見積もりは，何を比べる？<\/h1>/);
  for (const comparisonItem of ["価格・内訳", "設備", "発電試算", "工事・追加費用", "保証・対応", "補助金申請", "契約"]) {
    assert.match(quotesHtml, new RegExp(`<th>${comparisonItem}<\\/th>`));
  }
  assert.match(quotesHtml, /<h2>同じ条件で複数社を比較する<\/h2>/);
  assert.match(quotesHtml, /<h3>比較表の読み方<\/h3>/);
  assert.match(quotesHtml, /太陽光は4 kW前後，蓄電池なし，補助金控除前の税込価格/);
  assert.match(quotesHtml, /<h2>契約前の次の行動<\/h2>/);
  assert.match(quotesHtml, /見積もり比較サイトは候補を探す入口です/);
  assert.match(quotesHtml, /施工品質，発電量，補助金の受給，系統接続または故障時の対応が一律に保証されるわけではありません/);
  assert.match(quotesHtml, /個人情報の提供先，紹介される会社数，連絡方法，紹介や連絡を断る窓口，契約主体および無料となる範囲/);
  assert.match(quotesHtml, /配置図・配線図と，発電量・経済効果の計算条件を書面で確認/);
  assert.match(quotesHtml, /補助金申請，FIT認定および送配電事業者との系統接続手続/);
  assert.match(quotesHtml, /工事完了に関する保証/);
  assert.equal((quotesHtml.match(/無料見積もりで確認/g) ?? []).length, 2);
  assert.equal((quotesHtml.match(/広告・アフィリエイトを含みます/g) ?? []).length, 2);
  assert.match(quotesHtml, /data-route-source="article-top-affiliate" disabled/);
  assert.match(quotesHtml, /data-route-source="article-final-affiliate" disabled/);
});

test("停電記事は給電条件，安全上の制約および実例の限界を区別する", async () => {
  const html = await readFile(new URL("../../site/pages/disaster.html", import.meta.url), "utf8");
  assert.match(html, /系統へ接続した通常運転は安全のため停止します/);
  assert.match(html, /原則として日射がある時間帯に指定コンセント等から利用します/);
  assert.match(html, /容量（kWh），同時に供給できる出力（kWまたはkVA）/);
  assert.match(html, /100 V・200 Vへの対応，接続回路，全負荷・特定負荷の方式/);
  assert.match(html, /自動・手動の切替，復電時の復帰および瞬断の有無も機種ごとに異なります/);
  assert.doesNotMatch(html, /蓄電池なら基本何でも/);
  assert.match(html, /住宅用太陽光428件のうち364件，85\.0％が自立運転機能を利用/);
  assert.match(html, /「太陽光単体で何日使えるか」へ一般化できません/);
  assert.match(html, /4人世帯，太陽光8\.16 kW，EV蓄電容量12 kWh，停電開始時の残量63％/);
  assert.match(html, /同じ容量なら5日間使えることを保証するものではありません/);
  assert.match(html, /モバイルバッテリーはPSEマークを確認し，モバイルバッテリーやポータブル電源はリコール情報，定格および回収方法/);
  assert.match(html, /標準蓄電池を含む構成も比較できますが，停電時に使える時間や給電範囲は金銭的利益へ合算しません/);
  assert.match(html, /屋内では絶対に使用しません/);
});

test("ガイド5記事は共通構造，2経路，目次および開示を持つ", async () => {
  for (const pageName of guidePageNames) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.match(html, /class="article-width article article--continuous article--guide"/);
    assert.match(html, /class="article-learn"/);
    assert.match(html, /この記事で分かること/);
    assert.match(html, /class="article-entry-actions /);
    assert.match(html, /class="article-toc"/);
    assert.match(html, /id="summary"/);
    assert.equal((html.match(/data-route-source="article-top-affiliate"/g) ?? []).length, 1);
    assert.equal((html.match(/data-route-source="article-final-affiliate"/g) ?? []).length, 1);
    assert.equal((html.match(/無料見積もりで確認/g) ?? []).length, 2);
    assert.equal((html.match(/広告・アフィリエイトを含みます/g) ?? []).length, 2);
    assert.equal((html.match(/見積もりサービスの利用は無料です/g) ?? []).length, 2);
    assert.equal((html.match(/施工会社・条件で確認します/g) ?? []).length, 2);
    assert.doesNotMatch(html, /(?:相談|現地調査|見積もり)[^．]{0,24}すべて無料/);
    assert.equal((html.match(/data-route-source="article-(?:top|final)-affiliate" disabled/g) ?? []).length, 2);
    assert.match(html, /class="article-sources"/);
    assert.match(html, /class="article-related"/);
    assert.equal((html.match(/class="article-action"/g) ?? []).length, 0);
  }

  for (const pageName of ["subsidies.html", "quotes-contractors.html", "costs-maintenance.html", "disaster.html"]) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.match(html, /class="notice-label">注意点<\/p>/);
  }

  const css = await readFile(new URL("../../site/articles/styles/article.css", import.meta.url), "utf8");
  assert.match(css, /\.article--continuous > section \{/);
  assert.match(css, /background: transparent;/);
  assert.match(css, /\.article--continuous > \.caution-box \{/);
  assert.match(css, /border-left: 0\.3rem solid var\(--color-accent\);/);
  assert.match(css, /\.article:not\(\.article--continuous\) \.caution-box \{/);
  assert.match(css, /\.article--continuous > \.article-sources \{/);
  assert.match(css, /\.article--guide > section:not\(\.article-learn\)/);
  assert.match(css, /border-left: 0\.38rem solid var\(--color-primary-dark\);/);
  assert.match(css, /\.article--guide h3 \{/);
  assert.match(css, /border-left: 0\.18rem solid #c8cecb;/);
});

test("収支記事以外の4記事が確定した記事構造と主題別図版を持つ", async () => {
  const articleSpecs = [
    {
      pageName: "subsidies.html",
      heroImage: "guide-subsidy.webp",
      heroWidth: 720,
      heroHeight: 480,
      sectionImage: "article-subsidy-check-flow.webp",
      sectionWidth: 1693,
      sectionHeight: 929,
      topFirstRole: "internal"
    },
    {
      pageName: "quotes-contractors.html",
      heroImage: "guide-quotes.webp",
      heroWidth: 720,
      heroHeight: 480,
      sectionImage: "article-quotes-comparison.webp",
      sectionWidth: 1693,
      sectionHeight: 929,
      topFirstRole: "affiliate"
    },
    {
      pageName: "costs-maintenance.html",
      heroImage: "guide-mechanics.webp",
      heroWidth: 720,
      heroHeight: 480,
      sectionImage: "article-costs-lifecycle.webp",
      sectionWidth: 1727,
      sectionHeight: 911,
      topFirstRole: "internal"
    },
    {
      pageName: "disaster.html",
      heroImage: "guide-disaster.webp",
      heroWidth: 1672,
      heroHeight: 941,
      sectionImage: "article-disaster-standalone.webp",
      sectionWidth: 1693,
      sectionHeight: 929,
      topFirstRole: "internal"
    }
  ];

  for (const spec of articleSpecs) {
    const html = await readFile(new URL(`../../site/pages/${spec.pageName}`, import.meta.url), "utf8");
    assert.match(html, /<body class="article-guide-page">/);
    assert.match(html, /<dt>対象地域<\/dt>/);
    assert.match(html, /<dt>対象年度<\/dt>/);
    assert.match(html, /<dt>最終確認日<\/dt>/);
    assert.match(
      html,
      new RegExp(`<figure class="article-width article-hero-visual">\\s*<img src="\\.\\.\\/shared\\/assets\\/${spec.heroImage.replace(".", "\\.")}" width="${spec.heroWidth}" height="${spec.heroHeight}" alt="[^"]+">`)
    );
    assert.match(
      html,
      new RegExp(`<figure class="article-section-illustration"[^>]*>[\\s\\S]*${spec.sectionImage.replace(".", "\\.")}" width="${spec.sectionWidth}" height="${spec.sectionHeight}" alt="[^"]+" loading="lazy" decoding="async">[\\s\\S]*<figcaption`)
    );

    const introOrder = [
      'class="article-width article-hero-visual"',
      'class="article-learn"',
      'class="article-opening-questions"',
      'class="article-opening-summary"',
      'class="article-entry-actions',
      'class="article-toc"'
    ].map((marker) => html.indexOf(marker));
    assert.ok(introOrder.every((position) => position >= 0), `導入要素が不足しています：${spec.pageName}`);
    assert.deepEqual(introOrder, [...introOrder].sort((a, b) => a - b), `導入順が異なります：${spec.pageName}`);
    assert.equal((html.match(/class="article-opening-summary"/g) ?? []).length, 1);
    assert.doesNotMatch(html, /article-opening-answer|先にまとめると/);


    assert.match(html, /<details class="article-toc">[\s\S]*<summary>[\s\S]*目次[\s\S]*<\/summary>/);

    const stacks = [...html.matchAll(/<section class="article-entry-actions [^"]*article-action-stack[^"]*"[\s\S]*?<\/section>/g)]
      .map((match) => match[0]);
    assert.equal(stacks.length, 2, `共通2段CTAは上下2組です：${spec.pageName}`);
    for (const stack of stacks) {
      assert.equal((stack.match(/class="article-action-stack__row /g) ?? []).length, 2);
      assert.match(stack, /article-action-stack__row--internal/);
      assert.match(stack, /article-action-stack__row--affiliate affiliate-panel/);
      assert.match(stack, /class="article-action__link" href="\.\.\/simulator\/"/);
      assert.match(stack, /class="secondary-button affiliate-button"[^>]*data-route-source="article-(?:top|final)-affiliate"[^>]*disabled/);
      assert.match(stack, /広告・アフィリエイトを含みます．/);
    }
    const firstStack = stacks[0];
    assert.ok(
      firstStack.indexOf(`article-action-stack__row--${spec.topFirstRole}`) <
        firstStack.indexOf(`article-action-stack__row--${spec.topFirstRole === "internal" ? "affiliate" : "internal"}`),
      `上部CTAの主従順が異なります：${spec.pageName}`
    );
    assert.ok(stacks[1].indexOf("article-action-stack__row--internal") < stacks[1].indexOf("article-action-stack__row--affiliate"));

    const endingOrder = [
      'id="summary"',
      'class="article-entry-actions article-entry-actions--final article-action-stack',
      'class="article-sources"',
      'class="article-related"'
    ].map((marker) => html.indexOf(marker));
    assert.ok(endingOrder.every((position) => position >= 0));
    assert.deepEqual(endingOrder, [...endingOrder].sort((a, b) => a - b), `末尾順が異なります：${spec.pageName}`);
  }

  const disasterHtml = await readFile(new URL("../../site/pages/disaster.html", import.meta.url), "utf8");
  assert.equal((disasterHtml.match(/article-action-stack--safety/g) ?? []).length, 2);

  const css = await readFile(new URL("../../site/articles/styles/article.css", import.meta.url), "utf8");
  assert.match(css, /\.article-guide-page \.article-hero-visual img[\s\S]*width: 100%;[\s\S]*height: auto;/);
  assert.match(css, /@media \(min-width: 48rem\) \{[\s\S]*\.article-guide-page \.article-hero h1 \{[\s\S]*white-space: nowrap;/);
  assert.match(css, /\.article-action-stack__row--affiliate \{[^}]*border-left: 0\.35rem solid var\(--color-accent\);[^}]*background: #fffdf6;/);
  assert.doesNotMatch(css, /article-action-stack__row--affiliate[^}]*border-top: 0\.25rem|article-action-stack--safety \.affiliate-button/);
  assert.match(css, /\.article-action-stack \.article-action__link:focus-visible,[\s\S]*\.article-action-stack \.affiliate-button:focus-visible \{[^}]*outline: 3px solid var\(--color-focus\);/);
  assert.match(css, /@media \(max-width: 40rem\) \{[\s\S]*\.article-action-stack__row \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
});

test("ガイド5記事の目次は本文アンカーだけを参照し，関連記事は2～3件に絞る", async () => {
  for (const pageName of guidePageNames) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    const ids = new Set([...html.matchAll(/id="([^"]+)"/g)].map((match) => match[1]));
    const toc = html.match(/<(?:nav|details) class="article-toc"[\s\S]*?<\/(?:nav|details)>/)?.[0];
    assert.ok(toc, `目次がありません：${pageName}`);
    for (const match of toc.matchAll(/href="#([^"]+)"/g)) {
      assert.ok(ids.has(match[1]), `目次アンカーがありません：${pageName} → #${match[1]}`);
    }
    const related = html.match(/<section class="article-related">[\s\S]*?<\/section>/)?.[0];
    assert.ok(related, `関連記事がありません：${pageName}`);
    const linkCount = (related.match(/<a href=/g) ?? []).length;
    assert.ok(linkCount >= 2 && linkCount <= 3, `関連記事数が2～3件ではありません：${pageName}`);
  }
});

test("診断情報と運営ポリシーへ一般記事テンプレートを適用しない", async () => {
  for (const pageName of ["calculation-method.html", "policy.html"]) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.doesNotMatch(html, /article--guide|article-entry-actions|article-toc/);
  }
});

test("収支ガイドは判断要因に限定し，計算仕様を計算方法ページへ分離する", async () => {
  const guideHtml = await readFile(new URL("../../site/pages/electricity-sales.html", import.meta.url), "utf8");
  assert.match(guideHtml, /電気代削減は支出が減る効果，売電収入は余った電気を売って得る収入/);
  assert.match(guideHtml, /利益を保証しません/);
  assert.doesNotMatch(guideHtml, /内部パラメータ|再現仕様|backend|frontend|式 \(\d+\)|8,000円/);
  assert.equal((guideHtml.match(/class="caution-box"/g) ?? []).length, 1);
  assert.match(guideHtml, /class="notice-label">注意点<\/p>/);
  const lossCaution = guideHtml.match(/<section class="caution-box" id="loss-caution">[\s\S]*?<\/section>/)?.[0];
  assert.ok(lossCaution);
  assert.match(lossCaution, /20年間でも正味利益がマイナスになり得ます/);
  assert.match(lossCaution, /設置容量と見積価格を変え，太陽光のみと蓄電池併用を同じ条件で比較します/);
  assert.match(lossCaution, /導入を見送ることも妥当です/);
  assert.match(lossCaution, /停電への備えを重視する場合は，経済的な回収とは別の価値/);
  assert.match(lossCaution, /太陽光単独と蓄電池併用では停電時の制約が異なる/);
  assert.match(lossCaution, /必要な電力を供給できる設備構成かを施工会社へ確認/);
  assert.match(lossCaution, /赤字が解消することを意味しません/);
  assert.doesNotMatch(lossCaution, /必ず得|赤字解消|article-action-stack|affiliate-button/);
  assert.match(guideHtml, /東京都，4 kW，南向き，月間電気料金は未入力/);
  assert.match(guideHtml, /戸建て・4人以上世帯の地域平均（令和5年度）[^<]*関東甲信15,467円／月/);
  assert.match(guideHtml, /電気料金上昇率は比較用仮定として年1\.5％/);
  assert.equal(
    (guideHtml.match(/data-source-id="meti-residential-solar-(?:cost-2025|om-cost-2026)"/g) ?? []).length,
    1,
    "同一の調達価格等算定委員会PDFを参考文献へ重複掲載しません"
  );
  assert.match(guideHtml, /<h2>自分の条件で確かめる<\/h2>/);
  assert.match(guideHtml, /<h2>実際の設置費を確かめる<\/h2>/);
  assert.match(guideHtml, /class="guide-benchmark-page"/);
  assert.match(
    guideHtml,
    /class="article-width article-hero-visual"[\s\S]*article-solar-economics-hero\.webp" width="1734" height="907"[\s\S]*alt="[^"]+"/
  );
  assert.ok(
    guideHtml.indexOf('class="article-hero-visual"') < guideHtml.indexOf('class="article-learn"'),
    "アイキャッチは記事ヘッダーの直後に置きます"
  );

  const introductionOrder = [
    'class="article-learn"',
    'class="article-opening-questions"',
    'class="article-opening-summary"',
    'class="article-entry-actions article-entry-actions--diagnosis-primary article-action-stack"',
    'class="article-toc"'
  ].map((marker) => guideHtml.indexOf(marker));
  assert.ok(introductionOrder.every((position) => position >= 0));
  assert.deepEqual(introductionOrder, [...introductionOrder].sort((a, b) => a - b));
  for (const summaryHeading of ["得られる効果", "かかる費用", "収支が変わる条件"]) {
    assert.match(guideHtml, new RegExp(`<strong>${summaryHeading}<\\/strong>`));
  }


  assert.doesNotMatch(guideHtml, /<h2[^>]*>太陽光を考えるときに気になること<\/h2>/);
  assert.doesNotMatch(guideHtml, /<h2[^>]*>答えは，一つの数字だけでは決まりません<\/h2>/);
  assert.equal((guideHtml.match(/class="article-opening-summary"/g) ?? []).length, 1);
  assert.doesNotMatch(guideHtml, /article-opening-answer|先にまとめると/);
  assert.match(guideHtml, /<details class="article-toc">[\s\S]*<summary>[\s\S]*目次[\s\S]*<\/summary>/);

  const diagrams = [...guideHtml.matchAll(/<figure class="article-diagram [^"]+"[\s\S]*?<\/figure>/g)]
    .map((match) => match[0]);
  assert.equal(diagrams.length, 2);
  assert.match(diagrams[0], /class="article-diagram article-balance-illustration"/);
  assert.match(diagrams[0], /article-solar-economics-flow\.webp" width="1823" height="863"/);
  assert.match(diagrams[0], /電気代削減[\s\S]*売電収入[\s\S]*補助金[\s\S]*設置費[\s\S]*維持・交換費/);
  assert.match(diagrams[0], /20年間の正味利益/);
  assert.match(diagrams[1], /class="article-energy-flow__visual" aria-hidden="true"/);
  assert.match(diagrams[1], /太陽光パネル[\s\S]*自家消費[\s\S]*余剰売電/);
  assert.match(diagrams[1], /発電量 ＝ 自家消費量 ＋ 売電量/);
  for (const diagram of diagrams) {
    assert.match(diagram, /aria-labelledby="[^"]+" aria-describedby="[^"]+"/);
    assert.match(diagram, /class="article-diagram__accessible"/);
    assert.match(diagram, /<figcaption id="[^"]+">図[12]/);
  }
  assert.doesNotMatch(diagrams[1], /<img\b/);

  const suitability = guideHtml.match(/<section id="suitability">[\s\S]*?<\/section>/)?.[0];
  assert.ok(suitability);
  const suitabilityOrder = [
    "電気代が高い",
    "昼間の電力使用が多い",
    "設置費が低い，または補助金を利用できる",
    "日当たりのよい屋根に十分な容量を載せられる"
  ].map((marker) => suitability.indexOf(marker));
  assert.ok(suitabilityOrder.every((position) => position >= 0));
  assert.deepEqual(suitabilityOrder, [...suitabilityOrder].sort((a, b) => a - b));
  assert.match(suitability, /夜間中心の使用では効果が限られる/);
  assert.match(
    suitability,
    /<figure class="article-section-illustration"[^>]*>[\s\S]*article-solar-suitability\.webp" width="1693" height="929" alt="[^"]+" loading="lazy" decoding="async">[\s\S]*<figcaption[^>]*>昼間に発電した電気を家庭で使うと，電力会社から買う量を減らしやすくなります．<\/figcaption>/
  );
  assert.ok(
    suitabilityOrder.at(-1) < suitability.indexOf('class="article-section-illustration"'),
    "適性イラストは経済効果を得やすい4条件の後に置きます"
  );

  const actionStacks = [...guideHtml.matchAll(/<section class="article-entry-actions [^"]*article-action-stack"[\s\S]*?<\/section>/g)]
    .map((match) => match[0]);
  assert.equal(actionStacks.length, 2);
  for (const stack of actionStacks) {
    const internalPosition = stack.indexOf("article-action-stack__row--internal");
    const affiliatePosition = stack.indexOf("article-action-stack__row--affiliate");
    assert.ok(internalPosition >= 0 && affiliatePosition > internalPosition);
    assert.match(stack, /<h2>自分の条件で確かめる<\/h2>[\s\S]*はれ<span class="brand-term">トク<\/span>診断を始める/);
    assert.match(stack, /<h2>実際の設置費を確かめる<\/h2>[\s\S]*広告・アフィリエイトを含みます．[\s\S]*無料見積もりで確認/);
  }
  assert.equal((guideHtml.match(/<a class="article-action__link" href="\.\.\/simulator\/"/g) ?? []).length, 2);
  assert.equal((guideHtml.match(/無料見積もりで確認/g) ?? []).length, 2);
  assert.equal((guideHtml.match(/広告・アフィリエイトを含みます．/g) ?? []).length, 2);
  assert.doesNotMatch(guideHtml, /赤字の結果，回収できない結果および見送る判断もそのまま扱います．/);

  const householdResults = Object.fromEntries(
    ["almost_every_weekday", "almost_never"].map((daytimeOccupancy) => {
      const estimate = calculateEstimate(
        {
          prefectureCode: "13",
          monthlyElectricityBillYen: 15_467,
          systemCapacityKw: 4,
          detailConditions: { roof_orientation: "south" },
          daytimeOccupancy
        },
        publicData
      );
      return [daytimeOccupancy, {
        estimate,
        standard: estimate.scenarios.find((scenario) => scenario.scenario === "standard")
      }];
    })
  );
  const householdA = householdResults.almost_every_weekday;
  const householdB = householdResults.almost_never;
  assert.ok(householdA.standard);
  assert.ok(householdB.standard);
  for (const household of [householdA, householdB]) {
    const roofOrientation = household.estimate.input.detail_conditions.find(
      (condition) => condition.input_name === "roof_orientation"
    );
    assert.equal(roofOrientation?.value, "south");
    assert.equal(roofOrientation?.label, "南向き");
  }

  const comparisonRows = [
    [
      "平日昼間の在宅状況",
      householdA.estimate.input.daytime_occupancy.label,
      householdB.estimate.input.daytime_occupancy.label
    ],
    [
      "年間の自家消費量",
      formatArticleQuantity(householdA.estimate.energy.annual_self_consumed_kwh, " kWh"),
      formatArticleQuantity(householdB.estimate.energy.annual_self_consumed_kwh, " kWh")
    ],
    [
      "年間の売電量",
      formatArticleQuantity(householdA.estimate.energy.annual_exported_kwh, " kWh"),
      formatArticleQuantity(householdB.estimate.energy.annual_exported_kwh, " kWh")
    ],
    [
      "20年間の電気代削減",
      formatArticleQuantity(householdA.standard.total_electricity_savings_yen, "円"),
      formatArticleQuantity(householdB.standard.total_electricity_savings_yen, "円")
    ],
    [
      "20年間の売電収入",
      formatArticleQuantity(householdA.standard.total_sales_income_yen, "円"),
      formatArticleQuantity(householdB.standard.total_sales_income_yen, "円")
    ],
    [
      "20年間の正味利益",
      formatArticleQuantity(householdA.standard.profit_yen, "円"),
      formatArticleQuantity(householdB.standard.profit_yen, "円")
    ]
  ];
  for (const [label, valueA, valueB] of comparisonRows) {
    const expectedRow = `<tr><th>${label}</th><td data-label="家庭A">${valueA}</td><td data-label="家庭B">${valueB}</td></tr>`;
    assert.ok(guideHtml.includes(expectedRow), `${label}が現行の診断結果と一致しません`);
  }

  assert.match(
    guideHtml,
    new RegExp(`年間${formatArticleQuantity(
      householdA.estimate.energy.annual_self_consumed_kwh - householdB.estimate.energy.annual_self_consumed_kwh,
      " kWh"
    )}多く自家消費`)
  );
  assert.match(
    guideHtml,
    new RegExp(`売電収入が${formatArticleQuantity(
      householdB.standard.total_sales_income_yen - householdA.standard.total_sales_income_yen,
      "円"
    )}少ない`)
  );
  assert.match(
    guideHtml,
    new RegExp(`電気代削減が${formatArticleQuantity(
      householdA.standard.total_electricity_savings_yen - householdB.standard.total_electricity_savings_yen,
      "円"
    )}多く`)
  );
  assert.match(
    guideHtml,
    new RegExp(`正味利益は${formatArticleQuantity(
      householdA.standard.profit_yen - householdB.standard.profit_yen,
      "円"
    )}改善`)
  );
  assert.match(
    guideHtml,
    new RegExp(`東京都補助金${formatArticleQuantity(householdA.standard.subsidy_yen, "円")}`)
  );

  for (const pageName of guidePageNames.filter((pageName) => pageName !== "electricity-sales.html")) {
    const otherGuideHtml = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.doesNotMatch(otherGuideHtml, /guide-benchmark-page|article--benchmark/);
  }

  const guideCss = await readFile(new URL("../../site/articles/styles/article.css", import.meta.url), "utf8");
  assert.match(guideCss, /\.guide-benchmark-page \.article-hero h1/);
  assert.match(guideCss, /font-size: clamp\(2rem, 3\.25vw, 2\.5rem\)/);
  assert.match(guideCss, /@media \(min-width: 48rem\) \{[\s\S]*\.guide-benchmark-page \.article-hero h1 \{[\s\S]*white-space: nowrap;/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-hero-visual img[\s\S]*height: auto;/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-entry-route h2,[\s\S]*\.guide-benchmark-page \.article-entry-route h3/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-learn__checks/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-balance-illustration img/);
  assert.match(guideCss, /\.article-toc summary:focus-visible/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-energy-flow__visual/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-energy-flow__arrow::before \{[\s\S]*content: "↓";/);
  assert.match(guideCss, /\.article-action-stack__row \{[\s\S]*grid-template-columns: minmax\(0, 1fr\) minmax\(13\.5rem, 15rem\);/);
  assert.match(guideCss, /\.article-action-stack \.article-action__link,[\s\S]*\.article-action-stack \.affiliate-button \{[^}]*min-height: 3\.4rem;[^}]*font-size: 0\.95rem;/);
  assert.match(guideCss, /@media \(max-width: 40rem\) \{[\s\S]*\.article-action-stack__row \{[\s\S]*grid-template-columns: minmax\(0, 1fr\);/);
  assert.match(guideCss, /\.guide-benchmark-page \.article-section-illustration img \{[\s\S]*width: 100%;[\s\S]*height: auto;/);

  const mainCss = await readFile(new URL("../../site/shared/styles/main.css", import.meta.url), "utf8");
  assert.match(mainCss, /\.secondary-button \{[^}]*border: 1px solid var\(--color-primary\);[^}]*color: var\(--color-primary-dark\);[^}]*background: #fff;/);
  assert.match(mainCss, /\.affiliate-button \{[^}]*color: #fff;[^}]*background: var\(--color-affiliate\);/);

  const grandDesign = await readFile(new URL("../../site/docs/グランドデザイン.md", import.meta.url), "utf8");
  const screenDesign = await readFile(new URL("../../site/docs/画面設計.md", import.meta.url), "utf8");
  assert.match(grandDesign, /#### CTA色の役割[\s\S]*内部primaryは濃緑の塗りと白文字[\s\S]*内部secondaryは緑の枠と濃緑の文字[\s\S]*広告・アフィリエイトは黄土色の塗りと白文字/);
  assert.match(screenDesign, /CTA色の役割は\[グランドデザイン\]\(グランドデザイン\.md#cta色の役割\)を正本とする/);
  assert.match(screenDesign, /末尾では，内部primaryの診断，広告・アフィリエイトの無料見積もりの順に，導入直後と同じ共通2段CTA（`\.article-action-stack`）を再利用する/);
  assert.doesNotMatch(screenDesign, /末尾では記事を理解した後の選択肢として，外部見積もりCTAを1件置く/);
  assert.doesNotMatch(screenDesign, /まとめ→末尾の見積もりCTA→/);
  assert.match(screenDesign, /#### 記事デザイン方針/);
  assert.doesNotMatch(screenDesign, /記事デザイン方針（仮）|「仮」は/);
  assert.match(screenDesign, /`site\/pages\/electricity-sales\.html`を一般向け記事の基準実装/);
  assert.match(screenDesign, /タイトル・説明・対象地域／年度／最終確認日→内容を示すタイトル画像→通常段落の概要→読者の疑問→通常段落の冒頭結論→診断・見積もり共通縦2段CTA→折りたたみ目次/);
  assert.match(screenDesign, /概要と冒頭結論は通常段落とし，チェックリストや「先にまとめると」の独立カードにしない/);
  assert.match(screenDesign, /概要，冒頭結論および末尾まとめにも通常段落を用い，カードとして残すのは診断・見積もり等の重要導線に限る/);
  assert.doesNotMatch(screenDesign, /→縦のチェックリスト→|→小さな先取り結論→/);
  assert.match(screenDesign, /PCでは文意と無関係な位置で改行させない[\s\S]*`h2`には太い深緑の左線[\s\S]*`h3`にはそれより弱い灰色の左線/);
  assert.match(screenDesign, /段落ごとのカード化を避ける/);
  assert.match(screenDesign, /生活者向け図版[\s\S]*数式の図解，意味のない装飾/);
  assert.match(screenDesign, /記事末尾は「通常段落のまとめ→診断・見積もり共通縦2段CTA→控えめな出典→関連記事2～3件」の順/);
  assert.match(screenDesign, /`site\/solar\/index\.html`を一覧の基準実装/);
  assert.match(screenDesign, /「まず読む3本」を最初に示し，画像，ジャンル，タイトルおよび短い説明を一体化したカード/);
  assert.match(screenDesign, /公開状態の実在記事だけを表示し，記事が少数の段階では検索，ランキングおよび複雑な絞り込みを設けない/);
  assert.match(screenDesign, /`site\/solar\/data\/articles\.json`を単一データ源/);

  const articleDataJs = await readFile(new URL("../../site/articles/src/article-data.js", import.meta.url), "utf8");
  assert.match(articleDataJs, /details\.article-toc/);
  assert.match(articleDataJs, /matchMedia\("\(min-width: 48rem\)"\)/);

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
  assert.match(html, /2026年9月1日時点/);
  assert.match(html, /確認できない重複は加算しません/);
  assert.match(html, /予算終了，受付期間，併用可否，住宅・設備条件/);
  assert.match(html, /未収録または確認日後に更新された制度/);
  assert.match(html, /標準蓄電池は，20年間交換せず使用する前提です/);
  assert.match(html, /15年目から16年目にも容量や充電残量をリセットしません/);
  assert.match(html, /製品の20年寿命または保証を確認した事実ではありません/);
  assert.match(html, /15年後60％は容量保証の下限を用いた保守的な感度パス/);
  assert.match(html, /16～20年目は同じ年間保持係数を延長する数学的外挿/);
  assert.match(html, /公称容量は電池の名目容量，実効容量は製品が定める初期の使用範囲/);
  assert.match(html, /出力は同時に供給できる電力の大きさで，容量とは別/);
  assert.match(html, /容量保証の下限，保証期間，想定使用期間およびサイクル期待寿命も同一視しません/);
  assert.match(html, /参考：従量電灯B/);
  assert.match(html, /40\.49円は300 kWh超過分だけに適用し，診断の全使用量へ一律に掛けない/);
  assert.match(html, /2026年度再エネ賦課金/);
  assert.match(html, /2026年5月検針分～2027年4月検針分/);
  assert.match(html, /2025年度下半期・2026年度認定，住宅用10 kW未満，調達期間10年間/);
  assert.match(html, /地域・契約条件付き例．全国共通価格ではない/);
  assert.match(html, /20年間の収入総額は計算結果として返された値を表示し，四捨五入後の内訳から足し直しません/);
  assert.match(html, /戸建て・4人以上世帯の地域平均（令和5年度）/);
  assert.match(html, /関東甲信15,467円／月/);
  assert.match(html, /手入力した値またはURLの<code>monthlyElectricityBill<\/code>がある場合は，その値を優先します/);
  assert.match(html, /点検3\.8万円／回とパワーコンディショナ交換38\.4万円／回は，経済産業省の2026年資料にある住宅用5 kW設備の業界ヒアリング値/);
  assert.match(html, /税区分は未確認/);
  assert.match(html, /4年ごとの点検と15年目の交換は診断上のサービス評価仮定/);
  assert.match(html, /資料自体は交換年を15年目と定めていません/);
  assert.equal((html.match(/data-source-id=/g) ?? []).length, 16);
  assert.equal((html.match(/参照日：/g) ?? []).length, 22);
});

test("診断内の計算根拠リンクは1つだけで正式名称を使う", async () => {
  const html = await readFile(new URL("../../site/simulator/index.html", import.meta.url), "utf8");
  assert.equal((html.match(/href="\.\.\/pages\/calculation-method\.html"/g) ?? []).length, 1);
  assert.match(html, />計算方法・使用データ<\/a>/);
});
