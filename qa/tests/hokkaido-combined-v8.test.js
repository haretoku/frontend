import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {receiveSchemeRules} from '../../data/src/scheme-adapter.js';
import {diagnosticSubsidy,diagnosticComponents} from '../../site/simulator/src/diagnostic-subsidy.js';
import {noncashBenefitDescription} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(readFileSync(new URL('../../data/input/public-data.json',import.meta.url)));
const vectors=JSON.parse(readFileSync(new URL('../fixtures/hokkaido-combined-v8-vectors.json',import.meta.url)));
const rules=receiveSchemeRules(data).diagnostic;
test('浜中の非現金給付を現金額と区別する',()=>{
  const note=noncashBenefitDescription(rules.find(r=>r.id==='hokkaido-next-hamanaka-solar'));
  assert.match(note,/Pay又はピリカ金券/);
  assert.match(note,/現金の給付ではありません/);
  assert.match(note,/全額利用できると仮定/);
});
const canonical=x=>JSON.parse(JSON.stringify(x,(k,v)=>['eligible_cost_yen_unrounded','capacity_amount_yen_unrounded','amount_yen_before_deferred_rounding'].includes(k)&&v!==null?Number(v):v));
test('combined v8の120全項目期待値が一致する',()=>{
  for(const [index,{input:p,expected}] of vectors.generated_equivalence_cases.entries()){
    const actual=diagnosticSubsidy(rules,{prefectureCode:p.prefecture_code,municipalityCode:p.municipality_code,housingAge:p.housing_age,equipmentPackage:p.equipment_package,capacityKw:p.pv_kw,batteryCapacityKwh:p.battery_kwh,solarCost:p.solar_cost_yen,batteryCost:p.battery_cost_yen,batteryEquipmentCost:p.battery_equipment_cost_yen},p.municipal_program_enabled);
    assert.deepEqual(canonical(actual),canonical(expected),`case ${index}`);
  }
});
test('combined v8の19境界額と16組合せ・採用規則が一致する',()=>{
  for(const c of vectors.literal_cases){
    const result=diagnosticComponents(rules.find(r=>r.id==='hokkaido-next-'+c.rule),{housingAge:c.age,equipmentPackage:c.package,capacityKw:c.pv,batteryCapacityKwh:c.q,solarCost:c.solar,batteryCost:c.battery,batteryEquipmentCost:c.equipment});
    assert.equal(Object.values(result?.components??{}).reduce((a,b)=>a+b,0),c.expected_yen,JSON.stringify(c));
  }
  for(const c of vectors.combination_cases){
    const result=diagnosticSubsidy(rules,{prefectureCode:'01',municipalityCode:c.municipality_code,housingAge:c.housing_age,equipmentPackage:c.package,capacityKw:c.pv_kw,batteryCapacityKwh:c.battery_kwh,solarCost:Math.round(c.pv_kw*(c.housing_age==='existing'?331100:317900)),batteryCost:Math.round(c.battery_kwh*121000),batteryEquipmentCost:Math.round(c.battery_kwh*111000)},true);
    assert.equal(result.total_amount_yen,c.expected_yen);
    assert.deepEqual(result.included_programs.map(r=>r.id),c.included_rule_ids);
  }
});
