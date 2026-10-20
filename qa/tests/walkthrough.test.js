import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readWalkthrough, completeMission, clearWalkthrough, groupProgress, missionGroups, mapReadingMissions, walkthroughStorageKey } from '../../site/shared/walkthrough/state.js';
import { rememberWalkthroughTarget, takeWalkthroughTarget } from '../../site/shared/walkthrough/navigation.js';
import { claimFirstVisit, firstVisitStorageKey } from '../../site/shared/walkthrough/first-visit.js';

test('初回案内はページ移動・再訪・進捗リセット後も再表示せず，保存不能なら表示しない', () => {
  const saved = new Map();
  const host = { localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)},dispatchEvent(){} };
  assert.equal(claimFirstVisit(host),true);
  assert.equal(claimFirstVisit(host),false);
  clearWalkthrough(host);
  assert.equal(saved.get(firstVisitStorageKey),'1');
  assert.equal(claimFirstVisit(host),false);
  for (const method of ['getItem','setItem']) {
    const storage = {getItem:()=>null,setItem(){}};
    storage[method] = () => { throw Error('blocked'); };
    assert.equal(claimFirstVisit({localStorage:storage}),false);
  }
});

test('歩き方の案内は指定した移動先で1回だけ有効とし，通常閲覧・期限切れ・別の移動先では強調しない', () => {
  const saved = new Map();
  const host = { sessionStorage: { getItem:key=>saved.get(key)??null, setItem:(key,value)=>saved.set(key,value), removeItem:key=>saved.delete(key) }, location:{pathname:'/',hash:''} };
  assert.equal(takeWalkthroughTarget(host,1000),null);
  for (const mission of mapReadingMissions) {
    rememberWalkthroughTarget(mission.id,host,1000);
    assert.equal(takeWalkthroughTarget(host,1100),`#map [data-step="${mission.step}"]`);
  }
  assert.equal(takeWalkthroughTarget(host,1200),null);
  rememberWalkthroughTarget('diagnosis',host,1000);
  assert.equal(takeWalkthroughTarget(host,1100),null);
  host.location.pathname='/simulator/';
  assert.equal(takeWalkthroughTarget(host,1200),null);
  rememberWalkthroughTarget('diagnosis',host,1000);
  assert.equal(takeWalkthroughTarget(host,1100),'#start-diagnosis, #prefecture');
  rememberWalkthroughTarget('diagnosis',host,1000);
  assert.equal(takeWalkthroughTarget(host,62000),null);
  host.location={pathname:'/',hash:'#map-consultation'};
  rememberWalkthroughTarget('quote',host,1000);
  assert.equal(takeWalkthroughTarget(host,1100),'#map-consultation .consult-provider-action');
  rememberWalkthroughTarget('map',host,1000);
  assert.equal(takeWalkthroughTarget(host,1100),null);
  const unavailable={sessionStorage:{getItem(){throw Error('blocked');},removeItem(){throw Error('blocked');}}};
  assert.doesNotThrow(()=>rememberWalkthroughTarget('quote',unavailable,1000));
  assert.equal(takeWalkthroughTarget(unavailable,1100),null);
});

test('マップとガイドの達成を別々に集計し，各分類の全達成でだけ勲章を出す', () => {
  const state = { 'read-intro':true, article:true };
  assert.deepEqual(groupProgress(missionGroups[0], state), { done:1, total:7, percent:14, complete:false });
  assert.deepEqual(groupProgress(missionGroups[1], state), { done:1, total:1, percent:100, complete:true });
  const allMap = Object.fromEntries(missionGroups[0].missions.map(mission => [mission.id, true]));
  assert.equal(groupProgress(missionGroups[0], allMap).complete, true);
  assert.equal(groupProgress(missionGroups[1], allMap).complete, false);
});

test('歩き方のリセットは新旧キーを消し，MAPの保存は既存処理へ任せる', () => {
  const saved = new Map([[walkthroughStorageKey,'{"article":true}'],['haretoku-walkthrough-preview-v2','{"diagnosis":true}'],['haretoku-walkthrough-preview-v1','{"quote":true}'],['haretoku-step-map-v3','{"completed":[0]}']]);
  const host = { localStorage: {getItem:key=>saved.get(key)??null,removeItem:key=>saved.delete(key)},dispatchEvent:()=>{} };
  clearWalkthrough(host);
  assert.deepEqual(readWalkthrough(host), {});
  assert.equal(saved.has(walkthroughStorageKey), false);
  assert.equal(saved.has('haretoku-walkthrough-preview-v1'), false);
  assert.equal(saved.has('haretoku-walkthrough-preview-v2'), false);
  assert.equal(saved.get('haretoku-step-map-v3'), '{"completed":[0]}');
});

test('歩き方の自動達成を保存し，旧手動チェックとMAPの保存値を変えない', () => {
  const saved = new Map([['haretoku-step-map-v3', '{"completed":[0,1]}'], ['haretoku-walkthrough-preview-v1', '{"quote":true}']]);
  let changes = 0;
  const host = { localStorage: { getItem: key => saved.get(key) ?? null, setItem: (key, value) => saved.set(key, value) }, dispatchEvent: () => changes++ };
  assert.deepEqual(readWalkthrough(host), {});
  assert.equal(completeMission('read-intro', { host }), true);
  assert.equal(completeMission('read-intro', { host }), false);
  assert.equal(readWalkthrough(host)['read-intro'], true);
  assert.equal(saved.get('haretoku-step-map-v3'), '{"completed":[0,1]}');
  assert.equal(saved.get('haretoku-walkthrough-preview-v1'), '{"quote":true}');
  assert.equal(changes, 1);
  saved.delete(walkthroughStorageKey);
  assert.deepEqual(readWalkthrough(host), {});
});

test('5章と2つの実行を順に並べ，旧読了の意味を流用せず実行・記事の達成を保持する', () => {
  assert.deepEqual(missionGroups[0].missions.map(mission=>mission.id),['read-intro','read-economics','diagnosis','read-equipment','read-installation','read-companies','quote']);
  const saved=new Map([[walkthroughStorageKey,JSON.stringify({map:true,welcome:true,'quotes-guide':true,diagnosis:true,quote:true,article:true})]]);
  const host={localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)},dispatchEvent(){}};
  assert.deepEqual(readWalkthrough(host),{diagnosis:true,quote:true,article:true});
  completeMission('read-economics',{host});
  assert.equal(readWalkthrough(host)['read-economics'],true);
  saved.set(walkthroughStorageKey,'{}');
  completeMission('read-economics',{host});
  assert.equal(readWalkthrough(host).diagnosis,undefined);
});

test('旧自動達成からは意味が同じ3項目だけ移し，旧版が保存しても新しい章読了を失わない', () => {
  const saved=new Map([['haretoku-walkthrough-preview-v2',JSON.stringify({map:true,welcome:true,'quotes-guide':true,diagnosis:true,quote:true,article:true})]]);
  const host={localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)},dispatchEvent(){}};
  assert.deepEqual(readWalkthrough(host),{diagnosis:true,quote:true,article:true});
  completeMission('read-intro',{host});
  saved.set('haretoku-walkthrough-preview-v2','{}');
  assert.deepEqual(readWalkthrough(host),{diagnosis:true,quote:true,article:true,'read-intro':true});
});

test('歩き方を共通ヘッダーから公開・開発の両方へ一度だけ接続する', async () => {
  const header = await readFile(new URL('../../site/shared/site-header-template.js', import.meta.url), 'utf8');
  const entry = await readFile(new URL('../../site/shared/walkthrough/entry.js', import.meta.url), 'utf8');
  const review = await readFile(new URL('../../.config/vite.review.config.js', import.meta.url), 'utf8');
  assert.equal((header.match(/src="\/shared\/walkthrough\/entry.js"/g)??[]).length,1);
  assert.match(entry,/import '\.\/tracker.js'/);
  assert.match(entry,/import '\.\/panel.js'/);
  assert(!review.includes('/prototypes/walkthrough/'));
  const tracker = await readFile(new URL('../../site/shared/walkthrough/tracker.js', import.meta.url), 'utf8');
  assert(!tracker.includes('progress-storage'));
});

test('自動達成の試作v3から全項目を保持し，正式保存後は旧版の書込に影響されない', () => {
  const saved=new Map([['haretoku-walkthrough-preview-v3',JSON.stringify({'read-intro':true,diagnosis:true,article:true})]]);
  const host={localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)},dispatchEvent(){}};
  assert.deepEqual(readWalkthrough(host),{'read-intro':true,diagnosis:true,article:true});
  completeMission('read-equipment',{host});
  saved.set('haretoku-walkthrough-preview-v3','{}');
  assert.deepEqual(readWalkthrough(host),{'read-intro':true,diagnosis:true,article:true,'read-equipment':true});
});
