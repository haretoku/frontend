import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {subsidyGroups,conciseYamaguchiAssumption,nonInclusionReason,noncashBenefitDescription} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'35',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
import {kansaiFormulaComponents} from '../../site/simulator/src/kansai-formula.js';
test('山口19自治体20規則・採用6規則の代表額と排他を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='35').length,19);assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('yamaguchi-')).length,20);
 for(const [code,amount] of [['35201',696000],['35202',300000],['35206',100000],['35216',70000]])assert.equal(standard(code).municipality_amount_yen,amount);
 assert.equal(standard('35201',{housingAge:'new'}).municipality_amount_yen,696000);
 assert.equal(standard('35202',{equipmentPackage:'solar_only'}).municipality_amount_yen,100000);
 assert.equal(standard('35202',{systemCapacityKw:2.999}).municipality_amount_yen,300000);
 assert.equal(standard('35201').included_programs.length,1);
});
test('下関新築は地区・契約・新築適用仮定を保持し旧候補を残さない',()=>{
 const b=standard('35201',{housingAge:'new'});assert.equal(b.municipality_amount_yen,696000);const row=b.included_programs.find(p=>p.id==='yamaguchi-35201-leading_battery-2026');assert.ok(row);assert.match(conciseYamaguchiAssumption({...row,included:true}),/新築にも適用できると仮定.*公式資料に新築が個別に明記されたものではありません/);
 assert.ok(!data.diagnostic_subsidy_programs.some(p=>p.id==='yamaguchi-35201-leading_battery_new_unconfirmed-2026'));assert.equal(b.included_programs.length,1);
 const pv=standard('35201').excluded_programs.find(p=>p.id==='yamaguchi-35201-leading_pv_nonfit-2026');assert.match(nonInclusionReason(pv),/非FIT/);
});
test('宇部2.999kWは既存B改修30万円・新築0円，PV除外と再エネ排他を保持する',()=>{
 for(const capacity of [2.5,2.999,3,4]){
 const b=standard('35202',{systemCapacityKw:capacity});assert.equal(b.municipality_amount_yen,300000);assert.equal(b.included_programs.filter(p=>p.government_level==='municipality').length,1);
 if(capacity<3){const row=b.included_programs.find(p=>p.id==='yamaguchi-35202-health_reform-2026');assert.ok(row);assert.match(conciseYamaguchiAssumption({...row,included:true}),/類似の省エネ改修.*認定済み.*居住誘導区域内の空き家.*購入.*改修・転居/);assert.equal(standard('35202',{systemCapacityKw:capacity,housingAge:'new'}).municipality_amount_yen,0);}
 const pv=b.excluded_programs.find(p=>p.id==='yamaguchi-35202-health_reform_pv_excluded-2026');assert.match(nonInclusionReason(pv),/太陽光発電設備が明示的に対象外/);
 }
});
test('防府商品券・宇部注文住宅・合算給付の表現を保持する',()=>{
 const h=standard('35206').included_programs[0];assert.match(noncashBenefitDescription(h),/商品券.*100％.*現金の給付ではありません/);
 assert.match(conciseYamaguchiAssumption({...h,included:true}),/対象工事全体の商品券額/);
 const u=standard('35202',{housingAge:'new'}).included_programs[0];assert.match(conciseYamaguchiAssumption({...u,included:true}),/注文住宅.*建売住宅は原則対象外.*設備全体への給付額/);
 assert.equal(standard('35206',{housingAge:'new'}).municipality_amount_yen,0);
});
test('山陽小野田の税抜費用率適用後1万円切捨て境界を保持する',()=>{
 const p=data.diagnostic_subsidy_programs.find(p=>p.id==='yamaguchi-35216-reform-2026');
 for(const [cost,expected] of [[109999,0],[110000,10000],[219999,10000],[220000,20000],[769999,60000],[770000,70000]]){const r=kansaiFormulaComponents(p,{housingAge:'existing',equipmentPackage:'solar_only',capacityKw:4,batteryCapacityKwh:0,solarCost:cost,batteryCost:0,batteryEquipmentCost:0});assert.equal(r?.components.solar ?? 0,expected,String(cost));}
 assert.match(conciseYamaguchiAssumption({...p,included:true}),/1万円未満.*対象工事全体/);
});
