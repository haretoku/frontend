import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {calculateEstimate} from '../../site/simulator/src/calculator.js';
import {subsidyGroups,conciseOkayamaAssumption,nonInclusionReason,readableSubsidyAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const standard=(municipalityCode,extra={})=>calculateEstimate({prefectureCode:'33',municipalityCode,equipmentPackage:'solar_plus_standard_battery',systemCapacityKw:4,batteryCapacityKwh:9.5,housingAge:'existing',monthlyElectricityBillYen:12000,...extra},data).scenarios.find(s=>s.scenario==='standard').subsidy_breakdown;
test('岡山27自治体36規則・代表額と端数を保持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='33').length,27);
 assert.equal(data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('okayama-')).length,36);
 for(const [code,amount] of [['33100',262000],['33202',140000],['33207',234950],['33209',1000000],['33210',204000],['33214',250000],['33346',95000],['33461',0],['33643',0]])assert.equal(standard(code).municipality_amount_yen,amount,code);
 for(const [capacity,amount] of [[3.149,77000],[3.15,80000],[3.249,80000],[3.25,82000]])assert.equal(standard('33210',{equipmentPackage:'solar_only',systemCapacityKw:capacity}).municipality_amount_yen,amount);
});
test('住宅区分指定なしは新築と既存の両方を仮定して算入する',()=>{
 for(const code of ['33210', '33214', '33606', '33623', '33666']){const existing=standard(code).municipality_amount_yen;assert.ok(existing>0);assert.equal(standard(code,{housingAge:'new'}).municipality_amount_yen,existing);}
 assert.equal(standard('33209',{housingAge:'new'}).municipality_amount_yen,0);
});test('倉敷例外・高梁属性・和気B単独・丸め留保を短文で保持する',()=>{
 for(const [code,pattern] of [['33202',/一般の新築住宅は対象外/],['33209',/市内業者.*対象児童3人/],['33346',/蓄電池だけ.*上限12万円/],['33207',/端数処理の順序は未確認/],['33214',/他の補助金は0円/]]){
 const row=standard(code).included_programs.find(p=>p.government_level==='municipality');const t=conciseOkayamaAssumption({...row,included:true});assert.match(t,pattern);assert.doesNotMatch(t,/承認済み|レビュー|統括|R8/);
 }
 assert.equal(standard('33202',{housingAge:'new'}).municipality_amount_yen,140000);
 const wake=standard('33346');assert.equal(wake.candidate_programs.find(p=>p.id==='okayama-33346-unresolved_solar-2026').amount_yen,null);
 const mani=standard('33214');assert.equal(mani.national_amount_yen,0);assert.equal(mani.prefecture_amount_yen,0);
});
test('矢掛費目不足と西粟倉終了を混同しない',()=>{
 const yak=standard('33461').candidate_programs.find(p=>p.id==='okayama-33461-unresolved-2026');assert.equal(yak.amount_yen,null);assert.notEqual(yak.application_status,'closed');assert.match(yak.required_confirmations.join(' '),/費目/);
 const closed=standard('33643').excluded_programs.find(p=>p.id==='okayama-33643-closed_or_incompatible-2026');assert.match(nonInclusionReason(closed),/受付が終了/);
});

test('ZEH住宅工事をFIT不適合へ誤分類せず，旧未確認枝を残さない',()=>{
 for(const code of ['33210','33214','33606','33623','33666']){
 const breakdown=standard(code,{housingAge:'new'});const before=JSON.stringify(breakdown);
 const scenario={scenario:'standard',subsidy_breakdown:breakdown};
 const groups=subsidyGroups({input:{equipment_package:'solar_plus_standard_battery'},scenarios:[scenario]},scenario,{});
 const rows=groups.excluded.filter(p=>p.id===`okayama-${code}-main-2026`||p.id===`okayama-${code}-new_unconfirmed-2026`);
 assert.equal(rows.length,0);assert.equal(JSON.stringify(breakdown),before);
 if(code==='33210'){const zeh=groups.excluded.find(p=>p.id==='okayama-33210-zeh-2026');assert.match(zeh.reason,/住宅全体の工事・性能条件/);assert.doesNotMatch(zeh.reason,/FIT/);}
 }
});
test('除外理由は住宅工事・外部設備・非FITを区別し汎用状態からFITを推測しない',()=>{
 for(const [reason_code,pattern] of [['required_external_work',/住宅全体/],['required_external_equipment',/別の設備/],['fit_fip_incompatible_with_active_sale_path',/非FIT/],['sale_path_not_applicable',/非FIT/]])assert.match(nonInclusionReason({reason_code,calculation_status:'excluded_incompatible',application_status:'accepting'}),pattern);
 assert.doesNotMatch(nonInclusionReason({reason_code:'unrecognized',calculation_status:'excluded_incompatible'}),/FIT/);
});

test('倉敷ZEH枝は新築時も受付終了で非算入を維持する',()=>{
 const row=standard('33202',{housingAge:'new'}).excluded_programs.find(p=>p.id==='okayama-33202-zeh-2026');assert.equal(row.application_status,'closed');assert.equal(row.amount_yen,null);assert.match(nonInclusionReason(row),/受付が終了/);assert.equal(standard('33202',{housingAge:'new'}).municipality_amount_yen,140000);
});
