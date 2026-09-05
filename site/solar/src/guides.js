import guideArticles from "../data/articles.json";

const categoryOrder = ["economics", "subsidies", "quotes", "safety"];
const guideImages = import.meta.glob("../../shared/assets/*.{png,webp}", {
  eager: true,
  query: "?url",
  import: "default"
});

function imageUrlFor(article) {
  const fileName = article.image.src.split("/").at(-1);
  return guideImages[`../../shared/assets/${fileName}`] ?? article.image.src;
}

function cardFor(article, featured = false) {
  const link = document.createElement("a");
  link.className = featured ? "guide-article-card guide-article-card--featured" : "guide-article-card";
  link.href = article.href;

  const visual = document.createElement("span");
  visual.className = "guide-article-card__visual";
  const image = document.createElement("img");
  image.src = imageUrlFor(article);
  image.width = article.image.width;
  image.height = article.image.height;
  image.alt = article.image.alt;
  image.loading = featured ? "eager" : "lazy";
  image.decoding = "async";
  visual.append(image);

  const body = document.createElement("span");
  body.className = "guide-article-card__body";
  const category = document.createElement("span");
  category.className = "guide-article-card__category";
  category.textContent = article.category;
  const title = document.createElement("strong");
  title.className = "guide-article-card__title";
  title.textContent = article.title;
  const summary = document.createElement("span");
  summary.className = "guide-article-card__summary";
  summary.textContent = article.summary;
  const meta = document.createElement("span");
  meta.className = "guide-article-card__meta";
  meta.textContent = `${article.metaLabel}：${article.metaValue}`;
  body.append(category, title, summary, meta);
  link.append(visual, body);
  return link;
}

function renderCards(container, articles, featured = false) {
  container.replaceChildren(...articles.map((article) => cardFor(article, featured)));
}

function initializeGuideDirectory() {
  const featuredContainer = document.querySelector("[data-featured-guides]");
  const libraryContainer = document.querySelector("[data-guide-library]");
  const filterContainer = document.querySelector("[data-guide-filters]");
  const count = document.querySelector("[data-guide-count]");
  if (!featuredContainer || !libraryContainer || !filterContainer || !count) return;

  const featuredArticles = guideArticles
    .filter((article) => Number.isInteger(article.featuredOrder))
    .sort((first, second) => first.featuredOrder - second.featuredOrder);
  renderCards(featuredContainer, featuredArticles, true);

  const availableCategories = categoryOrder
    .map((id) => ({ id, label: guideArticles.find((article) => article.categoryId === id)?.category }))
    .filter((category) => category.label);
  const filters = [{ id: "all", label: "すべて" }, ...availableCategories];

  const selectCategory = (categoryId) => {
    const visibleArticles = categoryId === "all"
      ? guideArticles
      : guideArticles.filter((article) => article.categoryId === categoryId);
    renderCards(libraryContainer, visibleArticles);
    count.textContent = `${visibleArticles.length}本の記事`;
    for (const button of filterContainer.querySelectorAll("button")) {
      button.setAttribute("aria-pressed", String(button.dataset.category === categoryId));
    }
  };

  const buttons = filters.map((filter) => {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "guide-filter";
    button.dataset.category = filter.id;
    button.textContent = filter.label;
    button.addEventListener("click", () => selectCategory(filter.id));
    return button;
  });
  filterContainer.replaceChildren(...buttons);
  selectCategory("all");
}

initializeGuideDirectory();
