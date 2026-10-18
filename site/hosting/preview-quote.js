// 広告・成果計測を発生させず，通常の公式リンクで画面を確認する．
const pixel='data:image/gif;base64,R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=';
export const quoteMaterial=Object.freeze({materialId:'preview',url:'https://www.solar-partners.jp/',impressionUrl:pixel,linkText:'公式サイト（確認用）',provider:'ソーラーパートナーズ',materialVerified:true});
export const tainaviMaterial=Object.freeze({materialId:'preview',url:'https://www.tainavi.com/',impressionUrl:pixel,linkText:'公式サイト（確認用）',provider:'タイナビ',materialVerified:true});
export function quoteActionFor(){return Object.freeze({label:'公式サイト（確認用）',disabled:false,url:quoteMaterial.url,description:'確認用では広告リンクと計測を無効にしています．'});}
