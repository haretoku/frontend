import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateEstimate } from "../../site/simulator/src/calculator.js";


const publicData = JSON.parse(
  await readFile(new URL("../../data/input/public-data.json", import.meta.url), "utf8")
);
const calculationCases = JSON.parse(
  await readFile(new URL("../fixtures/calculation-cases.json", import.meta.url), "utf8")
);

for (const calculationCase of calculationCases.cases) {
  test(`backend基準計算と一致する：${calculationCase.id}`, () => {
    const actual = calculateEstimate(
      {
        prefectureCode: calculationCase.input.prefecture_code,
        monthlyElectricityBillYen: calculationCase.input.monthly_electricity_bill_yen,
        detailConditions: calculationCase.input.detail_conditions ?? undefined,
        systemCapacityKw: calculationCase.input.system_capacity_kw ?? undefined
      },
      publicData
    );
    assert.deepEqual(actual, calculationCase.expected);
  });
}

test("回収年は累積経済効果が初期費用以上になる最初の年を返す", () => {
  const tokyo = calculateEstimate(
    { prefectureCode: "13", monthlyElectricityBillYen: 11_567 },
    publicData
  );
  const standard = tokyo.scenarios.find((scenario) => scenario.scenario === "standard");
  const downside = tokyo.scenarios.find((scenario) => scenario.scenario === "downside");
  assert.equal(standard.payback_year, 8);
  assert.equal(downside.payback_year, 12);

  const osakaWithoutConsumption = calculateEstimate(
    { prefectureCode: "27", monthlyElectricityBillYen: 0 },
    publicData
  );
  const unprofitable = osakaWithoutConsumption.scenarios.find(
    (scenario) => scenario.scenario === "standard"
  );
  assert.equal(unprofitable.payback_year, null);
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
    assert.equal(
      scenarios.standard.profit_yen - scenarios.downside.profit_yen,
      scenarios.standard.subsidy_yen
    );
    assert.ok(
      Math.abs(
        result.energy.annual_self_consumed_kwh
        + result.energy.annual_exported_kwh
        - result.energy.annual_generation_kwh
      ) <= 1
    );
  }
});

test("月間電気料金の境界で売電のみと自家消費のみになる", () => {
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
  assert.equal(high.energy.annual_exported_kwh, 0);
  assert.equal(high.energy.annual_self_consumed_kwh, high.energy.annual_generation_kwh);
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
