const yenFormatter = new Intl.NumberFormat("ja-JP");

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
      amount: `${yenFormatter.format(absoluteYen)}円`,
      outcome: roundedYen > 0 ? "トク" : "損"
    };
  }

  return {
    amount: `約${yenFormatter.format(Math.round(absoluteYen / 10_000))}万円`,
    outcome: roundedYen > 0 ? "トク" : "損"
  };
}

export function hasUnconfirmedSubsidy(scenario) {
  return scenario.subsidy_status === "unverified"
    || scenario.subsidy_breakdown?.municipality_program_status === "unconfirmed"
    || (scenario.subsidy_breakdown?.candidate_programs ?? []).length > 0;
}

export function scenarioSubsidyCondition(scenario) {
  if (scenario.scenario === "downside") return "補助金は含めません";
  const amount = scenario.subsidy_yen;
  const unknown = hasUnconfirmedSubsidy(scenario);
  if (!Number.isFinite(amount)) return "補助金額は未確認（確認後に収支が確定）";
  if (amount > 0) return "確認済み対象補助金を反映（支給保証なし）" + (unknown ? "．未確認の候補は含めません" : "");
  if (unknown) return "補助金は未確認のため含めません（制度なしとは異なります）";
  return "今回算入する対象補助金なし（確認済み情報の範囲）";
}
