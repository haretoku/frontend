import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const sharp=require(process.env.HARETOKU_SHARP_MODULE || 'sharp');
const assets=new URL('../site/shared/assets/',import.meta.url);
const illustration=(await readFile(new URL('article-self-consumption.svg',assets),'utf8')).replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fff8e9"/>
<circle cx="160" cy="315" r="140" fill="#eef2e6"/>
<circle cx="1040" cy="315" r="140" fill="#eef2e6"/>
<!-- 中央630角への切り抜きでも，左右の選択肢が両方収まる． -->
<svg x="345" y="25" width="510" height="510" viewBox="0 0 240 240">${illustration}</svg>
<text x="600" y="584" fill="#123f31" font-size="38" text-anchor="middle" font-family="Yu Gothic, Noto Sans CJK JP, sans-serif" font-weight="700">はれトク</text>
</svg>`;
await writeFile(new URL('og-guide-self-consumption-20261018.svg',assets),svg);
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL('og-guide-self-consumption-20261018.png',assets)));
console.log('記事専用の共有画像を生成：1200×630 PNG');
