import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {groupedArticles} from '../../site/solar/src/guide-groups.js';
import {canonicalPath} from '../../site/shared/analytics-core.js';

test('新記事は正式URL・共有画像・計測へ接続し，試作表記を残さない',async()=>{
  const html=await readFile(new URL('../../site/guides/self-consumption/index.html',import.meta.url),'utf8');
  assert(html.includes('rel="canonical" href="https://haretoku.jp/guides/self-consumption/"'));
  assert(html.includes('name="robots" content="index,follow"'));
  assert(!/試作|prototype|guide-trial|trial-meta/.test(html));
  assert(html.includes('src="/shared/analytics.js"'));
  assert(html.includes('https://haretoku.jp/assets/og-guide-self-consumption-20261018.png'));
  assert.equal(canonicalPath('/guides/self-consumption/index.html'),'/guides/self-consumption/');
  const png=await readFile(new URL('../../site/shared/assets/og-guide-self-consumption-20261018.png',import.meta.url));
  assert(png.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])));
  assert.equal(png.readUInt32BE(16),1200);assert.equal(png.readUInt32BE(20),630);
});

test('テーマ別一覧は新記事と旧9記事を重複なく掲載し，プレスを分ける',async()=>{
  const articles=JSON.parse(await readFile(new URL('../../site/solar/data/articles.json',import.meta.url),'utf8'));
  const groups=groupedArticles(articles,{topics:true});
  assert.deepEqual(groups.map(g=>g.id),['electricity','cost','equipment','companies']);
  assert.deepEqual(groups.map(g=>g.articles.length),[3,4,2,1]);
  const ids=groups.flatMap(g=>g.articles.map(a=>a.id));
  assert.equal(new Set(ids).size,10);assert.equal(ids[0],'self-consumption');
  assert.equal(groupedArticles(articles,{press:true})[0].articles.length,1);
  const redirect=await readFile(new URL('../../site/prototypes/guide-self-consumption/index.html',import.meta.url),'utf8');
  assert(redirect.includes('url=/guides/self-consumption/'));
});
