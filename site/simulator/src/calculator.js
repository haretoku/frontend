export const CALCULATION_IMPLEMENTED = true;

function roundYen(value) {
  return value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5);
}

function salePriceForYear(year, calculation) {
  const fitPeriod = calculation.fit_prices.find(
    (period) => period.period_start_year <= year && year <= period.period_end_year
  );
  return fitPeriod?.price_yen_per_kwh ?? calculation.post_fit_price_yen_per_kwh;
}

export function calculateEstimate(input, publicData) {
  const prefecture = publicData.prefectures.find(
    (item) => item.code === input.prefectureCode
  );
  if (!prefecture) {
    throw new Error("指定された都道府県のデータがありません．");
  }

  const suppliedBill = input.monthlyElectricityBillYen;
  if (
    suppliedBill !== null
    && (typeof suppliedBill !== "number" || !Number.isFinite(suppliedBill) || suppliedBill < 0)
  ) {
    throw new Error("月間電気料金は0以上の数値で入力してください．");
  }

  const usedDefaultBill = suppliedBill === null;
  const monthlyBill = usedDefaultBill
    ? prefecture.default_monthly_electricity_bill_yen
    : suppliedBill;
  const calculation = publicData.calculation;
  const annualConsumption = 12 * monthlyBill / prefecture.electricity_price_yen_per_kwh;
  const annualGeneration = calculation.system_capacity_kw * prefecture.annual_generation_kwh_per_kw;
  const selfConsumed = Math.min(annualConsumption, annualGeneration);
  const exported = Math.max(annualGeneration - annualConsumption, 0);

  const scenarios = publicData.scenarios.map((scenario) => {
    const subsidy = scenario.subsidy_included
      ? prefecture.subsidy_amount_for_4kw_yen
      : 0;
    const initialCost = (
      calculation.system_capacity_kw * calculation.installation_cost_yen_per_kw - subsidy
    );
    const yearlyElectricitySavings = [];
    const yearlySalesIncome = [];

    for (let year = 1; year <= calculation.evaluation_period_years; year += 1) {
      const electricityPrice = prefecture.electricity_price_yen_per_kwh
        * (1 + scenario.electricity_price_growth_rate) ** (year - 1);
      yearlyElectricitySavings.push(selfConsumed * electricityPrice);
      yearlySalesIncome.push(exported * salePriceForYear(year, calculation));
    }

    const totalElectricitySavings = yearlyElectricitySavings.reduce((sum, value) => sum + value, 0);
    const totalSalesIncome = yearlySalesIncome.reduce((sum, value) => sum + value, 0);
    const totalRevenue = totalElectricitySavings + totalSalesIncome;
    let cumulativeEconomicBenefit = 0;
    let paybackYear = initialCost <= 0 ? 0 : null;

    for (let index = 0; index < calculation.evaluation_period_years && paybackYear === null; index += 1) {
      cumulativeEconomicBenefit += yearlyElectricitySavings[index] + yearlySalesIncome[index];
      if (cumulativeEconomicBenefit >= initialCost) {
        paybackYear = index + 1;
      }
    }

    return {
      scenario: scenario.scenario,
      subsidy_yen: roundYen(subsidy),
      initial_cost_yen: roundYen(initialCost),
      first_year_electricity_savings_yen: roundYen(yearlyElectricitySavings[0]),
      first_year_sales_income_yen: roundYen(yearlySalesIncome[0]),
      first_year_economic_benefit_yen: roundYen(
        yearlyElectricitySavings[0] + yearlySalesIncome[0]
      ),
      total_electricity_savings_yen: roundYen(totalElectricitySavings),
      total_sales_income_yen: roundYen(totalSalesIncome),
      total_revenue_yen: roundYen(totalRevenue),
      profit_yen: roundYen(totalRevenue - initialCost),
      payback_year: paybackYear
    };
  });

  return {
    input: {
      prefecture_code: input.prefectureCode,
      prefecture_name: prefecture.name,
      monthly_electricity_bill_yen: roundYen(monthlyBill),
      used_default_monthly_electricity_bill: usedDefaultBill
    },
    energy: {
      annual_consumption_kwh: roundYen(annualConsumption),
      annual_generation_kwh: roundYen(annualGeneration),
      annual_self_consumed_kwh: roundYen(selfConsumed),
      annual_exported_kwh: roundYen(exported)
    },
    scenarios
  };
}
