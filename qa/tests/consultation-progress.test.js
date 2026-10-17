import test from 'node:test';
import assert from 'node:assert/strict';
import {consultationProgress,restoreConsultation,openConsultationProvider} from '../../site/map/consultation-progress.js';
import {consultationProviders,renderConsultationProviders} from '../../site/map/consultation-view.js';
import {providers,comparisonRows,comparisonSources} from '../../site/map/provider-comparison.js';
import {renderProviderComparison} from '../../site/map/provider-comparison-view.js';
import {pages} from '../../site/map/content.js';
import {readProgress,writeProgress,clearProgress} from '../../site/map/progress-storage.js';
import {quoteMaterial} from '../../site/shared/quote-config.js';

const initial=()=>({completed:[0,1,2,3,4],step:5,input:{prefectureCode:'08',monthlyElectricityBillYen:12000},goal:{equipment:'solar_only',input:{prefectureCode:'08',monthlyElectricityBillYen:12000}},last:{5:'quote'}});
function storageHost(){const local=new Map(),session=new Map();return {localStorage:{getItem:key=>local.get(key),setItem:(key,value)=>local.set(key,value),removeItem:key=>local.delete(key)},sessionStorage:{getItem:key=>session.get(key),setItem:(key,value)=>session.set(key,value),removeItem:key=>session.delete(key)}};}

test('旧5章の閲覧・読了を外部クリックとせず，新しい独立章も作らない',()=>{
  const legacy={...initial(),completed:[0,1,2,3,4,5]};
  const restored=restoreConsultation(legacy,6);
  assert.deepEqual(restored.completed,[0,1,2,3,4]);
  assert.deepEqual(restored.consultation,{viewed:false,openedProviderIds:[]});
  const viewed={...restored,consultation:{...restored.consultation,viewed:true}};
  assert.equal(viewed.consultation.viewed,true);assert.deepEqual(viewed.consultation.openedProviderIds,[]);
  assert.equal(viewed.input,legacy.input);assert.equal(viewed.goal,legacy.goal);
  assert.equal(pages.some(page=>page.id==='quote'||page.step===5),false);
  assert.deepEqual(viewed.completed,restored.completed);
});

test('3社の外部リンクを開いた状態だけを保存し，再選択・再読込でも入力とプランを保つ',()=>{
  const original=initial(),host=storageHost();
  const opened=openConsultationProvider(original,'tainavi',5);
  assert.deepEqual(opened.completed,[0,1,2,3,4]);
  assert.deepEqual(opened.consultation,{viewed:true,openedProviderIds:['tainavi']});
  writeProgress(opened,host);const restored=restoreConsultation(readProgress(host),6);
  assert.deepEqual(restored,opened);
  const another=openConsultationProvider(restored,'griene',6);
  assert.deepEqual(another.consultation.openedProviderIds,['tainavi','griene']);
  const duplicate=openConsultationProvider(another,'tainavi',6);
  assert.deepEqual(duplicate.consultation.openedProviderIds,['tainavi','griene']);
  const reselected={...duplicate,goal:{...duplicate.goal,equipment:'solar_plus_standard_battery'}};
  assert.equal(reselected.consultation,duplicate.consultation);assert.deepEqual(reselected.input,original.input);
  assert.equal(openConsultationProvider(restoreConsultation(original,6),'unknown',6).completed.includes(5),false);
  clearProgress(host);assert.equal(readProgress(host),null);
  assert.deepEqual(restoreConsultation(initial(),6).consultation,{viewed:false,openedProviderIds:[]});
});

test('不正な保存値を除き，閲覧と相談先識別を型検査する',()=>{
  assert.deepEqual(consultationProgress({viewed:'true',openedProviderIds:'tainavi'}),{viewed:false,openedProviderIds:[]});
  assert.deepEqual(consultationProgress({viewed:1,openedProviderIds:['tainavi','tainavi','eco-hatsu',null,5]}),{viewed:true,openedProviderIds:['tainavi']});
  assert.deepEqual(consultationProgress(null),{viewed:false,openedProviderIds:[]});
});

test('第4章は具体的な9支援の出典と未確認を保ち，GOALと同じ3社だけを比較する',()=>{
  const ids=['solar-partners','tainavi','griene'];
  assert.deepEqual(providers.map(p=>p.id),ids);assert.deepEqual(consultationProviders.map(p=>p.id),ids);
  assert.equal(comparisonRows.length,9);
  const sourceIds=new Set(comparisonSources.map(source=>source.id));
  for(const row of comparisonRows){assert.deepEqual(row.cells.map(c=>c.providerId),ids);for(const cell of row.cells)for(const id of cell.sourceIds)assert(sourceIds.has(id));}
  assert(comparisonRows.some(row=>row.cells.some(cell=>cell.parts.some(part=>part.status==='unknown'))));
  assert(!comparisonSources.some(source=>source.id.startsWith('eco-')));
  for(const row of comparisonRows)for(const cell of row.cells)assert.equal(cell.parts.length,1);
  assert.equal(comparisonRows.find(row=>row.id==='disputes').cells.find(cell=>cell.providerId==='tainavi').parts[0].status,'no');
  assert.equal(comparisonRows.find(row=>row.id==='declining').cells.find(cell=>cell.providerId==='griene').parts[0].status,'unknown');
  {
    const html=renderProviderComparison();
    const table=html.match(/<table[\s\S]*?<\/table>/)[0];
    assert(!table.includes('根拠'));assert(!table.includes('provider-source'));
    assert.equal((table.match(/class="provider-feature"/g)??[]).length,27);
    assert(!html.includes('<summary>保証の条件</summary>'));assert(html.includes('<summary>参考資料・確認日</summary>'));
    assert(html.includes('https://www.solar-partners.jp/guarantee-clause/'));
    assert(!html.includes('local-preview'));
    assert(html.includes('広告：ソーラーパートナーズ・タイナビと提携しています．'));
    assert(html.indexOf('provider-comparison-ad')>html.indexOf('</table>'));
    assert.equal((table.match(/class="provider-brand"/g)??[]).length,3);
    assert.equal((table.match(/class="consult-provider-logo"/g)??[]).length,2);
    assert.equal((table.match(/<th scope="col"/g)??[]).length,4);
  }
});

test('広告素材038は対で維持し，通常リンクと区別し，入力を含む送信先を作らない',()=>{
  for(const compact of [false,true]){
    const html=renderConsultationProviders({compact});
    const destinations=[...html.matchAll(/<a[^>]*href="([^"]+)"[^>]*data-consult-provider="([^"]+)"/g)];
    assert.equal(destinations.length,3);
    for(const [tag,href,id] of destinations){
      assert.equal(href,consultationProviders.find(p=>p.id===id).url);
      assert.match(tag,/noreferrer/);assert.match(tag,/referrerpolicy="no-referrer"/);
      const url=new URL(href);assert.deepEqual([...url.searchParams.keys()],id==='solar-partners'?['a8mat']:[]);
      assert.equal(url.hash,'');
    }
    assert(html.includes(`src="${quoteMaterial.impressionUrl}" width="1" height="1"`));
    assert.match(html,/広告・アフィリエイト/);assert.match(html,/通常リンク ／ 広告リンクではありません/);
    assert.match(html,/無料見積もり ↗/);
    assert.equal([...html.matchAll(/class="consult-provider-logo"/g)].length,2);
    for(const [anchor] of html.matchAll(/<a\b[^>]*>[\s\S]*?<\/a>/g))assert(!anchor.includes('consult-provider-logo'));
    assert(!html.includes('local-preview'));
    assert(html.includes('提携：タイナビ ／ 公式サイトへのリンク'));
    for(const [,src] of html.matchAll(/class="consult-provider-logo" src="([^"]+)"/g))assert.match(src,/\/shared\/assets\/(solar-partners\.png|tainavi\.webp)$/);
  }
});

test('MAPと第4章に同じ比較表を置いても，見出し・セルの参照先が衝突しない',()=>{
  const chapter=renderProviderComparison();
  const mapTable=renderProviderComparison({idPrefix:'map-'});
  const map=renderConsultationProviders({compact:true,comparison:mapTable});
  const combined=chapter+map;
  const ids=[...combined.matchAll(/\bid="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(new Set(ids).size,ids.length);
  for(const [,references] of combined.matchAll(/(?:headers|aria-labelledby)="([^"]+)"/g)){
    for(const reference of references.split(' '))assert(ids.includes(reference),reference);
  }
  assert.equal(mapTable.replaceAll('map-provider-','provider-'),chapter);
  assert.match(map,/<details class="consult-provider-comparison"><summary>3社の違いを比べる<\/summary>/);
  assert(map.indexOf(mapTable)<map.indexOf('<div class="consult-provider-cards">'));
  assert(!map.includes('第4章の比較'));assert(!map.includes('自動送信'));
});
