// 進捗リセットとは別に保持し，同じブラウザでの案内を1回に限る．
export const firstVisitStorageKey = 'haretoku-walkthrough-introduced-v1';

export function claimFirstVisit(host = window) {
  try {
    if (host.localStorage.getItem(firstVisitStorageKey) !== null) return false;
    host.localStorage.setItem(firstVisitStorageKey, '1');
    return true;
  } catch {
    // 保存できない環境では，ページを開くたびに案内を繰り返さない．
    return false;
  }
}

export function introduceWalkthrough(button, panel, harena) {
  let hint;
  let timer;
  const dismiss = () => {
    clearTimeout(timer);
    hint?.remove();
    button.classList.remove('walkthrough-trigger--introduced');
    document.removeEventListener('visibilitychange', showWhenVisible);
    window.removeEventListener('resize', position);
    window.removeEventListener('scroll', dismiss);
    window.removeEventListener('pagehide', dismiss);
    window.removeEventListener('storage', onStorage);
    panel.removeEventListener('beforetoggle', dismiss);
    document.querySelector('#menu-button')?.removeEventListener('click', dismiss);
  };
  const position = () => {
    const rect = button.getBoundingClientRect();
    const left = Math.max(12, Math.min(rect.right - hint.offsetWidth, innerWidth - hint.offsetWidth - 12));
    hint.style.left = `${left}px`;
    hint.style.top = `${rect.bottom + 12}px`;
    hint.style.setProperty('--hint-point', `${Math.max(20, Math.min(rect.left + rect.width / 2 - left, hint.offsetWidth - 20))}px`);
  };
  const onStorage = event => { if (event.key === firstVisitStorageKey) dismiss(); };
  function showWhenVisible() {
    if (document.visibilityState !== 'visible') return;
    document.removeEventListener('visibilitychange', showWhenVisible);
    if (!claimFirstVisit()) return;
    hint = document.createElement('div');
    hint.className = 'walkthrough-first-visit';
    hint.setAttribute('role', 'status');
    hint.innerHTML = `<svg viewBox="240 245 780 780" aria-hidden="true" focusable="false"><image href="${harena}" width="1280" height="1280"/></svg><span>はじめての方はこちら</span>`;
    document.body.append(hint);
    position();
    button.classList.add('walkthrough-trigger--introduced');
    window.addEventListener('resize', position);
    window.addEventListener('scroll', dismiss, { passive: true });
    window.addEventListener('pagehide', dismiss);
    window.addEventListener('storage', onStorage);
    panel.addEventListener('beforetoggle', dismiss);
    document.querySelector('#menu-button')?.addEventListener('click', dismiss);
    timer = setTimeout(dismiss, 6500);
  }
  if (document.visibilityState === 'visible') showWhenVisible();
  else document.addEventListener('visibilitychange', showWhenVisible);
}
