import './panel.css';
import { missionGroups, readWalkthrough, groupProgress, walkthroughStorageKey } from './state.js';
import { rememberWalkthroughTarget } from './navigation.js';
import { introduceWalkthrough } from './first-visit.js';

// 金色の勲章の中央には，記事と共通のハレナを使う．
const harena = new URL('../../map/assets/navigator.png', import.meta.url).href;
const medal = `<svg viewBox="0 0 48 56" aria-hidden="true" focusable="false"><path d="m11 30-3 23 11-6 6 7 4-22M26 32l6 22 5-8 10 4-9-23" fill="#dbac46" stroke="#a77c2b" stroke-width="1.5" stroke-linejoin="round"/><circle cx="24" cy="23" r="20" fill="#f4d47c" stroke="#b48b38" stroke-width="2"/><circle cx="24" cy="23" r="16" fill="#fff0bb" stroke="#ccaa58"/><svg x="10" y="9" width="28" height="28" viewBox="240 245 780 780"><image href="${harena}" width="1280" height="1280"/></svg></svg>`;
const nav = document.querySelector('.map-header .header-nav');
if (nav) {
  document.body.classList.add('has-walkthrough');
  const button = document.createElement('button');
  button.type = 'button';
  button.className = 'walkthrough-trigger';
  button.setAttribute('aria-haspopup', 'dialog');
  button.setAttribute('aria-controls', 'walkthrough-panel');
  button.setAttribute('aria-expanded', 'false');
  button.setAttribute('aria-label', 'はれトクの歩き方');
  button.innerHTML = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 3h13a1 1 0 0 1 1 1v16H6a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2Zm2 0v17M3 7h3m-3 5h3m-3 5h3m6-10h5m-5 4h5"/></svg><span>歩き方</span>';
  nav.prepend(button);

  const panel = document.createElement('section');
  panel.id = 'walkthrough-panel';
  panel.className = 'walkthrough-panel';
  panel.setAttribute('popover', 'auto');
  panel.setAttribute('role', 'dialog');
  panel.setAttribute('aria-labelledby', 'walkthrough-title');
  panel.innerHTML = `<div class="walkthrough-binding" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
    <header class="walkthrough-panel__header"><div><p class="walkthrough-eyebrow">わが家の太陽光えらび</p><h2 id="walkthrough-title">はれトクの歩き方</h2></div><button class="walkthrough-close" type="button" aria-label="歩き方を閉じる">×</button></header>
    <div class="walkthrough-groups"></div>`;
  for (const group of missionGroups) {
    const section = document.createElement('section');
    section.className = 'walkthrough-group';
    section.dataset.missionGroup = group.id;
    const titleId = `walkthrough-group-${group.id}`;
    section.setAttribute('aria-labelledby', titleId);
    const header = document.createElement('div');
    header.className = 'walkthrough-group__heading';
    const title = document.createElement('h3');
    title.id = titleId;
    title.textContent = group.title;
    const award = document.createElement('span');
    award.className = 'walkthrough-medal';
    award.setAttribute('role', 'img');
    award.setAttribute('aria-label', group.award);
    award.title = group.award;
    award.hidden = true;
    award.innerHTML = medal;
    const fraction = document.createElement('span');
    fraction.className = 'walkthrough-group__fraction';
    fraction.setAttribute('aria-hidden', 'true');
    header.append(title, award, fraction);
    const description = document.createElement('p');
    description.className = 'walkthrough-group__description';
    description.textContent = group.description;
    const progress = document.createElement('div');
    progress.className = 'walkthrough-group__progress';
    progress.setAttribute('role', 'progressbar');
    progress.setAttribute('aria-label', `${group.title}の進み具合`);
    progress.setAttribute('aria-valuemin', '0');
    progress.setAttribute('aria-valuemax', '100');
    progress.append(document.createElement('span'));
    const list = document.createElement('ul');
    group.missions.forEach((mission, index) => {
      const row = document.createElement('li');
      row.dataset.mission = mission.id;
      const indicator = document.createElement('span');
      indicator.className = 'walkthrough-stamp';
      indicator.setAttribute('aria-hidden', 'true');
      indicator.innerHTML = `<span class="walkthrough-stamp__number">${index + 1}</span><svg viewBox="0 0 24 24" focusable="false"><path d="m6 12 4 4 8-9"/></svg>`;
      const status = document.createElement('span');
      status.id = `walkthrough-status-${mission.id}`;
      status.className = 'walkthrough-sr-only';
      status.dataset.missionStatus = '';
      const link = document.createElement('a');
      link.href = mission.href;
      const remember = event => {
        if ((event.type === 'click' && event.button === 0) || (event.type === 'auxclick' && event.button === 1)) {
          rememberWalkthroughTarget(mission.id);
          panel.hidePopover();
          const destination = new URL(link.href);
          // 同じURLでは再読込せず，その場で案内を開始する．同一hashも再選択できる．
          if (event.type === 'click' && !event.ctrlKey && !event.metaKey && !event.shiftKey && !event.altKey && destination.pathname === location.pathname && destination.hash === location.hash) {
            event.preventDefault();
            window.dispatchEvent(new Event('walkthrough-target-change'));
          }
        }
      };
      link.addEventListener('click', remember);
      link.addEventListener('auxclick', remember);
      link.setAttribute('aria-describedby', status.id);
      link.append(document.createTextNode(mission.label));
      const arrow = document.createElement('span');
      arrow.className = 'walkthrough-arrow';
      arrow.setAttribute('aria-hidden', 'true');
      arrow.textContent = '→';
      link.append(arrow);
      row.append(indicator, link, status);
      list.append(row);
    });
    section.append(header, description, progress, list);
    panel.querySelector('.walkthrough-groups').append(section);
  }
  document.body.append(panel);
  button.popoverTargetElement = panel;
  document.querySelector('#menu-button').addEventListener('click', () => {
    if (panel.matches(':popover-open')) panel.hidePopover();
  });
  panel.querySelector('.walkthrough-close').addEventListener('click', () => { panel.hidePopover(); button.focus(); });
  function positionPanel() {
    const header = document.querySelector('.map-header').getBoundingClientRect();
    const top = Math.max(12, Math.min(header.bottom + 8, innerHeight - 200));
    panel.style.setProperty('--walkthrough-top', `${top}px`);
  }
  panel.addEventListener('beforetoggle', event => {
    if (event.newState === 'open') {
      positionPanel();
      document.querySelector('#menu').hidden = true;
      document.querySelector('#menu-button').setAttribute('aria-expanded', 'false');
      render();
    }
    button.setAttribute('aria-expanded', String(event.newState === 'open'));
  });
  window.addEventListener('resize', positionPanel);
  function render() {
    const state = readWalkthrough();
    for (const group of missionGroups) {
      const section = panel.querySelector(`[data-mission-group="${group.id}"]`);
      const result = groupProgress(group, state);
      section.querySelector('.walkthrough-group__fraction').textContent = `${result.done} / ${result.total}　${result.percent}%`;
      const progress = section.querySelector('[role="progressbar"]');
      progress.setAttribute('aria-valuenow', String(result.percent));
      progress.setAttribute('aria-valuetext', `${result.total}項目のうち${result.done}項目，${result.percent}%`);
      progress.firstElementChild.style.width = `${result.percent}%`;
      section.querySelector('.walkthrough-medal').hidden = !result.complete;
    }
    for (const row of panel.querySelectorAll('[data-mission]')) {
      const done = state[row.dataset.mission] === true;
      row.classList.toggle('is-done', done);
      row.querySelector('[data-mission-status]').textContent = done ? '達成済み' : '未達成';
    }
  }
  window.addEventListener('walkthrough-change', render);
  window.addEventListener('storage', event => { if (event.key === walkthroughStorageKey || event.key === null) render(); });
  window.addEventListener('pageshow', render);
  render();
  introduceWalkthrough(button, panel, harena);
}
