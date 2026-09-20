import {readFile,writeFile} from 'node:fs/promises';
import {pathToFileURL} from 'node:url';
import {Script} from 'node:vm';
import {loadReviewBundle} from './plugin.mjs';

export async function buildStandalone() {
  const bundle=await loadReviewBundle();
  const [template,css,sharedCss,model,view]=await Promise.all([
    readFile(new URL('./index.html',import.meta.url),'utf8'),readFile(new URL('./styles.css',import.meta.url),'utf8'),
    readFile(new URL('../municipal-review/styles.css',import.meta.url),'utf8'),readFile(new URL('./model.js',import.meta.url),'utf8'),readFile(new URL('./view.js',import.meta.url),'utf8')
  ]);
  const resources=Object.fromEntries(Object.entries(bundle.resources).map(([key,value])=>[key,`data:${value.type};charset=utf-8;base64,${Buffer.from(value.text).toString('base64')}`]));
  const json=value=>JSON.stringify(value).replace(/</g,'\\u003c').replace(/\u2028/g,'\\u2028').replace(/\u2029/g,'\\u2029');
  const fetchBlock=/  const response = await fetch\('data\.json', \{cache: 'no-store'\}\);\r?\n  if \(!response\.ok\) throw new Error\('正本を取得できません．'\);\r?\n  const data = await response\.json\(\);/;
  if(!fetchBlock.test(view))throw Error('表示データの読込構造が変更されています．');
  let script=`const snapshot=${json(bundle.data)};\nconst snapshotResources=${json(resources)};\n`+model.replace(/^export /gm,'')+'\n'+view.replace(/^import .*?;\r?\n/,'').replace(fetchBlock,'  const data = snapshot;').replace('node.href = safe;','node.href = snapshotResources[safe] ?? safe;');
  new Script(script);
  const stamp=new Intl.DateTimeFormat('ja-JP',{dateStyle:'short',timeStyle:'medium',timeZone:'Asia/Tokyo'}).format(new Date());
  let html=template.replace('<link rel="stylesheet" href="styles.css"><script type="module" src="view.js"></script>',`<style>${sharedCss}\n${css.replace(/@import[^;]+;/,'')}</style>`)
    .replace('</h1>',`</h1><p>保存版：${stamp}（日本時間）．検索・絞込・開閉と収集正本の写しはオフラインで利用できます．公式サイトの閲覧には通信が必要です．</p>`)
    .replace(/<a href="\.\.\/municipal-review\/">[^<]+<\/a>/g,'<span>市区町村の未判断表への移動はローカル版で利用できます．</span>')
    .replace('href="sources/decisions.json"',`href="${resources['sources/decisions.json']}"`)
    .replace('href="source.json"',`href="${resources['source.json']}"`)
    .replace('47県の確認状況の正本を読む','47県の確認状況の書出し時点の写しを読む')
    .replace('</body>',`<script>${script.replace(/<\/script/gi,'<\\/script')}</script></body>`);
  if(/<script\b[^>]*src=|<link\b[^>]*href=|@import|await fetch\(|href="(?:\.\.\/|source\.json|sources\/)/.test(html))throw Error('保存版に外部資産又はローカル参照が残っています．');
  return {html,projectionHash:bundle.projectionHash,publicHash:bundle.publicHash,decisionHash:bundle.decisionHash};
}

if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
  if(!process.argv[2])throw Error('出力先HTMLを指定してください．');
  const {html,...hashes}=await buildStandalone();await writeFile(process.argv[2],html,'utf8');
  process.stdout.write(JSON.stringify({output:process.argv[2],bytes:Buffer.byteLength(html),...hashes})+'\n');
}
