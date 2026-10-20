import {readFile,writeFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {calculateJourneyEstimate} from '../site/map/estimate-model.js';
import {electricitySavingsExampleInput,guideNumberValues,formatGuideNumber} from '../site/articles/src/guide-numbers.js';

const dataText=await readFile(new URL('../data/input/public-data.json',import.meta.url),'utf8');
const data=JSON.parse(dataText);
const refs=JSON.parse(await readFile(new URL('../site/articles/data/guide-reference-examples.json',import.meta.url),'utf8'));
const values=guideNumberValues(data,refs);
const input=electricitySavingsExampleInput;
const selected=calculateJourneyEstimate(input,data).scenarios.find(s=>s.scenario==='standard');
if(selected.profit_yen!==values['journey.profit']||selected.payback_year!==values['journey.payback'])throw Error('表とグラフの試算が一致しません');
const annual=[{year:0,cumulative_cash_flow_yen:-selected.net_initial_outlay_yen,maintenance_and_replacement_cost_yen:0},...selected.annual_cash_flows];
const metadata={dataVersion:data.data_version,publicDataSha256:createHash('sha256').update(dataText).digest('hex'),input,subsidyIncluded:true,subsidyTiming:'netted_against_initial_cost_not_actual_payment_timing',initial:selected.net_initial_outlay_yen,payback:selected.payback_year,endpoint:selected.profit_yen,annual};
const esc=s=>String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
const man=v=>formatGuideNumber(v,'approx-man');
function render(compact){
 const width=compact?360:760,height=400,left=compact?52:76,right=compact?24:40,top=74,bottom=320;
 const low=-Math.ceil(selected.net_initial_outlay_yen/500000)*50;
 const max=Math.max(...annual.map(r=>(r.cumulative_cash_flow_yen+r.maintenance_and_replacement_cost_yen)/10000));
 const high=Math.ceil(max/50)*50;
 const x=year=>left+year/30*(width-left-right);
 const y=yen=>bottom-(yen/10000-low)/(high-low)*(bottom-top);
 const f=n=>n.toFixed(2);
 const text=(xx,yy,str,extra='')=>`<text x="${f(xx)}" y="${f(yy)}" ${extra}>${esc(str)}</text>`;
 const points=[];for(const r of annual){if(r.year&&r.maintenance_and_replacement_cost_yen>0)points.push([r.year,r.cumulative_cash_flow_yen+r.maintenance_and_replacement_cost_yen]);points.push([r.year,r.cumulative_cash_flow_yen]);}
 const line=points.map(([yr,v])=>`${f(x(yr))},${f(y(v))}`).join(' ');
 const payback=annual.find(r=>r.year===selected.payback_year);
 const replacement=annual.find(r=>r.replacement_cost_yen>0);
 const desc=`第2章と同じ東京都・既存住宅・南向き4 kW・蓄電池なしの標準試算．補助金を差し引いた初期負担${man(selected.net_initial_outlay_yen)}のマイナスから始まり，${selected.payback_year}年目に元手回収，30年後はプラス${man(selected.profit_yen)}．点検・機器交換・修理予備費・保険料を含む．補助金の実際の入金時期を示すものではない．`;
 const grids=[];for(let v=low;v<=high;v+=50)grids.push(`<path d="M${left} ${f(y(v*10000))}H${width-right}" class="${v===0?'zero':'grid'}"/>`+text(left-10,y(v*10000)+5,String(v).replace('-','−'),'text-anchor="end" class="tick"'));
 const years=[0,10,20,30].map(yr=>text(x(yr),348,String(yr),'text-anchor="middle" class="tick"')).join('');
 const drop=replacement?`<circle cx="${f(x(replacement.year))}" cy="${f(y(replacement.cumulative_cash_flow_yen))}" r="4" class="cost-dot"/><path d="M${f(x(replacement.year))} ${f(y(replacement.cumulative_cash_flow_yen)+8)}V${f(y(0)+8)}" class="cost-guide"/>${text(x(replacement.year),y(0)+28,replacement.year+'年目','text-anchor="middle" class="cost-label"')}${text(x(replacement.year),y(0)+47,'機器交換など','text-anchor="middle" class="cost-label"')}`:'';
 return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-labelledby="title description"><title id="title">同じ試算例の累積収支</title><desc id="description">${esc(desc)}</desc><metadata>${esc(JSON.stringify(metadata))}</metadata><style>svg{background:#fff;font-family:"Yu Gothic","Noto Sans JP",Meiryo,sans-serif;color:#123f31}text{fill:#123f31;font-size:16px}.grid{stroke:#e0e6df;stroke-width:1}.zero{stroke:#81998a;stroke-width:1.5}.tick{fill:#515d56;font-size:15px}.line{fill:none;stroke:#007447;stroke-width:3;stroke-linejoin:round;stroke-linecap:round}.dot{fill:#007447;stroke:#fff;stroke-width:2}.guide{stroke:#007447;stroke-dasharray:3 4;fill:none}.label{fill:#007447;font-weight:700}.cost-dot{fill:#a17112;stroke:#fff;stroke-width:2}.cost-guide{stroke:#b18b3d;stroke-dasharray:3 4;fill:none}.cost-label{fill:#87600d;font-size:15px}.initial{fill:#515d56;font-size:15px}</style><rect width="${width}" height="${height}" fill="#fff"/>${text(left,28,'累積収支（万円）','font-weight="700"')}${text(width-right,54,'30年後 ＋'+man(selected.profit_yen),'text-anchor="end" class="label"')}${grids.join('')}<polyline class="line" data-series="standard" points="${line}"/>${years}${text((left+width-right)/2,383,'設置からの年数','text-anchor="middle" class="tick"')}<circle cx="${left}" cy="${f(y(-selected.net_initial_outlay_yen))}" r="4" class="dot"/>${text(left+8,y(-selected.net_initial_outlay_yen)+24,'初期負担 −'+man(selected.net_initial_outlay_yen),'class="initial"')}<path d="M${f(x(payback.year))} ${f(y(payback.cumulative_cash_flow_yen)+8)}V${f(y(0)+48)}" class="guide"/><circle data-marker="payback" cx="${f(x(payback.year))}" cy="${f(y(payback.cumulative_cash_flow_yen))}" r="5" class="dot"/>${text(x(payback.year),y(0)+68,payback.year+'年目に元手回収','text-anchor="middle" class="label"')}${drop}<circle data-marker="endpoint" cx="${f(x(30))}" cy="${f(y(selected.profit_yen))}" r="5" class="dot"/></svg>\n`;
}
const checkOnly=process.argv.includes('--check');
async function output(url,text){if(checkOnly){if(await readFile(url,'utf8')!==text)throw Error('累積収支グラフの再生成が必要です：'+url.pathname);}else await writeFile(url,text);}
for(const compact of [false,true])await output(new URL('../site/shared/assets/article-solar-economics-cumulative'+(compact?'-compact':'')+'.svg',import.meta.url),render(compact));
const htmlUrl=new URL('../site/guides/solar-economics/index.html',import.meta.url);
const html=await readFile(htmlUrl,'utf8');
const replacementYear=annual.find(r=>r.replacement_cost_yen>0)?.year;
const alt=`第2章と同じ試算例の累積収支．初期負担${man(selected.net_initial_outlay_yen)}のマイナスから始まり，${selected.payback_year}年目に元手回収．${replacementYear}年目には機器交換などで下がり，30年後は${man(selected.profit_yen)}のプラス．`;
const synced=html.replace(/(<img\b[^>]*data-guide-alt="journey-cashflow"[^>]*alt=")[^"]*(")/g,(_,start,end)=>start+alt+end);
if(synced!==html){if(checkOnly)throw Error('累積収支グラフの代替文の更新が必要です');await writeFile(htmlUrl,synced);}
await output(new URL('./artifacts/economics-cumulative-calculation.json',import.meta.url),JSON.stringify(metadata,null,2)+'\n');
console.log(JSON.stringify({dataVersion:data.data_version,initial:metadata.initial,payback:metadata.payback,endpoint:metadata.endpoint,annualPoints:annual.length}));
