import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {designatedContractAssumption,nonInclusionReason,readableSubsidyAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
// Approved formal_release expectations; this fixture is QA-only.
const approved=JSON.parse(await readFile(new URL('../fixtures/aichi-approved-amounts.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'23',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('愛知正式54自治体96枝と45算式・51非算入・未確定0を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='23').length,54);
 const rules=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='23'&&p.government_level==='municipality');assert.equal(rules.length,96);
 for(const [suffix,count] of [['formula',45],['non_adopted',51],['unresolved',0]])assert.equal(rules.filter(p=>p.machine_rule===`kansai_municipal_${suffix}`).length,count);
 assert.equal(approved.length,44);
});
for(const row of approved)test(`愛知承認44自治体の実額一致：${row.municipality_code}`,()=>assert.equal(standard(row.municipality_code).municipality_amount_yen,row.expected_amount_yen));
test('田原・みよしの太陽光単独額を保持する',()=>{
 assert.equal(standard('23231',{equipmentPackage:'solar_only'}).municipality_amount_yen,40000);
 assert.equal(standard('23236',{equipmentPackage:'solar_only'}).municipality_amount_yen,160000);
});
test('住宅区分指定なしは新築と既存の両方を仮定して算入する',()=>{
 for(const code of ['23211', '23221', '23231', '23236', '23342', '23561', '23562', '23563']){const existing=standard(code).municipality_amount_yen;assert.ok(existing>0);assert.equal(standard(code,{housingAge:'new'}).municipality_amount_yen,existing);}
});test('岡崎の指定契約注記は正額算入時だけ示し未確定額を強制しない',()=>{
 const id='aichi-23202-local_renewable_battery-2026';
 for(const row of [{id,amount_yen:null,included:false},{id,amount_yen:0,included:true},{id,amount_yen:150000,included:false}])assert.equal(designatedContractAssumption(row),'');
 const text=designatedContractAssumption({id,amount_yen:150000,included:true});
 assert.match(text,/指定の買電・売電契約を満たすと仮定/);
 assert.match(text,/実際の単価差・費用差は反映していません/);
 assert.match(text,/FIT単価の両立を公式確認したものではありません/);
 assert.doesNotMatch(text,/15万円|2万円/);
 assert.equal(nonInclusionReason({id,amount_yen:null}),nonInclusionReason({calculation_status:'candidate_unresolved_amount'}));
});

test('愛知の本人所有仮定は内部承認表現を除き未確認の事実を維持する',()=>{
 const row=standard('23211').included_programs.find(p=>p.government_level==='municipality');
 const text=row.calculation_assumptions.map(readableSubsidyAssumption).join(' ');
 assert.doesNotMatch(text,/ユーザー承認/);assert.match(text,/本人所有と仮定/);assert.match(text,/確認済み事実ではない/);
});

test('岡崎non_fit_packageは住宅工事ではなくFIT不適合を理由に非算入する',()=>{
 const r=standard('23202');assert.equal(r.municipality_amount_yen,approved.find(p=>p.municipality_code==='23202').expected_amount_yen);
 const row=r.excluded_programs.find(p=>p.id==='aichi-23202-non_fit_package-2026');
 assert.equal(row.reason_code,'sale_path_not_applicable');
 assert.match(nonInclusionReason(row),/非FIT・非FIPが必須/);
 assert.doesNotMatch(nonInclusionReason(row),/住宅工事/);
});

test('岡崎指定契約仮定は新築既存15万円・一般2万円排他・非FIT35万円除外を保持する',()=>{
 for(const housingAge of ['existing','new']){
 const r=standard('23202',{housingAge});assert.equal(r.municipality_amount_yen,150000);
 const local=r.included_programs.find(p=>p.id==='aichi-23202-local_renewable_battery-2026');assert.equal(local.amount_yen,150000);
 assert.ok(designatedContractAssumption({...local,included:true}));
 assert.ok(!r.included_programs.some(p=>p.id==='aichi-23202-battery-2026'));
 const general=r.excluded_programs.find(p=>p.id==='aichi-23202-battery-2026');assert.equal(general.reason_code,'explicit_combination_prohibition');
 const nonfit=r.excluded_programs.find(p=>p.id==='aichi-23202-non_fit_package-2026');assert.equal(nonfit.reason_code,'sale_path_not_applicable');
 }
});
