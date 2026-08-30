import assert from "node:assert/strict";
import { access, readFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import test from "node:test";
import { fileURLToPath } from "node:url";


const root = fileURLToPath(new URL("..", import.meta.url));
const htmlPaths = [
  resolve(root, "index.html"),
  resolve(root, "pages/calculation-method.html"),
  resolve(root, "pages/costs-maintenance.html"),
  resolve(root, "pages/electricity-sales.html"),
  resolve(root, "pages/subsidies.html"),
  resolve(root, "pages/disaster.html"),
  resolve(root, "pages/quotes-contractors.html")
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
    ? resolve(root, pathPart.slice(1))
    : resolve(dirname(pagePath), pathPart);
  if (pathPart.endsWith("/") || target === root) {
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
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.match(html, /<label for="prefecture">/);
  assert.match(html, /<select id="prefecture"[^>]*required>/);
  assert.match(html, /<label for="monthly-electricity-bill">/);
  assert.match(html, /<input[\s\S]*?id="monthly-electricity-bill"[\s\S]*?min="0"/);
  assert.match(html, /id="form-message"[^>]*role="status"[^>]*aria-live="polite"/);
});

test("結果の3段階すべてに見積もり理由と広告表示がある", async () => {
  const html = await readFile(resolve(root, "index.html"), "utf8");
  assert.equal((html.match(/class="estimate-cta"/g) ?? []).length, 3);
  assert.equal((html.match(/class="advertising-label"/g) ?? []).length, 3);
  assert.equal((html.match(/class="secondary-button" type="button" disabled/g) ?? []).length, 3);
  assert.match(html, /正確な採算には，屋根や施工条件を反映した見積もりが必要/);
  assert.match(html, /広告・アフィリエイト/);
  assert.match(html, /得にならない場合も，結果をそのまま表示/);
  assert.match(html, /長期利益または補助金の適用を保証するものではありません/);
});

test("詳細ページの動的出典IDが公開メタデータに存在する", async () => {
  const metadata = JSON.parse(await readFile(resolve(root, "data/metadata.json"), "utf8"));
  const sourceIds = new Set(metadata.sources.map((source) => source.source_id));
  for (const pagePath of htmlPaths.slice(1)) {
    const html = await readFile(pagePath, "utf8");
    for (const sourceId of attributeValues(html, "data-source-id")) {
      assert.ok(sourceIds.has(sourceId), `出典IDがありません：${sourceId}`);
    }
  }
});
