import { mountFixedQuoteBar, intersects } from '../../shared/fixed-quote-bar.js';
export function setupMobileActions() {
  if (document.querySelector('[data-quote-bar]')) return;
  const result = document.querySelector('#estimate-result'), chart = document.querySelector('[data-cashflow-chart]');
  const heading = document.querySelector('#cashflow-title'), detail = document.querySelector('#cashflow-detail'), message = document.querySelector('#form-message');
  const compact = matchMedia('(max-width: 40rem)');
  const returnButton = document.createElement('button');
  returnButton.type = 'button'; returnButton.className = 'text-button mobile-graph-return'; returnButton.textContent = 'グラフを見る'; returnButton.hidden = true;
  heading.tabIndex = -1; document.querySelector('.analysis-workbench').append(returnButton);
  returnButton.addEventListener('click', () => { heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
  let reachedResult = false;
  mountFixedQuoteBar({ content: result, observations: [
    [result, { attributes: true, attributeFilter: ['hidden'] }],
    [detail, { attributes: true, attributeFilter: ['hidden'] }],
    [message, { childList: true, characterData: true, subtree: true }]
  ], readState({ top, bottom, active, barHeight }) {
    const eligible = !result.hidden && !message.textContent.trim();
    const editing = document.body.classList.contains('is-editing-basic') || document.body.classList.contains('is-editing-equipment'), rect = chart.getBoundingClientRect();
    if (!eligible) reachedResult = false;
    else if (!editing && intersects(rect, top, bottom)) reachedResult = true;
    returnButton.hidden = !compact.matches || !eligible || editing || (rect.top >= top && rect.bottom <= bottom && active !== returnButton);
    return { eligible, reached: reachedResult, blocked: editing || !detail.hidden || intersects(rect, bottom - barHeight, bottom) };
  } });
}
