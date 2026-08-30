import { CALCULATION_IMPLEMENTED, calculateEstimate } from "./calculator.js";
import { loadFrontendData } from "../../../data/src/data-loader.js";

const elements = {
  form: document.querySelector("#estimate-form"),
  prefecture: document.querySelector("#prefecture"),
  monthlyElectricityBill: document.querySelector("#monthly-electricity-bill"),
  calculateButton: document.querySelector("#calculate-button"),
  formMessage: document.querySelector("#form-message"),
  dataStatus: document.querySelector("#data-status"),
  result: document.querySelector("#estimate-result"),
  resultSummary: document.querySelector("[data-result-summary]"),
  resultEconomicBenefit: document.querySelector("[data-result-economic-benefit]"),
  resultInitialCost: document.querySelector("[data-result-initial-cost]"),
  resultAnnualBenefit: document.querySelector("[data-result-annual-benefit]"),
  resultSelfConsumption: document.querySelector("[data-result-self-consumption]"),
  resultSalesIncome: document.querySelector("[data-result-sales-income]"),
  resultSubsidy: document.querySelector("[data-result-subsidy]"),
  resultGeneration: document.querySelector("[data-result-generation]"),
  scenarioList: document.querySelector("[data-scenario-list]"),
  assumptions: document.querySelector("[data-result-assumptions]")
};

let frontendData = null;

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
    monthlyElectricityBillYen: monthlyElectricityBill === "" ? null : Number(monthlyElectricityBill)
  };
}

const yenFormatter = new Intl.NumberFormat("ja-JP");

function formatYen(value) {
  return `${yenFormatter.format(value)}円`;
}

function formatProfit(value) {
  return `${value > 0 ? "+" : ""}${yenFormatter.format(value)}円`;
}

function renderScenarios(scenarios) {
  const labels = { downside: "下振れ", standard: "標準", upside: "上振れ" };
  elements.scenarioList.replaceChildren();
  for (const scenario of scenarios) {
    const item = document.createElement("div");
    item.className = `scenario-card scenario-card--${scenario.scenario}`;
    const label = document.createElement("span");
    label.className = "scenario-card__label";
    label.textContent = labels[scenario.scenario];
    const amount = document.createElement("strong");
    amount.className = "scenario-card__amount";
    amount.textContent = formatProfit(scenario.profit_yen);
    item.append(label, amount);
    elements.scenarioList.append(item);
  }
}

function renderResult(result) {
  const standard = result.scenarios.find((scenario) => scenario.scenario === "standard");
  if (!standard) {
    throw new Error("標準シナリオの計算結果がありません．");
  }

  const profitable = standard.profit_yen >= 0;
  elements.resultSummary.textContent = profitable
    ? `${result.input.prefecture_name}では，得になる概算です`
    : `${result.input.prefecture_name}では，損になる概算です`;
  elements.resultEconomicBenefit.textContent = formatProfit(standard.profit_yen);
  elements.resultEconomicBenefit.classList.toggle("result-amount--negative", !profitable);
  elements.resultInitialCost.textContent = formatYen(standard.initial_cost_yen);
  elements.resultAnnualBenefit.textContent = formatYen(standard.first_year_economic_benefit_yen);
  elements.resultSelfConsumption.textContent = formatYen(standard.total_electricity_savings_yen);
  elements.resultSalesIncome.textContent = formatYen(standard.total_sales_income_yen);
  elements.resultSubsidy.textContent = formatYen(standard.subsidy_yen);
  elements.resultGeneration.textContent = `${yenFormatter.format(result.energy.annual_generation_kwh)} kWh／年`;
  elements.assumptions.textContent = result.input.used_default_monthly_electricity_bill
    ? `月間電気料金は地域平均の${formatYen(result.input.monthly_electricity_bill_yen)}を使用しています．`
    : `入力された月間電気料金${formatYen(result.input.monthly_electricity_bill_yen)}を使用しています．`;
  renderScenarios(result.scenarios);
  elements.result.hidden = false;
  elements.result.scrollIntoView({ behavior: "smooth", block: "start" });
}

async function initialize() {
  try {
    frontendData = await loadFrontendData();
    populatePrefectures(frontendData.publicData.prefectures);
    elements.dataStatus.textContent = `公開データ版：${frontendData.metadata.data_version}`;
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
    renderResult(calculateEstimate(readInput(), frontendData.publicData));
    elements.formMessage.textContent = "条件を変更して再計算できます．";
  } catch (error) {
    elements.formMessage.textContent = error instanceof Error ? error.message : "計算できませんでした．";
  }
});

initialize();
