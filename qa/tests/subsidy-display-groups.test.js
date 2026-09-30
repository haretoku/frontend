import assert from 'node:assert/strict';
import test from 'node:test';
import { readFile } from 'node:fs/promises';
import { diagnosticSubsidy } from '../../site/simulator/src/diagnostic-subsidy.js';
import { groupSubsidyDisplayRows, subsidyGroups } from '../../site/simulator/src/subsidy-presentation.js';

test('六戸の同名制度をまとめても設備別の非算入理由と未確定額を保持する', async () => {
  const data = JSON.parse(await readFile(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));
  const programs = data.diagnostic_subsidy_programs.filter(p => p.municipality_code === '02405');
  for (const equipmentPackage of ['solar_only', 'solar_plus_standard_battery']) {
    const breakdown = diagnosticSubsidy(programs, {prefectureCode:'02',municipalityCode:'02405',housingAge:'existing',equipmentPackage,capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500}, true);
    const scenario = {scenario:'standard',subsidy_breakdown:breakdown};
    const rows = subsidyGroups({input:{equipment_package:equipmentPackage},scenarios:[scenario]}, scenario).excluded;
    const grouped = groupSubsidyDisplayRows(rows);
    assert.equal(grouped.length, 1);
    assert.equal(grouped[0].length, 2);
    assert.deepEqual(grouped.flat(), rows);
    assert.equal(breakdown.total_amount_yen, 0);
    assert.ok(grouped[0].every(row => row.amount_yen === null && row.reason));
  }
});

test('名称だけでは統合せず，受付状態・金額・リンクを持つ各記録を残す', () => {
  const row = {government_level:'municipality',program_name:'同名制度',official_url:'https://example.jp/a',included:true,amount_yen:10000,application_status:'accepting'};
  const battery = {...row,id:'battery',amount_yen:20000,application_status:'scheduled'};
  const rows = [row,battery,{...row,official_url:'https://example.jp/b'},{...row,government_level:'prefecture'},{...row,included:false},{...row,official_url:null},{...row,official_url:null}];
  const groups = groupSubsidyDisplayRows(rows);
  assert.equal(groups.length, 6);
  assert.deepEqual(groups[0], [row,battery]);
  assert.deepEqual(groups.flat(), rows);
});
