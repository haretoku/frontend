import assert from 'node:assert/strict';
import {access, readFile} from 'node:fs/promises';
import test from 'node:test';
const slugs=['solar-electricity-savings','solar-fit','solar-installation-cost','solar-maintenance-cost','subsidy-amount'];
const site=new URL('../../site/',import.meta.url);
const plain=text=>text.replace(/<[^>]+>/g,'').trim();
const catalog=JSON.parse(await readFile(new URL('solar/data/articles.json',site),'utf8'));
test('改修した詳細5記事は一覧の題名・既存URL・参照先へ接続する',async()=>{
  for(const slug of slugs){
    const html=await readFile(new URL('guides/'+slug+'/index.html',site),'utf8');
    const item=catalog.find(item=>item.href==='/guides/'+slug+'/');
    assert.equal(item?.articleType,'detail',slug);
    assert.equal(item.title,plain(html.match(/<h1\b[^>]*>([\s\S]*?)<\/h1>/)[1]),slug);
    assert(html.includes('rel="canonical" href="https://haretoku.jp/guides/'+slug+'/"'));
    for(const [,reference] of html.matchAll(/(?:href|src)="(\/[^"?#]*)(?:[?#][^"]*)?"/g)){
      await access(new URL(reference.slice(1)+(reference.endsWith('/')?'index.html':''),site));
    }
    for(const [,route,id] of html.matchAll(/href="(\/[^"#?]+)#([^"?]+)"/g)){
      const target=await readFile(new URL(route.slice(1)+(route.endsWith('/')?'index.html':''),site),'utf8');
      assert(target.includes('id="'+id+'"'),slug+': '+route+'#'+id);
    }
    assert(!/data-inline-quote-action|data-quote-promotion/.test(html));
    assert(!/data-guide-number="[^"]+"[^>]*>0<\//.test(html),slug+': 未生成の数値');
    assert(!/data-guide-format="man-decimal:/.test(html),slug+': 未対応の数値形式');
  }
});
test('月々の計算例への既存リンクを保つ',async()=>{
  const html=await readFile(new URL('guides/solar-electricity-savings/index.html',site),'utf8');
  assert(html.includes('id="monthly-savings"'));
});
