export const guideGroups = [
  { id: 'core', title: 'つける前に気になること', label: 'はじめのガイド' },
  { id: 'detail', title: 'わが家の場合は？', label: '地域・暮らし別ガイド' },
  { id: 'news', title: '気になる話題', label: '旬のガイド' }
];

export function groupedArticles(articles) {
  return guideGroups.map(group => ({
    ...group,
    articles: articles.filter(article => article.articleType === group.id).sort((a, b) =>
      group.id === 'news'
        ? (b.publishedAt ?? b.createdAt).localeCompare(a.publishedAt ?? a.createdAt)
        : (a.featuredOrder ?? Infinity) - (b.featuredOrder ?? Infinity)
    )
  }));
}
