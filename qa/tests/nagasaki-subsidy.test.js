import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { calculateEstimate } from '../../site/simulator/src/calculator.js';
import { kansaiFormulaComponents } from '../../site/simulator/src/kansai-formula.js';
import { nonInclusionReason } from '../../site/simulator/src/subsidy-presentation.js';

const data = JSON.parse(await readFile(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));
const rows = data.diagnostic_subsidy_programs.filter(p => p.id.startsWith('nagasaki-'));
const estimate = (extra = {}) => calculateEstimate({
  prefectureCode: '42', municipalityCode: '42207', housingAge: 'existing',
  monthlyElectricityBillYen: 12000, systemCapacityKw: 4,
  equipmentPackage: 'solar_plus_standard_battery', batteryCapacityKwh: 9.5,
  ...extra
}, data);
const standard = extra => estimate(extra).scenarios.find(s => s.scenario === 'standard').subsidy_breakdown;

test('長崎21市町の採用2・候補24・除外26を保持し，候補額を確定ゼロにしない', () => {
  assert.equal(data.municipalities.filter(m => m.prefecture_code === '42').length, 21);
  assert.equal(rows.length, 52);
  assert.equal(rows.filter(p => p.machine_rule === 'kansai_municipal_formula').length, 2);
  assert.equal(rows.filter(p => p.non_adoption_status === 'candidate').length, 24);
  assert.equal(rows.filter(p => p.non_adoption_status === 'excluded').length, 26);
  const candidates = data.municipalities.filter(m => m.prefecture_code === '42')
    .flatMap(m => standard({ municipalityCode: m.municipality_code }).candidate_programs)
    .filter(p => p.id.startsWith('nagasaki-'));
  assert.equal(candidates.length, 24);
  assert.ok(candidates.every(p => p.amount_yen === null));
});

test('平戸はPV10kW未満・B2kWh以上を判定し，新築と既存の併用28万円を保持する', () => {
  for (const housingAge of ['new', 'existing']) {
    assert.equal(standard({ housingAge }).municipality_amount_yen, 280000);
    assert.equal(standard({ housingAge, equipmentPackage: 'solar_only' }).municipality_amount_yen, 80000);
  }
  assert.equal(standard({ systemCapacityKw: 9.999 }).municipality_amount_yen, 300000);
  const excluded = standard({ systemCapacityKw: 10 });
  assert.equal(excluded.municipality_amount_yen, 200000);
  const pv = excluded.excluded_programs.find(p => p.id === 'nagasaki-42207-city-pv-2026');
  assert.equal(pv.reason_code, 'capacity_not_applicable');
  assert.ok(nonInclusionReason(pv).length > 0);
  // UI capacity is 4–16 kWh; the official 2 kWh boundary is tested below at the formula layer.
  assert.throws(() => standard({ batteryCapacityKwh: 2 }), /4.0～16.0/);
  assert.equal(estimate().scenarios.find(s => s.scenario === 'downside').subsidy_breakdown.total_amount_yen, 0);
});

test('平戸の0.01kW切捨て・千円切捨て・蓄電池費半額上限を境界で確認する', () => {
  const input = { housingAge: 'existing', equipmentPackage: 'solar_plus_standard_battery',
    capacityKw: 1.049, batteryCapacityKwh: 2, solarCost: 1000000,
    batteryCost: 399999, batteryEquipmentCost: 399999 };
  const pv = rows.find(p => p.id === 'nagasaki-42207-city-pv-2026');
  const battery = rows.find(p => p.id === 'nagasaki-42207-city-battery-2026');
  const below = kansaiFormulaComponents(battery, { ...input, batteryCapacityKwh: 1.999 });
  assert.equal(below, null);
  assert.equal(kansaiFormulaComponents(pv, input).components.solar, 20000);
  assert.equal(kansaiFormulaComponents(pv, { ...input, capacityKw: 1.05 }).components.solar, 21000);
  assert.equal(kansaiFormulaComponents(battery, input).components.battery, 199000);
  assert.equal(kansaiFormulaComponents(battery, { ...input, batteryCost: 400000 }).components.battery, 200000);
});
