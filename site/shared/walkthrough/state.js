// MAPの進捗・診断条件とは別に，自動達成だけを記録する．
export const walkthroughStorageKey = 'haretoku-walkthrough-v1';
export const mapReadingMissions = [
  { id: 'read-intro', step: 0, label: '「はじめに」を読んでみよう', href: '/' },
  { id: 'read-economics', step: 1, label: '「わが家はいくら得になる？」を読んでみよう', href: '/' },
  { id: 'read-equipment', step: 2, label: '「太陽光と蓄電池を知ろう」を読んでみよう', href: '/' },
  { id: 'read-installation', step: 3, label: '「つけるまでの流れ」を読んでみよう', href: '/' },
  { id: 'read-companies', step: 4, label: '「どんな会社に頼む？」を読んでみよう', href: '/' }
];
export const missionGroups = [
  { id: 'map', title: '太陽光えらびマップ', description: '太陽光・蓄電池の導入までに，知っておきたいことを順にたどろう．', award: '太陽光えらびマップの歩き方を達成', missions: [
    mapReadingMissions[0],
    mapReadingMissions[1],
    { id: 'diagnosis', label: '診断で，わが家の収支を確かめてみよう', href: '/simulator/' },
    mapReadingMissions[2],
    mapReadingMissions[3],
    mapReadingMissions[4],
    { id: 'quote', label: '無料見積もりしてみよう', href: '/#map-consultation' }
  ]},
  { id: 'guides', title: '詳しいガイド', description: 'もっと知りたいことを，テーマごとの記事で詳しく調べよう．', award: 'はじめの1本を達成', missions: [
    { id: 'article', label: '気になる記事を1つ読んでみよう', href: '/guides/' }
  ]}
];
export const missions = missionGroups.flatMap(group => group.missions);
const validIds = new Set(missions.map(mission => mission.id));
let memory = {};
let memoryOnly = false;

export function groupProgress(group, state) {
  const total = group.missions.length;
  const done = group.missions.filter(mission => state[mission.id] === true).length;
  return { done, total, percent: Math.round(done / total * 100), complete: done === total };
}

export function readWalkthrough(host = window) {
  if (memoryOnly) return { ...memory };
  try {
    const raw = host.localStorage.getItem(walkthroughStorageKey) ?? host.localStorage.getItem('haretoku-walkthrough-preview-v3');
    const previous = raw === null ? JSON.parse(host.localStorage.getItem('haretoku-walkthrough-preview-v2')) : null;
    const saved = raw === null && previous && typeof previous === 'object'
      ? Object.fromEntries(['diagnosis','quote','article'].filter(id => previous[id] === true).map(id => [id,true]))
      : JSON.parse(raw);
    memory = {};
    if (saved && typeof saved === 'object' && !Array.isArray(saved)) {
      memory = Object.fromEntries(Object.entries(saved).filter(([id, value]) => validIds.has(id) && value === true));
    }
  } catch { /* 保存不可・不正JSONでも現在の操作は維持する． */ }
  return { ...memory };
}

export function completeMission(id, { host = window } = {}) {
  if (!validIds.has(id)) return false;
  const state = readWalkthrough(host);
  if (state[id] === true) return false;
  memory = { ...state, [id]: true };
  try { host.localStorage.setItem(walkthroughStorageKey, JSON.stringify(memory)); } catch { memoryOnly = true; }
  host.dispatchEvent(new Event('walkthrough-change'));
  return true;
}

export function clearWalkthrough(host = window) {
  memory = {};
  memoryOnly = false;
  for (const key of [walkthroughStorageKey, 'haretoku-walkthrough-preview-v3', 'haretoku-walkthrough-preview-v2', 'haretoku-walkthrough-preview-v1']) {
    try { host.localStorage.removeItem(key); } catch {
      try { host.localStorage.setItem(key, '{}'); } catch { memoryOnly = true; }
    }
  }
  host.dispatchEvent(new Event('walkthrough-change'));
}
