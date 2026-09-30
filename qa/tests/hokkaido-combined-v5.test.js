import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {receiveSchemeRules} from '../../data/src/scheme-adapter.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
const data=JSON.parse(readFileSync(new URL('../../data/input/public-data.json',import.meta.url)));
const vectors=JSON.parse(readFileSync(new URL('../fixtures/hokkaido-combined-v5-vectors.json',import.meta.url)));
const rules=receiveSchemeRules(data).diagnostic;
const canonical=x=>JSON.parse(JSON.stringify(x,(k,v)=>['eligible_cost_yen_unrounded','capacity_amount_yen_unrounded','amount_yen_before_deferred_rounding'].includes(k)&&v!==null?Number(v):v));
test('combined v5の216期待値：合算後丸め・費用・控除・排他・両日高',()=>{
  for(const [index,{input:p,expected}] of vectors.cases.entries()){
    const actual=diagnosticSubsidy(rules,{prefectureCode:p.prefecture_code,municipalityCode:p.municipality_code,housingAge:p.housing_age,equipmentPackage:p.equipment_package,capacityKw:p.pv_kw,batteryCapacityKwh:p.battery_kwh,solarCost:p.solar_cost_yen,batteryCost:p.battery_cost_yen,batteryEquipmentCost:p.battery_equipment_cost_yen},p.municipal_program_enabled);
    assert.deepEqual(canonical(actual),canonical(expected),`case ${index} / ${p.municipality_code}`);
  }
});
test('保持10規則を掲載枝へ結合し，診断専用行を重複表示しない',()=>{
  const bindings=Object.fromEntries(Object.entries(data.subsidy_scheme_links.retained_diagnostic_bindings).filter(([id])=>id.startsWith('hokkaido-candidate-')));
  assert.equal(Object.keys(bindings).length,10);
  for(const [id,ids] of Object.entries(bindings)){
    const rule=rules.find(r=>r.id===id);
    const rows=selectSchemeGroups(data,rule.prefecture_code,rule.municipality_code).flat();
    assert(!rows.some(r=>r.id===id),id);
    for(const branch of ids)assert.equal(rows.filter(r=>r.id===branch&&r._legacy.some(p=>p.id===id)).length,1);
  }
  assert.equal(data.municipalities.find(m=>m.municipality_code==='01601').prefecture_code,'01');
  assert.equal(data.municipalities.find(m=>m.municipality_code==='30382').prefecture_code,'30');
});
test('保持規則の未定義・重複・逆参照欠落・地域不一致を拒否する',()=>{
  const id='hokkaido-candidate-hidaka-solar',branch='hokkaido-additional-hidaka-0';
  for(const mutate of [
    d=>delete d.subsidy_scheme_links.retained_diagnostic_bindings[id],
    d=>d.subsidy_scheme_links.retained_diagnostic_bindings[id].push(branch),
    d=>d.subsidy_scheme_links.retained_diagnostic_bindings.invalid=[branch],
    d=>d.subsidy_scheme_links.retained_branches.find(r=>r.branch_id===branch).diagnostic_rule_ids=[],
    d=>d.subsidy_catalog.rows.find(r=>r.branch_id===branch).municipality_code='30382'
  ]){const d=structuredClone(data);mutate(d);assert.throws(()=>receiveSchemeRules(d),/保留規則/);}
});
