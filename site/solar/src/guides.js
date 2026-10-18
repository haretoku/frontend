import guideArticles from "../data/articles.json";
import { groupedArticles } from './guide-groups.js';

const directoryArticles = guideArticles;

const guideImages = import.meta.glob("../../shared/assets/*.{png,webp,svg}", {
  eager: true,
  query: "?url",
  import: "default"
});

function imageUrlFor(article) {
  const fileName = article.image.src.split("/").at(-1);
  return guideImages[`../../shared/assets/${fileName}`] ?? article.image.src;
}

function cardFor(article, {compact = false} = {}) {
  const link = document.createElement("a");
  link.className = "guide-article-card";
  link.href = article.href;

  const visual = document.createElement("span");
  visual.className = "guide-article-card__visual";
  const image = document.createElement("img");
  image.src = imageUrlFor(article);
  image.width = article.image.width;
  image.height = article.image.height;
  image.alt = article.image.alt;
  image.loading = "lazy";
  image.decoding = "async";
  visual.append(image);

  const body = document.createElement("span");
  body.className = "guide-article-card__body";
  const category = document.createElement("span");
  category.className = "guide-article-card__category";
  category.textContent = article.category;
  const title = document.createElement("strong");
  title.className = "guide-article-card__title";
  const titleParts = (compact ? article.listTitle ?? article.title : article.title).split(/(蓄電池)/);
  title.append(...titleParts.map(text => {
    if (text !== '蓄電池') return document.createTextNode(text);
    return Object.assign(document.createElement('span'), { className: 'guide-title-term', textContent: text });
  }));
  const summary = document.createElement("span");
  summary.className = "guide-article-card__summary";
  summary.textContent = compact ? article.listSummary ?? article.summary : article.summary;
  const meta = document.createElement("span");
  meta.className = "guide-article-card__meta";
  meta.textContent = article.articleType === 'news'
    ? `${article.publishedAt ? '公開日' : '作成日'}：${article.publishedAt ?? article.createdAt}${article.updatedAt && article.updatedAt !== (article.publishedAt ?? article.createdAt) ? ` ／ 更新日：${article.updatedAt}` : ''}`
    : `${article.metaLabel}：${article.metaValue}`;
  body.append(category, title, summary, meta);
  link.append(visual, body);
  return link;
}

function renderCards(container, articles, options) {
  container.replaceChildren(...articles.map((article) => cardFor(article, options)));
}

function scrollControlsFor(cards, label) {
  const controls = document.createElement('div');
  controls.className = 'guide-scroll-controls';
  controls.setAttribute('role', 'group');
  controls.setAttribute('aria-label', `${label}の横送り`);
  const buttons = [-1, 1].map(direction => {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = `guide-scroll-button guide-scroll-button--${direction < 0 ? 'previous' : 'next'}`;
    button.setAttribute('aria-label', `${label}の${direction < 0 ? '前' : '次'}の記事を表示`);
    button.setAttribute('aria-controls', cards.id);
    const arrow = document.createElement('span');
    arrow.setAttribute('aria-hidden', 'true');
    const icon = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
    icon.setAttribute('viewBox', '0 0 24 24');
    icon.setAttribute('fill', 'none');
    icon.setAttribute('focusable', 'false');
    const chevron = document.createElementNS('http://www.w3.org/2000/svg', 'path');
    chevron.setAttribute('d', direction < 0 ? 'M14.5 5.5 8 12l6.5 6.5' : 'M9.5 5.5 16 12l-6.5 6.5');
    chevron.setAttribute('stroke', 'currentColor');
    chevron.setAttribute('stroke-width', '1.75');
    chevron.setAttribute('stroke-linecap', 'round');
    chevron.setAttribute('stroke-linejoin', 'round');
    icon.append(chevron);
    arrow.append(icon);
    button.append(arrow);
    button.addEventListener('click', () => {
      const card = cards.querySelector('.guide-article-card');
      const step = card.getBoundingClientRect().width + parseFloat(getComputedStyle(cards).columnGap);
      cards.scrollBy({
        left: direction * step,
        behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
      });
    });
    return button;
  });
  const updateButtons = () => {
    buttons[0].disabled = cards.scrollLeft <= 1;
    buttons[1].disabled = cards.scrollLeft + cards.clientWidth >= cards.scrollWidth - 1;
  };
  buttons[0].disabled = true;
  cards.addEventListener('scroll', updateButtons, { passive: true });
  new ResizeObserver(updateButtons).observe(cards);
  controls.append(...buttons);
  return controls;
}

function initializeGuideDirectory() {
  const container = document.querySelector('[data-guide-groups]');
  if (!container) return;
  const press = container.dataset.guideGroups === 'press';
  const topics = container.dataset.guideGroups === 'topics';
  const sections = groupedArticles(directoryArticles,{press,topics}).map(group => {
    const section = document.createElement('section');
    section.className = 'guide-group';
    section.dataset.guideGroup = group.id;
    const headingId = `guide-group-${group.id}`;
    section.setAttribute('aria-labelledby', headingId);
    const header = document.createElement('header');
    header.className = 'guide-group__heading';
    const title = document.createElement('h2');
    title.id = headingId;
    const icon = document.querySelector('.guide-page-title .guide-heading-icon').cloneNode(true);
    icon.setAttribute('class', 'site-nav__icon guide-group__icon');
    title.append(icon, document.createTextNode(group.label));
    const subtitle = document.createElement('p');
    subtitle.className = 'guide-group__subtitle';
    subtitle.textContent = group.title;
    const count = document.createElement('p');
    count.className = 'guide-library__count';
    count.textContent = `${group.articles.length}件`;
    const cards = document.createElement('div');
    cards.className = 'guide-card-grid';
    cards.id = `guide-cards-${group.id}`;
    renderCards(cards, group.articles, {compact:topics});
    const actions = document.createElement('div');
    actions.className = 'guide-group__actions';
    actions.append(count);
    if (!topics && group.articles.length > 0) cards.classList.add('guide-card-grid--scrollable');
    const rail = document.createElement('div');
    rail.className = 'guide-card-rail';
    rail.append(cards);
    if (!topics && group.articles.length > 3) rail.append(scrollControlsFor(cards, group.label));
    header.append(title, subtitle, actions);
    if (group.articles.length === 0) {
      const empty = document.createElement('p');
      empty.className = 'guide-group__empty';
      empty.textContent = '記事はまだありません．';
      cards.append(empty);
    }
    section.append(header, rail);
    return section;
  });
  container.replaceChildren(...sections);
}

initializeGuideDirectory();
