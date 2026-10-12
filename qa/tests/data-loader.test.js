import test from 'node:test';
import assert from 'node:assert/strict';
import {loadFrontendData,loadJson} from '../../data/src/data-loader.js';
import {loadPublicData} from '../helpers/subsidy-fixture.js';

// 共通取得へ接続した一覧・診断は，HTTP失敗・異版を受け入れない．
test('公開データ取得はHTTP失敗を伝え，版不一致を拒否する',async()=>{
 const previous=globalThis.fetch;
 const data=loadPublicData();
 try {
  globalThis.fetch=async()=>({ok:false,status:503});
  await assert.rejects(loadJson('https://example.invalid/data'),/503/);
  for(const field of ['schema_version','data_version']) {
   const metadata={schema_version:data.schema_version,data_version:data.data_version,[field]:'changed'};
   globalThis.fetch=async url=>({ok:true,json:async()=>url==='data'?data:metadata});
   await assert.rejects(loadFrontendData({publicDataUrl:'data',metadataUrl:'metadata'}),/一致しません/);
  }
  globalThis.fetch=async url=>({ok:true,json:async()=>url==='data'?data:{schema_version:data.schema_version,data_version:data.data_version}});
  const received=await loadFrontendData({publicDataUrl:'data',metadataUrl:'metadata'});
  assert.equal(received.publicData.subsidy_schemes,data.subsidy_schemes);
  const prefecture=received.publicData.diagnostic_subsidy_programs.find(p=>p.id==='nagano-roof-solar-battery-unresolved-2026');
  assert.equal(prefecture.machine_rule,'common_equipment_branch_ast/1');
  assert.notEqual(received.publicData.diagnostic_subsidy_programs,data.diagnostic_subsidy_programs);
 } finally {globalThis.fetch=previous;}
});
