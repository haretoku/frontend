import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { runInNewContext } from 'node:vm';
import { rememberWalkthroughTarget, takeWalkthroughTarget } from '../../site/shared/walkthrough/navigation.js';

const source = (await readFile(new URL('../../site/shared/walkthrough/target.js', import.meta.url), 'utf8'))
  .replace(/^import .*;\r?\n/gm, '');
const panelSource = await readFile(new URL('../../site/shared/walkthrough/panel.js', import.meta.url), 'utf8');
const rememberBody = panelSource.match(/const remember = event => \{([\s\S]*?)\r?\n      \};/)[1];

function fixture() {
  const saved = new Map(), frames = [], timers = new Map(), observers = [];
  const host = new EventTarget();
  host.location = { pathname: '/', hash: '' };
  host.sessionStorage = { getItem:key=>saved.get(key)??null, setItem:(key,value)=>saved.set(key,value), removeItem:key=>saved.delete(key) };
  const classes = new Set(), properties = new Map();
  let scrolls = 0, visible = true, nextTimer = 0;
  const button = {
    classList:{add:value=>classes.add(value),remove:value=>classes.delete(value)},
    style:{setProperty:(key,value)=>properties.set(key,value),removeProperty:key=>properties.delete(key)},
    querySelector:()=>null,
    getClientRects:()=>visible?[{}]:[],
    scrollIntoView:()=>scrolls++
  };
  const doc = new EventTarget();
  doc.body = {};
  doc.querySelectorAll = selector => {
    assert.equal(selector, '#map-consultation .consult-provider-action');
    return [button];
  };
  const context = {
    window:host,document:doc,
    takeWalkthroughTarget:()=>takeWalkthroughTarget(host),
    MutationObserver:class {
      constructor(callback){this.callback=callback;this.active=false;observers.push(this);}
      observe(){this.active=true;}
      disconnect(){this.active=false;}
    },
    getComputedStyle:()=>({borderTopColor:'rgb(0, 134, 83)'}),
    requestAnimationFrame:callback=>frames.push(callback),
    setTimeout:callback=>{const id=++nextTimer;timers.set(id,callback);return id;},
    clearTimeout:id=>timers.delete(id)
  };
  return {
    host,classes,properties,timers,observers,
    get scrolls(){return scrolls;},
    run(){runInNewContext(source,context);},
    flush(){while(frames.length)frames.shift()();},
    show(){visible=true;for(const observer of observers)if(observer.active)observer.callback();},
    hide(){visible=false;},
    move(){rememberWalkthroughTarget('quote',host);host.location.hash='#map-consultation';}
  };
}

test('別文書からの案内と同一文書hash遷移をともに受け取り，通常のhash移動では強調しない',()=>{
  const initial=fixture();initial.move();initial.run();initial.flush();
  assert(initial.classes.has('walkthrough-target'));
  assert.equal(initial.scrolls,1);
  const sameDocument=fixture();sameDocument.run();sameDocument.flush();
  assert.equal(sameDocument.classes.size,0);
  sameDocument.move();sameDocument.host.dispatchEvent(new Event('hashchange'));sameDocument.flush();
  assert(sameDocument.classes.has('walkthrough-target'));
  assert.equal(sameDocument.scrolls,1);
  sameDocument.host.dispatchEvent(new Event('hashchange'));sameDocument.flush();
  assert.equal(sameDocument.classes.size,0);
  assert.equal(sameDocument.properties.size,0);
  assert.equal(sameDocument.timers.size,0);
});

test('同じhashへの再選択も再び強調し，前回の監視と終了処理を重複させない',()=>{
  const f=fixture();f.run();f.move();
  f.host.dispatchEvent(new Event('hashchange'));f.flush();
  assert.equal(f.scrolls,1);
  f.move();f.host.dispatchEvent(new Event('walkthrough-target-change'));f.flush();
  assert.equal(f.scrolls,2);
  assert.equal(f.observers.filter(observer=>observer.active).length,1);
  assert.equal(f.timers.size,1);
  assert.equal(f.properties.get('--walkthrough-glow-color'),'rgb(0, 134, 83)');
  [...f.timers.values()][0]();
  assert.equal(f.classes.size,0);
  assert.equal(f.observers.filter(observer=>observer.active).length,0);
});

test('遷移直後に非表示の相談先が後から描画されても強調する',()=>{
  const f=fixture();f.hide();f.move();f.run();f.flush();
  assert.equal(f.classes.size,0);
  f.show();
  assert(f.classes.has('walkthrough-target'));
  assert.equal(f.scrolls,1);
  f.host.dispatchEvent(new Event('pagehide'));
  assert.equal(f.classes.size,0);
  assert.equal(f.timers.size,0);
});

test('同URLの読む項目は既定の再読込を止めて強調し，異hashや別タブ操作は通常遷移を保つ',()=>{
  for(const [id,currentHash,destination,ctrlKey,expectedPrevented,expectedSelector] of [
    ['read-intro','','https://haretoku.jp/',false,true,'#map [data-step="0"]'],
    ['quote','#map-consultation','https://haretoku.jp/#map-consultation',false,true,'#map-consultation .consult-provider-action'],
    ['quote','','https://haretoku.jp/#map-consultation',false,false,null],
    ['read-intro','','https://haretoku.jp/',true,false,null]
  ]) {
    const f=fixture();f.host.location.hash=currentHash;
    let prevented=false, received=null, hidden=0;
    f.host.addEventListener('walkthrough-target-change',()=>{received=takeWalkthroughTarget(f.host);});
    const context={URL,Event,window:f.host,location:f.host.location,
      link:{href:destination},mission:{id},panel:{hidePopover:()=>hidden++},
      rememberWalkthroughTarget:key=>rememberWalkthroughTarget(key,f.host),
      event:{type:'click',button:0,ctrlKey,preventDefault:()=>prevented=true}};
    runInNewContext(`(event => {${rememberBody}})(event)`,context);
    assert.equal(prevented,expectedPrevented,id);
    assert.equal(received,expectedSelector,id);
    assert.equal(hidden,1);
    if(!prevented){
      f.host.location.hash=new URL(destination).hash;
      assert.notEqual(takeWalkthroughTarget(f.host),null,'通常遷移先で目印が残る');
    }
  }
});
