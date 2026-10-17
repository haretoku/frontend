import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readProgress,writeProgress} from '../../site/map/progress-storage.js';

// 実際のjourney入口を読み込み，DOM操作だけを小さく代替する．保存・復元・fetch待ちは本体の経路を通す．
function browserFixture(saved){
  const nodes=new Map(),handlers=new Map(),windowHandlers=new Map();
  function node(){return {hidden:false,value:'',innerHTML:'',textContent:'',dataset:{},handlers:new Map(),classList:{toggle(){}},setAttribute(){},removeAttribute(){},toggleAttribute(){},append(){},remove(){},focus(){this.focused=true;},reset(){},close(){},showModal(){},scrollIntoView(){this.scrolled=true;},addEventListener(type,fn){this.handlers.set(type,fn);}};}
  const query=selector=>{if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);};
  const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
  const location=new URL('http://localhost:5173/#map');
  const document={body:{classList:{toggle(){}}},querySelector:query,querySelectorAll:()=>[],createElement:node,addEventListener(type,fn){if(!handlers.has(type))handlers.set(type,[]);handlers.get(type).push(fn);}};
  const window={document,location,localStorage:storage(),sessionStorage:storage(),addEventListener(type,fn){windowHandlers.set(type,fn);},scrollTo(){}};
  writeProgress(saved,window);
  const keys=['window','document','location','history','requestAnimationFrame','fetch'],originals=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  let release,reject,fetchCalls=0;
  const gate=new Promise((resolve,fail)=>{release=resolve;reject=fail;});
  Object.assign(globalThis,{window,document,location,history:{replaceState(a,b,url){location.href=new URL(url,location).href;}},requestAnimationFrame:fn=>fn(),fetch:async url=>{fetchCalls++;await gate;return {ok:true,json:async()=>JSON.parse(await readFile(url,'utf8'))};}});
  return {window,nodes,query,release,reject,get fetchCalls(){return fetchCalls;},restore(){for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}},clickProvider(id='tainavi'){
    const link={dataset:{consultProvider:id},href:id==='tainavi'?'https://www.tainavi.com/':'https://griene.jp/'};
    const event={button:0,defaultPrevented:false,target:{closest:selector=>selector==='[data-consult-provider]'?link:null}};
    for(const handler of handlers.get('click')??[])handler(event);
  },choosePawn(value){for(const handler of handlers.get('change')??[])handler({target:{name:'pawn',value}});},pageshow(){windowHandlers.get('pageshow')?.({persisted:true});}};
}
const saved=()=>({step:4,last:{4:'compare'},pawn:'male',pawnChosen:true,completed:[0,1,2,3],consultation:{viewed:true,openedProviderIds:['griene']},input:{prefectureCode:'08',monthlyElectricityBillYen:null,keep:'raw-input'},goal:{equipment:'solar_only',input:{prefectureCode:'08',monthlyElectricityBillYen:null},keep:'raw-goal'}});

test('実入口：診断の正規URLは保存済みプランを保ち，リンク先とcanonicalを統一する',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/simulator/';
    const {imported}=await begin(f,'canonical-diagnosis');f.release();await imported;
    assert.equal(f.query('#map').hidden,true);assert.equal(f.query('#reading').hidden,false);
    assert.equal(f.query('#page-title').textContent,'わが家では，どのくらい得になりそう？');
    assert.equal(f.query('#next').href,'/');
    assert.equal(f.query('#diagnose').hidden,false);
    assert.equal(f.query('#diagnosis-result').hidden,false);
    assert.equal(readProgress(f.window).goal.equipment,'solar_only');
    assert.equal(readProgress(f.window).input.prefectureCode,'08');
  }finally{f.restore();}
});

test('実入口：履歴キャッシュから戻ったMAPは他ページで保存したプランと読了を反映する',async()=>{
  const f=browserFixture(saved());
  try{
    const {imported}=await begin(f,'history-cache');f.release();await imported;
    const input={prefectureCode:'13',monthlyElectricityBillYen:20000};
    const latest={...readProgress(f.window),input,goal:{input,equipment:'solar_plus_standard_battery'},completed:[0,1,2,3,4]};
    writeProgress(latest,f.window);f.pageshow();
    assert.equal(f.query('#goal-equipment').textContent,'太陽光4 kW＋蓄電池9.5 kWh');
    assert.equal(f.query('#prefecture').value,'13');assert.equal(f.query('#bill').value,20000);
    assert.deepEqual(readProgress(f.window).completed,[0,1,2,3,4]);
    assert.equal(readProgress(f.window).goal.equipment,'solar_plus_standard_battery');
  }finally{f.restore();}
});

async function begin(f,label){
  let error;
  const imported=import(`../../site/map/journey.js?bootstrap-test=${label}`).catch(failure=>{error=failure;throw failure;});
  for(let attempt=0;attempt<100&&f.fetchCalls<2&&!error;attempt++)await new Promise(resolve=>setTimeout(resolve,5));
  assert.equal(error,undefined);assert.equal(f.fetchCalls,2);
  return {imported};
}

test('実入口：旧5章URLをMAPへ戻し，GOALから相談先へ移動しても読了やクリックを捏造しない',async()=>{
  const original={...saved(),step:5,last:{4:'compare',5:'quote'},completed:[0,1,2,3,4,5],consultation:{viewed:true,openedProviderIds:[]}},f=browserFixture(original);
  try{
    f.window.location.hash='#quote';
    const {imported}=await begin(f,'retired-quote');
    assert.equal(f.window.location.pathname,'/');assert.equal(f.window.location.hash,'');
    assert.equal(f.query('#map').hidden,false);assert.equal(f.query('#map-consultation').hidden,false);
    assert(f.query('#map-consultation').innerHTML.includes('ソーラーパートナーズ'));
    f.query('#goal-consult').handlers.get('click')();
    assert.equal(f.query('#map-consultation').scrolled,true);assert.equal(f.query('#map-consultation-title').focused,true);
    f.reject(Error('simulated data failure'));await imported;
    const current=readProgress(f.window);
    assert.deepEqual(current.completed,[0,1,2,3,4]);assert.deepEqual(current.consultation.openedProviderIds,[]);
    assert.deepEqual(current.input,original.input);assert.deepEqual(current.goal,original.goal);
  }finally{f.restore();}
});

test('実入口：データ失敗前に保存を復元し，失敗後も相談clickとraw入力・プランを保存する',async()=>{
  const original=saved(),f=browserFixture(original);
  try{
    const {imported}=await begin(f,'failure');
    assert(f.query('#map-consultation').innerHTML.includes('タイナビ'));
    f.clickProvider();f.choosePawn('female');
    assert.deepEqual(readProgress(f.window).consultation.openedProviderIds,['griene','tainavi']);
    f.reject(Error('simulated data failure'));await imported;
    assert.match(f.query('#form-message').textContent,/診断データを読み込めません/);
    f.clickProvider('griene');
    const current=readProgress(f.window);assert.deepEqual(current.input,original.input);assert.deepEqual(current.goal,original.goal);
    assert.equal(current.pawn,'female');assert(!current.completed.includes(5));assert.equal(f.query('#goal-consultation-status').hidden,false);
  }finally{f.restore();}
});

test('実入口：正常取得までの早期click・駒変更を復元し直さず，入力だけ検証する',async()=>{
  const f=browserFixture(saved());
  try{
    const {imported}=await begin(f,'success');f.clickProvider();f.choosePawn('female');f.release();await imported;
    const current=readProgress(f.window);assert.equal(current.pawn,'female');assert.deepEqual(current.consultation.openedProviderIds,['griene','tainavi']);
    assert.deepEqual(current.input,{prefectureCode:'08',monthlyElectricityBillYen:null});assert.equal(current.goal.equipment,'solar_only');
    assert.equal(f.query('#goal-amount').textContent.includes('万円'),true);
  }finally{f.restore();}
});

test('実入口：読込み待ちのリセットは，取得成功後も旧保存・URL条件へ巻き戻らない',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.search='?prefecture=08&from=analysis';
    const {imported}=await begin(f,'reset');f.clickProvider();f.query('#confirm-reset').handlers.get('click')();
    assert.equal(f.window.location.search,'');f.release();await imported;
    const current=readProgress(f.window);assert.equal(current.input,null);assert.equal(current.goal,null);assert.equal(current.pawn,'male');assert.equal(current.pawnChosen,true);
    assert.deepEqual(current.consultation,{viewed:false,openedProviderIds:[]});assert.equal(f.query('#map-consultation').hidden,false);
  }finally{f.restore();}
});

test('実入口：説明ページはデータ到着後も読者が開いた質問とフォーカスを作り直さない',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/guides/home-battery/';
    const {imported}=await begin(f,'reading-interaction');
    const questions=f.query('#page-questions'),title=f.query('#page-title');
    questions.innerHTML='<details open>読者が開いた質問</details>';title.focused=false;
    f.release();await imported;
    assert.equal(questions.innerHTML,'<details open>読者が開いた質問</details>');
    assert.equal(title.focused,false);
  }finally{f.restore();}
});

test('実入口：旧保存の読込み中に開始した診断は，データ到着後も入力欄を表示する',async()=>{
  const f=browserFixture({...saved(),goal:null,completed:[]});
  try{
    f.window.location.href='http://localhost:5173/simulator/';
    const {imported}=await begin(f,'early-diagnosis-start');
    f.query('#start-diagnosis').handlers.get('click')();
    assert.equal(f.query('#diagnose').hidden,false);
    f.release();await imported;
    assert.equal(f.query('#diagnose').hidden,false);
    assert.equal(f.query('#diagnosis-result').hidden,false);
    assert.equal(f.query('#prefecture').value,'08');
  }finally{f.restore();}
});

test('実入口：相談先のページは2つの同格な進路を表示し，読むだけでは章を完了しない',async()=>{
  const original={...saved(),consultation:{viewed:false,openedProviderIds:[]}},f=browserFixture(original);
  try{
    f.window.location.hash='#companies';
    const {imported}=await begin(f,'company-routes');f.release();await imported;
    assert.equal(f.query('#next').hidden,true);
    assert.equal(f.query('#next-routes').hidden,false);
    const routes=f.query('#next-routes').innerHTML;
    assert.equal((routes.match(/class="primary"/g)??[]).length,2);
    assert.match(routes,/href="\/guides\/quote-services\/"/);assert.match(routes,/href="\/guides\/choosing-installer\/"/);
    const current=readProgress(f.window);
    assert.deepEqual(current.completed,original.completed);
    assert.equal(current.goal.equipment,original.goal.equipment);
  }finally{f.restore();}
});
