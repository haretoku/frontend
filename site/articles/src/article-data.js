import { loadFrontendData } from "../../../data/src/data-loader.js";

function setText(selector, value) {
  for (const element of document.querySelectorAll(selector)) {
    element.textContent = value;
  }
}

function yen(value) {
  return `${new Intl.NumberFormat("ja-JP").format(value)}円`;
}

function lifecycleEvent(calculation, costType) {
  return calculation.lifecycle_cost_events?.find((event) => event.cost_type === costType);
}

function bindSources(metadata) {
  const sources = new Map(metadata.sources.map((source) => [source.source_id, source]));
  for (const link of document.querySelectorAll("[data-source-id]")) {
    const source = sources.get(link.dataset.sourceId);
    if (!source) {
      link.replaceWith(document.createTextNode("出典情報を確認できませんでした．"));
      continue;
    }
    link.href = source.source_url;
    if (!link.textContent.trim()) {
      link.textContent = `${source.publisher}「${source.source_title}」`;
    }
  }
}

function initializeTableOfContents() {
  const tableOfContents = document.querySelector("details.article-toc");
  if (!tableOfContents) return;
  tableOfContents.open = window.matchMedia("(min-width: 48rem)").matches;
}

function populateDaytimeOccupancy(calculation) {
  const model = calculation.daytime_occupancy;
  if (!model) return;
  setText("[data-temporal-overlap-bin-count]", String(model.time_bin_definition.count));
  setText(
    "[data-self-consumption-validation-rate]",
    `${(model.external_validation.model_rate * 100).toFixed(5)}％`
  );
  setText(
    "[data-self-consumption-validation-error]",
    `${(Math.max(...Object.values(model.external_validation.relative_errors)) * 100).toFixed(2)}％`
  );

  for (const table of document.querySelectorAll("[data-daytime-occupancy-table]")) {
    const fragment = document.createDocumentFragment();
    for (const option of model.options) {
      const row = document.createElement("tr");
      for (const text of [
        option.label,
        option.definition,
        option.daytime_occupancy_rate.toFixed(3)
      ]) {
        const cell = document.createElement("td");
        cell.textContent = text;
        row.append(cell);
      }
      fragment.append(row);
    }
    table.replaceChildren(fragment);
  }
}

async function initialize() {
  const status = document.querySelector("[data-article-data-status]");
  try {
    const { publicData, metadata } = await loadFrontendData();

    const calculation = publicData.calculation;
    setText("[data-data-version]", publicData.data_version);
    setText("[data-system-capacity]", `${calculation.system_capacity_kw} kW`);
    setText("[data-evaluation-years]", `${calculation.evaluation_period_years}年間`);
    setText("[data-installation-cost-per-kw]", yen(calculation.installation_cost_yen_per_kw));
    setText(
      "[data-installation-cost-total]",
      yen(calculation.system_capacity_kw * calculation.installation_cost_yen_per_kw)
    );
    setText("[data-post-fit-price]", `${calculation.post_fit_price_yen_per_kwh}円／kWh`);
    populateDaytimeOccupancy(calculation);

    const maintenance = lifecycleEvent(calculation, "maintenance");
    const replacement = lifecycleEvent(calculation, "replacement");
    if (maintenance) {
      setText("[data-maintenance-cost]", yen(maintenance.cost_yen));
      setText("[data-maintenance-years]", `${maintenance.event_years.join("，")}年目`);
      setText("[data-maintenance-total]", yen(maintenance.cost_yen * maintenance.event_years.length));
    }
    if (replacement) {
      setText("[data-replacement-cost]", yen(replacement.cost_yen));
      setText("[data-replacement-years]", `${replacement.event_years.join("，")}年目`);
    }
    if (maintenance && replacement) {
      const totalLifecycleCost = maintenance.cost_yen * maintenance.event_years.length
        + replacement.cost_yen * replacement.event_years.length;
      setText("[data-lifecycle-cost-total]", yen(totalLifecycleCost));
    }

    for (const element of document.querySelectorAll("[data-fit-period]")) {
      const period = calculation.sale_price_periods[Number(element.dataset.fitPeriod)];
      if (period) {
        element.textContent = `${period.period_start_year}～${period.period_end_year}年目：${period.price_yen_per_kwh}円／kWh`;
      }
    }

    bindSources(metadata);
    if (status) {
      status.textContent = `公開データ版：${publicData.data_version}`;
    }
  } catch (error) {
    if (status) {
      status.textContent = error instanceof Error ? error.message : "公開データを確認できませんでした．";
    }
  }
}

initializeTableOfContents();
initialize();
