export const storageKey = 'haretoku-step-map-v3';
const fallbackKind='haretoku-session-fallback-v1';

const record=value=>value&&typeof value==='object'&&!Array.isArray(value);

function parse(value) {
  const result=JSON.parse(value);
  return record(result)?result:null;
}

function fallbackRecord(progress,host){
  const fallback={kind:fallbackKind,progress};
  // 取得できたlocal原値だけを基準にし，読取り禁止時は旧形式と同じ優先順を保つ．
  try {fallback.localValue=host.localStorage.getItem(storageKey);}catch{/* localを読めなくても代替保存は使える． */}
  return fallback;
}

// 永続保存を優先し，旧タブ内保存は初回移行と保存不可時の代替に使う．
export function readProgress(host=window) {
  let session=null;
  try {session=parse(host.sessionStorage.getItem(storageKey));}catch{/* タブ内保存を読めなくても永続保存を確認する． */}
  let localValue,saved=null,localReadable=false;
  try {localValue=host.localStorage.getItem(storageKey);localReadable=true;saved=parse(localValue);}catch{/* 保存禁止・壊れたJSONは代替保存を確認する． */}
  if(session?.kind===fallbackKind&&(session.progress===null||record(session.progress))){
    // 失敗時のlocalが残っている間は代替値を優先し，別タブの保存・消去後は新しいlocalへ戻す．
    const hasBaseline=Object.hasOwn(session,'localValue')&&(session.localValue===null||typeof session.localValue==='string');
    if(hasBaseline&&localReadable&&localValue!==session.localValue&&(localValue===null||saved))return saved;
    return session.progress;
  }
  if(saved)return saved;
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
    return true;
  }catch{/* 永続保存できない環境でも，同じタブ内の操作を保つ． */}
  try {host.sessionStorage.setItem(storageKey,JSON.stringify(fallbackRecord(state,host)));return true;}catch{/* 保存できなくても現在の画面は利用できる． */}
  return false;
}

export function clearProgress(host=window) {
  let removed=false;
  try {host.localStorage.removeItem(storageKey);removed=true;}catch{/* 削除できない旧値はタブ内のリセット記録で隠す． */}
  if(removed){
    try {host.sessionStorage.removeItem(storageKey);return;}catch{/* 削除不可ならリセット記録へ置き換える． */}
  }
  try {host.sessionStorage.setItem(storageKey,JSON.stringify(fallbackRecord(null,host)));}catch{/* 保存できなくても現在の画面はリセットできる． */}
}
