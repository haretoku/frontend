import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {manualPages} from '../../site/manual/routes.js';
import {canonicalPath,analyticsAllowed,cleanReferrer} from '../../site/shared/analytics-core.js';

test('トリセツの7正規ページは共有情報・検索情報・本文・戻り先を持つ',async()=>{
  assert.equal(manualPages.length,7);
  assert.equal(new Set(manualPages.map(page=>page.path)).size,7);
  for(const page of manualPages){
    const html=await readFile(new URL('../../site'+page.path+'index.html',import.meta.url),'utf8');
    for(const property of ['og:type','og:title','og:description','og:url','og:image']){
      assert.equal((html.match(new RegExp('property="'+property+'"','g'))??[]).length,1,page.path+' '+property);
    }
    assert.equal((html.match(/rel="canonical"/g)??[]).length,1,page.path);
    assert.equal((html.match(/name="robots"/g)??[]).length,1,page.path);
    assert(html.includes('href="https://haretoku.jp/favicon.png"'));
    assert(html.includes('src="/shared/analytics.js"'));
    assert.equal(canonicalPath(page.path+'index.html'),page.path);
    const png=await readFile(new URL('../../site/shared/assets/'+page.shareImage.split('/').at(-1),import.meta.url));
    assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
    if(page.article)assert(html.includes('href="/manual/"'),page.path+' 戻り先');
  }
});

test('新しいトリセツURLも本番限定で計測し，任意URL・開発版・条件文字列を送らない',()=>{
  const config={enabled:true,enhancedMeasurementDisabled:true,measurementId:'G-TEST123456'};
  for(const page of manualPages){
    assert(analyticsAllowed(config,'https://haretoku.jp'+page.path+'?private=CANARY',true));
    assert(!analyticsAllowed(config,'https://haretoku.jp'+page.path,false));
    assert(!analyticsAllowed(config,'https://example.com'+page.path,true));
    assert.equal(cleanReferrer('https://haretoku.jp'+page.path+'?private=CANARY#CANARY'),'https://haretoku.jp'+page.path);
  }
  assert.equal(canonicalPath('/manual/not-a-page/'),null);
});


test('トリセツTOPのタブ操作は，共存する歩き方のタブ・パネルを変更しない',async()=>{
  const {runInNewContext}=await import('node:vm');
  const source=(await readFile(new URL('../../site/manual/manual.js',import.meta.url),'utf8')).replace(/^import .*;\r?\n/gm,'');
  const makeTab=(id,view)=>({id,dataset:{view},tabIndex:-1,attrs:{'aria-controls':'panel-'+view,'aria-selected':view==='timeline'?'true':'false'},events:{},setAttribute(k,v){this.attrs[k]=v;},getAttribute(k){return this.attrs[k];},addEventListener(k,fn){this.events[k]=fn;},focus(){this.focused=true;}});
  const tabs=[makeTab('tab-timeline','timeline'),makeTab('tab-troubles','troubles')];
  const panels=[{id:'panel-timeline',hidden:false},{id:'panel-troubles',hidden:true}];
  const foreignTab=makeTab('walkthrough-tab-installed',undefined);foreignTab.attrs['aria-selected']='true';
  const foreignPanel={id:'walkthrough-audience-installed',hidden:false};
  const hashes=[];const doc={querySelectorAll(selector){if(selector==='[data-manual-icon]')return [];if(selector==='.manual-tabs [role="tab"]')return tabs;if(selector==='.manual-panel[role="tabpanel"]')return panels;if(selector==='[role="tab"]')return [...tabs,foreignTab];if(selector==='[role="tabpanel"]')return [...panels,foreignPanel];throw Error('Unexpected selector '+selector);},querySelector(){return {innerHTML:''};}};
  runInNewContext(source,{document:doc,assets:{titleArt:''},location:{href:'https://example.com/manual/',hash:''},history:{replaceState(a,b,url){hashes.push(url.hash);}},window:{addEventListener(){}},URL});
  assert.equal(foreignPanel.hidden,false);assert.equal(foreignTab.attrs['aria-selected'],'true');assert.deepEqual(Object.keys(foreignTab.events),[]);
  tabs[1].events.click();assert.equal(panels[1].hidden,false);assert.equal(panels[0].hidden,true);assert.deepEqual(hashes,['#troubles']);assert.equal(foreignPanel.hidden,false);assert.equal(foreignTab.attrs['aria-selected'],'true');
});
