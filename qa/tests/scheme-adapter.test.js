import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {receiveSchemeRules,receiveSchemeListing,prepareSubsidyData,resolveSchemeRecordId} from '../../data/src/scheme-adapter.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {amountSummary,matchesReception} from '../../site/data/src/model.js';

function fixture() {
  const a={id:'a',cap:100},b={id:'b',conflict_program_ids:['a']},c={id:'c',reason:'unconfirmed'};
  return {subsidy_schemes:[{record_id:'parent',branches:[{branch_id:'pv',diagnostic_rule_ids:['a','b']},{branch_id:'battery',diagnostic_rule_ids:['a']}],diagnostic_rules:[a,b],legacy_municipal_rules:[]}],subsidy_scheme_links:{diagnostic:{a:{record_id:'parent',branch_ids:['pv','battery']},b:{record_id:'parent',branch_ids:['pv']},c:{record_id:null,branch_ids:[]}},legacy_municipal:{},diagnostic_rule_order:['b','c','a'],legacy_municipal_rule_order:[],unassigned_diagnostic_rules:[c]}};
}

test('旧親IDは明示された現行親へ直接対応し，循環・欠落・衝突を拒否する',()=>{
  const d=fixture();d.subsidy_scheme_links.record_id_aliases={old:'parent'};
  assert.equal(resolveSchemeRecordId(d,'old'),'parent');
  assert.equal(resolveSchemeRecordId(d,'parent'),'parent');
  assert.equal(resolveSchemeRecordId(d,'missing'),null);
  assert.deepEqual(receiveSchemeRules(d).diagnostic.map(r=>r.id),['b','c','a']);
  for(const aliases of [{old:'missing'},{old:'older',older:'parent'},{old:'old'},{parent:'parent'}]){
    d.subsidy_scheme_links.record_id_aliases=aliases;
    assert.throws(()=>receiveSchemeRules(d),/直接対応/);
  }
});
test('親の規則を指定順に一度だけ評価し，未配置規則と旧IDを保持する',()=>{
  const d=fixture();d.diagnostic_subsidy_programs=[{id:'poison'}];
  const r=receiveSchemeRules(d);
  assert.deepEqual(r.diagnostic.map(x=>x.id),['b','c','a']);
  assert.deepEqual(r.diagnostic[0].conflict_program_ids,['a']);
  assert.deepEqual(prepareSubsidyData(d).diagnostic_subsidy_programs,r.diagnostic);
  const old={schema_version:'11.46.0',diagnostic_subsidy_programs:[{id:'old'}]};
  assert.equal(prepareSubsidyData(old),old);
  assert.throws(()=>prepareSubsidyData({schema_version:'12.0.0'}),/契約/);
});
test('親重複・区分参照不整合・順序欠損を拒否し旧flatへ戻らない',()=>{
  let d=fixture();d.subsidy_schemes.push(d.subsidy_schemes[0]);assert.throws(()=>receiveSchemeRules(d),/制度年度ID/);
  d=fixture();d.subsidy_scheme_links.diagnostic.a.branch_ids=['pv'];assert.throws(()=>receiveSchemeRules(d),/区分参照/);
  d=fixture();d.subsidy_scheme_links.diagnostic_rule_order=['b','a'];assert.throws(()=>receiveSchemeRules(d),/順序/);
});
test('隔離出力の親規則展開は現行の全規則・順序と一致する',{skip:!process.env.HARETOKU_SCHEME_REVIEW_FILE},async()=>{
  const draft=JSON.parse(await readFile(process.env.HARETOKU_SCHEME_REVIEW_FILE,'utf8'));
  const current=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
  const result=receiveSchemeRules(draft);
  assert.deepEqual(result.diagnostic,current.diagnostic_subsidy_programs);
  assert.deepEqual(result.municipal,current.municipal_subsidy_programs);
  const listing=receiveSchemeListing(draft);
  assert.equal(listing.groups.length,draft.subsidy_schemes.length);
  const catalogIds=new Set(current.subsidy_catalog.rows.map(row=>row.branch_id));
  const migratedIds=new Set([...listing.groups.flatMap(g=>g.branches.map(b=>b.branch_id)),...listing.retained.map(x=>x.row.branch_id)]);
  for(const id of catalogIds)assert.ok(migratedIds.has(id),id);
  for(const row of current.subsidy_catalog.rows.filter(r=>r.amount.display_text)){
    const branch=listing.groups.flatMap(g=>g.branches).find(b=>b.branch_id===row.branch_id) || listing.retained.find(x=>x.row.branch_id===row.branch_id)?.row;
    assert.equal(branch.amount.display_text,row.amount.display_text,row.branch_id);
  }
  const extra=[...migratedIds].filter(id=>!catalogIds.has(id));
  const extraGroups=listing.groups.flatMap(g=>g.branches.filter(b=>extra.includes(b.branch_id)).map(()=>g.government_level));
  assert.deepEqual(extraGroups.reduce((counts,level)=>(counts[level]=(counts[level]||0)+1,counts),{}),{national:3,prefecture:28});
  const kuma=selectSchemeGroups(draft,'38','38386').filter(g=>g[0].government_level==='municipality');
  assert.equal(kuma.length,2);
  assert.equal(kuma.filter(g=>matchesReception(g,'unknown')).length,1);
  assert.match(kuma.flatMap(g=>g.map(amountSummary)).join('\n'),/上限15万円/);
  assert.ok(selectSchemeGroups(draft,'38','01100').every(g=>g[0].government_level!=='municipality'));
});
test('同名でも別親は統合せず，親内の枝を維持する',()=>{
 const d={subsidy_schemes:[{record_id:'a',scheme_name:'同名',branches:[{branch_id:'pv'},{branch_id:'battery'}]},{record_id:'b',scheme_name:'同名',branches:[{branch_id:'other'}]}],subsidy_scheme_links:{retained_branches:[]},subsidy_catalog:{rows:[]}};
 assert.deepEqual(receiveSchemeListing(d).groups.map(x=>x.record_id),['a','b']);
 d.subsidy_scheme_links.retained_branches=[{record_id:null,branch_id:'pv',catalog_branch_id:'pv'}];
 assert.throws(()=>receiveSchemeListing(d),/重複/);
});
