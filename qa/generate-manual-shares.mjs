import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
import {renderManualIcon} from '../site/manual/icons.js';

const require=createRequire(import.meta.url);
const sharp=require(process.env.HARETOKU_SHARP_MODULE || 'sharp');
const assetRoot=new URL('../site/shared/assets/',import.meta.url);
const art=await readFile(new URL('../site/map/assets/title-art.svg',import.meta.url),'utf8');
const panel=art.match(/<symbol id="solar-panel"[^>]*>([\s\S]*?)<\/symbol>/)[1];
const book=(await readFile(new URL('../site/manual/getting-started-illustration.svg',import.meta.url),'utf8')).replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const bookBox=(await readFile(new URL('../site/manual/getting-started-illustration.svg',import.meta.url),'utf8')).match(/viewBox="([^"]+)"/)[1];
const harena=(await readFile(new URL('../site/map/assets/navigator.png',import.meta.url))).toString('base64');
const cards=[
  {name:'manual',lines:['わが家の','太陽光トリセツ'],art:'<svg x="760" y="170" width="330" height="330" viewBox="0 0 120 120">'+panel+'</svg>'},
  {name:'manual-intro',lines:['太陽光をつけたら，','これから何をする？'],art:'<svg x="750" y="165" width="350" height="350" viewBox="'+bookBox+'">'+book+'</svg>'},
  {name:'manual-renewal',lines:['長く使った太陽光，','更新する？使い続ける？'],art:'<g transform="translate(790 215) scale(5.8)" color="#648d75">'+renderManualIcon('renew').replace('<svg ','<svg width="48" height="48" ')+'</g>'}
];
for(const card of cards){
  const svg='<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">'+
    '<rect width="1200" height="630" fill="#f3f6ee"/><rect x="30" y="30" width="1140" height="570" rx="36" fill="#fffaf0" stroke="#d6bf80" stroke-width="3"/>'+
    '<style>text{font-family:Meiryo,"Yu Gothic",sans-serif;fill:#123f31;font-weight:700}</style>'+
    '<text x="90" y="140" font-size="25" fill="#648d75">太陽光をつけた方へ</text>'+
    card.lines.map((line,i)=>'<text x="90" y="'+(285+i*88)+'" font-size="'+(card.name==='manual-renewal'?44:51)+'">'+line+'</text>').join('')+
    card.art+'<svg x="92" y="475" width="74" height="74" viewBox="240 245 780 780"><image href="data:image/png;base64,'+harena+'" width="1280" height="1280"/></svg><text x="185" y="526" font-size="31">はれトク</text></svg>';
  await writeFile(new URL('og-'+card.name+'-20261021.svg',assetRoot),svg);
  await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL('og-'+card.name+'-20261021.png',assetRoot)));
}
console.log('トリセツ共有画像：3枚，1200×630 PNG．正規ハレナと既存のSVGを使用．');
