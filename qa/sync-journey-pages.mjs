import {readFile,writeFile,mkdir,readdir} from 'node:fs/promises';
import {resolve,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {pages,steps} from '../site/map/content.js';
import {journeyRoutes,journeyLinks,journeyHref} from '../site/map/routes.js';
import {renderReadingBody,renderReadingEnding,renderReadingQuestions} from '../site/map/reading-view.js';
import {chapterNavigation} from '../site/map/chapter-progress.js';
import {renderSiteHeader,headerSection} from '../site/shared/site-header-template.js';

const root=resolve(import.meta.dirname,'../site'),check=process.argv.includes('--check');
const template=journeyLinks(await readFile(resolve(root,'index.html'),'utf8'));
const safe=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function publicAssets(html){
  return html.replace(/file:\/\/\/[^"<>\s]+/g,url=>{
    const asset=new URL(url),path=fileURLToPath(asset).replaceAll('\\','/'),base=root.replaceAll('\\','/');
    if(!path.startsWith(base+'/'))throw Error('公開ルート外の資産です．');
    return '/'+path.slice(base.length+1)+asset.search+asset.hash;
  });
}
for(const page of pages){
  const route=journeyRoutes[page.id];
  if(!route)throw Error(`URL未定義：${page.id}`);
  const target=resolve(root,'.'+route,'index.html'),relative=route.slice(1)+'index.html';
  const title=`${page.title}｜はれトク`,description=page.summary.join('');
  const siblings=pages.filter(item=>item.step===page.step),navigation=chapterNavigation(pages,page.id),index=pages.indexOf(page);
  let html=template.replace(/\s*<script type="application\/ld\+json" data-site-name>[\s\S]*?<\/script>/,'').replace('<body>',`<body data-journey-page="${page.id}">`)
    .replace(/<title>[\s\S]*?<\/title>/,`<title>${safe(title)}</title>`)
    .replace(/(<meta (?:name="description"|property="og:description") content=")[^"]*(")/g,`$1${safe(description)}$2`)
    .replace(/(<meta property="og:title" content=")[^"]*(")/,`$1${safe(title)}$2`)
    .replace('<meta property="og:type" content="website">',`<meta property="og:type" content="${page.diagnosis?'website':'article'}">`)
    .replaceAll('https://haretoku.jp/"',`https://haretoku.jp${route}"`)
    .replace(/<header class="map-header">[\s\S]*?<\/header>\s*<dialog id="reset-dialog"[\s\S]*?<\/dialog>/,renderSiteHeader(headerSection(relative)))
    .replace(/(<section id="map"[^>]*)(>)/,'$1 hidden$2')
    .replace(/<section id="reading" class="reading" aria-labelledby="page-title" hidden>/,`<section id="reading" class="reading${page.providerComparison?' reading-provider-comparison':''}" aria-labelledby="page-title">`)
    .replace('<span id="page-chapter"></span>',`<span id="page-chapter">${page.step===0?'':`${page.step}．`}${safe(steps[page.step])}</span>`)
    .replace('<span id="page-position"></span>',`<span id="page-position">${siblings.indexOf(page)+1}／${siblings.length}</span>`)
    .replace('<h1 id="page-title" tabindex="-1"></h1>',`<h1 id="page-title" tabindex="-1">${safe(page.title)}</h1>`)
    .replace('<div id="page-body"></div>',`<div id="page-body">${renderReadingBody(page,{pawn:'male'})}</div>`)
    .replace('<div id="page-ending"></div>',`<div id="page-ending">${renderReadingEnding(page)}</div>`)
    .replace('<div id="page-questions"></div>',`<div id="page-questions">${renderReadingQuestions(page)}</div>`)
    .replace('<a id="next" class="primary">わかった！ 次へ →</a>',`<a id="next" class="primary" href="${journeyHref(navigation.href)}"${page.nextRoutes?' hidden':''}>${navigation.label}</a>`)
    .replace('<nav id="next-routes" class="next-routes" aria-label="次に読むページを選ぶ" hidden></nav>',`<nav id="next-routes" class="next-routes" aria-label="次に読むページを選ぶ"${page.nextRoutes?'':' hidden'}>${(page.nextRoutes??[]).map(item=>`<a class="primary" href="${journeyHref(item.href)}"><span>${safe(item.text)}</span><strong>${safe(item.label)}</strong></a>`).join('')}</nav>`)
    .replace('<nav class="previous-page" aria-label="前のページ">',`<nav class="previous-page" aria-label="前のページ"${index?'':' hidden'}>`)
    .replace('<a id="previous" class="text-link">',`<a id="previous" class="text-link" href="${index?journeyRoutes[pages[index-1].id]:'/'}">`);
  if(page.diagnosis)html=html.replace('<div id="estimate-slot" hidden>','<div id="estimate-slot">');
  html=publicAssets(journeyLinks(html));
  if(check){if(await readFile(target,'utf8')!==html)throw Error(`記事HTMLを同期してください：${route}`);}
  else {await mkdir(dirname(target),{recursive:true});await writeFile(target,html);}
}
console.log(`MAP記事・診断HTML${check?'確認':'同期'}：${pages.length}ページ`);
// 旧ページの文章を変えず，既知のMAPリンクだけを正規URLへそろえる．
for(const path of (await readdir(root,{recursive:true})).filter(path=>path.endsWith('.html')&&!path.replaceAll('\\','/').startsWith('prototypes/'))){
  const file=resolve(root,path),original=await readFile(file,'utf8'),html=journeyLinks(original);
  if(html===original)continue;
  if(check)throw Error(`旧ハッシュリンクが残っています：${path}`);
  await writeFile(file,html);
}
