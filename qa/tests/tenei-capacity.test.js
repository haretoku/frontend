import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents,kansaiSolarAboveMaximum} from '../../site/simulator/src/kansai-formula.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';

// Synthetic contract only: no Tenei adoption record is added to the fixed public data.
const solar={scope:'solar',equipment_packages:['solar_only','solar_plus_standard_battery'],formula_type:'capacity_rate',capacity_source:'solar_kw',capacity_preprocessing:'round_0_001',unit_amount_yen:30000,cap_yen:120000,cost_scope:'solar',cost_tax:'approved_assumption_inclusive',rounding_unit_yen:1000,solar_output_max_kw_exclusive:10,solar_output_max_kw_preprocessing:'round_0_001'};
const program={id:'synthetic-tenei',machine_rule:'kansai_municipal_formula',government_level:'municipality',prefecture_code:'07',municipality_code:'07344',program_name:'検査用制度',housing_ages:['existing','new'],equipment_packages:['solar_only','solar_plus_standard_battery'],application_status:'accepting',diagnostic_scope:{in_scope_housing_ages:['existing','new']},conflict_program_ids:[],official_urls:[],source_ids:[],required_confirmations:[],calculation_assumptions:[],formula_components:[solar]};
const input={prefectureCode:'07',municipalityCode:'07344',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:2000000,batteryCost:1000000,batteryEquipmentCost:900000};
const run=(capacityKw,p=program,extra={})=>diagnosticSubsidy([p],{...input,capacityKw,...extra},true);

test('天栄合成契約：千分位四捨五入・千円床・低費用上限を両層で守る',()=>{
 for(const housingAge of ['new','existing'])for(const equipmentPackage of ['solar_only','solar_plus_standard_battery'])for(const [capacityKw,amount]of [[3.3334,99000],[3.3335,100000],[3.9994,119000],[3.9995,120000],[9.9994,120000]]){
  assert.equal(run(capacityKw,program,{housingAge,equipmentPackage}).municipality_amount_yen,amount);
  assert.equal(kansaiFormulaComponents(program,{...input,capacityKw,housingAge,equipmentPackage}).components.solar,amount);
 }
 assert.equal(run(4,program,{solarCost:90001}).municipality_amount_yen,90000);
});
test('天栄合成契約：丸め後10kWは対象外だが混合成分のBは維持する',()=>{
 for(const capacityKw of [9.9995,10]){
  const r=run(capacityKw);assert.equal(r.municipality_amount_yen,0);assert.equal(r.excluded_programs[0].reason_code,'capacity_not_applicable');assert.equal(r.excluded_programs[0].amount_yen,null);
  const components=kansaiFormulaComponents(program,{...input,capacityKw});assert.equal(components,null);
 }
 const mixed=structuredClone(program);mixed.formula_components.push({scope:'battery',equipment_packages:['solar_plus_standard_battery'],formula_type:'fixed',fixed_amount_yen:50000,cost_scope:'battery',cost_tax:'approved_assumption_inclusive',rounding_unit_yen:1000});
 assert.equal(run(9.9995,mixed).municipality_amount_yen,50000);
});
test('上限判定の省略互換と金額丸めの独立性，下限・B容量条件を維持する',()=>{
 const legacy=structuredClone(program);delete legacy.formula_components[0].solar_output_max_kw_preprocessing;
 assert.equal(run(9.9995,legacy).municipality_amount_yen,120000);
 const independent=structuredClone(program);independent.formula_components[0].capacity_preprocessing='none';assert.equal(run(3.3334,independent).municipality_amount_yen,100000);assert.equal(run(9.9995,independent).municipality_amount_yen,0);
 const lower=structuredClone(program);lower.formula_components[0].solar_output_min_kw=4;assert.equal(run(3.9995,lower).excluded_programs[0].reason_code,'capacity_not_applicable');
 const battery=structuredClone(program);battery.formula_components[0].battery_capacity_min_kwh=10;assert.equal(run(4,battery,{batteryCapacityKwh:9.9995}).excluded_programs[0].reason_code,'capacity_not_applicable');
 assert.throws(()=>kansaiSolarAboveMaximum({...solar,solar_output_max_kw_preprocessing:'round_0_01'},4),/未対応/);
});
