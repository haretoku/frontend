import { readFile, writeFile } from 'node:fs/promises';
import { createRequire } from 'node:module';

// Read the article tables so downloaded values stay tied to the displayed edition.
const root = new URL('../', import.meta.url);
const html = await readFile(new URL('site/guides/electricity-support-end/index.html', root), 'utf8');
const tables = [...html.matchAll(/<table\b[^>]*>([\s\S]*?)<\/table>/g)];
if (tables.length !== 4) throw Error('Expected four release tables');
const articleUrl = 'https://haretoku.jp/guides/electricity-support-end/';
const clean = text => text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]+>/g, '')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/[ \t\r]+/g, ' ').trim();
const escape = text => text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const csvCell = value => `"${String(value).replace(/"/g, '""')}"`;
const require = createRequire(import.meta.url);
const sharp = require('C:/Users/wordm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
const csvHeaders = [
  ['設備構成', '年間購入量（昼夜合計，kWh）', '支援継続（円/年）', '支援終了（円/年）', '年間負担増（円）'],
  ['設備構成', '昼の年間購入量（6〜18時，kWh）', '昼の削減率（％）', '夜の年間購入量（18〜翌6時，kWh）', '夜の削減率（％）'],
];
const conditions = [
  '東京の同じモデル家庭，太陽光4 kW．支援3.5円/kWhが1年間続く場合と支援なしを比較．2026年10月分料金を固定．',
  '東京の同じモデル家庭，太陽光4 kW．昼6〜18時，夜18〜翌6時の年間集計．削減率は各時間帯の設備なし比．',
  '公開資料と本試算の入力条件．詳細な仮定は記事の「モデルの詳細」を参照．',
  '東京電力EP・従量電灯B・30A，2026年10月分．電力量料金は月間購入量120 kWh以下／120 kWh超〜300 kWh以下／300 kWh超の順．支援継続は比較用の仮定．',
];
const widths = [[350,280,250,250,260], [350,280,220,280,220], [220,530,700], [680,770]];
function wrap(text, maxWidth, size) {
  const lines = [];
  for (const paragraph of text.split('\n')) {
    let current = '', width = 0;
    for (const char of paragraph) {
      const addition = /[ -~]/.test(char) ? size * .62 : size;
      if (current && width + addition > maxWidth) { lines.push(current); current = ''; width = 0; }
      current += char; width += addition;
    }
    lines.push(current);
  }
  return lines;
}
function textLines(x, y, lines, size, color = '#173e35', weight = 400) {
  return lines.map((text, i) => `<text x="${x}" y="${y + i * size * 1.45}" font-size="${size}" fill="${color}" font-weight="${weight}">${escape(text)}</text>`).join('');
}

for (const [index, match] of tables.entries()) {
  const table = match[1];
  const title = clean(table.match(/<caption>([\s\S]*?)<\/caption>/)[1]);
  if (!title.startsWith(`表${index + 1}　`)) throw Error('Table numbering changed');
  const rows = [...table.matchAll(/<tr\b[^>]*>([\s\S]*?)<\/tr>/g)].map(row =>
    [...row[1].matchAll(/<(?:th|td)\b[^>]*>([\s\S]*?)<\/(?:th|td)>/g)].map(cell => clean(cell[1])));
  const csvRows = rows.map((row, rowIndex) => row.map((cell, column) => {
    if (rowIndex === 0 && index < 2) return csvHeaders[index][column];
    if (rowIndex > 0 && index < 2 && column > 0) return cell.replace(/[, ]|kWh|円|％/g, '');
    return cell.replace(/\n/g, ' ');
  }));
  const links = [...new Set([...table.matchAll(/href="([^"]+)"/g)].map(link => link[1]))];
  const metadata = [['表題', title], ['出典', 'はれトク試算'], ['記事URL', articleUrl], ['条件', conditions[index]]];
  const csv = '\uFEFF' + [...metadata, [], ...csvRows, [], ...links.map(url => ['元資料URL', url])]
    .map(row => row.map(csvCell).join(',')).join('\r\n') + '\r\n';
  const name = `support-shock-table-${index + 1}`;
  await writeFile(new URL(`site/shared/assets/${name}.csv`, root), csv);

  const columnWidths = widths[index], margin = 48;
  const width = columnWidths.reduce((a, b) => a + b, 0) + margin * 2;
  const titleLines = wrap(title, width - margin * 2, 30);
  let body = textLines(margin, 55, titleLines, 30), y = 80 + (titleLines.length - 1) * 44;
  for (const [rowIndex, row] of rows.entries()) {
    const lines = row.map((cell, column) => wrap(cell, columnWidths[column] - 32, 26));
    const height = Math.max(...lines.map(cell => cell.length)) * 38 + 38;
    if (rowIndex === 0) body += `<rect x="${margin}" y="${y}" width="${width - margin * 2}" height="${height}" fill="#f2f6f4"/>`;
    let x = margin;
    lines.forEach((cell, column) => {
      body += textLines(x + 16, y + 40, cell, 26, '#173e35', rowIndex === 0 || column === 0 ? 700 : 400);
      x += columnWidths[column];
    });
    y += height;
    body += `<line x1="${margin}" y1="${y}" x2="${width - margin}" y2="${y}" stroke="#dce5df"/>`;
  }
  y += 42;
  const noteLines = wrap(conditions[index], width - margin * 2, 22);
  body += textLines(margin, y, noteLines, 22, '#5d6d67');
  y += noteLines.length * 32 + 12;
  body += textLines(margin, y, ['出典：はれトク試算', articleUrl], 22, '#5d6d67');
  const height = y + 75;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}"><style>text{font-family:Meiryo,"Yu Gothic",sans-serif}</style><rect width="100%" height="100%" fill="#fff"/>${body}</svg>`;
  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  await writeFile(new URL(`site/shared/assets/${name}.png`, root), png);
}
console.log('Generated CSV and PNG downloads for release tables 1–4');
