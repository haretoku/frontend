import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

// article-self-consumption.svg と同じ丸い線・配色．共有PNGも同じ原図から生成する．
const require=createRequire(import.meta.url);
const sharp=require(process.env.HARETOKU_SHARP_MODULE || 'sharp');
const assets=new URL('../site/shared/assets/',import.meta.url);
const green='#648a75',gold='#b18b3d';
const outline=`stroke="${green}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
const golden=`stroke="${gold}" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"`;
const coin=(x,y,r=23)=>`<g ${golden}><circle cx="${x}" cy="${y}" r="${r}" fill="#ffe5a3"/><circle cx="${x}" cy="${y}" r="${r-6}" fill="none"/><path d="M${x-7} ${y-10}l7 11 7-11M${x} ${y+1}v13M${x-8} ${y+1}h16M${x-8} ${y+6}h16" fill="none"/></g>`;
const bolt=(x,y)=>`<path d="M${x+13} ${y}l-21 30h17l-7 23 24-32H${x+9}z" fill="#f7d47b" stroke="${gold}" stroke-width="3" stroke-linejoin="round"/>`;
const page=(x,y,w=88,h=119)=>`<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="7" fill="#fff"/><path d="M${x+18} ${y+22}h${w-36}M${x+18} ${y+39}h${w-36}M${x+18} ${y+56}h${w-48}" fill="none"/>`;
const mapTitleArt=await readFile(new URL('../site/map/assets/title-art.svg',import.meta.url),'utf8');
const mapSolarHouse=mapTitleArt.match(/<symbol id="solar-house"[^>]*>([\s\S]*?)<\/symbol>/)?.[1];
if(!mapSolarHouse)throw Error('MAPの太陽光住宅がありません');
const mapSolarPanel=mapTitleArt.match(/<symbol id="solar-panel"[^>]*>([\s\S]*?)<\/symbol>/)?.[1];
const mapStorageBattery=mapTitleArt.match(/<symbol id="storage-battery"[^>]*>([\s\S]*?)<\/symbol>/)?.[1];
if(!mapSolarPanel||!mapStorageBattery)throw Error('MAPのパネル・蓄電池がありません');
// 支払いを表す2記事は同じ原図を使う．下降矢印は付けない．
const paymentArt=`
  <g transform="translate(-14 4) scale(1.08)">
  <g ${outline} transform="translate(0 45)">
   <path d="M35 97V87q0-4 5-5l43-9q5-1 5 5v23" fill="#fff"/>
   <rect x="29" y="96" width="67" height="44" rx="6" fill="#e5ede2"/>
   <path d="M81 111h19v17H81q-4 0-4-4v-9q0-4 4-4z" fill="#fff"/>
   <circle cx="88" cy="119.5" r="2" fill="${green}" stroke="none"/>
  </g>
  <path d="M96 132Q131 125 149 87" fill="none" stroke="#9fb79e" stroke-width="3" stroke-linecap="round" stroke-dasharray="2 7"/>
  <g transform="translate(174 68) scale(.95) rotate(-20) translate(-167 -59)">
   <g transform="rotate(50 167 59)" fill="#fffdf8" stroke="#9fb79e" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
    <path d="M145 59C136 52 131 46 125 48C120 50 123 55 128 58C120 54 116 56 117 60C118 65 124 67 130 68C124 67 121 70 124 73C130 79 138 77 145 73Z"/>
    <path d="M190 57C198 48 204 43 209 46C213 49 209 53 204 56C212 52 217 54 215 59C213 64 208 66 203 67C210 65 214 68 210 72C205 78 197 77 190 73Z"/>
   </g>
   <g transform="rotate(50 167 59)">${coin(167,59,29)}</g>
  </g>
  <g fill="none" stroke="#9fb79e" stroke-width="2.5" stroke-linecap="round"><path d="M119 80l10-8M126 89l10-8"/></g>
  </g>
  <g fill="none" stroke="#7e9d86" stroke-width="2.4" stroke-linecap="round" transform="translate(-14 4) scale(1.08)">
   <path d="M125 38Q127 30 137 29M118 35Q121 24 134 22M209 114Q220 119 228 111M208 121Q221 127 231 116"/>
  </g>`;
const guides=[
 {slug:'solar-electricity-savings',assetVersion:'20261019-v14',alt:'財布から羽付きの円コインが右上へ飛び立つ，支払いを表すイラスト',art:paymentArt},
 {slug:'solar-fit',assetVersion:'20261019-v4',alt:'硬貨を受け取る手を薄い背景に，大きな段差で売電価格の切り替わりを示すイラスト',art:`
  <g opacity=".56" transform="translate(25 20) scale(1.28)">
   ${coin(78,47,25)}
   <g ${outline}>
    <path d="M48 89l15-12q5-4 10 0l12 9h14q7 0 7 7v1l13-11q5-5 10 0q3 5-2 10l-23 21q-5 4-12 4H48z" fill="#fff"/>
    <path d="M76 100h23q7 0 7-7" fill="none"/>
    <rect x="32" y="86" width="16" height="35" rx="2" fill="#cce0d8"/>
   </g>
  </g>
  <g fill="none" stroke-linecap="round" stroke-linejoin="round">
   <path d="M34 77v121h177m-8-6 8 6-8 6" stroke="#b7cbbd" stroke-width="2.5"/>
   <path d="M44 95h82v66h78" stroke="${green}" stroke-width="7"/>
  </g><circle cx="204" cy="161" r="5" fill="${green}"/>`},
 {slug:'solar-economics',assetVersion:'20261019-v3',alt:'プラスとマイナスの円硬貨を水平な天びんで比べるイラスト',art:`
  <g transform="translate(0 -29)">
  <g ${outline}>
   <path d="M120 82v120M87 216h66l-10-15H97z" fill="#cce0d8"/>
   <path d="M41 94h158M60 94l-29 79M60 94l29 79M180 94l-29 79M180 94l29 79" fill="none"/>
   <path d="M28 173h64q-6 20-32 20t-32-20M148 173h64q-6 20-32 20t-32-20" fill="#cce0d8"/>
   <circle cx="120" cy="94" r="7" fill="#fff"/>
  </g>${coin(60,148,24)}${coin(180,148,24)}
  <g stroke-width="3" stroke-linecap="round">
   <circle cx="79" cy="124" r="12" fill="#eef4ed" stroke="${green}"/><path d="M73 124h12M79 118v12" stroke="${green}"/>
   <circle cx="199" cy="124" r="12" fill="#fff8e9" stroke="${gold}"/><path d="M193 124h12" stroke="${gold}"/>
  </g></g>`},
 {slug:'solar-installation-cost',assetVersion:'20261019-v2',alt:'屋根に太陽光パネルを載せたMAPと同じ住宅と，工事用の金づちのイラスト',art:`
  <svg x="2" y="27" width="188" height="188" viewBox="0 0 120 120">${mapSolarHouse}</svg>
  <g ${outline}><g transform="rotate(18 188 148)">
   <rect x="180" y="114" width="15" height="85" rx="4" fill="#f7d47b"/>
   <path d="M163 96h51v27h-17v-10h-17v10h-17z" fill="#cce0d8"/>
  </g></g>`},
 {slug:'solar-maintenance-cost',assetVersion:'20261019-v2',alt:'MAPと同じ太陽光パネルに，点検・修理のレンチを重ねたイラスト',art:`
  <svg x="0" y="29" width="193" height="193" viewBox="0 0 120 120">${mapSolarPanel}</svg>
  <g ${outline}>
   <path d="M162 91q-12-27 11-43l14-2-13 22 16 15 21-14q3 27-23 34l-57 70q-9 11-19 2t-1-19z" fill="#f7d47b"/>
   <circle cx="121" cy="166" r="3" fill="#fff"/>
  </g>`},
 {slug:'subsidies',assetVersion:'20261019-v2',alt:'円マークのコインが中央に描かれた補助金の申請書のイラスト',art:`
  <g ${outline}>
   <path d="M64 28h91l29 29v147q0 9-9 9H64q-9 0-9-9V37q0-9 9-9z" fill="#fff"/>
   <path d="M155 28v29h29" fill="#e5ede2"/>
   <path d="M79 157h82M79 177h59" fill="none"/>
  </g>${coin(120,101,36)}`},
 {slug:'subsidy-amount',assetVersion:'20261019-v5',alt:'財布から羽付きの円コインが右上へ飛び立つ，支払いを表すイラスト',art:paymentArt},
 {slug:'disaster',assetVersion:'20261019-v3',alt:'太陽光から蓄電池，電球への電気の流れを，大きな3つのアイコンと矢印で示すイラスト',art:`
  <svg x="0" y="7" width="124" height="124" viewBox="0 0 120 120">${mapSolarPanel}</svg>
  <svg x="131" y="20" width="106" height="106" viewBox="0 0 64 64">${mapStorageBattery}</svg>
  <svg x="59" y="120" width="100" height="118" viewBox="68 21 44 59">
   <g fill="#fff1b8" stroke="#638b72" stroke-width="1.75" stroke-linejoin="round">
    <path d="M83 64c0-6-10-10-10-22a17 17 0 0 1 34 0c0 12-10 16-10 22Z"/>
    <path d="M83 70h14m-12 6h10M90 63V46m-6-7 6 7 6-7" fill="none"/>
   </g>
  </svg>
  <g fill="none" stroke="${green}" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
   <path d="M111 73h26m-7-7 7 7-7 7M183 129v28q0 17-17 17h-15m7-7-7 7 7 7"/>
  </g>`},
 {slug:'quotes-contractors',assetVersion:'20261019-v2',alt:'2社の見積書と，内容の確認を表す緑のチェックのイラスト',art:`
  <g ${outline}>${page(29,46,82,135)}${page(129,46,82,135)}
   <path d="M44 124h14M79 124h17M44 145h52M144 124h14M179 124h17M144 145h52" fill="none"/>
   <circle cx="171" cy="174" r="26" fill="#edf4e9"/>
   <path d="M158 174l9 9 17-20" fill="none" stroke="#008653" stroke-width="4"/>
  </g>`},
];
const selected=process.argv[2]?guides.filter(guide=>guide.slug===process.argv[2]):guides;
if(!selected.length)throw Error(`対象記事がありません：${process.argv[2]}`);
for(const guide of selected){
 const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240"><rect width="240" height="240" rx="12" fill="#fff8e9"/>${guide.art}</svg>\n`;
 await writeFile(new URL(`article-${guide.slug}.svg`,assets),svg);
 // 中央630角への切り抜きでも，主役とブランドが収まる．細かな記事文字は入れない．
 const share=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630"><rect width="1200" height="630" fill="#fff8e9"/><circle cx="160" cy="315" r="140" fill="#eef2e6"/><circle cx="1040" cy="315" r="140" fill="#eef2e6"/><svg x="345" y="25" width="510" height="510" viewBox="0 0 240 240">${guide.art}</svg><text x="600" y="584" fill="#123f31" font-size="38" text-anchor="middle" font-family="Yu Gothic,Noto Sans CJK JP,sans-serif" font-weight="700">はれトク</text></svg>`;
 await sharp(Buffer.from(share)).png().toFile(fileURLToPath(new URL(`og-guide-${guide.slug}-${guide.assetVersion || '20261018'}.png`,assets)));
}
const catalogUrl=new URL('../site/solar/data/articles.json',import.meta.url);
const catalog=JSON.parse(await readFile(catalogUrl,'utf8'));
for(const guide of selected){
 const article=catalog.find(item=>item.href===`/guides/${guide.slug}/`);
 if(!article)throw Error(`記事がありません：${guide.slug}`);
 article.image={src:`../shared/assets/article-${guide.slug}.svg`,width:240,height:240,alt:guide.alt};
 article.shareImage=`/assets/og-guide-${guide.slug}-${guide.assetVersion || '20261018'}.png`;
 const htmlUrl=new URL(`../site/guides/${guide.slug}/index.html`,import.meta.url);
 const html=(await readFile(htmlUrl,'utf8')).replace(/(<meta property="og:image" content=")[^"]+/,`$1https://haretoku.jp${article.shareImage}`).replace(/(<meta property="og:image:alt" content=")[^"]+/,`$1${guide.alt}`);
 await writeFile(htmlUrl,html);
}
await writeFile(catalogUrl,JSON.stringify(catalog,null,2)+'\n');
console.log(`記事イラスト${selected.length}点（240角SVG），共有PNG${selected.length}点（1200×630）と参照先を更新`);
