import {assets} from '../../map/assets.js';
import {storageKey} from '../../map/progress-storage.js';
import {readAvatar,writeAvatar} from './avatar-state.js';

function renderAvatar(pawn=readAvatar()){
  document.querySelectorAll('[data-starter-avatar]').forEach(image=>{
    image.src=assets[`pawn-${pawn}`];
  });
  document.querySelectorAll('input[name="starter-pawn"]').forEach(input=>{
    input.checked=input.value===pawn;
  });
}

document.querySelector('[data-starter-character-choice]')?.addEventListener('change',event=>{
  const input=event.target;
  if(!(input instanceof HTMLInputElement)||input.name!=='starter-pawn')return;
  const saved=writeAvatar(input.value);
  renderAvatar(input.value);
  document.querySelector('[data-starter-save-status]').textContent=saved?'':'この画面では変更できますが，次のページへ保存できませんでした．';
});
window.addEventListener('pageshow',()=>renderAvatar());
window.addEventListener('storage',event=>{
  if(event.key===storageKey||event.key===null)renderAvatar();
});
renderAvatar();
