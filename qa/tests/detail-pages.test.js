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
  const html = await readFile(new URL("../../site/index.html", import.meta.url), "utf8");
  for (const pageName of pageNames) {
    assert.match(html, new RegExp(`pages/${pageName.replace(".", "\\.")}`));
  }
});
