import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";


const repositoryRoot = fileURLToPath(new URL("../..", import.meta.url));
const siteRoot = resolve(repositoryRoot, "site");
const htmlPaths = [
  resolve(siteRoot, "index.html"),
  resolve(siteRoot, "pages/calculation-method.html"),
  resolve(siteRoot, "pages/costs-maintenance.html"),
  resolve(siteRoot, "pages/electricity-sales.html"),
  resolve(siteRoot, "pages/subsidies.html"),
  resolve(siteRoot, "pages/disaster.html"),
  resolve(siteRoot, "pages/quotes-contractors.html")
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
  const html = await readFile(resolve(siteRoot, "index.html"), "utf8");
  assert.match(html, /<label for="prefecture">/);
  assert.match(html, /<select id="prefecture"[^>]*required>/);
  assert.match(html, /<label for="monthly-electricity-bill">/);
  assert.match(html, /<input[\s\S]*?id="monthly-electricity-bill"[\s\S]*?min="0"/);
  assert.match(html, /id="form-message"[^>]*role="status"[^>]*aria-live="polite"/);
  assert.match(html, /data-calculator-collapsed[^>]*hidden/);
  assert.match(html, /data-change-conditions/);
  assert.match(html, /data-result-condition/);
});

test("結果は主要結論，単一の見積もり導線，段階的開示の順である", async () => {
  const html = await readFile(resolve(siteRoot, "index.html"), "utf8");
  assert.equal((html.match(/class="estimate-cta"/g) ?? []).length, 1);
  assert.equal((html.match(/class="advertising-label"/g) ?? []).length, 1);
  assert.equal((html.match(/class="secondary-button" type="button" disabled/g) ?? []).length, 1);
  assert.equal((html.match(/<details class="panel disclosure-panel"/g) ?? []).length, 2);
  assert.match(html, /data-result-payback/);
  assert.match(html, /利益の内訳を見る/);
  assert.match(html, /計算の前提・根拠を見る/);
  assert.match(html, /実際の屋根・施工条件を反映した採算は，見積もりで確認できます/);
  assert.match(html, /広告・アフィリエイト/);
  assert.match(html, /得にならない場合も，結果をそのまま表示/);
  assert.match(html, /長期利益または補助金の適用を保証するものではありません/);
  assert.match(html, /<span class="hero-title__chunk">太陽光，<\/span><span class="hero-title__chunk">結局いくら得？<\/span>/);
  assert.ok(html.indexOf("data-result-economic-benefit") < html.indexOf("利益の内訳を見る"));
  assert.ok(html.indexOf("class=\"estimate-cta\"") < html.indexOf("利益の内訳を見る"));
  assert.ok(html.indexOf("利益の内訳を見る") < html.indexOf("計算の前提・根拠を見る"));
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
