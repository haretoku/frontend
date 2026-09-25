import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {nonInclusionReason,readableSubsidyAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'41',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('佐賀20市町42枝の5採用11候補と市PV/B排他を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='41').length,20);const rows=data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('saga-'));assert.equal(rows.length,42);assert.equal(rows.filter(p=>p.machine_rule==='kansai_municipal_formula').length,5);assert.equal(rows.filter(p=>p.non_adoption_status==='candidate').length,11);
 const candidates=data.municipalities.filter(p=>p.prefecture_code==='41').flatMap(m=>standard(m.municipality_code).candidate_programs.filter(p=>p.id.startsWith('saga-')));assert.equal(candidates.length,11);for(const row of candidates)assert.equal(row.amount_yen,null);
 assert.equal(standard('41201',{equipmentPackage:'solar_only'}).total_amount_yen,50000);const b=standard('41201');assert.equal(b.total_amount_yen,100000);assert.ok(!b.included_programs.some(p=>p.id==='saga-41201-city-pv-2026'));
});
test('基山の税抜100万円境界・新築除外と上峰の容量比例・鹿島上限',()=>{
 for(const [cap,amount] of [[3,0],[3.5,100000]])assert.equal(standard('41341',{systemCapacityKw:cap}).total_amount_yen,amount);
 assert.equal(standard('41341',{housingAge:'new'}).total_amount_yen,0);
 for(const [cap,amount] of [[3,60000],[3.5,70000],[4,80000]])assert.equal(standard('41345',{systemCapacityKw:cap}).total_amount_yen,amount);
 assert.equal(standard('41207').total_amount_yen,60000);
});
test('佐賀空き家の閉鎖と吉野ヶ里受付不明を未確定額のまま表示する',()=>{
 const closed=standard('41201').candidate_programs.find(p=>p.id.includes('vacant-reform-unconfirmed'));assert.equal(closed.amount_yen,null);assert.match(nonInclusionReason(closed),/受付が終了/);
 const unknown=standard('41327').candidate_programs.find(p=>p.id.startsWith('saga-'));assert.equal(unknown.amount_yen,null);assert.match(nonInclusionReason(unknown),/受付状況を確認できていません/);
});
test('共通仮定の短文化は公式所有条件未確認と受付仮定を残す',()=>{
 const r=data.diagnostic_subsidy_programs.find(p=>p.id==='saga-41207-city-pv-2026');const note=r.calculation_assumptions.map(readableSubsidyAssumption).join('');assert.match(note,/所有要件を確認済みという意味ではありません/);assert.match(note,/予算残を確認済みではありません/);assert.doesNotMatch(note,/空欄|承認済み/);
});
