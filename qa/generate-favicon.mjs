import {readFile, writeFile} from 'node:fs/promises';
import {createRequire} from 'node:module';
import {fileURLToPath} from 'node:url';

const require = createRequire(import.meta.url);
const sharp = require(process.env.HARETOKU_SHARP_MODULE || 'sharp');
// キャラクター原本から生成したロゴを使い，タブ用SVGと検索用PNGをそろえる．
const source = await readFile(new URL('../site/map/assets/sun-face.svg', import.meta.url));
await writeFile(new URL('../site/shared/assets/favicon.svg', import.meta.url), source);
await sharp(source).resize(96,96).png().toFile(fileURLToPath(new URL('../site/shared/assets/favicon-96.png', import.meta.url)));
