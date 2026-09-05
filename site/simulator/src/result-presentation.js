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
