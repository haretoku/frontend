import {calculationContext, calculationContexts, extractDiagnosticDisplay} from './common-diagnostic-extract.js';
import {receiveHareDisplayRecords, appendHareDisplayCommon, appendHareDisplayBranch} from '../../shared/hare-display-record.js';
import {loadJson} from '../../../data/src/data-loader.js';

function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  return JSON.stringify(value);
}
async function digest(value) {
  const bytes = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(canonical(value)));
  return Array.from(new Uint8Array(bytes), byte => byte.toString(16).padStart(2, '0')).join('');
}

export async function receiveDiagnosticDisplayRecords(data, table, binding, hare) {
 if(table.version!=='diagnostic-display-equipment-branches-trial/1'||binding.version!=='diagnostic-display-binding/2')throw Error('診断表示表の形式版が一致しません．');
 if(!hare||await digest(hare)!==binding.hare_payload_sha256||await digest(table)!==binding.diagnostic_payload_sha256)throw Error('両表示表の受渡しSHAが一致しません．');
 const identities=new Map();for(const entry of binding.records){const previous=identities.get(entry.frontend_record_id);if(previous&&previous.source_record_id!==entry.source_record_id)throw Error('同制度の原参照対応が一致しません．');identities.set(entry.frontend_record_id,entry);}
 const hareBindings=[...identities.values()];
 const records=receiveHareDisplayRecords(data,hare,{...binding,records:hareBindings,version:'hare-display-binding-trial/1'}),byRule=new Map(),contexts=[];
 for(const entry of binding.records){
  const program=data.diagnostic_subsidy_programs.find(p=>p.id===entry.rule_id),contract=program?.common_branch_calculation,scheme=data.subsidy_schemes.find(s=>s.record_id===entry.frontend_record_id);
  if(!contract||contract.source_record_id!==entry.source_record_id||byRule.has(entry.rule_id)||program.prefecture_code!==scheme?.prefecture_code||(program.municipality_code??null)!==(scheme.municipality_code??null)||contract.source_sha256!==hare.source.sha256||await digest(contract)!==entry.calculation_sha256||canonical(contract.selected_component_ids)!==canonical(entry.selected_component_ids)||!scheme.branches.some(b=>b.branch_id===entry.frontend_branch_id&&b.diagnostic_rule_ids.includes(entry.rule_id)))throw Error('診断表示表と実計算契約の対応が一致しません．');
  const currentContexts=calculationContexts(contract);contexts.push(...currentContexts);const extracted=extractDiagnosticDisplay(hare,currentContexts);if(extracted.records.length!==1)throw Error('診断表示対象が一意に解決しません．');
  byRule.set(entry.rule_id,{record:extracted.records[0],hare,contract,source_sha256:hare.source.sha256,selected_component_ids:entry.selected_component_ids,prefecture_code:scheme.prefecture_code});
 }
 if(canonical(extractDiagnosticDisplay(hare,contexts))!==canonical(table))throw Error('診断表示表がハレトク表の同文型抽出と一致しません．');
 return byRule;
}

export async function loadDiagnosticDisplayRecords(data) {
  const urls = [
    new URL('../../../data/input/diagnostic-display-table.json', import.meta.url),
    new URL('../../../data/input/diagnostic-display-binding.json', import.meta.url),
    new URL('../../../data/input/hare-display-table.json', import.meta.url),
  ];
  const [table, binding, hare] = await Promise.all(urls.map(loadJson));
  return receiveDiagnosticDisplayRecords(data, table, binding, hare);
}

export function appendDiagnosticReceptionNote(document, parent, row, records) {
  if (row.included || !['accepting', 'scheduled', 'unknown', 'unconfirmed'].includes(row.application_status)) return false;
  const entry = records.get(row.id);
  if (!entry) return false;
  if (row.common_branch_source_sha256 && row.common_branch_source_sha256 !== entry.source_sha256)
    throw Error('受付注記と受取済み診断表示表が一致しません．');
  const items = (entry.record.common?.items ?? []).filter(item => item.source_item_ids?.includes('reception.state'));
  if (items.length > 1) throw Error('同制度の受付項目が一意ではありません．');
  const lines = items[0]?.content.slice(1) ?? [];
  if (!lines.length) return false;
  for (const text of lines) {
    const note = document.createElement('p');
    note.className = 'diagnostic-reception-note';
    note.textContent = text;
    parent.append(note);
  }
  return true;
}

export function appendDiagnosticDisplay(document, parent, row, records, calculation) {
  const entry = records.get(row.id);
  if (!entry || !row.included) return false;
  if (row.common_branch_source_sha256 !== entry.source_sha256)
    throw Error('今回の算定成分と診断表示表が一致しません．');
  const currentContexts = entry.contract.version === 'common-equipment-branches-calculation/3' ? calculationContexts(entry.contract, row.used_common_branches) : [calculationContext(entry.contract, row.selected_common_components, row.used_common_refs ?? null)];
  const extracted = extractDiagnosticDisplay(entry.hare, currentContexts);
  if (extracted.records.length !== 1) throw Error('今回の診断表示対象が一意ではありません．');
  const record = extracted.records[0];
  const wrapper = document.createElement('div');
  wrapper.className = 'hare-display-scheme diagnostic-display-record';
  wrapper.dataset.diagnosticDisplayRecord = record.record_id;
  const common = document.createElement('div');
  common.className = 'hare-display-scheme-common';
  if (record.common?.items.length) {
    appendHareDisplayCommon(document, common, record.common, `${record.common.heading}の条件`);
    wrapper.append(common);
  }
  const equipment = document.createElement('div');
  equipment.className = 'hare-display-scheme-equipment';
  for (const branch of record.branches) appendHareDisplayBranch(document, equipment, branch);
  wrapper.append(equipment);
  const notice = document.createElement('p');
  notice.className = 'diagnostic-display-notice';
  notice.textContent = '※適用条件を満たすと仮定した概算です．申請前に，公式窓口または施工業者を通じて適用可否をご確認ください．';
  const detail = document.createElement('a');
  detail.href = '../../data/subsidies/?prefecture=' + encodeURIComponent(entry.prefecture_code);
  detail.textContent = 'この制度の詳しい条件・手続をハレトクデータで見る';
  parent.append(calculation, wrapper, notice, detail);
  return true;
}
