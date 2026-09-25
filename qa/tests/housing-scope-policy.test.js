import test from 'node:test';
import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {housingScopeAssumption} from '../../site/simulator/src/subsidy-presentation.js';
const data=JSON.parse(await readFile(new URL('../../data/input/public-data.json',import.meta.url),'utf8'));
test('住宅区分仮定19制度は公式確認と区別し，削除した7候補を残さない',()=>{
 const rows=data.diagnostic_subsidy_programs.filter(p=>(p.calculation_assumptions??[]).some(t=>t.includes('住宅区分指定がないため，新築・既存住宅の両方を対象と仮定')));
 assert.equal(rows.length,19);
 for(const row of rows){const original=JSON.stringify(row);const t=housingScopeAssumption({...row,included:true});assert.match(t,/新築・既存の両方を対象と仮定/);assert.match(t,/公式に両区分の適用が明記されたものではありません/);assert.doesNotMatch(t,/承認|統括/);assert.ok(t.length<100);assert.equal(housingScopeAssumption({...row,included:false}),'');assert.equal(JSON.stringify(row),original);}
 assert.equal(data.diagnostic_subsidy_programs.filter(p=>/^(?:okayama-(?:33210|33214|33606|33623|33666)-new_unconfirmed|hiroshima-34202-battery_new_unconfirmed|tokushima-36302-solar_new_unconfirmed)/.test(p.id)).length,0);
});
