import {renderManualIcon} from './icons.js';
import {assets} from '../map/assets.js';


document.querySelectorAll('[data-manual-icon]').forEach(el=>{
  el.innerHTML=renderManualIcon(el.dataset.manualIcon);
});
// パネルはMAP共通素材，レンチの形・配色は維持費記事の採用済みSVGにそろえる．
document.querySelector('[data-manual-panel]').innerHTML=`<svg viewBox="0 0 120 120" aria-hidden="true"><use href="${assets.titleArt}#solar-panel"/><g transform="translate(6 20) scale(.48)" stroke="#648a75" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M162 91q-12-27 11-43l14-2-13 22 16 15 21-14q3 27-23 34l-57 70q-9 11-19 2t-1-19z" fill="#f7d47b"/><circle cx="121" cy="166" r="3" fill="#fff"/></g></svg>`;

const tabs=[...document.querySelectorAll('.manual-tabs [role="tab"]')];
const panels=[...document.querySelectorAll('.manual-panel[role="tabpanel"]')];
function selectTab(tab,focus=false,updateHash=true){
  tabs.forEach(item=>{const active=item===tab;item.setAttribute('aria-selected',String(active));item.tabIndex=active?0:-1;});
  panels.forEach(panel=>panel.hidden=panel.id!==tab.getAttribute('aria-controls'));
  if(focus)tab.focus();
  if(updateHash){const url=new URL(location.href);url.hash=tab.dataset.view;history.replaceState(null,'',url);}
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>selectTab(tab));
  tab.addEventListener('keydown',event=>{
    let next;
    if(event.key==='ArrowRight')next=tabs[(index+1)%tabs.length];
    if(event.key==='ArrowLeft')next=tabs[(index+tabs.length-1)%tabs.length];
    if(event.key==='Home')next=tabs[0];
    if(event.key==='End')next=tabs.at(-1);
    if(next){event.preventDefault();selectTab(next,true);}
  });
});
function restoreView(){
  const matching=tabs.find(tab=>`#${tab.dataset.view}`===location.hash);
  if(matching)selectTab(matching,false,false);
  if(location.hash==='#after-installation')selectTab(tabs[0],false,false);
}
restoreView();
window.addEventListener('hashchange',restoreView);
// JSなしでも両一覧を読めるよう，非選択パネルは初期化後に隠す．
panels.forEach(panel=>panel.hidden=panel.id!==tabs.find(tab=>tab.getAttribute('aria-selected')==='true').getAttribute('aria-controls'));
