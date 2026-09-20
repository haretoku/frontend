import { summarize, matches, safeOfficialUrl, auditNotice, unjudgedRecords, unjudgedExclusions, explorationSummary, latestSources, recommendation, unresolvedAmountBranches, reviewReasons, mixedUnresolvedCount, resolutionSummary, pendingResolution, pendingResolutionWithoutBranchesCount } from './model.js';

const el = (tag, text, className) => {
  const node = document.createElement(tag);
  if (text !== undefined && text !== null) node.textContent = text;
  if (className) node.className = className;
  return node;
};
const field = (list, title, value) => list.append(el('dt', title), el('dd', value ?? '未確認'));
const link = (url, label) => {
  const href = safeOfficialUrl(url);
  if (!href) return el('span', 'URL未特定');
  const node = el('a', label || href);
  node.href = href; node.target = '_blank'; node.rel = 'noopener noreferrer';
  return node;
};
const equipmentNames = { solar: '太陽光', battery: '定置用蓄電池', appliances: '家電', group_purchase: '共同購入', ev: '電気自動車', phev: 'プラグインハイブリッド車', fuel_cell: '燃料電池', portable_battery: 'ポータブル蓄電池', air_conditioner: 'エアコン', refrigerator: '冷蔵庫', electricity_switch: '電力切替', living_support: '生活支援', seismic_breaker: '感震ブレーカー' };
const equipment = value => value?.length ? value.map(item => equipmentNames[item] ?? item).join('・') : '未確認';

function componentDetail(component) {
  const unresolved = unresolvedAmountBranches(component);
  const article = el('article');
  article.append(el('h3', component.label));
  const list = el('dl');
  field(list, '対象年度（原記録）', component.fiscal_year == null ? '未確認' : `${component.fiscal_year}年度`);
  field(list, '対象機器・事業', equipment(component.target_equipment));
  field(list, '計算可能性', pendingResolution(component) ? `承認判断の独立検収待ち（原判定：${component.calculation_possibility}）` : unresolved.length ? (component.calculation_possibility === '可能' ? '一部算定可能／以下の範囲のみ未判断' : '以下の範囲が未判断') : `算定不能：${component.calculation_basis}`);
  field(list, '不明項目', reviewReasons(component).join('・'));
  field(list, '受付状態（この成分・原記録の範囲）', component.application_status);
  if (!unresolved.length) field(list, '判断の根拠・留意点', component.rationale);
  field(list, '実装', component.implementation_status);
  article.append(list);
  for (const branch of unresolved) {
    article.append(el('h4', branch.label));
    const branchFields = el('dl');
    field(branchFields, '未判断の範囲', branch.scope);
    field(branchFields, '確認不足', branch.unresolved_reasons.join('・'));
    article.append(branchFields);
  }
  if (component.exclusion_audit && !unresolved.length) {
    const exclusion = component.exclusion_audit;
    const scope = el('dl');
    if (exclusion.scope) field(scope, '非算入判断の対象範囲', exclusion.scope);
    for (const branch of exclusion.unresolved_branches ?? []) field(scope, `未確認の別枝：${branch.label}`, branch.reason);
    if (exclusion.battery_eligibility) field(scope, '蓄電池の対象性', exclusion.battery_eligibility);
    article.append(scope);
  }
  for (const evidence of component.evidence) {
    const block = el('div', undefined, 'source');
    block.append(evidence.official_url ? link(evidence.official_url, evidence.title || '公式資料を開く') : el('span', '保存済み監査記録への参照'));
    block.append(el('small', `元資料確認日：${evidence.source_checked_at ?? '未確認'} ／ ${evidence.evidence_type ?? '記録種別未確認'}`));
    if (evidence.file) block.append(el('small', `原記録：${evidence.file}${evidence.pointer ?? ''}${evidence.selector ? ` ／ ${JSON.stringify(evidence.selector)}` : ''}`));
    if (evidence.location) block.append(el('small', `確認箇所：${evidence.location}`));
    if (evidence.interpretation_status) block.append(el('p', evidence.interpretation_status, 'note'));
    if (evidence.finding && !unresolved.length) block.append(el('small', `確認内容：${evidence.finding}`));
    if (evidence.fields) block.append(el('small', `参照項目：${JSON.stringify(evidence.fields)}`));
    article.append(block);
  }
  return article;
}

function municipalityDetails(record) {
  const review = record.reclassification;
  const details = el('details');
  details.append(el('summary', review.components.length ? `成分・根拠を確認（${review.components.length}成分）` : '根拠の探索記録を確認'));
  details.append(el('small', `再分類日：${review.reviewed_at} ／ ${review.method}`));
  if (!review.components.length) details.append(el('p', review.collection_rationale || '個別制度の根拠は未特定です．探索範囲を架空の制度成分として数えていません．'));
  for (const component of review.components) details.append(componentDetail(component));
  return details;
}

function renderRow(record) {
  const review = record.reclassification;
  const counts = summarize([record]);
  const row = el('tr');
  row.dataset.municipality = record.municipality_name;
  const cell = (label, node) => { const td = el('td'); td.dataset.label = label; td.append(node); row.append(td); return td; };
  const name = el('div'); name.append(el('small', record.prefecture_name), el('strong', record.municipality_name));
  for (const component of review.components) name.append(el('div', component.label));
  name.append(municipalityDetails(record));
  cell('自治体・制度', name);
  const calculation = el('div');
  calculation.append(el('div', `判断・検収待ち ${counts.components}成分`, 'badge pending'));
  for (const component of review.components.filter(pendingResolution)) calculation.append(el('small', `${component.label}：承認判断の独立検収待ち`));
  for (const component of review.components) if (unresolvedAmountBranches(component).length) {
    if (component.calculation_possibility === '可能') calculation.append(el('small', '一部算定可能／以下の範囲のみ未判断'));
    for (const branch of unresolvedAmountBranches(component)) calculation.append(el('small', `${branch.label}：${branch.scope}`));
  }
  const branches = review.components.flatMap(component => component.exclusion_audit?.unresolved_branches ?? []);
  if (branches.length) calculation.append(el('small', `未確認の別枝あり：${branches.map(branch => branch.label).join('・')}（成分の判定範囲外）`));
  const reasons = [...new Set(review.components.flatMap(reviewReasons))];
  if (reasons.length) calculation.append(el('small', `成分の不明項目：${reasons.join('・')}`));
  if (!counts.components) calculation.append(el('small', '個別制度の根拠を特定する段階．成分数には含めません．'));
  cell('判断できない点', calculation);
  const sources = el('div');
  for (const evidence of latestSources(review.components)) {
    sources.append(link(evidence.official_url, evidence.title || '公式根拠を確認'));
    sources.append(el('small', `確認日：${evidence.source_checked_at ?? '未確認'}`));
  }
  cell('確認した根拠', sources);
  const awaitingDecisionReview = review.components.some(pendingResolution);
  cell('AIの推奨対応', el('span', awaitingDecisionReview ? '承認判断の独立検収待ち．追加調査の残件とは区別しています．' : recommendation(reasons)));
  return row;
}

try {
  const response = await fetch('data.json', { cache: 'no-store' });
  if (!response.ok) throw new Error('監査正本を取得できません．');
  const { records: sourceRecords, audit, report } = await response.json();
  const counts = summarize(sourceRecords);
  const exploration = explorationSummary(sourceRecords);
  const records = unjudgedRecords(sourceRecords);
  const displayed = summarize(records);
  const mixed_unresolved_components = mixedUnresolvedCount(records);
  const excluded = unjudgedExclusions(sourceRecords);
  const resolutions = resolutionSummary(sourceRecords);
  const pendingWithoutBranches = pendingResolutionWithoutBranchesCount(records);
  if (counts.impossible !== displayed.impossible + excluded.historical + excluded.implementationNotConfirmed + excluded.other + resolutions.impossible) {
    throw new Error('未判断成分と表外区分の集計が一致しません．');
  }
  if (displayed.components !== displayed.impossible + mixed_unresolved_components + pendingWithoutBranches) throw new Error('未判断成分と一部算定可能成分の集計が一致しません．');
  for (const [actual, expected] of [[counts.municipalities,audit.totals.municipalities],[counts.identified,audit.totals.collected],[counts.unidentified,audit.totals.uncollected],[counts.components,audit.totals.identified_components],[counts.possible,audit.totals.possible_components],[counts.impossible,audit.totals.impossible_components],[counts.possible,counts.nonInclusion+counts.positive],[counts.positive,audit.current_conditional_amount_components]]) {
    if (actual !== expected) throw new Error('明細と正本集計が一致しません．正本の更新内容を確認してください．');
  }
  const notice = auditNotice(audit);
  document.querySelector('#review-date').textContent = notice.date;
  document.querySelector('#review-status').textContent = notice.review;
  if (resolutions.assumptions || resolutions.insufficient) document.querySelector('#review-status').append(document.createTextNode(` 承認仮定による判断解消 ${resolutions.assumptions}成分，資料不足による調査打切り・今回非算入 ${resolutions.insufficient}成分．公式事実の確認完了や制度不存在の確定，診断実装の検収完了を意味しません．`));
  const countText = (selector, number, text) => { const node=document.querySelector(selector); node.append(el('strong', String(number)), document.createTextNode(text)); };
  document.querySelector('#municipality-counts').replaceChildren();
  document.querySelector('#component-counts').replaceChildren();
  countText('#municipality-counts', exploration.unidentified, `自治体 ／ 調査終了 ${exploration.closed}・未終了の探索残件 ${exploration.remaining}．表の成分数には含めません．`);
  document.querySelector('#exploration-note').textContent = '調査終了は，公式一覧・関連部署を確認した範囲で今年度制度を確認できなかったという判断です．制度不存在や0円制度の確定ではありません．';
  countText('#component-counts', displayed.components, `成分 ／ ${records.length}自治体．うち一部算定可能で未判断範囲が残るもの ${mixed_unresolved_components}成分．未判断枝を解消済みで承認判断の検収待ち ${pendingWithoutBranches}成分．枝が複数あっても親成分は1件です．`);
  document.querySelector('#scope-counts').textContent = `原監査の判断済：非算入 ${counts.nonInclusion}成分・条件別算定 ${counts.positive}成分．判断済の範囲は表から除き，未判断枝が残る親成分と承認判断の独立検収待ちを表示します．監査上不能のうち表の対象外：過年度参考 ${excluded.historical}成分・実施未確認による調査終了 ${excluded.implementationNotConfirmed}成分${excluded.other ? `・その他の参照区分 ${excluded.other}成分` : ''}．実施未確認による終了は今回調査の終了・非算入であり，公式の制度不存在や受付終了を意味しません．旧資料・採用実装課題は監査正本に保持しています．`;
  document.querySelector('#report').textContent = report;
  const prefecture = document.querySelector('#prefecture');
  for (const [code, name] of new Map(records.map(record => [record.prefecture_code, record.prefecture_name]))) {
    const option=el('option',name);option.value=code;prefecture.append(option);
  }
  const query=document.querySelector('#query');
  const render = () => {
    const selected=records.filter(record=>matches(record,{prefecture:prefecture.value,query:query.value}));
    const selectedCounts=summarize(selected);
    document.querySelector('#rows').replaceChildren(...selected.map(renderRow));
    document.querySelector('#visible-count').textContent=`未判断対象 ${records.length}自治体・${displayed.components}成分のうち，${selected.length}自治体・${selectedCounts.components}成分を表示`;
    document.querySelector('#empty').hidden=selected.length>0;
    document.querySelector('#empty').textContent=records.length ? '条件に合う自治体はありません．絞込を解除してご確認ください．' : '現在，この表に残る未判断成分はありません．承認仮定と調査打切りの内訳は上の集計をご確認ください．';
  };
  document.querySelector('#filters').addEventListener('submit',event=>event.preventDefault());
  document.querySelector('#filters').addEventListener('input',render);
  document.querySelector('#filters').addEventListener('reset',event=>{
    event.preventDefault();prefecture.value='';query.value='';render();
  });
  render();
} catch (error) {
  const message=document.querySelector('#error');message.hidden=false;message.textContent=`表示を停止しました．${error.message}`;
}
