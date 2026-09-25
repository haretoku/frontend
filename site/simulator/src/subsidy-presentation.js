const unconfirmedReason = "はれトク側で適用可能か確認できていないため，今回の概算に含めていません．";

export function nonInclusionReason(item, downside = false) {
  if (item.id === 'kagawa-37364-battery_capacity_unconfirmed-2026' && item.reason_code === 'capacity_not_applicable') return 'この診断では蓄電池の容量条件を10kWh未満と解釈しています．接続する太陽光も10kW未満が必要で，今回の容量は条件を満たさないため，蓄電池分を含めていません．蓄電池のkW表記をkWhと読む仮定であり，公式原文の訂正ではありません．';
  if (item.id === 'kagawa-37403-reform_equipment_unconfirmed-2026' && item.reason_code === 'equipment_unconfirmed') return '2026年度の募集はありますが，リンク先要綱に旧年度の失効規定が残り，年度の整合性と太陽光・蓄電池だけの工事への適用を確認できないため，含めていません．';

  if (item.id === 'tokushima-36402-nonfit_pair-2026' && item.reason_code === 'nonfit_required') return '非FIT・非FIPが必須の太陽光と，それに付帯する蓄電池の制度です．この診断のFIT売電を前提とする計算には含めていません．';
  if (item.id === 'yamaguchi-35202-health_reform_pv_excluded-2026' && item.reason_code === 'equipment_excluded') return 'このリフォーム助成では太陽光発電設備が明示的に対象外のため，太陽光分は含めていません．';
  if (item.id === 'hiroshima-34213-carport-2026' && item.reason_code === 'required_external_work') return 'ソーラーカーポートという別の構造物が必要なため，この診断の対象外です．';
  if (item.id === 'hiroshima-34215-external_work-2026' && item.reason_code === 'required_external_work') return '別の省エネ設備・工事の導入が必要なため，この診断の対象外です．';
  if (item.id === 'okayama-33461-unresolved-2026' && item.reason_code === 'official_evidence_unresolved') return '補助対象となる費用の範囲を確認できないため，補助額は未確定です．今回の概算には含めていません．';
  if (item.reason_code === 'housing_age_not_applicable' && /^tottori-(?:31302|31325|31328|31364|31401)-/.test(item.id ?? '')) return '新築住宅への適用条件を確認できていないため，今回の概算には含めていません．制度が新築住宅を対象外としていると確定したものではありません．';
  if (item.id === 'aichi-23202-local_renewable_battery-2026' && item.amount_yen == null) return unconfirmedReason;
  if (!downside && item.reason_code==='dependent_program_unavailable' && item.unavailable_required_program_ids?.length) return '前提となる関連補助制度が今回の組合せで正額採用されていないため，上乗せ補助は含めていません．関連制度の受付終了を意味するものではありません．';
  if(item.id==='itami-tamimaru-solar-club-2026' && item.reason_code==='economic_benefit_conversion_policy_unresolved') return '現物特典を診断の経済便益に含める方針が未確定のため，試算額は未確定，今回の算入額は0円です．現金の給付を意味しません．';
  if(item.id==='toyooka-decarbonization-leading-area-2026' && item.reason_code==='regional_eligibility_input_unavailable') return '指定された町丁目に該当するかを現在の入力から確認できないため，この制度の試算額は未確定，今回の算入額は0円です．';
  const diagnosticReasons = {
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
    application_not_started: '受付開始前のため，含めていません．',
    application_scheduled: '受付開始前のため，含めていません．',
    calculated_zero_amount: '今回の対象費用に算定式を適用した結果，補助額が0円となるため，加算していません．',
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
  if (['eligible_cost_below_minimum', 'non_fit_required', 'equipment_excluded', 'equipment_not_applicable', 'municipality_not_applicable', 'housing_age_not_applicable', 'equipment_package_not_applicable', 'capacity_not_applicable', 'existing_pv_battery_addition_not_supported', 'sale_path_not_applicable', 'required_external_equipment', 'fit_fip_incompatible_with_active_sale_path', 'required_external_structure_or_housing_work'].includes(item.reason_code)) return diagnosticReasons[item.reason_code];
  if ((item.required_confirmations ?? []).some(text => text.includes('入力と対象設備が一致しない'))) return diagnosticReasons.equipment_package_not_applicable;
  if (downside) return "下振れシナリオは，補助金を利用できない場合として計算しています．";
  if (item.reason_code === 'investigation_closed_insufficient_information') return diagnosticReasons.investigation_closed_insufficient_information;
  if (item.reason_code === 'current_year_recruitment_and_amount_basis_not_found') return diagnosticReasons.current_year_recruitment_and_amount_basis_not_found;
  if (item.reason_code === 'capacity_below_minimum') return "今回の容量が制度の最低容量を下回るため，含めていません．";
  if (item.application_status === 'scheduled') return diagnosticReasons.application_not_started;
  if (item.application_status === 'closed' || ['not_adopted_closed', 'excluded_closed'].includes(item.calculation_status)) return "受付が終了しているため，含めていません．";
  if (item.application_status === 'suspended' || item.calculation_status === 'not_adopted_suspended') return "受付が停止しているため，含めていません．";
  if (['business_only', 'not_direct_grant', 'required_external_work'].includes(item.reason_code)) return diagnosticReasons[item.reason_code];
  if (['unknown', 'unconfirmed'].includes(item.application_status)) return '受付状況を確認できていません．';
  if (diagnosticReasons[item.reason_code]) return diagnosticReasons[item.reason_code];
  if (item.calculation_status === 'not_adopted_model_outside') return "この診断の計算で扱う範囲に対応していないため，含めていません．";
  if (item.calculation_status === 'excluded_incompatible') return "制度の対象条件がこの診断の条件と一致しないため，含めていません．";
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
 if (['yamaguchi-35206-ecolife-2026', 'kagawa-37206-solar_battery-2026'].includes(row.id)) return '商品券による給付です．額面の100％を使えると仮定して経済便益に含めています．現金の給付ではありません．';
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

export function designatedContractAssumption(row) {
 if (row.id !== 'aichi-23202-local_renewable_battery-2026' || !row.included || !(row.amount_yen > 0)) return '';
 return '指定の買電・売電契約を満たすと仮定しています．売電単価と設置費は標準モデルのままで，契約による実際の単価差・費用差は反映していません．契約とFIT単価の両立を公式確認したものではありません．';
}

export function conciseShimaneAssumption(row) {
 if (!row.included || !row.id?.startsWith('shimane-')) return '';
 return (row.id === 'shimane-32202-solar_battery-2026' ? '39歳以下などの条件を満たす想定です．' : '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
}

export function conciseOkayamaAssumption(row) {
 if (!row.included || !row.id?.startsWith('okayama-')) return '';
 const specific = {
  'okayama-33202-main-2026': '新築の太陽光は，平成30年7月豪雨で被災した太陽光設置住宅を市内で建て替える条件を満たす想定です．一般の新築住宅は対象外です．',
  'okayama-33209-akiya-2026': '空き家バンク登録住宅の購入・市内業者による工事・対象児童3人の条件を満たす想定です．',
  'okayama-33210-main-2026': '市内業者による設置などの条件を満たす想定です．',
  'okayama-33346-main-2026': '蓄電池だけを補助申請する想定です（上限12万円）．太陽光の本体価格が不明のため，太陽光分と同時申請の総額は未算定です．',
  'okayama-33207-main-2026': '設備を併設する場合の合算と端数処理の順序は未確認です．住宅・設備・申請条件を満たす想定で概算しています．',
  'okayama-33214-main-2026': '他の補助金は0円として試算しています．併設時の合算と端数処理の順序は未確認です．住宅・設備・申請条件を満たす想定です．'
 };
 return (specific[row.id] || '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
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
  'yamaguchi-35202-health_reform-2026': '蓄電池設置が類似の省エネ改修に該当すると仮定しています．自治体の認定済みという意味ではありません．居住誘導区域内の空き家を2026年4月1日以降に購入し，2027年2月26日までに改修・転居を完了する想定です．太陽光は対象外です．',
  'yamaguchi-35202-renewable-2026': '市内業者による施工などの条件を満たす想定です．新築は注文住宅を想定し，建売住宅は原則対象外です．併設時の表示額は設備全体への給付額です．',
  'yamaguchi-35206-ecolife-2026': '市内業者による既存住宅の改修を，同一見積りで申請する想定です．併設時の表示額は対象工事全体の商品券額です．',
  'yamaguchi-35216-reform-2026': '市内業者による既存住宅の工事を想定しています．補助額は1万円未満を切り捨てます．併設時の表示額は対象工事全体への給付額です．'
 };
 return (notes[row.id] || '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
}

export function conciseTokushimaAssumption(row) {
 if (!row.included || !/^tokushima-\d{5}-/.test(row.id ?? '')) return '';
 const notes = {
  'tokushima-36202-renewable-2026': '住宅・設備・申請条件を満たす想定です．併設時の給付総額には，同時申請加算5万円を含みます．',
  'tokushima-36207-migrant_solar-2026': '市外に5年以上居住し，転入前または転入後1年未満で，空き家バンク登録住宅に本人が居住するなどの条件を満たす想定です．本人の条件を確認済みではありません．同じ太陽光費用の補助は一方を選択し，費用を分割する併用計算は未対応です．別の蓄電池費用への補助まで禁止するものではありません．',
  'tokushima-36302-solar-2026': '住宅・設備・申請条件と，町の生活支援の累計上限に余裕があることを仮定しています．',
  'tokushima-36388-solar-2026': '住宅・設備・申請条件を満たす想定です．太陽光とパワコンの出力に同じ入力値を用い，所定の四捨五入後に10kW未満となる条件で試算しています．'
 };
 return (notes[row.id] || '住宅・設備・申請などの条件を満たす想定です．') + '適用条件と補助額は，自治体へ確認してください．';
}

export function housingScopeAssumption(row) {
 if (!row.included || !(row.calculation_assumptions ?? []).some(text => text.includes('住宅区分指定がないため，新築・既存住宅の両方を対象と仮定'))) return '';
 return '確認した資料に住宅区分の指定がないため，新築・既存の両方を対象と仮定しています．公式に両区分の適用が明記されたものではありません．';
}

export function conciseKagawaAssumption(row) {
 if (!row.included || !/^kagawa-\d{5}-/.test(row.id ?? '')) return '';
 const notes = {
  'kagawa-37202-solar-2026': '太陽光の上限は新築8万円・既存10万円です．',
  'kagawa-37202-battery-2026': '蓄電池は太陽光と別に上限8万円で試算しています．',
  'kagawa-37204-solar_battery-2026': '接続する太陽光も10kW未満が条件です．蓄電池の工事費を除く税抜機器費で算定し，合算後に千円未満を切り捨てます．',
  'kagawa-37207-solar_battery-2026': '設備別に算定した額を合算後，千円未満を切り捨てます．',
  'kagawa-37364-solar-2026': 'この欄は太陽光分の給付額です．最終端数処理の明記がないため円単位で概算しています．',
  'kagawa-37364-battery_capacity_unconfirmed-2026': '公式原文の蓄電容量上限は10kW未満です．蓄電池のkW表記を診断上kWhと読む仮定により，10kWh未満として試算しています．公式原文の訂正ではなく，太陽光のkWには適用しません．接続する太陽光も10kW未満が条件です．',
  'kagawa-37208-solar_battery-2026': 'キャンセル待ちの受付中で，待機が成立する想定で算入しています．予算の復活・交付は確約されていません．蓄電池は税抜対象費から他の補助金を控除して試算しています．',
  'kagawa-37403-solar_battery-2026': 'キャンセル待ちの受付中で，待機が成立する想定で算入しています．予算の復活・交付は確約されていません．蓄電池は工事費を除く機器費で，税区分の指定がないため税込と仮定しています．',
  'kagawa-37406-solar_battery-2026': '蓄電池の工事費を除く税抜機器費で試算しています．'
 };
 const housing=(row.calculation_assumptions ?? []).some(t=>t.includes('住宅区分の指定がないため')) ? '資料に住宅区分の指定がないため，新築・既存の両方を対象と仮定しています．公式に両区分の適用が明記されたものではありません．' : '';
 return housing+(notes[row.id] || '')+'住宅・設備・申請などの条件を満たす想定です．適用条件と補助額は，自治体へ確認してください．';
}

export function conciseEhimeAssumption(row) {
 if (!row.included || !/^ehime-\d{5}-/.test(row.id ?? '')) return '';
 let note = '';
 if (/^ehime-(?:38207|38213|38442|38506)-migration_battery-/.test(row.id)) {
  note = '県外移住・空き家バンク購入・本人居住・子育てなどの条件を同時に満たす想定です．本人の適格性を確認済みではありません．既存住宅の蓄電池工事費だけを算定し，住宅取得費・他工事費は含めません．';
  if (!row.id.includes('38442')) note += '子ども3人以上の条件を満たす想定です．';
  note += row.id.includes('38506') ? '通常設備補助側で他補助を控除して併用を試算しています．' : '対象工事費50万円以上が条件です．同じ蓄電池費の補助は一方を選択し，費用の部分配賦は未対応です．';
 } else {
  note = ({
   'ehime-38442-energy-2026':'税込導入費から他の補助金と20万円を一度だけ引き，残額の20％を上限20万円・千円未満切捨てで試算しています．',
   'ehime-38506-energy-2026':'蓄電池は工事費を除く機器購入費から他の補助金を控除して試算しています．税区分の指定がないため税込と仮定しています．',
   'ehime-38401-energy-2026':'機器購入費で試算しています．設置工事費の対象性は未確認です．',
   'ehime-38213-energy-2026':'蓄電池の本体・附属品・設置工事・消費税を対象費に含めます．最終端数処理は未確認のため円単位で概算しています．',
   'ehime-38488-energy-2026':'他補助の控除対象は国の補助金です．'
  })[row.id] || '';
  note += '住宅・設備・申請などの条件を満たす想定です．';
 }
 if ((row.calculation_assumptions ?? []).some(t=>t.includes('住宅区分の指定がないため'))) note += '資料に住宅区分の指定がないため，新築・既存の両方を対象と仮定しています．公式に両区分が明記されたものではありません．';
 return note+'適用条件と補助額は，自治体へ確認してください．';
}

export function conciseKochiAssumption(row) {
 if (!row.included || !/^kochi-\d{5}-/.test(row.id ?? '')) return '';
 const assumptions=row.calculation_assumptions ?? [];
 const notes=[];
 if(assumptions.some(t=>t.includes('住宅区分の指定がないため')))notes.push('資料に住宅区分の指定がないため，新築・既存の両方を対象と仮定しています．公式に両区分が明記されたものではありません．');
 notes.push('住宅・設備・申請条件を満たし，受付が継続している想定です．予算残を確認済みではありません．');
 if(row.id==='kochi-39304-energy-2026')notes.push('太陽光・蓄電池の容量は小数第3位未満を切り捨てて試算しています．');
 if(['kochi-39302-energy-2026','kochi-39303-energy-2026','kochi-39305-energy-2026','kochi-39401-energy-2026','kochi-39411-energy-2026','kochi-39412-energy-2026'].includes(row.id))notes.push('設備別の算定額を合算後，千円未満を切り捨てます．');
 if(['kochi-39341-energy-2026','kochi-39424-energy-2026'].includes(row.id))notes.push('他の補助金は0円として試算しています．');
 if(row.id==='kochi-39210-energy-2026')notes.push('太陽光と蓄電池の税抜対象費用を上限として試算しています．');
 if(assumptions.some(t=>t.includes('税区分の公式指定がない対象費')))notes.push('税区分の指定がない対象費は税込と仮定しています．');
 if(assumptions.some(t=>t.includes('最終金額端数未明記')))notes.push('最終端数処理は未確認のため円単位で概算しています．');
 notes.push(...(row.required_confirmations??[]).filter(t=>!t.startsWith('対象となる新品設備')));
 return notes.join('')+'適用条件と補助額は，自治体へ確認してください．';
}

export function conciseFukuokaAssumption(row) {
 if(!row.included || !/^fukuoka-\d{5}-/.test(row.id??''))return '';
 const notes=['住宅・設備・申請条件を満たし，受付が継続している想定です．予算残を確認済みではありません．'];
 if((row.calculation_assumptions??[]).some(t=>t.includes('新築・既存の指定がないため')))notes.push('資料に新築・既存の指定がないため両方を対象と仮定しています．公式に両区分が明記されたものではありません．');
 if(row.id.includes('used_housing_equipment'))notes.push('中古住宅の取得・定住などの条件を満たす想定で，本人の適格性を確認済みではありません．設備固有の加算だけを計上し，住宅取得の基本補助額は含めません．');
 if(row.id==='fukuoka-40447-energy-2026')notes.push('申請様式は原則窓口配布です．未掲載の細則は町へ確認してください．');
 if(row.id==='fukuoka-40646-energy-2026')notes.push('本人所有・本人居住を想定しています．公式に本人所有だけを対象とする制度ではありません．');
 notes.push(...(row.required_confirmations??[]).filter(t=>!t.startsWith('認定製品，施工者')));
 return notes.join('')+'適用条件と補助額は，自治体へ確認してください．';
}
