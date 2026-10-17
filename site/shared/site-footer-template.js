// 配信HTMLへ同期する共通フッター．
export function renderSiteFooter() {
  const items=[['operation','運営方針'],['advertising','広告方針'],['data','データ方針'],['privacy','プライバシー'],['disclaimer','免責事項']];
  return `<footer class="map-footer site-footer-shell"><nav class="site-footer__links" aria-label="運営情報">${items.map(([id,label])=>`<a href="/pages/policy.html#${id}">${label}</a>`).join(' ')}</nav></footer>`;
}
