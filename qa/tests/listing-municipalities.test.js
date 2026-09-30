import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {listingMunicipalities,listingNotes,diagnosisDescription,diagnosisUrl,conditionSections} from '../../site/data/src/model.js';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
const data=JSON.parse(readFileSync(new URL('../../data/input/public-data.json',import.meta.url)));
const fixture=JSON.parse(readFileSync(new URL('../fixtures/six-town-display-conditions.json',import.meta.url)));
test('隔離6町11枝の公式条件・留保・仮定を分類どおり保持し，rawを表示しない',()=>{
  let count=0;
  for(const city of fixture.listing_municipalities) {
    const groups=selectSchemeGroups(fixture,'01',city.municipality_code);
    for(const group of groups)for(const p of group) {
      count++;
      const source=fixture.subsidy_schemes.flatMap(s=>s.branches).find(b=>b.branch_id===p.id)||fixture.subsidy_catalog.rows.find(b=>b.branch_id===p.id);
      assert.deepEqual(p._catalog.conditions.official,source.official_conditions||source.conditions.official);
      assert.deepEqual(p._catalog.conditions.model_assumptions,source.model_assumptions??source.conditions?.model_assumptions??[]);
      const sections=conditionSections([p]);
      const official=sections.find(s=>s.label==='補助条件');
      assert.deepEqual(official.lines,p._catalog.conditions.official);
      assert.deepEqual(sections.find(s=>s.label==='未確認事項')?.lines||[],source.gaps||[]);
      assert.deepEqual(sections.find(s=>s.label==='モデル上の仮定')?.lines||[],p._catalog.conditions.model_assumptions);
      p._catalog.conditions.raw={mixed:'RAW_SENTINEL'};
      assert.doesNotMatch(JSON.stringify(conditionSections([p])),/RAW_SENTINEL/);
      const assumption=sections.find(s=>s.label==='モデル上の仮定');
      if(assumption)assert.match(assumption.note,/計算に含めていることを示すものではありません/);
    }
  }
  assert.equal(count,11);
});
test('同文でも分類を跨いで統合せず，異なる枝の留保・仮定を共通化しない',()=>{
  const group=['太陽光','蓄電池'].map((label,i)=>({_catalog:{branch_label:label,conditions:{official:['同一文'],model_assumptions:i?[]:['片枝だけの仮定']},gaps:i?['同一文']:['太陽光だけの未確認']}}));
  const sections=conditionSections(group);
  assert.deepEqual(sections[0].lines,['共通：同一文']);
  assert.deepEqual(sections[1].lines,['太陽光：太陽光だけの未確認','蓄電池：同一文']);
  assert.deepEqual(sections[2].lines,['太陽光：片枝だけの仮定']);
  assert.deepEqual(conditionSections([{_catalog:{conditions:{official:['確認済み']},gaps:[]}}]).map(s=>s.label),['補助条件']);
});
test('保留catalogの仮定も落とさず，公式条件へ混ぜない',()=>{
  const isolated=structuredClone(fixture);
  const row=isolated.subsidy_catalog.rows.find(r=>r.municipality_code==='01433');
  row.conditions.model_assumptions=['検査用の仮定'];
  const sections=conditionSections(selectSchemeGroups(isolated,'01','01433')[0]);
  assert.deepEqual(sections.find(s=>s.label==='モデル上の仮定').lines,['検査用の仮定']);
  assert(!sections.find(s=>s.label==='補助条件').lines.includes('検査用の仮定'));
});
test('6町の制度を表示し，採用済み自治体だけ診断リンクへ渡す',()=>{
  for(const code of ['01371','01394','01433','01437','01457','01662']) {
    assert(listingMunicipalities(data).some(m=>m.municipality_code===code));
    const supported=['01394','01662'].includes(code);
    assert.equal(data.municipalities.some(m=>m.municipality_code===code),supported);
    const rows=selectSchemeGroups(data,'01',code).flat().filter(p=>p.municipality_code===code);
    assert(rows.length>0,code);
    if(code==='01433') {
      assert.equal(rows[0]._catalog.target_year,'2016年度');
      assert.match(listingNotes(rows[0]).join(''),/過年度.*現在も利用できることを示すものではありません/);
    }
    assert.match(diagnosisDescription(data,'01',code),supported?/すべてを計算に含むわけではありません/:/補助制度は診断に含まれません/);
    const url=new URL(diagnosisUrl(data,'01',code),'http://localhost');
    assert.equal(url.searchParams.get('prefecture'),'01');
    assert.equal(url.searchParams.get('municipality_code'),supported?code:null);
  }
});
test('年度だけで過年度扱いせず，明示履歴区分に限って注記する',()=>{
  assert.deepEqual(listingNotes({_catalog:{target_year:'2025年度'}}),[]);
  assert.doesNotMatch(diagnosisDescription(data,'01'),/制度なし|受給でき|すべて.*含まれます/);
});
test('旧制度注意は明示属性だけから表示し，対象年度を補完しない',()=>{
  const notice='終了した旧制度の情報です．保存要綱の対象年度は不明です．現在の別制度の有無を示すものではありません．';
  const p={_catalog:{target_year:'',historical_context:{status:'closed_legacy_scheme',notice}}};
  assert.deepEqual(listingNotes(p),[notice]);
  assert.equal(p._catalog.target_year,'');
  assert.deepEqual(listingNotes({...p,_retentionStatus:'historical_records'}),[notice]);
  assert.deepEqual(listingNotes({_catalog:{historical_context:{status:'unknown',notice}}}),[]);
  assert.deepEqual(listingNotes({_catalog:{historical_context:{status:'closed_legacy_scheme',notice:''}}}),[]);
  assert.deepEqual(listingNotes({id:'historical',_catalog:{target_year:'2020年度',conditions:{raw:{rationale_and_gaps:'旧制度'}}}}),[]);
  const isolated=structuredClone(fixture);
  const history={status:'closed_legacy_scheme',notice};
  isolated.subsidy_schemes.find(s=>s.municipality_code==='01662').branches[0].historical_context=history;
  isolated.subsidy_catalog.rows.find(r=>r.municipality_code==='01433').historical_context=history;
  for(const code of ['01662','01433'])assert.deepEqual(listingNotes(selectSchemeGroups(isolated,'01',code)[0][0]),[notice]);
});
test('旧版の自治体参照と診断可能な地域の引継ぎを維持する',()=>{
  const city=data.municipalities.find(m=>m.prefecture_code==='01');
  const old={municipalities:[city]};
  assert.deepEqual(listingMunicipalities(old),[city]);
  assert.equal(new URL(diagnosisUrl(old,'01',city.municipality_code),'http://localhost').searchParams.get('municipality_code'),city.municipality_code);
  assert.equal(new URL(diagnosisUrl(old,'02',city.municipality_code),'http://localhost').searchParams.has('municipality_code'),false);
  assert.deepEqual(listingMunicipalities({...old,listing_municipalities:[]}),[]);
});
