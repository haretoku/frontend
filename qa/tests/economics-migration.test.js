import assert from 'node:assert/strict';
import {readFile, readdir} from 'node:fs/promises';
import test from 'node:test';
const site = new URL('../../site/', import.meta.url);
const read = path => readFile(new URL(path, site),'utf8');
const basicPath = 'guides/solar-economics/index.html';
const retiredPath = 'guides/solar-profit-conditions/index.html';
const retiredUrl = '/guides/solar-profit-conditions/';

test('廃止した条件別記事は一覧・現行記事・sitemapから外れ，詳細5記事を保持する',async()=>{
  const catalog=JSON.parse(await read('solar/data/articles.json'));
  assert.equal(catalog.length,10);
  assert.equal(catalog.filter(x=>x.articleType==='core').length,4);
  assert.equal(catalog.filter(x=>x.articleType==='detail').length,5);
  assert.equal(catalog.filter(x=>x.articleType==='news').length,1);
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

test('廃止した旧URL・転送専用処理を再び配信しない', async () => {
  const retired = ['solar/index.html', 'guides/solar-profit-conditions/index.html',
    ...['electricity-sales','costs-maintenance','subsidies','disaster','quotes-contractors'].map(name => `pages/${name}.html`),
    'shared/legacy-redirect.js', 'articles/src/costs-maintenance-redirect.js', 'articles/src/economics-detail-redirect.js'];
  for (const path of retired) await assert.rejects(read(path), {code: 'ENOENT'});
  const basic = await read(basicPath);
  assert(!basic.includes('economics-detail-redirect.js'));
  for (const entry of await readdir(new URL('guides/',site), {withFileTypes:true})) {
    if (!entry.isDirectory() || entry.name === 'solar-profit-conditions') continue;
    const html = await read(`guides/${entry.name}/index.html`);
    for (const path of retired.filter(path => path.endsWith('.html'))) assert(!html.includes(`href="/${path}"`), path);
  }
});
