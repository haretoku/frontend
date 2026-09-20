import test from 'node:test';
import assert from 'node:assert/strict';
import { createEquipmentDraft } from '../../site/simulator/src/equipment-draft.js';
function setup() {
 let values={equipment:'solar_only',solar:'4',battery:'9.5'}, committed=null, reject=false, editing=false;
 const draft=createEquipmentDraft({read:()=>values,restore:s=>{values={...s};},commit:()=>{if(reject)throw Error('invalid');committed={...values};},onEditing:s=>{editing=s;}});
 return {draft,set:v=>{values={...values,...v};},reject:()=>{reject=true;},state:()=>({values,committed,editing})};
}
test('equipment draft does not commit until apply and cancel restores both capacities',()=>{const s=setup();s.draft.begin();s.set({equipment:'solar_plus_standard_battery',solar:'6',battery:'16'});assert.equal(s.state().committed,null);s.draft.cancel();assert.deepEqual(s.state().values,{equipment:'solar_only',solar:'4',battery:'9.5'});assert.equal(s.state().editing,false);});
test('equipment apply commits the full draft once and closes editing',()=>{const s=setup();s.draft.begin();s.set({equipment:'solar_plus_standard_battery',solar:'5',battery:'12'});s.draft.apply();assert.deepEqual(s.state().committed,{equipment:'solar_plus_standard_battery',solar:'5',battery:'12'});assert.equal(s.draft.editing,false);});
test('failed apply retains the draft and allows cancellation to the original state',()=>{const s=setup();s.draft.begin();s.set({solar:'6'});s.draft.begin();s.reject();assert.throws(()=>s.draft.apply());assert.equal(s.draft.editing,true);s.draft.cancel();assert.equal(s.state().values.solar,'4');});
