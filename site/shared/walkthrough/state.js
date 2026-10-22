import {timelineEvents} from '../../manual/content.js';
// MAPの進捗・診断条件とは別に，自動達成だけを記録する．
export const walkthroughStorageKey = 'haretoku-walkthrough-v2';
// v1を使う古いタブから，新しい項目の保存を上書きされないようにする．
export const mapReadingMissions = [
  { id: 'read-intro', step: 0, label: '「はじめに」を読んでみよう', href: '/' },
  { id: 'read-economics', step: 1, label: '「わが家はいくら得になる？」を読んでみよう', href: '/' },
  { id: 'read-equipment', step: 2, label: '「太陽光と蓄電池を知ろう」を読んでみよう', href: '/' },
  { id: 'read-installation', step: 3, label: '「つけるまでの流れ」を読んでみよう', href: '/' },
  { id: 'read-companies', step: 4, label: '「どんな会社に頼む？」を読んでみよう', href: '/' }
];
export const manualIntroPages = [
  { pathname:'/manual/getting-started/', id:'manual-intro-page-1' },
  { pathname:'/manual/getting-started/milestones/', id:'manual-intro-page-2' },
  { pathname:'/manual/getting-started/troubles/', id:'manual-intro-page-3' }
];
export const manualRenewalPages = [
  { pathname:'/manual/equipment-renewal/', id:'manual-renewal-page-1' },
  { pathname:'/manual/equipment-renewal/costs/', id:'manual-renewal-page-2' },
  { pathname:'/manual/equipment-renewal/consultation/', id:'manual-renewal-page-3' }
];
export const manualScheduleLinks = timelineEvents.filter(item => item.id !== 'intro' && item.links?.length).flatMap(item => item.links ?? []);
export const missionGroups = [
  { id: 'map', title: '太陽光えらびマップ', audience: '太陽光を考えている方へ', description: '太陽光・蓄電池の導入までに，知っておきたいことを順にたどろう．', award: '太陽光えらびマップの歩き方を達成', missions: [
    mapReadingMissions[0],
    mapReadingMissions[1],
    { id: 'diagnosis', label: '診断で，わが家の収支を確かめてみよう', href: '/simulator/' },
    mapReadingMissions[2],
    mapReadingMissions[3],
    mapReadingMissions[4],
    { id: 'quote', label: 'わが家のことを相談しよう', href: '/#map-consultation' }
  ]},
  { id: 'guides', title: '太陽光えらびの詳しいガイド', audience: '太陽光を考えている方へ', description: 'マップの内容を，もっと詳しく調べよう．', award: 'はじめの1本を達成', missions: [
    { id: 'article', label: 'マップで気になったことを，記事で詳しく読んでみよう', href: '/guides/' }
  ]},
  { id: 'manual', title: '太陽光トリセツ', audience: '太陽光をつけた方へ', description: 'これからの節目と，気になることの調べ方を知ろう．', award: '太陽光トリセツの歩き方を達成', missions: [
    { id:'manual-intro', label:'「太陽光をつけたら，これから何をする？」を読んでみよう', href:'/manual/getting-started/' },
    { id:'manual-schedule-article', label:'時期・節目の記事を1つ読んでみよう', href:'/manual/#timeline', pending:manualScheduleLinks.length === 0 },
    { id:'manual-article', label:'困りごとの記事を1つ読んでみよう', href:'/manual/#troubles' },
    { id:'manual-renewal', label:'「長く使った太陽光，更新する？使い続ける？」を読んでみよう', href:'/manual/equipment-renewal/' },
    { id:'manual-quote', label:'太陽光のこれからを相談しよう', href:'/manual/#manual-consultation' }
  ]}
];
export const missions = missionGroups.flatMap(group => group.missions);
const validIds = new Set([...missions.filter(mission => !mission.pending), ...manualIntroPages, ...manualRenewalPages].map(item => item.id));
let memory = {};
let memoryOnly = false;

export function groupProgress(group, state) {
  const available = group.missions.filter(mission => !mission.pending);
  const total = available.length;
  const done = available.filter(mission => state[mission.id] === true).length;
  return { done, total, percent: total ? Math.round(done / total * 100) : 0, complete: total > 0 && done === total };
}

export function readWalkthrough(host = window) {
  if (memoryOnly) return { ...memory };
  try {
    const current = host.localStorage.getItem(walkthroughStorageKey);
    const raw = current ?? host.localStorage.getItem('haretoku-walkthrough-v1') ?? host.localStorage.getItem('haretoku-walkthrough-preview-v3');
    const previous = raw === null ? JSON.parse(host.localStorage.getItem('haretoku-walkthrough-preview-v2')) : null;
    const saved = raw === null && previous && typeof previous === 'object'
      ? Object.fromEntries(['diagnosis','quote','article'].filter(id => previous[id] === true).map(id => [id,true]))
      : JSON.parse(raw);
    memory = {};
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      memory = Object.fromEntries(Object.entries(saved).filter(([id, value]) => validIds.has(id) && value === true));
      if(memory['manual-renewal'] === true)memory['manual-schedule-article']=true;
      // 表示した時点で移行を確定し，未操作の間も旧タブの書込みから守る．
      if (current === null) {
        try { host.localStorage.setItem(walkthroughStorageKey, JSON.stringify(memory)); } catch { memoryOnly = true; }
      }
    }
  } catch { /* 保存不可・不正JSONでも現在の操作は維持する． */ }
  return { ...memory };
}

export function completeMission(id, { host = window } = {}) {
  if (!validIds.has(id)) return false;
  const state = readWalkthrough(host);
  if (state[id] === true) return false;
  memory = { ...state, [id]: true };
  if (manualIntroPages.every(page => memory[page.id] === true)) memory['manual-intro'] = true;
  if (manualRenewalPages.every(page => memory[page.id] === true)) {
    memory['manual-renewal'] = true;
    memory['manual-schedule-article'] = true;
  }
  try { host.localStorage.setItem(walkthroughStorageKey, JSON.stringify(memory)); } catch { memoryOnly = true; }
  host.dispatchEvent(new Event('walkthrough-change'));
  return true;
}

export function clearWalkthrough(host = window) {
  memory = {};
  memoryOnly = false;
  for (const key of [walkthroughStorageKey, 'haretoku-walkthrough-v1', 'haretoku-walkthrough-preview-v3', 'haretoku-walkthrough-preview-v2', 'haretoku-walkthrough-preview-v1']) {
    try { host.localStorage.removeItem(key); } catch {
      try { host.localStorage.setItem(key, '{}'); } catch { memoryOnly = true; }
    }
  }
  host.dispatchEvent(new Event('walkthrough-change'));
}
