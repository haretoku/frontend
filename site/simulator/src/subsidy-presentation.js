const unconfirmedReason = "はれトク側で適用可能か確認できていないため，今回の概算に含めていません．";

export function nonInclusionReason(item, downside = false) {
  if (!downside && item.reason_code==='dependent_program_unavailable' && item.unavailable_required_program_ids?.length) return '前提となる関連補助制度が今回の組合せで正額採用されていないため，上乗せ補助は含めていません．関連制度の受付終了を意味するものではありません．';
  if(item.id==='itami-tamimaru-solar-club-2026' && item.reason_code==='economic_benefit_conversion_policy_unresolved') return '現物特典を診断の経済便益に含める方針が未確定のため，試算額は未確定，今回の算入額は0円です．現金の給付を意味しません．';
  if(item.id==='toyooka-decarbonization-leading-area-2026' && item.reason_code==='regional_eligibility_input_unavailable') return '指定された町丁目に該当するかを現在の入力から確認できないため，この制度の試算額は未確定，今回の算入額は0円です．';
  const diagnosticReasons = {
    current_year_recruitment_and_amount_basis_not_found: '現年度の募集案内と算定根拠を限定探索で確認できず，今回の調査を終了したため算入していません．制度不存在や受付終了を意味しません．',
    application_closed_or_fit_incompatible: '非FITを要する制度のため，この診断のFIT売電を前提とする計算には含めていません．',
    other_subsidy_deduction_rule_unconfirmed: '他の補助金を対象経費から控除する方法を確定できないため，この設備構成での補助額は未確定です．',
    housing_performance_or_energy_contract_input_unavailable: '制度が求める住宅性能や電力契約の条件を現在の入力から確認できないため，この制度の補助額は未確定です．',
    combination_policy_unresolved: '他制度と組み合わせる際の算入方針が未確定のため，この制度の試算額は未確定，今回の算入額は0円です．',
    audit_non_adoption_reason: '制度が対象とする設備・導入条件が，この診断の対象と一致しないため，含めていません．',
    expense_scope_exhausted_by_maximum_combination: '最大組合せの他制度で同じ費目の上限に達するため，今回の算入額は0円です．',
    legacy_battery_subsidy_leaves_insufficient_expense_scope: '他制度の算入後は蓄電池の対象費用枠が足りず，制度の固定額を算入できません．',
    housing_age_not_applicable: '今回の住宅区分は制度の対象区分と異なるため，含めていません．',
    equipment_package_not_applicable: '今回選択している設備とは異なる設備の制度です．',
    municipality_not_applicable: '今回の市町村は制度の対象地域ではないため，含めていません．',
    capacity_not_applicable: '今回の容量は制度の対象容量範囲と異なるため，含めていません．',
    existing_pv_battery_addition_not_supported: '既設又は先行契約済み太陽光への蓄電池追加経路のため，新規設備を同時に評価するこの診断には含めていません．',
    regional_eligibility_input_unavailable: '県内の対象地域に該当するかを現在の入力から確認できないため，金額を確定していません．',
    sale_path_not_applicable: '非FIT・非FIPが必須のため，この診断のFIT売電を前提とする計算には含めていません．',
    application_closed: '受付が終了しているため，含めていません．',
    application_suspended: '受付が停止しているため，含めていません．',
    application_status_unconfirmed: '受付状況を確認できていません．',
    application_not_started: '受付開始前のため，含めていません．',
    application_scheduled: '受付開始前のため，含めていません．',
    calculated_zero_amount: '今回の対象費用に算定式を適用した結果，補助額が0円となるため，加算していません．',
    required_external_structure_or_housing_work: '別の構造物・住宅工事が必要なため，この診断の対象外です．',
    explicit_combination_prohibition: '利用を想定する制度と併用できないため，含めていません．',
    expense_scope_limit_in_maximum_combination: '他制度と合わせた対象費用の上限により，含めていません．',
    battery_expense_scope_insufficient_after_selected_subsidies: '他制度の算入後に残る蓄電池の対象費用が不足しています．',
    combination_status_unconfirmed: '他制度との併用可否を確認できていません．',
    economic_benefit_conversion_policy_unresolved: '地域ポイントを診断の経済便益に含める方針が未確定のため，試算額は未確定，今回の算入額は0円です．現金への換金を意味しません．',
    dependent_program_unavailable: '必要となる国の関連制度の公募が終了し，新規の交付決定を得られないため，今回の概算に含めていません．',
    business_model_or_external_structure_not_supported: 'PPA・リース又はカーポート等を前提とする制度であり，本人所有の住宅用設備を扱うこの診断の対象外です．',
    capacity_definition_input_unavailable: '制度が求める蓄電池の初期実効容量を入力の定格容量から確認できないため，補助額を確定していません．',
    calculation_detail_unconfirmed: '算定に必要な制度詳細を確認できていません．',
    investigation_closed_insufficient_information: '公式資料を確認した範囲では算定に必要な情報が揃わず，今回の調査を終了したため，概算に含めていません．制度不存在や受付終了を意味しません．',
    required_benefit_component_missing: '対象設備の補助内訳を確認できていません．',
    benefit_amount_rule_unresolved: '補助額の算定方法を確認できていません．',
    not_in_maximum_permitted_combination: '今回の計算条件で，許容する組合せの総額が最大となる別の組合せを採用したため，含めていません．',
    downside_scenario_excludes_subsidies: '下振れシナリオは，補助金を利用できない場合として計算しています．'
  };
  if (['municipality_not_applicable', 'housing_age_not_applicable', 'equipment_package_not_applicable', 'capacity_not_applicable', 'existing_pv_battery_addition_not_supported', 'sale_path_not_applicable', 'required_external_structure_or_housing_work'].includes(item.reason_code)) return diagnosticReasons[item.reason_code];
  if ((item.required_confirmations ?? []).some(text => text.includes('入力と対象設備が一致しない'))) return diagnosticReasons.equipment_package_not_applicable;
  if (downside) return "下振れシナリオは，補助金を利用できない場合として計算しています．";
  if (item.reason_code === 'investigation_closed_insufficient_information') return diagnosticReasons.investigation_closed_insufficient_information;
  if (item.reason_code === 'current_year_recruitment_and_amount_basis_not_found') return diagnosticReasons.current_year_recruitment_and_amount_basis_not_found;
  if (item.reason_code === 'capacity_below_minimum') return "今回の容量が制度の最低容量を下回るため，含めていません．";
  if (item.application_status === 'scheduled') return diagnosticReasons.application_not_started;
  if (item.application_status === 'closed' || ['not_adopted_closed', 'excluded_closed'].includes(item.calculation_status)) return "受付が終了しているため，含めていません．";
  if (item.application_status === 'suspended' || item.calculation_status === 'not_adopted_suspended') return "受付が停止しているため，含めていません．";
  if (['unknown', 'unconfirmed'].includes(item.application_status)) return '受付状況を確認できていません．';
  if (diagnosticReasons[item.reason_code]) return diagnosticReasons[item.reason_code];
  if (item.calculation_status === 'not_adopted_model_outside') return "この診断の計算で扱う範囲に対応していないため，含めていません．";
  if (item.calculation_status === 'excluded_incompatible') return "この診断のFIT売電を前提とする計算と両立しないため，含めていません．";
  if (item.calculation_status === 'excluded_duplicate' || item.reason_code === 'not_in_maximum_confirmed_compatible_subset') return "確認できた併用条件に基づき，今回の組合せには含めていません．";
  if (['not_adopted_missing_conditions', 'not_adopted_unknown', 'candidate_missing_conditions', 'candidate_unresolved_amount'].includes(item.calculation_status)) return unconfirmedReason;
  return item.reason || "含めていない具体的な理由は確認できていません．";
}

export function subsidyGroups(result, scenario, municipality) {
  const breakdown = scenario.subsidy_breakdown ?? {};
  const included = (breakdown.included_programs ?? []).map(program => ({ ...program, included: true, guidance: [] }));
  const includedIds = new Set(included.map(program => program.id));
  const others = [...(breakdown.candidate_programs ?? []), ...(breakdown.excluded_programs ?? [])];
  if (scenario.scenario === 'downside') others.push(...result.scenarios.flatMap(other => other.subsidy_breakdown?.included_programs ?? []));
  const excluded = [...new Map(others.filter(program => !includedIds.has(program.id)).map(program => [program.id, program])).values()]
    .map(program => ({ ...program, included: false, guidance: [], reason: nonInclusionReason(program, scenario.scenario === 'downside') }));
  const records = [...included, ...excluded];
  const references = [];
  const relatedEquipment = equipment => result.input.equipment_package !== 'solar_only'
    || !['battery', 'solar_battery', 'solar_plus_battery', 'solar_and_battery_required', 'package_bonus'].includes(equipment);
  for (const [index, component] of (municipality?.candidate_summary?.amount_components ?? []).entries()) {
    // Only a unique official-URL + typed benefit component correspondence can attach guidance.
    const matches = records.filter(program => program.government_level === 'municipality'
      && (program.benefit_components?.some(benefit => benefit.official_url === component.official_url && benefit.component_type === component.equipment)
        || (!program.benefit_components?.length && program.amount_rule && program.official_url === component.official_url && program.target_equipment === component.equipment)));
    if (matches.length === 1 && component.calculation_status === 'included' && relatedEquipment(component.equipment)) {
      matches[0].guidance.push(component);
    } else {
      const row = { ...component, id: `guidance-${index}`, target_equipment: component.equipment,
        program_name: component.scope || '自治体の制度案内', guidance: [component], included: false,
        reason: component.calculation_status === 'included'
          ? 'この案内は今回の算入・未算入を断定するものではありません．利用想定額は「利用を想定する制度」で確認できます．'
          : nonInclusionReason(component) };
      (component.calculation_status === 'included' ? references : excluded).push(row);
    }
  }
  return { included, excluded, references };
}

export function replacementEvents(scenario) {
  return (scenario.annual_cash_flows ?? []).filter(row => row.replacement_cost_yen > 0)
    .map(row => ({ year: row.year, value: row.cumulative_cash_flow_yen }));
}

export function subsidyGovernmentLabel(level) {
 return {national:'国：',prefecture:'都道府県：',municipality:'市区町村：'}[level] ?? '';
}
export function subsidyResearchMessage(status, exploration = null) {
 if (exploration?.collection_complete === false || /探索(?:は)?未完了|探索を終了しない/.test(exploration?.summary ?? '')) return '市区町村の制度調査は未完了です．現年度の制度・受付状況の確認が完了していないため，市区町村分は今回の概算に含めていません．制度不存在や受付終了を意味するものではありません．';
 if(status==='not_requested') return '市区町村は未選択のため，市区町村の制度は反映していません．';
 if(status==='searched_not_found') return '市区町村の制度は，調査した範囲では見つかっていません．制度が存在しないと確定したものではありません．国・都道府県の制度は別に確認してください．';
 if(status==='unconfirmed') return '市区町村の制度情報は確認できていません．未調査・未反映は，補助金がないことを意味しません．';
 return '';
}
export function prefectureResearchMessage(status) {
 if(status==='current_scope_unconfirmed') return '都道府県の制度情報は未確認です．制度がないことを意味しません．';
 if(status==='legacy_included_pending_current_scope_review') return '都道府県は確認済みの一部制度を反映しています．制度情報の確認は未完了です．';
 return '';
}
export function subsidyLevelAmounts(breakdown) {
 if(!breakdown) return [];
 const rows=[];
 if(Object.hasOwn(breakdown,'national_amount_yen')) rows.push({label:'国',amount:breakdown.national_amount_yen});
 rows.push({label:'都道府県',amount:breakdown.prefecture_amount_yen,
   statusText:breakdown.prefecture_program_status==='current_scope_unconfirmed' ? '未確認・未反映' : null},
   {label:'市区町村',amount:breakdown.municipality_amount_yen,
   statusText:breakdown.municipality_program_status==='not_requested' ? '未選択・未反映' : null},
   {label:'利用想定 合計',amount:breakdown.total_amount_yen});
 return rows;
}

export function noncashBenefitDescription(row) {
 const assumptions=(row.calculation_assumptions??[]).filter(text=>/非現金便益|商品券.*相当/.test(text));
 return assumptions.length ? assumptions.join(' ') : (row.required_confirmations??[]).flatMap(text=>text.split('．')).filter(text=>text.includes('非現金ポイント')).map(text=>text+'．').join(' ');
}
