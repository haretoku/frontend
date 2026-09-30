// Scheme view model. 11.x data continue through the existing catalog path.
import {receiveSchemeRules,receiveSchemeListing} from '../../../data/src/scheme-adapter.js';
import {listingMunicipalities} from './model.js';

export function selectSchemeGroups(data, prefecture, municipality = '') {
  if (!data.prefectures.some(p=>p.code===prefecture)) return [];
  const validCity=listingMunicipalities(data).some(m=>m.prefecture_code===prefecture&&m.municipality_code===municipality);
  const rules=receiveSchemeRules(data);
  const diagnostic=new Map(rules.diagnostic.map(rule=>[rule.id,rule]));
  const listing=receiveSchemeListing(data);
  const visible=p=>p.government_level==='national'||p.government_level==='prefecture'&&p.prefecture_code===prefecture||validCity&&p.government_level==='municipality'&&p.prefecture_code===prefecture&&p.municipality_code===municipality;
  const covered=new Set();
  function row(parent,branch) {
    const legacy=(branch.diagnostic_rule_ids||[]).map(id=>diagnostic.get(id)).filter(Boolean);
    legacy.forEach(rule=>covered.add(rule.id));
    const scope=new Set();
    for(const equipment of branch.target_equipment||[]){if(equipment.includes('太陽光'))scope.add('solar');if(equipment.includes('蓄電池'))scope.add('battery');}
    const coarse={受付中:'accepting',受付対象外:'not_open',不明:'unknown'}[branch.application_status]||'unknown';
    const compatible={accepting:['accepting','waitlist','accepting_with_waitlist_branch'],not_open:['closed','suspended','not_open','not_applicable'],unknown:['unknown','unconfirmed']}[coarse];
    const statuses=[...new Set(legacy.map(p=>p.application_status))];
    const catalog={...branch,record_id:parent.record_id,target_year:parent.target_year,conditions:{official:branch.official_conditions||branch.conditions?.official||[],model_assumptions:branch.model_assumptions??branch.conditions?.model_assumptions??[]}};
    return {id:branch.branch_id,record_id:parent.record_id,government_level:parent.government_level,prefecture_code:parent.prefecture_code,municipality_code:parent.municipality_code,program_name:parent.scheme_name,official_urls:branch.evidence_urls||[],confirmed_at:branch.checked_at,expense_scopes:[...scope],application_status:statuses.length===1&&compatible.includes(statuses[0])?statuses[0]:coarse,_catalog:catalog,_legacy:legacy};
  }
  const groups=listing.groups.filter(visible).map(parent=>parent.branches.map(branch=>row(parent,branch)));
  for(const item of listing.retained){
    if(!visible(item.row))continue;
    // Retained identity is deliberately unresolved: do not merge by name or URL.
    groups.push([{...row({...item.row,record_id:null},{...item.row,diagnostic_rule_ids:item.row.diagnostic_program_ids||[]}),_retentionStatus:item.reference.retention_status}]);
  }
  for(const rule of rules.diagnostic.filter(visible))if(!covered.has(rule.id))groups.push([rule]);
  return groups.filter(group=>group.length);
}
