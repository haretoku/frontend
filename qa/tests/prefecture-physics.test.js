import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {preprocessCapacity} from '../../site/simulator/src/capacity-preprocessing.js';
const publicData=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const capacityPreprocessingCases=JSON.parse(await readFile(new URL('../fixtures/capacity-preprocessing.json',import.meta.url),'utf8'));
test("制度固有の容量切捨ては十進境界と指数表記を保ち，省略時は入力不変", () => {
  for (const [input, expected] of [[1.199999, 1.1], [1.2, 1.2], [1.200001, 1.2], [1.13, 1.1], [1.067, 1], [1.2e-7, 0], [1.2e21, 1.2e21]]) {
    assert.equal(preprocessCapacity(input, "floor_0_1_kw"), expected);
  }
  for (const [input, expected] of [[1.129999, 1.12], [1.13, 1.13], [1.130001, 1.13], [1.067, 1.06], [1.13e-7, 0], [1.13e21, 1.13e21], [Number.MIN_VALUE, 0], [Number.MAX_VALUE, Number.MAX_VALUE]]) {
    assert.equal(preprocessCapacity(input, "floor_0_01_kw"), expected);
    assert.equal(preprocessCapacity(input, null), input);
    assert.equal(preprocessCapacity(input, undefined), input);
  }
  assert.throws(() => preprocessCapacity(1.13, "unknown"), /未対応/);
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
  assert.equal(sixKwStandard.total_maintenance_cost_yen, 228_000);
  assert.equal(sixKwStandard.total_replacement_cost_yen, 384_000);
  assert.equal(sixKwStandard.total_maintenance_and_replacement_cost_yen, 612_000);
  assert.equal(sixKwStandard.annual_cash_flows.length, 30);
  assert.equal(sixKwStandard.annual_cash_flows[19].replacement_cost_yen, 384_000);
  assert.equal(sixKwStandard.annual_cash_flows[29].cumulative_cash_flow_yen, sixKwStandard.profit_yen);
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
test("標準蓄電池は30年間交換せず容量劣化とSOCを引き継ぐ", () => {
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

  assert.equal(flows.length, 30);
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
  assert.equal(standard.annual_cash_flows[19].replacement_cost_yen, 384_000);
  assert.equal(standard.total_maintenance_and_replacement_cost_yen, 612_000);
});
test("30年間の収入・削減効果は丸め済み内訳の再加算ではなく正本値を維持する", () => {
  const result = calculateEstimate(
    {
      prefectureCode: "13",
      monthlyElectricityBillYen: 10_017,
      systemCapacityKw: 4,
      equipmentPackage: "solar_plus_standard_battery"
    },
    publicData
  );
  const standard = result.scenarios.find((scenario) => scenario.scenario === "standard");
  assert.equal(standard.total_revenue_yen, 3_604_375);
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
test("停電参考線はAC負荷と補機を片道効率でDCへ換算し平時計算へ加算しない", () => {
  const reference = publicData.calculation.battery_system.outage_reference;
  assert.equal(reference.required_dc_capacity_reference_kwh, (reference.household_appliance_ac_load_kwh + reference.auxiliary_ac_load_kwh) / reference.discharge_efficiency);
  assert.equal(reference.conditions.initial_state_of_charge, 1);
  assert.equal(reference.conditions.outage_minimum_state_of_charge, 0);
  assert.equal(reference.conditions.pv_replenishment_kwh, 0);
  const modified = structuredClone(publicData);
  modified.calculation.battery_system.outage_reference.required_dc_capacity_reference_kwh *= 2;
  const input = { prefectureCode: "14", monthlyElectricityBillYen: null, equipmentPackage: "solar_plus_standard_battery" };
  assert.deepEqual(calculateEstimate(input, publicData), calculateEstimate(input, modified));
});
