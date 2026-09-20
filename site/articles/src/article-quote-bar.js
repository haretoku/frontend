import { mountFixedQuoteBar } from '../../shared/fixed-quote-bar.js';
export function setupArticleQuoteBar() {
  const introduction = document.querySelector('article.article--guide [data-quote-start]');
  if (!introduction) return;
  let reachedIntroduction = false;
  mountFixedQuoteBar({ content: introduction.closest('article'), readState({ top }) {
    if (introduction.getBoundingClientRect().bottom <= top) reachedIntroduction = true;
    return { eligible: true, reached: reachedIntroduction, blocked: false };
  } });
}
