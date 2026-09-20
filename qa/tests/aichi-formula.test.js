import test from 'node:test';
import assert from 'node:assert/strict';
import {kansaiFormulaComponents} from '../../site/simulator/src/kansai-formula.js';
// Backend's 2026-09-20 Aichi draft: evaluator contract only, pending independent stage 2.
const rules = [
  {
    "id": "aichi-23212-2026",
    "formula_components": [
      {
        "scope": "battery",
        "equipment_packages": [
          "solar_plus_standard_battery"
        ],
        "formula_type": "fixed",
        "cost_scope": "battery",
        "cost_tax": "approved_assumption_inclusive",
        "cap_yen": null,
        "rounding_unit_yen": 1,
        "fixed_amount_yen": 150000,
        "eligible_cost_min_yen": 150000
      }
    ]
  },
  {
    "id": "aichi-23225-2026",
    "formula_components": [
      {
        "scope": "battery",
        "equipment_packages": [
          "solar_plus_standard_battery"
        ],
        "formula_type": "fixed",
        "cost_scope": "battery",
        "cost_tax": "approved_assumption_inclusive",
        "cap_yen": null,
        "rounding_unit_yen": 1,
        "fixed_amount_yen": 400000,
        "eligible_cost_min_yen": 400000
      }
    ]
  },
  {
    "id": "aichi-23228-2026",
    "formula_components": [
      {
        "scope": "battery",
        "equipment_packages": [
          "solar_plus_standard_battery"
        ],
        "formula_type": "cost_fraction",
        "cost_scope": "battery",
        "cost_tax": "exclusive",
        "cap_yen": 200000,
        "rounding_unit_yen": 1000,
        "fraction_numerator": 1,
        "fraction_denominator": 4,
        "defer_rounding_to_formula_total": true
      },
      {
        "scope": "battery",
        "equipment_packages": [
          "solar_plus_standard_battery"
        ],
        "formula_type": "cost_fraction",
        "cost_scope": "battery",
        "cost_tax": "exclusive",
        "cap_yen": 200000,
        "rounding_unit_yen": 1000,
        "fraction_numerator": 1,
        "fraction_denominator": 4,
        "eligible_cost_min_yen": 600000,
        "defer_rounding_to_formula_total": true
      }
    ],
    "formula_total": {
      "cost_scope": "battery",
      "cost_tax": "exclusive",
      "fraction_numerator": null,
      "fraction_denominator": null,
      "cap_yen": null,
      "rounding_unit_yen": 1000
    }
  }
];
const evaluate=(rule,cost)=>kansaiFormulaComponents(rule,{housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:cost,batteryEquipmentCost:cost});
test('愛知草案の安城・知立最低経費は閾値未満を除き一致以上で固定額とする',()=>{
 for(const [code,min] of [['23212',150000],['23225',400000]]){
  const rule=rules.find(r=>r.id===`aichi-${code}-2026`);
  for(const [cost,amount] of [[min-1,0],[min,min],[min+1,min],[1149500,min]])assert.equal(evaluate(rule,cost)?.components.battery??0,amount,`${code}/${cost}`);
  const noMinimum=structuredClone(rule);delete noMinimum.formula_components[0].eligible_cost_min_yen;
  assert.equal(evaluate(noMinimum,min-1).components.battery,min-1);
 }
});
test('岩倉草案は税抜60万円閾値の追加を一度だけ加え合算後千円切捨てする',()=>{
 const rule=rules.find(r=>r.id==='aichi-23228-2026');
 for(const [cost,amount,count] of [[659999,149000,1],[660000,300000,2],[660001,300000,2],[880000,400000,2],[1149500,400000,2],[661100,300000,2]]){
  const result=evaluate(rule,cost);assert.equal(result.components.battery,amount,String(cost));assert.equal(result.details.formula_components_applied.length,count);
  assert.equal(result.details.formula_total_applied.amount_yen,amount);
  if(count===1)assert.deepEqual(result.details.formula_components_excluded,[{scope:'battery',reason_code:'eligible_cost_below_minimum',eligible_cost_min_yen:600000}]);
 }
 // At 663,300 inclusive, two raw 150,750 parts must total 301,000, not 300,000.
 assert.equal(evaluate(rule,663300).components.battery,301000);
});
test('最低経費は選択した費目の税変換後に評価し費目未指定を拒否する',()=>{
 const source=rules.find(r=>r.id==='aichi-23212-2026');
 const rule=structuredClone(source);rule.formula_components[0].cost_scope='solar';
 assert.equal(evaluate(rule,1).components.battery,150000);
 delete rule.formula_components[0].cost_scope;
 assert.throws(()=>evaluate(rule,1149500),/cost_scope/);
});