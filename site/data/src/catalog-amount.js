// Presentation policy for received catalog rows; raw evidence is never displayed.
// The caller may supply only an independently reviewed, same-branch fallback.
export function catalogAmountPresentation(amount, reviewedFallback = null) {
  const status = amount?.evidence_status;
  const labels = {
    confirmed: '',
    partial: '金額の一部・適用条件に確認事項あり',
    unconfirmed: '補助額は未確認',
    not_classified: ''
  };
  if (!Object.hasOwn(labels, status)) {
    return {text: '表示内容を整理中', note: ''};
  }
  const display = typeof amount.display_text === 'string' ? amount.display_text.trim() : '';
  if (status === 'unconfirmed') {
    return {text: display || labels.unconfirmed, note: display ? labels.unconfirmed : ''};
  }
  const fallback = typeof reviewedFallback === 'string' ? reviewedFallback.trim() : '';
  return {text: display || fallback || '表示内容を整理中', note: labels[status]};
}
