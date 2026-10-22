export const guideGroups = [
  { id: 'core', title: 'つける前に気になること', label: 'はじめのガイド' },
  { id: 'detail', title: '金額や制度を詳しく', label: '費用・制度の詳しいガイド' }
];
export const pressGroups = [{id:'news',title:'調査結果・発表資料',label:'プレスリリース'}];

const topicGroups = [
  {id:'economics',step:1,icon:'calc',mission:'read-economics',label:'わが家はいくら得になる？',title:'収支・電気代・設置費・補助額',ids:['electricity-sales','solar-electricity-savings','solar-installation-cost','subsidy-amount']},
  {id:'equipment',step:2,icon:'sun',mission:'read-equipment',label:'太陽光と蓄電池を知ろう',title:'売電の制度・長く使うための費用',ids:['solar-fit','solar-maintenance-cost']},
  {id:'installation',step:3,icon:'route',mission:'read-installation',label:'つけるまでの流れ',title:'補助金を探して，申請を進める',ids:['subsidies']},
  {id:'companies',step:4,icon:'people',mission:'read-companies',label:'どんな会社に頼む？',title:'見積もりを比べる',ids:['quotes-contractors']}
];

export function groupedArticles(articles,{press=false,topics=false}={}) {
  if(topics&&!press)return topicGroups.map(({ids,...group})=>({
    ...group,
    articles:ids.flatMap(id=>articles.filter(article=>article.id===id&&article.articleType!=='news'))
  }));
  return (press?pressGroups:guideGroups).map(group => ({
    ...group,
    articles: articles.filter(article => article.articleType === group.id).sort((a, b) =>
      group.id === 'news'
        ? (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt)
        : (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
    )
  }));
}
