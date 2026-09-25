// Decimal rational arithmetic preserves official capacity and yen rounding boundaries.
function decimal(value) {
 if (!Number.isFinite(Number(value))) throw new Error('制度算式の数値が不正です．');
 const [mantissa, exponent = '0'] = String(value).toLowerCase().split('e');
 const [whole, fraction = ''] = mantissa.split('.');
 const shift = Number(exponent) - fraction.length;
 const n = BigInt(whole + fraction);
 return shift >= 0 ? [n * 10n ** BigInt(shift), 1n] : [n, 10n ** BigInt(-shift)];
}
const add = (a,b) => [a[0]*b[1]+b[0]*a[1],a[1]*b[1]];
const multiply = (a, b) => [a[0] * b[0], a[1] * b[1]];
const minimum = (a, b) => a[0] * b[1] <= b[0] * a[1] ? a : b;
function capacityValue(value, rule) {
 const x = decimal(value);
 if (rule === 'none') return x;
 const scale = rule === 'floor_1' ? 1n : ['floor_0_1', 'round_0_1'].includes(rule) ? 10n : rule === 'floor_0_001' ? 1000n : 100n;
 if (!['floor_1', 'floor_0_1', 'floor_0_01', 'floor_0_001', 'round_0_01', 'round_0_1'].includes(rule)) throw new Error('未対応の関西容量前処理です．');
 const numerator = x[0] * scale;
 const rounded = ['round_0_01', 'round_0_1'].includes(rule) ? (2n * numerator + x[1]) / (2n * x[1]) : numerator / x[1];
 return [rounded, scale];
}
export function kansaiFormulaComponents(program, input) {
 const components = {}, rawComponents = {}, applied = [], excluded = [];
 for (const item of program.formula_components ?? []) {
  if (item.housing_ages && !item.housing_ages.includes(input.housingAge)) continue;
  if (!item.equipment_packages.includes(input.equipmentPackage)) continue;
  if (item.battery_capacity_max_kwh_exclusive != null && input.batteryCapacityKwh >= item.battery_capacity_max_kwh_exclusive) { excluded.push({scope:item.scope,reason_code:'capacity_not_applicable',battery_capacity_max_kwh_exclusive:item.battery_capacity_max_kwh_exclusive}); continue; }
  if (item.battery_capacity_min_kwh != null && input.batteryCapacityKwh < item.battery_capacity_min_kwh) { excluded.push({scope:item.scope,reason_code:'capacity_not_applicable',battery_capacity_min_kwh:item.battery_capacity_min_kwh}); continue; }
  if (item.solar_output_max_kw_exclusive != null && input.capacityKw >= item.solar_output_max_kw_exclusive) { excluded.push({scope:item.scope,reason_code:'capacity_not_applicable',solar_output_max_kw_exclusive:item.solar_output_max_kw_exclusive}); continue; }
  if (item.solar_output_min_kw != null && input.capacityKw < item.solar_output_min_kw) { excluded.push({scope:item.scope,reason_code:'capacity_not_applicable',solar_output_min_kw:item.solar_output_min_kw}); continue; }
  const cost = {solar: input.solarCost, battery: input.batteryCost, battery_equipment: input.batteryEquipmentCost, combined: input.solarCost + input.batteryCost}[item.cost_scope];
  let eligible = cost == null ? null : decimal(cost);
  if (eligible && item.cost_tax === 'exclusive') eligible = multiply(eligible, [10n, 11n]);
  if (item.eligible_cost_min_yen != null) {
   if (!eligible) throw new Error('対象経費最低額にcost_scopeがありません．');
   const minimumCost = decimal(item.eligible_cost_min_yen);
   if (eligible[0] * minimumCost[1] < minimumCost[0] * eligible[1]) {
    excluded.push({scope:item.scope,reason_code:'eligible_cost_below_minimum',eligible_cost_min_yen:item.eligible_cost_min_yen});
    continue;
   }
  }
  // Store the once-deducted eligible cost for later other-subsidy allocation.
  const fixedDeduction = item.eligible_cost_deduction_yen ?? 0;
  if (fixedDeduction) {
   if (!eligible || item.formula_type !== 'cost_fraction') throw new Error('定額経費控除は対象費率式に限ります．');
   const deduction = decimal(fixedDeduction);
   const numerator = eligible[0] * deduction[1] - deduction[0] * eligible[1];
   eligible = [numerator > 0n ? numerator : 0n, eligible[1] * deduction[1]];
  }
  let amount, capacityAmount = null;
  if (item.formula_type === 'fixed') amount = decimal(item.fixed_amount_yen);
  else if (['capacity_rate', 'capacity_rate_cost_fraction','capacity_rate_plus_fixed_cost_fraction'].includes(item.formula_type)) {
   let capacity = capacityValue(item.capacity_source === 'solar_kw' ? input.capacityKw : input.batteryCapacityKwh, item.capacity_preprocessing);
   if (item.capacity_cap != null) capacity = minimum(capacity, decimal(item.capacity_cap));
   amount = multiply(capacity, decimal(item.unit_amount_yen));
   if(item.capacity_amount_rounding_unit_yen!=null){const unit=BigInt(item.capacity_amount_rounding_unit_yen);amount=[amount[0]/(amount[1]*unit)*unit,1n];}
   if(item.formula_type==='capacity_rate_plus_fixed_cost_fraction')amount=add(amount,decimal(item.fixed_amount_yen));
   capacityAmount = amount;
  } else if (item.formula_type === 'capacity_unit_cost_fraction') {
   if (!eligible) throw new Error('制度算式の対象費用がありません．');
   const raw = item.capacity_source === 'solar_kw' ? input.capacityKw : input.batteryCapacityKwh;
   if (raw <= 0) return null;
   let capacity = capacityValue(raw, item.capacity_preprocessing);
   if (item.capacity_cap != null) capacity = minimum(capacity, decimal(item.capacity_cap));
   const rawFraction = decimal(raw);
   const unitCost = minimum(multiply(eligible, [rawFraction[1], rawFraction[0]]), decimal(item.capacity_unit_cost_cap_yen));
   amount = multiply(multiply(unitCost, [BigInt(item.fraction_numerator), BigInt(item.fraction_denominator)]), capacity);
   capacityAmount = amount;
  } else if (item.formula_type !== 'cost_fraction') throw new Error('未対応の関西市区町村算式です．');
  if (['cost_fraction', 'capacity_rate_cost_fraction','capacity_rate_plus_fixed_cost_fraction'].includes(item.formula_type)) {
   if (!eligible) throw new Error('制度算式の対象費用がありません．');
   const fraction = multiply(eligible, [BigInt(item.fraction_numerator), BigInt(item.fraction_denominator)]);
   amount = amount ? minimum(amount, fraction) : fraction;
  }
  if (eligible) amount = minimum(amount, eligible);
  if (item.cap_yen != null) amount = minimum(amount, decimal(item.cap_yen));
  const unit = BigInt(item.rounding_unit_yen);
  const serviceHalfUp = item.rounding_mode === 'service_half_up';
  if (serviceHalfUp && (item.formula_type !== 'capacity_rate' || item.rounding_unit_yen !== 1)) throw new Error('サービス円丸めは1円単位の容量単価式に限定する．');
  const yen = amount[0] < 0n ? 0 : serviceHalfUp ? Number((2n * amount[0] + amount[1]) / (2n * amount[1])) : Number(amount[0] / (amount[1] * unit) * unit);
  components[item.scope] = (components[item.scope] ?? 0) + yen;
  rawComponents[item.scope]=add(rawComponents[item.scope]??[0n,1n],item.defer_rounding_to_formula_total?amount:decimal(yen));
  applied.push({...(Object.hasOwn(item,'rounding_mode') ? {rounding_mode:item.rounding_mode} : {}),...(fixedDeduction ? {eligible_cost_deduction_yen:fixedDeduction} : {}),housing_ages:item.housing_ages??null,deduct_other_subsidies:item.deduct_other_subsidies??true,fixed_amount_yen:item.fixed_amount_yen??null,capacity_amount_rounding_unit_yen:item.capacity_amount_rounding_unit_yen??null,defer_rounding_to_formula_total:item.defer_rounding_to_formula_total??false,amount_yen_before_deferred_rounding:decimalText(amount),scope:item.scope, formula_type:item.formula_type, amount_yen:yen, cost_scope:item.cost_scope ?? null, cost_tax:item.cost_tax ?? null, capacity_preprocessing:item.capacity_preprocessing ?? null, eligible_cost_yen_unrounded:eligible ? decimalText(eligible) : null, capacity_amount_yen_unrounded:capacityAmount ? decimalText(capacityAmount) : null, fraction_numerator:item.fraction_numerator ?? null, fraction_denominator:item.fraction_denominator ?? null, capacity_unit_cost_cap_yen:item.capacity_unit_cost_cap_yen ?? null, cap_yen:item.cap_yen ?? null, rounding_unit_yen:item.rounding_unit_yen});
 }
 if (!applied.length) return null;
 const details={formula_components_applied:applied, formula_source:'independently_reviewed_kansai_municipal_audit', ...(excluded.length ? {formula_components_excluded:excluded} : {})};
 const scopeTotals=[];
 for(const total of program.formula_scope_totals??[]){
  const scope=total.cost_scope;
  if(!(scope in rawComponents))continue;
  if(!['solar','battery'].includes(scope))throw new Error('未対応の設備別費用上限です．');
  let eligible=decimal(scope==='solar'?input.solarCost:input.batteryCost);
  if(total.cost_tax==='exclusive')eligible=multiply(eligible,[10n,11n]);
  let amount=rawComponents[scope];
  if(total.fraction_numerator!=null&&total.fraction_denominator!=null)amount=minimum(amount,multiply(eligible,[BigInt(total.fraction_numerator),BigInt(total.fraction_denominator)]));
  if(total.cap_yen!=null)amount=minimum(amount,decimal(total.cap_yen));
  const unit=BigInt(total.rounding_unit_yen),yen=Math.max(0,Number(amount[0]/(amount[1]*unit)*unit));
  rawComponents[scope]=decimal(yen);components[scope]=yen;
  scopeTotals.push({cost_scope:scope,cost_tax:total.cost_tax??null,eligible_cost_yen_unrounded:decimalText(eligible),fraction_numerator:total.fraction_numerator??null,fraction_denominator:total.fraction_denominator??null,cap_yen:total.cap_yen??null,rounding_unit_yen:total.rounding_unit_yen,amount_yen:yen});
 }
 if(scopeTotals.length)details.formula_scope_totals_applied=scopeTotals;
 const total=program.formula_total;
 if(total){
  const raw=Object.values(rawComponents).reduce(add,[0n,1n]);
  let eligible=decimal({solar:input.solarCost,battery:input.batteryCost,combined:input.solarCost+input.batteryCost}[total.cost_scope]);
  if(total.cost_tax==='exclusive')eligible=multiply(eligible,[10n,11n]);
  let amount=raw;
  if(total.fraction_numerator!=null && total.fraction_denominator!=null)amount=minimum(amount,multiply(eligible,[BigInt(total.fraction_numerator),BigInt(total.fraction_denominator)]));
  if(total.cap_yen!=null)amount=minimum(amount,decimal(total.cap_yen));
  const unit=BigInt(total.rounding_unit_yen),yen=Math.max(0,Number(amount[0]/(amount[1]*unit)*unit));
  for(const [scope,value] of Object.entries(rawComponents))components[scope]=Number(value[0]/value[1]);
  const remainder=Math.max(0,yen-Object.values(components).reduce((a,b)=>a+b,0));
  if(remainder){const scope='battery' in components?'battery':'solar';components[scope]+=remainder;}
  let reduction=Math.max(0,Object.values(components).reduce((a,b)=>a+b,0)-yen);
  for(const scope of ['battery','solar']){const part=Math.min(reduction,components[scope]??0);if(part){components[scope]-=part;reduction-=part;}if(!reduction)break;}
  details.formula_total_applied={cost_scope:total.cost_scope,cost_tax:total.cost_tax??null,eligible_cost_yen_unrounded:decimalText(eligible),fraction_numerator:total.fraction_numerator??null,fraction_denominator:total.fraction_denominator??null,cap_yen:total.cap_yen??null,rounding_unit_yen:total.rounding_unit_yen,raw_component_total_yen:raw[0]%raw[1]===0n?Number(raw[0]/raw[1]):decimalText(raw),amount_yen:yen,binding_reduction_allocation:'battery_then_solar_diagnostic_only'};
 }
 return {components,details};
}

// Plain decimal notation for diagnostic evidence; numerical fields use exact fractions.
function decimalText([n,d]) {
 const integer=n/d; let remainder=n%d;
 if(!remainder)return String(integer);
 let digits='', limit=Math.max(0,28-String(integer).length);
 for(let i=0;i<limit && remainder;i++){remainder*=10n;digits+=String(remainder/d);remainder%=d;}
 // Match Decimal's 28 significant digits with half-even rounding.
 if(remainder*2n>d || remainder*2n===d && BigInt(digits.at(-1)??'0')%2n){
  const scaled=integer*10n**BigInt(digits.length)+BigInt(digits)+1n;
  const text=String(scaled).padStart(digits.length+1,'0');
  return text.slice(0,-digits.length)+'.'+text.slice(-digits.length);
 }
 return String(integer)+'.'+digits;
}
export function kansaiResidualItem(program,details,scope) {
 if(program.machine_rule!=='kansai_municipal_formula')return null;
 const items=details?.formula_components_applied?.filter(c=>c.scope===scope)??[];
 const item=items.find(c=>c.deduct_other_subsidies!==false && ['cost_fraction','capacity_rate_cost_fraction','capacity_rate_plus_fixed_cost_fraction'].includes(c.formula_type));
 return item ? {...item,nonResidualAmount:items.filter(c=>c!==item).reduce((n,c)=>n+c.amount_yen,0)} : null;
}
export function kansaiResidualAmount(item,maximum,other) {
 if(!item || item.eligible_cost_yen_unrounded==null)return null;
 const eligible=decimal(item.eligible_cost_yen_unrounded);
 const n=eligible[0]-BigInt(other)*eligible[1];
 let amount=multiply([n>0n?n:0n,eligible[1]],[BigInt(item.fraction_numerator),BigInt(item.fraction_denominator)]);
 if(['capacity_rate_cost_fraction','capacity_rate_plus_fixed_cost_fraction'].includes(item.formula_type))amount=minimum(amount,decimal(item.capacity_amount_yen_unrounded));
 if(item.cap_yen!=null)amount=minimum(amount,decimal(item.cap_yen));
 const unit=BigInt(item.rounding_unit_yen);
 return Math.min(maximum,Number(amount[0]/(amount[1]*unit)*unit)+(item.nonResidualAmount??0));
}

// Minimum eligible costs are checked before any fixed deduction.
export function kansaiBelowMinimumCost(program, input) {
 const parts=(program.formula_components ?? []).filter(c=>c.equipment_packages.includes(input.equipmentPackage)&&(!c.housing_ages||c.housing_ages.includes(input.housingAge)));
 return parts.length>0 && parts.every(c=>{
  if(c.eligible_cost_min_yen==null)return false;
  const cost={solar:input.solarCost,battery:input.batteryCost,battery_equipment:input.batteryEquipmentCost,combined:input.solarCost+input.batteryCost}[c.cost_scope];
  if(cost==null)return false;
  let eligible=decimal(cost);
  if(c.cost_tax==='exclusive')eligible=multiply(eligible,[10n,11n]);
  const limit=decimal(c.eligible_cost_min_yen);
  return eligible[0]*limit[1]<limit[0]*eligible[1];
 });
}
