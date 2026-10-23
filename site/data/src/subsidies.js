import {receiveHareDisplayRecords, appendHareDisplayCommon, appendHareDisplayBranch} from '../../shared/hare-display-record.js';
import hareTableUrl from '../../../data/input/hare-display-table.json?url';
import hareBindingUrl from '../../../data/input/hare-display-binding.json?url';
import {appendCommonItemGroups} from '../../shared/common-item-groups.js';
import dataUrl from '../../../data/input/public-data.json?url';
import metadataUrl from '../../../data/input/metadata.json?url';
import {loadFrontendData, loadJson} from '../../../data/src/data-loader.js';
import {usesSchemeContract} from '../../../data/src/scheme-adapter.js';
import {selectSchemeGroups} from './scheme-model.js';
import {listingNotes,diagnosisUrl,selectPrograms,groupPrograms,amountSummary,equipmentLabel,statusLabel,conditionSections,groupedEquipmentSummary,applicationPeriod,receptionFilters,matchesReception} from './model.js';
// The import path is relative to site/data/src; only the received public dataset is used.
const pref = document.querySelector('#prefecture');
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
let hareDisplayRecords;
function disclosure(label) {
  const details=node('details',null,'data-branch-detail');const summary=node('summary',label+'を開く');details.append(summary);
  details.addEventListener('toggle',()=>{summary.textContent=label+(details.open?'を閉じる':'を開く');});
  return details;
}
function appendConditions(parent,sections) {
  for(const section of sections){
    parent.append(node('h5',section.label));if(section.note)parent.append(node('p',section.note));
    // A received fact stays one paragraph. Source line wrapping is ordinary whitespace,
    // never a new condition or a reason to repeat an equipment label.
    for(const text of [...new Set(section.lines)]){const p=node('p');appendDatedText(p,text);parent.append(p);}
  }
}
function listingTable(label){
const table=node('table',null,'data-table data-table--comparison');table.setAttribute('aria-label',label+'の補助制度');const thead=node('thead');const hr=node('tr');for(const t of ['制度名・年度','補助内容','受付状況']){const th=node('th',t);th.scope='col';hr.append(th);}thead.append(hr);table.append(thead);const tbody=node('tbody');
return {table,tbody};
}
function render(updateUrl=true) {
  const params=new URLSearchParams();if(pref.value)params.set('prefecture',pref.value);
  if(reception.value!=='all')params.set('reception',reception.value);
  if(updateUrl)history.replaceState(null,'',location.pathname+(params.size?'?'+params:''));
  results.hidden=!pref.value;
  reception.disabled=!pref.value;
  status.textContent=pref.value?'':'都道府県を選ぶと，国・都道府県の制度を表示します．';
  if(!pref.value)return;
  const province=data.prefectures.find(p=>p.code===pref.value);
  const allGroups=usesSchemeContract(data)?selectSchemeGroups(data,pref.value):groupPrograms(selectPrograms(data,pref.value));
  const groups=allGroups.filter(group=>matchesReception(group,reception.value));
  document.querySelector('#results-title').textContent=province.name+'の補助制度';
  document.querySelector('#result-count').textContent=groups.length+'件'+(reception.value==='all'?'':'／全'+allGroups.length+'件');
  const container=document.querySelector('#programs');container.replaceChildren();
  for(const [level,label] of [['national','国'],['prefecture','都道府県']]) {
    const rows=groups.filter(g=>g[0].government_level===level);
    const section=node('section');const sectionHeading=node('div',null,'data-section-heading');sectionHeading.append(node('h3',label),node('span',rows.length+'件','data-section-count'));section.append(sectionHeading);
    if(!rows.length){section.append(node('p','掲載制度なし','data-muted'));container.append(section);continue;}
    let {table,tbody}=listingTable(label);
    for(const group of rows){
      const tr=node('tr');const title=node('th');title.scope='row';const heading=node('h4');
      const url=group[0].official_urls?.find(url=>/^https?:\/\//.test(url));
      if(url){const a=link(group[0].program_name+' ↗',url);a.target='_blank';a.rel='noopener noreferrer';heading.append(a);}else heading.textContent=group[0].program_name;
      title.append(heading);
      const year=group[0]._catalog?.target_year;
      if(group[0]._catalog)title.append(node('p','対象年度：'+(year||'未確認')));
      for(const note of [...new Set(group.flatMap(listingNotes))])title.append(node('p',note));
      const amount=node('td');amount.dataset.label='補助内容';
      const hareRecord=hareDisplayRecords.get(group[0].record_id);
      if(!hareRecord){
      const official=group.map(p=>p._catalog?.conditions?.official||[]);
      const common=group.length>1&&group.every(p=>p._catalog)?[...new Set(official[0].filter(text=>official.every(parts=>parts.includes(text))))]:[];
      for(const p of group){
        const block=node('section',null,'data-amount-summary');block.append(node('h5',equipmentLabel(p)));
        const commonGroups=p._catalog?.common_item_groups;
        if(commonGroups?.length && p._catalog.common_source_sha256===data.common_branch_trial?.source_sha256){
          appendLines(block,['制度の基本額：'+amountSummary(p)]);
          appendCommonItemGroups(document,block,commonGroups);
          amount.append(block);continue;
        }

        const detail=disclosure('補足・適用条件');
        appendLines(block,['制度の補助額：'+amountSummary(p)]);
        {
          const sections=conditionSections([p]);
          if(official[group.indexOf(p)].length){const section=sections.find(s=>s.label==='補助条件');if(section)section.lines=official[group.indexOf(p)].filter(text=>!common.includes(text));}
          appendConditions(detail,sections.filter(section=>section.lines.length));
        }
        if(detail.children.length>1)block.append(detail);amount.append(block);
      }
      if(common.length){const detail=disclosure('共通の補助条件');appendConditions(detail,[{label:'共通の補助条件',lines:common}]);amount.append(detail);}
      }
      const state=node('td');state.dataset.label='受付状況';for(const text of groupedEquipmentSummary(group,statusLabel))state.append(node('p',text,'data-badge'+(text.endsWith('受付中')||text.endsWith('キャンセル待ち')?' data-badge--open':'')));
      appendLines(state,groupedEquipmentSummary(group,applicationPeriod));
      const confirmed=node('div',null,'data-confirmed');appendLines(confirmed,groupedEquipmentSummary(group,p=>'確認日：'+(p.confirmed_at||'未確認')));state.append(confirmed);
      if(hareRecord){
        if(tbody.children.length){table.append(tbody);section.append(table);}
        const card=node('article',null,'hare-display-scheme');
        card.setAttribute('aria-label',hareRecord.scheme_name);
        const header=node('div',null,'hare-display-scheme-header');
        const institution=node('div',null,'hare-display-scheme-title');institution.append(...title.children);
        const reception=node('div',null,'hare-display-scheme-reception');
        reception.setAttribute('aria-label','受付状況');reception.append(...state.children);
        header.append(institution,reception);card.append(header);
        const common=node('div',null,'hare-display-scheme-common');
        appendHareDisplayCommon(document,common,hareRecord.common);card.append(common);
        const equipment=node('div',null,'hare-display-scheme-equipment');
        for(const branch of hareRecord.branches)appendHareDisplayBranch(document,equipment,branch,{foldHousing:true});
        card.append(equipment);section.append(card);
        ({table,tbody}=listingTable(label));
      }else{tr.append(title,amount,state);tbody.append(tr);}

    }
    if(tbody.children.length){table.append(tbody);section.append(table);}
    container.append(section);
  }
  document.querySelector('#diagnosis-link').href=diagnosisUrl(data,pref.value);
  status.textContent='';
}
function restore(){const p=new URLSearchParams(location.search);pref.value=data.prefectures.some(x=>x.code===p.get('prefecture'))?p.get('prefecture'):'';reception.value=Object.hasOwn(receptionFilters,p.get('reception'))?p.get('reception'):'all';render();}
document.querySelector('#region-form').addEventListener('submit',e=>e.preventDefault());
pref.addEventListener('change',()=>render());window.addEventListener('popstate',restore);
reception.addEventListener('change',()=>render());
try {
const [{publicData},hareTable,hareBinding]=await Promise.all([
  loadFrontendData({publicDataUrl:dataUrl,metadataUrl}),
  loadJson(hareTableUrl),loadJson(hareBindingUrl),
]);
data=publicData;
hareDisplayRecords=receiveHareDisplayRecords(data,hareTable,hareBinding);
pref.replaceChildren(option('','都道府県を選択'));for(const p of data.prefectures)pref.append(option(p.code,p.name));pref.disabled=false;restore();}catch{status.textContent='データを読み込めませんでした．ページを再読み込みしてください．';}
