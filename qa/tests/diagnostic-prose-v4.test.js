import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {diagnosticDisplayPilot as pilot} from '../../site/simulator/src/diagnostic-display-pilot.generated.js';
import {diagnosticPilotTerms,diagnosticPilotSections,diagnosticPilotNotice,diagnosticTrialSourceTexts,diagnosticAmountPolicy,diagnosticDetailNotes} from '../../site/simulator/src/diagnostic-display-pilot.js';
import {subsidyTermsIndex,subsidyAmountFields,subsidyAmountPolicy} from '../../site/simulator/src/subsidy-amount-presentation.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {appendInstitutionalAmount} from '../../site/simulator/src/diagnostic-amount-dom.js';
const data=JSON.parse(fs.readFileSync(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
const randomCities=new Set(['03210','04215','04606','07212','07422','19365','07541','06210','02207','07466','02361','02426','33423','21217','01484','18206','02301','01228','02424','06381']);
test('fixed20 has23 normalized branches,2 status-only and3 preserved holds',()=>{
 assert.equal(Object.values(pilot.entries).filter(e=>randomCities.has(e.municipality)).length,23);
 const heldIds=['fukushima-minamisoma-roof-battery','hida-solar-battery-2026','katsuyama-residential-solar-battery-2026'];
 assert.ok(heldIds.every(id=>pilot.held[id]));
 for(const entry of Object.values(pilot.entries)) {
  const groups=selectSchemeGroups(data,entry.prefecture,entry.municipality).flat();
  const program=groups.find(p=>p.id===entry.branch.branch_id);
  assert.ok(diagnosticPilotTerms(data,program),program.id);
  const index=subsidyTermsIndex(data,{prefecture_code:entry.prefecture,municipality_code:entry.municipality});
  for(const id of entry.branch.diagnostic_rule_ids){
   assert.deepEqual(diagnosticPilotSections({id},index),index.get(id).flatMap(term=>term.pilotSections));
   const row={id,included:false,amount_yen:123456,reason_code:'not_adopted',reason:'preserved'};
   assert.equal(subsidyAmountFields(row,index).includedAmountYen,0);
   assert.equal(subsidyAmountFields(row,index).referenceAmountYen,123456);
   assert.equal(diagnosticPilotNotice(row,index),'');
  }
 }
 for(const id of heldIds){
  const scheme=data.subsidy_schemes.find(s=>s.branches.some(b=>b.branch_id===id));
  const program=selectSchemeGroups(data,scheme.prefecture_code,scheme.municipality_code).flat().find(p=>p.id===id);
  assert.equal(diagnosticPilotTerms(data,program),null);
 }
});
test('raw-only known amount renders reviewed prose; drift prevents adoption and detail fallback',()=>{
 const entry=Object.values(pilot.entries).find(e=>e.municipality==='33423'&&!e.branch.amount.display_text);
 const rule=entry.branch.diagnostic_rule_ids[0];
 const detail=diagnosticTrialSourceTexts(data,rule).join('\n');
 assert.match(detail,/2万円/);assert.doesNotMatch(detail,/floor_|min\(/);
 for(const alter of [d=>d.data_version='changed',d=>d.schema_version='changed',d=>d.subsidy_schemes.find(s=>s.record_id===entry.recordId).target_year=1900,d=>d.subsidy_schemes.find(s=>s.record_id===entry.recordId).prefecture_code='99',d=>d.subsidy_catalog.rows.find(r=>r.branch_id===entry.branch.branch_id).amount.raw_text='changed']){
  const changed=structuredClone(data);alter(changed);
  assert.deepEqual(diagnosticTrialSourceTexts(changed,rule),[]);
 }
 const changed=structuredClone(data);
 changed.subsidy_catalog.rows.find(r=>r.branch_id===entry.branch.branch_id).amount.raw_text='changed';
 const program=selectSchemeGroups(changed,entry.prefecture,entry.municipality).flat().find(p=>p.id===entry.branch.branch_id);
 assert.equal(diagnosticPilotTerms(changed,program),null);
});
class Element{constructor(tag){this.tag=tag;this.dataset={};this.style={};this.children=[];this.text='';this.listeners={};}append(...nodes){this.children.push(...nodes);}addEventListener(type,handler){this.listeners[type]=handler;}set textContent(value){this.text=value;}get textContent(){return this.text+this.children.map(n=>n.textContent).join('');}}
const descendants=node=>node.children.flatMap(child=>[child,...descendants(child)]);
const document={createElement:tag=>new Element(tag)};
test('multiple equipment sections keep separate primary and multiline supplements with one shared cap',()=>{
 const entry=Object.values(pilot.entries).find(e=>e.municipality==='02426');
 const item=new Element('li');
 appendInstitutionalAmount(document,item,{institutionStatus:'available'},entry.sections,entry.commonSupplement);
 const primary=item.children.filter(n=>'subsidyInstitutionAmount' in n.dataset);
 assert.equal(primary.length,entry.sections.length);
 const detail=item.children.find(n=>n.tag==='details');assert.ok(detail);assert.ok(!detail.open);
 const supplements=descendants(detail).filter(n=>'subsidySupplement' in n.dataset);
 assert.ok(supplements.every(n=>n.style.whiteSpace==='pre-line'&&n.textContent.startsWith('補足：\n')));
 assert.equal(supplements.filter(n=>n.textContent.includes('（共通上限）')).length,1);
 assert.equal(item.children.filter(n=>'subsidyIncludedAmount' in n.dataset).length,0);
});
test('single section baseline remains one primary and supplement',()=>{
 const entry=pilot.entries['hokkaido-mori-solar'];const item=new Element('li');
 appendInstitutionalAmount(document,item,{institutionStatus:'available'},entry.sections,entry.commonSupplement);
 assert.equal(item.children.length,2);assert.equal(item.children[0].textContent,'制度の補助額：太陽光の出力1kWあたり5万円です．');
 const detail=item.children[1];assert.equal(detail.tag,'details');assert.ok(!detail.open);
 detail.open=true;detail.listeners.toggle();assert.equal(detail.children[0].textContent,'補足・適用条件を閉じる');
 detail.open=false;detail.listeners.toggle();assert.equal(detail.children[0].textContent,'補足・適用条件を開く');
});

test('nonimplemented and other-authority references show notices without financial fields',()=>{
 for(const [id,entry] of Object.entries(pilot.displayPolicies).filter(([id])=>['fukushima-yabuki-solar','aomori-02424-prefecture-linked-prelaunch-2026'].includes(id))){
  const index=subsidyTermsIndex(data,{prefecture_code:entry.prefecture,municipality_code:entry.municipality});
  const row={id:entry.branch.diagnostic_rule_ids[0],included:false,amount_yen:null,reason_code:'calculation_detail_unconfirmed'};
  const policy=subsidyAmountPolicy(row,index);assert.deepEqual(policy,entry.policy);
  const amounts=subsidyAmountFields(row,index);assert.equal(amounts.institutionText,'');assert.equal(amounts.institutionStatus,'not_displayed');
  const item=new Element('li');appendInstitutionalAmount(document,item,amounts,[],[],policy);
  assert.equal(item.children.length,1);assert.ok('subsidyDisplayPolicy' in item.children[0].dataset);
  assert.doesNotMatch(item.children[0].textContent,/円|kW|旧年度/);
  assert.equal(diagnosticPilotNotice(row,index),'');assert.deepEqual(diagnosticPilotSections(row,index),[]);
  assert.deepEqual(diagnosticTrialSourceTexts(data,row.id),[]);
  assert.equal(subsidyAmountPolicy({...row,included:true},index),null);
  const program=selectSchemeGroups(data,entry.prefecture,entry.municipality).flat().find(p=>p.id===id);
  assert.deepEqual(diagnosticAmountPolicy(data,program),entry.policy);
  const drift=structuredClone(program);drift._catalog.amount.display_text='changed';
  assert.equal(diagnosticAmountPolicy(data,drift).kind,'source_review_required');
 }
});
test('Misawa general renovation cap remains distinct from equipment cap',()=>{
 const entry=pilot.entries['misawa-reform-decarbonization-2026'];const item=new Element('li');
 appendInstitutionalAmount(document,item,{institutionStatus:'available'},entry.sections,entry.commonSupplement);
 const text=item.children.map(n=>n.textContent).join('\n');
 assert.match(text,/（上限）20万円/);assert.match(text,/（上限）一般改修補助：25万円から脱炭素設備補助額を差し引いた額/);
 assert.doesNotMatch(text,/一般改修.*今回の試算/);
 assert.equal(descendants(item).filter(node=>'subsidySupplement' in node.dataset).length,1);
 assert.ok(text.indexOf('一般改修補助') < text.indexOf('（端数処理）'));
});

test('diagnostic details hide historical and other-authority amount notes but preserve source',()=>{
 for(const entry of Object.entries(pilot.displayPolicies).filter(([id])=>['fukushima-yabuki-solar','aomori-02424-prefecture-linked-prelaunch-2026'].includes(id)).map(([,entry])=>entry)){
  const rule=data.diagnostic_subsidy_programs.find(p=>entry.branch.diagnostic_rule_ids.includes(p.id));
  const before=JSON.stringify(rule);
  const notes=[rule.diagnostic_scope?.basis,...rule.calculation_assumptions,...rule.required_confirmations].filter(Boolean);
  assert.deepEqual(diagnosticDetailNotes(data,rule,notes),[entry.policy.notice]);
  assert.equal(JSON.stringify(rule),before);
  const changed=structuredClone(data);changed.data_version='changed';
  assert.deepEqual(diagnosticDetailNotes(changed,rule,notes),['制度の金額情報を確認中です．公式窓口でご確認ください．']);
 }
 const rule=data.diagnostic_subsidy_programs.find(p=>p.id==='hokkaido-next-kuriyama-solar');
 assert.deepEqual(diagnosticDetailNotes(data,rule,['current known source']),['current known source']);
});
