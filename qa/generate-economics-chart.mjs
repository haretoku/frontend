import { readFile, writeFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { economicsExample, economicsExampleInput } from '../site/articles/src/guide-numbers.js';
import { cashflowMarkers, groupMarkerTargets } from '../site/simulator/src/chart-markers.js';
import { cashflowChartLayout, endpointResult } from '../site/simulator/src/result-presentation.js';

// Regenerate the fixed article image independently of the retired diagnosis screen.
// Remove subsidies from every scenario's initial outlay and annual cumulative flow.
const input = economicsExampleInput;
const data = JSON.parse(await readFile(new URL('../data/input/public-data.json', import.meta.url), 'utf8'));
const scenarios = economicsExample(data);
const selected = scenarios.find(s => s.scenario === 'standard');
const app = (await readFile(new URL('./article-cashflow-renderer.js', import.meta.url), 'utf8')).replace(/\r\n/g, '\n');
function extract(name) {
  const start = app.indexOf(`function ${name}(`);
  const end = app.indexOf('\n}\n', start);
  if (start < 0 || end < 0) throw new Error('Missing renderer function: ' + name);
  return app.slice(start, end + 2);
}
const escape = text => String(text).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;');
class SvgNode {
  constructor(name) { this.name = name; this.attributes = {}; this.children = []; this.textContent = ''; this.clientWidth = 720; }
  setAttribute(name, value) { this.attributes[name] = String(value); }
  getAttribute(name) { return this.attributes[name]; }
  append(...nodes) { this.children.push(...nodes); }
  replaceChildren(...nodes) { this.children = nodes; }
  getBBox() { return { width: [...this.textContent].reduce((sum, char) => sum + (/[^\x00-\x7f]/.test(char) ? 14 : 8), 0) }; }
  addEventListener() {}
  toString() {
    if (this.name === 'fragment') return this.children.join('');
    // A static image has no interactive chart marker targets.
    if (this.attributes.class === 'cashflow-marker-target') return '';
    return `<${this.name}${Object.entries(this.attributes).map(([k, v]) => ` ${k}="${escape(v)}"`).join('')}>${escape(this.textContent)}${this.children.join('')}</${this.name}>`;
  }
}
const chart = new SvgNode('svg');
const context = { SVG_NAMESPACE: 'http://www.w3.org/2000/svg', document: { createElementNS: (_, name) => new SvgNode(name), createDocumentFragment: () => new SvgNode('fragment'), querySelectorAll: () => [] }, elements: { cashflowChart: chart, cashflowDescription: {} }, compactViewport: { matches: false }, cashflowChartLayout, endpointResult, cashflowMarkers, groupMarkerTargets, closeCashflowDetail() {}, scheduleChartHoverClose() {}, formatCompactYen: value => (value < 0 ? '−' : '') + Math.round(Math.abs(value) / 10000) + '万円', formatSignedYen: value => String(value), formatYen: value => String(value), formatProfit: value => String(value), scenarios, selected };
runInNewContext(['createSvgElement', 'zeroIntersections', 'paybackIntersection', 'annualCashflowSeries', 'chartCashflowSeries', 'renderCashflow'].map(extract).join('\n') + '\nrenderCashflow(scenarios, selected, "solar_only");', context);
chart.setAttribute('xmlns', context.SVG_NAMESPACE);
chart.setAttribute('width', 720);
chart.setAttribute('height', 280);
chart.setAttribute('role', 'img');
chart.setAttribute('aria-labelledby', 'chart-title chart-description');
const title = new SvgNode('title'); title.setAttribute('id', 'chart-title'); title.textContent = 'はれトク診断の累積収支グラフ：太陽光のみ・補助金なし';
const description = new SvgNode('desc'); description.setAttribute('id', 'chart-description'); description.textContent = `東京都の既存住宅，南向き4 kW，平日昼間ほぼ毎日在宅の代表例．標準シナリオは初期費用約${Math.round(selected.net_initial_outlay_yen / 10000)}万円から始まり，元手回収の目安は約${selected.payback_year}年，30年後の収支は約${Math.round(selected.profit_yen / 10000)}万円．点検・20年目の機器交換費を含む．破線は下振れ・上振れの試算．`;
const metadata = new SvgNode('metadata'); metadata.textContent = JSON.stringify({ input, subsidy: 'excluded', dataVersion: data.data_version, initial: selected.net_initial_outlay_yen, payback: selected.payback_year, annual: selected.annual_cash_flows.map(r => [r.year, r.cumulative_cash_flow_yen]) });
const css = (await readFile(new URL('./article-cashflow.css', import.meta.url), 'utf8')).trimEnd();
const style = new SvgNode('style'); style.textContent = 'svg { background:#fff; --color-primary:#1f684d; --color-primary-dark:#164e3a; --color-primary-pale:#dcebe3; --color-surface:#fff; --color-accent:#f2b500; --color-muted:#515d56; --font-sans:"Noto Sans JP","Yu Gothic",Meiryo,sans-serif; font-family:var(--font-sans); }\n' + css;
chart.children.unshift(title, description, metadata, style);
await writeFile(new URL('../site/shared/assets/article-solar-cashflow.svg', import.meta.url), '<?xml version="1.0" encoding="UTF-8"?>\n' + chart.toString() + '\n');
chart.clientWidth = 360;
context.compactViewport.matches = true;
// Give the static compact image enough left margin for −132万円 at its font size.
context.cashflowChartLayout = (width, labelWidth, compact) => {
  const layout = cashflowChartLayout(width, labelWidth, compact);
  if (compact) {
    layout.padding.left = 72;
    // Keep the caption baseline (labelTop - 19) inside the static SVG viewport.
    layout.labelTop = 34;
  }
  return layout;
};
runInNewContext(['createSvgElement', 'zeroIntersections', 'paybackIntersection', 'annualCashflowSeries', 'chartCashflowSeries', 'renderCashflow'].map(extract).join('\n') + '\nrenderCashflow(scenarios, selected, "solar_only");', context);
chart.setAttribute('width', 360);
chart.children.unshift(title, description, metadata, style);
await writeFile(new URL('../site/shared/assets/article-solar-cashflow-compact.svg', import.meta.url), '<?xml version="1.0" encoding="UTF-8"?>\n' + chart.toString() + '\n');
console.log(JSON.stringify({ payback: selected.payback_year, endpoint: selected.profit_yen, asset: 'article-solar-cashflow.svg' }));
