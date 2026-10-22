import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { readWalkthrough, completeMission, clearWalkthrough, groupProgress, missionGroups, mapReadingMissions, manualIntroPages, manualRenewalPages, manualScheduleLinks, walkthroughStorageKey } from '../../site/shared/walkthrough/state.js';
import { rememberWalkthroughTarget, takeWalkthroughTarget } from '../../site/shared/walkthrough/navigation.js';
import {articleReadingMission} from '../../site/shared/walkthrough/reading.js';
import {runInNewContext} from 'node:vm';
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
  for (const [id,pathname,hash,selector] of [
    ['article','/guides/','','[data-guide-map-index]'],
    ['manual-schedule-article','/manual/','#timeline','#panel-timeline .manual-guide[href="/manual/equipment-renewal/"]'],
    ['manual-renewal','/manual/equipment-renewal/','',null],
    ['manual-quote','/manual/','#manual-consultation','#manual-consultation .consult-provider-action'],
    ['manual-article','/manual/','#troubles','#panel-troubles .manual-guide:not([href="/manual/equipment-renewal/"])']
  ]) {
    host.location={pathname,hash};
    rememberWalkthroughTarget(id,host,1000);
    assert.equal(takeWalkthroughTarget(host,1100),selector);
    assert.equal(takeWalkthroughTarget(host,1200),null);
  }
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

test('トリセツは5項目を有効にし，更新記事の3ページ読了は節目の記事読了も満たす',()=>{
  const mapSaved='{"completed":[0,1],"pawn":"female"}';
  const saved=new Map([[walkthroughStorageKey,JSON.stringify({article:true,diagnosis:true})],['haretoku-step-map-v3',mapSaved]]);
  const host={localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)},dispatchEvent(){}};
  assert.deepEqual(missionGroups.map(group=>group.id),['map','guides','manual']);
  const manual=missionGroups.find(group=>group.id==='manual');
  for(const page of [manualIntroPages[2],manualIntroPages[0]])completeMission(page.id,{host});
  assert.equal(readWalkthrough(host)['manual-intro'],undefined);
  assert.equal(groupProgress(manual,readWalkthrough(host)).done,0);
  completeMission(manualIntroPages[1].id,{host});
  assert.equal(readWalkthrough(host)['manual-intro'],true);
  assert.equal(groupProgress(manual,readWalkthrough(host)).done,1);
  assert.equal(manual.missions.length,5);
  assert.equal(manual.missions[1].pending,false);
  assert.equal(readWalkthrough(host)['manual-schedule-article'],undefined);
  for(const page of manualRenewalPages.slice(0,2))completeMission(page.id,{host});
  assert.equal(readWalkthrough(host)['manual-renewal'],undefined);
  completeMission(manualRenewalPages[2].id,{host});
  assert.equal(readWalkthrough(host)['manual-renewal'],true);
  assert.equal(readWalkthrough(host)['manual-article'],undefined);
  for(const id of ['manual-quote','manual-article'])completeMission(id,{host});
  assert.equal(readWalkthrough(host)['manual-schedule-article'],true);
  assert.deepEqual(groupProgress(manual,readWalkthrough(host)),{done:5,total:5,percent:100,complete:true});
  assert.equal(readWalkthrough(host).article,true);
  assert.equal(readWalkthrough(host).diagnosis,true);
  assert.equal(saved.get('haretoku-step-map-v3'),mapSaved);
  clearWalkthrough(host);
  assert.deepEqual(readWalkthrough(host),{});
  assert.equal(saved.get('haretoku-step-map-v3'),mapSaved);
});

test('記事の読了先は現在の一覧で分類し，トリセツ2記事とガイド8記事を混同しない',async()=>{
  const articles=JSON.parse(await readFile(new URL('../../site/solar/data/articles.json',import.meta.url),'utf8'));
  assert.equal(articleReadingMission('/guides/self-consumption/',articles),'manual-article');
  assert.equal(articleReadingMission('/guides/disaster/',articles),'manual-article');
  assert.equal(articles.filter(article=>articleReadingMission(article.href,articles)==='article').length,8);
  assert.equal(articleReadingMission('/guides/electricity-support-end/',articles),null);
  for(const page of [...manualIntroPages,...manualRenewalPages])assert.equal(articleReadingMission(page.pathname,articles),null);
  assert.deepEqual(manualScheduleLinks.map(link=>link.href),['/manual/equipment-renewal/']);
  manualScheduleLinks.push({href:'/manual/inspection/'});
  try { assert.equal(articleReadingMission('/manual/inspection/',articles),'manual-schedule-article'); } finally { manualScheduleLinks.pop(); }
});

test('TOPのタブを見ただけでは達成させず，記事末尾と外部リンク操作を記録する',async()=>{
  const source=(await readFile(new URL('../../site/shared/walkthrough/tracker.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
  function fixture(pathname){
    const done=[],observers=[],events={};const ending={};
    const document={querySelector:selector=>selector==='.starter-response-person'?ending:null,addEventListener:(type,handler)=>events[type]=handler};
    runInNewContext(source,{document,location:{pathname},articles:[],manualIntroPages,manualRenewalPages,articleReadingMission:()=>null,completeMission:id=>done.push(id),
      IntersectionObserver:class{constructor(callback){this.callback=callback;observers.push(this);}observe(element){this.element=element;}disconnect(){}}
    });return {done,observers,events};
  }
  const top=fixture('/manual/');assert.equal(top.observers.length,0);assert.deepEqual(top.done,[]);
  const page=fixture('/manual/equipment-renewal/costs/');
  assert.deepEqual(page.done,[]);
  page.observers[0].callback([{isIntersecting:false,intersectionRatio:0}]);assert.deepEqual(page.done,[]);
  page.observers[0].callback([{isIntersecting:true,intersectionRatio:1}]);assert.deepEqual(page.done,['manual-renewal-page-2']);
  const manual=fixture('/manual/');
  manual.events.click({type:'click',button:0,target:{closest:()=>({getAttribute:name=>name==='href'?'https://example.com':null})}});
  assert.deepEqual(manual.done,['quote','manual-quote']);
  const home=fixture('/');
  const target=(href,disabled=false)=>({closest:()=>({getAttribute:name=>name==='href'?href:name==='aria-disabled'&&disabled?'true':null})});
  home.events.click({type:'click',button:0,target:target('#map-consultation')});
  home.events.click({type:'click',button:0,target:target('https://example.com',true)});
  home.events.auxclick({type:'auxclick',button:2,target:target('https://example.com')});
  assert.deepEqual(home.done,[]);
  home.events.click({type:'click',button:0,target:target('https://example.com')});
  assert.deepEqual(home.done,['quote','manual-quote']);
  const middle=fixture('/');middle.events.auxclick({type:'auxclick',button:1,target:target('https://example.com')});
  assert.deepEqual(middle.done,['quote','manual-quote']);
});

test('旧一覧の閲覧は新しい記事読了へ流用せず，有効な導入・記事・MAPの達成を引き継ぐ',()=>{
  const saved=new Map([[walkthroughStorageKey,JSON.stringify({'manual-timeline':true,'manual-troubles':true,'manual-intro':true,'manual-article':true,quote:true,article:true})]]);
  const host={localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value)},dispatchEvent(){}};
  assert.deepEqual(readWalkthrough(host),{'manual-intro':true,'manual-article':true,quote:true,article:true});
  const group=missionGroups.find(g=>g.id==='manual');assert.deepEqual(groupProgress(group,readWalkthrough(host)),{done:2,total:5,percent:40,complete:false});
  const ready={...group,missions:group.missions.map(m=>({...m,pending:false}))};
  assert.deepEqual(groupProgress(ready,readWalkthrough(host)),{done:2,total:5,percent:40,complete:false});
});

test('v1から読んだ時点でv2へ移行し，旧タブの後続書込みから新進捗を保護する',()=>{
  const saved=new Map([['haretoku-walkthrough-v1',JSON.stringify({'manual-renewal-page-1':true,'manual-article':true,article:true,'manual-timeline':true})]]);
  const host={localStorage:{getItem:key=>saved.get(key)??null,setItem:(key,value)=>saved.set(key,value),removeItem:key=>saved.delete(key)},dispatchEvent(){}};
  const first=readWalkthrough(host);
  assert.deepEqual(first,{'manual-renewal-page-1':true,'manual-article':true,article:true});
  assert.deepEqual(JSON.parse(saved.get(walkthroughStorageKey)),first);
  saved.set('haretoku-walkthrough-v1',JSON.stringify({'read-intro':true,article:true}));
  assert.deepEqual(readWalkthrough(host),first);
  completeMission('manual-renewal-page-2',{host});
  assert.equal(readWalkthrough(host)['manual-renewal-page-1'],true);
  clearWalkthrough(host);
  assert.equal(saved.has(walkthroughStorageKey),false);
  assert.equal(saved.has('haretoku-walkthrough-v1'),false);
  assert.deepEqual(readWalkthrough(host),{});
});


test('歩き方の対象タブは，MAP・ガイドとトリセツへ既存項目を分ける',async()=>{
  const {walkthroughAudiences}=await import('../../site/shared/walkthrough/audience.js');
  assert.deepEqual(walkthroughAudiences.map(tab=>[tab.label,tab.groups]),[['太陽光を考えている方へ',['map','guides']],['太陽光をつけた方へ',['manual']]]);
  assert.deepEqual(walkthroughAudiences.flatMap(tab=>tab.groups),missionGroups.map(group=>group.id));
});

test('歩き方の初期タブは，トリセツ配下と再配置した既存記事も設置後へ分類する',async()=>{
  const {initialWalkthroughAudience}=await import('../../site/shared/walkthrough/audience.js');
  for(const path of ['/manual/','/manual/index.html','/manual/getting-started/','/manual/equipment-renewal/costs/','/guides/self-consumption/','/guides/disaster/'])assert.equal(initialWalkthroughAudience(path),'installed',path);
  for(const path of ['/','/index.html','/guides/','/guides/solar-living/','/guides/solar-maintenance-cost/','/simulator/','/press/','/data/'])assert.equal(initialWalkthroughAudience(path),'considering',path);
});

 test('手動選択した対象タブをページ移動・再訪で優先し，未保存・無効値・保存不可ならページから選ぶ',async()=>{
  const {preferredWalkthroughAudience,saveWalkthroughAudience,walkthroughAudienceKey}=await import('../../site/shared/walkthrough/audience.js');
  const values=new Map();const host={localStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value)}};
  assert.equal(preferredWalkthroughAudience('/manual/',host),'installed');
  assert.equal(values.size,0);
  saveWalkthroughAudience('considering',host);
  assert.equal(preferredWalkthroughAudience('/manual/',host),'considering');
  saveWalkthroughAudience('installed',host);
  assert.equal(preferredWalkthroughAudience('/guides/',host),'installed');
  saveWalkthroughAudience('invalid',host);
  assert.equal(values.get(walkthroughAudienceKey),'installed');
  values.set(walkthroughAudienceKey,'invalid');
  assert.equal(preferredWalkthroughAudience('/manual/',host),'installed');
  const blocked={localStorage:{getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}}};
  assert.equal(preferredWalkthroughAudience('/',blocked),'considering');
  assert.doesNotThrow(()=>saveWalkthroughAudience('installed',blocked));
 });
 test('保存済みの更新読了も節目の記事読了に引き継ぐ',()=>{
  const values=new Map([[walkthroughStorageKey,JSON.stringify({'manual-renewal':true})]]);
  const host={localStorage:{getItem:key=>values.get(key)??null}};
  assert.equal(readWalkthrough(host)['manual-schedule-article'],true);
 });
