import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {readableSubsidyAssumption,nonInclusionReason,noncashBenefitDescription} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={},source=data)=>calculateEstimate({prefectureCode:'20',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},source).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
const pref='nagano-roof-solar-battery-unresolved-2026';
test('長野77自治体69制度・方針適用後の未確定0非採用11を保持する',()=>{
  assert.equal(data.municipalities.filter(m=>m.prefecture_code==='20').length,77);
  const p=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='20'&&p.government_level==='municipality');
  assert.equal(p.length,69);
  assert.equal(p.filter(p=>p.machine_rule==='kansai_municipal_unresolved').length,0);
  assert.equal(p.filter(p=>p.machine_rule==='kansai_municipal_non_adopted').length,11);
  for(const item of p.filter(p=>p.machine_rule!=='kansai_municipal_formula')) assert.ok(!standard(item.municipality_code).included_programs.some(p=>p.id===item.id),item.id);
});
test('長野上乗せ3自治体は県正額採用を必要とし富士見PV単独は非算入',()=>{
  const missing=structuredClone(data);missing.diagnostic_subsidy_programs=missing.diagnostic_subsidy_programs.filter(p=>p.id!==pref);
  for(const code of ['20214','20362','20363']) {
    const r=standard(code); assert.equal(r.municipality_amount_yen,100000);assert.equal(r.prefecture_amount_yen,200000);
    const absent=standard(code,{},missing);assert.equal(absent.municipality_amount_yen,0);
    assert.ok(absent.excluded_programs.some(p=>p.reason_code==='dependent_program_unavailable'&&p.unavailable_required_program_ids.includes(pref)));
  }
  const solar=standard('20362',{equipmentPackage:'solar_only'});assert.equal(solar.municipality_amount_yen,0);assert.equal(solar.prefecture_amount_yen,0);
  const row=solar.excluded_programs.find(p=>p.reason_code==='dependent_program_unavailable');assert.match(nonInclusionReason(row),/正額採用されていない/);assert.doesNotMatch(nonInclusionReason(row),/公募が終了/);
});
test('長野依存制度が同じ組合せにあっても配分0円なら上乗せしない',()=>{
  const mk=(id,scope,amount,level)=>({id,government_level:level,prefecture_code:'20',municipality_code:'20362',program_name:id,machine_rule:'kansai_municipal_formula',housing_ages:['existing'],equipment_packages:['solar_plus_standard_battery'],application_status:'accepting',diagnostic_scope:{in_scope_housing_ages:['existing']},conflict_program_ids:[],official_urls:['https://example.jp/'],source_ids:[],required_confirmations:[],calculation_assumptions:[],formula_components:[{scope,equipment_packages:['solar_plus_standard_battery'],formula_type:'fixed',fixed_amount_yen:amount,rounding_unit_yen:1}]});
  const p=mk('pref','solar',1,'prefecture'),c={...mk('city','battery',100,'municipality'),required_program_ids:['pref']};
  const input={prefectureCode:'20',municipalityCode:'20362',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:0,batteryCost:1000,batteryEquipmentCost:1000};
  const r=diagnosticSubsidy([p,c],input,true);assert.equal(r.municipality_amount_yen,0);assert.equal(r.excluded_programs.find(p=>p.id==='city').reason_code,'dependent_program_unavailable');
  assert.equal(diagnosticSubsidy([p,c],{...input,solarCost:1},true).municipality_amount_yen,100);
});
test('長野住宅別枝・10kWh境界・控除前費用・排他・非現金を保持する',()=>{
  for(const code of ['20217','20220']) {assert.equal(standard(code).municipality_amount_yen,220000);assert.equal(standard(code,{housingAge:'new'}).municipality_amount_yen,140000);}
  assert.equal(standard('20425').municipality_amount_yen,100000);assert.equal(standard('20425',{batteryCapacityKwh:10}).municipality_amount_yen,0);
  const i=standard('20205');assert.equal(i.municipality_amount_yen,866000);assert.equal(i.prefecture_amount_yen,200000);
  for(const code of ['20206','20207','20429']) {const r=standard(code);assert.equal(r.municipality_amount_yen,0);assert.equal(r.prefecture_amount_yen,200000);assert.ok(r.excluded_programs.some(p=>p.government_level==='municipality'&&p.reason_code==='explicit_combination_prohibition'));}
  const k=standard('20210').included_programs.find(p=>p.government_level==='municipality');assert.equal(k.amount_yen,50000);assert.match(noncashBenefitDescription(k),/現金の給付ではありません/);
});

test('富士見の県制度注記は内部承認表現を表示せず容量種別未確認と申請時確認を保つ',()=>{
 const row=standard('20362').included_programs.find(p=>p.id===pref);
 const source=row.calculation_assumptions.find(text=>text.includes('入力蓄電池容量'));
 const rendered=readableSubsidyAssumption(source);
 assert.match(rendered,/入力した蓄電池容量を制度の対象容量とみなす仮定で4kWh以上を判定する/);
 assert.doesNotMatch(rendered,/ユーザー承認/);
 assert.match(rendered,/公式資料の容量種別が確認済みとは扱わない/);
 assert.match(row.required_confirmations.map(readableSubsidyAssumption).join(' '),/申請時/);
 assert.ok(source.includes('ユーザー承認済み仮定'));
});

test('駒ヶ根の非現金説明と要確認事項は利用者向け表現と5万円相当・条件を保持する',()=>{
 const row=standard('20210').included_programs.find(p=>p.government_level==='municipality');
 assert.equal(row.amount_yen,50000);
 const source=row.required_confirmations.join(' ');
 assert.match(source,/公式の円相当額を経済便益として扱う承認済み方針/);
 const confirmations=row.required_confirmations.map(readableSubsidyAssumption).join(' ');
 for(const text of [noncashBenefitDescription(row),confirmations]){
  assert.doesNotMatch(text,/承認済み方針|現金給付とは表示しない/);
  assert.match(text,/ポイントの公式円相当額を経済便益に含めています．現金の給付ではありません．/);
 }
 assert.match(confirmations,/予定数到達/);
 assert.match(confirmations,/地区，施工者，税滞納，年齢又は世帯属性/);
 assert.match(confirmations,/申請時確認事項/);
 assert.equal(row.required_confirmations.join(' '),source);
});
