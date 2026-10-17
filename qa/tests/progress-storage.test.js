import test from 'node:test';
import assert from 'node:assert/strict';
import {storageKey,readProgress,writeProgress,clearProgress} from '../../site/map/progress-storage.js';

function fixture(){
  const values={local:new Map(),session:new Map()},deny={localWrite:false,localRemove:false,sessionRemove:false};
  const storage=name=>({getItem:key=>values[name].get(key)??null,setItem:(key,value)=>{if(name==='local'&&deny.localWrite)throw Error('quota');values[name].set(key,value);},removeItem:key=>{if(deny[`${name}Remove`])throw Error('remove blocked');values[name].delete(key);}});
  return {values,deny,host:{localStorage:storage('local'),sessionStorage:storage('session')}};
}

test('local書込み失敗後は，残った旧localより同タブの新しい保存を優先し，再読込でも戻らない',()=>{
  const f=fixture(),old={step:1,input:{prefectureCode:'08'}},next={step:5,consultation:{viewed:true,openedProviderIds:['tainavi']},input:{prefectureCode:'08'}};
  writeProgress(old,f.host);f.deny.localWrite=true;f.deny.localRemove=true;
  writeProgress(next,f.host);
  assert.deepEqual(JSON.parse(f.values.local.get(storageKey)),old);
  assert.deepEqual(readProgress(f.host),next);assert.deepEqual(readProgress(f.host),next);
  const reloadedHost={...f.host};assert.deepEqual(readProgress(reloadedHost),next);
});

test('local書込み復帰後は代替保存を除去し，続く保存と復元をlocalへ戻す',()=>{
  const f=fixture();writeProgress({step:1},f.host);f.deny.localWrite=true;writeProgress({step:2},f.host);
  f.deny.localWrite=false;writeProgress({step:3},f.host);
  assert.equal(f.values.session.has(storageKey),false);assert.deepEqual(readProgress(f.host),{step:3});
  f.deny.localWrite=true;writeProgress({step:4},f.host);f.deny.localWrite=false;f.deny.sessionRemove=true;
  writeProgress({step:5},f.host);assert.deepEqual(readProgress(f.host),{step:5});
});

test('local削除不可でもリセット記録が旧値の復活を防ぎ，新しい保存へ進める',()=>{
  const f=fixture();writeProgress({step:5},f.host);f.deny.localWrite=true;f.deny.localRemove=true;
  clearProgress(f.host);assert.equal(readProgress(f.host),null);assert(f.values.local.has(storageKey));
  const initial={step:0,consultation:{viewed:false,openedProviderIds:[]}};
  writeProgress(initial,f.host);assert.deepEqual(readProgress(f.host),initial);
  f.deny.localWrite=false;f.deny.localRemove=false;writeProgress({step:1},f.host);clearProgress(f.host);
  assert.equal(readProgress(f.host),null);assert.equal(f.values.session.has(storageKey),false);
});

test('旧session保存はlocalがないときだけ移行し，壊れた保存・不正な代替を無視する',()=>{
  const f=fixture();f.values.session.set(storageKey,JSON.stringify({step:2}));
  assert.deepEqual(readProgress(f.host),{step:2});
  f.values.local.set(storageKey,JSON.stringify({step:3}));assert.deepEqual(readProgress(f.host),{step:3});
  f.values.session.set(storageKey,'{broken');assert.deepEqual(readProgress(f.host),{step:3});
  f.values.local.set(storageKey,'[]');assert.equal(readProgress(f.host),null);
  f.values.session.set(storageKey,JSON.stringify({kind:'haretoku-session-fallback-v1',progress:'bad'}));assert.equal(readProgress(f.host),null);
});
