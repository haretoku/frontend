import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {readDiagnosisQuery,mapRedirectTarget} from '../../site/map/legacy-route.js';

test('旧診断はマップ内診断へ接続し，地域・電気代だけを引き継ぐ',async()=>{
 const url=new URL('https://haretoku.jp/simulator/?prefecture=13&monthlyElectricityBill=0&municipality_code=13101&systemCapacityKw=6&from=data#old');
 assert.equal(mapRedirectTarget(url),'/simulator/?prefecture=13&monthlyElectricityBill=0');
 assert.deepEqual(readDiagnosisQuery(url,['13']),{prefectureCode:'13',monthlyElectricityBillYen:0});
 for(const path of ['prototypes/step-map/index.html']){
  const html=await readFile(new URL('../../site/'+path,import.meta.url),'utf8');
  assert.match(html,/noindex,follow/);assert.match(html,/src="\/map\/redirect.js"/);
  assert(!html.includes('/src/app.js'));assert(!html.includes('id="result"'));
 }
 assert.equal(mapRedirectTarget(new URL('http://localhost:5173/prototypes/step-map/#try')),'/guides/solar-costs/');
});

test('旧URLの不正な入力は保存済みの診断条件を上書きしない',()=>{
 const read=query=>readDiagnosisQuery(new URL('https://haretoku.jp/?'+query),['01','13']);
 for(const query of ['prefecture=99','prefecture=13&monthlyElectricityBill=-1','prefecture=13&monthlyElectricityBill=Infinity','prefecture=13&monthlyElectricityBill=1.5','prefecture=13&monthlyElectricityBill=1000001','monthlyElectricityBill=0'])assert.equal(read(query),null);
 assert.deepEqual(read('prefecture=01'),{prefectureCode:'01',monthlyElectricityBillYen:null});
 assert.deepEqual(read('prefecture=13&monthlyElectricityBill=1000000'),{prefectureCode:'13',monthlyElectricityBillYen:1000000});
});

test('計算定義の補助金は共通ルールと制度別根拠に分かれ，二つの診断を案内しない',async()=>{
 const html=await readFile(new URL('../../site/pages/calculation-method.html',import.meta.url),'utf8');
 assert(!/通常の診断|ステップマップの試作/.test(html));
 const common=html.slice(html.indexOf('id="subsidy-assumptions"'),html.indexOf('data-subsidy-assumptions'));
 for(const text of ['受付開始前','住宅性能','受付終了・停止','市区町村','FIT売電','併用','非現金特典'])assert(common.includes(text),text);
 for(const name of ['埼玉県','神奈川県','栃木県','茨城県','群馬県','千葉県'])assert(!common.includes(name));
 assert(html.includes('data-subsidy-assumptions'));
});
