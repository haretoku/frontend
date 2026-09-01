export const CALCULATION_IMPLEMENTED = true;

function roundYen(value) {
  return value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5);
}

function salePriceForYear(year, calculation) {
  const publishedPeriod = calculation.sale_price_periods?.find(
    (period) => period.period_start_year <= year && year <= period.period_end_year
  );
  if (publishedPeriod) return publishedPeriod.price_yen_per_kwh;
  const fitPeriod = calculation.fit_prices.find(
    (period) => period.period_start_year <= year && year <= period.period_end_year
  );
  return fitPeriod?.price_yen_per_kwh ?? calculation.post_fit_price_yen_per_kwh;
}

function withinCapacity(capacityKw, record) {
  const minimum = record.capacity_min_kw;
  const maximum = record.capacity_max_kw;
  if (minimum !== null && minimum !== undefined
    && (capacityKw < minimum || (capacityKw === minimum && !record.capacity_min_inclusive))) return false;
  if (maximum !== null && maximum !== undefined
    && (capacityKw > maximum || (capacityKw === maximum && !record.capacity_max_inclusive))) return false;
  return true;
}

function roundedCapacity(capacityKw, rule) {
  if (rule === "none") return capacityKw;
  if (rule === "floor_capacity_to_integer_kw") return Math.floor(capacityKw);
  if (rule === "round_capacity_to_0_01_kw") return Math.floor(capacityKw * 100 + 0.5) / 100;
  return null;
}

function subsidyForCapacity(prefecture, capacityKw, subsidyIncluded) {
  const programs = prefecture.subsidy_programs ?? [];
  if (!subsidyIncluded) {
    return { amount: 0, status: "not_applicable", sourceIds: [], note: "下振れシナリオでは補助金を適用しない．" };
  }
  if (!programs.length) {
    return {
      amount: 0,
      status: "not_applicable",
      sourceIds: prefecture.subsidy_review_source_ids ?? [],
      note: "都道府県入力だけで適用できる確認済み制度がない．"
    };
  }

  let total = 0;
  let appliedCount = 0;
  const sourceIds = [];
  const notes = [];
  for (const program of programs) {
    if (!withinCapacity(capacityKw, program)) {
      notes.push(`${program.id}は容量条件外．`);
      continue;
    }
    if (program.status !== "verified") {
      return { amount: null, status: "unverified", sourceIds: [program.source_id], note: `${program.id}の算式が未検証．` };
    }

    let amount = null;
    if (program.calculation_type === "fixed") {
      amount = program.fixed_amount_yen;
    } else if (program.calculation_type === "per_kw") {
      const capacity = roundedCapacity(capacityKw, program.rounding_rule);
      if (capacity === null) {
        if (capacityKw === 4) amount = program.calculated_amount_for_4kw_yen;
        else return { amount: null, status: "unverified", sourceIds: [program.source_id], note: `${program.id}の容量端数処理が未検証．` };
      } else {
        amount = capacity * program.amount_yen_per_kw;
      }
      if (program.subsidy_cap_yen !== null) amount = Math.min(amount, program.subsidy_cap_yen);
    } else if (program.calculation_type === "tiered") {
      const capacity = roundedCapacity(capacityKw, program.rounding_rule);
      const tier = program.tiers?.find((item) => withinCapacity(capacity, item));
      if (!tier) return { amount: null, status: "unverified", sourceIds: [program.source_id], note: `${program.id}の該当区分がない．` };
      amount = capacity * tier.amount_yen_per_kw;
      if (tier.subsidy_cap_yen !== null) amount = Math.min(amount, tier.subsidy_cap_yen);
    } else {
      return { amount: null, status: "unverified", sourceIds: [program.source_id], note: `${program.id}の算式が未実装．` };
    }
    total += amount;
    appliedCount += 1;
    sourceIds.push(program.source_id);
    notes.push(`${program.id}を適用．`);
  }

  if (appliedCount === 0) {
    return { amount: 0, status: "not_applicable", sourceIds: [...new Set(sourceIds)], note: notes.join(" ") };
  }
  return { amount: roundYen(total), status: "applied", sourceIds: [...new Set(sourceIds)], note: notes.join(" ") };
}

function appliedDetailConditions(input, calculation) {
  const supplied = input.detailConditions ?? {};
  const allowedNames = new Set((calculation.detail_inputs ?? []).map((item) => item.input_name));
  const unknownNames = Object.keys(supplied).filter((name) => !allowedNames.has(name));
  if (unknownNames.length) throw new Error(`未対応の詳細条件があります．${unknownNames.join("，")}`);

  let generationCorrectionFactor = 1;
  const conditions = (calculation.detail_inputs ?? []).map((item) => {
    const value = supplied[item.input_name] ?? item.default_option;
    const option = item.options.find((candidate) => candidate.value === value);
    if (!option) throw new Error(`${item.input_name}の選択値が不正です．`);
    const applied = option.calculation_status === "supported"
      && option.generation_correction_factor !== null;
    if (applied) generationCorrectionFactor *= option.generation_correction_factor;
    return {
      input_name: item.input_name,
      value,
      label: option.label,
      calculation_status: item.calculation_status,
      generation_correction_factor: option.generation_correction_factor,
      applied,
      reason: item.reason
    };
  });
  return { conditions, generationCorrectionFactor };
}

export function calculateEstimate(input, publicData) {
  const prefecture = publicData.prefectures.find((item) => item.code === input.prefectureCode);
  if (!prefecture) throw new Error("指定された都道府県のデータがありません．");

  const suppliedBill = input.monthlyElectricityBillYen;
  if (suppliedBill !== null && (typeof suppliedBill !== "number" || !Number.isFinite(suppliedBill) || suppliedBill < 0)) {
    throw new Error("月間電気料金は0以上の数値で入力してください．");
  }
  const usedDefaultBill = suppliedBill === null;
  const monthlyBill = usedDefaultBill ? prefecture.default_monthly_electricity_bill_yen : suppliedBill;
  const calculation = publicData.calculation;
  const systemCapacity = input.systemCapacityKw ?? calculation.system_capacity_kw;
  if (typeof systemCapacity !== "number" || !Number.isFinite(systemCapacity) || systemCapacity <= 0) {
    throw new Error("設置容量は0より大きい数値で入力してください．");
  }

  const detailResult = appliedDetailConditions(input, calculation);
  const annualConsumption = 12 * monthlyBill / prefecture.electricity_price_yen_per_kwh;
  const baselineAnnualGeneration = systemCapacity * prefecture.annual_generation_kwh_per_kw;
  const annualGeneration = baselineAnnualGeneration * detailResult.generationCorrectionFactor;
  const selfConsumed = Math.min(annualConsumption, annualGeneration);
  const exported = Math.max(annualGeneration - annualConsumption, 0);
  const purchased = Math.max(annualConsumption - selfConsumed, 0);
  const grossInstallationCost = systemCapacity * calculation.installation_cost_yen_per_kw;

  const scenarios = publicData.scenarios.map((scenario) => {
    const subsidy = subsidyForCapacity(prefecture, systemCapacity, scenario.subsidy_included);
    const netInitialOutlay = subsidy.amount === null ? null : grossInstallationCost - subsidy.amount;
    let cumulativeCashFlow = netInitialOutlay === null ? null : -netInitialOutlay;
    let paybackYear = null;
    let totalElectricitySavings = 0;
    let totalSalesIncome = 0;
    let totalMaintenanceCost = 0;
    let totalReplacementCost = 0;
    const annualCashFlows = [];

    for (let year = 1; year <= calculation.evaluation_period_years; year += 1) {
      const purchasePrice = prefecture.electricity_price_yen_per_kwh
        * (1 + scenario.electricity_price_growth_rate) ** (year - 1);
      const electricitySavings = selfConsumed * purchasePrice;
      const salesIncome = exported * salePriceForYear(year, calculation);
      let maintenanceCost = 0;
      let replacementCost = 0;
      for (const event of calculation.lifecycle_cost_events ?? []) {
        if (!event.event_years.includes(year)) continue;
        if (event.cost_type === "maintenance") maintenanceCost += event.cost_yen;
        if (event.cost_type === "replacement") replacementCost += event.cost_yen;
      }
      const netCashFlow = electricitySavings + salesIncome - maintenanceCost - replacementCost;
      if (cumulativeCashFlow !== null) cumulativeCashFlow += netCashFlow;
      totalElectricitySavings += electricitySavings;
      totalSalesIncome += salesIncome;
      totalMaintenanceCost += maintenanceCost;
      totalReplacementCost += replacementCost;
      annualCashFlows.push({
        year,
        purchase_price_yen_per_kwh: Math.round(purchasePrice * 1e6) / 1e6,
        sale_price_yen_per_kwh: salePriceForYear(year, calculation),
        electricity_savings_yen: roundYen(electricitySavings),
        sales_income_yen: roundYen(salesIncome),
        maintenance_cost_yen: maintenanceCost,
        replacement_cost_yen: replacementCost,
        maintenance_and_replacement_cost_yen: maintenanceCost + replacementCost,
        net_cash_flow_yen: roundYen(netCashFlow),
        cumulative_cash_flow_yen: cumulativeCashFlow === null ? null : roundYen(cumulativeCashFlow)
      });
    }

    const durablePaybackIndex = annualCashFlows.findIndex((row, index) => (
      row.cumulative_cash_flow_yen >= 0
      && annualCashFlows.slice(index).every((laterRow) => laterRow.cumulative_cash_flow_yen >= 0)
    ));
    paybackYear = durablePaybackIndex < 0 ? null : durablePaybackIndex + 1;

    const totalRevenue = totalElectricitySavings + totalSalesIncome;
    const profit = netInitialOutlay === null
      ? null
      : totalRevenue - netInitialOutlay - totalMaintenanceCost - totalReplacementCost;
    return {
      scenario: scenario.scenario,
      subsidy_yen: subsidy.amount,
      subsidy_status: subsidy.status,
      subsidy_source_ids: subsidy.sourceIds,
      subsidy_calculation_note: subsidy.note,
      gross_installation_cost_yen: roundYen(grossInstallationCost),
      net_initial_outlay_yen: netInitialOutlay === null ? null : roundYen(netInitialOutlay),
      initial_cost_yen: netInitialOutlay === null ? null : roundYen(netInitialOutlay),
      first_year_electricity_savings_yen: annualCashFlows[0].electricity_savings_yen,
      first_year_sales_income_yen: annualCashFlows[0].sales_income_yen,
      first_year_economic_benefit_yen: annualCashFlows[0].electricity_savings_yen + annualCashFlows[0].sales_income_yen,
      total_electricity_savings_yen: roundYen(totalElectricitySavings),
      total_sales_income_yen: roundYen(totalSalesIncome),
      total_revenue_yen: roundYen(totalRevenue),
      total_maintenance_cost_yen: totalMaintenanceCost,
      total_replacement_cost_yen: totalReplacementCost,
      total_maintenance_and_replacement_cost_yen: totalMaintenanceCost + totalReplacementCost,
      lifecycle_cost_status: "applied",
      profit_yen: profit === null ? null : roundYen(profit),
      payback_year: paybackYear,
      annual_cash_flows: annualCashFlows
    };
  });

  return {
    input: {
      prefecture_code: input.prefectureCode,
      prefecture_name: prefecture.name,
      system_capacity_kw: systemCapacity,
      monthly_electricity_bill_yen: roundYen(monthlyBill),
      used_default_monthly_electricity_bill: usedDefaultBill,
      detail_conditions: detailResult.conditions
    },
    energy: {
      annual_consumption_kwh: roundYen(annualConsumption),
      baseline_annual_generation_kwh: roundYen(baselineAnnualGeneration),
      generation_correction_factor: Math.round(detailResult.generationCorrectionFactor * 1e6) / 1e6,
      annual_generation_kwh: roundYen(annualGeneration),
      annual_self_consumed_kwh: roundYen(selfConsumed),
      annual_exported_kwh: roundYen(exported),
      annual_purchased_kwh: roundYen(purchased)
    },
    prices: {
      current_purchase_price_yen_per_kwh: prefecture.electricity_price_yen_per_kwh,
      sale_price_periods: calculation.sale_price_periods ?? []
    },
    excluded_cost_and_performance_items: calculation.excluded_cost_and_performance_items ?? [],
    scenarios
  };
}
