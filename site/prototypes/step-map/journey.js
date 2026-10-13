import {loadFrontendData} from '../../../data/src/data-loader.js';
import {calculateEstimate} from '../../simulator/src/calculator.js';
import {quoteMaterial} from '../../shared/quote-config.js';
import {pages, starts} from './content.js';
import {readProgress,writeProgress,clearProgress} from './progress-storage.js';

const $ = selector => document.querySelector(selector);
const names = {solar_only:'太陽光4 kW',solar_plus_standard_battery:'太陽光4 kW＋蓄電池9.5 kWh'};
const backups = {solar_only:'昼間中心',solar_plus_standard_battery:'昼も夜も'};
let data=null, preview=null, comparison=false, hydrated=false;
let state={step:0,pawn:null,pawnChosen:false,input:null,goal:null,last:{}};
const safe = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const money=value=>`約${(Math.abs(value)/10000).toLocaleString('ja-JP',{maximumFractionDigits:0})}万円`;
const signed=value=>`${value<0?'−':'＋'}${money(value)}`;
function save(){if(hydrated)writeProgress(state);}
function valid(input){return input&&data?.prefectures.some(p=>p.code===input.prefectureCode)&&(input.monthlyElectricityBillYen===null||(Number.isInteger(input.monthlyElectricityBillYen)&&input.monthlyElectricityBillYen>=0&&input.monthlyElectricityBillYen<=1000000));}
function estimate(input,equipment='solar_only') {
  const result=calculateEstimate({prefectureCode:input.prefectureCode,municipalityCode:null,housingAge:'existing',monthlyElectricityBillYen:input.monthlyElectricityBillYen,systemCapacityKw:4,equipmentPackage:equipment,roofOrientation:'south',daytimeOccupancy:'unknown_standard'},data);
  const scenario=result.scenarios.find(s=>s.scenario==='standard');
  if(!Number.isFinite(scenario?.profit_yen))throw new Error('この条件では金額を確定できません．別の地域・条件で試してください．');
  return {scenario,input:result.input};
}
function goalResult(){if(!valid(state.goal?.input)||!names[state.goal?.equipment])return null;try{return estimate(state.goal.input,state.goal.equipment);}catch{return null;}}
function goalText(result){const name=data.prefectures.find(p=>p.code===state.goal.input.prefectureCode)?.name;return `${name}・${names[state.goal.equipment]}：30年間で${signed(result.scenario.profit_yen)}．停電時は${backups[state.goal.equipment]}（対応設備の場合）．`;}
function renderMap(){
  const navigator=$('.board-navigator');navigator.hidden=!state.pawnChosen;
  for(const stop of document.querySelectorAll('[data-stop]')) {
    const active=Number(stop.dataset.stop)===state.step;
    stop.classList.toggle('is-current',active);stop.querySelector('.here').hidden=!active;
    const button=stop.querySelector('button');if(active)button.setAttribute('aria-current','step');else button.removeAttribute('aria-current');
    const station=stop.querySelector('.station');station.querySelector('.map-pawn')?.remove();
    if(active&&state.pawnChosen){const img=document.createElement('img');img.className='map-pawn';img.src=`./assets/pawn-${state.pawn}.png`;img.alt='あなたの駒';station.append(img,navigator);}
  }
  const result=goalResult(),has=!!result;
  $('.goal').classList.toggle('has-result',has);$('.goal').classList.toggle('has-loss',has&&result.scenario.profit_yen<0);
  $('#goal-home').hidden=!has;$('#goal-effects').hidden=!has;
  const battery=has&&state.goal.equipment==='solar_plus_standard_battery';
  $('#goal-battery').toggleAttribute('hidden',!battery);$('#goal-moon').toggleAttribute('hidden',!battery);
  $('#goal-amount').textContent=has?signed(result.scenario.profit_yen):'';
  $('#goal-equipment').textContent=has?names[state.goal.equipment]:'';
  $('#goal-backup').textContent=has?backups[state.goal.equipment]:'';
  $('#goal-note').textContent=has?'収支は概算です．':'診断で設備を選んでみよう';
}
function speech(text,speaker='professor'){return `<div class="speech"><img src="./assets/${speaker==='professor'?'professor-chibi':speaker}.png" alt="${speaker==='professor'?'博士':'ナビ'}"><div><span class="speaker">${speaker==='professor'?'博士':'ナビ'}</span><p>${safe(text)}</p></div></div>`;}
function resultCard(equipment){
  try{
    const {scenario:s}=estimate(state.input,equipment);
    const selected=state.goal?.equipment===equipment&&JSON.stringify(state.goal.input)===JSON.stringify(state.input);
    return `<section class="result-card ${selected?'selected':''}"><h2>${names[equipment]}</h2><p class="result-caption">30年間で最後に残るお金</p><p class="result-amount ${s.profit_yen<0?'is-loss':''}">${signed(s.profit_yen)}</p><dl><dt>はじめに払う費用*</dt><dd>${money(s.initial_cost_yen)}</dd><dt>30年間の節約・売る収入</dt><dd>${money(s.total_revenue_yen)}</dd><dt>30年間の点検・機器交換費</dt><dd>${money(s.total_maintenance_and_replacement_cost_yen)}</dd></dl><p class="form-note">*補助金を使える想定で差し引いた目安．</p><p class="backup-label">停電時：${backups[equipment]}<small>対応設備の場合．家電・時間は要確認．</small></p><button class="secondary" type="button" data-select="${equipment}">${selected?'選択中：この設備をゴールにする':'この設備をゴールにする'}</button></section>`;
  }catch(error){return `<section class="result-card"><h2>${names[equipment]}</h2><p>${safe(error.message)}</p></section>`;}
}
function renderPage(focus=true){
  const id=location.hash.slice(1)||'map';
  if(id!=='map'&&!pages.some(p=>p.id===id)){location.replace('#map');return;}
  const page=pages.find(p=>p.id===id);
  document.body.classList.toggle('is-map',!page);
  $('#map').hidden=!!page;$('#reading').hidden=!page;
  $('.map-link').removeAttribute('aria-current');
  if(!page){document.title='わが家の太陽光えらび｜はれトク・試作';$('.map-link').setAttribute('aria-current','page');renderMap();if(focus)requestAnimationFrame(()=>{$('#map-title').focus({preventScroll:true});window.scrollTo(0,0);});return;}
  state.step=page.step;state.last[page.step]=page.id;save();renderMap();
  const siblings=pages.filter(p=>p.step===page.step);
  $('#page-position').textContent=`${page.step===0?'START':`STEP ${page.step}`} · ${siblings.indexOf(page)+1} / ${siblings.length}`;
  $('#page-title').textContent=page.title;document.title=`${page.title}｜はれトク・試作`;
  let body=speech(page.text,page.speaker);
  if(page.diagram)body+=`<ol class="mini-diagram" aria-label="このページの全体像">${page.diagram.map(t=>`<li>${safe(t)}</li>`).join('')}</ol>`;
  if(page.characters)body+=`<fieldset class="character-choice"><legend>マップを進むキャラクターを選ぼう</legend><p>見た目だけの選択です．あとから変えても大丈夫．</p>${['male','female'].map((v,i)=>`<label><input type="radio" name="pawn" value="${v}" ${state.pawn===v?'checked':''}><img src="./assets/pawn-${v}.png" alt=""><span>キャラクター${i+1}</span></label>`).join('')}</fieldset>`;
  $('#page-body').innerHTML=body;$('#estimate-slot').hidden=!page.diagnosis;
  let ending=`<div class="nav-summary"><img src="./assets/navigator.png" alt="ナビ"><div><p class="speaker">ここだけ覚えてね</p><ul>${page.summary.map(t=>`<li>${safe(t)}</li>`).join('')}</ul></div></div>`;
  if(page.easy)ending+=`<details class="explanation"><summary>もう少しわかりやすく説明して</summary>${speech(page.easy,'navigator')}</details>`;
  if(page.question)ending+=`<details class="explanation"><summary>${safe(page.question)}</summary>${speech(page.answer)}</details>`;
  if(page.reselect){const result=goalResult();ending+=`<section class="reselection"><h2>いまの目標を，もう一度選ぼう．</h2><p>${result?safe(goalText(result)):'まだ設備を選んでいません．診断で費用と効果を見てみよう．'}</p>${valid(state.input)?`<div class="result-cards">${resultCard('solar_only')}${resultCard('solar_plus_standard_battery')}</div>`:''}<a href="#estimate" class="text-link">地域や電気代から，調べ直す →</a><p id="selection-message" role="status"></p></section>`;}
  if(page.quote){const result=goalResult();ending+=`<div class="consult-goal"><p class="speaker">相談したいことのメモ</p><p>${result?safe(goalText(result)):'設備はまだ検討中．太陽光だけと蓄電池付きの違いを聞きたい．'}</p><ul><li>屋根に置ける容量と，必要な工事は？</li><li>支払う総額・補助金の手続き・保証は？</li><li>停電時に使いたい家電を使える？</li></ul></div><a id="quote-link" class="primary" href="${safe(quoteMaterial.url)}" target="_blank" rel="sponsored noopener">無料見積もり ↗</a><p class="form-note">広告・アフィリエイト ／ ${safe(quoteMaterial.provider)}</p><p class="form-note">入力した情報はリンク先へ送信しません．地域の施工会社へ直接相談する方法もあります．</p>`;}
  if(page.source)ending+=`<details class="sources"><summary>参考資料</summary><a href="${safe(page.source[1])}" target="_blank" rel="noopener">${safe(page.source[0])} ↗</a><br><a href="https://sumai.panasonic.jp/chikuden/sochiku/failure/" target="_blank" rel="noopener">パナソニック：停電時の蓄電システム ↗</a></details>`;
  $('#page-ending').innerHTML=ending;
  const index=pages.indexOf(page);
  $('#previous').href=index?`#${pages[index-1].id}`:'#map';$('#previous').textContent=index?'← 前へ':'← マップへ';
  $('#next').href=index<pages.length-1?`#${pages[index+1].id}`:'#map';$('#next').textContent=page.quote?'目標をマップで見る →':'わかった！ 次へ →';
  if(page.diagnosis)renderResults();
  if(focus)requestAnimationFrame(()=>{$('#page-title').focus({preventScroll:true});window.scrollTo(0,0);});
}
function chart(){
  const series=['solar_only',...(comparison?['solar_plus_standard_battery']:[])].map(e=>({equipment:e,...estimate(state.input,e)}));
  const values=series.flatMap(({scenario:s})=>[-s.initial_cost_yen,...s.annual_cash_flows.map(v=>v.cumulative_cash_flow_yen)]);
  const min=Math.min(0,...values),max=Math.max(1,...values),x=t=>55+t*440/30,y=v=>20+(max-v)/(max-min)*205;
  let svg=`<svg viewBox="0 0 560 275" role="img" aria-label="30年間の累積のお金．費用を払って始まり，節約と収入から維持費を引いて積み上げます．"><line x1="55" y1="${y(0)}" x2="495" y2="${y(0)}" stroke="#96aaa0" stroke-dasharray="4 5"/><text x="2" y="${y(0)-5}">0円</text>${max>1?`<text x="2" y="22">${money(max)}</text>`:''}<text x="2" y="242">−${money(Math.abs(min))}</text>`;
  for(const {scenario:s,equipment:e} of series){const color=e==='solar_only'?'#008653':'#b3780c';const points=[[0,-s.initial_cost_yen],...s.annual_cash_flows.map(v=>[v.year,v.cumulative_cash_flow_yen])];svg+=`<polyline points="${points.map(([t,v])=>`${x(t)},${y(v)}`).join(' ')}" fill="none" stroke="${color}" stroke-width="3"/>`;}
  svg+=[0,10,20,30].map(t=>`<text x="${x(t)}" y="265" text-anchor="middle">${t}年</text>`).join('')+'</svg>';
  return svg+`<div class="chart-legend">${series.map(({equipment:e,scenario:s})=>`<p class="${e==='solar_only'?'solar-line':'battery-line'}">${names[e]}：${s.payback_year===null?'30年以内に費用を取り戻せない想定':`${s.payback_year}年目に費用を取り戻す想定`}，30年後${signed(s.profit_yen)}</p>`).join('')}</div>`;
}
function renderResults(){
  $('#diagnosis-result').hidden=!preview;if(!preview)return;
  $('#result-cards').innerHTML=resultCard('solar_only')+(comparison?resultCard('solar_plus_standard_battery'):'');
  $('#compare-battery').textContent=comparison?'太陽光だけの表示に戻す':'蓄電池を付けると？';$('#compare-battery').setAttribute('aria-expanded',String(comparison));
  $('#chart').innerHTML=chart();const name=data.prefectures.find(p=>p.code===state.input.prefectureCode)?.name;
  $('#result-condition').textContent=`${name}・月々の電気代 ${state.input.monthlyElectricityBillYen===null?`地域の標準値（${preview.input.monthly_electricity_bill_yen.toLocaleString('ja-JP')}円）`:`${state.input.monthlyElectricityBillYen.toLocaleString('ja-JP')}円`}．`;
}
function closeMenu(focus=false){$('#menu').hidden=true;$('#menu-button').setAttribute('aria-expanded','false');if(focus)$('#menu-button').focus();}
$('#menu-button').addEventListener('click',()=>{const open=$('#menu').hidden;$('#menu').hidden=!open;$('#menu-button').setAttribute('aria-expanded',String(open));});
document.addEventListener('click',event=>{
  if(!event.target.closest('.menu-wrap'))closeMenu();
  const selection=event.target.closest('[data-select]');
  if(selection&&valid(state.input)){
    const equipment=selection.dataset.select;
    try{estimate(state.input,equipment);state.goal={input:{...state.input},equipment};save();renderMap();
      if(location.hash==='#estimate'){renderResults();$('#form-message').textContent='この設備をゴールに置きました．次は，仕組みや不安を知ろう．';}
      else{renderPage(false);$('#selection-message').textContent='目標を選び直しました．導入の流れへ進めます．';}
      const scope=location.hash==='#estimate'?'#result-cards':'.reselection';
      document.querySelector(`${scope} [data-select="${equipment}"]`)?.focus({preventScroll:true});
    }catch(error){$('#form-message').textContent=error.message;}
  }
});
document.addEventListener('change',event=>{if(event.target.name==='pawn'){state.pawn=event.target.value;state.pawnChosen=true;save();renderMap();}});
document.addEventListener('keydown',event=>{if(event.key==='Escape'&&!$('#menu').hidden)closeMenu(true);});
document.addEventListener('focusin',event=>{if(!event.target.closest('.menu-wrap'))closeMenu();});
for(const button of document.querySelectorAll('[data-step]'))button.addEventListener('click',()=>{const step=Number(button.dataset.step);location.hash=step===0&&!state.pawnChosen?starts[0]:state.last[step]||starts[step];});
$('#compare-battery').addEventListener('click',()=>{comparison=!comparison;try{renderResults();}catch{comparison=false;renderResults();$('#form-message').textContent='蓄電池付きの比較は，この条件では計算できません．';}});
$('#diagnose').addEventListener('submit',event=>{
  event.preventDefault();if(!data||!$('#diagnose').reportValidity())return;
  const input={prefectureCode:$('#prefecture').value,monthlyElectricityBillYen:$('#bill').value===''?null:Number($('#bill').value)};
  try{preview=estimate(input);state.input=input;comparison=false;save();renderResults();$('#form-message').textContent='目安が出ました．設備を選ぶと，マップのゴールに置けます．';}
  catch(error){preview=null;$('#diagnosis-result').hidden=true;$('#form-message').textContent=error.message;}
});
// 編集途中と計算済みの入力を区別する．選んだ目標は別のスナップショットとして保持する．
$('#diagnose').addEventListener('input',()=>{preview=null;$('#diagnosis-result').hidden=true;$('#form-message').textContent='条件を変えました．もう一度，目安を見てください．選んだ目標は変更していません．';});
$('#reset').addEventListener('click',()=>{
  closeMenu();$('#reset-dialog').showModal();
});
$('#cancel-reset').addEventListener('click',()=>$('#reset-dialog').close());
$('#reset-dialog').addEventListener('close',()=>$('#menu-button').focus());
$('#confirm-reset').addEventListener('click',()=>{
  $('#reset-dialog').close();
  closeMenu();saved=null;clearProgress();state={step:0,pawn:null,pawnChosen:false,input:null,goal:null,last:{}};preview=null;comparison=false;save();$('#diagnose').reset();$('#form-message').textContent=data?'':'データを読み込んでいます．';if(location.hash==='#map')renderPage();else location.hash='map';
});
window.addEventListener('hashchange',()=>{closeMenu();renderPage();});
// 復元前に状態を保存すると，保存済み入力が失われるため，先に読み取る．
let saved=readProgress();
renderPage();
try{
  ({publicData:data}=await loadFrontendData());
  for(const p of data.prefectures){const option=document.createElement('option');option.value=p.code;option.textContent=p.name;$('#prefecture').append(option);}
  if(saved){
    state.step=Number.isInteger(saved.step)&&saved.step>=0&&saved.step<=5?saved.step:0;
    state.pawnChosen=saved.pawnChosen===true&&['male','female'].includes(saved.pawn);state.pawn=state.pawnChosen?saved.pawn:null;
    state.last=Object.fromEntries(Object.entries(saved.last||{}).filter(([step,id])=>pages.some(p=>p.id===id&&String(p.step)===step)));
    if(valid(saved.input)){state.input={prefectureCode:saved.input.prefectureCode,monthlyElectricityBillYen:saved.input.monthlyElectricityBillYen};preview=estimate(state.input);$('#prefecture').value=state.input.prefectureCode;$('#bill').value=state.input.monthlyElectricityBillYen??'';}
    if(valid(saved.goal?.input)&&names[saved.goal?.equipment])state.goal={input:{prefectureCode:saved.goal.input.prefectureCode,monthlyElectricityBillYen:saved.goal.input.monthlyElectricityBillYen},equipment:saved.goal.equipment};
  }
  hydrated=true;save();$('#calculate').disabled=false;$('#form-message').textContent='';renderPage();
}catch{$('#form-message').textContent='診断データを読み込めませんでした．説明とマップは利用できます．';}
