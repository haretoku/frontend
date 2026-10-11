import { calculateEstimate } from '../../simulator/src/calculator.js';

export const economicsExampleInput = Object.freeze({
  prefectureCode: '13', housingAge: 'existing', systemCapacityKw: 4,
  monthlyElectricityBillYen: null, detailConditions: { roof_orientation: 'south' },
  daytimeOccupancy: 'almost_every_weekday', equipmentPackage: 'solar_only'
});

// The article deliberately compares equipment without subsidies. Preserve the
// calculator's operating flows and remove only the initial subsidy contribution.
export function economicsExample(data, input = economicsExampleInput) {
  return calculateEstimate(input, data).scenarios.map(s => {
    if (!Number.isFinite(s.subsidy_yen) || !Number.isFinite(s.profit_yen)) {
      throw new Error('記事の代表試算に必要な補助額・収支を確定できません．');
    }
    const annual = s.annual_cash_flows.map(r => ({ ...r,
      cumulative_cash_flow_yen: r.cumulative_cash_flow_yen - s.subsidy_yen }));
    const recovery = annual.findIndex((r, i) => r.cumulative_cash_flow_yen >= 0
      && annual.slice(i).every(later => later.cumulative_cash_flow_yen >= 0));
    return { ...s, subsidy_yen: 0, net_initial_outlay_yen: s.gross_installation_cost_yen,
      profit_yen: s.profit_yen - s.subsidy_yen, annual_cash_flows: annual,
      payback_year: recovery < 0 ? null : recovery + 1 };
  });
}

export function tieredEnergyCharge(kwh, tariff) {
  const [first, second] = tariff.thresholdsKwh;
  const [a, b, c] = tariff.ratesYenPerKwh;
  return Math.min(kwh, first) * a + Math.min(Math.max(kwh - first, 0), second - first) * b
    + Math.max(kwh - second, 0) * c;
}

export function guideNumberValues(data, refs) {
  const c = data.calculation;
  if (c.evaluation_period_years !== 30) throw Error('記事の30年間比較を見直してください．');
  const standard = economicsExample(data).find(s => s.scenario === 'standard');
  const batteryExample = economicsExample(data, { ...economicsExampleInput,
    equipmentPackage: 'solar_plus_standard_battery' }).find(s => s.scenario === 'standard');
  const tokyo = data.prefectures.find(p => p.code === '13');
  const maintenance = c.lifecycle_cost_events.find(e => e.cost_type === 'maintenance');
  const replacement = c.lifecycle_cost_events.find(e => e.cost_type === 'replacement');
  const fit = c.sale_price_periods.filter(p => p.price_type === 'fit');
  const t = refs.tepcoB;
  const self = t.monthlySelfConsumptionKwh;
  const sold = t.monthlyGenerationKwh - self;
  const savings = tieredEnergyCharge(t.billSampleKwh, t) - tieredEnergyCharge(t.billSampleKwh - self, t);
  const sales = sold * c.post_fit_price_yen_per_kwh;
  const inflation = data.scenarios.find(s => s.id === 'standard' || s.scenario === 'standard')?.electricity_price_growth_rate;
  const fallbackGrowth = standard.annual_cash_flows[1].purchase_price_yen_per_kwh
    / standard.annual_cash_flows[0].purchase_price_yen_per_kwh - 1;
  const growth = inflation ?? fallbackGrowth;
  const degradation = 1 - c.pv_generation_degradation.annual_retention_factor;
  const yearlySavings = Array.from({ length: c.evaluation_period_years }, (_, i) => {
    const consumed = self * (1 - degradation) ** i;
    return (tieredEnergyCharge(t.billSampleKwh, t) - tieredEnergyCharge(t.billSampleKwh - consumed, t))
      * (1 + growth) ** i * 12;
  });
  const numbers = {
    'economics.profit': standard.profit_yen,
    'economics.benefit': standard.total_revenue_yen,
    'economics.savings': standard.total_electricity_savings_yen,
    'economics.sales': standard.total_sales_income_yen,
    'economics.firstYearSavings': standard.first_year_electricity_savings_yen,
    'economics.firstYearMonthlySavings': standard.first_year_electricity_savings_yen / 12,
    'economics.firstYearSales': standard.first_year_sales_income_yen,
    'economics.firstYearBenefit': standard.first_year_economic_benefit_yen,
    'economics.installation': standard.gross_installation_cost_yen,
    'economics.maintenance': standard.total_maintenance_and_replacement_cost_yen,
    'economics.expenses': standard.gross_installation_cost_yen + standard.total_maintenance_and_replacement_cost_yen,
    'economics.payback': standard.payback_year,
    'economics.monthlyBill': tokyo.default_monthly_electricity_bill_yen,
    'economics.buyPrice': tokyo.electricity_price_yen_per_kwh,
    'economics.firstPriceDifference': tokyo.electricity_price_yen_per_kwh - fit[0].price_yen_per_kwh,
    'economics.secondPriceDifference': tokyo.electricity_price_yen_per_kwh - fit[1].price_yen_per_kwh,
    'economics.batteryBenefit': batteryExample.total_revenue_yen,
    'economics.batteryProfit': batteryExample.profit_yen,
    'model.years': c.evaluation_period_years,
    'model.growthPercent': growth * 100,
    'model.degradationPercent': degradation * 100,
    'cost.existingPerKw': c.installation_cost_yen_per_kw_by_housing_age.existing,
    'cost.newPerKw': c.installation_cost_yen_per_kw_by_housing_age.new,
    'cost.battery': c.battery_system.installed_cost_yen,
    'cost.withBattery': standard.gross_installation_cost_yen + c.battery_system.installed_cost_yen,
    'cost.inspection': maintenance.cost_yen,
    'cost.inspectionCount': maintenance.event_years.length,
    'cost.inspectionTotal': maintenance.cost_yen * maintenance.event_years.length,
    'cost.replacement': replacement.cost_yen,
    'cost.replacementCount': replacement.event_years.length,
    'cost.inspectionAndReplacement': maintenance.cost_yen + replacement.cost_yen,
    'reference.inspection': maintenance.source_cost_yen,
    'reference.replacement': replacement.source_cost_yen,
    'reference.inspectionTotal': maintenance.source_cost_yen * maintenance.event_years.length,
    'reference.replacementTotal': replacement.source_cost_yen * replacement.event_years.length,
    'reference.maintenanceTotal': maintenance.source_cost_yen * maintenance.event_years.length
      + replacement.source_cost_yen * replacement.event_years.length,
    'reference.inspectionAndReplacement': maintenance.source_cost_yen + replacement.source_cost_yen,
    'fit.firstPrice': fit[0].price_yen_per_kwh,
    'fit.secondPrice': fit[1].price_yen_per_kwh,
    'fit.postPrice': c.post_fit_price_yen_per_kwh,
    'fit.firstMonthlySales': sold * fit[0].price_yen_per_kwh,
    'fit.secondMonthlySales': sold * fit[1].price_yen_per_kwh,
    'savings.generation': t.monthlyGenerationKwh,
    'savings.self': self, 'savings.sold': sold,
    'savings.before': t.billSampleKwh, 'savings.after': t.billSampleKwh - self,
    'savings.firstReduced': self - Math.max(t.billSampleKwh - t.thresholdsKwh[0], 0),
    'savings.secondReduced': Math.max(t.billSampleKwh - t.thresholdsKwh[0], 0),
    'savings.monthly': savings, 'savings.sales': sales, 'savings.total': savings + sales,
    'savings.year1': yearlySavings[0], 'savings.year2': yearlySavings[1],
    'savings.year10': yearlySavings[9], 'savings.year30': yearlySavings[29],
    'savings.longTerm': yearlySavings.reduce((sum, value) => sum + value, 0),
    'tariff.firstPrice': t.ratesYenPerKwh[0], 'tariff.secondPrice': t.ratesYenPerKwh[1],
    'tariff.thirdPrice': t.ratesYenPerKwh[2],
    'quote.a': refs.quoteComparison.aYen, 'quote.b': refs.quoteComparison.bYen,
    'quote.scaffolding': refs.quoteComparison.bScaffoldingYen,
    'quote.bTotal': refs.quoteComparison.bYen + refs.quoteComparison.bScaffoldingYen,
    'quote.difference': refs.quoteComparison.bYen + refs.quoteComparison.bScaffoldingYen - refs.quoteComparison.aYen,
    'subsidy.total': refs.subsidyPayment.totalYen, 'subsidy.grant': refs.subsidyPayment.grantYen,
    'subsidy.burden': refs.subsidyPayment.totalYen - refs.subsidyPayment.grantYen,
    'subsidy.reducedGrant': refs.subsidyPayment.reducedGrantYen,
    'subsidy.reducedBurden': refs.subsidyPayment.totalYen - refs.subsidyPayment.reducedGrantYen,
    'subsidy.tokyoRate': refs.tokyoSubsidyReference.rateYenPerKw,
    'subsidy.rateExampleGrant': refs.subsidyRateExample.eligibleCostYen * refs.subsidyRateExample.grantRate,
    'subsidy.tokyoGrant': Math.min(refs.tokyoSubsidyReference.capacityKw * refs.tokyoSubsidyReference.rateYenPerKw,
      refs.tokyoSubsidyReference.eligibleCostYen),
    'subsidy.tokyoCombinedGrant': Math.min(refs.tokyoSubsidyReference.capacityKw * refs.tokyoSubsidyReference.rateYenPerKw,
      refs.tokyoSubsidyReference.eligibleCostYen - refs.tokyoSubsidyReference.otherSameCostGrantYen),
    'outage.meanDaily': refs.outageComparison.annualMeanHouseholdKwh / refs.outageComparison.surveyYearDays,
    'outage.limitedDaily': c.battery_system.outage_reference.household_appliance_ac_load_kwh,
    'outage.meanTotalDaily': refs.outageComparison.annualMeanHouseholdKwh / refs.outageComparison.surveyYearDays
      + c.battery_system.outage_reference.auxiliary_ac_load_kwh,
    'outage.limitedTotalDaily': c.battery_system.outage_reference.total_ac_energy_before_conversion_kwh,
    'outage.meanHours': refs.outageComparison.availableDcKwh * c.battery_system.discharge_efficiency
      / (refs.outageComparison.annualMeanHouseholdKwh / refs.outageComparison.surveyYearDays
        + c.battery_system.outage_reference.auxiliary_ac_load_kwh) * 24,
    'outage.limitedHours': refs.outageComparison.availableDcKwh * c.battery_system.discharge_efficiency
      / c.battery_system.outage_reference.total_ac_energy_before_conversion_kwh * 24,
    'reference.qCells': refs.installationReferences.qCellsYenPerKw,
    'reference.leapton': refs.installationReferences.leaptonYenPerKw,
    'reference.new2025': refs.installationReferences.newHousing2025YenPerKw,
    'reference.existing2025': refs.installationReferences.existingHousing2025YenPerKw
  };
  for (const age of ['existing', 'new']) for (const capacity of [4, 6]) {
    numbers[`cost.${age}${capacity}`] = c.installation_cost_yen_per_kw_by_housing_age[age] * capacity;
  }
  numbers['cost.existingCapacityDifference'] = numbers['cost.existing6'] - numbers['cost.existing4'];
  numbers['cost.newCapacityDifference'] = numbers['cost.new6'] - numbers['cost.new4'];
  numbers['reference.qCells4'] = numbers['reference.qCells'] * 4;
  numbers['reference.leapton4'] = numbers['reference.leapton'] * 4;
  numbers['reference.productDifference'] = numbers['reference.qCells4'] - numbers['reference.leapton4'];
  numbers['reference.new2025Four'] = numbers['reference.new2025'] * 4;
  numbers['reference.existing2025Four'] = numbers['reference.existing2025'] * 4;
  numbers['reference.housingDifferencePerKw'] = numbers['reference.existing2025'] - numbers['reference.new2025'];
  numbers['reference.housingDifferenceFour'] = numbers['reference.housingDifferencePerKw'] * 4;
  for (const [key, value] of Object.entries(numbers)) {
    if (!Number.isFinite(value)) throw new Error(`記事の数値が未確定です：${key}`);
  }
  return numbers;
}

export function formatGuideNumber(value, format = 'number') {
  const [kind, digits] = format.split(':');
  const decimals = Number(digits ?? 0);
  if (kind === 'approx-man') return `約${Math.round(value / 10000)}万円`;
  if (kind === 'approx-yen') return `約${Math.round(value).toLocaleString('ja-JP')}円`;
  if (kind === 'approx-yen10') return `約${(Math.round(value / 10) * 10).toLocaleString('ja-JP')}円`;
  if (kind === 'approx-yen100') return `約${(Math.round(value / 100) * 100).toLocaleString('ja-JP')}円`;
  if (kind === 'kwh') return `${Number(value.toFixed(decimals)).toLocaleString('ja-JP')} kWh`;
  if (kind === 'man') return `${Number((value / 10000).toFixed(decimals))}万円`;
  if (kind === 'approx-man-decimal') return `約${(value / 10000).toFixed(decimals)}万円`;
  if (kind === 'yen') return `${value.toLocaleString('ja-JP', { minimumFractionDigits: decimals, maximumFractionDigits: decimals })}円`;
  if (kind === 'fixed') return value.toFixed(decimals);
  return Number(value.toFixed(decimals)).toLocaleString('ja-JP', { maximumFractionDigits: decimals });
}
