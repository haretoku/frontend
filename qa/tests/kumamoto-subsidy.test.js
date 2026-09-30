import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy, diagnosticComponents } from '../../site/simulator/src/diagnostic-subsidy.js';
import { nonInclusionReason, conciseKumamotoAssumption, noncashBenefitDescription } from '../../site/simulator/src/subsidy-presentation.js';
import { applicationStatusLabel } from '../../site/simulator/src/municipal-information.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const programs=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='43'&&p.government_level==='municipality');
const input={prefectureCode:'43',municipalityCode:'43100',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(code,values={})=>diagnosticSubsidy(programs,{...input,municipalityCode:code,...values},true);
const amount=(code,values={})=>evaluate(code,values).municipality_amount_yen;
function reason(result,code,excluded=false){
 const row=(excluded?result.excluded_programs:result.candidate_programs).find(p=>p.reason_code===code);
 assert.ok(row,code);assert.equal(row.amount_yen,null);assert.match(nonInclusionReason(row),/費用|単価|購入費/);return row;
}
test('熊本の標準13自治体はPV単体・B併設の独立期待額と一致する',()=>{
 for(const [code,values] of Object.entries({'43100':[0,80000],'43202':[80000,200000],'43210':[0,0],'43212':[50000,100000],'43215':[100000,200000],'43423':[80000,180000],'43428':[50000,50000],'43443':[0,0],'43447':[80000,80000],'43468':[50000,50000],'43512':[80000,130000],'43514':[132000,132000],'43531':[50000,100000]})){
  for(const [i,equipmentPackage] of ['solar_only','solar_plus_standard_battery'].entries())assert.equal(amount(code,{equipmentPackage}),values[i],code+equipmentPackage);
 }
});
test('熊本市の税抜40万円は税込440000円を含み439999円を未確定にする',()=>{
 assert.equal(amount('43100',{batteryEquipmentCost:440000}),80000);
 const r=evaluate('43100',{batteryEquipmentCost:439999});assert.equal(r.municipality_amount_yen,0);reason(r,'combined_equipment_purchase_cost_unconfirmed');
 const row=evaluate('43100').included_programs[0];assert.equal(applicationStatusLabel(row),'受付開始前');assert.ok(row.calculation_assumptions.some(s=>s.includes('所定の契約・設置・申請期間')));
});
test('南小国の本体単価20万・22万・220001円と税込11万・10万でPVを維持する',()=>{
 for(const [unit,expected,code,excluded] of [[200000,180000],[220000,80000,'equipment_unit_cost_tax_basis_unconfirmed'],[220001,80000,'equipment_unit_cost_above_limit',true]]){
  const r=evaluate('43423',{batteryCapacityKwh:5,batteryEquipmentCost:unit*5});assert.equal(r.municipality_amount_yen,expected);if(code)reason(r,code,excluded);
 }
 for(const [batteryCost,expected] of [[110000,180000],[100000,80000]]){
  const r=evaluate('43423',{batteryCost});assert.equal(r.municipality_amount_yen,expected);if(batteryCost===100000)reason(r,'eligible_cost_tax_basis_unconfirmed');
 }
});
test('山江は税解釈不明の15万円を候補としPVと加算1回を保持する',()=>{
 const r=evaluate('43512',{batteryCost:150000});assert.equal(r.municipality_amount_yen,80000);reason(r,'eligible_cost_tax_basis_unconfirmed');
 assert.equal(amount('43512',{batteryCost:165000}),130000);assert.equal(amount('43512',{equipmentPackage:'solar_only'}),80000);
});
test('菊池の厳密下限と八代の丸め・上天草の合計上限を守る',()=>{
 for(const [capacityKw,expected] of [[5,0],[5.000001,30000],[5.999,30000],[6,50000]])assert.equal(amount('43210',{capacityKw}),expected);
 for(const [capacityKw,expected] of [[3.349,69000],[3.35,71000],[7,120000]])assert.equal(amount('43202',{capacityKw,equipmentPackage:'solar_only'}),expected);
 assert.equal(amount('43212'),100000);assert.equal(amount('43212',{capacityKw:10,equipmentPackage:'solar_only'}),0);
});
test('天草の非現金・期限内利用と益城の未確定候補を保持する',()=>{
 const rows=evaluate('43215').included_programs;assert.ok(rows.some(p=>p.calculation_assumptions.some(s=>s.includes('非現金'))));assert.ok(rows.some(p=>p.calculation_assumptions.some(s=>s.includes('期限'))));
 const r=evaluate('43443');assert.equal(r.municipality_amount_yen,0);assert.ok(r.candidate_programs.length>0);assert.ok(r.candidate_programs.every(p=>p.amount_yen===null));
});

test('熊本の表示要約は期間・税区分・加算回数・非現金条件を保持する',()=>{
 const row=code=>({...evaluate(code).included_programs[0],included:true});
 assert.match(conciseKumamotoAssumption(row('43100')),/2026年11月2日～2027年3月5日/);
 assert.doesNotMatch(conciseKumamotoAssumption(row('43100')),/scheduled|承認済み/);
 assert.match(conciseKumamotoAssumption(row('43423')),/税込・税抜/);
 assert.match(conciseKumamotoAssumption(row('43512')),/1回だけ/);
 assert.match(noncashBenefitDescription(row('43215')),/5か月後の月末/);
});

test('直接の設備別算定も費用ガードを適用し，益城は不明点を具体的に示す',()=>{
 const p=programs.find(p=>p.id==='kumamoto-city-pv-battery-2026-second');
 assert.equal(diagnosticComponents(p,{...input,batteryEquipmentCost:439999}),null);
 assert.ok(diagnosticComponents(p,{...input,batteryEquipmentCost:440000}));
 const m=evaluate('43443').candidate_programs.find(p=>p.id==='mashiki-energy-battery-2026');
 assert.match(nonInclusionReason(m),/蓄電池分だけを申請できるか/);
});
