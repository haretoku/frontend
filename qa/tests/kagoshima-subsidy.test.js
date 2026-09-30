import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { diagnosticSubsidy, diagnosticComponents } from '../../site/simulator/src/diagnostic-subsidy.js';
import { conciseKagoshimaAssumption } from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const programs=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='46');
const input={prefectureCode:'46',municipalityCode:'46492',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(values={})=>diagnosticSubsidy(programs,{...input,...values},true);
test('肝付のmoduleのみ四捨五入と未丸めPCS比較を集約・直接の両入口で保持する',()=>{
 const pv=programs.find(p=>p.id==='kagoshima-kimotsuki-pv-2026');
 for(const [capacityKw,solar] of [[3.0649,45000],[3.065,45000],[3.0667,46000],[4,60000],[9.999,70000]]){
  assert.equal(evaluate({capacityKw}).municipality_amount_yen,solar+80000);
  assert.equal(diagnosticComponents(pv,{...input,capacityKw}).components.solar,solar);
 }
 assert.equal(evaluate({capacityKw:10}).municipality_amount_yen,80000);
 assert.equal(diagnosticComponents(pv,{...input,capacityKw:10}),null);
 const sendai=programs.find(p=>p.id==='kagoshima-satsumasendai-battery-2026');
 assert.equal(evaluate({municipalityCode:'46215',capacityKw:10}).municipality_amount_yen,0);
 assert.equal(diagnosticComponents(sendai,{...input,municipalityCode:'46215',capacityKw:10}),null);
});
test('奄美の第3期は開始前・予算成立見込み・子育て上限で既存だけ算入する',()=>{
 const result=evaluate({municipalityCode:'46222'});assert.equal(result.municipality_amount_yen,200000);
 const row=result.included_programs.find(p=>p.id==='kagoshima-amami-reform-third-2026');assert.equal(row.application_status,'scheduled');
 assert.equal(evaluate({municipalityCode:'46222',housingAge:'new'}).municipality_amount_yen,0);
 assert.equal(evaluate({municipalityCode:'46222',solarCost:299999}).municipality_amount_yen,0);
 assert.equal(evaluate({municipalityCode:'46222',solarCost:300000}).municipality_amount_yen,60000);
 const note=conciseKagoshimaAssumption({...row,included:true});
 for(const pattern of [/補正予算の成立を見込んだ/,/2026年10月1日/,/18歳未満/,/上限20万円/,/一般世帯は上限10万円/,/新築は対象にしていません/])assert.match(note,pattern);
});
test('鹿児島標準額と原文kWをkWhと読む仮定を保持する',()=>{
 for(const [municipalityCode,amount] of [['46214',100000],['46215',200000],['46392',210000],['46468',350000],['46492',140000]])assert.equal(evaluate({municipalityCode}).municipality_amount_yen,amount);
 for(const municipalityCode of ['46392','46468']){
  const row=evaluate({municipalityCode}).included_programs.find(p=>p.id.includes('-battery-'));
  const note=conciseKagoshimaAssumption({...row,included:true});assert.match(note,/原文「1キロワット以上」/);assert.match(note,/容量1kWh以上と読む仮定/);assert.match(note,/公式訂正/);
 }
});
