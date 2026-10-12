import test from 'node:test';
import assert from 'node:assert/strict';
import {loadPublicData, readFixture, diagnosticInput} from '../helpers/subsidy-fixture.js';
import {assertUpdatedCombined, assertUpdatedLiteral} from '../helpers/combined-national-reference.js';
import {receiveSchemeRules} from '../../data/src/scheme-adapter.js';
import {diagnosticSubsidy, diagnosticComponents} from '../../site/simulator/src/diagnostic-subsidy.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {noncashBenefitDescription} from '../../site/simulator/src/subsidy-presentation.js';

const data = loadPublicData();
const rules = receiveSchemeRules(data).diagnostic;
const versions = [
  {version: 5, cases: 'cases'},
  {version: 7, cases: 'generated_contract_equivalence_cases', combinations: 'literal_expectations'},
  ...[8, 9, 10].map(version => ({version, cases: 'generated_equivalence_cases', combinations: 'combination_cases'})),
];
// 原5fixtureと独立backendの国県期待値は変更せず，実行処理のみをまとめる．
for (const definition of versions) {
  const vectors = readFixture(`hokkaido-combined-v${definition.version}-vectors.json`);
  test(`北海道固定v${definition.version}：全項目のbackend期待値`, () => {
    for (const {input, expected} of vectors[definition.cases]) {
      const actual = diagnosticSubsidy(rules, diagnosticInput(input), input.municipal_program_enabled);
      assertUpdatedCombined(actual, expected, input);
    }
  });
  if (vectors.literal_cases) test(`北海道固定v${definition.version}：容量・費用・丸めの境界額`, () => {
    for (const row of vectors.literal_cases) {
      const rule = rules.find(rule => rule.id === `hokkaido-next-${row.rule}`);
      assert(rule, row.rule);
      const result = diagnosticComponents(rule, {
        housingAge: row.age, equipmentPackage: row.package, capacityKw: row.pv,
        batteryCapacityKwh: row.q, solarCost: row.solar, batteryCost: row.battery,
        batteryEquipmentCost: row.equipment,
      });
      assert.equal(Object.values(result?.components ?? {}).reduce((a, b) => a + b, 0), row.expected_yen, JSON.stringify(row));
    }
  });
  if (definition.combinations) test(`北海道固定v${definition.version}：設備組合せと採用規則`, () => {
    for (const row of vectors[definition.combinations]) {
      const actual = diagnosticSubsidy(rules, diagnosticInput(row), true);
      assertUpdatedLiteral(actual, row, row, rules);
    }
  });
}

test('保持10規則を掲載枝へ結合し，診断専用行を重複表示しない',()=>{
  const bindings=Object.fromEntries(Object.entries(data.subsidy_scheme_links.retained_diagnostic_bindings).filter(([id])=>id.startsWith('hokkaido-candidate-')));
  assert.equal(Object.keys(bindings).length,10);
  for(const [id,ids] of Object.entries(bindings)){
    const rule=rules.find(r=>r.id===id);
    const rows=selectSchemeGroups(data,rule.prefecture_code,rule.municipality_code).flat();
    assert(!rows.some(r=>r.id===id),id);
    for(const branch of ids)assert.equal(rows.filter(r=>r.id===branch&&r._legacy.some(p=>p.id===id)).length,1);
  }
  assert.equal(data.municipalities.find(m=>m.municipality_code==='01601').prefecture_code,'01');
  assert.equal(data.municipalities.find(m=>m.municipality_code==='30382').prefecture_code,'30');
});
test('保持規則の未定義・重複・逆参照欠落・地域不一致を拒否する',()=>{
  const id='hokkaido-candidate-hidaka-solar',branch='hokkaido-additional-hidaka-0';
  for(const mutate of [
    d=>delete d.subsidy_scheme_links.retained_diagnostic_bindings[id],
    d=>d.subsidy_scheme_links.retained_diagnostic_bindings[id].push(branch),
    d=>d.subsidy_scheme_links.retained_diagnostic_bindings.invalid=[branch],
    d=>d.subsidy_scheme_links.retained_branches.find(r=>r.branch_id===branch).diagnostic_rule_ids=[],
    d=>d.subsidy_catalog.rows.find(r=>r.branch_id===branch).municipality_code='30382'
  ]){const d=structuredClone(data);mutate(d);assert.throws(()=>receiveSchemeRules(d),/保留規則/);}
});

test('浜中の非現金給付を現金額と区別する',()=>{
  const note=noncashBenefitDescription(rules.find(r=>r.id==='hokkaido-next-hamanaka-solar'));
  assert.match(note,/Pay又はピリカ金券/);
  assert.match(note,/現金の給付ではありません/);
  assert.match(note,/全額利用できると仮定/);
});
