import {groupedArticles} from '../../solar/src/guide-groups.js';
import {troubleCategories} from '../../manual/content.js';
import {manualRenewalPages,manualIntroPages,manualScheduleLinks} from './state.js';

// 導入・更新は全ページ読了を別に集計する．更新の全ページ読了は節目の記事読了も満たす．
export function articleReadingMission(pathname, articles) {
  if ([...manualRenewalPages,...manualIntroPages].some(page => page.pathname === pathname)) return null;
  if (manualScheduleLinks.some(link => link.href === pathname)) return 'manual-schedule-article';
  if (troubleCategories.some(item => item.links?.some(link => link.href === pathname))) return 'manual-article';
  return groupedArticles(articles,{topics:true}).some(group => group.articles.some(article => article.href === pathname)) ? 'article' : null;
}
