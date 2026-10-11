import { readFile, writeFile, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { guideNumberValues, formatGuideNumber, economicsExampleInput } from '../site/articles/src/guide-numbers.js';

const root = new URL('../', import.meta.url);
const checkOnly = process.argv.includes('--check');
const dataText = await readFile(new URL('data/input/public-data.json', root), 'utf8');
const metadataText = await readFile(new URL('data/input/metadata.json', root), 'utf8');
const referenceText = await readFile(new URL('site/articles/data/guide-reference-examples.json', root), 'utf8');
const data = JSON.parse(dataText);
const metadata = JSON.parse(metadataText);
if (data.data_version !== metadata.data_version || data.schema_version !== metadata.schema_version) {
  throw Error('記事生成の公開データとメタデータの版が一致しません．');
}
const values = guideNumberValues(data, JSON.parse(referenceText));
const routes = (await readdir(new URL('site/guides/', root), { withFileTypes: true }))
  .filter(d => d.isDirectory() && d.name !== 'electricity-support-end').map(d => `site/guides/${d.name}/index.html`);
routes.push('site/pages/calculation-method.html');
const inventory = [];
for (const route of routes) {
  const path = new URL(route, root);
  let original = await readFile(path, 'utf8');
  const bindings = [];
  const declared = [...original.matchAll(/data-guide-number="([^"]+)"/g)];
  for (const [,key] of declared) if (!(key in values)) throw Error(`未定義の記事数値：${route} ${key}`);
  const result = original.replace(/(<(span|text|strong)\b[^>]*data-guide-number="([^"]+)"[^>]*>)([^<]*)(<\/\2>)/g,
    (match, opening, tag, key, old, closing) => {
      if (!(key in values)) throw Error(`未定義の記事数値：${route} ${key}`);
      const format = opening.match(/data-guide-format="([^"]+)"/)?.[1] ?? 'number';
      const text = formatGuideNumber(values[key], format);
      bindings.push({ key, format, value: values[key], text });
      const prefix = opening.match(/data-guide-prefix="([^"]+)"/)?.[1] ?? '';
      const suffix = opening.match(/data-guide-suffix="([^"]+)"/)?.[1] ?? '';
      return opening + prefix + text + suffix + closing;
    }).replace(/<img\b[^>]*data-guide-alt="cashflow"[^>]*>/g, tag => {
      const alt = `東京都・既存住宅・南向き4 kW・昼間在宅・補助金なし．標準シナリオの元手回収は約${values['economics.payback']}年，${values['model.years']}年後の収支は${formatGuideNumber(values['economics.profit'], 'approx-man')}．`;
      return tag.replace(/alt="[^"]*"/, `alt="${alt}"`);
    });
  const final = result.replace(/(<span\b[^>]*data-guide-version[^>]*>)[^<]*(<\/span>)/g,
    `$1${data.data_version}$2`);
  if (bindings.length !== declared.length) throw Error(`数値の指定に未対応の構造・入れ子があります：${route}`);
  if (checkOnly && final !== original) throw Error(`記事数値の再生成が必要です：${route}`);
  if (!checkOnly && final !== original) await writeFile(path, final);
  if (bindings.length) inventory.push({ route: '/' + route.replace(/^site\//, '').replace(/index\.html$/, ''), bindings });
}
const hash = text => createHash('sha256').update(text).digest('hex');
const output = JSON.stringify({ dataVersion: data.data_version, schemaVersion: data.schema_version,
  publicDataSha256: hash(dataText), metadataSha256: hash(metadataText), referenceSha256: hash(referenceText),
  modelSha256: hash(await readFile(new URL('site/articles/src/guide-numbers.js', root), 'utf8')),
  representativeInput: economicsExampleInput, subsidyPolicy: 'excluded_from_representative_economics',
  frozenResearch: { route: '/guides/electricity-support-end/', evidence: 'qa/artifacts/support-shock-calculation.json',
    policy: '調査時点のモデル・入力SHAと結果を固定し，現行データへの自動同期から除外する．' },
  inventory }, null, 2) + '\n';
const manifest = new URL('qa/artifacts/guide-number-bindings.json', root);
if (checkOnly) {
  if (await readFile(manifest, 'utf8') !== output) throw Error('記事数値の版・生成記録を更新してください．');
} else await writeFile(manifest, output);
console.log(JSON.stringify({ mode: checkOnly ? 'check' : 'sync', pages: inventory.length,
  bindings: inventory.reduce((sum, page) => sum + page.bindings.length, 0), dataVersion: data.data_version }));
