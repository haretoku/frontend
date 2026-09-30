import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {receiveSchemeRules} from '../../data/src/scheme-adapter.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
const data=JSON.parse(readFileSync(new URL('../../data/input/public-data.json',import.meta.url)));
const vectors=JSON.parse(readFileSync(new URL('../fixtures/hokkaido-combined-v7-vectors.json',import.meta.url)));
const rules=receiveSchemeRules(data).diagnostic;
const canonical=x=>JSON.parse(JSON.stringify(x,(k,v)=>['eligible_cost_yen_unrounded','capacity_amount_yen_unrounded','amount_yen_before_deferred_rounding'].includes(k)&&v!==null?Number(v):v));
test('combined v7の72全項目期待値と18固定額・採用規則が一致する',()=>{
  for(const [index,{input:p,expected}] of vectors.generated_contract_equivalence_cases.entries()){
    const actual=diagnosticSubsidy(rules,{prefectureCode:p.prefecture_code,municipalityCode:p.municipality_code,housingAge:p.housing_age,equipmentPackage:p.equipment_package,capacityKw:p.pv_kw,batteryCapacityKwh:p.battery_kwh,solarCost:p.solar_cost_yen,batteryCost:p.battery_cost_yen,batteryEquipmentCost:p.battery_equipment_cost_yen},p.municipal_program_enabled);
    assert.deepEqual(canonical(actual),canonical(expected),`case ${index}`);
  }
  for(const c of vectors.literal_expectations){
    const result=diagnosticSubsidy(rules,{prefectureCode:'01',municipalityCode:c.municipality_code,housingAge:c.housing_age,equipmentPackage:c.package,capacityKw:4,batteryCapacityKwh:c.battery_kwh,solarCost:4*(c.housing_age==='existing'?331100:317900),batteryCost:Math.round(c.battery_kwh*121000),batteryEquipmentCost:Math.round(c.battery_kwh*111000)},true);
    assert.equal(result.total_amount_yen,c.expected_yen);
    assert.deepEqual(result.included_programs.map(r=>r.id),c.included_rule_ids);
  }
});
