import {defineConfig} from 'vite';
import {resolve} from 'node:path';
import {readFileSync} from 'node:fs';
import pagesConfig from './vite.pages.config.js';
import {quoteMaterial,tainaviMaterial} from '../site/shared/quote-config.js';

const root=resolve(import.meta.dirname,'..');
const sourceRoot=resolve(root,'site').replaceAll('\\','/')+'/';
const {origin}=JSON.parse(readFileSync(resolve(root,'site/hosting/preview-site.json'),'utf8'));
if(!/^https:\/\/[a-z0-9.-]+\.chatgpt\.site$/.test(origin))throw Error('確認用Sitesのoriginを指定してください．');
const previewRoute='prototypes/guide-self-consumption/index.html';
const stamp=new Date().toISOString();
const csp="default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data:; connect-src 'self'; object-src 'none'; base-uri 'self'; form-action 'self'";
function previewHtml(html,context){
  let result=html.replaceAll('https://haretoku.jp',origin)
    .replace(/<meta\b[^>]*name=["']robots["'][^>]*>/gi,'')
    .replace(/<link\b[^>]*rel=["']canonical["'][^>]*>/gi,'')
    .replace(/<img\b[^>]*src=["']https:\/\/[^"']*\.a8\.net\/[^"']*["'][^>]*>/gi,'')
    .replaceAll(quoteMaterial.url,'https://www.solar-partners.jp/')
    .replaceAll(tainaviMaterial.url,'https://www.tainavi.com/')
    .replace('<title>','<title>【確認用】');
  result=result.replace(/<head>/i,`<head>\n<meta name="robots" content="noindex,nofollow,noarchive">\n<meta http-equiv="Content-Security-Policy" content="${csp}">`);
  return result.replace(/(<body\b[^>]*>)/i,`$1\n<aside class="review-notice" aria-label="開発確認用サイト"><strong>開発確認用</strong> 本番とは別のサイトです．アクセス解析・広告計測は無効です． <a href="/guides/">歩き方の試作を見る →</a></aside><style>.review-notice{position:relative;z-index:10;background:#fff3d3;color:#123f31;padding:12px 20px;font:14px/1.8 sans-serif;border-bottom:1px solid #d9ba6b}.review-notice strong{margin-right:10px}.review-notice a{color:#007447;text-decoration:underline;text-underline-offset:.2em}</style><!-- review-build:${stamp} -->`);
}

export default defineConfig({
  ...pagesConfig,
  define:{...pagesConfig.define,'import.meta.env.VITE_HARETOKU_PAGES_BUILD':false},
  resolve:{alias:[
    {find:/^(?:.*\/)?analytics-config\.js$/,replacement:resolve(root,'site/hosting/preview-analytics.js')},
    {find:/^(?:.*\/)?quote-config\.js$/,replacement:resolve(root,'site/hosting/preview-quote.js')}
  ]},
  plugins:[{
    name:'haretoku-review-only',
    transform(code,id){
      if(id.replaceAll('\\','/').startsWith(sourceRoot)&&/\.js(?:\?|$)/.test(id)&&code.includes('https://haretoku.jp'))return {code:code.replaceAll('https://haretoku.jp',origin),map:null};
    },
    transformIndexHtml:{order:'pre',handler:previewHtml}
  }],
  build:{...pagesConfig.build,outDir:resolve(root,'dist-review'),rollupOptions:{...pagesConfig.build.rollupOptions,input:{...pagesConfig.build.rollupOptions.input,'review-self-consumption':resolve(root,'site',previewRoute)}}}
});
