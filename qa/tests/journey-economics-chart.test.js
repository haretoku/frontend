import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {execFileSync} from 'node:child_process';
import {calculateJourneyEstimate} from '../../site/map/estimate-model.js';
import {electricitySavingsExampleInput,guideNumberValues,formatGuideNumber} from '../../site/articles/src/guide-numbers.js';
const root=new URL('../../',import.meta.url);
const data=JSON.parse(await readFile(new URL('data/input/public-data.json',root),'utf8'));
const refs=JSON.parse(await readFile(new URL('site/articles/data/guide-reference-examples.json',root),'utf8'));
const scenario=calculateJourneyEstimate(electricitySavingsExampleInput,data).scenarios.find(s=>s.scenario==='standard');
const values=guideNumberValues(data,refs);
const html=await readFile(new URL('site/guides/solar-economics/index.html',root),'utf8');
const decode=s=>s.replace(/&quot;/g,'"').replace(/&lt;/g,'<').replace(/&gt;/g,'>').replace(/&amp;/g,'&');

test('収支記事のグラフは表と同じ入力・補助金・維持費の年次試算を表示する',async()=>{
 for(const suffix of ['', '-compact']){
  const svg=await readFile(new URL('site/shared/assets/article-solar-economics-cumulative'+suffix+'.svg',root),'utf8');
  const m=JSON.parse(decode(svg.match(/<metadata>([\s\S]*?)<\/metadata>/)[1]));
  assert.deepEqual(m.input,electricitySavingsExampleInput);
  assert.equal(m.subsidyIncluded,true);
  assert.equal(m.initial,scenario.net_initial_outlay_yen);
  assert.equal(m.endpoint,values['journey.profit']);
  assert.equal(m.payback,values['journey.payback']);
  assert.deepEqual(m.annual.slice(1),scenario.annual_cash_flows);
  assert.equal(m.annual[0].cumulative_cash_flow_yen,-scenario.net_initial_outlay_yen);
  assert.equal(m.annual.at(-1).cumulative_cash_flow_yen,m.endpoint);
  assert.equal(values['journey.revenue']+values['journey.subsidy']-values['journey.installation']-values['journey.lifecycle'],m.endpoint);
  const pts=svg.match(/data-series="standard" points="([^"]+)"/)[1].split(' ').map(s=>s.split(',').map(Number));
  // 各年の費用前・年末を同じ横位置で結び，20年目の交換費による下落を省略しない．
  assert.equal(pts.length,1+scenario.annual_cash_flows.length*2);
  const index=scenario.annual_cash_flows.findIndex(r=>r.replacement_cost_yen>0);
  const before=pts[1+index*2],after=pts[2+index*2];
  assert.equal(before[0],after[0]);assert(after[1]>before[1]);
  const endpoint=svg.match(/data-marker="endpoint" cx="([^"]+)" cy="([^"]+)"/);
  assert.deepEqual([Number(endpoint[1]),Number(endpoint[2])],pts.at(-1));
  const payback=scenario.annual_cash_flows.findIndex((r,i)=>r.cumulative_cash_flow_yen>=0&&scenario.annual_cash_flows.slice(i).every(p=>p.cumulative_cash_flow_yen>=0))+1;
  assert.equal(payback,m.payback);
  assert(svg.includes('補助金の実際の入金時期を示すものではない'));
 }
});

test('収支の図・表はプラスと費用を同じ順に示し，グラフを同じ試算例として説明する',()=>{
 const table=html.match(/<table class="guide-data-table economics-table">[\s\S]*?<\/table>/)[0];
 assert(table.indexOf('プラスになる分')<table.indexOf('かかる費用'));
 assert(table.indexOf('補助金</th>')<table.indexOf('設置費（補助金を引く前）'));
 assert(html.includes('第2章と同じ試算例'));
 assert(html.includes(formatGuideNumber(values['journey.profit'],'approx-man')));
 assert(html.includes('実際の補助金の入金時期は表していません'));
 assert(html.includes('article-solar-economics-cumulative-compact.svg'));
});

test('生成済みグラフ・代替文が現行データと一致する',()=>{
 execFileSync(process.execPath,['qa/generate-journey-economics-chart.mjs','--check'],{cwd:root,stdio:'pipe'});
});
