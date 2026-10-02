// Render institutional terms only. The actual included amount is rendered once by the caller.
export function orderedSupplementRows(rows) {
  const order = ['算定対象','出力基準','容量基準','対象出力範囲','対象容量範囲','適用条件','加算','上限','共通上限','端数処理','未確認事項'];
  const rank = row => { const at = order.indexOf(row.match(/^（([^）]+)）/)?.[1]); return at < 0 ? order.length : at; };
  return [...rows].sort((a,b) => rank(a)-rank(b));
}

export function appendInstitutionalAmount(document, item, amounts, sections = [], common = [], policy = null) {
  function paragraph(text, attribute, parent = item) {
    const node = document.createElement('p');
    node.dataset[attribute] = attribute === 'subsidyInstitutionAmount' ? amounts.institutionStatus : '';
    node.style.whiteSpace = 'pre-line';
    node.textContent = text;
    parent.append(node);
  }
  if (policy) { paragraph(policy.notice, 'subsidyDisplayPolicy'); return; }
  if (!sections.length) {
    paragraph('制度の補助額：' + amounts.institutionText, 'subsidyInstitutionAmount');
    return;
  }
  const detail = document.createElement('details');
  detail.className = 'subsidy-branch-detail';
  const summary = document.createElement('summary');
  summary.textContent = '補足・適用条件を開く';
  detail.append(summary);
  detail.addEventListener('toggle', () => { summary.textContent = detail.open ? '補足・適用条件を閉じる' : '補足・適用条件を開く'; });
  for (const section of sections) {
    if (sections.length > 1) {
      const label = document.createElement('strong'); label.textContent = section.label; item.append(label);
    }
    paragraph('制度の補助額：' + section.text, 'subsidyInstitutionAmount');
    const rows = sections.length === 1 ? orderedSupplementRows([...section.supplement, ...common]) : section.supplement;
    if (rows.length) {
      if (sections.length > 1) { const label = document.createElement('strong'); label.textContent = section.label; detail.append(label); }
      paragraph('補足：\n' + rows.join('\n'), 'subsidySupplement', detail);
    }
  }
  if (sections.length > 1 && common.length) paragraph('補足：\n' + common.join('\n'), 'subsidySupplement', detail);
  if (detail.children.length > 1) item.append(detail);
}
