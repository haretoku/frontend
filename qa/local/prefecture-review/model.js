export const stageLabels = {
  collection: '収集・調査終了', adoption: '採用推奨', issues: '未決定点',
  review1: 'AI①', userReview: 'ユーザー検収', delivery: '現在の診断反映'
};

export const excludedFieldLabels = {
  scheme_id:'制度ID', exclusion_id:'除外記録ID', target_year:'対象年度', target_year_note:'対象年度の留意点',
  collection_status:'収集状態', calculation_possibility:'計算可能性', calculation_basis:'判定根拠',
  application_status:'受付状態', application_status_scope:'受付状態の対象範囲', application_start:'開始日', application_end:'終了日',
  checked_at:'確認日', implementation_status:'反映状態', target_equipment:'対象設備', housing_age_scope:'住宅区分', ownership_residence_scope:'所有・居住区分',
  delivery_route:'交付経路', unknowns:'未確認事項', official_url:'公式資料', source_ids:'根拠資料ID',
  combination_conditions:'併用条件', combination_reference_policy:'併用条件の扱い', condition_note:'条件の留意点',
  confirmed_conditions:'確認した条件', confirmed_prefectural_conditions:'確認した県の条件',
  date_note:'日付の留意点', date_scope:'日付の対象範囲', evidence_location:'根拠の該当箇所', location:'確認箇所',
  historical_note:'過年度記録の留意点', official_amount_context:'公式金額の対象範囲', official_amount_note:'公式金額の留意点',
  original_amount:'元資料の金額', prefectural_to_municipal_rate:'県から市町村への補助率',
  preserved_amounts:'保持する金額', reference_amounts:'参考金額', reference_formula:'参考算式', resident_amount:'住民向け金額',
  status_evidence:'状態の根拠', branches_reviewed:'確認した条件枝'
};

export function excludedFields(program) {
  const displayed=[],internal={};
  for(const [key,value] of Object.entries(program)) {
    if(['scheme_name','label','reason','rationale'].includes(key))continue;
    if(excludedFieldLabels[key])displayed.push({label:excludedFieldLabels[key],value});
    else internal[key]=value;
  }
  return {displayed,internal};
}

export function validateRows(records) {
  if (!Array.isArray(records) || records.length !== 47) throw new Error('47都道府県の正本行が揃っていません．');
  const codes = new Set(records.map(record => record.code));
  for (let number = 1; number <= 47; number++) {
    if (!codes.has(String(number).padStart(2, '0'))) throw new Error('都道府県コードに不足又は重複があります．');
  }
  for (const record of records) {
    if (typeof record.name !== 'string' || !record.name) throw new Error('都道府県名がありません．');
    for (const key of Object.keys(stageLabels)) {
      const stage = record.stages?.[key];
      if (!stage || typeof stage.state !== 'string' || typeof stage.label !== 'string') throw new Error('段階別状態が揃っていません．');
    }
  }
  return records;
}

export function matches(record, {query = '', stage = '', state = ''}) {
  const normalize = value => value.normalize('NFKC').replace(/\s/g, '').toLocaleLowerCase('ja');
  if (query && !normalize(record.name).includes(normalize(query))) return false;
  const stages = stage ? [record.stages[stage]] : Object.values(record.stages);
  return !state || stages.some(item => item?.state === state);
}

export function statusOptions(records, stage = '') {
  const options = new Map();
  for (const record of records) for (const item of stage ? [record.stages[stage]] : Object.values(record.stages)) {
    if (item) options.set(item.state, item.label);
  }
  return [...options].sort(([a], [b]) => a.localeCompare(b));
}

export function stageCounts(records, key) {
  const counts = new Map();
  for (const record of records) {
    const stage = record.stages[key];
    const item = counts.get(stage.state) ?? {label: stage.label, count: 0};
    item.count++;
    counts.set(stage.state, item);
  }
  return [...counts.values()];
}

export function safeLink(value) {
  if (typeof value !== 'string') return null;
  if (/^sources\/[a-zA-Z0-9_-]+\.(json|md)$/.test(value)) return value;
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}

export function validateDecisions(issues,records) {
  if(!Array.isArray(issues))throw Error('未判断事項の投影がありません．');
  const ids=new Set(),codes=new Set(records.map(record=>record.code));
  for(const issue of issues) {
    if(!issue.id || ids.has(issue.id) || !codes.has(issue.code))throw Error('未判断事項の識別子又は県参照が不正です．');
    ids.add(issue.id);
    for(const key of ['name','programId','programName','question','type','typeLabel'])if(typeof issue[key]!=='string'||!issue[key].trim())throw Error('未判断事項の必須情報がありません．');
    for(const key of ['evidence','recommendation'])if(!Array.isArray(issue[key])||!issue[key].length||issue[key].some(value=>typeof value!=='string'||!value.trim()))throw Error('未判断事項の根拠又は推奨案がありません．');
  }
  return issues;
}

export function filterDecisions(issues,{query='',type=''}={}) {
  const normalize=value=>value.normalize('NFKC').replace(/\s/g,'').toLocaleLowerCase('ja');
  const needle=normalize(query);
  return issues.filter(issue=>(!type||issue.type===type)&&(!needle||normalize([issue.name,issue.programName,issue.question,...issue.evidence,...issue.recommendation].join(' ')).includes(needle)));
}

export function decisionCounts(issues) {
  return {prefectures:new Set(issues.map(issue=>issue.code)).size,programs:new Set(issues.map(issue=>issue.code+':'+issue.programId)).size,issues:issues.length};
}

export function emptyMessage(total,visible) {
  return total===0?'未判断事項は0件です．今回ユーザーへ求める追加判断はありません．診断反映・公開の承認状態とは別です．':visible===0?'検索条件に合う未判断事項はありません．絞込を解除してご確認ください．':'';
}
