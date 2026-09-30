import assert from 'node:assert/strict';
import test from 'node:test';
import fs from 'node:fs';
import {subsidyTermsIndex, subsidyAmountFields} from '../../site/simulator/src/subsidy-amount-presentation.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {amountSummary} from '../../site/data/src/model.js';
const data = JSON.parse(fs.readFileSync(new URL('../../data/input/public-data.json', import.meta.url), 'utf8'));

test('診断IDと掲載枝IDが異なっても，同じ正本の制度額を非算入額と分ける', () => {
  const input={prefecture_code:'01',municipality_code:'01429'};
  const index=subsidyTermsIndex(data,input);
  const listing=selectSchemeGroups(data,'01','01429').flat().find(p=>p.id==='hokkaido-kuriyama-solar');
  const row={id:'hokkaido-next-kuriyama-solar',included:false,amount_yen:null,reason_code:'calculation_detail_unconfirmed'};
  const view=subsidyAmountFields(row,index);
  assert.equal(view.institutionText,amountSummary(listing));
  assert.match(view.institutionText,/3分の1|20万円/);
  assert.equal(view.includedAmountYen,0);
  assert.equal(view.inputAmountPending,true);
  assert.equal(row.amount_yen,null);
});

test('非算入の正額候補と真の額不明，表示未整理を区別する', () => {
  const index=new Map([['known',[{branchId:'b',text:'上限20万円',evidenceStatus:'partial'}]],['unknown',[{branchId:'u',text:'補助額は未確認',evidenceStatus:'unconfirmed'}]]]);
  assert.deepEqual(subsidyAmountFields({id:'known',included:false,amount_yen:120000},index),{institutionText:'上限20万円',institutionStatus:'available',includedAmountYen:0,referenceAmountYen:120000,inputAmountPending:false});
  assert.equal(subsidyAmountFields({id:'unknown',included:false,amount_yen:null},index).institutionStatus,'unconfirmed');
  assert.equal(subsidyAmountFields({id:'absent',included:false,amount_yen:null},index).institutionStatus,'preparing');
  assert.equal(subsidyAmountFields({id:'known',included:true,amount_yen:100000},index).includedAmountYen,100000);
});

import {noncashBenefitDescription} from '../../site/simulator/src/subsidy-presentation.js';
test('非算入の地域通貨参考額も全額利用の仮定と実算入ゼロを明示する', () => {
 const row={id:'hokkaido-next-hamanaka-solar',included:false,amount_yen:80000};
 const description=noncashBenefitDescription(row);
 assert.match(description,/現金の給付ではありません/);
 assert.match(description,/期限内.*全額利用.*仮定/);
 assert.match(description,/参考試算.*算入していません/);
 assert.doesNotMatch(description,/経済便益に含めています/);
 assert.equal(subsidyAmountFields(row,new Map()).includedAmountYen,0);
});

test('非算入の商品券と汎用非現金説明は算入済みと述べない', () => {
 for(const row of [{id:'yamaguchi-35206-ecolife-2026',included:false},{id:'kagawa-37206-solar_battery-2026',included:false},{id:'generic',included:false,required_confirmations:['非現金ポイントは公式の円相当額を経済便益として扱う承認済み方針を適用し，現金給付とは表示しない．']}]) {
  const text=noncashBenefitDescription(row);
  assert.match(text,/参考試算しています.*算入していません/);
  assert.doesNotMatch(text,/経済便益に含めています/);
  assert.match(text,/現金の給付ではありません/);
 }
 assert.equal(noncashBenefitDescription({id:'cash',included:false}), '');
});

test('下振れ表示の適用候補は参考額を維持し，実算入額は0円にする', () => {
 const view=subsidyAmountFields({id:'hokkaido-next-kuriyama-solar',included:false,amount_yen:200000,reason_code:'selected_scenario_without_subsidy'},subsidyTermsIndex(data,{prefecture_code:'01',municipality_code:'01429'}));
 assert.equal(view.includedAmountYen,0);
 assert.equal(view.referenceAmountYen,200000);
 assert.match(view.institutionText,/20万円/);
});

test('条件はpreparingでも金額専用注釈の既知上限を一覧と診断へ表示する', () => {
 const listing=selectSchemeGroups(data,'01','01202').flat().find(p=>p.id==='hokkaido-hakodate-solar');
 assert.equal(listing._catalog.display_basis,'preparing');
 const row={id:'hokkaido-hakodate-solar',included:false,amount_yen:null,reason_code:'calculation_detail_unconfirmed'};
 const view=subsidyAmountFields(row,subsidyTermsIndex(data,{prefecture_code:'01',municipality_code:'01202'}));
 assert.equal(view.institutionText,amountSummary(listing));
 assert.match(view.institutionText,/2分の1.*5万円/);
 assert.equal(view.institutionStatus,'available');
 assert.equal(view.includedAmountYen,0);
 assert.equal(view.inputAmountPending,true);
 assert.equal(listing._catalog.official_conditions.length,0);
});


test('全国の非算入制度もnative正本の既知額を一覧と診断で共有する', () => {
 const input={prefecture_code:'01',municipality_code:'01429'};
 const index=subsidyTermsIndex(data,input);
 const groups=selectSchemeGroups(data,'01','01429').flat();
 const cases=[
  ['national-dr-battery-r7-supplement-2026','source-2cc7e0f7105d32',/34,500円.*1kWh当たり2,000円.*初期実効容量.*60万円/],
  ['national-zeh-new-detached-2026-battery','source-8b3f0bcef0b743',/1kWh当たり2万円.*20万円/],
  ['national-mirai-eco-renovation-2026-battery','source-9fa6ae61ffbc9e',/1戸当たり96,000円/]
 ];
 for(const [diagnosticId,branchId,terms] of cases) {
  const listing=groups.find(p=>p.id===branchId);
  assert.ok(listing,branchId);
  const view=subsidyAmountFields({id:diagnosticId,included:false,amount_yen:null,reason_code:'excluded_required_external_work'},index);
  assert.equal(view.institutionText,amountSummary(listing));
  assert.match(view.institutionText,terms);
  assert.equal(view.institutionStatus,'available');
  assert.equal(view.includedAmountYen,0);
  assert.equal(view.referenceAmountYen,null);
  assert.equal(listing._catalog.display_basis,'preparing');
  assert.deepEqual(listing._catalog.official_conditions,[]);
 }
});


test('保存された額不足の茨城35枝は表示未整理と分け，額を0円へ補完しない', () => {
 const savedGap='保存された蓄電池の算式は未確定．定額・kW単価・kWh単価・上限額・端数処理はすべて未確認であり，補助額を算出しない．補足監査の元金額記録も同じ未確定値を保持している．';
 const targets=data.subsidy_catalog.rows.filter(row=>row.prefecture_code==='08'&&row.amount.raw_text===savedGap);
 assert.equal(targets.length,35);
 for(const row of targets) {
  const listing=selectSchemeGroups(data,'08',row.municipality_code).flat().find(p=>p.id===row.branch_id);
  assert.ok(listing,row.branch_id);
  assert.equal(listing._catalog.amount.evidence_status,'unconfirmed');
  assert.equal(listing._catalog.amount.display_text,null);
  assert.equal(amountSummary(listing),'補助額は未確認');
  assert.equal(listing._catalog.display_basis,'preparing');
  assert.deepEqual(listing._catalog.official_conditions,[]);
 }
});
