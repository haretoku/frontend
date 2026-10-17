import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {pages} from '../../site/map/content.js';
import {journeyRoutes,journeyPageId,journeyHref} from '../../site/map/routes.js';
import {chapterNavigation} from '../../site/map/chapter-progress.js';
import {diagnosisUrl} from '../../site/data/src/model.js';
import {renderReadingBody,renderReadingEnding,renderReadingQuestions} from '../../site/map/reading-view.js';
import {fileURLToPath} from 'node:url';
import {relative} from 'node:path';

test('全記事と診断は固有の正規URLを持ち，旧ハッシュ・index別名・試作も解決できる',()=>{
  assert.equal(new Set(Object.values(journeyRoutes)).size,16);
  assert.equal(journeyRoutes.estimate,'/simulator/');
  for(const page of pages){
    const path=journeyRoutes[page.id];
    assert.equal(journeyPageId(new URL('https://haretoku.jp'+path)),page.id);
    assert.equal(journeyPageId(new URL('https://haretoku.jp'+path.slice(0,-1))),page.id);
    assert.equal(journeyPageId(new URL('https://haretoku.jp'+path+'index.html')),page.id);
    for(const prefix of ['/#','/prototypes/step-map/#'])assert.equal(journeyPageId(new URL('https://haretoku.jp'+prefix+page.id)),page.id);
    assert.equal(journeyHref('#'+page.id),path);
  }
  assert.equal(journeyPageId(new URL('https://haretoku.jp/#quote')),'map');
  assert.equal(journeyHref('#map-consultation'),'#map-consultation');
  assert.equal(journeyHref('/pages/policy.html#data'),'/pages/policy.html#data');
  assert.equal(journeyPageId(new URL('https://haretoku.jp/guides/not-a-page/')),null);
});

test('JavaScript実行前でも各URLから本文・要点・全質問・前後のリンクを読める',async()=>{
  for(const page of pages){
    const path=journeyRoutes[page.id],html=await readFile(new URL('../../site'+path+'index.html',import.meta.url),'utf8');
    assert(html.includes(`rel="canonical" href="https://haretoku.jp${path}"`),path);
    assert(html.includes(`property="og:url" content="https://haretoku.jp${path}"`),path);
    assert(html.includes(`<h1 id="page-title" tabindex="-1">${page.title}</h1>`),path);
    assert(!html.includes('noindex'),path);
    assert.match(html,/<section id="map"[^>]* hidden>/);
    assert.doesNotMatch(html,/<section id="reading"[^>]* hidden>/);
    assert(html.includes('ハレナのまとめ'),path);
    for(const summary of page.summary)assert(html.includes(summary),`${path}: 要点`);
    for(const question of page.questions??[])assert(html.includes(question.question),`${path}: 質問`);
    const navigation=chapterNavigation(pages,page.id);
    assert(html.includes(`id="next" class="primary" href="${journeyHref(navigation.href)}"`),`${path}: 章末・次へ`);
    assert(!html.includes('file:///'),path);
    assert(!html.includes('/shared/site-header-entry.js'),`${path}: リセット処理を二重登録しない`);
    for(const [id] of html.matchAll(/id="([^"]+)"/g))assert.equal(html.split(id).length-1,1,`${path}: ID重複 ${id}`);
  }
});

test('データから診断へ都道府県を引き継ぎ，絞込み条件は送らない',()=>{
  const url=new URL(diagnosisUrl({},'13'),'https://haretoku.jp');
  assert.equal(url.pathname,'/simulator/');
  assert.equal(url.searchParams.get('prefecture'),'13');
  assert.deepEqual([...url.searchParams.keys()].sort(),['from','prefecture']);
  assert.equal(url.hash,'');
});

test('静的本文・まとめ・回答はブラウザ共通描画と同じで，資産URLだけを公開用へ変換する',async()=>{
  const root=fileURLToPath(new URL('../../site/',import.meta.url));
  const publicHtml=html=>html.replace(/file:\/\/\/[^"<>\s]+/g,value=>{
    const url=new URL(value);
    return '/'+relative(root,fileURLToPath(url)).replaceAll('\\','/')+url.search+url.hash;
  });
  for(const page of pages){
    const html=await readFile(new URL('../../site'+journeyRoutes[page.id]+'index.html',import.meta.url),'utf8');
    for(const [id,render] of [['page-body',()=>renderReadingBody(page,{pawn:'male'})],['page-ending',()=>renderReadingEnding(page)],['page-questions',()=>renderReadingQuestions(page)]]){
      assert(html.includes(`<div id="${id}">${publicHtml(render())}</div>`),`${page.id}: ${id}同値`);
    }
  }
});
