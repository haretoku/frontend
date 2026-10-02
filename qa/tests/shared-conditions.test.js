import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import {selectSchemeGroups} from '../../site/data/src/scheme-model.js';
import {diagnosticPilotTerms} from '../../site/simulator/src/diagnostic-display-pilot.js';
import {subsidyTermsIndex} from '../../site/simulator/src/subsidy-amount-presentation.js';
const data=JSON.parse(fs.readFileSync(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));

test('森町の対象可否・未確認事項を一覧と診断の同じ文型へ保持する',()=>{
  const programs=selectSchemeGroups(data,'01','01345').flat().filter(p=>p.id.startsWith('hokkaido-mori-'));
  const index=subsidyTermsIndex(data,{prefecture_code:'01',municipality_code:'01345'});
  assert.equal(programs.length,2);
  for(const p of programs){
    const terms=diagnosticPilotTerms(data,p);
    assert.equal(terms.conditionDisplayComplete,true);
    assert.match(terms.commonSupplement.join('\n'),/新たに住宅用太陽光発電設備/);
    assert.match(terms.commonSupplement.join('\n'),/交付決定後に着工.*2027年2月末/);
    for(const id of p._catalog.diagnostic_rule_ids){
      assert.deepEqual(index.get(id)[0].pilotCommonSupplement,terms.commonSupplement);
      assert.deepEqual(index.get(id)[0].pilotSections,terms.sections);
    }
    assert.match(terms.sections.flatMap(s=>s.supplement).join('\n'),/税込・税抜/);
  }
  const battery=diagnosticPilotTerms(data,programs.find(p=>p.id.endsWith('-battery')));
  assert.match(battery.commonSupplement.join('\n'),/常時接続.*充放電/);
  assert.match(battery.commonSupplement.join('\n'),/他制度との併用.*予算残.*定格・実効/);
  assert.doesNotMatch(battery.commonSupplement.join('\n'),/仮定します|維持管理について|検針票/);
});

test('根拠条件変更時に古い選択を使わず，未対応制度の原文を非表示へ昇格させない',()=>{
  const p=selectSchemeGroups(data,'01','01345').flat().find(p=>p.id==='hokkaido-mori-solar');
  const changed=structuredClone(p);changed._catalog.official_conditions.push('異なる公式条件');
  assert.equal(diagnosticPilotTerms(data,changed),null);
  const unselected=selectSchemeGroups(data,'01','01429').flat().find(p=>p.id==='hokkaido-kuriyama-solar');
  assert.equal(diagnosticPilotTerms(data,unselected)?.conditionDisplayComplete??false,false);
});

test('江別の3区分で費用閾値・接続・国併用と世帯条件を保持する',()=>{
  const programs=selectSchemeGroups(data,'01','01217').flat().filter(p=>p.id.startsWith('hokkaido-ebetsu-'));
  const index=subsidyTermsIndex(data,{prefecture_code:'01',municipality_code:'01217'});
  assert.equal(programs.length,3);
  for(const p of programs){
    const terms=diagnosticPilotTerms(data,p);assert.equal(terms.conditionDisplayComplete,true);
    const prose=terms.commonSupplement.join('\n');
    assert.match(prose,/国の補助金と併用/);assert.match(prose,/2023年7月14日以降.*見積日/);
    assert.match(prose,/同一設備.*1世帯.*申請年度に1回/);
    assert.doesNotMatch(prose,/実費との小さい方|計算上併用可能/);
    assert.ok(terms.sections.every(section=>section.supplement.some(text=>text.includes('100,000円超'))));
    for(const id of p._catalog.diagnostic_rule_ids)assert.deepEqual(index.get(id)[0].pilotCommonSupplement,terms.commonSupplement);
  }
  const singleBattery=diagnosticPilotTerms(data,programs.find(p=>p.id==='hokkaido-ebetsu-battery-addition'));
  assert.match(singleBattery.commonSupplement.join('\n'),/リチウムイオン.*太陽光に常時接続/);
  assert.doesNotMatch(singleBattery.commonSupplement.join('\n'),/太陽光の製品・接続/);
});
