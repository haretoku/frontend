import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {readFile} from 'node:fs/promises';
import {gunzipSync} from 'node:zlib';

const sha256 = bytes => createHash('sha256').update(bytes).digest('hex');
const programFields = ['id','government_level','calculation_status','application_status','reason_code','amount_yen','component_amounts_yen'];
export async function loadNationalPrefectureExpectations({legacyBytes, publicBytes, referenceURL}) {
  const reference = JSON.parse(gunzipSync(await readFile(referenceURL)).toString('utf8'));
  assert.equal(reference.version, 'independent-backend-national-prefecture-qa/1');
  assert.equal(reference.expected_generated_from_frontend, false);
  assert.equal(sha256(legacyBytes), reference.legacy_fixture_sha256, '旧backend fixtureの同版を保持する');
  assert.equal(sha256(publicBytes), reference.source_public_sha256, '公式共通算定契約と同版の公開入力を比較する');
  const legacy = JSON.parse(legacyBytes.toString('utf8'));
  const byId = new Map(reference.cases.map(row => [row.id, row]));
  assert.equal(byId.size, reference.case_count);
  assert.equal(reference.case_count, legacy.cases.length);
  for (const row of legacy.cases) assert.deepEqual(byId.get(row.id)?.input, row.input, `既3122入力を保持する：${row.id}`);
  return byId;
}

export function legacyFinancialProjection(result) {
  const independent = structuredClone(result);
  const dependentKeys = ['subsidy_yen','subsidy_status','subsidy_source_ids','subsidy_calculation_note','subsidy_breakdown','net_initial_outlay_yen','initial_cost_yen','profit_yen','payback_year'];
  for (const scenario of independent.scenarios) {
    for (const key of dependentKeys) delete scenario[key];
    for (const year of scenario.annual_cash_flows) delete year.cumulative_cash_flow_yen;
  }
  return independent;
}

export function nationalReferenceProjection(result) {
  return {scenarios: result.scenarios.map(scenario => {
    const row = Object.fromEntries(Object.entries(scenario).filter(([key]) => !['subsidy_breakdown','subsidy_source_ids','subsidy_calculation_note'].includes(key)));
    const breakdown = scenario.subsidy_breakdown;
    row.subsidy_breakdown = Object.fromEntries(['national_amount_yen','prefecture_amount_yen','municipality_amount_yen','total_amount_yen'].map(key => [key, breakdown[key]]));
    for (const kind of ['included_programs','candidate_programs','excluded_programs']) {
      row.subsidy_breakdown[kind] = breakdown[kind].map(program => Object.fromEntries(programFields.map(key => [key, program[key] ?? null]))).sort((a,b) => a.id < b.id ? -1 : a.id > b.id ? 1 : 0);
    }
    return row;
  })};
}
