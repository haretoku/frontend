import {clearProgress} from '../map/progress-storage.js';

export function initializeHeaderMenu(doc=document) {
  const button=doc.querySelector('#menu-button'),menu=doc.querySelector('#menu');
  function closeMenu(focus=false){menu.hidden=true;button.setAttribute('aria-expanded','false');if(focus)button.focus();}
  button.addEventListener('click',()=>{const open=menu.hidden;menu.hidden=!open;button.setAttribute('aria-expanded',String(open));});
  doc.addEventListener('click',event=>{if(!event.target.closest('.menu-wrap'))closeMenu();});
  doc.addEventListener('keydown',event=>{if(event.key==='Escape'&&!menu.hidden)closeMenu(true);});
  doc.addEventListener('focusin',event=>{if(!event.target.closest('.menu-wrap'))closeMenu();});
  return closeMenu;
}

// MAPではjourney.jsが現在の画面状態も初期化する．参照ページは保存だけを消してMAPへ戻る．
export function initializeReferenceHeader({doc=document,host=window,navigate=url=>host.location.assign(url)}={}) {
  const closeMenu=initializeHeaderMenu(doc),dialog=doc.querySelector('#reset-dialog');
  doc.querySelector('#reset').addEventListener('click',()=>{closeMenu();dialog.showModal();});
  doc.querySelector('#cancel-reset').addEventListener('click',()=>dialog.close());
  dialog.addEventListener('close',()=>doc.querySelector('#menu-button').focus());
  doc.querySelector('#confirm-reset').addEventListener('click',()=>{clearProgress(host);dialog.close();navigate('/');});
}
