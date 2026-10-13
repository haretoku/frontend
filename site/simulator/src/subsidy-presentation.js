const unconfirmedReason = "はれトク側で適用可能か確認できていないため，今回の概算に含めていません．";

export function nonInclusionReason(item, downside = false) {
  if (!downside && item.reason_code === 'source_model_reference_unavailable') {
    if (item.id === 'national-mirai-eco-renovation-2026-battery') return 'この制度は住宅改修全体で補助額を計算します．この診断では改修工事の内容・数量や既交付額を扱っていないため，今回の試算には含めていません．';
    if (item.held_common_branches?.length && item.held_common_branches.every(branch => branch.reason === 'outside_existing_investment_scope'))
      return '住宅全体の補助額を，太陽光・蓄電池の投資費用へ切り分ける算定には対応していないため，含めていません．住宅本体額や未接続の額を0円として確定したものではありません．';
    return '原算式と，この診断で用いる数量・費用との対応が揃っていないため，補助額を確定せず含めていません．';
  }
  if(item.reason_code==='eligible_cost_not_above_grant')return '制度で定める税込・税抜の区分で計算した対象費用が，補助額を上回る必要があります．今回は同額以下のため，含めていません．';
  if (!downside && item.reason_code==='dependent_program_unavailable' && item.unavailable_required_program_ids?.length) return '前提となる関連補助制度が今回の組合せで正額採用されていないため，上乗せ補助は含めていません．関連制度の受付終了を意味するものではありません．';
  const diagnosticReasons = {
    eligible_cost_tax_basis_unconfirmed: '対象費用の税込・税抜の扱いを確認できず，今回の費用では補助額が変わるため，金額を確定していません．',
    equipment_unit_cost_tax_basis_unconfirmed: '蓄電池本体の単価上限が税込・税抜のどちらかを確認できず，今回の単価では対象か判断できないため，金額を確定していません．',
    equipment_unit_cost_above_limit: '蓄電池本体の単価が，税込・税抜のいずれで見ても制度の上限を超えるため，含めていません．',
    combined_equipment_purchase_cost_unconfirmed: '太陽光と蓄電池の本体購入費が制度の最低額を満たすか，今回の費用情報だけでは確認できないため，金額を確定していません．',
    eligible_cost_below_minimum: '今回の入力から算定した対象費用が制度の最低額に届かないため，含めていません．',
    non_fit_required: '非FIT・非FIPが必須のため，この診断のFIT売電を前提とする計算には含めていません．',
    equipment_excluded: '今回の設備は制度の対象外のため，含めていません．',
    outside_diagnostic_scope: '制度が求める住宅全体・工事などの条件が，この診断で扱う範囲と異なるため，含めていません．',
    business_only: '事業者向けの制度であり，住宅向けのこの診断には含めていません．',
    not_direct_grant: '個人への直接補助ではないため，この診断には含めていません．',
    current_year_recruitment_and_amount_basis_not_found: '現年度の募集案内と算定根拠を限定探索で確認できず，今回の調査を終了したため算入していません．制度不存在や受付終了を意味しません．',
    application_closed_or_fit_incompatible: '非FITを要する制度のため，この診断のFIT売電を前提とする計算には含めていません．',
    other_subsidy_deduction_rule_unconfirmed: '他の補助金を対象経費から控除する方法を確定できないため，この設備構成での補助額は未確定です．',
    housing_performance_or_energy_contract_input_unavailable: '制度が求める住宅性能や電力契約の条件を現在の入力から確認できないため，この制度の補助額は未確定です．',
    combination_policy_unresolved: '他制度と組み合わせる際の算入方針が未確定のため，この制度の試算額は未確定，今回の算入額は0円です．',
    audit_non_adoption_reason: '制度が対象とする設備・導入条件が，この診断の対象と一致しないため，含めていません．',
    expense_scope_exhausted_by_maximum_combination: '最大組合せの他制度で同じ費目の上限に達するため，今回の算入額は0円です．',
    legacy_battery_subsidy_leaves_insufficient_expense_scope: '他制度の算入後は蓄電池の対象費用枠が足りず，制度の固定額を算入できません．',
    housing_age_not_applicable: '今回の住宅区分は制度の対象区分と異なるため，含めていません．',
    equipment_not_applicable: '今回の設備の設置工事は制度の対象外のため，含めていません．',
    equipment_package_not_applicable: '今回選択している設備とは異なる設備の制度です．',
    municipality_not_applicable: '今回の市町村は制度の対象地域ではないため，含めていません．',
    capacity_not_applicable: '今回の容量は制度の対象容量範囲と異なるため，含めていません．',
    existing_pv_battery_addition_not_supported: '既設又は先行契約済み太陽光への蓄電池追加経路のため，新規設備を同時に評価するこの診断には含めていません．',
    regional_eligibility_input_unavailable: '県内の対象地域に該当するかを現在の入力から確認できないため，金額を確定していません．',
    sale_path_not_applicable: '非FIT・非FIPが必須のため，この診断のFIT売電を前提とする計算には含めていません．',
    application_closed: '受付が終了しているため，含めていません．',
    application_suspended: '受付が停止しているため，含めていません．',
    application_status_unconfirmed: '受付状況を確認できていません．',
    calculated_zero_amount: '今回の対象費用に算定式を適用した結果，補助額が0円となるため，加算していません．',
    required_housing_acquisition: '住宅の取得に付随する設備加算であり，太陽光・蓄電池の設置だけでは利用できないため，この診断には含めていません．',
    required_external_work: '住宅全体の工事・性能条件が必要なため，この診断の対象外です．',
    required_external_equipment: '別の設備の導入が必要なため，この診断の対象外です．',
    fit_fip_incompatible_with_active_sale_path: '非FIT・非FIPが必須のため，この診断のFIT売電を前提とする計算には含めていません．',
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
  if (['eligible_cost_below_minimum', 'non_fit_required', 'equipment_excluded', 'equipment_not_applicable', 'municipality_not_applicable', 'housing_age_not_applicable', 'equipment_package_not_applicable', 'capacity_not_applicable', 'existing_pv_battery_addition_not_supported', 'sale_path_not_applicable', 'required_external_equipment', 'required_housing_acquisition', 'fit_fip_incompatible_with_active_sale_path', 'required_external_structure_or_housing_work'].includes(item.reason_code)) return diagnosticReasons[item.reason_code];
  if ((item.required_confirmations ?? []).some(text => text.includes('入力と対象設備が一致しない'))) return diagnosticReasons.equipment_package_not_applicable;
  if (downside) return "下振れシナリオは，補助金を利用できない場合として計算しています．";
  if (item.reason_code === 'investigation_closed_insufficient_information') return diagnosticReasons.investigation_closed_insufficient_information;
  if (item.reason_code === 'current_year_recruitment_and_amount_basis_not_found') return diagnosticReasons.current_year_recruitment_and_amount_basis_not_found;
  if (item.reason_code === 'capacity_below_minimum') return "今回の容量が制度の最低容量を下回るため，含めていません．";
  if (item.application_status === 'closed' || ['not_adopted_closed', 'excluded_closed'].includes(item.calculation_status)) return "受付が終了しているため，含めていません．";
  if (item.application_status === 'suspended' || item.calculation_status === 'not_adopted_suspended') return "受付が停止しているため，含めていません．";
  if (['business_only', 'not_direct_grant', 'required_external_work'].includes(item.reason_code)) return diagnosticReasons[item.reason_code];
  if (item.reason_code === 'regional_eligibility_input_unavailable') return diagnosticReasons[item.reason_code];
  if (['unknown', 'unconfirmed'].includes(item.application_status)) return '受付状況を確認できていません．';
  if (diagnosticReasons[item.reason_code]) return diagnosticReasons[item.reason_code];
  if (item.calculation_status === 'not_adopted_model_outside') return "この診断の計算で扱う範囲に対応していないため，含めていません．";
  if (item.calculation_status === 'excluded_incompatible') return "制度の対象条件がこの診断の条件と一致しないため，含めていません．";
  if (item.calculation_status === 'excluded_duplicate' || item.reason_code === 'not_in_maximum_confirmed_compatible_subset') return "確認できた併用条件に基づき，今回の組合せには含めていません．";
  if (['not_adopted_missing_conditions', 'not_adopted_unknown', 'candidate_missing_conditions', 'candidate_unresolved_amount'].includes(item.calculation_status)) return unconfirmedReason;
  return item.reason || "含めていない具体的な理由は確認できていません．";
}

// Merge presentation only when both the authority and official destination agree.
// Keep every calculation record so equipment-specific amounts and reasons survive.
export function groupSubsidyDisplayRows(rows) {
  const groups = new Map();
  for (const row of rows) {
    const key = row.program_name && row.official_url
      ? JSON.stringify([row.government_level, row.program_name, row.official_url, row.included])
      : row;
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push(row);
  }
  return [...groups.values()];
}

export function subsidyGroups(result, scenario) {
  const breakdown = scenario.subsidy_breakdown ?? {};
  const included = (breakdown.included_programs ?? []).map(program => ({ ...program, included: true, guidance: [] }));
  const includedIds = new Set(included.map(program => program.id));
  const others = [...(breakdown.candidate_programs ?? []), ...(breakdown.excluded_programs ?? [])];
  if (scenario.scenario === 'downside') others.push(...result.scenarios.flatMap(other => other.subsidy_breakdown?.included_programs ?? []));
  const excluded = [...new Map(others.filter(program => !includedIds.has(program.id)).map(program => [program.id, program])).values()]
    .map(program => ({ ...program, included: false, guidance: [], reason: nonInclusionReason(program, scenario.scenario === 'downside') }));
  const references = [];
  return { included, excluded, references };
}

export function replacementEvents(scenario) {
  return (scenario.annual_cash_flows ?? []).filter(row => row.replacement_cost_yen > 0)
    .map(row => ({ year: row.year, value: row.cumulative_cash_flow_yen }));
}

export function subsidyGovernmentLabel(level) {
 return {national:'国：',prefecture:'都道府県：'}[level] ?? '';
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
   {label:'利用想定 合計',amount:breakdown.total_amount_yen});
 return rows;
}

export function noncashBenefitDescription(row) {
 if (row.included === false) {
  const description = noncashBenefitDescription({...row, included:true});
  return description ? description.replaceAll('経済便益に含めています', '参考試算しています') + ' 今回の試算には算入していません．' : '';
 }
 const assumptions=(row.calculation_assumptions??[]).filter(text=>/非現金便益|商品券.*相当/.test(text));
 return assumptions.length ? assumptions.map(readableSubsidyAssumption).join(' ') : (row.required_confirmations??[]).flatMap(text=>text.split('．')).filter(text=>text.includes('非現金ポイント')).map(text=>readableSubsidyAssumption(text+'．')).join(' ');
}

export function readableSubsidyAssumption(text) {
  const common = {
    '納税，施工者，製品認定，接続，保証，所定の申請・設置期限等の入力外条件を満たすと仮定する．': '納税・施工者・設備・申請期限などの条件を満たす想定です．',
    '終了明示のない現行募集について受付継続を仮定する．公式予算残とは区別する．': '受付が継続している想定です．予算残を確認済みではありません．',
    '容量上の出力は診断入力を対応させるモデル仮定．費用の税区分は公式指定を優先し，指定不明だけ税込仮定．': '入力容量を制度の対象容量とみなしています．費用は公式の税区分に従い，不明の場合は税込と仮定しています．',
    '公式所有要件の明記不足は空欄を維持し，本人所有・本人居住の戸建という承認済みモデル前提を適用する．': '本人所有・本人居住の戸建てを想定しています．公式の所有要件を確認済みという意味ではありません．'
  };
  if (common[text]) return common[text];
  return text.replace(/^2026年9月21日ユーザー承認の全国共通ルール：/, '').replaceAll('税区分明示不足には承認済み税込対応．併用禁止未確認は併用可と仮定するが，公式併用可へ書き換えない．', '税区分が確認できない場合は税込費用で試算しています．併用禁止が確認されていない制度は併用できると仮定していますが，公式に確認された併用可否ではありません．').replaceAll('（優先順位をレビュー）', '').replaceAll('（統括先行根拠検収でも確認）', '').replaceAll('明示税抜の湯梨浜を除き，税区分の明記不足には承認済み税込対応を適用．', '税抜と明記された制度を除き，税区分が確認できない場合は税込費用で試算しています．').replaceAll('非現金ポイントは公式の円相当額を経済便益として扱う承認済み方針を適用し，現金給付とは表示しない．', 'ポイントの公式円相当額を経済便益に含めています．現金の給付ではありません．').replace(/^2026年9月20日ユーザー承認：/, '').replace(/(?:独立確認①|管理レビュー)PASS済み算式だけを構造化し，入力外条件を満たすモデル前提で算定する．/g, '入力で確認していない適格条件を満たす想定です．').replaceAll('承認済みモデル仮定', '試算上の仮定').replaceAll('C_PV', '太陽光の税抜対象費').replace('同時導入加算1万ダラーは', '非現金の同時導入加算1万ダラーは').replaceAll('入力蓄電池容量を制度対象容量へ対応させるユーザー承認済み仮定', '入力した蓄電池容量を制度の対象容量とみなす仮定');
}

export function conciseShimaneAssumption(row) {
 if (!row.included || !row.id?.startsWith('shimane-')) return '';
 return (row.id === 'shimane-32202-solar_battery-2026' ? '39歳以下などの条件を満たす想定です．' : '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
}

export function conciseHiroshimaAssumption(row) {
 if (!row.included || !row.id?.startsWith('hiroshima-')) return '';
 const specific = {
  'hiroshima-34204-battery-2026': '他の補助金は0円として試算しています．他の補助金を受ける場合は計算方法が変わります．',
  'hiroshima-34302-main-2026': '住宅・設備・申請などの条件を満たす想定です．補助額の端数処理は未確認です．',
  'hiroshima-34462-battery-2026': '町内業者による設置などの条件を満たす想定です．対象容量の定格・実効の区別と端数処理は未確認で，入力容量を用いて試算しています．'
 };
 return (specific[row.id] || '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
}

export function conciseYamaguchiAssumption(row) {
 if (!row.included || !row.id?.startsWith('yamaguchi-')) return '';
 const notes = {
  'yamaguchi-35201-leading_battery-2026': '新築にも適用できると仮定しています．公式資料に新築が個別に明記されたものではありません．指定地区内への設置と再エネ電力調達の条件を満たす想定で，所在地や電力契約を確認済みという意味ではありません．',
  'yamaguchi-35202-health_reform-2026': '蓄電池設置が類似の省エネ改修に該当すると仮定しています．自治体の認定済みという意味ではありません．住宅を新たに取得せず，既存の本人居住住宅への蓄電池工事に一般枠を適用する想定です．税抜対象費の5分の1・上限15万円を千円未満切捨てで計算します．太陽光は対象外です．',
  'yamaguchi-35202-renewable-2026': '市内業者による施工などの条件を満たす想定です．新築は注文住宅を想定し，建売住宅は原則対象外です．併設時の表示額は設備全体への給付額です．',
  'yamaguchi-35206-ecolife-2026': '市内業者による既存住宅の改修を，同一見積りで申請する想定です．併設時の表示額は対象工事全体の商品券額です．',
  'yamaguchi-35216-reform-2026': '市内業者による既存住宅の工事を想定しています．補助額は1万円未満を切り捨てます．併設時の表示額は対象工事全体への給付額です．'
 };
 return (notes[row.id] || '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
}

export function housingScopeAssumption(row) {
 if (!row.included || !(row.calculation_assumptions ?? []).some(text => text.includes('住宅区分指定がないため，新築・既存住宅の両方を対象と仮定'))) return '';
 return '確認した資料に住宅区分の指定がないため，新築・既存の両方を対象と仮定しています．公式に両区分の適用が明記されたものではありません．';
}
