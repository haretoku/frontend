import {commonBranchComponents,sourceMunicipalityReception} from './common-branch-runtime.js';
const sum = values => values.reduce((a,b)=>a+b,0);
function compare(a,b) {
 if(Array.isArray(a)&&Array.isArray(b)) { for(let i=0;i<Math.min(a.length,b.length);i++){const c=compare(a[i],b[i]);if(c)return c;} return Math.sign(a.length-b.length); }
 return a>b?1:a<b?-1:0;
}
function* permutations(items) { if(!items.length){yield [];return;} for(let i=0;i<items.length;i++) for(const rest of permutations(items.filter((_,j)=>j!==i))) yield [items[i],...rest]; }
export function diagnosticComponents(program,input) {
 if(!program.housing_ages.includes(input.housingAge)||!program.equipment_packages.includes(input.equipmentPackage))return null;
 return program.machine_rule==='common_equipment_branch_ast/1'?commonBranchComponents(program,{...input,municipalityCode:null}):null;
}
function evaluation(p,status,reason,amount,components,details){
 const row={id:p.id,government_level:p.government_level,program_name:p.program_name,calculation_status:status,application_status:p.application_status,amount_yen:amount,official_url:p.official_urls[0],reason_code:reason,required_confirmations:p.required_confirmations,calculation_assumptions:p.calculation_assumptions,combination_status:'assumed_permitted_unverified_unless_explicitly_prohibited',source_ids:p.source_ids};
 if(p.branch_statuses?.length)row.branch_statuses=p.branch_statuses;
 const confirmation = {
 housing_age_not_applicable:'入力した新築・既存区分が制度の対象住宅区分と一致しないため算入しない．',
 equipment_package_not_applicable:'入力した設備構成が制度の対象設備と一致しないため算入しない．',
 municipality_not_applicable:'入力した市町村が制度の対象地域ではないため算入しない．',
    eligible_cost_tax_basis_unconfirmed: '対象費用の税込・税抜の扱いを確認できず，今回の費用では補助額が変わるため，金額を確定していません．',
    equipment_unit_cost_tax_basis_unconfirmed: '蓄電池本体の単価上限が税込・税抜のどちらかを確認できず，今回の単価では対象か判断できないため，金額を確定していません．',
    equipment_unit_cost_above_limit: '蓄電池本体の単価が，税込・税抜のいずれで見ても制度の上限を超えるため，含めていません．',
    combined_equipment_purchase_cost_unconfirmed: '太陽光と蓄電池の本体購入費が制度の最低額を満たすか，今回の費用情報だけでは確認できないため，金額を確定していません．',
 eligible_cost_below_minimum:'入力条件から算定した対象経費が制度の最低対象経費を下回るため算入しない．',
 eligible_cost_not_above_grant:'制度の税区分で計算した対象費用が補助額を上回らないため算入しない．',
 capacity_not_applicable:'入力容量が制度の対象容量範囲と一致しないため算入しない．',
 existing_pv_battery_addition_not_supported:'制度で指定される既設又は先行契約済み太陽光への蓄電池追加経路に該当する必要があり，新規設備を対象とする現行診断では算入しない．',
 regional_eligibility_input_unavailable:'対象地域が県内の一部に限定されるが，現行診断に地域該当性の入力がないため補助額を確定しない．',
 sale_path_not_applicable:'制度が求める非FIT・非FIP又は卒FITの売電経路と，現行の新設FIT売電経路が一致しないため算入しない．',
 application_closed:'受付終了を確認しているため，現在は算入しない．',
 application_suspended:'受付停止を確認しているため，現在は算入しない．',
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
 if(row.application_status==='scheduled')row.calculation_assumptions=[...row.calculation_assumptions,'受付開始前でも，所定の契約・設置・申請期間を満たす仮定で評価する．現在受付中又は受給確定を意味しない．'];
 if(components!=null)row.component_amounts_yen=components;return {...row,...details};
}
export function allocateDiagnosticScope(options,limit) {
 if(!options.length)return {total:0,allocation:{}};
 let best=null;
 for(const order of permutations(options)) {
  let remaining=limit;const allocation={};
  for(const [p,maximum] of order){const amount=Math.max(0,Math.min(maximum,remaining));allocation[p.id]=amount;remaining-=amount;}
  const total=sum(Object.values(allocation)),tie=Object.entries(allocation).sort(([a],[b])=>compare(a,b));
  if(!best||compare([total,tie],[best.total,best.tie])>0)best={total,allocation,tie};
 }
 return best;
}
export function diagnosticSubsidy(programs,input,included){
 input={...input,municipalityCode:null};
 const relevant=programs.filter(p=>p.government_level==='national'||p.government_level==='prefecture'&&input.prefectureCode===p.prefecture_code);
 const excluded=[],candidates=[],calculable=[];
 for(const originalProgram of relevant){
 const municipal=sourceMunicipalityReception(originalProgram,input);
 const p=municipal?{...originalProgram,application_status:['regional_eligibility_input_unavailable','municipality_not_applicable'].includes(municipal.reason) ? originalProgram.application_status : municipal.state,diagnostic_scope:{...originalProgram.diagnostic_scope,status:'branch_filtered',in_scope_housing_ages:originalProgram.housing_ages}}:originalProgram;
 if(municipal?.reason){const closed=municipal.reason==='application_closed',outside=municipal.reason==='municipality_not_applicable';(closed||outside?excluded:candidates).push(evaluation(p,closed?'excluded_closed':outside?'excluded_incompatible':'candidate_missing_conditions',municipal.reason,null));continue;}
 if(p.excluded_municipality_codes?.length){candidates.push(evaluation(p,'candidate_missing_conditions','regional_eligibility_input_unavailable',null));continue;}
 if(!p.housing_ages.includes(input.housingAge)){excluded.push(evaluation(p,'excluded_incompatible','housing_age_not_applicable',null));continue;}
 if(!p.equipment_packages.includes(input.equipmentPackage)){excluded.push(evaluation(p,'excluded_incompatible','equipment_package_not_applicable',null));continue;}
 if(p.included_municipality_codes!=null&&!p.included_municipality_codes.includes(input.municipalityCode)){
 if(input.municipalityCode==null)candidates.push(evaluation(p,'candidate_missing_conditions','regional_eligibility_input_unavailable',null));
 else excluded.push(evaluation(p,'excluded_incompatible','municipality_not_applicable',null));
 continue;
 }
 if(p.battery_capacity_min_kwh!=null&&input.batteryCapacityKwh<p.battery_capacity_min_kwh){excluded.push(evaluation(p,'excluded_incompatible','capacity_not_applicable',null));continue;}
 const capacityFloor=Math.floor(input.capacityKw);
 if((p.solar_output_min_kw!=null&&capacityFloor<p.solar_output_min_kw)||(p.solar_output_max_kw_exclusive!=null&&capacityFloor>=p.solar_output_max_kw_exclusive)){excluded.push(evaluation(p,'excluded_incompatible','capacity_not_applicable',null));continue;}
 if(p.diagnostic_scope.status==='excluded_region_input_unavailable'){candidates.push(evaluation(p,'candidate_missing_conditions','regional_eligibility_input_unavailable',null));continue;}
 if(p.diagnostic_scope.status==='excluded_existing_pv_battery_addition'){excluded.push(evaluation(p,'excluded_incompatible','existing_pv_battery_addition_not_supported',null));continue;}
 if(!p.diagnostic_scope.in_scope_housing_ages.includes(input.housingAge)){excluded.push(evaluation(p,'excluded_incompatible','required_external_structure_or_housing_work',null));continue;}
 if(p.fit_compatible===false){excluded.push(evaluation(p,'excluded_incompatible','sale_path_not_applicable',null));continue;}
 if(!['accepting','accepting_with_waitlist_branch','scheduled'].includes(p.application_status)){
 const reason={closed:'application_closed',suspended:'application_suspended'}[p.application_status]??'application_status_unconfirmed';
 (p.application_status==='closed'?excluded:candidates).push(evaluation(p,p.application_status==='closed'?'excluded_closed':'candidate_missing_conditions',reason,null));continue;
 }
 const c=diagnosticComponents(p,input);
 if(c?.details?.formula_exclusion_reason){excluded.push(evaluation(p,'excluded_incompatible',c.details.formula_exclusion_reason,null,c.components,c.details));continue;}
 if(c?.details?.formula_candidate_reason){const reason=c.details.formula_candidate_reason;if(reason==='equipment_package_not_applicable')excluded.push(evaluation(p,'excluded_incompatible',reason,null,null,c.details));else candidates.push(evaluation(p,'candidate_missing_conditions',reason,null,null,c.details));continue;}
 if(!c){candidates.push(evaluation(p,'candidate_missing_conditions','calculation_detail_unconfirmed',null,null,null));continue;}
 if(p.application_status==='accepting_with_waitlist_branch'){
 const branchStatus=c.details.branches?.find(branch=>branch.id===c.details.selected_branch)?.application_status??'unknown';
 if(!['accepting','waitlist','scheduled'].includes(branchStatus)){
 const reason={closed:'application_closed',suspended:'application_suspended'}[branchStatus]??'application_status_unconfirmed';
 (branchStatus==='closed'?excluded:candidates).push(evaluation(p,branchStatus==='closed'?'excluded_closed':'candidate_missing_conditions',reason,null,c.components,c.details));continue;
 }}
 calculable.push({p,...c});}
 const result={total_amount_yen:0,national_amount_yen:0,prefecture_amount_yen:0,included_programs:[],candidate_programs:candidates,excluded_programs:excluded};
 if(!included){for(const {p,components,details} of calculable)excluded.push(evaluation(p,'excluded_incompatible','downside_scenario_excludes_subsidies',0,Object.fromEntries(Object.keys(components).map(k=>[k,0])),details));return result;}
 let best=null;
 for(let mask=0;mask<2**calculable.length;mask++){
 const subset=calculable.filter((_,i)=>mask&(1<<i));
 if(subset.some(({p})=>(p.required_program_ids??[]).some(id=>!subset.some(x=>x.p.id===id))))continue;
 if(subset.some(({p},i)=>subset.slice(i+1).some(({p:q})=>p.conflict_program_ids.includes(q.id)||q.conflict_program_ids.includes(p.id))))continue;
 let total=0;const allocations={};
 for(const [scope,limit] of [['solar',input.solarCost],['battery',input.batteryCost]]){
 let scopeLimit=limit;
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
export function connectDiagnosticSubsidy(legacy,data,input,included) {
 const diagnostic=diagnosticSubsidy(data.diagnostic_subsidy_programs??[],input,included);
 const represented=new Set([...diagnostic.included_programs,...diagnostic.candidate_programs,...diagnostic.excluded_programs].map(row=>row.id));
 return {enabled:true,diagnostic,breakdown:{...legacy,...diagnostic,
  candidate_programs:[...diagnostic.candidate_programs,...(legacy.candidate_programs??[]).filter(row=>!represented.has(row.id))],
  excluded_programs:[...diagnostic.excluded_programs,...(legacy.excluded_programs??[]).filter(row=>!represented.has(row.id))]
 }};
}
