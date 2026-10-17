export const guideGroups = [
  { id: 'core', title: 'つける前に気になること', label: 'はじめのガイド' },
  { id: 'detail', title: 'わが家の場合は？', label: '地域・暮らし別ガイド' }
];
export const pressGroups = [{id:'news',title:'調査結果・発表資料',label:'プレスリリース'}];

export function groupedArticles(articles,{press=false}={}) {
  return (press?pressGroups:guideGroups).map(group => ({
    ...group,
    articles: articles.filter(article => article.articleType === group.id).sort((a, b) =>
      group.id === 'news'
        ? (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt)
        : (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
    )
  }));
}
