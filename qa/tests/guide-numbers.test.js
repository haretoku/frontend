import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import { calculateEstimate } from '../../site/simulator/src/calculator.js';
import { economicsExample, economicsExampleInput, guideNumberValues, tieredEnergyCharge } from '../../site/articles/src/guide-numbers.js';

const data = JSON.parse(await readFile(new URL('../../data/input/public-data.json', import.meta.url)));
const refs = JSON.parse(await readFile(new URL('../../site/articles/data/guide-reference-examples.json', import.meta.url)));

test('記事の補助金なし代表例は実計算の運用収入・費用を保持し，補助額だけを除く', () => {
  const original = calculateEstimate(economicsExampleInput, data).scenarios;
  const examples = economicsExample(data);
  for (const [i, s] of examples.entries()) {
    const o = original[i];
    assert.equal(s.subsidy_yen, 0);
    assert.equal(s.profit_yen, o.profit_yen - o.subsidy_yen);
    assert.equal(s.net_initial_outlay_yen, o.gross_installation_cost_yen);
    assert.equal(s.total_revenue_yen, o.total_revenue_yen);
    for (const [j, row] of s.annual_cash_flows.entries()) {
      assert.equal(row.cumulative_cash_flow_yen, o.annual_cash_flows[j].cumulative_cash_flow_yen - o.subsidy_yen);
    }
  }
  assert.equal(examples.find(s => s.scenario === 'standard').payback_year, 15);
});

test('料金段階をまたぐ削減と余剰売電を別に計算し，単価変更を連動させる', () => {
  assert.equal(tieredEnergyCharge(0, refs.tepcoB), 0);
  assert.equal(tieredEnergyCharge(120, refs.tepcoB), 3576);
  assert.equal(tieredEnergyCharge(301, refs.tepcoB), 3576 + 180 * 36.4 + 40.49);
  const values = guideNumberValues(data, refs);
  assert(Math.abs(values['savings.monthly'] - (3 * 36.4 + 47 * 29.8)) < 1e-8);
  assert.equal(values['savings.sales'], 100 * 8.5);
  const changed = structuredClone(refs);
  changed.tepcoB.ratesYenPerKwh = [31, 38, 42];
  const next = guideNumberValues(data, changed);
  assert(Math.abs(next['savings.monthly'] - (3 * 38 + 47 * 31)) < 1e-8);
  assert.equal(next['savings.sales'], values['savings.sales']);
  assert(next['savings.longTerm'] > values['savings.longTerm']);
});

test('資料の引用値・仮例と現行の診断費用を混同しない', () => {
  const changed = structuredClone(data);
  changed.calculation.installation_cost_yen_per_kw_by_housing_age.existing += 10000;
  const before = guideNumberValues(data, refs), after = guideNumberValues(changed, refs);
  assert.equal(after['cost.existing4'] - before['cost.existing4'], 40000);
  for (const key of ['reference.existing2025', 'reference.qCells', 'quote.a', 'subsidy.tokyoGrant', 'subsidy.rateExampleGrant']) assert.equal(after[key], before[key], key);
});

test('全数値の有限性と生成済みHTML・記録の一致を確認する', () => {
  assert(Object.values(guideNumberValues(data, refs)).every(Number.isFinite));
  execFileSync(process.execPath, ['qa/sync-guide-numbers.mjs', '--check'], {cwd: new URL('../..', import.meta.url), stdio: 'pipe'});
});

test('数値指定を生成漏れなく処理し，補足要素のタグを閉じる', async () => {
  const manifest = JSON.parse(await readFile(new URL('../artifacts/guide-number-bindings.json', import.meta.url)));
  for (const page of manifest.inventory) {
    const path = '../../site' + page.route + (page.route.endsWith('/') ? 'index.html' : '');
    const html = await readFile(new URL(path, import.meta.url), 'utf8');
    assert.equal((html.match(/data-guide-number=/g) ?? []).length, page.bindings.length, page.route);
    assert.equal((html.match(/<span\b/g) ?? []).length, (html.match(/<\/span>/g) ?? []).length, page.route);
  }
});

test('調査記事は日常更新と分離し，ガイド一覧・静的ビルドに接続する', async () => {
  const catalog = JSON.parse(await readFile(new URL('../../site/solar/data/articles.json', import.meta.url)));
  const news = catalog.filter(a => a.articleType === 'news');
  assert.equal(news.length, 1);
  assert.equal(news[0].href, '/guides/electricity-support-end/');
  assert.equal(news[0].publishedAt, '2026-10-11');
  const html = await readFile(new URL('../../site/guides/electricity-support-end/index.html', import.meta.url), 'utf8');
  assert(html.includes('公開日 <time datetime="' + news[0].publishedAt + '">'));
  assert(html.includes('<meta name="robots" content="index,follow">'));
  const manifest = JSON.parse(await readFile(new URL('../artifacts/guide-number-bindings.json', import.meta.url)));
  assert(!manifest.inventory.some(p => p.route === news[0].href));
  const build = await readFile(new URL('../../.config/vite.pages.config.js', import.meta.url), 'utf8');
  assert(build.includes('"electricity-support-end"'));
});
