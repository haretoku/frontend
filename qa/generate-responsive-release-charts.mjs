import { readFile, writeFile } from 'node:fs/promises';
import assert from 'node:assert/strict';
const root = new URL('../', import.meta.url);
// 描画だけを変更する．調査の入力・計算結果・配布用の図は再計算しない．
const evidence = JSON.parse(await readFile(new URL('qa/artifacts/support-shock-calculation.json', root)));
const cases = evidence.cases;
assert.equal(cases.length, 4);
assert(cases.every(c => c.mean.length === 24 && Number.isFinite(c.additionalBurden)));
const colors = {ink:'#173e35',muted:'#5d6d67',grid:'#dce5df',solar:'#efbc48',battery:'#21876d',purchase:'#c5cdd0',base:'#547888'};
const txt = (x,y,s,size=15,fill=colors.ink,anchor='start') => `<text x="${x}" y="${y}" font-size="${size}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
const line = (a,b,c,d,color=colors.grid) => `<line x1="${a}" y1="${b}" x2="${c}" y2="${d}" stroke="${color}"/>`;
const rect = (x,y,w,h,color) => `<rect x="${x}" y="${y}" width="${w}" height="${h}" fill="${color}"/>`;
const svg = (h,title,body) => `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="${h}" viewBox="0 0 360 ${h}" role="img"><title>${title}</title><style>text{font-family:Meiryo,"Yu Gothic",sans-serif}</style>${rect(0,0,360,h,'#fff')}${body}</svg>\n`;
let body = '';
const labels = ['太陽光・蓄電池なし','太陽光のみ','太陽光＋蓄電池 5 kWh','太陽光＋蓄電池 9.5 kWh'];
const maximum = Math.ceil(cases[0].additionalBurden / 5000) * 5000;
for(const [i,c] of cases.entries()) {
  const y = i * 82 + 8;
  body += txt(12,y+18,labels[i],16) + rect(12,y+28,c.additionalBurden/maximum*326,22,i?colors.battery:colors.base)
    + txt(338,y+68,`＋${c.additionalBurden.toLocaleString('ja-JP')}円／年`,16,colors.ink,'end');
}
body += line(12,346,338,346) + txt(12,369,'0円',14,colors.muted) + txt(175,369,'10,000円',14,colors.muted,'middle') + txt(338,369,'20,000円',14,colors.muted,'end');
await writeFile(new URL('site/shared/assets/support-shock-burden-compact.svg',root),svg(385,'設備別の支援終了による年間追加負担',body));
function step(values,x,y,w,h,max) {
  let result = `M ${x} ${y-values[0]/max*h}`;
  for(let i=0;i<24;i++){result+=` H ${x+(i+1)/24*w}`;if(i<23)result+=` V ${y-values[i+1]/max*h}`;}
  return result;
}
function area(values,lower,x,y,w,h,max) {
  return step(values.map((v,i)=>v+lower[i]),x,y,w,h,max)+` L ${x+w} ${y-lower[23]/max*h}`
    + Array.from({length:24},(_,j)=>23-j).map(i=>` H ${x+i/24*w}${i>0?` V ${y-lower[i-1]/max*h}`:''}`).join('')+' Z';
}
body = '';
for(const [i,[label,color]] of [['太陽光の直接利用',colors.solar],['蓄電池からの供給',colors.battery],['電力会社から購入',colors.purchase],['消費電力',null]].entries()) {
  const x = i%2 ? 185 : 12, y = 10 + Math.floor(i/2)*27;
  body += color ? rect(x,y,12,12,color) : line(x,y+6,x+16,y+6,colors.ink);
  body += txt(x+19,y+12,label,15);
}
const max = Math.ceil(Math.max(...cases[3].mean.map(r=>r.load))*2)/2;
for(const [panel,c] of [[0,cases[1]],[1,cases[3]]]) {
  const x=38,w=302,y=274+panel*248,h=148;
  body += txt(12,y-h-31,panel?'太陽光＋蓄電池 9.5 kWh':'太陽光のみ',17)
    + txt(340,y-h-8,'1時間平均の電力（kW）',14,colors.muted,'end');
  for(let v=0;v<=max;v+=0.5)body+=line(x,y-v/max*h,x+w,y-v/max*h)+txt(x-8,y-v/max*h+5,v.toFixed(1),14,colors.muted,'end');
  let lower=Array(24).fill(0);
  for(const [field,color] of [['direct',colors.solar],['delivered',colors.battery],['purchased',colors.purchase]]) {
    const values=c.mean.map(r=>r[field]); body+=`<path d="${area(values,lower,x,y,w,h,max)}" fill="${color}"/>`;lower=lower.map((v,i)=>v+values[i]);
  }
  body+=`<path d="${step(c.mean.map(r=>r.load),x,y,w,h,max)}" fill="none" stroke="${colors.ink}" stroke-width="1.5"/>`;
  for(let t=0;t<=24;t+=6)body+=txt(x+t/24*w,y+23,`${t}時`,14,colors.muted,'middle');
}
await writeFile(new URL('site/shared/assets/support-shock-daily-compact.svg',root),svg(556,'モデル家庭の年間平均の1日の電力供給内訳',body));
console.log('調査結果を固定したスマホ用の図2点を生成しました．');
