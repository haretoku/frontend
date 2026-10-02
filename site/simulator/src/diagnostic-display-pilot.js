import {diagnosticDisplayPilot} from './diagnostic-display-pilot.generated.js';

function canonical(value) {
  if (Array.isArray(value)) return '[' + value.map(canonical).join(',') + ']';
  if (value && typeof value === 'object') return '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonical(value[key])).join(',') + '}';
  return JSON.stringify(value);
}

// Use the backend derivative only while its complete source branch/rule binding matches.
// On any change, retain the received source prose. Nothing here supplies calculator values.
function boundExpected(data, program, collection) {
  const expected = collection[program.id];
  if (!expected || data.schema_version !== diagnosticDisplayPilot.schemaVersion || data.data_version !== diagnosticDisplayPilot.dataVersion) return null;
  if (program.prefecture_code !== expected.prefecture || program.municipality_code !== expected.municipality || program.record_id !== expected.recordId) return null;
  const {record_id, target_year, conditions, ...branch} = program._catalog || {};
  if (record_id !== expected.recordId || target_year !== expected.targetYear || canonical(branch) !== canonical(expected.branch) || canonical(program._legacy) !== canonical(expected.rules)) return null;
  const catalog = data.subsidy_catalog.rows.find(row => row.branch_id === program.id);
  if (canonical(catalog?.amount) !== canonical(expected.catalogAmount)) return null;
  return expected;
}

export function diagnosticPilotTerms(data, program) {
  const expected = boundExpected(data, program, diagnosticDisplayPilot.entries);
  return expected ? {text:expected.text, supplement:expected.supplement, equipment:expected.equipment, sections:expected.sections, commonSupplement:expected.commonSupplement, conditionDisplayComplete:expected.conditionDisplayComplete === true} : null;
}

export function diagnosticAmountPolicy(data, program) {
  if (!diagnosticDisplayPilot.displayPolicies?.[program.id]) return null;
  const expected = boundExpected(data, program, diagnosticDisplayPilot.displayPolicies);
  return expected?.policy || {kind:'source_review_required',notice:'制度の金額情報を確認中です．公式窓口でご確認ください．'};
}

export function diagnosticPilotNotice(row, index) {
  if (!row.included) return '';
  const terms = index.get(row.id) || [];
  if (!terms.length || !terms.every(term => term.pilotEquipment)) return '';
  return '※適用条件を満たすと仮定した概算です．申請前に，公式窓口または施工業者を通じて適用可否をご確認ください．';
}

export function diagnosticPilotSupplement(row, index) {
  const terms = index.get(row.id) || [];
  if (terms.length !== 1 || !terms[0].pilotEquipment) return '';
  return (terms[0].pilotSupplement || []).join('\n');
}

export function diagnosticPilotSections(row, index) {
  const terms = index.get(row.id) || [];
  return terms.length && terms.every(term => term.pilotSections?.length)
    ? terms.flatMap(term => term.pilotSections) : [];
}

export function diagnosticPilotCommonSupplement(row, index) {
  const terms = index.get(row.id) || [];
  return terms.length && terms.every(term => term.pilotSections?.length)
    ? [...new Set(terms.flatMap(term => term.pilotCommonSupplement || []))] : [];
}

export function diagnosticTrialSourceTexts(data, ruleId) {
  const reviewed = {...diagnosticDisplayPilot.entries, ...diagnosticDisplayPilot.held};
  const catalog = new Map(data.subsidy_catalog.rows.map(row => [row.branch_id, row]));
  return (data.subsidy_schemes || []).flatMap(scheme => scheme.branches.map(branch => ({scheme, branch})))
    .filter(({branch}) => reviewed[branch.branch_id] && branch.diagnostic_rule_ids.includes(ruleId))
    .map(({scheme, branch}) => {
      if (branch.amount?.display_text) return branch.amount.display_text;
      const expected = diagnosticDisplayPilot.entries[branch.branch_id];
      if (!expected || data.schema_version !== diagnosticDisplayPilot.schemaVersion || data.data_version !== diagnosticDisplayPilot.dataVersion || scheme.record_id !== expected.recordId || scheme.target_year !== expected.targetYear || scheme.prefecture_code !== expected.prefecture || scheme.municipality_code !== expected.municipality || canonical(branch) !== canonical(expected.branch) || canonical(catalog.get(branch.branch_id)?.amount) !== canonical(expected.catalogAmount) || canonical(branch.diagnostic_rule_ids.map(id=>scheme.diagnostic_rules.find(rule=>rule.id===id))) !== canonical(expected.rules)) return null;
      if (expected.savedSourceDetails) return expected.catalogAmount.raw_text;
      return [...expected.sections.flatMap(section => [section.text, ...section.supplement]), ...expected.commonSupplement].join('\n');
    })
    .filter(Boolean);
}

export function diagnosticDetailNotes(data, program, notes) {
  const expected = Object.values(diagnosticDisplayPilot.displayPolicies || {}).find(entry => entry.branch.diagnostic_rule_ids.includes(program.id));
  if (!expected) return notes;
  const scheme = (data.subsidy_schemes || []).find(s => s.branches.some(b => b.branch_id === expected.branch.branch_id));
  const branch = scheme?.branches.find(b => b.branch_id === expected.branch.branch_id);
  if (!branch) return ['制度の金額情報を確認中です．公式窓口でご確認ください．'];
  const native = {id:branch.branch_id,prefecture_code:scheme.prefecture_code,municipality_code:scheme.municipality_code,record_id:scheme.record_id,
    _catalog:{...branch,record_id:scheme.record_id,target_year:scheme.target_year},
    _legacy:branch.diagnostic_rule_ids.map(id => scheme.diagnostic_rules.find(rule => rule.id === id))};
  return [diagnosticAmountPolicy(data,native).notice];
}
