import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy } from '../../site/simulator/src/diagnostic-subsidy.js';
import { conciseOitaAssumption } from '../../site/simulator/src/subsidy-presentation.js';
const data = JSON.parse(await readFile(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));
const programs = data.diagnostic_subsidy_programs.filter(p => p.prefecture_code === '44');
const input = { prefectureCode:'44', municipalityCode:'44201', housingAge:'existing', equipmentPackage:'solar_plus_standard_battery', capacityKw:4, batteryCapacityKwh:9.5, solarCost:1324400, batteryCost:1149500, batteryEquipmentCost:1054500 };
const evaluate = (values={}) => diagnosticSubsidy(programs, {...input,...values}, true);

test('大分市は新築・既存とも蓄電池5万円，PV単体は市0円', () => {
 for (const housingAge of ['existing','new']) {
  assert.equal(evaluate({housingAge}).municipality_amount_yen,50000);
  assert.equal(evaluate({housingAge,equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 }
 assert.equal(evaluate({batteryCost:44000}).municipality_amount_yen,40000);
});
test('大分先行地域Bと宇佐は未確定候補であり制度不存在ではない', () => {
 const leading=evaluate().candidate_programs.find(p=>p.id==='oita-city-leading-battery-2026');
 assert.ok(leading); assert.equal(leading.amount_yen,null); assert.equal(leading.application_status,'accepting');
 const usa=evaluate({municipalityCode:'44211'}).candidate_programs.find(p=>p.id==='oita-usa-green-evidence-gap-2026');
 assert.ok(usa); assert.equal(usa.amount_yen,null); assert.equal(usa.application_status,'unknown');
 for(const municipalityCode of ['44202','44203','44211']) assert.equal(evaluate({municipalityCode}).municipality_amount_yen,0);
});
test('大分市の契約・完了・事後申請と税抜他助成控除の条件を表示する', () => {
 const row=evaluate().included_programs.find(p=>p.id==='oita-city-renewable-battery-2026');
 const note=conciseOitaAssumption({...row,included:true});
 for(const pattern of [/2025年10月1日/,/2026年4月1日～2027年3月31日/,/設置後に申請/,/税抜/,/他助成を控除/,/上限5万円/,/公式に併用可能と確認済みではありません/]) assert.match(note,pattern);
 assert.equal(conciseOitaAssumption({...row,included:false}),'');
});
