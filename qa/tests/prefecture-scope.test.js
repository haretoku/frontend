import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {prepareSubsidyData} from '../../data/src/scheme-adapter.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {validateLocation} from '../../site/simulator/src/location-input.js';

const data=JSON.parse(readFileSync(new URL('../../data/input/public-data.json',import.meta.url)));
const reference=JSON.parse(gunzipSync(readFileSync(new URL('../fixtures/national-prefecture-reference.json.gz',import.meta.url))));
const inputOf=i=>({prefectureCode:i.prefecture_code,monthlyElectricityBillYen:i.monthly_electricity_bill_yen,
 detailConditions:i.detail_conditions??undefined,systemCapacityKw:i.system_capacity_kw??undefined,
 daytimeOccupancy:i.daytime_occupancy??undefined,equipmentPackage:i.equipment_package??undefined,
 batteryCapacityKwh:i.battery_capacity_kwh??undefined,batteryDegradationScenario:i.battery_degradation_scenario??undefined,
 housingAge:i.housing_age??undefined});
function compare(actual,expected,label){
 if(typeof expected==='number'){assert.ok(Math.abs(actual-expected)<=Math.max(1e-6,Math.abs(expected)*1e-12),`${label}: ${actual} != ${expected}`);return;}
 if(expected===null){assert.equal(actual,null,label);return;}
 if(Array.isArray(expected)){assert.equal(actual.length,expected.length,label);expected.forEach((v,i)=>compare(actual[i],v,label+'.'+i));return;}
 if(typeof expected==='object'){for(const [k,v] of Object.entries(expected))compare(actual[k],v,label+'.'+k);return;}
 assert.equal(actual,expected,label);
}

test('国・47都道府県のみの公開契約であり，市区町村の制度・マスターを持たない',()=>{
 assert.equal(data.prefectures.length,47);
 assert.equal(new Set(data.prefectures.map(p=>p.code)).size,47);
 for(const key of ['municipalities','listing_municipalities','municipal_subsidy_programs','municipality_subsidy_exploration'])assert.equal(Object.hasOwn(data,key),false,key);
 const prepared=prepareSubsidyData(data);
 assert.ok(prepared.diagnostic_subsidy_programs.every(p=>['national','prefecture'].includes(p.government_level)));
 for(const p of data.prefectures){const groups=selectSchemeGroups(prepared,p.code,'13104');assert.ok(groups.flat().every(row=>row.government_level==='national'||row.government_level==='prefecture'&&row.prefecture_code===p.code));}
});

test('旧市区町村入力は無視し，都道府県の結果を復元する',()=>{
 const input={prefectureCode:'13',monthlyElectricityBillYen:null,systemCapacityKw:4,equipmentPackage:'solar_plus_standard_battery'};
 const expected=calculateEstimate(input,data);
 for(const municipalityCode of ['13104','04202','invalid']){
  assert.deepEqual(calculateEstimate({...input,municipalityCode},data),expected);
  assert.equal(validateLocation({...input,municipalityCode},data),null);
 }
});

for(const row of reference.cases)test('独立backend期待値を保持：'+row.id,()=>{
 assert.equal(reference.expected_generated_from_frontend,false);
 const result=calculateEstimate(inputOf(row.input),data);
 for(let i=0;i<row.expected.scenarios.length;i++){
  const expected=row.expected.scenarios[i],actual=result.scenarios[i];
  for(const [key,value] of Object.entries(expected)){
   if(['subsidy_breakdown','subsidy_status','subsidy_source_ids','subsidy_calculation_note'].includes(key))continue;
   compare(actual[key],value,row.id+'.'+key);
  }
  assert.equal(actual.subsidy_yen,actual.subsidy_breakdown.national_amount_yen+actual.subsidy_breakdown.prefecture_amount_yen);
  assert.ok(actual.subsidy_breakdown.included_programs.every(p=>p.government_level!=='municipality'));
 }
});
