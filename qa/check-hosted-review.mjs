// owner-private Sitesの読み取り検収．認証情報はstdinのメモリー内だけで保持する．
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
const {origin}=JSON.parse(await readFile(new URL('../site/hosting/preview-site.json',import.meta.url),'utf8'));
let input='';
if(process.stdin.isTTY)process.stdin.setRawMode(true);
process.stdin.setEncoding('utf8');
console.log('Ready for private review credential on stdin (input is hidden).');
process.stdin.on('data',async chunk=>{
  if(chunk.includes('\u0003'))process.exit(130);
  input+=chunk;if(!/[\r\n]/.test(input))return;
  process.stdin.pause();
  try{
    const {token}=JSON.parse(input);input='';assert(typeof token==='string'&&token.length>10);
    async function read(path,auth=true){
      const url=new URL(path,origin);assert.equal(url.origin,origin);
      return fetch(url,{redirect:'manual',signal:AbortSignal.timeout(20000),headers:auth?{'OAI-Sites-Authorization':'Bearer '+token}:{}});
    }
    console.log('確認用originのHTTP検査を開始');
    const unauth=await read('/guides/self-consumption/',false);
    const denied=await unauth.text();assert([301,302,303,307,308,401,403].includes(unauth.status)||/signin-with-chatgpt|sign in|ログイン/i.test(denied),'未認証は本文を読めない');assert(!denied.includes('lead-dialogue'));
    console.log('未認証：本人ログイン画面，試作本文なし');
    for(const path of ['/','/guides/self-consumption/','/simulator/','/guides/quote-services/','/robots.txt','/preview-info.json','/not-a-preview-page']){
      const r=await read(path),body=await r.text();
      if(path==='/not-a-preview-page')assert.equal(r.status,404,'未知のページは404');
      else assert.equal(r.status,200,path);
      if(path.endsWith('/')){
        assert(body.includes('review-notice'));assert(body.includes('noindex,nofollow,noarchive'));assert(!body.includes('アクセスするにはログイン'));
      }
      if(path==='/robots.txt')assert(body.includes('Disallow: /'));
      if(path==='/guides/self-consumption/'){
        const expected=await readFile(new URL('../dist-review/guides/self-consumption/index.html',import.meta.url),'utf8');
        let actualText=body.replace(/\r\n/g,'\n');const expectedText=expected.replace(/\r\n/g,'\n');
        // CDNがフッターの後へ付加する既知のJS検知だけを分離し，記事・資産参照は全文照合する．
        let platformScripts=0;const footerEnd=actualText.lastIndexOf('</footer>');
        actualText=actualText.replace(/<script>[\s\S]*?<\/script>/g,(script,offset)=>{
          if(offset>footerEnd&&script.startsWith('<script>(function(){function c(){')&&script.includes('window.__CF$cv$params')&&script.includes('/cdn-cgi/challenge-platform/')){platformScripts++;return '';}
          return script;
        });
        assert(platformScripts<=1,'未知の追加スクリプトを無視しない');
        assert(actualText===expectedText,'配信した試作本文は今回の確認用ビルドと一致');
        console.log(JSON.stringify({articleContentMatchesBuild:true,cloudflareJavascriptDetection:platformScripts}));
        for(const [,asset] of body.matchAll(/(?:src|href)="(\/assets\/[^"#]+)"/g)){const response=await read(asset);assert.equal(response.status,200,asset);}
      }
      console.log(JSON.stringify({path,status:r.status,length:body.length}));
    }
    console.log('Hosted review HTTP PASS');process.exitCode=0;
  }catch(error){console.error(error.message);process.exitCode=1;}
  finally{if(process.stdin.isTTY)process.stdin.setRawMode(false);process.stdin.destroy();}
});
