import { compensatedSum, roundAnnualGenerationKwh } from '../../site/simulator/src/calculator.js';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy, diagnosticComponents } from '../../site/simulator/src/diagnostic-subsidy.js';
import { nonInclusionReason, conciseMieAssumption } from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const programs=data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('mie-'));
const input={prefectureCode:'24',municipalityCode:'24202',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(code,values={})=>diagnosticSubsidy(programs,{...input,municipalityCode:code,...values},true);
const amount=(code,values={})=>evaluate(code,values).municipality_amount_yen;
test('三重の標準6自治体は設備別の独立期待額と一致する',()=>{
 for(const [code,amounts] of Object.entries({'24201':[0,0],'24202':[0,170000],'24204':[0,60000],'24303':[80000,80000],'24441':[200000,300000],'24461':[60000,110000]}))
 for(const [i,equipmentPackage] of ['solar_only','solar_plus_standard_battery'].entries())assert.equal(amount(code,{equipmentPackage}),amounts[i],code+equipmentPackage);
});
test('四日市の77000/76999円・110000/109999円は定額を減額せず独立Bを残す',()=>{
 assert.equal(amount('24202',{solarCost:77000,batteryCost:110000}),170000);
 const r=evaluate('24202',{solarCost:76999,batteryCost:110000});assert.equal(r.municipality_amount_yen,100000);
 const candidate=r.candidate_programs.find(p=>p.reason_code==='eligible_cost_tax_basis_unconfirmed');assert.ok(candidate);assert.equal(candidate.amount_yen,null);assert.match(nonInclusionReason(candidate),/税込・税抜/);
 for(const batteryCost of [100000,109999]){const r=evaluate('24202',{solarCost:2000000,batteryCost});assert.equal(r.municipality_amount_yen,0);assert.equal(r.candidate_programs.filter(p=>p.id.startsWith('mie-yokkaichi-smart-')).length,2);}
 const p=programs.find(p=>p.id==='mie-yokkaichi-smart-pv-2026');
 assert.equal(diagnosticComponents(p,{...input,solarCost:76999,batteryCost:110000}),null);
 assert.equal(diagnosticComponents(p,{...input,solarCost:undefined,batteryCost:110000}),null);
 assert.ok(diagnosticComponents(p,{...input,solarCost:77000,batteryCost:110000}));
});
test('津のPV/B5kW条件と四日市の独立Bを維持する',()=>{
 for(const [capacityKw,expected] of [[4.999,0],[5,120000],[9.999,120000],[10,0]])assert.equal(amount('24201',{capacityKw}),expected);
 assert.equal(amount('24201',{capacityKw:5,equipmentPackage:'solar_only'}),60000);
 for(const [capacityKw,expected] of [[0.999,100000],[1,170000],[9.999,170000],[10,100000]])assert.equal(amount('24202',{capacityKw}),expected);
 assert.equal(amount('24202',{equipmentPackage:'solar_only'}),0);
});
test('木曽岬と多気の丸め順・上限及び玉城の独立Bを維持する',()=>{
 for(const [capacityKw,expected] of [[0.999,0],[1,20000],[1.044,20000],[1.045,21000],[5,100000],[9.999,100000],[10,0]])assert.equal(amount('24303',{capacityKw,equipmentPackage:'solar_only'}),expected);
 for(const [capacityKw,expected] of [[1.014,50000],[1.015,51000],[6,300000],[6.005,300000],[10,300000]])assert.equal(amount('24441',{capacityKw,equipmentPackage:'solar_only'}),expected);
 assert.equal(amount('24441',{capacityKw:10}),400000);assert.equal(amount('24461',{capacityKw:10}),50000);assert.equal(amount('24461',{capacityKw:9.999}),110000);
});
test('三重の製品・PCS・申請順序・予算注意・入会条件を要約へ残す',()=>{
 const note=(code,values={})=>evaluate(code,values).included_programs.map(p=>conciseMieAssumption({...p,included:true})).join(' ');
 assert.match(note('24201',{capacityKw:5}),/小さい方の出力/);assert.match(note('24201',{capacityKw:5}),/着工10日前/);assert.match(note('24201',{capacityKw:5}),/着工予定日が申請日から3か月以内/);assert.doesNotMatch(note('24201',{capacityKw:5}),/交付決定後3か月/);assert.match(note('24201',{capacityKw:5}),/予算残額わずか/);
 for(const p of evaluate('24441').included_programs)assert.match(conciseMieAssumption({...p,included:true}),/SHARP製/);
 assert.match(note('24204'),/Jクレジット/);assert.match(note('24204'),/90日以内/);
});
test('御浜候補と未発見自治体は補助不存在へ変換しない',()=>{
 const p=evaluate('24561').candidate_programs.find(p=>p.id==='mie-mihama-evidence-gap-2026');assert.ok(p);assert.equal(p.amount_yen,null);
 for(const code of ['24210','24442']){const m=data.municipalities.find(m=>m.municipality_code===code);assert.ok(m);assert.notEqual(m.program_status,'no_program');}
 for(const code of ['24203','24205','24207','24214','24341','24561'])assert.equal(amount(code),0);
});

test('8760時間の補償和は津5kW・年2のPython3.12丸め境界と一致する',()=>{
 function profiles(x){if(x&&typeof x==='object'){if(x.orientation_profiles)return x.orientation_profiles;for(const v of Object.values(x)){const r=profiles(v);if(r)return r;}}}
 const raw=profiles(data).find(p=>p.orientation==='south').standard_year_hourly_annual_shares;
 const total=compensatedSum(raw);assert.equal(total,0.999999999959);
 const first=compensatedSum(raw.map(v=>5*1224.5239*(v/total)));
 assert.equal(first,6122.6195);assert.equal(roundAnnualGenerationKwh(first*0.997),6104.251642);
 assert.equal(compensatedSum([1e16,1,-1e16]),1);
});
