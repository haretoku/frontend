import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {prepareSubsidyData} from '../../data/src/scheme-adapter.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
const data=prepareSubsidyData(JSON.parse(readFileSync(new URL('../../data/input/public-data.json',import.meta.url))));
const rule=data.diagnostic_subsidy_programs.find(p=>p.id==='tokyo-residential-solar-2026-audit');
const input={prefectureCode:'13',housingAge:'existing',equipmentPackage:'solar_only',capacityKw:4,batteryCapacityKwh:0,solarCost:1324400,batteryCost:0,batteryEquipmentCost:0};

test('募集前も所定期間を満たす仮定で算入し，終了と不明は算入しない',()=>{
 const accepting=diagnosticSubsidy([rule],input,true);
 assert.ok(accepting.total_amount_yen>0);
 const scheduled=diagnosticSubsidy([{...rule,application_status:'scheduled'}],input,true);
 assert.equal(scheduled.total_amount_yen,accepting.total_amount_yen);
 for(const status of ['closed','suspended','unknown'])assert.equal(diagnosticSubsidy([{...rule,application_status:status}],input,true).total_amount_yen,0);
});

test('県の地域限定条件は，市町村の指定を持つ旧入力でも全県適用しない',()=>{
 for(const restriction of [{included_municipality_codes:['13104']},{excluded_municipality_codes:['13104']}]){
  const result=diagnosticSubsidy([{...rule,...restriction}],{...input,municipalityCode:'13104'},true);
  assert.equal(result.total_amount_yen,0);
  assert.equal(result.candidate_programs[0].reason_code,'regional_eligibility_input_unavailable');
 }
 const aomori=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='02');
 const result=diagnosticSubsidy(aomori,{...input,prefectureCode:'02',equipmentPackage:'solar_plus_standard_battery',batteryCapacityKwh:9.5,batteryCost:1149500,batteryEquipmentCost:1054500},true);
 assert.equal(result.total_amount_yen,0);
 assert.ok(result.candidate_programs.some(p=>p.reason_code==='regional_eligibility_input_unavailable'));
});

test('市区町村の制度が混じった入力は評価対象から除く',()=>{
 const municipal={...rule,id:'test-city',government_level:'municipality',municipality_code:'13104'};
 assert.deepEqual(diagnosticSubsidy([rule,municipal],input,true),diagnosticSubsidy([rule],input,true));
});
