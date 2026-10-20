import articles from '../../solar/data/articles.json';
import { completeMission, clearWalkthrough, mapReadingMissions } from './state.js';
import './reset.css';
import './target.js';

// 共通メニューの末尾へ，歩き方を含むリセットを置く．
const reset = document.querySelector('#reset');
if (reset) {
  document.querySelector('#menu').append(reset);
  reset.classList.add('walkthrough-reset-action');
  document.querySelector('#reset-description').textContent = '歩き方・マップの進捗と，診断条件・選んだ設備がリセットされます．';
  document.querySelector('#confirm-reset').addEventListener('click', () => clearWalkthrough(), { capture: true });
}

// 既存MAPの保存・判定は読み書きしない．
const pathname = location.pathname.replace(/index\.html$/, '').replace(/\/?$/, '/');
const complete = id => completeMission(id);
function whenVisible(element, callback, threshold = 0.5) {
  if (!element) return;
  const observer = new IntersectionObserver(entries => {
    if (entries.some(entry => entry.isIntersecting && entry.intersectionRatio >= threshold)) {
      callback();
      observer.disconnect();
    }
  }, { threshold });
  observer.observe(element);
}

// MAPが既に表示している章の確認済みを参照する．MAPの保存や判定は変更しない．
if (pathname === '/') {
  const map = document.querySelector('#map');
  const syncChapters = () => {
    for (const mission of mapReadingMissions) {
      if (map.querySelector(`[data-stop="${mission.step}"].is-complete`)) complete(mission.id);
    }
  };
  if (map) {
    new MutationObserver(syncChapters).observe(map, { childList: true, subtree: true, attributes: true, attributeFilter: ['class'] });
    syncChapters();
  }
}
if (pathname === '/simulator/') {
  // 説明の読了と診断の実行は別の達成にする．説明は結果の有無にかかわらず読むことができる．
  const body = document.querySelector('#page-body');
  if (body) {
    let ending = null;
    const visible = new IntersectionObserver(entries => {
      if (entries.some(entry => entry.target === ending && entry.isIntersecting && entry.intersectionRatio >= 0.5)) {
        complete('read-economics');
        visible.disconnect();
        updates.disconnect();
      }
    }, { threshold: 0.5 });
    const observeEnding = () => {
      const next = body.lastElementChild;
      if (next === ending) return;
      if (ending) visible.unobserve(ending);
      ending = next;
      if (ending) visible.observe(ending);
    };
    const updates = new MutationObserver(observeEnding);
    updates.observe(body, { childList: true });
    observeEnding();
  }
  const result = document.querySelector('#diagnosis-result');
  const checkResult = () => {
    if (result && !result.hidden && result.querySelector('#result-cards')?.children.length) complete('diagnosis');
  };
  if (result) new MutationObserver(checkResult).observe(result, { attributes: true, childList: true, subtree: true });
  checkResult();
}
if (articles.some(article => ['detail', 'core'].includes(article.articleType) && article.href === pathname)) {
  const ending = document.querySelector('article .chapter:last-of-type .harena-summary') || document.querySelector('article');
  whenVisible(ending, () => {
    complete('article');
  });
}
if (pathname === '/' || pathname === '/guides/quote-services/') {
  const trackQuote = event => {
    if (event.type === 'auxclick' && event.button !== 1) return;
    if (event.target.closest('a[data-consult-provider]')) complete('quote');
  };
  document.addEventListener('click', trackQuote);
  document.addEventListener('auxclick', trackQuote);
}
