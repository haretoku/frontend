import { mountFixedQuoteBar, QUOTE_ACTION } from '../../shared/fixed-quote-bar.js';
export function setupArticleQuoteBar() {
  const introduction = document.querySelector('article.article--guide [data-quote-start]');
  if (!introduction) return;
  const content = introduction.closest('article');
  const description = content.dataset.quoteDescription;
  const action = { ...QUOTE_ACTION, label: '無料見積もり', status: '準備中', description: description || QUOTE_ACTION.description };
  let reachedIntroduction = false;
  mountFixedQuoteBar({ content, action, readState({ top }) {
    if (introduction.getBoundingClientRect().bottom <= top) reachedIntroduction = true;
    return { eligible: true, reached: reachedIntroduction, blocked: false };
  } });
}
