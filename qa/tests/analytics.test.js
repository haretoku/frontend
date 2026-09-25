import test from "node:test";
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import { analyticsAllowed, cleanReferrer, createAnalytics } from "../../site/shared/analytics-core.js";
import { analyticsConfig } from "../../site/shared/analytics-config.js";

const configured = { enabled: true, enhancedMeasurementDisabled: true, measurementId: "G-TEST123456" };
function fixture(href, config = configured, productionBuild = true, referrer = "https://haretoku.jp/pages/subsidies.html?private=CANARY#CANARY") {
  const scripts = [], handlers = {};
  const window = { location: { href } };
  const document = {
    referrer,
    createElement(tag) { assert.equal(tag, "script"); return {}; },
    head: { append(script) { scripts.push(script); } },
    addEventListener(type, fn) { handlers[type] = fn; }
  };
  const analytics = createAnalytics({ config, productionBuild, window, document });
  return { analytics, window, scripts, handlers, commands: () => (window.dataLayer ?? []).map(args => [...args]) };
}
const events = f => f.commands().filter(c => c[0] === "event");

test("未設定ID・無効設定・拡張計測未確認はGoogle読込・キュー・イベントを作らない", () => {
  for (const config of [ { ...configured, measurementId: "" }, { ...configured, measurementId: "G-INVALID?x=1" }, { ...configured, enabled: false }, { ...configured, enhancedMeasurementDisabled: false }]) {
    const f = fixture("https://haretoku.jp/simulator/?private=CANARY", config);
    assert.equal(f.analytics.active, false);
    assert.equal(f.analytics.diagnosisComplete(), false);
    assert.equal(f.window.dataLayer, undefined);
    assert.deepEqual(f.scripts, []);
    assert.deepEqual(f.handlers, {});
  }
});

test("localhost・dev・preview・www・非HTTPS・偽装host・404では計測しない", () => {
  for (const url of ["http://localhost:5173/", "http://127.0.0.1:4173/", "https://haretoku.github.io/", "https://www.haretoku.jp/", "http://haretoku.jp/", "https://haretoku.jp.evil.example/", "https://haretoku.jp:444/", "https://haretoku.jp/__local/review/", "https://haretoku.jp/404.html", "https://haretoku.jp/pages/costs-maintenance.html"]) {
    const f = fixture(url, analyticsConfig);
    assert.equal(f.analytics.active, false, url);
    assert.equal(f.window.dataLayer, undefined);
    assert.deepEqual(f.handlers, {});
    assert.deepEqual(f.scripts, []);
  }
  assert.equal(analyticsAllowed(analyticsConfig, "https://haretoku.jp/", false), false);
  assert.equal(analyticsAllowed(analyticsConfig, "https://haretoku.jp/", true), true);
  assert.equal(analyticsAllowed(configured, "https://haretoku.jp/", undefined), false);
});

test("URL・referrerのクエリー/ハッシュと任意title/utmをコマンドに含めない", () => {
  const f = fixture("https://haretoku.jp/simulator/?prefecture=CANARY&monthlyElectricityBill=CANARY&utm_source=CANARY#CANARY");
  f.analytics.diagnosisComplete();
  assert.equal(f.scripts.length, 1);
  assert.equal(f.scripts[0].src, "https://www.googletagmanager.com/gtag/js?id=G-TEST123456");
  assert.equal(f.scripts[0].referrerPolicy, "no-referrer");
  assert(!JSON.stringify(f.commands()).includes("CANARY"));
  for (const command of events(f)) {
    assert.equal(command[2].page_location, "https://haretoku.jp/simulator/");
    assert.equal(command[2].page_referrer, "https://haretoku.jp/pages/subsidies.html");
    assert.deepEqual(Object.keys(command[2]).sort(), ["page_id", "page_location", "page_referrer", "page_title", "send_to"].sort());
  }
  assert.equal(cleanReferrer("https://search.example/CANARY?q=CANARY#CANARY"), "https://search.example");
  assert.equal(cleanReferrer("javascript:CANARY"), "");
  assert.equal(cleanReferrer("invalid"), "");
});

test("広告関連の同意を拒否し，自動page_viewとsignalsを無効化する", () => {
  const f = fixture("https://haretoku.jp/");
  const consent = f.commands()[0];
  assert.deepEqual(consent, ["consent", "default", { analytics_storage: "granted", ad_storage: "denied", ad_user_data: "denied", ad_personalization: "denied" }]);
  const config = f.commands().find(c => c[0] === "config")[2];
  assert.equal(config.send_page_view, false);
  assert.equal(config.allow_google_signals, false);
  assert.equal(config.allow_ad_personalization_signals, false);
  assert.equal(config.campaign_source, "");
  assert.deepEqual(events(f).map(c => c[1]), ["page_view"]);
});

test("記事閲覧・診断リンクだけを計測し無効な見積もりや外部リンクを計測しない", () => {
  const f = fixture("https://haretoku.jp/pages/subsidies.html");
  function click(href, extra = {}) {
    f.handlers.click({ button: 0, target: { closest: () => ({ href, hasAttribute: () => false, getAttribute: () => null }) }, ...extra });
  }
  assert.deepEqual(events(f).map(c => c[1]), ["page_view", "article_view"]);
  click("https://outside.example/simulator/");
  click("https://haretoku.jp/pages/quotes-contractors.html");
  click("https://haretoku.jp/simulator/", { defaultPrevented: true });
  assert.equal(events(f).length, 2);
  click("https://haretoku.jp/simulator/?private=CANARY#CANARY");
  click("https://haretoku.jp/simulator/");
  assert.deepEqual(events(f).map(c => c[1]), ["page_view", "article_view", "article_diagnosis_click"]);
  assert(!JSON.stringify(f.commands()).includes("CANARY"));
  assert.equal(f.analytics.diagnosisComplete(), false);
});

test("最初の有効結果だけを記録し再計算・履歴変更で完了を増やさない", () => {
  const f = fixture("https://haretoku.jp/simulator/?private=CANARY");
  assert.deepEqual(events(f).map(c => c[1]), ["page_view"]);
  assert.equal(f.analytics.diagnosisComplete(), true);
  f.window.location.href = "https://haretoku.jp/simulator/?private=CHANGED#CHANGED";
  assert.equal(f.analytics.diagnosisComplete(), false);
  assert.equal(f.analytics.diagnosisComplete(), false);
  assert.deepEqual(events(f).map(c => c[1]), ["page_view", "diagnosis_complete"]);
  assert(!JSON.stringify(f.commands()).includes("CHANGED"));
});

test("公開9ページだけに入口があり結果描画成功後にだけ完了を通知する", async () => {
  const pages = ["index.html", "solar/index.html", "simulator/index.html", ...["electricity-sales", "subsidies", "disaster", "quotes-contractors", "policy", "calculation-method"].map(n => `pages/${n}.html`)];
  for (const page of pages) {
    const html = await readFile(new URL(`../../site/${page}`, import.meta.url), "utf8");
    assert.equal((html.match(/src="(?:\.\.\/)?shared\/analytics\.js"/g) ?? []).length, 1, page);
  }
  const app = await readFile(new URL("../../site/simulator/src/app.js", import.meta.url), "utf8");
  assert.equal((app.match(/if \(profitConfirmed\) recordDiagnosisComplete\(\);/g) ?? []).length, 1);
  assert(app.indexOf("elements.result.hidden = false;") < app.indexOf("if (profitConfirmed) recordDiagnosisComplete();"));
  const policy = await readFile(new URL("../../site/pages/policy.html", import.meta.url), "utf8");
  assert(policy.includes(`data-analytics-policy="${analyticsConfig.enabled ? "enabled" : "disabled"}"`));
});
