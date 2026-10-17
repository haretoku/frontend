import {quoteMaterial} from '../shared/quote-config.js';

const safe=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const providerLogos={
  'solar-partners':new URL('../shared/assets/solar-partners.png',import.meta.url).href,
  tainavi:new URL('../shared/assets/tainavi.webp',import.meta.url).href
};
export const consultationProviders = [
  {id:'solar-partners',name:'ソーラーパートナーズ',url:quoteMaterial.url,logo:'solar-partners.png',affiliate:true,description:'自社施工の会社に絞って探したい方や，比較・断りまで支援してほしい方におすすめします．'},
  {id:'tainavi',name:'タイナビ',url:'https://www.tainavi.com/',logo:'tainavi.webp',affiliate:false,description:'加盟会社の審査や相談支援を確かめて，タイナビで相談したい方へ．'},
  {id:'griene',name:'グリエネ',url:'https://griene.jp/',logo:'griene.png',affiliate:false,description:'運営による聞き取りを経て，対応する会社の紹介を受けたい方へ．'}
];

export function providerLogo(provider) {
  const src=providerLogos[provider.id];
  return src?`<img class="consult-provider-logo" src="${safe(src)}" alt="" decoding="async">`:'';
}

export function renderConsultationProviders({compact=false,comparison=''}={}) {
  return `<section class="consult-providers ${compact?'consult-providers-compact':''}" aria-label="相談先を選ぶ">
    <h2${compact?' id="map-consultation-title" tabindex="-1"':''}>わが家のことを相談しよう</h2>
    ${compact?`<p class="consult-provider-intro">あなたの家に設置できるか，費用や補助金を相談で確かめよう．</p>${comparison?`<details class="consult-provider-comparison"><summary>3社の違いを比べる</summary>${comparison}</details>`:''}`:''}
    <div class="consult-provider-cards">${consultationProviders.map(provider=>`<section class="consult-provider-card ${provider.affiliate?'consult-provider-recommended':''}" aria-labelledby="${compact?'map-':''}consult-${provider.id}">
      ${provider.affiliate?'<p class="consult-provider-badge">はれトクのおすすめ</p>':''}
      <div class="consult-provider-brand">${providerLogo(provider)}<h3 id="${compact?'map-':''}consult-${provider.id}">${safe(provider.name)}</h3></div>
      <p class="consult-provider-description">${safe(provider.description)}</p>
      <p class="consult-provider-disclosure">${provider.affiliate?'広告・アフィリエイト ／ ソーラーパートナーズ':provider.id==='tainavi'?'提携：タイナビ ／ 公式サイトへのリンク':'通常リンク ／ 広告リンクではありません'}</p>
      <a class="${provider.affiliate?'primary':'secondary'} consult-provider-action" href="${safe(provider.url)}" target="_blank" rel="${provider.affiliate?'sponsored nofollow ':''}noopener noreferrer" referrerpolicy="no-referrer" ${provider.affiliate?`data-quote-placement="${compact?'map_consultation':'diagnosis_result'}" `:''}data-consult-provider="${provider.id}" data-consult-placement="${compact?'map':'article'}">${provider.affiliate?'無料見積もり ↗':'公式サイトへ ↗'}<span class="visually-hidden">（${safe(provider.name)}）</span></a>
      ${provider.affiliate?`<img class="consult-impression" src="${safe(quoteMaterial.impressionUrl)}" width="1" height="1" alt="" aria-hidden="true" referrerpolicy="no-referrer">`:''}
    </section>`).join('')}</div>
    ${compact?'':'<p class="form-note">各社の違いは<a href="#quote-sites">第4章の比較</a>で確かめられます．</p>'}
  </section>`;
}
