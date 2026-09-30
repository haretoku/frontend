import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents,kansaiBelowMinimumCost} from '../../site/simulator/src/kansai-formula.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';

const part={scope:'solar',cost_scope:'solar',equipment_packages:['solar_only'],formula_type:'cost_fraction',fraction_numerator:1,fraction_denominator:10,cap_yen:100000,cost_tax:'inclusive',rounding_unit_yen:1000,eligible_cost_min_yen:100000,eligible_cost_min_scope:'solar'};
const program={id:'synthetic-abashiri',machine_rule:'kansai_municipal_formula',government_level:'municipality',prefecture_code:'01',municipality_code:'01211',program_name:'検査用制度',housing_ages:['existing','new'],equipment_packages:['solar_only','solar_plus_standard_battery'],application_status:'accepting',diagnostic_scope:{in_scope_housing_ages:['existing','new']},conflict_program_ids:[],official_urls:[],source_ids:[],required_confirmations:[],calculation_assumptions:[],formula_components:[part,...['solar','battery'].map(scope=>({...part,scope,cost_scope:scope,equipment_packages:['solar_plus_standard_battery'],eligible_cost_min_scope:'combined'}))]};
const input={prefectureCode:'01',municipalityCode:'01211',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:60000,batteryCost:60000,batteryEquipmentCost:50000};
const run=(extra={},p=program)=>diagnosticSubsidy([p],{...input,...extra},true);

test('網走合成契約：合計最低費用と設備別1/10を分離する',()=>{
 for(const housingAge of ['new','existing']){
  assert.equal(run({housingAge}).municipality_amount_yen,12000);
  assert.deepEqual(kansaiFormulaComponents(program,{...input,housingAge}).components,{solar:6000,battery:6000});
  for(const [batteryCost,total] of [[39999,0],[40000,10000],[40001,10000]]){
   const i={...input,housingAge,batteryCost},r=run({housingAge,batteryCost});
   assert.equal(r.municipality_amount_yen,total);
   assert.equal(kansaiBelowMinimumCost(program,i),batteryCost===39999);
   if(!total){assert.equal(r.excluded_programs[0].reason_code,'eligible_cost_below_minimum');assert.equal(r.candidate_programs.length,0);assert.equal(kansaiFormulaComponents(program,i),null);}
  }
 }
 assert.deepEqual(kansaiFormulaComponents(program,{...input,solarCost:2000000,batteryCost:3000000}).components,{solar:100000,battery:100000});
 const separate=['solar','battery'].map(scope=>({...program,id:`synthetic-abashiri-${scope}`,formula_components:program.formula_components.filter(c=>c.scope===scope)}));
 assert.equal(diagnosticSubsidy(separate,input,true).municipality_amount_yen,12000);
});

test('網走合成契約：PV単独へ蓄電池費や入力外費用を補わない',()=>{
 assert.equal(run({equipmentPackage:'solar_only'}).excluded_programs[0].reason_code,'eligible_cost_below_minimum');
 for(const solarCost of [100000,100001])assert.equal(run({equipmentPackage:'solar_only',solarCost}).municipality_amount_yen,10000);
 assert.equal(run({equipmentPackage:'solar_only',solarCost:99999}).municipality_amount_yen,0);
 assert.throws(()=>run({batteryCost:null}),/判定に必要な費用/);
});

test('最低scopeは税区分を共有し，省略は従来の設備別最低費用を維持する',()=>{
 const legacy=structuredClone(program);for(const p of legacy.formula_components)delete p.eligible_cost_min_scope;
 assert.equal(run({},legacy).excluded_programs[0].reason_code,'eligible_cost_below_minimum');
 assert.equal(run({solarCost:120000,batteryCost:120000},legacy).municipality_amount_yen,24000);
 const exclusive=structuredClone(program);for(const p of exclusive.formula_components)p.cost_tax='exclusive';
 assert.equal(run({solarCost:66000,batteryCost:43999},exclusive).municipality_amount_yen,0);
 assert.equal(run({solarCost:66000,batteryCost:44000},exclusive).municipality_amount_yen,10000);
});
