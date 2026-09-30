import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {conciseHokkaidoAssumption,nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(fs.readFileSync(new URL('../../data/input/public-data.json',import.meta.url)));
const input={prefectureCode:'01',municipalityCode:'01100',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const run=(extra={},rules=data.diagnostic_subsidy_programs)=>diagnosticSubsidy(rules,{...input,...extra},true);
test('北海道11.43：札幌正式枝の設備条件・税抜費超過・本体費を維持',()=>{
 assert.equal(run().municipality_amount_yen,144000);
 assert.equal(run({equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 assert.match(nonInclusionReason(run({equipmentPackage:'solar_only'}).excluded_programs.find(x=>x.id==='hokkaido-sapporo-general-solar')),/既設機器/);
 const p=data.diagnostic_subsidy_programs.filter(x=>x.id==='hokkaido-sapporo-general-solar');
 for(const [solarCost,amount] of [[87999,0],[88000,0],[88001,80000]])assert.equal(run({solarCost},p).municipality_amount_yen,amount);
 assert.equal(run({batteryEquipmentCost:109999}).municipality_amount_yen,0);
 assert.equal(run({batteryEquipmentCost:110000}).municipality_amount_yen,144000);
 assert.match(conciseHokkaidoAssumption({...run().included_programs.find(x=>x.id==='hokkaido-sapporo-general-battery'),included:true}),/本体購入費と工事込み費用は区別/);
});
test('北海道11.43：網走正式枝は合計10万円入口と設備別額を維持',()=>{
 for(const [solarCost,batteryCost,amount] of [[60000,60000,12000],[60000,39999,0],[60000,40000,10000],[60000,40001,10000]])assert.equal(run({municipalityCode:'01211',solarCost,batteryCost}).municipality_amount_yen,amount);
 assert.equal(run({municipalityCode:'01211'}).municipality_amount_yen,200000);
 assert.equal(run({municipalityCode:'01211',equipmentPackage:'solar_only'}).municipality_amount_yen,100000);
});
test('北海道11.43：函館は同じ蓄電池への国補助と重複しない',()=>{
 assert.equal(run({municipalityCode:'01202'}).municipality_amount_yen,100000);
 const city=data.diagnostic_subsidy_programs.filter(x=>x.municipality_code==='01202');
 const national={...city.find(x=>x.id==='hokkaido-hakodate-battery'),id:'national-zeh-new-detached-2026-battery',government_level:'national',municipality_code:null,conflict_program_ids:[],formula_components:[{scope:'battery',equipment_packages:['solar_plus_standard_battery'],formula_type:'fixed',fixed_amount_yen:80000,cost_scope:'battery',cost_tax:'inclusive',rounding_unit_yen:1000}]};
 const r=run({municipalityCode:'01202'},[...city,national]);
 assert.equal(r.total_amount_yen,130000);assert.equal(r.municipality_amount_yen,50000);
 assert.ok(!r.included_programs.some(x=>x.id==='hokkaido-hakodate-battery'));
});
test('北海道11.43：江別3枝は受付終了とし予定期限を受付中へ読み替えない',()=>{
 const r=run({municipalityCode:'01217'});assert.equal(r.municipality_amount_yen,0);
 const closed=r.excluded_programs.filter(x=>x.id.startsWith('hokkaido-ebetsu-'));assert.equal(closed.length,3);
 for(const x of closed){assert.equal(x.application_status,'closed');assert.equal(x.reason_code,'application_closed');assert.match(nonInclusionReason(x),/予算に達した/);}
});

test('北海道11.45：北斗と森の端数・上限・10kW境界，B未採用',()=>{
 for(const [municipalityCode,id,expected] of [['01236','hokkaido-hokuto-solar',80000],['01345','hokkaido-mori-solar',150000]]){
  for(const equipmentPackage of ['solar_only','solar_plus_standard_battery']){
   const r=run({municipalityCode,equipmentPackage});assert.equal(r.municipality_amount_yen,expected);
   assert.deepEqual(r.included_programs.filter(x=>x.government_level==='municipality').map(x=>x.id),[id]);
  }
  for(const capacityKw of [10,10.001])assert.equal(run({municipalityCode,capacityKw}).municipality_amount_yen,0);
  assert.match(conciseHokkaidoAssumption({id,included:true}),/蓄電池分は今回の試算に含めていません/);
 }
 for(const [capacityKw,expected] of [[4.049,80000],[4.05,81000],[5,100000],[9.999,100000]])assert.equal(run({municipalityCode:'01236',capacityKw}).municipality_amount_yen,expected);
 for(const [capacityKw,expected] of [[2.019,100000],[2.02,101000],[3,150000],[9.999,150000]])assert.equal(run({municipalityCode:'01345',capacityKw}).municipality_amount_yen,expected);
});
test('北海道11.45：北広島は算式留保より受付終了を表示',()=>{
 const r=run({municipalityCode:'01234'});assert.equal(r.municipality_amount_yen,0);
 const rows=r.excluded_programs.filter(x=>x.id.startsWith('hokkaido-kitahiroshima-'));assert.equal(rows.length,2);
 for(const x of rows){assert.equal(x.application_status,'closed');assert.equal(x.reason_code,'application_closed');assert.match(nonInclusionReason(x),/終了/);assert.doesNotMatch(nonInclusionReason(x),/未確認|不明/);}
});
