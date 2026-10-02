import { setupQuoteResultCard } from '../../shared/fixed-quote-bar.js';
export function setupMobileActions() {
  if (document.querySelector('.mobile-graph-return')) return;
  const result = document.querySelector('#estimate-result');
  const heading = document.querySelector('#cashflow-title'), message = document.querySelector('#form-message');
  const quoteCard = setupQuoteResultCard(result);
  const compact = matchMedia('(max-width: 40rem)');
  const returnButton = document.createElement('button');
  returnButton.type = 'button'; returnButton.className = 'text-button mobile-graph-return'; returnButton.textContent = 'グラフを見る'; returnButton.hidden = true;
  heading.tabIndex = -1; document.querySelector('#analysis-conditions-panel').append(returnButton);
  returnButton.addEventListener('click', () => { const toggle = document.querySelector('[data-mobile-conditions-toggle]'); if (toggle?.getAttribute('aria-expanded') === 'true') toggle.click(); heading.focus({ preventScroll: true }); heading.scrollIntoView({ block: 'start', behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth' }); });
  function updateResultActions() {
    const eligible = !result.hidden && !message.textContent.trim();
    if (quoteCard) quoteCard.hidden = !eligible;
    returnButton.hidden = !compact.matches || !eligible;
  }
  const observer = new MutationObserver(updateResultActions);
  observer.observe(result, { attributes: true, attributeFilter: ['hidden'] });
  observer.observe(message, { childList: true, characterData: true, subtree: true });
  compact.addEventListener('change', updateResultActions);
  updateResultActions();
}
