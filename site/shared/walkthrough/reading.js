import {groupedArticles} from '../../solar/src/guide-groups.js';
import {troubleCategories} from '../../manual/content.js';
import {manualRenewalPages,manualIntroPages,manualScheduleLinks} from './state.js';

// 更新・導入は全ページを別に集計し，一覧の分類と重複計上しない．
export function articleReadingMission(pathname, articles) {
  if ([...manualRenewalPages,...manualIntroPages].some(page => page.pathname === pathname)) return null;
  if (manualScheduleLinks.some(link => link.href === pathname)) return 'manual-schedule-article';
  if (troubleCategories.some(item => item.links?.some(link => link.href === pathname))) return 'manual-article';
  return groupedArticles(articles,{topics:true}).some(group => group.articles.some(article => article.href === pathname)) ? 'article' : null;
}
