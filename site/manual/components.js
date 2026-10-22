import {timelineEvents, troubleCategories} from './content.js';
import {renderManualIcon} from './icons.js';

const escape = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[char]));
const status = item => item.pending && !item.links?.length ? ' <span class="manual-status">準備中</span>' : '';
const links = item => item.links?.length ? '<div class="manual-links">' + item.links.map(link => `<a class="manual-guide" href="${escape(link.href)}">${escape(link.label)}<span aria-hidden="true">→</span></a>`).join('') + '</div>' : '';

export function renderTimeline({includeIntro = true, showStatus = true} = {}) {
  return '<ol class="manual-timeline">\n' + timelineEvents
    .filter(event => includeIntro || event.id !== 'intro')
    .map(event => `<li${event.id === 'intro' ? ' id="after-installation"' : ''}><div class="manual-year">${escape(event.year)}${event.note ? `<small>${escape(event.note)}</small>` : ''}</div><div class="manual-timeline-card"><h3>${escape(event.title)}${showStatus ? status(event) : ''}</h3><p>${escape(event.description)}</p>${links(event)}</div></li>`)
    .join('\n') + '\n</ol>';
}

export function renderProblems() {
  return '<div class="manual-problems">\n' + troubleCategories.map(category =>
    `<article class="manual-problem manual-problem--pending"><div class="manual-pending-head"><span class="manual-icon" aria-hidden="true">${renderManualIcon(category.icon)}</span><div><h3>${escape(category.title)}${status(category)}</h3><p>${escape(category.description)}</p>${links(category)}</div></div></article>`
  ).join('\n') + '\n</div>';
}
