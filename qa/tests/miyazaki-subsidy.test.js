import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy } from '../../site/simulator/src/diagnostic-subsidy.js';
import { nonInclusionReason } from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const programs=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='45');
const input={prefectureCode:'45',municipalityCode:'45203',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(municipalityCode)=>diagnosticSubsidy(programs,{...input,municipalityCode},true);
test('宮崎の未定・停止・自治体未確認を区別する',()=>{
 const nobeoka=evaluate('45203').candidate_programs.find(p=>p.id==='miyazaki-nobeoka-leading-pending-2026');
 assert.ok(nobeoka);assert.equal(nobeoka.amount_yen,null);assert.equal(nobeoka.application_status,'unknown');assert.match(nonInclusionReason(nobeoka),/令和8年度の事業実施は未定/);
 const mimata=evaluate('45341');
 const battery=[...mimata.excluded_programs,...mimata.candidate_programs].find(p=>p.id==='miyazaki-mimata-battery-2026');
 assert.ok(battery);assert.equal(battery.application_status,'suspended');assert.match(nonInclusionReason(battery),/追加予算を調整中/);assert.match(nonInclusionReason(battery),/再開が決まったことを意味しません/);
 const pv=programs.find(p=>p.id==='miyazaki-mimata-pv-2026');assert.equal(pv.application_status,'accepting');
 const tsuno=data.municipalities.find(m=>m.municipality_code==='45406');assert.equal(tsuno.program_status,'unconfirmed');
 for(const code of ['45201','45203','45207','45341','45443','45406'])assert.equal(evaluate(code).municipality_amount_yen,0);
});
