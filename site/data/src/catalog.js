// Adapt received catalog rows to the existing list view; never read backend files.
export function mergeCatalogPrograms(data) {
  const existing = data.diagnostic_subsidy_programs || [];
  const catalog = data.subsidy_catalog;
  if (!catalog || catalog.scope !== 'municipality' || catalog.display_policy !== 'reviewed_display_text_only') return existing;
  const consumed = new Set();
  const seen = new Set();
  const rows = [];
  for (const row of catalog.rows || []) {
    if (row.government_level !== 'municipality') continue;
    const key = JSON.stringify([row.prefecture_code,row.municipality_code,row.branch_id]);
    if (seen.has(key)) continue;
    seen.add(key);
    const matches = existing.filter(p => p.government_level === 'municipality' && p.prefecture_code === row.prefecture_code && p.municipality_code === row.municipality_code && (row.diagnostic_program_ids || []).includes(p.id));
    matches.forEach(p => consumed.add(p));
    const scope = new Set();
    for (const equipment of row.target_equipment || []) {
      if (equipment.includes('太陽光')) scope.add('solar');
      if (equipment.includes('蓄電池')) scope.add('battery');
    }
    const coarse = {受付中:'accepting',受付対象外:'not_open',不明:'unknown'}[row.application_status] || 'unknown';
    const compatible = {accepting:['accepting','waitlist','accepting_with_waitlist_branch'],not_open:['closed','suspended','not_open','not_applicable'],unknown:['unknown','unconfirmed']}[coarse];
    const statuses = [...new Set(matches.map(p=>p.application_status))];
    const applicationStatus = statuses.length === 1 && compatible.includes(statuses[0]) ? statuses[0] : coarse;
    rows.push({
      id:row.branch_id, government_level:'municipality', prefecture_code:row.prefecture_code,
      municipality_code:row.municipality_code, program_name:row.scheme_name,
      official_urls:row.evidence_urls || [], confirmed_at:row.checked_at,
      expense_scopes:[...scope], application_status:applicationStatus,
      _catalog:row, _legacy:matches
    });
  }
  return [...existing.filter(p=>!consumed.has(p)),...rows];
}

export function catalogPeriod(row) {
  // Preserve start/end separately: multiple branches must not form invented intervals.
  const starts = [...new Set((row.application_start || []).map(p=>p.date).filter(Boolean))];
  const ends = [...new Set((row.application_end || []).map(p=>p.date).filter(Boolean))];
  if (starts.length > 1 || ends.length > 1) return '';
  return [starts.length ? '申請開始：'+starts[0] : '',ends.length ? '申請期限：'+ends[0] : ''].filter(Boolean).join('\n');
}
