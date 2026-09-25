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

export function scenarioSubsidyCondition(scenario) {
  return scenario.scenario === 'downside' ? '補助金：含めない想定' : '補助金：確認できた適用条件・額で利用する想定';
}
export function subsidyBreakdownReason(scenario, groups) {
  if (!Number.isFinite(scenario.subsidy_yen)) return '算入額が未確定のため，収支は確認待ちです．';
  if (scenario.scenario === 'downside') return '補助金を利用できない場合の想定です．';
  const reasons = [...new Set(groups.excluded.map(item => item.reason).filter(Boolean))];
  if (reasons.length) return (scenario.subsidy_yen > 0 ? '一部の制度を算入しています．' : '') + reasons.join(' ');
  if (scenario.subsidy_breakdown?.municipality_program_status === 'searched_not_found') return (scenario.subsidy_yen > 0 ? '確認できた制度の採用額を算入しています．' : '') + '市区町村の制度は調査した範囲では見つかっていません．制度不存在の確定ではありません．';
  if (hasUnconfirmedSubsidy(scenario)) return scenario.subsidy_yen > 0 ? '確認済みの額を算入し，未確認分は含めていません．' : 'はれトク側で適用可能か確認できていないため，今回の概算に含めていません．';
  return scenario.subsidy_yen > 0 ? '確認できた制度の採用額を算入しています．' : '確認できた範囲で，今回の条件に算入する制度はありません．';
}

export function conclusionBreakdown(scenario) {
  const sum = values => values.every(Number.isFinite) ? values.reduce((a, b) => a + b, 0) : null;
  const income = sum([scenario.total_electricity_savings_yen, scenario.total_sales_income_yen]);
  const cost = sum([scenario.gross_installation_cost_yen, scenario.total_maintenance_cost_yen, scenario.total_replacement_cost_yen, scenario.total_battery_replacement_cost_yen]);
  const subsidy = Number.isFinite(scenario.subsidy_yen) ? scenario.subsidy_yen : null;
  return { income, cost, subsidy, net: [income, cost, subsidy].every(Number.isFinite) ? income - cost + subsidy : null };
}
export function compactYen(value) {
  if (!Number.isFinite(value)) return '未確定';
  if (value === 0) return '0万円';
  if (Math.abs(value) < 1000) return (value < 0 ? '−' : '') + '1,000円未満';
  if (Math.abs(value) < 10000) return yenFormatter.format(Math.round(value / 1000) * 1000) + '円';
  return yenFormatter.format(Math.round(value / 10000)) + '万円';
}

export function endpointResult(scenario) {
  const final = scenario.annual_cash_flows?.find(row => row.year === 30);
  const value = Number.isFinite(final?.cumulative_cash_flow_yen) ? final.cumulative_cash_flow_yen : null;
  const parts = decisionAmountParts(value);
  return { value, text: value === null ? '未確定' : (value > 0 ? '＋' : value < 0 ? '−' : '') + parts.amount };
}

export function financialTotals(scenario) {
  const cost = conclusionBreakdown(scenario).cost;
  const income = [scenario.total_revenue_yen, scenario.subsidy_yen].every(Number.isFinite) ? scenario.total_revenue_yen + scenario.subsidy_yen : null;
  return { income, cost };
}

export function energyRoutes(energy) {
  const known = value => Number.isFinite(value) ? value : null;
  const firstYear = energy.annual_energy_flows?.find(row => row.year === 1);
  const opening = known(firstYear?.opening_state_of_charge_kwh);
  const closing = known(firstYear?.closing_state_of_charge_kwh);
  return { generation: known(energy.annual_generation_kwh), direct: known(energy.annual_direct_self_consumed_kwh), exported: known(energy.annual_exported_kwh), purchased: known(energy.annual_purchased_kwh), consumed: known(energy.annual_consumption_kwh), selfConsumed: known(energy.annual_self_consumed_kwh), charge: known(energy.annual_battery_charge_input_kwh), delivered: known(energy.annual_battery_delivered_kwh), loss: known(energy.annual_battery_conversion_loss_kwh), stored: opening !== null && closing !== null ? closing - opening : null };
}

export function subsidyReasonPresentation(scenario, groups) {
  const reason = subsidyBreakdownReason(scenario, groups);
  // The visible cue and accessible explanation share the exact breakdown reason.
  const cues = [
    ['計算で扱う範囲に対応していない', 'モデル未対応'],
    ['同じ費目の上限に達する', '費目上限'], ['住宅区分は制度の対象区分と異なる', '住宅区分'], ['総額が最大となる別の組合せ', '最大組合せ外'], ['最低容量を下回る', '容量条件'], ['受付が終了', '受付終了'],
    ['受付が停止', '受付停止'], ['FIT売電', '売電条件'],
    ['併用条件', '併用条件'], ['異なる設備', '設備条件'],
    ['確認できていない', '適用確認待ち'], ['未確認分', '適用確認待ち'],
    ['未確定', '算入額未確定'], ['利用できない場合の想定', 'シナリオ仮定']
  ].filter(([match]) => reason.includes(match)).map(([, label]) => label);
  const label = [...new Set(cues)].join('・');
  const visible = label ? label + '：理由' : '理由';
  return { reason, visible, aria: visible + '．補助金（今回算入）：' + reason + ' 補助金の内訳を確認' };
}

export function formatEnergyRate(value) {
  return Number.isFinite(value) ? (value * 100).toFixed(1) + "％" : "未確定";
}

export function cashflowChartLayout(width, labelWidth, compact) {
  const padding = { top: compact ? 46 : 18, right: compact ? 20 : Math.ceil(labelWidth) + 26, bottom: 42, left: width < 480 ? 52 : 82 };
  return { padding, labelMaxWidth: compact ? width - padding.left - padding.right : labelWidth, labelTop: compact ? 20 : null };
}
