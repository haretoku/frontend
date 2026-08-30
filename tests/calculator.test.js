import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

import { calculateEstimate } from "../assets/js/calculator.js";


const publicData = JSON.parse(
  await readFile(new URL("../data/public-data.json", import.meta.url), "utf8")
);
const calculationCases = JSON.parse(
  await readFile(new URL("../data/calculation-cases.json", import.meta.url), "utf8")
);

for (const calculationCase of calculationCases.cases) {
  test(`backend基準計算と一致する：${calculationCase.id}`, () => {
    const actual = calculateEstimate(
      {
        prefectureCode: calculationCase.input.prefecture_code,
        monthlyElectricityBillYen: calculationCase.input.monthly_electricity_bill_yen
      },
      publicData
    );
    assert.deepEqual(actual, calculationCase.expected);
  });
}

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
