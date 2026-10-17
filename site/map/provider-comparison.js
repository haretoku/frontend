// Editorial comparison only．These records do not affect the diagnosis model．
export const comparisonDate = '2026-10-15';
export const providers = [
  {id:'solar-partners',name:'ソーラーパートナーズ',url:'https://www.solar-partners.jp/'},
  {id:'tainavi',name:'タイナビ',url:'https://www.tainavi.com/'},
  {id:'griene',name:'グリエネ',url:'https://griene.jp/'}
];
export const statusLegend = {
  yes:{symbol:'○',label:'あり'},
  partial:{symbol:'△',label:'条件・範囲あり'},
  no:{symbol:'×',label:'対応しないと明記'},
  unknown:{symbol:'—',label:'公式情報に明記なし'}
};
export const comparisonSources = [
  {id:'sp-home',label:'ソーラーパートナーズ：サービス案内',url:'https://www.solar-partners.jp/'},
  {id:'sp-support',label:'ソーラーパートナーズ：運営・支援と利用規約',url:'https://www.solar-partners.jp/contents/260287.html'},
  {id:'sp-guarantee',label:'ソーラーパートナーズ：あんしん完了保証約款',url:'https://www.solar-partners.jp/guarantee-clause/'},
  {id:'sp-company',label:'ソーラーパートナーズ：運営会社・サービス',url:'https://www.solar-partners.jp/lp-manga-unneigaisha.html'},
  {id:'tainavi-screen',label:'タイナビ：加盟企業の審査',url:'https://www.tainavi.com/library/770/'},
  {id:'tainavi-flow',label:'タイナビ：相談窓口の案内',url:'https://www.tainavi.com/library/610/'},
  {id:'tainavi-terms',label:'タイナビ：利用規約',url:'https://www.tainavi.com/rules/'},
  {id:'tainavi-home',label:'タイナビ：サービス紹介',url:'https://www.tainavi.com/introduce/'},
  {id:'griene-home',label:'グリエネ：サービス案内',url:'https://griene.jp/'},
  {id:'griene-area',label:'グリエネ：対応地域',url:'https://griene.jp/area'},
  {id:'griene-terms',label:'グリエネ：利用規約',url:'https://griene.jp/terms'}
];
const cell = (providerId,parts,sourceIds,note) => ({providerId,parts,sourceIds,...(note ? {note} : {})});
const part = (status,text) => ({status,text});
export const comparisonRows = [
  {id:'screening',label:'加盟する会社の審査',cells:[
    cell('solar-partners',[part('yes','加盟時に審査')],['sp-home','sp-support']),
    cell('tainavi',[part('yes','加盟時に審査')],['tainavi-screen']),
    cell('griene',[part('yes','保険・財務などを審査')],['griene-home','griene-terms'])
  ]},
  {id:'ongoing-screening',label:'加盟後の継続審査',cells:[
    cell('solar-partners',[part('yes','継続して審査')],['sp-support']),
    cell('tainavi',[part('unknown','')],['tainavi-screen']),
    cell('griene',[part('unknown','')],['griene-terms'])
  ]},
  {id:'contact',label:'最初の連絡',cells:[
    cell('solar-partners',[part('yes','サイトの窓口が希望を確認')],['sp-home','sp-company']),
    cell('tainavi',[part('yes','サイトの窓口から確認連絡')],['tainavi-flow']),
    cell('griene',[part('yes','サイトの窓口が聞き取り')],['griene-home'])
  ]},
  {id:'support',label:'見積もりの相談',cells:[
    cell('solar-partners',[part('yes','比較の相談')],['sp-home','sp-support']),
    cell('tainavi',[part('yes','相談受付')],['tainavi-flow','tainavi-terms']),
    cell('griene',[part('yes','相談受付')],['griene-home','griene-terms'])
  ]},
  {id:'scheduling',label:'日程の調整',cells:[
    cell('solar-partners',[part('yes','調整の支援')],['sp-home']),
    cell('tainavi',[part('unknown','')],['tainavi-flow','tainavi-terms']),
    cell('griene',[part('unknown','')],['griene-terms'])
  ]},
  {id:'declining',label:'お断りの代行',cells:[
    cell('solar-partners',[part('yes','断りの連絡を代行')],['sp-support']),
    cell('tainavi',[part('unknown','')],['tainavi-flow','tainavi-terms']),
    cell('griene',[part('unknown','')],['griene-terms'])
  ]},
  {id:'trouble',label:'営業への苦情対応',cells:[
    cell('solar-partners',[part('yes','警告・紹介停止など')],['sp-support','sp-company']),
    cell('tainavi',[part('yes','警告・登録解除')],['tainavi-screen']),
    cell('griene',[part('unknown','')],['griene-terms'])
  ]},
  {id:'disputes',label:'契約トラブルへの関与',cells:[
    cell('solar-partners',[part('unknown','原則は当事者間で解決')],['sp-support']),
    cell('tainavi',[part('no','契約交渉への介入も対象外')],['tainavi-terms']),
    cell('griene',[part('unknown','原則は利用者側で解決')],['griene-terms'])
  ]},
  {id:'guarantee',label:'工事が完成しない場合の保証',cells:[
    cell('solar-partners',[part('partial','別途申込が必要・補償額に上限')],['sp-guarantee']),
    cell('tainavi',[part('unknown','')],['tainavi-home','tainavi-terms']),
    cell('griene',[part('unknown','')],['griene-home','griene-terms'])
  ]}
];
export const comparisonScope = '太陽光＋蓄電池の新設の場合';
