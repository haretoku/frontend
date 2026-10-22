import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import test from 'node:test';
const slugs=['self-consumption','solar-electricity-savings','solar-fit','solar-economics','solar-installation-cost','subsidies','subsidy-amount','solar-maintenance-cost','disaster','quotes-contractors'];
test('ガイド10記事はリード3発言・目次・3章・章末まとめ・次の1行動を持つ',async()=>{
  for(const slug of slugs){
    const html=await readFile(new URL('../../site/guides/'+slug+'/index.html',import.meta.url),'utf8');
    const article=html.match(/<article\b[^>]*>([\s\S]*?)<\/article>/)[1];
    const introduction=article.slice(0,article.indexOf('<section class="chapter"'));
    assert.equal((introduction.match(/class="lead-turn /g)||[]).length,3,slug);
    assert.equal((article.match(/class="chapter"/g)||[]).length,3,slug);
    assert.equal((article.match(/class="harena-summary"/g)||[]).length,3,slug);
    assert(article.includes('class="chapter-index"'),slug);
    const body=article.slice(article.indexOf('<section class="chapter"'),article.indexOf('<section class="starter-response') < 0 ? undefined : article.indexOf('<section class="starter-response'));
    assert(!body.includes('class="lead-turn '),slug+': 会話は導入だけ');
    assert(body.includes('<figure '),slug+': 主題を説明する図');
    const next=article.match(/<nav class="next-reading"[\s\S]*?<\/nav>/)?.[0];
    // 電気代記事は本人承認により章内のリンクへ集約し，末尾枠を省く．
    if(slug==='self-consumption')assert(article.includes('class="starter-response starter-response--with-questions"'),slug);
    else if(slug!=='solar-electricity-savings'){assert(next,slug);assert.equal((next.match(/<a\b/g)||[]).length,1,slug);}
    assert(article.includes('class="source-notes"'),slug);
    // 電気代記事は本人承認の導入でまとめ役紹介を省く．章末まとめ3件は上で検査する．

    assert(!/fixed-quote-bar|data-inline-quote-action|data-quote-promotion/.test(html),slug);
    const ids=[...html.matchAll(/\sid="([^"]+)"/g)].map(x=>x[1]);
    assert.equal(ids.length,new Set(ids).size,slug);
    for(const [,id] of html.matchAll(/href="#([^"]+)"/g))assert(ids.includes(id),slug+': '+id);
    const chapters=[...article.matchAll(/<section class="chapter"[\s\S]*?(?=<section class="chapter"|<nav class="next-reading"|<details class="source-notes"|$)/g)];
    assert.equal(chapters.length,3,slug+': 末尾枠の有無によらず全3章を検査');
    for(const chapter of chapters){
      if(slug!=='self-consumption')assert(/<h2[^>]*>[^<]+<\/h2>\s*<p[^>]*><strong>/.test(chapter[0]),slug+': 章の問いへの答え');
      assert(chapter[0].includes('class="harena-summary"'),slug);
    }
  }
});
