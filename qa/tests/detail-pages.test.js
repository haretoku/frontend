import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";


const pageNames = [
  "calculation-method.html",
  "costs-maintenance.html",
  "electricity-sales.html",
  "subsidies.html",
  "disaster.html",
  "quotes-contractors.html"
];

test("6つの詳細ページが共通構造を持つ", async () => {
  for (const pageName of pageNames) {
    const html = await readFile(new URL(`../../site/pages/${pageName}`, import.meta.url), "utf8");
    assert.match(html, /<h2>結論<\/h2>/);
    assert.match(html, /\.\.\/articles\/styles\/article\.css/);
    assert.match(html, /\.\.\/articles\/src\/article-data\.js/);
    assert.match(html, /class="source-list"/);
    assert.match(html, /href="\.\.\/"/);
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
    assert.match(html, /data-lifecycle-cost-total/);
    assert.match(html, /574,000円/);
  }
  assert.match(calculationHtml, /電気料金削減＋売電収入－実質初期負担－維持・交換費/);
  assert.match(costsHtml, /突発的な故障・修理，発電量の経年劣化，撤去，保険，借入および税金は含みません/);
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
