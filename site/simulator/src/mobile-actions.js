import { mountFixedQuoteBar, intersects, QUOTE_ACTION } from '../../shared/fixed-quote-bar.js';
export function setupMobileActions() {
  if (document.querySelector('[data-quote-bar]')) return;
  const result = document.querySelector('#estimate-result'), chart = document.querySelector('[data-cashflow-chart]');
  const heading = document.querySelector('#cashflow-title'), detail = document.querySelector('#cashflow-detail'), message = document.querySelector('#form-message');
  const conditionsToggle = document.querySelector('[data-mobile-conditions-toggle]');
  const compact = matchMedia('(max-width: 40rem)');
  const returnButton = document.createElement('button');
  returnButton.type = 'button'; returnButton.className = 'text-button mobile-graph-return'; returnButton.textContent = 'グラフを見る'; returnButton.hidden = true;
  heading.tabIndex = -1; document.querySelector('#analysis-conditions-panel').append(returnButton);
  returnButton.addEventListener('click', () => { const toggle = document.querySelector('[data-mobile-conditions-toggle]'); if (toggle?.getAttribute('aria-expanded') === 'true') toggle.click(); heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
  let reachedResult = false;
  mountFixedQuoteBar({ content: result, action: { ...QUOTE_ACTION, label: '無料見積もり', status: '準備中', description: '自宅の導入費用を，見積もりで確認しましょう．' }, observations: [
    [conditionsToggle, { attributes: true, attributeFilter: ['aria-expanded'] }],
    [result, { attributes: true, attributeFilter: ['hidden'] }],
    [detail, { attributes: true, attributeFilter: ['hidden'] }],
    [message, { childList: true, characterData: true, subtree: true }]
  ], readState({ top, bottom, active, barHeight }) {
    const eligible = !result.hidden && !message.textContent.trim();
    const rect = chart.getBoundingClientRect();
    if (!eligible) reachedResult = false;
    else if (intersects(rect, top, bottom)) reachedResult = true;
    returnButton.hidden = !compact.matches || !eligible;
    return { eligible, reached: reachedResult, blocked: (compact.matches && conditionsToggle.getAttribute('aria-expanded') === 'true') || !detail.hidden || intersects(rect, bottom - barHeight, bottom) };
  } });
}
