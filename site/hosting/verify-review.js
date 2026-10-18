import assert from 'node:assert/strict';
import {readFile,readdir,lstat,stat} from 'node:fs/promises';
import {resolve,dirname,relative,extname,sep} from 'node:path';
import {analyticsConfig} from '../shared/analytics-config.js';
import {renderSiteHeader} from '../shared/site-header-template.js';
import {renderSiteFooter} from '../shared/site-footer-template.js';

export const reviewOutput=resolve(import.meta.dirname,'../../dist-review');
export async function verifyReview(output=reviewOutput){
  const source=await readFile(new URL('../guides/self-consumption/index.html',import.meta.url),'utf8');
  const normalize=text=>text.replace(/\s+/g,' ').trim();
  assert(normalize(source).includes(normalize(renderSiteHeader('guides'))),'試作も共通ヘッダー・メニュー・リセット確認画面の正本へそろえる');
  assert(normalize(source).includes(normalize(renderSiteFooter())),'試作も共通フッターの正本へそろえる');
  for(const css of ['main.css','site-header.css','site-footer.css'])assert(source.includes(css),`共通スタイル：${css}`);
  const files=[];
  async function walk(dir){
    for(const entry of await readdir(dir,{withFileTypes:true})){
      const file=resolve(dir,entry.name);assert(!(await lstat(file)).isSymbolicLink(),'配信へsymlinkを含めない');
      if(entry.isDirectory())await walk(file);else files.push(file);
    }
  }
  await walk(output);
  const names=files.map(file=>relative(output,file).split(sep).join('/'));
  const allowed=/^(?:assets\/[^/]+\.(?:js|css|json|png|jpg|jpeg|webp|svg|pdf|csv|woff2?)|(?:pages|simulator)\/[^/]+\.html|(?:guides|data|press)\/(?:[^/]+\/)?index\.html|prototypes\/guide-self-consumption\/index\.html|index\.html|404\.html|robots\.txt|preview-info\.json|favicon\.png|og-home-photo-20260926\.jpg|og-step-map-20261017(?:-v034)?\.png|og-image\.png|og-support-shock-burden\.png|og-self-consumption-v040\.png)$/;
  assert(names.every(name=>allowed.test(name)),`未承認ファイル：${names.filter(name=>!allowed.test(name))}`);
  assert(!names.some(name=>/(?:\.map$|fixture|audit|(?:^|\/)qa\/|\.env|credential|CNAME|sitemap\.xml)/i.test(name)),'内部資料・本番公開設定を同梱しない');
  assert(names.includes('prototypes/guide-self-consumption/index.html'),'試作記事を含める');
  assert.equal(await readFile(resolve(output,'robots.txt'),'utf8'),'User-agent: *\nDisallow: /\n');
  let htmlCount=0;
  for(const file of files){
    if(!/\.(?:html|js|css|json|txt)$/.test(file))continue;
    const text=await readFile(file,'utf8');
    assert(!/https?:\/\/(?:px|www\d+)\.a8\.net\/|a8mat=/i.test(text),`A8リンク・計測が残存：${relative(output,file)}`);
    assert(!text.includes(analyticsConfig.measurementId),`本番GAのIDが残存：${relative(output,file)}`);
    assert(!text.includes('https://haretoku.jp'),`本番originが残存：${relative(output,file)}`);
    if(extname(file)!=='.html')continue;
    htmlCount++;
    assert(text.includes('name="robots" content="noindex,nofollow,noarchive"'),'全HTMLを検索除外');
    assert(text.includes('class="review-notice"'),'全HTMLに確認用表示');
    assert(text.includes("connect-src 'self'"),'CSPで外部への送信を制限');
    assert(!/rel=["']canonical["']/i.test(text),'確認用ではcanonicalを出さない');
    assert(!/<script[^>]+src=["']https?:/i.test(text),'外部スクリプトを実行しない');
    for(const [,value] of text.matchAll(/(?:href|src)="([^"]+)"/g)){
      if(/^(?:[a-z]+:|#|\/\/)/i.test(value))continue;
      const pathname=decodeURIComponent(value.split(/[?#]/)[0]);if(!pathname)continue;
      let target=pathname.startsWith('/')?resolve(output,'.'+pathname):resolve(dirname(file),pathname);
      assert(target===output||target.startsWith(output+sep),`配信範囲外を参照しない：${value}`);
      if((await stat(target)).isDirectory())target=resolve(target,'index.html');await stat(target);
    }
  }
  for(const route of ['index.html','simulator/index.html','guides/index.html','pages/calculation-method.html'])assert(names.includes(route),route);
  const info=JSON.parse(await readFile(resolve(output,'preview-info.json'),'utf8'));
  assert.equal(info.analytics,false);assert.equal(info.affiliateTracking,false);
  console.log(`確認用検証PASS：${names.length}ファイル・${htmlCount}HTML，試作あり，本番origin／GA-ID／A8なし，検索除外・ローカル参照・配信allowlist`);
  return {files:names,info};
}
if(process.argv[1]&&resolve(process.argv[1])===resolve(import.meta.filename))await verifyReview();
