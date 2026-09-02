import { CALCULATION_IMPLEMENTED, calculateEstimate } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";

const elements = {
  form: document.querySelector("#estimate-form"),
  prefecture: document.querySelector("#prefecture"),
  monthlyElectricityBill: document.querySelector("#monthly-electricity-bill"),
  calculateButton: document.querySelector("#calculate-button"),
  calculateLabel: document.querySelector("[data-calculate-label]"),
  formMessage: document.querySelector("#form-message"),
  calculator: document.querySelector(".calculator"),
  calculatorExpanded: document.querySelector("[data-calculator-expanded]"),
  calculatorCollapsed: document.querySelector("[data-calculator-collapsed]"),
  conditionSummary: document.querySelector("[data-condition-summary]"),
  changeConditionsButton: document.querySelector("[data-change-conditions]"),
  cancelConditionsButton: document.querySelector("[data-cancel-conditions]"),
  roofOrientation: document.querySelector("#roof-orientation"),
  roofConditionSummary: document.querySelector("[data-roof-condition-summary]"),
  dataStatus: document.querySelector("#data-status"),
  result: document.querySelector("#estimate-result"),
  resultTitle: document.querySelector("#result-title"),
  resultCondition: document.querySelector("[data-result-condition]"),
  resultSummary: document.querySelector("[data-result-summary]"),
  resultEconomicBenefit: document.querySelector("[data-result-economic-benefit]"),
  resultPayback: document.querySelector("[data-result-payback]"),
  resultPeriod: document.querySelector("[data-result-period]"),
  resultGrossCost: document.querySelector("[data-result-gross-cost]"),
  resultInitialCost: document.querySelector("[data-result-initial-cost]"),
  resultSelfConsumption: document.querySelector("[data-result-self-consumption]"),
  resultSalesIncome: document.querySelector("[data-result-sales-income]"),
  resultSubsidy: document.querySelector("[data-result-subsidy]"),
  resultSubsidyStatus: document.querySelector("[data-result-subsidy-status]"),
  resultLifecycleCost: document.querySelector("[data-result-lifecycle-cost]"),
  resultLifecycleStatus: document.querySelector("[data-result-lifecycle-status]"),
  resultProfit: document.querySelector("[data-result-profit]"),
  resultGeneration: document.querySelector("[data-result-generation]"),
  resultConsumption: document.querySelector("[data-result-consumption]"),
  resultSelfConsumed: document.querySelector("[data-result-self-consumed]"),
  resultPurchased: document.querySelector("[data-result-purchased]"),
  resultExported: document.querySelector("[data-result-exported]"),
  scenarioList: document.querySelector("[data-scenario-list]"),
  lossGuidance: document.querySelector("[data-loss-guidance]"),
  capacitySlider: document.querySelector("#system-capacity"),
  capacityOutput: document.querySelector("[data-capacity-output]"),
  capacityGeneration: document.querySelector("[data-capacity-generation]"),
  capacityInitialCost: document.querySelector("[data-capacity-initial-cost]"),
  capacityProfit: document.querySelector("[data-capacity-profit]"),
  capacityStatus: document.querySelector("[data-capacity-status]"),
  cashflowChart: document.querySelector("[data-cashflow-chart]"),
  cashflowDescription: document.querySelector("[data-cashflow-description]"),
  cashflowEndpoint: document.querySelector("[data-cashflow-endpoint]"),
  cashflowScenario: document.querySelector("[data-cashflow-scenario]"),
  resultDisclosures: document.querySelectorAll("[data-result-disclosure]")
};

let frontendData = null;
let latestResult = null;
let selectedScenarioId = "standard";

function populatePrefectures(prefectures) {
  const fragment = document.createDocumentFragment();

  for (const prefecture of prefectures) {
    const option = document.createElement("option");
    option.value = prefecture.code;
    option.textContent = prefecture.name;
    fragment.append(option);
  }

  elements.prefecture.append(fragment);
}

function populateRoofOrientations(detailInputs) {
  const orientation = detailInputs.find((item) => item.input_name === "roof_orientation");
  if (!orientation) return;
  const fragment = document.createDocumentFragment();
  for (const item of orientation.options) {
    const option = document.createElement("option");
    option.value = item.value;
    option.textContent = item.label;
    fragment.append(option);
  }
  elements.roofOrientation.replaceChildren(fragment);
  elements.roofOrientation.value = orientation.default_option;
}

function isInitialized(data) {
  return data.publicData.data_version !== "uninitialized";
}

function updateAvailability() {
  const available = Boolean(frontendData) && isInitialized(frontendData) && CALCULATION_IMPLEMENTED;
  elements.calculateButton.disabled = !available;

  if (!frontendData) {
    return;
  }

  if (!isInitialized(frontendData)) {
    elements.formMessage.textContent = "検証済みデータの準備後に利用できます．";
    return;
  }

  if (!CALCULATION_IMPLEMENTED) {
    elements.formMessage.textContent = "基準計算の実装後に利用できます．";
    return;
  }

  elements.formMessage.textContent = "都道府県を選択して概算結果を確認してください．";
}

function readInput() {
  const monthlyElectricityBill = elements.monthlyElectricityBill.value;

  return {
    prefectureCode: elements.prefecture.value,
    monthlyElectricityBillYen: monthlyElectricityBill === "" ? null : Number(monthlyElectricityBill),
    systemCapacityKw: Number(elements.capacitySlider.value),
    detailConditions: { roof_orientation: elements.roofOrientation.value }
  };
}

function inputFromLocation() {
  const params = new URLSearchParams(window.location.search);
  const prefectureCode = params.get("prefecture") ?? "";
  const monthlyBill = params.get("monthlyElectricityBill");
  const capacity = params.get("systemCapacityKw");
  const roofOrientation = params.get("roofOrientation");
  return {
    prefectureCode,
    monthlyElectricityBillYen: monthlyBill === null || monthlyBill === "" ? null : Number(monthlyBill),
    systemCapacityKw: capacity === null || capacity === "" ? null : Number(capacity),
    detailConditions: roofOrientation ? { roof_orientation: roofOrientation } : undefined
  };
}

function writeInputToLocation(input) {
  const target = new URL(window.location.href);
  target.search = "";
  target.searchParams.set("prefecture", input.prefectureCode);
  if (input.monthlyElectricityBillYen !== null) {
    target.searchParams.set("monthlyElectricityBill", String(input.monthlyElectricityBillYen));
  }
  target.searchParams.set("systemCapacityKw", String(input.systemCapacityKw));
  if (input.detailConditions?.roof_orientation) {
    target.searchParams.set("roofOrientation", input.detailConditions.roof_orientation);
  }
  target.searchParams.set("from", "analysis");
  window.history.replaceState(null, "", target);
}

const yenFormatter = new Intl.NumberFormat("ja-JP");

function formatYen(value) {
  return `${yenFormatter.format(value)}円`;
}

function formatSignedYen(value, direction = "auto") {
  if (!Number.isFinite(value)) {
    return "未確認";
  }
  if (value === 0) {
    return "0円";
  }
  const sign = direction === "cost" || (direction === "auto" && value < 0)
    ? "−"
    : "＋";
  return `${sign}${yenFormatter.format(Math.abs(value))}円`;
}

function formatProfit(value) {
  return formatSignedYen(value);
}

function renderCashflowAmount(element, value, direction = "auto") {
  element.textContent = formatSignedYen(value, direction);
  const tone = !Number.isFinite(value) || value === 0
    ? "neutral"
    : direction === "cost" || (direction === "auto" && value < 0)
      ? "negative"
      : "positive";
  for (const name of ["positive", "negative", "neutral"]) {
    element.classList.toggle(`cashflow-amount--${name}`, name === tone);
  }
}

function renderInlineCashflowAmount(element, prefix, value) {
  const amount = document.createElement("span");
  amount.className = "cashflow-inline-amount";
  renderCashflowAmount(amount, value);
  element.replaceChildren(document.createTextNode(prefix), amount);
}

function decisionAmountParts(value) {
  const amountInTenThousands = yenFormatter.format(Math.abs(Math.round(value / 10_000)));
  return {
    amount: `約${amountInTenThousands}万円`,
    outcome: value >= 0 ? "トク" : "損"
  };
}

function formatCapacity(value) {
  return `${Number(value).toFixed(1)} kW`;
}

function normalizeCapacity(value, fallback) {
  if (!Number.isFinite(value)) {
    return fallback;
  }
  const minimum = Number(elements.capacitySlider.min);
  const maximum = Number(elements.capacitySlider.max);
  const step = Number(elements.capacitySlider.step);
  const clamped = Math.min(maximum, Math.max(minimum, value));
  return Math.round(clamped / step) * step;
}

function formatCompactYen(value) {
  const absolute = Math.abs(value);
  if (absolute >= 10_000) {
    return `${value < 0 ? "−" : ""}${yenFormatter.format(Math.round(absolute / 10_000))}万円`;
  }
  return `${value < 0 ? "−" : ""}${yenFormatter.format(Math.round(absolute))}円`;
}

function formatBasicConditions(result) {
  const bill = result.input.used_default_monthly_electricity_bill
    ? `地域標準の月額${formatYen(result.input.monthly_electricity_bill_yen)}`
    : `月額${formatYen(result.input.monthly_electricity_bill_yen)}`;
  return `${result.input.prefecture_name}・${bill}`;
}

function formatResultConditions(result) {
  const basicConditions = formatBasicConditions(result);
  const capacity = result.input.system_capacity_kw === undefined
    ? "4.0 kW"
    : formatCapacity(result.input.system_capacity_kw);
  const orientation = result.input.detail_conditions?.find(
    (item) => item.input_name === "roof_orientation"
  );
  return `${basicConditions}・${capacity}${orientation ? `・方角：${orientation.label}` : ""}`;
}

function collapseCalculator(result) {
  elements.conditionSummary.textContent = formatBasicConditions(result);
  elements.resultCondition.textContent = `計算条件：${formatResultConditions(result)}`;
  elements.calculatorExpanded.hidden = true;
  elements.calculatorCollapsed.hidden = false;
  elements.calculator.classList.add("calculator--collapsed");
}

function expandCalculator() {
  elements.calculatorCollapsed.hidden = true;
  elements.calculatorExpanded.hidden = false;
  elements.calculator.classList.remove("calculator--collapsed");
  elements.cancelConditionsButton.hidden = latestResult === null;
  elements.calculateLabel.textContent = latestResult === null
    ? "分析結果を表示する"
    : "この条件で再計算する";
  elements.calculator.scrollIntoView({ behavior: "smooth", block: "start" });
  elements.prefecture.focus({ preventScroll: true });
}

function cancelConditionChanges() {
  if (!latestResult) {
    return;
  }
  elements.prefecture.value = latestResult.input.prefecture_code;
  elements.monthlyElectricityBill.value = latestResult.input.used_default_monthly_electricity_bill
    ? ""
    : String(latestResult.input.monthly_electricity_bill_yen);
  collapseCalculator(latestResult);
  elements.changeConditionsButton.focus({ preventScroll: true });
}

function renderBrandOutcome(element, prefix, outcome, suffix = "", decorate = true) {
  const outcomeElement = document.createElement("span");
  outcomeElement.className = decorate && outcome === "トク" ? "brand-word" : "";
  outcomeElement.textContent = outcome;
  element.replaceChildren(
    document.createTextNode(prefix),
    outcomeElement,
    document.createTextNode(suffix)
  );
}

function subsidyStatusFor(scenario, input) {
  if (scenario.subsidy_status) {
    return scenario.subsidy_status;
  }
  if (input.subsidy_capacity_verified === false) {
    return "unverified";
  }
  return scenario.subsidy_yen > 0 ? "applied" : "not_applicable";
}

function subsidyNoteFor(scenario, input) {
  const status = subsidyStatusFor(scenario, input);
  if (status === "applied") {
    return "この容量に適用できる確認済み補助金を反映しています．";
  }
  if (status === "unverified") {
    return scenario.subsidy_calculation_note
      ?? "この容量に適用できる補助金額は未確認です．";
  }
  return "確認した制度では補助金の対象額はありません．";
}

function renderScenarios(scenarios, input) {
  const labels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  const electricityAssumptions = { downside: "電気料金上昇 0％", standard: "電気料金上昇 0％", upside: "電気料金上昇 年2％" };
  elements.scenarioList.replaceChildren();
  for (const scenario of scenarios) {
    const item = document.createElement("button");
    item.type = "button";
    item.className = `scenario-card scenario-card--${scenario.scenario}`;
    item.dataset.scenario = scenario.scenario;
    item.setAttribute("aria-pressed", String(scenario.scenario === selectedScenarioId));
    const label = document.createElement("span");
    label.className = "scenario-card__label";
    label.textContent = labels[scenario.scenario];
    const amount = document.createElement("strong");
    amount.className = "scenario-card__amount";
    renderCashflowAmount(amount, scenario.profit_yen);
    const premise = document.createElement("small");
    premise.className = "scenario-card__premise";
    const subsidyStatus = subsidyStatusFor(scenario, input);
    const subsidyAssumption = subsidyStatus === "applied"
      ? "確認済み補助金あり"
      : subsidyStatus === "unverified"
        ? "容量別補助金は未確認"
        : "補助金なし";
    premise.textContent = `${electricityAssumptions[scenario.scenario]}・${subsidyAssumption}`;
    item.append(label, amount, premise);
    elements.scenarioList.append(item);
  }
}

const SVG_NAMESPACE = "http://www.w3.org/2000/svg";

function createSvgElement(name, attributes = {}) {
  const element = document.createElementNS(SVG_NAMESPACE, name);
  for (const [key, value] of Object.entries(attributes)) {
    element.setAttribute(key, String(value));
  }
  return element;
}

function zeroIntersections(series) {
  const intersections = [];
  for (let index = 1; index < series.length; index += 1) {
    const previous = series[index - 1];
    const current = series[index];
    const previousValue = previous.cumulative_profit_yen;
    const currentValue = current.cumulative_profit_yen;
    const direction = previousValue < 0 && currentValue >= 0
      ? "up"
      : previousValue >= 0 && currentValue < 0
        ? "down"
        : null;
    if (!direction) continue;
    const change = currentValue - previousValue;
    const fraction = change === 0 ? 0 : -previousValue / change;
    intersections.push({
      year: previous.year + fraction * (current.year - previous.year),
      value: 0,
      direction
    });
  }
  return intersections;
}

function paybackIntersection(series) {
  return zeroIntersections(series).findLast((intersection) => intersection.direction === "up") ?? null;
}

function annualCashflowSeries(scenario) {
  if (scenario.annual_cash_flows?.length) {
    return [
      {
        year: 0,
        cumulative_profit_yen: -scenario.net_initial_outlay_yen,
        maintenance_and_replacement_cost_yen: 0
      },
      ...scenario.annual_cash_flows.map((row) => ({
        year: row.year,
        cumulative_profit_yen: row.cumulative_cash_flow_yen,
        maintenance_and_replacement_cost_yen: row.maintenance_and_replacement_cost_yen,
        electricity_savings_yen: row.electricity_savings_yen,
        sales_income_yen: row.sales_income_yen
      }))
    ];
  }
  return scenario.yearly_cash_flow ?? [];
}

function chartCashflowSeries(scenario) {
  const annualSeries = annualCashflowSeries(scenario);
  if (!scenario.annual_cash_flows?.length) {
    return annualSeries;
  }

  const chartSeries = [annualSeries[0]];
  let previousCumulative = annualSeries[0].cumulative_profit_yen;
  for (const point of annualSeries.slice(1)) {
    if (point.maintenance_and_replacement_cost_yen > 0) {
      chartSeries.push({
        year: point.year - 0.12,
        cumulative_profit_yen: previousCumulative
          + point.electricity_savings_yen
          + point.sales_income_yen,
        isBeforeLifecycleCost: true
      });
    }
    chartSeries.push(point);
    previousCumulative = point.cumulative_profit_yen;
  }
  return chartSeries;
}

function renderCashflow(scenarios, selectedScenario) {
  const availableScenarios = scenarios.filter((scenario) => annualCashflowSeries(scenario).length);
  if (!availableScenarios.length) {
    elements.cashflowChart.replaceChildren();
    return;
  }

  const labels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  const width = 720;
  const height = 280;
  const padding = { top: 20, right: 24, bottom: 42, left: 76 };
  const values = availableScenarios.flatMap((scenario) => (
    chartCashflowSeries(scenario).map((point) => point.cumulative_profit_yen)
  ));
  const minimum = Math.min(0, ...values);
  const maximum = Math.max(0, ...values);
  const range = Math.max(maximum - minimum, 1);
  const x = (year) => padding.left + (year / 20) * (width - padding.left - padding.right);
  const y = (value) => padding.top + ((maximum - value) / range) * (height - padding.top - padding.bottom);
  const fragment = document.createDocumentFragment();

  for (const value of [...new Set([minimum, 0, maximum])]) {
    const line = createSvgElement("line", {
      x1: padding.left,
      x2: width - padding.right,
      y1: y(value),
      y2: y(value),
      class: value === 0 ? "cashflow-chart__zero" : "cashflow-chart__grid"
    });
    const label = createSvgElement("text", {
      x: padding.left - 12,
      y: y(value) + 6,
      "text-anchor": "end",
      class: "cashflow-chart__label"
    });
    label.textContent = formatCompactYen(value);
    fragment.append(line, label);
  }

  const selectedSeries = annualCashflowSeries(selectedScenario);
  const selectedChartSeries = chartCashflowSeries(selectedScenario);
  const selectedLinePoints = selectedChartSeries
    .map((point) => `${x(point.year)},${y(point.cumulative_profit_yen)}`)
    .join(" ");
  fragment.append(createSvgElement("polygon", {
    points: `${x(0)},${y(0)} ${selectedLinePoints} ${x(20)},${y(0)}`,
    class: `cashflow-chart__area cashflow-chart__area--${selectedScenario.scenario}`
  }));

  const orderedScenarios = [
    ...availableScenarios.filter((scenario) => scenario.scenario !== selectedScenario.scenario),
    selectedScenario
  ];
  for (const scenario of orderedScenarios) {
    const linePoints = chartCashflowSeries(scenario)
      .map((point) => `${x(point.year)},${y(point.cumulative_profit_yen)}`)
      .join(" ");
    fragment.append(createSvgElement("polyline", {
      points: linePoints,
      class: `cashflow-chart__line cashflow-chart__line--${scenario.scenario} ${scenario.scenario === selectedScenario.scenario ? "is-selected" : "is-muted"}`
    }));
  }

  for (const year of [0, 5, 10, 15, 20]) {
    const point = selectedSeries.find((item) => item.year === year);
    fragment.append(createSvgElement("circle", {
      cx: x(year),
      cy: y(point.cumulative_profit_yen),
      r: 5,
      class: "cashflow-chart__dot"
    }));
    const yearLabel = createSvgElement("text", {
      x: x(year),
      y: height - 12,
      "text-anchor": "middle",
      class: "cashflow-chart__label"
    });
    yearLabel.textContent = `${year}年`;
    fragment.append(yearLabel);
  }

  for (const point of selectedSeries.filter((item) => item.maintenance_and_replacement_cost_yen > 0)) {
    fragment.append(createSvgElement("circle", {
      cx: x(point.year),
      cy: y(point.cumulative_profit_yen),
      r: 4,
      class: "cashflow-chart__lifecycle-cost"
    }));
  }

  for (const scenario of availableScenarios) {
    const chartSeries = chartCashflowSeries(scenario);
    const intersections = zeroIntersections(chartSeries);
    const finalRecovery = paybackIntersection(chartSeries);
    if (!finalRecovery) continue;
    const selected = scenario.scenario === selectedScenario.scenario;
    const displayedIntersections = selected ? intersections : [finalRecovery];
    for (const intersection of displayedIntersections) {
      const isFinalRecovery = intersection.direction === "up"
        && Math.abs(intersection.year - finalRecovery.year) < 0.000001;
      const highlighted = selected && isFinalRecovery;
      fragment.append(createSvgElement("circle", {
        cx: x(intersection.year),
        cy: y(0),
        r: highlighted ? 9 : isFinalRecovery ? 5 : 4,
        class: `cashflow-chart__payback cashflow-chart__payback--${scenario.scenario} ${highlighted ? "is-selected" : "is-secondary"}`
      }));
    }
  }

  elements.cashflowChart.replaceChildren(fragment);
  for (const legendItem of document.querySelectorAll("[data-legend-scenario]")) {
    legendItem.classList.toggle(
      "is-selected",
      legendItem.dataset.legendScenario === selectedScenario.scenario
    );
  }
  elements.cashflowScenario.textContent = `${labels[selectedScenario.scenario]}シナリオを選択中`;
  renderInlineCashflowAmount(elements.cashflowEndpoint, "20年後 ", selectedScenario.profit_yen);
  const paybackDescriptions = availableScenarios.map((scenario) => (
    `${labels[scenario.scenario]}は${scenario.payback_year === null ? "20年以内の回収なし" : `約${scenario.payback_year}年で回収`}`
  ));
  elements.cashflowDescription.textContent = `3シナリオの累積損益を表示しています．4年ごとの定期点検費と15年目のパワーコンディショナー交換費による減少も反映しています．${paybackDescriptions.join("，")}．選択中の${labels[selectedScenario.scenario]}は20年後${formatProfit(selectedScenario.profit_yen)}です．`;
}

function renderResult(result, options = {}) {
  latestResult = result;
  const selectedScenario = result.scenarios.find(
    (scenario) => scenario.scenario === selectedScenarioId
  ) ?? result.scenarios.find((scenario) => scenario.scenario === "standard");
  if (!selectedScenario) {
    throw new Error("選択したシナリオの計算結果がありません．");
  }

  selectedScenarioId = selectedScenario.scenario;
  const orientation = result.input.detail_conditions?.find(
    (item) => item.input_name === "roof_orientation"
  );
  if (orientation) {
    elements.roofOrientation.value = orientation.value;
    elements.roofConditionSummary.textContent = `方角：${orientation.label}`;
  }
  const profitable = selectedScenario.profit_yen >= 0;
  if (profitable) {
    renderBrandOutcome(elements.resultSummary, `${result.input.prefecture_name}では，`, "トク", "になる見込みです", false);
  } else {
    elements.resultSummary.textContent = `${result.input.prefecture_name}では，損になる見込みです`;
  }
  const decisionAmount = decisionAmountParts(selectedScenario.profit_yen);
  renderBrandOutcome(elements.resultEconomicBenefit, decisionAmount.amount, decisionAmount.outcome);
  elements.resultEconomicBenefit.classList.toggle("result-amount--negative", !profitable);
  elements.lossGuidance.hidden = profitable;
  elements.resultPayback.textContent = selectedScenario.payback_year === null
    ? "現在の計算前提では，20年以内の回収は見込めません．"
    : selectedScenario.payback_year === 0
      ? "初期費用は補助金の範囲内です．"
      : `現在の計算前提では，約${selectedScenario.payback_year}年で回収する見込みです．`;
  const scenarioLabels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  renderInlineCashflowAmount(
    elements.resultPeriod,
    `${scenarioLabels[selectedScenario.scenario]}シナリオの20年間概算：`,
    selectedScenario.profit_yen
  );
  const netInitialOutlay = selectedScenario.net_initial_outlay_yen
    ?? selectedScenario.initial_cost_yen;
  const grossInstallationCost = selectedScenario.gross_installation_cost_yen
    ?? netInitialOutlay + selectedScenario.subsidy_yen;
  renderCashflowAmount(elements.resultGrossCost, grossInstallationCost, "cost");
  renderCashflowAmount(elements.resultInitialCost, netInitialOutlay, "cost");
  renderCashflowAmount(elements.resultSelfConsumption, selectedScenario.total_electricity_savings_yen, "income");
  renderCashflowAmount(elements.resultSalesIncome, selectedScenario.total_sales_income_yen, "income");
  const selectedSubsidyStatus = subsidyStatusFor(selectedScenario, result.input);
  if (selectedSubsidyStatus === "unverified") {
    elements.resultSubsidy.textContent = "未確認";
    elements.resultSubsidy.className = "cashflow-amount--neutral";
  } else {
    renderCashflowAmount(elements.resultSubsidy, selectedScenario.subsidy_yen, "income");
  }
  elements.resultSubsidyStatus.textContent = subsidyNoteFor(selectedScenario, result.input);
  const lifecycleCost = selectedScenario.total_maintenance_and_replacement_cost_yen;
  if (Number.isFinite(lifecycleCost)) {
    renderCashflowAmount(elements.resultLifecycleCost, lifecycleCost, "cost");
  } else {
    elements.resultLifecycleCost.textContent = "未確認";
    elements.resultLifecycleCost.className = "cashflow-amount--neutral";
  }
  elements.resultLifecycleStatus.textContent = selectedScenario.lifecycle_cost_status === "applied"
    ? `定期点検 ${formatYen(selectedScenario.total_maintenance_cost_yen)}・15年目の交換 ${formatYen(selectedScenario.total_replacement_cost_yen)}`
    : "維持・交換費は未確認です．";
  renderCashflowAmount(elements.resultProfit, selectedScenario.profit_yen);
  elements.resultGeneration.textContent = `${yenFormatter.format(result.energy.annual_generation_kwh)} kWh／年`;
  elements.resultConsumption.textContent = `${yenFormatter.format(result.energy.annual_consumption_kwh)} kWh／年`;
  elements.resultSelfConsumed.textContent = `${yenFormatter.format(result.energy.annual_self_consumed_kwh)} kWh／年`;
  const purchasedEnergy = result.energy.annual_purchased_kwh
    ?? Math.max(result.energy.annual_consumption_kwh - result.energy.annual_self_consumed_kwh, 0);
  elements.resultPurchased.textContent = `${yenFormatter.format(purchasedEnergy)} kWh／年`;
  elements.resultExported.textContent = `${yenFormatter.format(result.energy.annual_exported_kwh)} kWh／年`;
  elements.capacityOutput.textContent = formatCapacity(result.input.system_capacity_kw);
  elements.capacityGeneration.textContent = `${yenFormatter.format(result.energy.annual_generation_kwh)} kWh`;
  renderCashflowAmount(elements.capacityInitialCost, netInitialOutlay, "cost");
  renderCashflowAmount(elements.capacityProfit, selectedScenario.profit_yen);
  const subsidyScenario = result.scenarios.find((scenario) => scenario.scenario === "standard")
    ?? selectedScenario;
  const lifecycleStatus = subsidyScenario.lifecycle_cost_status === "applied"
    ? "4年ごとの点検費と15年目の交換費を反映しています．"
    : "維持・交換費は未確認です．";
  elements.capacityStatus.textContent = `${subsidyNoteFor(subsidyScenario, result.input)} ${lifecycleStatus}`;
  renderScenarios(result.scenarios, result.input);
  renderCashflow(result.scenarios, selectedScenario);
  collapseCalculator(result);
  if (options.resetDisclosures !== false) {
    for (const disclosure of elements.resultDisclosures) {
      disclosure.removeAttribute("open");
    }
  }
  elements.result.hidden = false;
  document.body.classList.add("has-analysis-result");
  if (options.scroll !== false) {
    elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
  }
  if (options.focus !== false) {
    elements.resultTitle.focus({ preventScroll: true });
  }
}

async function initialize() {
  try {
    frontendData = await loadFrontendData();
    populatePrefectures(frontendData.publicData.prefectures);
    populateRoofOrientations(frontendData.publicData.calculation.detail_inputs ?? []);
    elements.dataStatus.textContent = `公開データ版：${frontendData.metadata.data_version}`;

    const initialInput = inputFromLocation();
    const defaultCapacity = frontendData.publicData.calculation.system_capacity_kw;
    initialInput.systemCapacityKw = normalizeCapacity(initialInput.systemCapacityKw, defaultCapacity);
    elements.capacitySlider.value = String(initialInput.systemCapacityKw);
    if (initialInput.detailConditions?.roof_orientation) {
      elements.roofOrientation.value = initialInput.detailConditions.roof_orientation;
    }
    if (initialInput.prefectureCode) {
      elements.prefecture.value = initialInput.prefectureCode;
      elements.monthlyElectricityBill.value = initialInput.monthlyElectricityBillYen ?? "";
      renderResult(calculateEstimate(initialInput, frontendData.publicData));
    }
  } catch (error) {
    elements.dataStatus.textContent = error instanceof Error ? error.message : "公開データを確認できませんでした．";
  }

  updateAvailability();
}

elements.form.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!frontendData || !CALCULATION_IMPLEMENTED) {
    updateAvailability();
    return;
  }

  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData));
    writeInputToLocation(input);
    elements.formMessage.textContent = "条件を変更して再計算できます．";
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "計算できませんでした．";
  }
});

elements.changeConditionsButton.addEventListener("click", expandCalculator);
elements.cancelConditionsButton.addEventListener("click", cancelConditionChanges);

elements.scenarioList.addEventListener("click", (event) => {
  const scenarioButton = event.target.closest("[data-scenario]");
  if (!scenarioButton || !latestResult) {
    return;
  }
  selectedScenarioId = scenarioButton.dataset.scenario;
  renderResult(latestResult, {
    focus: false,
    resetDisclosures: false,
    scroll: false
  });
});

elements.capacitySlider.addEventListener("input", () => {
  elements.capacityOutput.textContent = formatCapacity(elements.capacitySlider.value);
  if (!frontendData || elements.result.hidden) {
    return;
  }

  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
  } catch (error) {
    elements.capacityStatus.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

elements.roofOrientation.addEventListener("change", () => {
  const selectedLabel = elements.roofOrientation.selectedOptions[0]?.textContent ?? "南向き";
  elements.roofConditionSummary.textContent = `方角：${selectedLabel}`;
  if (!frontendData || elements.result.hidden) return;
  try {
    const input = readInput();
    renderResult(calculateEstimate(input, frontendData.publicData), {
      focus: false,
      resetDisclosures: false,
      scroll: false
    });
    writeInputToLocation(input);
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "再計算できませんでした．";
  }
});

initialize();
