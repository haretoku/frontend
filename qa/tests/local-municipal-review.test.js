import assert from 'node:assert/strict';
import test from 'node:test';
import { Script } from 'node:vm';
import { resolutionSummary, pendingResolutionWithoutBranchesCount } from '../local/municipal-review/model.js';
import { buildStandalone } from '../local/municipal-review/export.mjs';
import { loadReviewData, localMunicipalReview, isLoopbackHost, basePath } from '../local/municipal-review/plugin.mjs';
import { summarize, matches, safeOfficialUrl, auditNotice, unjudgedRecords, unjudgedExclusions, explorationSummary, latestSources, recommendation, mixedUnresolvedCount, reviewReasons } from '../local/municipal-review/model.js';

const data = await loadReviewData();

test('承認仮定と資料不足打切りは独立PASS後だけ除外し，元の判定・未判断枝を保持する', () => {
  const record=structuredClone(data.records.find(r=>r.municipality_name==='大子町'));
  const base={...record.reclassification.components[0],reference_role:'current_candidate',calculation_possibility:'可能',amount_impact_review:{unresolved_branches:[{scope:'元の未確認範囲'}]}};
  const decision={status:'approved_assumptions',decision_basis:'user_approved',investigation_closed:true,independent_review:{result:'PASS'}};
  record.reclassification.components=[
    {...base,component_id:'assumptions',review_resolution:decision},
    {...base,component_id:'insufficient',calculation_possibility:'不能',review_resolution:{...decision,status:'insufficient_information_closed'}},
    {...base,component_id:'pending',review_resolution:{...decision,independent_review:{result:'pending'}}},
    {...base,component_id:'not_closed',review_resolution:{...decision,investigation_closed:false}},
    {...base,component_id:'not_approved',review_resolution:{...decision,decision_basis:undefined}}
  ];
  const before=JSON.stringify(record);
  assert.deepEqual(unjudgedRecords([record])[0].reclassification.components.map(c=>c.component_id),['pending','not_closed','not_approved']);
  assert.deepEqual(resolutionSummary([record]),{assumptions:1,insufficient:1,impossible:1});
  assert.deepEqual(unjudgedExclusions([record]),{historical:0,implementationNotConfirmed:0,other:0});
  assert.equal(JSON.stringify(record),before);
});

test('承認判断は未判断枝が履歴へ移っても非PASSを保持し，PASSで表を空にする', () => {
  const record=structuredClone(data.records.find(r=>r.municipality_name==='大子町'));
  const base={...record.reclassification.components[0],reference_role:'current_candidate',calculation_possibility:'可能',amount_impact_review:{unresolved_branches:[]}};
  record.reclassification.components=['approved_assumptions','insufficient_information_closed'].flatMap(status=>['pending','FAIL',undefined].map(result=>({...base,review_resolution:{status,decision_basis:'user_approved',investigation_closed:true,independent_review:{result}}})));
  const before=JSON.stringify(record);
  const rows=unjudgedRecords([record]);
  assert.equal(summarize(rows).components,6);
  assert.equal(mixedUnresolvedCount(rows),0);
  assert.equal(pendingResolutionWithoutBranchesCount(rows),6);
  assert.equal(summarize(rows).components,summarize(rows).impossible+mixedUnresolvedCount(rows)+pendingResolutionWithoutBranchesCount(rows));
  assert.equal(JSON.stringify(record),before);
  for(const component of record.reclassification.components) component.review_resolution.independent_review.result='PASS';
  assert.deepEqual(unjudgedRecords([record]),[]);
  assert.deepEqual(resolutionSummary([record]),{assumptions:3,insufficient:3,impossible:0});
});

test('保存版HTMLはCSS・データ・描画処理・原資料写しを内包し外部読込を要しない',async()=>{
  const {html,sourceHash}=await buildStandalone();
  assert.match(sourceHash,/^[a-f0-9]{64}$/);
  assert.doesNotMatch(html,/<script\b[^>]*src=|<link\b[^>]*href=|await fetch\(/);
  assert.match(html,/data:application\/json;base64,/);
  assert.match(html,/自動更新されません/);
  const scripts=[...html.matchAll(/<script>([\s\S]*?)<\/script>/g)];
  assert.equal(scripts.length,1);
  assert.doesNotThrow(()=>new Script(scripts[0][1]));
});

test('可能な親の未判断枝だけを保持し，親判定・成分ID・元集計を変更しない', () => {
  const record=structuredClone(data.records.find(r=>r.municipality_name==='大子町'));
  const base={...record.reclassification.components[0],review_resolution:undefined,reference_role:'current_candidate',amount_impact_review:undefined};
  const branches=[{branch_id:'low_cost',label:'低費用',unresolved_reasons:['制度ルール不明'],scope:'上限未到達の場合'},
    {branch_id:'combined',label:'併設',unresolved_reasons:['対象設備不明'],scope:'同時設置の対象範囲'}];
  record.reclassification.components=[
    {...base,component_id:'c01',calculation_possibility:'可能',classification:'conditional_amount',unresolved_reasons:['受付状態不明'],amount_impact_review:{unresolved_branches:branches,resolved_branches:[{branch_id:'cap',label:'上限到達',calculation_basis:'判断済の式',conditions:['判断済条件']}]}},
    {...base,component_id:'c02',calculation_possibility:'不能',amount_impact_review:{unresolved_branches:[branches[0]]}},
    {...base,component_id:'c03',calculation_possibility:'可能',amount_impact_review:{unresolved_branches:[]}},
    {...base,component_id:'c04',calculation_possibility:'可能',exclusion_audit:{unresolved_branches:[{label:'旧特認',reason:'対象設備不明'}]}}
  ];
  const before=JSON.stringify(record);
  const rows=unjudgedRecords([record]);
  assert.deepEqual(rows[0].reclassification.components.map(c=>[c.component_id,c.calculation_possibility]),[['c01','可能'],['c02','不能']]);
  assert.deepEqual(reviewReasons(rows[0].reclassification.components[0]),['制度ルール不明','対象設備不明']);
  assert.equal(mixedUnresolvedCount(rows),1);
  const counts=summarize(rows);
  assert.equal(counts.components,2);
  assert.equal(counts.components,counts.impossible+mixedUnresolvedCount(rows));
  assert.equal(rows[0].reclassification.calculation_summary.possible_component_count,1);
  assert.equal(rows[0].reclassification.calculation_summary.impossible_component_count,1);
  assert.equal(JSON.stringify(record),before);
  const conflict=structuredClone(record);
  conflict.reclassification.components[0].reference_role='historical_only';
  assert.throws(()=>unjudgedRecords([conflict]),/未判断枝/);
});

test('実施未確認は終了・独立PASSが揃う成分のみ除外し，未検収・未終了は残す', () => {
  const record=structuredClone(data.records.find(r=>r.municipality_name==='小美玉市'));
  const base={...record.reclassification.components[0],reference_role:'current_candidate',calculation_possibility:'不能'};
  const closed={status:'implementation_not_confirmed',investigation_closed:true,independent_review:{result:'PASS'}};
  record.reclassification.components=[
    {...base,component_id:'closed',review_resolution:closed},
    {...base,component_id:'pending',review_resolution:{...closed,independent_review:{result:'pending'}}},
    {...base,component_id:'ongoing',review_resolution:{...closed,investigation_closed:false}},
    {...base,component_id:'missing_review',review_resolution:{status:closed.status,investigation_closed:true}},
    {...base,component_id:'other_status',review_resolution:{...closed,status:'unknown'}},
    {...base,component_id:'historical',reference_role:'historical_only',review_resolution:closed},
    {...base,component_id:'open',application_status:'受付中',unresolved_reasons:['制度ルール不明'],review_resolution:undefined},
    {...base,component_id:'resolved',calculation_possibility:'可能',review_resolution:undefined}
  ];
  const before=JSON.stringify(record);
  const rows=unjudgedRecords([record]);
  assert.deepEqual(rows[0].reclassification.components.map(c=>c.component_id),['pending','ongoing','missing_review','other_status','open']);
  assert.deepEqual(rows[0].reclassification.components.at(-1).unresolved_reasons,['制度ルール不明']);
  assert.deepEqual(unjudgedExclusions([record]),{historical:1,implementationNotConfirmed:1,other:0});
  assert.equal(summarize(rows).components,5);
  assert.equal(explorationSummary([record]).closed,0);
  assert.equal(JSON.stringify(record),before);
});

test('同一URLの代表根拠は成分・記録順によらず最新確認日を表示し原記録を保存する', () => {
  const url='https://example.jp/program';
  const components=[{evidence:[{official_url:url,title:'制度',source_checked_at:'2026-09-05'},{official_url:'https://example.jp/other',source_checked_at:'2026-09-10'}]},
    {evidence:[{official_url:url,source_checked_at:'2026-09-18'},{official_url:url,source_checked_at:'2026-09-01'},{official_url:url},{file:'audit.json'}]}];
  const before=JSON.stringify(components);
  const sources=latestSources(components);
  assert.equal(sources.length,2);
  assert.equal(sources[0].source_checked_at,'2026-09-18');
  assert.equal(sources[0].title,'制度');
  assert.equal(latestSources([...components].reverse()).find(e=>e.official_url===url).source_checked_at,'2026-09-18');
  assert.equal(JSON.stringify(components),before);
});

test('推奨対応は確認対象と保留方針を自然な語句で伝える', () => {
  assert.equal(recommendation(['受付状態不明','制度ルール不明']),'受付状態・算定条件を追加資料で確認．確認できるまでは今回の算入を保留．');
  assert.equal(recommendation([]),'不足する条件を追加資料で確認．確認できるまでは今回の算入を保留．');
});

test('過年度参考は不能でも除外し，年度の古さだけでは現行候補を除外しない', () => {
  const record=structuredClone(data.records.find(r=>r.municipality_name==='小美玉市'));
  const base={...record.reclassification.components[0],review_resolution:undefined};
  record.reclassification.components=[
    {...base,component_id:'legacy',reference_role:'historical_only'},
    {...base,component_id:'current',reference_role:'current_candidate',fiscal_year:2010},
    {...base,component_id:'unset'},
    {...base,component_id:'other',reference_role:'other'},
    {...base,component_id:'judged',reference_role:'current_candidate',calculation_possibility:'可能'}
  ];
  const before=JSON.stringify(record);
  assert.deepEqual(unjudgedRecords([record])[0].reclassification.components.map(c=>c.component_id),['current','unset']);
  const historicalOnly=structuredClone(record);
  historicalOnly.reclassification.components=[record.reclassification.components[0]];
  assert.deepEqual(unjudgedRecords([historicalOnly]),[]);
  assert.equal(JSON.stringify(record),before);
});

test('探索終了は根拠未特定集合内で終了状態・終了フラグ・独立PASSが揃うものだけ数える', () => {
  const make = review => ({reclassification:{collection_status:'未収集',components:[],exploration_review:review}});
  const closed={status:'searched_not_found',investigation_closed:true,independent_review:{result:'PASS'}};
  const records=[make(closed),make(undefined),make({...closed,investigation_closed:false}),make({...closed,status:'unknown'}),make({...closed,independent_review:{result:'pending'}}),{reclassification:{collection_status:'収集済み',exploration_review:closed}}];
  const before=JSON.stringify(records);
  assert.deepEqual(explorationSummary(records),{unidentified:5,closed:1,remaining:4});
  assert.equal(JSON.stringify(records),before);
  assert.deepEqual(explorationSummary(data.records),{unidentified:21,closed:2,remaining:19});
  assert.equal(unjudgedRecords(data.records).length,0);
  assert.equal(summarize(unjudgedRecords(data.records)).components,0);
});

test('再点検表示は追加取得の有無と独立検収状態を区別する', () => {
  const notice = auditNotice({reviewed_at:'2026-09-18',source_retrieval_performed:true,source_retrieval_scope:'既知制度の限定確認．',semantic_recheck:{status:'in_progress'}});
  assert.match(notice.date,/限定追加確認あり/);
  assert.match(notice.date,/既知制度の限定確認/);
  assert.match(notice.review,/最終検収済みではありません/);
  assert.match(auditNotice({source_retrieval_performed:false}).date,/再取得なし/);
  assert.match(auditNotice({}).date,/未確認/);
  assert.match(auditNotice({semantic_recheck:{status:'awaiting_independent_review'}}).review,/独立検収待ち/);
  const pending={semantic_recheck:{status:'awaiting_independent_review'}};
  const acceptance={status:'complete'};
  const transcription={independent_transcription_review:{result:'PASS'}};
  assert.equal(auditNotice({...pending,acceptance_policy_review:{...acceptance,...transcription}}).review,'今回の18自治体21成分の受付・算式再整理は検収済みです．旧57成分全体の意味上の再点検は別途未完了です．');
  for (const audit of [
    {...pending,acceptance_policy_review:acceptance},
    {...pending,acceptance_policy_review:transcription},
    {...pending,acceptance_policy_review:{...acceptance,independent_transcription_review:{result:'pending'}}},
    {...pending,acceptance_policy_review:{...transcription,status:'in_progress'}},
    {...pending,acceptance_policy_review:acceptance,...transcription}
  ]) assert.match(auditNotice(audit).review,/独立検収待ち/);
  const previousPassed={...pending,acceptance_policy_review:{...acceptance,...transcription}};
  const amount={baseline_municipalities:10,baseline_components:11,status:'awaiting_independent_review'};
  assert.match(auditNotice({...previousPassed,amount_impact_review:amount}).review,/今回の10自治体11成分の金額影響・枝分離は独立検収待ち/);
  assert.match(auditNotice({...previousPassed,amount_impact_review:{...amount,status:'complete'}}).review,/枝分離は独立検収待ち/);
  assert.match(auditNotice({...previousPassed,amount_impact_review:{...amount,status:'complete',independent_review:{result:'PASS'}}}).review,/枝分離は検収済み/);
});

test('混在する可能成分を非算入と条件別算定に分ける', () => {
  const records=[{reclassification:{collection_status:'収集済み',components:[
    {calculation_possibility:'可能',calculation_basis:'根拠付き非算入（この成分のみ）'},
    {calculation_possibility:'可能',calculation_basis:'条件別金額の算定可能'},
    {calculation_possibility:'不能',calculation_basis:'対象設備不明'}
  ],calculation_summary:{conditional_amount_component_count:1,all_current_target_scope_resolved:false},implementation:{diagnostic_program_ids:[]}}}];
  const counts=summarize(records);
  assert.equal(counts.possible,2);
  assert.equal(counts.nonInclusion,1);
  assert.equal(counts.positive,1);
  assert.equal(counts.impossible,1);
  assert.equal(counts.possible,counts.nonInclusion+counts.positive);
  assert.equal(counts.components,counts.possible+counts.impossible);
});

test('旧66自治体の集計は自治体・成分・正額算定を分離する', () => {
  assert.deepEqual(summarize(data.records), { municipalities:66, identified:45, unidentified:21, components:57, possible:41, nonInclusion:32, impossible:16, positive:9, implemented:0 });
  assert.equal(new Set(data.records.map(r=>`${r.prefecture_code}:${r.municipality_name}`)).size,66);
  for (const record of data.records) {
    for (const component of record.reclassification.components) {
      assert.ok(component.evidence.length);
      assert.ok(component.evidence.some(evidence=>safeOfficialUrl(evidence.official_url)));
      for (const evidence of component.evidence) {
        if (evidence.official_url) assert.ok(safeOfficialUrl(evidence.official_url));
        assert.ok(evidence.source_checked_at);
      }
    }
  }
  assert.ok(data.report.length);
});

test('承認仮定3・資料不足打切り8を元記録へ保持し，未判断表を0件にする', () => {
  const before=JSON.stringify(data.records);
  const rows=unjudgedRecords(data.records);
  assert.deepEqual(rows,[]);
  assert.deepEqual(resolutionSummary(data.records),{assumptions:3,insufficient:8,impossible:8});
  assert.deepEqual(unjudgedExclusions(data.records),{historical:4,implementationNotConfirmed:4,other:0});
  const resolved=data.records.flatMap(r=>r.reclassification.components.filter(c=>['approved_assumptions','insufficient_information_closed'].includes(c.review_resolution?.status)).map(c=>r.municipality_name+':'+c.component_id));
  assert.deepEqual(resolved,['大子町:c01','大子町:c02','桶川市:c02','嵐山町:c01','九十九里町:c01','多古町:c02','大多喜町:c01','白子町:c01','神崎町:c02','鋸南町:c01','長南町:c01']);
  const historical=data.records.flatMap(r=>r.reclassification.components.filter(c=>c.reference_role==='historical_only').map(c=>r.municipality_name+':'+c.component_id));
  assert.deepEqual(historical,['大泉町:c01','行田市:c01','行田市:c02','清瀬市:c01']);
  assert.equal(summarize(data.records).impossible,4+4+resolutionSummary(data.records).impossible);
  assert.equal(JSON.stringify(data.records),before);
});

test('都県・状態・名称の絞込は自治体単位で複数成分を保持する', () => {
  const filtered=options=>data.records.filter(record=>matches(record,options));
  assert.equal(filtered({status:'identified'}).length,45);
  assert.equal(filtered({status:'unidentified'}).length,21);
  assert.equal(filtered({status:'non-inclusion'}).length,29);
  assert.equal(filtered({prefecture:'13'}).length,26);
  assert.equal(filtered({query:'　福生　'}).length,1);
  assert.equal(filtered({prefecture:'08',query:'福生'}).length,0);
  assert.equal(filtered({query:'存在しない自治体'}).length,0);
});

test('過年度・別制度・記録不整合と日付を正本どおり保持する', () => {
  const review=name=>data.records.find(record=>record.municipality_name===name).reclassification;
  const kasumigaura=review('かすみがうら市');
  assert.deepEqual(kasumigaura.components.map(c=>c.fiscal_year),[2024,2026]);
  assert.deepEqual(kasumigaura.components.map(c=>c.calculation_possibility),['可能','可能']);
  assert.notEqual(kasumigaura.reviewed_at,kasumigaura.components[0].evidence[0].source_checked_at);
  assert.match(review('世田谷区').components[0].rationale,/蓄電池・別制度は未確認/);
  assert.match(review('福生市').components[0].rationale,/不一致/);
  assert.equal(review('皆野町').components[0].fiscal_year,null);
  for (const name of ['神流町','福生市']) assert.ok(review(name).components[0].exclusion_audit.unresolved_branches.length);
  const ota=review('大田区').components[0];
  assert.equal(ota.classification,'conditional_amount');
  assert.ok(ota.conditional_amount.formula);
  assert.ok(ota.conditional_amount.conditions.length);
  assert.ok(ota.conditional_amount.implementation_gaps.length);
  assert.equal(ota.diagnostic_program_ids.length,0);
  assert.equal(review('河内町').components.length,0);
  const kozaki=data.records.find(record=>record.municipality_name==='神崎町');
  const pvBattery=kozaki.reclassification.components.filter(component=>component.target_equipment.some(type=>['solar','battery'].includes(type)));
  assert.equal(pvBattery.length,2);
  assert.ok(pvBattery.every(component=>component.evidence.every(e=>e.official_url!==kozaki.original_url)));
  assert.ok(kozaki.reclassification.components.find(component=>component.target_equipment.includes('appliances')).evidence.some(e=>e.official_url===kozaki.original_url));
});

async function request(path, host='127.0.0.1:5173', method='GET') {
  let middleware;
  const plugin=localMunicipalReview();
  const watched=[];
  plugin.configureServer({watcher:{add:paths=>watched.push(...paths)},middlewares:{use:fn=>{middleware=fn;}},config:{logger:{error:()=>{}}}});
  const headers={};let body;let passed=false;
  const res={statusCode:200,setHeader:(key,value)=>{headers[key]=value;},end:value=>{body=value;}};
  await middleware({url:path,headers:{host},method},res,()=>{passed=true;});
  return {status:res.statusCode,headers,body,passed,watched};
}

test('ローカル閲覧はdev専用・対象経路限定・読み取り専用とする',async()=>{
  assert.equal(localMunicipalReview().apply,'serve');
  assert.ok(isLoopbackHost('localhost:5173'));
  assert.ok(isLoopbackHost('[::1]:5173'));
  assert.ok(!isLoopbackHost('localhost.example.com'));
  assert.equal((await request(basePath,'example.com')).status,403);
  assert.equal((await request(basePath,undefined,'POST')).status,405);
  assert.equal((await request(basePath+'../../backend/README.md')).status,404);
  assert.equal((await request(basePath+'other.json')).status,404);
  assert.equal((await request('/simulator/')).passed,true);
  const response=await request(basePath+'data.json');
  assert.equal(response.status,200);
  assert.equal(JSON.parse(response.body).records.length,66);
  assert.equal(response.headers['Cache-Control'],'no-store');
  assert.equal(response.watched.length,2);
  assert.equal((await request(basePath+'report.md')).status,200);
  assert.equal((await request(basePath+'source.json')).status,200);
  assert.equal(safeOfficialUrl('javascript:alert(1)'),null);
});
