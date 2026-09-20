import { readFile, writeFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { createHash } from 'node:crypto';
import { loadReviewData } from './plugin.mjs';

export async function buildStandalone() {
  const data = await loadReviewData();
  const [template, css, model, view, source] = await Promise.all([
    readFile(new URL('./index.html', import.meta.url), 'utf8'),
    readFile(new URL('./styles.css', import.meta.url), 'utf8'),
    readFile(new URL('./model.js', import.meta.url), 'utf8'),
    readFile(new URL('./view.js', import.meta.url), 'utf8'),
    readFile(new URL('../../../../backend/data/candidates/municipal-subsidies/2026-kanto-coverage-audit.json', import.meta.url), 'utf8')
  ]);
  const audit = JSON.parse(source);
  if (JSON.stringify(audit.reclassification_audit) !== JSON.stringify(data.audit)
    || JSON.stringify(audit.records.filter(r=>r.reclassification).map(r=>r.reclassification)) !== JSON.stringify(data.records.map(r=>r.reclassification))) {
    throw new Error('読み込み中に監査正本が更新されました．再書き出ししてください．');
  }
  const fetchBlock = /  const response = await fetch\('data\.json', \{ cache: 'no-store' \}\);\r?\n  if \(!response\.ok\) throw new Error\('監査正本を取得できません．'\);\r?\n  const \{ records: sourceRecords, audit, report \} = await response\.json\(\);/;
  if (!fetchBlock.test(view)) throw new Error('表示データの読込構造が変更されています．');
  const script = 'const snapshot = ' + JSON.stringify(data).replace(/</g, '\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029') + ';\n'
    + model.replace(/^export /gm, '') + '\n'
    + view.replace(/^import .*?;\r?\n/, '').replace(fetchBlock, '  const { records: sourceRecords, audit, report } = snapshot;');
  const savedAt = new Intl.DateTimeFormat('ja-JP', {dateStyle:'short',timeStyle:'medium',timeZone:'Asia/Tokyo'}).format(new Date());
  const sourceHash = createHash('sha256').update(source).digest('hex');
  let html = template.replace('<link rel="stylesheet" href="styles.css"><script type="module" src="view.js"></script>', `<style>${css}</style>`)
    .replace('<a href="../prefecture-review/">47都道府県の補助金検収表</a>', '47都道府県の検収表への移動はローカル版で利用できます．')
    .replace('</h1>', `</h1><p>保存版：${savedAt}（日本時間）．自動更新されません．公式リンクの閲覧には通信が必要です．</p>`)
    .replace('href="source.json"', `href="data:application/json;base64,${Buffer.from(source).toString('base64')}"`)
    .replace('監査JSONの正本を読む', '監査JSONの書き出し時点の写しを読む')
    .replace('href="report.md"', `href="data:text/plain;charset=utf-8;base64,${Buffer.from(data.report).toString('base64')}"`)
    .replace('充足確認レポートの正本を読む', '充足確認レポートの書き出し時点の写しを読む')
    .replace('</body>', `<script>${script.replace(/<\/script/gi, '<\\/script')}</script></body>`);
  if (/<script\b[^>]*src=|<link\b[^>]*href=|await fetch\(/.test(html)) throw new Error('単体HTMLに外部読込が残っています．');
  return {html, sourceHash};
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  if (!process.argv[2]) throw new Error('出力先HTMLを指定してください．');
  const {html,sourceHash}=await buildStandalone();
  await writeFile(process.argv[2],html,'utf8');
  process.stdout.write(JSON.stringify({output:process.argv[2],sourceHash,bytes:Buffer.byteLength(html)})+'\n');
}
