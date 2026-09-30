// Receive scheme contracts while keeping the accepted 11.x path unchanged.
// Rules come from scheme records, never from compatibility flat arrays.
const received = new WeakMap();
export function resolveSchemeRecordId(data, recordId) {
  const parents = new Set(data.subsidy_schemes.map(scheme => scheme.record_id));
  const aliases = data.subsidy_scheme_links.record_id_aliases || {};
  for (const [oldId, currentId] of Object.entries(aliases)) {
    if (parents.has(oldId) || !parents.has(currentId) || Object.hasOwn(aliases,currentId)) {
      throw new Error('旧制度年度IDの直接対応が不正です．');
    }
  }
  return parents.has(recordId) ? recordId : (Object.hasOwn(aliases,recordId) ? aliases[recordId] : null);
}
export function usesSchemeContract(data) {
  return Object.hasOwn(data,'subsidy_schemes') || Number(String(data.schema_version).split('.')[0]) >= 12;
}
export function prepareSubsidyData(data) {
  if (!usesSchemeContract(data)) return data;
  if (received.has(data)) return received.get(data);
  const rules=receiveSchemeRules(data);
  const prepared={...data,diagnostic_subsidy_programs:rules.diagnostic,municipal_subsidy_programs:rules.municipal};
  received.set(data,prepared);received.set(prepared,prepared);
  return prepared;
}
export function receiveSchemeRules(data) {
  if (!Array.isArray(data.subsidy_schemes) || !data.subsidy_scheme_links) {
    throw new Error('制度年度単位の契約がありません．');
  }
  const links = data.subsidy_scheme_links;
  resolveSchemeRecordId(data, null);
  const parents = new Map();
  for (const scheme of data.subsidy_schemes) {
    if (!scheme.record_id || parents.has(scheme.record_id)) throw new Error('制度年度IDが重複又は欠落しています．');
    const ids = scheme.branches.map(branch => branch.branch_id);
    if (new Set(ids).size !== ids.length) throw new Error('制度内の区分IDが重複しています．');
    parents.set(scheme.record_id, scheme);
  }
  function receive(kind, field, orderKey, unassigned = []) {
    const rules = new Map();
    function add(rule, parent) {
      if (rules.has(rule.id)) throw new Error('規則IDが重複しています．');
      const ref = links[kind]?.[rule.id];
      if (!ref || ref.record_id !== parent) throw new Error('規則の親参照が一致しません．');
      if (parent !== null) {
        const branches = parents.get(parent).branches;
        const idField = kind === 'diagnostic' ? 'diagnostic_rule_ids' : 'legacy_municipal_rule_ids';
        const actual = branches.filter(b => (b[idField] || []).includes(rule.id)).map(b => b.branch_id).sort();
        const expected = [...ref.branch_ids].sort();
        if (!actual.length || JSON.stringify(actual) !== JSON.stringify(expected)) throw new Error('規則の区分参照が一致しません．');
      } else if (ref.branch_ids.length) {
        const binding=links.retained_diagnostic_bindings?.[rule.id];
        if(kind!=='diagnostic'||!Array.isArray(binding)||new Set(binding).size!==binding.length||JSON.stringify([...binding].sort())!==JSON.stringify([...ref.branch_ids].sort()))throw new Error('保留規則の明示区分参照が一致しません．');
        for(const id of binding){
          const retained=(links.retained_branches||[]).filter(r=>r.branch_id===id&&r.record_id===null);
          const rows=(data.subsidy_catalog?.rows||[]).filter(r=>r.branch_id===id);
          if(retained.length!==1||rows.length!==1||retained[0].catalog_branch_id!==id||!retained[0].diagnostic_rule_ids?.includes(rule.id)||!rows[0].diagnostic_program_ids?.includes(rule.id)||rows[0].prefecture_code!==rule.prefecture_code||rows[0].municipality_code!==rule.municipality_code||[...parents.values()].some(p=>p.branches.some(b=>b.branch_id===id)))throw new Error('保留規則の掲載枝結合が不正です．');
        }
      }
      rules.set(rule.id, rule);
    }
    for (const scheme of parents.values()) for (const rule of scheme[field]) add(rule, scheme.record_id);
    for (const rule of unassigned) add(rule, null);
    const order = links[orderKey];
    if(kind==='diagnostic')for(const [id,binding] of Object.entries(links.retained_diagnostic_bindings||{})){
      const ref=links.diagnostic?.[id];
      if(!rules.has(id)||ref?.record_id!==null||!Array.isArray(binding)||!binding.length||JSON.stringify([...binding].sort())!==JSON.stringify([...ref.branch_ids].sort()))throw new Error('保留規則の明示区分参照が不正です．');
    }
    if (!Array.isArray(order) || new Set(order).size !== order.length || order.length !== rules.size || Object.keys(links[kind]).length !== rules.size) throw new Error('規則順序又は対応表の件数が一致しません．');
    return order.map(id => {
      if (!rules.has(id)) throw new Error('順序表の規則が見つかりません．');
      return rules.get(id);
    });
  }
  return {
    diagnostic: receive('diagnostic', 'diagnostic_rules', 'diagnostic_rule_order', links.unassigned_diagnostic_rules || []),
    municipal: receive('legacy_municipal', 'legacy_municipal_rules', 'legacy_municipal_rule_order')
  };
}

// Parent identity is authoritative. Only explicitly retained, unassigned branches
// may read the temporary compatibility catalog; names/URLs never identify a scheme.
export function receiveSchemeListing(data) {
  const groups = data.subsidy_schemes.map(scheme => ({
    record_id: scheme.record_id,
    target_year: scheme.target_year,
    scheme_name: scheme.scheme_name,
    government_level: scheme.government_level,
    prefecture_code: scheme.prefecture_code,
    municipality_code: scheme.municipality_code,
    branches: scheme.branches
  }));
  const parentIds = new Set();
  const branchIds = new Set();
  for (const group of groups) {
    if (!group.record_id || parentIds.has(group.record_id)) throw new Error('一覧の制度年度IDが重複又は欠落しています．');
    parentIds.add(group.record_id);
    for (const branch of group.branches) {
      if (branchIds.has(branch.branch_id)) throw new Error('一覧の区分IDが複数親へ配置されています．');
      branchIds.add(branch.branch_id);
    }
  }
  const retained = [];
  for (const ref of data.subsidy_scheme_links.retained_branches) {
    if (ref.record_id !== null || branchIds.has(ref.branch_id)) throw new Error('保留区分が親制度と重複しています．');
    const matches = data.subsidy_catalog.rows.filter(row => row.branch_id === ref.catalog_branch_id);
    if (matches.length !== 1 || matches[0].branch_id !== ref.branch_id) throw new Error('保留区分の表示情報を特定できません．');
    branchIds.add(ref.branch_id);
    retained.push({reference:ref,row:matches[0]});
  }
  return {groups,retained};
}
