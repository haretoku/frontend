import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate,roundAnnualGenerationKwh} from '../../site/simulator/src/calculator.js';
import {subsidyGroups,conciseTokushimaAssumption,nonInclusionReason,subsidyResearchMessage} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'36',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('徳島24自治体23枝・8採用の代表額と鳴門同時加算を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='36').length,24);assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='36'&&p.government_level==='municipality').length,23);
 for(const [code,amount] of [['36202',200000],['36204',170000],['36206',50000],['36207',400000],['36302',200000],['36387',280000],['36388',160000],['36401',100000]])assert.equal(standard(code).municipality_amount_yen,amount,code);
 assert.equal(standard('36202',{equipmentPackage:'solar_only'}).municipality_amount_yen,50000);
 assert.match(conciseTokushimaAssumption({...standard('36202').included_programs.find(p=>p.government_level==='municipality'),included:true}),/給付総額.*同時申請加算5万円/);
});
test('美馬既存40万円と新築非算入，移住仮定・PV一方選択・別B費区別',()=>{
 assert.equal(standard('36207',{housingAge:'new'}).municipality_amount_yen,0);
 const row=standard('36207').included_programs.find(p=>p.government_level==='municipality');const t=conciseTokushimaAssumption({...row,included:true});assert.match(t,/市外に5年以上.*空き家バンク.*確認済みではありません/);assert.match(t,/費用を分割する併用計算は未対応.*蓄電池費用への補助まで禁止するものではありません/);
 const rule=data.diagnostic_subsidy_programs.find(p=>p.id===row.id);assert.deepEqual(rule.expense_scopes,['solar']);assert.ok(!rule.conflict_program_ids.some(id=>id.startsWith('national-')));
});
test('上勝新築20万円の仮定・徳島終了・北島付帯B非FITを区別',()=>{
 const b=standard('36302',{housingAge:'new'});assert.equal(b.municipality_amount_yen,200000);const scenario={scenario:'standard',subsidy_breakdown:b};const g=subsidyGroups({input:{equipment_package:'solar_plus_standard_battery'},scenarios:[scenario]},scenario,{});const rows=g.excluded.filter(p=>p.id.startsWith('tokushima-36302-'));assert.equal(rows.length,0);
 assert.match(nonInclusionReason(standard('36201').excluded_programs.find(p=>p.id==='tokushima-36201-solar_battery_closed-2026')),/受付が終了/);
 assert.match(nonInclusionReason(standard('36402',{housingAge:'new'}).excluded_programs.find(p=>p.id==='tokushima-36402-nonfit_pair-2026')),/非FIT.*付帯する蓄電池/);
});
test('海陽の丸め後10kW境界を公式9.995kW上限と誤表示しない',()=>{
 assert.equal(standard('36388',{systemCapacityKw:9.994}).municipality_amount_yen,160000);assert.equal(standard('36388',{systemCapacityKw:9.995}).municipality_amount_yen,0);
 const t=conciseTokushimaAssumption({id:'tokushima-36388-solar-2026',included:true});assert.match(t,/四捨五入後に10kW未満/);assert.doesNotMatch(t,/9\.995/);
});
test('板野取得不能と未発見5町は未確認を維持し不存在と断定しない',()=>{
 for(const code of ['36404','36301','36341','36383','36403','36468']){const m=data.municipalities.find(p=>p.municipality_code===code);assert.equal(m.program_status,'unconfirmed');assert.match(subsidyResearchMessage(m.program_status),/補助金がないことを意味しません/);assert.equal(standard(code).municipality_amount_yen,0);}
});

test('年次発電量出力だけは二重丸めを避け，厳密中間値を偶数へ丸める',()=>{
 for(const [value,expected] of [[3.995*1230.6851,4916.586974],[0.0078125,0.007812],[0.0234375,0.023438],[-0.0078125,-0.007812],[4916.5869746,4916.586975],[4916.5869744,4916.586974]])assert.equal(roundAnnualGenerationKwh(value),expected);
});
