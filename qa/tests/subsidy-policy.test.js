import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {diagnosticComponents} from '../../site/simulator/src/diagnostic-subsidy.js';
import {nonInclusionReason,noncashBenefitDescription} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(prefectureCode,municipalityCode,extra={})=>calculateEstimate({prefectureCode,municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard');
test('共通方針11.8の8市町採用額と福知山・韮崎非算入を保持する',()=>{
 for(const [pref,code,amount] of [['26','26211',100000],['26','26212',130000],['26','26214',300000],['26','26366',135000],['27','27203',60000],['19','19213',90000],['21','21506',200000],['20','20402',172000]]) assert.equal(standard(pref,code).subsidy_breakdown.municipality_amount_yen,amount,code);
 const f=standard('26','26201').subsidy_breakdown;assert.equal(f.municipality_amount_yen,0);assert.ok(f.excluded_programs.some(p=>p.government_level==='municipality'&&p.reason_code==='sale_path_not_applicable'));
 const n=standard('19','19207').subsidy_breakdown;assert.equal(n.municipality_amount_yen,0);const row=n.excluded_programs.find(p=>p.id==='nirasaki-residential-battery-2026');assert.equal(row.amount_yen,null);assert.match(nonInclusionReason(row),/今回の調査を終了/);assert.match(nonInclusionReason(row),/制度不存在や受付終了を意味しません/);
});
test('京丹後は設備別税抜半額と合算半額をともに満たす',()=>{
 const p=data.diagnostic_subsidy_programs.find(p=>p.id==='kyotango-decarbonization-2026');
 const input={housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1149500};
 for(const [solarCost,batteryCost,solar,battery] of [[1324400,1149500,80000,50000],[22000,1100000,10000,50000],[1100000,22000,80000,10000],[22001,22001,10000,10000]]){
  const r=diagnosticComponents(p,{...input,solarCost,batteryCost});assert.deepEqual(r.components,{solar,battery});assert.equal(r.details.formula_scope_totals_applied.length,2);
 }
 assert.equal(standard('26','26212',{equipmentPackage:'solar_only'}).subsidy_breakdown.municipality_amount_yen,40000);
});
test('共通方針の容量単位・事後申請・受付継続と非現金仮定を保持する',()=>{
 for(const id of ['koshu-residential-energy-equipment-2026','shirakawa-water-source-energy-2026'])assert.match(data.diagnostic_subsidy_programs.find(p=>p.id===id).calculation_assumptions.join(' '),/原文.*kW.*kWh.*解釈/);
 const m=standard('20','20402').subsidy_breakdown.included_programs.find(p=>p.id==='nagano-20402-row-44-1-2026');assert.match(m.calculation_assumptions.join(' '),/将来の所定受付期間へ申請/);
 const u=standard('29','29212').subsidy_breakdown.included_programs.find(p=>p.id==='uda-residential-solar-uppy-2026');assert.equal(u.amount_yen,50000);assert.match(noncashBenefitDescription(u),/商品券.*全額利用/);assert.match(u.calculation_assumptions.join(' '),/受付継続を仮定/);
 const tokyo=data.diagnostic_subsidy_programs.find(p=>(p.calculation_assumptions??[]).some(t=>t.includes('実際の製品差額')));assert.ok(tokyo);assert.match(tokyo.calculation_assumptions.join(' '),/標準設置費を据え置く/);
});
