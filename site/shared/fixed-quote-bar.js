export const QUOTE_ACTION = Object.freeze({ label: '無料見積もり（準備中）', disabled: true, description: '屋根や工事条件に合わせて，設置する設備と導入費用を確定させます．' });
export function quoteBarVisible({ eligible, reached, blocked, keyboard, focusCovered }) {
  return eligible && reached && !blocked && !keyboard && !focusCovered;
}
export function mobileKeyboardLikely(inputFocused, layoutHeight, visualHeight) {
  return Boolean(inputFocused) || layoutHeight - visualHeight > 120;
}
export const intersects = (rect, top, bottom) => rect.height > 0 && rect.bottom > top && rect.top < bottom;
export function mountFixedQuoteBar({ readState, content, observations = [] }) {
  if (document.querySelector('[data-quote-bar]')) return;
  const bar = document.createElement('aside');
  bar.className = 'quote-bar mobile-quote-bar';
  bar.dataset.quoteBar = '';
  bar.setAttribute('aria-label', '見積もり案内');
  bar.hidden = true;
  const copy = document.createElement('div'); copy.className = 'quote-bar__copy';
  const description = document.createElement('p'); description.textContent = QUOTE_ACTION.description;
  const advertising = document.createElement('small'); advertising.textContent = '広告・アフィリエイト';
  const button = document.createElement('button');
  button.type = 'button'; button.className = 'quote-bar__button mobile-quote-button';
  button.textContent = QUOTE_ACTION.label; button.disabled = QUOTE_ACTION.disabled;
  copy.append(description, advertising); bar.append(copy, button); document.body.append(bar);
  let scheduled = false, barHeight = 60;
  function update() {
    scheduled = false;
    const viewport = window.visualViewport;
    const top = viewport?.offsetTop ?? 0, height = viewport?.height ?? innerHeight, bottom = top + height;
    const active = document.activeElement;
    const inputFocused = active?.matches('textarea, input:not([type="range"]):not([type="radio"]):not([type="checkbox"]), [contenteditable="true"]');
    const keyboard = mobileKeyboardLikely(inputFocused, innerHeight, height);
    const focusCovered = !bar.contains(active) && active?.matches('a, button, input, select, textarea, summary, [tabindex]') && intersects(active.getBoundingClientRect(), bottom - barHeight, bottom);
    const state = readState({ top, bottom, active, barHeight });
    document.body.classList.toggle('has-quote-space', state.eligible);
    bar.hidden = !quoteBarVisible({ ...state, keyboard, focusCovered: Boolean(focusCovered) });
  }
  function schedule() { if (!scheduled) { scheduled = true; requestAnimationFrame(update); } }
  window.addEventListener('scroll', schedule, { passive: true });
  window.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('resize', schedule, { passive: true });
  window.visualViewport?.addEventListener('scroll', schedule, { passive: true });
  document.addEventListener('focusin', schedule); document.addEventListener('focusout', schedule);
  window.addEventListener('hashchange', schedule);
  const stateObserver = new MutationObserver(schedule);
  stateObserver.observe(document.body, { attributes: true, attributeFilter: ['class'] });
  for (const [element, options] of observations) stateObserver.observe(element, options);
  const resizeObserver = new ResizeObserver(() => {
    if (!bar.hidden) { barHeight = bar.getBoundingClientRect().height; document.documentElement.style.setProperty('--quote-space', barHeight + 'px'); }
    schedule();
  });
  resizeObserver.observe(bar); resizeObserver.observe(content);
  document.fonts?.ready.then(schedule);
  schedule();
}
