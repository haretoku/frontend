export const storageKey = 'haretoku-step-map-v3';
const fallbackKind='haretoku-session-fallback-v1';

const record=value=>value&&typeof value==='object'&&!Array.isArray(value);

function parse(value) {
  const result=JSON.parse(value);
  return record(result)?result:null;
}

// 永続保存を優先し，旧タブ内保存は初回移行と保存不可時の代替に使う．
export function readProgress(host=window) {
  let session=null;
  try {session=parse(host.sessionStorage.getItem(storageKey));}catch{/* タブ内保存を読めなくても永続保存を確認する． */}
  // localへの書込みが失敗した後は，そのタブで更新した値（リセットを含む）を優先する．
  if(session?.kind===fallbackKind&&(session.progress===null||record(session.progress)))return session.progress;
  try {const saved=parse(host.localStorage.getItem(storageKey));if(saved)return saved;}catch{/* 保存禁止・壊れたJSONは旧保存を確認する． */}
  return session?.kind===fallbackKind?null:session;
}

export function writeProgress(state,host=window) {
  const value=JSON.stringify(state);
  try {
    host.localStorage.setItem(storageKey,value);
    // 移行後の古い値を，次回のリセットや復元で使わない．
    try {host.sessionStorage.removeItem(storageKey);}catch{
      // 削除だけを禁止する環境でも，古い代替値の優先指定を解除する．
      try {host.sessionStorage.setItem(storageKey,value);}catch{/* 永続保存は成功済み． */}
    }
    return;
  }catch{/* 永続保存できない環境でも，同じタブ内の操作を保つ． */}
  try {host.sessionStorage.setItem(storageKey,JSON.stringify({kind:fallbackKind,progress:state}));}catch{/* 保存できなくても現在の画面は利用できる． */}
}

export function clearProgress(host=window) {
  let removed=false;
  try {host.localStorage.removeItem(storageKey);removed=true;}catch{/* 削除できない旧値はタブ内のリセット記録で隠す． */}
  if(removed){
    try {host.sessionStorage.removeItem(storageKey);return;}catch{/* 削除不可ならリセット記録へ置き換える． */}
  }
  try {host.sessionStorage.setItem(storageKey,JSON.stringify({kind:fallbackKind,progress:null}));}catch{/* 保存できなくても現在の画面はリセットできる． */}
}
