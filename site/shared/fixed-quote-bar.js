import { quoteActionFor, quoteMaterial } from './quote-config.js';
export const QUOTE_ACTION = quoteActionFor();

export function createQuoteLink(className, placement) {
  const link = document.createElement('a');
  link.className = className;
  link.textContent = QUOTE_ACTION.label;
  link.href = QUOTE_ACTION.url;
  link.target = '_blank';
  link.rel = 'sponsored nofollow noopener';
  link.referrerPolicy = 'no-referrer';
  link.dataset.quotePlacement = placement;
  link.setAttribute('aria-label', quoteMaterial.linkText + '（新しいタブで開きます）');
  return link;
}

export function createQuoteImpression(placement) {
  const image = document.createElement('img');
  image.src = quoteMaterial.impressionUrl;
  image.width = 1;
  image.height = 1;
  image.alt = '';
  image.referrerPolicy = 'no-referrer';
  image.setAttribute('border', '0');
  image.setAttribute('aria-hidden', 'true');
  image.className = 'quote-impression';
  image.dataset.quoteImpression = placement;
  return image;
}

export function setupInlineQuoteActions() {
  if (QUOTE_ACTION.disabled) return;
  for (const button of document.querySelectorAll('[data-inline-quote-action]')) {
    const link = createQuoteLink(button.className, 'article_body');
    link.dataset.inlineQuoteAction = '';
    button.replaceWith(link, createQuoteImpression('article_body'));
    const promotion = link.closest('[data-quote-promotion]');
    if (promotion) promotion.hidden = false;
  }
}
export function setupQuoteResultCard(result) {
  if (QUOTE_ACTION.disabled || !result || result.querySelector('[data-quote-result-card]')) return null;
  const card = document.createElement('aside');
  card.className = 'panel quote-result-card';
  card.dataset.quoteResultCard = '';
  const heading = document.createElement('h3');
  heading.textContent = 'この概算を，実際の見積もりと比べる';
  const copy = document.createElement('p');
  copy.textContent = '屋根や工事条件で，設置できる設備と導入費用は変わります．太陽光発電や蓄電池の同時導入について，施工会社の見積もりで確認しましょう．';
  const notice = document.createElement('p');
  notice.className = 'quote-result-card__notice';
  notice.textContent = '広告・アフィリエイト ／ ' + quoteMaterial.provider;
  card.append(heading, copy, notice, createQuoteLink('quote-bar__button', 'diagnosis_result'), createQuoteImpression('diagnosis_result'));
  result.append(card);
  return card;
}
export function mountFixedQuoteBar({ action = QUOTE_ACTION } = {}) {
  if (QUOTE_ACTION.disabled || document.querySelector('[data-quote-bar]')) return;
  const bar = document.createElement('aside');
  bar.className = 'quote-bar mobile-quote-bar';
  bar.dataset.quoteBar = '';
  bar.setAttribute('aria-label', '見積もり案内');
  const copy = document.createElement('div'); copy.className = 'quote-bar__copy';
  const description = document.createElement('p'); description.textContent = action.description;
  const advertising = document.createElement('small'); advertising.textContent = '広告・アフィリエイト ／ ' + quoteMaterial.provider;
  const button = createQuoteLink('quote-bar__button mobile-quote-button', 'fixed_bar');
  copy.append(description, advertising); bar.append(copy, button, createQuoteImpression('fixed_bar')); document.body.append(bar);
  document.body.classList.add('has-quote-space');
  function measure() {
    // 実高にはpadding内のsafe-areaも含まれる．二重加算しない．
    document.documentElement.style.setProperty('--quote-space', bar.getBoundingClientRect().height + 'px');
  }
  function protectFocus() {
    const active = document.activeElement;
    if (!active || bar.contains(active) || !active.matches('a, button, input, select, textarea, summary, [tabindex], [contenteditable="true"]')) return;
    const rect = active.getBoundingClientRect(), barRect = bar.getBoundingClientRect();
    if (rect.bottom > barRect.top && rect.top < barRect.bottom) active.scrollIntoView({ block: 'center', behavior: 'instant' });
  }
  const resizeObserver = new ResizeObserver(() => { measure(); protectFocus(); });
  resizeObserver.observe(bar);
  document.addEventListener('focusin', () => requestAnimationFrame(protectFocus));
  window.visualViewport?.addEventListener('resize', () => requestAnimationFrame(protectFocus), { passive: true });
  document.fonts?.ready.then(measure);
  measure();
}
