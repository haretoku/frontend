import {validateRows,validateDecisions,decisionCounts} from './model.js';
import {createHash} from 'node:crypto';

export function canonicalHash(value) {
  const sorted = item => Array.isArray(item) ? item.map(sorted) : item && typeof item === 'object'
    ? Object.fromEntries(Object.keys(item).sort().map(key=>[key,sorted(item[key])])) : item;
  return createHash('sha256').update(JSON.stringify(sorted(value))).digest('hex');
}

export function publicFingerprint(publicData,code) {
  const prefecture=publicData.prefectures.find(row=>row.code===code);
  if(!prefecture)throw Error('診断データに都道府県がありません．');
  return canonicalHash({prefecture,diagnostic_subsidy_programs:(publicData.diagnostic_subsidy_programs??[])
    .filter(program=>program.prefecture_code===code).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)});
}

const adoptionLabels = {
  not_reviewed:'推奨未整理', recommendation_ready_user_review_pending:'推奨案・ユーザー検収待ち',
  user_approved_not_delivered:'承認済み・未反映', investigation_closed_not_included:'調査終了・今回非算入',
  integrated_existing_snapshot:'既存の採用結果'
};
const userLabels = {not_requested:'未依頼',pending:'ユーザー検収待ち',approved:'承認済み',rejected:'不採用'};
const list = value => Array.isArray(value) ? value : value ? [value] : [];
const text = value => typeof value === 'string' ? value : JSON.stringify(value);
const stage = (key,state,label,notes=[],details=[]) => ({state:`${key}:${state??'unknown'}`,label,notes:notes.filter(Boolean).map(text),details:details.filter(Boolean).map(text)});

function reviewStage(row) {
  const review=row.reviews?.stage_1_collection;
  const fingerprint=row.source_audit?.content_fingerprint;
  const valid=review?.status==='pass' && !!fingerprint && review.subject_fingerprint===fingerprint && review.evidence_refs?.length>0 && !!review.scope && !!review.reviewer && !!review.reviewed_at;
  return stage('review1',valid?'pass':'unconfirmed',valid?'AI①確認済み':'AI①未確認',
    valid?[]:['対象版・範囲・検収根拠が揃うまで確認済みにしません．'],
    [review?.reviewer,review?.reviewed_at,review?.scope,review?.subject_fingerprint,...list(review?.evidence_refs)]);
}

export function toDisplayData(projection,audits,publicData) {
  const rows=projection.prefectures.map(row=>{
    const audit=audits.get(row.prefecture_code);
    const adoption=row.adoption??{},user=adoption.user_review??{};
    const current=publicData.prefectures.find(prefecture=>prefecture.code===row.prefecture_code);
    const decisions=list(adoption.decision_required);
    const collection=row.collection??{};
    const fingerprint=publicFingerprint(publicData,row.prefecture_code);
    const synchronized=fingerprint===row.delivery?.public_snapshot_fingerprint;
    const deliveryLabels={legacy_snapshot_only:'旧診断情報を保持',existing_snapshot_unchanged:'現在の診断は変更なし',verified_existing_snapshot:'既存の診断反映を保持'};
    const publicLabels={current_scope_reviewed:'記録した範囲を確認済み',current_scope_unconfirmed:'現行制度は未確認',legacy_included_pending_current_scope_review:'従来確認分を反映・現行調査未完了'};
    const previousReviews=['stage_2_backend','stage_3_frontend'].flatMap((key,index)=>{
      const review=row.reviews?.[key];
      const valid=review?.status==='pass' && synchronized && review.subject_fingerprint===fingerprint && !!review.scope && !!review.reviewer && !!review.reviewed_at && review.evidence_refs?.length>0;
      return [`既存診断版${index===0?'②':'③'}：${valid?'検収済み':'検収根拠未確認'}`,review?.scope,...list(review?.evidence_refs)];
    });
    const official=row.official_sources??[];
    const sourceRecords=new Map((audit?.audit?.sources??[]).map(source=>[source.source_id,source]));
    const sources=official.map(source=>{
      const original=sourceRecords.get(source.source_id);
      const retrieval=original?.retrieval_status;
      const unavailable=typeof retrieval==='string'&&/未取得|取得失敗|未確認|not_retrieved|failed/.test(retrieval);
      return {url:source.official_url,label:original?.document_title??source.title??'公式資料（文書名未確認）',
        checkedAt:source.checked_at,retrievalStatus:unavailable?`未取得・本文未確認：${retrieval}`:retrieval??'取得状況未確認'};
    });
    if(audit)sources.push({url:`sources/prefecture-${row.prefecture_code}.json`,label:'県別監査JSONの正本'});
    sources.push({url:'sources/report.md',label:'都道府県の収集レポート'});
    return {code:row.prefecture_code,name:row.prefecture_name,audit,
      excludedPrograms:audit?.audit?.excluded_from_main_records??[],sources,
      stages:{
        collection:stage('collection',collection.status,({not_started:'未着手',in_progress:'調査中',complete:'記録した範囲の調査終了'})[collection.status]??'収集状態未確認',[...list(row.fact_summary),collection.scope,collection.reviewed_at?`確認日：${collection.reviewed_at}`:null]),
        adoption:stage('adoption',adoption.status,adoptionLabels[adoption.status]??'採用推奨未確認',adoption.recommendation_summary??[],list(adoption.assumptions).map(value=>`推奨案の仮定：${value}`)),
        issues:stage('issues',decisions.length?'decision_required':'none_recorded',decisions.length?'要判断':'追加判断の記載なし',decisions),
        review1:reviewStage(row),
        userReview:stage('userReview',user.status,userLabels[user.status]??'ユーザー検収未確認',[user.decided_at?`判断日：${user.decided_at}`:null,user.basis]),
        delivery:stage('delivery',synchronized?row.delivery.status:'snapshot_mismatch',synchronized?(deliveryLabels[row.delivery.status]??'反映状態未確認'):'診断の県別内容が不一致',
          [publicLabels[current?.prefecture_program_status]??'未確認',synchronized?'県別内容の一致を確認．今回の推奨案の採用・同期を意味しません．':'検収投影と現在の診断が一致するまで同期済みにしません．'],[fingerprint,...previousReviews])
      }};
  }).sort((a,b)=>a.code.localeCompare(b.code));
  validateRows(rows);
  return {records:rows,versionLabel:`検収表生成日時：${projection.generated_at??'未確認'} ／ 現在の診断データ版：${publicData.data_version??'未確認'}．この表は診断を更新しません．診断への反映と独立検収の状況は，各県の原本で確認できます（本番未公開）．`};
}

export function decisionDisplayData(decision,projection,records,projectionFileHash) {
  if(decision.schema_version!=='1.1.0'||!Array.isArray(decision.decision_history))throw Error('未判断投影の承認履歴契約が一致しません．');
  const subject=Object.fromEntries(['schema_version','scope','source_snapshot','summary','issues','decision_history'].map(key=>[key,decision[key]]));
  if(canonicalHash(subject)!==decision.decision_projection_sha256)throw Error('未判断投影の内容ハッシュが一致しません．');
  const source=decision.source_snapshot;
  if(source?.prefecture_review_projection_file_sha256!==projectionFileHash || source.prefecture_review_projection_sha256!==projection.projection_sha256)throw Error('未判断投影と47県監査投影の版が一致しません．');
  const toyama=projection.prefectures.find(row=>row.prefecture_code==='16');
  if(source.toyama_source_audit_path!==toyama.source_audit.path || source.toyama_source_audit_file_sha256!==toyama.source_audit.file_sha256 || source.toyama_content_fingerprint!==toyama.source_audit.content_fingerprint)throw Error('未判断投影と富山監査の版が一致しません．');
  if(source.public_data_sha256!==projection.source_snapshot.public_data_sha256)throw Error('未判断投影の診断参照版が一致しません．');
  if(!Array.isArray(decision.issues))throw Error('未判断事項がありません．');
  const decisions=decision.issues.filter(issue=>issue.user_review?.status==='pending').map(issue=>{
    const record=records.find(record=>record.code===issue.prefecture_code);
    if(!record)throw Error('未判断事項の県参照がありません．');
    const sources=issue.source_refs.map(ref=>{
      const source=record.sources.find(source=>source.url===ref.official_url);
      if(!source || ref.source_audit_path!==projection.prefectures.find(row=>row.prefecture_code===issue.prefecture_code).source_audit.path)throw Error('未判断事項の資料参照が一致しません．');
      return {...source,locator:ref.locator};
    });
    const r=issue.recommendation;
    const treatmentLabels={exclude_from_cash_subsidy_and_net_initial_outlay:"現金補助・実質初期負担から控除しない",display_as_separate_noncash_benefit:"非現金便益を別建て表示",valuation_rate_zero_percent:"換算率0％",valuation_rate_one_hundred_percent_if_fully_usable:"全額利用できる場合のみ換算率100％"};
    const readable=value=>treatmentLabels[value]??value.replaceAll("subsidy_yen","現金補助額").replaceAll("net_initial_outlay_yen","実質初期負担");
    return {id:issue.issue_id,code:issue.prefecture_code,name:issue.prefecture_name,programId:issue.program_name+':'+issue.target_year,programName:issue.program_name,
      type:issue.decision_type,typeLabel:issue.decision_type==='policy_choice'?'新規方針判断':'制度・条件',question:issue.question,why:issue.why_ai_cannot_decide,
      dependency:issue.depends_on_issue_id ? decision.issues.find(item=>item.issue_id===issue.depends_on_issue_id)?.question : null,
      evidence:issue.confirmed_facts,recommendation:[r.summary],recommendationDetails:['基本ケース：'+readable(r.base_case_treatment),'条件付き比較：'+readable(r.conditional_comparison_treatment),...r.rationale],
      options:issue.options.map(option=>option.label+(option.recommended?'（AI推奨）':'')+'：'+option.description+' ／ '+readable(option.calculation_effect)),sources};
  });
  validateDecisions(decisions,records);
  const actual=decisionCounts(decisions),summary=decision.summary;
  if(summary.reviewed_prefecture_count!==47 || actual.prefectures!==summary.displayed_prefecture_count || actual.programs!==summary.displayed_program_count || actual.issues!==summary.displayed_issue_count)throw Error('未判断事項の県・制度・論点集計が一致しません．');
  for(const key of ['fully_excluded_from_table_prefecture_count','excluded_existing_policy_program_record_count','excluded_from_table_program_record_count','excluded_rule_held_gap_count'])if(!Number.isInteger(summary[key])||summary[key]<0)throw Error('除外件数が不正です．');
  return {decisions,decisionHistory:decision.decision_history,decisionSummary:{excludedPrefectures:summary.fully_excluded_from_table_prefecture_count,excludedPrograms:summary.excluded_from_table_program_record_count,excludedFactualGaps:summary.excluded_rule_held_gap_count}};
}
