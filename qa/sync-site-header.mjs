import {readFile,writeFile,readdir} from 'node:fs/promises';
import {resolve,relative} from 'node:path';
import {renderSiteHeader,headerSection} from '../site/shared/site-header-template.js';
import {renderSiteFooter} from '../site/shared/site-footer-template.js';

const root=resolve(import.meta.dirname,'../site'),check=process.argv.includes('--check');
const files=(await readdir(root,{recursive:true})).filter(path=>path.endsWith('.html')&&!path.replaceAll('\\','/').startsWith('prototypes/'));
let count=0;
for(const path of files){
  const file=resolve(root,path),route=relative(root,file).replaceAll('\\','/');
  const original=await readFile(file,'utf8');
  if(!/<header class="(?:site-header|map-header)">/.test(original))continue;
  let html=original.replace(/<header class="(?:site-header|map-header)">[\s\S]*?<\/header>(?:\s*<dialog id="reset-dialog"[\s\S]*?<\/dialog>)?/,renderSiteHeader(headerSection(route)));
  const footer=/<footer class="(?:site-footer|map-width map-footer|map-footer site-footer-shell)">[\s\S]*?<\/footer>/;
  html=footer.test(html)?html.replace(footer,renderSiteFooter()):html.replace('</body>',`${renderSiteFooter()}\n</body>`);
  html=html.replace(/\s*<link rel="stylesheet" href="\/shared\/site-footer\.css">/g,'');
  html=html.replace(/\s*<link rel="stylesheet" href="\/shared\/site-header\.css">/g,'').replace(/\s*<script type="module" src="\/shared\/site-header-entry\.js"><\/script>/g,'');
  html=html.replace(/\s*<\/head>/,`\n  <link rel="stylesheet" href="/shared/site-header.css">\n  <link rel="stylesheet" href="/shared/site-footer.css">\n${/src="\/map\/journey\.js"/.test(original)?'':'  <script type="module" src="/shared/site-header-entry.js"></script>\n'}</head>`);
  if(check&&html!==original)throw Error(`ヘッダー・フッターが正本と不一致：${route}`);
  if(!check&&html!==original)await writeFile(file,html);
  count++;
}
console.log(`共通ヘッダー・フッター${check?'確認':'同期'}：${count}ページ`);
