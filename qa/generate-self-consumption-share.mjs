import {readFile,writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';
const require=createRequire(import.meta.url);
const sharp=require(process.env.HARETOKU_SHARP_MODULE || 'sharp');
const assets=new URL('../site/shared/assets/',import.meta.url);
const illustration=(await readFile(new URL('article-self-consumption.svg',assets),'utf8')).replace(/<svg[^>]*>/,'').replace(/<\/svg>\s*$/,'');
const svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630" viewBox="0 0 1200 630">
<rect width="1200" height="630" fill="#fffaf0"/>
<rect x="40" y="40" width="1120" height="550" rx="28" fill="#fff" stroke="#dfcfaa" stroke-width="3"/>
<g font-family="Yu Gothic, Noto Sans CJK JP, sans-serif" fill="#123f31">
<text x="600" y="116" font-size="42" text-anchor="middle" font-weight="700">はれトク</text>
<g font-size="64" text-anchor="middle" font-weight="700"><text x="600" y="222">売るのと</text><text x="600" y="300">自宅で使うの，</text><text x="600" y="378">どちらがお得？</text></g>
</g>
<svg x="510" y="402" width="180" height="180" viewBox="0 0 240 240">${illustration}</svg>
</svg>`;
await writeFile(new URL('og-self-consumption-v040.svg',assets),svg);
await sharp(Buffer.from(svg)).png().toFile(fileURLToPath(new URL('og-self-consumption-v040.png',assets)));
console.log('記事専用の共有画像を生成：1200×630 PNG');
