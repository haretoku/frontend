const yenFormatter = new Intl.NumberFormat("ja-JP");

export function resultConditionHeadline(profit) {
  return Number.isFinite(profit) ? "今回の条件での概算" : "今回の条件での概算（確認待ち）";
}

export function mainSubsidyPresentation(scenario, hasExcluded = false) {
  if (!Number.isFinite(scenario.subsidy_yen)) return { text: '補助金は未確定', link: '確認状況を見る' };
  if (scenario.subsidy_yen > 0) return { text: hasUnconfirmedSubsidy(scenario) || hasExcluded ? '補助金を一部算入' : '補助金を算入', link: '内訳を確認' };
  return { text: scenario.scenario === 'downside' ? '補助金は含めない想定' : hasUnconfirmedSubsidy(scenario) ? '補助金を含まず（適用確認待ち）' : '補助金を含まず', link: '理由を確認' };
}

export function scenarioRecoveryPresentation(scenario) {
  const recovery = !Number.isFinite(scenario.profit_yen) ? '回収は確認待ち' : scenario.payback_year === null ? '30年以内の回収なし' : scenario.payback_year === 0 ? '初期費用を補助金で充当' : '約' + scenario.payback_year + '年で回収';
  return recovery;
}

export function energyBreakdownPresentation(equipmentPackage) {
  const battery = equipmentPackage === "solar_plus_standard_battery";
  return {
    battery,
    equation: battery
      ? "充電は発電量の内訳です．自家消費は直接使用と蓄電池からの供給の合計です．"
      : "",
    sufficiency: battery ? "家庭の使用量のうち，太陽光と蓄電池で賄った割合" : "家庭の使用量のうち，太陽光で賄った割合",
  };
}

export function decisionAmountParts(value) {
  if (!Number.isFinite(value)) {
    return { amount: "補助金確認後に確定", outcome: "" };
  }

  const roundedYen = Math.round(value);
  const absoluteYen = Math.abs(roundedYen);
  if (roundedYen === 0) {
    return { amount: "0円", outcome: "" };
  }
  if (absoluteYen < 10_000) {
    return {
      amount: absoluteYen < 1000 ? "1,000円未満" : `${yenFormatter.format(Math.round(absoluteYen / 1000) * 1000)}円`,
      outcome: roundedYen > 0 ? "トク" : "損"
    };
  }

  return {
    amount: `${yenFormatter.format(Math.round(absoluteYen / 10_000))}万円`,
    outcome: roundedYen > 0 ? "トク" : "損"
  };
}

export function hasUnconfirmedSubsidy(scenario) {
  return scenario.subsidy_status === "unverified"
    || scenario.subsidy_breakdown?.municipality_program_status === "unconfirmed"
    || scenario.subsidy_breakdown?.municipality_program_status === "candidate"
    || (scenario.subsidy_breakdown?.candidate_programs ?? []).length > 0;
}

export function endpointResult(scenario) {
  const final = scenario.annual_cash_flows?.find(row => row.year === 30);
  const value = Number.isFinite(final?.cumulative_cash_flow_yen) ? final.cumulative_cash_flow_yen : null;
  const parts = decisionAmountParts(value);
  return { value, text: value === null ? '未確定' : (value > 0 ? '＋' : value < 0 ? '−' : '') + parts.amount };
}

export function cashflowChartLayout(width, labelWidth, compact) {
  const padding = { top: compact ? 46 : 18, right: compact ? 20 : Math.ceil(labelWidth) + 26, bottom: 42, left: width < 480 ? 52 : 82 };
  return { padding, labelMaxWidth: compact ? width - padding.left - padding.right : labelWidth, labelTop: compact ? 20 : null };
}
