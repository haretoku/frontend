import {readFile, writeFile} from 'node:fs/promises';
import {renderTimeline, renderProblems} from '../site/manual/components.js';
import {renderConsultationProviders} from '../site/map/consultation-view.js';
import {renderProviderComparison} from '../site/map/provider-comparison-view.js';

const renewalComparison=renderProviderComparison({idPrefix:'renewal-',includeImpressions:false}).replace('<table role="table">','<p class="provider-comparison-scope">比較は太陽光＋蓄電池を新設する場合のサービス内容です．更新・修理・撤去への対応や支援の条件は，各社に確認してください．</p><table role="table">');
const consultation=renderConsultationProviders({compact:true,idPrefix:'renewal-',placement:'article_comparison',intro:'希望する工事に対応する施工会社を紹介してもらえるか，まず相談窓口で確認しましょう．',comparison:renewalComparison}).replaceAll(new URL('../site/',import.meta.url).href,'/');
const manualComparison=renewalComparison.replaceAll('renewal-','manual-');
const manualConsultation=renderConsultationProviders({compact:true,idPrefix:'manual-',placement:'article_comparison',title:'太陽光のこれからを相談しよう',intro:'設備の点検・交換・撤去などの相談先を探そう．',comparison:manualComparison}).replaceAll(new URL('../site/',import.meta.url).href,'/');
const targets = [
  ['../site/manual/equipment-renewal/consultation/index.html', {'consultation-providers': consultation}],
  ['../site/manual/index.html', {'timeline': renderTimeline(), 'problems': renderProblems(), 'consultation-providers': manualConsultation}],
  ['../site/manual/getting-started/milestones/index.html', {'timeline-summary': renderTimeline({includeIntro:false, showStatus:false})}],
  ['../site/manual/getting-started/troubles/index.html', {'problems': renderProblems()}],
];
let changed = 0;
for (const [path, components] of targets) {
  const url = new URL(path, import.meta.url);
  const original = await readFile(url, 'utf8');
  let result = original;
  for (const [name, html] of Object.entries(components)) {
    const start = `<!-- manual-component:${name} -->`;
    const end = `<!-- /manual-component:${name} -->`;
    if (result.split(start).length !== 2 || result.split(end).length !== 2) throw new Error(`Missing or duplicate ${name} markers: ${path}`);
    const from = result.indexOf(start) + start.length;
    const to = result.indexOf(end, from);
    if (to < from) throw new Error(`Invalid ${name} marker order: ${path}`);
    result = result.slice(0, from) + '\n' + html + '\n' + result.slice(to);
  }
  result=result.replace(/[ \t]+$/gm,'');
  if (result !== original) {
    changed++;
    if (!process.argv.includes('--check')) await writeFile(url, result);
  }
}
if (process.argv.includes('--check') && changed) throw new Error(`Manual components out of sync: ${changed} files`);
console.log(`Manual shared components: ${process.argv.includes('--check') ? 'PASS' : `${changed} files updated`}`);
