import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {diagnosticComponents,diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {subsidyResearchMessage,nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'22',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
const program=code=>data.diagnostic_subsidy_programs.find(p=>p.id===`shizuoka-${code}-1-2026`);
test('静岡35自治体34制度の分類と30自治体採用額を保持する',()=>{
 assert.equal(data.municipalities.filter(m=>m.prefecture_code==='22').length,35);
 const p=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='22'&&p.government_level==='municipality');
 assert.equal(p.length,34);
 for(const [rule,count] of [['formula',31],['non_adopted',3],['unresolved',0]])assert.equal(p.filter(p=>p.machine_rule===`kansai_municipal_${rule}`).length,count);
 for(const [c,n] of [['22130',100000],['22203',100000],['22205',160000],['22206',90000],['22207',180000],['22208',90000],['22209',100000],['22211',40000],['22212',90000],['22214',60000],['22215',110000],['22216',200000],['22219',120000],['22221',100000],['22222',50000],['22223',160000],['22224',76000],['22225',110000],['22226',140000],['22301',200000],['22302',200000],['22325',90000],['22341',50000],['22342',200000],['22344',100000],['22424',100000],['22429',180000],['22461',90000],['22304',200000],['22305',200000]])assert.equal(standard(c).municipality_amount_yen,n,c);
});
test('静岡住宅・設備分岐と4町容量境界を保持する',()=>{
 for(const [c,extra,n] of [['22206',{housingAge:'new'},45000],['22212',{housingAge:'new'},0],['22301',{housingAge:'new'},0],['22130',{equipmentPackage:'solar_only'},0],['22203',{equipmentPackage:'solar_only'},0],['22221',{equipmentPackage:'solar_only'},40000],['22222',{equipmentPackage:'solar_only'},0]])assert.equal(standard(c,extra).municipality_amount_yen,n,c);
 for(const [c,pv,b,n] of [['22325',9.999,9.5,100000],['22325',10,9.5,50000],['22342',2.999,9.5,100000],['22342',3,9.5,200000],['22342',10,9.5,100000],['22424',2.999,9.5,80000],['22424',3,9.5,100000],['22424',10,9.5,80000],['22461',9.999,4,100000],['22461',10,4,50000]])assert.equal(standard(c,{systemCapacityKw:pv,batteryCapacityKwh:b}).municipality_amount_yen,n,`${c}/${pv}`);
 // Battery minima below the UI's 4 kWh floor are checked at formula level.
 for(const [c,min] of [['22325',1],['22461',2]]){
  const input={housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1149500};
  assert.equal(diagnosticComponents(program(c),{...input,batteryCapacityKwh:min-0.001}).components.battery??0,0);
  assert.ok(diagnosticComponents(program(c),{...input,batteryCapacityKwh:min}).components.battery>0);
 }
});
test('吉田は採用候補の国制度との排他を実際の組合せ計算でも保持する',()=>{
 const yoshida=program('22424');assert.equal(yoshida.conflict_program_ids.length,3);
 assert.match(yoshida.required_confirmations.join(' '),/国・県等の補助/);
 const other={...structuredClone(yoshida),id:yoshida.conflict_program_ids[0],government_level:'national',conflict_program_ids:[],formula_components:[{scope:'battery',equipment_packages:['solar_plus_standard_battery'],formula_type:'fixed',fixed_amount_yen:200000,rounding_unit_yen:1}]};
 const input={prefectureCode:'22',municipalityCode:'22424',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1149500};
 const r=diagnosticSubsidy([yoshida,other],input,true);assert.equal(r.municipality_amount_yen,0);assert.equal(r.national_amount_yen,200000);assert.equal(r.excluded_programs.find(p=>p.id===yoshida.id).reason_code,'explicit_combination_prohibition');
});
test('静岡の終了・限定探索終了・受付仮定と入力外条件を区別する',()=>{
 for(const code of ['22210','22213']){const r=standard(code);assert.equal(r.municipality_amount_yen,0);for(const p of r.excluded_programs.filter(p=>p.government_level==='municipality'))assert.match(nonInclusionReason(p),/受付が終了/);}
 const m=standard('22305');assert.equal(m.municipality_amount_yen,200000);assert.equal(program('22305').application_status,'accepting');assert.match(program('22305').calculation_assumptions.join(' '),/仮定/);
 const city=data.municipalities.find(m=>m.municipality_code==='22306');const e=data.municipality_subsidy_exploration.find(m=>m.municipality_code==='22306');assert.equal(standard('22306').municipality_amount_yen,0);assert.match(subsidyResearchMessage(city.program_status,e),/存在しないと確定したものではありません/);
 assert.match(program('22344').calculation_assumptions.join(' '),/そらいろラボ.*環境価値.*譲渡/);
 assert.match(program('22215').calculation_assumptions.join(' '),/1ダラー1円.*期限内全額利用/);
 assert.match(program('22222').calculation_assumptions.join(' '),/HEMS.*算入しない/);
});

test('南伊豆の住宅・設備分岐，税抜費用下限と排他を保持する',()=>{
 for(const equipmentPackage of ['solar_only','solar_plus_standard_battery']){
  assert.equal(standard('22304',{equipmentPackage}).municipality_amount_yen,200000);
  assert.equal(standard('22304',{equipmentPackage,housingAge:'new'}).municipality_amount_yen,0);
 }
 const base=data.diagnostic_subsidy_programs.find(p=>p.id==='shizuoka-22304-reform-solar-base-2026');
 const high=data.diagnostic_subsidy_programs.find(p=>p.id==='shizuoka-22304-reform-solar-high-cost-2026');
 const input={prefectureCode:'22',municipalityCode:'22304',housingAge:'existing',equipmentPackage:'solar_only',capacityKw:4,batteryCapacityKwh:0,batteryCost:0,batteryEquipmentCost:0};
 for(const [solarCost,expected] of [[109999,0],[110000,20000],[110001,20000],[3299999,200000],[3300000,300000],[3300001,300000]]){
  const r=diagnosticSubsidy([base,high],{...input,solarCost},true);assert.equal(r.municipality_amount_yen,expected,String(solarCost));
 }
 assert.match(base.calculation_assumptions.join(' '),/1年/);
 assert.match(base.required_confirmations.join(' '),/蓄電池/);
});
test('松崎の住宅・設備分岐と容量切捨て・上限・10kW未満条件を保持する',()=>{
 for(const equipmentPackage of ['solar_only','solar_plus_standard_battery'])for(const housingAge of ['existing','new'])assert.equal(standard('22305',{equipmentPackage,housingAge}).municipality_amount_yen,200000);
 for(const [capacityKw,amount] of [[0.019,0],[0.02,1000],[3.999,199000],[4,200000],[4.001,200000],[9.999,200000],[10,0],[10.001,0]]){
 const r=diagnosticComponents(program('22305'),{housingAge:'existing',equipmentPackage:'solar_only',capacityKw,solarCost:1324400,batteryCapacityKwh:0,batteryCost:0,batteryEquipmentCost:0});assert.equal(r?.components.solar??0,amount,String(capacityKw));
 }
});
