export const storageKey = 'haretoku-step-map-v3';

function parse(value) {
  const result=JSON.parse(value);
  return result&&typeof result==='object'&&!Array.isArray(result)?result:null;
}

// 永続保存を優先し，旧タブ内保存は初回移行と保存不可時の代替に使う．
export function readProgress(host=window) {
  try {const saved=parse(host.localStorage.getItem(storageKey));if(saved)return saved;}catch{/* 保存禁止・壊れたJSONは旧保存を確認する． */}
  try {return parse(host.sessionStorage.getItem(storageKey));}catch{return null;}
}

export function writeProgress(state,host=window) {
  const value=JSON.stringify(state);
  try {
    host.localStorage.setItem(storageKey,value);
    // 移行後の古い値を，次回のリセットや復元で使わない．
    try {host.sessionStorage.removeItem(storageKey);}catch{/* 永続保存は成功済み． */}
    return;
  }catch{/* 永続保存できない環境でも，同じタブ内の操作を保つ． */}
  try {host.sessionStorage.setItem(storageKey,value);}catch{/* 保存できなくても現在の画面は利用できる． */}
}

export function clearProgress(host=window) {
  try {host.localStorage.removeItem(storageKey);}catch{/* 保存禁止の場合もリセット操作は続行する． */}
  try {host.sessionStorage.removeItem(storageKey);}catch{/* 旧タブ内保存も可能な範囲で消す． */}
}
