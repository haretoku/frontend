import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents} from '../../site/simulator/src/kansai-formula.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';

// Synthetic contract: the fixed public data and Sapporo adoption remain unchanged.
const solar={scope:'solar',equipment_packages:['solar_only','solar_plus_standard_battery'],formula_type:'capacity_rate',capacity_source:'solar_kw',capacity_preprocessing:'floor_0_01',unit_amount_yen:20000,cap_yen:139000,cost_scope:'solar',cost_tax:'exclusive',rounding_unit_yen:1000,eligible_cost_must_exceed_grant:true};
const program={id:'synthetic-sapporo',machine_rule:'kansai_municipal_formula',government_level:'municipality',prefecture_code:'01',municipality_code:'01100',program_name:'検査用制度',housing_ages:['existing','new'],equipment_packages:['solar_only','solar_plus_standard_battery'],application_status:'accepting',diagnostic_scope:{in_scope_housing_ages:['existing','new']},conflict_program_ids:[],official_urls:[],source_ids:[],required_confirmations:[],calculation_assumptions:[],formula_components:[solar]};
const input={prefectureCode:'01',municipalityCode:'01100',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:88001,batteryCost:1000000,batteryEquipmentCost:900000};
const run=(extra={},p=program)=>diagnosticSubsidy([p],{...input,...extra},true);

test('札幌合成契約：対象費用は円丸め後の補助額を厳密に上回る必要がある',()=>{
 for(const housingAge of ['new','existing'])for(const equipmentPackage of ['solar_only','solar_plus_standard_battery'])for(const solarCost of [87999,88000]){
  const r=run({solarCost,housingAge,equipmentPackage});
  assert.equal(r.municipality_amount_yen,0);assert.equal(r.candidate_programs.length,0);
  assert.equal(r.excluded_programs[0].calculation_status,'excluded_incompatible');
  assert.equal(r.excluded_programs[0].reason_code,'eligible_cost_not_above_grant');
  assert.match(nonInclusionReason(r.excluded_programs[0]),/上回/);
 }
 for(const [capacityKw,solarCost,amount] of [[4,88001,80000],[4.049,88550,80000],[9,152901,139000]]){
  assert.equal(run({capacityKw,solarCost}).municipality_amount_yen,amount);
  assert.equal(kansaiFormulaComponents(program,{...input,capacityKw,solarCost}).components.solar,amount);
 }
 assert.equal(run({capacityKw:9,solarCost:152900}).excluded_programs[0].reason_code,'eligible_cost_not_above_grant');
 assert.equal(kansaiFormulaComponents(program,{...input,capacityKw:4.049,solarCost:88550}).details.formula_components_applied[0].amount_yen_before_deferred_rounding,'80000');
});

test('札幌合成契約：成分除外でも他の適格設備は維持する',()=>{
 const mixed=structuredClone(program);mixed.formula_components.push({scope:'battery',equipment_packages:['solar_plus_standard_battery'],formula_type:'fixed',fixed_amount_yen:50000,cost_scope:'battery',cost_tax:'approved_assumption_inclusive',rounding_unit_yen:1000});
 const r=run({solarCost:88000},mixed);assert.equal(r.municipality_amount_yen,50000);
 const c=kansaiFormulaComponents(mixed,{...input,solarCost:88000});
 assert.deepEqual(c.components,{battery:50000});assert.equal(c.details.formula_components_excluded[0].reason_code,'eligible_cost_not_above_grant');
 const failed=structuredClone(program);failed.formula_components.push({...solar,scope:'battery',cost_scope:'battery',capacity_source:'battery_kwh',unit_amount_yen:16000,cap_yen:64000,capacity_preprocessing:'floor_0_1'});
 const all=run({solarCost:88000,batteryCost:70400},failed);
 assert.equal(all.candidate_programs.length,0);assert.equal(all.excluded_programs[0].reason_code,'eligible_cost_not_above_grant');
 assert.equal(kansaiFormulaComponents(failed,{...input,solarCost:88000,batteryCost:70400}).details.formula_components_excluded.length,2);
});

test('札幌合成契約：欠損費用は既知の低費用による対象外と区別する',()=>{
 for(const solarCost of [null,undefined]){
  assert.throws(()=>run({solarCost}),/対象費用がありません/);
 }
 for(const cost_scope of ['battery_equipment','combined']){
  const missing=structuredClone(program);missing.formula_components[0].cost_scope=cost_scope;
  assert.throws(()=>run({batteryEquipmentCost:null,batteryCost:null},missing),/対象費用がありません/);
 }
});

test('札幌合成契約：省略・falseの既存費用上限と税込条件を保持する',()=>{
 for(const flag of [undefined,false]){
  const legacy=structuredClone(program);if(flag===undefined)delete legacy.formula_components[0].eligible_cost_must_exceed_grant;else legacy.formula_components[0].eligible_cost_must_exceed_grant=flag;
  assert.equal(run({solarCost:87999},legacy).municipality_amount_yen,79000);
  assert.equal(run({solarCost:88000},legacy).municipality_amount_yen,80000);
 }
 const inclusive=structuredClone(program);inclusive.formula_components[0].cost_tax='approved_assumption_inclusive';
 assert.equal(run({solarCost:80000},inclusive).excluded_programs[0].reason_code,'eligible_cost_not_above_grant');
 assert.equal(run({solarCost:80001},inclusive).municipality_amount_yen,80000);
});

test('札幌合成契約：共有上限・丸め繰越・別算式との併用を拒否する',()=>{
 for(const change of [p=>p.formula_total={},p=>p.formula_scope_totals=[],p=>p.formula_components[0].defer_rounding_to_formula_total=true,p=>p.formula_components[0].formula_type='fixed',p=>p.formula_components[0].cost_scope=null,p=>p.formula_components[0].cost_tax=null]){
  const invalid=structuredClone(program);change(invalid);assert.throws(()=>kansaiFormulaComponents(invalid,input));
 }
});
