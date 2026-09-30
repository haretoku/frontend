import test from 'node:test';
import assert from 'node:assert/strict';
import {catalogAmountPresentation} from '../../site/data/src/catalog-amount.js';

test('金額確認区分未整理は額不明へ変換せず，生の内部式は表示しない', () => {
  const amount = {evidence_status:'not_classified', display_text:null, raw_text:'min(C_B-S,150000)，今回非算入'};
  assert.deepEqual(catalogAmountPresentation(amount), {text:'表示内容を整理中',note:''});
  assert.equal(catalogAmountPresentation(amount, '他補助控除後の費用，上限15万円').text, '他補助控除後の費用，上限15万円');
});
test('診断非採用でも検収済み表示文の控除・上限・丸めを保持', () => {
  const display = '蓄電池：他補助控除後の設置費，上限15万円．千円未満切捨て．';
  assert.deepEqual(catalogAmountPresentation({evidence_status:'confirmed', display_text:display, diagnostic_program_ids:[]}), {text:display,note:''});
});
test('真の金額不明は別枝の既知額や以前の額で補完しない', () => {
  assert.deepEqual(catalogAmountPresentation({evidence_status:'unconfirmed',display_text:null}, '15万円'), {text:'補助額は未確認',note:''});
});
test('旧年度の既知額は年度留保と一部確認の注意を保持', () => {
  const display = '2025年度は上限10万円．2026年度への適用は未確認．';
  const view = catalogAmountPresentation({evidence_status:'partial',display_text:display});
  assert.equal(view.text,display);assert.match(view.note,/確認事項/);
  assert.deepEqual(catalogAmountPresentation({evidence_status:'unexpected',display_text:'10万円'}), {text:'表示内容を整理中',note:''});
});
