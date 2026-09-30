import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {nonInclusionReason,conciseIwateAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const input={prefectureCode:'03',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(municipalityCode,extra={})=>diagnosticSubsidy(data.diagnostic_subsidy_programs,{...input,municipalityCode,...extra},true);
test('盛岡の既存受付中・新築受付終了と算入額を区別する',()=>{
 const existing=evaluate('03201'),fresh=evaluate('03201',{housingAge:'new'});
 assert.equal(existing.municipality_amount_yen,56000);assert.equal(fresh.municipality_amount_yen,0);
 const row=existing.included_programs.find(p=>p.id==='iwate-morioka-solar-2026');
 assert.equal(row.branch_statuses.length,2);
 assert.match(nonInclusionReason(fresh.excluded_programs.find(p=>p.id===row.id)),/新築住宅分は受付が終了/);
 assert.match(conciseIwateAssumption({...row,included:true}),/既存住宅.*1月29日.*3月31日/);
});
test('平泉10kWhではPV分だけ，北上は同時設置だけを算入する',()=>{
 assert.equal(evaluate('03402',{batteryCapacityKwh:10}).municipality_amount_yen,80000);
 assert.equal(evaluate('03206',{equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 assert.equal(evaluate('03206').municipality_amount_yen,310000);
});
test('田野畑の未確認と二戸の住宅事業要件を区別する',()=>{
 const tanohata=evaluate('03484').candidate_programs.find(p=>p.id==='iwate-tanohata-solar-2026');
 assert.equal(tanohata.amount_yen,null);assert.match(nonInclusionReason(tanohata),/現年度.*公式に対象外と確認した意味ではありません/);
 const ninohe=evaluate('03213').excluded_programs.find(p=>p.id==='iwate-ninohe-next-generation-housing-collection');
 assert.match(nonInclusionReason(ninohe),/住宅事業全体.*切り分けられない/);
});
