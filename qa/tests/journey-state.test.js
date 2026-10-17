import test from 'node:test';
import assert from 'node:assert/strict';
import {initialJourneyState,restoreJourneyState,normalizeJourneyDiagnosis,validJourneyInput,applyInitialSolarPlan} from '../../site/map/journey-state.js';
import {openConsultationProvider} from '../../site/map/consultation-progress.js';
import {readProgress,writeProgress} from '../../site/map/progress-storage.js';
import {pages,steps} from '../../site/map/content.js';

const prefectures=[{code:'08'}],equipment=['solar_only','solar_plus_standard_battery'];
function host(){const local=new Map(),session=new Map();const storage=values=>({getItem:key=>values.get(key)??null,setItem:(key,value)=>values.set(key,value),removeItem:key=>values.delete(key)});return {localStorage:storage(local),sessionStorage:storage(session)};}
const saved=()=>({step:4,last:{4:'compare'},pawn:'male',pawnChosen:true,completed:[0,1,2,3],consultation:{viewed:true,openedProviderIds:['griene']},input:{prefectureCode:'08',monthlyElectricityBillYen:null,retained:'raw-input'},goal:{equipment:'solar_only',input:{prefectureCode:'08',monthlyElectricityBillYen:null},retained:'raw-goal'}});

test('廃止した5章の保存を4章とGOALへ移し，入力・プラン・相談先の履歴を保つ',()=>{
  const original={...saved(),step:5,last:{4:'compare',5:'quote'},completed:[0,1,2,3,4,5]};
  const restored=restoreJourneyState(original,pages,steps.length);
  assert.equal(restored.step,4);assert.deepEqual(restored.completed,[0,1,2,3,4]);
  assert.deepEqual(restored.last,{4:'compare'});assert.deepEqual(restored.consultation,original.consultation);
  assert.equal(restored.input,original.input);assert.equal(restored.goal,original.goal);
});

test('初回・リセット・旧未選択では男性を選び，保存済みの女性の選択は保持する',()=>{
  for(const state of [initialJourneyState(),restoreJourneyState(null,pages,6),restoreJourneyState({pawn:null,pawnChosen:false},pages,6),restoreJourneyState({pawn:'female',pawnChosen:false},pages,6)]){
    assert.equal(state.pawn,'male');assert.equal(state.pawnChosen,true);
  }
  const storage=host(),chosen={...saved(),pawn:'female'};writeProgress(chosen,storage);
  const restored=restoreJourneyState(readProgress(storage),pages,6);
  assert.equal(restored.pawn,'female');assert.equal(restored.pawnChosen,true);
  assert.deepEqual(restored.input,chosen.input);assert.deepEqual(restored.goal,chosen.goal);
  assert.deepEqual(restored.completed,[0,1,2,3]);assert.deepEqual(restored.last,chosen.last);
});

test('有効な診断の初期プランは太陽光となり，初期状態だけ条件更新へ追従し，明示選択・旧保存を保持する',()=>{
  const original={...saved(),goal:null};
  const first=applyInitialSolarPlan(original,prefectures);
  assert.deepEqual(first.goal,{equipment:'solar_only',input:{prefectureCode:'08',monthlyElectricityBillYen:null},automatic:true});
  assert.notEqual(first.goal.input,original.input);assert.equal(original.goal,null);
  assert.equal(applyInitialSolarPlan(first,prefectures),first);
  const changed=applyInitialSolarPlan({...first,input:{prefectureCode:'08',monthlyElectricityBillYen:15000}},prefectures);
  assert.equal(changed.goal.input.monthlyElectricityBillYen,15000);
  const restored=normalizeJourneyDiagnosis(restoreJourneyState(changed,pages,6),prefectures,equipment);
  assert.equal(restored.goal.automatic,true);
  const selected={...changed,goal:{input:{...changed.input},equipment:'solar_plus_standard_battery'}};
  const next={...selected,input:{prefectureCode:'08',monthlyElectricityBillYen:20000}};
  assert.equal(applyInitialSolarPlan(next,prefectures),next);
  const legacy=saved();assert.equal(applyInitialSolarPlan(legacy,prefectures),legacy);
  const malformedFlag={...legacy,goal:{...legacy.goal,automatic:'true'}};assert.equal(applyInitialSolarPlan(malformedFlag,prefectures),malformedFlag);
  for(const input of [null,{prefectureCode:'99',monthlyElectricityBillYen:null},{prefectureCode:'08',monthlyElectricityBillYen:-1}]){
    const invalid={...original,input};assert.equal(applyInitialSolarPlan(invalid,prefectures),invalid);
  }
});

test('診断データを使わずに進捗・相談履歴を復元し，入力とプランの原値を保持して保存できる',()=>{
  const storage=host(),original=saved();writeProgress(original,storage);
  const restored=restoreJourneyState(readProgress(storage),pages,steps.length);
  assert.equal(restored.pawn,'male');assert.equal(restored.step,4);assert.deepEqual(restored.last,{4:'compare'});
  assert.deepEqual(restored.consultation,original.consultation);assert(!restored.completed.includes(5));
  assert.deepEqual(restored.input,original.input);assert.deepEqual(restored.goal,original.goal);
  // 読込み失敗後も，診断処理を経ずに新しい相談先を保存・復元できる．
  const opened=openConsultationProvider(restored,'tainavi',steps.length);writeProgress(opened,storage);
  assert.deepEqual(readProgress(storage),opened);assert.deepEqual(opened.input,original.input);assert.deepEqual(opened.goal,original.goal);
});

test('データ取得後だけ診断条件を検証し，無関係な進捗と相談履歴を変えない',()=>{
  const restored=restoreJourneyState(saved(),pages,steps.length),normalized=normalizeJourneyDiagnosis(restored,prefectures,equipment);
  assert.equal(validJourneyInput(restored.input,null),false);assert.equal(validJourneyInput(restored.input,prefectures),true);
  assert.deepEqual(normalized.input,{prefectureCode:'08',monthlyElectricityBillYen:null});
  assert.deepEqual(normalized.goal,{equipment:'solar_only',input:{prefectureCode:'08',monthlyElectricityBillYen:null}});
  assert.equal(normalized.consultation,restored.consultation);assert.equal(normalized.last,restored.last);assert.equal(normalized.completed,restored.completed);
  const malformed={...restored,input:{prefectureCode:'99',monthlyElectricityBillYen:null},goal:{equipment:'unknown',input:restored.input}};
  assert.deepEqual(restoreJourneyState(malformed,pages,6).input,malformed.input);
  const rejected=normalizeJourneyDiagnosis(malformed,prefectures,equipment);assert.equal(rejected.input,null);assert.equal(rejected.goal,null);
});

test('進捗の型検査と旧読了5の非捏造はデータ取得前にも維持する',()=>{
  const restored=restoreJourneyState({step:'4',last:{4:'welcome',3:'preparation',5:[],6:'quote'},pawn:'unknown',pawnChosen:true,completed:[0,0,5,'2',-1],input:{futureField:true}},pages,6);
  assert.equal(restored.step,0);assert.equal(restored.pawn,'male');assert.equal(restored.pawnChosen,true);
  assert.deepEqual(restored.last,{3:'preparation'});assert.deepEqual(restored.completed,[0]);assert.deepEqual(restored.input,{futureField:true});
});
