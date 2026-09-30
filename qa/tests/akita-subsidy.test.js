import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {diagnosticSubsidy} from '../../site/simulator/src/diagnostic-subsidy.js';
import {conciseAkitaAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const input={prefectureCode:'05',municipalityCode:'05212',housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
const evaluate=(extra={})=>diagnosticSubsidy(data.diagnostic_subsidy_programs,{...input,...extra},true);
test('大仙はPV単独非算入，同時設置は新築既存とも30万円，整数容量と上限を維持',()=>{
 assert.equal(evaluate({equipmentPackage:'solar_only'}).municipality_amount_yen,0);
 for(const housingAge of ['new','existing'])for(const [capacityKw,amount]of [[3.5,250000],[4,300000],[5,350000],[6,350000]])assert.equal(evaluate({housingAge,capacityKw}).municipality_amount_yen,amount);
});
test('大仙の表示は同時設置・設置後申請・国県併用未確認を保持する',()=>{
 const row=evaluate().included_programs.find(p=>p.id==='akita-daisen-household');
 assert.equal(row.application_status,'accepting');
 const note=conciseAkitaAssumption({...row,included:true});
 assert.match(note,/同時に設置・接続/);assert.match(note,/設置後申請/);assert.match(note,/国・県との併用可否と現在の残予算は未確認/);assert.match(note,/整数kWへ切り捨て/);
});
