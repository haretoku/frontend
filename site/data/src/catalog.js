// Adapt received catalog rows to the existing list view; never read backend files.
export function mergeCatalogPrograms(data){return data.diagnostic_subsidy_programs??[];}

export function catalogPeriod(row) {
  // Preserve start/end separately: multiple branches must not form invented intervals.
  const starts = [...new Set((row.application_start || []).map(p=>p.date).filter(Boolean))];
  const ends = [...new Set((row.application_end || []).map(p=>p.date).filter(Boolean))];
  if (starts.length > 1 || ends.length > 1) return '';
  return [starts.length ? '申請開始：'+starts[0] : '',ends.length ? '申請期限：'+ends[0] : ''].filter(Boolean).join('\n');
}
