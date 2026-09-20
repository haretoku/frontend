import {validateRows, validateDecisions, filterDecisions, decisionCounts, emptyMessage, safeLink, excludedFields, excludedFieldLabels} from './model.js';

const el = (tag, text, className) => {
  const element = document.createElement(tag);
  if (text != null) element.textContent = text;
  if (className) element.className = className;
  return element;
};
const link = (href, label) => {
  const safe = safeLink(href);
  if (!safe) return el('span', `${label}（参照先未確認）`);
  const node = el('a', label); node.href = safe; node.target = '_blank'; node.rel = 'noopener noreferrer'; return node;
};

function stageNode(stage, title) {
  const node = el('div', undefined, 'stage');
  if (title) node.append(el('strong', title), document.createTextNode(' '));
  node.append(el('span', stage.label, 'badge'));
  for (const note of stage.notes ?? []) node.append(el('small', note));
  if (stage.details?.length) {
    const details = el('details'); details.append(el('summary', '対象・判定根拠'));
    for (const item of stage.details) details.append(el('p', item, 'note'));
    node.append(details);
  }
  return node;
}

function valueNode(value) {
  if (value == null || value === '') return el('span', '未確認');
  if (typeof value === 'boolean') return el('span', value ? 'はい' : 'いいえ');
  if (Array.isArray(value)) {
    if (!value.length) return el('span', '記載なし');
    const list = el('ul');
    for (const item of value) { const li = el('li'); li.append(valueNode(item)); list.append(li); }
    return list;
  }
  if (typeof value === 'object') {
    const list = el('dl');
    const labels = {...excludedFieldLabels,label:'対象',date:'日付',branch_id:'枝ID',reason:'理由',status:'状態',scope:'範囲',amount_yen:'金額（円）'};
    for (const [key, item] of Object.entries(value)) { const dd = el('dd'); dd.append(valueNode(item)); list.append(el('dt', labels[key] ?? key), dd); }
    return list;
  }
  return typeof value === 'string' && /^https?:\/\//.test(value) ? link(value, value) : el('span', String(value));
}

function auditDetails(record) {
  const details = el('details'); details.append(el('summary', '制度別の内容・除外理由を読む'));
  if (!record.audit) { details.append(el('p', '県別監査資料は未確認です．')); return details; }
  const audit = record.audit;
  details.append(el('p', '以下は収集正本の記載です．「採用した条件」も収集時の整理であり，今回のユーザー承認又は診断への採用済みを意味しません．', 'note'));
  if (!audit.records?.length) details.append(el('p', '主表に載せた制度は0件です．調査範囲と除外した制度の理由をあわせて確認してください．'));
  for (const program of audit.records ?? []) {
    const article = el('article'); article.append(el('h3', program.scheme_name));
    const fields = el('dl');
    for (const column of audit.columns ?? []) {
      const dd = el('dd'); dd.append(valueNode(program[column.key])); fields.append(el('dt', column.label), dd);
    }
    article.append(fields); details.append(article);
  }
  for (const program of record.excludedPrograms ?? []) {
    const article = el('article'); article.append(el('h3', program.scheme_name ?? program.label ?? '主表から除外した制度'));
    article.append(el('p', program.reason ?? program.rationale ?? '除外理由の記載を正本で確認してください．'));
    const fields = excludedFields(program), list = el('dl');
    for(const field of fields.displayed) {const dd=el('dd');dd.append(valueNode(field.value));list.append(el('dt',field.label),dd);}
    article.append(list);
    if(Object.keys(fields.internal).length){const internal=el('details');internal.append(el('summary','内部参照を含む監査記録（原形式）'),el('pre',JSON.stringify(fields.internal,null,2)));article.append(internal);}
    details.append(article);
  }
  if (record.excludedPrograms?.length === 0) details.append(el('p', '除外制度の記録はありません．'));
  return details;
}

function sourceNodes(sources) {
  const node=el('div');
  for(const source of sources ?? []) {
    node.append(link(source.url,source.label));
    if(source.retrievalStatus)node.append(el('small', '取得状況：'+source.retrievalStatus));
    if(source.locator)node.append(el('small','確認箇所：'+source.locator));
    if(source.checkedAt)node.append(el('small','確認・取得試行日：'+source.checkedAt));
    node.append(el('br'));
  }
  return node;
}

function decisionNode(issue, records) {
  const row=el('tr');
  const cell=(label,node)=>{const td=el('td');td.dataset.label=label;td.append(node);row.append(td);};
  const subject=el('div');subject.append(el('strong',issue.name),el('p',issue.programName),el('small',issue.typeLabel));
  cell('県・制度',subject);
  const question=el('div');question.append(valueNode(issue.question));if(issue.dependency)question.append(el('small','前の判断で算入する場合のみ確認します．'));if(issue.why)question.append(el('small',issue.why));cell('何を決められなかったか',question);
  const evidence=el('div');evidence.append(valueNode(issue.evidence));const sources=el('details');sources.append(el('summary','公式資料・確認箇所'),sourceNodes(issue.sources));evidence.append(sources);
  const record=records.find(record=>record.code===issue.code);
  if(record){const anchor=el('a','県別の監査原本・全項目へ');anchor.href='#audit-'+record.code;anchor.addEventListener('click',()=>{document.querySelector('#archive').open=true;document.querySelector('#audit-'+record.code).open=true;});evidence.append(anchor);}
  cell('確認済み根拠',evidence);
  const recommendation=el('div');recommendation.append(valueNode(issue.recommendation));if(issue.recommendationDetails?.length){const detail=el('details');detail.append(el('summary','推奨の条件・理由'),valueNode(issue.recommendationDetails));recommendation.append(detail);}if(issue.options?.length){const options=el('details');options.append(el('summary','選択肢を確認する'),valueNode(issue.options));recommendation.append(options);}cell('AI推奨案',recommendation);
  return row;
}

function archiveNode(record) {
  const details=el('details');details.id='audit-'+record.code;
  details.append(el('summary',record.code+' '+record.name));
  details.append(stageNode(record.stages.collection),stageNode(record.stages.review1),stageNode(record.stages.delivery));
  details.append(sourceNodes(record.sources),auditDetails(record));
  return details;
}

try {
  const response = await fetch('data.json', {cache: 'no-store'});
  if (!response.ok) throw new Error('正本を取得できません．');
  const data = await response.json();
  const records=validateRows(data.records), issues=validateDecisions(data.decisions,records);
  const totals=decisionCounts(issues);
  document.querySelector('#version').textContent=data.versionLabel;
  document.querySelector('#total').textContent=totals.prefectures+'県 ／ '+totals.programs+'制度 ／ '+totals.issues+'論点';
  document.querySelector('#counts').textContent='判断済みとして除外：'+data.decisionSummary.excludedPrograms+'制度レコード（主表・主表外を含む監査件数）．全論点を除外した県：'+data.decisionSummary.excludedPrefectures+'県．事実不足'+data.decisionSummary.excludedFactualGaps+'件は監査に保留し，解決済みとは扱いません．';
  document.querySelector('#archive-count').textContent='47都道府県の原本・調査範囲を確認する';
  document.querySelector('#archive-rows').replaceChildren(...records.map(archiveNode));
  const history=document.querySelector('#decision-history');history.hidden=!data.decisionHistory?.length;
  document.querySelector('#history-rows').replaceChildren(...(data.decisionHistory??[]).map(item=>{const article=el('article');article.append(el('h3',item.prefecture_name+' '+item.program_name),el('p','公式事実：'+item.official_fact),el('p','承認済み評価仮定：'+item.approved_model_assumption),el('small','ユーザー承認日：'+item.decided_at));return article;}));
  const query=document.querySelector('#query'),type=document.querySelector('#type');
  for(const [value,label] of new Map(issues.map(issue=>[issue.type,issue.typeLabel]))) {const option=el('option',label);option.value=value;type.append(option);}
  const render=()=>{
    const selected=filterDecisions(issues,{query:query.value,type:type.value}),count=decisionCounts(selected);
    document.querySelector('#rows').replaceChildren(...selected.map(issue=>decisionNode(issue,records)));
    document.querySelector('#visible-count').textContent=count.prefectures+'県 ／ '+count.programs+'制度 ／ '+count.issues+'論点を表示（全'+totals.issues+'論点）';
    const empty=document.querySelector('#empty');empty.hidden=selected.length>0;empty.textContent=emptyMessage(issues.length,selected.length);
    document.querySelector('#decision-table').hidden=selected.length===0;
  };
  document.querySelector('#filters').addEventListener('input',render);
  document.querySelector('#filters').addEventListener('submit',event=>event.preventDefault());
  document.querySelector('#filters').addEventListener('reset',event=>{event.preventDefault();query.value='';type.value='';render();});
  render();
} catch (error) {
  const node=document.querySelector('#error');node.hidden=false;node.textContent='表示を停止しました．'+error.message;
}
