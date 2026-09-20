const capacityFormatter = new Intl.NumberFormat("ja-JP", { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export function formatBatteryCapacity(value) {
  return capacityFormatter.format(value);
}

export function degradationLabel(scenario) {
  const retention = (scenario.capacity_retention_at_year_20 * 100).toFixed(1).replace(/\.0$/, "");
  return scenario.id === "conservative"
    ? `保守的な仮定（20年後 約${retention}％）`
    : `条件付き比較（20年後 ${retention}％）`;
}

export function degradationDescription(degradation) {
  const premise = degradation.scenario_id === "conservative"
    ? "15年目末60％は，保証下限に整合する保守的感度パスです．16～30年は同じ年率係数を継続した数学的外挿です．"
    : `20年後${(degradation.capacity_retention_at_year_20 * 100).toFixed(0)}％の容量が残る条件付き比較仮定です．研究で同定された平均や保証値ではありません．`;
  return `${premise}実測平均や期待値ではなく，各年は年末容量をその年の計算に用います．30年間交換しない仮定であり，製品の寿命や動作を保証するものではありません．`;
}

export function outageReferencePresentation(reference) {
  if (!Number.isFinite(reference?.required_dc_capacity_reference_kwh)
    || reference.required_dc_capacity_reference_kwh <= 0) return null;
  return {
    capacity: reference.required_dc_capacity_reference_kwh,
    label: `約${reference.required_dc_capacity_reference_kwh.toFixed(1)} kWh`,
    energy: `家電で使う電力量は約${reference.household_appliance_ac_load_kwh.toFixed(2)} kWh，システム自身の消費は${reference.auxiliary_ac_load_kwh.toFixed(2)} kWhです．放電効率約${(reference.discharge_efficiency * 100).toFixed(1)}％を考慮し，蓄電池内に必要な容量へ換算しています．`
  };
}
