import {troubleCategories} from '../../manual/content.js';

export const walkthroughAudiences = [
  {id:'considering', label:'太陽光を考えている方へ', groups:['map','guides']},
  {id:'installed', label:'太陽光をつけた方へ', groups:['manual']}
];

const manualArticlePaths = new Set(troubleCategories.flatMap(category=>category.links??[]).map(link=>link.href));

export function initialWalkthroughAudience(pathname) {
  const path=pathname.replace(/index\.html$/,'').replace(/\/?$/,'/');
  return path.startsWith('/manual/')||manualArticlePaths.has(path)?'installed':'considering';
}

export const walkthroughAudienceKey='haretoku-walkthrough-audience-v1';
export function preferredWalkthroughAudience(pathname,host=window) {
  try {
    const saved=host.localStorage.getItem(walkthroughAudienceKey);
    if(walkthroughAudiences.some(audience=>audience.id===saved))return saved;
  } catch { /* 保存不可なら閲覧ページから選ぶ． */ }
  return initialWalkthroughAudience(pathname);
}
export function saveWalkthroughAudience(id,host=window) {
  if(!walkthroughAudiences.some(audience=>audience.id===id))return;
  try { host.localStorage.setItem(walkthroughAudienceKey,id); } catch { /* 現在の画面での選択は維持する． */ }
}
