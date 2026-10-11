import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import {runInNewContext} from 'node:vm';
import test from 'node:test';
const site = new URL('../../site/', import.meta.url);
const read = path => readFile(new URL(path, site),'utf8');
const basicPath = 'guides/solar-economics/index.html';
const retiredPath = 'guides/solar-profit-conditions/index.html';
const retiredUrl = '/guides/solar-profit-conditions/';

test('廃止した条件別記事は一覧・現行記事・sitemapから外れ，詳細5記事を保持する',async()=>{
  const catalog=JSON.parse(await read('solar/data/articles.json'));
  assert.equal(catalog.length,9);
  assert.equal(catalog.filter(x=>x.articleType==='core').length,4);
  assert.equal(catalog.filter(x=>x.articleType==='detail').length,5);
  assert(!catalog.some(x=>x.href===retiredUrl));
  for(const entry of await readdir(new URL('guides/',site),{withFileTypes:true})){
    if(!entry.isDirectory()||entry.name==='solar-profit-conditions')continue;
    const html=await read(`guides/${entry.name}/index.html`);
    assert(!html.includes(`href="${retiredUrl}`),entry.name);
  }
  const sitemap=await read('hosting/finalize-pages.js');
  assert(!sitemap.includes('"solar-profit-conditions"'));
  const basic=await read(basicPath);
  for(const slug of ['solar-electricity-savings','solar-fit','solar-installation-cost','solar-maintenance-cost','subsidy-amount'])assert(basic.includes(`href="/guides/${slug}/`),slug);
});

test('旧条件別URLは本文を持たず，noindexとJSなしの基礎記事導線を持つ',async()=>{
  const retired=await read(retiredPath);
  assert(retired.includes('rel="canonical" href="https://haretoku.jp/guides/solar-economics/"'));
  assert(retired.includes('content="noindex,follow"'));
  assert(retired.includes('<noscript>'));
  assert(retired.includes('data-redirect-target href="/guides/solar-economics/"'));
  assert(!/<article\b|<h2\b|household-comparison|battery-economics-comparison/.test(retired));
});

const script=await read('articles/src/economics-detail-redirect.js');
function follow(pathname,hash,search='?from=guide'){
  let destination;
  const context={URL,location:{origin:'https://haretoku.jp',pathname,search,hash,replace:url=>{destination=url;}},window:{addEventListener(){}}};
  runInNewContext(script,context);
  return destination;
}

test('旧URLと旧節は検索条件を保って現行節へ接続し，往復転送しない',async()=>{
  const basic=await read(basicPath);
  const destinations=JSON.parse(script.match(/const destinations = ([\s\S]*?);/)[1]);
  for(const [old,target]of Object.entries(destinations)){
    assert(basic.includes(`id="${target}"`),target);
    for(const path of [retiredUrl,retiredUrl+'index.html','/guides/solar-economics/']){
      assert.equal(follow(path,'#'+old),`https://haretoku.jp/guides/solar-economics/?from=guide#${target}`);
    }
    assert.equal(follow('/guides/solar-economics/','#'+target),undefined);
  }
  assert.equal(follow(retiredUrl,'#battery-profit'),'https://haretoku.jp/guides/solar-economics/?from=guide#installation-cost');
  assert.equal(follow(retiredUrl,'#evaluation-period'),'https://haretoku.jp/guides/solar-economics/?from=guide#lifecycle-cost');
  for(const hash of ['','#loss-caution','#decision-path','#unknown','#constructor']){
    assert.equal(follow(retiredUrl,hash),`https://haretoku.jp/guides/solar-economics/?from=guide${hash}`);
  }
  for(const hash of ['','#economics-introduction','#loss-caution','#decision-path','#unknown','#constructor'])assert.equal(follow('/guides/solar-economics/',hash),undefined);
});
