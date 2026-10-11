// 共通生成表のASTを通常の診断入力で評価する．制度名・制度別単価で分岐しない．
function gcd(a,b){while(b){[a,b]=[b,a%b];}return a<0n?-a:a;}
class Q {
 constructor(n,d=1n){if(!d)throw Error('算定式の分母が0です．');if(d<0n){n=-n;d=-d;}const g=gcd(n,d);this.n=n/g;this.d=d/g;}
 static of(value){if(value instanceof Q)return value;const s=String(value);if(!/^-?\d+(\.\d+)?$/.test(s))throw Error('算定量が有限の十進数ではありません．');const [a,b='']=s.split('.');return new Q(BigInt(a+b),10n**BigInt(b.length));}
 add(b){b=Q.of(b);return new Q(this.n*b.d+b.n*this.d,this.d*b.d);}
 sub(b){b=Q.of(b);return new Q(this.n*b.d-b.n*this.d,this.d*b.d);}
 mul(b){b=Q.of(b);return new Q(this.n*b.n,this.d*b.d);}
 div(b){b=Q.of(b);return new Q(this.n*b.d,this.d*b.n);}
 cmp(b){b=Q.of(b);const v=this.n*b.d-b.n*this.d;return v>0n?1:v<0n?-1:0;}
 floor(){const v=this.n/this.d;return this.n<0n&&this.n%this.d?v-1n:v;}
 number(){return Number(this.n)/Number(this.d);}
}
class Missing extends Error{}

export function compileSourceAmountTree(value,expectedUnit='JPY'){
 const need=(test,message)=>{if(!test)throw Error(message);},keys=(n,want)=>Object.keys(n).sort().join(',')===[...want].sort().join(',');
 const dims={JPY:{JPY:1},'JPY^2':{JPY:2},kW:{kW:1},kWh:{kWh:1},'JPY/kW':{JPY:1,kW:-1},'JPY/kWh':{JPY:1,kWh:-1},dimensionless:{},scalar:{},'1':{}};
 const same=(a,b)=>Object.keys({...a,...b}).every(k=>(a[k]??0)===(b[k]??0));
 const arithmetic=n=>{
  need(n&&typeof n==='object'&&!Array.isArray(n)&&typeof n.kind==='string'&&Object.hasOwn(dims,n.unit),'原乗除node単位の型不足');
  const dim=dims[n.unit],unit=['dimensionless','scalar'].includes(n.unit)?'1':n.unit;
  if(n.kind==='constant'){need(keys(n,['kind','unit','value'])&&typeof n.value==='number'&&Number.isFinite(n.value),'原定数閉形不一致');return [{kind:'fixed',unit,amount:n.value},dim];}
  if(n.kind==='eligible_cost'){need(keys(n,['kind','unit','cost_ref'])&&unit==='JPY'&&typeof n.cost_ref==='string'&&n.cost_ref,'原費用葉閉形不一致');return [{...n},dim];}
  if(n.kind==='source_field'){need(keys(n,['kind','unit','field'])&&typeof n.field==='string'&&n.field,'原量費用葉閉形不一致');return [{kind:'reference',unit,ref:n.field},dim];}
  if(n.kind==='conditional'){need(keys(n,['kind','unit','condition','then','else']),'原条件閉形不一致');const [then,td]=arithmetic(n.then),[otherwise,ed]=arithmetic(n.else);need(same(td,dim)&&same(ed,dim),'原条件出力単位不一致');return [{kind:n.kind,unit,condition:condition(n.condition),then,else:otherwise},dim];}
  if(n.kind==='round'){need(keys(n,['kind','unit','mode','step','operand'])&&n.mode==='floor'&&typeof n.step==='number'&&Number.isFinite(n.step)&&n.step>0,'原端数閉形不一致');const [operand,od]=arithmetic(n.operand);need(same(od,dim),'原端数単位不一致');return [{kind:n.kind,unit,mode:n.mode,step:n.step,operand},dim];}
  need(['add','sum','subtract','minimum','maximum','multiply','divide'].includes(n.kind)&&keys(n,['kind','unit','operands'])&&Array.isArray(n.operands)&&n.operands.length>=2&&(!['divide','subtract'].includes(n.kind)||n.operands.length===2),'原乗除演算閉形不一致');
  const values=n.operands.map(arithmetic);
  if(['add','sum','subtract','minimum','maximum'].includes(n.kind))need(values.every(([,d])=>same(d,dim)),'原加算比較単位不一致');
  else {const expected={};values.forEach(([,d],i)=>Object.entries(d).forEach(([k,v])=>expected[k]=(expected[k]??0)+v*(n.kind==='divide'&&i===1?-1:1)));need(same(expected,dim),'原乗除次元不一致');}
  return [{kind:n.kind==='add'?'sum':n.kind,unit,operands:values.map(([v])=>v)},dim];
 };
 const condition=n=>{
  if(n.kind==='source_amount_comparison'){need(keys(n,['kind','operator','left','right','unit'])&&n.unit==='boolean'&&['gt','gte','lt','lte','eq','ne'].includes(n.operator),'原額比較閉形不一致');const [left,ld]=arithmetic(n.left),[right,rd]=arithmetic(n.right);need(same(ld,rd),'原額比較単位不一致');return {op:'amount_compare',operator:n.operator,left,right};}
  need(n&&typeof n==='object'&&!Array.isArray(n),'原乗除前件型不足');
  if(['and','or'].includes(n.op)){need(keys(n,['op','args'])&&Array.isArray(n.args)&&n.args.length>=2,'原論理前件閉形不一致');return {op:n.op,args:n.args.map(condition)};}
  if(n.op==='not'){need(keys(n,['op','arg']),'原否定前件閉形不一致');return {op:n.op,arg:condition(n.arg)};}
  need(['eq','ne','lt','lte','gt','gte','in','not_in'].includes(n.op)&&(keys(n,['op','ref','value'])||keys(n,['op','field','value']))&&typeof(n.ref??n.field)==='string'&&(n.ref??n.field),'原乗除前件閉形不一致');
  if(['in','not_in'].includes(n.op))need(Array.isArray(n.value)&&n.value.length,'原集合前件閉形不一致');
  const convert=x=>Array.isArray(x)?x.map(convert):x&&typeof x==='object'?Object.fromEntries(Object.entries(x).map(([k,v])=>[k==='field'?'ref':k,convert(v)])):x;
  return convert(n);
 };
 need(value&&typeof value==='object'&&(keys(value,['kind','version','unit','expression'])||keys(value,['kind','version','unit','expression','source_owner'])||keys(value,['kind','version','unit','tree'])||keys(value,['kind','version','unit','tree','source_owner']))&&value.kind==='source_arithmetic_tree'&&value.version==='source-owned-amount-tree/1'&&value.unit===expectedUnit,'原乗除wrapper閉形不一致');
 if(Object.hasOwn(value,'source_owner'))need(typeof value.source_owner==='string'&&value.source_owner,'原乗除ownerが空');
 const [out,dim]=arithmetic(Object.hasOwn(value,'expression')?value.expression:value.tree);need(same(dim,dims[expectedUnit]),'原乗除出力単位不一致');return out;
}
export function evaluateCommonBranch(contract,input,selected=contract.selected_component_ids??contract.selected_subbranch_ids){
 if(!['common-equipment-branch-calculation/1','common-equipment-branch-calculation/2'].includes(contract.version))throw Error('共通算定契約の版が不正です．');
 const reservedControl=contract.source_common_control_items?.['calculation.controls']?.value;
 if(reservedControl?.source_reserved_amount_constraint){const q=reservedControl.source_reserved_amount_constraint,keys=(v,k)=>Object.keys(v).sort().join(',')===k.sort().join(',');if(!keys(reservedControl,['source_reserved_amount_constraint','calculation_adoption_when_reserved_amount_unknown'])||!keys(q,['scope','source_reservation_unit','reserved_amount','unit','timing','operator','increase_change_allowed','source_refs'])||q.scope!==contract.source_record_id||q.reserved_amount!==null||q.unit!=='JPY'||q.operator!=='upper_bound'||q.increase_change_allowed!==false||reservedControl.calculation_adoption_when_reserved_amount_unknown!==false||!q.source_refs?.length)throw Error('original reservation amount stage contract');return {amount:null,selected,used_refs:[],source_sha256:contract.source_sha256,missing:['source_reserved_amount_constraint:reserved_amount'],reason:'source_owner_reservation_amount_unknown'};}
 const shared=contract.source_owner_shared_formula;
 if(shared?.version==='source-owner-shared-formula/3'){
  const fact=contract.source_common_control_items?.['calculation.total_formula'];
  if(shared.source_record_id!==contract.source_record_id||shared.owner_id!==contract.source_record_id||!shared.component_branch_ids?.includes(contract.branch.branch_id)||shared.component_branch_ids.length!==2||shared.component_formulas?.length!==2||shared.allocation_model!==null||!fact||JSON.stringify(fact.value)!==JSON.stringify(shared.formula)||!shared.formula_fact_sha256||!shared.controls_fact_sha256)throw Error('原選択設備共有式所属不一致');
  const replace=n=>Array.isArray(n)?n.map(replace):n&&typeof n==='object'?n.kind==='selected_components'?{kind:'sum',unit:'JPY',operands:shared.component_formulas}:Object.fromEntries(Object.entries(n).map(([k,v])=>[k,replace(v)])):n;
  if(JSON.stringify(replace(shared.formula))!==JSON.stringify(shared.normalized_owner_formula))throw Error('原選択設備共有式正規化不一致');
  const index=shared.component_branch_ids.indexOf(contract.branch.branch_id);if(JSON.stringify(contract.branch.items['calculation.base_formula'].value)!==JSON.stringify(shared.component_formulas[index]))throw Error('原住宅共有基本成分不一致');
  const items={...contract.branch.items,'calculation.total_formula':{...fact,value:shared.normalized_owner_formula}};
  const result=evaluateCommonBranch({...contract,source_owner_shared_formula:undefined,source_common_control_items:undefined,branch:{...contract.branch,items}},input,selected);
  return {...result,amount:null,owner_amount:result.amount,missing:result.amount===null?result.missing:['source_owner_component_allocation_model_not_defined'],reason:'joint_owner_once_not_independent_components'};
 }
 if(shared?.version==='source-owner-shared-formula/2'){
  const fact=contract.source_common_control_items?.['calculation.total_formula'];
  if(shared.source_record_id!==contract.source_record_id||shared.owner_id!==contract.source_record_id||!shared.component_branch_ids?.includes(contract.branch.branch_id)||shared.allocation_model!==null||!fact||JSON.stringify(fact.value)!==JSON.stringify(shared.formula)||!shared.formula_fact_sha256||!shared.controls_fact_sha256)throw Error('同owner全式の原所属不一致');
  const items={...contract.branch.items,'calculation.total_formula':fact};
  const result=evaluateCommonBranch({...contract,source_owner_shared_formula:undefined,source_common_control_items:undefined,branch:{...contract.branch,items}},input,selected);
  return {...result,amount:null,owner_amount:result.amount,missing:result.amount===null?result.missing:['source_owner_component_allocation_model_not_defined'],reason:'joint_owner_once_not_independent_components'};
 }
 if(contract.source_common_control_items?.['calculation.controls']?.value.original_shared_owner_cap_reference&&!shared)throw Error('原住宅共有全式契約が欠落');
 if(shared){if(!Array.isArray(selected)||selected.length!==1||selected[0]!==contract.branch.branch_id)throw Error('shared owner requires exactly one basic component');const origin=contract.branch.items['equipment.required_combination']?.value.basic_component_reference?.original_source_owner;if(shared.version!=='source-owner-shared-formula/1'||!origin||origin.owner_id!==shared.owner_id||origin.owner_sha256!==shared.owner_sha256||origin.owner_amount_fact_sha256!==shared.amount_fact_sha256||!shared.component_paths.includes(origin.formula_pointer)||shared.actual_value!==null||shared.calculation_state!=='held'||typeof shared.prior_decision_reference!=='string'||!shared.prior_decision_reference)throw Error('原住宅共有全式の所属又は未知段階不一致');return {amount:null,missing:['source_owned_prior_decided_amount:'+shared.prior_decision_reference],selected,used_refs:[],source_sha256:contract.source_sha256};}
 const projection=contract.investment_projection;
 if(projection){if(projection.version!=='source-owner-investment-projection/1'||projection.source_record_id!==contract.source_record_id||projection.source_branch_id!==contract.branch.branch_id||projection.expense_scope!==contract.expense_scope||projection.original_base_excluded!==true||JSON.stringify(selected)!==JSON.stringify(projection.selected_component_ids)||selected.length!==1||selected[0]!==projection.component.component_id||!projection.assumption||projection.component.source_declaration.eligibility_assumption.official_confirmation!==false)throw Error('原owner投資射影の所属又は採用成分不一致');}
 const values={...contract.model_defaults};
 for(const [ref,b]of Object.entries(contract.model_selection_bindings??{})){if(!['equipmentPackage','housingAge'].includes(b.input)||b.operator!=='in'||b.official_confirmation!==false||!Array.isArray(b.values))throw Error('既入力選択の契約不一致');if(input[b.input]!=null)values[ref]=b.values.includes(input[b.input]);}
 for(const [id,binding] of Object.entries(contract.quantity_cost_bindings)){
  if(input[binding.input]==null)continue;
  let value=Q.of(input[binding.input]);if(value.cmp(0)<0)throw Error('負の数量又は費用です．');
  if(binding.divide_tax)value=value.div(binding.divide_tax);
  if(binding.round_step)value=new Q(value.div(binding.round_step).floor()).mul(binding.round_step);
  values[id]=value;
 }
 const branch=contract.branch,subs=new Map(branch.subbranches.map(s=>[s.subbranch_id,s]));
 if(branch.items['calculation.base_formula']){
  if(subs.has(branch.branch_id))throw Error('設備枝と加算のID衝突');
  subs.set(branch.branch_id,{role:'base',items:{'calculation.base_formula':branch.items['calculation.base_formula']}});
 }
 const sourceBasic=branch.items['equipment.required_combination']?.value.basic_component_reference;
 const basicFact=branch.items['calculation.base_formula'];const validBasicOnly=branch.subbranches.every(s=>['addition','rate_addition'].includes(s.role)&&s.base_branch_id===branch.branch_id)&&basicFact?.status==='confirmed'&&Array.isArray(basicFact.evidence_refs)&&basicFact.evidence_refs.length>0;
 const combo=branch.items['calculation.combination']?.value??(validBasicOnly?{base:branch.branch_id}:null);
 if(!combo)throw Error('原基本又は加算所属契約がありません．');
 function* nodes(v){if(v&&typeof v==='object'){if(!Array.isArray(v))yield v;for(const c of Object.values(v))yield* nodes(c);}}
 const groups=[...nodes(branch.items['calculation.total_formula']?.value)].filter(n=>n.kind==='selected_component_group');
 if(groups.length){const seen=new Set();for(const g of groups){if(JSON.stringify(Object.keys(g).sort())!==JSON.stringify(['kind','unit','component_ids','operand'].sort())||g.unit!=='JPY'||!Array.isArray(g.component_ids)||!g.component_ids.length||g.component_ids.some(i=>typeof i!=='string'||!subs.has(i)||seen.has(i)))throw Error('採用成分群の閉形又は所属不一致');for(const i of g.component_ids){if(seen.has(i))throw Error('採用成分群の重複所属');seen.add(i);}const ns=[...nodes(g.operand)];if(g.operand.unit!=='JPY'||ns.some(n=>n.kind==='selected_component_group')||ns.filter(n=>n.kind==='selected_components').length!==1)throw Error('採用成分群の演算参照又は循環');}if(seen.size!==subs.size)throw Error('採用成分群の全成分coverage不足');}

 if(selected.some(id=>!subs.has(id)))throw Error('未定義の算定成分です．');
 if(selected.some(id=>subs.get(id).role==='addition')&&!selected.includes(combo.base)&&subs.get(combo.base).role!=='aggregation_parent'&&!projection)throw Error('加算先の基本額未選択');
 const referenceDefinitions={...contract.quantity_definitions};
 for(const item of Object.values(contract.source_common_reference_items??{}))for(const [ref,d]of Object.entries(item.value??{})){if(referenceDefinitions[ref]&&JSON.stringify(referenceDefinitions[ref])!==JSON.stringify(d)){const p=referenceDefinitions[ref],q=p.definition;const numeric=p.unit===d.unit&&(d.type??'number')==='number'&&d.actual_value==null;const selfInput=q&&['input'].includes(q.operator??q.kind)&&(q.quantity_id??q.ref)===ref&&Object.keys(q).every(k=>['operator','kind','quantity_id','ref'].includes(k));const clean=v=>Object.fromEntries(Object.entries(v).filter(([k])=>!['type','actual_value'].includes(k)));const sameUnknown=JSON.stringify(clean(p))===JSON.stringify(clean(d))&&p.actual_value==null;if(!(numeric&&(selfInput||sameUnknown)))throw Error('original numeric dictionary conflict');continue;}referenceDefinitions[ref]=d;}
 const usedRefs=new Set();
 const resolving=new Set();
 const get=id=>{
  usedRefs.add(id);if(projection&&id===projection.component.selection_ref)return ['solar_plus_standard_battery','solar_plus_nextgen_battery'].includes(input.equipmentPackage);const descriptor=referenceDefinitions[id];let definition=descriptor?.definition;if(['input','minimum'].includes(definition?.kind)&&!definition.operator)definition=Object.fromEntries(Object.entries(definition).map(([k,v])=>[k==='kind'?'operator':k,v]));if(definition?.operator==='input'&&definition.ref)definition={...definition,inputs:[definition.ref]};
  if(values[id]!=null&&definition?.operator!=='minimum'){let q=values[id];const prep=definition?.kind==='source_amount_quantity'?definition.rounding:definition?.preprocessing;if(definition?.kind==='source_amount_quantity'&&(Object.keys(prep).sort().join(',')!=='before_formula,mode,step'||prep.before_formula!==true))throw Error('original amount quantity rounding');if(prep){const mode=prep.mode??prep.method;if(!['nearest','floor'].includes(mode)||Q.of(prep.step).cmp(0)<=0)throw Error('数量前処理が未対応');q=new Q(Q.of(q).div(prep.step).add(Q.of(mode==='nearest'?'0.5':0)).floor()).mul(prep.step);}return q;}
  if(definition?.kind==='source_owned_numeric_expression'){
   const simple=Object.keys(definition).sort().join(',')==='actual_value,cost_ref,kind,quantity_ref,usage_scope';
   if(simple){if(definition.usage_scope!=='eligibility_only'||definition.actual_value!==null||descriptor.unit!=='JPY/kWh'||referenceDefinitions[definition.cost_ref]?.unit!=='JPY'||referenceDefinitions[definition.quantity_ref]?.unit!=='kWh')throw Error('original price ratio references');definition={kind:definition.kind,scope:contract.source_record_id,usage_scope:definition.usage_scope,value:null,other_grant_allocation:null,expression:{kind:'divide',unit:'JPY/kWh',operands:[{kind:'source_field',field:definition.cost_ref,unit:'JPY'},{kind:'source_field',field:definition.quantity_ref,unit:'kWh'}]}};}
   if(Object.keys(definition).sort().join(',')!=='expression,kind,other_grant_allocation,scope,usage_scope,value'||definition.usage_scope!=='eligibility_only'||definition.value!==null||definition.other_grant_allocation!==null||descriptor.unit!=='JPY/kWh'||typeof definition.scope!=='string'||!definition.scope)throw Error('original eligibility price definition');
   if(resolving.has(id))throw Error('original numeric reference cycle');resolving.add(id);try{return evaluate(compileSourceAmountTree({kind:'source_arithmetic_tree',version:'source-owned-amount-tree/1',unit:descriptor.unit,expression:definition.expression,source_owner:definition.scope},descriptor.unit));}finally{resolving.delete(id);}
  }
  if(!definition||!['minimum','input','either'].includes(definition.operator))throw new Missing(id);
  if(definition.operator==='either'){if(definition.selected_input===null)throw new Missing(id+':source_quantity_selection_unknown');if(!Array.isArray(definition.inputs)||!definition.inputs.includes(definition.selected_input))throw Error('原OR量の選択参照不一致');return get(definition.selected_input);}
  if(definition.operator==='input'&&!('inputs'in definition))throw new Missing(id);
  if(resolving.has(id))throw Error('数量定義の循環参照');
  if(!Array.isArray(definition.inputs)||!definition.inputs.length||definition.inputs.some(ref=>typeof ref!=='string')||(definition.operator==='input'&&(definition.inputs.length!==1||(definition.input??definition.inputs[0])!==definition.inputs[0])))throw Error('数量定義の原参照不一致');
  if(definition.operator==='input'&&definition.inputs[0]===id)throw new Missing(id);
  resolving.add(id);try{
   const inputs=definition.inputs.map(ref=>{let q=Q.of(get(ref));const prep=contract.quantity_definitions?.[ref]?.definition?.preprocessing?null:definition.input_preprocessing;if(prep){if(prep.mode!=='nearest'||Q.of(prep.step).cmp(0)<=0)throw Error('数量前処理が未対応');q=new Q(q.div(prep.step).add(Q.of('0.5')).floor()).mul(prep.step);}return q;});
   let q=inputs.reduce((a,b)=>a.cmp(b)<=0?a:b);const prep=definition.preprocessing;if(prep){const mode=prep.mode??prep.method;if(!['floor','nearest'].includes(mode)||Q.of(prep.step).cmp(0)<=0)throw Error('数量minimum後の前処理が未対応');q=new Q(q.div(prep.step).add(Q.of(mode==='nearest'?'0.5':0)).floor()).mul(prep.step);}return q;
  }finally{resolving.delete(id);}
 };
 const predicate=n=>{
  if(projection&&JSON.stringify(n)===JSON.stringify(projection.component.assumed_condition))return true;
  if(n.op==='amount_compare'){const cmp=evaluate(n.left).cmp(evaluate(n.right));if(!['gt','gte','lt','lte','eq','ne'].includes(n.operator))throw Error('original amount comparison operator');return {gt:cmp>0,gte:cmp>=0,lt:cmp<0,lte:cmp<=0,eq:cmp===0,ne:cmp!==0}[n.operator];}
  if(n.op==='and'||n.op==='or'){const p=n.operands.map(predicate);return n.op==='and'?p.every(Boolean):p.some(Boolean);}
  const v=get(n.ref??n.quantity_ref);
  if(n.op==='eq')return v instanceof Q?v.cmp(n.value)===0:v===n.value;
  if(n.op==='in')return (n.values??n.value).includes(v);
  if(n.op==='not_in')return !(n.values??n.value).includes(v);
  if(n.op==='lte')return Q.of(v).cmp(n.value)<=0;
  if(n.op==='gte')return Q.of(v).cmp(n.value)>=0;
  if(n.op==='lt')return Q.of(v).cmp(n.value)<0;
  if(n.op==='gt')return Q.of(v).cmp(n.value)>0;
  throw Error('未対応の条件演算です．');
 };
 const formula=id=>{const s=subs.get(id);if(s.role==='aggregation_parent')throw Error('集計親を独立額として算入しません．');const f=Object.entries(s.items).filter(([k])=>k.endsWith('_formula'));if(f.length!==1)throw Error('算式が一意ではありません．');return f[0][1].value;};
 const evaluate=n=>{
  if(n===null)throw new Missing('source_amount_undefined_for_condition_domain');
  switch(n.kind){
   case 'expression': {
    if(n.version!=='official-formula-ast/1'||n.embedded_constraints.length)throw Error('原公式AST版/埋込制約が未対応です．');
    const evaluateOriginal=node=>{
     if(Object.keys(node).length===1&&node.ref){const binding=n.bindings[node.ref];if(!binding)throw Error('原bindingが未定義です．');if(binding.kind==='official_value'){if(binding.fact.status!=='confirmed'||!binding.fact.evidence.length)throw Error('原定数根拠が未確認です．');return Q.of(binding.fact.value);}if(!['quantity_input','cost_input'].includes(binding.kind))throw Error('原binding型が未対応です．');const id=contract.official_formula_reference_map?.[node.ref];if(!id)throw new Missing('official_binding:'+node.ref);return Q.of(get(id));}
     const args=node.args;
     if(node.op==='conditional'){if(args.length!==2)throw Error('原conditional項数不一致');const convertCondition=value=>{if(Array.isArray(value))return value.map(convertCondition);if(value&&typeof value==='object')return Object.fromEntries(Object.entries(value).map(([key,child])=>[key==='field'?'ref':key,convertCondition(child)]));return value;};const condition=convertCondition(node.condition);return evaluateOriginal(predicate(condition)?args[0]:args[1]);}
     if(node.op==='round'){if(args.length!==1||node.mode!=='floor')throw Error('原round閉形不一致');const step=evaluateOriginal(node.step);if(step.cmp(0)<=0)throw Error('原round単位step不一致');return new Q(evaluateOriginal(args[0]).div(step).floor()).mul(step);}
     if(!args?.length)throw Error('原演算の項がありません．');const values=args.map(evaluateOriginal);
     if(node.op==='sum')return values.reduce((a,b)=>a.add(b),Q.of(0));
     if(node.op==='minimum')return values.reduce((a,b)=>a.cmp(b)<=0?a:b);
     if(node.op==='maximum')return values.reduce((a,b)=>a.cmp(b)>=0?a:b);
     if(node.op==='multiply')return values.reduce((a,b)=>a.mul(b),Q.of(1));
     if(node.op==='divide'){if(values.length!==2)throw Error('原除算は2項です．');return values[0].div(values[1]);}
     throw Error('未対応の原公式演算です．');
    };
    return evaluateOriginal(n.expression);
   }
   case 'source_system_aggregate': {
    const keys=['kind','version','unit','owner_id','collection_ref','operator','system_formula','source_evidence_refs','system_values'];
    if(Object.keys(n).sort().join(',')!==keys.sort().join(',')||n.version!=='source-owned-system-aggregate/1'||n.unit!=='JPY'||n.operator!=='sum'||typeof n.owner_id!=='string'||!n.owner_id||typeof n.collection_ref!=='string'||!n.collection_ref.startsWith(n.owner_id+'.')||n.system_formula?.unit!=='JPY'||!Array.isArray(n.source_evidence_refs)||!n.source_evidence_refs.length||n.system_values!==null)throw Error('原系統別合算の閉形又は未入力集合契約不一致');
    const refs=Object.assign({},...['calculation.references','calculation.quantity_definitions','calculation.cost_definitions'].map(k=>contract.source_common_reference_items?.[k]?.value??{}));
    const collection=refs[n.collection_ref],definition=collection?.definition;
    if(n.owner_id!==contract.source_record_id||collection?.unit!=='collection'||definition?.kind!=='source_owned_system_collection'||definition.scope!==contract.source_record_id||definition.systems!==null||definition.unknown_systems_not_empty!==true)throw Error('原系統集合の実契約所属不一致');
    const visit=x=>{if(Array.isArray(x)){x.forEach(visit);return;}if(!x||typeof x!=='object')return;for(const k of ['quantity_ref','cost_ref'])if(Object.hasOwn(x,k)){const d=refs[x[k]];if(d?.definition?.source_system_collection_ref!==n.collection_ref||d.model_binding_ref||d.model_default_ref)throw Error('原系統量費用の実契約所属不一致');}Object.values(x).forEach(visit);};visit(n.system_formula);
    usedRefs.add(n.collection_ref);const usedSystem=x=>{if(Array.isArray(x)){x.forEach(usedSystem);return;}if(!x||typeof x!=='object')return;for(const k of ['quantity_ref','cost_ref'])if(x[k])usedRefs.add(x[k]);Object.values(x).forEach(usedSystem);};usedSystem(n.system_formula);
    throw new Missing('source_system_aggregate:'+n.collection_ref);
   }
   case 'source_bound_grant_amount': {
    if(Object.hasOwn(n,'source_constraints')){
     if(Object.keys(n).sort().join(',')!=='evidence_refs,kind,selected_amount,source_constraints,unit,upper_bound'||n.unit!=='JPY'||n.selected_amount!==null||!Array.isArray(n.evidence_refs)||!n.evidence_refs.length||n.evidence_refs.some(x=>typeof x!=='string'||!x)||!(JSON.stringify(n.source_constraints)==='[]'||JSON.stringify(n.source_constraints)===JSON.stringify([{kind:'grant_and_national_sum_lte_cost',national_stage_variants:['申請予定額','実績時国交付通知額'],selected:false}])))throw Error('原制約付き未決定給付の閉形不一致');
     compileSourceAmountTree({kind:'source_arithmetic_tree',version:'source-owned-amount-tree/1',unit:'JPY',expression:n.upper_bound});
     throw new Missing(n.source_constraints.length?'source_bound_grant_amount:selected_amount_and_national_stage_unknown':'source_bound_grant_amount:grant_decision_unknown');
    }
    const keys=['kind','unit','source_owner','upper_bound','selected_amount','selection_force','selection_stage','original_rate','original_cap_jpy','not_maximum_as_awarded_amount'];
    if(Object.keys(n).sort().join(',')!==keys.sort().join(',')||n.unit!=='JPY'||typeof n.source_owner!=='string'||!n.source_owner||n.selection_force!=='within'||n.selection_stage!=='grant_decision'||n.selected_amount!==null||n.not_maximum_as_awarded_amount!==true)throw Error('原以内給付の選定未確定契約不一致');
    if(n.source_owner!==contract.source_record_id)throw Error('原以内給付の実契約owner不一致');
    compileSourceAmountTree({kind:'source_arithmetic_tree',version:'source-owned-amount-tree/1',unit:'JPY',expression:n.upper_bound});
    if(Object.keys(n.original_rate??{}).sort().join(',')!=='denominator,force,numerator'||!['numerator','denominator'].every(k=>typeof n.original_rate[k]==='number'&&Number.isFinite(n.original_rate[k])&&n.original_rate[k]>0)||n.original_rate.force!=='within'||typeof n.original_cap_jpy!=='number'||!Number.isFinite(n.original_cap_jpy)||n.original_cap_jpy<0)throw Error('原以内給付の上限根拠型不一致');
    throw new Missing('source_bound_grant_amount:grant_decision_unknown');
   }
   case 'source_arithmetic_tree': return evaluate(compileSourceAmountTree(n));
   case 'fixed': return Q.of(n.amount??n.value);
   case 'reference': return Q.of(get(n.ref));
   case 'eligible_cost': return Q.of(get(n.cost_ref??n.ref));
   case 'source_owned_prior_decided_amount': {if(Object.keys(n).sort().join(',')!=='definition,kind,reference_id,unit'||n.unit!=='JPY'||typeof n.definition!=='string'||!n.definition.trim())throw Error('原先決定額葉閉形不一致');throw new Missing('source_owned_prior_decided_amount:'+n.reference_id);}
   case 'external_grant_input': throw new Missing('external_grant_input:'+n.grant_id);
   case 'per_quantity': return Q.of(n.rate).mul(get(n.quantity_ref));
   case 'cost_fraction': {const f=n.fraction??n;if(n.fraction&&Object.keys(f).sort().join(',')!=='denominator,numerator')throw Error('original fraction keys');return Q.of(get(n.cost_ref)).mul(f.numerator).div(f.denominator);}
   case 'conditional': return evaluate(predicate(n.condition)?n.then:n.else);
   case 'round': {if(n.mode!=='floor'||Q.of(n.step).cmp(0)<=0)throw Error('丸め規則が不正です．');return new Q(evaluate(n.operand).div(n.step).floor()).mul(n.step);}
   case 'multiply': return n.operands.map(evaluate).reduce((a,b)=>a.mul(b),Q.of(1));
   case 'subtract': {if(n.operands.length!==2)throw Error('原減算は2項です．');return evaluate(n.operands[0]).sub(evaluate(n.operands[1]));}
   case 'divide': {if(n.operands.length!==2)throw Error('original division arity');return evaluate(n.operands[0]).div(evaluate(n.operands[1]));}
   case 'sum': return n.operands.map(evaluate).reduce((a,b)=>a.add(b),Q.of(0));
   case 'minimum': return n.operands.map(evaluate).reduce((a,b)=>a.cmp(b)<=0?a:b);
   case 'maximum': return n.operands.map(evaluate).reduce((a,b)=>a.cmp(b)>=0?a:b);
   case 'difference': {if(n.operands.length!==2)throw Error('控除は2項です．');const q=evaluate(n.operands[0]).sub(evaluate(n.operands[1]));return q.cmp(0)<0?Q.of(0):q;}
   case 'selected_component_group': {const previous=selected;selected=previous.filter(id=>n.component_ids.includes(id));try{return selected.length?evaluate(n.operand):Q.of(0);}finally{selected=previous;}}
   case 'selected_components': return selected.filter(id=>subs.get(id).role!=='aggregation_parent').map(id=>{const f=formula(id);if(f.unit!=='JPY')throw Error('単価を金額に直接加算できません．');return evaluate(f);}).reduce((a,b)=>a.add(b),Q.of(0));
   case 'rate_times_quantity': return [n.base_id,...n.rate_addition_ids].map(id=>evaluate(formula(id))).reduce((a,b)=>a.add(b),Q.of(0)).mul(get(n.quantity_ref));
   default: throw Error('未対応の共通算式です：'+n.kind);
  }
 };
 if(selected.filter(id=>(combo.unresolved_group??[]).includes(id)).length>(combo.maximum_selected_in_unresolved_group??Infinity))return {amount:null,missing:['addition_compatibility'],selected};
 try {
  const required=contract.source_required_value_gate;
  if(required){if(required.version!=='source-required-eligibility-value-gate/1'||!required.conditions?.length)throw Error('原必要量前件の契約不一致');for(const entry of required.conditions){if(!entry.source_fact_sha256||!entry.evidence_refs?.length)throw Error('原必要量前件の根拠欠落');if(!predicate(entry.condition))return {amount:null,missing:[],selected,used_refs:[...usedRefs].sort(),source_sha256:contract.source_sha256,eligibility_state:'not_eligible',reason:'source_required_eligibility_not_met'};}}
  const gate=contract.source_fixed_grant_cost_gate;
  if(gate){if(gate.version!=='source-fixed-grant-cost-gate/1'||gate.partial_grant_not_allowed!==true||!gate.controls_fact_sha256||!gate.conditions?.length)throw Error('原固定額費用gate契約不一致');for(const entry of gate.conditions){const n=entry.condition;if(n.op!=='gte'||entry.scope!=='all'||entry.force!==null||!entry.evidence_refs?.length)throw Error('原固定額費用gate前件不一致');if(Q.of(get(n.ref)).cmp(n.value)<0)return {amount:null,missing:[],selected,used_refs:[...usedRefs].sort(),source_sha256:contract.source_sha256,eligibility_state:'not_eligible',reason:'full_fixed_grant_cost_gate_not_met'};}}
  let total;
  if(branch.items['calculation.total_formula'])total=evaluate(branch.items['calculation.total_formula'].value);
  else {total=selected.map(id=>evaluate(formula(id))).reduce((a,b)=>a.add(b),Q.of(0));const cap=branch.items['calculation.shared_cap']?.value;if(cap){const upper=evaluate(cap.upper_bound);if(total.cmp(upper)>0)total=upper;}const rounding=branch.items['calculation.final_rounding']?.value;if(rounding)total=new Q(total.div(rounding.step).floor()).mul(rounding.step);}
  return {amount:total.number(),missing:[],selected,used_refs:[...usedRefs].sort(),source_sha256:contract.source_sha256};
 }catch(error){if(error instanceof Missing)return {amount:null,missing:[error.message],selected,used_refs:[...usedRefs].sort(),source_sha256:contract.source_sha256};throw error;}
}
export function sourceMunicipalityReception(program,input){
 const root=program.common_branch_calculation;
 if(!root?.branch_contracts)return null;
 const pairs=root.branch_contracts.filter(c=>c.source_municipality_reception_reference);
 if(!pairs.length)return null;
 if(pairs.length!==root.branch_contracts.length)throw Error('原市町受付の設備coverage不足');
 const c=pairs[0],r=c.source_municipality_reception_reference;
 if(pairs.some(x=>JSON.stringify(x.source_municipality_reception_reference)!==JSON.stringify(r)))throw Error('同owner市町受付参照の不一致');
 const intake=c.source_owner_scope_reference?.municipality_membership_reference;
 const membership=intake?.municipality_scope_reference;
 const keys=['version','source_record_id','source_owner_id','source_sha256','membership_fact_sha256','observations_pointer','observations_fact_sha256','source_evidence_sha256','source_table_sha256','checked_at','rows'];
 const digest=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
 if(Object.keys(r).sort().join(',')!==keys.sort().join(',')||r.version!=='source-owned-municipality-reception-projection/1'||r.source_record_id!==root.source_record_id||r.source_sha256!==root.source_sha256||r.source_owner_id!==c.source_owner_scope_reference.owner_id||intake?.version!=='source-owner-intake-reference/4'||membership?.version!=='source-owned-municipality-membership/1'||r.membership_fact_sha256!==membership.fact_sha256||!r.observations_pointer.startsWith('/evidence/')||!/^\d{4}-\d{2}-\d{2}$/.test(r.checked_at)||!['source_sha256','membership_fact_sha256','observations_fact_sha256','source_evidence_sha256','source_table_sha256'].every(k=>digest(r[k])))throw Error('原市町受付参照の版又は所属不一致');
 if(!Array.isArray(r.rows)||r.rows.length!==membership.master_rows.length||new Set(r.rows.map(x=>x.municipality_code)).size!==r.rows.length)throw Error('原市町受付参照のcoverage不一致');
 for(const row of r.rows){const m=membership.master_rows.find(x=>x.municipality_code===row.municipality_code);if(Object.keys(row).sort().join(',')!=='master_row_sha256,municipality_code,municipality_name,source_row_sha256,state'||!m||row.municipality_name!==m.municipality_name||row.master_row_sha256!==m.master_row_sha256||!digest(row.source_row_sha256)||!['closed','scheduled','accepting','unknown'].includes(row.state))throw Error('原市町受付原行の所属不一致');}
 if(!input.municipalityCode)return {state:'unknown',reason:'regional_eligibility_input_unavailable'};
 const row=r.rows.find(x=>x.municipality_code===input.municipalityCode);
 if(!row)return {state:'unknown',reason:'municipality_not_applicable'};
 return {state:row.state,reason:row.state==='closed'?'application_closed':row.state==='unknown'?'application_status_unconfirmed':null};
}

export function commonBranchComponents(program,input){
 const contract=program.common_branch_calculation;
 if(contract.version!=='common-equipment-branches-calculation/3'){
  const result=evaluateCommonBranch(contract,input);
  if(result.amount===null)return {components:{},details:{formula_candidate_reason:'source_model_reference_unavailable',missing_common_refs:result.missing,common_branch_source_sha256:result.source_sha256,selected_common_components:result.selected,used_common_refs:result.used_refs}};
  return {components:{[contract.expense_scope]:result.amount},details:{common_branch_source_sha256:result.source_sha256,selected_common_components:result.selected,used_common_refs:result.used_refs,calculation_assumptions:contract.assumptions}};
 }
 const seen=new Set(),scopes=new Set(),components={},used=[],held=[];
 const ownerResults=new Map();
 const evaluateCandidate=c=>{
  const shared=c.source_owner_shared_formula;if(!['source-owner-shared-formula/2','source-owner-shared-formula/3'].includes(shared?.version))return evaluateCommonBranch(c,input);
  const group=contract.branch_contracts.filter(x=>x.source_owner_shared_formula?.owner_id===shared.owner_id);
  if(group.length!==shared.component_branch_ids.length||group.some(x=>!shared.component_branch_ids.includes(x.branch.branch_id)||JSON.stringify(x.source_owner_shared_formula)!==JSON.stringify(shared)))throw Error('同owner共有全式の二基本coverage不一致');
  if(!ownerResults.has(shared.owner_id))ownerResults.set(shared.owner_id,evaluateCommonBranch(c,input));
  return {...ownerResults.get(shared.owner_id),selected:c.selected_component_ids};
 };
 const active=contract.branch_contracts.filter(c=>c.input_scope?.housing_ages.includes(input.housingAge)&&c.input_scope?.equipment_packages.includes(input.equipmentPackage));
 const duplicates=new Set(active.filter(c=>active.filter(x=>x.expense_scope===c.expense_scope).length>1).map(c=>c.expense_scope));
 if(!Array.isArray(contract.branch_contracts)||!contract.branch_contracts.length)throw Error('複数設備契約が空です．');
 for(const c of contract.branch_contracts){
  if(seen.has(c.branch.branch_id)||c.source_record_id!==contract.source_record_id||c.source_sha256!==contract.source_sha256)throw Error('複数設備契約の所属又は版が不正です．');seen.add(c.branch.branch_id);
  if(!c.input_scope||!Array.isArray(c.input_scope.housing_ages)||!Array.isArray(c.input_scope.equipment_packages))throw Error('既入力scopeが未定義です．');
  if(!c.input_scope.housing_ages.includes(input.housingAge))continue;
  if(!['solar','battery'].includes(c.expense_scope)){const original=evaluateCandidate(c);held.push({branch_id:c.branch.branch_id,reason:original.amount===null?'source_model_reference_unavailable':'outside_existing_investment_scope',missing:original.missing,amount:null});continue;}
  if(!c.input_scope.equipment_packages.includes(input.equipmentPackage))continue;
  const parties=c.source_owner_scope_reference;
  if(parties?.version==='source-owner-parties-reference/1'){if(parties.version!=='source-owner-parties-reference/1'||parties.source_record_id!==c.source_record_id||parties.source_branch_id!==c.branch.branch_id||parties.source_item_id!=='applicant.eligible_relationship'||!parties.source_fact_sha256||!parties.applicant_fact||!['confirmed','unknown'].includes(parties.applicant_fact.status)||!parties.applicant_fact.evidence_refs?.length||!/^[0-9a-f]{64}$/.test(parties.source_fact_sha256))throw Error('原受給当事者の所属参照不一致');if(parties.applicant_fact.status==='unknown'){held.push({branch_id:c.branch.branch_id,reason:'source_model_reference_unavailable',missing:['applicant.eligible_relationship'],amount:null});continue;}if(parties.applicant_fact.value.individual_resident_is_direct_payee===false){held.push({branch_id:c.branch.branch_id,reason:'source_grant_recipient_return_model_not_defined',amount:null});continue;}}
  if(parties && parties.version!=='source-owner-parties-reference/1'){
   const required=['owner_id','owner_path','owner_sha256','financial_path','financial_fact_sha256','binding_sha256','scope_source_refs','municipality_membership_reference'];
   const allowed=new Set([...required,'original_scope','investment_selection_ref']);
   const digest=x=>typeof x==='string'&&/^[0-9a-f]{64}$/.test(x);
   if(required.some(k=>!Object.hasOwn(parties,k))||Object.keys(parties).some(k=>!allowed.has(k))||parties.owner_id!==(c.branch.items['equipment.required_combination']?.value.basic_component_reference?.original_source_owner?.owner_id??c.branch.branch_id)||!parties.owner_path?.startsWith('/')||!parties.financial_path?.startsWith(parties.owner_path+'/')||!['owner_sha256','financial_fact_sha256','binding_sha256'].every(k=>digest(parties[k]))||!Array.isArray(parties.scope_source_refs)||!parties.scope_source_refs.length||parties.scope_source_refs.some(r=>Object.keys(r).sort().join(',')!=='fact_sha256,source_path'||!r.source_path?.startsWith('/')||!digest(r.fact_sha256)))throw Error('原算式ownerの入力scope参照不一致');
  }
  const basic=c.branch.items['calculation.base_formula']?.value;if(basic?.unit==='JPY_points_equivalent'){held.push({branch_id:c.branch.branch_id,reason:'non_cash_benefit_outside_cash_investment',amount:null});continue;}
  if(duplicates.has(c.expense_scope)){held.push({branch_id:c.branch.branch_id,reason:'original_basic_variant_selection_unknown',amount:null});continue;}
  if(scopes.has(c.expense_scope))throw Error('同じ投資費目の設備枝を重複算入しません．');scopes.add(c.expense_scope);
  const r=evaluateCandidate(c);
  if(r.amount===null){held.push({branch_id:c.branch.branch_id,reason:r.reason??'source_model_reference_unavailable',missing:r.missing});continue;}
  components[c.expense_scope]=r.amount;used.push({branch_id:c.branch.branch_id,selected_component_ids:r.selected,used_refs:r.used_refs});
 }
 const details={common_branch_source_sha256:contract.source_sha256,selected_common_components:used.flatMap(c=>c.selected_component_ids),used_common_branches:used,held_common_branches:held,calculation_assumptions:contract.assumptions};
 if(!used.length)details.formula_candidate_reason='source_model_reference_unavailable';
 return {components,details};
}
