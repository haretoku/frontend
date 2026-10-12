import {loadPublicData, municipalSubsidy, positivePrefectureRule, standardSubsidy} from '../helpers/subsidy-fixture.js';
import test from 'node:test';
import assert from 'node:assert/strict';
const data=loadPublicData();
const standard=(code,equipmentPackage='solar_plus_standard_battery',housingAge='existing')=>standardSubsidy(data,{prefectureCode:'16',municipalityCode:code,equipmentPackage,housingAge,monthlyElectricityBillYen:12000});
test('富山15自治体追加と高岡の県特典排他を確認する',()=>{assert.equal(new Set(data.municipalities.map(m=>m.municipality_code)).size,data.municipalities.length);assert.equal(data.municipalities.filter(m=>m.prefecture_code==='16').length,15);const r=standard('16202');assert.equal(r.municipality_amount_yen,766333);assert.equal(r.prefecture_amount_yen,0);assert.equal(r.total_amount_yen,766333);const p=r.candidate_programs.find(p=>p.id==='toyama-energy-campaign4-noncash-2026');assert.equal(p.reason_code,'source_model_reference_unavailable');assert.equal(p.amount_yen,null);assert.match(r.included_programs.find(p=>p.id==='takaoka-decarbonization-leading-area-battery-2026').required_confirmations.join(' '),/対象地域条件は充足を仮定/);});
test('富山の代表額と住宅・設備分岐を確認する',()=>{for(const[c,n]of [['16210',50000],['16322',247000],['16343',200000]])assert.equal(standard(c).municipality_amount_yen,n,c);assert.equal(standard('16322','solar_only').municipality_amount_yen,100000);assert.equal(standard('16343','solar_plus_standard_battery','new').municipality_amount_yen,0);assert.equal(standard('16202','solar_only').municipality_amount_yen,0);});

test('高岡の県特典排他は正額の合成県制度でも維持する',()=>{
 const id='toyama-energy-campaign4-noncash-2026';
 const result=municipalSubsidy(data,{prefectureCode:'16',municipalityCode:'16202'},[positivePrefectureRule(id,'16',100000)]);
 assert.equal(result.municipality_amount_yen,766333);
 assert.equal(result.excluded_programs.find(p=>p.id===id).reason_code,'explicit_combination_prohibition');
});
