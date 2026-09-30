import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { diagnosticSubsidy, allocateDiagnosticScope } from '../../site/simulator/src/diagnostic-subsidy.js';
import { calculateEstimate } from '../../site/simulator/src/calculator.js';
import { applicationStatusLabel } from '../../site/simulator/src/municipal-information.js';
import { nonInclusionReason } from '../../site/simulator/src/subsidy-presentation.js';

const data = JSON.parse(await readFile(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));
const miyagi = data.diagnostic_subsidy_programs.find(p => p.id === 'miyagi-smart-energy-2026');
const input = { prefectureCode: '04', municipalityCode: null, housingAge: 'existing',
  equipmentPackage: 'solar_plus_standard_battery', capacityKw: 4, batteryCapacityKwh: 9.5,
  solarCost: 1324400, batteryCost: 1149500, batteryEquipmentCost: 1054500 };
const evaluate = (overrides = {}, program = miyagi, included = true) => diagnosticSubsidy([program], { ...input, ...overrides }, included);

test('開始前の宮城は新築・既存とも7万円と期間仮定を保持する', () => {
  for (const housingAge of ['existing', 'new']) {
    const r = evaluate({ housingAge });
    assert.equal(r.total_amount_yen, 70000);
    const p = r.included_programs[0];
    assert.deepEqual(p.component_amounts_yen, { solar: 30000, battery: 40000 });
    assert.equal(applicationStatusLabel(p), '受付開始前');
    assert.ok(p.calculation_assumptions.some(s => s.includes('所定の契約・設置・申請期間')));
  }
  assert.equal(evaluate({}, miyagi, false).total_amount_yen, 0);
});

test('開始前でも設備・容量・FIT・住宅工事・終了・停止・不明の条件を維持する', () => {
  assert.equal(evaluate({ capacityKw: 9.999 }).total_amount_yen, 70000);
  const cases = [
    [{ equipmentPackage: 'solar_only' }, {}, 'equipment_package_not_applicable'],
    [{ capacityKw: 10 }, {}, 'capacity_not_applicable'],
    [{}, { fit_compatible: false }, 'sale_path_not_applicable'],
    [{}, { diagnostic_scope: { ...miyagi.diagnostic_scope, in_scope_housing_ages: [] } }, 'required_external_structure_or_housing_work'],
    [{}, { application_status: 'closed' }, 'application_closed'],
    [{}, { application_status: 'suspended' }, 'application_suspended'],
    [{}, { application_status: 'unknown' }, 'application_status_unconfirmed'],
  ];
  for (const [values, changes, reason] of cases) {
    const r = evaluate(values, { ...miyagi, ...changes });
    assert.equal(r.total_amount_yen, 0);
    const p = [...r.candidate_programs, ...r.excluded_programs][0];
    assert.equal(p.reason_code, reason);
    assert.doesNotMatch(nonInclusionReason(p), /受付開始前のため/);
  }
});

test('宮城の定額は設備別税抜実費を超えず，任意減額せず不申請枝を比較する', () => {
  for (const [solarCost, batteryCost, components] of [
    [33000, 44000, { solar: 30000, battery: 40000 }],
    [32999, 44000, { solar: 0, battery: 40000 }],
    [33000, 43999, { solar: 30000, battery: 0 }],
  ]) assert.deepEqual(evaluate({ solarCost, batteryCost }).included_programs[0].component_amounts_yen, components);
  assert.equal(evaluate({ solarCost: 32999, batteryCost: 43999 }).total_amount_yen, 0);
  const other = { ...miyagi, id: 'other-fixed', machine_rule: 'hyogo_awaji_battery' };
  for (const options of [[[miyagi, 30000], [other, 490000]], [[other, 490000], [miyagi, 30000]]]) {
    const r = allocateDiagnosticScope(options, 550000, 'solar');
    assert.equal(r.total, 490000);
    assert.equal(r.allocation[miyagi.id], 0);
    assert.equal(r.allocation[other.id], 490000);
  }
});

test('旧自治体の開始前で金額不明は候補に残し，既知算式だけ算入する', async () => {
  const estimate = (d, municipalityCode, equipmentPackage = 'solar_plus_standard_battery') => calculateEstimate({
    prefectureCode: municipalityCode.slice(0, 2), municipalityCode, equipmentPackage, housingAge: 'existing',
    systemCapacityKw: 4, batteryCapacityKwh: 9.5, monthlyElectricityBillYen: 12000,
  }, d).scenarios.find(s => s.scenario === 'standard').subsidy_breakdown;
  const scheduled = data.municipal_subsidy_programs.filter(p => p.application_status === 'scheduled');
  assert.equal(scheduled.length, 3);
  for (const p of scheduled) {
    const r = estimate(data, p.municipality_code);
    const row = r.candidate_programs.find(x => x.id === p.id);
    assert.equal(row.amount_yen, null);
    assert.equal(applicationStatusLabel(row), '受付開始前');
    assert.ok(['benefit_amount_rule_unresolved', 'required_benefit_component_missing'].includes(row.reason_code));
  }
  const d = structuredClone(data);
  const {receiveSchemeRules}=await import('../../data/src/scheme-adapter.js');
  receiveSchemeRules(d).municipal.find(p => p.id === 'ibaraki-08215-energy-2026').application_status = 'scheduled';
  const row = estimate(d, '08215', 'solar_only').included_programs.find(p => p.id === 'ibaraki-08215-energy-2026');
  assert.equal(row.amount_yen, 50000);
  assert.equal(applicationStatusLabel(row), '受付開始前');
  assert.ok(row.required_confirmations.some(s => s.includes('所定の契約・設置・申請期間')));
});
