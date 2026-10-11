import { readFile, writeFile, copyFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { runInNewContext } from 'node:vm';
import { createRequire } from 'node:module';
import { calculateEstimate } from '../site/simulator/src/calculator.js';

// Article-only exports: reuse the production profile and dispatch functions.
// Trace collection adds no changes to their arithmetic or battery control.
const root = new URL('../', import.meta.url);
const dataText = await readFile(new URL('data/input/public-data.json', root), 'utf8');
const calculatorText = await readFile(new URL('site/simulator/src/calculator.js', root), 'utf8');
const data = JSON.parse(dataText);
const config = {
  region: '東京都', annualConsumptionKwh: data.calculation.daytime_occupancy.load_profile.raw_annual_totals_kwh.official_standard_calendar, solarCapacityKw: 4,
  orientation: 'south', occupancy: 'official_standard_calendar', period: 'standard_year',
  loadInterpretation: 'pyhees 3.10.0の公式計算例・地域区分6・標準生活日程の8760時間需要をそのまま使用．在宅日程の混合・年間使用量の調整なし．',
  supportYenPerKwh: 3.5,
  batteryCapacitiesKwh: [0, 5, 9.5],
  periodInterpretation: '標準年の1〜12月（初年度）を集計．最後の支援単価3.5円/kWhが1年間続く場合と，支援がない場合を比較．実際の政策延長や将来料金を予測しない．',
  dayInterpretation: '365日分の充放電計算結果を時刻別に平均．平均波形から充放電を再計算しない．昼6〜18時，夜18〜翌6時の削減率は年間電力量の合計で比較．',
  sensitivity: { annualConsumptionKwh: [3600, 6000], occupancy: ['almost_never', 'almost_every_weekday'] },
  tariff: { contract: '東京電力EP・従量電灯B・30A', basic: 935.25,
    rates: [29.80, 36.40, 40.49], supportedFuelAdjustment: -9.30, levy: 4.18,
    interpretation: '2026年10月分料金を12か月固定し，支援3.5円/kWhの継続と終了を比較．各月の購入量に段階料金と円未満切り捨てを適用して合計．実際の年間請求額ではない．' },
};
const hash = text => createHash('sha256').update(text).digest('hex');
function extract(name) {
  const start = calculatorText.indexOf(`function ${name}(`);
  if (start < 0) throw Error(`Missing ${name}`);
  const opening = calculatorText.indexOf('{', start);
  let depth = 1, end = opening + 1;
  while (depth && end < calculatorText.length) {
    if (calculatorText[end] === '{') depth++;
    if (calculatorText[end] === '}') depth--;
    end++;
  }
  return calculatorText.slice(start, end);
}
const traceAnchor = 'stateOfCharge -= withdrawn;';
const batterySource = extract('batteryEnergyByYear');
if (batterySource.split(traceAnchor).length !== 2) throw Error('Trace anchor changed');
const context = { trace: [] };
runInNewContext(['validatedProfile', 'compensatedSum', 'normalizedProfile', 'temporalProfiles'].map(extract).join('\n') + '\n' +
  batterySource.replace(traceAnchor, traceAnchor + '\ntrace.push({ index, load, generation, direct, chargeInput, delivered, purchased: deficit - delivered, exported: surplus - chargeInput, stateOfCharge, usableCapacity });') +
  '\nthis.profiles = temporalProfiles; this.dispatch = batteryEnergyByYear;', context);
const model = data.calculation.daytime_occupancy;
const tokyo = data.prefectures.find(p => p.code === '13');
const battery = data.calculation.battery_system;
const months = [31,28,31,30,31,30,31,31,30,31,30,31];
const calendar = months.flatMap((days, month) => Array.from({length: days*24}, (_,h) => [month+1, Math.floor(h/24)+1, h%24]));
const sum = rows => rows.reduce((a,b)=>a+b,0);
function bill(kwh, supported) {
  const t = config.tariff;
  return Math.floor(t.basic + Math.min(kwh,120)*t.rates[0] + Math.min(Math.max(kwh-120,0),180)*t.rates[1]
    + Math.max(kwh-300,0)*t.rates[2] + kwh*(t.supportedFuelAdjustment + (supported ? 0 : config.supportYenPerKwh) + t.levy));
}
function simulate(annualConsumption, occupancy, capacity, solar = config.solarCapacityKw) {
  const standardCalendar = occupancy === 'official_standard_calendar';
  const occupancyRate = standardCalendar ? 0 : model.options.find(o=>o.value===occupancy).daytime_occupancy_rate;
  const annualGeneration = solar * tokyo.annual_generation_kwh_per_kw;
  let {loadProfile,generationProfile} = context.profiles(annualConsumption,annualGeneration,occupancyRate,config.orientation,model);
  if (standardCalendar && annualConsumption === config.annualConsumptionKwh) {
    loadProfile = Array.from(model.load_profile.raw_profiles_kwh_per_hour.official_standard_calendar);
  }
  context.trace = [];
  const annual = context.dispatch(loadProfile,generationProfile,{...battery,capacity_kwh:capacity},1,data.calculation.pv_generation_degradation.annual_retention_factor)[0];
  const hourly = context.trace;
  const selected = hourly;
  const quantities = Object.fromEntries(['load','generation','direct','chargeInput','delivered','purchased','exported'].map(k=>[k,sum(selected.map(r=>r[k]))]));
  let offset = 0;
  const monthly = months.map((days, index) => {
    const rows = hourly.slice(offset, offset + days*24);
    offset += days*24;
    const purchasedKwh = sum(rows.map(r=>r.purchased));
    return {month:index+1,purchasedKwh,supportedBill:bill(purchasedKwh,true),unsupportedBill:bill(purchasedKwh,false)};
  });
  const supportedBill = sum(monthly.map(m=>m.supportedBill)), unsupportedBill = sum(monthly.map(m=>m.unsupportedBill));
  const periods = Object.fromEntries([['day',h=>h>=6&&h<18],['night',h=>h<6||h>=18]].map(([name,matches])=>{
    const rows = hourly.filter(r=>matches(r.index%24));
    return [name,Object.fromEntries(['load','direct','delivered','purchased'].map(k=>[k,sum(rows.map(r=>r[k]))]))];
  }));
  const mean = Array.from({length:24},(_,h)=>{
    const rows=selected.filter(r=>r.index%24===h);
    return {hour:h,...Object.fromEntries(['load','generation','direct','chargeInput','delivered','purchased','exported','stateOfCharge'].map(k=>[k,sum(rows.map(r=>r[k]))/rows.length])),
      openingStateOfCharge:sum(rows.map(r=>r.index===0?0:hourly[r.index-1].stateOfCharge))/rows.length};
  });
  // Meaningful checks: conservation each hour, annual parity with public calculation.
  for(const r of hourly){
    if(Math.abs(r.load-r.direct-r.delivered-r.purchased)>1e-9 || Math.abs(r.generation-r.direct-r.chargeInput-r.exported)>1e-9 || r.stateOfCharge < -1e-9 || r.stateOfCharge>r.usableCapacity+1e-9)throw Error('Energy balance failed');
  }
  if (hourly.length !== 8760 || Math.abs(sum(monthly.map(m=>m.purchasedKwh))-annual.annual_purchased_kwh)>1e-8
    || Math.abs(quantities.load-periods.day.load-periods.night.load)>1e-8
    || Math.abs((unsupportedBill-supportedBill)-quantities.purchased*config.supportYenPerKwh)>12) throw Error('Annual aggregation failed');
  for (const k of ['load','direct','delivered','purchased']) if(Math.abs(sum(mean.map(r=>r[k]))*365-quantities[k])>1e-8) throw Error('Mean-day aggregation failed');
  if(solar>0){
    const estimate=calculateEstimate({prefectureCode:'13',housingAge:'existing',systemCapacityKw:solar,
      monthlyElectricityBillYen:annualConsumption/12*tokyo.electricity_price_yen_per_kwh,
      detailConditions:{roof_orientation:config.orientation},daytimeOccupancy:standardCalendar ? 'almost_never' : occupancy,
      equipmentPackage:capacity?'solar_plus_standard_battery':'solar_only',batteryCapacityKwh:capacity||undefined},data);
    for(const [field,value]of [['annual_purchased_kwh',annual.annual_purchased_kwh],['annual_battery_delivered_kwh',annual.annual_battery_delivered_kwh]]){
      if(Math.abs(estimate.energy[field]-value)>0.501)throw Error(`Production parity failed: ${field}`);
    }
  }
  return {capacity,solar,annualConsumption,occupancy,occupancyRate,annual,quantities,supportedBill,unsupportedBill,
    additionalBurden:unsupportedBill-supportedBill,unroundedSupportEffect:quantities.purchased*config.supportYenPerKwh,
    monthly,periods,openingYearStateOfCharge:0,closingYearStateOfCharge:hourly.at(-1).stateOfCharge,mean,hourly};
}
const cases=[simulate(config.annualConsumptionKwh,config.occupancy,0,0),...config.batteryCapacitiesKwh.map(c=>simulate(config.annualConsumptionKwh,config.occupancy,c))];
// Export annual bill savings alone when no chart update is needed.
if (process.argv.includes('--annual-savings')) {
  const annualCases = cases.map(c => {
    const monthly = c.monthly.map(m=>({month:m.month,purchasedKwh:m.purchasedKwh,billYen:m.unsupportedBill}));
    const purchasedKwh = sum(monthly.map(m => m.purchasedKwh));
    if (Math.abs(purchasedKwh - c.annual.annual_purchased_kwh) > 1e-8) throw Error('Annual aggregation mismatch');
    return { solarKw: c.solar, batteryKwh: c.capacity, purchasedKwh,
      billYen: sum(monthly.map(m => m.billYen)), monthly };
  });
  annualCases.forEach(c => c.savingsYen = annualCases[0].billYen - c.billYen);
  const result = {
    period: '標準年の1〜12月（初年度）',
    interpretation: '2026年10月分料金から支援3.5円/kWhを除いた単価を12か月固定．毎月の購入量に段階料金を適用し，月ごとの請求額を合計．売電収入，設備費，維持費は含めない．',
    config: { region: config.region, annualConsumptionKwh: config.annualConsumptionKwh,
      orientation: config.orientation, occupancy: config.occupancy,
      tariff: { ...config.tariff, fuelAdjustmentWithoutSupport: config.tariff.supportedFuelAdjustment + config.supportYenPerKwh } },
    sha256: { data: hash(dataText), calculator: hash(calculatorText) },
    checks: { hourlyEnergyBalance: 'PASS', capacityBounds: 'PASS', annualProductionParity: 'PASS', monthlyAnnualAggregation: 'PASS' },
    cases: annualCases,
  };
  await writeFile(new URL('qa/artifacts/support-shock-annual-savings.json', root), JSON.stringify(result, null, 2) + '\n');
  console.log(JSON.stringify({ annualCases: annualCases.map(({ monthly, ...c }) => c), checks: result.checks }));
  process.exit(0);
}
cases.forEach(c=>{
  c.ratio=cases[0].additionalBurden/c.additionalBurden;
  c.annualBillSavings=cases[0].unsupportedBill-c.unsupportedBill;
  for(const name of ['day','night']) c.periods[name].reductionPercent=(1-c.periods[name].purchased/cases[0].periods[name].purchased)*100;
});
const sensitivity=[...config.sensitivity.annualConsumptionKwh.map(d=>({annualConsumption:d,occupancy:config.occupancy})),
  ...config.sensitivity.occupancy.map(o=>({annualConsumption:config.annualConsumptionKwh,occupancy:o}))].map(p=>{
  const base=simulate(p.annualConsumption,p.occupancy,0,0), equipped=simulate(p.annualConsumption,p.occupancy,9.5);
  return {...p,none:base.additionalBurden,battery:equipped.additionalBurden,ratio:base.additionalBurden/equipped.additionalBurden};
});
const withoutHourly = ({hourly,...rest})=>rest;
const evidence={config,dataVersion:data.data_version,sha256:{data:hash(dataText),calculator:hash(calculatorText)},
  sources:{load:model.load_profile.source,generation:model.generation_profile.input_files,
    tariffs:'https://www.tepco.co.jp/ep/private/plan/chargelist01.html',supportAndRounding:'https://www.tepco.co.jp/ep/private/fuelcost2/backnumber/2610.html'},
  assumptions:{initialSocKwh:0,gridCharging:false,powerLimitKw:battery.charge_discharge_power_limit_kw,
    chargeEfficiency:battery.charge_efficiency,dischargeEfficiency:battery.discharge_efficiency,
    firstYearCapacityFactor:battery.annual_capacity_retention_factor,load:model.load_profile.standard_house_spec,
    annualGenerationKwh:4*tokyo.annual_generation_kwh_per_kw,annualGenerationBasis:tokyo.annual_generation_calculation_conditions},
  checks:{hourlyEnergyBalance:'PASS',capacityBounds:'PASS',annualProductionParity:'PASS',annualAggregation:'PASS',meanDayAggregation:'PASS'},
  cases:cases.map(withoutHourly),sensitivity};
const out=new URL('qa/artifacts/',root);
await writeFile(new URL('support-shock-calculation.json',out),JSON.stringify(evidence,null,2)+'\n');
await writeFile(new URL('support-shock-hourly.csv',out),['case,index,month,day,hour,load_kwh,generation_kwh,direct_kwh,charge_input_kwh,battery_supply_kwh,purchased_kwh,soc_end_kwh',
  ...cases.flatMap((c,i)=>c.hourly.map(r=>[i,r.index,...calendar[r.index],r.load,r.generation,r.direct,r.chargeInput,r.delivered,r.purchased,r.stateOfCharge].join(',')))].join('\n')+'\n');

const C={ink:'#173e35',muted:'#5d6d67',grid:'#dce5df',solar:'#efbc48',battery:'#21876d',purchase:'#c5cdd0',blue:'#547888'};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;');
const text=(x,y,s,size=22,fill=C.ink,weight=400,anchor='start')=>`<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" font-weight="${weight}" text-anchor="${anchor}">${esc(s)}</text>`;
const line=(x1,y1,x2,y2,color=C.grid,width=1,extra='')=>`<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${color}" stroke-width="${width}" ${extra}/>`;
const rect=(x,y,w,h,color,rx=0)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}" rx="${rx}"/>`;
const svg=(w,h,body,title)=>`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}" role="img"><title>${esc(title)}</title><style>text{font-family:Meiryo,"Yu Gothic",sans-serif}</style>${rect(0,0,w,h,'#fff')}${body}</svg>`;
const labels=['太陽光・蓄電池なし','太陽光のみ','太陽光＋蓄電池 5 kWh','太陽光＋蓄電池 9.5 kWh'];
const num=v=>Math.round(v).toLocaleString('ja-JP');
let body='';
const max=Math.ceil(cases[0].additionalBurden/5000)*5000;
for(let v=0;v<=max;v+=5000){const x=380+v/max*750;body+=line(x,52,x,440)+text(x,470,num(v),18,C.muted,400,'middle');}
cases.forEach((c,i)=>{const y=70+i*95;body+=text(55,y+32,labels[i],23,C.ink)+rect(380,y,c.additionalBurden/max*750,48,i===0?C.blue:C.battery,5)
  +text(395+c.additionalBurden/max*750,y+33,`＋${num(c.additionalBurden)}円`,25,C.ink);});
body+=text(1160,507,'円／年',19,C.muted,400,'end')+text(55,551,'出典：はれトク試算',18,C.muted);
await writeFile(new URL('support-shock-burden.svg',out),svg(1320,585,body,'設備別の支援終了による追加負担'));

// Step charts preserve the hourly resolution; no smoothed/invented peaks.
function stepPath(values,x,y,w,h,maxY){let p=`M ${x} ${y-values[0]/maxY*h}`;for(let i=0;i<values.length;i++){p+=` H ${x+(i+1)/24*w}`;if(i<23)p+=` V ${y-values[i+1]/maxY*h}`;}return p;}
function area(values,lower,x,y,w,h,maxY){const upper=values.map((v,i)=>v+lower[i]);return stepPath(upper,x,y,w,h,maxY)+` L ${x+w} ${y-lower[23]/maxY*h}`+Array.from({length:24},(_,j)=>23-j).map(i=>` H ${x+i/24*w}${i>0?` V ${y-lower[i-1]/maxY*h}`:''}`).join('')+' Z';}
const plotMax=Math.ceil(Math.max(...cases[3].mean.map(r=>r.load))*2)/2;
body='';
[['太陽光の直接利用',C.solar],['蓄電池からの供給',C.battery],['電力会社から購入',C.purchase]].forEach(([s,c],i)=>body+=rect(55+i*335,29,20,20,c)+text(86+i*335,47,s,19));
body+=line(1040,39,1075,39,C.ink,2.5)+text(1086,47,'消費電力',19);
for(const [panel,c]of [[0,cases[1]],[1,cases[3]]]){
  const x=85+panel*660,w=540,y=445,h=270;
  body+=text(x,120,panel?'太陽光＋蓄電池 9.5 kWh':'太陽光のみ',21,C.ink)
    +text(x,156,`購入：${(c.quantities.purchased/365).toFixed(1)} kWh／日`,21,C.muted);
  for(let v=0;v<=plotMax;v+=0.5)body+=line(x,y-v/plotMax*h,x+w,y-v/plotMax*h)+text(x-13,y-v/plotMax*h+6,v.toFixed(1),17,C.muted,400,'end');
  let lower=Array(24).fill(0);
  for(const [field,color]of [['direct',C.solar],['delivered',C.battery],['purchased',C.purchase]]){const values=c.mean.map(r=>r[field]);body+=`<path d="${area(values,lower,x,y,w,h,plotMax)}" fill="${color}"/>`;lower=lower.map((v,i)=>v+values[i]);}
  body+=`<path d="${stepPath(c.mean.map(r=>r.load),x,y,w,h,plotMax)}" fill="none" stroke="${C.ink}" stroke-width="2.5"/>`;
  for(let t=0;t<=24;t+=6)body+=text(x+t/24*w,y+30,`${t}時`,17,C.muted,400,'middle');
  body+=text(x+w,169,'1時間平均の電力（kW）',16,C.muted,400,'end');
}
body+=text(55,510,'出典：はれトク試算',18,C.muted);
await writeFile(new URL('support-shock-daily.svg',out),svg(1360,535,body,'昼夜の電力供給内訳'));
const require=createRequire(import.meta.url);
const sharp=require('C:/Users/wordm/.cache/codex-runtimes/codex-primary-runtime/dependencies/node/node_modules/sharp');
for(const name of ['support-shock-burden','support-shock-daily']) {
  await sharp(await readFile(new URL(name+'.svg',out))).png().toFile(new URL(name+'.png',out).pathname.replace(/^\/([A-Z]:)/,'$1'));
  for(const extension of ['svg','png'])await copyFile(new URL(name+'.'+extension,out),new URL('site/shared/assets/'+name+'.'+extension,root));
}
console.log(JSON.stringify({checks:evidence.checks,cases:cases.map((c,i)=>({label:labels[i],load:c.quantities.load,purchased:c.quantities.purchased,direct:c.quantities.direct,batterySupply:c.quantities.delivered,before:c.supportedBill,after:c.unsupportedBill,additional:c.additionalBurden,ratio:c.ratio,dayReduction:c.periods.day.reductionPercent,nightReduction:c.periods.night.reductionPercent,annualBillSavings:c.annualBillSavings})),sensitivity},null,2));
