import assert from "node:assert/strict";
import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateEstimate } from "../../site/simulator/src/calculator.js";
import { preprocessCapacity } from "../../site/simulator/src/capacity-preprocessing.js";
import { diagnosticComponents, diagnosticSubsidy, connectDiagnosticSubsidy, allocateDiagnosticScope } from '../../site/simulator/src/diagnostic-subsidy.js';
import { nonInclusionReason } from '../../site/simulator/src/subsidy-presentation.js';

const municipalRuleFixture = machine_rule => ({id:machine_rule,machine_rule,government_level:'municipality',prefecture_code:'11',municipality_code:'11342',program_name:'検査用制度',housing_ages:['existing','new'],equipment_packages:['solar_only','solar_plus_standard_battery'],application_status:'accepting',diagnostic_scope:{in_scope_housing_ages:['existing','new']},conflict_program_ids:[],official_urls:['https://example.jp/'],source_ids:[],required_confirmations:[],calculation_assumptions:[]});
const municipalInputFixture = {prefectureCode:'11',municipalityCode:'11342',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:5,solarCost:300000,batteryCost:300000,batteryEquipmentCost:250000};

test('大子は他補助配賦後の同費目残額を半額にし，上限・端数・配賦順を維持する', () => {
 const daigo={id:'daigo',machine_rule:'daigo_zero_carbon_solar_battery'};
 const other={id:'other',machine_rule:'national_mirai_eco_battery'};
 for(const [cost,otherAmount,expected] of [[300000,96000,100000],[200000,96000,52000],[100000,96000,2000],[97999,96000,0],[98000,96000,1000],[96000,96000,0],[0,0,0],[199999,0,99000]]){
  const options=[[daigo,Math.floor(Math.min(cost/2,100000)/1000)*1000],[other,otherAmount]];
  for(const order of [options,[...options].reverse()]){
   const result=allocateDiagnosticScope(order,cost);
   assert.equal(result.allocation.daigo,expected);assert.equal(result.allocation.other,otherAmount);
   assert.equal(result.total,otherAmount+expected);
  }
 }
 assert.equal(allocateDiagnosticScope([[daigo,47000],[other,96000]],95000),null);
 const alternatives=[[daigo,100000],[{id:'flexible',machine_rule:'shinjuku_residential_energy'},180000],[other,96000]];
 const result=allocateDiagnosticScope(alternatives,300000);
 assert.equal(result.total,288000);assert.equal(result.allocation.daigo,12000);
});

test('大子PVと蓄電池の費目は分離し，他補助控除は蓄電池だけへ適用する', () => {
 const daigo=municipalRuleFixture('daigo_zero_carbon_solar_battery');
 const national={...municipalRuleFixture('national_mirai_eco_battery'),government_level:'national'};
 const result=diagnosticSubsidy([daigo,national],{...municipalInputFixture,solarCost:200000,batteryCost:200000},true);
 const row=result.included_programs.find(p=>p.id===daigo.id);
 assert.deepEqual(row.component_amounts_yen,{solar:100000,battery:52000});
 assert.equal(row.amount_yen,152000);assert.equal(result.total_amount_yen,248000);
 assert.equal(result.national_amount_yen,96000);assert.equal(result.municipality_amount_yen,152000);
});

test('承認仮定の自治体算式は低費用・設備別上限・千円端数・容量境界を扱う', () => {
 const daigo=municipalRuleFixture('daigo_zero_carbon_solar_battery');
 const ranzan=municipalRuleFixture('ranzan_residential_solar');
 for(const [cost,daigoAmount,ranzanAmount] of [[0,0,0],[1999,0,0],[2000,1000,1000],[99999,49000,49000],[100000,50000,50000],[199999,99000,50000],[200000,100000,50000],[300000,100000,50000]]){
  const input={...municipalInputFixture,solarCost:cost,batteryCost:cost};
  assert.deepEqual(diagnosticComponents(daigo,input).components,{solar:daigoAmount,battery:daigoAmount});
  assert.deepEqual(diagnosticComponents(ranzan,input).components,{solar:ranzanAmount});
 }
 assert.deepEqual(diagnosticComponents(daigo,{...municipalInputFixture,equipmentPackage:'solar_only'}).components,{solar:100000});
 for(const [capacityKw,valid] of [[0.99,false],[1,true],[9.99,true],[10,false]])assert.equal(diagnosticComponents(ranzan,{...municipalInputFixture,capacityKw})!==null,valid);
 assert.equal(diagnosticComponents(daigo,{...municipalInputFixture,capacityKw:10}),null);
});

test('非東京の診断自治体額は内訳と合計へ一度加算し，下振れと未確定合計を保持する', () => {
 const program=municipalRuleFixture('ranzan_residential_solar');
 const data={diagnostic_subsidy_programs:[program]};
 const legacy={prefecture_amount_yen:12000,municipality_amount_yen:3000,total_amount_yen:15000,included_programs:[],candidate_programs:[],excluded_programs:[]};
 const input={...municipalInputFixture,equipmentPackage:'solar_only'};
 const {breakdown:b}=connectDiagnosticSubsidy(legacy,data,input,true,[]);
 assert.equal(b.municipality_amount_yen,53000);assert.equal(b.prefecture_amount_yen,12000);assert.equal(b.total_amount_yen,65000);
 assert.equal(b.included_programs.filter(p=>p.id===program.id).length,1);
 assert.equal(connectDiagnosticSubsidy({...legacy,total_amount_yen:null},data,input,true,[]).breakdown.total_amount_yen,null);
 const down=connectDiagnosticSubsidy({...legacy,prefecture_amount_yen:0,municipality_amount_yen:0,total_amount_yen:0},data,input,false,[]).breakdown;
 assert.equal(down.total_amount_yen,0);assert.equal(down.municipality_amount_yen,0);
});

test('調査打切りは受付中・額未確定・今回加算0を保ち，追加調査待ちと案内しない', () => {
 const program=municipalRuleFixture('municipal_unconfirmed_not_included');
 const result=diagnosticSubsidy([program],municipalInputFixture,true);
 const row=result.candidate_programs[0];
 assert.equal(result.total_amount_yen,0);assert.equal(row.amount_yen,null);assert.equal(row.application_status,'accepting');
 assert.equal(row.reason_code,'investigation_closed_insufficient_information');
 assert.match(nonInclusionReason(row),/今回の調査を終了/);assert.doesNotMatch(nonInclusionReason(row),/追加調査待ち/);
 assert.equal(diagnosticSubsidy([{...program,housing_ages:['new']}],municipalInputFixture,true).excluded_programs[0].reason_code,'housing_age_not_applicable');
});

test('大子・嵐山の確定0円は未確定候補と区別して金額0を返す', () => {
 for(const rule of ['daigo_zero_carbon_solar_battery','ranzan_residential_solar'])for(const [solarCost,amount] of [[0,0],[1999,0],[2000,1000]]){
  const result=diagnosticSubsidy([municipalRuleFixture(rule)],{...municipalInputFixture,equipmentPackage:'solar_only',solarCost},true);
  const row=[...result.included_programs,...result.excluded_programs][0];
  assert.equal(result.candidate_programs.length,0);assert.equal(row.amount_yen,amount);assert.equal(result.total_amount_yen,amount);
  if(amount===0){assert.equal(row.reason_code,'calculated_zero_amount');assert.match(nonInclusionReason(row),/算定式.*0円/);}
 }
});




const publicData = JSON.parse(
  await readFile(new URL("../../data/input/public-data.json", import.meta.url), "utf8")
);
const calculationCases = JSON.parse(
  await readFile(new URL("../fixtures/calculation-cases.json", import.meta.url), "utf8")
);
const capacityPreprocessingCases = JSON.parse(
  await readFile(new URL("../fixtures/capacity-preprocessing.json", import.meta.url), "utf8")
);

for (const fixture of capacityPreprocessingCases.cases) {
  test(`backend共通容量前処理fixtureと一致する：${fixture.id}`, () => {
    assert.equal(
      preprocessCapacity(fixture.input_capacity_kw, capacityPreprocessingCases.rule),
      Number(fixture.expected_preprocessed_capacity_kw)
    );
    const data = structuredClone(publicData);
    const program = data.municipal_subsidy_programs.find((item) => item.municipality_code === "14218");
    Object.assign(program.benefit_components.find((item) => item.component_type === "solar").amount_rule, {
      capacity_preprocessing_rule: capacityPreprocessingCases.rule,
      amount_yen_per_kw: capacityPreprocessingCases.amount_yen_per_kw,
      rounding_rule: capacityPreprocessingCases.rounding_rule,
      cap_yen: capacityPreprocessingCases.cap_yen
    });
    const result = calculateEstimate({
      prefectureCode: "14", municipalityCode: "14218", monthlyElectricityBillYen: null,
      systemCapacityKw: fixture.input_capacity_kw
    }, data);
    assert.equal(result.scenarios.find((item) => item.scenario === "standard")
      .subsidy_breakdown.municipality_amount_yen, fixture.expected_amount_yen);
  });
}

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

test("容量前処理→単価乗算→金額切捨て→上限の順に自治体補助額へ反映する", () => {
  // Synthetic amount rule on an existing accepted program; no public data is edited.
  const data = structuredClone(publicData);
  const program = data.municipal_subsidy_programs.find((item) => item.municipality_code === "14218");
  const rule = program.benefit_components.find((item) => item.component_type === "solar").amount_rule;
  rule.amount_yen_per_kw = 15000;
  rule.cap_yen = null;
  const input = { prefectureCode: "14", municipalityCode: "14218", monthlyElectricityBillYen: null, systemCapacityKw: 1.067 };
  const amount = () => calculateEstimate(input, data).scenarios.find((item) => item.scenario === "standard").subsidy_breakdown.municipality_amount_yen;
  assert.equal(amount(), 16000);
  rule.capacity_preprocessing_rule = null;
  assert.equal(amount(), 16000);
  rule.capacity_preprocessing_rule = "floor_0_01_kw";
  rule.rounding_rule = "none";
  assert.equal(amount(), 15900);
  rule.rounding_rule = "floor_1000_yen";
  assert.equal(amount(), 15000);
  rule.cap_yen = 14500;
  assert.equal(amount(), 14500);
  assert.equal(calculateEstimate(input, data).input.system_capacity_kw, 1.067);
});

test("公開契約11.17.0は容量劣化の意味と時点を明示した蓄電池契約を提供する", () => {
  const calculation = publicData.calculation;
  const occupancyModel = calculation.daytime_occupancy;

  assert.equal(publicData.schema_version, "11.17.0");
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
  assert.equal(publicData.municipalities.length, 1112);
  assert.ok(Array.isArray(publicData.municipal_subsidy_programs));
  assert.deepEqual(calculation.equipment_packages, ["solar_only", "solar_plus_standard_battery"]);
  assert.equal(calculation.default_equipment_package, "solar_only");
  assert.equal(calculation.battery_system.capacity_kwh, 9.5);
  assert.equal(calculation.battery_system.installed_cost_yen, 1_149_500);
  assert.equal(calculation.battery_system.replacement_cost_yen, 0);
  assert.deepEqual(calculation.battery_system.replacement_years, []);
  assert.equal(
    calculation.battery_system.replacement_policy,
    "no_replacement_within_30_year_evaluation_period"
  );
  assert.equal(
    calculation.battery_system.replacement_policy_basis,
    "service_requirement_no_replacement_scenario_with_annual_retention_mathematically_extrapolated_through_year_30_and_no_cycle_to_service_life_conversion"
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
  assert.deepEqual(maintenanceEvent.event_years, [5, 10, 15, 20, 25, 30]);
  assert.equal(maintenanceEvent.cost_value_basis, "official_jpea_hearing_observation_2026");
  assert.equal(maintenanceEvent.tax_status, "unknown");
  assert.equal(replacementEvent.cost_yen, 384_000);
  assert.deepEqual(replacementEvent.event_years, [20]);
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
        housingAge: calculationCase.input.housing_age,
        prefectureCode: calculationCase.input.prefecture_code,
        municipalityCode: calculationCase.input.municipality_code ?? null,
        monthlyElectricityBillYen: calculationCase.input.monthly_electricity_bill_yen,
        detailConditions: calculationCase.input.detail_conditions ?? undefined,
        systemCapacityKw: calculationCase.input.system_capacity_kw ?? undefined,
        daytimeOccupancy: calculationCase.input.daytime_occupancy ?? undefined,
        equipmentPackage: calculationCase.input.equipment_package ?? undefined,
        batteryCapacityKwh: calculationCase.input.battery_capacity_kwh,
        batteryDegradationScenario: calculationCase.input.battery_degradation_scenario
      },
      publicData
    );
    // Decimal evidence strings may differ only in exponent/trailing-zero notation.
    const canonical = result => JSON.parse(JSON.stringify(result, (key,value) => ['eligible_cost_yen_unrounded','capacity_amount_yen_unrounded','amount_yen_before_deferred_rounding'].includes(key) && value !== null ? Number(value) : value));
    assert.deepEqual(canonical(actual), canonical(calculationCase.expected));
  });
}

test("Schema 11.12正本3ファイルのSHA-256が承認値と一致する", async () => {
  const expectedHashes = new Map([
    ["../../data/input/public-data.json", "8DFD5FDBAE2DCAD14BC0991BC47B0EA949B64B5E1AC3DABF5C0871B161862D91"],
    ["../fixtures/calculation-cases.json", "802ADC99B8344D3B53BDC87CD71A4C1CCB83DAC7459CCE6089513D1D230265D7"],
    ["../../data/input/metadata.json", "40FC0F533DC0947C5E944D9408086E22D935552E8E5FE77AF833778870BB59C0"]
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

test("容量変更は契約単価，30年電力保存，補助金および利益へ連動する", () => {
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
    assert.equal(standard.subsidy_yen, standard.subsidy_breakdown.national_amount_yen + standard.subsidy_breakdown.prefecture_amount_yen + standard.subsidy_breakdown.municipality_amount_yen);
    assert.ok(standard.subsidy_yen <= standard.gross_installation_cost_yen);
    assert.equal(
      standard.profit_yen,
      Math.round(standard.total_revenue_yen
        - standard.net_initial_outlay_yen
        - standard.total_maintenance_and_replacement_cost_yen)
    );
    profitByCapacity.set(batteryCapacityKwh, standard.profit_yen);
    assert.equal(result.energy.annual_energy_flows.length, 30);
    for (const flow of result.energy.annual_energy_flows) {
      assert.ok(Math.abs(
        flow.annual_generation_kwh
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
  assert.equal(nikkoStandard.subsidy_breakdown.municipality_amount_yen, 0);
  assert.equal(nikkoStandard.subsidy_breakdown.national_amount_yen, 0);
  assert.ok(nikkoStandard.subsidy_breakdown.excluded_programs.some(program => program.reason_code === 'required_external_structure_or_housing_work'));
  assert.ok(nikkoStandard.subsidy_breakdown.candidate_programs.length > 0);
  assert.ok(nikkoStandard.subsidy_breakdown.candidate_programs.every((program) => program.amount_yen === null));
});

test("回収年は未入力時の地域平均と後年の維持・交換費を反映した最終回収年を返す", () => {
  const expectedByCapacity = new Map([[1, 3], [3, 3], [4, 4], [5, 4], [6, 4]]);
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

test("劣化選択の既定・明示・不正値と太陽光のみの無効化を区別する", () => {
  const input = { prefectureCode: "14", municipalityCode: "14218", monthlyElectricityBillYen: null, equipmentPackage: "solar_plus_standard_battery" };
  const implicit = calculateEstimate(input, publicData);
  const explicit = calculateEstimate({ ...input, batteryDegradationScenario: "conservative" }, publicData);
  assert.equal(implicit.input.battery_degradation_scenario_source, "default");
  assert.equal(explicit.input.battery_degradation_scenario_source, "user_input");
  assert.deepEqual(implicit.energy, explicit.energy);
  assert.deepEqual(implicit.scenarios, explicit.scenarios);
  for (const value of ["", "invalid", 70, false, {}, []]) {
    assert.throws(() => calculateEstimate({ ...input, batteryDegradationScenario: value }, publicData), /蓄電池劣化シナリオ/);
    const solar = calculateEstimate({ ...input, equipmentPackage: "solar_only", batteryDegradationScenario: value }, publicData);
    assert.equal(solar.input.battery_degradation_scenario, null);
    assert.equal(solar.input.battery_degradation_scenario_source, "not_applicable");
    assert.deepEqual(solar, calculateEstimate({ ...input, equipmentPackage: "solar_only" }, publicData));
  }
  const results = [implicit, ...["conditional_70", "optimistic_85"].map((batteryDegradationScenario) => calculateEstimate({ ...input, batteryDegradationScenario }, publicData))];
  for (let i = 1; i < results.length; i++) {
    assert.ok(results[i].energy.annual_energy_flows[19].annual_battery_delivered_kwh > results[i - 1].energy.annual_energy_flows[19].annual_battery_delivered_kwh);
    assert.ok(results[i].scenarios[1].profit_yen > results[i - 1].scenarios[1].profit_yen);
    assert.equal(results[i].scenarios.length, 3);
  }
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

test("最低容量は元の入力で先に判定し，未満を条件不足として残す", () => {
  const data = structuredClone(publicData);
  const program = data.municipal_subsidy_programs.find((item) => item.municipality_code === "14218");
  const rule = program.benefit_components.find((item) => item.component_type === "solar").amount_rule;
  Object.assign(rule, { calculation_type: "fixed", fixed_amount_yen: 40000, amount_yen_per_kw: null, cap_yen: null, minimum_capacity_kw: 2 });
  const calculate = (systemCapacityKw) => calculateEstimate({ prefectureCode: "14", municipalityCode: "14218", monthlyElectricityBillYen: null, systemCapacityKw }, data);
  for (const [capacity, amount] of [[1.999999, 0], [2, 40000], [2.000001, 40000]]) {
    const result = calculate(capacity);
    const breakdown = result.scenarios.find((item) => item.scenario === "standard").subsidy_breakdown;
    assert.equal(breakdown.municipality_amount_yen, amount);
    assert.equal(breakdown.excluded_programs.some((item) => item.reason_code === "capacity_below_minimum"), capacity < 2);
    assert.equal(result.input.system_capacity_kw, capacity);
  }
  rule.minimum_capacity_kw = null;
  assert.equal(calculate(1.999999).scenarios[1].subsidy_breakdown.municipality_amount_yen, 40000);
  delete rule.minimum_capacity_kw;
  assert.equal(calculate(1.999999).scenarios[1].subsidy_breakdown.municipality_amount_yen, 40000);
  Object.assign(rule, { minimum_capacity_kw: 2.05, capacity_preprocessing_rule: "floor_0_1_kw", calculation_type: "per_kw", fixed_amount_yen: null, amount_yen_per_kw: 10000 });
  assert.equal(calculate(2.06).scenarios[1].subsidy_breakdown.municipality_amount_yen, 20000);
});

const municipalCapacityRules = JSON.parse(await readFile(new URL("../fixtures/municipal-capacity-rules.json", import.meta.url), "utf8"));
for (const fixture of municipalCapacityRules.cases) {
  test("自治体容量共通fixtureと一致する：" + fixture.id, () => {
    if (fixture.expected_preprocessed_capacity_kw) assert.equal(preprocessCapacity(fixture.input_capacity_kw, "floor_0_1_kw"), Number(fixture.expected_preprocessed_capacity_kw));
    const result = calculateEstimate({ prefectureCode: "14", municipalityCode: fixture.municipality_code, monthlyElectricityBillYen: null, systemCapacityKw: fixture.input_capacity_kw }, publicData);
    const breakdown = result.scenarios.find((item) => item.scenario === "standard").subsidy_breakdown;
    assert.equal(breakdown.municipality_amount_yen, fixture.expected_amount_yen);
    assert.equal(breakdown.excluded_programs.find((item) => item.reason_code === "capacity_below_minimum")?.reason_code ?? null, fixture.expected_reason_code ?? null);
  });
}

test("神奈川33自治体の表示専用情報を金額へ転用しない", () => {
  const municipalities = publicData.municipalities.filter((item) => item.prefecture_code === "14");
  assert.equal(municipalities.length, 33);
  for (const municipality of municipalities) {
    assert.ok(municipality.candidate_summary);
    const input = { prefectureCode: "14", municipalityCode: municipality.municipality_code, monthlyElectricityBillYen: null };
    const baseline = calculateEstimate(input, publicData);
    const modified = structuredClone(publicData);
    const item = modified.municipalities.find((entry) => entry.municipality_code === municipality.municipality_code);
    item.candidate_program_names = ["表示専用テスト"];
    item.candidate_summary.amount_components.forEach((component) => { component.display_amount = "999,999,999円"; });
    assert.deepEqual(calculateEstimate(input, modified), baseline);
  }
});

test('住宅区分は容量・発電を変えず住宅別PV費用と補助適格性へ反映する', () => {
 const base = { prefectureCode:'13', municipalityCode:'13104', equipmentPackage:'solar_only', monthlyElectricityBillYen:null };
 const omitted = calculateEstimate(base,publicData);
 const existing = calculateEstimate({...base,housingAge:'existing'},publicData);
 const newlyBuilt = calculateEstimate({...base,housingAge:'new'},publicData);
 assert.equal(omitted.input.housing_age,'existing');
 assert.equal(omitted.input.housing_age_source,'default');
 assert.equal(existing.input.housing_age_source,'user_input');
 assert.equal(newlyBuilt.input.housing_age,'new');
 assert.deepEqual(existing.energy,newlyBuilt.energy);
 assert.equal(existing.scenarios[0].solar_installation_cost_yen,existing.input.system_capacity_kw*331100);
 assert.equal(newlyBuilt.scenarios[0].solar_installation_cost_yen,newlyBuilt.input.system_capacity_kw*317900);
 for(const value of ['', 'invalid', 0]) assert.throws(()=>calculateEstimate({...base,housingAge:value},publicData),/住宅区分/);
});


test('埼玉県の蓄電池補助は購入費だけを上限とし旧PVの非FIT条件を転用しない', () => {
 const result=calculateEstimate({prefectureCode:'11',monthlyElectricityBillYen:null,equipmentPackage:'solar_plus_standard_battery',housingAge:'existing'},publicData);
 const standard=result.scenarios.find(x=>x.scenario==='standard');
 const program=standard.subsidy_breakdown.included_programs.find(x=>x.id==='saitama-residential-battery-2026');
 assert.equal(standard.subsidy_yen,100000);
 assert.deepEqual(program.component_amounts_yen,{battery:100000});
 assert.equal(program.battery_purchase_cost_limit_yen,1054500);
 assert.match(program.expense_mapping_assumption,/工事費10,000円／kWhを除外/);
 assert.equal(result.scenarios[0].subsidy_yen,0);
});

test('埼玉県は住宅・設備適格性を先に判定し他県の制度を混入しない', () => {
 for(const [housingAge,equipmentPackage,reason] of [['new','solar_plus_standard_battery','housing_age_not_applicable'],['existing','solar_only','equipment_package_not_applicable']]){
 const b=calculateEstimate({prefectureCode:'11',monthlyElectricityBillYen:null,housingAge,equipmentPackage},publicData).scenarios[1].subsidy_breakdown;
 assert.equal(b.excluded_programs.find(x=>x.id==='saitama-residential-battery-2026').reason_code,reason);
 assert.ok([...b.included_programs,...b.excluded_programs].every(x=>!x.id.startsWith('kanagawa-residential-')&&!x.id.startsWith('tokyo-')));
 }
});

test('埼玉県の購入費残額は市区町村の蓄電池成分のみ控除し万円未満を切り捨てる', () => {
 for(const [equipmentCost,expected] of [[20000,30000],[19999,20000],[14999,0]]){
 const data=structuredClone(publicData);data.calculation.battery_system.equipment_cost_yen_per_kwh=equipmentCost;
 const b=calculateEstimate({prefectureCode:'11',municipalityCode:'11221',monthlyElectricityBillYen:null,equipmentPackage:'solar_plus_standard_battery',batteryCapacityKwh:4,housingAge:'existing'},data).scenarios[1].subsidy_breakdown;
 assert.equal(b.municipality_amount_yen,100000);assert.equal(b.prefecture_amount_yen,expected);assert.equal(b.total_amount_yen,100000+expected);
 assert.deepEqual(b.included_programs.find(x=>x.id==='saitama-11221-climate-action-2026').component_amounts_yen,{solar:50000,battery:50000});
 if(!expected)assert.equal(b.excluded_programs.find(x=>x.id==='saitama-residential-battery-2026').reason_code,'expense_scope_exhausted_by_maximum_combination');
 }
});

test('神奈川県の終了制度は容量から台数を推定せず県額へ算入しない', () => {
 for(const batteryCapacityKwh of [4,9.5,16]){
 const b=calculateEstimate({prefectureCode:'14',monthlyElectricityBillYen:null,equipmentPackage:'solar_plus_standard_battery',batteryCapacityKwh,housingAge:'existing'},publicData).scenarios[1].subsidy_breakdown;
 const program=b.excluded_programs.find(x=>x.id==='kanagawa-residential-solar-battery-2026');
 assert.equal(b.prefecture_amount_yen,0);assert.equal(program.calculation_status,'excluded_closed');assert.equal(program.amount_yen,null);
 assert.ok(!b.included_programs.some(x=>x.id==='saitama-residential-battery-2026'));
 assert.ok(program.calculation_assumptions.some(x=>x.includes('入力容量から推定しない')));
 }
});


test('栃木県は設備不一致を売電経路より先に判定し受付と未確定額を保持する', () => {
 for(const housingAge of ['existing','new'])for(const [equipmentPackage,reason] of [['solar_only','equipment_package_not_applicable'],['solar_plus_standard_battery','sale_path_not_applicable']]){
 const r=calculateEstimate({prefectureCode:'09',municipalityCode:'09202',monthlyElectricityBillYen:null,housingAge,equipmentPackage},publicData);
 for(const scenario of r.scenarios){const b=scenario.subsidy_breakdown;const p=b.excluded_programs.find(x=>x.id==='tochigi-residential-solar-battery-2026');assert.equal(p.reason_code,reason);assert.equal(p.application_status,'accepting');assert.equal(p.amount_yen,null);assert.equal(b.prefecture_amount_yen,0);}
 }
});

test('栃木県の保持式は公式3例と一致し非FIT参考値であることを明示する', async () => {
 const {diagnosticComponents}=await import('../../site/simulator/src/diagnostic-subsidy.js');
 const p=publicData.diagnostic_subsidy_programs.find(x=>x.id==='tochigi-residential-solar-battery-2026');
 for(const [batteryCapacityKwh,batteryCost,expected] of [[4,620000,206000],[11,1300000,196000],[8,1350000,258000]]){
 const r=diagnosticComponents(p,{housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh,solarCost:1324400,batteryCost,batteryEquipmentCost:111000*batteryCapacityKwh});assert.deepEqual(r.components,{solar:280000,battery:expected});assert.equal(r.details.reference_only_due_to_non_fit,true);
 }
});

test('茨城の市町村向け親財源を県の直接補助として重複加算しない', () => {
 assert.ok(!publicData.diagnostic_subsidy_programs.some(x=>x.prefecture_code==='08'&&x.government_level==='prefecture'));
 const p=publicData.prefectures.find(x=>x.code==='08');assert.deepEqual(p.subsidy_programs,[]);
 for(const equipmentPackage of ['solar_only','solar_plus_standard_battery']){const b=calculateEstimate({prefectureCode:'08',municipalityCode:'08215',monthlyElectricityBillYen:null,equipmentPackage},publicData).scenarios[1].subsidy_breakdown;assert.equal(b.prefecture_amount_yen,0);assert.ok(!b.included_programs.some(x=>x.government_level==='prefecture'));}
});


test('群馬A/Bは地域・住宅・設備・容量・既設PV・FITの順で理由とnullを保持する', async () => {
 const {diagnosticSubsidy}=await import('../../site/simulator/src/diagnostic-subsidy.js');
 const base={prefectureCode:'10',municipalityCode:'10201',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
 for(const [patch,a,b] of [[{},'sale_path_not_applicable','existing_pv_battery_addition_not_supported'],[{municipalityCode:'10366',housingAge:'new',equipmentPackage:'solar_only',capacityKw:0.9},'municipality_not_applicable','housing_age_not_applicable'],[{equipmentPackage:'solar_only'},'sale_path_not_applicable','equipment_package_not_applicable'],[{capacityKw:0.9},'capacity_not_applicable','existing_pv_battery_addition_not_supported'],[{capacityKw:10},'capacity_not_applicable','existing_pv_battery_addition_not_supported']]){
 const r=diagnosticSubsidy(publicData.diagnostic_subsidy_programs,{...base,...patch},true);assert.equal(r.prefecture_amount_yen,0);
 for(const [id,reason]of [['gunma-solar-new-2026',a],['gunma-battery-existing-pv-2026',b]]){const p=r.excluded_programs.find(x=>x.id===id);assert.equal(p.reason_code,reason);assert.equal(p.amount_yen,null);assert.equal(p.application_status,'closed');}
 }
});

test('群馬保持式は公式例・価格区分不明・容量境界を保存する', async () => {
 const {gunmaProgramAReference:a,gunmaProgramBReference:b}=await import('../../site/simulator/src/diagnostic-subsidy.js');
 assert.equal(a(5,10,1200000).total_yen,470000);assert.equal(a(5,6,1200000).total_yen,70000);assert.equal(a(5,6,1200000).battery_yen,null);
 assert.equal(a(5,10,1500000).total_yen,null);assert.equal(a(5,10,1500000).battery_eligibility,'cell_category_unconfirmed');assert.equal(a(5,10,1500000,true).total_yen,570000);assert.equal(a(5,10,1500000,false).total_yen,70000);
 assert.equal(a(0.99),null);assert.equal(a(10),null);assert.equal(a(9.99).solar_output_kw,9);assert.equal(b(0.99,100000),null);
 for(const [capacity,cost,expected]of [[7,900000,300000],[7,1000000,329000],[11,1200000,400000]])assert.equal(b(capacity,cost).battery_yen,expected);
});

test('追加89市町村は今回の千葉7件候補だけを更新し，群馬旧Aの非重複を維持する', () => {
 const rows=publicData.municipalities.filter(x=>['10','12'].includes(x.prefecture_code));assert.equal(rows.length,89);assert.equal(rows.filter(x=>x.prefecture_code==='10').length,35);assert.equal(rows.filter(x=>x.prefecture_code==='12').length,54);
 const closedCodes=new Set(['12403','12347','12441','12424','12342','12463','12427']);
 for(const m of rows){assert.equal(m.program_status,closedCodes.has(m.municipality_code)?'candidate':'unconfirmed');assert.deepEqual(m.program_ids,[]);assert.deepEqual(m.candidate_program_names,[]);assert.equal(m.candidate_summary,null);}
 const gunma=publicData.prefectures.find(x=>x.code==='10');assert.deepEqual(gunma.subsidy_programs,[]);assert.deepEqual(gunma.candidate_subsidy_programs,[]);
 const chiba=publicData.diagnostic_subsidy_programs.filter(x=>x.prefecture_code==='12');assert.equal(chiba.length,7);assert.ok(chiba.every(x=>x.machine_rule==='municipal_unconfirmed_not_included'&&closedCodes.has(x.municipality_code)));
 for(const [prefectureCode,municipalityCode]of [['10','10201'],['10','10366'],['12','12100']]){const r=calculateEstimate({prefectureCode,municipalityCode,monthlyElectricityBillYen:null},publicData);assert.equal(r.input.municipality_program_status,'unconfirmed');for(const s of r.scenarios){assert.equal(s.subsidy_breakdown.prefecture_amount_yen,0);assert.equal(s.subsidy_breakdown.municipality_amount_yen,0);assert.ok(!s.subsidy_breakdown.excluded_programs.some(x=>x.id==='gunma-residential-solar-fy2026'));}}
});


test('全国47県の県のみ診断は市区町村補助を算入せず県確認状態を保持する', () => {
  assert.equal(publicData.prefectures.length, 47);
  const statuses=new Set(['current_scope_reviewed','legacy_included_pending_current_scope_review','current_scope_unconfirmed']);
  for (const prefecture of publicData.prefectures) {
    assert.ok(statuses.has(prefecture.prefecture_program_status));
    for (const equipmentPackage of publicData.calculation.equipment_packages) {
      const result=calculateEstimate({prefectureCode:prefecture.code,monthlyElectricityBillYen:null,equipmentPackage},publicData);
      assert.equal(result.input.municipality_code,null);
      assert.equal(result.input.municipality_program_status,'not_requested');
      assert.equal(result.input.prefecture_program_status,prefecture.prefecture_program_status);
      for (const scenario of result.scenarios) {
        const breakdown=scenario.subsidy_breakdown;
        assert.equal(breakdown.municipality_program_status,'not_requested');
        assert.equal(breakdown.prefecture_program_status,prefecture.prefecture_program_status);
        assert.equal(breakdown.municipality_amount_yen,0);
        assert.ok(breakdown.included_programs.every(program=>program.government_level!=='municipality'));
        assert.ok(Number.isFinite(scenario.profit_yen));
        if(prefecture.prefecture_program_status==='current_scope_unconfirmed') assert.equal(breakdown.prefecture_amount_yen,0);
      }
    }
  }
});

test('資料不足8件とB2の理由は診断接続後も重複せず受付と未確定額を維持する', () => {
 const targets=publicData.diagnostic_subsidy_programs.filter(p=>p.machine_rule==='municipal_unconfirmed_not_included'||['04','05','06'].includes(p.prefecture_code));
 assert.equal(targets.filter(p=>p.machine_rule==='municipal_unconfirmed_not_included').length,8);
 for(const p of targets){
  const r=calculateEstimate({prefectureCode:p.prefecture_code,municipalityCode:p.municipality_code??null,housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',monthlyElectricityBillYen:null},publicData);
  const b=r.scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
  const rows=[...b.included_programs,...b.candidate_programs,...b.excluded_programs].filter(x=>x.id===p.id);
  assert.equal(rows.length,1,p.id);assert.equal(rows[0].amount_yen,null);assert.equal(rows[0].application_status,p.application_status);
  const expected=p.machine_rule==='municipal_unconfirmed_not_included'?'investigation_closed_insufficient_information':p.prefecture_code==='04'?'application_scheduled':p.prefecture_code==='05'?'calculation_detail_unconfirmed':'sale_path_not_applicable';
  assert.equal(rows[0].reason_code,expected,p.id);
 }
});


const nationwideRuleFixture = (machine_rule, fields={}) => ({...municipalRuleFixture(machine_rule),government_level:'prefecture',prefecture_code:'07',municipality_code:null,...fields});
const nationwideInputFixture = {...municipalInputFixture,prefectureCode:'07',municipalityCode:null,solarCost:1000000,batteryCost:605000,batteryEquipmentCost:555000};

test('福島通常PVは百分位切捨て・千円切捨て・16万円上限と10kW境界を分ける',()=>{
 const p=nationwideRuleFixture('fukushima_residential_solar_fit',{solar_output_max_kw_exclusive:10});
 for(const [capacityKw,expected] of [[2.674,106000],[3.999,159000],[4,160000],[9.99,160000]]){
  const r=diagnosticSubsidy([p],{...nationwideInputFixture,capacityKw},true);
  assert.equal(r.prefecture_amount_yen,expected);
  assert.deepEqual(r.included_programs[0].component_amounts_yen,{solar:expected});
 }
 const outside=diagnosticSubsidy([p],{...nationwideInputFixture,capacityKw:10},true);
 assert.equal(outside.excluded_programs[0].reason_code,'capacity_not_applicable');
 assert.equal(outside.excluded_programs[0].amount_yen,null);
 const down=diagnosticSubsidy([p],nationwideInputFixture,false);
 assert.equal(down.total_amount_yen,0);assert.equal(down.excluded_programs[0].amount_yen,0);
});

test('山梨PV整数kW・B整数kWhの4kWh境界と費目上限を保持する',()=>{
 const p=nationwideRuleFixture('yamanashi_renewable_energy',{housing_ages:['existing']});
 for(const [capacityKw,batteryCapacityKwh,solar,battery] of [[3.99,3.99,90000,0],[4,4,120000,250000],[9.99,5,270000,250000],[10,5,270000,250000]]){
  const r=diagnosticSubsidy([p],{...nationwideInputFixture,capacityKw,batteryCapacityKwh},true);
  assert.equal(r.total_amount_yen,solar+battery);
  assert.equal(r.included_programs[0].component_amounts_yen.solar,solar);
  assert.equal(r.included_programs[0].component_amounts_yen.battery??0,battery);
 }
 const capped=diagnosticSubsidy([p],{...nationwideInputFixture,solarCost:50000,batteryCost:100000},true);
 assert.equal(capped.total_amount_yen,150000);
 assert.equal(diagnosticSubsidy([p],{...nationwideInputFixture,housingAge:'new'},true).excluded_programs[0].reason_code,'housing_age_not_applicable');
});

test('滋賀基本PV+Bは合算後一度だけ丸め，税込税抜不一致を候補nullにする',()=>{
 const p=nationwideRuleFixture('shiga_basic_fit_solar_battery',{housing_ages:['existing'],equipment_packages:['solar_plus_standard_battery'],solar_output_min_kw:2,solar_output_max_kw_exclusive:10});
 for(const total of [297000,300000,1000000]){
  const input={...nationwideInputFixture,solarCost:150000,batteryCost:total-150000};
  const c=diagnosticComponents(p,input);assert.deepEqual(c.components,{solar:90000});
  assert.equal(c.details.gross_candidate_yen,90000);assert.equal(c.details.tax_exclusive_candidate_yen,90000);
 }
 for(const total of [296999,270000,200000]){
  const r=diagnosticSubsidy([p],{...nationwideInputFixture,solarCost:150000,batteryCost:total-150000},true);
  assert.equal(r.total_amount_yen,0);assert.equal(r.candidate_programs[0].amount_yen,null);
  assert.equal(r.candidate_programs[0].reason_code,'calculation_detail_unconfirmed');assert.equal(r.excluded_programs.length,0);
 }
 for(const [capacityKw,allowed] of [[1.99,false],[2,true],[9.99,true],[10,false]]){
  const r=diagnosticSubsidy([p],{...nationwideInputFixture,capacityKw},true);assert.equal(r.included_programs.length>0,allowed);
 }
 assert.equal(diagnosticSubsidy([p],{...nationwideInputFixture,equipmentPackage:'solar_only'},true).excluded_programs[0].reason_code,'equipment_package_not_applicable');
});

test('旧長野容量種別・旧兵庫地域不足規則は候補nullを保持する',()=>{
 for(const rule of ['nagano_roof_solar_battery_unresolved','hyogo_awaji_battery_region_unavailable']){
  const regional=rule.startsWith('hyogo');
  const p=nationwideRuleFixture(rule,regional?{diagnostic_scope:{status:'excluded_region_input_unavailable',in_scope_housing_ages:['existing','new']}}:{});
  for(const included of [true,false]){
   const r=diagnosticSubsidy([p],nationwideInputFixture,included);
   assert.equal(r.total_amount_yen,0);assert.equal(r.included_programs.length,0);assert.equal(r.excluded_programs.length,0);
   assert.equal(r.candidate_programs.length,1);assert.equal(r.candidate_programs[0].amount_yen,null);
   assert.equal(r.candidate_programs[0].reason_code,regional?'regional_eligibility_input_unavailable':'calculation_detail_unconfirmed');
   if(regional)assert.match(nonInclusionReason(r.candidate_programs[0]),/対象地域.*確認できない/);
  }
 }
});

test('追加県の非FIT・受付終了・先行契約経路は金額未確定で理由を分離する',()=>{
 const rules=['fukushima_self_consumption_solar_non_fit','niigata_snow_country_zeh_closed_non_fit','ishikawa_residential_solar_battery_non_fit','shiga_priority_non_fit','tokushima_residential_solar_battery_non_fit','kagawa_existing_home_battery_non_fit','kagawa_priority_solar_battery_non_fit','oita_self_consumption_solar_battery_closed','miyazaki_solar_battery_non_fit'];
 for(const rule of rules){const r=diagnosticSubsidy([nationwideRuleFixture(rule,{fit_compatible:false})],nationwideInputFixture,true);assert.equal(r.excluded_programs[0].reason_code,'sale_path_not_applicable');assert.equal(r.excluded_programs[0].amount_yen,null);}
 const closed=diagnosticSubsidy([nationwideRuleFixture('nara_smart_house_battery_closed',{application_status:'closed'})],nationwideInputFixture,true);
 assert.equal(closed.excluded_programs[0].reason_code,'application_closed');
 const p=nationwideRuleFixture('miyazaki_battery_existing_or_contracted_pv',{diagnostic_scope:{status:'excluded_existing_pv_battery_addition',in_scope_housing_ages:['existing','new']}});
 const row=diagnosticSubsidy([p],nationwideInputFixture,true).excluded_programs[0];
 assert.equal(row.reason_code,'existing_pv_battery_addition_not_supported');assert.match(nonInclusionReason(row),/既設又は先行契約済み/);
});


test('追加承認規則は長野4kWh・10kW境界と宮崎税抜費用境界を守る',()=>{
 const nagano=nationwideRuleFixture('nagano_roof_solar_battery',{battery_capacity_min_kwh:4,solar_output_max_kw_exclusive:10,equipment_packages:['solar_plus_standard_battery'],housing_ages:['existing']});
 for(const [b,k,expected] of [[3.99,4,0],[4,4,200000],[4,9.99,200000],[4,10,0]]){
 const r=diagnosticSubsidy([nagano],{...nationwideInputFixture,batteryCapacityKwh:b,capacityKw:k},true);
 assert.equal(r.total_amount_yen,expected);if(!expected)assert.equal(r.excluded_programs[0].reason_code,'capacity_not_applicable');
 }
 assert.deepEqual(diagnosticComponents(nagano,{...nationwideInputFixture,solarCost:54999,batteryCost:164999}).components,{solar:49000,battery:149000});
 const miyazaki=nationwideRuleFixture('miyazaki_battery_existing_or_contracted_pv');
 for(const [cost,expected] of [[1149500,348000],[330000,100000],[329999,99000]])assert.equal(diagnosticComponents(miyazaki,{...nationwideInputFixture,batteryCapacityKwh:9.5,batteryCost:cost}).components.battery,expected);
 assert.equal(diagnosticComponents(miyazaki,{...nationwideInputFixture,batteryCapacityKwh:4.09,batteryCost:3000000}).components.battery,200000);
});

test('淡路地域は対象3市だけ県制度を算入し機器費の不足を保留する',()=>{
 const p=nationwideRuleFixture('hyogo_awaji_battery',{included_municipality_codes:['28205','28224','28226']});
 for(const municipalityCode of p.included_municipality_codes){const r=diagnosticSubsidy([p],{...nationwideInputFixture,municipalityCode,batteryCapacityKwh:9.5},true);assert.equal(r.prefecture_amount_yen,142000);assert.equal(r.municipality_amount_yen,0);}
 const noCity=diagnosticSubsidy([p],{...nationwideInputFixture,municipalityCode:null},true);assert.equal(noCity.candidate_programs[0].reason_code,'regional_eligibility_input_unavailable');
 const otherCity=diagnosticSubsidy([p],{...nationwideInputFixture,municipalityCode:'28100'},true);assert.equal(otherCity.excluded_programs[0].reason_code,'municipality_not_applicable');
 assert.equal(diagnosticComponents(p,{...nationwideInputFixture,batteryCapacityKwh:9.5,batteryEquipmentCost:156199}),null);
 assert.equal(diagnosticComponents(p,{...nationwideInputFixture,batteryCapacityKwh:9.5,batteryEquipmentCost:156200}).components.battery,142000);
});


test('長野・宮崎は税抜費目上限から他補助を先に控除し，兵庫固定額を減額しない',()=>{
 const nagano=nationwideRuleFixture('nagano_roof_solar_battery',{id:'nagano'});
 const other=nationwideRuleFixture('ranzan_residential_solar',{id:'other'});
 const direct=allocateDiagnosticScope([[nagano,50000],[other,33000]],60000);
 assert.deepEqual(direct.allocation,{other:33000,nagano:27000});
 const mirai=nationwideRuleFixture('national_mirai_eco_battery',{id:'z-mirai',government_level:'national'});
 const r=diagnosticSubsidy([nagano,mirai],{...nationwideInputFixture,solarCost:66000,batteryCost:110000},true);
 assert.equal(r.total_amount_yen,150000);
 assert.equal(r.included_programs.find(p=>p.id==='nagano').component_amounts_yen.battery,4000);
 const miyazaki=nationwideRuleFixture('miyazaki_battery_existing_or_contracted_pv',{id:'miyazaki'});
 assert.deepEqual(allocateDiagnosticScope([[miyazaki,100000],[mirai,96000]],100000).allocation,{'z-mirai':96000,miyazaki:4000});
 const hyogo=nationwideRuleFixture('hyogo_awaji_battery',{id:'hyogo'});
 assert.equal(allocateDiagnosticScope([[hyogo,142000],[mirai,96000]],200000),null);
});


test('30年PV劣化は年次発電と時間別需給へ適用しB比較の20年終点を維持する',()=>{
 for(const equipmentPackage of ['solar_only','solar_plus_standard_battery']){
 const r=calculateEstimate({prefectureCode:'13',monthlyElectricityBillYen:null,equipmentPackage},publicData);
 const flows=r.energy.annual_energy_flows;
 assert.equal(flows.length,30);assert.equal(flows[0].pv_generation_factor,1);
 for(const year of [2,20,30]){const f=flows[year-1];assert.ok(Math.abs(f.pv_generation_factor-0.997**(year-1))<0.000001);assert.ok(Math.abs(f.annual_generation_kwh-flows[0].annual_generation_kwh*0.997**(year-1))<0.00001);}
 for(const f of flows){assert.ok(Math.abs(f.annual_generation_kwh-f.annual_direct_self_consumed_kwh-f.annual_battery_charge_input_kwh-f.annual_exported_kwh)<0.00001);assert.ok(Math.abs(f.annual_consumption_kwh-f.annual_direct_self_consumed_kwh-f.annual_battery_delivered_kwh-f.annual_purchased_kwh)<0.00001);}
 assert.ok(flows[29].annual_direct_self_consumed_kwh<flows[0].annual_direct_self_consumed_kwh);
 for(const s of r.scenarios){assert.equal(s.annual_cash_flows[19].replacement_cost_yen,384000);assert.equal(s.annual_cash_flows[29].maintenance_cost_yen,38000);assert.equal(s.annual_cash_flows[29].replacement_cost_yen,0);assert.equal(s.annual_cash_flows[29].cumulative_cash_flow_yen,s.profit_yen);if(s.payback_year!==null)assert.ok(s.annual_cash_flows.slice(s.payback_year-1).every(x=>x.cumulative_cash_flow_yen>=0));}
 }
 for(const [batteryDegradationScenario,retention]of [['conditional_70',0.7],['optimistic_85',0.85]]){const r=calculateEstimate({prefectureCode:'13',monthlyElectricityBillYen:null,equipmentPackage:'solar_plus_standard_battery',batteryDegradationScenario},publicData);const f=r.energy.annual_energy_flows;assert.equal(r.energy.battery_degradation.capacity_retention_at_year_20,retention);assert.ok(Math.abs(f[19].battery_usable_capacity_kwh/9.5-retention)<0.000001);assert.ok(Math.abs(f[29].battery_usable_capacity_kwh/9.5-retention**1.5)<0.000001);assert.equal(f[20].opening_state_of_charge_before_adjustment_kwh,f[19].closing_state_of_charge_kwh);assert.equal(f[29].battery_service_age_year,30);}
});
