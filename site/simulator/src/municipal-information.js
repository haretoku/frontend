export const applicationStatusLabels = {
  accepting: "受付中", closed: "受付終了", suspended: "受付停止中",
  unknown: "受付状況未確認", not_applicable: "直接補助なし"
};

export const amountStatusLabels = {
  confirmed: "金額確認済み", partially_confirmed: "一部の金額・条件を確認済み",
  unresolved: "金額未確認", not_applicable: "対象金額なし"
};

export const componentStatusLabels = {
  included: "条件が合えば診断に反映",
  not_adopted_missing_conditions: "条件の確認が必要なため未算入",
  not_adopted_model_outside: "この診断の対象外のため未算入",
  not_adopted_closed: "受付終了のため未算入",
  not_adopted_suspended: "受付停止のため未算入",
  not_adopted_unknown: "確認できていないため未算入"
};

export function municipalInformationSummary(summary) {
  const status = applicationStatusLabels[summary.application_status] ?? applicationStatusLabels.unknown;
  const amount = amountStatusLabels[summary.amount_status] ?? amountStatusLabels.unresolved;
  return `${status}．${amount}．制度ごとの条件と今回の算入可否は下記で確認できます．`;
}

export function programConditionsText(note) {
  return note
    .replace("現行計算へ組み込まれた相手制度がないため合算しない", "この診断では市の補助金と合算していません")
    .replace("現行入力だけでは算定せず別成分として保留する", "この診断の入力だけでは金額を確定できず，今回は算入していません");
}
