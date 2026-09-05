export const CALCULATION_IMPLEMENTED = true;

function roundYen(value) {
  return value >= 0 ? Math.floor(value + 0.5) : Math.ceil(value - 0.5);
}

function validatedProfile(values, expectedLength, label) {
  if (!Array.isArray(values)
    || values.length !== expectedLength
    || values.some((value) => typeof value !== "number" || !Number.isFinite(value) || value < 0)) {
    throw new Error(`${label}が有効な${expectedLength}区分の非負プロファイルではありません．`);
  }
  return values;
}

function normalizedProfile(values, expectedLength, label) {
  const validatedValues = validatedProfile(values, expectedLength, label);
  const total = validatedValues.reduce((sum, value) => sum + value, 0);
  if (total <= 0) throw new Error(`${label}の合計は0より大きい必要があります．`);
  return validatedValues.map((value) => value / total);
}

function roundTo(value, digits) {
  const factor = 10 ** digits;
  return Math.round(value * factor) / factor;
}

function temporalProfiles(annualConsumption, annualGeneration, occupancyRate, orientation, model) {
  const timeBinCount = model.time_bin_definition.count;
  if (timeBinCount !== 8760) {
    throw new Error("自家消費モデルの時間区分数は8760である必要があります．");
  }

  const rawProfiles = model.load_profile.raw_profiles_kwh_per_hour;
  const standardLoad = validatedProfile(
    rawProfiles.official_standard_calendar,
    timeBinCount,
    "標準カレンダー年間需要"
  );
  const weekdayHomeLoad = validatedProfile(
    rawProfiles.weekday_home_equivalent,
    timeBinCount,
    "平日在宅相当年間需要"
  );
  const loadShares = normalizedProfile(
    standardLoad.map((standard, index) => (
      (1 - occupancyRate) * standard + occupancyRate * weekdayHomeLoad[index]
    )),
    timeBinCount,
    "在宅率反映後年間需要"
  );

  const orientationProfile = model.generation_profile.orientation_profiles.find(
    (profile) => profile.orientation === orientation
  );
  if (!orientationProfile) {
    throw new Error("屋根方位に対応する発電時間プロファイルがありません．");
  }
  const generationShares = normalizedProfile(
    orientationProfile.standard_year_hourly_annual_shares,
    timeBinCount,
    "年間発電"
  );

  return {
    loadProfile: loadShares.map((share) => annualConsumption * share),
    generationProfile: generationShares.map((share) => annualGeneration * share)
  };
}

function temporalOverlap(annualConsumption, annualGeneration, occupancyRate, orientation, model) {
  const { loadProfile, generationProfile } = temporalProfiles(
    annualConsumption,
    annualGeneration,
    occupancyRate,
    orientation,
    model
  );
  const selfConsumed = loadProfile.reduce(
    (sum, load, index) => sum + Math.min(load, generationProfile[index]),
    0
  );
  return {
    selfConsumed,
    selfConsumptionRate: annualGeneration > 0 ? selfConsumed / annualGeneration : 0,
    selfSufficiencyRate: annualConsumption > 0 ? selfConsumed / annualConsumption : 0
  };
}

function batteryEnergyByYear(loadProfile, generationProfile, battery, evaluationYears) {
  const chargeEfficiency = battery.charge_efficiency;
  const dischargeEfficiency = battery.discharge_efficiency;
  const retentionFactor = battery.annual_capacity_retention_factor;
  const initialCapacity = battery.capacity_kwh;
  const annualGeneration = generationProfile.reduce((sum, value) => sum + value, 0);
  const annualConsumption = loadProfile.reduce((sum, value) => sum + value, 0);
  let stateOfCharge = 0;
  let serviceAge = 0;
  const results = [];

  for (let year = 1; year <= evaluationYears; year += 1) {
    serviceAge += 1;
    const usableCapacity = initialCapacity * retentionFactor ** serviceAge;
    const openingStateOfChargeBeforeAdjustment = stateOfCharge;
    const capacityFadeSpillage = Math.max(0, stateOfCharge - usableCapacity);
    stateOfCharge -= capacityFadeSpillage;
    const openingStateOfCharge = stateOfCharge;
    let directSelfConsumed = 0;
    let batteryChargeInput = 0;
    let batteryDelivered = 0;
    let exported = 0;
    let purchased = 0;
    let conversionLoss = 0;

    for (let index = 0; index < loadProfile.length; index += 1) {
      const load = loadProfile[index];
      const generation = generationProfile[index];
      const direct = Math.min(load, generation);
      const surplus = generation - direct;
      const deficit = load - direct;
      const chargeInput = Math.min(
        surplus,
        Math.max(0, usableCapacity - stateOfCharge) / chargeEfficiency
      );
      const stored = chargeInput * chargeEfficiency;
      stateOfCharge += stored;
      const delivered = Math.min(deficit, stateOfCharge * dischargeEfficiency);
      const withdrawn = delivered / dischargeEfficiency;
      stateOfCharge -= withdrawn;

      directSelfConsumed += direct;
      batteryChargeInput += chargeInput;
      batteryDelivered += delivered;
      exported += surplus - chargeInput;
      purchased += deficit - delivered;
      conversionLoss += (chargeInput - stored) + (withdrawn - delivered);
    }

    const economicSelfConsumed = directSelfConsumed + batteryDelivered;
    results.push({
      year,
      battery_service_age_year: serviceAge,
      battery_usable_capacity_kwh: usableCapacity,
      opening_state_of_charge_before_adjustment_kwh: openingStateOfChargeBeforeAdjustment,
      opening_state_of_charge_kwh: openingStateOfCharge,
      closing_state_of_charge_kwh: stateOfCharge,
      capacity_fade_spillage_kwh: capacityFadeSpillage,
      replacement_disposal_spillage_kwh: 0,
      annual_direct_self_consumed_kwh: directSelfConsumed,
      annual_battery_charge_input_kwh: batteryChargeInput,
      annual_battery_delivered_kwh: batteryDelivered,
      annual_battery_conversion_loss_kwh: conversionLoss,
      annual_economic_self_consumed_kwh: economicSelfConsumed,
      annual_exported_kwh: exported,
      annual_purchased_kwh: purchased,
      self_consumption_rate: annualGeneration > 0 ? economicSelfConsumed / annualGeneration : 0,
      self_sufficiency_rate: annualConsumption > 0 ? economicSelfConsumed / annualConsumption : 0
    });
  }
  return results;
}

function validateBatteryReplacementPolicy(battery, evaluationYears) {
  const noReplacementContract = (
    battery.replacement_policy === "no_replacement_within_20_year_evaluation_period"
    && battery.replacement_policy_basis === "service_requirement_no_replacement_scenario_with_year_16_to_20_mathematical_extrapolation_and_no_cycle_to_service_life_conversion"
    && battery.twenty_year_service_life_or_warranty_verified === false
    && Array.isArray(battery.replacement_years)
    && battery.replacement_years.length === 0
    && battery.replacement_cost_yen === 0
    && evaluationYears === 20
  );
  if (!noReplacementContract) {
    throw new Error("標準蓄電池の20年間無交換契約を確認できません．");
  }
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

function subsidyForCapacity(prefecture, capacityKw, subsidyIncluded, activeSalePath = "fit_then_post_fit") {
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
    if (activeSalePath === "fit_then_post_fit" && program.fit_compatible === false) {
      sourceIds.push(program.source_id);
      notes.push(`${program.id}は現行FIT売電経路と両立しないため除外．`);
      continue;
    }
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

function municipalityEvaluation(publicData, prefectureCode, municipalityCode) {
  if (municipalityCode === null || municipalityCode === undefined || municipalityCode === "") {
    return { municipality: null, programs: [] };
  }
  if (typeof municipalityCode !== "string" || !/^\d{5}$/.test(municipalityCode)) {
    throw new Error("市区町村コードは先頭ゼロを保持した5桁文字列で指定してください．");
  }
  if (!municipalityCode.startsWith(prefectureCode)) {
    throw new Error("市区町村コードと都道府県コードが一致しません．");
  }
  const municipality = (publicData.municipalities ?? []).find(
    (item) => item.municipality_code === municipalityCode
  );
  if (!municipality) {
    throw new Error("指定された市区町村コードは公開自治体マスターにありません．");
  }
  const programsById = new Map(
    (publicData.municipal_subsidy_programs ?? []).map((item) => [item.id, item])
  );
  return {
    municipality,
    programs: municipality.program_ids.map((id) => programsById.get(id)).filter(Boolean)
  };
}

function candidatePrefecturePrograms(prefecture) {
  const incompatibleIds = new Set(
    (prefecture.subsidy_programs ?? [])
      .filter((item) => item.fit_compatible === false)
      .map((item) => item.id)
  );
  return (prefecture.candidate_subsidy_programs ?? [])
    .filter((item) => !incompatibleIds.has(item.id))
    .map((item) => ({
    id: item.id,
    government_level: "prefecture",
    program_name: item.program_name,
    calculation_status: "candidate_missing_conditions",
    application_status: item.application_status,
    amount_yen: null,
    amount_rule: item.amount_rule,
    official_url: item.official_url,
    reason_code: "sale_path_and_eligibility_not_determinable_from_inputs",
    required_confirmations: item.required_confirmations,
    required_sale_path: item.required_sale_path,
    non_inclusion_reason: item.non_inclusion_reason
  }));
}

function excludedPrefecturePrograms(prefecture, activeSalePath) {
  if (activeSalePath !== "fit_then_post_fit") return [];
  const candidatesById = new Map(
    (prefecture.candidate_subsidy_programs ?? []).map((item) => [item.id, item])
  );
  return (prefecture.subsidy_programs ?? [])
    .filter((item) => item.fit_compatible === false)
    .map((item) => {
      const candidate = candidatesById.get(item.id);
      return {
        id: item.id,
        government_level: "prefecture",
        program_name: item.program_name,
        calculation_status: "excluded_incompatible",
        application_status: candidate?.application_status ?? "unconfirmed",
        amount_yen: null,
        amount_rule: candidate?.amount_rule ?? item.amount_rule ?? null,
        official_url: candidate?.official_url ?? item.official_url ?? null,
        reason_code: "fit_fip_incompatible_with_active_sale_path",
        required_confirmations: [
          "FIT／FIPを使用しない売電経路を選択すること",
          "非FIT経路の売電契約と単価を確認すること",
          item.conditions
        ],
        required_sale_path: "non_fit_or_non_fip_program_path",
        source_id: item.source_id
      };
    });
}

function requiredBenefitComponentTypes(program, equipmentPackage) {
  if (equipmentPackage === "solar_only") {
    return ["solar", "solar_and_battery_independent"].includes(program.target_equipment)
      ? new Set(["solar"])
      : new Set();
  }
  return new Set({
    solar: ["solar"],
    battery: ["battery"],
    solar_and_battery_independent: ["solar", "battery"],
    solar_and_battery_required: ["package_bonus"]
  }[program.target_equipment]);
}

function resolvedProgramComponents(program, equipmentPackage) {
  const requiredTypes = requiredBenefitComponentTypes(program, equipmentPackage);
  if (requiredTypes.size === 0) return null;
  const availableTypes = new Set(program.benefit_components.map((item) => item.component_type));
  const selectedTypes = new Set(requiredTypes);
  if (equipmentPackage === "solar_plus_standard_battery"
    && program.target_equipment === "solar_and_battery_independent"
    && availableTypes.has("package_bonus")) {
    selectedTypes.add("package_bonus");
  }
  const byType = new Map(
    program.benefit_components
      .filter((item) => selectedTypes.has(item.component_type))
      .map((item) => [item.component_type, item])
  );
  if (byType.size !== selectedTypes.size) return null;
  const components = [...byType.values()];
  return components.some((item) => item.amount_rule.calculation_type === "unresolved")
    ? null
    : components;
}

function municipalityStatusForEquipment(municipality, programs, equipmentPackage) {
  if (!municipality) return "not_requested";
  if (["no_program", "unconfirmed"].includes(municipality.program_status)) {
    return municipality.program_status;
  }
  const eligibleEquipment = equipmentPackage === "solar_only"
    ? new Set(["solar", "solar_and_battery_independent"])
    : new Set(["solar", "battery", "solar_and_battery_independent", "solar_and_battery_required"]);
  return programs.some((program) => (
    program.application_status === "accepting"
    && eligibleEquipment.has(program.target_equipment)
    && resolvedProgramComponents(program, equipmentPackage) !== null
  )) ? "included" : "candidate";
}

function amountFromRule(rule, capacityKw, batteryCapacityKwh) {
  let amount = null;
  if (rule.calculation_type === "fixed") {
    amount = rule.fixed_amount_yen;
  } else if (rule.calculation_type === "per_kw") {
    amount = capacityKw * rule.amount_yen_per_kw;
    if (rule.rounding_rule === "floor_1000_yen") amount = Math.floor(amount / 1000) * 1000;
    if (rule.cap_yen !== null) amount = Math.min(amount, rule.cap_yen);
  } else if (rule.calculation_type === "per_kwh") {
    amount = batteryCapacityKwh * rule.amount_yen_per_kwh;
    if (rule.rounding_rule === "floor_1000_yen") amount = Math.floor(amount / 1000) * 1000;
    if (rule.cap_yen !== null) amount = Math.min(amount, rule.cap_yen);
  }
  return amount === null ? null : roundYen(amount);
}

function confirmedComponentPairs(program) {
  return new Set((program.component_combination_evidence ?? [])
    .filter((item) => item.source_id && item.official_url?.startsWith("https://") && item.confirmed_at)
    .map((item) => [...item.benefit_component_ids].sort().join("\u0000")));
}

function maximumCompatibleComponentSubset(program, components) {
  const confirmedPairs = confirmedComponentPairs(program);
  let best = [];
  let bestTotal = -1;
  for (let mask = 1; mask < 2 ** components.length; mask += 1) {
    const subset = components.filter((_, index) => mask & (1 << index));
    const types = new Set(subset.map(([component]) => component.component_type));
    if (types.has("package_bonus")
      && program.target_equipment !== "solar_and_battery_required"
      && !["solar", "battery", "package_bonus"].every((type) => types.has(type))) continue;
    let compatible = true;
    for (let left = 0; left < subset.length; left += 1) {
      for (let right = left + 1; right < subset.length; right += 1) {
        const key = [subset[left][0].id, subset[right][0].id].sort().join("\u0000");
        if (!confirmedPairs.has(key)) compatible = false;
      }
    }
    if (!compatible) continue;
    const total = subset.reduce((sum, [, amount]) => sum + amount, 0);
    if (total > bestTotal) {
      best = subset;
      bestTotal = total;
    }
  }
  return best;
}

function municipalProgramAmount(program, capacityKw, batteryCapacityKwh, equipmentPackage) {
  const components = resolvedProgramComponents(program, equipmentPackage);
  if (!components) return null;
  const componentAmounts = components.map((component) => [
    component,
    amountFromRule(component.amount_rule, capacityKw, batteryCapacityKwh)
  ]);
  if (componentAmounts.some(([, amount]) => amount === null)) return null;
  return maximumCompatibleComponentSubset(program, componentAmounts)
    .reduce((sum, [, amount]) => sum + amount, 0);
}

function confirmedCombinationTargets(program) {
  return new Set((program.combination_evidence ?? [])
    .filter((item) => item.source_id && item.official_url?.startsWith("https://") && item.confirmed_at)
    .map((item) => item.other_program_id));
}

function programsMutuallyCombinable(left, right) {
  return confirmedCombinationTargets(left).has(right.id)
    && confirmedCombinationTargets(right).has(left.id);
}

function maximumCompatibleSubset(options) {
  let best = [];
  let bestTotal = -1;
  for (let mask = 1; mask < 2 ** options.length; mask += 1) {
    const subset = options.filter((_, index) => mask & (1 << index));
    let compatible = true;
    for (let left = 0; left < subset.length; left += 1) {
      for (let right = left + 1; right < subset.length; right += 1) {
        if (!programsMutuallyCombinable(subset[left][0], subset[right][0])) compatible = false;
      }
    }
    if (!compatible) continue;
    const total = subset.reduce((sum, [, amount]) => sum + amount, 0);
    if (total > bestTotal) {
      best = subset;
      bestTotal = total;
    }
  }
  return best;
}

function municipalProgramEvaluation(
  program,
  calculationStatus,
  reasonCode,
  amountYen = null,
  equipmentPackage = "solar_only"
) {
  const confirmations = [
    "居住，所有，所得，納税，施工会社，申請時期および住宅区分等は，公式サイトまたは施工会社で確認する．"
  ];
  if (equipmentPackage === "solar_only"
    && ["battery", "solar_and_battery_required"].includes(program.target_equipment)) {
    confirmations.unshift("太陽光のみの入力と対象設備が一致しないため算入しない．");
  }
  if (resolvedProgramComponents(program, equipmentPackage) === null) {
    confirmations.unshift("金額算定ルールを一意に確定できないため算入しない．");
  }
  if (program.application_status !== "accepting") {
    confirmations.unshift("現在の受付状態では算入しない．");
  }
  return {
    ...program,
    government_level: "municipality",
    calculation_status: calculationStatus,
    amount_yen: amountYen,
    reason_code: reasonCode,
    required_confirmations: confirmations
  };
}

function municipalSubsidyForCapacity(
  programs,
  capacityKw,
  subsidyIncluded,
  prefectureSubsidyYen,
  prefecturePrograms,
  equipmentPackage,
  batteryCapacityKwh
) {
  const eligibleEquipment = equipmentPackage === "solar_only"
    ? new Set(["solar", "solar_and_battery_independent"])
    : new Set(["solar", "battery", "solar_and_battery_independent", "solar_and_battery_required"]);
  const candidateReason = (program) => {
    if (!eligibleEquipment.has(program.target_equipment)) return "equipment_package_not_applicable";
    const requiredTypes = requiredBenefitComponentTypes(program, equipmentPackage);
    const presentTypes = new Set(program.benefit_components.map((item) => item.component_type));
    if (![...requiredTypes].every((type) => presentTypes.has(type))) return "required_benefit_component_missing";
    return "benefit_amount_rule_unresolved";
  };
  const candidates = programs
    .filter((item) => item.application_status === "accepting"
      && (!eligibleEquipment.has(item.target_equipment)
        || resolvedProgramComponents(item, equipmentPackage) === null))
    .map((item) => municipalProgramEvaluation(
      item,
      "candidate_missing_conditions",
      candidateReason(item),
      null,
      equipmentPackage
    ));
  const excluded = programs
    .filter((item) => item.application_status !== "accepting")
    .map((item) => municipalProgramEvaluation(
      item,
      "excluded_closed",
      "application_closed_or_budget_exhausted",
      null,
      equipmentPackage
    ));
  if (!subsidyIncluded) {
    return {
      prefectureAmount: prefectureSubsidyYen || 0,
      amount: 0,
      included: [],
      candidates,
      excluded,
      prefectureSuppressed: false
    };
  }

  const calculable = programs
    .filter((program) => program.application_status === "accepting"
      && eligibleEquipment.has(program.target_equipment)
      && resolvedProgramComponents(program, equipmentPackage) !== null)
    .map((program) => [
      program,
      municipalProgramAmount(program, capacityKw, batteryCapacityKwh, equipmentPackage)
    ])
    .filter(([, amount]) => amount !== null);
  const prefectureAmount = prefectureSubsidyYen || 0;
  const applicablePrefecturePrograms = prefecturePrograms.filter(
    (program) => program.status === "verified" && program.fit_compatible !== false
  );
  const options = [...calculable];
  const prefectureOption = prefectureAmount > 0 && applicablePrefecturePrograms.length === 1
    ? [applicablePrefecturePrograms[0], prefectureAmount]
    : null;
  if (prefectureOption) options.unshift(prefectureOption);
  const selectedSubset = maximumCompatibleSubset(options);
  const selectedIds = new Set(selectedSubset.map(([program]) => program.id));
  const selectedPrefecture = prefectureOption && selectedIds.has(prefectureOption[0].id)
    ? prefectureAmount
    : 0;
  const selectedMunicipalPrograms = calculable
    .filter(([program]) => selectedIds.has(program.id))
    .map(([program]) => program);
  const amountById = new Map(calculable.map(([program, amount]) => [program.id, amount]));
  const selectedMunicipality = selectedMunicipalPrograms
    .reduce((sum, program) => sum + amountById.get(program.id), 0);
  const included = selectedMunicipalPrograms.map((program) => ({
    ...municipalProgramEvaluation(
      program,
      "included",
      "official_amount_rule_applied",
      amountById.get(program.id),
      equipmentPackage
    ),
    display_note: `${program.municipality_name}の補助制度を利用できた場合`
  }));
  const duplicateNote = "公式に確認できる併用可能集合のうち総額最大の組合せを採用";
  for (const [program, amount] of calculable) {
    if (selectedIds.has(program.id)) continue;
    const solarOnly = equipmentPackage === "solar_only";
    const evaluation = {
      ...municipalProgramEvaluation(
        program,
        solarOnly ? "excluded_duplicate" : "candidate_missing_conditions",
        solarOnly
          ? "more_advantageous_standalone_program_selected"
          : "not_in_maximum_confirmed_compatible_subset",
        amount,
        equipmentPackage
      ),
      display_note: solarOnly
        ? duplicateNote
        : "未確認の併用を除外し，公式確認済み集合の総額最大を採用"
    };
    (solarOnly ? excluded : candidates).push(evaluation);
  }
  const prefectureSuppressed = prefectureAmount > 0 && selectedPrefecture === 0;
  return {
    prefectureAmount: prefectureSubsidyYen === null && selectedMunicipalPrograms.length === 0
      ? null
      : selectedPrefecture,
    amount: selectedMunicipality,
    included,
    candidates,
    excluded,
    prefectureSuppressed
  };
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

function appliedDaytimeOccupancy(input, calculation) {
  const model = calculation.daytime_occupancy;
  if (!model || !Array.isArray(model.options) || !model.options.length) {
    throw new Error("日中在宅状況の計算データがありません．");
  }

  const value = input.daytimeOccupancy ?? model.default_option;
  const option = model.options.find((candidate) => candidate.value === value);
  if (!option) {
    throw new Error("日中在宅状況の選択値が不正です．");
  }

  return {
    input: {
      value: option.value,
      label: option.label,
      definition: option.definition,
      daytime_occupancy_rate: option.daytime_occupancy_rate,
      calculation_status: option.calculation_status
    },
    model
  };
}

export function calculateEstimate(input, publicData) {
  const prefecture = publicData.prefectures.find((item) => item.code === input.prefectureCode);
  if (!prefecture) throw new Error("指定された都道府県のデータがありません．");
  const { municipality, programs: municipalityPrograms } = municipalityEvaluation(
    publicData,
    input.prefectureCode,
    input.municipalityCode
  );

  const suppliedBill = input.monthlyElectricityBillYen;
  if (suppliedBill !== null && (typeof suppliedBill !== "number" || !Number.isFinite(suppliedBill) || suppliedBill < 0)) {
    throw new Error("月間電気料金は0以上の数値で入力してください．");
  }
  const usedDefaultBill = suppliedBill === null;
  const monthlyBill = usedDefaultBill ? prefecture.default_monthly_electricity_bill_yen : suppliedBill;
  const calculation = publicData.calculation;
  const selectedEquipmentPackage = input.equipmentPackage ?? calculation.default_equipment_package;
  if (!calculation.equipment_packages.includes(selectedEquipmentPackage)) {
    throw new Error("設備選択はsolar_onlyまたはsolar_plus_standard_batteryで指定してください．");
  }
  const batterySystem = calculation.battery_system;
  const batteryCapacityInput = calculation.battery_capacity_input;
  let batteryCapacityKwh = 0;
  let batteryCapacitySource = "not_applicable";
  let usedDefaultBatteryCapacity = false;
  if (selectedEquipmentPackage === batteryCapacityInput.applicable_equipment_package) {
    const suppliedBatteryCapacity = input.batteryCapacityKwh;
    if (suppliedBatteryCapacity === null || suppliedBatteryCapacity === undefined) {
      batteryCapacityKwh = batteryCapacityInput.default;
      batteryCapacitySource = "default";
      usedDefaultBatteryCapacity = true;
    } else {
      const stepPosition = (suppliedBatteryCapacity - batteryCapacityInput.minimum)
        / batteryCapacityInput.multiple_of;
      if (
        typeof suppliedBatteryCapacity !== "number"
        || !Number.isFinite(suppliedBatteryCapacity)
        || suppliedBatteryCapacity < batteryCapacityInput.minimum
        || suppliedBatteryCapacity > batteryCapacityInput.maximum
        || Math.abs(stepPosition - Math.round(stepPosition)) > 1e-9
      ) {
        throw new Error(
          `蓄電池容量は${batteryCapacityInput.minimum.toFixed(1)}～${batteryCapacityInput.maximum.toFixed(1)} kWhの範囲で，${batteryCapacityInput.multiple_of.toFixed(1)} kWh刻みで入力してください．`
        );
      }
      batteryCapacityKwh = suppliedBatteryCapacity;
      batteryCapacitySource = "user_input";
    }
  }
  const selectedBatterySystem = {
    ...batterySystem,
    capacity_kwh: batteryCapacityKwh
  };
  const selectedMunicipalityProgramStatus = municipalityStatusForEquipment(
    municipality,
    municipalityPrograms,
    selectedEquipmentPackage
  );
  const systemCapacity = input.systemCapacityKw ?? calculation.system_capacity_kw;
  if (typeof systemCapacity !== "number" || !Number.isFinite(systemCapacity) || systemCapacity <= 0) {
    throw new Error("設置容量は0より大きい数値で入力してください．");
  }

  const detailResult = appliedDetailConditions(input, calculation);
  const daytimeOccupancy = appliedDaytimeOccupancy(input, calculation);
  const annualConsumption = 12 * monthlyBill / prefecture.electricity_price_yen_per_kwh;
  const baselineAnnualGeneration = systemCapacity * prefecture.annual_generation_kwh_per_kw;
  const annualGeneration = baselineAnnualGeneration * detailResult.generationCorrectionFactor;
  const orientation = detailResult.conditions.find(
    (condition) => condition.input_name === "roof_orientation"
  )?.value ?? "south";
  const evaluationYears = calculation.evaluation_period_years;
  if (selectedEquipmentPackage === "solar_plus_standard_battery") {
    validateBatteryReplacementPolicy(batterySystem, evaluationYears);
  }
  let selfConsumed;
  let selfConsumptionRate;
  let selfSufficiencyRate;
  let exported;
  let purchased;
  let annualEnergyFlows;
  if (selectedEquipmentPackage === "solar_only") {
    const overlap = temporalOverlap(
      annualConsumption,
      annualGeneration,
      daytimeOccupancy.input.daytime_occupancy_rate,
      orientation,
      daytimeOccupancy.model
    );
    selfConsumed = overlap.selfConsumed;
    selfConsumptionRate = overlap.selfConsumptionRate;
    selfSufficiencyRate = overlap.selfSufficiencyRate;
    exported = annualGeneration - selfConsumed;
    purchased = annualConsumption - selfConsumed;
    annualEnergyFlows = Array.from({ length: evaluationYears }, (_, index) => ({
      year: index + 1,
      battery_service_age_year: 0,
      battery_usable_capacity_kwh: 0,
      opening_state_of_charge_before_adjustment_kwh: 0,
      opening_state_of_charge_kwh: 0,
      closing_state_of_charge_kwh: 0,
      capacity_fade_spillage_kwh: 0,
      replacement_disposal_spillage_kwh: 0,
      annual_direct_self_consumed_kwh: selfConsumed,
      annual_battery_charge_input_kwh: 0,
      annual_battery_delivered_kwh: 0,
      annual_battery_conversion_loss_kwh: 0,
      annual_economic_self_consumed_kwh: selfConsumed,
      annual_exported_kwh: exported,
      annual_purchased_kwh: purchased,
      self_consumption_rate: selfConsumptionRate,
      self_sufficiency_rate: selfSufficiencyRate
    }));
  } else {
    const { loadProfile, generationProfile } = temporalProfiles(
      annualConsumption,
      annualGeneration,
      daytimeOccupancy.input.daytime_occupancy_rate,
      orientation,
      daytimeOccupancy.model
    );
    annualEnergyFlows = batteryEnergyByYear(
      loadProfile,
      generationProfile,
      selectedBatterySystem,
      evaluationYears
    );
    const firstYearEnergy = annualEnergyFlows[0];
    selfConsumed = firstYearEnergy.annual_economic_self_consumed_kwh;
    selfConsumptionRate = firstYearEnergy.self_consumption_rate;
    selfSufficiencyRate = firstYearEnergy.self_sufficiency_rate;
    exported = firstYearEnergy.annual_exported_kwh;
    purchased = firstYearEnergy.annual_purchased_kwh;
  }
  const solarInstallationCost = systemCapacity * calculation.installation_cost_yen_per_kw;
  const batteryInstallationCost = selectedEquipmentPackage === "solar_plus_standard_battery"
    ? roundYen(batteryCapacityKwh * batterySystem.installed_cost_yen_per_kwh)
    : 0;
  const grossInstallationCost = solarInstallationCost + batteryInstallationCost;

  const scenarios = publicData.scenarios.map((scenario) => {
    const prefectureSubsidy = subsidyForCapacity(
      prefecture,
      systemCapacity,
      scenario.subsidy_included,
      calculation.active_sale_path
    );
    const municipalSubsidy = municipalSubsidyForCapacity(
      municipalityPrograms,
      systemCapacity,
      scenario.subsidy_included,
      prefectureSubsidy.amount,
      prefecture.subsidy_programs ?? [],
      selectedEquipmentPackage,
      batteryCapacityKwh
    );
    const originalPrefectureSubsidy = prefectureSubsidy.amount;
    const selectedPrefectureSubsidy = municipalSubsidy.prefectureAmount;
    const totalSubsidy = selectedPrefectureSubsidy === null
      ? null
      : selectedPrefectureSubsidy + municipalSubsidy.amount;
    const sourceIds = municipalSubsidy.prefectureSuppressed ? [] : prefectureSubsidy.sourceIds;
    let subsidyStatus = prefectureSubsidy.status;
    let subsidyNote = prefectureSubsidy.note;
    if (totalSubsidy !== null && totalSubsidy > 0) {
      subsidyStatus = "applied";
      if (municipalSubsidy.included.length > 0) {
        const municipalNote = municipalSubsidy.included
          .map((item) => `${item.program_name}（${item.municipality_name}の補助制度）を利用できた場合，${item.amount_yen}円を適用．`)
          .join(" ");
        subsidyNote = `${subsidyNote} ${municipalNote}`.trim();
      }
    }
    const netInitialOutlay = totalSubsidy === null ? null : grossInstallationCost - totalSubsidy;
    let cumulativeCashFlow = netInitialOutlay === null ? null : -netInitialOutlay;
    let paybackYear = null;
    const yearlyElectricitySavings = [];
    const yearlySalesIncome = [];
    let totalMaintenanceCost = 0;
    let totalReplacementCost = 0;
    const totalBatteryReplacementCost = 0;
    const yearlyCumulativeCashFlows = [];
    const annualCashFlows = [];

    for (let year = 1; year <= evaluationYears; year += 1) {
      const yearEnergy = annualEnergyFlows[year - 1];
      const purchasePrice = prefecture.electricity_price_yen_per_kwh
        * (1 + scenario.electricity_price_growth_rate) ** (year - 1);
      const electricitySavings = yearEnergy.annual_economic_self_consumed_kwh * purchasePrice;
      const salesIncome = yearEnergy.annual_exported_kwh * salePriceForYear(year, calculation);
      yearlyElectricitySavings.push(electricitySavings);
      yearlySalesIncome.push(salesIncome);
      let maintenanceCost = 0;
      let replacementCost = 0;
      for (const event of calculation.lifecycle_cost_events ?? []) {
        if (!event.event_years.includes(year)) continue;
        if (event.cost_type === "maintenance") maintenanceCost += event.cost_yen;
        if (event.cost_type === "replacement") replacementCost += event.cost_yen;
      }
      const batteryReplacementCost = 0;
      const netCashFlow = electricitySavings + salesIncome - maintenanceCost - replacementCost;
      if (cumulativeCashFlow !== null) {
        cumulativeCashFlow += netCashFlow;
        yearlyCumulativeCashFlows.push(cumulativeCashFlow);
      }
      totalMaintenanceCost += maintenanceCost;
      totalReplacementCost += replacementCost;
      annualCashFlows.push({
        year,
        purchase_price_yen_per_kwh: roundTo(purchasePrice, 6),
        sale_price_yen_per_kwh: salePriceForYear(year, calculation),
        electricity_savings_yen: roundYen(electricitySavings),
        sales_income_yen: roundYen(salesIncome),
        maintenance_cost_yen: maintenanceCost,
        replacement_cost_yen: replacementCost,
        battery_replacement_cost_yen: batteryReplacementCost,
        maintenance_and_replacement_cost_yen: maintenanceCost + replacementCost,
        net_cash_flow_yen: roundYen(netCashFlow),
        cumulative_cash_flow_yen: cumulativeCashFlow === null ? null : roundYen(cumulativeCashFlow)
      });
    }

    const durablePaybackIndex = yearlyCumulativeCashFlows.findIndex((value, index) => (
      value >= 0
      && yearlyCumulativeCashFlows.slice(index).every((laterValue) => laterValue >= 0)
    ));
    paybackYear = durablePaybackIndex < 0 ? null : durablePaybackIndex + 1;

    const totalElectricitySavings = yearlyElectricitySavings.reduce((sum, value) => sum + value, 0);
    const totalSalesIncome = yearlySalesIncome.reduce((sum, value) => sum + value, 0);
    const totalRevenue = totalElectricitySavings + totalSalesIncome;
    const profit = netInitialOutlay === null
      ? null
      : totalRevenue - netInitialOutlay - totalMaintenanceCost - totalReplacementCost;
    return {
      scenario: scenario.scenario,
      subsidy_yen: totalSubsidy,
      subsidy_status: subsidyStatus,
      subsidy_source_ids: sourceIds,
      subsidy_calculation_note: subsidyNote,
      subsidy_breakdown: {
        prefecture_amount_yen: selectedPrefectureSubsidy,
        municipality_amount_yen: municipalSubsidy.amount,
        total_amount_yen: totalSubsidy,
        municipality_program_status: selectedMunicipalityProgramStatus,
        included_programs: [
          ...(selectedPrefectureSubsidy !== null && selectedPrefectureSubsidy > 0
            ? (prefecture.subsidy_programs ?? [])
              .filter((program) => program.status === "verified")
              .filter((program) => !(
                calculation.active_sale_path === "fit_then_post_fit"
                && program.fit_compatible === false
              ))
              .map((program) => ({
                id: program.id,
                government_level: program.government_level,
                program_name: program.program_name,
                calculation_status: "included",
                application_status: "accepting",
                amount_yen: selectedPrefectureSubsidy,
                official_url: program.official_url ?? null,
                reason_code: "verified_prefectural_program_applied",
                required_confirmations: []
              }))
            : []),
          ...municipalSubsidy.included
        ],
        candidate_programs: [
          ...candidatePrefecturePrograms(prefecture),
          ...municipalSubsidy.candidates
        ],
        excluded_programs: [
          ...excludedPrefecturePrograms(prefecture, calculation.active_sale_path),
          ...municipalSubsidy.excluded,
          ...(municipalSubsidy.prefectureSuppressed
            ? (prefecture.subsidy_programs ?? [])
              .filter((program) => program.status === "verified")
              .map((program) => ({
                id: program.id,
                government_level: program.government_level,
                program_name: program.program_name,
                calculation_status: "excluded_duplicate",
                application_status: "accepting",
                amount_yen: originalPrefectureSubsidy,
                official_url: program.official_url ?? null,
                reason_code: "more_advantageous_municipal_standalone_program_selected",
                required_confirmations: ["都道府県制度とは自動併用せず，より有利な市区町村制度を単独採用"],
                display_note: "都道府県制度とは自動併用せず，より有利な市区町村制度を単独採用"
              }))
            : [])
        ]
      },
      gross_installation_cost_yen: roundYen(grossInstallationCost),
      solar_installation_cost_yen: roundYen(solarInstallationCost),
      battery_installation_cost_yen: batteryInstallationCost,
      net_initial_outlay_yen: netInitialOutlay === null ? null : roundYen(netInitialOutlay),
      initial_cost_yen: netInitialOutlay === null ? null : roundYen(netInitialOutlay),
      first_year_electricity_savings_yen: annualCashFlows[0].electricity_savings_yen,
      first_year_sales_income_yen: annualCashFlows[0].sales_income_yen,
      first_year_economic_benefit_yen: roundYen(yearlyElectricitySavings[0] + yearlySalesIncome[0]),
      total_electricity_savings_yen: roundYen(totalElectricitySavings),
      total_sales_income_yen: roundYen(totalSalesIncome),
      total_revenue_yen: roundYen(totalRevenue),
      total_maintenance_cost_yen: totalMaintenanceCost,
      total_replacement_cost_yen: totalReplacementCost,
      total_battery_replacement_cost_yen: totalBatteryReplacementCost,
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
      municipality_code: municipality?.municipality_code ?? null,
      municipality_name: municipality?.municipality_name ?? null,
      municipality_program_status: selectedMunicipalityProgramStatus,
      system_capacity_kw: systemCapacity,
      equipment_package: selectedEquipmentPackage,
      battery_capacity_kwh: batteryCapacityKwh,
      battery_capacity_source: batteryCapacitySource,
      used_default_battery_capacity: usedDefaultBatteryCapacity,
      monthly_electricity_bill_yen: roundYen(monthlyBill),
      used_default_monthly_electricity_bill: usedDefaultBill,
      detail_conditions: detailResult.conditions,
      daytime_occupancy: daytimeOccupancy.input
    },
    energy: {
      annual_consumption_kwh: roundYen(annualConsumption),
      baseline_annual_generation_kwh: roundYen(baselineAnnualGeneration),
      generation_correction_factor: Math.round(detailResult.generationCorrectionFactor * 1e6) / 1e6,
      annual_generation_kwh: roundYen(annualGeneration),
      self_consumption_model_id: daytimeOccupancy.model.model_id,
      annual_consumption_estimation_method_id: daytimeOccupancy.model.annual_consumption_estimation.method_id,
      temporal_overlap_bin_count: daytimeOccupancy.model.time_bin_definition.count,
      self_consumption_rate: roundTo(selfConsumptionRate, 7),
      self_sufficiency_rate: roundTo(selfSufficiencyRate, 7),
      annual_self_consumed_kwh: roundYen(selfConsumed),
      annual_direct_self_consumed_kwh: roundYen(annualEnergyFlows[0].annual_direct_self_consumed_kwh),
      annual_battery_charge_input_kwh: roundYen(annualEnergyFlows[0].annual_battery_charge_input_kwh),
      annual_battery_delivered_kwh: roundYen(annualEnergyFlows[0].annual_battery_delivered_kwh),
      annual_battery_conversion_loss_kwh: roundYen(annualEnergyFlows[0].annual_battery_conversion_loss_kwh),
      battery_usable_capacity_kwh: roundTo(annualEnergyFlows[0].battery_usable_capacity_kwh, 6),
      annual_exported_kwh: roundYen(exported),
      annual_purchased_kwh: roundYen(purchased),
      battery_model_notes: selectedEquipmentPackage === "solar_plus_standard_battery"
        ? [
          "充放電kW上限を設定しないため，実機より蓄電池便益を上方評価する可能性がある．",
          "15年目末60％の容量保持は実測平均や期待値ではなく，保証下限に整合する保守的感度パスです．各年は当該年末容量で計算します．",
          "16～20年の容量は，20年間交換しないシナリオで年率係数を継続した数学的外挿です．一次資料の実測値・保証値ではなく，保証条件のサイクル数を耐用年数へ換算していません．",
          "蓄電池は20年間交換せず，容量劣化を継続する想定です．故障修理・交換費は含まず，20年間の動作を保証するものではありません．"
        ]
        : [],
      annual_energy_flows: annualEnergyFlows.map((item) => Object.fromEntries(
        Object.entries(item).map(([key, value]) => [
          key,
          Number.isInteger(value) ? value : roundTo(value, 6)
        ])
      ))
    },
    prices: {
      current_purchase_price_yen_per_kwh: prefecture.electricity_price_yen_per_kwh,
      sale_price_periods: calculation.sale_price_periods ?? []
    },
    valuation: {
      basis: calculation.valuation_basis,
      label: calculation.valuation_label,
      discount_rate_applied: calculation.discount_rate_applied,
      lifecycle_cost_escalation_rate: calculation.lifecycle_cost_escalation_rate,
      active_sale_path: calculation.active_sale_path
    },
    excluded_cost_and_performance_items: calculation.excluded_cost_and_performance_items ?? [],
    scenarios
  };
}
