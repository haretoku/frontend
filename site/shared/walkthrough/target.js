import { takeWalkthroughTarget } from './navigation.js';
import './target.css';

let stopCurrent = () => {};
function highlightDestination() {
  stopCurrent();
  const selector = takeWalkthroughTarget();
  if (!selector) return;
  let positioned = null;
  let ready = false;
  let stopped = false;
  const marked = new Set();
  const observer = new MutationObserver(sync);
  function sync() {
    if (stopped || !ready) return;
    const buttons = [...document.querySelectorAll(selector)].filter(element => element.getClientRects().length);
    if (!buttons.length) return;
    for (const previous of marked) if (!buttons.includes(previous)) previous.classList.remove('walkthrough-target');
    for (const button of buttons) {
      const frame = button.querySelector('.station') || button;
      button.style.setProperty('--walkthrough-glow-color', getComputedStyle(frame).borderTopColor);
      button.classList.add('walkthrough-target');
      marked.add(button);
    }
    if (positioned !== buttons[0]) {
      positioned = buttons[0];
      buttons[0].scrollIntoView({ block: 'center', behavior: 'instant' });
    }
  }
  function stop() {
    stopped = true;
    observer.disconnect();
    for (const button of marked) button.classList.remove('walkthrough-target');
    for (const button of marked) button.style.removeProperty('--walkthrough-glow-color');
    document.removeEventListener('pointerdown', onAction, true);
    document.removeEventListener('keydown', onAction, true);
    document.removeEventListener('pointerover', sync, true);
    document.removeEventListener('transitionend', onFrameTransition, true);
    window.removeEventListener('pagehide', stop);
    clearTimeout(timer);
  }
  stopCurrent = stop;
  function onAction(event) {
    if (event.target.closest(selector) && (event.type === 'pointerdown' || ['Enter', ' '].includes(event.key))) stop();
  }
  function onFrameTransition(event) {
    if (event.propertyName.startsWith('border') && event.target.closest(selector)) sync();
  }
  observer.observe(document.body, { childList: true, subtree: true, attributes: true, attributeFilter: ['hidden'] });
  document.addEventListener('pointerdown', onAction, true);
  document.addEventListener('keydown', onAction, true);
  document.addEventListener('pointerover', sync, true);
  document.addEventListener('transitionend', onFrameTransition, true);
  window.addEventListener('pagehide', stop);
  const timer = setTimeout(stop, 6000);
  // 本体の初期描画とスクロールの後に案内する．データ到着時のボタン再描画にも追従する．
  requestAnimationFrame(() => requestAnimationFrame(() => { ready = true; sync(); }));
}
window.addEventListener('hashchange', highlightDestination);
window.addEventListener('walkthrough-target-change', highlightDestination);
highlightDestination();
