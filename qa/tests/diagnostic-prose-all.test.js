import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {diagnosticDisplayPilot as generated} from '../../site/simulator/src/diagnostic-display-pilot.generated.js';
import {diagnosticPilotTerms,diagnosticAmountPolicy,diagnosticTrialSourceTexts,diagnosticPilotSections,diagnosticPilotCommonSupplement,diagnosticPilotNotice} from '../../site/simulator/src/diagnostic-display-pilot.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {subsidyTermsIndex,subsidyAmountFields} from '../../site/simulator/src/subsidy-amount-presentation.js';
const data=JSON.parse(fs.readFileSync(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));

test('Oumu combined diagnosis keeps two institutional sections and one shared cap without changing included amount',()=>{
 const entry=generated.entries['hokkaido-additional-oumu-solar'];
 const index=subsidyTermsIndex(data,{prefecture_code:entry.prefecture,municipality_code:entry.municipality});
 const row={id:entry.branch.diagnostic_rule_ids[0],included:true,amount_yen:300000};
 const sections=diagnosticPilotSections(row,index);
 assert.deepEqual(sections.map(s=>s.label),['太陽光','蓄電池']);
 const common=diagnosticPilotCommonSupplement(row,index);
 assert.equal(common.filter(s=>s.startsWith('（共通上限）')).length,1);
 assert.equal(subsidyAmountFields(row,index).includedAmountYen,300000);
 assert.match(diagnosticPilotNotice(row,index),/適用条件を満たすと仮定/);
 assert.equal(diagnosticPilotNotice({...row,included:false},index),'');
 const mixed=new Map([[row.id,[index.get(row.id)[0],{text:'未整理'}]]]);
 assert.deepEqual(diagnosticPilotSections(row,mixed),[]);
 assert.deepEqual(diagnosticPilotCommonSupplement(row,mixed),[]);
});
test('all adopted branches match native institutional source;held count does not imply missing money',()=>{
 assert.equal(generated.normalizationVersion,'diagnostic-common-sentences-v10-all');
 assert.equal(Object.keys(generated.entries).length,126);
 assert.equal(Object.keys(generated.held).length,1134);
 assert.equal(Object.keys(generated.displayPolicies).length,5);
 for(const [id,entry] of Object.entries(generated.entries)){
  const program=selectSchemeGroups(data,entry.prefecture,entry.municipality).flat().find(p=>p.id===id);
  assert.ok(program,id);assert.ok(diagnosticPilotTerms(data,program),id);
  const index=subsidyTermsIndex(data,{prefecture_code:entry.prefecture,municipality_code:entry.municipality});
  for(const ruleId of entry.branch.diagnostic_rule_ids){
   const fields=subsidyAmountFields({id:ruleId,included:false,amount_yen:12345,reason_code:'not_adopted'},index);
   assert.equal(fields.includedAmountYen,0);assert.equal(fields.referenceAmountYen,12345);
   assert.ok(fields.institutionText.length>0);
  }
 }
});
test('all explicit suppressed policies are source bound and stale evidence is not substituted',()=>{
 for(const [id,entry] of Object.entries(generated.displayPolicies)){
  const program=selectSchemeGroups(data,entry.prefecture,entry.municipality).flat().find(p=>p.id===id);
  assert.deepEqual(diagnosticAmountPolicy(data,program),entry.policy);
  const changed=structuredClone(program);changed._catalog.target_year='changed';
  assert.equal(diagnosticAmountPolicy(data,changed).kind,'source_review_required');
 }
});

test('accepted saved amount sources keep cooperation notes in diagnostic details and reject source drift',()=>{
 let checked=0;
 for(const entry of Object.values(generated.entries).filter(e=>e.savedSourceDetails)){
  if(entry.branch.amount.display_text) continue;
  for(const ruleId of entry.branch.diagnostic_rule_ids){
   const notes=diagnosticTrialSourceTexts(data,ruleId);
   assert.ok(notes.includes(entry.catalogAmount.raw_text),entry.branch.branch_id);
  }
  checked++;
 }
 assert.equal(checked,52);
 const entry=Object.values(generated.entries).find(e=>e.savedSourceDetails&&!e.branch.amount.display_text);
 const changed=structuredClone(data);
 changed.subsidy_catalog.rows.find(r=>r.branch_id===entry.branch.branch_id).amount.raw_text+='changed';
 assert.ok(!diagnosticTrialSourceTexts(changed,entry.branch.diagnostic_rule_ids[0]).includes(entry.catalogAmount.raw_text));
 const ruleChanged=structuredClone(data);
 const scheme=ruleChanged.subsidy_schemes.find(s=>s.branches.some(b=>b.branch_id===entry.branch.branch_id));
 scheme.diagnostic_rules.find(r=>r.id===entry.branch.diagnostic_rule_ids[0]).diagnostic_scope.basis+='changed';
 assert.ok(!diagnosticTrialSourceTexts(ruleChanged,entry.branch.diagnostic_rule_ids[0]).includes(entry.catalogAmount.raw_text));
 assert.ok(!generated.entries['saga-41201-vacant-reform-pv-2026']);
 assert.ok(!generated.entries['saga-41201-vacant-reform-unconfirmed-2026']);
});
