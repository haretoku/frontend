import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {conciseShimaneAssumption,nonInclusionReason,readableSubsidyAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'32',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('島根19自治体22規則と代表額を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='32').length,19);
 assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='32'&&p.government_level==='municipality').length,22);
 for(const [code,amount] of [['32202',800000],['32209',220000],['32386',340000],['32343',300000],['32505',90000],['32526',220000],['32205',100000],['32448',0]])assert.equal(standard(code).municipality_amount_yen,amount,code);
});
test('奥出雲税抜設備別丸めと西ノ島整数容量境界を保持する',()=>{
 assert.equal(standard('32343',{systemCapacityKw:3.199}).municipality_amount_yen,259000);
 assert.equal(standard('32526',{systemCapacityKw:3.999}).municipality_amount_yen,165000);
 const p=data.diagnostic_subsidy_programs.find(p=>p.id==='shimane-32343-solar_battery-2026');assert.ok(p.formula_components.every(c=>c.rounding_unit_yen===1000));assert.equal(p.formula_components.find(c=>c.scope==='battery').cost_tax,'exclusive');
});
test('住宅区分指定なしは新築と既存の両方を仮定して算入する',()=>{
 for(const code of ['32204', '32386', '32501', '32528']){const existing=standard(code).municipality_amount_yen;assert.ok(existing>0);assert.equal(standard(code,{housingAge:'new'}).municipality_amount_yen,existing);}
});test('浜田の年齢仮定・丸め留保は内部検収口調を除き維持する',()=>{
 const row=standard('32202').included_programs.find(p=>p.government_level==='municipality');const text=[...row.calculation_assumptions,...row.required_confirmations].map(readableSubsidyAssumption).join(' ');
 assert.match(text,/39歳以下/);assert.match(text,/順序は未確認/);assert.doesNotMatch(text,/統括先行|承認済み税込|優先順位をレビュー/);
});
test('吉賀B終了・大田B費目未確定・美郷非FITを区別する',()=>{
 const closed=standard('32505').excluded_programs.find(p=>p.id==='shimane-32505-battery-2026');assert.equal(closed.application_status,'closed');assert.match(nonInclusionReason(closed),/受付が終了/);
 const oda=standard('32205').candidate_programs.find(p=>p.id==='shimane-32205-battery-2026');assert.equal(oda.amount_yen,null);assert.equal(oda.application_status,'accepting');assert.match(oda.required_confirmations.join(' '),/機器費を含むか未確認/);assert.match(nonInclusionReason(oda),/調査を終了/);
 assert.match(nonInclusionReason(standard('32448').excluded_programs.find(p=>p.id==='shimane-32448-non_fit-2026')),/非FIT/);
});

test('島根の通常注記は短文化し浜田年齢仮定を明示，詳細の正本を保持する',()=>{
 const rules=data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('shimane-')&&p.machine_rule==='kansai_municipal_formula');
 for(const row of rules){
 const source=JSON.stringify(row);const text=conciseShimaneAssumption({...row,included:true});
 assert.ok(text.length<75);assert.match(text,/適用条件と補助額は，自治体へ確認/);assert.doesNotMatch(text,/承認済み|書き換え|レビュー|統括|R8/);assert.equal(JSON.stringify(row),source);
 assert.equal(conciseShimaneAssumption({...row,included:false}),'');
 }
 assert.match(conciseShimaneAssumption({id:'shimane-32202-solar_battery-2026',included:true}),/39歳以下/);
 assert.equal(conciseShimaneAssumption({id:'tottori-31329-battery-2026',included:true}),'');
});
