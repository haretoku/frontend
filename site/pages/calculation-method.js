// 既存の深い参照先も，対応する定義を開いて確認できるようにする．
function revealDefinition() {
  if (!location.hash) return;
  let id;
  try { id=decodeURIComponent(location.hash.slice(1)); } catch { return; }
  const target=document.getElementById(id);
  if (!target) return;
  for(let ancestor=target;ancestor;ancestor=ancestor.parentElement) {
    if(ancestor.tagName==='DETAILS')ancestor.open=true;
  }
  requestAnimationFrame(()=>target.scrollIntoView({block:'start'}));
}
window.addEventListener('hashchange',revealDefinition);
revealDefinition();
