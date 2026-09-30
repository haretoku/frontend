import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {nonInclusionReason,conciseMiyagiAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const input={prefectureCode:'04',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(municipalityCode,extra={})=>diagnosticSubsidy(data.diagnostic_subsidy_programs,{...input,municipalityCode,...extra},true);
test('名取は同時設置10万円にB6万円を重複加算せずPV単独は0円',()=>{
 assert.equal(evaluate('04207').municipality_amount_yen,100000);
 assert.equal(evaluate('04207',{equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 const p=evaluate('04207').included_programs.find(p=>p.id==='miyagi-natori-renewable');
 assert.match(conciseMiyagiAssumption({...p,included:true}),/10万円には蓄電池6万円を含み.*別途加算しません/);
});
test('岩沼と大崎は開始前の状態を維持して将来期間仮定で算入',()=>{
 for(const [code,id] of [['04211','miyagi-iwanuma-decarbonization'],['04215','miyagi-osaki-eco']]){
 const p=evaluate(code).included_programs.find(p=>p.id===id);
 assert.ok(p.amount_yen>0);assert.equal(p.application_status,'scheduled');
 assert.match(conciseMiyagiAssumption({...p,included:true}),/受付開始前/);
 }
});
test('角田PVとB費目不明，山元控除未確認，仙台認証住宅の範囲を区別',()=>{
 const k=evaluate('04208');assert.ok(k.included_programs.some(p=>p.id==='miyagi-kakuda-smart-eco-solar'));
 const b=k.candidate_programs.find(p=>p.id==='miyagi-kakuda-smart-eco-battery-unresolved');
 assert.equal(b.amount_yen,null);assert.match(nonInclusionReason(b),/購入費だけか.*設置工事費/);
 const y=evaluate('04362').candidate_programs.find(p=>p.id==='miyagi-yamamoto-natural-energy');
 assert.equal(y.application_status,'scheduled');assert.equal(y.amount_yen,null);
 assert.match(nonInclusionReason(y),/控除する費目や順序.*受付開始予定を理由に除外したものではありません/);
 const s=evaluate('04100',{housingAge:'new'}).excluded_programs.find(p=>p.id==='miyagi-sendai-certified-new-house');
 assert.match(nonInclusionReason(s),/認証された住宅の新築/);
});
