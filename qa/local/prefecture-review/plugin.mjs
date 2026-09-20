import {readFile, readdir} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {isLoopbackHost} from '../municipal-review/plugin.mjs';
import {toDisplayData,canonicalHash,decisionDisplayData} from './projection.mjs';

export const basePath = '/__local/prefecture-review/';
const projectionFile = new URL('../../../../backend/dist/review/prefecture-review-projection.json', import.meta.url);
const decisionFile = new URL('../../../../backend/dist/review/prefecture-user-decision-projection.json', import.meta.url);
const auditDirectory = new URL('../../../../backend/data/candidates/prefectural-subsidies/', import.meta.url);
const publicFile = new URL('../../../data/input/public-data.json', import.meta.url);
const reportFile = new URL('../../../../backend/data/docs/収集レポート/都道府県補助金/2026-08-29-初回収集.md', import.meta.url);
const sha256 = value => createHash('sha256').update(value).digest('hex');

export async function loadReviewBundle() {
  const [projectionText, publicText, names, report, decisionText] = await Promise.all([
    readFile(projectionFile, 'utf8'), readFile(publicFile, 'utf8'), readdir(auditDirectory), readFile(reportFile, 'utf8'), readFile(decisionFile,'utf8')
  ]);
  const projection = JSON.parse(projectionText);
  if (!Array.isArray(projection.prefectures) || projection.prefectures.length !== 47) throw new Error('47県の投影正本が揃っていません．');
  const subject=Object.fromEntries(['schema_version','scope','source_snapshot','summary','prefectures'].map(key=>[key,projection[key]]));
  if(canonicalHash(subject)!==projection.projection_sha256)throw new Error('投影正本の内容ハッシュが一致しません．');
  const resources = {'source.json':{text:projectionText,type:'application/json'}, 'sources/report.md':{text:report,type:'text/plain'}};
  const audits = new Map();
  for (const row of projection.prefectures) {
    if (!/^\d{2}$/.test(row.prefecture_code)) throw new Error('県コードが不正です．');
    if (!row.source_audit?.path) continue;
    const expectedPrefix = 'data/candidates/prefectural-subsidies/';
    const relative = row.source_audit.path.replaceAll('\\','/');
    if (!relative.startsWith(expectedPrefix)) throw new Error('監査参照が許可範囲外です．');
    const name = relative.slice(expectedPrefix.length);
    if (!new RegExp(`^${row.prefecture_code}-[a-z-]+-2026-collection-audit\\.json$`).test(name) || !names.includes(name)) throw new Error('県別監査の参照が一致しません．');
    const bytes = await readFile(new URL(name, auditDirectory));
    if (sha256(bytes) !== row.source_audit.file_sha256) throw new Error(`${row.prefecture_name}の監査が投影生成後に更新されています．`);
    const audit = JSON.parse(bytes.toString('utf8'));
    if (audit.prefecture_code !== row.prefecture_code) throw new Error('監査の県コードが一致しません．');
    audits.set(row.prefecture_code, audit);
    resources[`sources/prefecture-${row.prefecture_code}.json`] = {text:bytes.toString('utf8'),type:'application/json'};
  }
  const data = toDisplayData(projection, audits, JSON.parse(publicText));
  const decision=JSON.parse(decisionText);
  Object.assign(data,decisionDisplayData(decision,projection,data.records,sha256(projectionText)));
  data.versionLabel=`未判断表生成日時：${decision.generated_at} ／ 全国監査投影生成日時：${projection.generated_at} ／ 現在の診断データ版：${JSON.parse(publicText).data_version}．この表は診断を更新しません．診断への反映と独立検収の状況は，各県の原本で確認できます（本番未公開）．`;
  resources['sources/decisions.json']={text:decisionText,type:'application/json'};
  if(await readFile(decisionFile,'utf8')!==decisionText)throw Error('読込中に未判断投影が更新されました．');
  if (await readFile(projectionFile,'utf8') !== projectionText) throw new Error('読込中に投影正本が更新されました．');
  return {data, resources, projectionHash:sha256(projectionText), publicHash:sha256(publicText), decisionHash:sha256(decisionText)};
}

export function localPrefectureReview() {
  return {name:'local-prefecture-review',apply:'serve',configureServer(server) {
    server.watcher.add([projectionFile,decisionFile,auditDirectory,publicFile,reportFile].map(fileURLToPath));
    server.middlewares.use(async(req,res,next)=>{
      const pathname=(req.url??'').split('?')[0];
      if (!pathname.startsWith(basePath) && pathname!==basePath.slice(0,-1)) return next();
      res.setHeader('Cache-Control','no-store');res.setHeader('X-Content-Type-Options','nosniff');
      if (!isLoopbackHost(req.headers.host)) {res.statusCode=403;return res.end('Localhost only');}
      if (!['GET','HEAD'].includes(req.method)) {res.statusCode=405;return res.end('Read only');}
      if (pathname===basePath.slice(0,-1)) {res.statusCode=302;res.setHeader('Location',basePath);return res.end();}
      const route=pathname.slice(basePath.length);
      if (!['','index.html','view.js','model.js','styles.css','data.json','source.json','sources/report.md','sources/decisions.json'].includes(route) && !/^sources\/prefecture-\d{2}\.json$/.test(route)) {res.statusCode=404;return res.end('Not found');}
      try {
        let body,type;
        if (['','index.html','view.js','model.js','styles.css'].includes(route)) {
          const name=route||'index.html';body=await readFile(new URL(name,import.meta.url));
          type=name.endsWith('.html')?'text/html':name.endsWith('.css')?'text/css':'text/javascript';
        } else {
          const bundle=await loadReviewBundle();
          if (route==='data.json') {body=JSON.stringify(bundle.data);type='application/json';}
          else {const resource=bundle.resources[route];if(!resource){res.statusCode=404;return res.end('Not found');}body=resource.text;type=resource.type;}
        }
        res.setHeader('Content-Type',`${type}; charset=utf-8`);
        res.setHeader('Content-Security-Policy',"default-src 'self'; script-src 'self'; style-src 'self'; connect-src 'self'; object-src 'none'; frame-ancestors 'none'; base-uri 'none'");
        res.end(req.method==='HEAD'?undefined:body);
      } catch(error) {server.config.logger.error(`Local prefecture review: ${error.message}`);res.statusCode=500;res.end('検収正本を読み込めません．投影と監査の版を確認してください．');}
    });
  }};
}
