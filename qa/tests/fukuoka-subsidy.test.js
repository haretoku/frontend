import {loadPublicData, standardSubsidy} from '../helpers/subsidy-fixture.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {conciseFukuokaAssumption,nonInclusionReason} from '../../site/simulator/src/subsidy-presentation.js';
const data=loadPublicData();
const standard=(municipalityCode,extra={})=>standardSubsidy(data,{prefectureCode:'40',municipalityCode,...extra});
test('福岡60市町村35枝14採用と9・14kWhの段階上限を維持する',()=>{
 assert.equal(data.municipalities.filter(p=>p.prefecture_code==='40').length,60);const rows=data.diagnostic_subsidy_programs.filter(p=>p.id.startsWith('fukuoka-'));assert.equal(rows.length,35);assert.equal(rows.filter(p=>p.machine_rule==='kansai_municipal_formula').length,14);
 for(const [cap,expected] of [[8.5,150000],[9,300000],[9.5,300000],[13.5,300000],[14,450000],[14.5,450000]])assert.equal(standard('40130',{batteryCapacityKwh:cap}).total_amount_yen,expected);
});
test('住宅取得に付随する設備加算は受付中を保持して非算入とする',()=>{
 for(const code of ['40402','40225']){
  const b=standard(code);assert.equal(b.total_amount_yen,0);assert.equal(standard(code,{housingAge:'new'}).municipality_amount_yen,0);
  const row=b.excluded_programs.find(p=>p.id.includes('used_housing_equipment'));
  assert.equal(row.application_status,'accepting');assert.equal(row.reason_code,'required_housing_acquisition');
  assert.match(nonInclusionReason(row),/住宅の取得.*設備加算.*設置だけでは利用できない/);
  assert.doesNotMatch(nonInclusionReason(row),/受付.*終了/);
 }
});

test('資料不足7候補の共通理由コードは外部工事必須と区別する',()=>{
 let count=0;
 for(const code of ['40204','40205','40225','40402','40448','40642'])for(const row of standard(code).candidate_programs.filter(p=>p.id.startsWith('fukuoka-'))){
  count++;assert.equal(row.reason_code,'calculation_detail_unconfirmed');assert.equal(row.amount_yen,null);
  assert.match(nonInclusionReason(row),/確認できていません/);assert.doesNotMatch(nonInclusionReason(row),/工事.*必要|性能条件/);
 }
 assert.equal(count,7);
});
