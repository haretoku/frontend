import { readFileSync } from 'node:fs';
import { calculateEstimate } from '../../site/simulator/src/calculator.js';
import {receiveSchemeRules} from '../../data/src/scheme-adapter.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';

export function readFixture(name) {
  return JSON.parse(readFileSync(new URL(`../fixtures/${name}`, import.meta.url), 'utf8'));
}

export function loadPublicData() {
  return JSON.parse(readFileSync(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));
}

export function standardScenario(data, input) {
  return calculateEstimate({
    equipmentPackage: 'solar_plus_standard_battery',
    systemCapacityKw: 4,
    batteryCapacityKwh: 9.5,
    housingAge: 'existing',
    monthlyElectricityBillYen: 12000,
    ...input,
  }, data).scenarios.find(scenario => scenario.scenario === 'standard');
}

export function standardSubsidy(data, input) {
  return standardScenario(data, input).subsidy_breakdown;
}

// 市の適格性・算式と，国県を含めた配賦・最大組合せの検査を分ける．
// 標準設備費のケース専用．個別費用の境界にはdiagnosticInputを直接使う．
export function municipalSubsidy(data, input, additionalRules = []) {
  const rules = receiveSchemeRules(data).diagnostic.filter(rule => rule.government_level === 'municipality');
  const p = diagnosticInput({
    prefecture_code: input.prefectureCode, municipality_code: input.municipalityCode,
    housing_age: input.housingAge ?? 'existing',
    equipment_package: input.equipmentPackage ?? 'solar_plus_standard_battery',
    pv_kw: input.systemCapacityKw ?? 4, battery_kwh: input.batteryCapacityKwh ?? 9.5,
  });
  return diagnosticSubsidy([...rules, ...additionalRules], p, true);
}

// 依存・排他の到達可能な分岐を検査する合成条件．公式の採用額ではない．
export function positivePrefectureRule(id, prefectureCode, amount, scope = 'battery') {
  return {
    id, government_level: 'prefecture', prefecture_code: prefectureCode,
    municipality_code: null, program_name: '依存・排他の検査用制度',
    machine_rule: 'kansai_municipal_formula',
    housing_ages: ['existing', 'new'],
    equipment_packages: ['solar_plus_standard_battery'], application_status: 'accepting',
    diagnostic_scope: {in_scope_housing_ages: ['existing', 'new']},
    expense_scopes: [scope], conflict_program_ids: [],
    official_urls: [], source_ids: [], required_confirmations: [], calculation_assumptions: [],
    formula_components: [{scope, equipment_packages: ['solar_plus_standard_battery'],
      formula_type: 'fixed', fixed_amount_yen: amount, rounding_unit_yen: 1}],
  };
}

// 原fixtureの入力・丸め前費用を保ち，記法だけをブラウザ計算へ対応させる．
export function diagnosticInput(input) {
  const capacityKw = input.pv_kw ?? 4;
  const housingAge = input.housing_age ?? 'existing';
  return {
    prefectureCode: input.prefecture_code ?? '01',
    municipalityCode: input.municipality_code ?? null,
    housingAge,
    equipmentPackage: input.equipment_package ?? input.package,
    capacityKw,
    batteryCapacityKwh: input.battery_kwh,
    solarCost: input.solar_cost_yen ?? Math.round(capacityKw * (housingAge === 'existing' ? 331100 : 317900)),
    batteryCost: input.battery_cost_yen ?? Math.round(input.battery_kwh * 121000),
    batteryEquipmentCost: input.battery_equipment_cost_yen ?? Math.round(input.battery_kwh * 111000),
  };
}
