import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readProgress,writeProgress} from '../../site/map/progress-storage.js';

test('TOPのtitle・OGとMAPへ戻る際のタイトルをブランド先頭へそろえる',async()=>{
  const title='はれトク｜わが家の太陽光・蓄電池えらび';
  const html=await readFile(new URL('../../site/index.html',import.meta.url),'utf8');
  const journey=await readFile(new URL('../../site/map/journey.js',import.meta.url),'utf8');
  assert(html.includes(`<title>${title}</title>`));
  assert(html.includes(`<meta property="og:title" content="${title}">`));
  assert(journey.includes(`document.title='${title}'`));
});

// 実際のjourney入口を読み込み，DOM操作だけを小さく代替する．保存・復元・fetch待ちは本体の経路を通す．
function browserFixture(saved){
  const nodes=new Map(),handlers=new Map(),windowHandlers=new Map();
  function node(){return {hidden:false,value:'',innerHTML:'',textContent:'',dataset:{},handlers:new Map(),classList:{toggle(){}},setAttribute(){},removeAttribute(){},toggleAttribute(){},append(){},remove(){},focus(){this.focused=true;},reset(){},close(){},showModal(){},scrollIntoView(){this.scrolled=true;},addEventListener(type,fn){this.handlers.set(type,fn);}};}
  const query=selector=>{if(!nodes.has(selector))nodes.set(selector,node());return nodes.get(selector);};
  const storage=()=>{const values=new Map();return {getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)};};
  const location=new URL('http://localhost:5173/#map');
  location.assign=url=>{location.href=new URL(url,location).href;};
  const document={body:{classList:{toggle(){}}},querySelector:query,querySelectorAll:()=>[],createElement:node,addEventListener(type,fn){if(!handlers.has(type))handlers.set(type,[]);handlers.get(type).push(fn);}};
  const window={document,location,localStorage:storage(),sessionStorage:storage(),addEventListener(type,fn){windowHandlers.set(type,fn);},scrollTo(){}};
  writeProgress(saved,window);
  const keys=['window','document','location','history','requestAnimationFrame','fetch'],originals=new Map(keys.map(key=>[key,Object.getOwnPropertyDescriptor(globalThis,key)]));
  let release,reject,fetchCalls=0;
  const gate=new Promise((resolve,fail)=>{release=resolve;reject=fail;});
  Object.assign(globalThis,{window,document,location,history:{replaceState(a,b,url){location.href=new URL(url,location).href;}},requestAnimationFrame:fn=>fn(),fetch:async url=>{fetchCalls++;await gate;return {ok:true,json:async()=>JSON.parse(await readFile(url,'utf8'))};}});
  query('#diagnose').checkValidity=()=>query('#bill').value===''||(/^\d+$/.test(query('#bill').value)&&Number(query('#bill').value)<=1000000);
  const click=selector=>{const target={closest:value=>value===selector?{}:null};for(const handler of handlers.get('click')??[])handler({button:0,defaultPrevented:false,target});};
  return {window,nodes,query,release,reject,get fetchCalls(){return fetchCalls;},restore(){for(const [key,descriptor] of originals){if(descriptor)Object.defineProperty(globalThis,key,descriptor);else delete globalThis[key];}},clickNext(){click('#next');},edit(id,value){query(`#${id}`).value=value;query('#diagnose').handlers.get('input')({target:{id}});},submit(){query('#diagnose').handlers.get('submit')({preventDefault(){}});},clickProvider(id='tainavi',href){
    const link={dataset:{consultProvider:id},href:href??(id==='tainavi'?'https://www.tainavi.com/':'https://griene.jp/')};
    const event={button:0,defaultPrevented:false,target:{closest:selector=>selector==='[data-consult-provider]'?link:null}};
    for(const handler of handlers.get('click')??[])handler(event);
  },choosePawn(value){for(const handler of handlers.get('change')??[])handler({target:{name:'pawn',value}});},pageshow(){windowHandlers.get('pageshow')?.({persisted:true});}};
}
const saved=()=>({step:4,last:{4:'compare'},pawn:'male',pawnChosen:true,completed:[0,1,2,3],consultation:{viewed:true,openedProviderIds:['griene']},input:{prefectureCode:'08',monthlyElectricityBillYen:null,keep:'raw-input'},goal:{equipment:'solar_only',input:{prefectureCode:'08',monthlyElectricityBillYen:null},keep:'raw-goal'}});

test('実入口：TOPの相談欄へ直接入るとカード位置へ移動し，診断入力を変えない',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/#map-consultation';
    const {imported}=await begin(f,'consultation-anchor');
    assert.equal(f.query('#map-consultation').scrolled,true);
    assert.equal(f.query('#map-consultation-title').focused,true);
    assert.equal(f.query('#map').hidden,false);
    assert.deepEqual(readProgress(f.window).input,saved().input);
    f.release();await imported;
    assert.equal(f.window.location.hash,'#map-consultation');
    assert.deepEqual(readProgress(f.window).input,{prefectureCode:'08',monthlyElectricityBillYen:null});
  }finally{f.restore();}
});

test('実入口：データ待ち中の電気代編集は旧保存より優先し，未編集の地域だけ復元する',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/simulator/';
    const {imported}=await begin(f,'draft-bill');
    f.query('#start-diagnosis').handlers.get('click')();f.edit('bill','20000');
    f.release();await imported;
    assert.equal(f.query('#bill').value,'20000');assert.equal(f.query('#prefecture').value,'08');
    assert.deepEqual(readProgress(f.window).input,{prefectureCode:'08',monthlyElectricityBillYen:20000});
    assert.equal(f.query('#diagnosis-result').hidden,false);
  }finally{f.restore();}
});

test('実入口：URL復元でも編集中の地域を上書きせず，未編集の電気代だけ継承する',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/simulator/?prefecture=13&monthlyElectricityBill=12000';
    const {imported}=await begin(f,'draft-prefecture-query');
    f.query('#start-diagnosis').handlers.get('click')();f.edit('prefecture','21');
    f.release();await imported;
    assert.equal(f.query('#prefecture').value,'21');assert.equal(f.query('#bill').value,12000);
    assert.deepEqual(readProgress(f.window).input,{prefectureCode:'21',monthlyElectricityBillYen:12000});
    assert.equal(f.window.location.search,'');
  }finally{f.restore();}
});

test('実入口：データ待ち中の不正値と空の地域は復元せず，旧結果を表示しない',async()=>{
  for(const [id,value] of [['bill','-1'],['prefecture','']]){
    const f=browserFixture(saved());
    try{
      f.window.location.href='http://localhost:5173/simulator/';
      const {imported}=await begin(f,`draft-invalid-${id}`);
      f.query('#start-diagnosis').handlers.get('click')();f.edit(id,value);
      f.release();await imported;
      assert.equal(f.query(`#${id}`).value,value);assert.equal(f.query('#diagnosis-result').hidden,true);
      assert.deepEqual(readProgress(f.window).input,{prefectureCode:'08',monthlyElectricityBillYen:null});
    }finally{f.restore();}
  }
});

test('実入口：他タブのプラン・入力・読了を駒変更と相談クリックで巻き戻さない',async()=>{
  const f=browserFixture(saved());
  try{
    const {imported}=await begin(f,'concurrent-unrelated');f.release();await imported;
    const input={prefectureCode:'21',monthlyElectricityBillYen:20000};
    const goal={input,equipment:'solar_plus_standard_battery'};
    writeProgress({...readProgress(f.window),input,goal,completed:[0,1,2,3,4],last:{2:'disaster'},consultation:{viewed:true,openedProviderIds:['solar-partners']}},f.window);
    f.choosePawn('female');f.clickProvider('tainavi');
    const current=readProgress(f.window);
    assert.deepEqual(current.input,input);assert.deepEqual(current.goal,goal);
    assert.deepEqual(current.completed,[0,1,2,3,4]);assert.deepEqual(current.last,{2:'disaster'});
    assert.deepEqual(current.consultation.openedProviderIds,['solar-partners','tainavi']);assert.equal(current.pawn,'female');
    assert.equal(f.query('#goal-equipment').textContent,'太陽光4 kW＋蓄電池9.5 kWh');
  }finally{f.restore();}
});

test('実入口：一時保存失敗から復帰したタブも，他タブの新しいlocalプランを巻き戻さない',async()=>{
  const f=browserFixture(saved());
  try{
    const {imported}=await begin(f,'concurrent-after-fallback');f.release();await imported;
    const write=f.window.localStorage.setItem;
    f.window.localStorage.setItem=()=>{throw Error('temporary denial');};
    f.choosePawn('female');f.window.localStorage.setItem=write;
    const values=new Map(),other={localStorage:f.window.localStorage,sessionStorage:{getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)}};
    const input={prefectureCode:'21',monthlyElectricityBillYen:20000},goal={input,equipment:'solar_plus_standard_battery'};
    writeProgress({...readProgress(other),input,goal},other);
    f.choosePawn('male');
    assert.deepEqual(readProgress(other).input,input);assert.deepEqual(readProgress(other).goal,goal);
    assert.equal(readProgress(other).pawn,'male');
    assert.equal(f.query('#goal-equipment').textContent,'太陽光4 kW＋蓄電池9.5 kWh');
  }finally{f.restore();}
});

test('実入口：他タブの章読了とプランを現在の章読了へ合流する',async()=>{
  const f=browserFixture({...saved(),completed:[]});
  try{
    f.window.location.href='http://localhost:5173/guides/solar-costs/';
    const {imported}=await begin(f,'concurrent-complete');f.release();await imported;
    const input={prefectureCode:'21',monthlyElectricityBillYen:20000},goal={input,equipment:'solar_plus_standard_battery'};
    writeProgress({...readProgress(f.window),input,goal,completed:[1,2]},f.window);
    f.clickNext();
    assert.deepEqual(readProgress(f.window).completed,[0,1,2]);assert.deepEqual(readProgress(f.window).goal,goal);
  }finally{f.restore();}
});

test('実入口：初期自動プランのある診断で入力を変えても，他タブの明示プランを上書きしない',async()=>{
  const f=browserFixture({...saved(),goal:null});
  try{
    f.window.location.href='http://localhost:5173/simulator/';
    const {imported}=await begin(f,'concurrent-auto-plan');f.release();await imported;
    assert.equal(readProgress(f.window).goal.automatic,true);
    const input={prefectureCode:'21',monthlyElectricityBillYen:20000},goal={input,equipment:'solar_plus_standard_battery'};
    writeProgress({...readProgress(f.window),input,goal},f.window);
    f.edit('bill','16000');f.submit();
    assert.deepEqual(readProgress(f.window).goal,goal);
    assert.equal(f.query('#goal-equipment').textContent,'太陽光4 kW＋蓄電池9.5 kWh');
  }finally{f.restore();}
});

test('実入口：編集中のリセットもデータ到着時に診断を再開せず，URLとドラフトを消す',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/?prefecture=13&monthlyElectricityBill=12000#estimate';
    const {imported}=await begin(f,'reset-draft');
    f.query('#start-diagnosis').handlers.get('click')();f.edit('bill','16000');
    f.query('#confirm-reset').handlers.get('click')();f.release();await imported;
    assert.equal(readProgress(f.window).input,null);assert.equal(readProgress(f.window).goal,null);
    assert.equal(f.query('#map').hidden,false);assert.equal(f.window.location.search,'');
  }finally{f.restore();}
});

test('実入口：入力保存は他タブの明示プランを保持し，リセット後の履歴を復活させない',async()=>{
  const f=browserFixture(saved());
  try{
    f.window.location.href='http://localhost:5173/simulator/';
    const {imported}=await begin(f,'concurrent-input-reset');f.release();await imported;
    const input={prefectureCode:'21',monthlyElectricityBillYen:20000},goal={input,equipment:'solar_plus_standard_battery'};
    writeProgress({...readProgress(f.window),input,goal,pawn:'female'},f.window);
    f.edit('bill','16000');f.submit();
    assert.deepEqual(readProgress(f.window).input,{prefectureCode:'08',monthlyElectricityBillYen:16000});
    assert.deepEqual(readProgress(f.window).goal,goal);assert.equal(readProgress(f.window).pawn,'female');
    writeProgress(null,f.window);f.choosePawn('male');
    assert.equal(readProgress(f.window).goal,null);assert.equal(readProgress(f.window).input,null);
    assert.deepEqual(readProgress(f.window).completed,[]);
  }finally{f.restore();}
});

test('実入口：比較表の公式リンクも相談履歴に保存し，任意query付きリンクは対象外',async()=>{
  const f=browserFixture(saved());
  try{
    const {imported}=await begin(f,'comparison-provider');f.release();await imported;
    const goal=readProgress(f.window).goal;
    f.clickProvider('solar-partners','https://www.solar-partners.jp/?arbitrary=1');
    assert.deepEqual(readProgress(f.window).consultation.openedProviderIds,['griene']);
    f.clickProvider('solar-partners','https://www.solar-partners.jp/');
    assert.deepEqual(readProgress(f.window).consultation.openedProviderIds,['griene','solar-partners']);
    assert.deepEqual(readProgress(f.window).goal,goal);
  }finally{f.restore();}
});

test('実入口：両保存先が書込不可でも駒と相談履歴を現在の画面内で保持する',async()=>{
  const f=browserFixture(saved());
  try{
    const {imported}=await begin(f,'unavailable-storage');
    f.window.localStorage.setItem=()=>{throw Error('denied');};
    f.window.sessionStorage.setItem=()=>{throw Error('denied');};
    f.choosePawn('female');f.clickProvider('tainavi');
    f.release();await imported;
    assert.match(f.query('#response-portrait').innerHTML,/pawn-female/);
    assert.equal(f.nodes.has('#goal-consultation-status'),false);
    f.query('#confirm-reset').handlers.get('click')();f.choosePawn('female');
    assert.equal(f.query('#goal-equipment').textContent,'');
    assert.equal(f.nodes.has('#goal-consultation-status'),false);
  }finally{f.restore();}
});

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
    assert.equal(current.pawn,'female');assert(!current.completed.includes(5));assert.equal(f.nodes.has('#goal-consultation-status'),false);
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
