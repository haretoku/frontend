import { kansaiBelowMinimumCost, kansaiFormulaComponents, kansaiResidualItem, kansaiResidualAmount } from './kansai-formula.js';
import { preprocessCapacity } from './capacity-preprocessing.js';
const floor10000 = value => Math.floor(value / 10000) * 10000;
const floor1000 = value => Math.floor(value / 1000) * 1000;
const sum = values => values.reduce((a,b)=>a+b,0);
function compare(a,b) {
 if(Array.isArray(a)&&Array.isArray(b)) { for(let i=0;i<Math.min(a.length,b.length);i++){const c=compare(a[i],b[i]);if(c)return c;} return Math.sign(a.length-b.length); }
 return a>b?1:a<b?-1:0;
}
function* permutations(items) { if(!items.length){yield [];return;} for(let i=0;i<items.length;i++) for(const rest of permutations(items.filter((_,j)=>j!==i))) yield [items[i],...rest]; }
export function gunmaProgramAReference(capacityKw,batteryCapacityKwh=null,batteryCost=null,highCapacityCellCategory=null) {
 const solarOutput=Math.floor(capacityKw);if(solarOutput<1||solarOutput>=10)return null;
 const result={solar_output_kw:solarOutput,solar_yen:70000,battery_yen:null,total_yen:70000,battery_eligibility:'not_requested'};
 if(batteryCapacityKwh===null&&batteryCost===null)return result;
 if(batteryCapacityKwh===null||batteryCost===null)throw Error('群馬県事業Aの蓄電池容量と対象経費は同時に指定してください．');
 const rated=preprocessCapacity(batteryCapacityKwh,'floor_0_1_kw');if(rated<1){result.battery_eligibility='capacity_below_minimum';return result;}
 const unit=batteryCost/rated;let eligible,threshold;
 if(unit<=141000){eligible=true;threshold=141000;}else if(unit>160000){eligible=false;threshold=160000;}else if(highCapacityCellCategory===null){return {...result,battery_eligibility:'cell_category_unconfirmed',total_yen:null,rated_capacity_kwh:rated,unit_cost_yen_per_kwh:unit};}else{threshold=highCapacityCellCategory?160000:141000;eligible=unit<=threshold;}
 Object.assign(result,{rated_capacity_kwh:rated,unit_cost_yen_per_kwh:unit,battery_unit_price_limit_yen_per_kwh:threshold});
 if(!eligible){result.battery_eligibility='unit_price_above_limit';return result;}
 result.battery_eligibility='eligible';result.battery_yen=floor1000(batteryCost/3);result.total_yen=70000+result.battery_yen;return result;
}
export function gunmaProgramBReference(batteryCapacityKwh,batteryCost) {
 const rated=preprocessCapacity(batteryCapacityKwh,'floor_0_1_kw');if(rated<1)return null;
 const cost=Math.min(batteryCost,141000*rated);return {rated_capacity_kwh:rated,eligible_cost_yen:Math.trunc(cost),battery_yen:floor1000(cost/3)};
}
export function diagnosticComponents(program, input) {
 const {housingAge:h,equipmentPackage:e,capacityKw:k,batteryCapacityKwh:b,solarCost:s,batteryCost:c,batteryEquipmentCost:bc}=input;
 if(!program.housing_ages.includes(h)||!program.equipment_packages.includes(e))return null;
 const battery=e==='solar_plus_standard_battery', components={}, details={};
 switch(program.machine_rule){
 case 'kansai_municipal_formula': return kansaiFormulaComponents(program,input);
 case 'kansai_municipal_unresolved': return null;
 case 'national_dr_battery_closed':
 case 'municipal_unconfirmed_not_included':
 case 'miyagi_smart_energy_scheduled':
 case 'akita_residential_reform_battery_unresolved':
 case 'yamagata_mirakuru_battery_non_fit_or_post_fit':
 case 'yamagata_self_consumption_solar_non_fit':
 case 'kanagawa_residential_solar_battery_closed':
 case 'fukushima_self_consumption_solar_non_fit':
 case 'niigata_snow_country_zeh_closed_non_fit':
 case 'ishikawa_residential_solar_battery_non_fit':
 case 'nagano_roof_solar_battery_unresolved':
 case 'shiga_priority_non_fit':
 case 'hyogo_awaji_battery_region_unavailable':
 case 'nara_smart_house_battery_closed':
 case 'tokushima_residential_solar_battery_non_fit':
 case 'kagawa_existing_home_battery_non_fit':
 case 'kagawa_priority_solar_battery_non_fit':
 case 'oita_self_consumption_solar_battery_closed':
 case 'miyazaki_solar_battery_non_fit':
 return null;
 case 'toyama_noncash_solar':
 components.solar=100000;
 Object.assign(details,{benefit_type:'noncash_points_equivalent',
 eligible_product_assumption:'地域協力店等の2倍条件を満たし，税抜・値引後製品本体価格が100,000円を超える適格製品を採用するユーザー承認済み仮定．',
 cost_mapping_note:'税込工事込の太陽光設置総額から製品本体価格を逆算又は証明していない．'});break;
 case 'nagano_roof_solar_battery':
 components.solar=Math.min(50000,Math.floor(s/1100)*1000);
 components.battery=Math.min(150000,Math.floor(c/1100)*1000);
 Object.assign(details,{
 battery_capacity_mapping_assumption:'入力蓄電池容量を制度対象容量へ対応させて4 kWh以上を判定するユーザー承認済み仮定．公式容量種別の確認済みを意味しない．',
 tax_exclusive_cost_mapping:'税込モデル設置費を1.1で除した値を，各設備の税抜対象費候補へ対応する．',
 other_subsidy_treatment:'同じ費目の他補助は組合せ配分で対象経費残額から控除する．'});break;
 case 'hyogo_awaji_battery': {
 const capacity=preprocessCapacity(b,'floor_0_1_kw');
 const amount=floor1000(Math.min(Math.round(capacity*10)*1500,150000));
 if(amount*11>bc*10)return null;
 components.battery=amount;
 Object.assign(details,{official_capacity_kwh:capacity,
 battery_capacity_mapping_assumption:'入力蓄電池容量を制度対象容量へ対応させるユーザー承認済み仮定．公式容量種別の確認済みを意味しない．',
 tax_exclusive_equipment_cost_yen:bc*10/11,
 equipment_cost_mapping_assumption:'既存モデルの工事費を除く税込機器費111,000円／kWhを1.1で除し，税抜機器購入費候補へ対応する．'});break;
 }
 case 'miyazaki_battery_existing_or_contracted_pv': {
 if(program.diagnostic_scope?.status==='excluded_existing_pv_battery_addition')return null;
 const capacity=preprocessCapacity(b,'floor_0_1_kw');
 components.battery=Math.min(Math.floor(c/3300)*1000,Math.round(capacity*10)*5000,500000);
 Object.assign(details,{official_capacity_kwh:capacity,
 contract_sequence_assumption:'太陽光を先行契約し，蓄電池交付決定後に蓄電池を契約するユーザー承認済み施工順序仮定．',
 tax_exclusive_cost_mapping:'税込モデル蓄電池設置費を1.1で除した値を，税抜購入・設置工事の適格経費候補へ対応する．'});break;
 }
 case 'fukushima_residential_solar_fit': {
 const moduleCapacity=preprocessCapacity(k,'floor_0_01_kw');
 components.solar=floor1000(Math.min(Math.round(moduleCapacity*100)*400,160000));
 details.module_capacity_kw_for_amount=moduleCapacity;
 details.capacity_mapping_assumption='入力Kをモジュール公称最大出力合計M及びPCS適格判定の共通代表値へ対応させるモデル仮定．';
 details.battery_branch='excluded_due_to_non_fit_or_post_fit_requirement';break;
 }
 case 'yamanashi_renewable_energy':
 components.solar=Math.min(30000*Math.floor(k),270000);
 details.solar_capacity_floor_kw=Math.floor(k);
 if(battery){details.rated_battery_capacity_floor_kwh=Math.floor(b);if(Math.floor(b)>=4)components.battery=250000;}break;
 case 'shiga_basic_fit_solar_battery': {
 const combined=s+c;
 // 税抜候補C/1.1/3の千円切捨てはC/3300とし，1.1の二進誤差を避ける．
 const gross=Math.min(90000,Math.floor(combined/3000)*1000);
 const net=Math.min(90000,Math.floor(combined/3300)*1000);
 Object.assign(details,{combined_model_cost_yen:combined,gross_candidate_yen:gross,tax_exclusive_candidate_yen:net,
 official_formula:'PV・蓄電池の税抜対象費合計Cについて1000×floor(min(90000,100000,C/3)/1000)を一度だけ適用．',
 expense_allocation_assumption:'額が税込・税抜候補で一致する場合だけ算入し，制度合計額を組合せ計算上の太陽光費目へ一時対応させる．PV/B別に3分の1又は端数処理をしない．'});
 if(gross!==net)return null;
 components.solar=gross;break;
 }
 case 'daigo_zero_carbon_solar_battery':
 if(k>=10)return null;
 components.solar=floor1000(Math.min(Math.max(0,s)/2,100000));
 if(battery)components.battery=floor1000(Math.min(Math.max(0,c)/2,100000));
 Object.assign(details,{official_formula:'同一費目の他補助控除後対象経費×1/2，上限100,000円，千円未満切捨て．',tax_handling:'approved_assumption_tax_inclusive_model_cost',combined_cap_yen:battery?200000:100000,combined_cap_basis:'approved_assumption_not_official_fact'});
 return {components,details};
 case 'ranzan_residential_solar':
 if(k<1||k>=10)return null;
 components.solar=floor1000(Math.min(Math.max(0,s)/2,50000));
 Object.assign(details,{official_formula:'対象費用×1/2，上限50,000円，千円未満切捨て．',tax_handling:'approved_assumption_tax_inclusive_model_cost'});
 return {components,details};
 case 'saitama_residential_battery':
 components.battery=floor10000(Math.min(100000,bc));
 details.expense_mapping_assumption='既存代表価格の機器費111,000円／kWhだけを税抜購入費へ対応させ，工事費10,000円／kWhを除外する．同じ蓄電池費目の他補助も購入費へ対応するものとして，採用補助合計を購入費以内に制限する．';
 details.battery_purchase_cost_limit_yen=bc;break;
 case 'tochigi_residential_solar_battery_non_fit':
 components.solar=Math.round(Math.min(preprocessCapacity(k,'floor_0_1_kw'),4)*70000);
 components.battery=floor1000(Math.min(c/b,155000)*Math.min(b,5)/3);
 details.reference_only_due_to_non_fit=true;
 details.battery_cost_mapping_assumption='既存代表価格の設備費111,000円／kWhと工事費10,000円／kWhの合計121,000円／kWhを，県の税抜対象経費C_Bへ対応させる．県の公式価格ではない．';break;
 case 'gunma_solar_new_closed_non_fit':{
 const reference=gunmaProgramAReference(k,battery?b:null,battery?c:null);if(!reference)return null;
 components.solar=reference.solar_yen;if(Number.isInteger(reference.battery_yen))components.battery=reference.battery_yen;
 details.reference_only_due_to_closed_non_fit=true;details.reference_formula=reference;
 details.battery_cost_mapping_assumption='既存代表価格121,000円／kWhを税抜本体・蓄電池用PCS・工事費へ対応させる場合も県の公式価格ではない．4,800Ah・セル区分及び共用PCS配賦は入力から推定しない．';break;
 }
 case 'gunma_battery_existing_pv_closed':{
 const reference=gunmaProgramBReference(b,c);if(!reference)return null;
 components.battery=reference.battery_yen;details.reference_only_due_to_closed_existing_pv_addition=true;details.reference_formula=reference;
 details.battery_cost_mapping_assumption='既存代表価格121,000円／kWhの対応は県の公式価格ではない．';break;
 }
 case 'national_zeh_battery':components.battery=floor1000(Math.min(20000*b,bc/3,200000));break;
 case 'national_mirai_eco_battery':components.battery=96000;break;
 case 'tokyo_residential_solar': {
 const basic=h==='existing'?(k<=3.75?Math.min(150000*k,450000):120000*k):(k<=3.6?Math.min(120000*k,360000):100000*k);
 components.solar=Math.min(s,floor1000(basic)+floor1000(90000*k));
 details.unreflected_expenses={flat_roof_rack:'amount_unavailable_not_calculated',waterproofing:'amount_unavailable_not_calculated'};break;
 }
 case 'tokyo_residential_battery':components.battery=floor1000(Math.min(100000*b+100000,c));break;
 case 'tokyo_zero_emi':components.solar=floor1000(Math.min(s,(k<=3.6?Math.min(130000*k,390000):110000*k)+90000*k));if(battery)components.battery=floor1000(Math.min(100000*b,c,1200000));break;
 case 'shinjuku_residential_energy':components.solar=floor1000(Math.min(100000*k,300000,s));if(battery)components.battery=floor1000(Math.min(10000*b,100000,c));details.residual_rounding='not_reapplied_after_other_subsidy_reduction';break;
 case 'hachioji_renewable_energy':{
 const capacity=preprocessCapacity(k,'floor_0_01_kw');const branches=[];
 if(h==='existing')branches.push({id:'general_waitlist',application_status:'waitlist',solar_yen:Math.min(Math.round(capacity*10000),100000)});
 if(!(program.diagnostic_scope?.excluded_branch_ids??[]).includes('special_permitted_solar_carport')) branches.push({id:'special_permitted_solar_carport',application_status:'accepting',solar_yen:Math.min(Math.round(capacity*30000),150000)});
 if(!branches.length)return null;
 for(const branch of branches){branch.battery_yen=battery&&b>=3?30000:0;branch.total_yen=floor1000(Math.min(branch.solar_yen+branch.battery_yen,s+c));}
 const selected=branches.reduce((a,b)=>compare([b.total_yen,b.id],[a.total_yen,a.id])>0?b:a);
 const batteryPart=Math.min(selected.battery_yen,selected.total_yen);components.solar=selected.total_yen-batteryPart;if(batteryPart)components.battery=batteryPart;
 details.selected_branch=selected.id;details.branches=branches;
 details.expense_mapping_assumption='公式のPV・蓄電池合計額を一度だけ千円未満切捨てし，蓄電池同時設置加算を蓄電池費目，残額を太陽光費目へ対応させる概算．';break;
 }
 default:throw Error('未対応の診断用補助計算規則です．'+program.machine_rule);
 }
 const positive=Object.fromEntries(Object.entries(components).filter(([,v])=>v>0));return Object.keys(positive).length?{components:positive,details}:null;
}
function evaluation(p,status,reason,amount,components,details){
 const row={id:p.id,government_level:p.government_level,program_name:p.program_name,calculation_status:status,application_status:p.application_status,amount_yen:amount,official_url:p.official_urls[0],reason_code:reason,required_confirmations:p.required_confirmations,calculation_assumptions:p.calculation_assumptions,combination_status:'assumed_permitted_unverified_unless_explicitly_prohibited',source_ids:p.source_ids};
 const confirmation = {
 housing_age_not_applicable:'入力した新築・既存区分が制度の対象住宅区分と一致しないため算入しない．',
 equipment_package_not_applicable:'入力した設備構成が制度の対象設備と一致しないため算入しない．',
 municipality_not_applicable:'入力した市町村が制度の対象地域ではないため算入しない．',
 eligible_cost_below_minimum:'入力条件から算定した対象経費が制度の最低対象経費を下回るため算入しない．',
 capacity_not_applicable:'入力容量が制度の対象容量範囲と一致しないため算入しない．',
 existing_pv_battery_addition_not_supported:'制度で指定される既設又は先行契約済み太陽光への蓄電池追加経路に該当する必要があり，新規設備を対象とする現行診断では算入しない．',
 regional_eligibility_input_unavailable:'対象地域が県内の一部に限定されるが，現行診断に地域該当性の入力がないため補助額を確定しない．',
 sale_path_not_applicable:'制度が求める非FIT・非FIP又は卒FITの売電経路と，現行の新設FIT売電経路が一致しないため算入しない．',
 application_closed:'受付終了を確認しているため，現在は算入しない．',
 application_suspended:'受付停止を確認しているため，現在は算入しない．',
 application_scheduled:'次回募集の開始前であり，現在は申請できないため補助額を算入しない．',
 calculated_zero_amount:'確認済み算式と開示した計算仮定による算定額が0円のため，補助額を加算しない．',
 application_status_unconfirmed:'現在の受付状態を確認できないため，補助額を算入しない．',
 required_external_structure_or_housing_work:'太陽光・蓄電池とは別の構造物又は住宅工事が制度全体若しくは該当枝の必須条件であるため，診断対象へ算入しない．',
 explicit_combination_prohibition:'採用した制度との明示的な併用禁止により，同じ組合せへ算入しない．',
 expense_scope_exhausted_by_maximum_combination:'採用した組合せで同じ対象経費費目の残額がないため算入しない．',
 expense_scope_limit_in_maximum_combination:'費目別対象経費上限を同時に満たす最大組合せへ算入しない．',
 capacity_definition_input_unavailable:'制度が用いる容量定義と現行入力の容量定義を対応付けられないため，補助額を確定しない．',
 economic_benefit_conversion_policy_unresolved:'ポイントを診断上の経済便益へ換算する方針が未決定のため，診断上の金額を確定しない．',
 dependent_program_unavailable:'必須となる関連制度の新規交付決定を得られないため，現行の新規診断へ算入しない．',
 business_model_or_external_structure_not_supported:'PPA・リース又はカーポート等を前提とする制度であり，現行の本人所有設備モデルへ算入しない．',
 calculation_detail_unconfirmed:'算定に必要な制度詳細を確認できないため，補助額を確定しない．',
 investigation_closed_insufficient_information:'限定調査を終了し，算定に必要な情報を確認できなかったため，今回の診断へ算入しない．制度不存在，受付終了又は0円制度とは扱わない．',
 downside_scenario_excludes_subsidies:'下振れシナリオの収支では補助金を0円とする．'
 }[reason];
 row.required_confirmations = [...(confirmation ? [confirmation] : []), ...p.required_confirmations];
 const branch = details?.branches?.find(item => item.id === details.selected_branch);
 if (branch) row.application_status = branch.application_status ?? 'unknown';
 if(components!=null)row.component_amounts_yen=components;return {...row,...details};
}
export function allocateDiagnosticScope(options,limit,scope=null,detailsById={},priorScopeSubsidies=0){
 if(!options.length)return {total:0,allocation:{}};let best=null;
 const deferred=options.filter(([p])=>p.machine_rule==='daigo_zero_carbon_solar_battery');
 const residual=options.filter(([p])=>['nagano_roof_solar_battery','miyazaki_battery_existing_or_contracted_pv'].includes(p.machine_rule)||kansaiResidualItem(p,detailsById[p.id],scope));
 const ordinary=options.filter(option=>!deferred.includes(option)&&!residual.includes(option));
 for(const order of permutations(ordinary)){let remaining=limit,feasible=true;const allocation={};
 for(const [p,maximum] of order){let amount;const rule=p.machine_rule;
 if(['national_zeh_battery','national_mirai_eco_battery','hachioji_renewable_energy','hyogo_awaji_battery'].includes(rule)){if(maximum>remaining){feasible=false;break;}amount=maximum;}else amount=Math.min(maximum,remaining);
 if(['tokyo_residential_battery','tokyo_zero_emi'].includes(rule))amount=floor1000(amount);
 if(rule==='saitama_residential_battery')amount=floor10000(amount);
 amount=Math.max(0,amount);allocation[p.id]=amount;remaining-=amount;}
 if(!feasible)continue;
 for(const [p,maximum] of residual){const item=kansaiResidualItem(p,detailsById[p.id],scope);const amount=Math.max(0,kansaiResidualAmount(item,maximum,(item?.cost_scope==='combined'?priorScopeSubsidies:0)+sum(Object.values(allocation)))??floor1000(Math.min(maximum,remaining)));allocation[p.id]=amount;remaining=Math.max(0,remaining-amount);}
 // 大子は同じ費目の他補助を確定した後の残額へ1/2を適用する．
 for(const [p,maximum] of deferred){const amount=Math.max(0,Math.min(maximum,floor1000(remaining/2)));allocation[p.id]=amount;remaining-=amount;}
 const total=sum(Object.values(allocation)),tie=Object.entries(allocation).sort(([a],[b])=>compare(a,b));
 if(!best||compare([total,tie],[best.total,best.tie])>0)best={total,allocation,tie};
 }return best;
}
export function diagnosticSubsidy(programs,input,included){
 const relevant=programs.filter(p=>p.government_level==='national'||p.government_level==='prefecture'&&input.prefectureCode===p.prefecture_code||p.government_level==='municipality'&&p.municipality_code===input.municipalityCode);
 const excluded=[],candidates=[],calculable=[];
 for(const p of relevant){
 if((p.excluded_municipality_codes??[]).includes(input.municipalityCode)){excluded.push(evaluation(p,'excluded_incompatible','municipality_not_applicable',null));continue;}
 if(!p.housing_ages.includes(input.housingAge)){excluded.push(evaluation(p,'excluded_incompatible','housing_age_not_applicable',null));continue;}
 if(!p.equipment_packages.includes(input.equipmentPackage)){excluded.push(evaluation(p,'excluded_incompatible','equipment_package_not_applicable',null));continue;}
 if(p.machine_rule==='kansai_municipal_non_adopted'||p.non_adoption_status_by_equipment_package?.[input.equipmentPackage]!=null){
 const pending=(p.non_adoption_status_by_equipment_package?.[input.equipmentPackage]??p.non_adoption_status)==='candidate';(pending?candidates:excluded).push(evaluation(p,pending?'candidate_missing_conditions':'excluded_incompatible',p.non_adoption_reason_code_by_equipment_package?.[input.equipmentPackage]??p.non_adoption_reason_code,null));continue;
 }
 if(p.included_municipality_codes!=null&&!p.included_municipality_codes.includes(input.municipalityCode)){
 if(input.municipalityCode==null)candidates.push(evaluation(p,'candidate_missing_conditions','regional_eligibility_input_unavailable',null));
 else excluded.push(evaluation(p,'excluded_incompatible','municipality_not_applicable',null));
 continue;
 }
 if(p.battery_capacity_min_kwh!=null&&input.batteryCapacityKwh<p.battery_capacity_min_kwh){excluded.push(evaluation(p,'excluded_incompatible','capacity_not_applicable',null));continue;}
 if(p.machine_rule==='kansai_municipal_formula'){
 const parts=p.formula_components.filter(c=>c.equipment_packages.includes(input.equipmentPackage)&&(!c.housing_ages||c.housing_ages.includes(input.housingAge)));
 if(parts.length && parts.every(c=>(c.solar_output_min_kw!=null && input.capacityKw<c.solar_output_min_kw)||(c.solar_output_max_kw_exclusive!=null && input.capacityKw>=c.solar_output_max_kw_exclusive)||(c.battery_capacity_min_kwh!=null && input.batteryCapacityKwh<c.battery_capacity_min_kwh)||(c.battery_capacity_max_kwh_exclusive!=null && input.batteryCapacityKwh>=c.battery_capacity_max_kwh_exclusive))){excluded.push(evaluation(p,'excluded_incompatible','capacity_not_applicable',null));continue;}
 if(kansaiBelowMinimumCost(p,input)){excluded.push(evaluation(p,'excluded_incompatible','eligible_cost_below_minimum',null));continue;}
 }
 const capacityFloor=Math.floor(input.capacityKw);
 if((p.solar_output_min_kw!=null&&capacityFloor<p.solar_output_min_kw)||(p.solar_output_max_kw_exclusive!=null&&capacityFloor>=p.solar_output_max_kw_exclusive)){excluded.push(evaluation(p,'excluded_incompatible','capacity_not_applicable',null));continue;}
 if(p.diagnostic_scope.status==='excluded_region_input_unavailable'){candidates.push(evaluation(p,'candidate_missing_conditions','regional_eligibility_input_unavailable',null));continue;}
 if(p.diagnostic_scope.status==='excluded_existing_pv_battery_addition'){excluded.push(evaluation(p,'excluded_incompatible','existing_pv_battery_addition_not_supported',null));continue;}
 if(!p.diagnostic_scope.in_scope_housing_ages.includes(input.housingAge)){excluded.push(evaluation(p,'excluded_incompatible','required_external_structure_or_housing_work',null));continue;}
 if(p.fit_compatible===false){excluded.push(evaluation(p,'excluded_incompatible','sale_path_not_applicable',null));continue;}
 if(!['accepting','accepting_with_waitlist_branch'].includes(p.application_status)){
 const reason={closed:'application_closed',suspended:'application_suspended',scheduled:'application_scheduled'}[p.application_status]??'application_status_unconfirmed';
 (p.application_status==='closed'?excluded:candidates).push(evaluation(p,p.application_status==='closed'?'excluded_closed':'candidate_missing_conditions',reason,null));continue;
 }
 if(p.machine_rule==='municipal_unconfirmed_not_included'){
 candidates.push(evaluation(p,'candidate_missing_conditions','investigation_closed_insufficient_information',null));continue;
 }
 if(p.machine_rule==='kansai_municipal_unresolved' && input.equipmentPackage==='solar_only' && p.branch_statuses?.some(b=>b.branch_id==='solar' && b.application_status==='closed')){
 excluded.push(evaluation(p,'excluded_closed','application_closed',null,null,{branch_statuses:p.branch_statuses,selected_branch:'solar',branches:[{id:'solar',application_status:'closed'}]}));continue;
 }
 const c=diagnosticComponents(p,input);
 if(!c){candidates.push(evaluation(p,'candidate_missing_conditions',p.machine_rule==='kansai_municipal_unresolved'?'capacity_definition_input_unavailable':'calculation_detail_unconfirmed',null,null,p.machine_rule==='kansai_municipal_unresolved'?{branch_statuses:p.branch_statuses??[]}:null));continue;}
 if(p.application_status==='accepting_with_waitlist_branch'){
 const branchStatus=c.details.branches?.find(branch=>branch.id===c.details.selected_branch)?.application_status??'unknown';
 if(!['accepting','waitlist'].includes(branchStatus)){
 const reason={closed:'application_closed',suspended:'application_suspended'}[branchStatus]??'application_status_unconfirmed';
 (branchStatus==='closed'?excluded:candidates).push(evaluation(p,branchStatus==='closed'?'excluded_closed':'candidate_missing_conditions',reason,null,c.components,c.details));continue;
 }}
 calculable.push({p,...c});}
 const result={total_amount_yen:0,national_amount_yen:0,prefecture_amount_yen:0,municipality_amount_yen:0,included_programs:[],candidate_programs:candidates,excluded_programs:excluded};
 if(!included){for(const {p,components,details} of calculable)excluded.push(evaluation(p,'excluded_incompatible','downside_scenario_excludes_subsidies',0,Object.fromEntries(Object.keys(components).map(k=>[k,0])),details));return result;}
 let best=null;
 for(let mask=0;mask<2**calculable.length;mask++){
 const subset=calculable.filter((_,i)=>mask&(1<<i));
 if(subset.some(({p})=>(p.required_program_ids??[]).some(id=>!subset.some(x=>x.p.id===id))))continue;
 if(subset.some(({p},i)=>subset.slice(i+1).some(({p:q})=>p.conflict_program_ids.includes(q.id)||q.conflict_program_ids.includes(p.id))))continue;
 let total=0;const allocations={};
 for(const [scope,limit] of [['solar',input.solarCost],['battery',input.batteryCost]]){
 let scopeLimit=limit;
 if(subset.some(x=>x.p.machine_rule==='kansai_municipal_formula' && x.p.formula_components.some(c=>c.scope===scope && c.cost_scope==='combined')))scopeLimit=input.solarCost+input.batteryCost;
 const hasRule=rule=>subset.some(x=>x.p.machine_rule===rule);
 if(scope==='solar'&&hasRule('nagano_roof_solar_battery'))scopeLimit=Math.min(scopeLimit,Math.floor(input.solarCost*10/11));
 if(scope==='battery'){
 if(hasRule('nagano_roof_solar_battery')||hasRule('miyazaki_battery_existing_or_contracted_pv'))scopeLimit=Math.min(scopeLimit,Math.floor(input.batteryCost*10/11));
 if(hasRule('hyogo_awaji_battery'))scopeLimit=Math.min(scopeLimit,Math.floor(input.batteryEquipmentCost*10/11));
 if(hasRule('saitama_residential_battery'))scopeLimit=Math.min(scopeLimit,input.batteryEquipmentCost);
 }
 const allocated=allocateDiagnosticScope(subset.filter(x=>scope in x.components).map(x=>[x.p,x.components[scope]]),scopeLimit,scope,Object.fromEntries(subset.map(x=>[x.p.id,x.details])),sum(Object.values(allocations).flatMap(x=>Object.values(x))));
 if(!allocated){total=-1;break;}total+=allocated.total;allocations[scope]=allocated.allocation;
 }if(total<0)continue;
 if(subset.some(({p})=>(p.required_program_ids??[]).some(id=>sum(Object.values(allocations).map(scope=>scope[id]??0))<=0)))continue;
 const ids=subset.map(x=>x.p.id).sort();if(!best||compare([total,ids],[best.total,best.ids])>0)best={total,ids,subset,allocations};
 }
 result.total_amount_yen=best.total;
 for(const {p,components,details} of best.subset){const amounts=Object.fromEntries(Object.keys(components).map(scope=>[scope,best.allocations[scope][p.id]??0]));const amount=sum(Object.values(amounts));
 const evaluationDetails={...details};
 if(details.formula_components_applied)evaluationDetails.formula_components_applied=details.formula_components_applied.map(item=>({...item,amount_yen:amounts[item.scope]??item.amount_yen,allocation_adjusted_after_other_subsidies:['cost_fraction','capacity_rate_cost_fraction','capacity_rate_plus_fixed_cost_fraction'].includes(item.formula_type)}));
 if(amount<=0){excluded.push(evaluation(p,'excluded_incompatible','calculated_zero_amount',0,amounts,evaluationDetails));continue;}
 result[p.government_level+'_amount_yen']+=amount;result.included_programs.push(evaluation(p,'included','audited_machine_rule_with_disclosed_assumptions',amount,amounts,evaluationDetails));}
 for(const {p,components,details} of calculable)if(!best.ids.includes(p.id)){
 const unavailable=(p.required_program_ids??[]).filter(id=>sum(Object.values(best.allocations).map(scope=>scope[id]??0))<=0).sort();
 const conflicts=best.subset.filter(({p:q})=>p.conflict_program_ids.includes(q.id)||q.conflict_program_ids.includes(p.id)).map(({p:q})=>q.id).sort();
 excluded.push(evaluation(p,'excluded_incompatible',unavailable.length?'dependent_program_unavailable':conflicts.length?'explicit_combination_prohibition':'expense_scope_limit_in_maximum_combination',sum(Object.values(components)),components,{...details,...(unavailable.length?{unavailable_required_program_ids:unavailable}:conflicts.length?{conflicting_program_ids:conflicts}:{})}));
 }
 return result;
}
export function replacesLegacyPrefecture(programs,code) {
 return ['07','15','16','17','19','20','25','28','29','36','37','44','45'].includes(code)
  && programs.some(program=>program.government_level==='prefecture'&&program.prefecture_code===code);
}
export function connectDiagnosticSubsidy(legacy,data,input,included,municipalIncluded){
 const diagnostic=diagnosticSubsidy(data.diagnostic_subsidy_programs??[],input,included);
 const enabled=!!data.diagnostic_subsidy_programs?.length;
 const result={national_amount_yen:0,...legacy};const previous=legacy.total_amount_yen??0;
 if(enabled&&((input.prefectureCode==='13'&&[null,'13104','13201','13308'].includes(input.municipalityCode))||replacesLegacyPrefecture(data.diagnostic_subsidy_programs,input.prefectureCode))){
 Object.assign(result,diagnostic);result.excluded_programs=[...diagnostic.excluded_programs,...legacy.excluded_programs];
 }else if(enabled&&input.prefectureCode==='13'){
 if(diagnostic.total_amount_yen>previous){Object.assign(result,diagnostic);result.candidate_programs=[...legacy.candidate_programs,...diagnostic.candidate_programs];result.excluded_programs=[...legacy.excluded_programs,...diagnostic.excluded_programs];}
 else {result.excluded_programs=[...legacy.excluded_programs,...diagnostic.excluded_programs];result.candidate_programs=[...legacy.candidate_programs,...diagnostic.candidate_programs];}
 }else if(enabled){
 const legacyBattery=sum(municipalIncluded.map(x=>x.component_amounts_yen?.battery??0));
 const saitama=diagnostic.included_programs.find(x=>x.id==='saitama-residential-battery-2026');
 if(saitama){
 const adopted=floor10000(Math.min(saitama.amount_yen,Math.max(0,input.batteryEquipmentCost-legacyBattery)));
 const reduction=saitama.amount_yen-adopted;
 saitama.amount_yen=adopted;saitama.component_amounts_yen.battery=adopted;
 diagnostic.total_amount_yen-=reduction;diagnostic.prefecture_amount_yen-=reduction;
 if(adopted===0){diagnostic.included_programs=diagnostic.included_programs.filter(x=>x!==saitama);diagnostic.excluded_programs.push({...saitama,calculation_status:'excluded_incompatible',reason_code:'expense_scope_exhausted_by_maximum_combination',required_confirmations:['採用済み市区町村補助後の蓄電池購入費残額が1万円未満のため算入しない．',...saitama.required_confirmations]});}
 }
 result.national_amount_yen=diagnostic.national_amount_yen;
 result.prefecture_amount_yen=(result.prefecture_amount_yen??0)+diagnostic.prefecture_amount_yen;
 result.municipality_amount_yen=(result.municipality_amount_yen??0)+diagnostic.municipality_amount_yen;
 result.total_amount_yen=legacy.total_amount_yen===null?null:previous+diagnostic.national_amount_yen+diagnostic.prefecture_amount_yen+diagnostic.municipality_amount_yen;
 result.candidate_programs=[...legacy.candidate_programs,...diagnostic.candidate_programs];
 result.included_programs=[...legacy.included_programs,...diagnostic.included_programs];result.excluded_programs=[...legacy.excluded_programs,...diagnostic.excluded_programs];
 }
 return {breakdown:result,diagnostic,enabled};
}
