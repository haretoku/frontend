import {nonInclusionReason} from '../../simulator/src/subsidy-presentation.js';
import {mergeCatalogPrograms,catalogPeriod} from './catalog.js';
import {catalogAmountPresentation} from './catalog-amount.js';
export const listingMunicipalities = data => data.listing_municipalities ?? data.municipalities;
export function listingNotes(program) {
  const historical=program._catalog?.historical_context;
  if (historical?.status === 'closed_legacy_scheme' && typeof historical.notice === 'string' && historical.notice.trim()) {
    return [historical.notice];
  }
  if (program._retentionStatus === 'historical_records') {
    return ['過年度の制度情報です．現在も利用できることを示すものではありません．'];
  }
  return [];
}
export function diagnosisDescription(data, prefecture, municipality = '') {
  const listed = listingMunicipalities(data).find(m => m.prefecture_code === prefecture && m.municipality_code === municipality);
  const supported = data.municipalities.some(m => m.prefecture_code === prefecture && m.municipality_code === municipality);
  return listed && !supported
    ? `${listed.municipality_name}の補助制度は診断に含まれません．都道府県の選択を引き継いで，30年間の収支を概算できます．`
    : '設備や暮らしの条件から，30年間の収支を概算できます．掲載制度のすべてを計算に含むわけではありません．';
}
export function diagnosisUrl(data, prefecture, municipality = '') {
  const params = new URLSearchParams();
  if (prefecture) params.set('prefecture', prefecture);
  if (data.municipalities.some(m => m.prefecture_code === prefecture && m.municipality_code === municipality)) params.set('municipality_code', municipality);
  params.set('from', 'data');
  return '/simulator/?' + params;
}
export function selectPrograms(data, prefecture, municipality = '') {
  if (!data.prefectures.some(p => p.code === prefecture)) return [];
  const validCity = listingMunicipalities(data).some(m => m.prefecture_code === prefecture && m.municipality_code === municipality);
  return mergeCatalogPrograms(data).filter(p => p.government_level === 'national' || (p.government_level === 'prefecture' && p.prefecture_code === prefecture) || (validCity && p.government_level === 'municipality' && p.prefecture_code === prefecture && p.municipality_code === municipality));
}
export function groupPrograms(rows) {
  const groups = new Map();
  for (const p of rows) {
    const key = JSON.stringify([p.government_level,p.prefecture_code,p.municipality_code,p.program_name,p.official_urls?.[0] || p.id,p._catalog ? p._catalog.target_year : null]);
    if (!groups.has(key)) groups.set(key,[]);
    groups.get(key).push(p);
  }
  return [...groups.values()];
}
const yen = value => Number(value).toLocaleString('ja-JP') + '円';
export function amountSummary(program) {
  if(program._catalog){
    const fallback=reviewedCatalogFallback(program,'amount');
    const view=catalogAmountPresentation(program._catalog.amount,fallback);
    return view.note ? view.text.replace(/[．。]+$/,'')+'．'+view.note : view.text;
  }
  const knownFields = new Set(['id','government_level','prefecture_code','municipality_code','program_name','housing_ages','equipment_packages','application_status','diagnostic_scope','expense_scopes','conflict_program_ids','official_urls','confirmed_at','calculation_assumptions','required_confirmations','source_ids','machine_rule','fit_compatible','formula_components','excluded_municipality_codes','solar_output_min_kw','solar_output_max_kw_exclusive','non_adoption_status','non_adoption_reason_code']);
  if (Object.keys(program).some(key => !knownFields.has(key))) return '補助額の条件は未整理';
  if (catalogSummaries[program.id]) return catalogSummaries[program.id].amount;
  if (program.conflict_program_ids?.length) return '補助額の条件は未整理';
  const components = program.formula_components;
  if (!components?.length) return '補助額は未確認';
  const supported = new Set(['scope','equipment_packages','housing_ages','formula_type','cost_scope','cost_tax','fraction_numerator','fraction_denominator','cap_yen','rounding_unit_yen','eligible_cost_min_yen']);
  return components.map(c => {
    const scope = {solar:'太陽光',battery:'蓄電池'}[c.scope] || '対象設備';
    // More complex capacity preprocessing, tax assumptions and combined caps need a dedicated description.
    if (Object.keys(c).some(key => !supported.has(key)) || c.formula_type !== 'cost_fraction' || c.cost_tax !== 'inclusive' || !c.fraction_denominator || c.fraction_numerator == null) return scope + '：補助額の条件は未整理';
    let text = scope + '：税込対象費用の' + Number((100*c.fraction_numerator/c.fraction_denominator).toFixed(2)) + '％';
    if (c.cap_yen != null) text += '／上限' + yen(c.cap_yen);
    if (c.eligible_cost_min_yen != null) text += '／対象費用' + yen(c.eligible_cost_min_yen) + '以上';
    if (c.rounding_unit_yen > 1) text += '／' + yen(c.rounding_unit_yen) + '未満切捨て';
    return text;
  }).join('\n');
}
export function equipmentLabel(p) { return p._catalog?.branch_label || (p.expense_scopes || []).map(s=>({solar:'太陽光',battery:'蓄電池',housing:'住宅'}[s] || 'その他')).join('・') || '公式情報で確認'; }
export function statusLabel(p) {
  if(p.branch_statuses?.length)return p.branch_statuses.map(b=>({morioka_existing_pv:'既存住宅の太陽光',morioka_new_housing_closed_2026:'新築住宅の太陽光',solar:'太陽光',battery:'蓄電池'}[b.branch_id]||'対象区分')+'：'+statusLabel(b)).join('\n');
  return ({accepting:'受付中',waitlist:'キャンセル待ち',closed:'受付終了',suspended:'受付停止',scheduled:'受付開始前',not_open:'受付対象外',not_applicable:'受付対象外',unknown:'受付状況未確認',unconfirmed:'受付状況未確認',accepting_with_waitlist_branch:'設備別に受付条件あり'})[p.application_status] || '受付状況未確認';
}

export function applicability(p) {
  if (p.id === 'fukaura-vacant-reform-pv-2026') return {label:'対象設備への適用確認中',text:'太陽光の新設工事が，この制度の増築・機能回復などの要件を満たすか確認できていません．空き家バンク登録物件に関する制度の存在や受付状況とは別の確認事項です．'};
  if (p.id === 'misawa-reform-decarbonization-2026') return {label:'診断の計算対応待ち',text:nonInclusionReason({...p,reason_code:p.non_adoption_reason_code})};
  if (p.id === 'fukaura-young-reform-pv-2026') return {label:'補助額の解釈を確認中',text:nonInclusionReason({...p,reason_code:p.non_adoption_reason_code})};
  if (p.non_adoption_reason_code) return {label:p.non_adoption_status==='candidate'?'適用・算定条件を確認中':'診断への適用に制約あり',text:nonInclusionReason({...p,reason_code:p.non_adoption_reason_code})};
  return {label:'個別の適用条件あり',text:'受付中であっても，住宅・設備・申請時期などの要件を満たす必要があります．この一覧への掲載は，ご自宅への適用を確定するものではありません．'};
}
export function confirmationNotes(p) {
  return [...new Set([p.diagnostic_scope?.basis,...(p.required_confirmations||[]),...(p.calculation_assumptions||[])].filter(Boolean))];
}

// Display summaries preserve recorded scheme terms; they are not diagnostic awards.
export const catalogSummaries = {
  // Received 11.45 diagnostic record and saved Ehime evidence, checked 2026-09-21.
  // Scheme terms, not a claim that the model's inclusive-tax assumption is official.
  'ehime-38386-energy-2026': {
    amount:'蓄電池：設置費から国などの他の補助金を差し引いた額と15万円のうち，低い方．千円未満切捨て．対象費用の税区分は未確認．',
    target:'蓄電池：JET認証の未使用設備．系統連系が必要．\n共通：町内で自ら居住する戸建住宅への設置，又は設備付き建売住宅の購入．賃貸住宅は対象外．同一住宅では家庭用燃料電池又は蓄電池のいずれか1回．他補助との併用は，相手制度の条件も確認してください．',
    period:'申請期限：工事完了から30日以内．'
  },
  // Backend review/towada-followup-2026-09-27.json, independently reviewed by coordinator.
  // Listing terms only. Q25 example 3 is inconsistent; do not adopt a battery calculation formula.
  'aomori-02206-self-consumption-pv-2026': {
    amount:'太陽光：5万円/kW，上限25万円．税抜対象実支出額が上限．パネルとパワーコンディショナの小さい出力を整数kWに切り捨てて算定．',
    target:'太陽光：新設設備．非FIT・非FIP，家庭の自家消費率30％以上．\n共通：市内で自ら所有・居住する新築・既築戸建て．PPA・リース・中古は対象外．同一対象設備・事業への他補助不可．対象経費は工事費込み・税抜，補助額は千円未満切捨て．原則交付決定後の契約・着工（事前着手届の例外あり）．工事完了・支払は2027年1月29日まで．実績報告は完了から30日又は同日の早い方．',
    period:'予定件数到達により受付終了．当初の申請期間：2026年6月23日～12月28日．'
  },
  'aomori-02206-self-consumption-battery-2026': {
    amount:'蓄電池：税抜対象経費の1/3，上限35万円．算定対象の単価上限は14.1万円/kWh．容量は0.1kWh単位に切り捨て．詳細な算定は公式窓口で確認してください．',
    target:'蓄電池：新設太陽光との同時設置，20kWh未満．蓄電池単独・既設太陽光への追加は対象外．公式手引きの計算例に金額の不一致があり，容量の切捨てと実支出額の扱いは確認が必要です．\n共通：市内で自ら所有・居住する新築・既築戸建て．PPA・リース・中古は対象外．同一対象設備・事業への他補助不可．対象経費は工事費込み・税抜，補助額は千円未満切捨て．原則交付決定後の契約・着工（事前着手届の例外あり）．工事完了・支払は2027年1月29日まで．実績報告は完了から30日又は同日の早い方．',
    period:'予定件数到達により受付終了．当初の申請期間：2026年6月23日～12月28日．'
  },
  // Backend's saved 2026-09-08 evidence: source-2cc7e0f7105d32,
  // source-8b3f0bcef0b743, source-9fa6ae61ffbc9e. Display only; no diagnostic change.
  'national-dr-battery-r7-supplement-2026': {
    amount:'蓄電池：基本3.45万円/kWh．条件により2,000円/kWh・1,000円/kWhを加算．対象経費の30％・60万円が上限．',
    target:'蓄電池：登録DR対応製品．加算にはレジリエンス評価・広域認定の条件あり．\n共通：登録販売店との共同申請，交付決定後の契約・発注・支払，2028年3月31日までのDR継続等が必要．',
    period:'2026年5月29日に予算到達で受付終了．'
  },
  'national-zeh-new-detached-2026-battery': {
    amount:'蓄電池：2万円/kWh，設備購入費の1/3，20万円のうち最も小さい額．千円未満切捨て．工事費は含みません．',
    target:'共通：新築戸建ZEHへの加算．ZEH＋・断熱等級6・再エネを除く一次エネ削減30％以上等の住宅要件．蓄電池単独では利用不可．\n蓄電池：当年度登録製品・高度HEMS等が必要．',
    period:'申請期間：2026年5月21日～12月11日．'
  },
  'national-mirai-eco-renovation-2026-battery': {
    amount:'蓄電池：1戸9.6万円（台数比例ではありません）．\n共通上限：住宅区分に応じた工事全体の共通上限40万・50万・80万・100万円の範囲内．',
    target:'共通：既存住宅の所定の断熱・省エネ改修（外皮開口部を含む）が必須．蓄電池だけでは利用不可．登録施工業者が申請・還元．\n蓄電池：SII対象登録製品を使用．',
    period:'申請期間：2026年6月30日～12月31日．'
  },
  'gunma-solar-new-2026': {
    amount:'太陽光：1世帯7万円（1kW当たりではありません）．\n蓄電池：同時設置の場合，税抜対象費用の1/3，千円未満切捨て．',
    target:'太陽光：新設1kW以上10kW未満．非FIT・非FIP，自家消費30％以上．\n蓄電池：太陽光と同時設置．税抜14.1万円/kWh以下（4,800Ah・セル以上は16万円/kWh以下）の価格条件あり．\n共通：上野村は対象外．交付決定後着工．',
    period:'2026年7月20日受付終了．'
  },
  'gunma-battery-existing-pv-2026': {
    amount:'蓄電池：税抜対象費用と「14.1万円×蓄電容量(kWh)」の小さい額の1/3．容量は小数第2位以下，補助額は千円未満切捨て．',
    target:'太陽光：2026年4月29日以前に系統連系済み，1kW以上10kW未満．\n蓄電池：既設太陽光への追加，1kWh以上．',
    period:'2026年7月20日受付終了．'
  },
  'fukaura-reform-pv-2026': {
    amount:'太陽光：税込対象工事費の10％，上限20万円．対象工事費50万円以上，千円未満切捨て．蓄電池・若者等の別枠は含みません．',
    target:'太陽光：築1年以上の既存住宅への工事．\n共通：町内の対象業者へ依頼し，交付決定後着工．',
    period:'申請期限：2026年10月30日．'
  },
  'rokkasho-new-energy-battery-2026': {
    amount:'蓄電池：対象設備費の10％，上限15万円．千円未満切捨て．対象費用の税区分は未確認．',
    target:'蓄電池：1kWh以上・定格出力500W以上．\n共通：2026年4月1日以後の契約，施工前申請．工事完了は2027年3月31日まで．',
    period:'申請期限：2027年3月15日．'
  }
};
export function applicationPeriod(p) {
  if(p._catalog)return reviewedCatalogFallback(p,'period') || catalogPeriod(p._catalog) || '申請期間：公式情報をご確認ください．';
  return catalogSummaries[p.id]?.period || '申請期間：公式情報をご確認ください．';
}
// Collapse only identical information; different equipment terms retain their labels.
export function groupedEquipmentSummary(group, describe) {
  const values=group.map(describe);
  if(new Set(values).size===1)return [values[0]];
  return [...new Set(group.flatMap((p,i)=>values[i].split('\n').map(line=>equipmentLabel(p)+'：'+line)))];
}
export function groupedTargetSummary(group,describe=targetSummary) {
  const perEquipment=group.map(p=>describe(p).split('\n').filter(Boolean));
  if(group.length>1 && group.every(p=>p._catalog)){
    const common=perEquipment[0].filter(line=>perEquipment.every(parts=>parts.includes(line)));
    return [...new Set(perEquipment.flatMap((parts,i)=>parts.filter(line=>!common.includes(line)&&line!=='対象：'+equipmentLabel(group[i])).map(line=>equipmentLabel(group[i])+'：'+line.replace(/^(太陽光|蓄電池|共通|対象)：/,'')))),...common.map(line=>line.startsWith('共通：')?line:'共通：'+line)];
  }
  const lines=[...new Set(perEquipment.flatMap((parts,i)=>parts.map(line=>line.startsWith('共通：')&&!perEquipment.every(other=>other.includes(line))?equipmentLabel(group[i])+'：'+line.slice(3):line)))];
  const targets=lines.filter(line=>line.startsWith('対象：')).map(line=>line.slice(3));
  return [...(targets.length?['対象：'+[...new Set(targets.flatMap(t=>t.split('・')))].join('・')]:[]),...lines.filter(line=>!line.startsWith('対象：')&&!line.startsWith('共通：')),...lines.filter(line=>line.startsWith('共通：'))];
}
// Keep evidence classes separate even when identical text occurs in both classes.
export function conditionSections(group) {
  const official=groupedTargetSummary(group,p=>p._catalog?targetSummary({...p,_catalog:{...p._catalog,gaps:[]}}):targetSummary(p));
  const gaps=groupedTargetSummary(group,p=>(p._catalog?.gaps||[]).join('\n'));
  const assumptions=groupedTargetSummary(group,p=>(p._catalog?.conditions?.model_assumptions||[]).join('\n'));
  return [
    {label:'補助条件',lines:official},
    {label:'未確認事項',lines:gaps},
    {label:'モデル上の仮定',lines:assumptions,note:'公式の補助条件とは異なります．仮定の記載は，この制度を診断の計算に含めていることを示すものではありません．'}
  ].filter(section=>section.lines.length);
}
export const receptionFilters = {
  all: null,
  accepting: ['accepting','waitlist','accepting_with_waitlist_branch'],
  scheduled: ['scheduled'],
  closed: ['closed','suspended','not_open','not_applicable'],
  unknown: []
};
export function matchesReception(group,filter='all') {
  if(!Object.hasOwn(receptionFilters,filter)||filter==='all')return true;
  const known=Object.values(receptionFilters).filter(Array.isArray).flat();
  return group.flatMap(p=>p.branch_statuses?.length?p.branch_statuses:[p]).some(p=>filter==='unknown'?!known.includes(p.application_status):receptionFilters[filter].includes(p.application_status));
}
export function targetSummary(p) {
  if(p._catalog){
    const row=p._catalog;
    const official=row.conditions?.official || [];
    const fallback=reviewedCatalogFallback(p,'target');
    if (row.display_basis === 'preparing' && !official.length) {
      return ['対象：'+equipmentLabel(p),'補助条件：表示内容を整理中です．公式情報をご確認ください．',...(row.gaps||[])].join('\n');
    }
    return [...(official.length?official:(fallback?[fallback]:['対象：'+equipmentLabel(p),'補助条件：公式情報をご確認ください．'])),...(row.gaps||[])].join('\n');
  }
  if(catalogSummaries[p.id])return catalogSummaries[p.id].target;
  if(p.id==='fukaura-vacant-reform-pv-2026')return '太陽光：新設が機能回復等の要件を満たすか未確認．\n共通：空き家バンク登録住宅の改修．';
  if(p.id==='fukaura-young-reform-pv-2026')return '太陽光：町リフォーム補助を受ける工事．\n共通：移住者・若年の新婚／子育て世帯等の条件あり．他補助控除後の限度額の解釈・端数処理は未確認．';
  if(p.id==='misawa-reform-decarbonization-2026')return '対象：太陽光・蓄電池の設備工事．\n共通：市内登録店が施工，交付決定後に契約・着工．他補助の控除と設備合算上限あり．';
  const housing=(p.housing_ages||[]).map(a=>({new:'新築',existing:'既存住宅'}[a]||a)).join('・');
  const notes=[housing];
  if(p.fit_compatible===false||p.non_adoption_reason_code==='nonfit_required')notes.push('非FIT等の売電条件あり');
  if(p.diagnostic_scope?.status==='excluded_required_external_work'||/required_external/.test(p.non_adoption_reason_code||''))notes.push('設備設置だけでは利用できず，住宅工事等の条件が必要');
  else if(p.non_adoption_status==='candidate')notes.push('設備への適用・補助額の条件に未確認事項あり');
  else if(p.non_adoption_reason_code)notes.push(listingCondition(p));
  return '対象：'+equipmentLabel(p)+(notes.filter(Boolean).length?'\n共通：'+notes.filter(Boolean).join('．'):'');
}

function reviewedCatalogFallback(program,field) {
  // An explicit preparation state invalidates earlier, ID-bound display notes.
  if (program._catalog?.display_basis === 'preparing') return null;
  const values=[...new Set((program._legacy||[]).map(p=>{
    if(catalogSummaries[p.id]?.[field])return catalogSummaries[p.id][field];
    if(field==='amount'){
      const text=amountSummary(p);
      return /補助額は未確認|補助額の条件は未整理/.test(text)?null:text;
    }
    return null;
  }).filter(Boolean))];
  return values.length===1 ? values[0] : null;
}

function listingCondition(p) {
  const reason=p.non_adoption_reason_code;
  if(['application_closed','closed','application_suspended','application_closed_or_current_year_not_implemented'].includes(reason))return '';
  if(['sale_path_not_applicable','non_fit_required','nonfit_required','fit_incompatible','application_closed_or_fit_incompatible'].includes(reason))return p.fit_compatible===false?'':'非FIT等の売電条件あり';
  if(['existing_pv_battery_addition_not_supported','existing_equipment_required','existing_solar_required'].includes(reason))return '既設設備の有無・設置時期の条件あり';
  if(['business_only','business_or_public_facility'].includes(reason))return '事業者・事業用施設等の申請条件を確認';
  if(reason==='not_direct_grant')return '個人への直接補助ではありません';
  if(reason==='dependent_program_unavailable')return '関連補助制度の利用が必要';
  if(reason==='required_housing_acquisition')return '住宅の取得に付随する設備加算';
  if(['equipment_excluded','explicit_equipment_exclusion','equipment_not_eligible','equipment_not_applicable'].includes(reason))return '対象外となる設備・工事あり．対象範囲を公式情報で確認';
  if(['eligible_cost_scope_unavailable','eligible_cost_scope_unconfirmed','official_evidence_unresolved'].includes(reason))return '補助対象費用の範囲に未確認事項あり';
  if(reason==='current_year_recruitment_and_amount_basis_not_found')return '現年度の募集・補助額の根拠は確認できていません';
  if(reason==='investigation_closed_insufficient_information')return '適用条件の根拠に不足あり';
  if(reason==='calculation_detail_unconfirmed')return '補助額の算定条件を公式情報で確認';
  return '対象住宅・設備・申請者などの条件を公式情報で確認';
}
