import {selectSchemeGroups} from '../../data/src/scheme-model.js';
import {amountSummary, equipmentLabel} from '../../data/src/model.js';
import {diagnosticPilotTerms, diagnosticAmountPolicy} from './diagnostic-display-pilot.js';

const cachedTerms = new WeakMap();

// Read the same explicit branch/rule binding and reviewed prose as the data listing.
// These fields never supply calculator values or change eligibility.
export function subsidyTermsIndex(data, input) {
  let regions = cachedTerms.get(data);
  if (!regions) { regions = new Map(); cachedTerms.set(data, regions); }
  const key = JSON.stringify([input.prefecture_code, input.municipality_code || '']);
  if (regions.has(key)) return regions.get(key);
  const index = new Map();
  for (const program of selectSchemeGroups(data, input.prefecture_code, input.municipality_code || '').flat()) {
    const ids = program._catalog?.diagnostic_rule_ids || program._catalog?.diagnostic_program_ids || [program.id];
    const policy = diagnosticAmountPolicy(data, program);
    const pilot = policy ? null : diagnosticPilotTerms(data, program);
    const terms = {branchId:program.id, label:equipmentLabel(program), text:policy ? '' : pilot?.text || amountSummary(program), evidenceStatus:program._catalog?.amount?.evidence_status};
    if (policy) terms.displayPolicy = policy;
    if (pilot) { terms.pilotEquipment = pilot.equipment; terms.pilotSupplement = pilot.supplement; terms.pilotSections = pilot.sections; terms.pilotCommonSupplement = pilot.commonSupplement; }
    for (const id of ids) {
      const entries = index.get(id) || [];
      if (!entries.some(entry => entry.branchId === terms.branchId)) entries.push(terms);
      index.set(id, entries);
    }
  }
  regions.set(key, index);
  return index;
}

export function subsidyAmountFields(row, index) {
  const terms = index.get(row.id) || [];
  const institutionText = terms.length
    ? terms.map(term => (terms.length > 1 ? term.label + '：' : '') + term.text).join('／')
    : '表示内容を整理中';
  return {
    institutionText,
    institutionStatus: terms.length && terms.every(term => term.displayPolicy) ? 'not_displayed' : terms.length ? terms.every(term => term.evidenceStatus === 'unconfirmed') ? 'unconfirmed' : institutionText.includes('表示内容を整理中') ? 'preparing' : 'available' : 'preparing',
    includedAmountYen: row.included ? Number.isFinite(row.amount_yen) ? row.amount_yen : null : 0,
    referenceAmountYen: !row.included && Number.isFinite(row.amount_yen) && row.amount_yen > 0 ? row.amount_yen : null,
    inputAmountPending: !row.included && !Number.isFinite(row.amount_yen) && /unconfirmed|unresolved|unavailable|missing|not_verified|not_found/.test(row.reason_code || '')
  };
}

export function subsidyAmountPolicy(row, index) {
  if (row.included) return null;
  const terms = index.get(row.id) || [];
  return terms.length === 1 ? terms[0].displayPolicy || null : null;
}
