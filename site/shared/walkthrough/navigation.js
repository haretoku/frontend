import { mapReadingMissions, manualScheduleLinks } from './state.js';
// 歩き方からの移動だけを，同じタブの次のページで1回受け取る．
const key = 'haretoku-walkthrough-target-v1';
const destinations = {
  ...Object.fromEntries(mapReadingMissions.map(mission => [mission.id, { pathname: '/', hash: '', selector: `#map [data-step="${mission.step}"]` }])),
  diagnosis: { pathname: '/simulator/', hash: '', selector: '#start-diagnosis, #prefecture' },
  article: { pathname:'/guides/', hash:'', selector:'[data-guide-map-index]' },
  'manual-schedule-article': { pathname:'/manual/', hash:'#timeline', selector:manualScheduleLinks.map(link=>`#panel-timeline .manual-guide[href="${link.href}"]`).join(', ') },
  'manual-quote': { pathname:'/manual/', hash:'#manual-consultation', selector:'#manual-consultation .consult-provider-action' },
  'manual-article': { pathname:'/manual/', hash:'#troubles', selector:'#panel-troubles .manual-guide:not([href="/manual/equipment-renewal/"])' },
  quote: { pathname: '/', hash: '#map-consultation', selector: '#map-consultation .consult-provider-action' }
};

export function rememberWalkthroughTarget(id, host = window, now = Date.now()) {
  try {
    host.sessionStorage.removeItem(key);
    if (Object.hasOwn(destinations, id)) host.sessionStorage.setItem(key, JSON.stringify({ id, at: now }));
  } catch { /* 保存不可でも通常のリンク移動は続ける． */ }
}

export function takeWalkthroughTarget(host = window, now = Date.now()) {
  try {
    const raw = host.sessionStorage.getItem(key);
    host.sessionStorage.removeItem(key);
    const saved = JSON.parse(raw);
    if (!saved || !Object.hasOwn(destinations, saved.id) || !Number.isFinite(saved.at) || now < saved.at || now - saved.at > 60000) return null;
    const target = destinations[saved.id];
    return host.location.pathname === target.pathname && host.location.hash === target.hash ? target.selector : null;
  } catch { return null; }
}
