import { replacesLegacyPrefecture } from '../../simulator/src/diagnostic-subsidy.js';
import { setupArticleQuoteBar } from "./article-quote-bar.js";
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
  tableOfContents.open = false;
  const summary = tableOfContents.querySelector("summary");
  const updateLabel = () => {
    summary.setAttribute("aria-label", tableOfContents.open ? "目次を閉じる" : "目次を開く");
  };
  updateLabel();
  tableOfContents.addEventListener("toggle", updateLabel);
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

    const subsidyAssumptions = document.querySelector('[data-subsidy-assumptions]');
    if (subsidyAssumptions) {
      const diagnosticPrograms = publicData.diagnostic_subsidy_programs ?? [];
      const diagnosticIds = new Set(diagnosticPrograms.map(program => program.id));
      const programs = [...diagnosticPrograms, ...(publicData.municipal_subsidy_programs ?? []), ...publicData.prefectures.flatMap(region => [...(region.subsidy_programs ?? []), ...(replacesLegacyPrefecture(diagnosticPrograms,region.code)?[]:(region.candidate_subsidy_programs ?? []).filter(program => !diagnosticIds.has(program.id)))])];
      for (const program of programs) {
        const details = document.createElement('details');
        const summary = document.createElement('summary');
        const branchLabel = {shiga_basic_fit_solar_battery:'基本枠（FIT）',shiga_priority_non_fit:'重点枠（非FIT）'}[program.machine_rule];
        summary.textContent = program.program_name + (branchLabel ? ' — '+branchLabel : '');
        if (program.diagnostic_scope?.status === 'excluded_required_external_work') summary.textContent += '（診断対象外）';
        details.append(summary);
        if (program.diagnostic_scope?.status === 'excluded_required_external_work') {
          const scopeNote = document.createElement('p');
          scopeNote.textContent = '以下は対象外の制度要件と確認事項です．今回の計算で採用する仮定ではありません．';
          details.append(scopeNote);
        }
        const formula = {
          toyama_noncash_solar:'ポイント等10万円分を額面100％の現金相当の経済便益として算入します．給付形態は非現金です．地域協力店等の2倍条件と税抜・値引後の製品本体価格10万円超を満たす適格製品の採用を仮定し，工事込総額から本体価格を逆算したものではありません．',
          nagano_roof_solar_battery:'既存住宅で太陽光10kW未満・蓄電池4kWh以上の場合に，太陽光上限5万円，蓄電池上限15万円を算入します．税込モデル費用を1.1で除した設備別の対象費用から同費目の他補助を控除し，各設備の算入額を千円未満切捨てします．入力蓄電池容量を制度対象容量へ対応させる採用仮定です．',
          hyogo_awaji_battery:'洲本市・南あわじ市・淡路市を選択した場合に，県関連制度として算入します．入力容量を制度対象容量へ対応させ，0.1kWh未満切捨て後の容量×1.5万円，上限15万円，千円未満切捨てです．工事費を除く税込機器費を1.1で除した費用上限を守り，固定算式額を減額して算入しません．市独自の補助制度ではありません．',
          miyazaki_battery_existing_or_contracted_pv:'太陽光を先行契約し，蓄電池の交付決定後に蓄電池を契約する順序を採用仮定とします．税込蓄電池費用÷1.1÷3，0.1kWh未満切捨て後の容量×5万円，50万円の最小額を千円未満切捨てします．税抜費用から同費目の他補助を控除した残額を上限とします．',
          fukushima_residential_solar_fit:'太陽光（10kW未満）：モジュール容量を0.01kW未満切捨てした値×4万円，上限16万円．算定額は千円未満を切り捨てます．蓄電池分は現行のFIT売電経路へ算入しません．',
          yamanashi_renewable_energy:'既存住宅の太陽光：容量を整数kWに切り捨てた値×3万円，上限27万円．蓄電池：定格容量を整数kWhに切り捨てた値が4kWh以上の場合は25万円．太陽光・蓄電池のそれぞれの対象費用を超えて算入しません．'
        }[program.machine_rule];
        const scopeClarification = program.machine_rule === 'ishikawa_residential_solar_battery_non_fit'
          ? '非FITの条件は，今回の新設太陽光を含む申請経路についてのものです．既設太陽光への蓄電池追加は別の申請枠であり，今回の新設診断では評価していません．'
          : null;
        const notes = [formula,scopeClarification,program.diagnostic_scope?.basis, program.note, ...(program.calculation_assumptions ?? []), ...(program.required_confirmations ?? [])].filter(Boolean);
        for (const text of [...new Set(notes)]) {
          const paragraph = document.createElement('p');
          paragraph.textContent = text;
          details.append(paragraph);
        }
        for (const url of [...new Set([program.official_url, ...(program.official_urls ?? []), ...(program.benefit_components ?? []).map(component => component.official_url)].filter(Boolean))]) {
          const paragraph = document.createElement('p');
          const link = document.createElement('a');
          link.href = url;
          link.textContent = '公式情報を確認 ↗';
          link.target = '_blank';
          link.rel = 'noopener noreferrer';
          paragraph.append(link);
          details.append(paragraph);
        }
        subsidyAssumptions.append(details);
      }
    }

    const calculation = publicData.calculation;
    setText("[data-data-version]", publicData.data_version);
    setText("[data-installation-cost-new-per-kw]", yen(calculation.installation_cost_yen_per_kw_by_housing_age.new));
    setText("[data-installation-cost-existing-per-kw]", yen(calculation.installation_cost_yen_per_kw_by_housing_age.existing));
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

setupArticleQuoteBar();
