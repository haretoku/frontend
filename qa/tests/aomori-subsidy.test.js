import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy } from '../../site/simulator/src/diagnostic-subsidy.js';
import { conciseAomoriAssumption, nonInclusionReason } from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const programs=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='02');
const input={prefectureCode:'02',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(municipalityCode,values={})=>diagnosticSubsidy(programs,{...input,municipalityCode,...values},true);
test('深浦は既存住宅のPV費用だけを対象に最低額・千円端数・上限を適用する',()=>{
 for(const [solarCost,amount] of [[499999,0],[500000,50000],[509999,50000],[510000,51000],[2500000,200000]])assert.equal(evaluate('02323',{solarCost}).municipality_amount_yen,amount);
 assert.equal(evaluate('02323',{housingAge:'new'}).municipality_amount_yen,0);
 assert.equal(evaluate('02323',{equipmentPackage:'solar_only'}).municipality_amount_yen,132000);
 const row=evaluate('02323').included_programs.find(p=>p.id==='fukaura-reform-pv-2026');
 const note=conciseAomoriAssumption({...row,included:true});
 assert.match(note,/2026年4月1日～10月30日/);assert.match(note,/20日以内又は2027年3月25日の早い方/);assert.match(note,/若者等向けの別枠は加算していません/);
});
test('六ヶ所Bは容量・費用の境界を処理し，税込仮定と申請・報告期限を区別する',()=>{
 for(const housingAge of ['existing','new'])assert.equal(evaluate('02411',{housingAge}).municipality_amount_yen,114000);
 assert.equal(evaluate('02411',{batteryCapacityKwh:0.999}).municipality_amount_yen,0);
 assert.equal(evaluate('02411',{batteryCapacityKwh:1,batteryCost:1500000}).municipality_amount_yen,150000);
 assert.equal(evaluate('02411',{batteryCost:2000000}).municipality_amount_yen,150000);
 assert.equal(evaluate('02411',{equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 const row=evaluate('02411').included_programs.find(p=>p.id==='rokkasho-new-energy-battery-2026');
 const note=conciseAomoriAssumption({...row,included:true});
 for(const re of [/税区分は公式資料で未確認/,/税込費用と仮定/,/定格出力500W/,/2027年3月15日/,/工事完了は2027年3月31日/,/30日又は年度末の早い方/])assert.match(note,re);
});
test('青森の候補8件と未確認3自治体を残し，実装待ちと解釈未確認を区別する',()=>{
 let count=0;
 for(const code of ['02207','02304','02323','02411','02424','02443'])for(const row of evaluate(code).candidate_programs){assert.equal(row.amount_yen,null);count++;}
 assert.equal(count,8);
 for(const code of ['02210','02412','02425'])assert.equal(data.municipalities.find(m=>m.municipality_code===code).program_status,'unconfirmed');
 const misawa=evaluate('02207').candidate_programs.find(p=>p.id==='misawa-reform-decarbonization-2026');assert.match(nonInclusionReason(misawa),/診断がまだ対応していない/);
 const young=evaluate('02323').candidate_programs.find(p=>p.id==='fukaura-young-reform-pv-2026');assert.match(nonInclusionReason(young),/限度額の解釈と端数処理/);
});
