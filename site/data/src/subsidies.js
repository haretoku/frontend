import dataUrl from '../../../data/input/public-data.json?url';
import {usesSchemeContract} from '../../../data/src/scheme-adapter.js';
import {selectSchemeGroups} from './scheme-model.js';
import {listingMunicipalities,listingNotes,diagnosisDescription,diagnosisUrl,selectPrograms,groupPrograms,amountSummary,equipmentLabel,statusLabel,conditionSections,groupedEquipmentSummary,applicationPeriod,receptionFilters,matchesReception} from './model.js';
// The import path is relative to site/data/src; only the received public dataset is used.
const pref = document.querySelector('#prefecture');
const city = document.querySelector('#municipality');
const status = document.querySelector('#load-status');
const results = document.querySelector('#results');
const reception = document.querySelector('#reception');
const node = (tag,text,cls) => { const el=document.createElement(tag); if(text!=null)el.textContent=text;if(cls)el.className=cls;return el; };
const link = (text,url) => {const a=node('a',text);a.href=url;return a;};
const option = (value,text) => {const o=node('option',text);o.value=value;return o;};
function appendDatedText(el,text) {
  for(const part of text.split(/((?:\d{4}年)?\d{1,2}月\d{1,2}日|\d{4}-\d{2}-\d{2})/)) {
    el.append(/^(?:\d{4}年)?\d{1,2}月\d{1,2}日$|^\d{4}-\d{2}-\d{2}$/.test(part)?node('span',part,'data-date-token'):document.createTextNode(part));
  }
}
function appendLines(cell,texts) {
  for(const text of [...new Set(texts)]) {
    for(const line of text.split('\n')) {
      const p=node('p');const match=line.match(/^(太陽光|蓄電池|共通上限|共通|対象)：(.*)$/);
      if(match){p.append(node('strong',match[1]+'：'));appendDatedText(p,match[2]);}
      else appendDatedText(p,line);
      cell.append(p);
    }
  }
}
let data;
function populateCities(value='') {
  city.replaceChildren(option('','市区町村を選択（任意）'));
  const cities=listingMunicipalities(data).filter(m=>m.prefecture_code===pref.value).sort((a,b)=>a.municipality_code.localeCompare(b.municipality_code));
  for(const m of cities)city.append(option(m.municipality_code,m.municipality_name));
  city.disabled=!pref.value;
  city.value=cities.some(m=>m.municipality_code===value)?value:'';
}
function render(updateUrl=true) {
  const params=new URLSearchParams();if(pref.value)params.set('prefecture',pref.value);if(city.value)params.set('municipality_code',city.value);
  if(reception.value!=='all')params.set('reception',reception.value);
  if(updateUrl)history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
  results.hidden=!pref.value;
  reception.disabled=!pref.value;
  status.textContent=pref.value?'':'都道府県を選ぶと，国・都道府県の制度を表示します．';
  if(!pref.value)return;
  const province=data.prefectures.find(p=>p.code===pref.value);
  const municipality=listingMunicipalities(data).find(m=>m.municipality_code===city.value);
  const allGroups=usesSchemeContract(data)?selectSchemeGroups(data,pref.value,city.value):groupPrograms(selectPrograms(data,pref.value,city.value));
  const groups=allGroups.filter(group=>matchesReception(group,reception.value));
  document.querySelector('#results-title').textContent=province.name+(municipality?' '+municipality.municipality_name:'')+'の補助制度';
  document.querySelector('#result-count').textContent=groups.length+'件'+(reception.value==='all'?'':'／全'+allGroups.length+'件');
  const container=document.querySelector('#programs');container.replaceChildren();
  for(const [level,label] of [['national','国'],['prefecture','都道府県'],['municipality','市区町村']]) {
    if(level==='municipality'&&!city.value)continue;
    const rows=groups.filter(g=>g[0].government_level===level);
    const section=node('section');const sectionHeading=node('div',null,'data-section-heading');sectionHeading.append(node('h3',label),node('span',rows.length+'件','data-section-count'));section.append(sectionHeading);
    const table=node('table',null,'data-table');table.setAttribute('aria-label',label+'の補助制度 '+rows.length+'件');if(!rows.length)table.classList.add('data-table--empty');const thead=node('thead');const hr=node('tr');for(const t of ['制度名・公式情報','補助金額','補助条件','受付状況・申請期間','確認日']){const th=node('th',t);th.scope='col';hr.append(th);}thead.append(hr);table.append(thead);const tbody=node('tbody');
    for(const group of rows){
      const tr=node('tr');const title=node('th');title.scope='row';const heading=node('h4');
      const url=group[0].official_urls?.find(url=>/^https?:\/\//.test(url));
      if(url){const a=link(group[0].program_name+' ↗',url);a.target='_blank';a.rel='noopener noreferrer';heading.append(a);}else heading.textContent=group[0].program_name;
      title.append(heading);
      const year=group[0]._catalog?.target_year;
      if(group[0]._catalog)title.append(node('p','対象年度：'+(year||'未確認')));
      for(const note of [...new Set(group.flatMap(listingNotes))])title.append(node('p',note));
      if(level==='municipality'&&!data.municipalities.some(m=>m.prefecture_code===pref.value&&m.municipality_code===city.value))title.append(node('p','この自治体の補助制度は診断に未反映です．'));
      const dates=node('td',null,'data-confirmed');dates.dataset.label='確認日';appendLines(dates,group.map(p=>p.confirmed_at||'未確認'));
      const amount=node('td');amount.dataset.label='補助金額';appendLines(amount,group.map(p=>{const text=amountSummary(p);return !p._catalog?.branch_label&&/^(太陽光|蓄電池|共通上限|共通)：/.test(text)?text:equipmentLabel(p)+'：'+text;}));
      const state=node('td');state.dataset.label='受付状況・申請期間';for(const text of groupedEquipmentSummary(group,statusLabel))state.append(node('p',text,'data-badge'+(text.endsWith('受付中')||text.endsWith('キャンセル待ち')?' data-badge--open':'')));
      appendLines(state,groupedEquipmentSummary(group,applicationPeriod));
      const target=node('td');target.dataset.label='補助条件';
      for(const section of conditionSections(group)) {
        if(section.label!=='補助条件'){const heading=node('p');heading.append(node('strong',section.label));target.append(heading);}
        if(section.note)target.append(node('p',section.note));
        appendLines(target,section.lines);
      }
      tr.append(title,amount,target,state,dates);tbody.append(tr);
    }
    table.append(tbody);section.append(table);container.append(section);
  }
  document.querySelector('#diagnosis-description').textContent=diagnosisDescription(data,pref.value,city.value);
  document.querySelector('#diagnosis-link').href=diagnosisUrl(data,pref.value,city.value);
  status.textContent='';
}
function restore(){const p=new URLSearchParams(location.search);pref.value=data.prefectures.some(x=>x.code===p.get('prefecture'))?p.get('prefecture'):'';populateCities(p.get('municipality_code'));reception.value=Object.hasOwn(receptionFilters,p.get('reception'))?p.get('reception'):'all';render();}
document.querySelector('#region-form').addEventListener('submit',e=>e.preventDefault());
pref.addEventListener('change',()=>{populateCities();render();});city.addEventListener('change',()=>render());window.addEventListener('popstate',restore);
reception.addEventListener('change',()=>render());
try {const response=await fetch(dataUrl);if(!response.ok)throw new Error('load');data=await response.json();pref.replaceChildren(option('','都道府県を選択'));for(const p of data.prefectures)pref.append(option(p.code,p.name));pref.disabled=false;document.querySelector('#data-date').textContent='データ更新日：'+data.data_version ;restore();}catch{status.textContent='データを読み込めませんでした．ページを再読み込みしてください．';}
