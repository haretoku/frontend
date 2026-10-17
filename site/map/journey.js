import {journeyRoutes,journeyPageId,journeyHref} from './routes.js';
import {renderReadingBody,renderReadingEnding,renderReadingQuestions} from './reading-view.js';
import {loadFrontendData} from '../../data/src/data-loader.js';
import {calculateJourneyEstimate} from './estimate-model.js';
import {pages, starts, steps} from './content.js';
import {readProgress,writeProgress,clearProgress} from './progress-storage.js';
import {assets} from './assets.js';
import {readDiagnosisQuery} from './legacy-route.js';
import {recordDiagnosisComplete,recordJourneyAction} from '../shared/analytics.js';
import {chapterNavigation,finishChapter} from './chapter-progress.js';
import {renderProviderComparison} from './provider-comparison-view.js';
import {openConsultationProvider} from './consultation-progress.js';
import {renderConsultationProviders,consultationProviderForUrl} from './consultation-view.js';
import {initializeHeaderMenu} from '../shared/site-header.js';
import {initialJourneyState,restoreJourneyState,validJourneyInput,normalizeJourneyDiagnosis,applyInitialSolarPlan} from './journey-state.js';

const $ = selector => document.querySelector(selector);
const names = {solar_only:'太陽光4 kW',solar_plus_standard_battery:'太陽光4 kW＋蓄電池9.5 kWh'};
const backups = {solar_only:'昼間中心',solar_plus_standard_battery:'昼も夜も'};
let data=null, preview=null, diagnosisStarted=false, hydrated=false;
let diagnosisTimer;
let state=initialJourneyState();
let diagnosisDraft={prefecture:false,bill:false};
let unsavedSource=null;
const safe = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=value=>`約${(Math.abs(value)/10000).toLocaleString('ja-JP',{maximumFractionDigits:0})}万円`;
const signed=value=>`${value<0?'−':'＋'}${money(value)}`;
function financeAmount(value,direction){
  const effect=value*direction;
  const tone=effect===0?'zero':effect<0?'negative':'positive';
  return `<dd class="amount-${tone}">${effect===0?'0円':signed(effect)}</dd>`;
}
// 他タブが保存した項目は残し，この操作が変更した項目だけを重ねる．
function save(change={}){
  if(!hydrated)return;
  const previousInput=JSON.stringify(state.input);
  const stored=readProgress(),source=JSON.stringify(stored);
  let latest=unsavedSource===source?state:restoreJourneyState(stored,pages,steps.length);
  if(data)latest=normalizeJourneyDiagnosis(latest,data.prefectures,Object.keys(names));
  state=typeof change==='function'?change(latest):{...latest,...change};
  unsavedSource=writeProgress(state)?null:source;
  if(data&&previousInput!==JSON.stringify(state.input)&&!diagnosisDraft.prefecture&&!diagnosisDraft.bill){
    preview=valid(state.input)?estimate(state.input):null;
    $('#prefecture').value=state.input?.prefectureCode??'';
    $('#bill').value=state.input?.monthlyElectricityBillYen??'';
  }
}
function valid(input){return validJourneyInput(input,data?.prefectures);}
function estimate(input,equipment='solar_only') {
  const result=calculateJourneyEstimate({prefectureCode:input.prefectureCode,municipalityCode:null,housingAge:'existing',monthlyElectricityBillYen:input.monthlyElectricityBillYen,systemCapacityKw:4,equipmentPackage:equipment,roofOrientation:'south',daytimeOccupancy:'unknown_standard'},data);
  const scenario=result.scenarios.find(s=>s.scenario==='standard');
  if(!Number.isFinite(scenario?.profit_yen))throw new Error('この条件では金額を確定できません．別の地域・条件で試してください．');
  return {scenario,input:result.input};
}
function goalResult(){if(!valid(state.goal?.input)||!names[state.goal?.equipment])return null;try{return estimate(state.goal.input,state.goal.equipment);}catch{return null;}}
function renderMap({keepConsultationLinks=false}={}){
  const navigator=$('.board-navigator');navigator.hidden=!state.pawnChosen;
  const allRead=steps.every((_,step)=>state.completed.includes(step));
  $('.goal').classList.toggle('is-current',allRead);
  $('.goal .map-pawn')?.remove();
  for(const stop of document.querySelectorAll('[data-stop]')) {
    const step=Number(stop.dataset.stop),active=!allRead&&step===state.step,completed=state.completed.includes(step);
    stop.classList.toggle('is-current',active);stop.querySelector('.here').hidden=!active;
    stop.classList.toggle('is-complete',completed);
    stop.querySelector('.here').textContent=active&&!completed&&state.completed.length?'次はここ':'いまここ';
    const button=stop.querySelector('button');if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    if(completed)button.setAttribute('aria-description','確認済み');else button.removeAttribute('aria-description');
    const station=stop.querySelector('.station');station.querySelector('.map-pawn')?.remove();
    station.querySelector('.completion-mark')?.remove();
    if(completed){const mark=document.createElement('span');mark.className='completion-mark';mark.textContent='✓';mark.setAttribute('aria-hidden','true');station.append(mark);}
    if(active&&state.pawnChosen){const img=document.createElement('img');img.className='map-pawn';img.src=assets[`pawn-${state.pawn}`];img.alt='あなたの駒';station.append(img,navigator);}
  }
  if(allRead&&state.pawnChosen){const img=document.createElement('img');img.className='map-pawn';img.src=assets[`pawn-${state.pawn}`];img.alt='あなたの駒';$('.goal').append(img,navigator);}
  const result=goalResult(),has=!!result;
  $('.goal').classList.toggle('has-result',has);$('.goal').classList.toggle('has-loss',has&&result.scenario.profit_yen<0);
  $('#goal-home').hidden=!has;$('#goal-effects').hidden=!has;
  const battery=has&&state.goal.equipment==='solar_plus_standard_battery';
  $('#goal-battery').toggleAttribute('hidden',!battery);$('#goal-moon').toggleAttribute('hidden',!battery);
  $('#goal-amount').textContent=has?signed(result.scenario.profit_yen):'';
  $('#goal-equipment').textContent=has?names[state.goal.equipment]:'';
  $('#goal-backup').textContent=has?backups[state.goal.equipment]:'';
  $('#goal-note').textContent=has?'収支は概算です．':'診断で設備を選んでみよう';
  $('#goal-review').textContent=has?'プランを見直す →':'診断してプランを選ぶ →';
  $('#goal-consultation-status').hidden=!state.consultation.openedProviderIds.length;
  const consultationVisible=!$('#map').hidden;
  $('#map-consultation').hidden=!consultationVisible;
  if(!keepConsultationLinks)$('#map-consultation').innerHTML=consultationVisible?renderConsultationProviders({compact:true,comparison:renderProviderComparison({idPrefix:'map-',placement:'map_comparison'})}):'';
}
function renderResponsePortrait(){
  const portrait=state.pawnChosen?`<img src="${assets[`pawn-${state.pawn}`]}" alt="">`:'<span class="neutral-pawn"></span>';
  $('#response-portrait').innerHTML=portrait;$('#diagnosis-start-portrait').innerHTML=portrait;
}
function backupIllustration(equipment){
  return `<svg class="result-backup-icon" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-sun" x="2" y="1" width="28" height="28"/>${equipment==='solar_plus_standard_battery'?'<path class="backup-moon" d="M48 3a12 12 0 1 0 12 17A12 12 0 0 1 48 3Z"/>':''}<path class="backup-bulb" d="M25 49c0-5-6-7-6-14a12 12 0 0 1 24 0c0 7-6 9-6 14Zm0 5h12m-10 5h8M31 48V37m-5-4 5 4 5-4"/></svg>`;
}
function resultCard(equipment){
  try{
    const {scenario:s}=estimate(state.input,equipment);
    const selected=state.goal?.equipment===equipment&&JSON.stringify(state.goal.input)===JSON.stringify(state.input);
    const totalCosts=s.gross_installation_cost_yen-s.subsidy_yen+s.total_maintenance_and_replacement_cost_yen;
    return `<section class="result-card ${selected?'selected':''}"><h3>${names[equipment]}</h3><p class="result-caption">30年間で残りそうなお金</p><p class="result-amount ${s.profit_yen<0?'is-loss':''}">${signed(s.profit_yen)}</p>
      <dl class="result-finance-total"><dt>節約・収入<small>30年間</small></dt>${financeAmount(s.total_revenue_yen,1)}</dl>
      <div class="result-cost-group"><dl class="result-finance-total"><dt>費用の合計</dt>${financeAmount(totalCosts,-1)}</dl><dl class="result-cost-breakdown"><dt>取り付ける費用<small>補助金を引く前</small></dt>${financeAmount(s.gross_installation_cost_yen,-1)}<dt>補助金*</dt>${financeAmount(s.subsidy_yen,1)}<dt>使っている間の費用<small>30年間の点検・交換・修理予備費・保険料</small></dt>${financeAmount(s.total_maintenance_and_replacement_cost_yen,-1)}</dl></div>
      <p class="form-note">*住宅や設備の条件を満たし，補助金を使えるものとして試算しています．実際にもらえるかは，契約前に確認してください．</p>
      <div class="result-backup">${backupIllustration(equipment)}<p class="backup-label">停電時は${backups[equipment]}<small>対応設備の場合．使える家電・時間には限りがあります．</small></p></div>
      <button class="secondary" type="button" data-select="${equipment}">${selected?'選択中：わが家のプラン':'この設備をわが家のプランにする'}</button></section>`;
  }catch(error){return `<section class="result-card"><h3>${names[equipment]}</h3><p>${safe(error.message)}</p></section>`;}
}
function renderPage(focus=true){
  const id=journeyPageId(new URL(location.href))??'map';
  const route=journeyRoutes[id];
  if(location.pathname!==route||Object.hasOwn(journeyRoutes,location.hash.slice(1))||location.hash==='#quote')history.replaceState(null,'',route+location.search);
  document.querySelector('link[rel="canonical"]')?.setAttribute('href',`https://haretoku.jp${route}`);
  document.querySelector('meta[property="og:url"]')?.setAttribute('content',`https://haretoku.jp${route}`);
  const page=pages.find(p=>p.id===id);
  const guideMenu=document.querySelector('.menu-references a[href="/guides/"]');
  if(page&&!page.diagnosis)guideMenu?.setAttribute('aria-current','page');else guideMenu?.removeAttribute('aria-current');
  document.body.classList.toggle('is-map',!page);
  $('#map').hidden=!!page;$('#reading').hidden=!page;
  $('#reading').classList.toggle('reading-provider-comparison',!!page?.providerComparison);
  $('.map-link').removeAttribute('aria-current');
  if(!page){document.title='わが家の太陽光えらび｜はれトク';$('.map-link').setAttribute('aria-current','page');renderMap();if(focus)requestAnimationFrame(()=>{$('#map-title').focus({preventScroll:true});window.scrollTo(0,0);});return;}
  save(latest=>({...latest,step:page.step,last:{...latest.last,[page.step]:page.id}}));renderMap();
  const siblings=pages.filter(p=>p.step===page.step);
  $('#page-chapter').textContent=`${page.step===0?'':`${page.step}．`}${steps[page.step]}`;
  $('#page-position').textContent=`${siblings.indexOf(page)+1}／${siblings.length}`;
  $('#page-title').textContent=page.title;document.title=`${page.title}｜はれトク`;
  $('#page-body').innerHTML=renderReadingBody(page,state);$('#estimate-slot').hidden=!page.diagnosis;
  $('#page-ending').innerHTML=renderReadingEnding(page);
  $('#page-questions').innerHTML=renderReadingQuestions(page);renderResponsePortrait();
  $('#page-ending').hidden=false;$('#page-response').hidden=false;
  const index=pages.indexOf(page);
  $('.previous-page').hidden=!index;$('#previous').href=index?journeyRoutes[pages[index-1].id]:'/';
  const navigation=chapterNavigation(pages,page.id);
  $('#next').href=journeyHref(navigation.href);$('#next').textContent=navigation.label;
  $('#next').hidden=!!page.nextRoutes;
  $('#next-routes').hidden=!page.nextRoutes;
  $('#next-routes').innerHTML=(page.nextRoutes??[]).map(route=>`<a class="primary" href="${safe(journeyHref(route.href))}"><span>${safe(route.text)}</span><strong>${safe(route.label)}</strong></a>`).join('');
  if(page.diagnosis)renderResults();
  if(focus)requestAnimationFrame(()=>{$('#page-title').focus({preventScroll:true});window.scrollTo(0,0);});
}
function chart(){
  const chartNames={solar_only:'太陽光のみ',solar_plus_standard_battery:'太陽光＋蓄電池'};
  const series=Object.keys(names).map(e=>({equipment:e,...estimate(state.input,e),color:e==='solar_only'?'#008653':'#b3780c'}));
  const values=series.flatMap(({scenario:s})=>[-s.initial_cost_yen,...s.annual_cash_flows.map(v=>v.cumulative_cash_flow_yen)]);
  const rawMin=Math.min(0,...values),rawMax=Math.max(0,...values);
  const roughStep=Math.max(10000,(rawMax-rawMin)/4),magnitude=10**Math.floor(Math.log10(roughStep));
  const tickStep=[1,2,5,10].find(v=>v*magnitude>=roughStep)*magnitude;
  const min=Math.floor(rawMin/tickStep)*tickStep,max=Math.max(min+tickStep,Math.ceil(rawMax/tickStep)*tickStep);
  function renderChart(compact){
  const left=compact?46:82,right=compact?300:668,top=compact?80:58,bottom=compact?252:326,x=t=>left+t*(right-left)/30,y=v=>top+(max-v)/(max-min)*(bottom-top);
  const endpoints=series.map(item=>({...item,labelY:Math.max(top+16,Math.min(bottom-38,y(item.scenario.profit_yen)-8))})).sort((a,b)=>a.labelY-b.labelY);
  if(endpoints[1].labelY-endpoints[0].labelY<60){
    const firstY=Math.max(top+16,Math.min(bottom-98,(endpoints[0].labelY+endpoints[1].labelY)/2-30));
    endpoints[0].labelY=firstY;endpoints[1].labelY=firstY+60;
  }
  const recovery=s=>s.payback_year===null?'30年以内の回収なし':`${s.payback_year}年目`;
  const description=`30年間の累積収支．補助金を差し引いた設置費から始まり，節約・収入から維持費を引いて積み上げます．${series.map(({equipment:e,scenario:s})=>`${chartNames[e]}：費用を取り戻す目安は${recovery(s)}，30年後${s.profit_yen===0?'0円':signed(s.profit_yen)}．`).join('')}`;
  let svg=`<svg viewBox="0 0 ${compact?'320 300':'900 386'}" role="img" aria-label="${safe(description)}"><text class="chart-unit" x="${left}" y="${compact?16:22}">ここまでの収支（万円）</text>`;
  if(compact){
    svg+=series.map(({equipment:e,scenario:s,color},i)=>`<line x1="46" x2="62" y1="${34+i*22}" y2="${34+i*22}" stroke="${color}" class="chart-series"/><text x="70" y="${38+i*22}" style="fill:${color}">${safe(chartNames[e])}　${s.profit_yen===0?'0円':signed(s.profit_yen)}</text>`).join('');
  }else svg+='<line class="chart-zero" x1="326" y1="18" x2="350" y2="18"/><text class="chart-zero-caption" x="360" y="22">0円：節約・収入と費用が同じ</text>';
  for(let tick=min;tick<=max;tick+=tickStep){
    const zero=tick===0;
    svg+=`<line class="${zero?'chart-zero':'chart-grid'}" x1="${left}" y1="${y(tick)}" x2="${right}" y2="${y(tick)}"/><text class="chart-axis" x="${left-16}" y="${y(tick)+5}" text-anchor="end">${tick<0?'−':''}${(Math.abs(tick)/10000).toLocaleString('ja-JP')}</text>`;
  }
  for(const {scenario:s,equipment:e,color} of series){
    const points=[[0,-s.initial_cost_yen],...s.annual_cash_flows.map(v=>[v.year,v.cumulative_cash_flow_yen])];
    svg+=`<polyline class="chart-series" data-equipment="${e}" points="${points.map(([t,v])=>`${x(t)},${y(v)}`).join(' ')}" fill="none" stroke="${color}"/><circle class="chart-start" cx="${left}" cy="${y(-s.initial_cost_yen)}" r="4" fill="${color}"/>`;
    if(s.payback_year!==null){
      const point=s.annual_cash_flows.find(v=>v.year===s.payback_year);
      svg+=`<circle class="chart-recovery" cx="${x(point.year)}" cy="${y(point.cumulative_cash_flow_yen)}" r="6" stroke="${color}"><title>${safe(chartNames[e])}：${point.year}年目に費用を取り戻す目安</title></circle>`;
    }
    svg+=`<circle class="chart-end" cx="${right}" cy="${y(s.profit_yen)}" r="5" fill="${color}"/>`;
  }
  if(!compact)for(const {equipment:e,scenario:s,color,labelY} of endpoints){
    svg+=`<path class="chart-label-leader" d="M${right+9} ${y(s.profit_yen)} L690 ${y(s.profit_yen)} L701 ${labelY+7}" stroke="${color}"/><text class="chart-end-name" x="714" y="${labelY}" style="fill:${color}">${safe(chartNames[e])}</text><text class="chart-end-value ${s.profit_yen<0?'is-loss':s.profit_yen===0?'is-zero':''}" x="714" y="${labelY+32}" style="${s.profit_yen>0?`fill:${color}`:''}">${s.profit_yen===0?'0円':signed(s.profit_yen)}</text>`;
  }
  svg+=[0,10,20,30].map(t=>`<text class="chart-axis" x="${x(t)}" y="${compact?282:357}" text-anchor="middle">${t===0?'設置時':`${t}年`}</text>`).join('')+'</svg>';
  return svg+(compact?'<p class="chart-zero-note">0円：節約・収入と費用が同じ</p>':'')+`<ol class="chart-journey"><li><span class="chart-stage">設置</span><p>補助金を引いた設置費からスタート</p></li><li><span class="chart-stage">費用を取り戻す目安</span><div class="chart-recovery-summary">${series.map(({equipment:e,scenario:s})=>`<p class="${e==='solar_only'?'solar-line':'battery-line'}">${chartNames[e]}：<strong>${recovery(s)}</strong></p>`).join('')}</div></li><li><span class="chart-stage">30年後</span><p>節約・収入から費用を引いた結果</p></li></ol>`;
  }
  return `<div class="chart-wide">${renderChart(false)}</div><div class="chart-compact">${renderChart(true)}</div>`;
}
function renderResults(){
  const ready=diagnosisStarted&&!!preview;
  $('#diagnosis-entry').hidden=diagnosisStarted;$('#diagnose').hidden=!diagnosisStarted;
  $('#diagnosis-result').hidden=!ready;$('#page-ending').hidden=!ready;$('#page-response').hidden=!ready;
  if(!ready)return;
  const initialPlan=applyInitialSolarPlan(state,data.prefectures);
  if(initialPlan!==state){save(latest=>applyInitialSolarPlan(latest,data.prefectures));renderMap();if(!preview){renderResults();return;}}
  $('#result-cards').innerHTML=resultCard('solar_only')+resultCard('solar_plus_standard_battery');
  $('#chart').innerHTML=chart();recordDiagnosisComplete();const name=data.prefectures.find(p=>p.code===state.input.prefectureCode)?.name;
  $('#result-condition').textContent=state.input.monthlyElectricityBillYen===null?`${name}・標準的な電気代（月${preview.input.monthly_electricity_bill_yen.toLocaleString('ja-JP')}円）で試算．`:`${name}・月々の電気代 ${state.input.monthlyElectricityBillYen.toLocaleString('ja-JP')}円で試算．`;
}
const closeMenu=initializeHeaderMenu();
function recordConsultationClick(event){
  if(event.defaultPrevented||event.button>1)return;
  const link=event.target.closest('[data-consult-provider]');
  const provider=consultationProviderForUrl(link?.dataset.consultProvider,link?.href);
  if(!provider)return;
  save(latest=>openConsultationProvider(latest,provider.id,steps.length));
  // MAP上のクリック元を取り替えると，新しいタブを開く既定動作を妨げるため，状態表示だけ変える．
  renderMap({keepConsultationLinks:true});
}
document.addEventListener('click',recordConsultationClick);
document.addEventListener('auxclick',recordConsultationClick);
$('#goal-consult').addEventListener('click',()=>{$('#map-consultation').scrollIntoView({block:'start',behavior:'smooth'});$('#map-consultation-title').focus({preventScroll:true});recordJourneyAction('goal_consultation_click');});
document.addEventListener('click',event=>{
  const next=event.target.closest('#next');
  if(next){
    const navigation=chapterNavigation(pages,journeyPageId(new URL(location.href)));
    if(navigation.completedStep!==null){
      save(latest=>finishChapter(latest,navigation.completedStep,steps.length));
      recordJourneyAction('chapter_complete',navigation.completedStep);
    }
  }
  const selection=event.target.closest('[data-select]');
  if(selection&&journeyPageId(new URL(location.href))==='estimate'&&valid(state.input)){
    const equipment=selection.dataset.select;
    try{estimate(state.input,equipment);const changed=state.goal?.equipment!==equipment||JSON.stringify(state.goal?.input)!==JSON.stringify(state.input);const input={...state.input};save({input,goal:{input:{...input},equipment}});renderMap();
      if(changed)recordJourneyAction('plan_change');
      renderResults();
      document.querySelector(`#result-cards [data-select="${equipment}"]`)?.focus({preventScroll:true});
    }catch(error){$('#form-message').textContent=error.message;}
  }
});
document.addEventListener('change',event=>{if(event.target.name==='pawn'){save({pawn:event.target.value,pawnChosen:true});renderMap();renderResponsePortrait();}});
for(const button of document.querySelectorAll('[data-step]'))button.addEventListener('click',()=>{const step=Number(button.dataset.step);recordJourneyAction('map_step_click',step);location.assign(journeyRoutes[step===0&&!state.pawnChosen?starts[0]:state.last[step]||starts[step]]);});
$('#start-diagnosis').addEventListener('click',()=>{diagnosisStarted=true;renderResults();$('#prefecture').focus();$('#diagnose').scrollIntoView({block:'start'});recordJourneyAction('diagnosis_start');});
function updateDiagnosis(){
  clearTimeout(diagnosisTimer);
  if(!data||!diagnosisStarted||journeyPageId(new URL(location.href))!=='estimate')return;
  if(!$('#prefecture').value){preview=null;renderResults();$('#form-message').textContent='';return;}
  if(!$('#diagnose').checkValidity()){preview=null;renderResults();$('#form-message').textContent='電気代は0〜1,000,000円の整数で入力してください．';return;}
  const input={prefectureCode:$('#prefecture').value,monthlyElectricityBillYen:$('#bill').value===''?null:Number($('#bill').value)};
  try{preview=estimate(input);save({input});diagnosisDraft={prefecture:false,bill:false};renderMap();renderResults();$('#form-message').textContent='';}
  catch(error){preview=null;renderResults();$('#form-message').textContent=error.message;}
}
$('#diagnose').addEventListener('submit',event=>{event.preventDefault();updateDiagnosis();});
// 編集途中と計算済みの入力を区別する．選んだ目標は別のスナップショットとして保持する．
$('#diagnose').addEventListener('input',event=>{
  if(event.target.id==='prefecture'||event.target.id==='bill')diagnosisDraft[event.target.id]=true;
  clearTimeout(diagnosisTimer);preview=null;renderResults();$('#form-message').textContent='';
  if(event.target.id==='prefecture')updateDiagnosis();else diagnosisTimer=setTimeout(updateDiagnosis,250);
});
$('#reset').addEventListener('click',()=>{
  closeMenu();$('#reset-dialog').showModal();
});
$('#cancel-reset').addEventListener('click',()=>$('#reset-dialog').close());
$('#reset-dialog').addEventListener('close',()=>$('#menu-button').focus());
$('#confirm-reset').addEventListener('click',()=>{
  $('#reset-dialog').close();
  history.replaceState(null,'',location.pathname+location.hash);
  clearTimeout(diagnosisTimer);closeMenu();clearProgress();diagnosisDraft={prefecture:false,bill:false};preview=null;diagnosisStarted=false;save(initialJourneyState());$('#diagnose').reset();$('#form-message').textContent=data?'':'データを読み込んでいます．';if(location.pathname==='/')renderPage();else location.assign('/');
});
window.addEventListener('hashchange',()=>{clearTimeout(diagnosisTimer);closeMenu();renderPage();});
// 別URLから「戻る」で復元された画面にも，他ページで保存したプラン・読了を反映する．
window.addEventListener('pageshow',event=>{
  if(!event.persisted)return;
  clearTimeout(diagnosisTimer);diagnosisDraft={prefecture:false,bill:false};
  state=restoreJourneyState(readProgress(),pages,steps.length);
  if(data){
    state=normalizeJourneyDiagnosis(state,data.prefectures,Object.keys(names));
    preview=valid(state.input)?estimate(state.input):null;
    if(preview&&(state.goal||state.completed.includes(1)))diagnosisStarted=true;
    $('#prefecture').value=state.input?.prefectureCode??'';
    $('#bill').value=state.input?.monthlyElectricityBillYen??'';
  }
  renderPage(false);
});
// 復元前に状態を保存すると，保存済み入力が失われるため，先に読み取る．
for(const link of document.querySelectorAll('a[href]')){const href=link.getAttribute('href');link.setAttribute('href',journeyHref(href));}
state=restoreJourneyState(readProgress(),pages,steps.length);
hydrated=true;
save();
renderPage();
try{
  ({publicData:data}=await loadFrontendData());
  for(const p of data.prefectures){const option=document.createElement('option');option.value=p.code;option.textContent=p.name;$('#prefecture').append(option);}
  save();
  const queryInput=readDiagnosisQuery(new URL(location.href),data.prefectures.map(p=>p.code));
  const restoredInput=queryInput??state.input;
  if(!diagnosisDraft.prefecture)$('#prefecture').value=restoredInput?.prefectureCode??'';
  if(!diagnosisDraft.bill)$('#bill').value=restoredInput?.monthlyElectricityBillYen??'';
  diagnosisStarted=diagnosisStarted||!!queryInput||!!state.goal||state.completed.includes(1);
  if(queryInput)history.replaceState(null,'',location.pathname+location.hash);
  $('#form-message').textContent='';
  if(diagnosisDraft.prefecture||diagnosisDraft.bill){preview=null;updateDiagnosis();}
  else if(valid(restoredInput)){preview=estimate(restoredInput);if(queryInput)save({input:queryInput});}
  // 説明を読み始めた後のデータ到着で，開いた質問やフォーカスを作り直さない．
  const currentPage=journeyPageId(new URL(location.href));
  if(currentPage==='map'||currentPage==='estimate')renderPage(false);else renderMap();
}catch{$('#form-message').textContent='診断データを読み込めませんでした．説明とマップは利用できます．';}
