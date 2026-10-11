import test from 'node:test';
import assert from 'node:assert/strict';
import {selectPrograms,groupPrograms,amountSummary,targetSummary,groupedTargetSummary,groupedEquipmentSummary,equipmentLabel,applicationPeriod,matchesReception} from '../../site/data/src/model.js';
const program=(id,level='municipality',city='38386')=>({id,government_level:level,prefecture_code:'38',municipality_code:city,program_name:'同名制度',application_status:'closed',expense_scopes:['battery']});
const row=(id,extra={})=>({branch_id:id,government_level:'municipality',prefecture_code:'38',municipality_code:'38386',scheme_name:'同名制度',target_year:'2026',target_equipment:['蓄電池'],amount:{raw_text:'min(C_B-S,150000) 内部メモ',display_text:'他補助控除後の費用，上限15万円，千円未満切捨て',evidence_status:'confirmed'},application_status:'受付対象外',application_start:[],application_end:[],conditions:{official:['新品設備が対象'],model_assumptions:['仮に全条件を満たす'],raw:{adopted_other_conditions:'内部混在文'}},gaps:['税区分は未確認'],evidence_urls:['https://example.com/official'],checked_at:'2026-09-21',diagnostic_program_ids:[id],...extra});
const data=rows=>({prefectures:[{code:'38'}],municipalities:[{prefecture_code:'38',municipality_code:'38386'}],diagnostic_subsidy_programs:[program('national','national'),program('pref','prefecture'),program('energy'),program('orphan')],subsidy_catalog:{scope:'municipality',display_policy:'reviewed_display_text_only',rows}});

test('国県と未対応枝を維持し，地域を確認したID対応だけで置換・重複排除する',()=>{
 const r=row('energy');const d=data([r,r,row('old',{target_year:'2025',diagnostic_program_ids:[]}),row('wrong',{municipality_code:'00000',diagnostic_program_ids:['orphan']})]);
 const found=selectPrograms(d,'38','38386');
 assert.deepEqual(found.map(p=>p.id),['national','pref','orphan','energy','old']);
 assert.equal(groupPrograms(found).length,5);
 assert.deepEqual(selectPrograms(d,'38').map(p=>p.id),['national','pref']);
 assert.deepEqual(selectPrograms(data([]),'38','38386').map(p=>p.id),['national','pref','energy','orphan']);
});
test('終了でも既知額を保持し，原式・モデル仮定・混在文を利用者向け条件へ出さない',()=>{
 const p=selectPrograms(data([row('energy')]),'38','38386').find(p=>p._catalog);
 assert.match(amountSummary(p),/他補助控除後.*15万円.*千円/);
 assert.equal(matchesReception([p],'closed'),true);assert.equal(matchesReception([p],'accepting'),false);
 assert.equal(targetSummary(p),'新品設備が対象\n税区分は未確認');
 assert.doesNotMatch(amountSummary(p)+targetSummary(p),/C_B|内部|仮に/);
});
test('同一地域・対応IDの検収済み要約だけfallbackし，真の不明には転用しない',()=>{
 const d=data([row('new-id',{diagnostic_program_ids:['ehime-38386-energy-2026'],amount:{evidence_status:'not_classified',display_text:null}})]);
 d.diagnostic_subsidy_programs.push(program('ehime-38386-energy-2026'));
 const get=()=>selectPrograms(d,'38','38386').find(p=>p.id==='new-id');
 assert.match(amountSummary(get()),/他の補助金を差し引いた額と15万円/);
 assert.match(applicationPeriod(get()),/30日以内/);
 d.subsidy_catalog.rows[0].amount.evidence_status='unconfirmed';
 assert.equal(amountSummary(get()),'補助額は未確認');
});
test('受付期間の複数枝を架空の一期間へ結合しない',()=>{
 const r=row('energy',{application_start:[{date:'2026-04-01'}],application_end:[{date:'2026-06-30'},{date:'2026-10-30'}]});
 const p=selectPrograms(data([r]),'38','38386').find(p=>p._catalog);
 assert.equal(applicationPeriod(p),'申請期間：公式情報をご確認ください．');
});

test('preparingの区分へ旧IDの金額・条件・期間説明を復活させない',()=>{
 const p={id:'new-branch',expense_scopes:['battery'],_catalog:{display_basis:'preparing',amount:{display_text:null,evidence_status:'not_classified'},conditions:{official:[]},gaps:[],application_start:[{date:'2026-04-01'}],application_end:[{date:'2027-03-15'}]},_legacy:[{id:'rokkasho-new-energy-battery-2026'}]};
 assert.equal(amountSummary(p),'表示内容を整理中');
 assert.equal(targetSummary(p),'対象：蓄電池\n補助条件：表示内容を整理中です．公式情報をご確認ください．');
 p._catalog.gaps=['併用条件は未確認'];
 assert.match(targetSummary(p),/併用条件は未確認/);
 assert.equal(applicationPeriod(p),'申請開始：2026-04-01\n申請期限：2027-03-15');
});
test('明示区分名でカーポートと屋根置きの条件を分離し，IDや名称から推測しない',()=>{
 const group=[
  {id:'opaque-a',expense_scopes:['solar'],_catalog:{branch_label:'屋根置き太陽光',conditions:{official:['屋根への設置','同時申請可能']},gaps:[]}},
  {id:'opaque-b',expense_scopes:['solar'],_catalog:{branch_label:'太陽光搭載カーポート',conditions:{official:['別構造物が必要','同時申請可能']},gaps:[]}}
 ];
 assert.deepEqual(groupedTargetSummary(group),['屋根置き太陽光：屋根への設置','太陽光搭載カーポート：別構造物が必要','共通：同時申請可能']);
 assert.deepEqual(groupedEquipmentSummary(group,p=>p.id==='opaque-a'?'受付中':'受付状況未確認'),['屋根置き太陽光：受付中','太陽光搭載カーポート：受付状況未確認']);
 assert.equal(equipmentLabel({id:'carport',expense_scopes:['solar']}),'太陽光');
});

test('設備別の条件はラベルで区別し，同一条件だけ共通化する',()=>{
 const rows=[row('pv',{target_equipment:['太陽光'],conditions:{official:['10kW未満','同時申請可能']},gaps:[]}),row('battery',{conditions:{official:['2kWh以上','同時申請可能']},gaps:[]})];
 const group=selectPrograms(data(rows),'38','38386').filter(p=>p._catalog);
 assert.deepEqual(groupedTargetSummary(group),['太陽光：10kW未満','蓄電池：2kWh以上','共通：同時申請可能']);
 group[0]._catalog.amount.display_text='上限3万円．';group[0]._catalog.amount.evidence_status='partial';
 assert.doesNotMatch(amountSummary(group[0]),/．．/);
});

// 国県公開候補の受領契約と既存診断の保持を，実ファイルで確認する．
const protectedOriginalSections = {
  "calculation": "f290a2daffed1e0b79ba19039cd6776a8329b23f896bd1da39077513f5096972",
  "scenarios": "0f0fa0a86e7c61eea2691f8c0bd2d0ca5f9c72c7c00c19e303d761def9374914",
  "prefectures": "cf428763d22620b6b81b00bf3927e443c5b404d663729cc3e28f8dc54b55a5c5",
  "municipalities": "102f2ae64f703b303bd7b5849d2e18393646e962484c642132ae8a4bc10fc487",
  "municipal_subsidy_programs": "6162fe5405e4648acb5cb473b5feb0e1d9d611c9d31f73303d3c1e8ababe01e9",
  "diagnostic_subsidy_programs": "8360fbc2d4dc75d6052ca713a1ee8f8d81ecd6384a30fff8fb9115287e28ebca",
  "municipality_subsidy_exploration": "a1ff15acfa8d72ca0f66a669acc612c1388a40e97be78c39b696112ef881a484",
  "listing_municipalities": "a4d0940cd2989b07fe7ac691898fa2ff9b70a1c85850e08b7abd51d62009aece"
};
const canonicalReleaseValue = value => Array.isArray(value) ? '[' + value.map(canonicalReleaseValue).join(',') + ']' : value && typeof value === 'object' ? '{' + Object.keys(value).sort().map(key => JSON.stringify(key) + ':' + canonicalReleaseValue(value[key])).join(',') + '}' : JSON.stringify(value);
const readReleaseJson = async name => JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../../data/input/' + name + '.json', import.meta.url), 'utf8'));
test('国県受領後も非補助金計算・既存市町村保存契約は受領前と同値', async () => {
 const {createHash} = await import('node:crypto');
 const data = await readReleaseJson('public-data');
 for (const [key, expected] of Object.entries(protectedOriginalSections)) assert.equal(createHash('sha256').update(canonicalReleaseValue(data[key])).digest('hex'), expected, key);
 const metadata = await readReleaseJson('metadata');
 assert.equal(data.schema_version, metadata.schema_version);assert.equal(data.data_version, metadata.data_version);
});
test('実frontendで同版の国県60区分を両表示consumerが受領する', async () => {
 const {prepareSubsidyData} = await import('../../data/src/scheme-adapter.js');
 const {receiveHareDisplayRecords} = await import('../../site/shared/hare-display-record.js');
 const {receiveDiagnosticDisplayRecords} = await import('../../site/simulator/src/diagnostic-display-record.js');
 const data = prepareSubsidyData(await readReleaseJson('public-data'));
 const [hare, hareBinding, diagnostic, diagnosticBinding] = await Promise.all(['hare-display-table','hare-display-binding','diagnostic-display-table','diagnostic-display-binding'].map(readReleaseJson));
 assert.equal(receiveHareDisplayRecords(data, hare, hareBinding).size, 60);
 assert.equal((await receiveDiagnosticDisplayRecords(data, diagnostic, diagnosticBinding, hare)).size, 60);
 assert.throws(() => receiveHareDisplayRecords(data, hare, {...hareBinding, public_data_version:'wrong-version'}));
 await assert.rejects(receiveDiagnosticDisplayRecords(data, diagnostic, {...diagnosticBinding, hare_payload_sha256:'0'.repeat(64)}, hare));
});

test('新東京県契約の接続でも既存市の算入・開始前候補・非算入・未知額を保持する', async () => {
 const {prepareSubsidyData} = await import('../../data/src/scheme-adapter.js');
 const {connectDiagnosticSubsidy} = await import('../../site/simulator/src/diagnostic-subsidy.js');
 const {calculateEstimate} = await import('../../site/simulator/src/calculator.js');
 const data = prepareSubsidyData(await readReleaseJson('public-data'));
 for (const [code,id] of [['13207','akishima-energy-2026'],['13214','kokubunji-energy-2026']]) {
  const input = {prefectureCode:'13',municipalityCode:code,housingAge:'existing',equipmentPackage:'solar_plus_standard_battery',capacityKw:4,batteryCapacityKwh:9.5,solarCost:1324400,batteryCost:1149500,batteryEquipmentCost:1054500};
  const included={id:'retained-known',government_level:'municipality',amount_yen:53000};
  const candidate={id,government_level:'municipality',amount_yen:null,application_status:'scheduled'};
  const excluded={id:'retained-excluded',government_level:'municipality',amount_yen:null,application_status:'closed'};
  const legacy={municipality_amount_yen:53000,total_amount_yen:53000,included_programs:[included],candidate_programs:[candidate],excluded_programs:[excluded]};
  const result=connectDiagnosticSubsidy(legacy,data,input,true,[]).breakdown;
  assert.equal(result.municipality_amount_yen,53000);
  assert.equal(result.total_amount_yen,result.national_amount_yen+result.prefecture_amount_yen+53000);
  assert.deepEqual(result.included_programs.find(row=>row.id===included.id),included);
  assert.deepEqual(result.candidate_programs.find(row=>row.id===id),candidate);
  assert.deepEqual(result.excluded_programs.find(row=>row.id===excluded.id),excluded);
  assert.equal(connectDiagnosticSubsidy({...legacy,municipality_amount_yen:null,total_amount_yen:null},data,input,true,[]).breakdown.total_amount_yen,null);
  const actual=calculateEstimate({...input,systemCapacityKw:4,monthlyElectricityBillYen:12000},data).scenarios.find(row=>row.scenario==='standard').subsidy_breakdown;
  assert.equal(actual.candidate_programs.find(row=>row.id===id)?.application_status,'scheduled');
 }
});
