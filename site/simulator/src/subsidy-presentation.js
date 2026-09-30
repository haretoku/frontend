const unconfirmedReason = "はれトク側で適用可能か確認できていないため，今回の概算に含めていません．";

export function nonInclusionReason(item, downside = false) {
  if(item.id==='hokkaido-sapporo-general-solar'&&item.reason_code==='equipment_package_not_applicable')return '太陽光には対象の蓄電池，又はV2Hを備えた電気自動車との接続が必要です．この診断では既設機器の所有を仮定せず，太陽光と蓄電池を同時に設置する場合に計算します．';
  if(item.id?.startsWith('hokkaido-ebetsu-')&&item.reason_code==='application_closed')return '予算に達したため，受付は終了しています．当初予定の締切前でも申請できるとは限りません．';
  if(item.reason_code==='eligible_cost_not_above_grant')return '制度で定める税込・税抜の区分で計算した対象費用が，補助額を上回る必要があります．今回は同額以下のため，含めていません．';
  if(item.id==='fukushima-tenei-solar'&&item.reason_code==='implementation_pending')return '補助額の計算方法は確認していますが，現在の収録データでは診断への反映が完了していないため，今回の補助額は未確定です．受付終了や制度がないという意味ではありません．';
  if(['fukushima-kagamiishi-closed-solar','fukushima-kagamiishi-closed-battery'].includes(item.id)&&item.reason_code==='application_closed')return 'この制度は2022年3月31日で終了しています．残っている旧資料を現行の制度として計算していません．別の新制度がないと確認した意味ではありません．';

  if(item.id==='fukushima-yabuki-solar'&&item.reason_code==='application_closed')return '2026年4月8日の公式案内で，2026年度は実施しないと公表されています．今後の実施は未定であり，制度廃止や再開決定を意味しません．';
  if(['fukushima-naraha-solar-r7','fukushima-naraha-battery-r7'].includes(item.id)&&item.reason_code==='application_closed')return '2025年度の受付は2025年12月31日で終了しています．2026年度の実施・募集は未確認であり，制度がなくなったという意味ではありません．';
  if(item.id==='fukushima-tanagura-solar-r2-closed'&&item.reason_code==='application_closed')return 'この旧制度は2020年度で終了しています．2026年度の別制度の有無は未確認であり，町の補助制度がすべてなくなったという意味ではありません．';
  if(item.id==='fukushima-okuma-zeh'&&item.reason_code==='housing_work_required')return 'ZEH戸建て住宅の新築が必須の制度です．太陽光・蓄電池だけを導入するこの診断には含めていません．受付終了や金額の確認待ちを理由にしたものではありません．';

  if(item.reason_code==='fit_incompatible'&&['fukushima-hirono-solar-nonfit','fukushima-hirono-battery','fukushima-tomioka-battery','fukushima-okuma-solar-nonfit','fukushima-namie-model-solar-nonfit','fukushima-namie-model-battery-nonfit','fukushima-aizuwakamatsu-leading-solar','fukushima-aizuwakamatsu-zero','fukushima-kitakata-roof-solar','fukushima-kitakata-roof-battery','fukushima-nihonmatsu-battery','fukushima-minamisoma-roof-solar','fukushima-minamisoma-carport','fukushima-minamisoma-roof-battery','fukushima-motomiya-battery','fukushima-otama-battery'].includes(item.id))return '非FIT・卒FIT等の売電条件があり，新たにFIT売電を始めるこの診断は対象外のため，含めていません．受付終了や適格性の確認待ちを理由にしたものではありません．';
  const fukushimaPendingReasons={
"fukushima-aizuwakamatsu-leading-battery":"蓄電容量の上限・入力容量の対応，FIT接続時の全体条件と費用の制約を確認できていません",
"fukushima-minamisoma-battery":"制度の公称最大蓄電容量と診断の入力容量の対応を確認できていません",
"fukushima-date-battery":"制度の公称最大蓄電容量と診断入力の対応，FIT接続の可否と費用等の条件を確認できていません",
"fukushima-koori-battery":"制度の蓄電容量が定格容量と初期実効容量のどちらを指すか確認できていません",
"fukushima-kawamata-battery":"制度の公称最大蓄電容量と診断の入力容量の対応を確認できていません",
"fukushima-otama-solar":"制度の規定は確認していますが，2026年度の受付・募集を確認できていません",
"fukushima-minamiaizu-solar":"蓄電池又はV2Hとの同時設置が必要です．受付開始日の資料間の違いと，金額の端数処理等を確認できていません",
"fukushima-minamiaizu-battery":"蓄電容量の定格・実効の区分，金額の端数処理等を確認できていません",
"fukushima-tadami-solar":"容量の定義・丸め方，同時設置条件と申請順序等の詳細を確認できていません",
"fukushima-tadami-battery":"容量の定義・丸め方，同時設置条件と申請順序等の詳細を確認できていません",
"fukushima-hinoemata-solar":"制度名は確認していますが，現年度の受付と詳細条件を確認できていません",
"fukushima-kunimi-old-solar":"確認できた公式資料は2014年度のもので，2026年度の募集・実施を確認できていません",
"fukushima-ono-solar":"公式資料の間で容量の丸め方と対象容量の条件が異なり，適用関係を確認できていません",
"fukushima-ono-battery":"公式資料の間で容量の丸め方が異なり，蓄電容量の定格・実効の区分も確認できていません",
"fukushima-yamatsuri-solar":"対象費用の範囲と金額の端数処理，対象者・設備の詳細条件を確認できていません",
"fukushima-yamatsuri-battery":"対象費用の範囲と金額の端数処理，対象者・設備の詳細条件を確認できていません",
"fukushima-shinchi-solar":"容量の端数処理を確認できていません．本制度では蓄電池は対象外ですが，町のすべての蓄電池補助がないと確認した意味ではありません",
  "fukushima-yanaizu-solar": "容量の基準・端数処理と対象費用の詳細を確認できていません",
  "fukushima-mishima-solar": "金額の端数処理と対象経費上限を適用する順序，過去の受給額の控除を確認できていません",
  "fukushima-aizumisato-solar": "蓄電池又はV2Hとの併設が必要です．金額の端数処理と対象費用の詳細を確認できていません",
  "fukushima-aizumisato-battery": "制度の蓄電容量と入力容量の対応，金額の端数処理と対象費用の詳細を確認できていません",
  "fukushima-kawauchi-solar": "制度の容量・対象費用の条件を診断の入力へ対応させる確認が完了していません",
  "fukushima-kawauchi-battery": "制度が用いる公称最大蓄電容量と，診断で入力する定格容量の対応を確認できていません",
  "fukushima-hirono-solar-fit": "モジュールとパワーコンディショナーの容量基準，及び共用パワーコンディショナーの対象費用の扱いを確認できていません",
  "fukushima-futaba-solar": "自家消費条件と電力需給契約の関係，FIT余剰売電の可否を確認できていません",
  "fukushima-futaba-battery": "制度が用いる公称最大蓄電容量と，診断で入力する定格容量の対応を確認できていません",
  "fukushima-namie-solar": "制度の容量基準と診断入力の対応，及び県補助との併用条件を確認できていません",
  "fukushima-namie-battery": "制度の蓄電容量と入力容量の対応，共用パワーコンディショナーの費用配分，及び関連する太陽光補助との条件を確認できていません",
  "fukushima-okuma-battery": "太陽光の非FIT条件が蓄電池へ適用される範囲と，補助対象費用の詳細を確認できていません"
};
  if(item.reason_code==='calculation_detail_unconfirmed'&&fukushimaPendingReasons[item.id])return fukushimaPendingReasons[item.id]+'．そのため，今回の補助額は未確定です．制度がない，又は受付が終了したという意味ではありません．';

  if(item.id==='fukushima-nishiaizu-battery'&&item.reason_code==='fit_incompatible')return '卒FIT・非FIT，又はFIT買取期間の満了前6か月以内で満了通知を受け取っていること等が条件です．新たにFIT売電を始めるこの診断は対象外のため，蓄電池分を含めていません．受付終了や適格性の確認待ちを理由にしたものではありません．';
  if(['fukushima-ishikawa-solar','fukushima-ishikawa-battery'].includes(item.id)&&item.reason_code==='application_closed')return '2026年6月3日に予算上限へ達して受付が終了したため，含めていません．当初の受付期限内でも申請できるという意味ではありません．';
  if(item.id==='fukushima-hirata-solar'&&item.reason_code==='calculation_detail_unconfirmed')return '公式資料に容量の四捨五入と切捨ての両方が記載され，適用順序を確認できていないため，今回の補助額は未確定です．受付終了や制度不存在を意味しません．';
  if(['fukushima-asakawa-solar','fukushima-asakawa-battery'].includes(item.id)&&item.reason_code==='calculation_detail_unconfirmed')return '制度の案内は確認していますが，要綱による対象設備の詳細を確認できていないため，今回の補助額は未確定です．蓄電池は容量の定義も未確認です．受付終了や制度不存在を意味しません．';
  if(item.id==='fukushima-tamakawa-battery'&&item.reason_code==='calculation_detail_unconfirmed')return '制度の蓄電容量と，診断で入力する定格容量の対応を確認できていないため，蓄電池分の補助額は未確定です．単位表記の読み替えだけで容量の対応を確定したとは扱いません．';
  if(item.id==='fukushima-furudono-battery'&&item.reason_code==='calculation_detail_unconfirmed')return '制度が用いる公称最大蓄電容量と，診断で入力する定格容量の対応を確認できていないため，蓄電池分の補助額は未確定です．受付終了や制度不存在を意味しません．';
  if(['fukushima-fukushima-battery','fukushima-aizuwakamatsu-battery','fukushima-iwaki-battery','fukushima-sukagawa-battery'].includes(item.id)&&item.reason_code==='calculation_detail_unconfirmed')return '制度の蓄電容量が定格容量と初期実効容量のどちらを指すか確認できていないため，診断の入力容量から蓄電池分の補助額を確定していません．制度がない，又は受付が終了したという意味ではありません．';
  if(item.id==='fukushima-iwaki-reform'&&item.reason_code==='official_conditions_not_applicable')return 'バリアフリー・窓断熱など，別の住宅工事が必須の制度です．太陽光・蓄電池だけを設置するこの診断には含めていません．';
  if(item.id==='fukushima-soma-solar'&&item.reason_code==='calculation_detail_unconfirmed')return '補助対象から除くオプション・売電メーター等の費用を，診断の工事費から分けて計算できるか未確認のため，今回の補助額は未確定です．制度がない，又は受付が終了したという意味ではありません．';
  if(item.id==='fukushima-aizuwakamatsu-solar'&&item.reason_code==='equipment_package_not_applicable')return '太陽光単独では申請できず，蓄電池又はV2Hとの同時設置が必要です．この診断では太陽光と蓄電池を選んだ場合に太陽光分を試算します．';
  if(item.id==='yamagata-shirataka-battery-fit'&&item.reason_code==='calculation_detail_unconfirmed')return '制度が用いる蓄電池の初期実効容量と，診断で入力する定格容量の対応を確認できていないため，蓄電池分の金額を確定していません．制度がない，又は受付が終了したという意味ではありません．';
  if(item.id==='yamagata-shirataka-battery-existing'&&item.reason_code==='official_conditions_not_applicable')return '既設の太陽光に蓄電池を追加する制度のため，太陽光を新たに設置するこの診断には含めていません．';
  if(item.id==='yamagata-shirataka-battery-nonfit'&&item.reason_code==='official_conditions_not_applicable')return '非FITの売電方式が条件のため，FIT売電を前提とするこの診断には含めていません．';
  if(item.id==='yamagata-yuza-energy'&&item.reason_code==='calculation_detail_unconfirmed')return '公式資料の間で同時設置の加算額に相違があり，太陽光単独の対象可否も確認できていないため，今回の補助額は未確定です．';

  if(['yamagata-nagai-nonfit','yamagata-mogami-nonfit','yamagata-iide-solar','yamagata-shonai-zero'].includes(item.id)&&item.reason_code==='official_conditions_not_applicable')return '非FIT・非FIPを要する制度のため，FIT売電を前提とするこの診断には含めていません．';
  if(['yamagata-yonezawa-ppa','yamagata-sakata-ppa'].includes(item.id)&&item.reason_code==='official_conditions_not_applicable')return '事業者が設備を所有するPPA方式の支援です．本人が設備を購入するこの診断には含めていません．';
  if(['yamagata-kaminoyama-reform','yamagata-ohkura-reform','yamagata-kaneyama-reform','yamagata-sakegawa-reform','yamagata-oe-reform','yamagata-nishikawa-reform','yamagata-oguni-reform'].includes(item.id)&&item.reason_code==='calculation_detail_unconfirmed')return '太陽光・蓄電池が補助対象になるかを確認できていないため，今回の補助額は未確定です．対象外と確認した意味ではありません．';

  if(item.id==='miyagi-kakuda-smart-eco-battery-unresolved' && item.reason_code==='calculation_detail_unconfirmed')return '蓄電池の補助対象費用が購入費だけか，設置工事費も含むかを確認できていないため，蓄電池分の金額を確定していません．太陽光分とは分けて扱います．';
  if(item.id==='miyagi-yamamoto-natural-energy' && item.reason_code==='calculation_detail_unconfirmed')return '他の補助金を控除する費目や順序などを確認できていないため，今回の補助額を確定していません．2026年10月1日の受付開始予定を理由に除外したものではありません．';
  if(item.id==='miyagi-sendai-certified-new-house' && item.reason_code==='official_conditions_not_applicable')return '認証された住宅の新築が必要な補助です．太陽光・蓄電池だけを導入する診断の範囲には含めていません．';
  if(item.id==='iwate-morioka-solar-2026' && item.reason_code==='housing_age_not_applicable')return '新築住宅分は受付が終了しているため，含めていません．受付中の既存住宅分とは区別しています．';
  if(item.reason_code==='current_year_and_external_work_unconfirmed')return '現年度の受付と，太陽光設備だけの工事に適用できるかを確認できていないため，含めていません．公式に対象外と確認した意味ではありません．';
  if(item.reason_code==='whole_house_certified_construction_required')return '認定された二戸型住宅の新築・改修が必要な住宅事業全体の補助です．太陽光・蓄電池だけの費用として切り分けられないため，この診断には含めていません．';
  if (item.id === 'misawa-reform-decarbonization-2026' && item.reason_code === 'calculation_detail_unconfirmed') return '設備工事は制度の対象ですが，他の補助金を引いた後の合算費用・共有上限などの計算に，この診断がまだ対応していないため，含めていません．制度がない，又は対象外と確認した意味ではありません．';
  if (item.id === 'fukaura-young-reform-pv-2026' && item.reason_code === 'calculation_detail_unconfirmed') return '他の補助金を控除した後の限度額の解釈と端数処理を確認できていないため，この追加分を含めていません．移住・子育て等の属性条件だけを理由に除外したものではありません．';
  if (item.id === 'okinawa-city-pv-2026' && item.reason_code === 'official_conditions_not_applicable') return '受付期間は2026年9月15日～11月13日ですが，対象は2025年9月1日～2026年8月31日に受給を開始した設備です．未設置での申請はできず，これから設置する診断の条件に合わないため，含めていません．受付終了や制度不存在を意味しません．';
  if (item.id === 'miyazaki-nobeoka-leading-pending-2026' && item.application_status === 'unknown') return '2026年4月10日の市の案内では，令和8年度の事業実施は未定です．前年度の受付状態や補助額を引き継がず，今回の概算には含めていません．';
  if (item.id === 'miyazaki-mimata-battery-2026' && item.application_status === 'suspended') return '2026年9月18日の指定事務局の案内では，蓄電池分は予算上限に達し，追加予算を調整中です．受付停止として今回の概算には含めていません．再開が決まったことを意味しません．';
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
  if(item.id==='mashiki-energy-battery-2026' && item.reason_code==='calculation_detail_unconfirmed') return '太陽光と蓄電池を同時に新設する場合に，蓄電池分だけを申請できるか確認できていないため，補助額を確定していません．';
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
 if (row.included === false) {
  const description = noncashBenefitDescription({...row, included:true});
  return description ? description.replaceAll('経済便益に含めています', '参考試算しています') + ' 今回の試算には算入していません．' : '';
 }
 if (row.id==='hokkaido-next-hamanaka-solar') return 'ルパン三世Pay又はピリカ金券による給付です．現金の給付ではありません．期限内に交換して全額利用できると仮定し，公式額面の円相当額を経済便益に含めています．';
 if (['amakusa-pv-2026','amakusa-battery-2026'].includes(row.id)) return '地域通貨「天草のさりー」による給付です．現金ではありません．交付月から5か月後の月末までに全額使う想定で，額面の100％を経済便益に含めています．';
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
  'yamaguchi-35202-health_reform-2026': '蓄電池設置が類似の省エネ改修に該当すると仮定しています．自治体の認定済みという意味ではありません．住宅を新たに取得せず，既存の本人居住住宅への蓄電池工事に一般枠を適用する想定です．税抜対象費の5分の1・上限15万円を千円未満切捨てで計算します．太陽光は対象外です．',
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
  note = '県外移住・空き家バンク経由の適格な取得を既に満たす本人所有・本人居住住宅で，子育てなどの条件も満たす想定です．新たな住宅購入・賃借や設備以外の改修を追加する前提ではありません．本人の適格性を確認済みではありません．既存住宅の蓄電池工事費だけを算定し，住宅取得費・他工事費は含めません．';
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
 if(row.id==='fukuoka-40447-energy-2026')notes.push('申請様式は原則窓口配布です．未掲載の細則は町へ確認してください．');
 if(row.id==='fukuoka-40646-energy-2026')notes.push('本人所有・本人居住を想定しています．公式に本人所有だけを対象とする制度ではありません．');
 notes.push(...(row.required_confirmations??[]).filter(t=>!t.startsWith('認定製品，施工者')));
 return notes.join('')+'適用条件と補助額は，自治体へ確認してください．';
}
export function conciseKumamotoAssumption(row) {
 if (!row.included) return '';
 const notes = {
  'kumamoto-city-pv-battery-2026-second': '太陽光と蓄電池を新設し，太陽光・パワーコンディショナーとも1kW以上の機器を選ぶ想定です．本体購入費の税抜40万円以上という条件は，蓄電池本体費だけで満たす場合に算入しています．事業完了は2027年2月28日まで，後期申請は2026年11月2日～2027年3月5日です．過去の受給制限も確認してください．',
  'amakusa-pv-2026': '年度登録済みの市内業者を利用し，着工前の申請・交付決定などの条件を満たす想定です．',
  'amakusa-battery-2026': '太陽光に常時接続する対象蓄電池を，年度登録済みの市内業者から導入する想定です．着工前の申請・交付決定などの条件を確認してください．',
  'minamioguni-pv-2026': '本人所有の住宅に1kW以上10kW未満の太陽光を設置し，着工前申請などの条件を満たす想定です．',
  'minamioguni-pv-battery-2026': '対象の太陽光と5kWh以上の蓄電池を同時設置する想定です．蓄電池本体は1kWh当たり20万円以下の条件があり，購入・設置費と本体単価の税区分を確認できないため，税込・税抜のいずれでも対象条件と補助額が一致する場合だけ算入しています．',
  'kumamoto-43512-renewable-pv-2026': '同じ村内業者による1回の申請を想定し，3万円の加算は太陽光分へ1回だけ含めます．蓄電池の同時設置でも二重に加算しません．これは条文に基づく試算上の解釈で，個別の交付確認ではありません．',
  'kumamoto-43512-renewable-battery-2026': '同じ村内業者による太陽光との同時設置・1回の申請を想定しています．3万円加算は太陽光分へ1回だけ含めます．蓄電池の対象費用の税区分は未確認のため，税込・税抜のいずれでも補助額が一致する場合だけ算入しています．'
 };
 return notes[row.id] ? notes[row.id] + '本人所有・本人居住の住宅を前提とする概算です．適用条件と最新の受付状況は自治体へ確認してください．' : '';
}
export function conciseMiyagiAssumption(row) {
 if(!row.included)return '';
 const notes={
  'miyagi-natori-renewable':'未使用の10kW未満の太陽光と1kWh以上の定置用蓄電池を同時に新設する想定です．合計10万円には蓄電池6万円を含み，別途加算しません．2026年1月1日～12月31日の導入が対象で，設置後に申請します．同時申請は太陽光の受給契約確認書の到着後に行い，後から太陽光だけの追加申請はできません．先着順・同着抽選・予算到達終了の条件があります．',
  'miyagi-iwanuma-decarbonization':'後期の受付開始前です．2026年1月1日～12月31日に導入し，所定の後期申請期間を満たす想定で計算します．未使用の10kW未満の太陽光と，太陽光に接続する固定蓄電池が対象です．年度内申請は1回で，前期に太陽光を申請した後の後期蓄電池追加申請はできません．予算超過時は抽選です．制度の同時最大受電電力を太陽光入力へ対応し，税区分未指定の対象費用を税込とする仮定があります．',
  'miyagi-osaki-eco':'第2期の受付開始前です．契約は2025年6月1日以後，引渡しは2025年12月1日～2026年11月30日とし，設置後の事前申込と対象者決定後の交付申請を行う想定です．第2期の交付申請期限2027年1月31日を，事前申込期限と混同しないでください．本人専用住宅・未使用設備とし，太陽光施工者及び蓄電池購入先・施工者の市内本社本店条件を満たす想定で，各5,000円を加算しています．予算到達時は抽選です．',
  'miyagi-kakuda-smart-eco-solar':'2026年1月1日～12月31日に購入・設置し，設置完了後に申請する想定です．太陽光の受給契約が必要で，太陽光と蓄電池を同時に設置する場合は受給開始日を設置日とします．確認できた太陽光の定額分のみ計算し，対象費用の範囲が未確認の蓄電池分は含めません．先着順・予算到達終了の条件があります．'
 };
 return notes[row.id]?notes[row.id]+'本人所有・本人居住及び資格・製品条件の充足を前提とする概算です．最新の受付・予算と適用条件は自治体へ確認してください．':'';
}

export function conciseIwateAssumption(row) {
 if(!row.included)return '';
 const notes={
  'iwate-morioka-solar-2026':'既存住宅の太陽光分だけを想定し，新築住宅分とHEMSは受付終了です．過去の抽選に未参加で，市内業者・未使用設備・過去受給制限等の条件を満たす想定です．交付決定後に着工し，申請期限は2027年1月29日，完了報告は同年3月31日です．パネルとパワーコンディショナに同じ容量を対応させ，税区分未指定の対象費用を税込として試算しています．',
  'iwate-miyako-residential-pv-2026':'未使用の太陽光を市内の自己居住戸建てに設置し，市内業者へ依頼する想定です．本診断は10kW未満・税抜60万円/kW以下として試算します．工事完了又は新築住宅引渡しの遅い日から3か月以内の申請，電力受給契約等の条件があります．通常制度の受付継続を想定していますが，現在の予算残を確認したものではありません．',
  'iwate-miyako-residential-battery-2026':'市内の自己居住戸建てに未使用の定置用蓄電池を設置し，太陽光へ接続する想定です．市内業者への依頼，接続から3か月以内の申請が必要です．同じ蓄電池への他補助は併用しません．通常制度の受付継続を想定していますが，現在の予算残を確認したものではありません．',
  'iwate-kitakami-pv-battery-2026':'10kW未満の太陽光と蓄電池の同時設置が必要で，太陽光単独は対象外です．住宅屋根への設置と市内事業所を持つ直接の施工業者への依頼を想定します．設置前申請・交付決定後着工，2027年3月末までの工事完了・請求等が条件です．',
  'iwate-ichinoseki-fit-2026-solar':'10kW未満のFIT太陽光を新設する想定です．市内業者との契約後・着工前に申請し，交付決定後に着工，2027年3月31日までに完成・支払・請求します．同目的の他補助は禁止されているため，国の設備補助との組合せは含めません．',
  'iwate-ichinoseki-fit-2026-battery':'太陽光に併設する未使用の定置用蓄電池を想定します．市内業者との契約後・着工前に申請し，交付決定後に着工，2027年3月31日までに完成・支払・請求します．同目的の他補助は禁止されているため，国の設備補助との組合せは含めません．',
  'iwate-hiraizumi-pv-battery-2026':'新設太陽光と蓄電池の同時設置，対象設備工事の着工前申請を想定します．太陽光は10kW未満，蓄電池分の補助は10kWh未満です．蓄電池が10kWh以上でも太陽光の併設条件を満たすと解釈し，太陽光分だけを計算します．既受給・同一世帯の制限があります．2026年6月1日の予算残は現在の残額を示しません．'
 };
 return notes[row.id]?notes[row.id]+'本人所有・本人居住を前提とする概算です．最新の受付状況・予算と適用条件は自治体へ確認してください．':'';
}

export function conciseAomoriAssumption(row) {
 if (!row.included) return '';
 const notes={
  'fukaura-reform-pv-2026':'築1年以上の住宅で，税込50万円以上の太陽光工事費の10％を，上限20万円・千円未満切捨てで試算します．蓄電池や下水道工事，若者等向けの別枠は加算していません．申請受付は2026年4月1日～10月30日です．町内の対象業者に依頼し，交付決定後に着工する想定です．実績報告は工事完了後20日以内又は2027年3月25日の早い方までで，申請期限とは異なります．世帯の税等の条件と過去の受給制限を確認してください．',
  'rokkasho-new-energy-battery-2026':'対象設備費の10％を，上限15万円・千円未満切捨てで試算します．費用の税区分は公式資料で未確認のため，診断では税込費用と仮定しています．容量1kWh以上・定格出力500W以上の対象リチウムイオン蓄電池を選ぶ想定です．申請受付は2026年4月1日～2027年3月15日で，施工前に申請します．契約は2026年4月1日以後，工事完了は2027年3月31日までが条件です．実績報告は完了後30日又は年度末の早い方までで，申請期限とは異なります．村内居住・電灯契約・税滞納なし・同一機器の既受給制限を確認してください．'
 };
 return notes[row.id] ? notes[row.id]+'本人所有・本人居住の戸建てを前提とする概算です．最新の受付・予算残と適用条件は自治体へ確認してください．' : '';
}

export function conciseOkinawaAssumption(row) {
 if (!row.included || !row.id?.startsWith('okinawa-')) return '';
 const notes={
  'okinawa-ishigaki-pv-2026':'受給契約を2025年10月1日～2026年9月30日に締結し，2026年10月1日～31日に申請する想定です．現在は受付開始前です．申請多数の場合は抽選となり，この試算では採択されると仮定していますが，交付を保証しません．モジュール又はインバーターの出力10kW未満の新品・非リース設備，市内在住・市税等の滞納なし・稼働情報提供などが条件です．',
  'okinawa-nago-pv-2026':'入力容量を最大受電出力の代表値とし，0.1kW未満を切り捨て，1kW当たり1万円で試算します．10kW未満の新品・非リース設備が対象です．2026年度の受給契約と設置後申請を想定し，締切は2027年3月19日17時です．市税等完納・同世帯の過去受給制限・発電情報の提供を確認してください．市内企業の利用は推奨であり必須ではありません．',
  'okinawa-higashi-pv-2026':'入力容量をモジュール出力の代表値とし，0.01kW未満を切り捨て，上限10万円で試算します．着工前に申請し，交付決定後に設置する想定です．実績報告は電力受給開始から30日以内又は申請年度の3月31日の早い方までに必要です．未使用・非リース設備，電灯・余剰電力供給契約，税完納・過去受給制限を確認してください．',
  'okinawa-yomitan-pv-2026':'10kW未満の新品・非リース設備を対象に3万円で試算します．村内在住又は住宅取得による転入，税滞納なし，情報提供などの条件を満たす想定です．申請は役場窓口への持参が必要で，郵送はできません．受付継続を想定していますが，現在の残枠を確認済みではありません．',
  'okinawa-yonabaru-pv-2026':'新品・非リースの住宅用太陽光を対象に3万円で試算します．町内在住・本人居住，税滞納なし，電灯・受給契約が条件です．設置写真・領収書・電力契約確認書を添えて申請し，交付決定後に請求する想定です．確認した要綱には容量上限の明記がありません．'
 };
 return notes[row.id] ? notes[row.id]+'本人所有・本人居住の戸建てを前提とする概算です．対象機器・申請条件と最新の受付状況は自治体へ確認してください．' : '';
}

export function conciseKagoshimaAssumption(row) {
 if (!row.included || !row.id?.startsWith('kagoshima-')) return '';
 let note = '';
 if (row.id === 'kagoshima-amami-reform-third-2026') note='第3期は2026年10月1日開始予定で，補正予算の成立を見込んだ試算です．予算成立済み・受付中・交付確定を意味しません．4月1日時点で18歳未満の子と申請時に同居する子育て世帯を想定し，上限20万円を適用しています．一般世帯は上限10万円です．税込対象工事費30万円以上，補助率5分の1，市内施工業者と工事前申請が条件です．交付決定から120日以内又は2027年3月25日までの完了報告，過去5年度の受給制限を確認してください．太陽光分は他の補助制度と重複できません．新築は対象にしていません．';
 if (row.id.startsWith('kagoshima-kimotsuki-')) note=row.id.includes('-pv-') ? '太陽光モジュールとパワーコンディショナーの出力に同じ入力値を置き，モジュールだけ小数第3位を四捨五入した後の小さい方を用います．実機の両出力が同じと確認した意味ではありません．10kW未満が対象で，受給開始後12か月以内の申請，同町のZEH等住宅補助との重複制限を確認してください．2026年9月2日時点の案内は残り3件です．' : '対象のSII登録機種を太陽光と同時に導入する想定です．設置完了又は設備付き住宅の引渡しから12か月以内の申請が必要です．2026年9月2日時点の案内は残り4件です．';
 if (row.id === 'kagoshima-satsumasendai-battery-2026') note='蓄電池は1kWh以上，同時設置する太陽光とパワーコンディショナーの小さい方の出力は10kW未満が条件です．診断では両出力に同じ入力値を置きます．市内施工業者を利用し，交付決定後に着工する想定です．申請期限は2027年3月1日，完了報告は領収日から60日以内又は2027年3月31日の早い方です．国のZEH支援対象住宅は別の補助枠を確認してください．';
 if (row.id === 'kagoshima-tarumizu-battery-2026') note='本人所有・本人居住の戸建専用住宅又は居住部分50％以上の併用住宅を想定します．交付決定後に着工し，実績報告時までに住民登録を行い，世帯の税滞納がないことが条件です．';
 if (row.id.startsWith('kagoshima-satsuma-')) note='太陽光分は蓄電池との同時設置が必要です．対象の新品機器を自己所有し，申請前年度の4月1日以後の契約又は設置・購入，設置後申請を想定します．ZEH等の給付に一体として含まれる設備の個別補助は除きます．';
 if (row.id.startsWith('kagoshima-osaki-')) note='対象の新品機器を自己所有し，町内住民登録・税滞納なし，設置又は受給開始から1年以内の申請などの条件を満たす想定です．太陽光分は蓄電池との組合せで試算しています．機器の種類ごとの受給制限を確認してください．';
 if (['kagoshima-satsuma-battery-2026','kagoshima-osaki-battery-2026'].includes(row.id)) note+='蓄電池の原文「1キロワット以上」は，診断では容量1kWh以上と読む仮定です．公式訂正やkWとkWhが同じ単位という意味ではありません．対象のSII登録機種と太陽光等への接続が必要です．';
 return note ? note+'本人所有・本人居住を前提とする概算です．対象機器・申請条件と最新の予算・受付状況を自治体へ確認してください．' : '';
}

export function conciseOitaAssumption(row) {
 if (!row.included || row.id !== 'oita-city-renewable-battery-2026') return '';
 return '本人所有・本人居住の戸建てに，対象の未使用リチウムイオン蓄電池を購入・新設する想定です．契約は2025年10月1日以後，保証開始又は系統連系等による設置完了は2026年4月1日～2027年3月31日が条件です．設置後に申請し，年度内に手続を完了する必要があります．市税完納，同じ種類の市補助の既受給制限，対象機種を確認してください．税抜の機器・設置工事費から同設備の他助成を控除した残額を，上限5万円として試算します．FIT禁止の明記がないためFIT売電を想定していますが，公式に併用可能と確認済みではありません．適用条件と最新の受付状況は自治体へ確認してください．';
}

export function conciseMieAssumption(row) {
 if (!row.included || !row.id?.startsWith('mie-')) return '';
 let note = '';
 if(row.id.startsWith('mie-tsu-')) note='太陽光とパワーコンディショナーの小さい方の出力が5kW以上10kW未満となる機器を選ぶ想定です．蓄電池は対象の太陽光との同時設置が必要です．着工予定日が申請日から3か月以内となる時点で，着工10日前までに申請し，交付決定後に着工，年度内に完了する条件があります．2026年9月25日時点の案内は予算残額わずかとなっているため，最新状況を確認してください．';
 if(row.id.startsWith('mie-yokkaichi-')) note='太陽光分は適格な蓄電池との同時申請が必要です．太陽光とパワーコンディショナーの小さい方の出力が1kW以上10kW未満となる機器を想定します．費用の税区分と配分は未確認のため，税込・税抜のいずれでも対象費用が定額を満たす範囲だけ算入し，不足時に定額を減額して算入しません．着工前申請と他の市補助との重複制限を確認してください．';
 if(row.id.startsWith('mie-matsusaka-')) note='対象の蓄電池4万円と太陽光同時設置の加算2万円を想定します．Jクレジット事業「くらしカーボンニュートラルクラブ」への入会申込と，保証開始日から90日以内の申請が必要です．市の別の太陽光補助やLCCM住宅との重複制限を確認してください．';
 if(row.id.startsWith('mie-taki-sharp-')) note='太陽光・蓄電池ともSHARP製の対象製品を選ぶ想定です．診断の標準費用は製品選択によって変更していません．契約又は着工の早い方より前に申請し，完了後2週間又は年度末までに実績報告する条件を確認してください．';
 if(row.id.startsWith('mie-kisosaki-')) note='工事前に申請し，受理後60日以内の着手届，完了後30日以内の実績報告などの条件を満たす想定です．';
 if(row.id.startsWith('mie-tamaki-')) note='工事前の申請，完了後30日又は年度末までの実績報告などの条件を満たす想定です．蓄電池は太陽光へ接続する対象製品を選び，同世帯の過去の受給制限も確認してください．';
 return note ? note+'本人所有・本人居住の戸建てを前提とする概算です．受付継続を想定していますが，予算残や交付を保証するものではありません．' : '';
}

export function conciseAkitaAssumption(row) {
 if(!row.included || row.id!=='akita-daisen-household')return '';
 return '新築・既存の自己居住住宅に，未使用の太陽光と蓄電池を同時に設置・接続する想定です．太陽光単独は対象に含めません．太陽光入力をモジュール公称出力に対応させ，整数kWへ切り捨てた容量に5万円を乗じて上限25万円とし，蓄電池10万円を加えます．2026年4月1日以降の設置・設置後申請，太陽光1kW以上・蓄電池1kWh以上，認証等の製品条件と本人所有・居住・市税等の資格条件を満たす想定です．同じ設備への市の他事業補助は併用しません．国・県との併用可否と現在の残予算は未確認であり，条件充足・受付継続を仮定した概算です．蓄電池単独・V2H併設の制度上の枝は，この診断の設備構成には含めていません．最新の受付状況と適用条件は自治体へ確認してください．';
}

export function conciseYamagataAssumption(row) {
 if(!row.included)return '';
 const notes={
  'yamagata-shirataka-solar':'太陽光は2万5千円/kW・上限10万円を千円未満切捨てで試算します．未使用設備を県内業者が施工し，10kW未満・低圧余剰売電等の条件を満たす想定です．着工前の事前申込み，年度内の完成・受給開始，受給開始後30日又は2027年3月31日の早い日までの実績報告が必要です．集合住宅は対象に含めません．蓄電池の初期実効容量と入力する定格容量の対応は未確認のため，町の蓄電池補助は加算していません．',
  'yamagata-tozawa-renewable':'対象費用の10％を，上限20万円・千円未満切捨てで試算します．太陽光と蓄電池の同時設置は合算費用に共通上限20万円を適用し，各設備20万円ずつには分割しません．公式の税区分は未確認で，税込モデル費へ対応させる仮定です．本人居住又は居住予定の住宅等へ未使用設備を新設し，着工前に申請，完成後に実績報告する想定です．余剰電力受給契約資料の提出，村税等の条件と過去の同種設備への受給制限を確認してください．同じ設備に対する村の他補助は併用しません．蓄電池単独の適用範囲は未確認です．',
  'yamagata-kawanishi-energy':'税抜対象費用の10％を，太陽光単独は上限8万円，同時設置は太陽光と蓄電池を合わせて上限16万円・千円未満切捨てで試算します．同時設置額を各設備8万円ずつには分割しません．本人所有・居住の住宅に未使用設備を設置し，蓄電池は対象製品を太陽光へ常時接続する想定です．中古・リースは対象に含めません．2026年度内の工事完了後，2027年3月31日までに交付申請と実績報告を行います．事前申請を必須とする制度ではありません．予算内先着で，同じ設備に対する町の他補助や過去の交付には制限があります．',
  'yamagata-mikawa-solar':'太陽光は1kW当たり1万5千円・上限6万円を千円未満切捨てで試算します．前年度の単価は使いません．10kW未満の未使用設備を自己居住住宅へ設置し，工事請負・余剰電力受給契約と製品資格等を満たす想定です．着工前申請・交付決定後着工，完成後1か月又は2027年3月31日の早い日までに実績報告します．県補助の一部併用は案内されていますが，個別制度との併用可否は申請前に確認してください．',
  'yamagata-takahata-energy':'太陽光容量に3万円/kWを乗じた額，税抜対象費用の10％，10万円のうち最も小さい額を千円未満切捨てで試算します．10kW未満の未使用設備を自己居住住宅へ設置する想定で，リース・賃貸借・設備更新は含めません．2025年4月1日以降の着手，2027年3月31日までの完了，完成後30日又は同年3月31日の早い日までの実績報告が条件です．同じ設備に対する町の他補助は併用しません．',
  'yamagata-nakayama-solar':'本人が居住する住宅の屋根に新設する設備だけを試算しています．太陽光は既存住宅で上限12万円，新築住宅で上限6万円です．公式の新築設置区分には増築部分や住宅外工作物・土地への設置も含まれるため，これらを既存住宅の上限12万円へ当てはめないでください．太陽光10kW未満・受給契約，蓄電池の製品資格と太陽光への接続等が条件です．2025年4月1日以降の着手，2027年3月31日までの完了，2026年度内の受給開始を想定します．蓄電池分は税抜対象費用の10％・上限12万円として試算します．',
  'yamagata-higashine-solar':'未使用の太陽光と1kWh以上の蓄電池を同時に新設・接続する想定です．太陽光単独は含めず，V2Hを設置したとは仮定しません．太陽光上限12万円・蓄電池上限10万円で，対象設備・工事費を各設備の税込モデル費へ対応させる仮定があります．リース・初期費用0円モデル・追加更新は対象に含めません．交付決定後に着工し，完了30日以内又は2027年3月31日の早い日までに報告します．同じ設備に関する市の他補助は併用しません．',
  'yamagata-sagae-energy':'太陽光と同時に設置する蓄電池分の固定額25万円を試算しています．太陽光自体への補助額ではありません．既設太陽光に蓄電池を追加する15万円の区分とは分けています．未使用の対象蓄電池で，平時も反復充放電する条件を満たす想定です．2027年3月12日までに申請し，交付決定後に着工，完了後30日又は2027年3月31日の早い日までに報告します．税区分及び対象費用が固定額に満たない場合の扱いは未確認です．'
 };
 if(notes[row.id])return notes[row.id]+(row.id==='yamagata-shirataka-solar'?'本人所有・居住，製品・資格条件を満たし，太陽光の入力容量を制度の容量へ対応させる仮定です．':'本人所有・居住，製品・資格条件を満たし，入力容量を制度の容量へ対応させる仮定です．')+'国・県との併用可否と現在の残予算は未確認で，受給を保証するものではありません．申請前に公式情報を確認してください．';
 if(row.id!=='yamagata-kahoku-energy')return '';
 return '新築・既存の自己居住住宅へ対象の太陽光・蓄電池を設置する想定です．事前に申請し，交付決定後に着工，3月15日までに完成する条件があります．太陽光はモジュールとパワーコンディショナーの低い容量へ入力を対応させ，4万円/kW・上限16万円，蓄電池は3万円/kWh・上限15万円で試算します．容量から求めた額を千円未満切捨て後，各対象費用を上限とします．本診断は太陽光・蓄電池の費用内訳があるモデルです．内訳不明のセット価格に適用される公式の工事費総額折半とは区別します．公式の税区分は未確認のため，対象設備・工事費を税込モデル費へ対応させています．国の設備補助とは併用しません．県との併用可否・現在の残予算は未確認で，資格・製品条件の充足と受付継続を仮定しています．申請前に最新の募集条件を自治体へ確認してください．';
}

export function conciseFukushimaAssumption(row) {
 if(!row.included)return '';
 const notes={
  'fukushima-katsurao-solar':'太陽光容量を0.01kW単位で四捨五入し，10万円/kW・容量上限5kW・金額上限50万円を適用して千円未満を切り捨てます．10kW未満の対象判定には丸め前の入力容量を使います．村内で自己居住又は使用予定の住宅への設置，世帯の納税等を満たす想定です．設置後申請で，現行案内の締切は2027年2月27日です．太陽光と蓄電池を設備別に計算し，県補助との併用を想定しています．',
  'fukushima-katsurao-battery':'蓄電池本体と設置工事の税込モデル費用の2分の1・上限50万円とし，千円未満を切り捨てます．SII登録又は同等の資格，住宅用発電設備との接続等を満たす想定です．太陽光分と蓄電池分は別計算で，太陽光の10kW未満条件を蓄電池へ一律に適用しません．税区分は公式未確認で税込費用へ対応させる仮定です．',
  'fukushima-izumizaki-solar':'太陽光容量を0.01kW単位で四捨五入し，3万円/kW・容量上限4kW・金額上限12万円を適用して千円未満を切り捨てます．未確認の10kW制限は追加していません．村内住所・自己居住，納税・過去受給なし等を満たす想定です．2026年度内に工事と電力受給契約を完了し，受給契約後に申請します．年度末を申請締切と確定した意味ではありません．機器の詳細条件と税区分は未確認で，費用には税込モデル費を用います．',
  'fukushima-shimogo-solar':'太陽光容量を0.01kW単位で四捨五入し，3万円/kW・容量上限4kW・金額上限12万円を適用して千円未満を切り捨てます．対象判定は丸め前の容量が10kW未満であることが条件です．自己居住又は居住予定の住宅で，電力契約・納税等を満たす想定です．着工前に窓口で申請し，1住宅1回，予算到達で終了します．工事完了は年度3月10日，報告は完了14日後又は3月20日の早い方で，申請期限とは区別します．税区分は未確認で税込モデル費を用います．',
  "fukushima-tenei-solar":"太陽光容量を0.001kW単位で四捨五入し，丸め後の容量が10kW未満の場合に，同じ容量へ3万円/kWを掛け，上限12万円・千円未満切捨てで計算します．村内住所・本人居住・村税の納税等を満たす想定です．申請は電力受給開始後6か月以内で，年度末を期限とするものではありません．税区分は未確認で税込モデル費を用います．",
  "fukushima-nihonmatsu-solar":"太陽光容量を0.1kW単位で切り捨て，1.5万円/kW・上限6万円とし千円未満を切り捨てます．対象は丸め前10kW未満です．同制度の太陽光と蓄電池は両方申請できず，この診断はFIT太陽光分だけを算入します．自己居住・納税等を満たし，工事後に申請する想定です．",
  "fukushima-tamura-solar":"太陽光容量を0.01kW単位で四捨五入し，2万円/kW・上限8万円とし千円未満を切り捨てます．対象は丸め前10kW未満です．自己居住又は居住予定・世帯の納税等を満たし，工事後に申請する想定です．県補助との併用を想定しますが，公表時点の残件数を現在の残予算とは扱いません．",
  "fukushima-motomiya-solar":"太陽光容量を0.01kW単位で切り捨て，2万円/kW・上限8万円とし千円未満を切り捨てます．対象は丸め前10kW未満です．税込モデル費を1.1で除して税抜対象費へ対応させます．2025年4月1日～2026年12月31日は受給開始・領収の対象期間であり，未確認の申請期限とは区別します．自己居住・納税等を満たす想定です．蓄電池は新規FIT診断対象外として，太陽光分と分けて扱います．",
  "fukushima-koori-solar":"太陽光容量を0.01kW単位で切り捨て，3万円/kW・上限12万円とし千円未満を切り捨てます．対象は丸め前10kW未満です．本人居住・所有者承諾・納税等を満たし，工事後に申請する想定です．",
  "fukushima-kawamata-solar":"太陽光容量を0.01kW単位で四捨五入し，4万円/kW・容量上限5kW・金額上限20万円とし千円未満を切り捨てます．未確認の10kW制限は追加していません．自己居住又は居住予定・所有者承諾・納税等を満たし，着工又は建売引渡し前に窓口で申請する想定です．実績報告は完了1か月後又は年度3月31日の早い方で，申請期限とは区別します．",
  'fukushima-yugawa-solar':'太陽光容量を0.01kW単位で四捨五入し，2.4万円/kW・容量上限5kW・金額上限12万円を適用して千円未満を切り捨てます．10kW未満の設備が対象です．村内で自己居住又は居住予定の住宅に設置し，電力受給契約・村税の納税等を満たす想定です．設置完了後1年以内に申請します．税区分は未確認で税込モデル費へ対応させています．',
  'fukushima-tomioka-solar':'太陽光容量を0.01kW単位で切り捨て，4万円/kW・容量上限4kW・金額上限16万円を適用して千円未満を切り捨てます．10kW未満の設備が対象です．申請時に対象住宅へ居住し，納税・所有者承諾等の条件を満たす想定です．共用パワーコンディショナー費用は太陽光側に含めます．蓄電池分は非FIT・卒FIT等の条件があり，新規FIT売電を始める診断では対象外です．税区分は未確認で税込モデル費へ対応させています．',
  'fukushima-inawashiro-solar':'太陽光容量を0.01kW単位で四捨五入し，1万5千円/kW・上限6万円を適用して千円未満を切り捨てます．取得した要綱に10kW未満の制限はありません．町内で居住又は居住予定の住宅へ設置し，着工前に申請する想定です．交付決定から2か月以内に着工届を提出し，既存住宅は3か月・新築は6か月以内又は年度の3月10日の早い日までに完了します．実績報告は完了14日以内又は3月31日の早い日までで，電力受給契約書を添付します．本人所有住宅を診断対象としていますが，制度自体が所有者だけに限定されるという意味ではありません．税区分は未確認で税込モデル費へ対応させています．',
  'fukushima-nishiaizu-solar':'太陽光容量は事前に丸めず，3万円/kW・上限12万円を適用して千円未満を切り捨てます．10kW未満の制限は追加していません．町内で居住又は居住予定の住宅に設置する想定で，所有又は書面による設置承諾，世帯の納税，系統連系に伴う電力需給契約等が条件です．設備ごとに1施設1回で，着手前に申請し，完了14日以内に報告します．蓄電池分は卒FIT・非FIT等の条件があり，新規FIT売電を始める診断では対象外です．税区分は未確認で税込モデル費へ対応させています．',
  'fukushima-tamakawa-solar':'太陽光入力をモジュールとパワーコンディショナーの低い出力へ対応させ，10kW未満を対象にします．容量を0.01kW単位で切り捨て，1万5千円/kW・上限6万円を適用し，千円未満を切り捨てます．本人が居住する住宅等への新品購入を想定し，リース・既補助設備の増設は含めません．設置後申請で，所有者同意，同居者の納税，過去の村補助等の条件があります．HEMS分は加算しません．受付期間と税区分は未確認で，費用は税込モデル費へ対応させています．',
  'fukushima-furudono-solar':'太陽光入力をモジュール公称最大出力へ対応させ，0.01kW単位で四捨五入した容量に4万円/kWを乗じ，上限16万円・対象費以内・千円未満切捨てで試算します．取得した要綱に10kW未満という制限はなく，この条件を他制度から追加しません．新品・逆潮流連系・受給契約，本人居住又は居住予定の住宅等を想定します．着工又は建売引渡し前に申請し，完了後1か月又は年度の3月31日の早い日までに報告します．所有者同意・納税等の条件を確認してください．受付期間と税区分は未確認で，費用は税込モデル費へ対応させています．',
  'fukushima-koriyama-set':'太陽光と蓄電池のセット補助13万円を想定しています．蓄電池単体10万円とは排他で比較し，23万円には加算しません．同一契約又は30日以内に締結した設備ごとの契約が条件です．未使用で国補助の登録対象となる蓄電池を購入し，賃貸・PPA・リースは含めません．既存住宅は2026年1月1日～2027年2月28日の契約・設置，新築建売は同期間の本人登記を想定します．完了後申請で，過去の受給・市税等の条件と残予算を確認してください．他の行政機関等との補助総額は対象費以内とし，税区分は未確認のため税込モデル費へ対応させています．',
  'fukushima-koriyama-battery':'蓄電池単体の補助10万円を想定しています．太陽光とのセット13万円とは排他で比較し，重複加算しません．未使用で国補助の登録対象となる製品を購入する想定です．太陽光が既設であることを必須とは扱っていません．既存住宅は2026年1月1日～2027年2月28日の契約・設置，新築建売は同期間の本人登記，完了後申請等の条件があります．他の行政機関等との補助総額は対象費以内で，税区分は未確認のため税込モデル費へ対応させています．',
  'fukushima-iwaki-solar':'太陽光容量を0.01kW単位で四捨五入し，1万円/kW・上限4万円を適用して千円未満を切り捨てます．住宅等へ未使用設備を設置し，販売又は施工の一方を市内事業者・支店へ依頼する想定です．FIT売電では2026年1月1日～12月31日の受給開始と設置後申請が条件です．同じ機器への市の他補助は併用しません．市は国・県との併用を案内していますが，相手制度の条件も確認してください．税区分は未確認で税込モデル費へ対応させています．',
  'fukushima-sukagawa-solar':'太陽光容量を0.1kW単位で四捨五入し，1万5千円/kW・上限6万円で試算します．自己所有・居住住宅への新規設置，余剰電力受給契約，市税等の条件を満たす想定です．2026年度設置又は2025年度設置で未申請の設備が対象で，設置後に申請し5年間管理する必要があります．各世帯・各システム1回の補助とし，他設備分を自動で加算しません．税区分と最終端数処理は未確認で，税込モデル費とサービスの円単位四捨五入を用いています．',
  'fukushima-fukushima-solar':'太陽光分は5万円を，税抜対象費用の範囲内で試算します．未使用設備で，入力容量をモジュール又はパワーコンディショナーの10kW未満の判定へ対応させる仮定です．実機の異なる容量の組合せを確認済みという意味ではありません．自己居住住宅等への購入設置を想定し，賃借・PPA・リースは含めません．年度内の設置又は余剰受給開始と領収，完了後の申請，設備ごとの受給回数・市税等の条件があります．',
  'fukushima-aizuwakamatsu-solar':'太陽光と蓄電池の同時設置を想定し，太陽光分だけを1万円/kW・上限4万円で試算します．入力容量を0.01kW単位で切り捨てて計算し，太陽光単独では市の補助を加算しません．V2Hを導入したとは仮定しません．未使用の10kW未満の太陽光と登録対象の蓄電池を住宅へ接続する想定です．税区分は未確認のため，税込モデル費へ対応させています．年度内の領収と完了後の申請，2027年3月31日までの申請，過去の受給・市税等の条件を確認してください．市は国・県との併用を案内していますが，他制度側の条件も確認が必要です．'
 };
 if(!notes[row.id])return '';
 return notes[row.id]+((row.id.startsWith('fukushima-koriyama-')||['fukushima-inawashiro-solar','fukushima-nishiaizu-solar','fukushima-yugawa-solar','fukushima-tomioka-solar','fukushima-katsurao-solar','fukushima-katsurao-battery','fukushima-izumizaki-solar','fukushima-shimogo-solar','fukushima-tenei-solar','fukushima-nihonmatsu-solar','fukushima-tamura-solar','fukushima-motomiya-solar'].includes(row.id))?'':'蓄電池は制度の容量基準と入力する定格容量の対応が未確認のため，この自治体の蓄電池分は含めていません．')+'本人居住・所有者同意・製品資格等の条件と受付継続を満たす仮定です．現在の残予算や個別制度との併用可否を確認した受給保証ではありません．申請前に公式情報を確認してください．';
}

export function conciseHokkaidoAssumption(row) {
 if(!row.included)return '';
 const notes={
  'hokkaido-hokuto-solar':'太陽光容量を0.01kW単位で切り捨て，2万円/kW・上限10万円・千円未満切捨てで計算します．容量10kW未満，着工前申請等を満たす想定です．モジュールとPCSの異なる容量は単一入力へ対応させる仮定です．この市の蓄電池分は今回の試算に含めていません．',
  'hokkaido-mori-solar':'太陽光容量に5万円/kWを掛け，上限15万円・千円未満切捨てで計算します．容量10kW未満，新品・余剰売電・交付決定後の工事等を満たす想定です．この町の蓄電池分は今回の試算に含めていません．',
  'hokkaido-sapporo-general-solar':'対象の蓄電池との同時設置を想定し，太陽光容量を0.01kW単位で切り捨て，2万円/kW・上限13.9万円・千円未満切捨てで計算します．税抜の購入・設置費が補助額を上回ることが条件です．太陽光1.5kW以上，蓄電池2kWh以上・本体購入費税抜10万円以上，エコエネクラブ入会等を満たす想定です．',
  'hokkaido-sapporo-general-battery':'蓄電池の定格容量を0.1kWh単位で切り捨て，1.6万円/kWh・上限6.4万円・千円未満切捨てで計算します．太陽光1.5kW以上への接続，蓄電池2kWh以上・本体購入費税抜10万円以上が条件です．税抜の購入・設置費が補助額を上回る必要があり，本体購入費と工事込み費用は区別します．',
  'hokkaido-hakodate-solar':'太陽光の対象費用の2分の1・上限5万円とし，千円未満を切り捨てます．容量2kW以上50kW未満，着工2週間前の申請・交付決定後の着工等を満たす想定です．同一設備への他補助は併用できず，太陽光と蓄電池は別設備として扱います．税区分は未確認で税込モデル費を用います．',
  'hokkaido-hakodate-battery':'蓄電池の対象費用の2分の1・上限5万円とし，千円未満を切り捨てます．同じ蓄電池への国等の補助は併用せず，利用可能な組合せを比較します．太陽光分は別設備として扱います．接続設備・着工前申請等を満たす想定で，税区分は未確認のため税込モデル費を用います．',
  'hokkaido-abashiri-solar':'太陽光だけなら太陽光費，蓄電池と同時設置なら両設備の合計費が税込10万円以上の場合に計算します．補助額は太陽光費の10分の1・上限10万円・千円未満切捨てです．入力外の別工事費は加えません．費用率の税区分は未確認で税込モデル費を用い，市内施工者・写真提出等を満たす想定です．',
  'hokkaido-abashiri-battery':'太陽光・蓄電池の合計費が税込10万円以上の場合に，蓄電池費の10分の1・上限10万円・千円未満切捨てで計算します．最低額は合計費で判定し，補助額と上限は設備別です．費用率の税区分は未確認で税込モデル費を用い，市内施工者等を満たす想定です．'
 };
 return notes[row.id] ? notes[row.id]+' 受付・予算・申請条件は公式情報で確認してください．' : '';
}
