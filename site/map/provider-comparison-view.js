import {comparisonDate,providers,statusLegend,comparisonRows,comparisonSources,comparisonScope} from './provider-comparison.js';
import {consultationProviders,previewLogo} from './consultation-view.js';

const safe=value=>String(value).replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));

// 一つの表を画面幅に応じて組み替え，項目・会社とセルの対応を保つ．
export function renderProviderComparison({preview=import.meta.env?.DEV===true,idPrefix=''}={}){
  const titleId=`${idPrefix}provider-comparison-title`;
  const providerHeading=provider=>`${idPrefix}provider-heading-${provider.id}`;
  const rowHeading=row=>`${idPrefix}provider-row-${row.id}`;
  const brand=provider=>{
    const logo=previewLogo(consultationProviders.find(item=>item.id===provider.id),preview);
    return `<a class="provider-brand" href="${safe(provider.url)}" target="_blank" rel="noopener" aria-label="${safe(provider.name)}の公式サイト（別タブ）">${logo||safe(provider.name)}<span aria-hidden="true">↗</span></a>`;
  };
  return `<section class="provider-comparison" aria-labelledby="${safe(titleId)}">
    <h2 id="${safe(titleId)}">一括見積もりサイトを，同じ基準で比べよう</h2>
    <table role="table">
      <caption class="visually-hidden">3つのサービスの比較</caption>
      <thead role="rowgroup"><tr role="row"><th scope="col" role="columnheader">手伝ってもらえること</th>${providers.map(provider=>`<th scope="col" role="columnheader" id="${safe(providerHeading(provider))}">${brand(provider)}</th>`).join('')}</tr></thead>
      <tbody role="rowgroup">${comparisonRows.map(row=>`<tr role="row"><th scope="row" role="rowheader" id="${safe(rowHeading(row))}">${safe(row.label)}</th>${row.cells.map(cell=>{
        const provider=providers.find(item=>item.id===cell.providerId);
        const parts=cell.parts.map(part=>{
          const status=statusLegend[part.status];
          return `<p class="provider-feature"><span class="provider-status status-${safe(part.status)}" role="img" aria-label="${safe(status.label)}">${safe(status.symbol)}</span>${part.text?`<span>${safe(part.text)}</span>`:''}</p>`;
        }).join('');
        return `<td role="cell" headers="${safe(rowHeading(row))} ${safe(providerHeading(provider))}"><strong class="provider-mobile-name" aria-hidden="true">${safe(provider.name)}</strong>${parts}</td>`;
      }).join('')}</tr>`).join('')}</tbody>
    </table>
    <ul class="provider-status-legend" aria-label="比較表の記号の意味">${Object.values(statusLegend).map(status=>`<li><span aria-hidden="true">${safe(status.symbol)}</span> ${safe(status.label)}</li>`).join('')}</ul>
    <p class="provider-comparison-ad">広告：ソーラーパートナーズ・タイナビと提携しています．</p>
    <details class="provider-comparison-detail"><summary>参考資料・確認日</summary><p>比較対象：${safe(comparisonScope)}．</p><p>公式情報の確認日：<time datetime="${safe(comparisonDate)}">${safe(comparisonDate)}</time>．</p><ul>${comparisonSources.map(source=>`<li><a href="${safe(source.url)}" target="_blank" rel="noopener">${safe(source.label)} ↗</a></li>`).join('')}</ul></details>
  </section>`;
}
