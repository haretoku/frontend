import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {subsidyGroups,conciseHiroshimaAssumption,nonInclusionReason,subsidyResearchMessage} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'34',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('広島23自治体23規則と6採用額を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='34').length,23);
 assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('hiroshima-')).length,23);
 for(const [code,amount] of [['34100',30000],['34202',50000],['34204',50000],['34302',130000],['34431',50000],['34462',95000]])assert.equal(standard(code).municipality_amount_yen,amount,code);
 assert.equal(standard('34302',{systemCapacityKw:5}).municipality_amount_yen,150000);
 assert.equal(standard('34302',{systemCapacityKw:4.199}).municipality_amount_yen,132000);
});
test('呉は新築・既存5万円の仮定で非FIT別枝を維持する',()=>{
 const b=standard('34202',{housingAge:'new'});assert.equal(b.municipality_amount_yen,50000);const before=JSON.stringify(b);const scenario={scenario:'standard',subsidy_breakdown:b};
 const g=subsidyGroups({input:{equipment_package:'solar_plus_standard_battery'},scenarios:[scenario]},scenario,{});
 const rows=g.excluded.filter(p=>/hiroshima-34202-battery/.test(p.id));assert.equal(rows.length,0);assert.equal(JSON.stringify(b),before);
 assert.match(g.excluded.find(p=>p.id==='hiroshima-34202-nonfit-2026').reason,/非FIT/);
});
test('東広島はB受付終了とPV受付中非FITを区別する',()=>{
 const b=standard('34212');assert.equal(b.municipality_amount_yen,0);
 const battery=b.excluded_programs.find(p=>p.id==='hiroshima-34212-battery_closed-2026');assert.equal(battery.application_status,'closed');assert.match(nonInclusionReason(battery),/受付が終了/);
 const pv=b.excluded_programs.find(p=>p.id==='hiroshima-34212-nonfit_pv-2026');assert.equal(pv.application_status,'accepting');assert.match(nonInclusionReason(pv),/非FIT/);
});
test('三原の他補助0円限定，世羅容量未確認，熊野未確認を保持する',()=>{
 const b=standard('34204');assert.equal(b.national_amount_yen,0);assert.equal(b.prefecture_amount_yen,0);const row=b.included_programs.find(p=>p.government_level==='municipality');assert.match(conciseHiroshimaAssumption({...row,included:true}),/他の補助金は0円/);assert.match(row.required_confirmations.join(' '),/1\/2/);
 assert.match(conciseHiroshimaAssumption({id:'hiroshima-34462-battery-2026',included:true}),/定格・実効.*未確認/);
 const kuma=data.municipalities.find(p=>p.municipality_code==='34307');assert.equal(kuma.program_status,'unconfirmed');assert.match(subsidyResearchMessage(kuma.program_status),/未調査・未反映は，補助金がないことを意味しません/);assert.equal(standard('34307').municipality_amount_yen,0);
});
test('広島の別構造物・別設備・設備対象外をFIT不適合としない',()=>{
 for(const [code,id,pattern] of [['34213','carport',/別の構造物/],['34215','external_work',/別の省エネ設備・工事/],['34211','reform_pv',/設備の設置工事は制度の対象外/]]){const r=standard(code).excluded_programs.find(p=>p.id===`hiroshima-${code}-${id}-2026`);assert.match(nonInclusionReason(r),pattern);assert.doesNotMatch(nonInclusionReason(r),/FIT/);}
});
