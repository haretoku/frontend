import test from 'node:test';
import assert from 'node:assert/strict';
import {pages,steps,starts} from '../../site/map/content.js';
import {completedSteps,chapterNavigation,finishChapter} from '../../site/map/chapter-progress.js';
import {readProgress,writeProgress} from '../../site/map/progress-storage.js';

test('章内は次ページへ進み，各章の最後だけマップへ戻る',()=>{
  for(let i=0;i<pages.length;i++){
    const page=pages[i],next=pages[i+1],last=!next||next.step!==page.step;
    const navigation=chapterNavigation(pages,page.id);
    assert.equal(navigation.href,last?'#map':`#${next.id}`);
    assert.equal(navigation.completedStep,last?page.step:null);
  }
  assert.equal(chapterNavigation(pages,'estimate').label,'わかった！ マップへ →');
  assert.equal(chapterNavigation(pages,'welcome').label,'わかった！ 次へ →');
  assert.equal(steps.length,5);assert.equal(pages.some(page=>page.step===5),false);
});

test('完了は重複せず，未完了の次ステップを案内して入力とプランを保つ',()=>{
  const original={step:1,completed:[],input:{prefectureCode:'08',monthlyElectricityBillYen:null},goal:{equipment:'solar_only'}};
  const finished=finishChapter(original,1,steps.length);
  assert.deepEqual(finished.completed,[1]);assert.equal(finished.step,2);
  assert.deepEqual(original.completed,[]);assert.equal(finished.input,original.input);assert.equal(finished.goal,original.goal);
  assert.deepEqual(finishChapter(finished,1,steps.length).completed,[1]);
  assert.equal(finishChapter({...finished,completed:[1,2]},0,steps.length).step,3);
  assert.equal(finishChapter({...finished,completed:[0,1,2,3]},4,steps.length).step,4);
});

test('旧保存に完了を捏造せず，不正値を除き，追加した進捗を再読込できる',()=>{
  assert.deepEqual(completedSteps(undefined,6),[]);
  assert.deepEqual(completedSteps([0,1,1,-1,6,'2',1.5,null],6),[0,1]);
  const values=new Map(),host={localStorage:{setItem:(key,value)=>values.set(key,value),getItem:key=>values.get(key)},sessionStorage:{removeItem(){},getItem(){return null;}}};
  const state=finishChapter({completed:[]},1,6);writeProgress(state,host);
  assert.deepEqual(readProgress(host),state);
  assert.throws(()=>finishChapter(state,6,6));
});

test('第2章は既存4ページを保ち，災害ページで読了して入力とプランを保つ',()=>{
  const chapter=pages.filter(page=>page.step===2);
  assert.deepEqual(chapter.map(page=>page.id),['electricity','money','roof','backup','disaster']);
  assert.deepEqual(chapterNavigation(pages,'backup'),{href:'#disaster',label:'わかった！ 次へ →',completedStep:null});
  assert.deepEqual(chapterNavigation(pages,'disaster'),{href:'#map',label:'わかった！ マップへ →',completedStep:2});
  assert.deepEqual(chapter.filter(page=>page.reselect),[]);
  const original={step:2,completed:[0,1],last:{2:'backup'},input:{prefectureCode:'08',monthlyElectricityBillYen:null},goal:{equipment:'solar_only'}};
  const finished=finishChapter(original,chapterNavigation(pages,'disaster').completedStep,steps.length);
  assert.deepEqual(finished.completed,[0,1,2]);assert.equal(finished.step,3);
  assert.equal(finished.last,original.last);assert.equal(finished.input,original.input);assert.equal(finished.goal,original.goal);
});

test('第3章は希望を考えるページから始まり，既存URL・保存位置を保って契約と引渡しで終える',()=>{
  assert.equal(starts[3],'preparation');
  assert.deepEqual(pages.filter(page=>page.step===3).map(page=>page.id),['preparation','consultation','installation']);
  assert.deepEqual(chapterNavigation(pages,'preparation'),{href:'#consultation',label:'わかった！ 次へ →',completedStep:null});
  assert.deepEqual(chapterNavigation(pages,'consultation'),{href:'#installation',label:'わかった！ 次へ →',completedStep:null});
  assert.deepEqual(chapterNavigation(pages,'installation'),{href:'#map',label:'わかった！ マップへ →',completedStep:3});
  assert.equal(pages[pages.findIndex(page=>page.id==='consultation')-1].id,'preparation');
  assert.equal(pages[pages.findIndex(page=>page.id==='installation')-1].id,'consultation');
  for(const id of ['consultation','installation']){
    const values=new Map(),host={localStorage:{setItem:(key,value)=>values.set(key,value),getItem:key=>values.get(key)},sessionStorage:{removeItem(){},getItem(){return null;}}};
    const state={step:3,completed:[0,1,2],last:{3:id},input:{prefectureCode:'08',monthlyElectricityBillYen:null},goal:{equipment:'solar_only'}};
    writeProgress(state,host);const restored=readProgress(host);
    assert.deepEqual(restored,state);assert(pages.some(page=>page.id===restored.last[3]&&page.step===3));
    const finished=finishChapter(restored,3,steps.length);
    assert.equal(finished.step,4);assert.deepEqual(finished.completed,[0,1,2,3]);
    assert.equal(finished.input,restored.input);assert.equal(finished.goal,restored.goal);
  }
});

test('第4章は3ページ目で読了し，既存URLと入力・選択プランを保持して相談へ進む',()=>{
  assert.equal(starts[4],'companies');
  assert.deepEqual(pages.filter(page=>page.step===4).map(page=>page.id),['companies','quote-sites','compare']);
  assert.deepEqual(chapterNavigation(pages,'companies'),{href:'#quote-sites',label:'わかった！ 次へ →',completedStep:null});
  assert.deepEqual(chapterNavigation(pages,'quote-sites'),{href:'#compare',label:'わかった！ 次へ →',completedStep:null});
  assert.deepEqual(chapterNavigation(pages,'compare'),{href:'#map',label:'わかった！ マップへ →',completedStep:4});
  assert.equal(pages[pages.findIndex(page=>page.id==='compare')-1].id,'quote-sites');
  assert.equal(pages.at(-1).id,'compare');
  const routes=pages.find(page=>page.id==='companies').nextRoutes;
  assert.deepEqual(routes.map(route=>route.href),['#quote-sites','#compare']);
  for(const route of routes)assert.equal(pages.find(page=>page.id===route.href.slice(1)).step,4);
  assert.equal(pages.some(page=>page.id==='quote'),false);
  for(const id of ['companies','compare','quote-sites']){
    const values=new Map(),host={localStorage:{setItem:(key,value)=>values.set(key,value),getItem:key=>values.get(key)},sessionStorage:{removeItem(){},getItem(){return null;}}};
    const state={step:4,completed:[0,1,2,3],last:{4:id},input:{prefectureCode:'08',monthlyElectricityBillYen:null},goal:{equipment:'solar_only'}};
    writeProgress(state,host);const restored=readProgress(host);
    assert.deepEqual(restored,state);assert(pages.some(page=>page.id===restored.last[4]&&page.step===4));
    const finished=finishChapter(restored,4,steps.length);
    assert.equal(finished.step,4);assert.deepEqual(finished.completed,[0,1,2,3,4]);
    assert.equal(finished.last,restored.last);assert.equal(finished.input,restored.input);assert.equal(finished.goal,restored.goal);
  }
});
