import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {conciseYamagataAssumption,nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const input={prefectureCode:'06',municipalityCode:'06321',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(extra={})=>diagnosticSubsidy(data.diagnostic_subsidy_programs,{...input,...extra},true);
test('河北は単独16万円・併設31万円，3.5kW+B4.5kWhは27.5万円',()=>{
 for(const housingAge of ['new','existing']){
 assert.equal(evaluate({housingAge,equipmentPackage:'solar_only'}).municipality_amount_yen,160000);
 assert.equal(evaluate({housingAge}).municipality_amount_yen,310000);
 assert.equal(evaluate({housingAge,capacityKw:3.5,batteryCapacityKwh:4.5}).municipality_amount_yen,275000);
 }
});
test('河北は容量額丸め後に費用上限を適用し，国補助排他と内訳仮定を保持',()=>{
 const r=evaluate({solarCost:150500,batteryCost:140500,batteryEquipmentCost:140500});
 const row=r.included_programs.find(p=>p.id==='yamagata-kahoku-energy');
 assert.deepEqual(row.component_amounts_yen,{solar:150500,battery:140500});
 const rule=data.diagnostic_subsidy_programs.find(p=>p.id===row.id);
 assert.equal(rule.conflict_program_ids.length,3); assert.ok(rule.conflict_program_ids.every(id=>id.startsWith('national-')));
 assert.ok(evaluate().included_programs.every(p=>p.government_level!=='national'));
 const note=conciseYamagataAssumption({...row,included:true});assert.match(note,/交付決定後に着工/);assert.match(note,/3月15日/);assert.match(note,/内訳不明.*折半/);assert.match(note,/国の設備補助とは併用しません/);
});

test('山形追加は中山住宅屋根の新既築上限，東根併設，寒河江B固定額を区別',()=>{
 for(const [housingAge,amount]of [['new',60000],['existing',120000]]){
 const r=evaluate({municipalityCode:'06302',housingAge,capacityKw:6,equipmentPackage:'solar_only'});assert.equal(r.municipality_amount_yen,amount);
 assert.match(conciseYamagataAssumption({...r.included_programs.find(p=>p.id==='yamagata-nakayama-solar'),included:true}),/住宅の屋根.*増築部分/);
 }
 assert.equal(evaluate({municipalityCode:'06211',equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 assert.equal(evaluate({municipalityCode:'06211'}).municipality_amount_yen,220000);
 const r=evaluate({municipalityCode:'06206'});assert.equal(r.municipality_amount_yen,250000);assert.deepEqual(r.included_programs.find(p=>p.id==='yamagata-sagae-energy').component_amounts_yen,{battery:250000});
});
test('山形追加の終了・非FIT・PPA・受付未知候補は異なる理由を保つ',()=>{
 for(const [code,id,pattern]of [['06201','yamagata-yamagata-nonfit-closed',/受付が終了/],['06362','yamagata-mogami-nonfit',/非FIT/],['06202','yamagata-yonezawa-ppa',/PPA/],['06213','yamagata-nanyo-solar-candidate',/受付状況を確認できていません/]]){
 const r=evaluate({municipalityCode:code});const row=[...r.excluded_programs,...r.candidate_programs].find(p=>p.id===id);assert.equal(row.amount_yen,null);assert.match(nonInclusionReason(row),pattern);if(code==='06213')assert.equal(row.application_status,'unknown');
 }
});

test('山形残枝は川西合算上限，三川単価，高畠の費用率上限を維持',()=>{
 assert.equal(evaluate({municipalityCode:'06382',equipmentPackage:'solar_only'}).municipality_amount_yen,80000);
 assert.equal(evaluate({municipalityCode:'06382'}).municipality_amount_yen,160000);
 assert.equal(evaluate({municipalityCode:'06382',solarCost:550000,batteryCost:1100000,batteryEquipmentCost:1000000}).municipality_amount_yen,150000);
 assert.equal(evaluate({municipalityCode:'06426',capacityKw:3}).municipality_amount_yen,45000);
 assert.equal(evaluate({municipalityCode:'06426',capacityKw:4}).municipality_amount_yen,60000);
 assert.equal(evaluate({municipalityCode:'06381',capacityKw:3}).municipality_amount_yen,90000);
 assert.equal(evaluate({municipalityCode:'06381',capacityKw:4}).municipality_amount_yen,100000);
 assert.equal(evaluate({municipalityCode:'06381',solarCost:550000}).municipality_amount_yen,50000);
});
test('飯豊はPV非FITとB終了，庄内非FIT，遊佐は公式額相違による未確定を区別',()=>{
 for(const [code,id,pattern,status]of [['06403','yamagata-iide-solar',/非FIT/,'accepting'],['06403','yamagata-iide-battery',/受付が終了/,'closed'],['06428','yamagata-shonai-zero',/非FIT/,'accepting'],['06461','yamagata-yuza-energy',/公式資料.*相違/,'accepting']]){
 const r=evaluate({municipalityCode:code});const row=[...r.excluded_programs,...r.candidate_programs].find(p=>p.id===id);assert.equal(row.amount_yen,null);assert.equal(row.application_status,status);assert.match(nonInclusionReason(row),pattern);
 }
});

test('白鷹PV上限とB容量未確認・非FIT・既設専用を分離する',()=>{
 assert.equal(evaluate({municipalityCode:'06402',capacityKw:3.5}).municipality_amount_yen,87000);
 const r=evaluate({municipalityCode:'06402'});assert.equal(r.municipality_amount_yen,100000);
 for(const [id,pattern]of [['yamagata-shirataka-battery-fit',/初期実効容量.*定格容量/],['yamagata-shirataka-battery-nonfit',/非FIT/],['yamagata-shirataka-battery-existing',/既設/]]){
 const row=[...r.excluded_programs,...r.candidate_programs].find(p=>p.id===id);assert.equal(row.amount_yen,null);assert.equal(row.application_status,'accepting');assert.match(nonInclusionReason(row),pattern);
 }
});
test('戸沢は設備合算の10％・共通20万円で各設備への二重上限適用をしない',()=>{
 assert.equal(evaluate({municipalityCode:'06367',equipmentPackage:'solar_only'}).municipality_amount_yen,132000);
 const r=evaluate({municipalityCode:'06367'});assert.equal(r.municipality_amount_yen,200000);
 assert.equal(evaluate({municipalityCode:'06367',solarCost:550000,batteryCost:550000}).municipality_amount_yen,110000);
 assert.match(conciseYamagataAssumption({...r.included_programs.find(p=>p.id==='yamagata-tozawa-renewable'),included:true}),/合算費用に共通上限20万円/);
});
