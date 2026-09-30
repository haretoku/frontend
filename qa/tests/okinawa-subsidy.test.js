import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy } from '../../site/simulator/src/diagnostic-subsidy.js';
import { conciseOkinawaAssumption, nonInclusionReason } from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const programs=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='47');
const input={prefectureCode:'47',municipalityCode:'47207',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(municipalityCode,values={})=>diagnosticSubsidy(programs,{...input,municipalityCode,...values},true);
test('沖縄の容量切捨てと10kW境界を制度別に維持する',()=>{
 for(const [capacityKw,amount] of [[3.099,30000],[3.1,31000],[9.999,99000],[10,0]])assert.equal(evaluate('47209',{capacityKw}).municipality_amount_yen,amount);
 assert.equal(evaluate('47303',{capacityKw:10}).municipality_amount_yen,100000);
 for(const code of ['47207','47324']){assert.equal(evaluate(code).municipality_amount_yen,30000);assert.equal(evaluate(code,{capacityKw:10}).municipality_amount_yen,0);}
 assert.equal(evaluate('47348',{capacityKw:10}).municipality_amount_yen,30000);
});
test('石垣の契約期間・開始前・抽選と東の早い方の報告期限を保持する',()=>{
 const row=evaluate('47207').included_programs.find(p=>p.id==='okinawa-ishigaki-pv-2026');assert.equal(row.application_status,'scheduled');
 const note=conciseOkinawaAssumption({...row,included:true});
 for(const re of [/2025年10月1日～2026年9月30日/,/2026年10月1日～31日/,/受付開始前/,/抽選/,/採択されると仮定/,/交付を保証しません/])assert.match(note,re);
 const east=evaluate('47303').included_programs.find(p=>p.id==='okinawa-higashi-pv-2026');assert.match(conciseOkinawaAssumption({...east,included:true}),/受給開始から30日以内又は申請年度の3月31日の早い方/);
});
test('沖縄市は受付中と設置期間不適合を分離し，未確認5自治体と候補2件を残す',()=>{
 const city=evaluate('47211').excluded_programs.find(p=>p.id==='okinawa-city-pv-2026');assert.ok(city);assert.equal(city.application_status,'accepting');assert.match(nonInclusionReason(city),/2026年8月31日/);assert.equal(evaluate('47211').municipality_amount_yen,0);
 for(const code of ['47215','47311','47327','47356','47375'])assert.equal(data.municipalities.find(m=>m.municipality_code===code).program_status,'unconfirmed');
 for(const [code,id] of [['47350','okinawa-haebaru-reform-candidate-2026'],['47381','okinawa-taketomi-reform-candidate-2026']]){const row=evaluate(code).candidate_programs.find(p=>p.id===id);assert.ok(row);assert.equal(row.amount_yen,null);}
});
