import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {diagnosticSubsidy,diagnosticComponents} from '../../site/simulator/src/diagnostic-subsidy.js';
import {nonInclusionReason,readableSubsidyAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'31',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
const program=(code,suffix='solar_battery')=>data.diagnostic_subsidy_programs.find(p=>p.id===`tottori-${code}-${suffix}-2026`);
test('鳥取19自治体16採用・8除外規則を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='31').length,19);
 const p=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='31'&&p.government_level==='municipality');assert.equal(p.length,24);
 assert.equal(p.filter(p=>p.machine_rule==='kansai_municipal_formula').length,16);assert.equal(p.filter(p=>p.machine_rule==='kansai_municipal_non_adopted').length,8);
});
test('八頭は太陽光単独144000円・同時200000円で一設備だけを採用する',()=>{
 assert.equal(standard('31329',{equipmentPackage:'solar_only'}).municipality_amount_yen,144000);
 const r=standard('31329');assert.equal(r.municipality_amount_yen,200000);
 assert.equal(r.included_programs.filter(p=>p.government_level==='municipality').length,1);
 assert.equal(r.excluded_programs.find(p=>p.id===program('31329','solar').id).reason_code,'explicit_combination_prohibition');
});
test('南部FIT蓄電池40万円は国費制度と排他で非FITメニューを除外する',()=>{
 const r=standard('31389');assert.equal(r.municipality_amount_yen,400000);
 for(const suffix of ['non_fit_solar','non_fit_battery'])assert.match(nonInclusionReason(r.excluded_programs.find(p=>p.id===program('31389',suffix).id)),/非FIT/);
 const p=program('31389','battery');assert.equal(p.conflict_program_ids.length,3);
 const national={...structuredClone(p),id:p.conflict_program_ids[0],government_level:'national',conflict_program_ids:[],formula_components:[{scope:'battery',equipment_packages:['solar_plus_standard_battery'],formula_type:'fixed',fixed_amount_yen:500000,rounding_unit_yen:1}]};
 const actual=diagnosticSubsidy([p,national],{prefectureCode:'31',municipalityCode:'31389',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1149500},true);
 assert.equal(actual.municipality_amount_yen,0);assert.equal(actual.national_amount_yen,500000);
});
test('大山単独20万円・同時各50万円と湯梨浜税抜・丸め未確認を保持する',()=>{
 assert.equal(standard('31386',{equipmentPackage:'solar_only'}).municipality_amount_yen,200000);
 assert.equal(standard('31386').municipality_amount_yen,1000000);
 assert.equal(standard('31370').municipality_amount_yen,492333);
 const p=program('31370');assert.ok(p.formula_components.every(c=>c.cost_tax==='exclusive'));
 const r=diagnosticComponents(p,{housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:330000,batteryCost:330000,batteryEquipmentCost:330000});
 assert.equal(r.components.solar,100000);assert.equal(r.components.battery,100000);
 for(const code of ['31364','31370'])assert.match(program(code).calculation_assumptions.map(readableSubsidyAssumption).join(' '),/千円切捨て処理順が未確認/);
});
test('鳥取新築未確認5自治体は既存のみ適用し対象外確定としない',()=>{
 for(const code of ['31302','31325','31328','31364','31401']){
 assert.ok(standard(code).municipality_amount_yen>0);
 const r=standard(code,{housingAge:'new'});assert.equal(r.municipality_amount_yen,0);
 const row=r.excluded_programs.find(p=>p.id===program(code).id);assert.match(nonInclusionReason(row),/新築住宅への適用条件を確認できていない/);assert.match(nonInclusionReason(row),/対象外としていると確定したものではありません/);
 }
});

test('事業者向け・個人直接補助でない理由は受付未確認に埋没せず受付状態を変更しない',()=>{
 for(const [reason_code,expected] of [['business_only',/事業者向け/],['not_direct_grant',/個人への直接補助ではない/]]){
 const row={reason_code,application_status:'unknown',amount_yen:null};
 assert.match(nonInclusionReason(row),expected);assert.doesNotMatch(nonInclusionReason(row),/受付状況を確認できていません/);
 assert.equal(row.application_status,'unknown');assert.equal(row.amount_yen,null);
 assert.match(nonInclusionReason({...row,application_status:'closed'}),/受付が終了/);
 }
 assert.match(nonInclusionReason({application_status:'unknown'}),/受付状況を確認できていません/);
});

test('鳥取除外メニュー補正版の受付と理由を混同せず表示する',()=>{
 const r=standard('31389');assert.equal(r.municipality_amount_yen,400000);
 for(const suffix of ['non_fit_solar','non_fit_battery','carport']){
 const row=r.excluded_programs.find(p=>p.id===`tottori-31389-${suffix}-2026`);assert.equal(row.application_status,'accepting');
 assert.match(nonInclusionReason(row),suffix==='carport'?/別の構造物・住宅工事/:/非FIT/);
 }
 for(const [code,suffix,status,pattern] of [['31201','business','closed',/受付が終了/],['31201','joint_purchase','unknown',/個人への直接補助ではない/],['31202','renovation','unknown',/別の構造物・住宅工事/],['31402','business','unknown',/事業者向け/]]){
 const row=standard(code).excluded_programs.find(p=>p.id===`tottori-${code}-${suffix}-2026`);assert.equal(row.application_status,status);assert.match(nonInclusionReason(row),pattern);
 }
});
