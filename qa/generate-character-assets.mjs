import {readFile, writeFile, copyFile} from 'node:fs/promises';
import {createRequire} from 'node:module';

const require = createRequire(import.meta.url);
const sharp = require(process.env.HARETOKU_SHARP_MODULE || 'sharp');
const master = new URL('../design/characters/', import.meta.url);
// キャラクターの原本は保持し，配信用コピーとアイコンだけを再生成する．
await copyFile(new URL('harena.png', master), new URL('../site/map/assets/navigator.png', import.meta.url));
await copyFile(new URL('professor.png', master), new URL('../site/map/assets/professor-chibi.png', import.meta.url));
const harena = await readFile(new URL('harena.png', master));
// 採用済みの原本を使い，光の先端が欠けない余白をSVGの表示窓に残す．
const window = `<svg xmlns="http://www.w3.org/2000/svg" width="256" height="256" viewBox="220 225 820 820"><image href="data:image/png;base64,${harena.toString('base64')}" width="1280" height="1280"/></svg>`;
const icon = await sharp(Buffer.from(window)).png().toBuffer();
const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 256 256"><image href="data:image/png;base64,${icon.toString('base64')}" width="256" height="256"/></svg>\n`;
await writeFile(new URL('../site/map/assets/sun-face.svg', import.meta.url), svg);
