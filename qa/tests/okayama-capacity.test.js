import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents} from '../../site/simulator/src/kansai-formula.js';
// Niimi draft compatibility only; no public-data adoption is implied.
const rule={formula_components:[{scope:'solar',equipment_packages:['solar_only'],formula_type:'capacity_rate',capacity_source:'solar_kw',capacity_preprocessing:'round_0_1',unit_amount_yen:25000,cap_yen:100000,rounding_unit_yen:1000}]};
const calculate=(capacityKw,program=rule)=>kansaiFormulaComponents(program,{housingAge:'existing',equipmentPackage:'solar_only',capacityKw,batteryCapacityKwh:0,solarCost:2000000,batteryCost:0,batteryEquipmentCost:0});
// Decimal half-up expectations: 3.149→3.1, 3.15→3.2, 3.249→3.2, 3.25→3.3.
for(const [capacity,rawYen,amount] of [[3.149,77500,77000],[3.15,80000,80000],[3.249,80000,80000],[3.25,82500,82000]])test(`新見0.1kW四捨五入→単価→千円切捨て：${capacity}`,()=>{
 const r=calculate(capacity);assert.equal(r.components.solar,amount);assert.equal(Number(r.details.formula_components_applied[0].capacity_amount_yen_unrounded),rawYen);
});
test('0.1kW四捨五入は10万円上限と小数表現を保持する',()=>{
 for(const [input,expected] of [[3.949,97000],[3.95,100000],[4.05,100000],[3.15e0,80000],[0.15,5000]])assert.equal(calculate(input).components.solar,expected);
});
test('既存容量前処理の切捨て・0.01kW四捨五入・無処理を変えない',()=>{
 for(const [preprocessing,expectedRaw,expectedYen] of [['floor_1',75000,75000],['floor_0_1',77500,77000],['floor_0_01',78750,78000],['round_0_01',79000,79000],['none',78875,78000]]){
 const p=structuredClone(rule);p.formula_components[0].capacity_preprocessing=preprocessing;const r=calculate(3.155,p);assert.equal(r.components.solar,expectedYen);assert.equal(Number(r.details.formula_components_applied[0].capacity_amount_yen_unrounded),expectedRaw);
 }
 const invalid=structuredClone(rule);invalid.formula_components[0].capacity_preprocessing='round_unknown';assert.throws(()=>calculate(3.15,invalid),/未対応/);
});
