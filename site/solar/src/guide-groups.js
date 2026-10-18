export const guideGroups = [
  { id: 'core', title: 'つける前に気になること', label: 'はじめのガイド' },
  { id: 'detail', title: '金額や制度を詳しく', label: '費用・制度の詳しいガイド' }
];
export const pressGroups = [{id:'news',title:'調査結果・発表資料',label:'プレスリリース'}];

const topicGroups = [
  {id:'electricity',label:'電気の使い方',title:'使う・売るを知る',ids:['self-consumption','solar-electricity-savings','solar-fit']},
  {id:'cost',label:'費用・補助金',title:'かかるお金と収支を知る',ids:['electricity-sales','solar-installation-cost','subsidies','subsidy-amount']},
  {id:'equipment',label:'設備・維持管理',title:'長く使うために',ids:['solar-maintenance-cost','disaster']},
  {id:'companies',label:'会社選び',title:'見積もりを比べる',ids:['quotes-contractors']}
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
