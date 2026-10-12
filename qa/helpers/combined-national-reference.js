import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
const sha=x=>createHash('sha256').update(x).digest('hex');
const reference=JSON.parse(readFileSync(new URL('../fixtures/hokkaido-national-backend-reference.json',import.meta.url)));
assert.equal(reference.expected_generated_from_frontend,false);
assert.equal(sha(readFileSync(new URL('../../data/input/public-data.json',import.meta.url))),reference.source_public_sha256);
for(const original of reference.original_fixtures)assert.equal(sha(readFileSync(new URL('../fixtures/'+original.path.split(/[\\/]/).at(-1),import.meta.url))),original.sha256,'元北海道fixture変更拒否');
const key=x=>JSON.stringify(Object.entries(x).sort(([a],[b])=>a<b?-1:a>b?1:0));
const normalize=p=>({prefecture_code:p.prefecture_code??'01',municipality_code:p.municipality_code??null,housing_age:p.housing_age??'existing',equipment_package:p.equipment_package??p.package,pv_kw:p.pv_kw??4,battery_kwh:p.battery_kwh,solar_cost_yen:p.solar_cost_yen??Math.round((p.pv_kw??4)*(p.housing_age==='existing'?331100:317900)),battery_cost_yen:p.battery_cost_yen??Math.round(p.battery_kwh*121000),battery_equipment_cost_yen:p.battery_equipment_cost_yen??Math.round(p.battery_kwh*111000),municipal_program_enabled:p.municipal_program_enabled??true});
const cases=new Map(reference.cases.map(c=>[key(c.input),c.expected]));
const canonical=x=>JSON.parse(JSON.stringify(x,(k,v)=>['eligible_cost_yen_unrounded','capacity_amount_yen_unrounded','amount_yen_before_deferred_rounding'].includes(k)&&v!==null?Number(v):v));
const fields=['id','government_level','calculation_status','application_status','reason_code','amount_yen','component_amounts_yen'];
const rows=(x,national)=>Object.fromEntries(['included_programs','candidate_programs','excluded_programs'].map(k=>[k,(x[k]??[]).filter(p=>(p.government_level!=='municipality')===national).map(p=>national?Object.fromEntries(fields.map(f=>[f,p[f]??null])):p).sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)]));
export function assertUpdatedCombined(actual,oldExpected,input){
 const expected=cases.get(key(normalize(input)));assert(expected,'独立backend入力不存在');
 assert.deepEqual(canonical(rows(actual,false)),canonical(rows(oldExpected,false)),'元市町全項目');
 assert.equal(actual.municipality_amount_yen,oldExpected.municipality_amount_yen,'元市町額');
 assert.deepEqual(canonical(rows(actual,true)),canonical(rows(expected,true)),'国県原AST採否');
 assert.equal(actual.national_amount_yen,expected.national_amount_yen);assert.equal(actual.prefecture_amount_yen,expected.prefecture_amount_yen);
 assert.equal(actual.total_amount_yen,expected.national_amount_yen+expected.prefecture_amount_yen+oldExpected.municipality_amount_yen);
}
export function assertUpdatedLiteral(actual,c,input,rules){
 const expected=cases.get(key(normalize(input)));assert(expected,'独立backend入力不存在');
 const oldMunicipalIds=c.included_rule_ids.filter(id=>rules.find(r=>r.id===id)?.government_level==='municipality');
 assert.deepEqual(actual.included_programs.filter(r=>r.government_level==='municipality').map(r=>r.id),oldMunicipalIds,'元固定市町採用');
 assert.equal(oldMunicipalIds.length,c.included_rule_ids.length,'元固定期待は市町成分のみ');
 assert.equal(actual.municipality_amount_yen,c.expected_yen,'元固定市町額');
 assert.equal(actual.municipality_amount_yen,expected.municipality_amount_yen,'独立backend市町額');
 assert.deepEqual(canonical(rows(actual,true)),canonical(rows(expected,true)),'国県原AST採否');
 assert.equal(actual.total_amount_yen,expected.total_amount_yen);
}
