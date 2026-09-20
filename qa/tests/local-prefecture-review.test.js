import assert from 'node:assert/strict';
import test from 'node:test';
import {stageLabels, validateRows, matches, statusOptions, stageCounts, safeLink, excludedFields, validateDecisions, filterDecisions, decisionCounts, emptyMessage} from '../local/prefecture-review/model.js';
import {loadReviewBundle,localPrefectureReview,basePath} from '../local/prefecture-review/plugin.mjs';
import {toDisplayData,publicFingerprint,decisionDisplayData,canonicalHash} from '../local/prefecture-review/projection.mjs';
import {buildStandalone} from '../local/prefecture-review/export.mjs';

const records = Array.from({length:47}, (_,index)=>({
  code:String(index+1).padStart(2,'0'), name:index===0?'北海道':`検査県${index+1}`,
  stages:Object.fromEntries(Object.keys(stageLabels).map(key=>[key,{state:'unconfirmed',label:'未確認'}]))
}));

test('主表外の意味項目を日本語化し内部管理項目を分離するが，原値を変更しない',()=>{
 const program={scheme_name:'制度',scheme_id:'id',target_year:'2026年度',application_status:'不明',resident_amount:null,main_record_created:false,original_record:{amount:50000}};
 const before=JSON.stringify(program);const result=excludedFields(program);
 assert.deepEqual(result.displayed,[{label:'制度ID',value:'id'},{label:'対象年度',value:'2026年度'},{label:'受付状態',value:'不明'},{label:'住民向け金額',value:null}]);
 assert.deepEqual(result.internal,{main_record_created:false,original_record:{amount:50000}});
 assert.equal(JSON.stringify(program),before);
});

test('47県表は欠損・重複・段階欠落を拒否し，未確認の県も保持する',()=>{
  assert.equal(validateRows(records).length,47);
  assert.throws(()=>validateRows(records.slice(1)),/47/);
  assert.throws(()=>validateRows([...records.slice(1),records[1]]),/不足又は重複/);
  const missing=structuredClone(records);delete missing[0].stages.userReview;
  assert.throws(()=>validateRows(missing),/段階別/);
});

test('AI確認済みとユーザー検収待ちを別に絞り込み，状態集計を47県で維持する',()=>{
  const input=structuredClone(records);
  input[0].stages.review1={state:'ai_pass',label:'AI確認済み'};
  input[0].stages.userReview={state:'user_pending',label:'ユーザー検収待ち'};
  const before=JSON.stringify(input);
  assert.equal(input.filter(row=>matches(row,{stage:'review1',state:'ai_pass'})).length,1);
  assert.equal(input.filter(row=>matches(row,{stage:'userReview',state:'ai_pass'})).length,0);
  assert.equal(input.filter(row=>matches(row,{query:' 北 海 道 ',stage:'userReview',state:'user_pending'})).length,1);
  assert.equal(input.filter(row=>matches(row,{})).length,47);
  assert.deepEqual(stageCounts(input,'review1'),[{label:'AI確認済み',count:1},{label:'未確認',count:46}]);
  assert.ok(statusOptions(input,'userReview').some(([state])=>state==='user_pending'));
  assert.ok(!statusOptions(input,'userReview').some(([state])=>state==='ai_pass'));
  assert.equal(JSON.stringify(input),before);
});

test('根拠リンクは公式HTTP URLと固定のローカル参照だけを許可する',()=>{
  for(const url of ['javascript:alert(1)','file:///secret','data:text/html,test','sources/../../secret.json','//example.jp'])assert.equal(safeLink(url),null);
  assert.equal(safeLink('https://example.jp/report'),'https://example.jp/report');
  assert.equal(safeLink('sources/prefecture-01.json'),'sources/prefecture-01.json');
});

test('投影と監査の同版結合は47県を保持し，富山の公式ポイント・承認済み評価仮定を分離する',async()=>{
  const bundle=await loadReviewBundle();
  const toyama=bundle.data.records.find(row=>row.code==='16');
  assert.equal(bundle.data.records.length,47);
  assert.match(toyama.audit.records[0].calculation_formula,/ポイント/);
  assert.match(toyama.stages.adoption.details.join(' '),/額面100％/);
  assert.equal(toyama.stages.userReview.state,'userReview:approved');
  assert.equal(toyama.stages.issues.notes.length,0);
  const terms=toyama.sources.find(source=>source.label==='利用規約（令和8年8月27日施行）');
  assert.ok(terms);assert.match(terms.retrievalStatus,/未取得・本文未確認.*取得失敗/);
  assert.equal(terms.checkedAt,'2026-09-18');
  assert.ok(toyama.sources.every(source=>!/^t-/.test(source.label)));
  const hokkaido=bundle.data.records.find(row=>row.code==='01');
  assert.equal(hokkaido.audit.records.length,0);assert.ok(hokkaido.excludedPrograms.length>0);
  assert.ok(hokkaido.excludedPrograms.every(program=>program.reason));
});

test('県別内容の不変なら他県更新で同期判定を失わず，AI①対象不一致はPASSにしない',()=>{
  const publicData={prefectures:records.map(row=>({code:row.code,name:row.name,prefecture_program_status:'current_scope_unconfirmed'})),diagnostic_subsidy_programs:[]};
  const projection={prefectures:records.map(row=>({prefecture_code:row.code,prefecture_name:row.name,source_audit:{content_fingerprint:'abc'},collection:{status:'not_started'},adoption:{status:'not_reviewed',user_review:{status:'pending'}},delivery:{status:'legacy_snapshot_only',public_snapshot_fingerprint:publicFingerprint(publicData,row.code)},reviews:{stage_1_collection:{status:'pass',subject_fingerprint:'abc',evidence_refs:['source'],scope:'限定範囲',reviewer:'統括',reviewed_at:'2026-09-18'}}}))};
  publicData.prefectures[1].name='変更県';
  let view=toDisplayData(projection,new Map(),publicData);
  assert.equal(view.records[0].stages.delivery.state,'delivery:legacy_snapshot_only');
  assert.equal(view.records[1].stages.delivery.state,'delivery:snapshot_mismatch');
  assert.equal(view.records[0].stages.review1.state,'review1:pass');
  projection.prefectures[0].reviews.stage_1_collection.subject_fingerprint='old';
  view=toDisplayData(projection,new Map(),publicData);
  assert.equal(view.records[0].stages.review1.state,'review1:unconfirmed');
  assert.equal(view.records[0].stages.userReview.state,'userReview:pending');
});

test('47県保存版は監査内容と原資料を含みlocalhostや外部資産なしで動作する構造を持つ',async()=>{
  const {html}=await buildStandalone();
  assert.doesNotMatch(html,/<script\b[^>]*src=|<link\b[^>]*href=|@import|await fetch\(|href="(?:\.\.\/|source\.json|sources\/)/);
  assert.match(html,/snapshotResources\[safe\]/);
  assert.match(html,/data:application\/json;charset=utf-8;base64,/);
  assert.match(html,/額面100％/);
});

test('47県閲覧経路はloopbackの読取と固定経路に限り，任意ファイルを返さない',async()=>{
  const plugin=localPrefectureReview();assert.equal(plugin.apply,'serve');let middleware;
  plugin.configureServer({watcher:{add:()=>{}},middlewares:{use:fn=>{middleware=fn;}},config:{logger:{error:()=>{}}}});
  const request=async(url,host='127.0.0.1:5173',method='GET')=>{
    const result={statusCode:200,headers:{},setHeader(key,value){this.headers[key]=value;},end(body){this.body=body;}};
    await middleware({url,headers:{host},method},result,()=>{result.passed=true;});return result;
  };
  assert.equal((await request(basePath,'example.com')).statusCode,403);
  assert.equal((await request(basePath,undefined,'POST')).statusCode,405);
  for(const path of ['../../README.md','projection.mjs','export.mjs','sources/../../secret.json','sources/arbitrary.json'])assert.equal((await request(basePath+path)).statusCode,404);
  assert.equal((await request('/simulator/')).passed,true);
  assert.equal((await request(basePath+'index.html')).statusCode,200);
});


test('未判断の県・制度・論点数を分け，判断種類と本文で絞り込む',()=>{
  const base={id:'a',code:'01',name:'北海道',programId:'p1',programName:'対象制度',question:'費目の配賦をどう扱うか',evidence:['公式資料の確認範囲'],recommendation:['追加確認まで該当枝を保留する'],type:'condition',typeLabel:'制度・条件'};
  const issues=[base,{...base,id:'b',question:'対象費用の扱い'},{...base,id:'c',programId:'p2',type:'policy',typeLabel:'新規方針'}];
  assert.equal(validateDecisions(issues,records).length,3);
  assert.deepEqual(decisionCounts(issues),{prefectures:1,programs:2,issues:3});
  assert.equal(filterDecisions(issues,{query:' 北 海 道 '}).length,3);
  assert.equal(filterDecisions(issues,{query:'配賦'}).length,2);
  assert.equal(filterDecisions(issues,{type:'policy'}).length,1);
  assert.equal(filterDecisions(issues,{query:'該当なし'}).length,0);
  assert.equal(filterDecisions(issues).length,3);
  assert.throws(()=>validateDecisions([base,base],records),/識別子/);
  assert.throws(()=>validateDecisions([{...base,evidence:[]}],records),/根拠/);
});

test('未判断0件は絞込解除を求めず，検索結果0件と区別する',()=>{
  assert.match(emptyMessage(0,0),/未判断事項は0件/);
  assert.doesNotMatch(emptyMessage(0,0),/絞込を解除/);
  assert.match(emptyMessage(3,0),/検索条件.*絞込を解除/);
  assert.equal(emptyMessage(3,1),'');
  assert.deepEqual(decisionCounts([]),{prefectures:0,programs:0,issues:0});
});


test('未判断投影は同版原本と集計を照合し，4県6論点の承認記録を保持して未判断0件にする',async()=>{
  const b=await loadReviewBundle(),p=JSON.parse(b.resources['source.json'].text),d=JSON.parse(b.resources['sources/decisions.json'].text);
  assert.deepEqual(decisionCounts(b.data.decisions),{prefectures:0,programs:0,issues:0});
  assert.deepEqual(b.data.decisionSummary,{excludedPrefectures:34,excludedPrograms:100,excludedFactualGaps:51});
  assert.equal(b.data.decisionHistory.length,6);
  assert.ok(b.data.decisionHistory.every(item=>item.status==='approved'&&item.decision_authority==='user'));
  assert.match(b.data.decisionHistory[0].official_fact,/ポイント/);
  assert.match(b.data.decisionHistory[1].approved_model_assumption,/100％/);
  assert.equal(filterDecisions(b.data.decisions,{query:'富山'}).length,0);
  assert.doesNotMatch(b.data.decisions.flatMap(issue=>[...issue.recommendationDetails,...issue.options]).join(' '),/subsidy_yen|valuation_rate_|net_initial_outlay_yen/);
  const rehash=value=>{value.decision_projection_sha256=canonicalHash(Object.fromEntries(['schema_version','scope','source_snapshot','summary','issues','decision_history'].map(key=>[key,value[key]])));return value;};
  const tampered=structuredClone(d);tampered.decision_history[0].approved_model_assumption='改変';
  assert.throws(()=>decisionDisplayData(tampered,p,b.data.records,b.projectionHash),/内容ハッシュ/);
  const bad=structuredClone(d);bad.source_snapshot.prefecture_review_projection_file_sha256='0'.repeat(64);rehash(bad);
  assert.throws(()=>decisionDisplayData(bad,p,b.data.records,b.projectionHash),/版が一致/);
  const count=structuredClone(d);count.summary.displayed_issue_count=34;rehash(count);
  assert.throws(()=>decisionDisplayData(count,p,b.data.records,b.projectionHash),/集計/);
  const zero=structuredClone(d);zero.issues=[];zero.summary.displayed_prefecture_count=0;zero.summary.displayed_program_count=0;zero.summary.displayed_issue_count=0;rehash(zero);
  assert.equal(decisionDisplayData(zero,p,b.data.records,b.projectionHash).decisions.length,0);
});
