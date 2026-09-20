import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {subsidyResearchMessage,nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'21',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('岐阜42自治体20制度と10採用額・多治見設備分岐・白川単位解釈を保持する',()=>{
  assert.equal(data.municipalities.filter(m=>m.prefecture_code==='21').length,42);
  assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='21'&&p.government_level==='municipality').length,20);
  for(const[c,n]of [['21204',178000],['21206',95000],['21208',155000],['21210',190000],['21382',140000],['21403',280000],['21502',180000],['21504',120000],['21505',120000],['21506',200000]]) assert.equal(standard(c).municipality_amount_yen,n,c);
  assert.equal(standard('21204',{equipmentPackage:'solar_only'}).municipality_amount_yen,0);
  assert.equal(standard('21506',{equipmentPackage:'solar_only'}).municipality_amount_yen,100000);
  assert.match(standard('21204').included_programs.find(p=>p.government_level==='municipality').calculation_assumptions.join(' '),/転入2万円.*J-クレジット参加3千円.*入力外条件/);
  assert.match(standard('21506').included_programs.find(p=>p.government_level==='municipality').calculation_assumptions.join(' '),/蓄電池.*原文.*kWh.*解釈/);
});
test('岐阜非採用10制度は受付終了と非FIT理由を保持する',()=>{
  const programs=data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='21'&&p.government_level==='municipality'&&p.machine_rule==='kansai_municipal_non_adopted');assert.equal(programs.length,10);
  const reasons=new Set();
  for(const p of programs){const r=standard(p.municipality_code);assert.equal(r.municipality_amount_yen,0);const row=r.excluded_programs.find(r=>r.id===p.id);assert.ok(row);reasons.add(row.application_status);assert.match(nonInclusionReason(row),row.application_status==='closed'?/受付が終了/:/非FITを要する/);}
  assert.ok(reasons.has('closed'));assert.ok(reasons.has('accepting'));
});
test('岐阜探索未完了3自治体は限定探索済み表示から区別する',()=>{
  for(const code of ['21302','21404','21604']){const city=data.municipalities.find(m=>m.municipality_code===code);const exploration=data.municipality_subsidy_exploration.find(m=>m.municipality_code===code);assert.equal(city.program_status,'searched_not_found');assert.match(exploration.summary,/探索未完了|探索を終了しない/);const message=subsidyResearchMessage(city.program_status,exploration);assert.match(message,/制度調査は未完了/);assert.match(message,/制度不存在や受付終了を意味するものではありません/);assert.doesNotMatch(message,/調査した範囲では見つかっていません/);}
  assert.match(subsidyResearchMessage('searched_not_found',{summary:'限定探索を終了した．'}),/調査した範囲では見つかっていません/);
});
