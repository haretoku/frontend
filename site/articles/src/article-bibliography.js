import bibliography from "./article-bibliography.json";

// Article-specific labels are stored explicitly to remain stable when sections move.
export function bindArticleBibliography() {
  const article = location.pathname.split("/").pop().replace(/\.html$/, "");
  const labels = bibliography.articles[article];
  if (!labels) return;
  for (const item of document.querySelectorAll("[data-bibliography-source]")) {
    const id = item.dataset.bibliographySource;
    const source = bibliography.sources[id];
    const link = item.querySelector("a");
    if (!source || !labels[id] || !link) continue;
    link.href = source.url;
    link.textContent = source.title;
    item.replaceChildren(`${source.publisher}（${labels[id]}）．`, link);
    if (source.link_note) item.append(`（${source.link_note}）`);
  }
  for (const citation of document.querySelectorAll("[data-cite-sources]")) {
    const ids = citation.dataset.citeSources.split(/\s+/);
    if (ids.some((id) => !bibliography.sources[id] || !labels[id])) continue;
    citation.textContent = `（${ids.map((id) => `${bibliography.sources[id].publisher}，${labels[id].replace("年アクセス", "")}`).join("；")}）`;
  }
}
