import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents,kansaiResidualItem,kansaiResidualAmount,kansaiBelowMinimumCost} from '../../site/simulator/src/kansai-formula.js';
const program=(extra={})=>({machine_rule:'kansai_municipal_formula',formula_components:[{scope:'battery',equipment_packages:['solar_plus_standard_battery'],formula_type:'cost_fraction',cost_scope:'battery',cost_tax:'approved_assumption_inclusive',eligible_cost_deduction_yen:200000,fraction_numerator:1,fraction_denominator:5,cap_yen:200000,rounding_unit_yen:1000,...extra}]});
const input={housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1000000,batteryCost:1140000};
test('定額20万円控除は費用確定後に一度だけ適用し率・上限・千円境界を守る',()=>{
 for(const [cost,expected] of [[0,0],[199999,0],[200000,0],[204999,0],[205000,1000],[1140000,188000],[1200000,200000],[1500000,200000]])assert.equal(kansaiFormulaComponents(program(),{...input,batteryCost:cost}).components.battery,expected);
 const p=program(),r=kansaiFormulaComponents(p,input),item=kansaiResidualItem(p,r.details,'battery');assert.equal(item.eligible_cost_yen_unrounded,'940000');assert.equal(item.eligible_cost_deduction_yen,200000);
 for(const [other,expected] of [[0,188000],[100000,168000],[939999,0],[940000,0],[1000000,0]])assert.equal(kansaiResidualAmount(item,188000,other),expected);
});
test('税抜換算と最低費用判定を固定控除より先に行う',()=>{
 const p=program({cost_tax:'exclusive',eligible_cost_min_yen:500000});assert.equal(kansaiFormulaComponents(p,{...input,batteryCost:549999}),null);
 const r=kansaiFormulaComponents(p,{...input,batteryCost:550000});assert.equal(r.components.battery,60000);assert.equal(r.details.formula_components_applied[0].eligible_cost_yen_unrounded,'300000');
});
test('未指定は従来の証跡を維持し対象費率式以外の控除を拒否する',()=>{
 const r=kansaiFormulaComponents(program({eligible_cost_deduction_yen:undefined}),input);assert.equal(r.components.battery,200000);assert.ok(!Object.hasOwn(r.details.formula_components_applied[0],'eligible_cost_deduction_yen'));
 assert.throws(()=>kansaiFormulaComponents(program({formula_type:'fixed',fixed_amount_yen:100000}),input),/対象費率式/);
});

test('全適合成分の費用下限未達を，境界一致・下限なし・固定控除後と区別する',()=>{
 const p=program({eligible_cost_min_yen:500000,cost_tax:'exclusive'});
 assert.equal(kansaiBelowMinimumCost(p,{...input,batteryCost:549999}),true);
 assert.equal(kansaiBelowMinimumCost(p,{...input,batteryCost:550000}),false);
 assert.equal(kansaiBelowMinimumCost(program(),input),false);
 assert.equal(kansaiBelowMinimumCost(p,{...input,equipmentPackage:'solar_only'}),false);
 const mixed={formula_components:[...p.formula_components,...program().formula_components]};
 assert.equal(kansaiBelowMinimumCost(mixed,{...input,batteryCost:499999}),false);
});
