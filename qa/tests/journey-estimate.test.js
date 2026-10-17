import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {calculateJourneyEstimate} from '../../site/map/estimate-model.js';

const publicData = JSON.parse(await readFile(new URL('../../data/input/public-data.json', import.meta.url),'utf8'));

test('修理予備費と毎年の設備保険料を，全シナリオの収支・回収年へ反映する', () => {
  const original = JSON.stringify(publicData.calculation);
  for (const equipmentPackage of ['solar_only','solar_plus_standard_battery']) {
    const input = {prefectureCode:'13', municipalityCode:null, housingAge:'existing', monthlyElectricityBillYen:null,
      systemCapacityKw:4, equipmentPackage, roofOrientation:'south', daytimeOccupancy:'unknown_standard'};
    const base = calculateEstimate(input, publicData);
    const actual = calculateJourneyEstimate(input, publicData);
    const batteryTotal = equipmentPackage === 'solar_plus_standard_battery' ? 150000 : 0;
    const insurancePerYear = equipmentPackage === 'solar_plus_standard_battery' ? 6000 : 3000;
    const additionalTotal = 20000 + batteryTotal + insurancePerYear * 30;
    for (const before of base.scenarios) {
      const after = actual.scenarios.find(s => s.scenario === before.scenario);
      assert.equal(after.profit_yen, before.profit_yen - additionalTotal);
      assert.equal(after.total_maintenance_cost_yen, before.total_maintenance_cost_yen + additionalTotal);
      assert.equal(after.total_maintenance_and_replacement_cost_yen, before.total_maintenance_and_replacement_cost_yen + additionalTotal);
      assert.equal(after.total_replacement_cost_yen, before.total_replacement_cost_yen);
      let cumulativeReserve = 0;
      for (let i = 0; i < 30; i++) {
        const year = i + 1;
        const reserve = insurancePerYear + (year === 30 ? 20000 : 0)
          + (batteryTotal && [5,10,15,20,25,30].includes(year) ? 25000 : 0);
        cumulativeReserve += reserve;
        const flow = after.annual_cash_flows[i], previous = before.annual_cash_flows[i];
        assert.deepEqual(flow, {...previous,
          maintenance_cost_yen: previous.maintenance_cost_yen + reserve,
          maintenance_and_replacement_cost_yen: previous.maintenance_and_replacement_cost_yen + reserve,
          net_cash_flow_yen: previous.net_cash_flow_yen - reserve,
          cumulative_cash_flow_yen: previous.cumulative_cash_flow_yen - cumulativeReserve
        });
      }
      assert.equal(after.total_revenue_yen, before.total_revenue_yen);
      assert.equal(after.subsidy_yen, before.subsidy_yen);
      assert.equal(after.total_battery_replacement_cost_yen, 0);
      const final = after.annual_cash_flows[29];
      assert.equal(final.cumulative_cash_flow_yen, after.profit_yen);
      const cashFlows = after.annual_cash_flows;
      const durableIndex = cashFlows.findIndex((flow,i) => flow.cumulative_cash_flow_yen >= 0
        && cashFlows.slice(i).every(later => later.cumulative_cash_flow_yen >= 0));
      assert.equal(after.payback_year, durableIndex < 0 ? null : durableIndex + 1);
    }
    assert.deepEqual(calculateJourneyEstimate(input, publicData), actual);
  }
  assert.equal(JSON.stringify(publicData.calculation), original);
});

test('設備省略時は既定設備に従い，追加イベントを再投入しても二重計上しない', () => {
  const input = {prefectureCode:'13', municipalityCode:null, housingAge:'existing', monthlyElectricityBillYen:null,
    systemCapacityKw:4, roofOrientation:'south', daytimeOccupancy:'unknown_standard'};
  const data = {...publicData, calculation:{...publicData.calculation, default_equipment_package:'solar_plus_standard_battery'}};
  const expected = calculateJourneyEstimate({...input, equipmentPackage:'solar_plus_standard_battery'}, data);
  const reused = {...data, calculation:{...data.calculation, lifecycle_cost_events:[...data.calculation.lifecycle_cost_events,
    {id:'journey-additional-repair-reserve',cost_type:'maintenance',cost_yen:20000,event_years:[30]},
    {id:'journey-battery-repair-reserve',cost_type:'maintenance',cost_yen:25000,event_years:[5,10,15,20,25,30]},
    {id:'journey-equipment-insurance',cost_type:'maintenance',cost_yen:99999,event_years:[1,5,30]}
  ]}};
  assert.deepEqual(calculateJourneyEstimate(input, reused), expected);
  assert.deepEqual(calculateJourneyEstimate({...input, equipmentPackage:'solar_only'}, reused),
    calculateJourneyEstimate({...input, equipmentPackage:'solar_only'}, data));
});

test('30年以外に30年間の予備費を無条件適用しない', () => {
  const shortened = {...publicData, calculation:{...publicData.calculation, evaluation_period_years:20}};
  assert.throws(() => calculateJourneyEstimate({}, shortened), /30年間の試算仮定/);
});
