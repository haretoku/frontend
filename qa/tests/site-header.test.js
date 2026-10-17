import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile,readdir} from 'node:fs/promises';
import {renderSiteHeader,headerSection} from '../../site/shared/site-header-template.js';
import {renderSiteFooter} from '../../site/shared/site-footer-template.js';
import {initializeHeaderMenu,initializeReferenceHeader} from '../../site/shared/site-header.js';
import {storageKey,readProgress,writeProgress} from '../../site/map/progress-storage.js';

function fixture(){
  const handlers=new Map(),nodes=new Map();
  const element=()=>({hidden:true,attributes:{},events:new Map(),focus(){this.focused=true;},setAttribute(k,v){this.attributes[k]=v;},addEventListener(k,fn){this.events.set(k,fn);},showModal(){this.open=true;},close(){this.open=false;this.events.get('close')?.();}});
  const doc={querySelector(s){if(!nodes.has(s))nodes.set(s,element());return nodes.get(s);},addEventListener(k,fn){handlers.set(k,fn);}};
  const memory=()=>{const data=new Map();return {getItem:k=>data.get(k)??null,setItem:(k,v)=>data.set(k,v),removeItem:k=>data.delete(k)};};
  return {doc,handlers,nodes,host:{localStorage:memory(),sessionStorage:memory()}};
}

test('共通メニューは開閉・Escape・外側クリック・フォーカス移動を同じ経路で扱う',()=>{
  const f=fixture();initializeHeaderMenu(f.doc);
  const button=f.nodes.get('#menu-button'),menu=f.nodes.get('#menu');
  button.events.get('click')();assert.equal(menu.hidden,false);assert.equal(button.attributes['aria-expanded'],'true');
  f.handlers.get('keydown')({key:'Escape'});assert.equal(menu.hidden,true);assert.equal(button.focused,true);
  button.events.get('click')();f.handlers.get('click')({target:{closest:()=>null}});assert.equal(menu.hidden,true);
  button.events.get('click')();f.handlers.get('focusin')({target:{closest:()=>null}});assert.equal(menu.hidden,true);
});

test('参照ページからのリセットは取消しで保存を保ち，明示確定時だけ消してMAPへ戻る',()=>{
  const f=fixture(),saved={input:{prefectureCode:'13'},goal:{equipment:'solar_only'},completed:[1]},destinations=[];
  writeProgress(saved,f.host);
  initializeReferenceHeader({doc:f.doc,host:f.host,navigate:url=>destinations.push(url)});
  f.nodes.get('#reset').events.get('click')();assert.equal(f.nodes.get('#reset-dialog').open,true);
  assert.deepEqual(readProgress(f.host),saved);
  f.nodes.get('#cancel-reset').events.get('click')();assert.deepEqual(readProgress(f.host),saved);assert.deepEqual(destinations,[]);
  f.nodes.get('#reset').events.get('click')();f.nodes.get('#confirm-reset').events.get('click')();
  assert.equal(readProgress(f.host),null);assert.deepEqual(destinations,['/']);
  assert.equal(f.host.localStorage.getItem(storageKey),null);assert.equal(f.nodes.get('#menu-button').focused,true);
});

test('全表示ページが共通ヘッダーと確認画面を1個ずつ持ち，旧ナビを残さない',async()=>{
  const root=new URL('../../site/',import.meta.url),files=(await readdir(root,{recursive:true})).filter(path=>path.endsWith('.html')&&!path.replaceAll('\\','/').startsWith('prototypes/'));
  let count=0;
  for(const file of files){
    const path=file.replaceAll('\\','/'),html=await readFile(new URL(path,root),'utf8');
    assert(html.includes(renderSiteHeader(headerSection(path))),path);
    assert(html.includes(renderSiteFooter()),path);
    assert.equal((html.match(/class="map-footer site-footer-shell"/g)??[]).length,1,path);
    assert(html.includes('href="/shared/site-footer.css"'),path);
    assert.equal((html.match(/id="menu-button"/g)??[]).length,1,path);
    assert.equal((html.match(/id="reset-dialog"/g)??[]).length,1,path);
    assert(!html.includes('class="site-header"'),path);
    assert.equal((html.match(/src="\/shared\/site-header-entry.js"/g)??[]).length,html.includes('src="/map/journey.js"')?0:1,path);
    count++;
  }
  assert.equal(count,33);
  assert.equal(headerSection('guides/electricity-support-end/index.html'),'press');
  const press=await readFile(new URL('press/index.html',root),'utf8');
  assert(press.includes('data-guide-groups="press"'));
  assert(!press.includes('guide-diagnosis-route'));
});
