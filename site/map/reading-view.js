import {assets} from './assets.js';
import {renderProviderComparison} from './provider-comparison-view.js';
import {journeyLinks} from './routes.js';
const safe = value => String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const contractorChecklistUrl = new URL('./assets/contractor-checksheet.pdf',import.meta.url).href;
function speech(text,speaker='professor',reference=null){return `<div class="speech speech-${speaker}"><img src="${assets[speaker==='professor'?'professor-chibi':speaker]}" alt=""><div><span class="speaker">${speaker==='professor'?'はれトク博士':'ハレナ'}</span>${(Array.isArray(text)?text:[text]).map(paragraph=>`<p>${safe(paragraph)}</p>`).join('')}${reference?`<p class="question-reference"><a href="${safe(reference.href)}">${safe(reference.label)}</a></p>`:''}</div></div>`;}
function solarUseDiagram(){return `<figure class="solar-use-diagram" aria-label="屋根で作った電気の使い道">
  <div class="solar-use-source"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="${assets.titleArt}#solar-house"/></svg><strong>屋根で電気を作る</strong></div>
  <div class="solar-use-branches">
    <div class="solar-use-branch"><div class="solar-use-outcome"><span>家で使う</span><span class="solar-use-arrow" aria-hidden="true">→</span><strong>電気代を節約</strong></div>
      <div class="solar-use-backup"><p>停電したときも</p><div class="solar-use-times">
        <div><svg class="solar-use-sun" viewBox="0 0 48 48" aria-hidden="true"><use href="#i-sun"/></svg><strong>昼に使う</strong><span>発電した電気を</span></div>
        <div><svg viewBox="0 0 96 64" aria-hidden="true"><use href="${assets.titleArt}#storage-battery" width="64" height="64"/><path d="M83 7a13 13 0 1 0 10 22A13 13 0 0 1 83 7Z" fill="#dec276"/></svg><strong>夜にも使う</strong><span>蓄電池にためた電気を</span></div>
      </div><small>※停電対応の設備が必要です．<br>使える家電・時間には限りがあります．</small></div>
    </div>
    <div class="solar-use-branch solar-use-selling"><div class="solar-use-outcome"><span>余った分を売る</span><span class="solar-use-arrow" aria-hidden="true">→</span><strong>収入になる</strong></div><div class="solar-use-income"><svg class="solar-use-coins" viewBox="0 0 64 64" aria-hidden="true"><use href="#i-coins"/></svg><p>家で使い切れなかった電気を，電力会社に買い取ってもらえます．</p></div></div>
  </div>
</figure>`;}
function solarCostDiagram(){return `<figure class="solar-use-diagram solar-cost-diagram" aria-label="太陽光パネルにかかる費用の内訳">
  <div class="solar-use-source"><svg viewBox="0 0 120 120" aria-hidden="true"><use href="${assets.titleArt}#solar-house"/></svg><strong>太陽光パネルにかかる費用</strong></div>
  <div class="solar-use-branches">
    <div class="solar-use-branch solar-cost-card"><strong class="solar-cost-stage">取り付けるとき</strong><p class="solar-cost-items">機器代・工事代</p>
      <svg class="solar-cost-art" viewBox="0 0 160 120" aria-hidden="true"><use href="${assets.titleArt}#solar-panel" width="105" height="105" x="0" y="8"/><g transform="rotate(16 126 56)" stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><rect x="121" y="40" width="10" height="57" rx="3" fill="#efcf83"/><path d="M104 26h34v10h-7v11h-13V36h-14Z" fill="#d5e3d5"/><path d="m138 26 10 5v9h-10" fill="#b5cabb"/></g></svg>
      <p class="solar-cost-description">パネルなどを購入し，屋根に取り付けます．</p>
    </div>
    <div class="solar-use-branch solar-cost-card"><strong class="solar-cost-stage">使っている間</strong><p class="solar-cost-items">点検・修理・機器交換</p>
      <svg class="solar-cost-art" viewBox="0 0 160 120" aria-hidden="true"><ellipse cx="67" cy="107" rx="44" ry="6" fill="#dbe6ce"/><g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><rect x="36" y="24" width="58" height="69" rx="5" fill="#fffdf3"/><path d="M45 36h40v13H45Z" fill="#d5e3d5"/><path d="M48 64h34m-34 9h34m-34 9h34M51 93v12m29-12v12" fill="none" stroke-linecap="round"/><path d="M117 18a15 15 0 0 0-13 24L78 68a7 7 0 0 0 10 10l26-26a15 15 0 0 0 20-18l-9 9-9-9 9-9Z" fill="#efcf83"/></g></svg>
      <p class="solar-cost-description">長く使う間に，点検や修理，機器の交換が必要になります．</p>
    </div>
  </div>
</figure>`;}
function hopeCards(cards){
  const art={
    equipment:`<use href="${assets.titleArt}#solar-panel" width="78" height="78" y="12"/><use href="${assets.titleArt}#storage-battery" x="69" y="30" width="51" height="51"/>`,
    purpose:'<use href="#i-coins" x="2" y="24" width="60" height="60"/><g fill="#fff1b8" stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><path d="M83 64c0-6-10-10-10-22a17 17 0 0 1 34 0c0 12-10 16-10 22Z"/><path d="M83 70h14m-12 6h10M90 63V46m-6-7 6 7 6-7" fill="none"/></g>',
    budget:'<g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><path d="M26 34V23l63-8v23" fill="#d5e3d5"/><rect x="17" y="31" width="88" height="51" rx="7" fill="#fff5d7"/><path d="M82 49h28v22H82a11 11 0 0 1 0-22Z" fill="#efcf83"/><circle cx="88" cy="60" r="2" fill="#638b72" stroke="none"/></g>'
  };
  return `<div class="hope-cards" role="group" aria-label="相談で考えたい，希望の例">${cards.map(card=>`<section class="hope-card"><svg viewBox="0 0 120 96" aria-hidden="true">${art[card.icon]??''}</svg><h2>${safe(card.title)}</h2><p>${safe(card.text)}</p></section>`).join('')}</div>`;
}
function consultationFlow(cards,label='相談から設備と費用が分かるまで'){
  const art={
    conversation:'<g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><path d="M13 14h72v43H43L27 71V57H13Z" fill="#fff5d7"/><path d="M61 43h47v31H95v12L80 74H61Z" fill="#dce8dc"/><path d="M25 28h45M25 39h29M72 55h25M72 64h19" fill="none" stroke-linecap="round"/></g>',
    survey:`<use href="${assets.titleArt}#solar-house" width="91" height="91"/><g stroke="#638b72" stroke-width="3" stroke-linecap="round"><circle cx="87" cy="61" r="16" fill="#fff5d7" fill-opacity=".9"/><path d="m99 74 15 15" stroke-width="7"/><path d="m99 74 15 15" stroke="#efcf83" stroke-width="3"/></g>`,
    proposal:`<rect x="31" y="8" width="70" height="79" rx="5" fill="#fffdf3" stroke="#638b72" stroke-width="2.5"/><use href="${assets.titleArt}#solar-panel" x="37" y="13" width="58" height="58"/><path d="M61 72h28m-28 7h20" fill="none" stroke="#638b72" stroke-width="2" stroke-linecap="round"/><use href="#i-coins" x="8" y="49" width="45" height="45"/>`,
    payment:'<g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><path d="M26 34V23l63-8v23" fill="#d5e3d5"/><rect x="17" y="31" width="88" height="51" rx="7" fill="#fff5d7"/><path d="M82 49h28v22H82a11 11 0 0 1 0-22Z" fill="#efcf83"/><circle cx="88" cy="60" r="2" fill="#638b72" stroke="none"/></g>',
    contract:'<g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><rect x="25" y="7" width="65" height="81" rx="5" fill="#fffdf3"/><path d="M38 23h38M38 34h38M38 45h25M38 73h30" fill="none" stroke-linecap="round"/><path d="m68 65 25-39 10 7-25 39-15 9Z" fill="#efcf83"/><path d="m93 26 5-8 10 7-5 8M63 81l3-10 8 6Z" fill="#d5e3d5"/></g>',
    construction:`<use href="${assets.titleArt}#solar-house" width="91" height="91"/><g transform="rotate(18 94 58)" stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><rect x="89" y="43" width="10" height="45" rx="3" fill="#efcf83"/><path d="M77 26h32v10h-7v12H88V36H77Z" fill="#d5e3d5"/></g>`,
    activation:`<use href="${assets.titleArt}#solar-house" width="99" height="91"/><circle cx="93" cy="69" r="19" fill="#edf4e9" stroke="#638b72" stroke-width="2.5"/><path d="m83 69 7 7 13-15" fill="none" stroke="#008653" stroke-width="4" stroke-linejoin="round" stroke-linecap="round"/>`
  };
  return `<ol class="consultation-flow ${cards.length===3?'process-flow-three':''}" aria-label="${safe(label)}">${cards.map(card=>`<li><svg viewBox="0 0 120 96" aria-hidden="true">${art[card.icon]??''}</svg><h2>${safe(card.title)}</h2><p>${safe(card.text)}</p></li>`).join('')}</ol>`;
}

export function renderReadingBody(page,state){
  let body=page.dialogue? page.dialogue.map(([speaker,text,reference],index)=>speech(text,speaker,reference)+(index===0&&page.illustration?`<figure class="story-illustration"><img src="${safe(page.illustration.src)}" alt="${safe(page.illustration.alt)}" width="2172" height="724"></figure>`:'')+(index===page.solarCostDiagramAfter?solarCostDiagram():'')+(index===page.hopeCardsAfter&&page.hopeCards?hopeCards(page.hopeCards):'')).join('') : speech(page.prompt,page.speaker==='navigator'?'professor':'navigator')+speech(page.text,page.speaker);
  if(page.diagram)body+=`<ol class="mini-diagram" aria-label="このページの全体像">${page.diagram.map(t=>`<li>${safe(t)}</li>`).join('')}</ol>`;
  if(page.consultationFlow)body+=consultationFlow(page.consultationFlow);
  if(page.installationFlow)body+=`<section class="installation-route" aria-label="契約から使用開始まで"><div class="installation-procedure-note"><h2>${safe(page.installationFlow.note)}</h2><p>${safe(page.installationFlow.detail)}</p></div>${consultationFlow(page.installationFlow.cards,'契約・工事・引渡しと使用開始')}</section>`;
  if(page.overviewCards)body+=`<div class="overview-cards" role="group" aria-label="このページの要点">${page.overviewCards.map(card=>`<section class="overview-card"><h2>${safe(card.title)}</h2><ul>${card.items.map(item=>`<li>${safe(item)}</li>`).join('')}</ul></section>`).join('')}</div>`;
  if(page.solarUseDiagram)body+=solarUseDiagram();
  if(page.requestRoutes){
    const art={
      direct:'<g fill="#fff5d7" stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><path d="M18 15h84v52H65L39 85V67H18Z"/><path d="M33 31h54M33 43h42M33 55h23" fill="none" stroke-linecap="round"/></g>',
      builder:`<use href="${assets.titleArt}#solar-house" width="120" height="96"/>`,
      comparison:'<g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><path d="M60 42v12H23v11m37-11h37v11" fill="none"/><rect x="31" y="6" width="58" height="36" rx="4" fill="#fffdf3"/><path d="M31 17h58M43 11h2m6 0h2" fill="none" stroke-linecap="round"/><path d="m47 27 7 6 17-11" fill="none"/><rect x="8" y="65" width="30" height="25" rx="3" fill="#dce8dc"/><rect x="82" y="65" width="30" height="25" rx="3" fill="#fff5d7"/><path d="M16 73h14m-14 8h14m60-8h14m-14 8h14" fill="none"/></g>',
      quotes:'<g stroke="#638b72" stroke-width="2.5" stroke-linejoin="round"><rect x="13" y="14" width="41" height="70" rx="4" fill="#fffdf3"/><rect x="66" y="14" width="41" height="70" rx="4" fill="#fff5d7"/><path d="M24 29h19M24 41h19M24 53h19M24 65h12M77 29h19M77 41h19M77 53h19M77 65h12" fill="none" stroke-linecap="round"/></g>'
    };
    body+=`<section class="company-request-routes" aria-label="相談する3つの入口と提案の比較">${page.requestRoutes.map(route=>`<div><svg viewBox="0 0 120 96" aria-hidden="true">${art[route.icon]??''}</svg><h2>${safe(route.title)}</h2><p>${safe(route.text)}</p></div>`).join('')}${page.requestComparison?`<div class="request-comparison"><svg viewBox="0 0 120 96" aria-hidden="true">${art.quotes}</svg><div><h2>${safe(page.requestComparison.title)}</h2><p>${safe(page.requestComparison.text)}</p></div></div>`:''}</section>`;
  }
  if(page.checkQuestions)body+=`<section class="company-check-questions"><h2>施工会社を選ぶ，5つのチェック</h2><ul role="list">${page.checkQuestions.map(item=>`<li><h3><span class="company-check-box" aria-hidden="true"></span>${safe(item.question)}</h3><p>${safe(item.explanation)}</p></li>`).join('')}</ul><a class="company-check-download" href="${safe(contractorChecklistUrl)}" download="haretoku-contractor-checksheet.pdf">相談で使うチェックシートをダウンロード<span>PDF・A4 1枚</span></a></section>`;
  if(page.companyNote)body+=`<p class="company-request-note">${safe(page.companyNote)}</p>`;
  if(page.providerComparison)body+=renderProviderComparison();
  if(page.note)body+=`<p class="form-note">${safe(page.note)}</p>`;
  if(page.characters)body+=`<fieldset class="character-choice"><legend>マップを進むキャラクターを選ぼう</legend><p>見た目だけの選択です．あとから変えても大丈夫．</p>${['male','female'].map((v,i)=>`<label><input type="radio" name="pawn" value="${v}" ${state.pawn===v?'checked':''}><img src="${assets[`pawn-${v}`]}" alt=""><span>キャラクター${i+1}</span></label>`).join('')}</fieldset>`;
  return journeyLinks(body);
}

export function renderReadingEnding(page){
  let ending='';
  const sources=page.sources||(page.source?[page.source,['パナソニック：停電時の蓄電システム','https://sumai.panasonic.jp/chikuden/sochiku/failure/']]:[]);
  if(sources.length)ending+=`<details class="sources"><summary>参考資料</summary><ul>${sources.map(([label,url])=>`<li><a href="${safe(url)}" target="_blank" rel="noopener">${safe(label)} ↗</a></li>`).join('')}</ul></details>`;
  ending+=`<div class="nav-summary"><img src="${assets.navigator}" alt=""><div><p class="speaker">ハレナのまとめ</p><ul>${page.summary.map(t=>`<li>${safe(t)}</li>`).join('')}</ul></div></div>`;
  return journeyLinks(ending);
}

export function renderReadingQuestions(page){
  let questions='';
  if(page.easy||page.easyDialogue)questions+=`<details class="response-choice${page.easyDialogue?' response-dialogue':''}"><summary>${safe(page.easyLabel||'もう少しわかりやすく説明して')}</summary>${page.easyDialogue?page.easyDialogue.map(([speaker,text])=>speech(text,speaker)).join(''):speech(page.easy,'navigator')}</details>`;
  if(page.question)questions+=`<details class="response-choice${page.answerDialogue?' response-dialogue':''}"><summary>${safe(page.question)}</summary>${page.answerDialogue?page.answerDialogue.map(([speaker,text])=>speech(text,speaker)).join(''):speech(page.answer)}</details>`;
  for(const supplement of page.questions??[])questions+=`<details class="response-choice response-dialogue"><summary>${safe(supplement.question)}</summary>${supplement.answerDialogue.map(([speaker,text],index)=>speech(text,speaker,index===supplement.answerDialogue.length-1?supplement.reference:null)).join('')}</details>`;
  return journeyLinks(questions);
}
