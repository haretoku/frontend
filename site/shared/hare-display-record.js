import {stringContentRecordIds} from '../simulator/src/common-diagnostic-extract.js';
// 表示専用表の階層・文章・配列順を描画する．意味の解釈・計算は行わない．
const TABLE_VERSION = 'hare-display-equipment-branches-trial/2';

function node(document, tag, text, className) {
  const element = document.createElement(tag);
  if (text != null) element.textContent = text;
  if (className) element.className = className;
  return element;
}

function checkItems(items, stringContent = false) {
  if (!Array.isArray(items)) throw new Error('表示項目の配列がありません．');
  const valueRefs = new Set();
  const procedureOccurrences = new Map();
  for (const item of items) {
    if (!item.category || !item.label || !item.source_item_ids?.length || !item.content?.length)
      throw new Error('表示項目の契約が不完全です．');
    if (item.source_value_ids !== undefined) {
      if (item.source_item_ids.length !== 1 || !Array.isArray(item.source_value_ids) || !item.source_value_ids.length)
        throw new Error('値単位の参照が不完全です．');
      for (const id of item.source_value_ids) {
        const ref = JSON.stringify([item.source_item_ids[0], id]);
        if (typeof id !== 'string' || !id) throw new Error('手続値の参照が不正です．');
        if(valueRefs.has(ref)){const previous=procedureOccurrences.get(ref);if(item.source_item_ids[0]!=='application.steps'||!previous||previous.some(p=>p.subgroup===item.subgroup||!((item.content.length<=p.content.length?p.content:item.content).some((_,i,a)=>JSON.stringify(a.slice(i,i+Math.min(p.content.length,item.content.length)))===JSON.stringify(item.content.length<=p.content.length?item.content:p.content)))||p.label!==item.label)||!['導入前','工事中','工事完了後'].includes(item.subgroup))throw new Error('手続値の参照が不正，又は重複しています．');}
        if(item.source_item_ids[0]==='application.steps'){const rows=procedureOccurrences.get(ref)??[];rows.push({subgroup:item.subgroup,content:item.content,label:item.label});procedureOccurrences.set(ref,rows);}
        valueRefs.add(ref);
      }
    }
    if (item.source_value_refs !== undefined) {
      if (!Array.isArray(item.source_value_refs) || !item.source_value_refs.length) throw new Error('辞書値参照が空です．');
      for (const selector of item.source_value_refs) {
        if (!selector || Object.keys(selector).sort().join(',') !== 'item_id,ref' || !item.source_item_ids.includes(selector.item_id) || typeof selector.ref !== 'string' || !selector.ref) throw new Error('辞書値参照の閉形又は所属が不正です．');
        const identity = JSON.stringify([selector.item_id, selector.ref]);
        if (valueRefs.has(identity)) throw new Error('辞書値参照が重複しています．');
        valueRefs.add(identity);
      }
    }
    if(stringContent){if(item.content.some(text=>typeof text!=='string'||!text))throw Error('新本文は非空文字列配列に限ります．');continue;}
    if(item.content.some(content=>typeof content==='string'))throw Error('旧表示scopeへ新本文を混入できません．');
    for (const content of item.content) {
      if (content.heading !== undefined && (typeof content.heading !== 'string' || !content.heading))
        throw new Error('表示本文の見出しが不正です．');
      if (content.type === 'paragraph' || content.type === 'formula') {
        if (typeof content.text !== 'string' || !content.text) throw new Error('表示文がありません．');
      } else if (content.type === 'list') {
        if (!Array.isArray(content.items) || content.items.some(text => typeof text !== 'string'))
          throw new Error('箇条書きの契約が不完全です．');
      } else throw new Error('未対応の表示形式です．');
    }
  }
}

export function receiveHareDisplayRecords(data, table, binding) {
  if (table.version !== TABLE_VERSION || binding.version !== 'hare-display-binding-trial/1')
    throw new Error('表示表の形式版が一致しません．');
  if (table.source.sha256 !== binding.source_sha256 ||
      table.source.sha256 !== data.common_branch_trial?.source_sha256 ||
      binding.public_data_version !== data.data_version)
    throw new Error('表示表と画面のデータ版が一致しません．');
  const bySource = new Map();
  for (const record of table.records) {
    if (bySource.has(record.record_id)) throw new Error('表示制度IDが重複しています．');
    const stringContent=stringContentRecordIds.includes(record.record_id);
    checkItems(record.common.items,stringContent);
    const branchIds = new Set();
    for (const branch of record.branches) {
      if (!branch.branch_id || branchIds.has(branch.branch_id)) throw new Error('表示設備IDが不正です．');
      branchIds.add(branch.branch_id); checkItems([branch.base_amount],stringContent); checkItems(branch.items,stringContent);
      const additionIds = new Set();
      for (const addition of branch.subbranches) {
        if (!addition.subbranch_id || additionIds.has(addition.subbranch_id)) throw new Error('表示加算IDが不正です．');
        additionIds.add(addition.subbranch_id); checkItems(addition.items,stringContent);
      }
    }
    bySource.set(record.record_id, record);
  }
  const byFrontend = new Map();
  for (const entry of binding.records) {
    const record = bySource.get(entry.source_record_id);
    const scheme = data.subsidy_schemes.find(scheme => scheme.record_id === entry.frontend_record_id);
    if (!record || !scheme || byFrontend.has(entry.frontend_record_id) ||
        record.scheme_name !== scheme.scheme_name || record.target_year !== scheme.target_year)
      throw new Error('表示制度の明示対応が一致しません．');
    const originalBranches=(scheme.diagnostic_rules??[]).flatMap(rule=>{const c=rule.common_branch_calculation;return c?.source_record_id===record.record_id?(c.branch_contracts??[c]).map(child=>child.branch):[];});
    for(const branch of record.branches)if(branch.source_branch_id!==undefined){
      const originals=originalBranches.filter(b=>b.branch_id===branch.source_branch_id);
      if(typeof branch.source_branch_id!=='string'||originals.length!==1)throw Error('元計算設備参照が同制度で一意に解決しません．');
      const source=originals[0],id=branch.branch_id;
      const housing=id===source.branch_id+'::housing'&&source.target_equipment.some(t=>['住宅全体','住宅改修','住宅建設'].includes(t));
      const sub=source.subbranches.some(s=>s.subbranch_id===id&&s.base_branch_id===source.branch_id);
      const prefix=source.branch_id+'::',ref=id.startsWith(prefix)?id.slice(prefix.length):null;
      const work=ref!==null&&source.items['calculation.references']?.value[ref]?.work_classification!==undefined&&branch.base_amount?.source_value_refs?.some(v=>v.item_id==='calculation.references'&&v.ref===ref);
      if(!housing&&!sub&&!work)throw Error('表示費目が元owner内の住宅又は成分へ所属しません．');
    }
    byFrontend.set(entry.frontend_record_id, record);
  }
  if (byFrontend.size !== bySource.size) throw new Error('未接続の表示制度があります．');
  return byFrontend;
}

function appendItem(document, parent, item, showLabel = true) {
  const section = node(document, 'div', null, 'hare-display-item');
  if (showLabel && item.label !== item.category && item.label !== item.subgroup)
    section.append(node(document, 'p', item.label, 'hare-display-label'));
  if(item.content.every(text=>typeof text==='string')){const list=node(document,'ul',null,'hare-display-list');for(const text of item.content)list.append(node(document,'li',text));section.append(list);parent.append(section);return;}
  for (const content of item.content) {
    if (content.heading) section.append(node(document, 'p', content.heading, 'hare-display-label'));
    if (content.type === 'list') {
      const list = node(document, 'ul', null, 'hare-display-list');
      for (const text of content.items) list.append(node(document, 'li', text));
      section.append(list);
    } else {
      section.append(node(document, 'p', content.text,
        content.type === 'formula' ? 'hare-display-formula' : 'hare-display-text'));
    }
  }
  parent.append(section);
}

function appendItems(document, parent, items) {
  let category = '', subgroup = '', previousItemHeading = null;
  for (const item of items) {
    if (item.category !== category) {
      category = item.category; subgroup = '';
      parent.append(node(document, 'h5', category, 'hare-display-category'));
    }
    if ((item.subgroup || '') !== subgroup) {
      subgroup = item.subgroup || '';
      if (subgroup) parent.append(node(document, 'h6', subgroup, 'hare-display-subgroup'));
    }
    const itemHeading = item.source_item_ids.length === 1
      ? JSON.stringify([item.category, item.subgroup || '', item.source_item_ids[0], item.label]) : null;
    appendItem(document, parent, item, itemHeading === null || itemHeading !== previousItemHeading);
    previousItemHeading = itemHeading;
  }
}

function fold(document, heading, open = false) {
  const details = node(document, 'details', null, 'data-branch-detail hare-display-fold');
  details.open = open;
  details.append(node(document, 'summary', heading));
  return details;
}

export function appendHareDisplayCommon(document, parent, common, heading = `${common.heading}の条件・手続`) {
  const shared = fold(document, heading);
  shared.className += ' hare-display-common';
  appendItems(document, shared, common.items); parent.append(shared);
}

export function appendHareDisplayBranch(document, parent, branch, {foldHousing=false}={}) {
  const housing=foldHousing&&['住宅（新築）','住宅（改修）'].includes(branch.heading);
  const equipment = housing?fold(document,branch.heading):node(document, 'section', null, 'hare-display-branch');
  if(housing){equipment.classList.add('hare-display-branch','hare-display-housing');equipment.firstElementChild.classList.add('hare-display-equipment');}
  else {
    const heading = node(document, 'h5', branch.heading, 'hare-display-equipment');
    if (branch.heading === '地中熱設備') heading.classList.add('hare-display-secondary-equipment');
    equipment.append(heading);
  }
  if (branch.base_amount) appendItem(document, equipment, branch.base_amount);
  if (branch.items.length) {
    const detail = fold(document, '詳細（条件・対象費用など）');
    appendItems(document, detail, branch.items); equipment.append(detail);
  }
  if (branch.subbranches.length) {
    const additions = fold(document, '加算');
    for (const addition of branch.subbranches) {
      const child = fold(document, addition.heading);
      appendItems(document, child, addition.items); additions.append(child);
    }
    equipment.append(additions);
  }
  parent.append(equipment);
}
