// 国県の現行表示はcommon表を使い，旧市区町村の文型・固定複製は読まない．

export function diagnosticTrialSourceTexts(data,ruleId){
 return data.subsidy_schemes.flatMap(s=>s.branches).filter(b=>b.diagnostic_rule_ids.includes(ruleId)).map(b=>b.amount?.display_text).filter(Boolean);
}
