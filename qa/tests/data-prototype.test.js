import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {selectPrograms,groupPrograms,amountSummary,statusLabel,applicability,confirmationNotes,targetSummary,groupedTargetSummary,groupedEquipmentSummary,applicationPeriod,matchesReception} from '../../site/data/src/model.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));

test('久万高原の既知額は他補助控除・税未確認を残し，旧年度候補へ転用しない',()=>{
  const p=data.diagnostic_subsidy_programs.find(p=>p.id==='ehime-38386-energy-2026');
  const c=p.formula_components[0];
  assert.equal(c.cap_yen,150000);assert.equal(c.deduct_other_subsidies,true);
  assert.equal(c.rounding_unit_yen,1000);assert.equal(c.cost_tax,'approved_assumption_inclusive');
  assert.match(amountSummary(p),/他の補助金を差し引いた額と15万円/);
  assert.match(amountSummary(p),/税区分は未確認/);
  assert.match(targetSummary(p),/JET認証[\s\S]*賃貸住宅は対象外/);
  assert.match(applicationPeriod(p),/工事完了から30日以内/);
  const old=data.diagnostic_subsidy_programs.find(p=>p.id==='ehime-38386-migration_old_year-2026');
  assert.doesNotMatch(amountSummary(old),/15万円/);
  assert.equal(statusLabel(old),'受付状況未確認');
});
test('地域一覧は国・選択県・一致する市町村だけを含む',()=>{
  assert.deepEqual(selectPrograms(data,''),[]);
  assert.ok(selectPrograms(data,'02').every(p=>p.government_level!=='municipality'));
  assert.ok(selectPrograms(data,'02','13103').every(p=>p.government_level!=='municipality'));
  const groups=groupPrograms(selectPrograms(data,'02','02405'));
  assert.equal(groups.filter(g=>g[0].municipality_code==='02405').length,1);
  assert.equal(groups.find(g=>g[0].municipality_code==='02405').length,2);
});
test('制度の補助額は診断採否と分離し，金額を左右する条件を残す',()=>{
  const get=id=>data.diagnostic_subsidy_programs.find(p=>p.id===id);
  const a=get('gunma-solar-new-2026'),b=get('gunma-battery-existing-pv-2026');
  assert.match(amountSummary(a),/1世帯7万円/);assert.match(amountSummary(a),/1kW当たりではありません/);
  assert.match(targetSummary(a),/非FIT[\s\S]*4,800Ah[\s\S]*上野村/);
  assert.match(amountSummary(b),/14.1万円.*小さい額の1\/3/);assert.match(targetSummary(b),/4月29日以前/);
  assert.match(amountSummary(a),/\n蓄電池：/);
  assert.match(targetSummary(a),/\n共通：/);
  assert.match(applicationPeriod(b),/2026年7月20日受付終了/);
  assert.equal(applicationPeriod({id:'unknown'}),'申請期間：公式情報をご確認ください．');
  assert.match(amountSummary(get('rokkasho-new-energy-battery-2026')),/税区分は未確認/);
  const p={...get('fukaura-reform-pv-2026'),id:'generic'};
  assert.match(amountSummary(p),/10％.*200,000円.*500,000円.*1,000円/);
  assert.match(amountSummary({...p,formula_components:[{...p.formula_components[0],unhandled_condition:true}]}),/未整理/);
  assert.match(amountSummary({...p,shared_cap_yen:10000}),/未整理/);
  assert.equal(statusLabel({application_status:'closed'}),'受付終了');
  assert.equal(statusLabel({application_status:'unknown'}),'受付状況未確認');
});
test('受付状態と適用未確認・計算未対応・FIT等の制約を分ける',()=>{
  const get=id=>data.diagnostic_subsidy_programs.find(p=>p.id===id);
  assert.equal(applicability(get('fukaura-vacant-reform-pv-2026')).label,'対象設備への適用確認中');
  assert.match(confirmationNotes(get('fukaura-vacant-reform-pv-2026')).join(' '),/機能回復/);
  assert.equal(applicability(get('misawa-reform-decarbonization-2026')).label,'診断の計算対応待ち');
  assert.match(applicability(get('fukaura-young-reform-pv-2026')).text,/限度額の解釈/);
  assert.match(applicability(get('tokushima-36402-nonfit_pair-2026')).text,/非FIT/);
});

test('国3制度は加算条件・対象費目・住宅工事必須・共通上限を金額とともに残す',()=>{
  const get=id=>data.diagnostic_subsidy_programs.find(p=>p.id===id);
  const dr=get('national-dr-battery-r7-supplement-2026');
  assert.match(amountSummary(dr),/3.45万円.*条件.*30％.*60万円/);
  assert.match(targetSummary(dr),/レジリエンス[\s\S]*広域認定[\s\S]*2028年3月31日/);
  const zeh=get('national-zeh-new-detached-2026-battery');
  assert.match(amountSummary(zeh),/設備購入費.*最も小さい額.*工事費は含みません/);
  assert.match(targetSummary(zeh),/ZEH＋.*断熱等級6.*蓄電池単独では利用不可/);
  const mirai=get('national-mirai-eco-renovation-2026-battery');
  assert.match(amountSummary(mirai),/1戸9.6万円[\s\S]*工事全体の共通上限/);
  assert.match(targetSummary(mirai),/外皮開口部.*蓄電池だけでは利用不可/);
  assert.match(applicationPeriod(mirai),/申請期間：2026年6月30日～12月31日/);
  assert.doesNotMatch(targetSummary(mirai),/12月31日/);
  const rokkasho=get('rokkasho-new-energy-battery-2026');
  assert.match(applicationPeriod(rokkasho),/申請期限：2027年3月15日/);
  assert.match(targetSummary(rokkasho),/工事完了は2027年3月31日/);
});

test('受付フィルタは設備別の一致と未確認を保持する',()=>{
  const morioka=data.diagnostic_subsidy_programs.find(p=>p.id==='iwate-morioka-solar-2026');
  assert.equal(matchesReception([morioka],'closed'),true);
  assert.equal(matchesReception([morioka],'accepting'),true);
  assert.match(statusLabel(morioka),/既存住宅の太陽光：受付中\n新築住宅の太陽光：受付終了/);
  const group=[{application_status:'closed'},{application_status:'accepting'}];
  assert.equal(matchesReception(group,'accepting'),true);
  assert.equal(matchesReception(group,'closed'),true);
  assert.equal(matchesReception(group,'scheduled'),false);
  assert.equal(matchesReception([{application_status:'waitlist'}],'accepting'),true);
  assert.equal(matchesReception([{application_status:'scheduled'}],'scheduled'),true);
  assert.equal(matchesReception([{application_status:'unknown'}],'unknown'),true);
  assert.equal(matchesReception([{application_status:'future_status'}],'unknown'),true);
  assert.equal(matchesReception(group,'unknown'),false);
  assert.equal(matchesReception(group,'invalid'),true);
});

test('一覧は診断の非算入理由を出さず，共通条件だけを集約する',()=>{
  const group=selectPrograms(data,'02','02206').filter(p=>p.municipality_code==='02206');
  const target=groupedTargetSummary(group);
  assert.equal(target.filter(t=>t.startsWith('共通：')).length,1);
  assert.match(target.join(' '),/太陽光：.*蓄電池：/);
  assert.match(amountSummary(group[0]),/5万円\/kW.*上限25万円/);
  assert.match(amountSummary(group[1]),/1\/3.*上限35万円.*14.1万円/);
  assert.match(target.join(' '),/計算例に金額の不一致/);
  assert.doesNotMatch(group.map(amountSummary).join(' '),/202000|202,000|20.2万円/);
  assert.doesNotMatch(target.join(' '),/含めていません|診断|未整理/);
  assert.deepEqual(groupedEquipmentSummary(group,statusLabel),['受付終了']);
  assert.deepEqual(groupedEquipmentSummary(group,applicationPeriod),['予定件数到達により受付終了．当初の申請期間：2026年6月23日～12月28日．']);
  const mixed=[{...group[0],_catalog:undefined,_legacy:undefined,id:'generic-solar',application_status:'accepting',housing_ages:['new']},{...group[1],_catalog:undefined,_legacy:undefined,id:'generic-battery',application_status:'closed',housing_ages:['existing']}];
  assert.deepEqual(groupedEquipmentSummary(mixed,statusLabel),['太陽光：受付中','蓄電池：受付終了']);
  assert.match(groupedTargetSummary(mixed).join(' '),/太陽光：新築/);
  assert.match(groupedTargetSummary(mixed).join(' '),/蓄電池：既存住宅/);
  assert.ok(data.diagnostic_subsidy_programs.every(p=>! /含めていません|今回の概算|診断未対応/.test(targetSummary(p))));
});
