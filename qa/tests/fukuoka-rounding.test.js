import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents} from '../../site/simulator/src/kansai-formula.js';

const input={housingAge:'existing',equipmentPackage:'solar_only',capacityKw:3.12347,solarCost:2000000,batteryCost:0};
const component={scope:'solar',equipment_packages:['solar_only'],formula_type:'capacity_rate',capacity_source:'solar_kw',capacity_preprocessing:'none',unit_amount_yen:25000,rounding_unit_yen:1};
const calculate=(extra={},capacityKw=input.capacityKw)=>kansaiFormulaComponents({formula_components:[{...component,...extra}]},{...input,capacityKw});

test('明示したサービス円四捨五入だけが筑紫野の細分容量を78087円にする',()=>{
 const rounded=calculate({rounding_mode:'service_half_up'}),legacy=calculate();
 assert.equal(rounded.components.solar,78087);assert.equal(legacy.components.solar,78086);
 assert.equal(rounded.details.formula_components_applied[0].rounding_mode,'service_half_up');
 assert.ok(!Object.hasOwn(legacy.details.formula_components_applied[0],'rounding_mode'));
 for(const [capacity,expected] of [[1.000019,25000],[1.00002,25001],[1.000021,25001]])assert.equal(calculate({rounding_mode:'service_half_up'},capacity).components.solar,expected);
});

test('サービス円丸めは費用・上限適用後とし負額を0にする',()=>{
 assert.equal(calculate({rounding_mode:'service_half_up',cap_yen:78086}).components.solar,78086);
 assert.equal(calculate({rounding_mode:'service_half_up'},-1).components.solar,0);
 assert.equal(calculate({rounding_mode:'service_half_up',cost_scope:'solar',unit_amount_yen:1000000}).components.solar,2000000);
});

test('指定丸めは容量単価式・1円単位以外を拒否し未指定千円切捨てを維持する',()=>{
 assert.throws(()=>calculate({rounding_mode:'service_half_up',rounding_unit_yen:1000}),/1円単位の容量単価式/);
 assert.throws(()=>calculate({rounding_mode:'service_half_up',formula_type:'fixed',fixed_amount_yen:1000}),/1円単位の容量単価式/);
 assert.equal(calculate({rounding_unit_yen:1000}).components.solar,78000);
});
