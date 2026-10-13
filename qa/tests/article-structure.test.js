import {runInNewContext} from 'node:vm';
import {prepareSubsidyData} from '../../data/src/scheme-adapter.js';
import {receiveDiagnosticDisplayRecords} from '../../site/simulator/src/diagnostic-display-record.js';
import {appendHareDisplayCommon, appendHareDisplayBranch} from '../../site/shared/hare-display-record.js';
import { diagnosticTrialSourceTexts, diagnosticDetailNotes } from '../../site/simulator/src/retained-diagnostic-display.js';
import { QUOTE_ACTION } from '../../site/shared/fixed-quote-bar.js';
import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateEstimate } from "../../site/simulator/src/calculator.js";

const publicData = JSON.parse(
  await readFile(new URL("../../data/input/public-data.json", import.meta.url), "utf8")
);

const guideSlugs = {"electricity-sales": "solar-economics", "subsidies": "subsidies", "disaster": "disaster", "quotes-contractors": "quotes-contractors"};
const readPage = name => readFile(new URL(`../../site/${guideSlugs[name] ? `guides/${guideSlugs[name]}/index.html` : `pages/${name}.html`}`, import.meta.url), "utf8");
const prose = html => html.replace(/<[^>]+>/g, "");
const numberText = html => html.replace(/<span\b[^>]*data-guide-number[^>]*>([^<]*)<\/span>/g, '$1');

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
