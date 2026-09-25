import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents} from '../../site/simulator/src/kansai-formula.js';

const input={housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:2000000,batteryCost:2000000};
const program=(scope,rule='floor_0_001')=>({formula_components:[{scope,equipment_packages:[input.equipmentPackage],formula_type:'capacity_rate',capacity_source:scope==='solar'?'solar_kw':'battery_kwh',capacity_preprocessing:rule,unit_amount_yen:scope==='solar'?120000:40000,cap_yen:scope==='solar'?600000:400000,rounding_unit_yen:1000}]});

test('安田の小数第3位切捨ては第2位切捨てと四捨五入を混同しない',()=>{
 for(const [capacity,expected] of [[1.0099,121000],[1.01,121000],[1.0169,121000],[1.017,122000],[4.9999,599000],[5,600000],[5.001,600000]]){
  assert.equal(kansaiFormulaComponents(program('solar'),{...input,capacityKw:capacity}).components.solar,expected);
 }
 assert.equal(kansaiFormulaComponents(program('solar','floor_0_01'),{...input,capacityKw:1.0099}).components.solar,120000);
 assert.equal(kansaiFormulaComponents(program('solar','round_0_01'),{...input,capacityKw:1.0169}).components.solar,122000);
});

test('安田の蓄電池も十進切捨て後に千円端数と上限を適用する',()=>{
 for(const [capacity,expected] of [[1.0249,40000],[1.025,41000],[4.0259,161000],[9.9999,399000],[10,400000],[10.001,400000]]){
  assert.equal(kansaiFormulaComponents(program('battery'),{...input,batteryCapacityKwh:capacity}).components.battery,expected);
 }
});
