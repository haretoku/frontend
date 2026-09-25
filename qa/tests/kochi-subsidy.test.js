import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {conciseKochiAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,equipmentPackage='solar_plus_standard_battery')=>calculateEstimate({prefectureCode:'39',municipalityCode,equipmentPackage,systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
const note=code=>conciseKochiAssumption({...standard(code).included_programs.find(p=>p.id.startsWith('kochi-')),included:true});
test('高知34市町村52枝25採用と安田・田野の金額を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='39').length,34);
 const rows=data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('kochi-'));
 assert.equal(rows.length,52);assert.equal(rows.filter(p=>p.machine_rule==='kansai_municipal_formula').length,25);
 assert.equal(standard('39304').total_amount_yen,860000);assert.equal(standard('39303').total_amount_yen,540000);assert.match(note('39303'),/合算後，千円未満/);
});
test('香南PV単体限定と黒潮Bの独立採用を混同しない',()=>{
 assert.equal(standard('39211','solar_only').total_amount_yen,60000);assert.equal(standard('39211').total_amount_yen,0);
 const b=standard('39428');assert.equal(b.total_amount_yen,380000);assert.ok(b.included_programs.some(p=>p.id==='kochi-39428-battery-2026'));assert.equal(b.excluded_programs.find(p=>p.id==='kochi-39428-nonfit-2026').reason_code,'sale_path_not_applicable');assert.match(note('39428'),/実績報告時点.*同じ蓄電池事業/);
});
test('条件短文に費用・他補助0円・梼原要望調査と住宅仮定を保持する',()=>{
 for(const code of ['39341','39424'])assert.match(note(code),/他の補助金は0円.*国その他の補助金/);
 assert.match(note('39210'),/税抜対象費用/);assert.match(note('39405'),/新築・既存.*公式.*前年度の要望調査.*10年以上.*設置工事費は含みません/);
 for(const code of ['39304','39303','39210','39341','39424','39405','39428'])assert.doesNotMatch(note(code),/追加実装|検収|承認済み/);
});
