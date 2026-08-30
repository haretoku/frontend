const PUBLIC_DATA_URL = new URL("../../data/public-data.json", import.meta.url);
const METADATA_URL = new URL("../../data/metadata.json", import.meta.url);

async function loadJson(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`公開データを取得できませんでした：${response.status}`);
  }
  return response.json();
}

function setText(selector, value) {
  for (const element of document.querySelectorAll(selector)) {
    element.textContent = value;
  }
}

function yen(value) {
  return `${new Intl.NumberFormat("ja-JP").format(value)}円`;
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

async function initialize() {
  const status = document.querySelector("[data-article-data-status]");
  try {
    const [publicData, metadata] = await Promise.all([
      loadJson(PUBLIC_DATA_URL),
      loadJson(METADATA_URL)
    ]);
    if (publicData.data_version !== metadata.data_version) {
      throw new Error("公開データと出典情報の版が一致しません．");
    }

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

    for (const element of document.querySelectorAll("[data-fit-period]")) {
      const period = calculation.fit_prices[Number(element.dataset.fitPeriod)];
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

initialize();
