export function summarize(records) {
  const components = records.flatMap(record => record.reclassification.components);
  return {
    municipalities: records.length,
    identified: records.filter(record => record.reclassification.collection_status === '収集済み').length,
    unidentified: records.filter(record => record.reclassification.collection_status === '未収集').length,
    components: components.length,
    possible: components.filter(component => component.calculation_possibility === '可能').length,
    nonInclusion: components.filter(component => component.calculation_possibility === '可能' && component.calculation_basis === '根拠付き非算入（この成分のみ）').length,
    impossible: components.filter(component => component.calculation_possibility === '不能').length,
    positive: records.reduce((total, record) => total + record.reclassification.calculation_summary.conditional_amount_component_count, 0),
    implemented: records.filter(record => record.reclassification.implementation.diagnostic_program_ids.length > 0).length
  };
}

export function auditNotice(audit) {
  const retrieval = audit.source_retrieval_performed === true
    ? `公式資料の限定追加確認あり．${audit.source_retrieval_scope ?? ''}`
    : audit.source_retrieval_performed === false ? '公式資料の再取得なし' : '公式資料の再取得状況は未確認';
  const status = audit.semantic_recheck?.status;
  const acceptancePassed = audit.acceptance_policy_review?.status === 'complete'
    && audit.acceptance_policy_review.independent_transcription_review?.result === 'PASS';
  const amount = audit.amount_impact_review;
  const amountPassed = amount?.status === 'complete' &&
    (amount.independent_transcription_review?.result === 'PASS' || amount.independent_review?.result === 'PASS');
  const amountNotice = amount ? `今回の${amount.baseline_municipalities}自治体${amount.baseline_components}成分の金額影響・枝分離は${amountPassed ? '検収済み' : '独立検収待ち'}です．前回の受付・算式再整理の検収とは別です．` : '';
  return {
    date: `再分類日：${audit.reviewed_at} ／ ${retrieval}`,
    review: amountNotice + (acceptancePassed
      ? '今回の18自治体21成分の受付・算式再整理は検収済みです．旧57成分全体の意味上の再点検は別途未完了です．'
      : status === 'in_progress'
      ? '意味上の再点検中です．集計・分類は訂正途中であり，最終検収済みではありません．'
      : status === 'awaiting_independent_review'
      ? '訂正後の独立検収待ちです．集計・分類は最終検収済みではありません．'
      : `意味上の再点検状況：${status ?? '未確認'}．${audit.validation?.independent_review?.result ?? ''}`)
  };
}

export function matches(record, { prefecture = '', status = '', query = '' }) {
  const review = record.reclassification;
  if (prefecture && record.prefecture_code !== prefecture) return false;
  const normalized = value => value.normalize('NFKC').replace(/\s/g, '').toLocaleLowerCase('ja');
  if (query && !normalized(record.municipality_name).includes(normalized(query))) return false;
  return !status
    || status === 'identified' && review.collection_status === '収集済み'
    || status === 'unidentified' && review.collection_status === '未収集'
    || status === 'non-inclusion' && review.components.some(component => component.calculation_possibility === '可能' && component.calculation_basis === '根拠付き非算入（この成分のみ）')
    || status === 'judged' && review.components.some(component => component.calculation_possibility === '可能')
    || status === 'conditional' && review.calculation_summary.conditional_amount_component_count > 0
    || status === 'impossible' && review.components.some(component => component.calculation_possibility === '不能');
}

export function componentSummary(record) {
  const counts = summarize([record]);
  return counts.components
    ? `判断済 ${counts.possible}成分 ／ 確認不足 ${counts.impossible}成分`
    : '根拠未特定';
}

export function implementationReviewClosed(component) {
  const review = component.review_resolution;
  return review?.status === 'implementation_not_confirmed'
    && review.investigation_closed === true
    && review.independent_review?.result === 'PASS';
}

export function approvedResolution(component) {
  const review = component.review_resolution;
  return ['approved_assumptions', 'insufficient_information_closed'].includes(review?.status)
    && review.decision_basis === 'user_approved'
    && review.investigation_closed === true
    && review.independent_review?.result === 'PASS';
}

export function pendingResolution(component) {
  return ['approved_assumptions', 'insufficient_information_closed'].includes(component.review_resolution?.status)
    && !approvedResolution(component);
}

export function pendingResolutionWithoutBranchesCount(records) {
  return records.flatMap(record => record.reclassification.components)
    .filter(component => pendingResolution(component) && component.calculation_possibility === '可能'
      && unresolvedAmountBranches(component).length === 0).length;
}

export function resolutionSummary(records) {
  const components = records.flatMap(record => record.reclassification.components).filter(approvedResolution);
  return {
    assumptions: components.filter(component => component.review_resolution.status === 'approved_assumptions').length,
    insufficient: components.filter(component => component.review_resolution.status === 'insufficient_information_closed').length,
    impossible: components.filter(component => component.calculation_possibility === '不能').length
  };
}

export function unjudgedExclusions(records) {
  const counts = {historical:0, implementationNotConfirmed:0, other:0};
  for (const record of records) for (const component of record.reclassification.components) {
    if (component.calculation_possibility !== '不能') continue;
    if (approvedResolution(component)) continue;
    if (component.reference_role === 'historical_only') counts.historical++;
    else if (implementationReviewClosed(component)) counts.implementationNotConfirmed++;
    else if (component.reference_role !== undefined && component.reference_role !== 'current_candidate') counts.other++;
  }
  return counts;
}

export function unjudgedRecords(records) {
  return records.flatMap(record => {
    const components = record.reclassification.components.filter(component => {
      if (approvedResolution(component)) return false;
      const branches = unresolvedAmountBranches(component);
      if (branches.length && (component.reference_role === 'historical_only' || implementationReviewClosed(component))) {
        throw new Error('未判断枝と過年度参考・調査終了の指定が重複しています．正本の範囲を確認してください．');
      }
      return (pendingResolution(component) || component.calculation_possibility === '不能' || component.calculation_possibility === '可能' && branches.length > 0)
        && (component.reference_role === undefined || component.reference_role === 'current_candidate')
        && !implementationReviewClosed(component);
    });
    if (!components.length) return [];
    return [{...record,reclassification:{...record.reclassification,components,
      calculation_summary:{...record.reclassification.calculation_summary,
        possible_component_count:components.filter(c=>c.calculation_possibility === '可能').length,
        impossible_component_count:components.filter(c=>c.calculation_possibility === '不能').length,
        conditional_amount_component_count:components.filter(c=>c.classification === 'conditional_amount').length}
    }}];
  });
}

export function unresolvedAmountBranches(component) {
  return component.amount_impact_review?.unresolved_branches ?? [];
}

export function reviewReasons(component) {
  const branches = unresolvedAmountBranches(component);
  return branches.length ? [...new Set(branches.flatMap(branch => branch.unresolved_reasons))] : component.unresolved_reasons;
}

export function mixedUnresolvedCount(records) {
  return records.flatMap(record=>record.reclassification.components)
    .filter(component=>component.calculation_possibility === '可能' && unresolvedAmountBranches(component).length > 0).length;
}

export function explorationSummary(records) {
  const unidentified = records.filter(record => record.reclassification.collection_status === '未収集');
  const closed = unidentified.filter(record => {
    const review = record.reclassification.exploration_review;
    return review?.status === 'searched_not_found'
      && review.investigation_closed === true
      && review.independent_review?.result === 'PASS';
  });
  return { unidentified: unidentified.length, closed: closed.length, remaining: unidentified.length - closed.length };
}

export function latestSources(components) {
  const sources = new Map();
  const date = evidence => /^\d{4}-\d{2}-\d{2}$/.test(evidence.source_checked_at ?? '') ? evidence.source_checked_at : '';
  for (const component of components) for (const evidence of component.evidence) {
    if (!evidence.official_url) continue;
    const previous = sources.get(evidence.official_url);
    if (!previous || date(evidence) > date(previous)) {
      sources.set(evidence.official_url, {...evidence, title:evidence.title || previous?.title});
    }
  }
  return [...sources.values()];
}

export function recommendation(reasons) {
  const labels = {'対象設備不明':'対象設備','受付状態不明':'受付状態','制度ルール不明':'算定条件'};
  const topics = [...new Set(reasons.map(reason => labels[reason] ?? reason.replace(/(?:未確認|不明)$/, '')))];
  return `${topics.length ? topics.join('・') : '不足する条件'}を追加資料で確認．確認できるまでは今回の算入を保留．`;
}

export function safeOfficialUrl(value) {
  try { const url = new URL(value); return ['https:', 'http:'].includes(url.protocol) ? url.href : null; }
  catch { return null; }
}
