import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {conciseFukushimaAssumption,nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const input={prefectureCode:'07',municipalityCode:'07201',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(extra={})=>diagnosticSubsidy(data.diagnostic_subsidy_programs,{...input,...extra},true);
test('福島市PVは税抜費以内の5万円，併設Bは容量基準未確認の候補',()=>{
 for(const housingAge of ['new','existing']){
 assert.equal(evaluate({housingAge,equipmentPackage:'solar_only'}).municipality_amount_yen,50000);
 const r=evaluate({housingAge});assert.equal(r.municipality_amount_yen,50000);
 const b=r.candidate_programs.find(p=>p.id==='fukushima-fukushima-battery');assert.equal(b.amount_yen,null);assert.equal(b.application_status,'accepting');assert.match(nonInclusionReason(b),/定格容量.*初期実効容量/);
 }
 assert.equal(diagnosticSubsidy(data.diagnostic_subsidy_programs.filter(p=>p.id==='fukushima-fukushima-solar'),{...input,solarCost:44000},true).municipality_amount_yen,40000);
});
test('会津若松市PV単独0，同時設置PV4万とB未確定を区別する',()=>{
 const alone=evaluate({municipalityCode:'07202',equipmentPackage:'solar_only'});assert.equal(alone.municipality_amount_yen,0);
 assert.match(nonInclusionReason(alone.excluded_programs.find(p=>p.id==='fukushima-aizuwakamatsu-solar')),/太陽光単独では申請できず/);
 const r=evaluate({municipalityCode:'07202'});assert.equal(r.municipality_amount_yen,40000);
 assert.equal(evaluate({municipalityCode:'07202',capacityKw:3.555}).municipality_amount_yen,35500);
 const b=r.candidate_programs.find(p=>p.id==='fukushima-aizuwakamatsu-battery');assert.equal(b.amount_yen,null);assert.equal(b.application_status,'accepting');assert.match(nonInclusionReason(b),/容量/);
 assert.match(conciseFukushimaAssumption({...r.included_programs.find(p=>p.id==='fukushima-aizuwakamatsu-solar'),included:true}),/太陽光分だけ.*上限4万円/);
});

test('郡山セット13万円とB単体10万円は排他比較で23万円にしない',()=>{
 const r=evaluate({municipalityCode:'07203'});assert.equal(r.municipality_amount_yen,130000);
 assert.equal(r.included_programs.filter(p=>p.id.startsWith('fukushima-koriyama-')).length,1);
 const note=conciseFukushimaAssumption({...r.included_programs.find(p=>p.id==='fukushima-koriyama-set'),included:true});assert.match(note,/23万円には加算しません/);assert.doesNotMatch(note,/市の蓄電池分は含めていません/);
 assert.equal(evaluate({municipalityCode:'07203',equipmentPackage:'solar_only'}).municipality_amount_yen,0);
});
test('いわき・須賀川の容量丸めと，相馬候補・別工事必須を区別',()=>{
 assert.equal(evaluate({municipalityCode:'07204',capacityKw:3.315}).municipality_amount_yen,33000);
 assert.equal(evaluate({municipalityCode:'07204',capacityKw:3.995}).municipality_amount_yen,40000);
 assert.equal(evaluate({municipalityCode:'07207',capacityKw:3.45}).municipality_amount_yen,52500);
 assert.equal(evaluate({municipalityCode:'07207',capacityKw:4}).municipality_amount_yen,60000);
 for(const [code,id,pattern,kind]of [['07204','fukushima-iwaki-battery',/定格容量.*初期実効容量/,'candidate_programs'],['07207','fukushima-sukagawa-battery',/定格容量.*初期実効容量/,'candidate_programs'],['07209','fukushima-soma-solar',/費用.*未確認/,'candidate_programs'],['07204','fukushima-iwaki-reform',/別の住宅工事が必須/,'excluded_programs']]){
 const row=evaluate({municipalityCode:code})[kind].find(p=>p.id===id);assert.equal(row.amount_yen,null);assert.equal(row.application_status,'accepting');assert.match(nonInclusionReason(row),pattern);
 }
});

test('玉川の切捨てと10kW未満，古殿の四捨五入と10kW時算入を区別',()=>{
 assert.equal(evaluate({municipalityCode:'07502',capacityKw:3.999}).municipality_amount_yen,59000);
 assert.equal(evaluate({municipalityCode:'07502',capacityKw:4}).municipality_amount_yen,60000);
 assert.equal(evaluate({municipalityCode:'07502',capacityKw:10}).municipality_amount_yen,0);
 assert.equal(evaluate({municipalityCode:'07505',capacityKw:3.995}).municipality_amount_yen,160000);
 assert.equal(evaluate({municipalityCode:'07505',capacityKw:10}).municipality_amount_yen,160000);
});
test('石川の予算終了と平田・浅川・B3枝の未確定を区別',()=>{
 for(const [code,id,pattern,status,kind]of [['07501','fukushima-ishikawa-solar',/6月3日.*受付が終了/,'closed','excluded_programs'],['07501','fukushima-ishikawa-battery',/6月3日.*受付が終了/,'closed','excluded_programs'],['07503','fukushima-hirata-solar',/四捨五入.*切捨て/,'accepting','candidate_programs'],['07504','fukushima-asakawa-solar',/要綱.*対象設備/,'accepting','candidate_programs'],['07504','fukushima-asakawa-battery',/容量の定義も未確認/,'accepting','candidate_programs'],['07502','fukushima-tamakawa-battery',/定格容量の対応/,'accepting','candidate_programs'],['07505','fukushima-furudono-battery',/公称最大蓄電容量/,'accepting','candidate_programs']]){
 const row=evaluate({municipalityCode:code})[kind].find(p=>p.id===id);assert.equal(row.amount_yen,null);assert.equal(row.application_status,status);assert.match(nonInclusionReason(row),pattern);
 }
});

test('猪苗代と西会津の丸め・上限を維持し西会津Bは新規FIT対象外',()=>{
 assert.equal(evaluate({municipalityCode:'07408',capacityKw:3.995}).municipality_amount_yen,60000);
 assert.equal(evaluate({municipalityCode:'07408',capacityKw:10}).municipality_amount_yen,60000);
 assert.equal(evaluate({municipalityCode:'07405',capacityKw:3.999}).municipality_amount_yen,119000);
 assert.equal(evaluate({municipalityCode:'07405',capacityKw:10}).municipality_amount_yen,120000);
 const r=evaluate({municipalityCode:'07405'});const b=r.excluded_programs.find(p=>p.id==='fukushima-nishiaizu-battery');assert.ok(b);assert.equal(b.amount_yen,null);assert.equal(b.application_status,'accepting');assert.equal(b.reason_code,'fit_incompatible');assert.match(nonInclusionReason(b),/新たにFIT売電.*対象外/);assert.ok(!r.candidate_programs.some(p=>p.id===b.id));
 const note=conciseFukushimaAssumption({...r.included_programs.find(p=>p.id==='fukushima-nishiaizu-solar'),included:true});assert.match(note,/新規FIT.*対象外/);assert.doesNotMatch(note,/容量の対応が未確認/);
});


test('湯川と富岡の容量丸め・上限・10kW境界を区別する',()=>{
 for(const housingAge of ['new','existing'])for(const equipmentPackage of ['solar_only','solar_plus_standard_battery']){
 for(const [municipalityCode,expected]of [['07422',[79000,96000,120000,0]],['07543',[132000,160000,160000,0]]]){
 [3.315,4,9.995,10].forEach((capacityKw,i)=>assert.equal(evaluate({municipalityCode,housingAge,equipmentPackage,capacityKw}).municipality_amount_yen,expected[i]));
 }
 }
});
test('追加4枝の新規FIT対象外と12枝の未確定候補を区別する',()=>{
 const candidates={'07423':['yanaizu-solar'],'07444':['mishima-solar'],'07447':['aizumisato-solar','aizumisato-battery'],'07544':['kawauchi-solar','kawauchi-battery'],'07541':['hirono-solar-fit'],'07546':['futaba-solar','futaba-battery'],'07547':['namie-solar','namie-battery'],'07545':['okuma-battery']};
 for(const [municipalityCode,ids]of Object.entries(candidates))for(const id of ids){const r=evaluate({municipalityCode});const row=r.candidate_programs.find(p=>p.id==='fukushima-'+id);assert.ok(row,id);assert.equal(row.amount_yen,null);assert.equal(row.application_status,'accepting');assert.match(nonInclusionReason(row),/未確定/);assert.doesNotMatch(nonInclusionReason(row),/未採用draft/);}
 for(const [municipalityCode,id]of [['07541','hirono-solar-nonfit'],['07541','hirono-battery'],['07543','tomioka-battery'],['07545','okuma-solar-nonfit']]){const r=evaluate({municipalityCode});const row=r.excluded_programs.find(p=>p.id==='fukushima-'+id);assert.ok(row,id);assert.equal(row.reason_code,'fit_incompatible');assert.equal(row.amount_yen,null);assert.equal(row.application_status,'accepting');assert.match(nonInclusionReason(row),/新たにFIT売電.*対象外/);assert.ok(!r.candidate_programs.some(p=>p.id===row.id));}
 const r=evaluate({municipalityCode:'07543'});assert.doesNotMatch(conciseFukushimaAssumption({...r.included_programs.find(p=>p.id==='fukushima-tomioka-solar'),included:true}),/容量の対応が未確認/);
});


test('葛尾はPV/Bを独立算定しPV10kWでもBを維持，泉崎は10kW条件を追加しない',()=>{
 for(const housingAge of ['new','existing']){
 const r=evaluate({municipalityCode:'07548',housingAge});assert.equal(r.municipality_amount_yen,900000);assert.equal(r.included_programs.find(p=>p.id==='fukushima-katsurao-solar').amount_yen,400000);assert.equal(r.included_programs.find(p=>p.id==='fukushima-katsurao-battery').amount_yen,500000);
 assert.equal(evaluate({municipalityCode:'07548',housingAge,capacityKw:10}).municipality_amount_yen,500000);
 assert.equal(evaluate({municipalityCode:'07548',housingAge,capacityKw:9.995}).municipality_amount_yen,1000000);
 assert.equal(evaluate({municipalityCode:'07548',housingAge,equipmentPackage:'solar_only'}).municipality_amount_yen,400000);
 assert.equal(evaluate({municipalityCode:'07464',housingAge,capacityKw:10}).municipality_amount_yen,120000);
 }
 assert.equal(evaluate({municipalityCode:'07464',capacityKw:3.315}).municipality_amount_yen,99000);
 const p=data.diagnostic_subsidy_programs.filter(p=>p.id==='fukushima-katsurao-battery');assert.equal(diagnosticSubsidy(p,{...input,municipalityCode:'07548',batteryCost:301999},true).municipality_amount_yen,150000);
});
test('矢吹の当年度実施なし・楢葉の旧年度終了・大熊の住宅新築必須を区別する',()=>{
 for(const [municipalityCode,id,pattern]of [['07466','yabuki-solar',/2026年度は実施しない/],['07542','naraha-solar-r7',/2025年度.*終了.*2026年度.*未確認/],['07542','naraha-battery-r7',/2025年度.*終了.*2026年度.*未確認/],['07481','tanagura-solar-r2-closed',/2020年度.*終了/],['07545','okuma-zeh',/ZEH.*新築が必須/]]){const r=evaluate({municipalityCode,housingAge:'new'});const row=r.excluded_programs.find(p=>p.id==='fukushima-'+id);assert.ok(row,id);assert.match(nonInclusionReason(row),pattern);}
 for(const [municipalityCode,id]of [['07522','ono-solar'],['07522','ono-battery'],['07482','yamatsuri-solar'],['07482','yamatsuri-battery'],['07561','shinchi-solar']]){const row=evaluate({municipalityCode}).candidate_programs.find(p=>p.id==='fukushima-'+id);assert.ok(row,id);assert.equal(row.amount_yen,null);assert.match(nonInclusionReason(row),/未確定/);}
 for(const id of ['fukushima-yugawa-solar','fukushima-tomioka-solar']){const p=data.diagnostic_subsidy_programs.find(p=>p.id===id);assert.doesNotMatch(JSON.stringify(p),/未採用draft|適用予定/);}
});


test('下郷の丸めと生入力10kW境界，天栄の正式算入を確認する',()=>{
 for(const housingAge of ['new','existing'])for(const equipmentPackage of ['solar_only','solar_plus_standard_battery'])for(const [capacityKw,amount]of [[3.315,99000],[4,120000],[9.995,120000],[10,0]])assert.equal(evaluate({municipalityCode:'07362',housingAge,equipmentPackage,capacityKw}).municipality_amount_yen,amount);
 for(const [capacityKw,amount]of [[3.3334,99000],[3.3335,100000],[9.9994,120000],[9.9995,0],[10,0]])assert.equal(evaluate({municipalityCode:'07344',capacityKw}).municipality_amount_yen,amount);
 const r=evaluate({municipalityCode:'07344'});assert.ok(r.included_programs.some(p=>p.id==='fukushima-tenei-solar'));assert.ok(!r.candidate_programs.some(p=>p.id==='fukushima-tenei-solar'));
});
test('鏡石の終了と国見・檜枝岐の現年度不明を区別する',()=>{
 for(const id of ['fukushima-kagamiishi-closed-solar','fukushima-kagamiishi-closed-battery']){const row=evaluate({municipalityCode:'07342'}).excluded_programs.find(p=>p.id===id);assert.equal(row.application_status,'closed');assert.match(nonInclusionReason(row),/2022年3月31日/);}
 for(const [municipalityCode,id]of [['07303','fukushima-kunimi-old-solar'],['07364','fukushima-hinoemata-solar']]){const row=evaluate({municipalityCode}).candidate_programs.find(p=>p.id===id);assert.equal(row.application_status,'unknown');assert.equal(row.amount_yen,null);assert.match(nonInclusionReason(row),/確認できていません/);}
});


test('11.42追加PVの丸め・税抜と本宮Bの非FITを独立させる',()=>{
 for(const [municipalityCode,capacityKw,amount]of [['07210',3.999,58000],['07211',3.995,80000],['07301',3.678,110000],['07308',10,200000],['07214',3.999,79000]])assert.equal(evaluate({municipalityCode,capacityKw}).municipality_amount_yen,amount);
 const r=evaluate({municipalityCode:'07214'});assert.equal(r.municipality_amount_yen,80000);const b=r.excluded_programs.find(p=>p.id==='fukushima-motomiya-battery');assert.equal(b.reason_code,'fit_incompatible');assert.equal(b.application_status,'unknown');assert.match(nonInclusionReason(b),/新たにFIT売電.*対象外/);
 assert.equal(diagnosticSubsidy(data.diagnostic_subsidy_programs.filter(p=>p.id==='fukushima-motomiya-solar'),{...input,municipalityCode:'07214',solarCost:44000},true).municipality_amount_yen,40000);
 const shimogo=data.diagnostic_subsidy_programs.find(p=>p.id==='fukushima-shimogo-solar');assert.doesNotMatch(JSON.stringify(shimogo),/11.40に含めず|次出力へ反映/);
});
