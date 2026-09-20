import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,equipmentPackage='solar_plus_standard_battery')=>calculateEstimate({prefectureCode:'19',municipalityCode,equipmentPackage,systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('山梨27自治体21制度と代表額・同時設置分岐を保持する',()=>{
  assert.equal(data.municipalities.filter(m=>m.prefecture_code==='19').length,27);
  assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.prefecture_code==='19'&&p.government_level==='municipality').length,21);
  for(const[c,n]of [['19201',100000],['19202',170000],['19204',145000],['19209',258000],['19210',696000],['19211',100000],['19213',90000],['19425',280000],['19430',280000]]) assert.equal(standard(c).municipality_amount_yen,n,c);
  for(const c of ['19201','19211']) assert.equal(standard(c,'solar_only').municipality_amount_yen,0,c);
});
test('甲斐の排他・税抜費用と甲州の蓄電池単位解釈を保持する',()=>{
  const kai=standard('19210');
  assert.equal(kai.prefecture_amount_yen,0); assert.equal(kai.total_amount_yen,696000);
  const p=kai.included_programs.find(p=>p.id==='kai-decarbonization-leading-area-housing-2026');
  assert.match(p.calculation_assumptions.join(' '),/税抜額の3分の2/);
  assert.match(p.required_confirmations.join(' '),/2030年再エネ契約/);
  assert.match(standard('19213').included_programs.find(p=>p.id==='koshu-residential-energy-equipment-2026').calculation_assumptions.join(' '),/原文.*kW.*kWh.*解釈/);
});
test('山梨市終了・韮崎不明・住宅全体工事除外と探索未発見を区別する',()=>{
  for(const c of ['19205','19207','19346']) assert.equal(standard(c).municipality_amount_yen,0,c);
  const row=c=>{const r=standard(c);return [...r.excluded_programs,...r.candidate_programs].find(p=>p.government_level==='municipality');};
  assert.equal(row('19205').application_status,'closed');
  assert.equal(row('19207').application_status,'unknown'); assert.equal(row('19207').amount_yen,null);
  assert.equal(row('19346').application_status,'accepting');
  assert.equal(data.municipalities.filter(m=>m.prefecture_code==='19'&&m.program_status==='searched_not_found').length,6);
});
