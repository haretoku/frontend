import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';

test('新親契約を入口とする全基準ケースの結果が一致する',{skip:!process.env.HARETOKU_SCHEME_REVIEW_FILE},async()=>{
  const data=JSON.parse(await readFile(process.env.HARETOKU_SCHEME_REVIEW_FILE,'utf8'));
  const cases=JSON.parse(await readFile(new URL('../fixtures/calculation-cases.json',import.meta.url),'utf8'));
  // Compatibility arrays must not be used as the source in the new path.
  data.diagnostic_subsidy_programs=[];data.municipal_subsidy_programs=[];
  const canonical=value=>JSON.parse(JSON.stringify(value,(key,value)=>['eligible_cost_yen_unrounded','capacity_amount_yen_unrounded','amount_yen_before_deferred_rounding'].includes(key)&&value!==null?Number(value):value));
  for(const c of cases.cases){
    const i=c.input;
    const actual=calculateEstimate({housingAge:i.housing_age,prefectureCode:i.prefecture_code,municipalityCode:i.municipality_code??null,monthlyElectricityBillYen:i.monthly_electricity_bill_yen,detailConditions:i.detail_conditions??undefined,systemCapacityKw:i.system_capacity_kw??undefined,daytimeOccupancy:i.daytime_occupancy??undefined,equipmentPackage:i.equipment_package??undefined,batteryCapacityKwh:i.battery_capacity_kwh,batteryDegradationScenario:i.battery_degradation_scenario},data);
    assert.deepEqual(canonical(actual),canonical(c.expected),c.id);
  }
});
