import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateEstimate } from "../../site/simulator/src/calculator.js";


const publicData = JSON.parse(
  await readFile(new URL("../../data/input/public-data.json", import.meta.url), "utf8")
);
const calculationCases = JSON.parse(
  await readFile(new URL("../fixtures/calculation-cases.json", import.meta.url), "utf8")
);

test("公開契約9.1.0は容量劣化の意味と時点を明示した蓄電池契約を提供する", () => {
  const calculation = publicData.calculation;
  const occupancyModel = calculation.daytime_occupancy;

  assert.equal(publicData.schema_version, "9.1.0");
  assert.equal(occupancyModel.model_id, "residential-pv-hourly-overlap-2026");
  assert.equal(occupancyModel.time_bin_definition.count, 8760);
  assert.equal(
    occupancyModel.load_profile.raw_profiles_kwh_per_hour.official_standard_calendar.length,
    8760
  );
  assert.equal(
    occupancyModel.load_profile.raw_profiles_kwh_per_hour.weekday_home_equivalent.length,
    8760
  );
  for (const profile of occupancyModel.generation_profile.orientation_profiles) {
    assert.equal(profile.standard_year_hourly_annual_shares.length, 8760);
  }
  assert.ok(Array.isArray(calculation.sale_price_periods));
  assert.ok(calculation.sale_price_periods.length > 0);
  assert.equal(Object.hasOwn(calculation, "purchase_price"), false);
  assert.equal(Object.hasOwn(occupancyModel, "baseline_self_consumption_rate"), false);
  assert.equal(Object.hasOwn(occupancyModel, "daytime_occupancy_effect_percentage_points"), false);
  assert.equal(publicData.municipalities.length, 227);
  assert.ok(Array.isArray(publicData.municipal_subsidy_programs));
  assert.deepEqual(calculation.equipment_packages, ["solar_only", "solar_plus_standard_battery"]);
  assert.equal(calculation.default_equipment_package, "solar_only");
  assert.equal(calculation.battery_system.capacity_kwh, 9.5);
  assert.equal(calculation.battery_system.installed_cost_yen, 1_149_500);
  assert.equal(calculation.battery_system.replacement_cost_yen, 0);
  assert.deepEqual(calculation.battery_system.replacement_years, []);
  assert.equal(
    calculation.battery_system.replacement_policy,
    "no_replacement_within_20_year_evaluation_period"
  );
  assert.equal(
    calculation.battery_system.replacement_policy_basis,
    "service_requirement_no_replacement_scenario_with_year_16_to_20_mathematical_extrapolation_and_no_cycle_to_service_life_conversion"
  );
  assert.equal(calculation.battery_system.twenty_year_service_life_or_warranty_verified, false);
  assert.equal(calculation.battery_system.capacity_retention_at_year_15, 0.6);
  assert.equal(calculation.battery_system.annual_capacity_retention_factor, 0.9665183044745802);
  assert.equal(calculation.battery_system.capacity_retention_at_year_20, 0.5060595991810496);
  assert.equal(
    calculation.battery_system.capacity_retention_basis,
    "warranty_floor_aligned_conservative_sensitivity_path"
  );
  assert.equal(calculation.battery_system.capacity_retention_is_measured_average, false);
  assert.equal(
    calculation.battery_system.capacity_timing,
    "end_of_year_capacity_applied_throughout_each_operating_year"
  );
  assert.equal(calculation.battery_system.replacement_trigger_capacity_retention, null);
  assert.deepEqual(calculation.battery_capacity_input, {
    input_name: "battery_capacity_kwh",
    definition: calculation.battery_capacity_input.definition,
    unit: "kWh",
    minimum: 4,
    maximum: 16,
    multiple_of: 0.5,
    default: 9.5,
    applicable_equipment_package: "solar_plus_standard_battery",
    inactive_value_behavior: "ignore_and_normalize_to_zero",
    url_parameter_name: "batteryCapacityKwh",
    calculation_status: "supported",
    decision_type: "service_input_constraint",
    basis: calculation.battery_capacity_input.basis,
    set_at: "2026-09-05"
  });
  const tokyo = publicData.prefectures.find((prefecture) => prefecture.code === "13");
  assert.equal(tokyo.default_monthly_electricity_bill_yen, 15_467);
  assert.equal(tokyo.default_electricity_bill_household_scope, "建て方別・世帯人数別（4区分）_戸建_4人以上");
  assert.equal(tokyo.default_electricity_bill_label, "戸建て・4人以上世帯の地域平均（令和5年度）");
  assert.ok(tokyo.default_electricity_bill_surveyed_households > 0);
  const maintenanceEvent = calculation.lifecycle_cost_events.find((event) => event.cost_type === "maintenance");
  const replacementEvent = calculation.lifecycle_cost_events.find((event) => event.cost_type === "replacement");
  assert.equal(maintenanceEvent.cost_yen, 38_000);
  assert.deepEqual(maintenanceEvent.event_years, [4, 8, 12, 16, 20]);
  assert.equal(maintenanceEvent.cost_value_basis, "official_jpea_hearing_observation_2026");
  assert.equal(maintenanceEvent.tax_status, "unknown");
  assert.equal(replacementEvent.cost_yen, 384_000);
  assert.deepEqual(replacementEvent.event_years, [15]);
  assert.equal(replacementEvent.cost_value_basis, "official_jpea_hearing_observation_2026");
  assert.deepEqual(
    publicData.scenarios.map((scenario) => scenario.electricity_price_growth_rate),
    [0, 0.015, 0.03]
  );
});

for (const calculationCase of calculationCases.cases) {
  test(`backend基準計算と一致する：${calculationCase.id}`, () => {
    const actual = calculateEstimate(
      {
        prefectureCode: calculationCase.input.prefecture_code,
        municipalityCode: calculationCase.input.municipality_code ?? null,
        monthlyElectricityBillYen: calculationCase.input.monthly_electricity_bill_yen,
        detailConditions: calculationCase.input.detail_conditions ?? undefined,
        systemCapacityKw: calculationCase.input.system_capacity_kw ?? undefined,
        daytimeOccupancy: calculationCase.input.daytime_occupancy ?? undefined,
        equipmentPackage: calculationCase.input.equipment_package ?? undefined,
        batteryCapacityKwh: calculationCase.input.battery_capacity_kwh
      },
      publicData
    );
    assert.deepEqual(actual, calculationCase.expected);
  });
}

test("Schema 9.1正本3ファイルのSHA-256が承認値と一致する", async () => {
  const expectedHashes = new Map([
    ["../../data/input/public-data.json", "CB83CCF56ADEF44EE7319686DC7F41EF3CB0B7817B57819223CACC24BA301B50"],
    ["../fixtures/calculation-cases.json", "91B65F4EC42C66D1F5CBD3C08B719364DB083A9FEF87C3586A6ED8AE300CC5A8"],
    ["../../data/input/metadata.json", "9B56E2E02F7A4F65BAFD3AE546775929CD706C7C9C8F0D0D7D00EB322CB65B19"]
  ]);
  for (const [path, expectedHash] of expectedHashes) {
    const contents = await readFile(new URL(path, import.meta.url));
    assert.equal(createHash("sha256").update(contents).digest("hex").toUpperCase(), expectedHash);
  }
});

test("蓄電池容量は契約境界と刻みを検証し，太陽光のみでは残存値を不活性化する", () => {
  for (const batteryCapacityKwh of [4, 8, 9.5, 16]) {
    const result = calculateEstimate({
      prefectureCode: "13",
      monthlyElectricityBillYen: null,
      equipmentPackage: "solar_plus_standard_battery",
      batteryCapacityKwh
    }, publicData);
    assert.equal(result.input.battery_capacity_kwh, batteryCapacityKwh);
    assert.equal(result.input.battery_capacity_source, "user_input");
    assert.equal(result.input.used_default_battery_capacity, false);
  }
  for (const batteryCapacityKwh of [3.5, 4.25, 16.5, Number.NaN, Number.POSITIVE_INFINITY]) {
    assert.throws(() => calculateEstimate({
      prefectureCode: "13",
      monthlyElectricityBillYen: null,
      equipmentPackage: "solar_plus_standard_battery",
      batteryCapacityKwh
    }, publicData), /蓄電池容量/);
  }
  const solarOnly = calculateEstimate({
    prefectureCode: "13",
    monthlyElectricityBillYen: null,
    equipmentPackage: "solar_only",
    batteryCapacityKwh: Number.NaN
  }, publicData);
  assert.equal(solarOnly.input.battery_capacity_kwh, 0);
  assert.equal(solarOnly.input.battery_capacity_source, "not_applicable");
  assert.equal(solarOnly.input.used_default_battery_capacity, false);
});

test("容量変更は契約単価，20年電力保存，補助金および利益へ連動する", () => {
  const profitByCapacity = new Map();
  for (const batteryCapacityKwh of [4, 8, 9.5, 16]) {
    const result = calculateEstimate({
      prefectureCode: "13",
      monthlyElectricityBillYen: null,
      equipmentPackage: "solar_plus_standard_battery",
      batteryCapacityKwh
    }, publicData);
    const standard = result.scenarios.find((scenario) => scenario.scenario === "standard");
    assert.equal(
      standard.battery_installation_cost_yen,
      Math.round(batteryCapacityKwh * publicData.calculation.battery_system.installed_cost_yen_per_kwh)
    );
    assert.equal(standard.subsidy_yen, 480_000);
    assert.equal(
      standard.profit_yen,
      Math.round(standard.total_revenue_yen
        - standard.net_initial_outlay_yen
        - standard.total_maintenance_and_replacement_cost_yen)
    );
    profitByCapacity.set(batteryCapacityKwh, standard.profit_yen);
    assert.equal(result.energy.annual_energy_flows.length, 20);
    for (const flow of result.energy.annual_energy_flows) {
      assert.ok(Math.abs(
        result.energy.annual_generation_kwh
        - flow.annual_direct_self_consumed_kwh
        - flow.annual_battery_charge_input_kwh
        - flow.annual_exported_kwh
      ) <= 1);
      assert.ok(Math.abs(
        result.energy.annual_consumption_kwh
        - flow.annual_direct_self_consumed_kwh
        - flow.annual_battery_delivered_kwh
        - flow.annual_purchased_kwh
      ) <= 1);
    }
  }
  assert.notEqual(profitByCapacity.get(4), profitByCapacity.get(16));

  const nikko = calculateEstimate({
    prefectureCode: "09",
    municipalityCode: "09206",
    monthlyElectricityBillYen: null,
    equipmentPackage: "solar_plus_standard_battery",
    batteryCapacityKwh: 9.5
  }, publicData);
  const nikkoStandard = nikko.scenarios.find((scenario) => scenario.scenario === "standard");
  assert.equal(nikkoStandard.subsidy_breakdown.total_amount_yen, 0);
  assert.ok(nikkoStandard.subsidy_breakdown.candidate_programs.length > 0);
  assert.ok(nikkoStandard.subsidy_breakdown.candidate_programs.every((program) => program.amount_yen === null));
});

test("回収年は未入力時の地域平均と後年の維持・交換費を反映した最終回収年を返す", () => {
  const expectedByCapacity = new Map([[1, null], [3, 9], [4, 16], [5, 16], [6, 12]]);
  for (const [systemCapacityKw, expectedPaybackYear] of expectedByCapacity) {
    const tokyo = calculateEstimate(
      { prefectureCode: "13", monthlyElectricityBillYen: null, systemCapacityKw },
      publicData
    );
    const standard = tokyo.scenarios.find((scenario) => scenario.scenario === "standard");
    assert.equal(standard.payback_year, expectedPaybackYear);
  }
});

test("市区町村コードは公開マスターと都道府県の組合せを検証する", () => {
  assert.throws(
    () => calculateEstimate(
      { prefectureCode: "13", municipalityCode: "08201", monthlyElectricityBillYen: null },
      publicData
    ),
    /一致しません/
  );
  assert.throws(
    () => calculateEstimate(
      { prefectureCode: "13", municipalityCode: "13999", monthlyElectricityBillYen: null },
      publicData
    ),
    /公開自治体マスター/
  );
});

test("不明な都道府県を拒否する", () => {
  assert.throws(
    () => calculateEstimate(
      { prefectureCode: "99", monthlyElectricityBillYen: null },
      publicData
    ),
    /都道府県/
  );
});

test("負の月間電気料金を拒否する", () => {
  assert.throws(
    () => calculateEstimate(
      { prefectureCode: "13", monthlyElectricityBillYen: -1 },
      publicData
    ),
    /月間電気料金/
  );
});

test("有限な数値以外の月間電気料金を拒否する", () => {
  for (const invalidBill of [Number.NaN, Number.POSITIVE_INFINITY, "10000", true]) {
    assert.throws(
      () => calculateEstimate(
        { prefectureCode: "13", monthlyElectricityBillYen: invalidBill },
        publicData
      ),
      /月間電気料金/
    );
  }
});

test("47都道府県でシナリオ順序と電力量保存が成立する", () => {
  assert.equal(publicData.prefectures.length, 47);
  for (const prefecture of publicData.prefectures) {
    const result = calculateEstimate(
      { prefectureCode: prefecture.code, monthlyElectricityBillYen: null },
      publicData
    );
    const scenarios = Object.fromEntries(
      result.scenarios.map((scenario) => [scenario.scenario, scenario])
    );
    assert.ok(scenarios.upside.profit_yen >= scenarios.standard.profit_yen);
    assert.ok(scenarios.standard.profit_yen >= scenarios.downside.profit_yen);
    assert.equal(scenarios.downside.subsidy_yen, 0);
    assert.ok(scenarios.standard.subsidy_yen >= 0);
    assert.equal(scenarios.upside.subsidy_yen, scenarios.standard.subsidy_yen);
    assert.ok(
      Math.abs(
        result.energy.annual_self_consumed_kwh
        + result.energy.annual_exported_kwh
        - result.energy.annual_generation_kwh
      ) <= 1
    );
  }
});

test("月間電気料金の境界でも8760時間モデルと物理上限を守る", () => {
  const zero = calculateEstimate(
    { prefectureCode: "27", monthlyElectricityBillYen: 0 },
    publicData
  );
  assert.equal(zero.energy.annual_self_consumed_kwh, 0);
  assert.equal(zero.energy.annual_exported_kwh, zero.energy.annual_generation_kwh);

  const high = calculateEstimate(
    { prefectureCode: "47", monthlyElectricityBillYen: 1_000_000 },
    publicData
  );
  assert.equal(high.energy.self_consumption_rate, 1);
  assert.equal(high.energy.annual_self_consumed_kwh, high.energy.annual_generation_kwh);
  assert.equal(high.energy.temporal_overlap_bin_count, 8760);
  assert.equal(high.energy.annual_consumption_estimation_method_id, "annual-bill-divided-by-prefecture-average-unit-price");
  assert.equal(
    high.energy.annual_self_consumed_kwh + high.energy.annual_exported_kwh,
    high.energy.annual_generation_kwh
  );
});

test("設備容量は1 kW当たりの検証済みデータから換算する", () => {
  const fourKw = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: 11_567, systemCapacityKw: 4 },
    publicData
  );
  const sixKw = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: 11_567, systemCapacityKw: 6 },
    publicData
  );
  const fourKwStandard = fourKw.scenarios.find((scenario) => scenario.scenario === "standard");
  const sixKwStandard = sixKw.scenarios.find((scenario) => scenario.scenario === "standard");

  assert.equal(sixKw.energy.annual_generation_kwh, Math.round(fourKw.energy.annual_generation_kwh * 1.5));
  assert.ok(fourKwStandard.subsidy_yen > 0);
  assert.equal(fourKwStandard.subsidy_status, "applied");
  assert.ok(sixKwStandard.subsidy_yen > fourKwStandard.subsidy_yen);
  assert.equal(sixKwStandard.subsidy_status, "applied");
  assert.equal(sixKwStandard.lifecycle_cost_status, "applied");
  assert.equal(sixKwStandard.total_maintenance_cost_yen, 190_000);
  assert.equal(sixKwStandard.total_replacement_cost_yen, 384_000);
  assert.equal(sixKwStandard.total_maintenance_and_replacement_cost_yen, 574_000);
  assert.equal(sixKwStandard.annual_cash_flows.length, 20);
  assert.equal(sixKwStandard.annual_cash_flows[14].replacement_cost_yen, 384_000);
  assert.equal(sixKwStandard.annual_cash_flows[19].cumulative_cash_flow_yen, sixKwStandard.profit_yen);
});

test("不正な設備容量を拒否する", () => {
  for (const invalidCapacity of [0, -1, Number.NaN, Number.POSITIVE_INFINITY, "4"] ) {
    assert.throws(
      () => calculateEstimate(
        { prefectureCode: "13", monthlyElectricityBillYen: null, systemCapacityKw: invalidCapacity },
        publicData
      ),
      /設置容量/
    );
  }
});

test("日中在宅状況は公開契約の選択値だけを受け付ける", () => {
  assert.throws(
    () => calculateEstimate(
      { prefectureCode: "13", monthlyElectricityBillYen: null, daytimeOccupancy: "invalid" },
      publicData
    ),
    /日中在宅状況/
  );
});

test("日中在宅状況は電力量と収入を変えるが費用を変えない", () => {
  const alwaysHome = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: null, daytimeOccupancy: "almost_every_weekday" },
    publicData
  );
  const almostNeverHome = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: null, daytimeOccupancy: "almost_never" },
    publicData
  );
  const alwaysHomeStandard = alwaysHome.scenarios.find((scenario) => scenario.scenario === "standard");
  const almostNeverHomeStandard = almostNeverHome.scenarios.find((scenario) => scenario.scenario === "standard");

  assert.ok(alwaysHome.energy.annual_self_consumed_kwh > almostNeverHome.energy.annual_self_consumed_kwh);
  assert.ok(alwaysHome.energy.annual_exported_kwh < almostNeverHome.energy.annual_exported_kwh);
  assert.ok(alwaysHome.energy.annual_purchased_kwh < almostNeverHome.energy.annual_purchased_kwh);
  assert.notEqual(alwaysHomeStandard.total_revenue_yen, almostNeverHomeStandard.total_revenue_yen);
  assert.equal(alwaysHomeStandard.gross_installation_cost_yen, almostNeverHomeStandard.gross_installation_cost_yen);
  assert.equal(alwaysHomeStandard.net_initial_outlay_yen, almostNeverHomeStandard.net_initial_outlay_yen);
  assert.equal(alwaysHomeStandard.total_maintenance_and_replacement_cost_yen, almostNeverHomeStandard.total_maintenance_and_replacement_cost_yen);
});

test("地域平均は未入力時だけ使用し，手入力値は0円を含めて優先する", () => {
  const omitted = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: null },
    publicData
  );
  const entered = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: 20_000 },
    publicData
  );
  const enteredZero = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: 0 },
    publicData
  );
  assert.equal(omitted.input.monthly_electricity_bill_yen, 15_467);
  assert.equal(omitted.input.used_default_monthly_electricity_bill, true);
  assert.equal(entered.input.monthly_electricity_bill_yen, 20_000);
  assert.equal(entered.input.used_default_monthly_electricity_bill, false);
  assert.equal(enteredZero.input.monthly_electricity_bill_yen, 0);
  assert.equal(enteredZero.input.used_default_monthly_electricity_bill, false);
});

test("5つの入力が対応する計算結果へ反映される", () => {
  const standardScenario = (result) => result.scenarios.find(
    (scenario) => scenario.scenario === "standard"
  );
  const baseInput = {
    prefectureCode: "13",
    monthlyElectricityBillYen: 11_567,
    systemCapacityKw: 4,
    daytimeOccupancy: "unknown_standard",
    detailConditions: { roof_orientation: "south" }
  };
  const base = calculateEstimate(baseInput, publicData);
  const higherBill = calculateEstimate(
    { ...baseInput, monthlyElectricityBillYen: 15_000 },
    publicData
  );
  const differentOccupancy = calculateEstimate(
    { ...baseInput, daytimeOccupancy: "almost_never" },
    publicData
  );
  const largerCapacity = calculateEstimate(
    { ...baseInput, systemCapacityKw: 5 },
    publicData
  );
  const differentPrefecture = calculateEstimate(
    { ...baseInput, prefectureCode: "01" },
    publicData
  );
  const differentOrientation = calculateEstimate(
    { ...baseInput, detailConditions: { roof_orientation: "east_west_unknown" } },
    publicData
  );

  assert.ok(higherBill.energy.annual_consumption_kwh > base.energy.annual_consumption_kwh);
  assert.notEqual(higherBill.energy.annual_self_consumed_kwh, base.energy.annual_self_consumed_kwh);
  assert.notEqual(standardScenario(higherBill).profit_yen, standardScenario(base).profit_yen);
  assert.notEqual(differentOccupancy.energy.annual_self_consumed_kwh, base.energy.annual_self_consumed_kwh);
  assert.notEqual(standardScenario(differentOccupancy).profit_yen, standardScenario(base).profit_yen);
  assert.ok(largerCapacity.energy.annual_generation_kwh > base.energy.annual_generation_kwh);
  assert.ok(standardScenario(largerCapacity).gross_installation_cost_yen > standardScenario(base).gross_installation_cost_yen);
  assert.notEqual(differentPrefecture.energy.annual_generation_kwh, base.energy.annual_generation_kwh);
  assert.notEqual(standardScenario(differentPrefecture).profit_yen, standardScenario(base).profit_yen);
  assert.ok(differentOrientation.energy.annual_generation_kwh < base.energy.annual_generation_kwh);
  assert.notEqual(standardScenario(differentOrientation).profit_yen, standardScenario(base).profit_yen);
});

test("標準蓄電池は20年間交換せず容量劣化とSOCを引き継ぐ", () => {
  const result = calculateEstimate(
    {
      prefectureCode: "13",
      monthlyElectricityBillYen: 11_567,
      systemCapacityKw: 4,
      equipmentPackage: "solar_plus_standard_battery"
    },
    publicData
  );
  const flows = result.energy.annual_energy_flows;
  const year15 = flows[14];
  const year16 = flows[15];
  const standard = result.scenarios.find((scenario) => scenario.scenario === "standard");

  assert.equal(flows.length, 20);
  assert.equal(year15.battery_service_age_year, 15);
  assert.ok(year15.opening_state_of_charge_before_adjustment_kwh >= year15.opening_state_of_charge_kwh);
  assert.ok(year15.capacity_fade_spillage_kwh >= 0);
  assert.ok(Object.hasOwn(year15, "replacement_disposal_spillage_kwh"));
  assert.ok(year15.replacement_disposal_spillage_kwh >= 0);
  assert.equal(year16.battery_service_age_year, 16);
  assert.equal(year16.opening_state_of_charge_before_adjustment_kwh, year15.closing_state_of_charge_kwh);
  assert.ok(year16.battery_usable_capacity_kwh < year15.battery_usable_capacity_kwh);
  assert.equal(flows[19].battery_service_age_year, 20);
  assert.ok(flows.every((flow) => flow.replacement_disposal_spillage_kwh === 0));
  assert.ok(standard.annual_cash_flows.every((flow) => flow.battery_replacement_cost_yen === 0));
  assert.equal(standard.total_battery_replacement_cost_yen, 0);
  assert.equal(standard.annual_cash_flows[14].replacement_cost_yen, 384_000);
  assert.equal(standard.total_maintenance_and_replacement_cost_yen, 574_000);
});

test("20年間の収入・削減効果は丸め済み内訳の再加算ではなく正本値を維持する", () => {
  const result = calculateEstimate(
    {
      prefectureCode: "13",
      monthlyElectricityBillYen: 11_567,
      systemCapacityKw: 4,
      equipmentPackage: "solar_plus_standard_battery"
    },
    publicData
  );
  const standard = result.scenarios.find((scenario) => scenario.scenario === "standard");
  assert.equal(standard.total_revenue_yen, 2_286_384);
  assert.notEqual(
    standard.total_revenue_yen,
    standard.total_electricity_savings_yen + standard.total_sales_income_yen
  );
});

test("未定義の設備構成を拒否する", () => {
  assert.throws(
    () => calculateEstimate(
      {
        prefectureCode: "13",
        monthlyElectricityBillYen: null,
        equipmentPackage: "battery_only"
      },
      publicData
    ),
    /設備選択/
  );
});
