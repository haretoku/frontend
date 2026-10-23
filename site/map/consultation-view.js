import {escapeHtml as safe} from '../shared/html.js';
import {quoteMaterial,tainaviMaterial} from '../shared/quote-config.js';

const providerLogos={
  'solar-partners':new URL('../shared/assets/solar-partners.png',import.meta.url).href,
  tainavi:new URL('../shared/assets/tainavi.webp',import.meta.url).href
};
export const consultationProviders = [
  {id:'solar-partners',name:'ソーラーパートナーズ',url:quoteMaterial.url,officialUrl:'https://www.solar-partners.jp/',logo:'solar-partners.png',affiliate:true,recommended:true,material:quoteMaterial,description:'自社施工の会社に絞って探したい方や，比較・断りまで支援してほしい方におすすめします．'},
  {id:'tainavi',name:'タイナビ',url:tainaviMaterial.url,officialUrl:'https://www.tainavi.com/',logo:'tainavi.webp',affiliate:true,recommended:false,material:tainaviMaterial,description:'加盟会社の審査や相談支援を確かめて，タイナビで相談したい方へ．'},
  {id:'griene',name:'グリエネ',url:'https://griene.jp/',officialUrl:'https://griene.jp/',logo:'griene.png',affiliate:false,description:'運営による聞き取りを経て，対応する会社の紹介を受けたい方へ．'}
];

// 通常公式リンクと採用済み広告リンクだけを，履歴・計測の両方で認める．
export function consultationProviderForUrl(id,url) {
  return consultationProviders.find(provider=>provider.id===id&&(provider.url===url||provider.officialUrl===url))??null;
}

export function providerLogo(provider) {
  const src=providerLogos[provider.id];
  return src?`<img class="consult-provider-logo" src="${safe(src)}" alt="" decoding="async">`:'';
}

export function providerImpression(provider) {
  return provider.material?`<img class="consult-impression" src="${safe(provider.material.impressionUrl)}" width="1" height="1" alt="" aria-hidden="true" referrerpolicy="no-referrer">`:'';
}

export function renderConsultationProviders({compact=false,comparison='',comparisonOpen=false,idPrefix=compact?'map-':'',placement=compact?'map':'article',title='わが家のことを相談しよう',intro='あなたの家に設置できるか，費用や補助金を相談で確かめよう．'}={}) {
  const quotePlacement=compact?(placement==='map'?'map_consultation':null):'diagnosis_result';
  return `<section class="consult-providers ${compact?'consult-providers-compact':''}" aria-label="相談先を選ぶ">
    <h2${compact?` id="${safe(idPrefix)}consultation-title" tabindex="-1"`:''}>${safe(title)}</h2>
    ${compact?`<p class="consult-provider-intro">${safe(intro)}</p>${comparison?`<details class="consult-provider-comparison"${comparisonOpen?' open':''}><summary>3社の違いを比べる</summary>${comparison}</details>`:''}`:''}
    <div class="consult-provider-cards">${consultationProviders.map(provider=>`<section class="consult-provider-card ${provider.recommended?'consult-provider-recommended':''}" aria-labelledby="${safe(idPrefix)}consult-${provider.id}">
      ${provider.recommended?'<p class="consult-provider-badge">はれトクのおすすめ</p>':''}
      <div class="consult-provider-brand">${providerLogo(provider)}<h3 id="${safe(idPrefix)}consult-${provider.id}">${safe(provider.name)}</h3></div>
      <p class="consult-provider-description">${safe(provider.description)}</p>
      <p class="consult-provider-disclosure">${provider.affiliate?`広告・アフィリエイト ／ ${safe(provider.name)}`:'通常リンク ／ 広告リンクではありません'}</p>
      <a class="${provider.recommended?'primary':'secondary'} consult-provider-action" href="${safe(provider.url)}" target="_blank" rel="${provider.affiliate?'sponsored nofollow ':''}noopener noreferrer" referrerpolicy="no-referrer" ${provider.id==='solar-partners'&&quotePlacement?`data-quote-placement="${quotePlacement}" `:''}data-consult-provider="${provider.id}" data-consult-placement="${safe(placement)}">${provider.affiliate?'無料見積もり ↗':'公式サイトへ ↗'}<span class="visually-hidden">（${safe(provider.name)}）</span></a>
      ${providerImpression(provider)}
    </section>`).join('')}</div>
    ${compact?'':'<p class="form-note">各社の違いは<a href="#quote-sites">第4章の比較</a>で確かめられます．</p>'}
  </section>`;
}
